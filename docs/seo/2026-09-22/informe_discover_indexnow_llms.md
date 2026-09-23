# Informe: Google Discover, IndexNow + Bing Webmaster API, visibilidad en IA (LLMs) y ads.txt

**Sitio:** https://cursodeglobosonline.com · **Fecha:** 2026-09-22 · **Tipo:** investigación de requisitos (solo lectura sobre el repo)

> Regla aplicada: cada dato viene de una fuente oficial descargada (copia en `fuentes_discover_indexnow_llms/`) o de una llamada de API/HTTP hecha hoy (resultados en `bing_wmt_readonly_check.json`, `cloudflare_readonly_check.json`, `gsc_discover_baseline_2026-09-22.json`, `live_site_checks_2026-09-22.txt`). Lo que es **opinión/inferencia** va marcado como tal. Lo que no se pudo verificar se dice explícitamente.

> **Contexto importante detectado:** en el repo local hay trabajo **sin commitear** en la rama `feat/seo-blog-discover` (otro agente/sesión): `public/ads.txt`, `public/<INDEXNOW_KEY>.txt`, `src/pages/blog/rss.xml.ts`, `Seo.astro` con `max-image-preview:large`, `blogPostingSchema`, páginas de autor con `ProfilePage`, etc. Este informe **no toca** esos archivos; al final hay una sección "Qué ya cubre la rama y qué falta".

---

## 0. Resumen de hallazgos (TL;DR)

| Tema | Estado hoy en producción | Hallazgo clave (fuente) | Acción |
|---|---|---|---|
| Discover | 0 filas de Discover en GSC (2026-06-01 → 2026-09-21) | Imagen ≥1200 px de ancho, >300.000 px, 16:9, con `max-image-preview:large`; nada de clickbait; no hace falta marcado especial (Google, doc actualizada 2026-03-09) | Desplegar la rama (ya pone `max-image-preview:large`), hero 16:9 propio por artículo, fechas + autoría visibles |
| Follow / RSS | `/blog/rss.xml` → 404 | **Google eliminó la función Follow de Discover** y su guía (changelog 2025-11-19) | El RSS sigue siendo útil (lectores, Bing, automatización), pero **no** para "Seguir" en Discover: corregir el comentario en `rss.xml.ts` |
| Discover core update | — | 1.ª actualización solo de Discover: 2026-02-05, 21 días; más relevancia local, menos clickbait, experiencia "tema por tema"; lanzada en inglés/EE. UU. y "se ampliará a todos los países e idiomas en los próximos meses" (blog de Google) | Clúster temático profundo sobre decoración con globos (encaja con "expertise topic-by-topic") |
| IndexNow | Archivo de clave → 404 (está en `public/` sin desplegar) | Clave 8–128 caracteres `[a-zA-Z0-9-]`, archivo `{key}.txt` UTF-8 en la raíz, POST a `api.indexnow.org/indexnow`, máx. 10.000 URLs/POST; se comparte con Bing, Yandex, Seznam, Naver, Yep, Internet Archive y Amazonbot (`searchengines.json`) | Tras desplegar, POST automático en el workflow de producción con las URLs cambiadas |
| Bing Webmaster API | **Key válida; sitio verificado** | `GetUrlSubmissionQuota`: **DailyQuota 10.000 / MonthlyQuota 90.000**; `GetFeeds`: `sitemap-index.xml` "Success", 210 URLs, último rastreo 2026-09-20; `GetCrawlStats` 2026-09-21: InIndex 247 | Eliminar en Bing WMT el sitemap viejo `https://www.cursodeglobosonline.com/sitemap.xml` (doble redirección); enviar el RSS con `SubmitFeed` tras desplegar |
| Cloudflare Crawler Hints | `crawlhints_enabled: false` | Crawler Hints envía a IndexNow según MISS de caché (docs Cloudflare, 2026-08-14) | Opcional; el envío explícito por CI es más fiable (inferencia: el HTML responde `cf-cache-status: DYNAMIC`) |
| llms.txt | 200, cumple estructura v1/v2 | Spec **v2 (modificada 2026-08-10)**: versiones `.md` de páginas + `rel="alternate" type="text/markdown"` y `rel="describedby"`. **`llms-full.txt` no está en la spec.** **Google Search ignora llms.txt** (guía oficial de IA, 2026-07-10) | Mantener; añadir sección Blog/Guías, FAQs con hechos verificables y (opcional) `.md` de las 4 money pages |
| Crawlers de IA | robots.txt `User-agent: * Allow: /` → todos permitidos | Bloquear **OAI-SearchBot** = no aparecer en ChatGPT search; **PerplexityBot** = no aparecer en Perplexity; **Claude-SearchBot** = menos visibilidad en Claude; **Google-Extended** controla entrenamiento *y grounding* en Gemini Apps/Vertex, no Search | Mantener todo permitido (recomendación). Revisar en el dashboard de Cloudflare que "Block AI bots"/AI Crawl Control no los bloquee (el token no tiene permiso para leerlo) |
| FAQ rich results | — | **Google retiró los rich results de FAQ** (no se muestran desde 2026-05-07) | FAQs visibles sí (útiles para usuarios, Bing/LLMs); el schema FAQPage ya no da rich result en Google |
| ads.txt | 404 | La **misma línea** sirve en todos los dominios de la misma cuenta AdSense ("Paste the line into each of your ads.txt files", AdSense Help). La de academiadeconduccion.academy: `google.com, pub-6213862553989716, DIRECT, f08c47fec0942fa0` (verificada hoy, 200) | Desplegar `public/ads.txt` (ya existe con esa línea) **y** añadir el sitio en AdSense › Sitios › +Nuevo sitio → revisión |

---

## 1. Google Discover

### 1.1 Requisitos oficiales (fuente: [Get on Discover](https://developers.google.com/search/docs/appearance/google-discover), "Last updated 2026-03-09 UTC")

- **Elegibilidad:** automática si la página está **indexada** y cumple las **políticas de contenido de Discover**. "No special tags or structured data are required". Ser elegible no garantiza aparecer. El contenido **antiguo** puede aparecer si es útil y relevante.
- **Imágenes (recomendación explícita):**
  - **≥ 1200 px de ancho**.
  - **> 300.000 píxeles totales** (ej. 1280×720 = 921.600).
  - **Relación 16:9**. Si recortas tú, que la parte importante quede en el recorte que pones en `og:image`; evita aplicar la relación de aspecto de forma automática.
  - Habilitado con **`max-image-preview:large`** (o AMP).
  - Indicar la imagen preferida con **schema.org** o **`og:image`**; **no usar imágenes genéricas (logo)** ni **imágenes con mucho texto**.
- **Títulos:** "Use page titles and headlines that capture the essence of the content".
- **Evitar:** clickbait (detalles engañosos o exagerados en título/snippet/imagen, u ocultar información clave) y sensacionalismo (morbo, provocación, indignación).
- **Contenido que funciona:** "timely for current interests, tells a story well, or provides unique insights".
- **Contenido que Discover puede no recomendar:** solicitudes de empleo, peticiones, **formularios**, repositorios de código, sátira sin contexto.
- **Page experience** buena (enlace a la guía de page experience).
- **Tráfico variable:** es "less predictable or dependable" que el de búsqueda por palabras clave; tómalo como **complemento**. Los cambios pueden no tener relación con "the quality or publishing frequency of their content".

**`max-image-preview` (fuente: [robots meta tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag), 2026-03-24):** valores `none | standard | large`; `large` = "A larger image preview, up to the width of the viewport". Aplica a web search, Images, **Discover**, Assistant.

**Imagen preferida (fuente: [Image SEO](https://developers.google.com/search/docs/appearance/google-images), sección añadida 2026-03-02):** Google usa **tanto schema.org (`primaryImageOfPage` o `image` en la entidad principal con `mainEntityOfPage`) como `og:image`**. Evitar logo, imágenes con texto y relaciones de aspecto extremas; usar alta resolución.

**Article/BlogPosting (fuente: [Article structured data](https://developers.google.com/search/docs/appearance/structured-data/article), 2026-09-08):**
- No hay propiedades obligatorias; recomendadas: `author` (+`author.name`, `author.url` o `sameAs`), `datePublished`, `dateModified` (ISO 8601 **con zona horaria**), `headline` (concisa), `image`.
- Imagen: "multiple high-resolution images (minimum of 50K pixels when multiplying width and height) with the following aspect ratios: 16x9, 4x3, and 1x1".
- `author.name` **solo el nombre** (sin cargo, sin "por", sin nombre del editor). Tipo correcto: `Person` para personas, `Organization` para organizaciones. Si `author.url` es una página interna, marcarla con **ProfilePage**.

**Fechas (fuente: [Byline dates](https://developers.google.com/search/docs/appearance/publication-dates)):** fecha **visible** y destacada ("Publicado…", "Actualizado…") + `datePublished`/`dateModified` en structured data; la hora no es obligatoria pero se recomienda con zona horaria.

**E-E-A-T (fuente: [Creating helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)):**
- "Of these aspects, trust is most important". E-E-A-T no es un factor de ranking en sí, pero los sistemas usan señales que lo identifican.
- **Who:** byline donde se espera, que lleve a información sobre el autor. "We strongly encourage adding accurate authorship information".
- **How:** si se usa IA/automatización de forma sustancial, considerar divulgarlo cuando el lector se lo preguntaría.
- **Why:** contenido hecho para ayudar a personas; generar contenido principalmente para atraer visitas de buscadores (sobre todo con IA) puede violar las políticas de spam.
- Señales negativas explícitas: escribir a un número de palabras ("we don't" tener uno preferido), **cambiar fechas para parecer fresco sin cambios sustanciales**, añadir o quitar mucho contenido "para parecer fresco" ("No, it won't").

### 1.2 Cambios de 2025-2026 que afectan a Discover

| Fecha | Cambio | Fuente |
|---|---|---|
| 2025-11-19 | **Se eliminó la guía de la función Follow de Discover**: "The Follow feature is no longer shown in Google Discover." | [Search docs updates](https://developers.google.com/search/updates) |
| 2026-02-05 → +21 días | **February 2026 Discover core update** (el único update de Discover en el Status Dashboard en 2026): más contenido local de sitios del país del usuario, menos sensacionalismo/clickbait, más contenido "in-depth, original, and timely" de sitios con experiencia en un área; la experiencia se identifica "on a topic-by-topic basis". Lanzado para usuarios en inglés de EE. UU.; "will expand it to all countries and languages in the months ahead". | [Blog de Google, 2026-02-05](https://developers.google.com/search/blog/2026/02/discover-core-update) · [Status dashboard](https://status.search.google.com/products/rGHU1u87FJnkP6W2GwMi/history) |
| 2026-03-02 | Se aclara que schema.org y `og:image` se usan para la miniatura de Discover | Search docs updates |
| 2026 (enero-agosto) | **Preferred sources**: afecta a *Top Stories* y a AI Mode/AI Overviews (no a Discover directamente); disponible en todos los idiomas (2026-04-30); botón interactivo `<div google-add-preferred-source-btn>` (2026-08-20). Requiere estar incluido en "Search generative AI" de Search Console. | [Preferred sources](https://developers.google.com/search/docs/appearance/preferred-sources) |

**No verificado:** no encontré confirmación oficial de que la expansión del Discover core update a español ya se haya producido a 2026-09-22 (el Status Dashboard no lista otro update de Discover).

### 1.3 Cómo medirlo

- **Search Console › Rendimiento › Discover:** impresiones, clics y CTR de los **últimos 16 meses**, solo si se supera un **umbral mínimo** de impresiones; incluye el tráfico de Chrome ("fully tracks a site's Discover traffic across all surfaces").
- **Línea base medida hoy (API GSC):** `searchType=DISCOVER`, 2026-06-01 → 2026-09-21, dimensión `page`: **0 filas** (sin impresiones o por debajo del umbral). Coincide con `gsc_90d_discover.json` de otra tarea (0 filas).
- **Manual actions** de Discover aparecen en Search Console › Seguridad y acciones manuales.
- **Opinión:** revisar el informe Discover semanalmente tras publicar los primeros 10-20 artículos; Discover suele necesitar historial de indexación y engagement, así que no esperes datos el primer mes (esto es inferencia, no dato de Google).

### 1.4 Evergreen vs. tendencia y frecuencia de publicación

- **Qué dice Google:** Discover recomienda contenido "timely for current interests" **o** que cuente bien una historia **o** aporte ideas propias, y admite contenido antiguo relevante. **No publica una frecuencia recomendada**; dice que los cambios de tráfico pueden no tener relación con la frecuencia de publicación, y que añadir contenido solo para "parecer fresco" no ayuda.
- **Recomendación (opinión, para este nicho):** base de **guías evergreen** (cómo hacer un arco orgánico, cuántos globos lleva, materiales, precios por país con fecha y fuente) + **piezas estacionales** publicadas con 3-6 semanas de antelación a las fechas en que la gente decora (Halloween, Navidad, graduaciones, Día de la Madre, que cambia de fecha según el país). Cadencia **sostenible** (p. ej. 2-3 artículos/semana hasta completar los ≥20 del clúster) mejor que picos; **no** hay dato oficial que respalde una cifra concreta.
- **Riesgo explícito (guía IA de Google, 2026-07-10):** crear contenido separado para cada variación de búsqueda "primarily to manipulate rankings… violates Google's scaled content abuse spam policy". Aplica a los artículos **y** a la capa hiperlocal país × ciudad × curso: cada página debe tener contenido realmente distinto.

### 1.5 Estado actual del sitio vs. Discover (medido hoy)

- Producción **no** tiene `<meta name="robots">` → sin `max-image-preview:large` (la rama lo añade a todas las páginas indexables).
- `og:image` por defecto `/og-default.jpg` = **1200×685 px** (822.000 px): cumple ancho y píxeles, **no es 16:9** y es **genérica** → no usarla en artículos; cada artículo necesita su hero propio 16:9 (la rama genera 1600×900 para el RSS; usar la misma en `og:image`).
- Sin fechas visibles ni autoría en páginas de artículo (el blog aún no está publicado).

### 1.6 Snippets exactos recomendados

**Meta robots (ya en la rama, `Seo.astro`):**
```html
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
```

**Imagen del artículo (16:9, ≥1200 px, sin texto incrustado, sin logo):**
```html
<meta property="og:image" content="https://cursodeglobosonline.com/_astro/arco-organico-hero.1600x900.jpg">
<meta property="og:image:width" content="1600">
<meta property="og:image:height" content="900">
<meta property="og:image:alt" content="Arco orgánico de globos en tonos pastel montado sobre una estructura de PVC">
```

**BlogPosting JSON-LD (zona horaria de Colombia, 3 relaciones de aspecto):**
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "@id": "https://cursodeglobosonline.com/blog/como-hacer-un-arco-organico-de-globos/#article",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://cursodeglobosonline.com/blog/como-hacer-un-arco-organico-de-globos/" },
  "headline": "Cómo hacer un arco orgánico de globos paso a paso",
  "image": [
    "https://cursodeglobosonline.com/_astro/arco-16x9.jpg",
    "https://cursodeglobosonline.com/_astro/arco-4x3.jpg",
    "https://cursodeglobosonline.com/_astro/arco-1x1.jpg"
  ],
  "datePublished": "2026-09-22T08:00:00-05:00",
  "dateModified": "2026-09-22T08:00:00-05:00",
  "author": { "@type": "Organization", "name": "Equipo editorial de Curso de Globos Online", "url": "https://cursodeglobosonline.com/blog/autor/equipo-editorial/" },
  "publisher": { "@id": "https://cursodeglobosonline.com/#organization" },
  "inLanguage": "es"
}
```
*(URLs de ejemplo; el slug y los nombres de imagen son ilustrativos.)*

**Fecha y autoría visibles:**
```html
<p class="post-meta">
  Por <a href="/blog/autor/equipo-editorial/">Equipo editorial de Curso de Globos Online</a> ·
  Publicado el <time datetime="2026-09-22">22 de septiembre de 2026</time> ·
  Actualizado el <time datetime="2026-09-22">22 de septiembre de 2026</time>
</p>
```

**Checklist por artículo para Discover:**
1. Título que describe el contenido (sin "no vas a creer…", sin prometer lo que el artículo no da). Si se usa `discoverTitle`/`og:title` distinto del `<title>`, que sea igual de fiel.
2. Hero propio 16:9, ≥1200 px de ancho, sin texto encima ni logo, también en `og:image` y en `image` del schema.
3. Fecha visible + `datePublished`/`dateModified` con zona horaria; solo cambiar `dateModified` si hay un cambio sustancial.
4. Byline enlazada a la página de autor (ProfilePage). Cuando JP nombre a una persona real con trayectoria verificable, pasar a `Person` (la rama ya lo prevé; **no inventar autores**).
5. Experiencia propia: fotos reales de montajes, medidas, cantidades de globos, costos con fecha y fuente, errores comunes que el curso resuelve.
6. Página rápida y sin intersticiales (page experience). El artículo no debe ser un formulario ni una landing de venta (Discover filtra "forms").

---

## 2. IndexNow y Bing Webmaster API

### 2.1 Protocolo IndexNow (fuentes: [indexnow.org/documentation](https://www.indexnow.org/documentation), [indexnow.org/faq](https://www.indexnow.org/faq), [searchengines.json](https://www.indexnow.org/searchengines.json))

- **Clave:** mínimo 8, máximo 128 caracteres; solo `a-z`, `A-Z`, `0-9` y `-` (la doc dice "hexadecimal" pero lista esos caracteres; la `INDEXNOW_KEY` de `secrets.env` tiene **32 caracteres hexadecimales en minúscula** y cumple ambas lecturas).
- **Archivo de clave (opción 1, recomendada):** `https://cursodeglobosonline.com/{key}.txt`, **UTF-8**, cuyo contenido es **solo la clave**. Opción 2: otra ruta + parámetro `keyLocation` (solo autoriza URLs bajo esa ruta).
- **Envío individual (GET):** `https://<buscador>/indexnow?url={url-codificada}&key={key}`.
- **Envío por lotes (POST JSON):** `POST https://api.indexnow.org/indexnow`, `Content-Type: application/json; charset=utf-8`, cuerpo `{host, key, keyLocation?, urlList}`; **hasta 10.000 URLs por POST** (más puede devolver 422).
- **Respuestas:** 200 OK · 202 recibido, validación de la clave pendiente (típico en el primer envío) · 400 formato inválido · 403 clave inválida · 422 URL de otro host o clave que no cumple · 429 demasiadas peticiones (posible spam).
- **Motores:** los participantes comparten los envíos entre sí. `searchengines.json` (hoy): **bing, yandex, seznam, naver, yep, internetarchive, amazonbot**. Endpoints del FAQ: api.indexnow.org, bing.com, yandex.com, search.seznam.cz, searchadvisor.naver.com, indexnow.yep.com, indexnow.amazonbot.amazon. **Envía a un solo endpoint.** Google **no** figura en la lista.
- **Buenas prácticas del FAQ:** enviar URLs **nuevas, actualizadas, redirigidas o borradas (404/410)**; **no** reenviar la misma URL muchas veces al día (esperar ≥5 min entre cambios); **no** enviar todo el sitio salvo tras una migración o rediseño; **no** enviar cambios anteriores a la implantación (para eso, sitemap con `lastmod` correcto); **usar IndexNow + sitemaps juntos**; cada envío cuenta para la cuota de rastreo; en sitios multilingües, cada versión es una URL distinta; **cada subdominio es un host distinto** (con su propio archivo de clave).
- **Cloudflare:** el FAQ indica "Cloudflare offers native IndexNow integration" (Crawler Hints). Docs de Cloudflare (2026-08-14): disponible en el plan Free; usa el estado de caché **MISS** para inferir cambios y avisar a IndexNow; no informa respuestas ≥4xx. **Estado medido hoy (API, solo lectura): `crawlhints_enabled: false`**. *Inferencia:* como el HTML de Pages sale con `cf-cache-status: DYNAMIC`, Crawler Hints podría tener poco efecto; el envío explícito desde CI es más predecible.

### 2.2 Bing Webmaster API: resultados de las llamadas de lectura (hoy, 2026-09-22 11:05 UTC)

Llamadas GET a `https://ssl.bing.com/webmaster/api.svc/json/{Método}?apikey=…` (script `bing_readonly_check.py`; **no se envió ninguna URL**):

| Método | Resultado |
|---|---|
| `GetUserSites` | HTTP 200 · **34 sitios** en la cuenta · `https://cursodeglobosonline.com/` → **IsVerified: true** |
| `GetUrlSubmissionQuota?siteUrl=https://cursodeglobosonline.com/` | HTTP 200 · **DailyQuota: 10000 · MonthlyQuota: 90000** (igual con o sin la barra final) |
| `GetFeeds` | `https://cursodeglobosonline.com/sitemap-index.xml` · Sitemap Index · **Success** · **210 URLs** · último rastreo **2026-09-20 10:51 UTC**. También está registrado **`https://www.cursodeglobosonline.com/sitemap.xml`** (Success, 210 URLs, 2026-09-17), que hoy responde 301 → `/sitemap.xml` → 301 → `/sitemap-index.xml` |
| `GetCrawlStats` (183 días) | 2026-09-21: **InIndex 247**, CrawledPages 59, Code2xx 249, Code4xx 0, CrawlErrors 0, BlockedByRobotsTxt 0, InLinks 17.338 |

**Conclusión:** la `BING_WMT_API_KEY` funciona y el sitio **está verificado** en Bing Webmaster Tools. La key es **por usuario** y vale para todos sus sitios verificados ([Getting access](https://learn.microsoft.com/en-us/bingwebmaster/getting-access); Microsoft recomienda OAuth 2.0, pero la API key sirve).

**Endpoints de referencia (docs de Microsoft Learn; NO ejecutados):**
```http
POST /webmaster/api.svc/json/SubmitUrlbatch?apikey=API_KEY HTTP/1.1
Host: ssl.bing.com
Content-Type: application/json; charset=utf-8

{"siteUrl":"https://cursodeglobosonline.com","urlList":["https://cursodeglobosonline.com/blog/","https://cursodeglobosonline.com/blog/<slug>/"]}
```
```http
POST /webmaster/api.svc/json/SubmitFeed?apikey=API_KEY HTTP/1.1
Host: ssl.bing.com
Content-Type: application/json; charset=utf-8

{"siteUrl":"https://cursodeglobosonline.com","feedUrl":"https://cursodeglobosonline.com/blog/rss.xml"}
```
```http
GET /webmaster/api.svc/json/GetUrlSubmissionQuota?siteUrl=https://cursodeglobosonline.com/&apikey=API_KEY HTTP/1.1
Host: ssl.bing.com
```
- **Límite de URLs por lote en `SubmitUrlBatch`:** la doc de Microsoft Learn **no lo indica**; fuentes de terceros hablan de 500. No verificado en fuente primaria. La cuota real del sitio (10.000/día) sí está medida.
- **No verificado en fuente primaria:** la afirmación de que Microsoft "recomienda IndexNow en lugar de la URL Submission API" (la página de ayuda de Bing se carga con JS y no se pudo leer). Lo que sí dice el blog oficial de Bing (2026-02-10, AI Performance) es que IndexNow ayuda a "keep information fresh across search and AI experiences".

**Recomendación:** usar **IndexNow como vía principal** (llega a Bing y a los demás participantes con un solo POST) y dejar `SubmitUrlBatch` como respaldo manual. No hace falta usar ambos para las mismas URLs.

### 2.3 Plan de implantación (snippets)

**1) Archivo de clave** (ya creado en la rama: `public/<INDEXNOW_KEY>.txt`; comprobé que el nombre y el contenido coinciden con `INDEXNOW_KEY`, 32 bytes). Tras desplegar, verificar:
```bash
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" "https://cursodeglobosonline.com/${INDEXNOW_KEY}.txt"   # esperado: 200 text/plain
test "$(curl -s "https://cursodeglobosonline.com/${INDEXNOW_KEY}.txt")" = "$INDEXNOW_KEY" && echo "clave OK"
```

**2) Envío por lotes (una sola vez al publicar el blog):**
```bash
curl -sS -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -w "\nHTTP %{http_code}\n" \
  -d @- <<JSON
{
  "host": "cursodeglobosonline.com",
  "key": "${INDEXNOW_KEY}",
  "keyLocation": "https://cursodeglobosonline.com/${INDEXNOW_KEY}.txt",
  "urlList": [
    "https://cursodeglobosonline.com/blog/",
    "https://cursodeglobosonline.com/blog/<slug-1>/",
    "https://cursodeglobosonline.com/blog/<slug-2>/"
  ]
}
JSON
```

**3) Automatizado en `deploy-production.yml`**, después del paso `pages deploy` (solo en `main`, **nunca** desde `deploy-staging.yml`, porque el host `*.pages.dev` no coincide con la clave). Script propuesto `scripts/indexnow.mjs` que envía las URLs del sitemap del blog cuyo `lastmod` es de hoy (la rama ya pone `lastmod` real en `/sitemaps/blog.xml`):
```js
// scripts/indexnow.mjs — node >= 20. Uso: INDEXNOW_KEY=... node scripts/indexnow.mjs [dias=1]
import { readFile } from 'node:fs/promises';

const HOST = 'cursodeglobosonline.com';
const KEY = process.env.INDEXNOW_KEY;
if (!KEY || !/^[A-Za-z0-9-]{8,128}$/.test(KEY)) throw new Error('INDEXNOW_KEY ausente o inválida');

const days = Number(process.argv[2] ?? 1);
const since = Date.now() - days * 86_400_000;
const xml = await readFile('dist/sitemaps/blog.xml', 'utf8');
const urls = [...xml.matchAll(/<url>\s*<loc>([^<]+)<\/loc>(?:[\s\S]*?<lastmod>([^<]+)<\/lastmod>)?[\s\S]*?<\/url>/g)]
  .filter(([, , lastmod]) => lastmod && Date.parse(lastmod) >= since)
  .map(([, loc]) => loc)
  .slice(0, 10_000);

if (urls.length === 0) { console.log('IndexNow: nada que enviar'); process.exit(0); }

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${urls.length} URLs -> HTTP ${res.status}`);
if (![200, 202].includes(res.status)) process.exit(1);
```
```yaml
      # deploy-production.yml, después de "pages deploy dist/ ... --branch=main"
      - name: IndexNow (Bing, Yandex, Seznam, Naver, Yep…)
        if: github.ref == 'refs/heads/main'
        continue-on-error: true   # un fallo de IndexNow no debe tumbar el deploy
        env:
          INDEXNOW_KEY: ${{ secrets.INDEXNOW_KEY }}
        run: node scripts/indexnow.mjs 1
```
*(Inferencia: con `lastmod` por día (`YYYY-MM-DD`), comparar con "últimas 24 h" puede reenviar URLs de ayer; es aceptable según el FAQ si no se repite muchas veces al día. Si se prefiere precisión, derivar las URLs de `git diff --name-only HEAD~1 -- src/content/blog/`.)*

**4) Mantenimiento en Bing WMT (acciones de escritura, pendientes de aprobación de JP):**
- Quitar el feed/sitemap viejo `https://www.cursodeglobosonline.com/sitemap.xml` (UI de Bing WMT › Sitemaps).
- Enviar `https://cursodeglobosonline.com/blog/rss.xml` como feed (`SubmitFeed`) cuando esté desplegado.
- Opcional: activar Cloudflare Crawler Hints (Caching › Configuration). No sustituye al paso 3.

---

## 3. Optimización para motores de IA / LLMs (llms.txt, GEO/AEO)

### 3.1 Qué dice Google (fuente: [Optimizing your website for generative AI features on Google Search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), "Last updated 2026-07-10")

- **AEO/GEO = SEO** para Google: "optimizing for generative AI search is optimizing for the search experience, and thus still SEO". AI Overviews y AI Mode usan RAG sobre el índice de Search + **query fan-out**.
- **Lo que sí importa:** contenido **no commodity** (punto de vista propio, experiencia de primera mano, no reciclar lo que ya existe), bien organizado con encabezados, **imágenes y vídeo de calidad**, requisitos técnicos de Search (indexable, con snippet), páginas rastreables, buena page experience, menos contenido duplicado.
- **Requisito nuevo:** el sitio debe estar **incluido en "Search generative AI"** en Search Console (Configuración › Search generative AI; **incluido por defecto**; controla AI Overviews, AI Mode y funciones de IA de Discover). Es distinto de Google-Extended y de `noindex` ([ayuda GSC](https://support.google.com/webmasters/answer/16908024)).
- **Lo que puedes ignorar para Google** ("Mythbusting"):
  - **llms.txt y archivos/marcado "especiales" para IA:** "Google Search itself doesn't use them"; mantenerlos para otros servicios está bien y "will neither harm nor help" en Google.
  - "Chunking" del contenido, reescribir solo para IA, buscar menciones inauténticas, obsesionarse con structured data (no es requisito, aunque sigue siendo útil para rich results).
- **Advertencia:** crear contenido para cada variación de consulta o de fan-out con el fin de manipular = **scaled content abuse**.
- **Medición:** informe **Generative AI performance** de Search Console (AI Overviews + AI Mode; **no** incluye Discover), en `search.google.com/search-console/performance/search-analytics/ai`; "As of August 31, 2026, we've rolled out these insights to all websites worldwide" ([ayuda](https://support.google.com/webmasters/answer/16984139)).
- **FAQ:** Google **retiró los rich results de FAQ** (no se muestran desde el 2026-05-07; la doc se eliminó en junio de 2026). Las FAQs visibles siguen sirviendo a los usuarios y a otros motores; el schema `FAQPage` ya no da rich result en Google.

### 3.2 Qué dice Microsoft/Bing (Copilot)

- **[Optimizing Your Content for Inclusion in AI Search Answers](https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers)** (Microsoft, 2025-10-08): alinear title, description y H1; H2/H3 descriptivos (formulados como pregunta cuando encaje); **pares pregunta-respuesta directos** ("Assistants can often lift these pairs word for word"); listas, pasos numerados y **tablas comparativas**; JSON-LD; hechos medibles. **Evitar:** muros de texto, **respuestas ocultas en pestañas o acordeones**, información clave solo en PDF o solo en imágenes sin alt.
- **[AI Performance en Bing WMT](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview)** (2026-02-10, public preview): citas totales, media de páginas citadas por día, **grounding queries** y citas por URL en Copilot, resúmenes de IA de Bing y algunos partners. Recomienda IndexNow para la frescura, encabezados claros, tablas y secciones de FAQ.
- **No verificado en fuente primaria:** el efecto de `NOCACHE`/`NOARCHIVE` sobre las citas de Copilot (aparece en resúmenes de terceros; la ayuda de Bing no se pudo leer).

### 3.3 llms.txt y llms-full.txt (fuente: [llmstxt.org](https://llmstxt.org/), "v2", publicada 2024-09-03, **modificada 2026-08-10**)

**Estructura (en este orden):** BOM opcional → **H1 con el nombre** (única sección obligatoria) → **blockquote** con un resumen → secciones de texto sin encabezados → secciones **H2** con listas de enlaces `- [nombre](url): notas` → **`## Optional`** para lo prescindible.

**Novedades de la v2:**
- Un llms.txt cubre las URLs **bajo su ruta** (se puede poner `/blog/llms.txt`); gana el más específico.
- Recomienda ofrecer **versión markdown** de las páginas en la misma URL con `.md` (`/ruta/index.html.md` o `index.md` para URLs sin nombre de archivo).
- Descubrimiento: `rel="alternate" type="text/markdown"` (versión .md) y **`rel="describedby"`** (llms.txt que la cubre), como `<link>` o cabecera HTTP `Link:`.
- Chrome Lighthouse revisa el llms.txt en sus auditorías de navegación agéntica (según la propia spec).

**llms-full.txt:** **no forma parte de la spec** de llmstxt.org (lo comprobé en el texto; la spec solo menciona el enfoque de links + `.md`). Es una convención popularizada por plataformas de documentación (Mintlify, según su blog). **Opinión:** para un sitio de 4 cursos es barato generarlo (texto completo de las 4 fichas + FAQs + guías principales) y no hace daño, pero es de prioridad baja; primero, contenido citable en las propias páginas.

**Estado actual:** `https://cursodeglobosonline.com/llms.txt` → 200 `text/plain`, con H1, blockquote, cursos, categorías, páginas y `## Optional` → **cumple la spec**. Mejoras propuestas (snippet, generado desde `src/pages/llms.txt.ts`):
```markdown
# Curso de Globos Online

> Catálogo en español de 4 cursos online de decoración con globos (globoflexia, bouquets, flores con globos y globos burbuja), vendidos a través de Hotmart con certificado de estudios y acceso de por vida. Precios en moneda local para Colombia, México, Perú, Ecuador, Chile, Argentina, España y Estados Unidos. Parte del ecosistema Sably (https://sably.co).

Cómo leer este sitio:
- Cada curso tiene una ficha por país en /{país}/{curso}/ (co, mx, pe, ec, cl, ar, es, us). El contenido del temario es el mismo; cambian la moneda y la información local.
- Las guías del blog (/blog/) son informativas: materiales, técnicas, precios de referencia con fecha y fuente, e ideas por tipo de evento. Cada guía enlaza al curso relacionado.
- La compra se hace en Hotmart. El sitio no procesa pagos.

## Cursos
- [Curso de Globoflexia](https://cursodeglobosonline.com/co/curso-de-globoflexia/): figuras con globos desde cero, 23 videos, certificado.
- [Curso de Bouquets de Globos](https://cursodeglobosonline.com/co/curso-de-bouquets-de-globos/): 17 videos, del inflado y calibrado al presupuesto.
- [Curso de Flores con Globos](https://cursodeglobosonline.com/co/curso-de-flores-con-globos/): más de 15 flores, estructuras y centros de mesa.
- [Curso de Globos Burbuja](https://cursodeglobosonline.com/co/curso-de-globos-burbuja/): globo burbuja, confeti, tassels, mármol y degradados.

## Guías del blog
- [Cómo hacer un arco orgánico de globos](https://cursodeglobosonline.com/blog/<slug>/): materiales, medidas y cantidad de globos por metro.
- [Cuánto cobrar por una decoración con globos](https://cursodeglobosonline.com/blog/<slug>/): cómo calcular un presupuesto (costos con fecha y país).

## Preguntas frecuentes
- [Preguntas frecuentes sobre los cursos](https://cursodeglobosonline.com/co/curso-de-globoflexia/#faq): acceso, certificado, garantía de Hotmart, requisitos.

## Optional
- [Catálogo completo](https://cursodeglobosonline.com/co/cursos/)
- [Sobre nosotros](https://cursodeglobosonline.com/nosotros/)
- [Sitemap XML](https://cursodeglobosonline.com/sitemap-index.xml)
- [RSS del blog](https://cursodeglobosonline.com/blog/rss.xml)
```
*(Los datos de cada curso (23 videos, 17 videos, 15 flores) están copiados del llms.txt que hay hoy en producción; los slugs del blog son marcadores.)*

**Descubrimiento del llms.txt (opcional, v2), en `public/_headers`:**
```
/*
  Link: </llms.txt>; rel="describedby"
```
*(Cloudflare Pages permite cabeceras por ruta en `_headers`; si se generan versiones `.md`, añadir `rel="alternate"; type="text/markdown"` en las rutas correspondientes.)*

### 3.4 Crawlers de IA: qué hace cada uno y recomendación

| Token robots.txt | Empresa | Para qué sirve (doc oficial) | Si lo bloqueas | Recomendación |
|---|---|---|---|---|
| `OAI-SearchBot` | OpenAI | Mostrar sitios en **ChatGPT search** | "will not be shown in ChatGPT search answers" | **Permitir** |
| `ChatGPT-User` | OpenAI | Acciones iniciadas por el usuario; robots.txt "may not apply" | — | Permitir |
| `GPTBot` | OpenAI | Entrenamiento de modelos; sin efecto en search | El contenido no se usa para entrenar | Permitir (decisión de negocio) |
| `OAI-AdsBot` | OpenAI | Valida páginas enviadas como anuncios en ChatGPT | — | Permitir |
| `Claude-SearchBot` | Anthropic | Calidad de los resultados de búsqueda de Claude | "Reduces visibility and accuracy in Claude search results" | **Permitir** |
| `Claude-User` | Anthropic | Accesos cuando un usuario pregunta a Claude | Menos visibilidad en búsquedas dirigidas por el usuario | Permitir |
| `ClaudeBot` | Anthropic | Entrenamiento | Se excluye de futuros entrenamientos | Permitir (decisión de negocio) |
| `PerplexityBot` | Perplexity | Mostrar y enlazar sitios en Perplexity; "not used to crawl content for AI foundation models" | No aparece en los resultados de Perplexity | **Permitir** |
| `Perplexity-User` | Perplexity | Accesos por pregunta del usuario; "generally ignores robots.txt" | — | Permitir |
| `Google-Extended` | Google | Entrenamiento de Gemini **y grounding** en Gemini Apps y Grounding with Google Search (Vertex). **No** afecta a Search ni al ranking | Sin entrenamiento ni grounding de Gemini con tu contenido | **Permitir** (bloquearlo quita visibilidad en respuestas de Gemini Apps) |

Fuentes: [OpenAI bots](https://developers.openai.com/api/docs/bots), [Anthropic](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) (actualizado 2026-04-07; respeta robots.txt y `Crawl-delay`), [Perplexity](https://docs.perplexity.ai/guides/bots), [Google common crawlers](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers) (2026-07-14).

**Recomendación:** para un negocio que quiere que los asistentes **recomienden** sus cursos, conviene **permitirlos todos**. El `robots.txt` actual (`User-agent: * / Allow: /`) ya lo hace; no es obligatorio listarlos. Si se quiere dejarlo explícito (y blindarlo frente a cambios futuros), esta variante es equivalente:
```
User-agent: *
Allow: /
Disallow: /landing/

# Buscadores y asistentes de IA: permitidos a propósito (visibilidad y citas)
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: GPTBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: ClaudeBot
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
Allow: /
Disallow: /landing/

Sitemap: https://cursodeglobosonline.com/sitemap-index.xml
```
*(Ojo: un grupo específico **sustituye** al grupo `*` para ese bot; por eso se repite `Disallow: /landing/`.)*

**Cloudflare (pendiente de verificar a mano):** el robots.txt servido hoy es idéntico al del repo (Cloudflare no añade reglas gestionadas). Las peticiones con UA de GPTBot, ClaudeBot, PerplexityBot y OAI-SearchBot devolvieron **200**, pero eso **no demuestra** que los bots verificados pasen (Cloudflare identifica bots de IA verificados por IP/firma). El token disponible **no tiene permiso** para leer Bot Management (HTTP 403). **Acción para JP:** en el dashboard de Cloudflare › Security › Bots / AI Crawl Control, confirmar que "Block AI bots" está **desactivado** o en modo permitir para los crawlers de búsqueda.

### 3.5 Contenido que ayuda a que la IA cite o recomiende el sitio (síntesis de Google + Microsoft, aplicada al nicho)

1. **Hechos verificables y propios:** duración, número de videos, módulos, certificado, garantía de Hotmart, precio por país **con fecha**; en las guías: cantidades de globos por metro de arco, tamaños (5", 10", 12", 18"), tiempos, herramientas. Todo con fuente o con experiencia propia (fotos de montajes reales).
2. **Pares pregunta-respuesta visibles** en HTML (no escondidos en acordeones cerrados; si se usa `<details>`, que el texto esté en el DOM). Ejemplos: "¿Cuántos globos lleva un arco de 3 m?", "¿Qué diferencia hay entre globoflexia y decoración con globos?".
3. **Entidades claras:** `Organization` con `@id`, `sameAs` (Sably, redes reales), `Course` por curso con `provider`, `WebSite`; páginas de autor con `ProfilePage`. Mismo nombre de marca en todo el sitio.
4. **Comparativas honestas:** tabla "qué curso elegir según tu objetivo" (fiestas infantiles → globoflexia; regalos → bouquets; eventos → burbuja/flores), incluyendo a quién **no** le sirve cada curso.
5. **Autoría y fecha** visibles (sección 1.6).
6. **Frescura:** IndexNow en cada publicación o cambio de precio; `dateModified` solo si hay cambios reales.
7. **No hacer:** páginas casi idénticas por ciudad o por variación de keyword sin contenido propio (scaled content abuse), menciones compradas o inauténticas, reescrituras "para IA".

**Medición:** GSC › Generative AI performance (AI Overviews/AI Mode) + Bing WMT › AI Performance (Copilot). Opcional: revisar en los logs de Cloudflare las visitas de `OAI-SearchBot`, `PerplexityBot` y `Claude-SearchBot`.

---

## 4. ads.txt para AdSense

### 4.1 Formato y reglas (fuentes: [Ads.txt guide](https://support.google.com/adsense/answer/12171612), [Ads.txt FAQs](https://support.google.com/adsense/answer/9785052), [Ensure your ads.txt files can be crawled](https://support.google.com/adsense/answer/7679060), [Add a new site](https://support.google.com/adsense/answer/12169212))

- Línea: `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`
  - Campo 1: dominio del sistema publicitario (**siempre `google.com`** para cuentas de Google).
  - Campo 2: ID de editor **de la cuenta** (`pub-` + 16 dígitos; sin `ca-`). Si monetizas con varias cuentas, **una fila por cuenta**.
  - Campo 3: `DIRECT` si controlas la cuenta directamente.
  - Campo 4 (opcional): ID de la autoridad de certificación (TAG) → `f08c47fec0942fa0`.
- **¿La misma línea sirve para varios dominios?** **Sí.** El ID identifica la **cuenta de AdSense**, no el sitio; la guía dice literalmente "Paste the line into each of your ads.txt files". Si cursodeglobosonline.com se monetiza con la **misma cuenta** que academiadeconduccion.academy, la línea es idéntica. La verifiqué hoy en `https://academiadeconduccion.academy/ads.txt` (200, `text/plain`): `google.com, pub-6213862553989716, DIRECT, f08c47fec0942fa0`. **Condición:** que sea la misma cuenta (JP lo confirma en AdSense › Cuenta › Configuración › Información de la cuenta).
- **Ubicación:** raíz del dominio (`https://cursodeglobosonline.com/ads.txt`), con **HTTP 200** (un 404 → las entradas se purgan; un soft-404 o 5xx → se conservan hasta 5 días). Accesible por **HTTP y HTTPS** (el rastreador prueba ambos; aquí `http://` redirige a `https://`, y Google admite redirecciones dentro del mismo dominio raíz). `www` no hace falta: el dominio raíz es el que se rastrea.
- **robots.txt** no debe bloquear `/ads.txt` ni a los rastreadores de Google (el actual solo bloquea `/landing/` → OK).
- Sin caracteres raros: texto plano UTF-8, sin formato copiado de editores enriquecidos.
- **Plazo:** "a few days"; si el sitio tiene pocas solicitudes de anuncios, **hasta un mes**.
- **Subdominios:** solo hace falta `subdomain=` en el ads.txt raíz si el subdominio usa **otro** vendedor o ID.

### 4.2 Qué más hace falta además del archivo

1. **Añadir el sitio en AdSense:** Sitios › **+ Nuevo sitio** › URL › Guardar → estado "Requires review" → elegir método de verificación: **fragmento de código AdSense** en `<head>`, **fragmento ads.txt** o **metaetiqueta** `<meta name="google-adsense-account" content="ca-pub-6213862553989716">` → **Verificar** → **Solicitar revisión**. La revisión "usually takes a few days, but in some cases can take 2-4 weeks". El rastreador de AdSense (Mediapartners-Google, Google-Display-Ads-Bot) debe poder acceder.
2. Tras "Authorized" + "Ready": insertar el código de anuncios (o Auto ads). Hoy el sitio **no** tiene el script `adsbygoogle.js` ni la meta `google-adsense-account` (comprobado en la home).
3. **CMP para EEE/Reino Unido/Suiza:** España es mercado objetivo. Google exige una **CMP certificada integrada con TCF** para anuncios personalizados en el EEE y Reino Unido (desde el 16-01-2024) y en Suiza (desde el 31-07-2024) ([ayuda AdSense](https://support.google.com/adsense/answer/13554116)). Al solicitar la revisión se puede elegir la CMP de Google.
4. **Opcional (IAB ads.txt 1.1):** `OWNERDOMAIN=` con el dominio de la empresa propietaria (IAB lo recomienda; AdSense no lo exige). JP decide cuál (p. ej. el de la empresa titular).
5. **Opinión de negocio:** en un sitio cuya conversión es el clic a Hotmart, conviene **no** poner anuncios en las money pages (fuga de clics) y limitarlos al blog. Además, anuncios de más en los artículos empeoran la page experience que pide Discover.

**Contenido exacto del archivo** (ya existe en la rama como `public/ads.txt`, pendiente de desplegar):
```
google.com, pub-6213862553989716, DIRECT, f08c47fec0942fa0
```
Verificación tras desplegar:
```bash
curl -sI https://cursodeglobosonline.com/ads.txt | head -1          # HTTP/2 200
curl -s  https://cursodeglobosonline.com/ads.txt                    # la línea exacta
curl -sI http://cursodeglobosonline.com/ads.txt | grep -i location # redirección a https
```

---

## 5. Qué ya cubre la rama `feat/seo-blog-discover` (sin commitear) y qué falta

| Punto | En la rama | Falta / corregir |
|---|---|---|
| `max-image-preview:large` en páginas indexables | Sí (`Seo.astro`) | — |
| `og:image` por artículo con width/height/alt, `og:type=article`, `article:*` | Sí | Asegurar que el hero sea 16:9 ≥1200 px sin texto; **no** usar `og-default.jpg` en artículos |
| BlogPosting con `@id`, `mainEntityOfPage`, `image[]`, fechas, autor, publisher | Sí (`blogPostingSchema`) | Serializar las fechas con zona horaria de Colombia (`-05:00`) en lugar de UTC `Z` (ambas son válidas ISO 8601; es preferencia); `headline.slice(0,110)` ya no es un requisito de Google (solo "concise") |
| Páginas de autor con `ProfilePage` | Sí | Pasar a `Person` cuando haya un autor real (no inventar) |
| RSS `/blog/rss.xml` + `<link rel="alternate">` | Sí | **Corregir el comentario** "permite Seguir el sitio en Google Discover/Chrome": Google retiró Follow (2025-11-19). Mantener el RSS para lectores, Bing (`SubmitFeed`) y automatización |
| `ads.txt` | Sí, línea exacta | Desplegar + alta del sitio en AdSense |
| Archivo de clave IndexNow | Sí (coincide con `INDEXNOW_KEY`) | Desplegar + script/paso de CI (sección 2.3). No enviar desde staging |
| Redirecciones de feeds de WordPress (`/feed/` → `/blog/rss.xml`) | Sí | — |
| llms.txt | Existe (producción) | Añadir "Guías del blog" y FAQs; opcional: `Link: rel="describedby"` y `.md` |
| Bing WMT | Verificado, cuota 10.000/día | Quitar el sitemap viejo con `www`; `SubmitFeed` del RSS |
| GSC "Search generative AI" | No verificable por API | JP: confirmar en Configuración que el sitio está **incluido** (viene incluido por defecto) |
| Cloudflare AI bots | No verificable (403) | JP: revisar Security › Bots / AI Crawl Control |

---

## 6. Archivos de esta investigación

- `informe_discover_indexnow_llms.md`: este informe.
- `bing_readonly_check.py`: script de llamadas **solo de lectura** a la Bing Webmaster API (no imprime la key).
- `bing_wmt_readonly_check.json`: respuestas de `GetUserSites` (sin códigos de verificación), `GetUrlSubmissionQuota`, `GetFeeds` y `GetCrawlStats`.
- `cloudflare_readonly_check.json`: GETs a la API de Cloudflare (plan, flags `crawlhints_enabled`, 403 en bot_management).
- `gsc_discover_baseline_2026-09-22.json`: línea base de Discover (0 filas) y clics/impresiones WEB por país (2026-08-06 → 2026-09-21).
- `live_site_checks_2026-09-22.txt`: estados HTTP en producción (ads.txt, llms.txt, RSS, clave IndexNow, redirecciones `www`, meta robots, og:image, UA de bots IA).
- `fuentes_discover_indexnow_llms/`: copias HTML + texto de las fuentes oficiales consultadas (Google Search Central, Search Console Help, indexnow.org, Microsoft Learn, Cloudflare Docs, llmstxt.org, AdSense Help).

### Fuentes principales
- Google: [Get on Discover](https://developers.google.com/search/docs/appearance/google-discover) · [Discover core update feb-2026](https://developers.google.com/search/blog/2026/02/discover-core-update) · [Search docs updates](https://developers.google.com/search/updates) · [Robots meta](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag) · [Image SEO](https://developers.google.com/search/docs/appearance/google-images) · [Article](https://developers.google.com/search/docs/appearance/structured-data/article) · [Byline dates](https://developers.google.com/search/docs/appearance/publication-dates) · [Helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content) · [AI optimization guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) · [Preferred sources](https://developers.google.com/search/docs/appearance/preferred-sources) · [Google-Extended](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers) · [Search generative AI control](https://support.google.com/webmasters/answer/16908024) · [Generative AI performance report](https://support.google.com/webmasters/answer/16984139) · [Status dashboard](https://status.search.google.com/products/rGHU1u87FJnkP6W2GwMi/history)
- IndexNow: [Documentation](https://www.indexnow.org/documentation) · [FAQ](https://www.indexnow.org/faq) · [searchengines.json](https://www.indexnow.org/searchengines.json) · Cloudflare [Crawler Hints](https://developers.cloudflare.com/cache/advanced-configuration/crawler-hints/)
- Bing: [SubmitUrlBatch](https://learn.microsoft.com/en-us/dotnet/api/microsoft.bing.webmaster.api.interfaces.iwebmasterapi.submiturlbatch?view=bing-webmaster-dotnet) · [GetUrlSubmissionQuota](https://learn.microsoft.com/en-us/dotnet/api/microsoft.bing.webmaster.api.interfaces.iwebmasterapi.geturlsubmissionquota?view=bing-webmaster-dotnet) · [GetUserSites](https://learn.microsoft.com/en-us/dotnet/api/microsoft.bing.webmaster.api.interfaces.iwebmasterapi.getusersites?view=bing-webmaster-dotnet) · [SubmitFeed](https://learn.microsoft.com/en-us/dotnet/api/microsoft.bing.webmaster.api.interfaces.iwebmasterapi.submitfeed?view=bing-webmaster-dotnet) · [Getting access](https://learn.microsoft.com/en-us/bingwebmaster/getting-access) · [AI Performance (blog)](https://blogs.bing.com/webmaster/February-2026/Introducing-AI-Performance-in-Bing-Webmaster-Tools-Public-Preview) · [Microsoft: AI search answers](https://about.ads.microsoft.com/en/blog/post/october-2025/optimizing-your-content-for-inclusion-in-ai-search-answers)
- LLMs: [llmstxt.org v2](https://llmstxt.org/) · [OpenAI bots](https://developers.openai.com/api/docs/bots) · [Anthropic crawlers](https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler) · [Perplexity bots](https://docs.perplexity.ai/guides/bots)
- AdSense: [Ads.txt guide](https://support.google.com/adsense/answer/12171612) · [Ads.txt FAQs](https://support.google.com/adsense/answer/9785052) · [Crawlable ads.txt](https://support.google.com/adsense/answer/7679060) · [Add a new site](https://support.google.com/adsense/answer/12169212) · [CMP EEA/UK/CH](https://support.google.com/adsense/answer/13554116) · [IAB ads.txt](https://iabtechlab.com/ads-txt/)
