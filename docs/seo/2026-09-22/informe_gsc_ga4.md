# Informe de rendimiento real: GSC + GA4 — cursodeglobosonline.com

Fecha: 2026-09-22 · Autor: agente de investigación (solo lectura, sin cambios en el repo ni en las cuentas)

## 0. Fuentes y método

| Fuente | Qué se usó | Ficheros |
|---|---|---|
| Google Search Console, propiedad `sc-domain:cursodeglobosonline.com` (siteOwner) | MCP `gsc` (list_properties, get_performance_overview, get_advanced_search_analytics, batch_url_inspection) + Search Console API v1 con **las mismas credenciales de service account del MCP** (scope `webmasters.readonly`), para guardar JSON crudo | `gsc_*.json` |
| GA4 `properties/346653915` "GA4 - Cursodeglobosonline.com" (cuenta 304454870) | MCP `google-analytics` (get_account_summaries, get_property_details) + GA4 Data API v1beta / Admin API v1beta con las credenciales del MCP (scope `analytics.readonly`) | `ga4_*.json` |
| Sitio en producción | `curl` de sitemaps, redirecciones y HTML (JSON-LD, title, hreflang) | `sitemap_urls_live.txt`, `sitemap_urls_status.txt` |

- Periodos: **90 días = 2026-06-24 → 2026-09-21**; **28 días = 2026-08-25 → 2026-09-21**. Los ficheros del API usan `dataState=all`, que incluye datos frescos del 20 y 21 de septiembre. El MCP (solo datos finales, hasta el 19/09) da 479 clics / 8.003 impresiones en 90 días y 166 / 2.921 en 28 días (`gsc_mcp_snapshot.json`).
- **Limitación importante:** el **74 % de los clics y el 57 % de las impresiones en 90 días** vienen de consultas anonimizadas que GSC no muestra. En 28 días son el 77 % y el 61 %. Los análisis por consulta cubren solo la parte visible.
- El sitio nuevo (Astro) se lanzó el **2026-08-06**. El dominio ya tenía histórico con otra estructura de URLs (sitio anterior; hay un sitemap registrado en GSC desde 2022).

---

## 1. GSC — rendimiento global

| Periodo | Clics | Impresiones | CTR | Posición media |
|---|---|---|---|---|
| 90 d (API, dataState=all) | 494 | 8.226 | 6,01 % | 13,8 |
| 28 d (API, dataState=all) | 181 | 3.144 | 5,76 % | 12,4 |

**Antes y después del lanzamiento** (`gsc_90d_date.json`):

| Tramo | Días | Clics/día | Impresiones/día | CTR | Posición (ponderada) |
|---|---|---|---|---|---|
| 2026-06-24 → 08-05 (sitio anterior) | 43 | 4,47 | 75,0 | 5,95 % | 13,9 |
| 2026-08-06 → 09-21 (sitio nuevo) | 47 | 6,43 | 106,4 | 6,04 % | 13,7 |

Tras el lanzamiento suben los clics por día (+44 %) y las impresiones por día (+42 %). El CTR y la posición se mantienen.

**Países, 90 d** (`gsc_90d_country.json`): Colombia 359 clics / 4.875 impresiones (CTR 7,4 %, pos. 10,4) · México 21 / 1.275 (**CTR 1,6 %**, pos. 19,3) · España 38 / 508 (7,5 %) · Perú 22 / 452 (4,9 %) · EE. UU. 12 / 313 (3,8 %) · Argentina 17 / 287 (5,9 %) · Chile 12 / 230 (5,2 %) · Ecuador 6 / 140 (4,3 %).
**28 d:** Colombia 102 / 1.635 · México 8 / 429 (1,9 %) · España 29 / 319 (9,1 %) · Perú 14 / 169 · EE. UU. 3 / 161 · Chile 7 / 141 · Argentina 11 / 131 · Ecuador 5 / 86.

**Dispositivos, 90 d:** móvil 389 clics / 5.518 impresiones (CTR 7,0 %, pos. 9,0) · escritorio 101 / 2.676 (3,8 %, pos. 23,6) · tablet 4 / 32.

**Consultas con más clics, 90 d** (`gsc_90d_query.json`): "cursos de decoración para fiestas y eventos" 18 clics / 106 impresiones (pos. 6,0) · "…en barranquilla" 9 / 49 (pos. 4,9) · "curso de globos" 8 / 403 (pos. 26,5) · "curso de globoflexia" 5 / 156 (pos. 26,4) · "cursos de globos" 5 / 83 · "cursos de globos en barranquilla" 5 / 29 (pos. 2,3) · "cursos decoracion con globos" 5 / 55.

**Discover / Noticias / Vídeo, 90 d:** **0 filas** (el sitio no aparece en Discover). **Búsqueda de imágenes:** 213 consultas con impresiones (`gsc_90d_image.json`), útiles para detectar temas informacionales (ver 2.d).

### 1.1 Migración: las URLs antiguas siguen recibiendo impresiones, pero van a menos

Clasificación de URLs (`gsc_analysis.json` → `page_kind_*`):

| Tipo | 90 d clics / impresiones | 28 d clics / impresiones |
|---|---|---|
| URLs antiguas (`/medellin/`, `/cali/`, `/barranquilla/`, `/bucaramanga/`, `/bogota/`, `/peru/…`, `/mexico/…`, `/curso-globoflexia/`…) | 233 / 5.460 | 14 / 522 |
| URLs nuevas `/{cc}/…` | 238 / 5.074 | 162 / 3.365 |
| Páginas de sistema (`/`, `/blog/`, `/legal/…`, `/sitemap/`) | 28 / 1.028 | 5 / 151 |

- Con `curl` comprobé que las URLs antiguas devuelven un **301 a su equivalente nueva** (p. ej. `/medellin/` → `/co/medellin/`, `/mexico/curso-de-globoflexia/` → `/mx/curso-de-globoflexia/`). La inspección de URL del API marca `/medellin/`, `/cali/`, `/barranquilla/`, `/bucaramanga/` y `/mexico/curso-de-globoflexia/` como **"Página con redirección"**, con la URL nueva como canónica de Google. La consolidación va bien.
- En 28 días todavía tienen impresiones `/cali/` (229), `/medellin/` (194) y `/peru/` (76).
- La inspección muestra un **enlace externo propio** que apunta a una URL antigua: `academiadebelleza.edu.co/sitemap/` → `/mexico/curso-de-globoflexia/`. Conviene actualizarlo a la URL nueva.

---

## 2. Hallazgos pedidos

### (a) Quick wins: consultas en posición 4–30

Criterio: posición media entre 4 y 30 y al menos 15 impresiones en 90 días (lista completa en `gsc_analysis.json` → `quick_wins_90d` / `quick_wins_28d`).

| Consulta | Clics | Impresiones | CTR | Posición | Lectura |
|---|---|---|---|---|---|
| curso de globos | 8 | 408 | 2,0 % | 26,4 | La consulta de cabecera. En 28 d: 165 impresiones, pos. 27,2 |
| curso de globoflexia | 6 | 159 | 3,8 % | 26,2 | En 28 d: 70 impresiones, pos. 21,9 |
| cursos de globoflexia | 1 | 118 | 0,8 % | 16,9 | Casi todo México (`/mx/curso-de-globoflexia/`) |
| cursos de decoración para fiestas y eventos | 18 | 108 | 16,7 % | 5,9 | Ya convierte; subir al top 3 |
| cursos de globos | 5 | 88 | 5,7 % | 12,8 | |
| cursos de globoflexia en cdmx | 0 | 87 | 0 % | 14,9 | La página `/mx/cdmx/` existe (200, está en el sitemap) pero solo tiene 2 impresiones; Google muestra `/mx/curso-de-globoflexia/` |
| curso de globos burbuja | 1 | 70 | 1,4 % | 26,3 | |
| cursos / curso de globos en el sena | 3 | 122 | ~2,5 % | 9,9–11,7 | Intención informacional (ver d) |
| cursos decoracion con globos / curso de decoración con globos | 9 | 110 | 7–9 % | 6,8–17,7 | |
| curso de decoración de fiestas / de eventos | 0 | 92 | 0 % | 21,5–26 | |
| curso de globos online / virtual / en línea (varias variantes) | 4 | ~190 | 0–9,8 % | 12,5–27 | Variantes "online" repartidas |
| cursos de globos cdmx / curso de globos cdmx | 0 | 69 | 0 % | 18,5–21 | `/mx/cdmx/` no capta estas consultas |
| curso de globos cerca de mi | 2 | 39 | 5,1 % | 22,6 | |

### (b) Páginas con CTR bajo para su posición

No invento un benchmark: uso el **CTR del propio sitio por tramo de posición** (consultas, 90 d): pos. 1–3 = 12,0 % · 4–6 = 12,1 % · 7–10 = 4,4 % · 11–20 = 2,8 % · 21–30 = 2,2 % · >30 = 1,1 %. Se marcan las páginas nuevas con posición ≤ 20, al menos 20 impresiones y un CTR claramente por debajo de su tramo:

| Página | Periodo | Clics / impresiones | CTR | Posición | Referencia del tramo |
|---|---|---|---|---|---|
| **/mx/curso-de-globoflexia/** | 90 d | 2 / 288 | 0,7 % | 17,8 | 2,8 % |
| /mx/curso-de-globoflexia/ | 28 d | 2 / 213 | 0,9 % | 16,8 | 2,8 % |
| /mx/monterrey/ | 90 d | 0 / 32 | 0 % | 7,3 | 4,4 % |
| /mx/puebla/ | 28 d | 1 / 42 | 2,4 % | 6,8 | 4,4–12 % |
| /ec/guayaquil/ | 28 d | 1 / 31 | 3,2 % | 7,6 | 4,4 % |
| /mx/guadalajara/ | 90 d | 1 / 73 | 1,4 % | 16,5 | 2,8 % |
| /ar/ | 28 d | 0 / 29 | 0 % | 15,7 | 2,8 % |
| /cl/santiago/ (casi en el límite) | 28 d | 3 / 108 | 2,8 % | 19,6 | 2,8 % |

**Patrón:** **México es el mercado con peor CTR** (1,6 % en 90 d frente a 7,4 % en Colombia, con 1.275 impresiones). Son buenos candidatos para reescribir title y meta description con términos mexicanos ("CDMX", "en línea", precio en MXN). Dato verificado en producción: el `<title>` y la meta description de `/co/curso-de-globoflexia/` y `/mx/curso-de-globoflexia/` solo cambian en el nombre del país. La description es idéntica.

### (c) Canibalización real

1. **Las money pages de /co/ apenas aparecen. Google posiciona en su lugar los hubs de ciudad y la home.** En 90 d (consulta × página, `gsc_90d_query_page.json` y `gsc_90d_page.json`):
   - `/co/curso-de-globoflexia/`: 29 impresiones en total, pos. media 50,6. Para "curso de globoflexia" solo tiene 19 impresiones, en pos. ~69.
   - `/co/curso-de-bouquets-de-globos/`: 11 impresiones, pos. 72,7. `/co/curso-de-flores-con-globos/`: 11, pos. 69,6. `/co/curso-de-globos-burbuja/`: 13, pos. 13,8.
   - Para esas mismas consultas rankean `/co/barranquilla/` (342 impresiones, 24 clics, 64 consultas), `/co/bogota/` ("curso de globoflexia" 26 impresiones, pos. 56), `/co/medellin/`, `/co/bucaramanga/`, la home `/` y `/mx/curso-de-globoflexia/`.
2. **Consultas de cabecera repartidas entre decenas de URLs, en 28 d:**
   - "curso de globos": 349 impresiones repartidas en **46 URLs**; la mejor es `/co/barranquilla/` en pos. 13,2.
   - "curso de globoflexia": 211 impresiones en **22 URLs** (`/co/bogota/` pos. 53, `/co/bucaramanga/` 43,5, `/mx/curso-de-globoflexia/` 21,8, `/co/barranquilla/` 26,6, `/` 42,8).
   - "curso de decoracion con globos": 198 impresiones en 26 URLs (`/es/madrid/`, `/co/barranquilla/`, `/cl/santiago/`…).
   - "curso decoracion de globos": 150 impresiones en 36 URLs.
   - "curso de globos burbuja": 78 impresiones en 15 URLs.
3. **Solapamiento entre países:** `/mx/curso-de-globoflexia/` recibe impresiones de consultas genéricas fuera de México (73 de sus 288 impresiones en 90 d no son de México, según `gsc_90d_page_country.json`). El hreflang está bien implementado (es-CO…es-US + x-default → /co/), así que no es un problema técnico: es contenido casi idéntico entre países.
4. **Canibalización entre URL antigua y nueva** (transitoria, se va resolviendo con los 301): en 90 d, "cursos de decoración para fiestas y eventos" repartida entre `/medellin/` (47 impresiones, 9 clics) y `/co/medellin/` (11); "cursos de globoflexia" entre `/mexico/curso-de-globoflexia/` (35) y `/mx/curso-de-globoflexia/` (34).

Matiz: GSC cuenta una impresión por cada URL mostrada, y muchas de esas URLs están en posiciones > 50. Es la señal de que Google rota páginas casi equivalentes sin consolidar una. Lista completa en `gsc_analysis.json` → `canibalizacion_28d` (18 consultas) y `canibalizacion_90d` (53).

### (d) Consultas informacionales que ya dan impresiones (candidatas a artículo)

**Web, 90 d** (`gsc_analysis.json` → `informacionales_query`):
- **SENA:** "cursos de globos en el sena" (67 impresiones, pos. 9,9), "curso de globos en el sena" (55, pos. 11,7) y "curso de decoración de eventos sena" (14, pos. 8,5). Suman **136 impresiones** en top 12, y hoy las cubre la home. Artículo candidato: "¿Hay cursos de globos en el SENA? Opciones gratis y certificadas".
- **Gratis:** "curso de globos gratis" (12, pos. 29,7) y, en imágenes, "cursos de globos gratis" (19).
- **Dónde estudiar:** "donde puedo hacer un curso de decoracion con globos" (8, pos. 1,8), "donde estudiar decoracion de globos" (7), "donde estudiar decoración de eventos" (4), "como se llama el curso de decoracion con globos" (4, pos. 2,5).
- **Aprender:** "aprender globoflexia" (5, pos. 48).

**Búsqueda de imágenes, 90 d** (demanda "cómo hacer / ideas"; `imagen_temas_no_transaccionales`):
- **Flores con globos:** "flores con globos" (37), "4 petalos flores con globos redondos" (14), "como hacer flores con bombas" (6), "flor con globos" (5), "flores de globos" (5), "como hacer (una) flor(es) con globos" (4 + 4), "flor en distorsión". → cluster que enlaza al curso de flores.
- **Globos burbuja:** "decoracion de burbujas" (4), "ideas para decorar globos burbuja", "frases para globos burbuja", "como pintar un globo burbuja", "como hacer letras para globos burbuja", "que pintura se usa para pintar globos burbuja", "globo burbuja de graduación / 15 años / con peluche / con rosa dentro". → cluster que enlaza al curso de globos burbuja.
- **Fechas:** "decoracion para el dia del niño" (4), "decoración día del niño con globos", graduación. → artículos estacionales.
- **Globoflexia:** "globoflexia perrito", "mariposa de globoflexia", "globoflexia paso a paso / fácil / para niños", "figuras de globos". → cluster que enlaza al curso de globoflexia.
- **Básicos:** "tipos de globos y tamaños", "como pegar globos en el techo", "como poner globos en la pared", "arco de globos para niños", "centros de mesa de globos burbuja". → material, técnica y emprendimiento.

Nota: son volúmenes pequeños (la mayoría de 1 a 6 impresiones) y posiciones malas (40–90). Sirven como **señal de demanda real ya asociada al dominio**, no como estimación de tráfico.

---

## 3. Sitemaps

Datos de `gsc_sitemaps.json` y `gsc_sitemaps_children.json`:

| Sitemap | Enviado | Última descarga | Errores / avisos | URLs enviadas |
|---|---|---|---|---|
| `/sitemap-index.xml` (nuevo) | 2026-08-06 | 2026-09-19 | 0 / 0 (índice) | 258 |
| `/sitemap_index.xml` (sitio anterior, 2022) | 2022-12-15 | 2026-09-14 | 0 / **2** | 258: hoy hace 301 a `/sitemap-index.xml` y se procesa por duplicado |

**Sitemaps hijos:**
- `sitemap-blog.xml`: **1 error**. Devuelve un `<urlset>` vacío porque el blog no tiene artículos.
- `sitemap-categorias.xml`: **2 avisos**. Con `curl` comprobé que **16 de sus 24 URLs dan 404**: `/{cc}/cursos/eventos/` y `/{cc}/cursos/emprendimiento/` para los 8 países.
- El resto: 0 errores y 0 avisos (pages 58, cursos-co 28, cursos-mx 24, cursos-pe 20, cursos-ec 16, cursos-cl 16, cursos-ar 20, cursos-es 28, cursos-us 24).
- Comprobé las 258 URLs en producción: 240 responden 200 y 16 dan 404 (todas de categorías). Dos más dieron timeout en la pasada paralela y 200 al reintentarlas.
- El API devuelve `indexed: 0` en todos los sitemaps, pero la inspección de URL confirma que las URLs muestreadas **están indexadas**. Ese campo del API no refleja la indexación real y no debe usarse.

## 4. Inspección de URL

Datos de `gsc_url_inspection.json` (API, idioma es):

| URL | Veredicto | Cobertura | Canonical de Google = declarado | Último rastreo | Resultados enriquecidos detectados |
|---|---|---|---|---|---|
| / | PASS | Enviada e indexada | sí | 2026-09-21 | ninguno |
| /co/ | PASS | Enviada e indexada | sí | 2026-09-11 | Rutas de exploración (Breadcrumbs) |
| /co/curso-de-globoflexia/ | PASS | Enviada e indexada | sí | 2026-09-08 | Breadcrumbs |
| /co/curso-de-bouquets-de-globos/ | PASS | Enviada e indexada | sí | 2026-09-11 | Breadcrumbs |
| /mx/curso-de-globoflexia/ | PASS | Enviada e indexada | sí | 2026-09-07 | Breadcrumbs |
| /co/bogota/ | PASS | Enviada e indexada | sí | 2026-09-14 | Breadcrumbs |
| /blog/ | PASS | Enviada e indexada | sí | 2026-09-09 | ninguno (no consta en sitemap) |

Todas se rastrean como MOBILE. También inspeccioné `/co/medellin/`, `/co/barranquilla/`, `/co/curso-de-flores-con-globos/` y `/co/curso-de-globos-burbuja/`: todas PASS e indexadas con canonical propio.

**Resultados enriquecidos:** en el HTML en producción, `/co/curso-de-globoflexia/` incluye `Course`, `CourseInstance`, `Offer`, `FAQPage` y `BreadcrumbList`. Sin embargo, **GSC solo detecta Breadcrumbs**. Posibles causas:
- `FAQPage`: Google limita desde 2023 los resultados enriquecidos de FAQ a sitios gubernamentales y de salud, así que no es de esperar que aparezca.
- `Course`: no se detecta. Conviene revisarlo con la prueba de resultados enriquecidos (requisitos de "Course info").

---

## 5. GA4 (`properties/346653915`)

**Stream y key events** (`ga4_admin_streams_keyevents.json`):
- Stream web "CursodeGlobosOnline GA" = **G-PHN6J5MTX6** (`https://cursodeglobosonline.com`), coincide con el que dispara GTM-KKP7WL8Q.
- Key events configurados: `purchase`, `begin_checkout`. **Key events registrados en 90 d: 0.**

**Totales** (`ga4_totals.json`): 90 d = 1.668 sesiones, 1.582 usuarios, 49,4 % de interacción · 28 d = 735 sesiones, 64,1 % de interacción.

**Sesiones por canal** (`ga4_channels.json`):

| Canal | 90 d sesiones (interacción) | 28 d sesiones |
|---|---|---|
| Organic Search | 567 (69,7 %) | 211 |
| Direct | 492 (**13,6 %**) | 138 |
| Referral | 335 | 331 |
| Paid Social | 184 (24,5 %) | 0 |
| AI Assistant | 78 (62,8 %) | 57 |
| Organic Social | 12 | 0 |

**Tráfico basura:**
- `trafficheap.cc / referral`: **328 sesiones**, todas en la semana ISO 38 (2026-09-14 → 20) y todas con país "Seychelles". Es spam de referencia y distorsiona los datos de 28 d.
- También parecen bots: país "(not set)" con 171 sesiones y 2,9 % de interacción; China con 43 sesiones y 0 % de interacción; y buena parte de Direct (13,6 % de interacción).

**Resto de fuentes:**
- Paid Social (`facebook / paid`) son 184 sesiones concentradas en la semana 33 (agosto). No hay tráfico de pago en los últimos 28 días.
- **AI Assistant** (`chatgpt.com` 77 sesiones y `copilot.com` 1) está creciendo: 6 sesiones antes del lanzamiento, 72 después.

**Landing pages, 90 d** (`ga4_landing_90d.json`): `/` 843 (incluye bots y spam) · `/co/barranquilla` 66 · `/co/medellin` 64 · `/barranquilla` 55 · `/co` 51 · `/co/cali` 50 · `/medellin` 49 · `/bucaramanga` 41 · `/cali` 33 · `/co/bucaramanga` 29.
Solo orgánico (`ga4_organic_landing_90d.json`): `/barranquilla` 53 · `/co/barranquilla` 52 · `/co/medellin` 51 · `/medellin` 47 · `/` 42 · `/bucaramanga` 39.
**Las páginas de curso casi no reciben entradas orgánicas:** `/co/curso-de-globoflexia` tiene 11 sesiones totales.

**Países GA4, 90 d:** Colombia 533 · Seychelles 328 (spam) · EE. UU. 175 (18 % de interacción) · (not set) 171 · México 166 · España 56 · China 43 · Perú 35 · Argentina 32 · Chile 17 · Ecuador 16.

**Eventos y conversiones** (`ga4_events_90d.json`, `ga4_events_by_date.json`):
- **`begin_checkout`, `view_course`, `generate_lead`, `select_country`, `view_faq`: 0 eventos en 90 días.** Sin embargo, el código del sitio los empuja al `dataLayer`: `data-track="begin_checkout"` en CourseLanding, StickyCta y AdsLanding, y `trackEvent('generate_lead')` en LeadForm. `click_whatsapp` sí llega (82 eventos, desde 2026-08-13).
- **Hipótesis a verificar en GTM:** falta la etiqueta o el activador de GA4 para `begin_checkout` y el resto de eventos propios. Por eso el key event `begin_checkout` está a 0.
- **Clics a Hotmart:** hoy solo se miden con el `click` saliente de la medición mejorada, `linkDomain = hotm.art`: **114 eventos / 96 usuarios en 90 d** y **21 en 28 d** (`ga4_hotmart_clicks_*.json`).
  - Por canal, 90 d: Organic 77, AI Assistant 19, Direct 17, Paid Social 1. En 28 d: AI 12, Organic 7, Direct 2.
  - Antes del lanzamiento: 56 clics en 43 días. Después: 58 en 47 días.
  - Por semana: 20 (sem. 32), 11, 11, y luego **3, 6, 3, 9** (semanas 35–38). **Hay una caída en las últimas 4 semanas.**
  - Por país, 90 d: Colombia 67, México 17, EE. UU. 7.
  - URLs destino más clicadas: `hotm.art/curso-globoflexia-crashing` (24 + 15 con `offDiscount=031016`) y `curso-bouquet-globos-crashing` (22 + 17).
- `purchase`: 0. No hay datos de venta en GA4, porque la venta ocurre en Hotmart.

---

## 6. Prioridades que se derivan de los datos

1. **Medición (bloqueante):**
   - Crear en GTM las etiquetas GA4 para `begin_checkout` (key event), `view_course`, `generate_lead` y `select_country`.
   - Excluir el spam: filtro o lista de referencias no deseadas para `trafficheap.cc`, y un segmento sin Seychelles ni "(not set)".
   - Sin esto no se puede atribuir el blog a conversiones.
2. **Consolidar las money pages:** hoy Google elige los hubs de ciudad (`/co/barranquilla/`, `/co/medellin/`) para "curso de globos" y "curso de globoflexia", y las páginas `/co/curso-de-*` están en pos. 50–70. Hacen falta más enlaces internos contextuales hacia la página de curso con el anchor exacto, y diferenciar los hubs de ciudad (intención local o presencial). Los artículos del blog deben enlazar al curso, no a la ciudad.
3. **México:** 1.275 impresiones con 1,6 % de CTR. Reescribir title y description de `/mx/curso-de-globoflexia/`, `/mx/guadalajara/`, `/mx/monterrey/` y `/mx/puebla/`, y reforzar `/mx/cdmx/`: en 90 d hay 156 impresiones de consultas "…cdmx" (87 + 38 + 31) y esa página existe pero solo recibe 2; Google muestra `/mx/curso-de-globoflexia/` en su lugar.
4. **Sitemaps:**
   - Quitar las 16 URLs 404 de `sitemap-categorias.xml` o crear esas páginas.
   - No publicar `sitemap-blog.xml` vacío hasta que haya artículos.
   - Eliminar de GSC el sitemap antiguo `sitemap_index.xml` (lo tiene que hacer JP; yo no lo he tocado).
5. **Blog (clusters con demanda comprobada en GSC):** SENA/gratis/dónde estudiar (informacional-navegacional), flores con globos, ideas y frases para globos burbuja, figuras de globoflexia paso a paso, tipos y tamaños de globos, decoración día del niño y graduación. **Discover: 0 impresiones hoy.**
6. **Enlace externo:** actualizar `academiadebelleza.edu.co/sitemap/` para que apunte a `/mx/curso-de-globoflexia/` en lugar de la URL antigua.

## 7. Nota aparte (ads.txt, por la petición de JP)
- En producción, `https://cursodeglobosonline.com/ads.txt` devuelve **404** (curl, 2026-09-22).
- En el repo local existe `public/ads.txt` sin commitear, con la línea `google.com, pub-6213862553989716, DIRECT, f08c47fec0942fa0`.
- El `pub-` identifica la **cuenta de AdSense**, no el sitio. Si cursodeglobosonline.com se monetiza con la misma cuenta que academiadeconduccion.academy, la línea es la misma (y el sitio debe estar añadido en AdSense → Sitios). Si fuera otra cuenta, cambiaría el `pub-`.

## 8. Archivos generados en `research/`
Scripts: `fetch_gsc.py`, `fetch_inspect.py`, `fetch_sitemaps_children.py`, `analyze_gsc.py`, `fetch_ga4.py`, `fetch_ga4_extra.py`, `fetch_ga4_extra2.py`.
GSC: `gsc_{90d,28d}_{query,page,country,device,query_page,date,page_country,totals}.json`, `gsc_90d_{image,discover,video,googleNews}.json`, `gsc_sitemaps.json`, `gsc_sitemaps_children.json`, `gsc_url_inspection.json`, `gsc_analysis.json`, `gsc_mcp_snapshot.json`.
GA4: `ga4_admin_streams_keyevents.json`, `ga4_totals.json`, `ga4_channels.json`, `ga4_landing_{90d,28d}.json`, `ga4_organic_landing_90d.json`, `ga4_countries.json`, `ga4_devices.json`, `ga4_source_medium_90d.json`, `ga4_events_{90d,28d}.json`, `ga4_events_by_date.json`, `ga4_sessions_by_date.json`, `ga4_sessions_by_week_channel.json`, `ga4_outbound_click_domains_90d.json`, `ga4_conv_events_by_page_90d.json`, `ga4_conv_events_by_channel_90d.json`, `ga4_hotmart_clicks_by_{page,channel,country,linkurl,week}.json`, `ga4_clicks_by_week_all_domains.json`, `ga4_pre_post_launch_channels.json`, `ga4_pre_post_launch_hotmart_clicks.json`.
Producción: `sitemap_urls_live.txt`, `sitemap_urls_status.txt`.
