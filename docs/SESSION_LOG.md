# Bitácora de sesiones — cursodeglobosonline.com

> La sesión más reciente va primero. Punto de entrada para retomar el proyecto.

---

# Sesión 2026-09-23 — Estrellas propias (estilo kk Star Ratings) y `aggregateRating`

JP pidió estrellas obligatorias con su dato estructurado y un mecanismo para que la gente
califique cada curso, como el plugin kk Star Ratings de WordPress. Plan y resultado:
`docs/plans/2026-09-23_valoraciones-estrellas.md`.

- **Widget** `StarRating.astro` en el hero de cada ficha y en un bloque «¿Tomaste el curso?
  Califícalo» bajo las reseñas: voto con un clic, cambio de voto y sincronía entre instancias.
- **API** `functions/api/ratings.ts` (Pages Function) + **D1** `cursodeglobosonline-ratings`
  (`…-preview` para previews), configurada en `wrangler.jsonc`. Migraciones en `migrations/`
  (`npm run db:migrate`). Secreto `RATING_SALT` en los dos entornos del proyecto de Pages.
- **Schema:** `aggregateRating` en el `Course`+`Product` desde el primer voto real, con el mismo
  dato que se ve en la página. Hotmart sigue aparte, visible y fuera del schema.
- **Build y refresco:** el build lee `/api/ratings` de producción; `ratings-refresh.yml`
  recompila cada día si cambiaron los votos y avisa por IndexNow.
- **Pruebas:** `npm run test:ratings` (27 comprobaciones) corre en CI contra una D1 local; también
  pasó en un preview real de Cloudflare.
- **Entorno:** wrangler está autenticado en este Mac (OAuth, permisos D1 y Pages), así que no hace
  falta pegar tokens. El disco quedó en 97 % (27 GB libres). El scratchpad temporal se borró y con
  él el `secrets.env` de la sesión anterior: las credenciales ya no están en disco.

---

# Sesión 2026-09-22 — SEO, blog para Discover, marca y anti-canibalización

## 0. TL;DR

| Ítem | Estado |
|---|---|
| Rama | `feat/seo-discover-blog` (worktree `~/dev/cursodeglobosonline.com`, fuera de iCloud) |
| Blog | 28 artículos (6 pilares) con foto hero propia y datos verificados — PR #18 |
| Canibalización | Curso-ciudad → `canonical` al curso-país; categoría única `noindex` |
| Precios | Verificados en el checkout de Hotmart el 22-09-2026 (US$25 / 49,99 / 79,99 / 49,99) |
| Marca | Isologo «La G retorcida» en SVG + iconografía propia; mención de Hotmart conforme a su §5.2 |
| Indexación | IndexNow en el deploy, Bing Webmaster API, ads.txt, llms.txt y llms-full.txt |

## 1. Qué pidió JP (en orden) y qué se hizo

1. **Auditoría y SEO general** → auditoría técnica y on-page completa (`docs/seo/2026-09-22/informe_auditoria_seo.md`).
2. **Blog fuerte para Google Discover** → mapa temático con Google Ads Keyword Planner (8 países),
   DataForSEO y Ubersuggest + GSC; 28 artículos escritos por agentes con guía editorial anti-IA,
   revisión adversarial (SEO/canibalización + verificación de datos) y fotos hero con Nano Banana Pro
   juzgadas por un revisor escéptico.
3. **Estrellas, precio y disponibilidad en los datos estructurados** → `Course` + `Product` con
   `Offer`; **sin** `aggregateRating`, porque las valoraciones son de Hotmart (terceros) y Google
   prohíbe agregar reseñas de otros sitios. Las reseñas reales se muestran visibles con su fuente.
4. **Títulos y metas con AIDA** → reescritos ≤ 60 / ≤ 160 caracteres, únicos por país, con precio
   y descuento solo donde son reales.
5. **Auditoría de diseño y logo** → 17 hallazgos aplicados; isologo nuevo elegido por un panel de
   3 jueces entre 3 conceptos.
6. **«Se posicionan las páginas de ciudad y no las de curso»** → confirmado con GSC y corregido
   (canonical, enlaces internos a la URL canónica, intención por tipo de página).
7. **IndexNow/Bing, ads.txt y llms.txt** → hechos; guía para pedir indexación manual en GSC con
   Claude Cowork (`docs/seo/cowork-indexacion-manual-gsc.md`).
8. **Logo de Hotmart** → NO se usa: sus Términos de uso §5.2 prohíben usar su marca o logotipo
   para publicitar un producto; se dejó una mención factual en texto y una nota de marca.

## 2. Decisiones que NO deben revertirse sin hablar con JP

- **`aggregateRating` solo con votos propios del sitio** (widget de estrellas → D1); nunca con
  datos de Hotmart (riesgo de acción manual por marcado engañoso).
- **Nada de imitar el logo de Hotmart** ni decir «partner oficial»: el sitio es afiliado.
- **Curso-ciudad canónico al curso-país**: revertirlo devuelve la canibalización medida en GSC.
- **Precios en USD como principal**, con el equivalente local marcado como aproximado.
- **Reseñas reales citadas de Hotmart** en lugar de testimonios inventados.

## 3. Entorno (importante)

- El disco del Mac está al 99 % y iCloud desaloja archivos de `~/Documents` («dataless»), lo que
  cuelga git, los hooks y los builds. Por eso:
  - `node_modules` → `node_modules.nosync` (symlink) en la carpeta de Documentos;
  - el repositorio git vive en `~/.git-dirs/cursodeglobosonline.com.git` (la carpeta tiene un
    archivo `.git` con `gitdir:`);
  - **el trabajo activo se hace en el worktree `~/dev/cursodeglobosonline.com`**.
- Liberar espacio en el disco es el arreglo de fondo.

## 4. Dónde está todo

- Estudio y auditorías: `docs/seo/2026-09-22/` · plan: `docs/plans/2026-09-22_seo-blog-discover.md`
- Mapa temático y guías de redacción/imágenes: en el scratchpad de la sesión (copia en `docs/seo/`)
- Kit de marca: `public/brand/` · sistema de diseño: `docs/DESIGN_SYSTEM.md`

---

# Sesión 2026-08-06 — reconstrucción del frontend

> Hilo real de la conversación con JP, decisiones tomadas y estado exacto al cierre.
> **Punto de entrada para retomar el proyecto desde otra sesión.** Lee también
> [ROADMAP.md](ROADMAP.md) (qué falta), [plans/2026-08-06_reconstruccion-frontend.md](plans/2026-08-06_reconstruccion-frontend.md)
> (por qué de cada decisión) y [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) (reglas visuales).

## 0. TL;DR del estado

| Ítem | Estado |
|---|---|
| Sitio | ✅ **En producción** en https://cursodeglobosonline.com (cutover DNS hecho) |
| Páginas | 252 estáticas (8 países + 36 ciudades + 144 cursos hiperlocales + landings) |
| Repo | `connexis-co/cursodeglobosonline.com` — `main` + `develop`, tag v0.1.0 |
| Deploy | Cloudflare Pages, proyecto `cursodeglobosonline-com` (apex + www) |
| GSC | sitemap-index.xml enviado (204 OK) a `sc-domain:cursodeglobosonline.com` |
| Build | `npm run build` → 252 págs · `astro check` → 0 errores |
| Dev server | `.claude/launch.json` con `autoPort:true` (4321 lo ocupa otro proyecto) |

## 1. Cronología de la conversación (qué pidió JP y qué se hizo)

1. **Prompt maestro inicial** — reconstrucción completa siguiendo 23 secciones (auditoría,
   referencias, anti-IA, arquitectura, SEO, tracking, repos, Git Flow, CI/CD).
   → 3 agentes en paralelo: auditoría del WordPress vivo, análisis de referencias
   (LBD/academiadebelleza/aprende/sably) y estudio de keywords con Ubersuggest.
2. **JP entrega credenciales** (Cloudflare, Hotmart, GitHub PATs, service account Google) y pide
   usar AgentMemory + graphify + APIs de Gemini/GitHub.
   → Se verifican: token CF válido, Hotmart OAuth OK (cuenta **afiliada**, no lista productos
   del productor), service account con acceso GSC.
3. **"configura Ubersuggest: competencia, keywords por ubicación, long-tails"**
   → El proyecto ya existía (dic-2022) con 8 ubicaciones; se añadió el competidor #1
   (balloonsbyluzpaz.com → 15/15 lleno). Keywords **300/300 LLENO**: no se borró nada sin
   permiso; queda pendiente una lista de swap.
4. **"las imágenes dicen Master Class / Seminarios Online, cámbialas"** + **"copia bien las
   animaciones y estilo de globos de lbdballoons.com"** + **"buen design system"**
   → Se borran las 4 imágenes con marca de terceros, se crean portadas SVG ilustradas y se
   reimplementan los globos con la anatomía y el keyframe `floating` reales de LBD
   (delays negativos, XL sangrando, parallax scroll-driven nativo).
5. **"usa la API de Gemini para generar imágenes"** (key entregada)
   → `gemini-2.5-flash-image`: OG image, foto de guirnalda, 4 portadas fotorrealistas de curso
   y mockup de certificado. El primer certificado salió con texto gibberish (delataba IA) →
   **regenerado en blanco** con sello dorado.
6. **"respeta la estructura por ciudades, hazlo más hiperlocal"**
   → `CITIES_ENABLED=true`, `lib/cities.ts` con contenido local único por las 36 ciudades,
   rutas `[country]/[item]/` (curso o ciudad) + `[country]/[item]/[curso]/`.
7. **"despliega en el dominio, genera sitemaps, deja todo indexado y enviado a GSC"**
   → Proyecto Pages creado, custom domains apex+www, DNS conmutado de los A/AAAA del
   WordPress (95.216.153.73) a CNAME → Pages. Sitemap enviado a GSC vía API.
8. **"el diseño se ve muy IA, sably.co se ve menos IA, mejóralo"**
   → Paleta recalibrada (coral→**frambuesa** h14, ciruela→**tinta índigo** h292, crema
   casi-blanco), botones sin uppercase/glow/pills → `rounded-xl` sobrio, fuera shimmer,
   menos emojis en UI, badge de **Hotmart** con la llama naranja.
9. **"mejora el header, básate en Open English / aprende.com"**
   → Header **sólido claro sticky** (fuera el transparente oscuro), **mega menú de Cursos**
   con los 4 cursos en miniatura + categorías + tarjeta de asesoría, WhatsApp visible,
   CTA único "Empezar ahora", selector de país con check. Mobile: cursos con thumbnail.
10. **"en mobile pon la imagen antes del cuadro de precio"**
    → Hero de curso y de landings reordenado con grid: móvil = título → imagen → compra;
    desktop intacto (texto+precio izq., imagen der.).

## 2. Decisiones que NO deben revertirse sin hablar con JP

- **Enlaces Hotmart verbatim**: `hotm.art/*-crashing` conserva el hotlink de afiliado
  (302 → `go.hotmart.com/X76953266Q?ap=7766` → `pay.hotmart.com/M47265375C?ref=…`).
  El builder solo añade UTMs; **nunca** cambiar host ni slug.
- **Sin números inventados**: precio/rating/estudiantes son opcionales en el schema; solo
  Globoflexia publica precio ($50→$25 vía `offDiscount=031016`, único descuento verificado).
- **GA4 `G-WVTB898GPH` NO se migró**: el sitio viejo hacía doble firing con `G-PHN6J5MTX6`
  (que vive dentro de GTM-KKP7WL8Q). Consolidar desde GTM, no desde el código.
- **Carpeta local con typo**: `cursodeblogosonline.com` ("blogos"). No renombrar — rompe el
  workspace de Antigravity de JP.
- **Sin cupones textuales**: SABLY40 es del catálogo sably.co, no aplica a estos productos.

## 3. Pendientes al cierre (orden sugerido)

**Bloqueados por JP (requieren su cuenta/decisión):**
1. **Purgar caché de Cloudflare** — el `robots.txt` viejo de WP quedó cacheado; el token API
   no tiene permiso Cache Purge. Dashboard → Caching → Purge Everything (1 click).
2. **Branch protection** en GitHub — requiere plan Pro para repos privados de la org.
3. **Rotar credenciales** compartidas por chat (CF, Hotmart, GitHub PATs, Gemini).
4. **Consolidar propiedades GA4** y publicar en GTM los triggers de la taxonomía nueva.
5. **Precios reales** de Bouquets/Flores/Burbuja (no eran públicos; no se inventaron).
6. **Testimonios reales** de Hotmart para reemplazar los 8 placeholders.

**Trabajo técnico siguiente (ver ROADMAP v0.2):**
7. Blog: cluster "como hacer arcos de globos" (3.700 búsq./mes MX+CO, SD 26-32).
8. Swap de keywords en Ubersuggest (300/300 lleno — proponer bajas de bajo valor).
9. Meta Pixel (no existía en el sitio viejo) + tag de conversión de Google Ads.
10. Test A/B landings de Ads vs páginas SEO (medir por `utm_term`).

## 4. Mapa rápido del código

```
src/
├── lib/          countries.ts (8 países + ciudades) · cities.ts (contenido hiperlocal)
│                 categories.ts · hotmart.ts (builder de checkout) · seo.ts (schemas)
│                 sitemap.ts · analytics.ts (trackEvent) · site.ts (constantes)
├── components/   Header (mega menú) · CourseLanding (14 secciones) · CityLanding
│                 AdsLanding · Balloons (anatomía LBD) · CourseCover (SVG fallback)
│                 CertificateShowcase · HotmartBadge · LeadForm · StickyCta · FaqAccordion
├── content/      courses/*.mdx (4 cursos reales) · testimonials.json (8 placeholders)
└── pages/        index · [country]/ · [country]/[item]/ (curso|ciudad)
                  [country]/[item]/[curso]/ · [country]/cursos/[category]/
                  landing/meta|google/[curso]/ · sitemaps/[name].xml.ts
```

## 5. Grafo de conocimiento

`graphify-out/graph.html` (331 nodos, 21 comunidades). En una sesión nueva:
`/graphify query "¿cómo se conecta el offDiscount con el builder de Hotmart?"`.
God nodes: la auditoría del WordPress (26 aristas), el plan de reconstrucción (22) y
`COUNTRIES` (20) — el sitio entero gira alrededor de esos tres.
