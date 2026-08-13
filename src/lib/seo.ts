import { COUNTRIES } from './countries';
import { SITE } from './site';

export interface HreflangAlternate {
  hreflang: string;
  href: string;
}

/**
 * Genera alternates hreflang para páginas que existen en todos los países
 * (home país, categoría, curso). `pathAfterCountry` NO incluye el código de país.
 * x-default apunta al home global `/` cuando la ruta es raíz, o al default country.
 */
export function countryAlternates(pathAfterCountry: string): HreflangAlternate[] {
  const clean = pathAfterCountry.startsWith('/') ? pathAfterCountry : `/${pathAfterCountry}`;
  const alternates: HreflangAlternate[] = COUNTRIES.map((c) => ({
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
    name: SITE.name,
    url: SITE.url,
    // PNG 512px: Google exige ≥112x112 y prefiere raster sobre el SVG del favicon.
    logo: `${SITE.url}/icon-512.png`,
    sameAs: Object.values(SITE.social),
    parentOrganization: {
      '@type': 'Organization',
      name: SITE.parent.name,
      url: SITE.parent.url,
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
  url: string;
  /** Solo si el precio es real y verificado. */
  price?: number;
  priceCurrency?: string;
  /** Solo si existen reseñas reales. */
  rating?: number;
  ratingCount?: number;
  instructorName?: string;
  category: string;
  lessonsCount: number;
}

export function courseSchema(c: CourseSchemaInput) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: c.title,
    description: c.description,
    url: c.url,
    provider: {
      '@type': 'Organization',
      name: SITE.name,
      url: SITE.url,
    },
    about: c.category,
    educationalCredentialAwarded: 'Certificado de estudios',
    numberOfCredits: c.lessonsCount,
    hasCourseInstance: {
      '@type': 'CourseInstance',
      courseMode: 'Online',
      location: { '@type': 'VirtualLocation', url: c.url },
    },
    inLanguage: 'es',
    availableLanguage: ['es'],
  };
  if (c.instructorName) {
    schema.instructor = { '@type': 'Person', name: c.instructorName };
  }
  if (c.rating !== undefined && c.ratingCount !== undefined) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: c.rating,
      ratingCount: c.ratingCount,
      bestRating: 5,
    };
  }
  if (c.price !== undefined && c.priceCurrency) {
    schema.offers = {
      '@type': 'Offer',
      price: c.price,
      priceCurrency: c.priceCurrency,
      availability: 'https://schema.org/InStock',
      category: 'Paid',
      url: c.url,
    };
  }
  return schema;
}
