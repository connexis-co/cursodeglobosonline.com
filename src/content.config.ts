import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { CATEGORIES } from './lib/categories';
import { BLOG_CLUSTERS } from './lib/blog-clusters';

const categorySlugs = CATEGORIES.map((c) => c.slug) as [string, ...string[]];
const BLOG_CLUSTER_SLUGS = BLOG_CLUSTERS.map((c) => c.slug) as [string, ...string[]];
/** Slugs de las 4 money pages (deben coincidir con src/content/courses/*.mdx). */
const courseSlugsForBlog = [
  'curso-de-globoflexia',
  'curso-de-bouquets-de-globos',
  'curso-de-flores-con-globos',
  'curso-de-globos-burbuja',
] as const;

/**
 * Regla de datos (protocolo anti-humo): precio, rating, estudiantes e
 * instructor son OPCIONALES — solo se publican cuando el dato es real
 * (auditoría del sitio anterior o Hotmart). Nada de números inventados.
 */
const courses = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/courses' }),
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    category: z.enum(categorySlugs),
    subcategory: z.string(),
    shortDescription: z.string().max(180),
    level: z.enum(['Principiante', 'Intermedio', 'Avanzado', 'Todos los niveles']),
    durationHours: z.number().positive().optional(),
    lessonsCount: z.number().int().positive(),
    modules: z
      .array(
        z.object({
          title: z.string(),
          lessons: z.array(z.string()).min(2),
        }),
      )
      .min(3),
    /**
     * Meta description AIDA/PAS (≤ 160 car. ya resuelta). `{lugar}` se reemplaza por
     * el país o la ciudad para que cada versión por país tenga una meta única.
     */
    metaDescription: z.string().max(150).optional(),
    /** Solo si el precio es público y verificado en el checkout de Hotmart. */
    priceUSD: z.number().positive().optional(),
    /** Precio de lista tachado, solo si el enlace aplica un descuento real. */
    originalPriceUSD: z.number().positive().optional(),
    /** Día en que se verificó el precio en pay.hotmart.com (se muestra y alimenta el schema). */
    priceCheckedAt: z.coerce.date().optional(),
    /**
     * Reseñas PROPIAS del sitio (primera parte). Hoy no existen: no rellenar con datos
     * de Hotmart ni placeholders — Google prohíbe agregar reseñas de otros sitios.
     */
    rating: z.number().min(1).max(5).optional(),
    ratingCount: z.number().int().positive().optional(),
    /**
     * Valoración pública del producto EN HOTMART (dato de terceros): se muestra visible
     * con enlace a la fuente, NUNCA como aggregateRating en el JSON-LD.
     */
    hotmartRating: z
      .object({
        value: z.number().min(1).max(5),
        count: z.number().int().positive(),
        checkedAt: z.coerce.date(),
      })
      .optional(),
    /** Ficha pública del producto en el marketplace de Hotmart (fuente de precio/reseñas). */
    hotmartProductUrl: z.string().url().optional(),
    /** Productor real del curso en Hotmart (schema `provider`/`brand`). */
    producer: z.string().optional(),
    students: z.number().int().positive().optional(),
    instructor: z
      .object({
        name: z.string(),
        title: z.string(),
        bio: z.string(),
        photo: z.string().optional(),
      })
      .optional(),
    learnings: z.array(z.string()).min(5).max(8),
    audience: z.array(z.string()).min(3).max(6),
    faqs: z
      .array(z.object({ q: z.string(), a: z.string() }))
      .min(4)
      .max(8),
    /** Enlace Hotmart REAL del sitio anterior (hotm.art conserva el hotlink de afiliado). */
    hotmartUrl: z.string().url(),
    /** % de descuento del enlace (offDiscount) o cupón, solo si es real. */
    discountPct: z.number().int().min(1).max(90).optional(),
    /** Cupón textual copiable; este sitio hoy no usa cupones alfanuméricos. */
    coupon: z.string().optional(),
    cover: z.string().optional(),
    featured: z.boolean().default(false),
    keywords: z.array(z.string()).min(3),
    publishedAt: z.coerce.date(),
  }),
});

/**
 * Reseñas REALES publicadas por alumnos en la ficha pública de Hotmart (2026-09-22),
 * citadas textualmente y atribuidas con enlace. Sustituyen a los 8 testimonios
 * placeholder del lanzamiento. Se muestran como cita visible; no van al JSON-LD.
 */
const testimonials = defineCollection({
  loader: file('./src/content/testimonials.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    courseSlug: z.string(),
    text: z.string().max(400),
    rating: z.number().min(1).max(5),
    date: z.coerce.date(),
    source: z.literal('Hotmart'),
    sourceUrl: z.string().url(),
  }),
});

/**
 * Blog: artículos cluster informacionales (estudio de keywords 2026-09-22).
 * Regla anti-canibalización: la keyword primaria de un artículo NUNCA es un
 * "curso de X" (eso pertenece a la money page); cada artículo empuja a UNA
 * money page (`moneyPage`) con un anchor natural.
 * Google Discover: hero >= 1600px de ancho (el build genera 1200px+ para og/schema).
 */
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      /** H1 visible. */
      title: z.string(),
      /** <title> (≤ 60 car. con la keyword al inicio). Si falta, se usa `title`. */
      seoTitle: z.string().max(70).optional(),
      /** Meta description (AIDA, 140-160 car.). */
      description: z.string().min(80).max(170),
      /** og:title pensado para Discover/redes (humano, sin clickbait). */
      discoverTitle: z.string().optional(),
      cluster: z.enum(BLOG_CLUSTER_SLUGS),
      isPillar: z.boolean().default(false),
      /** Slug del artículo pilar al que pertenece este cluster. */
      pillar: z.string().optional(),
      primaryKeyword: z.string(),
      keywords: z.array(z.string()).min(3),
      /** Slug del curso al que empuja el artículo, o `catalogo`. */
      moneyPage: z.enum([...courseSlugsForBlog, 'catalogo'] as [string, ...string[]]),
      moneyAnchor: z.string(),
      hero: image(),
      heroAlt: z.string().min(20),
      author: z.string().default('equipo-editorial'),
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      /** Slugs de artículos relacionados (enlazado interno manual prioritario). */
      related: z.array(z.string()).default([]),
      faqs: z
        .array(z.object({ q: z.string(), a: z.string() }))
        .max(8)
        .default([]),
      draft: z.boolean().default(false),
    }),
});

export const collections = { courses, testimonials, blog };
