/**
 * Aplica la campaña vigente a los cursos que lee el sitio.
 *
 * Se hace en la capa de datos y no en cada plantilla para que tarjeta, ficha, menú, tabla de
 * precios, datos estructurados y enlace de pago salgan siempre del mismo sitio. Precio y enlace
 * viajan en el mismo objeto: no puede aparecer un precio rebajado junto a un enlace sin cupón.
 *
 * El país y la clave `?promo=` dependen de la URL que se está pintando. El middleware la guarda
 * aquí al empezar la petición; si por lo que sea no está, solo cuentan las campañas sin país ni
 * clave, que es el caso seguro.
 */
import { AsyncLocalStorage } from 'node:async_hooks';
import {
  parsePromotion,
  promotedPrice,
  resolvePromotion,
  type AppliedPromotion,
  type Promotion,
  type PromotionScope,
} from '../plugins/globos-promotions/model';

const requestUrl = new AsyncLocalStorage<URL>();

/** Ejecuta `run` sabiendo qué URL se está sirviendo. Lo llama el middleware una vez por petición. */
export function withRequestUrl<T>(url: URL, run: () => T): T {
  return requestUrl.run(url, run);
}

/** País, curso y clave de campaña que se deducen de una ruta pública. */
export function scopeFromUrl(url: URL | undefined): PromotionScope {
  if (!url) return {};
  const parts = url.pathname.split('/').filter(Boolean);
  return {
    country: /^[a-z]{2}$/.test(parts[0] ?? '') ? parts[0] : undefined,
    course: parts.find((part) => part.startsWith('curso-')),
    key: url.searchParams.get('promo') ?? '',
  };
}

export const currentScope = (): PromotionScope => scopeFromUrl(requestUrl.getStore());

/** Campañas publicadas y verificadas, a partir de las filas del CMS con claves en camelCase. */
export function verifiedPromotions(rows: { id: string; data: Record<string, unknown> }[]): Promotion[] {
  return rows.map((row) => parsePromotion(row.data, row.id)).filter((promo) => promo.offerVerified);
}

interface PromotableCourse {
  priceUSD?: number;
  originalPriceUSD?: number;
  discountPct?: number;
  hotmartUrl: string;
  promo?: AppliedPromotion;
}

/** Cambia en el propio objeto el precio, el tachado, el porcentaje y el enlace de un curso. */
export function promoteCourse(
  course: PromotableCourse,
  slug: string,
  promos: Promotion[],
  scope: PromotionScope,
  now = Date.now(),
): void {
  const promo = resolvePromotion(promos, { ...scope, course: slug }, now);
  if (!promo) return;
  const result = promotedPrice(course, promo);
  if (result) Object.assign(course, result);
}

/**
 * La campaña que se anuncia en la barra de una página: la del curso de la ruta o, en páginas sin
 * curso, la que rebaja más cursos. Sin ningún curso rebajado no hay barra.
 */
export function announcedPromotion<C extends { id: string; data: { promo?: AppliedPromotion } }>(
  courses: C[],
  scope: PromotionScope,
): { promo: AppliedPromotion; courses: C[] } | undefined {
  const pool = scope.course ? courses.filter((course) => course.id === scope.course) : courses;
  const groups = new Map<string, C[]>();
  for (const course of pool) {
    const id = course.data.promo?.id;
    if (id) groups.set(id, [...(groups.get(id) ?? []), course]);
  }
  const winner = [...groups.values()].sort((a, b) => b.length - a.length)[0];
  return winner ? { promo: winner[0]!.data.promo!, courses: winner } : undefined;
}
