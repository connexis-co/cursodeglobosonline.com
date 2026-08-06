import { getCollection } from 'astro:content';
import { COUNTRIES, CITIES_ENABLED } from './countries';
import { CATEGORIES } from './categories';
import { SITE } from './site';

/**
 * Sitemaps segmentados (plan maestro §15): un archivo por país para los cursos
 * + pages/categorias/blog. Las prioridades orientan el crawl budget de un
 * dominio en reconstrucción. Las landing de Ads (noindex) NO entran aquí.
 */
export interface UrlEntry {
  loc: string;
  priority: number;
  changefreq: 'weekly' | 'monthly';
}

const u = (path: string, priority: number, changefreq: 'weekly' | 'monthly' = 'weekly'): UrlEntry => ({
  loc: `${SITE.url}${path}`,
  priority,
  changefreq,
});

export function pagesUrls(): UrlEntry[] {
  const urls: UrlEntry[] = [u('/', 1.0)];
  for (const c of COUNTRIES) {
    urls.push(u(`/${c.code}/`, 1.0));
    urls.push(u(`/${c.code}/cursos/`, 1.0));
    if (CITIES_ENABLED) {
      for (const city of c.cities) {
        urls.push(u(`/${c.code}/${city.slug}/`, 0.7, 'monthly'));
      }
    }
  }
  urls.push(u('/nosotros/', 0.5, 'monthly'));
  urls.push(u('/contacto/', 0.5, 'monthly'));
  urls.push(u('/legal/terminos/', 0.3, 'monthly'));
  urls.push(u('/legal/privacidad/', 0.3, 'monthly'));
  urls.push(u('/sitemap/', 0.3, 'monthly'));
  return urls;
}

export function categoriasUrls(): UrlEntry[] {
  const urls: UrlEntry[] = [];
  for (const c of COUNTRIES) {
    for (const cat of CATEGORIES) {
      urls.push(u(`/${c.code}/cursos/${cat.slug}/`, 0.8));
    }
  }
  return urls;
}

export async function cursosUrls(countryCode: string): Promise<UrlEntry[]> {
  const courses = await getCollection('courses');
  const country = COUNTRIES.find((c) => c.code === countryCode);
  if (!country) return [];
  const urls: UrlEntry[] = [];
  for (const course of courses) {
    urls.push(u(`/${country.code}/${course.id}/`, 0.9));
    if (CITIES_ENABLED) {
      for (const city of country.cities) {
        urls.push(u(`/${country.code}/${city.slug}/${course.id}/`, 0.5, 'monthly'));
      }
    }
  }
  return urls;
}

export async function blogUrls(): Promise<UrlEntry[]> {
  const posts = await getCollection('blog');
  if (posts.length === 0) return [];
  return [u('/blog/', 0.7), ...posts.map((p) => u(`/blog/${p.id}/`, 0.6, 'monthly'))];
}

export function renderUrlset(urls: UrlEntry[]): string {
  const body = urls
    .map(
      (x) =>
        `<url><loc>${x.loc}</loc><changefreq>${x.changefreq}</changefreq><priority>${x.priority.toFixed(1)}</priority></url>`,
    )
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
}

export const SITEMAP_NAMES = ['pages', 'categorias', 'blog', ...COUNTRIES.map((c) => `cursos-${c.code}`)];
