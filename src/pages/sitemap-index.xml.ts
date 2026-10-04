import type { APIRoute } from 'astro';
import { sitemapNames } from '@/lib/sitemap';
import { SITE } from '@/lib/site';

export const GET: APIRoute = async () => {
  const body = (await sitemapNames()).map(
    (name) => `<sitemap><loc>${SITE.url}/sitemaps/sitemap-${name}.xml</loc></sitemap>`,
  ).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</sitemapindex>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
