import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Artículos publicables (sin borradores), del más reciente al más antiguo. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => lastModified(b).getTime() - lastModified(a).getTime());
}

export function lastModified(post: Post): Date {
  return post.data.updatedAt ?? post.data.publishedAt;
}

/** Minutos de lectura a ~220 palabras/min (texto sin marcado MDX). */
export function readingMinutes(post: Post): number {
  const text = (post.body ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>`[\]()-]/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(3, Math.round(words / 220));
}

export function postUrl(post: Post): string {
  return `/blog/${post.id}/`;
}

/**
 * Relacionados: primero los declarados en `related`, luego pilar y hermanos
 * del mismo cluster, y por último los que empujan a la misma money page.
 */
export function relatedPosts(post: Post, all: Post[], limit = 3): Post[] {
  const others = all.filter((p) => p.id !== post.id);
  const picked: Post[] = [];
  const add = (p?: Post) => {
    if (p && !picked.includes(p) && picked.length < limit) picked.push(p);
  };
  for (const slug of post.data.related) add(others.find((p) => p.id === slug));
  if (post.data.pillar) add(others.find((p) => p.id === post.data.pillar));
  for (const p of others.filter((p) => p.data.cluster === post.data.cluster)) add(p);
  for (const p of others.filter((p) => p.data.moneyPage === post.data.moneyPage)) add(p);
  return picked;
}

/** Artículos que empujan a un curso (para el bloque "Guías gratis" de la money page). */
export async function postsForCourse(courseSlug: string, limit = 3): Promise<Post[]> {
  const all = await getPublishedPosts();
  const direct = all.filter((p) => p.data.moneyPage === courseSlug);
  return [...direct.filter((p) => p.data.isPillar), ...direct.filter((p) => !p.data.isPillar)].slice(0, limit);
}

const dateFmt = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export function formatDate(d: Date): string {
  return dateFmt.format(d);
}
