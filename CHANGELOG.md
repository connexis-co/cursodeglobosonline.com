# Changelog

Los cambios notables de este proyecto se documentan aquí. Formato basado en
[Keep a Changelog](https://keepachangelog.com/es/) y [SemVer](https://semver.org/lang/es/).
Generación automática con release-please a partir de Conventional Commits.

## [0.2.0] - 2026-09-22

### Added

- **Blog cluster para Google Discover**: 28 artículos (6 pilares + 22 satélites) salidos de un
  estudio de keywords con Google Ads Keyword Planner (8 países), DataForSEO y Ubersuggest, más
  las consultas reales de GSC. Cada artículo con foto hero propia 2400×1350 (Gemini Nano Banana
  Pro, revisada por un juez), `BlogPosting`, TOC, FAQs, CTA al curso y enlazado pilar ↔ satélites.
- Infraestructura de blog: colección con clusters, pilar y money page; página de artículo y de
  autor (`ProfilePage`), índice por clusters, RSS (`/blog/rss.xml`), `max-image-preview:large`,
  imágenes 16:9/4:3/1:1 ≥ 1200 px para Discover y sitemap de blog con `lastmod` e imágenes.
- **IndexNow** (`scripts/indexnow.mjs`, clave pública en `/public`) con paso automático tras el
  deploy de producción, y `scripts/bing-submit.mjs` para la API de Bing Webmaster.
- `ads.txt` (AdSense de Connexis), `llms-full.txt` y `llms.txt` reescrito con datos verificables.
- `robots.txt` permite explícitamente los crawlers de búsqueda de IA (OAI-SearchBot,
  Claude-SearchBot, PerplexityBot, Google-Extended…).
- `Icon.astro` con 20 iconos de trazo propio; guía de indexación manual para Claude Cowork.

### Changed

- **Anti-canibalización** (datos de GSC 90 d): las 144 páginas curso-ciudad declaran `canonical`
  a la página de curso del país y salen del sitemap; las tarjetas y los chips enlazan a la URL
  canónica; la categoría única pasa a `noindex, follow`; hubs de ciudad con intención propia.
- **Precios reales** verificados en el checkout de Hotmart (22-09-2026): Globoflexia US$25 (antes
  US$49,99), Bouquets US$49,99, Flores US$79,99, Burbuja US$49,99; el precio principal pasa a USD
  con la conversión local como referencia y las tasas recalibradas al tipo de cambio del checkout.
- **Datos estructurados**: `Course` co-tipado con `Product` + `Offer` (precio, `InStock`) =
  product snippet, el formato vigente para páginas de afiliado; `provider` = productor real;
  `WebSite` y `Organization` con `@id` estables. Sin `aggregateRating`: las valoraciones son de
  Hotmart (terceros) y Google prohíbe agregarlas.
- Titles y metas con AIDA, ≤ 60 y ≤ 160 caracteres y únicas por país; H1 añadido en 19 URLs.
- Logo nuevo: isologo «La G retorcida» (un globo 260 torcido en forma de G) en SVG con trazos,
  variantes clara/oscura/mono/apilada, favicon con modo oscuro e iconos PWA.
- Diseño: contraste AA en todos los CTA (coral-600), iconos SVG en vez de emojis, mega menú que
  se salía del viewport, grids sin huecos, 404 ilustrada, caja de compra fija en desktop.

### Fixed

- La barra de compra móvil nunca aparecía (Tailwind v4 oculta con `translate`, no con `transform`).
- El aviso de país se basaba en el idioma del navegador y ofrecía España a usuarios de Colombia;
  ahora detecta por IP (Cloudflare) con la zona horaria como respaldo.
- 16 URLs del sitemap devolvían 404 (`/{cc}/cursos/eventos|emprendimiento/`) y el footer las
  enlazaba en todas las páginas.
- Los 8 testimonios placeholder y las 3 citas inventadas de las landings de Ads se sustituyeron
  por reseñas reales citadas de Hotmart, con enlace a la ficha pública.
- Mención de Hotmart conforme a sus Términos de uso §5.2: fuera la imitación de su logo y el
  sello «Partner oficial»; queda una mención factual en texto y la nota de marca en el footer.

## [0.1.1] - 2026-08-06

### Added

- **Capa hiperlocal**: 36 hubs `/{cc}/{ciudad}/` y 144 páginas de curso por ciudad con
  párrafo de contexto local propio y 2+ FAQs únicas por ciudad (`src/lib/cities.ts`),
  malla de enlaces entre ciudades y `utm_content` por ciudad. Total: 252 páginas.
- **Salida a producción**: proyecto Cloudflare Pages `cursodeglobosonline-com` con dominios
  apex y www; cutover de DNS ejecutado (el WordPress quedó fuera del dominio).
- Sitemap enviado a Google Search Console vía API (`sc-domain:cursodeglobosonline.com`).
- Imágenes generadas con Gemini: OG image, foto de guirnalda del home, 4 portadas
  fotorrealistas de curso y mockup de certificado (en blanco, sin texto falso).
- Componente `HotmartBadge` (llama + wordmark) en pricing, landings y footer.
- Header tipo plataforma (patrón Open English / aprende.com): barra sólida clara sticky,
  mega menú de Cursos con miniaturas, WhatsApp visible y CTA único "Empezar ahora".
- Bitácora de sesión ([docs/SESSION_LOG.md](docs/SESSION_LOG.md)) para retomar el proyecto
  desde otra sesión.

### Changed

- **Paleta recalibrada** hacia la sobriedad del ecosistema Sably: coral → frambuesa (h14),
  ciruela → tinta índigo (h292), crema casi-blanco; un solo color de acento.
- **Botones sobrios**: sin uppercase, sin glow, `rounded-xl` en vez de pill; fuera el
  texto shimmer del hero y la mayoría de emojis en la UI.
- Globos reimplementados con la anatomía y el keyframe `floating` reales de lbdballoons.com
  (delays negativos, tamaños XL sangrando de sección, parallax scroll-driven nativo);
  los XL se ocultan en móvil para no tapar el contenido.
- Portadas de curso: reemplazadas las imágenes con marca de terceros ("Master Class" de
  Seminarios Online) por fotografías generadas propias, con fallback SVG ilustrado.
- Hero de página de curso y de landings: en móvil el orden pasa a título → imagen →
  cuadro de compra; en desktop se mantiene texto+precio a la izquierda e imagen a la derecha.
- `.claude/launch.json` con `autoPort: true` y Astro respetando `PORT` (el 4321 suele estar
  ocupado por otros proyectos del workspace).

### Fixed

- Redirecciones de ciudades: `/bogota/curso-de-globoflexia/` ahora apunta 301 a su
  equivalente vivo `/co/bogota/curso-de-globoflexia/` en vez de al home del país.

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
