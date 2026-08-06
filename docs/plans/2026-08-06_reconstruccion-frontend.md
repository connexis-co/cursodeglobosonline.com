# Plan: Reconstrucción frontend cursodeglobosonline.com

**Fecha**: 2026-08-06 · **Estado**: ✅ Ejecutado (v0.1.0)

## Objetivo

Reemplazar el sitio WordPress (Impreza + Elementor + WPBakery + RevSlider) por un frontend
Astro 7 + Tailwind 4 estático en Cloudflare Pages, siguiendo el prompt maestro de la
reconstrucción: diseño anti-IA inspirado en LBD Balloons, páginas de curso estilo
academiadebelleza, navegación de países estilo sably.co y menú mobile estilo aprende.com.

## Decisiones tomadas (con su porqué)

1. **Catálogo = los 4 cursos REALES del sitio anterior** (Globoflexia, Bouquets, Flores,
   Globos Burbuja), no cursos inventados. Temarios verbatim de la auditoría. El curso
   "decoración con globos" de sably (hotmartUrl PENDIENTE) no se incluyó porque no mapea a
   un producto Hotmart verificable.
2. **Enlaces Hotmart intactos**: `hotm.art/*-crashing` conserva la cadena de afiliado
   (go.hotmart.com/X76953266Q → pay.hotmart.com/M47265375C?ref=…). El builder solo agrega
   UTMs/src encima, nunca cambia host ni slug.
3. **Descuento real**: el único descuento verificado es `offDiscount=031016` (50%, $50→$25,
   de /black-friday/). Se usó como oferta principal de Globoflexia. NO existe cupón
   alfanumérico para estos productos (SABLY40 es del catálogo Sably) → sin chips de cupón.
4. **Datos honestos**: precio/rating/estudiantes son opcionales en el schema de contenido;
   solo Globoflexia publica precio (el único público). Social proof del sitio: los contadores
   auditados (+100 certificados, +80 emprendimientos, +50 videos).
5. **Output estático** (como sably.co), sin adapter SSR: mejor Core Web Vitals y cero costo;
   geo-detección client-side (GeoToast). Edge/SSR queda para Fase 2 si hace falta.
6. **Ciudades**: activadas en la misma v0.1 por pedido de JP (`CITIES_ENABLED=true`):
   36 hubs + 144 cursos hiperlocales con contenido único por ciudad en `lib/cities.ts`
   (§6.2). Las URLs geo del sitio viejo redirigen a su ubicación canónica /co/{ciudad}/….
7. **Home global en `/`** (a diferencia de sably que redirige a /co/): es la pieza de diseño
   LBD y el x-default del hreflang.
8. **Tracking**: solo GTM (GTM-KKP7WL8Q existente). No se hardcodea GA4 para no repetir el
   doble-firing del sitio viejo (G-WVTB898GPH hardcoded + G-PHN6J5MTX6 en GTM). Consolidación
   de propiedades pendiente de decisión de JP.
9. **Testimonios**: el sitio viejo no tenía ninguno. Se crearon 8 placeholder convincentes
   (permitidos por el plan maestro §3.2) coherentes con cada curso — **TODO(JP): reemplazar
   por reseñas reales de Hotmart** en cuanto haya acceso de productor.
10. **Emojis en titles** (🎈): se mantuvo el patrón del sitio viejo (decisión consciente de CTR).

## Riesgos y pendientes

- **offDiscount=031016 puede rotar**: si el productor la cambia, actualizar `hotmartUrl` y
  `discountPct` en `curso-de-globoflexia.mdx`. Fase 2: leerlo de la Hotmart API (la credencial
  actual es de afiliado y no lista productos del productor).
- **Precios de los otros 3 cursos**: no públicos; el checkout muestra tablas idénticas a
  Globoflexia (probable mismo precio) pero no se publicó sin confirmación.
- **Cutover DNS**: el deploy a Pages NO toca el dominio. El switch de cursodeglobosonline.com
  al proyecto Pages es paso manual de JP (ver docs/TRACKING.md y README).
- **OG image**: placeholder degradado; generar arte real (Gemini/foto) en v0.2.
- **Redes sociales propias**: el sitio viejo tenía iconos sin enlace; apuntamos a Sably
  mientras no existan perfiles propios.

## Resultado

72 páginas estáticas, build 2.7s, `astro check` 0 errores, Lighthouse pendiente de medir
en producción. Repo `connexis-co/cursodeglobosonline.com` con CI/CD a Cloudflare Pages.
