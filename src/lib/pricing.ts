import type { CollectionEntry } from 'astro:content';

type CourseData = CollectionEntry<'courses'>['data'];

export interface CoursePricing {
  /** Hay precio público verificado en el checkout de Hotmart. */
  hasPrice: boolean;
  /** Hay precio de lista tachado real (descuento aplicado por el enlace). */
  hasDiscount: boolean;
  discountPct?: number;
}

/** Única fuente de verdad para precio/descuento de un curso (evita lógicas divergentes). */
export function coursePricing(d: CourseData): CoursePricing {
  const hasPrice = d.priceUSD !== undefined;
  const hasDiscount = hasPrice && d.originalPriceUSD !== undefined && d.originalPriceUSD > d.priceUSD!;
  const discountPct =
    d.discountPct ?? (hasDiscount ? Math.round((1 - d.priceUSD! / d.originalPriceUSD!) * 100) : undefined);
  return { hasPrice, hasDiscount, discountPct };
}

/** "US$25" · "US$49,99" (coma decimal, como lo muestra Hotmart en español). */
export function usd(value: number): string {
  return Number.isInteger(value) ? `US$${value}` : `US$${value.toFixed(2).replace('.', ',')}`;
}
