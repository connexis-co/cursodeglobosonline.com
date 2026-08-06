# Referencias de diseño — cursodeglobosonline.com
> Análisis solo-lectura vía curl (UA Chrome 126 real). Fecha: 2026-08-06.
> HTML/CSS crudos guardados en `scratchpad/refs/` (lbd-home.html, lbd-all.css, adb-*.html, aprende-home.html, sably-home.html).

---

## SITIO 1 — lbdballoons.com (inspiración HOME)

**Stack:** SvelteKit estático (clases `svelte-xxxx`), one-page con anchors. Fancybox (galería) + Swiper (slider rentals). GA4 + Google Ads (gtag).

### Paleta exacta (definida en `[theme-ligth]` — atributo en `<html>`)
```css
--base-color1: #ff0bae;        /* magenta principal (CTAs) */
--base-color1-hover: #a20dff;  /* morado hover */
--base-color2: #05cccc;        /* cian secundario (botón v3) */
--base-color3: #192b91;        /* azul marino */
--base-text-color: #525258;
--base-text-color-bold: #313134;
--background: #eeeefd;         /* lavanda muy claro, fondo global */
```
Otros: hero bg `#3d055f` (morado profundo), verde WhatsApp `#00e676`, blanco #fff dominante (41 usos), grises #94999d/#737581 (placeholders).

### Tipografía
- Única fuente: **"Baloo Thambi 2", sans-serif** (redondeada, jovial — perfecta para globos).
- Truco rem: `html{font-size:10px}` → `body{font-size:1.6rem}` (=16px). H2 `.o-heading`: 3rem→3.8rem, weight 600.

### Hero (block-1) — VIDEO DE FONDO
```html
<section id="home" class="block-1">
  <div class="banner__heading">  <!-- absolute, centrado flex -->
    <div class="banner__text-1">Lets Celebrate!</div>   <!-- 2.6→3.4rem -->
    <h1 class="banner__text-2">Balloon Designer</h1>    <!-- 3.8→4.6rem -->
  </div>
  <video autoplay loop muted defaultmuted playsinline preload="auto" oncontextmenu="return false;">
    <source src="/videos/banner.mp4" type="video/mp4">
  </video>
</section>
```
CSS clave:
- `.block-1 { height:380px (→450px desktop); background:#3d055f; }`
- `.banner__video { object-fit:cover; mix-blend-mode:screen; }` ← el video se funde con el fondo morado
- `.block-1:before` overlay: `linear-gradient(180deg, rgba(255,11,174,.75) 1%, rgba(5,204,204,.75) 100%)` (magenta→cian)
- `.block-1:after`: borde inferior curvo SVG (`bg-curva-banner.svg`, 84px alto) — transición orgánica hero→contenido
- Texto con `text-shadow: 0 2px 3px rgba(0,0,0,.5)`

### ⭐ Keyframes de globos flotantes (EL patrón a copiar)
```css
@keyframes floating {
  0%   { transform: translateY(0); }
  50%  { transform: translateY(25px); }
  100% { transform: translateY(0); }
}
/* aplicado a la <img> dentro del wrapper posicionado: */
.globo img { animation: floating 3s ease-in-out infinite; transition: all 2s ease; }
.globo, .globo--v1..v9 { position:absolute; z-index:5; transition: all 2s ease; }
```
- **9 variantes de posición** (`globo--v1..v9`) con top/left/bottom/right negativos que sangran fuera de sección: ej. `--v1{top:-250px;left:-300px}`, `--v2{bottom:-140px;right:-40px}`, `--v5{top:-90px;left:calc(100% - 90px)}`.
- max-width por variante: 120–345px.
- **Desincronización por inline style**: `style="animation-delay: 0s / -0.3s / -0.6s / -1s"` — delays NEGATIVOS para que arranquen en fases distintas.
- Imágenes: `/assets/images/globo-azul-1..6.webp` (536×590), lazy con `data-src` + clase `lazy`.

### Otros keyframes
```css
@keyframes ondasheader { 0%{background-position:0 bottom} to{background-position:118px bottom} }
/* header::before: onda SVG repeat-x bajo el header, animation: ondasheader 3s linear infinite */

@keyframes ondas { 0%{transform:scale(1)} 15%{opacity:1} to{opacity:0; transform:scale(2.5)} }
/* pulso del botón flotante WhatsApp/tel: .boton-whatsapp__onda 45px círculo #00e676, 1.7s infinite, 2 ondas desfasadas */

@keyframes rotation { 0%{transform:rotate(0)} to{transform:rotate(360deg)} }  /* spinner form .7s linear */
```

### Easings / transiciones
- Dominantes: `all .2s ease` (12x), `all .3s ease` (10x).
- Cubic-beziers exactos: `cubic-bezier(.16,1,.3,1)` (8x, expo-out — paneles fancybox), `cubic-bezier(.87,0,.13,1)` (in-out dramático, .6–.7s), `cubic-bezier(.25,1,.5,1)`, `cubic-bezier(.23,1,.32,1)` (acordeones max-height .35s).
- `html { scroll-behavior: smooth }` para anchors.

### Orden de secciones del home (one-page)
1. **Header sticky** (60px, padding-top del body) con onda SVG animada inferior + nav anchors (Home / About Me / Services / Gallery / Contact) + menú móvil propio.
2. **block-1** Hero: video fondo + overlay gradiente + H1 + curva SVG.
3. **block-2** Intro: párrafo de propuesta de valor en negrita + CTA "GET A QUOTE NOW" (#contact) + globos decorativos.
4. **block-3** About Me (`#about-me`): 2 columnas (col-1 texto / col-2 foto).
5. **block-4** Services (`#services`): H2 + intro ("100% Biodegradable...") + grid de cards.
6. **block-5** Rentals: banda con slider Swiper (flechas prev/next custom) de artículos de alquiler con precio.
7. **block-6** Gallery (`#gallery`): grid con Fancybox, mezcla webp + mp4 (`data-fancybox="gallery"`), glows laterales `radial-gradient(circle at 22% 50%, rgba(255,11,174,.2), transparent 54%)` a ambos lados.
8. **block-7** Contact (`#contact`): 2 col — info de contacto (tel, ubicación con iconos icomoon) + formulario largo de cotización; globos flotantes decorando el form.
9. **Footer** mínimo: solo crédito del diseñador.
10. Botón flotante tel/WhatsApp con doble onda pulsante.

### Cards de servicios
```css
.services__item { padding:9px; border-radius:8px; background:#fff;
                  box-shadow:0 2px 5px #00000014; transition:all .3s ease;
                  display:flex; flex-direction:column; }
.services__img img { border-radius:8px; }
.services__heading { font-size:1.9rem; color:#2e2e32; font-weight:600; }
```
- Grid mosaico 12 col: items con `grid-column:1/5, 5/9, 9/13...` y algunos `grid-row:2/4` (celdas dobles).
- Patrón contenido: foto cuadrada 500×500 → H3 nombre → precio "Starting at $250 + Delivery" → CTA pill.

### Botones
```css
.o-btn { height:46px; padding:0 20px→35px; border-radius:30px;  /* pill */
         background:var(--base-color1); color:#fff; font-weight:600;
         font-size:1.7rem; transition:all .2s ease; }
.o-btn:hover { background:var(--base-color1-hover); }  /* magenta→morado */
.o-btn--v3 { background:var(--base-color2); }           /* variante cian */
```
CTA siempre en MAYÚSCULAS: "GET A QUOTE NOW".

### Formulario de cotización (block-7) — campos reales
Name*, Email*, Date of your event* (type=date + help text), Event location* (select), Event address*, What time does your event start?* (type=time), Theme*, Balloon colors*, Indoors/outdoors?* (select), Budget, "What will balloons be attached to?*" (5 checkboxes: Wall with command hooks / Marquee numbers/letters / One of our backdrops (extra fee) / Stairway / Other), How did you hear about us?
- Labels arriba, layout en filas de 2 columnas (`form__row > form__col`), spinner en submit.

---

## SITIO 2 — academiadebelleza.edu.co/barberia-profesional/ (PÁGINA DE CURSO tipo funnel)

**Stack:** WordPress 7.0.2 + Elementor 4.2.1 (esta landing) — el resto del sitio usa WPBakery/Impreza. Es una **landing de venta Hotmart** sin header/nav del sitio.

### SEO
- **Title:** `Barbería Profesional | Academia De Belleza Beauty Luxe`
- **Meta description:** "¿Sientes una verdadera pasión por el arte de la barbería y la transformación del cabello? Convierte tu pasión en una profesión lucrativa y asegura tu éxito en…"
- **Canonical:** https://academiadebelleza.edu.co/barberia-profesional/

### JSON-LD (bloque @graph estilo Rank Math)
Tipos presentes: `Place`, `[EducationalOrganization, Organization]`, `WebSite`, `ImageObject`, `BreadcrumbList` (2 niveles: Inicio → Barbería Profesional), `WebPage`, `VideoObject` ×3 (embeds YouTube). **No hay Course ni FAQPage en esta landing** (sí en las páginas de curso del sitio 3).

### Outline de secciones EN ORDEN (H reales)
1. H1 **"¡Conviértete en un experto barbero!"** + video YouTube embed + CTA
2. H2 "¡Barbería Profesional a tu Alcance!" (repite H1 en versión mobile — H1 duplicado, mala práctica)
3. Fila de 4 beneficios (pares H2 título corto + H2 descripción):
   - "Duración del Curso" → "20 módulos con los que te formaras como experto en barbería"
   - "modalidad aprendizaje" → "La Modalidad del curso es 100% online, disponibles las 24 horas"
   - "Soporte y Comunidad" → "equipo de soporte disponible y red de estudiantes para aprender"
   - "empiezas de inmediato" → "Tan pronto realices el pago, recibes todo a tu correo electrónico"
4. H2 "Maestría en Estilos: ¡Curso de Barbería!" (video + bullets de temario resumido)
5. H2 **"Logra tu Certificación en Barbería Profesional"** — imagen del diploma (`certificado-curso-master-en-barberia-600x416.jpg`) + checklist:
   - Certificación del curso reconocido a nivel nacional e internacional
   - Inclusión de una guía de estrategias de venta de tus servicios
   - Taller 100% confiable, garantía de satisfacción o reembolso en 7 días
   - Acceso inmediato y permanente al curso mediante un único pago
   - Recibirás todos los detalles de acceso en tu correo electrónico
   - Clases disponibles las 24 horas del día, flexibilidad de estudio
6. H2 **"OFERTA ESPECIAL"** + H3 "ESTA PROMOCIÓN CIERRA EN POCOS MINUTOS" + **countdown Elementor** (`elementor-widget-countdown`, solo Minutos y Segundos) + precio ancla:
   - **"DE US$50.00 POR APENAS US$25,00"** (tachado + precio grande)
   - CTA "QUIERO COMPRAR AHORA"
7. H2 "¿cómo aprenderás el arte de la barbería?" — **temario 20 módulos** listados (Módulo 1: Introducción… Módulo 20: Video respuestas a preguntas frecuentes)
8. H2 **"GARANTÍA DE SATISFACCIÓN"**: "Regístrate en nuestro curso hoy y disfruta de 7 días completos… Si, por alguna razón, no estás totalmente satisfecho, te reembolsaremos tu inversión sin preguntas… ¡Únete ahora sin ningún riesgo…!"
9. H2 **"PREGUNTAS FRECUENTES"** (toggle Elementor)
10. Footer copyright: "Copyright 2024 - Beauty Luxe Academy ® Todos los derechos reservados."

### FAQs exactas (7)
1. ¿QUÉ TEMAS SE ABORDAN EN EL CURSO DE BARBERÍA?
2. ¿Cuál es la duración del curso?
3. ¿Cómo es el proceso de inscripción y cuáles son los métodos de pago aceptados?
4. ¿ES ESTE CURSO ADECUADO PARA PRINCIPIANTES SIN EXPERIENCIA PREVIA?
5. ¿Cuánto tiempo tendré acceso a las lecciones y materiales del curso?
6. ¿Recibiré un certificado al finalizar el curso de barbería virtual?
7. ¿NECESITO EQUIPOS ESPECÍFICOS PARA TOMAR EL CURSO?
(Nota: la respuesta 1 menciona "maquillaje" — copy reciclado de otra landing sin editar.)

### CTAs exactos (todos → checkout Hotmart `hotm.art/...?offDiscount=031016`)
- "¡INSCRÍBETE AHORA Y RECIBE EL 50% DE DESCUENTO!"
- "ACCEDE AL CURSO AHORA MISMO"
- "QUIERO COMPRAR AHORA"
- "¡Inscríbete y Desarrolla tu Destreza!"

### Social proof
Sin números de estudiantes ni ratings visibles en esta landing (solo "red de estudiantes"). El certificado se respalda como "certificado oficial respaldado por Hotmart".

---

## SITIO 3 — Páginas de curso del catálogo (Impreza/WPBakery)

URLs analizadas:
- /cursos-belleza/barberia/curso-de-barberia/
- /cursos-belleza/unas/curso-de-manicure-y-pedicure/

### Estructura de URL (¡patrón SEO clave!)
`/cursos-belleza/{categoría}/{curso}/` — 4 niveles de breadcrumb en JSON-LD:
`Inicio → Cursos de Belleza → Cursos de {Categoría} → Curso de {X}`

### SEO
- **Title pattern:** `Curso de {X} Online | 【Obtén el 50% Dto】` (con corchetes japoneses para CTR en SERP)
- Meta desc con imperativo final: "…¡inscríbete Ahora!" / "…¡Inscríbete ya!"
- H1: "Curso de Barbería Online" / "Curso Manicura y Pedicura Online"

### JSON-LD (mucho más rico que la landing del sitio 2)
1. `BreadcrumbList` 4 niveles.
2. `CreativeWorkSeries` con **aggregateRating: { ratingValue: "5", bestRating: "5", ratingCount: "49" }** ← así muestran estrellas en SERP sin arriesgar el Course.
3. `EducationalOrganization`.
4. **`Course`**:
```json
{ "@type": "Course",
  "name": "Curso de Barbería",
  "provider": { "@id": ".../#organization" },
  "inLanguage": "es",
  "educationalCredentialAwarded": "Certificado de finalizacion",
  "hasCourseInstance": [{ "@type": "CourseInstance", "courseMode": "online",
                          "courseWorkload": "PT20H", "inLanguage": "es" }],
  "offers": [{ "@type": "Offer", "price": "84500", "priceCurrency": "COP",
               "availability": "https://schema.org/InStock", "category": "Paid", "url": "..." }] }
```
(Defecto detectado: el campo description contiene shortcodes WPBakery sin limpiar.)

### Orden de secciones (idéntico entre ambos cursos = plantilla)
1. Hero 2 col: H1 + H2 subtítulo + copy → **precio ancla "¡Inicia hoy mismo! Adquiere este curso por sólo: ~~$169.000 COP~~ $84.500 COP"** + **formulario de lead inline** (no checkout directo).
2. "Aprendizaje de calidad 100% en línea": H3 Duración del Curso Completo / H3 Modalidad de Aprendizaje / H3 ¡Empieza tu Curso Ahora! (duplicado desktop/mobile).
3. H2 "¿QUÉ APRENDERÁS en nuestro curso de {x}?" (bullets).
4. H2 "¿QUÉ INCLUYEN NUESTROS CURSOS?" — checklist: guía de venta de servicios / garantía 7 días / "Curso certificado por Hotmart, válido a nivel nacional e internacional" / clases 24h / acceso instantáneo y permanente con pago único.
5. H2 "Temario" + H3 "MÓDULOS DE APRENDIZAJE" — **acordeón módulo → lecciones** ("Módulo 1: Bienvenida → Lección 1: Bienvenida. Lección 2: Hoja de ruta…").
6. H2 "¡CERTIFICA TUS HABILIDADES Y LIBERA NUEVAS OPORTUNIDADES!" + imagen diploma.
7. Garantía: barbería usa H3 "Clases 100% confiable con 7 días de garantía…"; manicure usa H2 "COMPRA 100% SEGURA, 7 DÍAS DE GARANTÍA" + H3 "Si no estás satisfecho te devolvemos tu dinero".
8. H2 "POSIBILIDADES LABORALES ILIMITADAS" — 3 salidas: Barberías y Salones / Eventos Especiales / Tu propio negocio.
9. H2 "Acerca del Instructor(a)" (bio con foto).
10. H2 "¿Que dicen nuestros estudiantes?" — 3 testimonios con nombre propio.
11. H2 cierre "CONVIÉRTETE EN UN EXPERTO… ¡CERTIFÍCATE AHORA!" + repite bloque precio+form.
12. H2 "Te puede Interesar" — 3 cursos relacionados (cards).
13. H2 "Preguntas Frecuentes" — 10-11 FAQs en acordeones (títulos `w-tabs-section-title`).

### Formulario de lead (en vez de botón de pago)
Contact Form 7 anclado `#floating-form`: Nombre(*), Apellido(*), Correo(*), Teléfono/Celular(*), select País (plugin `wpcf7-geoip_detect2_countries` con autodetección geo). Los CTAs de la página ("¡Inicia tu curso ahora!", "¡Comienza hoy!", "¡Inscríbete ahora!") hacen scroll al form.

### Diferencias vs sitio 2 (landing Elementor)
| Aspecto | Landing /barberia-profesional/ | Página de curso catálogo |
|---|---|---|
| Objetivo | Checkout directo Hotmart (US$) | Captura de lead (COP) |
| Precio | US$50 → US$25 | $169.000 → $84.500 COP |
| Schema | Sin Course/rating | Course + Offer + aggregateRating 5/5 (49) |
| Countdown | Sí (min/seg) | No |
| Breadcrumb | 2 niveles | 4 niveles (categoría) |
| Instructor/testimonios/relacionados | No | Sí |
| Temario | Lista plana 20 módulos | Acordeón módulos + lecciones |

---

## SITIO 4 — aprende.com (MENÚ MOBILE)

**Stack:** WordPress + tema propio "aprende21", WP Rocket, design system propio (`--aprende--*`).

### Variables de color (referencia de sistema)
`--aprende--primary:#db0f3c` (rojo), `--aprende--secondary:#405973` / 700 `#1b2631`, `--aprende--tertiary:#5076cd`, success `#32c25f`, warning `#e59e00`, escalas 100–900 por color.

### Jerarquía del menú
- Nivel 0 (barra): **Programas | Recursos | Experiencia** + tel `+1 (800) 894-6994` + CTAs "For Employers" y "Campus Virtual" (`btn-primary-outline`).
- Nivel 1 (mega menú "Programas"): **6 categorías**: Gastronomía, Emprendimiento, Bienestar, Belleza, Oficios, Hospitalidad y Eventos — cada una con descripción corta y con embajador famoso ("junto al Chef Yisus", "junto a Ana Patricia").
- Nivel 2 (por categoría): lista de cursos (`header-mega-menu_sub-item-container` con `data-slug`, ej. "Repostería") + botón **"Ver todo {Categoría}"** + botón "Explorar todos" + bloque **"Te puede interesar leer"** (`menu-additional-item`) con 2-4 artículos con imagen lazy `<picture>`.
- **Sin buscador** en el header (0 matches de "search").

### Patrón mobile full-page (clases reales)
- Hamburguesa: `.menu_btn` (35×35, `display:none` → `display:block` en `@media (max-width:1100px)`), icono dibujado con `span + :before + :after` de 2px (`background: var(--aprende--secondary-700)`).
- Panel: `header-mega-menu_main-container` con `style="display:none"` inline que JS muestra como overlay full-page; estructura interna IDÉNTICA a desktop (mismo markup, doble render `l-new-design-system_mobile`).
- **Drill-down por niveles**: cada `header-mega-menu_item` tiene `data-apt-action="open"` y `data-menu-id` (`programs-0`, `standard-1`…); al entrar a un nivel aparece `header-mega-menu_secondary` con **botón atrás** `.btn-backward` (chevron SVG + `data-apt-action="backward"`).
- Tracking de menú por atributos `data-apt-key` / `data-apt-e-clicked` / `data-apt-e-toggled` (analytics propio).
- Ítems con imagen usan `<picture>` + `data-lazy-srcset` + placeholder SVG inline (LCP-friendly).

---

## EXTRA — sably.co (header países + footer)

**Stack:** **Astro v7.1.6** + Tailwind v4 (clases arbitrarias, tokens `surface-*`, `accent`, `primary`, `ink`, `heading`, `muted`). Sitio propio de JP — reutilizar componentes.

### Header (`sticky top-0 z-50 border-b bg-white/95 backdrop-blur`, h-16)
1. Logo: punto `bg-accent` + wordmark "Sably" (`font-display font-extrabold`).
2. Nav desktop (`hidden lg:flex`): botón "Categorías" con chevron → **mega panel** `w-[900px]` grid `[240px_1fr_280px]` (col 1: categorías con emoji 💅💄🍞 y estado `data-active`; col 2: cursos de la categoría activa; col 3: destacado). Transición: `duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]`, `opacity-0 invisible translate-y-1` → visible. Item especial "💅 Belleza" enlaza a academiadebelleza.edu.co con badge "Academia".
3. Acciones: botón buscador (lupa, `data-search-open`, aria-label "Buscar cursos (Ctrl+K)") · **selector de país** · CTA "Empezar ahora" (`bg-accent`, → /co/cursos/) · hamburguesa `lg:hidden` con doble SVG burger/close.

### Selector de países (el patrón a replicar)
- Trigger en header: `<button data-geo-open>🇨🇴 Colombia <chevron/>` (border, truncado en mobile `max-w-[46vw]`).
- Modal: **`<dialog id="geo-dialog">`** nativo (`backdrop:bg-ink/50 backdrop:backdrop-blur-sm`, `w-[min(92vw,480px)]`), título "¿Desde dónde nos visitas?".
- **Paso 1** `data-geo-step="country"`: grid 2 col de 8 botones `data-geo-country`: 🇨🇴 Colombia, 🇲🇽 México, 🇵🇪 Perú, 🇪🇨 Ecuador, 🇨🇱 Chile, 🇦🇷 Argentina, 🇪🇸 España, 🇺🇸 Estados Unidos (bandera = emoji `text-xl`, hover `border-accent bg-accent-soft`).
- **Paso 2** `data-geo-step="cities-{cc}"` (oculto con `hidden`): botón "← Cambiar país" (`data-geo-back`) + grid 2 col: "🇨🇴 Todo Colombia" (→ `/co/`) + ciudades (→ `/co/bogota/`, `/co/medellin/`, `/co/cali/`, `/co/barranquilla/`, `/co/cartagena/`, `/co/bucaramanga/`; MX: `/mx/cdmx/`, `/mx/guadalajara/`, `/mx/monterrey/`…).
- URLs geo: `/{país}/` y `/{país}/{ciudad}/`. El dialog guarda `data-path` para reconstruir la ruta.

### Menú mobile de sably (implementa el patrón aprende.com)
`#mobile-drawer`: overlay `fixed inset-0 z-[60]` con backdrop `bg-ink/50 opacity-0 → 1` (380ms) y panel derecho `w-[min(92vw,400px)] translate-x-full → 0` con `ease-[cubic-bezier(0.32,0.72,0,1)]`. Navegación multi-nivel con **paneles deslizantes**: `data-mnav-panel` (10 paneles), `data-mnav-go` (avanzar), `data-mnav-back` (volver). Cabecera del drawer: logo + botón WhatsApp verde `#00e676` (wa.me con texto prellenado) + cerrar.

### Footer (`bg-primary text-white`)
- Grid `lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]`:
  1. **Marca**: logo + tagline "Aprende un oficio real. Emprende tu futuro." + rótulo uppercase "Ecosistema Sably" (link → Academia de Belleza) + 4 redes en círculos `bg-white/10 hover:bg-accent` (Instagram, TikTok, Facebook, YouTube — SVG inline).
  2. **Categorías** (13): Belleza (externa), Belleza Online, Panadería y Pastelería, Gastronomía, Oficios, Moda y Confección, Bienestar, Manualidades, Emprendimiento, Cuidado Animal, Idiomas, Música, Hospitalidad → `/co/cursos/{slug}/`.
  3. **Países** (8 con bandera emoji) → `/{cc}/`.
  4. **Institucional**: Sobre nosotros, Homologaciones, Blog, Mapa del sitio, Términos, Privacidad.
- Barra inferior `border-t border-white/10`: "© 2026 Sably — Todos los derechos reservados." + **"Los cursos se imparten a través de Hotmart. Certificado incluido."**
- Links: `text-sm text-white/70 hover:text-white`.

---

## Síntesis accionable para cursodeglobosonline.com

1. **Home (de LBD):** hero con video mp4 `mix-blend-mode:screen` sobre color de marca + overlay gradiente 2 colores + curva SVG inferior; globos webp absolutos sangrando de las secciones con `floating 3s ease-in-out infinite` y `animation-delay` negativos; fuente display redondeada tipo Baloo; CTAs pill magenta→hover morado; botón WhatsApp flotante con ondas `scale(1)→2.5 + fade` 1.7s.
2. **Página de curso (de academiadebelleza):** plantilla de 13 secciones (hero+precio ancla+form lead → beneficios → qué aprenderás → qué incluye → temario acordeón → certificado → garantía 7 días → salidas laborales → instructor → testimonios → cierre con precio → relacionados → FAQ); title pattern `Curso de {X} Online | 【Obtén el 50% Dto】`; JSON-LD Course+Offer(COP)+CourseInstance(PT20H)+aggregateRating en CreativeWorkSeries; breadcrumb 4 niveles con URL `/cursos/{categoria}/{curso}/`.
3. **Menú (de aprende.com/sably):** mega menú desktop 3 columnas + mobile drawer de paneles deslizantes multi-nivel con botón atrás (sably ya lo tiene implementado con `data-mnav-*` — portar tal cual).
4. **Header/footer (de sably):** portar selector de país `<dialog>` 2 pasos (país→ciudades, 8 países) y footer 4 columnas con ecosistema, categorías, países e institucional + nota Hotmart.
