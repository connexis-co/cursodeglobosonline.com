export const SITE = {
  name: 'Curso de Globos Online',
  url: 'https://cursodeglobosonline.com',
  tagline: 'Aprende decoración con globos. Convierte cada fiesta en tu negocio.',
  description:
    'Cursos online de decoración con globos: globoflexia, bouquets, flores y globos burbuja. Certificado de estudios incluido y acceso de por vida.',
  email: 'contacto@cursodeglobosonline.com',
  parent: {
    name: 'Sably',
    url: 'https://sably.co',
  },
  /**
   * TODO(JP): el sitio anterior tenía iconos sociales sin enlace (href="#").
   * Mientras no existan perfiles propios, apuntamos al ecosistema Sably.
   */
  social: {
    instagram: 'https://instagram.com/sably.co',
    tiktok: 'https://tiktok.com/@sably.co',
    facebook: 'https://facebook.com/sably.co',
    youtube: 'https://youtube.com/@sably-co',
  },
  /** Social proof REAL del sitio anterior (contadores de la home auditada). */
  stats: {
    students: '+100',
    ventures: '+80',
    supportVideos: '+50',
    countries: 8,
  },
} as const;

/** Endpoint de leads: Fase 2 lo sirve el backend Laravel (cursodeglobosonline-core). */
export const LEADS_ENDPOINT = import.meta.env.PUBLIC_LEADS_ENDPOINT ?? '';
/** CDN de assets (Cloudflare R2). Vacío en dev → sirve desde /public. */
export const CDN_URL = import.meta.env.PUBLIC_CDN_URL ?? '';

/** GTM-KKP7WL8Q es el contenedor existente del sitio (auditoría 2026-08-06). */
export const GTM_ID = import.meta.env.PUBLIC_GTM_ID ?? '';
export const GA4_ID = import.meta.env.PUBLIC_GA4_ID ?? '';
export const META_PIXEL_ID = import.meta.env.PUBLIC_META_PIXEL_ID ?? '';
