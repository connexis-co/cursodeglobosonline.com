import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { CATEGORIES } from './lib/categories';

const categorySlugs = CATEGORIES.map((c) => c.slug) as [string, ...string[]];

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
    /** Solo si el precio es público y verificado (ej. landing Black Friday). */
    priceUSD: z.number().positive().optional(),
    originalPriceUSD: z.number().positive().optional(),
    rating: z.number().min(3.5).max(5).optional(),
    ratingCount: z.number().int().positive().optional(),
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

const testimonials = defineCollection({
  loader: file('./src/content/testimonials.json'),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    citySlug: z.string(),
    countryCode: z.string(),
    courseSlug: z.string().optional(),
    category: z.string().optional(),
    text: z.string().max(320),
    rating: z.number().min(4).max(5),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(180),
    category: z.string().optional(),
    keywords: z.array(z.string()).min(3),
    publishedAt: z.coerce.date(),
  }),
});

export const collections = { courses, testimonials, blog };
