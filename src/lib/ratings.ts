/**
 * Calificaciones con estrellas en el build. El HTML y el JSON-LD (`aggregateRating`) salen de
 * la API de producción (/api/ratings → D1), así lo que ve Google coincide con lo visible.
 *
 * Si la API no responde se usa el último snapshot publicado (/ratings-snapshot.json, estático)
 * para no quitar estrellas por un fallo pasajero; si tampoco hay snapshot, se compila sin
 * estrellas en vez de romper el deploy. Con RATINGS_REQUIRED=1 (recompilación diaria,
 * .github/workflows/ratings-refresh.yml) el build falla en ese caso.
 *
 * RATINGS_API_URL cambia la fuente (p. ej. `http://localhost:8788/api/ratings` con
 * `wrangler pages dev`) y `RATINGS_API_URL=off` compila sin consultar la red.
 */
import {
  RATEABLE_COURSES,
  emptyRating,
  emptyRatings,
  isRateableCourse,
  parseCourseRating,
  type CourseRating,
  type RatingsByCourse,
} from './ratings-config';

const DEFAULT_API = 'https://cursodeglobosonline.com/api/ratings';
const PUBLISHED_SNAPSHOT = 'https://cursodeglobosonline.com/ratings-snapshot.json';
const ATTEMPTS = 3;

let pending: Promise<RatingsByCourse> | undefined;

/** Agregados de todos los cursos (una sola petición por build). */
export function getCourseRatings(): Promise<RatingsByCourse> {
  pending ??= load();
  return pending;
}

export async function getCourseRating(slug: string): Promise<CourseRating> {
  assertRateable(slug);
  return (await getCourseRatings())[slug as keyof RatingsByCourse] ?? emptyRating();
}

/** Un curso nuevo sin registrar en RATEABLE_COURSES recibiría 400 al votar: se corta el build. */
export function assertRateable(slug: string): void {
  if (!isRateableCourse(slug)) {
    throw new Error(`[ratings] Añade «${slug}» a RATEABLE_COURSES en src/lib/ratings-config.ts`);
  }
}

async function load(): Promise<RatingsByCourse> {
  const api = process.env.RATINGS_API_URL ?? DEFAULT_API;
  if (api === 'off') return emptyRatings();
  // El snapshot publicado solo sirve de respaldo de la API de producción.
  const sources = api === DEFAULT_API ? [api, PUBLISHED_SNAPSHOT] : [api];
  for (const url of sources) {
    const ratings = await fetchRatings(url);
    if (!ratings) continue;
    if (url !== api) console.warn(`[ratings] ${api} no respondió: se usa el snapshot publicado.`);
    return ratings;
  }
  const message = `[ratings] sin datos de ${sources.join(' ni de ')}`;
  if (process.env.RATINGS_REQUIRED === '1') throw new Error(`${message} (RATINGS_REQUIRED=1).`);
  console.warn(`${message}: build sin estrellas.`);
  return emptyRatings();
}

async function fetchRatings(url: string): Promise<RatingsByCourse | undefined> {
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(10_000) });
      // 4xx (p. ej. el primer build, antes de que exista la API): no tiene sentido reintentar.
      if (res.status >= 400 && res.status < 500) {
        console.warn(`[ratings] ${url}: HTTP ${res.status}`);
        return undefined;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json()) as { courses?: Record<string, unknown> };
      if (!body.courses) throw new Error('respuesta sin `courses`');
      const ratings = emptyRatings();
      for (const slug of RATEABLE_COURSES) {
        const parsed = parseCourseRating(body.courses[slug]);
        if (parsed) ratings[slug] = parsed;
      }
      return ratings;
    } catch (err) {
      if (attempt === ATTEMPTS) {
        console.warn(`[ratings] ${url}: ${(err as Error).message}`);
        return undefined;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
  return undefined;
}
