# Curso de Globos Online → EmDash

La migración conserva el frontend Astro como tema `globos-classic` y convierte el contenido editorial en colecciones de EmDash 1.1.0. Los cambios publicados en el CMS se sirven mediante SSR; no requieren recompilar ni editar MDX.

## Ambientes y acceso

| Ambiente | Dirección | Contenido y operación |
| --- | --- | --- |
| Producción actual | https://cursodeglobosonline.com | Continúa en Cloudflare Pages con su contenido y su base de votos existentes. Esta migración no lo despliega ni escribe allí. |
| Desarrollo | https://dev.cursodeglobosonline.com | Worker `globos-emdash-dev`, D1 de contenido propio, D1 de votos propia, R2 propio y KV de sesiones propio. |
| Administrador de desarrollo | https://dev.cursodeglobosonline.com/_emdash/admin | Usuario `sably`; la contraseña solicitada está almacenada como secreto de Cloudflare. |

El acceso de desarrollo usa HTTP Basic y el proveedor de autenticación externa soportado por EmDash. Verifica las credenciales en cada solicitud y proporciona una identidad administrativa exclusiva de este entorno. `sably@dev.cursodeglobosonline.com` es un identificador interno, no un buzón configurado. No se habilitó el bypass de desarrollo de EmDash. Su comprobación CSRF y sus permisos siguen activos. Este acceso compartido debe reemplazarse por cuentas individuales antes de una eventual producción del CMS.

El Worker protege también los archivos estáticos, las imágenes y las API. Las respuestas tienen `X-Robots-Tag: noindex, nofollow, noarchive` y `Cache-Control: private, no-store`; `workers.dev` y las URLs de preview están deshabilitadas. No se mantiene ninguna excepción pública para la importación de imágenes.

## Mapa editorial

| Colección / módulo | Migrado | Responsabilidad |
| --- | ---: | --- |
| Cursos | 4 | Descripciones, temario, aprendizajes, público, FAQ, instructor, portada, video opcional, enlaces Hotmart, precios verificados y datos externos documentados. |
| Artículos | 28 | Texto enriquecido, tablas, listas, enlaces, imágenes, autor, tema, pilar, artículos relacionados, FAQ y fechas editoriales. |
| Páginas | 5 | Inicio, contacto, nosotros, privacidad y términos; encabezados, metadatos y contenido editorial. Las nuevas páginas se sirven en `/paginas/{slug}/`. |
| Países / ciudades | 8 / 36 | Moneda, tasa de referencia, contactos regionales y contexto local. Conservan las rutas actuales. |
| Categorías / temas | 3 / 6 | Organización del catálogo y del blog. |
| Autores / testimonios | 1 / 9 | Identidad editorial y testimonios con fuente. |
| Videoteca / gráficos | Vacías, listas para publicar | Videos con portada y transcripción; gráficos con texto alternativo, crédito y licencia. Rutas `/videos/` y `/recursos/`. |
| Promociones | Sin campañas comerciales inventadas | Inicio, fin exclusivo, prioridad, curso, país, clave de campaña, cupón y enlace Hotmart. |
| WhatsApp | Plugin nativo | Número de respaldo por país, reglas por curso/categoría/país/ruta, prioridad, periodos, horario, visibilidad, posición y mensaje. |

El administrador agrupa las colecciones en **Contenido editorial**, **Cursos y ventas** y **Mercados**. Los artículos y cursos usan la fecha original como columna editorial. El idioma de creación predeterminado es español.

Las colecciones editoriales soportan borradores, revisiones, programación y SEO. La videoteca empieza vacía: no se agregaron videos ajenos ni contenido ficticio. Las nuevas entradas publicadas aparecen en los listados y sitemaps correspondientes.

La portada conserva sus secciones y composición actuales. Sus textos principales, FAQ y método se editan en `Páginas → inicio`; los cursos, testimonios y artículos destacados vienen de sus colecciones. Los rótulos de interfaz, ilustraciones SVG, distribución de secciones y estilos pertenecen al tema y se cambian mediante código. No se presenta el CMS como un constructor visual ilimitado.

## Separación del código

- `src/themes/globos-classic/`: componentes, layouts, estilos y definición del tema. Permite rediseñar la presentación conservando las colecciones.
- `src/pages/`: controladores de rutas; consultan contenido publicado del CMS.
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

El despliegue valida el dominio, Worker, bases, bucket, namespace y protección de archivos contra una lista explícita de recursos de desarrollo. No hay comando de publicación a producción en esta rama. Las instrucciones antiguas de despliegue están archivadas en `legacy-workflows/`.

Solo para una instalación de desarrollo nueva, en este orden:

```sh
npm run content:seed
node scripts/push-dev-secrets.mjs
npm run deploy:dev
node scripts/setup-development.mjs
node scripts/import-development-media.mjs
node scripts/test-media-development.mjs
node scripts/configure-development-admin.mjs
```

El setup oficial se niega a repetirse una vez completado. La carga inicial de medios se hace por API autenticada, evitando que el CMS tenga que descargar imágenes desde su propio dominio privado. **No ejecutar el seed para actualizar contenido editorial**: usar el CMS. Publicar código no ejecuta estas importaciones.

`npm run dev` necesita recursos locales inicializados. Los comandos de instalación y verificación incluidos arriba apuntan explícitamente al dev remoto. No mezclar una D1 de producción con el servidor local.

El workflow manual `Deploy EmDash development` requiere que el repositorio tenga un token Cloudflare apropiado en el environment `development`. El despliegue de esta tarea se verificó usando la sesión local autorizada; no se ha configurado un nuevo secreto de GitHub ni ejecutado ese workflow remoto.

## WhatsApp y promociones

Se comprobó con Sably el contrato del plugin WhatsApp. Se corrigió un permiso indispensable en EmDash 1.1.0: `hooks.page-fragments:register`. Sin él, la configuración se guardaba pero el botón no aparecía. Hay un solo botón flotante y respeta la barra móvil de inscripción.

Las campañas publicadas seleccionan un banner por prioridad y respetan país, curso, exclusiones y periodo. Si tienen `url_key`, solo se activan con `?promo=...`. El enlace permite exclusivamente HTTPS y hosts Hotmart conocidos, conserva la atribución y añade el cupón `offDiscount` cuando se configura. La promoción gobierna su propio banner/enlace; los precios y CTA de la ficha conservan la información verificada del curso. No se calculan precios comerciales a partir de porcentajes sin confirmar el checkout.

## Verificación y límites

Se ejecutaron 17 pruebas automatizadas y comprobaciones contra el entorno real. Se verificaron 34 páginas con 35 URLs de imágenes: todas responden correctamente con acceso autorizado y rechazan el acceso anónimo. Los resultados reproducibles están en `verification/`: rutas HTTP, paridad de artículos con el sitemap de producción, importación de medios, ciclo editorial, SEO, promociones y votos. Las páginas de prueba se envían a la papelera recuperable; sus votos temporales se eliminan de la base exclusiva de pruebas.

El navegador integrado devolvió `ERR_BLOCKED_BY_CLIENT` al abrir el dominio. Por ello no se certifica una comparación visual en navegador de escritorio/móvil; se verificaron HTML, rutas, archivos, metadatos, APIs y cambios de publicación reales.

`npm audit` reporta ocho entradas de severidad alta derivadas de **un mismo aviso** en `http-cache-semantics@4.2.0` (`GHSA-ch52-4w7c-c8xp`). El registro no ofrecía versión corregida al verificarlo. En el Astro instalado se importa desde el procesador de imágenes remotas de build; no se ha afirmado que eso elimine todo riesgo. Se conserva el entorno privado y queda registrado para la revisión previa a producción, sin forzar un downgrade incompatible de Astro.

## Paso posterior a producción

La producción actual sigue siendo la fuente editorial vigente hasta el corte. Antes de migrarla se debe comparar de nuevo el contenido que haya cambiado, exportar una copia de seguridad, crear recursos y autenticación de producción independientes, importar contenido y votos reales, comprobar URLs/canónicas/medios/redirecciones, definir variantes optimizadas de las imágenes (desarrollo enlaza directamente los originales del CMS sin usar /_image) y realizar la revisión visual. Una base editada en producción no debe reemplazarse por un volcado de desarrollo. El cambio de dominio principal requiere la decisión de lanzamiento del usuario; no se hizo en esta tarea.
