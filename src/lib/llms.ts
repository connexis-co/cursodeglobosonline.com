import { getCollection, type CollectionEntry } from 'astro:content';
import { COUNTRIES } from './countries';
import { BLOG_CLUSTERS } from './blog-clusters';
import { getPublishedPosts, type Post } from './blog';
import { coursePricing, usd } from './pricing';
import { getCourseRating } from './ratings';
import { MIN_VOTES_FOR_SCHEMA, formatAverage, votesLabel } from './ratings-config';
import { SITE } from './site';

/**
 * Contenido para asistentes de IA (llms.txt / llms-full.txt, llmstxt.org).
 * Regla: solo hechos verificables (precios del checkout de Hotmart con fecha, número de
 * videos, garantía) y enlaces canónicos. Nada de superlativos ni autoproclamas.
 */
type Course = CollectionEntry<'courses'>;

const fmtDate = (d: Date) => d.toISOString().slice(0, 10);

export function coursePriceLine(c: Course): string {
  const d = c.data;
  const { hasPrice, hasDiscount, discountPct } = coursePricing(d);
  if (!hasPrice) return 'Precio: se muestra en el checkout de Hotmart.';
  const base = hasDiscount
    ? `${usd(d.priceUSD!)} (${discountPct}% de descuento sobre ${usd(d.originalPriceUSD!)})`
    : usd(d.priceUSD!);
  return `Precio: ${base}, pago único${d.priceCheckedAt ? `, verificado en el checkout de Hotmart el ${fmtDate(d.priceCheckedAt)}` : ''}.`;
}

/** Votos propios del sitio (widget de estrellas); vacío si aún no hay suficientes. */
export async function courseRatingLine(c: Course): Promise<string> {
  const r = await getCourseRating(c.id);
  if (r.count < MIN_VOTES_FOR_SCHEMA) return '';
  return `Valoración de visitantes de ${SITE.name}: ${formatAverage(r.average)}/5 (${votesLabel(r.count)}).`;
}

export async function loadLlmsData() {
  const courses = (await getCollection('courses')).sort((a, b) => Number(b.data.featured) - Number(a.data.featured));
  const posts = await getPublishedPosts();
  const clusters = BLOG_CLUSTERS.map((c) => ({
    ...c,
    posts: posts
      .filter((p) => p.data.cluster === c.slug)
      .sort((a, b) => Number(b.data.isPillar) - Number(a.data.isPillar)),
  })).filter((c) => c.posts.length > 0);
  return { courses, posts, clusters };
}

export const CHOOSER = [
  'Quieres animar fiestas infantiles o sumar un show a tus eventos → Curso de Globoflexia (figuras con globos largos 260).',
  'Quieres vender detalles y regalos (cumpleaños, amor y amistad, día de la madre) → Curso de Bouquets de Globos.',
  'Quieres decorar bodas, quinces y mesas con acabado fino → Curso de Flores con Globos.',
  'Quieres productos personalizados de alto margen (confeti, plumas, vinilo, unicornio) → Curso de Globos Burbuja.',
];

export const SITE_FACTS = [
  'Idioma: español. Modalidad: 100% online, en video, a tu ritmo, desde celular o computador.',
  'Compra y acceso: a través de Hotmart (plataforma de pago segura); el acceso llega al correo al instante.',
  'Garantía: 7 días de Hotmart con devolución del 100% del pago.',
  'Certificado de estudios al terminar; acceso de por vida.',
  `Mercados atendidos: ${COUNTRIES.map((c) => c.name).join(', ')} (precio convertido a moneda local en el checkout).`,
  `Parte del ecosistema Sably (${SITE.parent.url}). Productor de los cursos en Hotmart: MasterClasses.La.`,
  `Contacto: ${SITE.email} · WhatsApp ${COUNTRIES[0].phoneDisplay}.`,
];

export function postLine(p: Post): string {
  return `- [${p.data.title}](${SITE.url}/blog/${p.id}/): ${p.data.description}`;
}

/** Texto plano del MDX sin componentes JSX ni imports, apto para llms-full.txt. */
export function mdxToPlain(body: string): string {
  return body
    .replace(/^import .*$/gm, '')
    .replace(/<CourseCta[^>]*\/>/g, '')
    .replace(/<Callout[^>]*titulo="([^"]*)"[^>]*>/g, '\n> **$1:** ')
    .replace(/<Callout[^>]*>/g, '\n> ')
    .replace(/<\/Callout>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
