/**
 * Calificaciones con estrellas en el build. El HTML y el JSON-LD (`aggregateRating`) salen de
 * la API de producción (/api/ratings → D1), así lo que ve Google coincide con lo visible.
 * Si la API no responde, se compila sin estrellas en vez de romper el deploy; la
 * recompilación diaria (.github/workflows/ratings-refresh.yml) las pone al día.
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
  const url = process.env.RATINGS_API_URL ?? DEFAULT_API;
  if (url === 'off') return emptyRatings();
  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, { headers: { accept: 'application/json' }, signal: AbortSignal.timeout(10_000) });
      // 4xx (p. ej. el primer build, antes de que exista la API): no tiene sentido reintentar.
      if (res.status >= 400 && res.status < 500) throw Object.assign(new Error(`HTTP ${res.status}`), { final: true });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = (await res.json()) as { courses?: Record<string, unknown> };
      const ratings = emptyRatings();
      for (const slug of RATEABLE_COURSES) {
        const parsed = parseCourseRating(body.courses?.[slug]);
        if (parsed) ratings[slug] = parsed;
      }
      return ratings;
    } catch (err) {
      const final = attempt === ATTEMPTS || (err as { final?: boolean }).final;
      if (final) {
        console.warn(`[ratings] ${url} no respondió (${(err as Error).message}): build sin estrellas.`);
        return emptyRatings();
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
  return emptyRatings();
}
