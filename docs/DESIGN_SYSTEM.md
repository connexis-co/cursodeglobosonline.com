# Design System — cursodeglobosonline.com

> Fuente de verdad: [src/styles/global.css](../src/styles/global.css) (tokens Tailwind v4 en `@theme`,
> sin `tailwind.config.js`). Si este documento y el CSS no coinciden, **manda el CSS** y hay que
> corregir este archivo.
> Principio rector: **fiesta calibrada**: festiva sin ser infantil, cálida sin empalagar, y sin
> ninguna apariencia de plantilla de IA (plan maestro §3). Referencias: globos de lbdballoons.com
> y header tipo plataforma (Open English / aprende.com).
>
> Última sincronización con el código: 2026-09-22 (auditoría de diseño, P0-3 y P2-1).

## 1. Color (OKLCH)

Paleta propia: no se usan los colores por defecto de Tailwind (`red-500`, `gray-*`…). El modo
principal es claro.

| Familia | Escala en `@theme` | Valor base | Uso |
|---|---|---|---|
| **Coral → frambuesa** (primario único, tono Sably) | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900 | `coral-500` `oklch(0.62 0.2 14)` · `coral-600` `oklch(0.55 0.2 15)` · `coral-700` `oklch(0.48 0.18 16)` | **Fondos de CTA en `coral-600`** (ver §7). `coral-500` solo para usos decorativos: rellenos de ilustración, puntos, bordes, iconos grandes. `coral-50/100` para chips e iconos sobre claro. |
| **Ciruela → tinta índigo** (texto y fondos serios) | 300, 400, 500, 600, 700, 800, 900 | `ciruela-800` `oklch(0.27 0.05 292)` · `ciruela-900` `oklch(0.22 0.05 290)` | Texto principal en `ciruela-800`. Secciones oscuras (instructor, cierre, footer) en `ciruela-900`. Metadatos en `ciruela-500`, y `ciruela-400` solo sobre blanco (ver §7). |
| **Crema** (fondo casi blanco, apenas cálido) | 50, 100, 200, 300 | `crema-50` `oklch(0.986 0.004 95)` | Fondo global (`body`). `crema-100` para secciones alternas y heros de curso. `crema-200/300` para bordes. |
| **Aqua** (secundario) | 100, 200, 300, 500, 700 | `aqua-500` `oklch(0.78 0.1 193)` | Ilustración y badges informativos. En texto sobre claro, solo `aqua-700`. |
| **Sol** (acento cálido) | 100, 200, 300, 500, 700 | `sol-500` `oklch(0.84 0.145 85)` | Estrellas de rating. Sobre fondo oscuro, precio y eyebrows en `sol-300` (12.9:1 sobre `ciruela-900`). |
| **Lila** | 100, 200, 300, 500, 700 | `lila-500` `oklch(0.74 0.1 303)` | Ilustración y globos. **Nunca como fondo de texto blanco** (2.4:1). |
| **Dorado** | 300, 500, 700 | `dorado-500` `oklch(0.76 0.12 75)` | Sellos, certificado, moños. |

Los globos de `Balloons.astro` usan su propia terna por color `[base, luz, sombra]` (constante
`PALETA`) derivada de los mismos tonos.

**Alias semánticos** (definidos para re-tematizar, hoy ningún componente los usa):
`--color-primario` (= coral-500), `--color-acento` (= sol-500), `--color-tinta` (= ciruela-800),
`--color-fondo` (= crema-50). Si se usan, que `primario` no sea el fondo de un CTA con texto
blanco (ver §7).

**Sombras con tinte de tinta**, nunca `shadow-md` ni los grises por defecto:

| Token | Uso |
|---|---|
| `shadow-tarjeta` | Tarjetas en reposo (cursos, testimonios, barra de datos, `PostCard`). |
| `shadow-globo` | Hover de tarjetas y piezas flotantes. |
| `shadow-boton` | CTA primario (sombra con tinte `coral-600`). |

Regla: el texto sobre crema va en ciruela 800/600/500, nunca en gris puro.

## 2. Tipografía

| Rol | Fuente | Detalles |
|---|---|---|
| Display (h1–h3) | **Fraunces Variable** (`@fontsource-variable/fraunces/full.css`) | `font-variation-settings: 'SOFT' 55, 'WONK' 1`: serif suave, con carácter artesanal. `letter-spacing: -0.015em`, `line-height: 1.12`, `text-wrap: balance`. Pesos 600 (titulares) y 700 (cifras). |
| Texto y UI | **Nunito Sans Variable** | Humanista redondeada. Pesos 400 / 600 / 700 / 800. |

- **Titular de sección:** `SectionHeading.astro` con `text-3xl sm:text-4xl font-semibold text-ciruela-900`. La prop `as="h1"` se usa cuando es el encabezado principal de la página (catálogo, blog). Cada página tiene un solo H1.
- **Eyebrow de `SectionHeading`:** `text-xs font-extrabold tracking-[0.22em] text-coral-600`, en tipo oración («Temario», «Reseñas reales»). Sobre fondo oscuro, `text-sol-300`.
- **Etiquetas pequeñas en mayúsculas** (cabeceras de columna del footer, «En esta guía», cluster de `PostCard`): `text-[0.65rem]–text-xs font-extrabold tracking-[0.16em–0.22em] uppercase`.
- **Botones:** nunca en mayúsculas (ver §3).
- **Jerarquía:** 3 pesos como máximo por bloque.

## 3. Forma y espacio

| Pieza | Clases reales |
|---|---|
| Tarjetas | `rounded-3xl` (24 px) + `border border-crema-200 bg-white shadow-tarjeta`. |
| Chips, inputs, cajas internas | `rounded-2xl`. |
| Chips de estado (−50 %, «Todos», ciudades) | `rounded-full px-3–4 py-1–2 text-xs font-extrabold`. |
| **Botón primario** | `rounded-xl bg-coral-600 px-7 py-3.5 text-sm font-bold text-white shadow-boton transition-all duration-300 ease-fiesta hover:-translate-y-0.5 hover:bg-coral-700`. Variantes grandes: `px-8–10 py-4` y `hover:-translate-y-1`. **Sin `uppercase` y sin `rounded-full`.** |
| Botón secundario sobre claro | `rounded-xl border-2 border-coral-600 text-coral-600 hover:bg-coral-600 hover:text-white`. |
| Botón secundario sobre oscuro | `rounded-xl border-2 border-crema-50/40 text-white`. |
| Contenedor | Utilidad `contenedor`: `max-width: 74rem`, padding lateral de 1.25rem, que sube a 2rem desde 40rem. |

**Asimetría intencional, no grids genéricos:**
- grid de cursos con tarjeta destacada `row-span-2`;
- tarjetas con rotación determinista de ±0.4–0.9° (testimonios, pasos, barra de datos) que se enderezan al hover;
- chips de datos superpuestos y rotados sobre imágenes;
- secciones que alternan crema-50 / crema-100 / ciruela-900 con **ondas SVG** (`Wave.astro`) como divisor, con ritmo variable y no con padding uniforme.

**Prohibido (apariencia de plantilla):** degradados multicolor de fondo (`from-coral… to-lila…`),
«glows» difusos `blur-3xl`, barridos brillantes al hover, filas de 3–6 iconos idénticos en
cuadrados iguales.

**Móvil del curso:** el orden es título → imagen → cuadro de precio. La barra fija de compra
(`StickyCta`) cubre el CTA mientras el cuadro de precio no está en pantalla.

## 4. Movimiento

| Token / clase | Valor | Uso |
|---|---|---|
| `--ease-fiesta` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Hovers con rebote (tarjetas, botones). |
| `--ease-suave` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entradas, menú móvil, transiciones largas. |
| `animate-floating` | `floating 3s ease-in-out infinite` | **Patrón LBD:** los globos flotan 0 → 25 px → 0. Se desincronizan con `animation-delay` negativos (0 / −0.3 / −0.6 / −1 s) y duraciones de 3 a 4.1 s. |
| `animate-balloon-float` | `balloon-float 5s` | Globo suelto junto a imágenes de curso. |
| `animate-balloon-rise` | `balloon-rise 14s linear infinite` (en uso: 16–20 s) | Globos que suben en las secciones de cierre. |
| `animate-pop-in`, `animate-fade-slide-up` | 0.5 s / 0.7 s | Entradas puntuales. |
| `.globo-plx` | `animation-timeline: scroll()` | Parallax sutil al hacer scroll. Anima `translate` y se compone con el `transform` del floating. |
| `.scroll-reveal`, `.scroll-reveal-late` | `animation-timeline: view()` | Fade-slide-up al entrar en pantalla, nativo y sin librería. |
| `@view-transition` | `navigation: auto` | Fundido entre páginas (MPA, sin JS). |

**Globos decorativos** (`Balloons.astro`, variantes `hero`, `rise`, `corner-left` y `corner-right`):
- XL de 230–320 px **sangrando fuera de la sección** (offsets negativos + `overflow-hidden` del padre, como los `.globo--v1..v9` de lbdballoons.com), ocultos en móvil (`hidden sm:block`);
- medianos de 36–96 px dentro de la sección;
- siempre `aria-hidden` + `pointer-events-none`.

`prefers-reduced-motion: reduce` desactiva todas las animaciones y transiciones desde `global.css`.

## 5. Ilustración e iconos

- **Portadas de curso** (`CourseCover.astro`): escenas SVG propias por curso (perrito de globoflexia con nudos de torsión, bouquet con moño y pesita, flor de pétalos con tallo, globo burbuja con confeti y borlas sobre fondo oscuro). Nada de fotos de stock, marcas de terceros ni imágenes generadas por IA con artefactos.
- **Anatomía del globo** (`Balloons.astro`), que se reutiliza en toda ilustración nueva:
  - cuerpo en lágrima, más ancho arriba;
  - gradiente radial (luz arriba a la izquierda, base y sombra en el borde);
  - brillo satinado rotado −20°;
  - nudo con pestaña;
  - cuerda en S.

### Iconos: `Icon.astro` (nunca emojis)

Los iconos son SVG de trazo propio, definidos en [`src/lib/icons.ts`](../src/lib/icons.ts) y
pintados por [`src/components/Icon.astro`](../src/components/Icon.astro):
- lienzo 24×24, `stroke="currentColor"`, `stroke-width` 1.8, extremos y uniones redondeados;
- siempre decorativos (`aria-hidden`): el texto que acompaña al icono es lo que se lee.

```astro
<Icon name="birrete" />                                   <!-- 16 px, color heredado -->
<Icon name="escudo" size={20} class="text-aqua-700" />
<Icon name="estrella" class="fill-current text-sol-500" /> <!-- relleno -->
```

| `name` | Sustituye a | Uso |
|---|---|---|
| `play` | 📹 🎥 | Videos, lecciones. |
| `birrete` | 🎓 | Certificado. |
| `dispositivo` | 📱 | Celular o computador. |
| `infinito` | ♾️ | Acceso de por vida. |
| `escudo` | 🛡️ | Garantía de 7 días. |
| `tarjeta` | 💳 | Pago / precio en checkout. |
| `candado` | — | Pago seguro. |
| `globo` | 🎈 | Categoría «Decoración con Globos», viñetas. Misma anatomía que `Balloons`. |
| `fiesta` | 🎉 | Categoría «Eventos». |
| `maletin` | 💼 | Categoría «Emprendimiento», negocio. |
| `regalo` | — | Bonos incluidos. |
| `tareas` | 🧾 | Tareas calificadas. |
| `chat` | 💬 | Asistencia, WhatsApp genérico (sin logo). |
| `correo` | 📧 | Email. |
| `mundo` | 🌎 🌐 | Países, cambiar país. |
| `check` | ✓ | Listas de beneficios o requisitos. |
| `flecha` | → | Enlaces de avance. |
| `estrella` | ★ | Valoraciones. |
| `reloj` | — | Duración, a tu ritmo. |
| `etiqueta` | 🔥 | Descuento / oferta. |

- **Presentación:** chip `bg-coral-50 text-coral-600 rounded-2xl` (como la barra de datos del curso) o icono suelto de 16 px junto al texto. Sobre fondo oscuro: `text-sol-300` en `bg-crema-50/10`.
- **Categorías:** `Category.icon` en `src/lib/categories.ts` (`'globo' | 'fiesta' | 'maletin'`). El campo `emoji` se conserva **solo** para el texto prellenado de los mensajes de WhatsApp, donde sí se permite.
- **Iconos nuevos:** se dibujan a mano en `icons.ts` con las mismas reglas. No se copian de librerías como Lucide o Heroicons. Los logos de marca de terceros (WhatsApp, redes) siguen siendo SVG propios de cada componente. **Hotmart: nunca su logo ni su color de marca** — sus Términos de uso §5.2 prohíben usar su marca, logotipo o nombre comercial para publicitar un producto o sugerir asociación; solo se menciona en texto neutro para indicar dónde se procesa el pago (`HotmartBadge.astro`).

## 6. Voz y microcopy

- **Tono:** cercano, específico y de emprendimiento real («Cotiza por montaje, no por globo»).
- **CTA concretos:** «Inscribirme con 50% OFF», «Ver temario y precio», «Ver los cursos».
- **Prohibidos:** los genéricos («Comenzar ahora», «Empezar ahora», «Descubre más») y las frases de IA («lleva tus habilidades al siguiente nivel»).
- **Precios en USD** (`lib/pricing.ts`); Hotmart confirma el valor en moneda local.
- **Cifras y reseñas:** solo si son reales (Hotmart o auditoría).

## 7. Accesibilidad y contraste (WCAG 2.x AA)

**Regla de CTA:** todo fondo con texto blanco (botones, chips −%, «Todos», chips de ciudad) va en
**`bg-coral-600`**, con hover, focus y active en **`coral-700`**. Blanco sobre `coral-500` da
4.03:1 y no pasa AA en texto de 12–14 px.

| Par | Ratio | Estado |
|---|---|---|
| Blanco / `coral-600` | 5.41 | ✓ CTA |
| Blanco / `coral-700` | 7.23 | ✓ hover |
| Blanco / `coral-500` | 4.03 | ✗ solo decorativo o texto ≥ 24 px |
| Blanco / `lila-500` | 2.40 | ✗ nunca |
| `coral-600` / `crema-50` | 5.19 | ✓ eyebrows, enlaces |
| `ciruela-500` / `crema-100` | 6.57 | ✓ migas de pan, metadatos sobre crema |
| `ciruela-400` / `crema-100` | 4.45 | ✗ no usar sobre crema |
| `ciruela-400` / blanco | 4.89 | ✓ metadatos en tarjetas blancas |
| `ciruela-300` / blanco | 3.14 | ✗ solo placeholders |
| `sol-300` / `ciruela-900` | 12.88 | ✓ precio y eyebrows en oscuro |

Otras reglas:
- focus visible: anillo `coral-400` de 3 px en tarjetas y anillo coral en inputs;
- skip-link en `BaseLayout`;
- acordeones nativos `<details>` animados;
- menú móvil en `<dialog>` (trampa de foco y ESC sin JS extra);
- áreas táctiles de 44 px en controles principales;
- `prefers-reduced-motion` respetado.

## 8. Blog

El blog comparte los tokens del sitio. Sus piezas propias:

| Pieza | Dónde | Qué es |
|---|---|---|
| `.articulo` | `global.css` (`@layer components`) | Prosa sin plugin: medida de ~68ch, `1.075rem/1.75`, h2/h3 en Fraunces con `scroll-margin-top: 7rem`, enlaces `coral-700` subrayados en `coral-200`, viñeta con forma de globito coral, `ol` con marcador `coral-600`, tablas con scroll horizontal, `blockquote` en Fraunces con borde `coral-300`. `.not-prose` excluye los bloques incrustados. |
| `Callout.astro` | MDX sin import | Nota destacada con `border-l-4`. Tipos: `consejo` (aqua), `ojo` (coral) y `dato` (sol). La etiqueta va siempre en `ciruela-800` para cumplir AA a 12 px; el color del tipo vive en el borde y el fondo. |
| `PostCard.astro` | índice, autor, relacionados | Tarjeta `rounded-3xl` con `<Picture>` 16:9 AVIF/WebP, eyebrow del cluster en `coral-600`, título Fraunces, extracto de 2–3 líneas y meta «fecha · N min». Tiene la variante `featured` (horizontal, imagen al 56 %). Hover: sube 6 px con `shadow-globo`; foco con anillo `coral-400`. |
| `CourseCta.astro` | MDX y final del artículo | Caja de conversión que enlaza a la **money page** del curso (nunca directo a Hotmart), con `data-track="click_blog_cta"`. Variante `normal` (tarjeta con portada) y `compacta` (franja `bg-coral-50`). Botón `bg-coral-600 hover:bg-coral-700`. |
| `Toc.astro` | aside desktop / `details` móvil | Índice de h2 (solo si hay 3 o más). En desktop marca la sección activa con `aria-current` y borde coral. |
| `AuthorBox.astro` | final del artículo | Firma con foto o iniciales en `ciruela-900` y bio. |
