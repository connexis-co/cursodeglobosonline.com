import { getCountries } from './emdash-content';
import { MIN_VOTES_FOR_SCHEMA, type CourseRating } from './ratings-config';
import { SITE } from './site';
import type { Author } from './authors';
import { authorUrl } from './authors';

/** @id estables para enlazar nodos JSON-LD entre sí (un grafo coherente por página). */
export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

export interface HreflangAlternate {
  hreflang: string;
  href: string;
}

/**
 * Genera alternates hreflang para páginas que existen en todos los países
 * (home país, categoría, curso). `pathAfterCountry` NO incluye el código de país.
 * x-default apunta al home global `/` cuando la ruta es raíz, o al default country.
 */
export async function countryAlternates(pathAfterCountry: string): Promise<HreflangAlternate[]> {
  const clean = pathAfterCountry.startsWith('/') ? pathAfterCountry : `/${pathAfterCountry}`;
  const alternates: HreflangAlternate[] = (await getCountries()).map((c) => ({
    hreflang: c.hreflang,
    href: `${SITE.url}/${c.code}${clean}`,
  }));
  alternates.push({
    hreflang: 'x-default',
    href: clean === '/' ? `${SITE.url}/` : `${SITE.url}/co${clean}`,
  });
  return alternates;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    url: `${SITE.url}/`,
    description: SITE.description,
    email: SITE.email,
    // PNG 512px: Google exige ≥112x112 y prefiere raster sobre el SVG del favicon.
    logo: { '@type': 'ImageObject', url: `${SITE.url}/icon-512.png`, width: 512, height: 512 },
    // Aún no hay perfiles sociales propios: los de Sably van en la organización matriz.
    parentOrganization: {
      '@type': 'Organization',
      name: SITE.parent.name,
      url: SITE.parent.url,
      sameAs: Object.values(SITE.social),
    },
  };
}

interface FaqEntry {
  q: string;
  a: string;
}

export function faqSchema(faqs: FaqEntry[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

interface CourseSchemaInput {
  title: string;
  description: string;
  /** URL CANÓNICA del curso (en páginas curso-ciudad, la del curso-país). */
  url: string;
  images: string[];
  level: string;
  category: string;
  learnings: string[];
  /** Solo si el precio es real, verificado y VISIBLE en la página. */
  price?: number;
  /** Productor real en Hotmart (el sitio es afiliado: publisher, no provider). */
  producer?: string;
  instructor?: { name: string; title: string; photo?: string };
  /** Votos propios del sitio (D1, widget de estrellas), visibles en la página. */
  rating?: CourseRating;
}

const slug = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/**
 * Curso co-tipado ["Course","Product"] cuando hay precio visible → product snippet
 * (precio y disponibilidad en la SERP; es el formato vigente para páginas de afiliado:
 * Course info fue retirado por Google en 2025). `aggregateRating` sale SOLO de los votos
 * propios del sitio (widget de estrellas → D1), visibles en la misma página; nunca de la
 * valoración de Hotmart, que es de un tercero ("Don't aggregate reviews or ratings from
 * other websites").
 */
export function courseSchema(c: CourseSchemaInput) {
  const producerNode = c.producer
    ? { '@type': 'Organization', '@id': `${SITE.url}/#producer-${slug(c.producer)}`, name: c.producer }
    : { '@id': ORG_ID };
  const hasPrice = c.price !== undefined;
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': hasPrice ? ['Course', 'Product'] : 'Course',
    '@id': `${c.url}#course`,
    name: c.title,
    description: c.description,
    url: c.url,
    image: c.images,
    inLanguage: 'es',
    educationalLevel: c.level,
    about: c.category,
    teaches: c.learnings,
    provider: producerNode,
    publisher: { '@id': ORG_ID },
    educationalCredentialAwarded: {
      '@type': 'EducationalOccupationalCredential',
      name: 'Certificado de estudios',
      credentialCategory: 'certificate',
    },
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'online',
      inLanguage: 'es',
    },
  };
  if (c.instructor) {
    schema.instructor = {
      '@type': 'Person',
      name: c.instructor.name,
      jobTitle: c.instructor.title,
      ...(c.instructor.photo ? { image: new URL(c.instructor.photo, SITE.url).href } : {}),
    };
  }
  if (hasPrice) {
    schema.brand = { '@type': 'Brand', name: c.producer ?? SITE.name };
    schema.offers = {
      '@type': 'Offer',
      price: c.price!.toFixed(2),
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      category: 'Paid',
      url: c.url,
      ...(c.producer ? { seller: producerNode } : {}),
    };
  }
  if (c.rating && c.rating.count >= MIN_VOTES_FOR_SCHEMA) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Math.round(c.rating.average * 10) / 10,
      ratingCount: c.rating.count,
      bestRating: 5,
      worstRating: 1,
    };
  }
  return schema;
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE.name,
    url: `${SITE.url}/`,
    inLanguage: 'es',
    publisher: { '@id': ORG_ID },
  };
}

interface BlogPostingInput {
  url: string;
  headline: string;
  description: string;
  /** URLs absolutas de la imagen principal en 16:9, 4:3 y 1:1 (>= 1200px, Discover). */
  images: string[];
  datePublished: Date;
  dateModified: Date;
  author: Author;
  section: string;
  keywords: string[];
  wordCount?: number;
}

export function blogPostingSchema(p: BlogPostingInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${p.url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': p.url },
    headline: p.headline.slice(0, 110),
    description: p.description,
    image: p.images,
    datePublished: p.datePublished.toISOString(),
    dateModified: p.dateModified.toISOString(),
    author: {
      '@type': p.author.type,
      name: p.author.name,
      url: authorUrl(p.author.slug),
      ...(p.author.jobTitle ? { jobTitle: p.author.jobTitle } : {}),
    },
    publisher: {
      '@type': 'Organization',
      '@id': ORG_ID,
      name: SITE.name,
      url: SITE.url,
      logo: { '@type': 'ImageObject', url: `${SITE.url}/icon-512.png`, width: 512, height: 512 },
    },
    articleSection: p.section,
    keywords: p.keywords.join(', '),
    inLanguage: 'es',
    isPartOf: { '@id': WEBSITE_ID },
    ...(p.wordCount ? { wordCount: p.wordCount } : {}),
  };
}
