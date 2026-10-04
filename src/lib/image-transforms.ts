const PUBLIC_ORIGIN = 'https://cursodeglobosonline.com';
export const IMAGE_WIDTHS = [96, 160, 320, 480, 640, 960, 1280, 1600] as const;

interface ImageOptions {
  siteUrl: string;
  sizes: string;
  maxWidth?: number;
}

/** Fixed variants of public raster assets; private development and external sources stay local. */
export function responsiveImage(src: string, {siteUrl, sizes, maxWidth = 1600}: ImageOptions): {
  src: string;
  srcset?: string;
  sizes?: string;
} {
  if (siteUrl.replace(/\/$/, '') !== PUBLIC_ORIGIN) return {src};
  let source: URL;
  try { source = new URL(src, PUBLIC_ORIGIN); } catch { return {src}; }
  if (source.origin !== PUBLIC_ORIGIN || source.username || source.password || source.search || source.hash) return {src};
  if (!/^\/(?:images\/|_emdash\/api\/media\/file\/|og-default\.)/.test(source.pathname)) return {src};
  if (!/\.(?:jpe?g|png|webp|avif)$/i.test(source.pathname)) return {src};
  const limit = Number.isFinite(maxWidth) ? Math.max(96, Math.min(1600, maxWidth)) : 1600;
  const widths = IMAGE_WIDTHS.filter(width => width <= limit);
  const url = (width: number) => `/cdn-cgi/image/width=${width},quality=80,format=auto,fit=scale-down,onerror=redirect${source.pathname}`;
  const fallback = widths.find(width => width >= 960) ?? widths.at(-1)!;
  return {src: url(fallback), srcset: widths.map(width => `${url(width)} ${width}w`).join(', '), sizes};
}
