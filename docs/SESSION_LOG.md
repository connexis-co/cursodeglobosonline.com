# Bitácora de sesión — 2026-08-06 (Claude Code)

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
