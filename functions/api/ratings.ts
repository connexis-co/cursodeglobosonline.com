/**
 * API de calificaciones con estrellas (1-5) de los cursos, estilo kk Star Ratings.
 *
 *   GET  /api/ratings → media, conteo y distribución de los cursos (caché de borde 60 s).
 *   POST /api/ratings   {course, rating, voter} → guarda o actualiza el voto y devuelve el
 *                       agregado del curso.
 *
 * Anti-abuso: solo peticiones del mismo origen; un voto por navegador y curso (`voter` es
 * un UUID aleatorio del localStorage, guardado como HMAC) y como máximo MAX_VOTERS_PER_IP
 * votantes distintos por IP y curso (familias y el CGNAT de las redes móviles comparten
 * IP). La IP nunca se guarda en claro: HMAC-SHA256 con el secreto RATING_SALT.
 */
import {
  emptyRatings,
  isRateableCourse,
  type RateableCourse,
  type RatingsByCourse,
  type RatingsPayload,
  type VoteResponse,
} from '../../src/lib/ratings-config';

interface Env {
  DB?: D1Database;
  RATING_SALT?: string;
}

const MAX_VOTERS_PER_IP = 3;
const MAX_BODY_BYTES = 512;
const UUID_V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
      ...headers,
    },
  });

/** Clave de caché única para el GET (ignora la query: `?_=` no debe saltarse la caché). */
const cacheKey = (request: Request) => new Request(new URL('/api/ratings', request.url).href);

const AGGREGATE_SQL = `SELECT course, COUNT(*) AS count, ROUND(AVG(rating), 2) AS average,
  SUM(rating = 1) AS r1, SUM(rating = 2) AS r2, SUM(rating = 3) AS r3, SUM(rating = 4) AS r4, SUM(rating = 5) AS r5
  FROM course_votes`;

interface AggregateRow {
  course: string;
  count: number;
  average: number;
  r1: number;
  r2: number;
  r3: number;
  r4: number;
  r5: number;
}

async function aggregates(db: D1Database, course?: RateableCourse): Promise<RatingsByCourse> {
  const stmt = course
    ? db.prepare(`${AGGREGATE_SQL} WHERE course = ?1 GROUP BY course`).bind(course)
    : db.prepare(`${AGGREGATE_SQL} GROUP BY course`);
  const { results } = await stmt.all<AggregateRow>();
  const out = emptyRatings();
  for (const r of results) {
    if (!isRateableCourse(r.course)) continue;
    out[r.course] = { average: r.average, count: r.count, distribution: [r.r1, r.r2, r.r3, r.r4, r.r5] };
  }
  return out;
}

const encoder = new TextEncoder();

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ]);
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return [...new Uint8Array(signature)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** IPv4 tal cual; IPv6 → prefijo /64 (las extensiones de privacidad rotan los 64 bits bajos). */
function ipKey(ip: string): string {
  if (!ip.includes(':')) return ip;
  if (ip.includes('.')) return ip.slice(ip.lastIndexOf(':') + 1); // ::ffff:1.2.3.4
  const [head = '', tail = ''] = ip.toLowerCase().split('::');
  const left = head ? head.split(':') : [];
  const right = tail ? tail.split(':') : [];
  const groups = [...left, ...Array<string>(Math.max(0, 8 - left.length - right.length)).fill('0'), ...right];
  return `${groups
    .slice(0, 4)
    .map((g) => g.padStart(4, '0'))
    .join(':')}::/64`;
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  if (!env.DB) return json({ error: 'unavailable' }, 503);
  const cache = caches.default;
  const key = cacheKey(request);
  const hit = await cache.match(key);
  if (hit) return hit;
  try {
    const payload: RatingsPayload = { courses: await aggregates(env.DB), generatedAt: new Date().toISOString() };
    const response = json(payload, 200, { 'Cache-Control': 'public, max-age=60' });
    waitUntil(cache.put(key, response.clone()));
    return response;
  } catch (err) {
    console.error('ratings GET', err);
    return json({ error: 'unavailable' }, 503);
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env, waitUntil }) => {
  if (!env.DB || !env.RATING_SALT) return json({ error: 'unavailable' }, 503);

  // Mismo origen: el widget vota con fetch desde el propio sitio (o su preview).
  const origin = request.headers.get('Origin');
  if (!origin || origin !== new URL(request.url).origin) return json({ error: 'forbidden' }, 403);
  if (!request.headers.get('Content-Type')?.includes('application/json')) {
    return json({ error: 'unsupported_media_type' }, 415);
  }

  // En bytes, no en caracteres: «ñ» ocupa 2 bytes y un emoji 4.
  if (Number(request.headers.get('Content-Length') ?? 0) > MAX_BODY_BYTES) {
    return json({ error: 'payload_too_large' }, 413);
  }
  const bytes = await request.arrayBuffer();
  if (bytes.byteLength > MAX_BODY_BYTES) return json({ error: 'payload_too_large' }, 413);
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!parsed || typeof parsed !== 'object') throw new Error('not an object');
    body = parsed as Record<string, unknown>;
  } catch {
    return json({ error: 'bad_json' }, 400);
  }

  const { course, rating, voter } = body;
  if (!isRateableCourse(course)) return json({ error: 'unknown_course' }, 400);
  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return json({ error: 'bad_rating' }, 400);
  }
  if (typeof voter !== 'string' || !UUID_V4.test(voter)) return json({ error: 'bad_voter' }, 400);

  const ip = request.headers.get('CF-Connecting-IP') ?? '0.0.0.0';
  const [voterHash, ipHash] = await Promise.all([
    hmac(env.RATING_SALT, `voter:${voter.toLowerCase()}`),
    hmac(env.RATING_SALT, `ip:${ipKey(ip)}`),
  ]);
  const country = (request.cf as IncomingRequestCfProperties | undefined)?.country ?? null;

  try {
    // Inserta si el votante ya existe (actualiza su nota) o si su IP no llegó al tope.
    // El WHERE hace de guarda en la misma sentencia: sin carreras entre lectura y escritura.
    const result = await env.DB.prepare(
      `INSERT INTO course_votes (course, voter, ip_hash, rating, country)
       SELECT ?1, ?2, ?3, ?4, ?5
       WHERE EXISTS (SELECT 1 FROM course_votes WHERE course = ?1 AND voter = ?2)
          OR (SELECT COUNT(*) FROM course_votes WHERE course = ?1 AND ip_hash = ?3) < ?6
       ON CONFLICT (course, voter) DO UPDATE SET
         rating = excluded.rating,
         ip_hash = excluded.ip_hash,
         country = excluded.country,
         updated_at = strftime('%Y-%m-%dT%H:%M:%SZ', 'now')`,
    )
      .bind(course, voterHash, ipHash, rating, country, MAX_VOTERS_PER_IP)
      .run();
    if (result.meta.changes === 0) return json({ error: 'ip_limit' }, 429);

    const summary = (await aggregates(env.DB, course))[course];
    waitUntil(caches.default.delete(cacheKey(request)));
    const response: VoteResponse = { course, ...summary, yours: rating };
    return json(response);
  } catch (err) {
    console.error('ratings POST', err);
    return json({ error: 'unavailable' }, 503);
  }
};
