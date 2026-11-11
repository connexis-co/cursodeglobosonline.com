interface HotmartUrlParams {
  /**
   * Enlace corto de afiliado del curso (campo `hotmart_url` del CMS), con el mismo acortador
   * que sably.co: `hotm.io/<producto>-curso-crashing` → `go.hotmart.com/<hotlink>` →
   * `pay.hotmart.com/<producto>?ref=<hotlink>`. El `ref` es lo que acredita la comisión:
   * NO sustituir el enlace corto por la URL directa del checkout.
   */
  baseUrl: string;
  /** Cupón textual solo si el curso lo define (hoy el descuento va por offDiscount en la URL). */
  coupon?: string;
  courseSlug: string;
  countryCode: string;
  citySlug?: string;
  /** Origen del click para el test A/B (seo | landing-meta | landing-google). */
  variant?: string;
  /** Botón que se pulsó (hero, aside, sticky…): llega al informe de ventas de Hotmart. */
  placement?: string;
}

/** Hotmart solo admite letras, números, guion y guion bajo en `sck`. */
const sckPart = (value: string) => value.toLowerCase().replace(/[^a-z0-9-]+/g, '-').slice(0, 40);

/**
 * Agrega seguimiento al checkout sin tocar los parámetros existentes (offDiscount viaja intacto
 * por el acortador). Comprobado el 11-11-2026: al checkout llegan `ref`, `offDiscount`, `src`
 * (como `hsrc`) y `sck`; los `utm_*` se pierden en la redirección, así que el país y el curso
 * van también en `sck` para que el informe de ventas de Hotmart diga de dónde salió cada compra.
 */
export function buildHotmartUrl({
  baseUrl,
  coupon,
  courseSlug,
  countryCode,
  citySlug,
  variant,
  placement,
}: HotmartUrlParams): string {
  const url = new URL(baseUrl);
  if (coupon) url.searchParams.set('coupon', coupon);
  url.searchParams.set('src', 'cursodeglobosonline');
  url.searchParams.set(
    'sck',
    [countryCode, citySlug, courseSlug.replace(/^curso-de-/, ''), placement ?? variant].filter(Boolean).map((part) => sckPart(part!)).join('_'),
  );
  url.searchParams.set('utm_source', 'cursodeglobosonline.com');
  url.searchParams.set('utm_medium', variant?.startsWith('landing') ? 'paid' : 'web');
  url.searchParams.set('utm_campaign', `course_${courseSlug}`);
  url.searchParams.set('utm_content', citySlug ?? countryCode);
  if (variant) url.searchParams.set('utm_term', variant);
  return url.toString();
}

/**
 * Ficha pública del curso en Hotmart (valoraciones y reseñas) CON atribución: el mismo enlace
 * corto con `dp=1` lleva a la página del producto con `?ref=` en vez de al checkout. La URL
 * directa del marketplace no lleva `ref`: quien compre desde ahí no cuenta como venta nuestra.
 */
export function buildHotmartProductUrl(baseUrl: string, countryCode: string, courseSlug: string): string {
  const url = new URL(baseUrl);
  url.searchParams.delete('offDiscount');
  url.searchParams.set('dp', '1');
  url.searchParams.set('src', 'cursodeglobosonline');
  url.searchParams.set('sck', [countryCode, courseSlug.replace(/^curso-de-/, ''), 'resenas'].map(sckPart).join('_'));
  return url.toString();
}

export function buildWhatsAppUrl(whatsapp: string, message: string): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}
