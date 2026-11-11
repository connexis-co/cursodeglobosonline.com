/**
 * Promociones del sitio.
 *
 * Tres reglas, tomadas de cómo funciona sably.co y de por qué funciona:
 *
 * 1. Una campaña solo existe dentro de su ventana [startsAt, endsAt) y solo si está publicada
 *    y marcada como verificada en Hotmart. Fuera de la ventana el sitio no promete nada.
 * 2. Si la campaña baja el precio de un curso, es la dueña de ese descuento: el precio rebajado,
 *    el cupón del enlace y la cuenta atrás salen de ella, y al terminar la ventana el precio sube
 *    de verdad. Por eso el reloj es verdad.
 * 3. Si la ficha ya cobra ese precio sin la campaña (descuento fijo), la campaña solo pone su
 *    nombre: barra y etiqueta, sin reloj ni fecha de fin, porque al terminar el precio no cambia.
 *    Un reloj que al llegar a cero no cambia nada es lo que hace que nadie crea el siguiente.
 */

export const HOTMART_HOSTS = ['hotm.art', 'hotm.io', 'go.hotmart.com', 'pay.hotmart.com', 'hotmart.com'];

export interface Promotion {
  offerVerified?: boolean;
  id: string;
  /** Nombre interno de la campaña en el panel. */
  title?: string;
  /** Nombre que ve el visitante: «Black Friday», «Navidad». */
  label?: string;
  headline: string;
  startsAt: string;
  endsAt: string;
  priority: number;
  /** Si existe, la campaña solo se activa con `?promo=<urlKey>` (tráfico de anuncios). */
  urlKey?: string;
  countries: string[];
  courses: string[];
  excludedCourses: string[];
  coupon?: string;
  discountPct?: number;
  checkoutUrl?: string;
  buttonLabel?: string;
  theme?: string;
}

/** Dónde se evalúa una campaña. Sin `course` vale para cualquier curso (portada, catálogo, blog). */
export interface PromotionScope {
  country?: string;
  course?: string;
  key?: string;
}

const text = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');
const iso = (value: unknown): string =>
  value instanceof Date ? value.toISOString() : typeof value === 'string' ? value : '';
const list = (value: unknown): string[] =>
  Array.isArray(value)
    ? value
        .map((item) => (typeof item === 'string' ? item : text((item as Record<string, unknown> | null)?.text)))
        .filter(Boolean)
    : [];

/** «Black Friday 2026» → «Black Friday»: el año es para el calendario, no para el visitante. */
const withoutYear = (value: string): string => value.replace(/\s*\b20\d\d\b\s*/g, ' ').trim();

/** Convierte una fila del CMS (claves ya en camelCase) en una campaña. D1 guarda los booleanos como 0/1. */
export function parsePromotion(row: Record<string, unknown>, id: string): Promotion {
  const pct = Number(row.discountPct);
  const title = text(row.title);
  return {
    offerVerified: row.offerVerified === true || row.offerVerified === 1,
    id: text(row.slug) || id,
    title,
    label: text(row.label) || withoutYear(title),
    headline: text(row.headline),
    startsAt: iso(row.startsAt),
    endsAt: iso(row.endsAt),
    priority: Number(row.priority) || 0,
    urlKey: text(row.urlKey),
    countries: list(row.countries),
    courses: list(row.courses),
    excludedCourses: list(row.excludedCourses),
    coupon: text(row.coupon),
    discountPct: Number.isFinite(pct) && pct > 0 && pct < 100 ? pct : undefined,
    checkoutUrl: text(row.checkoutUrl),
    buttonLabel: text(row.buttonLabel),
    theme: text(row.theme),
  };
}

function inWindow(p: Promotion, now: number): boolean {
  const start = Date.parse(p.startsAt);
  const end = Date.parse(p.endsAt);
  return Number.isFinite(start) && Number.isFinite(end) && start <= now && now < end;
}

function inScope(p: Promotion, scope: PromotionScope): boolean {
  if (p.urlKey && p.urlKey !== (scope.key ?? '')) return false;
  // Una campaña de un país no se enseña donde no se sabe el país (portada, blog).
  if (p.countries.length && !(scope.country && p.countries.includes(scope.country))) return false;
  if (scope.course === undefined) return true;
  if (p.excludedCourses.includes(scope.course)) return false;
  return !p.courses.length || p.courses.includes(scope.course);
}

/** La campaña vigente de mayor prioridad para ese país, curso y clave de URL, o `undefined`. */
export function resolvePromotion(
  promos: Promotion[],
  scope: PromotionScope,
  now = Date.now(),
): Promotion | undefined {
  return promos
    .filter((p) => p.offerVerified === true && inWindow(p, now) && inScope(p, scope))
    .sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id))[0];
}

/**
 * Precio con el porcentaje aplicado, en céntimos enteros para no heredar el error del coma
 * flotante (59,99 × 0,5 da 29,994999… y redondearía a 29,99; Hotmart cobra 30,00).
 */
export function discountedPrice(listPrice: number, pct: number): number {
  return Math.round((Math.round(listPrice * 100) * (100 - pct)) / 100) / 100;
}

export function isHotmartUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && HOTMART_HOSTS.includes(url.hostname);
  } catch {
    return false;
  }
}

/** Enlace de pago de la campaña: conserva el `ref` de afiliado y añade el cupón. */
export function checkoutFor(p: Promotion, base: string): string {
  const target = p.checkoutUrl || base;
  if (!isHotmartUrl(target)) throw Error('Invalid promotional checkout');
  const url = new URL(target);
  if (p.coupon) url.searchParams.set('offDiscount', p.coupon);
  return url.href;
}

export interface CoursePrice {
  priceUSD?: number;
  originalPriceUSD?: number;
  discountPct?: number;
  hotmartUrl: string;
}

/** Lo que la ficha necesita saber de la campaña que le bajó el precio. */
export interface AppliedPromotion {
  id: string;
  label: string;
  headline: string;
  endsAt: string;
  theme: string;
  discountPct: number;
  /** Texto del botón de la barra en páginas que no son una ficha. */
  buttonLabel: string;
  /** El precio sube cuando la campaña termina. Solo entonces se enseña la cuenta atrás. */
  deadline: boolean;
}

/**
 * Precio y enlace de un curso con la campaña aplicada, o `undefined` si la campaña no le toca.
 *
 * Si la ficha ya cobra exactamente ese precio de base, se devuelve tal cual con el nombre de la
 * campaña y `deadline: false`: se anuncia, pero sin plazo. Si la ficha cobra menos, la campaña
 * anunciaría un descuento menor que el real y no se aplica.
 */
export function promotedPrice(
  course: CoursePrice,
  p: Promotion,
): (Required<Omit<CoursePrice, 'discountPct'>> & { discountPct: number; promo: AppliedPromotion }) | undefined {
  if (!p.coupon || !p.discountPct) return undefined;
  const listPrice = course.originalPriceUSD ?? course.priceUSD;
  if (listPrice === undefined) return undefined;
  const price = discountedPrice(listPrice, p.discountPct);
  const promo = (deadline: boolean): AppliedPromotion => ({
    id: p.id,
    label: p.label || 'Oferta',
    headline: p.headline,
    endsAt: p.endsAt,
    theme: p.theme || 'brand',
    discountPct: p.discountPct!,
    buttonLabel: p.buttonLabel || 'Ver los cursos',
    deadline,
  });
  if (course.priceUSD !== undefined && course.priceUSD <= price) {
    if (course.priceUSD < price) return undefined;
    // Precio y enlace de base se dejan como están: se verificaron juntos en el checkout.
    return {
      priceUSD: course.priceUSD,
      originalPriceUSD: listPrice,
      discountPct: course.discountPct ?? p.discountPct,
      hotmartUrl: course.hotmartUrl,
      promo: promo(false),
    };
  }
  let hotmartUrl: string;
  try {
    // Un checkout propio solo tiene sentido si la campaña es de un único curso.
    hotmartUrl = checkoutFor(p.courses.length === 1 ? p : { ...p, checkoutUrl: '' }, course.hotmartUrl);
  } catch {
    return undefined;
  }
  return {
    priceUSD: price,
    originalPriceUSD: listPrice,
    discountPct: p.discountPct,
    hotmartUrl,
    promo: promo(true),
  };
}

export type PromotionState = 'draft' | 'unverified' | 'scheduled' | 'live' | 'ended' | 'invalid';

/** Estado de una campaña para el calendario del panel. */
export function promotionState(p: Promotion, published: boolean, now = Date.now()): PromotionState {
  const start = Date.parse(p.startsAt);
  const end = Date.parse(p.endsAt);
  if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) return 'invalid';
  if (now >= end) return 'ended';
  if (!published) return 'draft';
  if (!p.offerVerified) return 'unverified';
  return now < start ? 'scheduled' : 'live';
}

/** Precio en USD que muestra el checkout de Hotmart en su HTML, o `undefined` si no se pudo leer. */
export function checkoutPrice(html: string): number | undefined {
  const match = /(\d+(?:\.\d+)?),"USD"/.exec(html);
  const value = match ? Number(match[1]) : NaN;
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

export interface OfferCheck {
  course: string;
  listPrice?: number;
  expected?: number;
  /** Lo que cobra el checkout con el cupón; `undefined` si Hotmart no respondió con un precio. */
  charged?: number;
  ok: boolean;
  note: string;
}

/** Compara lo que el sitio publicaría con lo que el checkout cobra de verdad con el cupón. */
export function compareOffer(
  course: string,
  listPrice: number | undefined,
  pct: number | undefined,
  charged: number | undefined,
): OfferCheck {
  if (listPrice === undefined || !pct) {
    return { course, listPrice, charged, ok: false, note: 'Falta el precio de lista o el porcentaje.' };
  }
  const expected = discountedPrice(listPrice, pct);
  if (charged === undefined) {
    return { course, listPrice, expected, ok: false, note: 'Hotmart no devolvió un precio. Vuelve a intentarlo.' };
  }
  const ok = Math.abs(charged - expected) < 0.011;
  return {
    course,
    listPrice,
    expected,
    charged,
    ok,
    note: ok ? 'El checkout cobra el precio publicado.' : 'El checkout cobra otro precio: no publiques la campaña.',
  };
}

/** Días, horas, minutos y segundos que faltan. Lo usan el servidor (texto) y el navegador (reloj). */
export function countdownParts(ms: number): { d: number; h: number; m: number; s: number } {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60,
  };
}

/**
 * Último día completo de la campaña, en hora de Colombia: «30 de noviembre».
 * El fin es exclusivo, así que una campaña que acaba el 1 a las 00:00 se anuncia «hasta el 30».
 */
export function promotionLastDay(endsAt: string): string {
  const end = Date.parse(endsAt);
  if (!Number.isFinite(end)) return '';
  return new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', timeZone: 'America/Bogota' }).format(
    new Date(end - 1),
  );
}
