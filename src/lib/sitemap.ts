import { getCollection } from '@/lib/emdash-content';
import { CITIES_ENABLED } from './countries';
import { getCountries, getCategories, listDocuments } from './emdash-content';

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
  /** Solo cuando la fecha es real (artículos): Google ignora lastmod poco fiables. */
  lastmod?: Date;
  /** Image sitemap (Google Imágenes / Discover). */
  image?: { loc: string; title: string };
}

const u = (path: string, priority: number, changefreq: 'weekly' | 'monthly' = 'weekly'): UrlEntry => ({
  loc: `${SITE.url}${path}`,
  priority,
  changefreq,
});

export async function pagesUrls(): Promise<UrlEntry[]> {
 const COUNTRIES=await getCountries();
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
  for(const [collection,prefix] of [['videos','videos'],['graphics','recursos']] as const){const entries=await listDocuments(collection);if(entries.length)urls.push(u(`/${prefix}/`,0.6));for(const e of entries)urls.push(u(`/${prefix}/${e.id}/`,0.6));}
  for(const e of await listDocuments('pages'))if(!['inicio','contacto','nosotros','privacidad','terminos'].includes(e.id))urls.push(u(`/paginas/${e.id}/`,0.5));
  return urls;
}

export async function categoriasUrls(): Promise<UrlEntry[]> {
const COUNTRIES=await getCountries();const CATEGORIES=await getCategories();
  // Solo categorías con cursos: las vacías no generan página (evita los 404
  // de /eventos/ y /emprendimiento/ que GSC reportó en el sitemap).
  const courses = await getCollection('courses');
  const active = CATEGORIES.filter((cat) => courses.some((c) => c.data.category === cat.slug));
  // Con una sola categoría activa la página es noindex (duplica el catálogo): fuera del sitemap.
  if (active.length < 2) return [];
  const urls: UrlEntry[] = [];
  for (const c of COUNTRIES) {
    for (const cat of active) {
      urls.push(u(`/${c.code}/cursos/${cat.slug}/`, 0.8));
    }
  }
  return urls;
}

export async function cursosUrls(countryCode: string): Promise<UrlEntry[]> {
const COUNTRIES=await getCountries();const CATEGORIES=await getCategories();
  const courses = await getCollection('courses');
  const country = COUNTRIES.find((c) => c.code === countryCode);
  if (!country) return [];
  const urls: UrlEntry[] = [];
  // Solo URLs canónicas: las páginas curso-ciudad (/{cc}/{ciudad}/{curso}/) declaran
  // canonical → /{cc}/{curso}/ para no canibalizar a la money page (GSC 2026-09-22:
  // hubs de ciudad y URLs viejas acaparaban "curso de globos burbuja/globoflexia").
  for (const course of courses) {
    urls.push(u(`/${country.code}/${course.id}/`, 1.0));
  }
  return urls;
}

export async function blogUrls(): Promise<UrlEntry[]> {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => (b.data.updatedAt ?? b.data.publishedAt).getTime() - (a.data.updatedAt ?? a.data.publishedAt).getTime(),
  );
  if (posts.length === 0) return [];
  const entries = await Promise.all(
    posts.map(async (p) => {
      return {
        ...u(`/blog/${p.id}/`, p.data.isPillar ? 0.8 : 0.7, 'monthly'),
        lastmod: p.data.updatedAt ?? p.data.publishedAt,
        image: { loc: new URL(p.data.hero.src,SITE.url).href, title: p.data.heroAlt },
      } satisfies UrlEntry;
    }),
  );
  return [{ ...u('/blog/', 0.8), lastmod: entries[0].lastmod }, ...entries];
}

const xmlEsc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function renderUrlset(urls: UrlEntry[]): string {
  const body = urls
    .map((x) => {
      const lastmod = x.lastmod ? `<lastmod>${x.lastmod.toISOString().slice(0, 10)}</lastmod>` : '';
      const image = x.image
        ? `<image:image><image:loc>${x.image.loc}</image:loc><image:title>${xmlEsc(x.image.title)}</image:title></image:image>`
        : '';
      return `<url><loc>${x.loc}</loc>${lastmod}<changefreq>${x.changefreq}</changefreq><priority>${x.priority.toFixed(1)}</priority>${image}</url>`;
    })
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">${body}</urlset>`;
}

export async function sitemapNames(){return ['pages','categorias','blog',...(await getCountries()).map(c=>`cursos-${c.code}`)];}
