import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { getPublishedPosts, lastModified } from '@/lib/blog';
import { getBlogCluster } from '@/lib/blog-clusters';
import { getAuthor } from '@/lib/authors';
import { SITE } from '@/lib/site';

/**
 * Feed RSS 2.0 del blog para lectores, agregadores y Bing (SubmitFeed).
 * Ojo: Google retiró "Seguir" en Discover (2025-11-19); Discover se gana con
 * imagen grande (>=1200px, max-image-preview:large) y contenido útil, no con el feed.
 * Imagen 1600px por ítem (media:content).
 */
const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const items = await Promise.all(
    posts.map(async (post) => {
      const d = post.data;
      const url = `${SITE.url}/blog/${post.id}/`;
      const img = await getImage({ src: d.hero, width: 1600, height: 900, fit: 'cover', format: 'jpg', quality: 82 });
      const imgUrl = new URL(img.src, SITE.url).href;
      return `<item>
<title>${esc(d.discoverTitle ?? d.title)}</title>
<link>${url}</link>
<guid isPermaLink="true">${url}</guid>
<pubDate>${d.publishedAt.toUTCString()}</pubDate>
<dc:creator>${esc(getAuthor(d.author).name)}</dc:creator>
<category>${esc(getBlogCluster(d.cluster).name)}</category>
<description>${esc(d.description)}</description>
<media:content url="${imgUrl}" medium="image" type="image/jpeg" width="1600" height="900"><media:description>${esc(d.heroAlt)}</media:description></media:content>
</item>`;
    }),
  );
  const updated = posts[0] ? lastModified(posts[0]).toUTCString() : new Date(0).toUTCString();
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
<channel>
<title>${esc(`Blog de ${SITE.name}`)}</title>
<link>${SITE.url}/blog/</link>
<atom:link href="${SITE.url}/blog/rss.xml" rel="self" type="application/rss+xml"/>
<description>${esc('Guías de decoración con globos: arcos, bouquets, globoflexia, materiales y negocio.')}</description>
<language>es</language>
<lastBuildDate>${updated}</lastBuildDate>
<image><url>${SITE.url}/icon-512.png</url><title>${esc(`Blog de ${SITE.name}`)}</title><link>${SITE.url}/blog/</link></image>
${items.join('\n')}
</channel>
</rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
