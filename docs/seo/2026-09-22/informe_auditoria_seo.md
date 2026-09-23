# Auditoría SEO técnica y on-page: cursodeglobosonline.com

**Fecha:** 2026-09-22 · **Alcance:** solo lectura (no se editó el repo) · **Estado auditado:** producción (rama `main`, commit `58ebbd4`)

> **Aviso sobre las referencias `archivo:línea`.** Todas las líneas citadas corresponden a `HEAD 58ebbd4` (lo que está en producción). Durante la auditoría, otra tarea del mismo flujo empezó a modificar el working tree en la rama `feat/seo-blog-discover`, sin commit todavía. Esos cambios tocan `Seo.astro`, `seo.ts`, `BaseLayout.astro`, `sitemap.ts`, `CourseLanding.astro`, `content.config.ts`, `blog/index.astro` y `_redirects`, y agregan `public/ads.txt` y `blog/rss.xml.ts`. Por eso las líneas pueden haberse desplazado. La columna **«WT»** de cada hallazgo indica si ese trabajo en curso ya lo cubre.

---

## 0. Método y fuentes (todas las cifras salen de aquí)

| Fuente | Qué se obtuvo | Archivo crudo |
|---|---|---|
| `curl` a producción (2026-09-22 ~11:04 UTC) | HTML de 18 URLs de muestra, cabeceras y códigos de estado | `research/html/*.html`, `*.headers` |
| Parser propio (stdlib + Pillow, Arial 20px para el title y 14px para la meta) | title/meta (caracteres y px), H1/H2, canonical, hreflang, OG, JSON-LD, imágenes | `research/extract_seo.py` → `research/onpage_extract.json` |
| Rastreo completo del sitemap (258 URLs) | status, duplicados, H1, reciprocidad de hreflang, similitud de contenido (Jaccard de 5-gramas) | `research/crawl_sitemap.py` → `crawl_sitemap_summary.json`, `crawl_sitemap_pages.json` |
| Google Search Console (MCP `gsc`, `sc-domain:cursodeglobosonline.com`) | rendimiento 28 días, query×page, países, sitemaps, URL Inspection (8 URLs) y Discover (90 días) | salidas del MCP citadas en el texto |
| PageSpeed Insights API | **No disponible.** Sin key respondió `429 Quota exceeded` y con la service account `403 API not enabled` (activarla sería un cambio de configuración que no me corresponde) | `research/psi/psi_*.json` (errores) |
| Lighthouse 13.4.1 CLI (el mismo motor de PSI, `throttlingMethod: simulate`), local, 2026-09-22 11:07 UTC | Rendimiento, SEO, accesibilidad y buenas prácticas en móvil y escritorio para `/`, `/co/curso-de-globoflexia/` y `/co/bogota/` | `research/psi/lh_*.json`, `research/psi/lighthouse_summary.json` |
| Ubersuggest `pagespeed_audit` (forceUpdate, 2026-09-22) | Lab PSI del dominio y datos de campo (CrUX) | salida del MCP citada en §8 |
| Documentación de Google (WebFetch, 2026-09-22) | search gallery, course-info, course list, review snippet, product snippet, product, article, organization, Discover, changelog `/search/updates`, software-app (co-tipado) | URLs en §6 y §7 |
| `research/hotmart_datos.json` (generado por otra tarea de este flujo el 2026-09-22 desde el checkout `pay.hotmart.com`, con capturas) | Precio real en el checkout, productor y valoraciones de Hotmart. Verifiqué visualmente `hotmart/pay_globoflexia_M47265375C_offDiscount_031016.png` | `research/hotmart_datos.json`, `research/hotmart/` |
| Repo (solo lectura) | Código de title, meta, H1 y schemas; estudio de keywords previo (`docs/seo/2026-08-06_estudio-keywords-ubersuggest.md`) | — |

**Lo que no se pudo obtener:** INP de campo por URL (no hay key de la CrUX API; Ubersuggest solo devuelve CLS, FCP y LCP de campo), PSI oficial por URL (cuota agotada) y datos de Discover (GSC no devuelve filas en 90 días, lo que indica que el sitio no aparece en Discover).

---

## 1. Resumen ejecutivo

1. **Hay 16 URLs del sitemap que devuelven 404** (`/{cc}/cursos/eventos/` y `/{cc}/cursos/emprendimiento/` en los 8 países), y **el footer de todas las páginas enlaza a 2 de ellas**. En la URL Inspection de GSC, `/co/cursos/eventos/` aparece como «Not found (404)».
2. **Hay canibalización real, medida en GSC.** Para la query «curso de globoflexia» compiten al menos 6 URLs: `/mx/curso-de-globoflexia/` (posición 24,1), `/co/curso-de-globoflexia/` (65,7), `/co/bucaramanga/…` (73,8), `/co/medellin/…` (66,2), `/co/barranquilla/…` (80,6) y la URL vieja `/barranquilla/…` (89,8). Para «curso de decoracion con globos» (91 impresiones, posición media 32,6) hay más de 12 URLs repartidas entre `/`, `/co/`, hubs de ciudad y hasta `/pe/curso-de-globos-burbuja/`. Las 144 páginas curso-ciudad comparten entre el 77 % y el 85 % del texto con la página curso-país (Jaccard de 5-gramas: 0,848 entre `/co/curso-de-globoflexia/` y `/co/bogota/curso-de-globoflexia/`). *WT: el canonical curso-ciudad → curso-país y su salida del sitemap ya están en curso.*
3. **Los 8 testimonios visibles, con nombre, ciudad y estrellas, son placeholders inventados.** Así lo registran `docs/plans/2026-08-06_reconstruccion-frontend.md:37` y `docs/SESSION_LOG.md:83`. Hay riesgo de confianza y legal (reseñas falsas), bloquean cualquier `aggregateRating` y contradicen la pauta de Google sobre reseñas falsas añadida el 2026-07-24.
4. **La mayoría de los rich results que prevé el código ya no existen.** Google retiró **Course info** (documentación eliminada el 2025-09-09) y **FAQ** (aviso del 2026-05-08). **Course list solo funciona en inglés.** La URL Inspection de GSC detecta únicamente **Breadcrumbs** en las 8 URLs revisadas. La vía que sigue viva para mostrar precio y estrellas es el **product snippet**: página de afiliado con `Product` + `Offer`, co-tipado `["Course","Product"]`.
5. **Hay desajuste de precio y de proveedor.** La página muestra **$100.000 COP** para Globoflexia; el checkout de Hotmart desde Colombia mostró **84.479 COP**, con lista de 168.959 COP y cupón del 50 %. La lista real es **US$49,99**, no US$50. El JSON-LD declara como `provider` a «Curso de Globos Online», pero el productor en Hotmart es **MasterClasses.La®**.
6. **Faltan H1 en 19 URLs indexables:** catálogo ×8, categoría ×8, `/nosotros/`, `/contacto/` y `/sitemap/`, además de `/blog/`. La causa es que `SectionHeading` siempre renderiza `<h2>`.
7. **Titles y metas demasiado largos:** 157 de 242 titles pasan de 60 caracteres (los de curso miden entre 591 y 648 px y se cortan) y 153 metas pasan de 160 caracteres (las de curso-ciudad, entre 172 y 195). En México el CTR es **2,05 %** (391 impresiones), frente a **6,48 %** en Colombia.
8. **Rendimiento móvil en laboratorio:** LCP de **10,9 s** en curso y **10,5 s** en ciudad, y **CLS 0,165** en la home, causado por el swap de la fuente Fraunces. La página carga **891 KB de JS** (curso, móvil), casi todo de tags: GTM, dos propiedades GA4 vía Google tag gateway, Google Ads, Meta Pixel y Clarity. Los datos de campo (CrUX, vía Ubersuggest) marcan LCP, CLS y FCP como «FAST», así que es un problema de laboratorio y de crecimiento, no una caída actual.
9. **Discover: 0 datos.** Producción no tiene `max-image-preview:large`, ni feed, ni artículos, ni imágenes de al menos 1200 px por página (el `og:image` es el mismo para todo el sitio). *WT: robots, RSS y la infraestructura del blog ya están en curso.*
10. **ads.txt:** en producción `/ads.txt` devuelve **404** (2026-09-22). En el working tree ya existe `public/ads.txt` con la línea que diste. El `pub-` identifica la **cuenta** de AdSense, no el sitio, así que sirve para cualquier dominio monetizado con esa misma cuenta, siempre que el dominio esté agregado en AdSense → Sitios.

---

## 2. Línea base con datos reales (GSC)

- **28 días (MCP `get_performance_overview`):** 166 clics · 2.921 impresiones · CTR 5,68 % · posición media 12,9.
- **Páginas con más impresiones (2026-08-24 → 2026-09-21):** son los **hubs de ciudad**: `/co/barranquilla/` (485 impresiones, 31 clics, posición 10,7), `/co/medellin/` (292, 20, 8,7) y `/co/bucaramanga/` (238, 18, 25,8). Las URLs viejas de WordPress todavía reciben impresiones: `/medellin/` (212), `/cali/` (232) y `/peru/` (70); todas responden 301 correctamente. `/mx/curso-de-globoflexia/` tiene 189 impresiones y **1 clic (CTR 0,53 %, posición 17,7)**.
- **Por país:** Colombia 1.575 impresiones y CTR 6,48 % · México 391 y **2,05 %** · España 304 y 9,54 % · Estados Unidos 158 y 2,53 %.
- **Sitemaps en GSC:** `sitemap-index.xml`, con 258 URLs y 0 errores (última descarga 2026-09-19). También sigue enviado **`sitemap_index.xml` de 2022**, descargado por última vez el 2026-09-14, con 2 warnings (es el de Rank Math, que ahora redirige con 301).
- **URL Inspection (8 URLs):** todas las 200 están «Submitted and indexed», y el canonical que elige Google coincide con el declarado (por ejemplo, en `/mx/curso-de-globoflexia/` y `/co/medellin/curso-de-globos-burbuja/`). El **único rich result detectado es Breadcrumbs**.
- **Discover (2026-06-22 → 2026-09-21):** sin filas.

---

## 3. Hallazgos priorizados

Leyenda: **P0** = corregir ya (roturas, riesgo o pérdida medible) · **P1** = alto impacto, próximo sprint · **P2** = mejora incremental. **WT** = estado en el working tree (`feat/seo-blog-discover`).

### P0-1 · 16 URLs 404 en el sitemap y enlaces rotos en el footer de todo el sitio
- **Evidencia:** el rastreo da 242×200 y **16×404**, todas `/{cc}/cursos/{eventos|emprendimiento}/`. Las páginas de categoría solo se generan para las categorías con cursos (`[category]/index.astro:13`, `activeCategories`), pero el sitemap y el footer recorren **todas** las `CATEGORIES`. GSC confirma el 404 de `/co/cursos/eventos/` (último rastreo 2026-08-13).
- **Cambios:**
  - `src/lib/sitemap.ts:42-50` (`categoriasUrls`): convertir la función en `async`, cargar los cursos con `getCollection('courses')` y filtrar con `CATEGORIES.filter(cat => courses.some(c => c.data.category === cat.slug))` antes del bucle. Ajustar la llamada en `src/pages/sitemaps/[name].xml.ts:20` a `await categoriasUrls()`.
  - `src/components/Footer.astro:70`: cambiar `CATEGORIES.map(` por `activeCategories.map(`, calculando `activeCategories` como en `Header.astro`.
  - Opcional: `_redirects`, `/:cc/cursos/eventos/ /:cc/cursos/ 301` y lo mismo para `emprendimiento`, para limpiar lo que Google ya descubrió.
- **WT:** no está cubierto (el diff de `sitemap.ts` no toca `categoriasUrls`).

### P0-2 · Testimonios placeholder publicados como reales
- **Evidencia:** `src/content/testimonials.json` contiene 8 testimonios «placeholder convincentes» (`docs/plans/2026-08-06_reconstruccion-frontend.md:37`), con nombre, ciudad y estrellas (`TestimonialCard.astro:29` → `<Rating>`). Aparecen en `index.astro:262-280`, `[country]/index.astro:144-160`, `CourseLanding.astro:463-470` y `CityLanding.astro:112-120`. Google añadió el 2026-07-24 una pauta contra reseñas falsas o incentivadas sin divulgar (review snippet), y el daño a la confianza aplica aunque no estén marcadas.
- **Cambio:** retirar las 4 secciones de testimonios hasta tener reseñas reales con consentimiento, o sustituirlas por contenido verificable (por ejemplo, el enlace a la ficha pública de Hotmart con su valoración real, sin marcarla). No crear `aggregateRating` con estos datos. Si se mantiene la sección, que diga explícitamente «Ejemplos ilustrativos» y no lleve estrellas. Por ética, lo recomendado es retirarla.
- **WT:** no está cubierto.

### P0-3 · Canibalización curso-ciudad ↔ curso-país (144 URLs casi duplicadas)
- **Evidencia:**
  - Similitud Jaccard de 5-gramas: 0,848 entre país y ciudad, 0,773 entre Bogotá y Medellín y 0,775 entre CDMX y Guadalajara en Flores.
  - GSC reparte «curso de globoflexia» entre 6 URLs con posiciones de 24 a 90.
  - Las 144 URLs curso-ciudad sumaron muy pocas impresiones (entre 1 y 25 cada una).
- **Cambios:**
  1. Canonical de `/{cc}/{ciudad}/{curso}/` a `/{cc}/{curso}/`. *WT: `CourseLanding.astro` añade `canonicalPath`.*
  2. Sacarlas del sitemap. *WT: `sitemap.ts` (`cursosUrls`) ya lo hace.*
  3. **Todavía falta:** que los enlaces internos apunten a la URL canónica.
     - `CourseCard.astro:21-25`: quitar la rama `city ?` y enlazar siempre a `/${country.code}/${course.id}/`.
     - `CityLanding.astro:105`: dejar de pasar `{city}` a `CourseCard`.
     - `CourseLanding.astro:529-537` (chips «Este curso también en otras ciudades»): enlazar a los hubs `/${country.code}/${c.slug}/`, no a más curso-ciudad.
  4. En `CourseLanding.astro:65` y `:80-86`, usar la URL canónica (curso-país) en `courseUrl` y en el breadcrumb del JSON-LD cuando haya `city`.
  5. **Excepción basada en datos:** solo conservar indexables las combinaciones con demanda propia medida. Por ejemplo, «curso de globoflexia en puebla» (70/mes en México, Ubersuggest 2026-08-06) y «cursos de globoflexia en cdmx» (18 impresiones en GSC), y siempre con al menos un 40 % de contenido único.

### P0-4 · El precio mostrado no coincide con el del checkout y el `provider` es incorrecto
- **Evidencia:** la página `/co/curso-de-globoflexia/` muestra «$100.000 COP» (≈ US$25 × `usdRate` 4000, `countries.ts:33`). El checkout de Hotmart desde Colombia muestra **84.479 COP** (lista 168.959 COP, cupón 031016 del 50 %, tipo de cambio 3.203,64 más un spread del 5,5 %), según la captura y `hotmart_datos.json`. La lista real es **US$49,99**, pero la página y la FAQ dicen «de $50 a $25» (`curso-de-globoflexia.mdx:44` y `:73`). El productor en Hotmart es **MasterClasses.La®**, pero `seo.ts:101-105` declara `provider` = Curso de Globos Online. Hotmart no nombra instructor.
- **Cambios:**
  - `curso-de-globoflexia.mdx:44`: `originalPriceUSD: 49.99`.
  - `curso-de-globoflexia.mdx:73`: «pasas de US$49,99 a US$25».
  - `countries.ts:33`: `usdRate: 3380` (3.203,64 × 1,055 del checkout, redondeado), o mejor aún, mostrar **US$ como precio principal** y el valor local con «aprox.» (`CourseLanding.astro:218-225`).
  - `seo.ts` (`courseSchema`): `provider` debe ser el productor real (ver `schema_objetivo.json`).
  - Eliminar `instructor` salvo que JP confirme la fuente.

### P1-1 · Faltan H1 en 19 URLs indexables, además de `/blog/`
- **Evidencia:** en el rastreo, `no_h1` = `/{cc}/cursos/` ×8, `/{cc}/cursos/decoracion-con-globos/` ×8, `/nosotros/`, `/contacto/` y `/sitemap/`. `/blog/` tampoco tiene H1. Lighthouse marca además `heading-order`.
- **Cambios:**
  - `src/components/SectionHeading.astro:2-9`: añadir la prop `as?: 'h1' | 'h2' = 'h2'` y en la línea 18 renderizar `<Tag class=…>` con `const Tag = as`.
  - Usar `as="h1"` en `[country]/cursos/index.astro:43`, `[country]/cursos/[category]/index.astro:52`, `nosotros/index.astro:14`, `contacto/index.astro:22`, `sitemap/index.astro:18` y `blog/index.astro:17` (esta última ya se está reescribiendo en WT; verificar allí).

### P1-2 · Titles y metas: longitud, alineación con la keyword y CTR (reescrituras en §5)
- **Evidencia:**
  - Títulos de curso en producción: 612 px (CO Globoflexia), 615 px (Bouquets), 621 px (Burbuja) y 648 px (curso-ciudad CDMX). A partir de unos 600 px se truncan y el sufijo de país o ciudad no se ve.
  - Metas de curso-ciudad de 172 a 195 caracteres, construidas como «{Curso} para {Ciudad}, {País}: Aprende…» (mayúscula tras los dos puntos).
  - 4 grupos de metas idénticas: la misma de cada curso repetida en los 8 países.
- **Archivos:** `CourseLanding.astro:101-104` (fórmula), `src/content/courses/*.mdx:3` (`metaTitle`), `[country]/index.astro:55-56`, `CityLanding.astro:45-46`, `[country]/cursos/index.astro:23-24`, `[category]/index.astro:29-30`, `index.astro:60-61`, `blog/index.astro:12-13` y `nosotros/index.astro:9-10`.

### P1-3 · La categoría única duplica el catálogo, y su title canibaliza al país
- **Evidencia:** solo existe `decoracion-con-globos` y contiene los 4 cursos, así que `/co/cursos/decoracion-con-globos/` repite la grilla de `/co/cursos/` (121 frente a 140 palabras). Su title, «Cursos de Decoración con Globos en Colombia 🎈 Online», es casi idéntico al de `/co/` («Curso de Decoración con Globos en Colombia 🎈 Online»). En GSC, `/us/cursos/decoracion-con-globos/` tiene 55 impresiones en posición 51,2 y aparece para queries genéricas.
- **Cambio:** mientras haya una sola categoría activa, poner `noindex, follow` en `[category]/index.astro` o `canonicalPath` hacia `/{cc}/cursos/`. Quitarla de `categoriasUrls()` y del breadcrumb del curso (`CourseLanding.astro:84`). Reactivarla cuando existan al menos 2 categorías con cursos distintos.

### P1-4 · Datos estructurados desalineados con lo que Google soporta en 2026 (detalle en §6)
- **Evidencia:** en `seo.ts:94-139`, el tipo `Course` apunta a Course info, que Google retiró. `numberOfCredits: c.lessonsCount` (`seo.ts:108`) es un uso incorrecto (significa créditos académicos). Falta `image`. No hay `@id` ni `@graph`. `FAQPage` se emite en home, país, ciudad y curso (entre 9 y 11 preguntas) sin posibilidad de rich result. En `seo.ts:53`, `sameAs` de la Organization apunta a los perfiles de **Sably**, no a los de esta marca.
- **Cambio:** aplicar las plantillas de `schema_objetivo.json`:
  - co-tipado `["Course","Product"]` con `Offer` solo donde el precio sea visible y verificado;
  - `@graph` con `#organization` y `#website`;
  - `provider` = productor real;
  - eliminar `numberOfCredits`;
  - mover los perfiles de Sably a `parentOrganization.sameAs`.
- **WT:** `ORG_ID`, `WEBSITE_ID`, `websiteSchema()` y `blogPostingSchema()` ya están en curso; los cambios en Course y Product no.

### P1-5 · Open Graph genérico y un solo locale
- **Evidencia:** todas las páginas usan `og:image = /og-default.jpg` (1200×685) y `og:locale = es_CO`, incluidas `/mx/`, `/es/` y `/us/` (`Seo.astro:31-32`). Las portadas de curso existen, pero miden 900×900.
- **Cambios:**
  - En `CourseLanding.astro:116-125`, pasar `ogImage` con una versión de la portada de al menos 1200 px de ancho, generada con `astro:assets` `getImage({ width: 1200, height: 630, fit: 'cover' })`.
  - En `Seo.astro:32`, derivar el locale de `country.hreflang` (`es-MX` → `es_MX`) y pasarlo desde `BaseLayout`.
- **WT:** ya existen las props `ogImage*` y `ogType`, pero `CourseLanding` todavía no pasa la portada.

### P1-6 · Rendimiento móvil (laboratorio) y peso de los tags
- **Evidencia:** en §8.
- **Cambios:**
  - `BaseLayout.astro:65-73` carga GA4 (`gtag/js`) **además** de GTM (`:57-64`). La red muestra dos propiedades GA4 (G-WVTB898GPH y G-PHN6J5MTX6), un doble disparo que ya estaba documentado en el plan (línea 35). Consolidar en una sola vía (GTM **o** gtag) y retirar el snippet de `PUBLIC_GA4_ID` si GTM ya dispara GA4.
  - Mover Meta Pixel (`:74-81`) y Clarity dentro de GTM, con disparo tras `window.load` o tras la primera interacción.
  - CLS de la home (0,165, fuente Fraunces): en `global.css`, importar solo el eje `wght` de `@fontsource-variable/fraunces` (hoy se sirve `fraunces-latin-full-normal`, de 119 KB), `preload` del woff2 del H1 y un fallback con métricas ajustadas (`size-adjust`, `ascent-override`).
  - Imágenes: pasar las portadas y `decoracion-guirnalda.jpg` a `<Picture>` de `astro:assets` (AVIF/WebP y `srcset`). Lighthouse estima un ahorro de hasta 456 KiB en la home de escritorio; `cover-burbuja.jpg` pesa 196 KB para 900×900.

### P1-7 · Discover y el blog (requisitos en §7)
- En producción faltan `max-image-preview:large`, RSS, artículos con imagen de al menos 1200 px, autor con página propia y fechas.
- **WT:** robots `max-image-preview:large`, `rss.xml`, `BlogPosting`, autores e imagen hero ya están en curso. **Falta:** la página `/blog/` sin H1 (verificar) y ProfilePage en los autores.

### P1-8 · Limpieza en GSC (manual, fuera del repo)
- Retirar de GSC el sitemap `https://cursodeglobosonline.com/sitemap_index.xml` (Rank Math, enviado el 2022-12-15).
- Tras corregir P0-1, volver a enviar `sitemap-index.xml`.

### P2 (mejoras incrementales)
| # | Hallazgo | Archivo:línea (HEAD) | Cambio |
|---|---|---|---|
| P2-1 | La página 404 declara canonical `/404/`, y `/404/` responde 308 → `/404` | `Seo.astro:22` | No emitir `<link rel="canonical">` cuando `noindex` es verdadero |
| P2-2 | `robots.txt` bloquea `/landing/` y esas páginas además llevan `noindex`: Google no ve el noindex. AdsBot ignora `User-agent: *`, así que Ads no se ve afectado | `public/robots.txt:3` | Quitar `Disallow: /landing/` y dejar que actúe el `noindex` (o no cambiar nada, porque el riesgo es bajo) |
| P2-3 | `/images/*` con caché `immutable` de 1 año y nombres sin hash: si se reemplaza una imagen con el mismo nombre, queda obsoleta | `public/_headers:10-11` | Usar `astro:assets` (con hash) o `max-age=604800` |
| P2-4 | No hay `lastmod` en ningún sitemap | `sitemap.ts:74-82` | Emitir `lastmod` real (`publishedAt` o `updatedAt` de los cursos, fecha de cambio de contenido). *WT: solo lo cubre para el blog* |
| P2-5 | Emojis en los titles (🎈🌻): Google puede quitarlos y ocupan píxeles | `*.mdx:3` y los titles de las páginas | Quitarlos de los titles de curso y probarlos solo en la home y el país, con prueba de CTR en GSC |
| P2-6 | `FAQPage` sin rich result (retirado); se repiten 3 FAQ geo con plantilla en 242 páginas | `seo.ts:67-77`, `CourseLanding.astro:49-63` | Mantener las FAQ visibles; opcionalmente dejar de emitir el JSON-LD `FAQPage` (menos peso) |
| P2-7 | Accesibilidad 94-97: `color-contrast` y `heading-order` | Varios | Se corrige con P1-1 y ajustando los tokens de contraste |
| P2-8 | Las redirecciones legadas no incluyen `/cartagena/*`. `/cartagena/curso-de-globoflexia/` devuelve 404; no hay evidencia de que existiera en WordPress, así que primero conviene revisar `docs/auditoria` | `_redirects:29-33` | Añadir `/cartagena/* /co/cartagena/:splat 301` solo si la URL existía |
| P2-9 | `html lang="es"` fijo | `BaseLayout.astro:45` | Opcional: `lang={country?.hreflang ?? 'es'}` |

---

## 4. Resultados on-page por tipo de página (producción, 2026-09-22)

| Página | Title (car./px) | Meta (car./px) | H1 | Canonical | hreflang | JSON-LD | HTML |
|---|---|---|---|---|---|---|---|
| `/` | 55 / 521 | 161 / 1001 ⚠ | «Cursos de decoración con globos para vivir de las fiestas» | self | 9 (x-default `/`) | Organization, FAQPage | 134,6 KB (18,8 KB brotli) |
| `/co/` | 51 / 496 | 151 / 952 ⚠ | «Cursos de decoración con globos en Colombia» | self | 9 | Org, FAQ, Breadcrumb | 103,6 KB |
| `/mx/` | 49 / 475 | 149 / 938 ⚠ | «… en México» | self | 9 | igual | 103,5 KB |
| `/co/cursos/` | 48 / 475 | 145 / 909 | **ninguno** | self | 9 | Org, Breadcrumb | 62,1 KB · 121 palabras |
| `/co/cursos/decoracion-con-globos/` | 52 / 506 | 176 / 1098 ⚠ | **ninguno** | self | 9 | Org, Breadcrumb | 63,4 KB · 140 palabras |
| `/co/curso-de-globoflexia/` | 66 / **612** ⚠ | 139 / 885 | «Curso de Globoflexia en Colombia — 100% online con certificado» | self | 9 (x-default `/co/`) | Org, Course(+Offer USD 25), FAQ(9), Breadcrumb | 124,7 KB |
| `/co/curso-de-bouquets-de-globos/` | 64 / **615** ⚠ | 136 / 866 | ok | self | 9 | Course (sin offers) | 116,4 KB |
| `/co/curso-de-flores-con-globos/` | 62 / 572 | 129 / 807 | ok | self | 9 | igual | 124,0 KB |
| `/co/curso-de-globos-burbuja/` | 66 / **621** ⚠ | 131 / 845 | ok | self | 9 | igual | 117,6 KB |
| `/mx/curso-de-globoflexia/` | 64 / 591 | 139 / 885 (idéntica a CO) | ok | self | 9 | igual CO | 124,7 KB |
| `/co/bogota/` | 50 / 485 | 147 / 930 ⚠ | «Cursos de decoración con globos en Bogotá» | self | 0 | Org, FAQ, Breadcrumb | 79,8 KB · 485 palabras |
| `/co/bogota/curso-de-globoflexia/` | 64 / 591 | **183 / 1170** ⚠ | ok | **self (debería ser el curso-país)** | 0 | Course, FAQ(11), Breadcrumb(5) | 130,0 KB |
| `/mx/cdmx/curso-de-flores-con-globos/` | 70 / **648** ⚠ | **187 / 1188** ⚠ | ok | self | 0 | igual | 128,9 KB |
| `/blog/` | 50 / 468 | 120 / 784 | **ninguno** | self | 0 | Org | 52,7 KB · 54 palabras |
| `/nosotros/` | 35 / 345 | 146 / 936 | **ninguno** | self | 0 | Org | 62,0 KB · 166 palabras |

**En todas las páginas:** `og:image = og-default.jpg`, `og:locale = es_CO`, `og:type = website`, sin meta robots (nada de `max-image-preview`). Todas las imágenes tienen `width`/`height` y `alt`; las 8 con `alt=""` son miniaturas decorativas del menú, lo cual es correcto. hreflang: **0 errores de reciprocidad** en las 242 URLs 200, con x-default presente.

---

## 5. Reescrituras de title y meta (AIDA/PAS, sin clickbait, sin datos inventados)

**Reglas:**
- Singular «Curso de…», porque es la forma con volumen: «curso de decoración con globos» tiene 260/mes en Colombia y 590 en México; «curso de globoflexia», 90 en Colombia y 590 en México (Ubersuggest, 2026-08-06).
- Título de 60 caracteres o menos y unos 580 px como máximo.
- Meta de 140 a 155 caracteres y 920 px o menos.
- Precio **solo** en Globoflexia (US$25 con 50 % sobre la lista de US$49,99, verificado en el checkout). En el resto no se pone precio mientras no se muestre en la página.
- Todos los textos se generan desde los datos (`discountPct`, `priceUSD`, `lessonsCount`) para que no queden desactualizados.

### 5.1 Mapa anti-canibalización (una intención por URL)
| URL | Keyword objetivo | Diferenciador |
|---|---|---|
| `/` (x-default) | curso de decoración con globos online (global/marca) | «4 cursos», sin país |
| `/{cc}/` | curso de decoración con globos online **en {país}** | país + moneda |
| `/{cc}/cursos/` | cursos de globos / catálogo y precios | comparativa |
| `/{cc}/cursos/decoracion-con-globos/` | — (noindex mientras sea la única categoría) | — |
| `/{cc}/{ciudad}/` | curso de decoración con globos **en {ciudad}** (+ «clases de globos {ciudad}») | contexto local; «100% online» explícito para no engañar a quien busca «presencial» |
| `/{cc}/{curso}/` | curso de {X} (+ online, + país) | la money page |
| `/{cc}/{ciudad}/{curso}/` | ninguna (canonical al curso-país) | — |
| `/blog/*` | informacional (cómo hacer, ideas, precios, materiales, negocio) | nunca «curso de X» |

### 5.2 Propuestas medidas (Arial, 20 px para el title y 14 px para la meta)
| Página | Title propuesto | car./px | Meta propuesta (car./px) |
|---|---|---|---|
| Home `/` (`index.astro:60-61`) | Curso de Decoración con Globos Online \| 4 Cursos con Certificado | 64/593 (en el límite; alternativa: «Curso de Decoración con Globos Online con Certificado», 53/496) | 4 cursos online de decoración con globos: globoflexia, bouquets, flores y globos burbuja. Certificado, acceso de por vida y garantía de 7 días. (143/877) |
| País `/co/` (`[country]/index.astro:55-56`) | Curso de Decoración con Globos Online en Colombia \| Certificado | 63/587 | Aprende decoración con globos desde cualquier ciudad de Colombia: 4 cursos online con certificado, pago en COP y garantía de 7 días de Hotmart. (143/920) |
| País `/mx/` | Curso de Decoración con Globos Online en México \| Certificado | 61/566 | (misma plantilla con México y MXN) |
| Catálogo `/co/cursos/` (`cursos/index.astro:23-24`) | Cursos de Globos Online en Colombia: Catálogo y Precios | 55/520 | Compara los 4 cursos de globos: globoflexia (50% OFF), bouquets, flores y globos burbuja. Temario, número de clases y certificado de cada uno. (142/901) |
| Ciudad `/co/bogota/` (`CityLanding.astro:45-46`) | Curso de Decoración con Globos en Bogotá: 100% Online | 53/517 | ¿Buscas curso de decoración con globos en Bogotá? Estudia online, sin traslados: 4 cursos con certificado y pago en COP. Garantía de 7 días. (140/889) |
| Ciudad CDMX | Curso de Decoración con Globos en CDMX: 100% Online | 51/512 | (misma plantilla) |
| Curso Globoflexia CO (`CourseLanding.astro:101`) | Curso de Globoflexia Online en Colombia: 50% OFF (US$25) | 56/544 | ¿Quieres animar fiestas y cobrar por ello? Aprende globoflexia desde cero: 23 videos, certificado y acceso de por vida. US$25 (antes US$49,99). (PAS, 143/900) |
| Curso Globoflexia MX | Curso de Globoflexia Online en México: 50% OFF (US$25) | 54/523 | ídem |
| Curso Bouquets CO | Curso de Bouquets de Globos Online en Colombia \| 17 Clases | 58/554 | Aprende a hacer bouquets de globos para vender: 17 videos del inflado al presupuesto, bono de desayuno sorpresa y certificado. 100% online. (139/887) |
| Curso Flores CO | Curso de Flores con Globos Online en Colombia \| 31 Clases | 57/535 | Más de 15 flores con globos, de la de 5 pétalos a la orquídea, en 31 videos con estructuras y centros de mesa. Certificado y acceso de por vida. (144/894) |
| Curso Burbuja CO | Curso de Globos Burbuja Online en Colombia \| 18 Clases | 54/511 | Aprende a decorar globos burbuja: confeti, tassels, mármol, degradados y el globo unicornio. 18 videos online con acceso permanente. (132/838) |
| Blog `/blog/` | Blog de Decoración con Globos: Guías, Ideas y Precios | 53/493 | Guías prácticas de decoración con globos: cómo hacer arcos, qué materiales usar, cuánto cobrar por un montaje y cómo montar tu negocio. (135/868) |
| Nosotros | Quiénes Somos \| Curso de Globos Online (Sably) | 46/441 | (se mantiene la actual, 146/936) |

**Fórmula para `CourseLanding.astro:101-104`** (sustituye `metaTitle` y `description`):
```ts
const offerTag = hasPrice && discountPct ? `: ${discountPct}% OFF (US$${d.priceUSD})` : ` | ${d.lessonsCount} Clases`;
let metaTitle = `${d.title} Online en ${placeName}${offerTag}`;
if (metaTitle.length > 60) metaTitle = `${d.title} en ${placeName}${offerTag}`; // p. ej. «Estados Unidos»
const description = d.metaDescription ?? d.shortDescription; // nuevo campo por curso (≤155 car.), sin prefijo de ciudad
```
Con la fórmula, 29 de los 32 títulos curso×país quedan por debajo de 60 caracteres; los 3 de «Estados Unidos» pasan a la variante corta (55-57 caracteres). Añadir `metaDescription: z.string().max(155).optional()` en `content.config.ts:12-61`.

**¿Precio o descuento en el title o la meta?** Sí para Globoflexia: es un dato verificado, y «50% OFF (US$25)» responde a la intención comercial y diferencia el resultado en la SERP. En la meta va el ancla «antes US$49,99». En los demás cursos todavía no, porque la página no muestra el precio y Google exige que el precio del marcado sea visible. Además, un precio de lista sin descuento aporta poco CTR. **No usar «desde US$25» en la home ni en el país:** los otros cursos cuestan US$49,99 o US$79,99, pero esos precios no se muestran en la página.

---

## 6. Datos estructurados: estado de Google a 2026-09-22 y recomendación

| Pregunta | Respuesta (fuente) |
|---|---|
| ¿Course info sigue vigente? | **No.** Aviso de retirada el 2025-06-12 y documentación eliminada el 2025-09-09: «no longer shown in Google Search results» (developers.google.com/search/docs/appearance/structured-data/course-info; changelog `/search/updates`). |
| ¿Course list? | Sigue en la search gallery (actualizada el 2026-06-15), pero **solo en inglés**. Exige al menos 3 cursos y Carousel, y el `name` del curso no puede llevar precios ni descuentos (…/structured-data/course, actualizada el 2026-09-08). **No aplica a este sitio en español.** |
| ¿FAQ? | **Retirado.** Aviso de retirada el 2026-05-08. Desde 2023 solo se mostraba en sitios gubernamentales o de salud (…/faqpage; `/search/updates`). |
| ¿Estrellas en Course o en Product? | El review snippet sigue admitiendo **Course** y **Product** como `itemReviewed` (…/review-snippet, actualizada el 2026-09-08). Requisitos: `ratingValue` más `ratingCount` o `reviewCount`, y reseñas **visibles** en la página. Prohibido agregar reseñas de otros sitios («Don't aggregate reviews or ratings from other websites»), y desde el 2026-07-24 también las reseñas falsas o incentivadas sin divulgar. Las páginas `LocalBusiness`/`Organization` con reseñas controladas por la propia entidad no son elegibles. **Consecuencia:** las valoraciones de Hotmart (Burbuja 4,0 con 20, Bouquets 4,4 con 5, Globoflexia 5,0 con 1) **no** se pueden marcar aquí, y los placeholders tampoco. |
| ¿Product + Offer para un producto digital? | Google no restringe por tipo de producto (…/product, actualizada el 2025-12-10). **Product snippet** es para páginas donde no se compra directamente, como las de **afiliados**; **merchant listing** es para páginas donde el cliente compra al propio sitio (…/product-snippet, actualizada el 2026-09-08). Como la compra ocurre en Hotmart, **aplica product snippet**. Requiere `name` y al menos uno entre `offers`, `review` o `aggregateRating`. `Offer` recomendado: `price`, `priceCurrency`, `availability` y `priceValidUntil`. Este último se **omite** porque no hay fecha de fin verificada del cupón. |
| ¿`["Course","Product"]` es válido? | Sí. schema.org admite multi-tipo, y Google documenta explícitamente el co-tipado (software-app: `["VideoGame","MobileApplication"]`, actualizada el 2026-09-08). Recomendado **solo** para Globoflexia mientras sea el único curso con precio visible; en los demás, `Course` sin `offers`. |
| ¿Organization? | En la home o en Nosotros (no hace falta en todas las páginas). Logo de al menos 112×112, `url`, `sameAs` (perfiles **propios**), `contactPoint`, `email`, `description` (…/organization, actualizada el 2026-09-08). No añadir `SearchAction`: el sitelinks search box se retiró en 2024. |
| ¿Breadcrumb? | Activo y ya detectado por GSC. Mantenerlo, quitando el nivel de categoría si esta pasa a `noindex`. |
| ¿Article/BlogPosting? | Activo. `headline`, `image` en varias proporciones (16:9, 4:3, 1:1, al menos 50K píxeles), `datePublished`/`dateModified` en ISO 8601, `author` como Person con `url`, y cada autor en su propio nodo (…/article, actualizada el 2026-09-08). |

**JSON-LD objetivo:** `research/schema_objetivo.json` incluye estas plantillas, todas en un único `@graph` con `@id` estables `/#organization` y `/#website`:
- home (Organization completa + WebSite + WebPage);
- curso con precio verificado (co-tipado, Offer US$25, `provider`/`brand`/`seller` = MasterClasses.La, `publisher` = el sitio);
- curso sin precio visible (solo Course);
- fragmento condicional de reseñas reales;
- BlogPosting con autor Person y ProfilePage;
- hub de ciudad (CollectionPage + ItemList + `about` City, **sin LocalBusiness**, porque no hay sede física);
- catálogo (CollectionPage + ItemList).

---

## 7. Google Discover: requisitos actuales y qué falta

Fuente: developers.google.com/search/docs/appearance/google-discover (actualizada el 2026-03-09) y el changelog.

| Requisito | Producción hoy | WT |
|---|---|---|
| Contenido indexado que cumpla las políticas de Discover; no hacen falta etiquetas especiales | Indexado, pero no hay contenido editorial (el blog tiene 54 palabras) | Infraestructura del blog y 1 post de prueba (`_test-post.mdx`, **no publicarlo**) |
| Imagen grande: **al menos 1200 px de ancho**, más de 300K píxeles, preferible 16:9, declarada en `og:image` o schema.org, sin logos ni imágenes con mucho texto | Un solo `og-default.jpg` (1200×685) para todo el sitio; portadas de 900×900 | Hero de 1600×900 más `og:image:width`/`height` |
| `max-image-preview:large` | **Falta** (no hay meta robots) | Añadido en `Seo.astro` |
| Títulos que resuman el contenido, sin clickbait ni sensacionalismo | No aplica todavía | `discoverTitle` en el schema del blog: vigilar que no sea clickbait |
| Contenido oportuno, con historia o perspectiva propia; E-E-A-T (autor real, experiencia) | No hay autores | `authors.ts` y `/blog/autor/`: usar **personas reales**; si no las hay, Organization |
| Fechas visibles y `datePublished`/`dateModified` coherentes | No aplica | En curso |
| Feed RSS/Atom con `<link rel="alternate">` (feature «Follow»; según la documentación, hoy solo en inglés y en algunos mercados) | No hay feed; `/feed/` redirige con 301 a `/` | `blog/rss.xml.ts` más `/feed/` → `/blog/rss.xml` |
| Buena experiencia de página | LCP en laboratorio móvil de 5,2 a 10,9 s | Ver §8 |

---

## 8. Core Web Vitals

### 8.1 Lighthouse 13.4.1 (el motor de PSI; throttling simulado, 2026-09-22)
| URL | Estrategia | Perf | LCP | CLS | TBT | FCP | SI | Elemento LCP |
|---|---|---|---|---|---|---|---|---|
| `/` | móvil | 67 | **5,2 s** | **0,165** | 260 ms | 1,9 s | 1,9 s | H1 `.animate-fade-slide-up` |
| `/` | escritorio | 100 | 0,7 s | 0,007 | 0 ms | 0,3 s | 0,5 s | — |
| `/co/curso-de-globoflexia/` | móvil | 70 | **10,9 s** | 0 | 150 ms | 2,4 s | 3,2 s | `img` portada (fetchpriority high) |
| `/co/curso-de-globoflexia/` | escritorio | 100 | 0,4 s | 0,001 | 0 ms | 0,3 s | 0,5 s | — |
| `/co/bogota/` | móvil | 67 | **10,5 s** | 0 | 200 ms | 2,5 s | 3,4 s | párrafo `hook` |
| `/co/bogota/` | escritorio | 100 | 0,3 s | 0,001 | 0 ms | 0,3 s | 0,5 s | — |

**Categorías:** SEO 100 · Accesibilidad 94-97 (`color-contrast`, `heading-order`) · Buenas prácticas 77 (cookies de terceros e issues en DevTools).

**Desglose del LCP observado (traza sin throttling):** en el curso, TTFB 240 ms, carga del recurso 142 ms y **render delay 963 ms**; en Bogotá, render delay de **1.137 ms**. El LCP simulado se dispara porque el grafo de dependencias incluye unos **891 KB de JS**.

**Principales recursos (curso, móvil):**
- GTM-KKP7WL8Q: 159 KB.
- Google tag gateway `/zd7n/*`: 165 + 197 + 203 KB (dos GA4 más Google Ads AW-11406599830).
- Meta Pixel: 111 KB.
- Clarity: 25 KB.
- Fuentes: 149 KB (Fraunces «full», 119 KB).

JS sin usar: GTM 117 KB, `/zd7n/` 87 + 73 + 70 KB y fbevents 44 KB.

**CLS de la home:** Lighthouse lo atribuye al «Web font loaded» (`fraunces-latin-full-normal.CFFu7zhK.woff2`), que desplaza el div decorativo del hero.

### 8.2 Ubersuggest `pagespeed_audit` (dominio, 2026-09-22)
- **Laboratorio móvil:** LCP 12,6 s · TBT 390 ms · CLS 0,027 · FCP 2,6 s.
- **Laboratorio escritorio:** LCP 3,2 s · TBT 449 ms.
- **Campo (CrUX):** CLS, FCP y LCP **FAST**. INP de campo no disponible.
- **Oportunidades:** JS sin usar, 382 KB (2,3 s en móvil); redirecciones, 630 ms (probablemente al probar la variante `http`/`www`; el sitio redirige con 301 a `https://cursodeglobosonline.com/`).

**INP:** no hay dato de campo por URL. El proxy de laboratorio, TBT, está entre 150 y 260 ms en móvil, un rango con riesgo moderado. Las acciones de P1-6 (menos JS de terceros y carga diferida) también son las que más ayudan al INP.

---

## 9. Rastreo, indexación y arquitectura

- **robots.txt:** correcto (`Allow: /`, `Disallow: /landing/`, `Sitemap:`); ver P2-2.
- **Sitemaps:** hay un índice con 11 sitemaps: pages (58 URLs), categorías (24, **16 en 404**), blog (0) y cursos por país (176, de las cuales 144 son curso-ciudad). No hay `lastmod`. Todo lo indexable está incluido, excepto `/blog/` cuando no hay posts (correcto). Con el WT, el sitemap de cursos queda en 32 URLs canónicas.
- **hreflang:** clústeres de 8 países más x-default para home, país, catálogo, categoría y curso. Reciprocidad: 0 errores. Las páginas de ciudad no llevan hreflang, lo cual es correcto porque no tienen equivalentes por país.
- **Canonicals:** todos apuntan a sí mismos y Google los respeta. El problema es de duplicidad (P0-3), no de declaración.
- **Contenido por plantilla:** país contra país da una similitud de 0,599 (aceptable con hreflang). Hub de Bogotá contra hub de Medellín, 0,428 (el `hook` y las FAQ locales diferencian). Curso-ciudad contra curso-país, 0,848 (casi duplicado, P0-3). Páginas delgadas: catálogo (121 palabras), categoría (140), `/nosotros/` (166) y `/blog/` (54).
- **Enlazado interno:**
  - La home y el país enlazan a los 4 cursos y al catálogo.
  - Los hubs de ciudad enlazan a las páginas curso-ciudad (hay que cambiarlo, ver P0-3).
  - El footer enlaza a 2 categorías inexistentes (P0-1).
  - Falta enlazar desde los hubs de ciudad al país con el anchor «curso de decoración con globos online», y desde el curso a los hubs de ciudad con más impresiones (Barranquilla, Medellín, Bucaramanga).
- **404:** hay página 404 con `noindex` y status 404 real. Detalle menor en P2-1.
- **Redirecciones:** las URLs legadas de WordPress (`/curso-globoflexia/`, `/mexico/*`, `/peru/*`, `/{ciudad}/*`, `/feed/`, sitemaps viejos) responden con 301 de un solo salto. `http://` y `www` redirigen con 301 al host canónico. Cloudflare aplica 308 para añadir la barra final (`/co` → `/co/`).

---

## 10. ads.txt (pedido del usuario)

- **Producción:** `https://cursodeglobosonline.com/ads.txt` devuelve **404** (2026-09-22).
- **Working tree:** ya existe `public/ads.txt` con `google.com, pub-6213862553989716, DIRECT, f08c47fec0942fa0`, sin commit todavía.
- **¿Vale la misma línea que en academiadeconduccion.academy?** Sí, si ambos dominios se monetizan con la **misma cuenta de AdSense**: el `pub-…` identifica la cuenta de editor, no el dominio, y `f08c47fec0942fa0` es el ID de certificación TAG de Google, igual para todos. Además hay que **añadir el dominio en AdSense → Sitios** y esperar la verificación. Si el sitio no muestra anuncios de AdSense, publicar el ads.txt no hace daño.

---

## 11. Archivos generados en `research/`
- `informe_auditoria_seo.md` (este informe)
- `schema_objetivo.json` (plantillas JSON-LD)
- `extract_seo.py` y `onpage_extract.json` (on-page de 18 URLs de muestra)
- `crawl_sitemap.py`, `crawl_sitemap_summary.json` y `crawl_sitemap_pages.json` (258 URLs del sitemap)
- `html/*.html` y `html/*.headers` (HTML y cabeceras de producción)
- `psi/lh_*.json` y `psi/lighthouse_summary.json` (Lighthouse); `psi/psi_*.json` (errores 429/403 de la API PSI, como evidencia)
