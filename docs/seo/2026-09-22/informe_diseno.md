# Auditoría UI/UX y conversión: cursodeglobosonline.com

**Fecha:** 2026-09-22 · **Alcance:** producción (`https://cursodeglobosonline.com`), solo lectura del repo · **Autor:** agente de auditoría de diseño

---

## 0. Método, fuentes y límites

| Qué | Cómo se obtuvo |
|---|---|
| Capturas completas (desktop 1440×900 DPR 1 y móvil 390×844 DPR 2) de `/`, `/co/`, `/co/curso-de-globoflexia/`, `/co/curso-de-flores-con-globos/`, `/co/bogota/`, `/co/cursos/`, `/blog/` y una URL 404 | Chrome 153 headless por DevTools Protocol (`research/design/capture.mjs`). Scroll completo antes de capturar. |
| Contraste WCAG 2.x | Script en el navegador integrado (`research/design/audit.js`): convierte los tokens OKLCH a sRGB con `<canvas>`, compone la opacidad y el fondo de los ancestros y aplica la fórmula de luminancia relativa de WCAG. Si hay un degradado o una imagen de fondo, el ratio se verificó aparte con los colores extremos. |
| Tamaños táctiles | `getBoundingClientRect()` de `a, button, summary, input, select` visibles en móvil (375×812 emulado). |
| CLS | `PerformanceObserver('layout-shift', buffered)` después de recorrer la página, medido en laboratorio en este navegador. |
| Bugs de comportamiento | Estilos computados (`getComputedStyle`), `elementFromPoint` y reproducción en headless con `Emulation.setLocaleOverride` (`geotoast_test.mjs`, `evidence.mjs`). |
| Diseño esperado | `docs/DESIGN_SYSTEM.md`, `src/styles/global.css`, `src/components/*.astro`, `src/pages/**`. |

**Límites:**
- **LCP no se midió de forma confiable.** La pestaña del navegador integrado corre en segundo plano y el primer pintado se retrasa, así que el valor salió artificialmente alto. No se reporta.
- No hay datos de campo (CrUX/PSI) en este informe.
- **Enlaces de Hotmart:** los `hotm.art` no se siguieron en vivo para no sumar clics falsos a las estadísticas de afiliado. La cadena de redirección se describe según el comentario de `src/lib/hotmart.ts`.
- **Cambios en paralelo:** mientras se hacía esta auditoría, otro proceso tenía cambios sin commit en el repo (blog: `src/components/blog/*`, `src/pages/blog/[slug]/`, `.articulo` en `global.css`, `public/ads.txt`). La auditoría visual es de **producción**. La sección 5 revisa esos componentes nuevos contra el sistema de diseño.

---

## 1. Resumen de hallazgos

| # | Hallazgo | Severidad | Evidencia |
|---|---|---|---|
| 1 | **La barra de compra fija en móvil (`StickyCta`) nunca aparece.** El JS modifica `transform`, pero Tailwind v4 oculta la barra con la propiedad `translate` (`translate-y-full` → `translate: 0 100%`). | **P0** | `evidencias/02_*.png`, `evidencias.json` → `inlineTransform:"translateY(0px)"`, `computedTranslate:"0px 100%"`, `visible:false` |
| 2 | Cuando se arregle el punto 1, **el botón flotante de WhatsApp tapa el botón de compra** de la barra (mismo `z-40`; WhatsApp va después en el DOM). | **P0** | `evidencias/03_*.png`, `overlap:true` |
| 3 | **3 de 4 money pages no tienen barra fija en móvil** (`StickyCta` solo se renderiza si hay `priceUSD`). En móvil el primer botón de compra queda **debajo del fold** (CTA en y=955 px con un viewport de 830 px). | **P0** | `evidencias/04_*.png`; medición en `/co/curso-de-globoflexia/` |
| 4 | **Contraste de todos los CTA primarios:** texto blanco sobre `coral-500` = **4.03:1**. AA exige 4.5:1 para texto de 14 px en bold. Afecta a los botones «Inscribirme…», «Explorar los cursos», «Quiero información», al chip «−50%», etc. | **P0** | `audit.js` en todas las páginas |
| 5 | **GeoToast propone el país equivocado.** Con el navegador en `es-ES` (común en LATAM), una página `/co/…` muestra «¿Estás en España? Te mostramos precios en tu moneda». | **P0** | `evidencias/05_*.png`; `geotoast_test.mjs` |
| 6 | **Enlaces rotos en el footer de todo el sitio:** `/co/cursos/eventos/` y `/co/cursos/emprendimiento/` responden **404** (el footer lista todas las categorías, pero solo se generan las que tienen cursos). | **P0** | `curl` → 404 |
| 7 | En desktop 1440 px, el mega menú «Cursos» **se sale por la izquierda** (`left: −20 px`, se corta «CATEGORÍAS»). | P1 | `evidencias/01_*.png` |
| 8 | En la home móvil, los globos del hero **se montan sobre el H1 y los CTA**. | P1 | `evidencias/06_*.png` |
| 9 | Grid de cursos del home: **queda un hueco** (fila 2, col. 3) y la tarjeta destacada no llena sus 2 filas. El catálogo deja una tarjeta huérfana y un filtro con una sola categoría. | P1 | `evidencias/08_*.png`, `09_*.png` |
| 10 | Emojis usados como iconografía (lo que el propio DESIGN_SYSTEM §5 prohíbe). CTA final con degradado coral→lila y glows difusos de plantilla. | P1 | lista en §2.6 |
| 11 | `/co/cursos/` y `/blog/` **no tienen H1** (`SectionHeading` siempre renderiza `h2`). | P1 | `audit.js` → headings |
| 12 | Prueba social débil: testimonios con avatar de inicial y sin el curso tomado, certificado mostrado como **mockup en blanco**. | P1 | capturas |
| 13 | CTA del header «Empezar ahora» y «Comienza tu primer curso»: son CTA genéricos que el propio DESIGN_SYSTEM §6 prohíbe. | P1 | Header.astro L216, L344 |
| 14 | `DESIGN_SYSTEM.md` desactualizado frente a `global.css` (valores de coral/ciruela/crema; botones «pill + uppercase» que el código no usa). | P2 | comparación directa |
| 15 | **CLS = 0** en todas las páginas medidas (lab). Estabilidad visual correcta. | OK | `audit.js` |

---

## 2. Hallazgos detallados

### 2.1 Camino a Hotmart (conversión)

Estado actual por página de curso (etiquetas medidas en el DOM):

| Página | CTA hacia Hotmart (en orden) | Barra fija móvil | Precio visible |
|---|---|---|---|
| `/co/curso-de-globoflexia/` | «Inscribirme con 50% OFF» (hero) · «Quiero mi certificado» · «Inscribirme con 50% OFF» (cierre) · «Inscribirme ahora» (barra, **invisible**) | Existe pero **no se muestra** | Sí: «Antes $200.000 COP → $100.000 COP», con el chip «50% OFF aplicado en el enlace» |
| `/co/curso-de-flores-con-globos/` (igual en bouquets y burbuja) | «Inscribirme ahora» (hero) · «Quiero mi certificado» · «Inscribirme ahora» (cierre) | **No existe** | No: «💳 El precio se muestra en COP en el checkout…» |

- **Primer viewport en móvil** (globoflexia, 383×830 efectivo): H1 en y=205–313, imagen en 523–780, tarjeta de precio desde **802**, botón de compra en **955–1007**. El orden título → imagen → precio que pidió JP se respeta, pero en el primer pantallazo no hay ningún CTA de compra, y la barra fija que debía cubrir ese hueco está rota.
- **Desktop:** `StickyCta` lleva `lg:hidden` y el `aside` de la descripción («¿Este curso es para ti?», «Requisitos») no incluye compra. Entre el hero y la sección del certificado hay aprox. 2.000 px sin CTA.
- **Copy inconsistente:** «Inscribirme con 50% OFF» (hero), «Inscribirme ahora» (barra), «Quiero mi certificado» (certificado). En las tarjetas, globoflexia muestra el precio en coral y los otros tres dicen «Ver curso y precio →» en `aqua-700`: dos tratamientos distintos para la misma acción.
- **Salida a Hotmart:** `target="_blank"` hacia `hotm.art/...` (según `lib/hotmart.ts`: `hotm.art → go.hotmart.com → pay.hotmart.com`). La garantía («7 días de garantía con devolución del 100%») y el sello «Pago seguro con Hotmart» están junto al CTA del hero, que es lo correcto, aunque en `text-xs text-ciruela-400`: poco peso visual para una señal de confianza clave.
- **Positivo:** el chip «50% OFF aplicado en el enlace» y la nota «≈ US$ 25 · Hotmart confirma el valor exacto en COP» son honestos y reducen la duda antes del checkout.

### 2.2 Contraste (WCAG 2.x AA), medido

| Par | Ratio | Uso | Estado |
|---|---|---|---|
| Blanco / `coral-500` (228,64,97) | **4.03** | Todos los CTA primarios, chips −50%, «Todos», «Todo Colombia →» | ✗ (texto 12–14 px) |
| Blanco / `coral-600` | 5.41 | propuesta | ✓ |
| Blanco / `coral-700` | 7.23 | propuesta hover | ✓ |
| Blanco / `oklch(0.58 0.2 14)` | 4.76 | alternativa de 1 línea para el token | ✓ |
| Blanco / `lila-500` (final del degradado del CTA final) | **2.40** | «Ver todos los cursos» y párrafo del CTA final | ✗ |
| `ciruela-400` / `crema-100` | **4.45** | Migas de pan de los heros de curso y ciudad; «También estamos en otras ciudades…» | ✗ (por poco) |
| `ciruela-400` / blanco | 4.89 | metadatos | ✓ |
| `ciruela-300` / blanco | **3.14** | placeholders, moneda en el selector de país | ✗ (el placeholder no es obligatorio, pero se recomienda) |
| «by» del logo (`ciruela-800`, opacidad 0.6, 8.8 px) | **4.15** | Header, todas las páginas | ✗ |
| `#1da851` (verde WhatsApp) / blanco | **3.10** | «Asesoría por WhatsApp» (menú móvil) y hover del header | ✗ |
| `#f04e23` (Hotmart) / blanco | 3.61 | wordmark «Hotmart» | Exento (logotipo, WCAG 1.4.3) |
| `sol-300` / `ciruela-900` | 12.88 | precio en el cierre | ✓ |
| `coral-600` / `crema-50` | 5.19 | eyebrows | ✓ |

### 2.3 Tamaños táctiles (móvil 375 px)

- Migas de pan: enlaces de **16 px de alto** («Colombia», «Cursos», «Decoración con Globos»). Pasan 2.5.8 AA por la excepción de espaciado, pero quedan lejos de los 44 px recomendados.
- Footer: 19 px de alto con 10 px de separación (`space-y-2.5`). Pasan AA por espaciado, pero son incómodos al pulgar.
- Chips de ciudades: 30 px. Íconos sociales: 36×36. Barra fija: botón de 40 px de alto (`py-3 text-xs`).
- Hamburguesa y cerrar: 44×44 ✓. Tarjetas de curso: toda la tarjeta es enlace ✓.

### 2.4 Jerarquía visual

- **Home, «Cuatro cursos…»:** la tarjeta destacada va dentro de un `div.lg:row-span-2`, pero la propia tarjeta no tiene `h-full`. Termina más arriba que la fila 2 y deja **un hueco en la fila 2, columna 3**. Se ve inacabado (evidencia 08).
- **Catálogo `/co/cursos/`:** 4 tarjetas en 3 columnas, así que la cuarta queda sola. El filtro tiene solo «Todos» + «Decoración con Globos», y un filtro con una única opción no filtra nada.
- **Sin H1** en `/co/cursos/` ni en `/blog/`: la página arranca en `h2`.
- **Página de curso:** buen ritmo (hero crema-100 → barra de datos → prosa + aside → resultados → temario → instructor oscuro → certificado → testimonios → cierre oscuro → FAQ → relacionados). En móvil, el aside «¿Este curso es para ti?» cae después de toda la prosa MDX, lejos del precio.
- **Home móvil:** los 6 testimonios apilados ocupan aprox. 1.500 px de scroll.

### 2.5 Header y legibilidad del logo

- Métricas del logo: ícono de 38 px, «Curso de Globos» a 16.8 px, «ONLINE» a 9.6 px con opacidad 0.7, «by» a 8.8 px con opacidad 0.6 y wordmark Sably de 24×10 px (evidencia `design/header_logo_zoom.png`).
  - **Móvil (DPR 2):** legible.
  - **Desktop (DPR 1):** «by Sably» apenas se lee y el «by» falla contraste.
- El header de 72 px sigue el patrón plataforma (logo, mega menú, Blog, Nosotros | WhatsApp, país, CTA). En móvil solo aparecen logo y hamburguesa, sin acceso directo a los cursos.
- **Mega menú:** se centra sobre el botón (`left-1/2 -translate-x-1/2`, 840 px), así que a 1440 px se sale 20 px por la izquierda. `aria-expanded` se queda en `"false"` aunque el panel esté abierto.
- La columna «Categorías» del mega menú solo tiene una categoría, y el espacio queda desaprovechado.

### 2.6 Anti-apariencia-IA (preferencia estricta de JP)

- **Emojis como iconografía** (visibles en el DOM):
  - `CourseCard` (📹 videos, 🎓 Certificado, 🎈 en el chip de categoría).
  - Home «El método» (🎥 📱 🧾 💼 en cuadros sobre fondo oscuro, donde además se ven turbios).
  - Hero de curso (🎈 en el chip, 🎈 como viñetas de «¿Este curso es para ti?», 💳 en la caja sin precio, 🛡️ en el cierre).
  - CityLanding (🎓 ♾️ 🛡️), CertificateShowcase (🎓), Header y Footer (🎈 🎉 💼 de `lib/categories.ts`), 404 (🎈💥), blog vacío (🎈✍️), home «🔥 Globoflexia con 50% OFF».
- **Brillos y degradados de plantilla:**
  - CTA final del home `bg-gradient-to-br from-coral-600 via-coral-500 to-lila-500` (index.astro L334).
  - Tres «glows» `blur-3xl` en los heros de `/` y `/co/` (index.astro L71–81, `[country]/index.astro` L78–83) y en el cierre del curso (CourseLanding L481).
  - Barrido brillante `bg-gradient-to-r … via-white/25` al hacer hover en `CourseCard` (L108).
- **Grids simétricos genéricos:** los 6 íconos iguales de la TrustBar, la barra de datos del curso, los testimonios en 3×2 y los 3 pasos. Se mitiga en parte con las rotaciones de ±0.4–0.9°.

### 2.7 Prueba social y confianza

- **Testimonios:** 6 en la home y 3 por página. Llevan avatar de inicial en color, estrellas y ciudad/país. No indican el curso tomado, no llevan fecha ni foto del trabajo realizado. El rating por testimonio (4.5–5.0) no dice de dónde sale. Este informe no puede verificar si son reales. Si lo son, falta mostrar la evidencia que los haría creíbles.
- **Certificado:** `CertificateShowcase` muestra una foto generada de un **diploma en blanco** («sin texto falso», según el propio comentario del componente). Como señal de confianza es débil, porque no deja ver qué recibe el alumno.
- **Garantía:** está en el hero (12 px, `ciruela-400`), en la FAQ y en el cierre (con 🛡️). No hay un bloque visual de garantía con peso propio.
- **Cifras:** «+100 estudiantes certificados · +80 emprendimientos» (`SITE.stats`) salen en el hero, la TrustBar y el CTA final. Según las reglas del repo, solo deben publicarse si son reales.
- **Microsoft Clarity** ya se carga (`clarity.js` en los recursos de red). Sirve para validar con mapas de calor si los usuarios llegan a los CTA.

### 2.8 GeoToast

Resultado de `geotoast_test.mjs` (Chrome headless, locale forzado):

| `navigator.language` | Página | Resultado |
|---|---|---|
| `es-ES` | `/` y `/co/curso-de-globoflexia/` | **«¿Estás en España?…»** |
| `es-MX` | `/co/curso-de-globoflexia/` | «¿Estás en México?…» (correcto si de verdad está en México) |
| `es-CO` | `/` | «¿Estás en Colombia?…» |
| `es-419`, `es` | cualquiera | no se muestra |

- **Causa:** `navigator.language` indica la variante de idioma, no la ubicación.
- **Efecto:** a un colombiano con Chrome en «Español (España)» se le invita a ver precios en EUR en la propia página de curso colombiana.
- Además, el toast aparece a los 2,2 s encima del contenido (fijo en `bottom-24`) y junto al botón de WhatsApp. En móvil tapa la sección siguiente (evidencias 03 y 05).
- El dominio responde `200` en `/cdn-cgi/trace` (Cloudflare incluye allí `loc=XX`). Eso permite una detección por IP sin backend (ver P0-5).

### 2.9 Estabilidad visual y carga (lab)

- **CLS = 0** tras recorrer `/`, `/co/`, globoflexia, flores, Bogotá, catálogo y blog. El GeoToast y la barra son `fixed` y no desplazan contenido. Todas las imágenes llevan `width`/`height`.
- **Fuentes:** `fraunces-latin-full-normal.woff2` pesa 118 KB (versión «full», con ejes SOFT/WONK/opsz) y Nunito Sans 30 KB.
- **Portadas:** JPG de 78–88 KB sin `srcset`/AVIF en `CourseCard`/hero (`<img>` plano). Los componentes nuevos del blog ya usan `<Picture>` con AVIF/WebP.

### 2.10 Blog vacío, footer y 404

- **Blog en producción:** el estado vacío es correcto en tono («Estamos inflando los primeros artículos»), pero usa emojis como ilustración, no tiene H1 y el CTA «Ver los cursos» manda siempre a `/co/`.
- **Footer:**
  - Positivo: está bien organizado (marca + Sably, categorías, países, institucional) y tiene buen contraste (`crema-100` sobre `ciruela-900`).
  - Problemas: **2 enlaces a 404** (Eventos, Emprendimiento), emojis en las categorías y enlaces de 19 px de alto.
- **404:** responde con estado HTTP 404 ✓, tiene H1 con voz de marca («¡Se nos reventó este globo!») y 2 salidas. En contra: la ilustración son dos emojis, «Ver los cursos» manda siempre a `/co/`, y no ofrece buscador ni accesos a los 4 cursos ni a los países.

### 2.11 Documentación frente a código

`DESIGN_SYSTEM.md` §1 y §3 describen:
- `coral-500 oklch(0.67 0.185 22)`, ciruela con matiz 329 y crema `0.988 0.006 84`;
- botones «pill» (`rounded-full`) + uppercase.

`global.css` usa `coral-500 oklch(0.62 0.2 14)`, ciruela con matiz ~292, otros crema, y todos los botones son `rounded-xl` en minúsculas. El documento ya no es la fuente de verdad que dice ser.

---

## 3. Plan de mejoras priorizado

> Referencias de línea según `HEAD` (58ebbd4, lo que está en producción). En el working tree con cambios en curso, `CourseLanding.astro` se desplaza +1 línea a partir de L122 (se añadió `canonicalPath`) y `pages/blog/index.astro` fue reescrito; ubicar por el fragmento de clase citado.

Todas las propuestas son **aditivas o de estilo**: ninguna elimina enlaces ni secciones. Donde un enlace está roto, la propuesta crea el destino en vez de borrar el enlace.

### P0: bugs de conversión y accesibilidad (hacer ya)

**P0-1 · `src/components/StickyCta.astro`: barra fija que de verdad aparece, también sin precio**
- **Script:** reemplazar el manejo de `style.transform` por un toggle de clases y observar la **caja de compra** en lugar de todo el hero. Así la barra aparece desde el primer viewport, mientras el botón del hero no se ve.
  ```ts
  const bar = document.getElementById('sticky-cta');
  const box = document.querySelector('[data-buy-box]') ?? document.getElementById('curso-hero');
  const show = (on: boolean) => {
    bar?.classList.toggle('translate-y-full', !on);
    bar?.classList.toggle('translate-y-0', on);
    document.documentElement.classList.toggle('has-sticky-cta', on);
  };
  if (bar && box) new IntersectionObserver(([e]) => show(!e.isIntersecting)).observe(box);
  ```
- **`CourseLanding.astro`** L212 (tarjeta de precio): añadir `data-buy-box`. En L566–577, renderizar `<StickyCta>` **siempre**, no solo cuando `hasPrice`: `priceUSD`/`originalPriceUSD` pasan a opcionales. Sin precio, mostrar a la izquierda «Pago seguro · Hotmart / Garantía 7 días» (`text-xs text-ciruela-500`) en lugar del precio.
- **Label único:** `discountPct ? \`Inscribirme con ${discountPct}% OFF\` : 'Inscribirme'`, igual que en el hero.
- **Estilo del botón:** `min-h-11 rounded-xl bg-coral-600 px-5 text-sm font-extrabold text-white hover:bg-coral-700`.
- **Contenedor:** `pb-[max(0.75rem,env(safe-area-inset-bottom))]` para el iPhone.

**P0-2 · `src/components/WhatsAppFloat.astro`: no tapar la barra de compra**
- Añadir en su `<style>`:
  ```css
  :global(html.has-sticky-cta) .wa-float { translate: 0 -4.75rem; }
  .wa-float { transition: translate .4s var(--ease-suave), transform .3s var(--ease-fiesta); }
  ```
- En `GeoToast.astro`, usar la misma clase para subirlo: `html.has-sticky-cta #geo-toast { bottom: 10rem }`.

**P0-3 · Contraste de CTA: `src/styles/global.css` más los componentes**
- **Recomendada:**
  - crear `@utility btn-primario { background: var(--color-coral-600); color: #fff; font-weight: 800; border-radius: .75rem; box-shadow: var(--shadow-boton); &:hover { background: var(--color-coral-700) } }`;
  - reemplazar `bg-coral-500 … hover:bg-coral-600` por `btn-primario` (o `bg-coral-600 hover:bg-coral-700`) en:
    - GeoToast L27;
    - StickyCta L38;
    - CourseCard L66 (chip −%);
    - CourseLanding L228 (chip), L247, L449, L507 y L540;
    - CityLanding L82 y L158;
    - Header L119, L214, L287 y L342;
    - LeadForm L45;
    - index.astro L113;
    - `[country]/index.astro` L105;
    - `[country]/cursos/index.astro` L50;
    - `[country]/cursos/[category]/index.astro` L85;
    - 404 L21;
    - blog/index;
    - AdsLanding L91, L140 y L234;
    - nosotros L48;
    - `blog/CourseCta.astro` L43 y L72.
- **Hotfix de 1 línea** (si hace falta ya): `--color-coral-500: oklch(0.58 0.2 14);` da 4.76:1 con blanco. Oscurece a la vez todos los usos de coral-500.
- **Resto de contrastes:**
  - Migas de pan: `text-ciruela-400` → `text-ciruela-500` (6.57:1 sobre crema-100) en CourseLanding L136, CityLanding L66 y `cursos/index` L37.
  - Header L352 «Asesoría por WhatsApp»: `text-[#1da851]` → `text-ciruela-800`, dejando el ícono en verde.
  - Logo (ver P1-9).

**P0-4 · `src/components/Footer.astro` L70 más `pages/[country]/cursos/[category]/index.astro`: acabar con los 404 sin quitar enlaces**
- En `getStaticPaths` del listado de categoría, generar **todas** las `CATEGORIES`, no solo las activas.
- Si una categoría no tiene cursos propios, la página muestra su `short`, las subcategorías (`category.subcategories`) como chips, los 4 cursos con `CourseCard` («Cursos que aplican a eventos») y, cuando exista, un bloque «Guías del blog» con el cluster correspondiente.
- Así los enlaces del footer quedan como hubs útiles en lugar de 404.
- Alternativa temporal: apuntar esos dos enlaces del footer a los hubs del blog (`/blog/#eventos`, `/blog/#negocio`) mientras se crean las páginas.

**P0-5 · `src/components/GeoToast.astro`: detectar país por IP, no por idioma**
- **Fuente:** obtener el país de Cloudflare. Hay dos vías:
  - `fetch('/cdn-cgi/trace').then(r => r.text())` y leer la línea `loc=XX` (responde 200 en el dominio);
  - o, más robusto, un Pages Function `functions/_middleware.ts` que ponga una cookie `cc=${request.cf.country}`.
- **Fallback:** `navigator.language` solo como último recurso, y **nunca** en páginas `/{cc}/…` cuando `document.referrer` es un buscador (el usuario ya eligió país en la SERP).
- **Mensaje:** mencionar la moneda real: «Parece que estás en México. ¿Ver precios en MXN?».
- **Posición:** en móvil, franja bajo el header (`top-[72px] inset-x-0 rounded-none border-b`) en vez de flotar sobre el contenido junto al botón de WhatsApp.

### P1: jerarquía, anti-IA y confianza

**P1-1 · Primer viewport del curso en móvil** (`CourseLanding.astro` L136–209)
- Migas: `mb-8` → `mb-4 lg:mb-8`.
- Imagen: `aspect-[4/3]` → `aspect-[16/10] sm:aspect-[4/3]` y `rotate-2` → `sm:rotate-2` (sin inclinación en móvil).
- Globo decorativo L198: `hidden sm:block` (hoy tapa «Acceso de por vida»).
- Con P0-1, la barra fija cubre la compra en el primer viewport.

**P1-2 · Tarjeta de compra fija en desktop** (`CourseLanding.astro` L303, `aside`)
- Añadir al inicio del `aside` una versión compacta de la caja de compra: precio o «Precio en COP en Hotmart», botón `btn-primario` y `HotmartBadge`, dentro de `lg:sticky lg:top-24`.
- Los bloques actuales «¿Este curso es para ti?» y «Requisitos» se mantienen debajo.

**P1-3 · Mega menú** (`Header.astro` L51–52)
- Clases del panel: `absolute left-1/2 … -translate-x-1/2` → `fixed left-1/2 top-[72px] w-[min(52.5rem,calc(100vw-2rem))] -translate-x-1/2`. Queda centrado en el viewport y nunca se corta. El hover sigue funcionando porque el panel sigue siendo descendiente de `.group`.
- Sincronizar `aria-expanded` con `focusin`/`focusout` y `mouseenter`/`mouseleave`.

**P1-4 · Globos del hero en móvil** (`Balloons.astro` L64–71)
- Añadir la bandera `mobile?: false` a los globos medianos centrados (aqua `left:10%`, lila `right:17%`, dorado `left:26%`, coral `right:31%`) y renderizarlos con `hidden sm:block`, igual que los XL.
- En móvil dejar 2 globos pequeños en las esquinas superiores (`top: 4%`) para que no crucen el H1 ni los botones.

**P1-5 · Grid de cursos sin hueco** (`pages/index.astro` L149–160 y `[country]/index.astro` L128–141)
- Añadir `h-full` a la tarjeta destacada: prop `class` en `CourseCard`, aplicada al `<a>` raíz con `h-full`.
- Rellenar la celda vacía con una **tarjeta de asesoría**: `rounded-3xl border-2 border-dashed border-coral-200 bg-coral-50 p-6`, título Fraunces «¿No sabes cuál elegir?», texto y enlace WhatsApp `data-track="click_whatsapp"`. Reutiliza el copy que ya existe en el mega menú.
- En el catálogo (`[country]/cursos/index.astro` L63), `lg:grid-cols-3` → `lg:grid-cols-2`, con la tarjeta en horizontal (`md:flex-row`, imagen al 45 %). Otra opción: la misma tarjeta de asesoría como quinta pieza.
- El chip-filtro con una sola categoría se mantiene, añadiendo como chips (enlaces) las **subcategorías** (`arcos`, `columnas`, `globoflexia`…) que apunten a sus guías del blog cuando existan.

**P1-6 · Iconografía sin emojis**
- En `src/lib/categories.ts`, añadir `icon: string` (path SVG de trazo 1.8–2 px, como en la barra de datos del curso). Mantener `emoji` para los mensajes de WhatsApp.
- Crear `src/components/Icon.astro` (`<svg width=16 height=16 stroke="currentColor" stroke-width="1.8">`) y reemplazar en estos puntos:

  | Archivo | Líneas | Hoy | Cambio |
  |---|---|---|---|
  | CourseCard | L62 | chip de categoría | Icon |
  | CourseCard | L79–81 | 📹, 🎓 | Icon play / birrete, `text-coral-600` |
  | Header | L70, L307 | 🎈 🎉 💼 | Icon |
  | Header | L317 | 🌎 | ícono globo terráqueo |
  | Footer | L73 | 🎈 🎉 💼 | Icon |
  | `cursos/index` | L57 | emoji de categoría | Icon |
  | `[category]/index` | L53 | emoji de categoría | Icon |
  | index.astro | L175–183 | 🎥 📱 🧾 💼 | SVG en `text-sol-300` sobre `bg-crema-50/10` |
  | CourseLanding | L161 | 🎈 del chip | Icon |
  | CourseLanding | L311–313 | viñetas 🎈 | mini-globo SVG (misma anatomía que Balloons) |
  | CourseLanding | L235 | 💳 | ícono tarjeta |
  | CourseLanding | L499 | 🛡️ | escudo SVG |
  | CityLanding | L87 | 🎓 ♾️ 🛡️ | Icon |
  | CertificateShowcase | L26 | 🎓 | Icon |
  | index.astro | L121 | 🔥 | chip «−50%» `bg-sol-300 text-ciruela-900` |

**P1-7 · Fuera los degradados y glows de plantilla**
- CTA final del home (index.astro L334): `bg-gradient-to-br from-coral-600 via-coral-500 to-lila-500` → `bg-ciruela-900`, conservando `<Balloons variant="rise" />`, el texto y los 2 botones. El primario pasa a `btn-primario` y el secundario a `border-crema-50/40`. Así el contraste pasa de 2.4:1 en el extremo lila a más de 12:1.
- Heros de `/` y `/co/`: sustituir los 3 `blur-3xl` por el `Wave` + globos (ya hay suficiente fiesta) o por una textura sutil de confeti SVG.
- `CourseCard` L107–109: quitar el barrido brillante del hover. Conviene conservar el `translateY` + `shadow-globo`, que sí es propio del sistema.

**P1-8 · H1 correcto** (`SectionHeading.astro`)
- Añadir la prop `as?: 'h1' | 'h2'` (por defecto `h2`) y usar `as="h1"` en `[country]/cursos/index.astro` L43 y en `blog/index.astro`.

**P1-9 · Logo más legible** (`Logo.astro`)
- Añadir la prop `scale?: 'sm' | 'md'`. En el header desktop: ícono de 44 px, «Curso de Globos» `text-[1.2rem]`, «ONLINE» `text-[0.68rem] opacity-80`, «by» `text-[0.62rem] opacity-80` y Sably `h-[0.78rem]`.
- En móvil conservar 38 px, subiendo solo las opacidades a 0.8 (el «by» pasa de 4.15 a ~7:1).

**P1-10 · Prueba social y confianza**
- **`TestimonialCard.astro`:** añadir el campo opcional `courseSlug` y mostrarlo como chip «Curso de Globoflexia» (`text-[0.7rem] font-extrabold text-coral-700 bg-coral-50 rounded-full px-2.5 py-0.5`), y `photo` opcional (foto del montaje hecho por la alumna, **solo si es real y autorizada**). En móvil, carrusel `flex snap-x snap-mandatory overflow-x-auto gap-4 [&>*]:w-[85%] [&>*]:shrink-0 sm:grid` en lugar de 6 tarjetas apiladas.
- **`CertificateShowcase.astro`:** sustituir el mockup en blanco por un **certificado real de muestra** (nombre de demo o de un alumno que autorice, con código de verificación borroso). Si no existe, al menos rotular «Ejemplo ilustrativo».
- **Garantía con peso propio:** en `CourseLanding.astro`, junto al cierre (L477), añadir un sello SVG «7 días de garantía» (anatomía de moño/sello en dorado del sistema) con 2 líneas de explicación. En el hero, subir la línea de garantía a `text-sm text-ciruela-600 font-semibold`.

**P1-11 · Copy de CTA** (DESIGN_SYSTEM §6)
- `Header.astro` L216 y L344: «Empezar ahora» → «Ver cursos» o «Ver los 4 cursos».
- `index.astro` L196: «Comienza tu primer curso» → «Ver el curso de globoflexia».
- Tarjetas sin precio (`CourseCard` L101): «Ver curso y precio →» en `aqua-700` → «Ver temario y precio →» en `text-coral-700 font-extrabold`, para que coincida con el tratamiento de la tarjeta con precio.

### P2: pulido y sistema

- **P2-1 · `docs/DESIGN_SYSTEM.md`:** sincronizar con `global.css` (valores OKLCH reales, botones `rounded-xl` + `btn-primario`, prohibición de emojis ya aplicada) y documentar `.articulo`, `Callout` y `PostCard`.
- **P2-2 · Táctiles:**
  - footer, `space-y-2.5` → `space-y-1` con enlaces `inline-block py-1.5` (≥ 31 px);
  - migas, `py-1` en móvil;
  - chips de ciudad, `py-2.5`;
  - redes, `h-11 w-11`.
- **P2-3 · Header móvil tipo plataforma:** entre el logo y la hamburguesa, un botón compacto «Cursos» (`rounded-xl border border-crema-300 px-3 h-11 text-sm font-bold`) hacia `/{cc}/cursos/`.
- **P2-4 · Imágenes:** pasar las portadas de `CourseCard`/hero a `astro:assets` `<Picture formats={['avif','webp']} widths=[…]>`, igual que `PostCard`.
- **P2-5 · 404** (`pages/404.astro`): sustituir 🎈💥 por un SVG de globo reventado (anatomía de `Balloons`, con trozos de látex), mostrar los 4 cursos con `CourseCard` y la fila de países. Los botones actuales se mantienen.
- **P2-6 · Blog vacío** (si llega a publicarse vacío): H1, SVG en lugar de emojis, y CTA consciente del país (ver 4.3).
- **P2-7 · Callout del blog** (`components/blog/Callout.astro`, en desarrollo): etiqueta `dato` `text-sol-700` sobre `sol-100/70` = **3.39:1** y `consejo` `text-aqua-700` sobre `aqua-100/60` = **4.25:1**. Ambas fallan a 12 px. Usar `text-ciruela-800` en la etiqueta y dejar el color al borde (`border-l-4`).
- **P2-8 · Validación:** usar Clarity (ya instalado) para comparar antes y después la tasa de clic en `begin_checkout` por posición (hero / barra / certificado / cierre).

---

## 4. Diseño recomendado para el blog (índice y artículo)

Otro proceso tiene en curso (sin commit) `PostCard`, `Toc`, `AuthorBox`, `Callout`, `CourseCta`, `/blog/[slug]/` y la prosa `.articulo`. **La base es buena y coherente con el sistema**: imagen 16:9 con `<Picture>` AVIF/WebP, autor, fecha, tiempo de lectura, TOC fijo en desktop y plegable en móvil, CTA al curso, FAQ, relacionados, viñeta de globito propia y H1 en Fraunces. Recomendaciones para cerrarlo:

### 4.1 Índice `/blog/`
- **H1** («Guías de decoración con globos» o el título que salga del estudio de keywords) y una bajada con la propuesta.
- **Composición editorial, no grid simétrico:**
  1. Una pieza destacada horizontal (`PostCard featured`, imagen al 56 %, `eager`).
  2. Bloques por **cluster** con ancla (`id={cluster.slug}`, que ya enlaza la miga del artículo). Cada bloque lleva un encabezado con el ícono SVG del cluster, 1 pilar grande y 2–4 tarjetas pequeñas en `sm:grid-cols-2 lg:grid-cols-3`.
  3. Cada 2 clusters, una **banda de curso** a todo el ancho (`bg-ciruela-900`, `Wave`, `CourseCard` horizontal del curso relacionado).
- **Chips de cluster** fijos bajo el header en móvil (`sticky top-[72px] overflow-x-auto snap-x bg-crema-50/95 backdrop-blur`): son enlaces de ancla, no filtros JS.
- **Tarjetas:** imagen 16:9, eyebrow del cluster (`text-coral-600`, 0.7rem, tracking), título Fraunces, 2 líneas de extracto y meta «fecha · N min». Para diferenciar sin emojis, añadir el avatar o las iniciales del autor (16 px) delante de la fecha.

### 4.2 Artículo `/blog/[slug]/`
- **Orden en móvil:** migas → eyebrow → H1 → bajada → meta (autor · fecha actualizada · min) → imagen 16:9 → TOC plegable → cuerpo. Coincide con el patrón título → imagen que ya pide JP en los cursos.
- **Imagen principal:** ≥ 1200 px de ancho para Discover (el template ya genera 1600×900, 1200×900 y 1200×1200). Añadir `<meta name="robots" content="max-image-preview:large">` si `Seo.astro` no lo emite.
- **Cajas de CTA** (`CourseCta`):
  - tres puntos de inserción: tras la primera sección (variante `compacta`), a mitad del texto (normal) y al final (normal);
  - en el aside desktop, la `compacta` fija bajo el TOC (ya está);
  - el botón pasa a `btn-primario` (4.03 → 5.41:1).
- **Enlaces conscientes del país:** hoy `CourseCta` fija `href='/co/...'` (L23). Añadir `data-country-aware` y un script de 10 líneas que reescriba `/co/` → `/${localStorage.getItem('cdgo-country') ?? 'co'}/` (el mismo storage que ya usa el Header). Sin esto, un lector de México termina viendo precios en COP.
- **Barra fija de artículo (opcional, P2):** tras el 40 % de scroll, una franja mínima «Aprende esto paso a paso · Ver el curso» (reutilizando la lógica corregida de `StickyCta` y `has-sticky-cta`), solo en móvil y descartable.
- **Bloques de contenido propios:** «Resumen en 30 segundos» (caja `bg-crema-100 rounded-2xl`, 3–5 viñetas) al inicio, `Callout` para trucos o errores, tablas de precios y materiales con `.articulo table` (ya con scroll horizontal) y figuras con `figcaption` (`text-sm text-ciruela-500`).
- **Autor / E-E-A-T:** `AuthorBox` firma hoy como «Equipo editorial» (Organization). Si JP lo confirma, añadir un «Revisado por Juan Manuel Marcos, instructor del curso» (ya aparece como instructor en la página de globoflexia), con foto real, **solo con su autorización**.
- **Relacionados:** 3 `PostCard` + 1 `CourseCard` del `moneyPage` al final, para un cierre mixto de lectura y compra.
- **Anuncios:** si se activa AdSense (ver §5), solo en el blog y nunca dentro de las primeras 2 secciones ni cerca de `CourseCta`. En money pages, **nunca**.

### 4.3 Sin tocar el blog actual en producción
Mientras no se publique, el estado vacío de producción sigue vigente. Si se publica con pocos artículos, se recomienda que el índice no muestre bloques de cluster vacíos (renderizar solo clusters con ≥ 1 post).

---

## 5. Nota aparte: `ads.txt` (pregunta de JP)

- En producción, `https://cursodeglobosonline.com/ads.txt` responde **404** (verificado con `curl`). El HTML de la home no incluye código de AdSense (`adsbygoogle` / `ca-pub-`: 0 coincidencias).
- En el working tree hay un **`public/ads.txt` nuevo sin commit**, creado por otro proceso, con la línea `google.com, pub-6213862553989716, DIRECT, f08c47fec0942fa0`. Se publicará en el próximo deploy.
- **¿Es la misma línea para esta web?** Sí, **si** cursodeglobosonline.com se monetiza con **la misma cuenta de AdSense** que academiadeconduccion.academy. El `ads.txt` identifica a la cuenta (pub-ID), no al dominio. Además, hay que **añadir y aprobar el sitio** en esa cuenta (AdSense → Sitios). Si fuera otra cuenta, cambia el `pub-…`. `f08c47fec0942fa0` es el ID fijo de Google y no cambia.
- **Recomendación de diseño y conversión:** este sitio vive de vender cursos. Los anuncios de display en páginas de curso compiten con el CTA a Hotmart y pueden llevarse la visita a un competidor. Si se usan, que sea solo en artículos del blog y lejos de las cajas de CTA.

---

## 6. Archivos generados (en `research/`)

- `informe_diseno.md`: este informe.
- `design/capturas/`:
  - `{desktop,mobile}_{home,co,globoflexia,flores,bogota,cursos,blog,404}_{fold.png,full.jpg}` (32 capturas);
  - `capturas.json` con la altura de cada página.
- `design/evidencias/`:
  - `01_megamenu_recortado_1440.png`
  - `02_movil_curso_sin_sticky_cta.png`
  - `03_simulacion_sticky_visible_choca_whatsapp.png`
  - `04_movil_curso_primer_viewport.png`
  - `05_geotoast_es-ES_en_pagina_co.png`
  - `06_movil_home_hero_globos.png`
  - `07_cta_final_degradado.png`
  - `08_home_grid_cursos_hueco.png`
  - `09_catalogo_huerfano_y_filtro_unico.png`
  - `evidencias.json` (mediciones de la reproducción)
- `design/header_logo_zoom.png`: logo en desktop (×2) y móvil.
- `design/tiles/`, `design/tiles_m/`: recortes de las capturas completas para revisar sección por sección.
- Scripts reproducibles: `design/capture.mjs`, `design/audit.js`, `design/geotoast_test.mjs`, `design/evidence.mjs`.
