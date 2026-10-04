/**
 * Calificaciones con estrellas de los cursos (votos propios del sitio, estilo kk Star Ratings).
 * Módulo compartido por la Pages Function (functions/api/ratings.ts), el build de Astro y el
 * script del widget: sin imports de Astro ni de Node.
 */

/** Cursos históricos para la respuesta vacía; el CMS valida también los cursos nuevos. */
export const RATEABLE_COURSES = [
  'curso-de-globoflexia',
  'curso-de-bouquets-de-globos',
  'curso-de-flores-con-globos',
  'curso-de-globos-burbuja',
] as const;

export type RateableCourse = string;

export const isRateableCourse = (value: unknown): value is RateableCourse =>
  typeof value === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 200;

export interface CourseRating {
  /** Media con 2 decimales (0 si no hay votos). */
  average: number;
  count: number;
  /** Votos por nota: [1★, 2★, 3★, 4★, 5★]. */
  distribution: [number, number, number, number, number];
}

export type RatingsByCourse = Record<RateableCourse, CourseRating>;

/** Respuesta de GET /api/ratings. */
export interface RatingsPayload {
  courses: RatingsByCourse;
  generatedAt: string;
}

/** Respuesta de POST /api/ratings: el agregado del curso más el voto recién guardado. */
export interface VoteResponse extends CourseRating {
  course: RateableCourse;
  yours: number;
}

/**
 * Votos mínimos para publicar `aggregateRating` en el JSON-LD y las estrellas en las
 * tarjetas. Google no fija un mínimo; con 1 voto ya es un dato real y visible en la página.
 */
export const MIN_VOTES_FOR_SCHEMA = 1;

export const STAR_LABELS = ['Malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente'] as const;

export const emptyRating = (): CourseRating => ({ average: 0, count: 0, distribution: [0, 0, 0, 0, 0] });

export const emptyRatings = (): RatingsByCourse =>
  Object.fromEntries(RATEABLE_COURSES.map((c) => [c, emptyRating()])) as RatingsByCourse;

/** Porción rellena (0-1) de la estrella `n` (1-5) para una media dada. */
export const starFill = (average: number, n: number): number => Math.min(1, Math.max(0, average - (n - 1)));

const oneDecimal = new Intl.NumberFormat('es', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** 4.567 → «4,6» (formato español). */
export const formatAverage = (average: number): string => oneDecimal.format(average);

export const votesLabel = (count: number): string => `${count} ${count === 1 ? 'voto' : 'votos'}`;

/** Valida un agregado que llega de la red (API o snapshot) antes de pintarlo o publicarlo. */
export function parseCourseRating(value: unknown): CourseRating | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const { average, count, distribution } = value as Record<string, unknown>;
  if (typeof average !== 'number' || !Number.isFinite(average) || typeof count !== 'number') return undefined;
  if (!Number.isInteger(count) || count < 0 || average < 0 || average > 5) return undefined;
  if (count > 0 && average < 1) return undefined;
  if (!Array.isArray(distribution) || distribution.length !== 5) return undefined;
  if (!distribution.every((n) => Number.isInteger(n) && n >= 0)) return undefined;
  if (distribution.reduce((a: number, b: number) => a + b, 0) !== count) return undefined;
  return { average, count, distribution: distribution as CourseRating['distribution'] };
}

/** Blog ratings use immutable CMS IDs, so changing the article slug preserves its votes. */
export type RatingKind = 'courses' | 'blog';
export const isRateablePost = (value: unknown): value is string =>
  typeof value === 'string' && /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/.test(value);
export const ratingApiPath = (kind: RatingKind) => kind === 'blog' ? '/api/blog-ratings' : '/api/ratings';
export const ratingStorageKey = (kind: RatingKind, id: string) => kind === 'blog' ? `blog:${id}` : id;
