# Design System — cursodeglobosonline.com

> Fuente de verdad: [src/styles/global.css](../src/styles/global.css) (tokens Tailwind v4 en `@theme`).
> Principio rector: **fiesta calibrada** — festivo sin infantil, cálido sin empalagoso, y cero
> apariencia de template de IA (plan maestro §3).

## 1. Color (OKLCH)

Paleta propia; prohibido usar los colores default de Tailwind. Luz como modo principal.

| Familia | Token base | Valor | Uso |
|---|---|---|---|
| **Coral** (primario) | `coral-500` | `oklch(0.67 0.185 22)` | CTAs, links de acción, acentos de marca. Escala 50–900. |
| **Ciruela** (tinta) | `ciruela-800` | `oklch(0.25 0.045 329)` | Texto principal; `ciruela-900` para fondos oscuros de sección. |
| **Crema** (fondo) | `crema-50` | `oklch(0.988 0.006 84)` | Fondo global; `crema-100/200` para secciones alternas y bordes. |
| **Aqua** (secundario) | `aqua-500` | `oklch(0.78 0.1 193)` | Ilustraciones, badges informativos, garantía. |
| **Sol** (acento cálido) | `sol-500` | `oklch(0.84 0.145 85)` | Estrellas de rating, precio destacado en fondos oscuros, CTA secundario. |
| **Lila** | `lila-500` | `oklch(0.74 0.1 303)` | Gradientes festivos, ilustración, hover alternativo. |
| **Dorado** | `dorado-500` | `oklch(0.76 0.12 75)` | Sellos, certificado, moños. |

Alias semánticos (para re-tematizar sin tocar componentes): `--color-primario`, `--color-acento`,
`--color-tinta`, `--color-fondo`.

**Reglas**: texto sobre crema = ciruela-800/600/500 (nunca gris puro). Sombras siempre con tinte
ciruela (`shadow-tarjeta`, `shadow-globo`, `shadow-cta`) — nunca `shadow-md` default.

## 2. Tipografía

| Rol | Fuente | Detalles |
|---|---|---|
| Display (h1–h3) | **Fraunces Variable** (`full.css`) | `font-variation-settings: 'SOFT' 55, 'WONK' 1` → serif suave con carácter artesanal. `letter-spacing: -0.015em`, `line-height: 1.12`, `text-wrap: balance`. |
| Texto/UI | **Nunito Sans Variable** | Humanista redondeada, cálida. Pesos usados: 400 / 700 / 800. |

Jerarquía máx. 3 pesos. Botones: uppercase + `tracking-wide` + extrabold (patrón LBD).
Eyebrows: `text-xs font-extrabold tracking-[0.22em] uppercase` en coral-600 (o sol-300 en oscuro).

## 3. Forma y espacio

- Radios: cards `rounded-3xl` (24px) · chips/inputs `rounded-2xl` · botones **pill** (`rounded-full`,
  altura ~46–52px como LBD).
- Contenedor: utilidad `contenedor` (max-w 74rem + padding fluido).
- **Asimetría intencional**: grid de cursos con card destacada `row-span-2`; tarjetas con
  `rotate` de ±0.4–0.9° determinista (testimonios, pasos, barra de datos) que se enderezan al hover;
  chips de stats superpuestos rotados sobre imágenes; secciones alternando crema-50 / crema-100 /
  ciruela-900 con **ondas SVG divisorias** (`Wave.astro`) — ritmo variable, no padding uniforme.

## 4. Movimiento

| Token / clase | Valor | Uso |
|---|---|---|
| `--ease-fiesta` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Hovers con rebote (cards, botones). |
| `--ease-suave` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entradas, menú mobile, transiciones largas. |
| `animate-floating` | `floating 3s ease-in-out infinite` | **Patrón LBD**: globos flotan 0→25px→0; desincronizar con `animation-delay` NEGATIVOS (0/-0.3/-0.6/-1s) y duraciones 3–4.1s. |
| `.globo-plx` | `animation-timeline: scroll()` | Parallax sutil al scroll (anima `translate`, compone con el `transform` del floating). |
| `animate-balloon-rise` | 16–20s linear | Globos que suben en secciones CTA. |
| `.scroll-reveal` | `animation-timeline: view()` | Fade-slide-up al entrar en viewport (nativo, sin librería). |
| `@view-transition` | navigation: auto | Cross-fade entre páginas (MPA, sin JS). |

**Globos decorativos** (`Balloons.astro`): XL de 230–320px **sangrando fuera de la sección**
(offsets negativos + overflow-hidden del padre, como los `.globo--v1..v9` de lbdballoons.com),
medianos de 36–96px dentro. Siempre `aria-hidden` + `pointer-events-none`.
`prefers-reduced-motion: reduce` desactiva todo globalmente.

## 5. Ilustración

- **Portadas de curso** (`CourseCover.astro`): escenas SVG propias por curso — perrito de
  globoflexia con nudos de torsión, bouquet con moño y pesita, flor de pétalos con tallo,
  globo burbuja con confeti y tassels sobre fondo oscuro. Nada de fotos de stock, marcas de
  terceros ni imágenes generadas por IA con artefactos.
- Globos SVG: elipse + gradiente radial (luz en 34%/26%) + brillo blanco rotado −16° + nudo
  triangular + cuerda en S (`q` curves). Reutilizar este anatomía en toda ilustración nueva.
- Iconos: SVG stroke 1.8–2px dibujados a mano en chips `bg-coral-50 text-coral-600` — **nunca**
  filas de emojis como iconografía.

## 6. Voz y microcopy

Cercana, específica y de emprendimiento real: "Cotiza por montaje, no por globo".
CTAs concretos ("Inscribirme con 50% OFF", "Ver temario") — prohibidos los genéricos
("Comenzar ahora", "Descubre más") y las frases de IA ("lleva tus habilidades al siguiente nivel").
Números solo si son reales (auditoría/Hotmart).

## 7. Accesibilidad

Contraste AA sobre crema y ciruela · focus visible (anillo coral 3px en inputs) · skip-link ·
`interpolate-size: allow-keywords` para acordeones nativos animados · menú mobile en `<dialog>`
(focus trap + ESC gratis) · reduced-motion respetado.
