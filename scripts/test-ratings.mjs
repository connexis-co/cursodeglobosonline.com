// Prueba de humo de /api/ratings (functions/api/ratings.ts) contra un servidor con base limpia:
// `wrangler pages dev` con D1 local (CI) o un deploy de preview. Deja votos de prueba, así que
// se niega a correr contra producción.
//
// Uso: node scripts/test-ratings.mjs [http://localhost:8788]
import { randomUUID } from 'node:crypto';

const base = (process.argv[2] ?? 'http://localhost:8788').replace(/\/$/, '');
if (/^https:\/\/(www\.)?cursodeglobosonline\.com$/.test(base)) {
  console.error('Esta prueba escribe votos: úsala en local o en un preview, nunca en producción.');
  process.exit(2);
}

const API = `${base}/api/ratings`;
const ORIGIN = new URL(base).origin;
const COURSE = 'curso-de-flores-con-globos';
const MAX_VOTERS_PER_IP = 3;
let failures = 0;

function check(name, ok, detail = '') {
  console.log(`${ok ? '✓' : '✗'} ${name}${!ok && detail ? ` — ${detail}` : ''}`);
  if (!ok) failures++;
}

const post = (body, headers = {}) =>
  fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: ORIGIN, ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });

const vote = (voter, rating, course = COURSE) => post({ course, rating, voter });

const consistent = (r) =>
  r.distribution.reduce((a, b) => a + b, 0) === r.count &&
  (r.count === 0 ||
    Math.abs(r.distribution.reduce((acc, n, i) => acc + n * (i + 1), 0) / r.count - r.average) < 0.006);

// 1. Lectura
const getRes = await fetch(API);
const initial = await getRes.json();
check('GET → 200', getRes.status === 200, `HTTP ${getRes.status}`);
check('GET → los 4 cursos', Object.keys(initial.courses ?? {}).length === 4, JSON.stringify(initial));
check('GET → agregados coherentes', Object.values(initial.courses ?? {}).every(consistent));
check('GET → noindex', getRes.headers.get('x-robots-tag') === 'noindex');
const before = initial.courses?.[COURSE]?.count ?? 0;

// 2. Validación
const noOrigin = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
check('POST sin Origin → 403', noOrigin.status === 403, `HTTP ${noOrigin.status}`);
check('POST de otro origen → 403', (await post({}, { Origin: 'https://ejemplo.com' })).status === 403);
check('POST sin JSON → 415', (await post('course=x', { 'Content-Type': 'text/plain' })).status === 415);
check('POST con JSON roto → 400', (await post('{"course":')).status === 400);
check('POST demasiado grande → 413', (await post({ pad: 'x'.repeat(600) })).status === 413);
check('curso inexistente → 400', (await vote(randomUUID(), 5, 'curso-de-nada')).status === 400);
for (const bad of [0, 6, 4.5, '5', null]) {
  check(`nota ${JSON.stringify(bad)} → 400`, (await vote(randomUUID(), bad)).status === 400);
}
check('votante que no es UUID v4 → 400', (await vote('abc', 5)).status === 400);
check('ningún voto inválido se guardó', (await (await fetch(API)).json()).courses[COURSE].count === before);

// 3. Voto, actualización y tope por IP
const alice = randomUUID();
const first = await vote(alice, 5);
const firstBody = await first.json();
if (first.status === 429) {
  console.error('La IP ya está en el tope para este curso: corre la prueba con una base limpia.');
  process.exit(1);
}
check('voto nuevo → 200', first.status === 200, `HTTP ${first.status} ${JSON.stringify(firstBody)}`);
check('voto nuevo suma 1', firstBody.count === before + 1, JSON.stringify(firstBody));
check('respuesta con tu voto', firstBody.yours === 5 && firstBody.course === COURSE);
check('agregado coherente', consistent(firstBody));

const changed = await (await vote(alice, 2)).json();
check('mismo navegador actualiza sin sumar', changed.count === firstBody.count && changed.yours === 2, JSON.stringify(changed));
check('la distribución refleja el cambio', changed.distribution[1] === firstBody.distribution[1] + 1);

let accepted = 1;
let limited;
for (let i = 0; i < MAX_VOTERS_PER_IP + 1; i++) {
  const res = await vote(randomUUID(), 4);
  if (res.status === 429) {
    limited = res;
    break;
  }
  accepted++;
}
check(`tope de ${MAX_VOTERS_PER_IP} votantes por IP y curso`, accepted === MAX_VOTERS_PER_IP && limited?.status === 429, `aceptados ${accepted}`);
check('con la IP en el tope, un votante existente aún puede cambiar su nota', (await vote(alice, 3)).status === 200);
check('el tope es por curso', (await vote(randomUUID(), 5, 'curso-de-globoflexia')).status === 200);

// 4. La lectura refleja los votos (la caché de 60 s se invalida al votar).
let fresh;
for (let i = 0; i < 5; i++) {
  fresh = (await (await fetch(API)).json()).courses[COURSE];
  if (fresh.count === before + MAX_VOTERS_PER_IP) break;
  await new Promise((r) => setTimeout(r, 500));
}
check('GET refleja los votos nuevos', fresh.count === before + MAX_VOTERS_PER_IP, JSON.stringify(fresh));

console.log(failures ? `\n${failures} comprobaciones fallaron` : '\nTodo OK');
process.exit(failures ? 1 : 0);
