> **Migración EmDash en desarrollo:** consulta [la guía de ambientes, contenido y operación](docs/migration/README.md). Las instrucciones anteriores de Cloudflare Pages que siguen abajo describen la producción previa.

# 🎈 cursodeglobosonline.com

> Plataforma de cursos online de decoración con globos — Filial de [Sably](https://sably.co)

[![Deploy](https://img.shields.io/badge/deploy-Cloudflare%20Pages-orange)](https://cursodeglobosonline.com)
[![Version](https://img.shields.io/github/v/release/connexis-co/cursodeglobosonline.com)](https://github.com/connexis-co/cursodeglobosonline.com/releases)

## Stack

- **Framework**: [Astro 7](https://astro.build) (output estático, islands-ready)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) vía `@tailwindcss/vite`
- **Tipografía**: Fraunces Variable (display) + Nunito Sans Variable (texto)
- **Deploy**: [Cloudflare Pages](https://pages.cloudflare.com)
- **Analytics**: Google Tag Manager (`GTM-KKP7WL8Q`) + GA4 vía GTM
- **Checkout**: Hotmart (enlaces `hotm.art` con hotlink de afiliado preservado)

## Inicio rápido

```bash
git clone git@github.com:connexis-co/cursodeglobosonline.com.git
cd cursodeglobosonline.com
npm install
cp .env.example .env   # completar PUBLIC_GTM_ID=GTM-KKP7WL8Q
npm run dev
```

## Scripts

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo (localhost:4321) |
| `npm run build` | Build de producción (`dist/`) |
| `npm run preview` | Preview del build |
| `npm run check` / `lint` | `astro check` (TypeScript + validaciones) |
| `npm run deploy` | Build + deploy manual a Cloudflare Pages |

## Estructura

```
src/
├── components/     # Componentes Astro (Header, CourseCard, FaqAccordion…)
├── content/        # Cursos (MDX con datos REALES de la auditoría) + testimonios
├── layouts/        # BaseLayout (GTM, SEO, schemas) + LandingLayout (Ads, noindex)
├── lib/            # countries, categories, hotmart, seo, sitemap, analytics, site
├── pages/          # Rutas: /, /{cc}/, /{cc}/{curso}/, /{cc}/cursos/{categoria}/,
│   └── landing/    # /landing/meta|google/{curso}/ (noindex, para Ads)
└── styles/         # global.css — sistema de diseño (paleta OKLCH, animaciones)
```

## Arquitectura de URLs

- `/{cc}/` — home por país (co, mx, pe, ec, cl, ar, es, us) con hreflang completo
- `/{cc}/{curso-slug}/` — página de curso (slug siempre `curso-de-*`)
- `/{cc}/cursos/` y `/{cc}/cursos/{categoria}/` — catálogo y categorías
- `/landing/meta|google/{curso}/` — landings de Ads (noindex)
- Redirecciones 301 del sitio WordPress anterior en [public/_redirects](public/_redirects)

## Reglas de datos (importante)

- **Enlaces Hotmart**: son los REALES del sitio anterior (`hotm.art/*-crashing`), conservan el
  hotlink de afiliado. No cambiar el host ni el slug.
- **Descuento**: Globoflexia usa `?offDiscount=031016` (50% real, $50→$25 USD). No hay cupones
  alfanuméricos para estos productos hoy.
- **Sin números inventados**: precio/rating/estudiantes solo se publican si el dato es real
  (frontmatter opcional). Social proof del sitio: +100 certificados, +80 emprendimientos (auditados).

## Despliegue

- **Staging**: push a `develop` → deploy automático (rama develop en Cloudflare Pages)
- **Producción**: push a `main` → deploy automático + release-please
- **Manual**: `npm run deploy` (requiere `CLOUDFLARE_API_TOKEN` y `CLOUDFLARE_ACCOUNT_ID` en el entorno)

## Variables de entorno

| Variable | Descripción |
|---|---|
| `PUBLIC_GTM_ID` | Contenedor GTM (existente: `GTM-KKP7WL8Q`) |
| `PUBLIC_GA4_ID` | GA4 directo (dejar vacío: se mide vía GTM para no duplicar) |
| `PUBLIC_META_PIXEL_ID` | Meta Pixel (pendiente de crear) |
| `PUBLIC_HOTMART_AFFILIATE` | Afiliado extra (los hotm.art ya llevan hotlink) |

## Convenciones

Conventional Commits (commitlint + husky) · Git Flow (`main`/`develop`/`feature/*`) ·
SemVer · Changelog automático con release-please. Ver [CONTRIBUTING.md](CONTRIBUTING.md).

## Ecosistema Sably

| Sitio | Propósito |
|---|---|
| [sably.co](https://sably.co) | Hub principal |
| **cursodeglobosonline.com** | Filial: decoración y globos (este repo) |
| [academiadebelleza.edu.co](https://academiadebelleza.edu.co) | Filial: belleza |

## Licencia

Privado — © Connexis / Sably
