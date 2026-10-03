# Curso de Globos Online → EmDash

La migración conserva el frontend Astro como tema `globos-classic` y convierte el contenido editorial en colecciones de EmDash 1.1.0. Los cambios publicados en el CMS se sirven mediante SSR; no requieren recompilar ni editar MDX.

## Ambientes y acceso

| Ambiente | Dirección | Contenido y operación |
| --- | --- | --- |
| Producción actual | https://cursodeglobosonline.com | EmDash en el Worker `globos-emdash-production`, con D1, R2 y sesiones separados. Ver [operación de producción](PRODUCTION.md). |
| Desarrollo | https://dev.cursodeglobosonline.com | Worker `globos-emdash-dev`, D1 de contenido propio, D1 de votos propia, R2 propio y KV de sesiones propio. |
| Administrador de desarrollo | https://dev.cursodeglobosonline.com/_emdash/admin | Usuario `sably`; la contraseña solicitada está almacenada como secreto de Cloudflare. |

El acceso de desarrollo usa HTTP Basic y el proveedor de autenticación externa soportado por EmDash. Verifica las credenciales en cada solicitud y proporciona una identidad administrativa exclusiva de este entorno. `sably@dev.cursodeglobosonline.com` es un identificador interno, no un buzón configurado. No se habilitó el bypass de desarrollo de EmDash. Su comprobación CSRF y sus permisos siguen activos. Producción usa otra identidad administrativa y secretos propios; el acceso con usuario `sably` queda limitado al panel y las API privadas. Si se añaden editores, crear identidades individuales.

El Worker de desarrollo protege también los archivos estáticos, las imágenes y las API. Sus respuestas tienen `X-Robots-Tag: noindex, nofollow, noarchive` y `Cache-Control: private, no-store`; `workers.dev` y las URLs de preview están deshabilitadas. No se mantiene ninguna excepción pública para la importación de imágenes.

## Mapa editorial

| Colección / módulo | Migrado | Responsabilidad |
| --- | ---: | --- |
| Cursos | 4 | Descripciones, temario, aprendizajes, público, FAQ, instructor, portada, video opcional, enlaces Hotmart, precios verificados y datos externos documentados. |
| Artículos | 28 | Texto enriquecido, tablas, listas, enlaces, imágenes, autor, tema, pilar, artículos relacionados, FAQ y fechas editoriales. |
| Páginas | 5 | Inicio, contacto, nosotros, privacidad y términos; encabezados, metadatos y contenido editorial. Las nuevas páginas se sirven en `/paginas/{slug}/`. |
| Países / ciudades | 8 / 36 | Moneda, tasa de referencia, contactos regionales y contexto local. Conservan las rutas actuales. |
| Categorías / subcategorías / temas | 3 / 16 / 6 | Catálogos relacionados. La categoría del curso se deriva de su subcategoría. |
| Productores | 1 | MasterClasses.La; relación seleccionable en los cursos. |
| Autores / testimonios | 1 / 9 | Identidad editorial y testimonios con fuente. |
| Videoteca / gráficos | Vacías, listas para publicar | Videos con portada y transcripción; gráficos con texto alternativo, crédito y licencia. Rutas `/videos/` y `/recursos/`. |
| Promociones | 11 campañas en borrador | Inicio, fin exclusivo, prioridad, curso, país, clave de campaña, cupón y enlace Hotmart. |
| WhatsApp | Plugin nativo | Número de respaldo por país, reglas por curso/categoría/país/ruta, prioridad, periodos, horario, visibilidad, posición y mensaje. |

El administrador agrupa las colecciones en **Contenido editorial**, **Cursos y ventas** y **Mercados**. Los artículos y cursos usan la fecha original como columna editorial. El idioma de creación predeterminado es español.

Las colecciones editoriales soportan borradores, revisiones, programación y SEO. La videoteca empieza vacía: no se agregaron videos ajenos ni contenido ficticio. Las nuevas entradas publicadas aparecen en los listados y sitemaps correspondientes.

La portada conserva sus secciones y composición actuales. Sus textos principales, FAQ y método se editan en `Páginas → inicio`; los cursos, testimonios y artículos destacados vienen de sus colecciones. Los rótulos de interfaz, ilustraciones SVG, distribución de secciones y estilos pertenecen al tema y se cambian mediante código. No se presenta el CMS como un constructor visual ilimitado.

## Relaciones, edición y menús

Hay 14 colecciones y 117 entradas en el seed, más 11 campañas creadas mediante la API de desarrollo. Los cursos seleccionan subcategoría y productor; cada subcategoría selecciona categoría. Los artículos enlazan autor, tema, curso o catálogo, pilar y relacionados. Ciudades, testimonios, videos y promociones usan referencias nativas a sus dependencias. Los campos de texto anteriores se retiraron después de migrar los valores.

`globos-integrity` rechaza publicaciones o programaciones con dependencias ausentes/no publicadas, precios incoherentes y ofertas sin verificar. Impide retirar entradas utilizadas por contenido publicado o menús, y protege las cinco páginas esenciales. EmDash valida identidad, colección y cardinalidad de referencias. Los borradores siguen admitiendo trabajo incompleto.

El menú `primary` controla orden, etiquetas, destinos y submenús en escritorio/móvil. El menú `footer` controla enlaces institucionales; categorías y países siguen viniendo de sus colecciones. Se probaron enlaces nativos a páginas, edición inmediata y bloqueo al retirar una página enlazada. Las páginas nuevas usan `/paginas/{slug}/`; las cinco páginas originales conservan sus rutas. Inicio y contacto también muestran el cuerpo enriquecido cuando se agrega.

Antes de modificar el CMS existente, el script guardó un respaldo privado mediante API en `.data/editorial-before.json` y `.data/editorial-schema-before.json`, fuera de Git. El export SQL de D1 no se completó por las tablas virtuales FTS5; no se presenta como un respaldo SQL disponible. `upgrade-development.mjs` es una migración puntual con ese snapshot, no un sincronizador editorial recurrente.

## Comentarios del blog

El blog usa comentarios nativos de EmDash, vinculados al ID estable del artículo. Todos requieren aprobación, incluidos los enviados por usuarios del CMS. Se moderan en **Comentarios** del administrador; no hay un servicio externo ni base paralela. El componente `BlogComments.astro` conserva Fraunces/Nunito Sans, crema, ciruela y coral del sitio; incluye estados vacíos, formulario en español, respuestas, foco visible, mensajes de error y adaptación móvil.

La lectura se renderiza en servidor y muestra solo comentarios aprobados; los correos e IP no se incluyen en su proyección pública. El texto se escapa; se usan el honeypot, validación y límite de envíos nativos. Se comprobaron respuestas entre artículos, spam, retirada, privacidad y limpieza de las pruebas. Turnstile no se configuró. El helper nativo de SSR tiene un límite de 500 comentarios por artículo; si el volumen lo exige, se debe añadir paginación sobre la API nativa.

## Separación del código

- `src/themes/globos-classic/`: componentes, layouts, estilos y definición del tema. Permite rediseñar la presentación conservando las colecciones.
- `src/pages/`: controladores de rutas; consultan contenido publicado del CMS.
- `src/lib/cms/`: relaciones, hidratación y menús.
- `src/plugins/globos-integrity/`: políticas de publicación y dependencias.
- `src/lib/emdash-content.ts`: adaptación del esquema CMS a la plantilla y resolución de medios.
- `src/plugins/globos-whatsapp/`: modelo, validación, página administrativa y render del botón. Adaptado del trabajo coordinado con Sably.
- `src/plugins/globos-promotions/`: campañas del sitio y banner. No depende de las tablas operativas privadas de Sably.
- `src/lib/ratings-api.ts`: lógica de votos portada desde Pages a Astro, con base independiente y validación del curso publicado en el CMS.
- `scripts/migration-source/legacy-site.json`: copia auditable del origen `f846950`; nunca se usa como fallback público.
- `scripts/migrate-content.ts`: genera el seed determinista y el manifiesto de medios. No escribe en un sitio vivo.
- `scripts/import-development-media.mjs`: importa los archivos originales mediante la API oficial; conserva imágenes que un editor ya haya asignado.

La conversión de MDX conserva el original auditable en `source_body`. Los `CourseCta` del cuerpo se convierten en enlaces editables y los `Callout` en citas destacadas con su título; no se ejecuta MDX arbitrario dentro del CMS. Las tablas se convierten a tablas nativas editables.

## Operación

Se requiere Node 24 compatible (`.nvmrc`), `npm ci` y acceso a los recursos Cloudflare del proyecto. Las variables locales van en `.dev.vars`, excluido de Git; usar `.dev.vars.example` como referencia sin copiar secretos entre ambientes.

```sh
npm run check
npm run test:migration
npm run build
node scripts/deploy-emdash.mjs
```

El despliegue valida el dominio, Worker, bases, bucket, namespace y protección de archivos contra una lista explícita de recursos de desarrollo. Producción dispone de `npm run deploy:prod` y un validador separado de recursos. Las instrucciones antiguas de despliegue están archivadas en `legacy-workflows/`.

Solo para una instalación de desarrollo nueva, en este orden:

```sh
npm run content:seed
node scripts/push-dev-secrets.mjs
npm run deploy:dev
node scripts/setup-development.mjs
node scripts/cms/link-bootstrap-references.mjs
node scripts/cms/configure-comments.mjs
node scripts/cms/configure-calendar-menus.mjs
node scripts/cms/configure-brevo.mjs
node scripts/import-development-media.mjs
node scripts/test-media-development.mjs
node scripts/configure-development-admin.mjs
```

El setup oficial se niega a repetirse una vez completado. La carga inicial de medios se hace por API autenticada, evitando que el CMS tenga que descargar imágenes desde su propio dominio privado. **No ejecutar el seed para actualizar contenido editorial**: usar el CMS. Publicar código no ejecuta estas importaciones.

`npm run dev` necesita recursos locales inicializados. Los comandos de instalación y verificación incluidos arriba apuntan explícitamente al dev remoto. No mezclar una D1 de producción con el servidor local.

El workflow manual `Deploy EmDash development` requiere que el repositorio tenga un token Cloudflare apropiado en el environment `development`. El despliegue de esta tarea se verificó usando la sesión local autorizada; no se ha configurado un nuevo secreto de GitHub ni ejecutado ese workflow remoto.

## WhatsApp y promociones

Se comprobó con Sably el contrato del plugin WhatsApp. Se corrigió un permiso indispensable en EmDash 1.1.0: `hooks.page-fragments:register`. Sin él, la configuración se guardaba pero el botón no aparecía. Hay un solo botón flotante y respeta la barra móvil de inscripción.

El calendario precargado viene de las 11 campañas internas de Sably. Se conservaron fechas originales, incluidas las pasadas, y se asignaron países y cursos pertinentes mediante relaciones. Todas están en borrador con `offer_verified=false`: los porcentajes/cupones de referencia no se aplican automáticamente. El panel **Calendario de promociones** filtra por mes y permite abrir cada campaña para verificarla.

Las campañas publicadas y verificadas seleccionan un banner por prioridad y respetan país, curso, exclusiones y periodo. Si tienen `url_key`, solo se activan con `?promo=...`. El enlace permite exclusivamente HTTPS y hosts Hotmart conocidos, conserva la atribución y añade el cupón `offDiscount` cuando se configura. La promoción gobierna su propio banner/enlace; los precios y CTA de la ficha conservan la información verificada del curso. No se calculan precios comerciales a partir de porcentajes sin confirmar el checkout.

## Correo y plugins

SMTP nativo `emdash-smtp@0.4.0` está instalado, con Brevo como proveedor y `contacto@sably.co` como remitente y Reply-To. Falta introducir la clave en su panel y validar el remitente en Brevo antes de probar entrega. No se enviaron correos. Se fijó Nodemailer 10.0.13 en el transporte transitivo para retirar los avisos de su versión anterior; no se certifican transportes SMTP TCP/sendmail en Workers.

La revisión de la tienda y decisiones están en [PLUGINS.md](PLUGINS.md). Se recomienda evaluar Publish Check para control editorial SEO y Forms para una bandeja de contactos. No se instalaron esos dos plugins. **El formulario de captación actual sigue abriendo WhatsApp y no guarda contactos**; los comentarios sí se guardan en su módulo nativo, separado de los leads.

## Verificación y límites

Se ejecutaron 20 pruebas automatizadas y comprobaciones contra el entorno real. Se verificaron 34 páginas con 35 URLs de imágenes: todas responden correctamente con acceso autorizado y rechazan el acceso anónimo. La revisión final de esta ampliación pasó 25 rutas, 10 comprobaciones de integridad y 9 de comentarios. La hidratación de relaciones limita las consultas simultáneas a D1 y reutiliza resultados resueltos durante cada solicitud. Los resultados reproducibles están en `verification/`: rutas HTTP, paridad de artículos con el sitemap de producción, importación de medios, ciclo editorial, SEO, promociones y votos. Las páginas de prueba se envían a la papelera recuperable; sus votos temporales se eliminan de la base exclusiva de pruebas.

La primera revisión del desarrollo privado quedó limitada por `ERR_BLOCKED_BY_CLIENT`. Después del lanzamiento se revisó visualmente Nosotros en el navegador público: párrafos, enlaces, navegación y CTA. Se comprobó el menú móvil y la ausencia de desbordamiento horizontal a 390 px; la captura móvil no estuvo disponible. No se presenta como una revisión visual completa de todas las plantillas.

`npm audit` reporta once entradas de severidad alta derivadas de **un mismo aviso** en `http-cache-semantics@4.2.0` (`GHSA-ch52-4w7c-c8xp`). El registro no ofrecía versión corregida al verificarlo. En el Astro instalado se importa desde el procesador de imágenes remotas de build; no se ha afirmado que eso elimine todo riesgo. El aviso sigue pendiente de una versión corregida y revisión de alcance; no se forzó un downgrade incompatible de Astro. La publicación no equivale a resolver esa dependencia.

## Lanzamiento a producción — 2026-10-03

El usuario autorizó el lanzamiento. Se confirmó que el origen editorial `f846950` no había cambiado, se respaldaron los datos y se importó el paquete nativo verificado a recursos independientes de producción. Se preservaron los votos reales y sus identidades. El dominio principal ya sirve EmDash; desarrollo permanece privado. No volver a importar el seed ni reemplazar la base viva desde desarrollo.

Las 25 pruebas automatizadas pasan y Astro comprueba 150 archivos sin errores ni warnings (100 hints). El rastreo público final verifica 120 URLs y 33 imágenes sin incidencias en las comprobaciones de HTTP, canónicas, H1, descripción, títulos únicos, noindex, referencias a desarrollo y formato JSON-LD. Google aceptó el sitemap (204, pendiente de procesamiento) e IndexNow aceptó las 120 URLs (200). Estos acuses no garantizan indexación. Ver [PRODUCTION.md](PRODUCTION.md) para recursos, reversión, comprobaciones y pendientes.

## Revisión del menú, estrellas y Search Console — 2026-10-03

El encabezado aplica sus estilos a los enlaces del menú nativo del CMS. Los artículos tienen votación propia y las tarjetas muestran su promedio real o «Aún sin votos». `0002_blog_votes.sql` guarda votos por ID estable del artículo, separados de los cursos. Aplicarla antes de desplegar esta versión en cualquier entorno nuevo; las pruebas de desarrollo eliminaron sus votos temporales.

El plugin local `globos-seo` conserva el tipo y perfil del autor en un único BlogPosting. Los sitemaps respetan publicación, noindex y canonical del CMS; las páginas fijas ya no se incluyen si dejan de estar publicadas y se añadió el perfil editorial. El SEO nativo sigue siendo editable. Se verificaron 23 pruebas automatizadas, 10 comprobaciones del ciclo editorial, 10 de votos del blog y la regresión de votos de cursos, además de 25 rutas HTTP. La primera revisión visual estuvo bloqueada en desarrollo; el estado público comprobado se describe arriba.

La [auditoría de GSC](../seo/2026-10-03-search-console.md) cubre las 119 URLs del sitemap público y cinco muestras adicionales. Google confirma 118/119 indexadas; el principal margen de mejora es CTR y consultas comerciales. El manifiesto `verification/seo-title-experiment.json` contiene dos ajustes de metadatos aplicados inicialmente en desarrollo y trasladados con el paquete verificado al CMS de producción. El resultado del lanzamiento y del envío del sitemap público se documenta en [PRODUCTION.md](PRODUCTION.md). Nunca enviar el sitemap privado.
