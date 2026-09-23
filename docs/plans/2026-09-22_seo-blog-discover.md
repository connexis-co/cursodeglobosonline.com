# Plan 2026-09-22 — SEO, blog para Google Discover, anti-canibalización y marca

> Petición de JP (sesión 2026-09-22): mejorar el SEO, entrar en Google Discover con un blog fuerte
> (≥ 20 artículos cluster con imágenes realistas), estudio de keywords con Ubersuggest + Google Ads
> API + DataForSEO, datos estructurados (estrellas, precio, disponibilidad), títulos/metas con AIDA,
> auditoría de diseño, logo nuevo en SVG (isologo con globos), ads.txt, IndexNow/Bing, llms.txt,
> logo real de Hotmart y que las páginas de curso dejen de ser canibalizadas por las de ciudad.

## 1. Objetivos medibles

| Objetivo | Métrica (GSC/GA4) | Línea base (90 d al 2026-09-21) |
|---|---|---|
| Que las money pages rankeen para "curso de X" | Posición media de `/co/curso-de-*/` en consultas "curso de …" | 50-73 (globoflexia 50,6 · bouquets 72,7 · flores 69,6) |
| Consolidar consultas de cabecera en una URL | Nº de URLs con impresiones para "curso de globoflexia" | 22 URLs (28 d) |
| Tráfico informacional nuevo | Clics a `/blog/*` | 0 (blog vacío) |
| Aparecer en Discover | Filas en GSC › Discover | 0 |
| CTR México | CTR país MX | 1,6 % (vs 7,4 % CO) |
| Conversión | Clics a Hotmart (begin_checkout) | medido en GA4 |

## 2. Decisiones

1. **Anti-canibalización (datos de GSC):** las 144 páginas curso-ciudad (similitud 0,85 con curso-país)
   declaran `canonical` → `/{cc}/{curso}/` y salen del sitemap; siguen existiendo para usuarios, Ads y
   redirecciones heredadas. Tarjetas y chips enlazan a la URL canónica. Los hubs de ciudad atacan
   "curso de decoración con globos en {ciudad}" sin nombrar los 4 cursos en title/meta.
   La categoría única (`/{cc}/cursos/decoracion-con-globos/`) pasa a `noindex,follow` (duplicaba el catálogo).
2. **Mapa de intención por URL:** home = "curso de decoración con globos online"; país = "… en {país}";
   catálogo = "cursos de globos, precios"; curso = "curso de {X}"; ciudad = "… en {ciudad}";
   blog = intención informacional (nunca "curso de X").
3. **Datos estructurados:** Course info fue retirado por Google (2025) y FAQ rich results (2026-05).
   Se usa `["Course","Product"]` + `Offer` (precio verificado, InStock) = product snippet, vigente para
   páginas de afiliado. **Sin `aggregateRating`:** las valoraciones reales existen pero son de Hotmart
   (tercero) y Google prohíbe "aggregate reviews or ratings from other websites"; se muestran visibles
   con enlace a la fuente. Las estrellas en la SERP llegarán cuando el sitio recoja reseñas propias.
4. **Honestidad de datos:** precios del checkout de Hotmart con fecha (US$25/49,99/79,99/49,99);
   los testimonios placeholder (8 en el sitio + 3 en las landings de Ads) se sustituyen por reseñas
   reales citadas de Hotmart.
5. **Blog:** Astro content collection con clusters, pilar, money page, hero 16:9 ≥ 1600 px
   (astro:assets genera 16:9/4:3/1:1 ≥ 1200 px), BlogPosting, autor (equipo editorial, sin inventar
   personas), RSS, `max-image-preview:large`. Texto: agentes Claude con guía editorial anti-IA y
   revisión adversarial (SEO/canibalización + verificación de datos). Imágenes: Nano Banana Pro
   (`gemini-3-pro-image`, ~US$0,13/imagen) con juez escéptico; OpenAI gpt-image como respaldo.
6. **Indexación:** sitemap a GSC por API; IndexNow (Bing, Yandex, Seznam, Naver, Yep) en cada deploy;
   Bing Webmaster API; solicitud manual en GSC vía Claude Cowork (`docs/seo/cowork-indexacion-manual-gsc.md`).
7. **IA:** robots.txt permite explícitamente los crawlers de búsqueda de IA; `llms.txt` y `llms-full.txt`
   con hechos verificables, temarios y el texto de las guías.

## 3. Riesgos

| Riesgo | Mitigación |
|---|---|
| El canonical curso-ciudad reduce tráfico de long-tails locales | Las long-tails locales tienen volumen ínfimo (1-25 impresiones/URL); el hub de ciudad sigue indexable. Revisar GSC a 4-6 semanas. |
| Precios cambian en Hotmart | `priceCheckedAt` visible; revisar cada trimestre (`docs/seo/2026-09-22/hotmart_datos.json` como método). |
| Contenido IA percibido como genérico | Guía editorial con prohibiciones, datos concretos verificables y revisión adversarial. |
| Discover no garantiza tráfico | Métrica de seguimiento; base = contenido útil + imagen grande. |
| iCloud desaloja archivos del proyecto (disco al 98 %) | `node_modules` → `node_modules.nosync`, git en `~/.git-dirs/` y trabajo activo en el worktree `~/dev/cursodeglobosonline.com` (fuera de iCloud). |

## 4. Resultado (2026-09-22)

**Entregado en el PR #18 (`feat/seo-discover-blog`):**

- Estudio de keywords: 14.922 ideas de Keyword Planner en 8 países, validadas con DataForSEO
  (US$1,12 de coste) y Ubersuggest; mapa temático final revisado por 3 críticos adversariales.
- Blog: 28 artículos (6 pilares, 22 satélites) con foto hero propia. La verificación de datos
  encontró citas inventadas o mal atribuidas y cifras contradictorias en 8 artículos; se
  corrigieron y se auditaron las 46 fuentes externas (todas existen). También hubo falsos
  positivos de los críticos (dominios «inexistentes» que sí resuelven): se comprobó cada uno.
- Anti-canibalización, precios reales, schema Course+Product, reseñas reales, logo nuevo,
  auditoría de diseño aplicada, IndexNow/Bing, ads.txt, llms.txt y llms-full.txt.
- Build: 281 páginas, `astro check` sin errores, verificador propio sin enlaces rotos.

**Lecciones:**

- Los agentes en paralelo se bloquearon repetidamente con el disco al 99-100 %: en este Mac
  conviene trabajar en tandas pequeñas o en el hilo principal hasta liberar espacio.
- La verificación de datos es imprescindible: el primer borrador de los artículos traía fuentes
  inventadas con apariencia creíble (CDC, fichas de distribuidores).

**Pendiente (fuera del repo, de JP):** ver `docs/ROADMAP.md` › «Pendientes de JP».
