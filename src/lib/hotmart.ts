interface HotmartUrlParams {
  /**
   * URL Hotmart REAL del curso (frontmatter `hotmartUrl`), tal como estaba en
   * el sitio anterior: hotm.art conserva la cadena de afiliado
   * (go.hotmart.com/XXXX → pay.hotmart.com/PROD?ref=XXXX). NO alterar el host.
   */
  baseUrl: string;
  /** Cupón textual solo si el curso lo define (hoy el descuento va por offDiscount en la URL). */
  coupon?: string;
  courseSlug: string;
  countryCode: string;
  citySlug?: string;
  /** Origen del click para el test A/B (seo | landing-meta | landing-google). */
  variant?: string;
}

/**
 * Agrega tracking al checkout sin tocar los parámetros existentes
 * (offDiscount, etc. viajan intactos a través de hotm.art).
 */
export function buildHotmartUrl({
  baseUrl,
  coupon,
  courseSlug,
  countryCode,
  citySlug,
  variant,
}: HotmartUrlParams): string {
  const url = new URL(baseUrl);
  if (coupon) url.searchParams.set('coupon', coupon);
  url.searchParams.set('src', 'cursodeglobosonline');
  url.searchParams.set('utm_source', 'cursodeglobosonline.com');
  url.searchParams.set('utm_medium', variant?.startsWith('landing') ? 'paid' : 'web');
  url.searchParams.set('utm_campaign', `course_${courseSlug}`);
  url.searchParams.set('utm_content', citySlug ?? countryCode);
  if (variant) url.searchParams.set('utm_term', variant);
  return url.toString();
}

export function buildWhatsAppUrl(whatsapp: string, message: string): string {
  return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
}
