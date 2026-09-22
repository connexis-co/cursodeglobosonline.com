import type { APIRoute } from 'astro';
import {
  SITEMAP_NAMES,
  pagesUrls,
  categoriasUrls,
  cursosUrls,
  blogUrls,
  renderUrlset,
  type UrlEntry,
} from '@/lib/sitemap';

export function getStaticPaths() {
  return SITEMAP_NAMES.map((name) => ({ params: { name: `sitemap-${name}` } }));
}

export const GET: APIRoute = async ({ params }) => {
  const name = params.name?.replace(/^sitemap-/, '') ?? '';
  let urls: UrlEntry[];
  if (name === 'pages') urls = pagesUrls();
  else if (name === 'categorias') urls = await categoriasUrls();
  else if (name === 'blog') urls = await blogUrls();
  else if (name.startsWith('cursos-')) urls = await cursosUrls(name.replace('cursos-', ''));
  else urls = [];
  return new Response(renderUrlset(urls), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
