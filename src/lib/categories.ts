import type { IconName } from './icons';

/** Icono SVG propio de cada categoría (ver `Icon.astro`). */
export type CategoryIcon = Extract<IconName, 'globo' | 'fiesta' | 'maletin'>;

export interface Subcategory {
  slug: string;
  name: string;
}

export interface Category {
  slug: string;
  name: string;
  /** Solo para texto prellenado de WhatsApp; en la interfaz se usa `icon`. */
  emoji: string;
  /** Icono de la interfaz (header, footer, chips): nunca el emoji. */
  icon: CategoryIcon;
  /** Descripción corta para cards y meta descriptions. */
  short: string;
  subcategories: Subcategory[];
}

/** Taxonomía del nicho decoración y globos (plan maestro §4.2). */
export const CATEGORIES: Category[] = [
  {
    slug: 'decoracion-con-globos',
    name: 'Decoración con Globos',
    emoji: '🎈',
    icon: 'globo',
    short:
      'Arcos, guirnaldas orgánicas, columnas, figuras y globoflexia: las técnicas que separan un arreglo casero de un montaje profesional.',
    subcategories: [
      { slug: 'arcos', name: 'Arcos de globos' },
      { slug: 'columnas', name: 'Columnas y torres' },
      { slug: 'centros-de-mesa', name: 'Bouquets y centros de mesa' },
      { slug: 'figuras', name: 'Figuras y esculturas' },
      { slug: 'globoflexia', name: 'Globoflexia artística' },
      { slug: 'lettering', name: 'Lettering con globos' },
    ],
  },
  {
    slug: 'eventos',
    name: 'Eventos',
    emoji: '🎉',
    icon: 'fiesta',
    short:
      'Montajes completos para bodas, baby showers, cumpleaños, quinces y eventos corporativos, de la cotización al desmontaje.',
    subcategories: [
      { slug: 'bodas', name: 'Decoración para bodas' },
      { slug: 'baby-showers', name: 'Baby showers y gender reveals' },
      { slug: 'cumpleanos', name: 'Cumpleaños y fiestas infantiles' },
      { slug: 'quinceaneros', name: 'Quinceañeros' },
      { slug: 'corporativos', name: 'Eventos corporativos' },
      { slug: 'graduaciones', name: 'Graduaciones' },
    ],
  },
  {
    slug: 'emprendimiento',
    name: 'Emprendimiento en Decoración',
    emoji: '💼',
    icon: 'maletin',
    short:
      'Monta tu negocio de decoración: cotiza por montaje, consigue clientes con Instagram y crea alianzas que te llenen la agenda.',
    subcategories: [
      { slug: 'negocio', name: 'Cómo montar tu negocio' },
      { slug: 'cotizacion', name: 'Pricing y cotización' },
      { slug: 'marketing', name: 'Marketing para decoradores' },
      { slug: 'fotografia', name: 'Fotografía de eventos' },
    ],
  },
];

export function getCategory(slug: string): Category {
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) throw new Error(`Categoría desconocida: ${slug}`);
  return category;
}
