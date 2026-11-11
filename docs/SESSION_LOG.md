# Bitácora de sesiones — cursodeglobosonline.com

> La sesión más reciente va primero. Punto de entrada para retomar el proyecto.

---

# Sesión 2026-11-11 (cuarta tanda) — Globos: agarrar y reventar, y repaso en celular

JP pidió corregir en celular la posición de los globos y el aviso de ubicación («Parece que estás en…»), que salía cortado; y que los globos se puedan agarrar y reventar bien en escritorio y en celular (doble clic o doble toque, o moviéndolos muy fuerte).

- **Estado: en producción.** Worker `b9e79aae` (dev `69c7afdf`).
- **Causa del aviso cortado y del globo escondido:** la barra de campaña (nueva ese mismo día) empuja la cabecera hacia abajo. El aviso estaba fijo a 72 px del borde y quedaba debajo de la cabecera; un globo quedaba detrás de ella con la cuerda colgando. Ahora `GeoToast.astro` se coloca con la posición real de la cabecera, y `BalloonFlock.astro` mide la cabecera y la barra de compra (`measureChrome`) y coloca los globos en la franja libre.
- **Globos en celular:** van enteros entre la cabecera y la barra de compra; el lila pasa a la izquierda (abajo a la derecha está WhatsApp); asoman 24–36 px para no quedar bajo las primeras letras de cada renglón. En tableta son hasta un 50 % mayores que en celular.
- **Por qué fallaba agarrar:** el gesto solo valía si debajo no había *ningún* bloque de texto, y un párrafo ocupa todo el renglón aunque sus letras no. Ahora `exposed()` mira si hay una letra justo bajo el punto (`caretPositionFromPoint` + rectángulos del texto): vale cualquier sitio donde el globo se ve, salvo sobre letras, imágenes, enlaces, botones o fondos opacos.
- **Agarrar y lanzar:** con ratón y con el dedo (antes, en táctil solo se podía golpear). Con el dedo sobre un globo se anula `touchstart`, así que la página no se desplaza durante ese gesto; fuera de un globo no se toca nada. El puntero se captura para que soltar fuera de la ventana también llegue. Mientras se tiene uno en la mano la capa pasa por delante del contenido (`data-arriba`, `z-index: 45`) y vuelve detrás cuando el globo regresa a su sitio.
- **Reventar:** doble clic o doble toque (el segundo vale en un óvalo algo mayor, porque el primero aparta el globo; antes fallaba en los pequeños), o sacudirlo muy fuerte con él en la mano (más de 3.400 px/s con ratón, 2.300 con el dedo). Durante el reventón la capa sube para que los trozos se vean enteros.
- **Tabla de precios en celular** (`/{cc}/cursos/`): con cinco columnas, el precio quedaba fuera de pantalla. Ahora cada curso es una ficha con nombre y precio arriba; en escritorio sigue siendo tabla. Se añadieron `role` para que siga siendo una tabla para lectores de pantalla.
- **Probado:** en escritorio con ratón real (arrastre, doble clic y sacudida, en local y en producción). En celular, con eventos táctiles simulados a 375 px (agarrar, anular el desplazamiento, doble toque, sacudida). **No se probó en un teléfono físico.** Repaso de desbordes a 375 px en portada, país, ficha, precios, ciudad y artículo: sin desbordes de página.

---

# Sesión 2026-11-11 (tercera tanda) — Black Friday y sistema de campañas

JP pidió lanzar ya la promoción de Black Friday tomando la idea del sistema de promociones de Sably, mejorándolo.

- **Estado: en producción.** Worker `c3ec1d72` (dev `996ea4b7`). Todas las páginas llevan la barra «Black Friday · 50 % de descuento en todos los cursos» hasta el **1 de diciembre de 2026 a las 00:00, hora de Colombia**; las fichas muestran «Black Friday: 50% OFF» junto al precio.
- **Decisión de JP: el 50 % se mantiene después de Black Friday.** El descuento sigue fijo en cada ficha (precio, tachado y enlace con `offDiscount=031016`, como lo dejó `release-2026-11-11-descuento.ts`). Por eso la barra **no lleva cuenta atrás ni fecha de fin**: el precio no cambia cuando la campaña termina, y un reloj que no cambia nada sería falso. El 1 de diciembre solo desaparecen la barra y la etiqueta.
- **Recorrido del día, para que no confunda:** primero se montó con la campaña como dueña del descuento (fichas a precio de lista, cuenta atrás, vuelta al precio de lista el 1-dic; Worker `7c99460d`). JP eligió «Mantener el 50 %» y se dejó como está descrito arriba. El modo con cuenta atrás sigue existiendo en el código (ver abajo).
- **Cómo funciona el sistema** (`src/plugins/globos-promotions/model.ts`, `src/lib/promotions.ts`, llamado desde `emdash-content.ts`):
  - Una campaña solo cuenta si está publicada, marcada como verificada y dentro de fechas.
  - Si **baja** el precio de un curso (ficha a precio de lista), la campaña pone precio, tachado, porcentaje, enlace con cupón, `priceValidUntil` y cuenta atrás, y al terminar el curso vuelve a su precio. Si el reloj llega a cero con la pestaña abierta, la página se recarga una vez.
  - Si la ficha **ya cobra ese precio** (descuento fijo), la campaña solo pone la barra y su nombre; sin reloj (`promo.deadline === false`).
  - Todo se aplica en la capa de datos, así que tarjetas, fichas, menú, tabla de precios, título, datos estructurados y `llms.txt` salen del mismo sitio.
  - País y `?promo=` salen de la URL de la petición, que el middleware guarda en un `AsyncLocalStorage`. Sin país (portada, blog) solo cuentan las campañas globales.
  - La caché del HTML nunca cruza el inicio ni el fin de una campaña (`public-cache.ts`, que ahora acepta el `1` con que D1 guarda el booleano).
- **Componentes:** `PromoBar.astro` (barra, antes de la cabecera, en todas las páginas) y `PromoDeadline.astro` (plazo junto al precio; solo con cuenta atrás).
- **Plugin `globos-promotions`:** ya no inyecta HTML. El calendario del panel muestra el estado de cada campaña (activa, programada, borrador, sin verificar, terminada) y tiene un botón **«Comprobar en Hotmart»** que abre el checkout de cada curso con el cupón y compara lo que cobra con lo que publicaría el sitio. Campo nuevo «Nombre visible» (`label`).
- **Verificado en Hotmart el 11-11-2026:** sin cupón cobran el precio de lista (US$59,99 / 49,99 / 49,99 / 79,99 / 49,99); con `031016`, US$30 / 25 / 25 / 40 / 25 (50 %); con `010775`, US$44,99 / 37,49 / 37,49 / 59,99 / 37,49 (25 %). No hay una oferta mayor del productor para Black Friday.
- **Verificación en producción** (`scripts/verify-promocion.ts production`): 132 de 132 páginas con la barra y sin cuenta atrás, 240 botones de pago con el cupón, 40 fichas con el precio en título y datos estructurados, y el checkout de los cinco cursos cobrando lo publicado, con `ref` y `sck`.
- **Cursos enlazados:** el borrador `bf-2026` venía del calendario de Sably con cuatro cursos; el de Decoración (creado hoy) quedaba fuera. El script enlaza los cinco comprobados. Las demás campañas en borrador siguen con cuatro: al activarlas hay que añadir el quinto.
- **Letrero:** JP pidió que diga «en todos los cursos» (no «en los cinco cursos»).
- **Scripts:** `scripts/cms/release-2026-11-11-black-friday.ts --environment=… [--publish]` (campo, comprobación del checkout y campaña; no toca precios; idempotente) y `scripts/verify-promocion.ts <entorno>`. **Orden: primero el código, después los scripts del CMS.**
- **Para una campaña con cuenta atrás de verdad:** dejar las fichas a precio de lista y sin cupón (`price_usd` = lista, sin `original_price_usd` ni `discount_pct`, enlace sin `offDiscount`) y publicar la campaña con cupón y porcentaje. El sitio hace el resto.
- **Indexación en Search Console (pedida por JP, «suave»):** no se pudo hoy. Con la primera URL, Search Console respondió «Cuota superada» (el cupo diario de la cuenta ya estaba gastado) y no se insistió. La API de inspección dice que la ficha de Decoración en los ocho países y los dos artículos nuevos aún figuran como «Google no reconoce esta URL»; home, países, catálogo y las demás fichas están indexadas. El sitemap fue leído el 11-11 sin errores. La tanda de diez queda lista en `docs/seo/cowork-indexacion-manual-gsc.md`.
- **Sigue sin haber vigilancia automática del cupón:** si Hotmart lo retira, hay que quitar el descuento de las fichas ese día. El botón del panel y `verify-promocion.ts` lo detectan, pero hay que ejecutarlos.

---

# Sesión 2026-11-11 — Auditoría SEO/atribución, curso general y pase de diseño

JP pidió revisar por qué el sitio posiciona en Colombia y no en otros países, el solapamiento entre páginas, el diseño «de IA», el SEO on-page y si los enlaces le atribuyen las ventas. A mitad de sesión pidió que los enlaces a Hotmart fueran como los de Sably y añadir los cursos de globos de Sably que faltaran. Informe: `docs/seo/2026-11-11-auditoria-seo-atribucion.md`.

- **Estado: en producción.** JP habilitó el permiso y se desplegó el Worker `2460b8d1` (dev: `be7f4cf0`); con el descuento a los cinco cursos, producción quedó en `b86fe55a` y dev en `685db8d8`. Después se ejecutaron en producción `release-2026-11-11-catalogo.ts` y `release-2026-11-11-contenido.ts` con `--publish` (respaldos en `.data/release-2026-11-11/production/`). Todo quedó en la rama local `feat/seo-diseno-globos-2026-11-11` (sin subir a GitHub), en tres commits a partir de `codex/emdash-migration`: `143171b` (rendimiento del 05-10, que estaba desplegado sin commit), `a50b997` (código del 11-11) y `6714b6e` (informes y material editorial).
- **Verificación en producción:** `scripts/verify-release-2026-11-11.mjs production` sin fallos. Rastreo de las 132 URLs del sitemap (antes 122): todas 200, un H1 cada una, 0 títulos duplicados o de más de 60 caracteres (antes 6), 0 descripciones duplicadas (antes 8), 0 saltos de encabezado (antes 40 páginas), 0 enlaces al marketplace sin `ref` (antes 258), 0 `alt` «Imagen del…» (antes 340). El botón del curso nuevo llega a `pay.hotmart.com/J42873379B?ref=N76953277L` con su `sck`.
- **Buscadores:** IndexNow con 132 URLs (HTTP 200) y sitemap reenviado a Search Console (204, pendiente de lectura). El rastreo dejó la caché caliente.
- **Para revertir el código:** volver a desplegar la versión anterior del Worker desde el panel de Cloudflare (Deployments). El contenido se restaura desde los respaldos JSON de cada entrada.
- **Diagnóstico de ventas:** unos 60 clics al checkout en tres meses sobre 3.321 sesiones; el blog trae el tráfico y no deriva a fichas; las búsquedas de compra están en posición 24–38. `begin_checkout` nunca llegó a GA4 (falta la etiqueta en GTM).
- **Atribución:** los botones conservan el `ref`. Había 258 enlaces al marketplace sin `ref` en las reseñas: retirados. `sck` nuevo por país, curso y ubicación del botón.
- **Enlaces como Sably:** `hotm.io/…-curso-crashing`. Los plugins `globos-integrity` y `globos-promotions` aceptan ahora `hotm.io`: **el código debe desplegarse antes de ejecutar el script del CMS**, o la publicación se rechaza.
- **Curso nuevo:** `curso-de-decoracion-con-globos` (J42873379B, hotlink N76953277L), con datos de su ficha pública de Hotmart. No se copió el temario de Sably: allí es de relleno.
- **Reparto de intenciones:** portada y países → «cursos de globos online»; ficha nueva → «curso de decoración con globos»; catálogo → precios y comparativa; ciudades → «cursos de globos en {ciudad}» con enlaces de texto exacto a las fichas.
- **Diseño:** fuera etiquetas en versalitas, ondas, inclinaciones y pegatinas; ficha con lista de datos.
- **Script editorial:** `node --import tsx scripts/cms/release-2026-11-11-catalogo.ts --environment=local|development|production [--publish]`. Idempotente; sin `--publish` solo informa.
- **Entorno local:** `astro dev` ya funciona en este equipo. `src/worker.ts` omite el Basic y sirve `public/` solo cuando `import.meta.env.DEV`. La base local se inicializa con `POST /_emdash/api/setup` y `wrangler d1 migrations apply globos-ratings-dev --local`. `node_modules` es un enlace a `node_modules.nosync` (iCloud).
- **50 % en los cinco cursos (decisión de JP, el mismo día):** `offDiscount=031016` da la mitad en todos. JP pidió aplicarlo «si realmente aplica»; se comprobó dos veces en el checkout y, ya publicado, siguiendo el botón de cada ficha hasta `pay.hotmart.com`: cobra US$30 (Decoración), 25 (Globoflexia), 25 (Bouquets), 40 (Flores) y 25 (Burbuja), con su `ref` y su `sck`. Script: `scripts/cms/release-2026-11-11-descuento.ts`. Producción quedó en el Worker `b86fe55a` (dev `685db8d8`): el título de la ficha prueba «…: 50% OFF (US$25)», luego «…: 50% OFF» y, si no cabe en 60 caracteres, quita «Online» antes que el descuento. Si Hotmart retira el cupón, hay que revertir precios y enlaces el mismo día: el sitio publicaría un precio que el checkout no cobra.

**Segunda tanda del mismo día (pedidos de JP durante la sesión):**

- **Imágenes hiperrealistas.** Las portadas de curso (dos parecían de juguete) y dos esquemas ilustrados del blog se sustituyen por fotos documentales generadas con el proceso de la skill `imagenes-ultrarrealistas` (2 candidatas, juez aparte, un retoque localizado). Finales en `docs/editorial/2026-11-11/fotos/`. `CourseCover.astro` (portadas SVG de respaldo) se eliminó: sin portada en el CMS se usa una foto real.
- **Globos.** Estudiado lbdballoons.com: usa fotos recortadas de globos, flotación CSS de 3 s y un parallax `(scrollY − inicio) × velocidad` suavizado con `transition: all 2s`. Se reimplementó con material propio (no se copió ningún archivo): `BalloonFlock.astro` es una bandada fija a la ventana, entre el fondo y el contenido (`.contenedor` lleva `z-index: 2`), con resorte amortiguado, cuerda de Verlet, empuje del cursor, arrastre y lanzamiento, y doble clic para reventar (reaparece a los 2,4 s). `Balloons.astro` solo conserva la variante `rise`.
- **Certificado.** `CertificateShowcase.astro` es ahora un certificado compuesto en HTML/CSS con nombre de demostración y el logo de Hotmart. Se quitó el rótulo «Ejemplo ilustrativo».
- **Logo de Hotmart.** JP decidió usarlo en información de pagos y en el certificado (cambia la regla del 22-09). SVG oficial en `public/brand/hotmart.svg`.
- **Garantía.** `GuaranteeSeal.astro`: sello SVG de lámina dorada, en lugar del rosetón.
- **Tipografía.** Titulares en Gabarito (`@fontsource-variable/gabarito`) en vez de Fraunces SOFT/WONK.
- **Script editorial 2:** `scripts/cms/release-2026-11-11-contenido.ts` (fotos, parche SEO de fichas y artículos del blog; `--solo=fotos,cursos,blog`).
- **Servidor local:** `src/worker.ts` deja pasar a Vite los módulos y los 304 solo en `astro dev`; antes ningún script de página corría en local.
- **Opciones de los globos en el panel:** plugin `globos-balloons` (Plugins → «Globos de la página»): mostrar o no, cantidad en computador y en celular, tamaño, con cuerda o sin ella, cuerda fina o serpentina rizada, si se pueden tocar y si revientan con doble clic, y si salen en los artículos. La configuración llega a la página como `window.__globosBandada`; `BalloonFlock.astro` crea los globos desde el script.
- **Física revisada:** la cuerda sale del nudo real de cada foto (medido por imagen), tiene rigidez a la flexión y tres pasos por cuadro; dos globos que se tocan se apartan. La serpentina es más ligera y elástica y se dibuja rizada alrededor de la cadena.
- **Auditoría SEO del contenido de las fichas:** `docs/seo/2026-11-11-auditoria-contenido-cursos.md` y su parche (`…-parche-contenido-cursos.json`), aplicado en local y en dev.
- **Blog:** 5 artículos nuevos en `docs/editorial/2026-11-11/`, con foto principal revisada por un juez aparte (`hoja-fotos-blog.jpg`). En dev: bautizo y revelación de género publicados; dinosaurios (19-nov), San Valentín (3-dic) y baby shower (17-dic) programados. En producción los crea el mismo script `release-2026-11-11-contenido.ts`; si se ejecuta después de una fecha programada, ese artículo sale de inmediato.
- **Ojo:** no ejecutar `astro check` con `astro dev` encendido: deja el servidor local en error 500 hasta reiniciarlo.

---

# Sesión 2026-10-05 — Rendimiento: caché compartida real y snapshot de contenido

JP pidió analizar por qué el sitio en EmDash (Workers) no cargaba tan rápido como debía. Informe completo: `docs/seo/2026-10-05-rendimiento-cache-y-snapshot.md`. Evidencia: `docs/migration/verification/performance-2026-10-05.json`.

- **Causa principal:** `Vary: Cookie` y «cualquier cookie = privado». Desde la segunda página, todo visitante con `_ga` se renderizaba completo, con 80–474 consultas D1 y 1–22 s según el país.
- **Cambios en producción** (`94cc037e`; revertir a `328dcae7`): las cookies de medición no sacan de la caché; `toolbar: 'client'`; HTML 1 h + SWR 24 h, acotado por promociones; snapshot de colecciones en memoria + KV, validado por una firma de D1 en cada render (`src/lib/cms/snapshot.ts`); caché de originales de imagen con purga al reemplazarlos; 404, sitemaps, RSS y `llms.txt` cacheados; Smart Placement; hero de los cursos `eager`; estrellas sin 130 SVG.
- **Resultado:** sin caché, p50 0,37 s y 5 consultas (antes 1–10 s); las visitas con cookies ahora son HIT de 0,22 s. Lighthouse móvil con throttling real: 89–94 y LCP 1,9–2,0 s.
- **Pendiente de JP (panel de Cloudflare):** la inyección automática del Google tag gateway carga GTM, dos GA4, Ads, Clarity, Meta y Hotmart antes del primer pintado. Por eso PageSpeed simulado da LCP de 9–10 s; sin terceros, la portada da 99.
- **Incidente corregido:** un 301 de `www` cacheado bajo la ruta `/blog/` (Workers Cache no usa el host en la clave) provocó un bucle de redirección durante unos 30 minutos. Ahora `www` responde `no-store` y todo lleva `Vary: Host` (`6da52ad9`).
- **Ojo al desplegar:** cada versión del Worker vacía la caché HTML. Conviene recorrer el sitemap después. Si cambia la forma de las filas del snapshot, hay que subir `KV_PREFIX`.

---

# Sesión 2026-09-23 — Estrellas propias (estilo kk Star Ratings) y `aggregateRating`

JP pidió estrellas obligatorias con su dato estructurado y un mecanismo para que la gente
califique cada curso, como el plugin kk Star Ratings de WordPress. Plan y resultado:
`docs/plans/2026-09-23_valoraciones-estrellas.md`.

- **Widget** `StarRating.astro` en el hero de cada ficha y en un bloque «¿Tomaste el curso?
  Califícalo» bajo las reseñas: voto con un clic, cambio de voto y sincronía entre instancias.
- **API** `functions/api/ratings.ts` (Pages Function) + **D1** `cursodeglobosonline-ratings`
  (`…-preview` para previews), configurada en `wrangler.jsonc`. Migraciones en `migrations/`
  (`npm run db:migrate`). Secreto `RATING_SALT` en los dos entornos del proyecto de Pages.
- **Schema:** `aggregateRating` en el `Course`+`Product` desde el primer voto real, con el mismo
  dato que se ve en la página. Hotmart sigue aparte, visible y fuera del schema.
- **Build y refresco:** el build lee `/api/ratings` de producción; `ratings-refresh.yml`
  recompila cada día si cambiaron los votos y avisa por IndexNow.
- **Pruebas:** `npm run test:ratings` (28 comprobaciones) corre en CI contra una D1 local; también
  pasó en un preview real de Cloudflare.
- **Revisión de Copilot** en el PR #20: 4 hallazgos, todos corregidos antes del merge (ver el plan).
- **Seguridad:** Astro 7.1.6 → 7.3.4 y `npm audit fix` (PR #21). Había una vulnerabilidad crítica
  de ejecución remota de código en la optimización AVIF (GHSA-26w7-cxv4-gfx2). Queda con 0
  vulnerabilidades y un `dist/` equivalente (solo cambian las comillas de pulgadas y ya no se
  copian 28 JPG sin usar).
- **Entorno:** wrangler está autenticado en este Mac (OAuth, permisos D1 y Pages), así que no hace
  falta pegar tokens. El disco quedó en 97 % (27 GB libres). El scratchpad temporal se borró y con
  él el `secrets.env` de la sesión anterior: las credenciales ya no están en disco.

---

# Sesión 2026-09-22 — SEO, blog para Discover, marca y anti-canibalización

## 0. TL;DR

| Ítem | Estado |
|---|---|
| Rama | `feat/seo-discover-blog` (worktree `~/dev/cursodeglobosonline.com`, fuera de iCloud) |
| Blog | 28 artículos (6 pilares) con foto hero propia y datos verificados — PR #18 |
| Canibalización | Curso-ciudad → `canonical` al curso-país; categoría única `noindex` |
| Precios | Verificados en el checkout de Hotmart el 22-09-2026 (US$25 / 49,99 / 79,99 / 49,99) |
| Marca | Isologo «La G retorcida» en SVG + iconografía propia; mención de Hotmart conforme a su §5.2 |
| Indexación | IndexNow en el deploy, Bing Webmaster API, ads.txt, llms.txt y llms-full.txt |

## 1. Qué pidió JP (en orden) y qué se hizo

1. **Auditoría y SEO general** → auditoría técnica y on-page completa (`docs/seo/2026-09-22/informe_auditoria_seo.md`).
2. **Blog fuerte para Google Discover** → mapa temático con Google Ads Keyword Planner (8 países),
   DataForSEO y Ubersuggest + GSC; 28 artículos escritos por agentes con guía editorial anti-IA,
   revisión adversarial (SEO/canibalización + verificación de datos) y fotos hero con Nano Banana Pro
   juzgadas por un revisor escéptico.
3. **Estrellas, precio y disponibilidad en los datos estructurados** → `Course` + `Product` con
   `Offer`; **sin** `aggregateRating`, porque las valoraciones son de Hotmart (terceros) y Google
   prohíbe agregar reseñas de otros sitios. Las reseñas reales se muestran visibles con su fuente.
4. **Títulos y metas con AIDA** → reescritos ≤ 60 / ≤ 160 caracteres, únicos por país, con precio
   y descuento solo donde son reales.
5. **Auditoría de diseño y logo** → 17 hallazgos aplicados; isologo nuevo elegido por un panel de
   3 jueces entre 3 conceptos.
6. **«Se posicionan las páginas de ciudad y no las de curso»** → confirmado con GSC y corregido
   (canonical, enlaces internos a la URL canónica, intención por tipo de página).
7. **IndexNow/Bing, ads.txt y llms.txt** → hechos; guía para pedir indexación manual en GSC con
   Claude Cowork (`docs/seo/cowork-indexacion-manual-gsc.md`).
8. **Logo de Hotmart** → NO se usa: sus Términos de uso §5.2 prohíben usar su marca o logotipo
   para publicitar un producto; se dejó una mención factual en texto y una nota de marca.

## 2. Decisiones que NO deben revertirse sin hablar con JP

- **`aggregateRating` solo con votos propios del sitio** (widget de estrellas → D1); nunca con
  datos de Hotmart (riesgo de acción manual por marcado engañoso).
- **Nada de imitar el logo de Hotmart** ni decir «partner oficial»: el sitio es afiliado.
- **Curso-ciudad canónico al curso-país**: revertirlo devuelve la canibalización medida en GSC.
- **Precios en USD como principal**, con el equivalente local marcado como aproximado.
- **Reseñas reales citadas de Hotmart** en lugar de testimonios inventados.

## 3. Entorno (importante)

- El disco del Mac está al 99 % y iCloud desaloja archivos de `~/Documents` («dataless»), lo que
  cuelga git, los hooks y los builds. Por eso:
  - `node_modules` → `node_modules.nosync` (symlink) en la carpeta de Documentos;
  - el repositorio git vive en `~/.git-dirs/cursodeglobosonline.com.git` (la carpeta tiene un
    archivo `.git` con `gitdir:`);
  - **el trabajo activo se hace en el worktree `~/dev/cursodeglobosonline.com`**.
- Liberar espacio en el disco es el arreglo de fondo.

## 4. Dónde está todo

- Estudio y auditorías: `docs/seo/2026-09-22/` · plan: `docs/plans/2026-09-22_seo-blog-discover.md`
- Mapa temático y guías de redacción/imágenes: en el scratchpad de la sesión (copia en `docs/seo/`)
- Kit de marca: `public/brand/` · sistema de diseño: `docs/DESIGN_SYSTEM.md`

---

# Sesión 2026-08-06 — reconstrucción del frontend

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
