/**
 * Clusters temáticos del blog (mapa temático 2026-09-22, docs/seo/).
 * Cada cluster tiene un artículo pilar y artículos satélite que enlazan a él.
 * Se mantiene aparte de `categories.ts` (taxonomía de CURSOS) para no mezclar
 * intención informacional (blog) con transaccional (money pages).
 */
export interface BlogCluster {
  slug: string;
  name: string;
  /** Frase corta para el índice del blog y el hub del cluster. */
  short: string;
}

export const BLOG_CLUSTERS: BlogCluster[] = [
  {
    slug: 'arcos-y-guirnaldas',
    name: 'Arcos y guirnaldas',
    short: 'Arcos sencillos y orgánicos, guirnaldas, columnas y paredes: medidas, cantidades y estructura.',
  },
  {
    slug: 'ideas-por-ocasion',
    name: 'Ideas por ocasión',
    short: 'Cumpleaños, baby shower, bodas, graduaciones y fechas especiales decoradas con globos.',
  },
  {
    slug: 'arreglos-y-flores',
    name: 'Arreglos, bouquets y flores',
    short: 'Arreglos de globos, bouquets, centros de mesa y flores con globos paso a paso.',
  },
  {
    slug: 'globoflexia',
    name: 'Globoflexia y figuras',
    short: 'Figuras con globos largos: nudos, torsiones y las figuras que más piden en fiestas.',
  },
  {
    slug: 'tecnicas-y-materiales',
    name: 'Técnicas y materiales',
    short: 'Tipos y tamaños de globos, helio, infladores, globo burbuja y trucos para que duren más.',
  },
  {
    slug: 'negocio',
    name: 'Negocio de decoración',
    short: 'Cuánto cobrar, cómo cotizar y cómo convertir la decoración con globos en ingresos.',
  },
];

export function getBlogCluster(slug: string): BlogCluster {
  const cluster = BLOG_CLUSTERS.find((c) => c.slug === slug);
  if (!cluster) throw new Error(`Cluster de blog desconocido: ${slug}`);
  return cluster;
}
