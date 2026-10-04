import type { APIRoute } from 'astro';
import {
  sitemapNames,
  pagesUrls,
  categoriasUrls,
  cursosUrls,
  blogUrls,
  renderUrlset,
  type UrlEntry,
} from '@/lib/sitemap';



export const GET: APIRoute = async ({ params }) => {
  const name = params.name?.replace(/^sitemap-/, '') ?? '';
  if (!(await sitemapNames()).includes(name)) return new Response('Sitemap not found', { status: 404 });
  let urls: UrlEntry[];
  if (name === 'pages') urls = await pagesUrls();
  else if (name === 'categorias') urls = await categoriasUrls();
  else if (name === 'blog') urls = await blogUrls();
  else if (name.startsWith('cursos-')) urls = await cursosUrls(name.replace('cursos-', ''));
  else urls = [];
  return new Response(renderUrlset(urls), {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
