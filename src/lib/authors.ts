import { SITE } from './site';

/**
 * Autores del blog (E-E-A-T). Regla anti-humo: no se inventan personas.
 * Mientras JP no designe un autor real con foto y trayectoria verificable,
 * los artículos los firma el equipo editorial (schema `Organization`).
 * Para añadir una persona: type 'Person', `jobTitle`, `photo` y `sameAs` reales.
 */
export interface Author {
  slug: string;
  name: string;
  type: 'Person' | 'Organization';
  jobTitle?: string;
  bio: string;
  photo?: string;
  sameAs?: string[];
}

export const AUTHORS: Record<string, Author> = {
  'equipo-editorial': {
    slug: 'equipo-editorial',
    name: 'Equipo editorial de Curso de Globos Online',
    type: 'Organization',
    bio: 'Escribimos guías prácticas de decoración con globos a partir del temario de nuestros cursos de globoflexia, bouquets, flores y globos burbuja, y de las preguntas reales que nos llegan por WhatsApp. Cada guía indica materiales, medidas y costos de referencia, y se actualiza cuando cambian las técnicas o los precios.',
    sameAs: [SITE.parent.url],
  },
};

export function getAuthor(slug: string): Author {
  return AUTHORS[slug] ?? AUTHORS['equipo-editorial'];
}

export function authorUrl(slug: string): string {
  return `${SITE.url}/blog/autor/${slug}/`;
}
