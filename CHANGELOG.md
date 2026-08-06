# Changelog

Los cambios notables de este proyecto se documentan aquí. Formato basado en
[Keep a Changelog](https://keepachangelog.com/es/) y [SemVer](https://semver.org/lang/es/).
Generación automática con release-please a partir de Conventional Commits.

## [0.1.0] - 2026-08-06

### Added

- Reconstrucción completa del frontend en Astro 7 + Tailwind CSS v4 (72 páginas estáticas).
- Sistema de diseño propio: paleta OKLCH (coral/ciruela/crema/aqua/sol/lila), Fraunces + Nunito Sans,
  animaciones de globos CSS, ondas divisorias, scroll-driven animations nativas.
- Arquitectura geo: 8 países (`/{cc}/`) con hreflang completo y precios localizados.
- 4 cursos reales migrados con temarios verbatim de la auditoría (Globoflexia, Bouquets,
  Flores con Globos, Globos Burbuja) y enlaces Hotmart de afiliado intactos.
- Página de curso de 14 secciones (hero con precio ancla real, temario, instructor,
  certificado, garantía, FAQ con schema, relacionados, sticky CTA mobile).
- Landings dedicadas para Meta Ads y Google Ads (`/landing/*`, noindex) con copy diferenciado.
- Menú mobile full-page con stagger, selector de 8 países, GeoToast de detección de mercado.
- SEO: schema Course/FAQPage/BreadcrumbList/Organization, sitemaps segmentados por país,
  robots.txt, redirecciones 301 completas desde el sitio WordPress anterior.
- Tracking: GTM (GTM-KKP7WL8Q) + dataLayer con taxonomía completa (view_course, begin_checkout,
  generate_lead, click_whatsapp, copy_discount_code, select_country, view_faq, scroll_depth).
- CI/CD con GitHub Actions (CI en PRs, deploy staging/producción a Cloudflare Pages) +
  commitlint + husky + release-please.

### Fixed

- Bug del sitio anterior: las páginas de Globos Burbuja mezclaban el CTA con el checkout
  del curso de Bouquets (ahora cada curso enlaza solo a su producto).
- Titles inconsistentes del sitio anterior (ej. la página genérica de Flores decía "en México").
