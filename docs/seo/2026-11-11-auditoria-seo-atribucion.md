# Auditoría SEO, países, diseño y atribución — 11 de noviembre de 2026

Datos: Search Console (API, 12-oct a 8-nov frente a los 28 días anteriores; consultas comerciales a 90 días), GA4 (propiedad 346653915, 12-oct a 10-nov y eventos desde el 6-ago), rastreo de las 122 URLs del sitemap de producción y seguimiento de las redirecciones de Hotmart. Todo se midió el 11-11-2026.

## 1. Por qué casi no hay ventas

No es un fallo de atribución. Es el embudo.

| Paso | Dato |
|---|---|
| Sesiones en GA4 (6-ago a 10-nov) | 3.321 |
| Clics hacia el checkout de Hotmart (`hotm.art`) | unos 60 (1,8 % de las sesiones) |
| Evento `begin_checkout` recibido en GA4 | 0 |
| Clics a Hotmart desde artículos del blog | 0 |

- **El tráfico es informativo.** El blog suma cerca del 90 % de las impresiones de Google (tamaños de globos, arco de globos, cómo inflar). Esas visitas ven 1,1 páginas por sesión y no llegan a una ficha.
- **Las búsquedas de compra están lejos de la primera página.** En 90 días, las consultas con «curso/cursos/clases» dieron 6.438 impresiones y 188 clics, con posición media 32 en Colombia, 24 en México, 31 en Perú y 38 en España.
- **Con 60 clics al checkout en tres meses**, una o dos ventas es lo esperable. Es una estimación a partir de tasas de conversión habituales de checkout, no un dato medido.
- **El «buen tráfico» incluye ruido.** De 1.196 sesiones en 30 días, 369 son «directas» con 85 % de rebote; China, Singapur, Alemania, Francia y Países Bajos entran con rebote de 80–96 % y pocos segundos. Son bots. El tráfico real ronda las 800 sesiones al mes.

## 2. Enlaces de afiliado: qué estaba bien y qué no

**Bien.** Los cuatro enlaces de los botones conservan el `ref` de afiliado hasta el checkout:

| Curso | Hotlink | Producto |
|---|---|---|
| Globoflexia | X76953266Q | M47265375C |
| Bouquets | Y76953276W | G56852236M |
| Flores | T76953268Y | U68605508W |
| Globos Burbuja | D76953272A | F62444331S |
| Decoración con Globos (nuevo) | N76953277L | J42873379B |

Falta que JP confirme en su panel de Hotmart que esos cinco hotlinks son de su cuenta. Desde fuera solo se ve que el `ref` llega al checkout, no de quién es.

**Mal, y corregido en el código:**

1. **258 enlaces sin afiliado.** Cada reseña enlazaba la ficha del marketplace (`hotmart.com/es/marketplace/productos/…`) sin `ref`. Quien comprara desde ahí no contaba como venta propia. Las reseñas ya no enlazan; la valoración de la ficha usa el enlace corto con `dp=1`, que abre la misma página **con** `ref`.
2. **Los `utm_*` no llegan a Hotmart.** Se pierden en la redirección. Solo sobreviven `src` y `sck`. Ahora cada botón envía `sck=<país>_<curso>_<ubicación>` (por ejemplo `mx_globoflexia_hero`), visible en el informe de ventas de Hotmart.
3. **`begin_checkout` nunca llega a GA4.** El sitio lo envía al `dataLayer`, pero el contenedor GTM-KKP7WL8Q no tiene una etiqueta que lo reenvíe. Pendiente de JP en GTM (ver §7).

**Enlaces iguales a los de Sably.** Se cambió `hotm.art/curso-…-crashing` por `hotm.io/…-curso-crashing`, el acortador que usa sably.co. Resuelven al mismo hotlink y al mismo `ref`.

**Cupón.** `offDiscount=031016` da 50 % en los cinco cursos, no solo en Globoflexia (25 / 25 / 40 / 25 / 30 USD). JP decidió extenderlo el mismo 11-11-2026 y quedó publicado: cada botón llega al checkout con el cupón y el precio que cobra Hotmart coincide con el de la ficha. Sube la conversión y baja la comisión por venta. Si el cupón deja de funcionar, hay que revertirlo el mismo día.

## 3. Señales por país

| País | Clics | Impresiones | CTR | Posición |
|---|---:|---:|---:|---:|
| México | 78 | 20.660 | 0,38 % | 7,3 |
| Colombia | 158 | 14.454 | 1,09 % | 6,0 |
| Argentina | 42 | 6.825 | 0,62 % | 7,0 |
| España | 59 | 5.699 | 1,04 % | 7,5 |
| Perú | 23 | 5.532 | 0,42 % | 6,5 |
| Chile | 33 | 3.919 | 0,84 % | 6,8 |

Total: 487 clics y 71.832 impresiones (antes 431 y 31.243). Las impresiones se duplicaron por el blog; los clics comerciales no.

- **`hreflang` está bien montado:** 49 páginas con el juego completo (8 países + `x-default`), recíproco, sin errores. `lang` y `og:locale` coinciden con cada país.
- **México sí muestra su ficha:** `/mx/curso-de-globoflexia/` sale en posición 10–15 por «curso(s) de globoflexia».
- **Colombia no:** por «curso de globoflexia» y «curso de globos» salen seis páginas de ciudad, `/co/` y `/co/cursos/` antes que la ficha (posición 66). Las ciudades heredan la autoridad de las URLs antiguas de WordPress (`/medellin/`, `/cali/`).
- **El blog y la portada enviaban a todo el mundo a `/co/`.** Un lector mexicano terminaba en la ficha colombiana, con precios en COP. Corregido: el enlace cambia al país del visitante al pulsarlo; el HTML que lee Google no cambia.
- **`og:locale` era `es_CO`** en portada y blog. Ahora `es_LA`.
- El WhatsApp es el +57 en los ocho países. No se tocó: es operativo, no de SEO.

## 4. Solapamiento entre páginas (canibalización)

Antes, 45 páginas competían por la misma frase: portada, 8 países y 36 ciudades llevaban «Curso de Decoración con Globos…» en el título, y no existía ninguna ficha de ese curso. La página de ciudad incluso enlazaba la home del país con el texto «curso de decoración con globos online en {país}».

Reparto nuevo, una intención por tipo de URL:

| URL | Búsqueda que atiende | Título |
|---|---|---|
| `/` | curso de globos online (marca, global) | Curso de Globos Online: 5 Cursos con Certificado |
| `/{cc}/` | cursos de globos online en {país} | Cursos de Globos Online en {País}: Precios y Certificado |
| `/{cc}/curso-de-decoracion-con-globos/` **(nueva)** | curso de decoración con globos | Curso de Decoración con Globos Online en {País} |
| `/{cc}/curso-de-globoflexia/` | curso de globoflexia | Curso de Globoflexia Online en {País}: 50% OFF (US$25) |
| `/{cc}/cursos/` | precios / comparar cursos de globos | Precios de los Cursos de Globos en {País}: Comparativa |
| `/{cc}/{ciudad}/` | cursos de globos en {ciudad} | Cursos de Globos en {Ciudad}: Online y con Certificado |

- **Curso nuevo:** «Curso de Decoración con Globos», el general que ya vende Sably. Datos reales de su ficha de Hotmart: MasterClasses.La, 5 módulos, 4,7/5 con 177 valoraciones, US$59,99. Es la ficha que debe ganar «curso de globos» y «curso de decoración con globos».
- **Ciudades:** conservan su H1 («Cursos de decoración con globos en {ciudad}») para no arriesgar los clics que ya traen en Colombia. Cambia el título a plural y el enlace contextual, que ahora apunta a las fichas con el texto exacto.
- **Catálogo:** tenía 228 palabras y repetía las tarjetas. Ahora es una tabla comparativa con precios y una guía de elección.

Riesgo conocido: al cambiar títulos de home de país y ciudades puede haber movimiento de posiciones durante 2–4 semanas. Medir por página y consulta, no por CTR global.

## 5. SEO on-page: hallazgos

| Hallazgo | Estado |
|---|---|
| 122/122 URLs responden 200, un H1 cada una, canonical propio, sin títulos duplicados | Correcto |
| 40 páginas con salto H1 → H3 (fichas y catálogo) | Corregido: la prosa de la ficha cuelga de un H2; el catálogo tiene H2 |
| H2 genéricos en fichas («Requisitos», el nombre del instructor, «23 lecciones, módulo por módulo») | Corregido: nombran el curso |
| H1 de ficha con raya y relleno («— 100% online con certificado») | Corregido: «Curso de X online en {País}» |
| `alt="Imagen del Curso de X"` en 340 imágenes | Corregido: usa el texto del archivo en el CMS o lo que enseña el curso |
| 976 `alt=""` | No es error: son las miniaturas decorativas del menú, junto a su texto |
| Misma descripción en los 8 catálogos | Corregido: incluye país y moneda |
| 6 títulos > 60 caracteres y 3 descripciones > 160 (4 y 3 son del blog) | Los de plantilla, corregidos; los del blog se editan en el CMS |
| `Content-Type: text/html` sin `charset` en la cabecera | Pendiente menor: el HTML declara UTF-8 y los navegadores lo respetan |
| 50 enlaces internos a `/cursos/decoracion-con-globos/`, que es `noindex` | Pendiente: decidir si la categoría se indexa o se deja de enlazar |
| Fichas casi idénticas en 8 países (cambia el nombre del país) | Aceptable con `hreflang`; mejoraría con un párrafo propio por país |

## 6. Diseño

Se retiraron los rasgos que más delataban plantilla: la etiqueta en mayúsculas espaciadas sobre cada título, las ondas entre secciones, las tarjetas y fotos inclinadas, las pegatinas flotantes de la portada, la fila de seis iconos en cuadros pastel de la ficha (ahora una lista de datos) y la píldora sobre el titular del hero. «Tres pasos» pasó de tarjetas a una lista numerada.

Segunda tanda, el mismo día:

- **Fotos:** las portadas de los cinco cursos y dos esquemas del blog pasan a fotos documentales (persona real haciendo el trabajo, sin texto ni marcas). Un revisor aparte las aprobó; una llevó un retoque localizado.
- **Globos:** fotos de globos de látex con cuerda y física, que acompañan todo el recorrido por los márgenes, por detrás del contenido. Se pueden empujar, arrastrar, lanzar y reventar con doble clic.
- **Certificado:** de muestra, compuesto en HTML, con nombre de demostración y el logo de Hotmart. Sin rótulo de «ejemplo ilustrativo».
- **Garantía:** sello de lámina dorada en SVG.
- **Tipografía:** titulares en Gabarito. La serif con «WONK» era el rasgo más reconocible de página generada.

Siguen siendo imágenes generadas. Fotos de montajes y de alumnas reales harían más por la confianza.

## 7. Pendientes de JP

1. **GTM:** crear una etiqueta «GA4 – Evento» con activador de evento personalizado `begin_checkout` (y otra para `click_blog_cta` y `view_course`). Sin ella no hay conversión que medir ni que optimizar en Ads.
2. **Hotmart:** confirmar que los cinco hotlinks son de su cuenta y revisar el informe de ventas por `sck` cuando haya datos.
3. **Decidir** si el 50 % se extiende a los otros cuatro cursos.
4. **Publicado en producción el 11-11-2026** (Worker `2460b8d1`), con IndexNow y reenvío del sitemap. Falta medir: comparar en Search Console, por página y consulta, los 28 días posteriores con los anteriores.
5. **Cloudflare:** revisar el tráfico de bots (China, Singapur) y la inyección del Google tag gateway, pendiente desde octubre.
6. **Globos:** las opciones están en el panel (Plugins → «Globos de la página»): cantidad, tamaño, cuerda o serpentina, si se pueden tocar y reventar.
7. **Fichas de curso:** el detalle de la auditoría de contenido y lo que quedó para decidir (número de lecciones de Flores, «9 videos» de Decoración) está en `2026-11-11-auditoria-contenido-cursos.md`, §8.

