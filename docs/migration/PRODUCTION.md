# Operación de EmDash en producción

Autorización de lanzamiento del 3 de octubre de 2026: «arregla la pagina de nosotros y despliega ya la web de emdash».

## Recursos separados

| Recurso | Producción | Desarrollo |
| --- | --- | --- |
| Worker | globos-emdash-production | globos-emdash-dev |
| CMS D1 | globos-emdash-production | globos-emdash-dev |
| Archivos R2 | globos-emdash-production-media | globos-emdash-dev-media |
| Sesiones KV | 909e08c406e84feeac6264af9a1fda84 | 8c8b74fc3dbd4e37823b5f8ad10a90b1 |
| Caché de contenido KV | 4744a90cdd1c4a7fbc5a0d486a9261ac | f68a42cb471343d19c33c72465c59695 |
| Votos D1 | cursodeglobosonline-ratings (existente) | globos-ratings-dev |

Los identificadores restantes están en los archivos Wrangler. Los secretos no están en Git. Usuario solicitado `sably`; el proveedor externo de EmDash comprueba las credenciales y conserva los permisos y CSRF nativos. En producción se protegen el administrador y sus API. Las páginas, archivos publicados y comentarios públicos del blog permanecen accesibles. Las URLs privadas de workers.dev exigen autenticación y no permiten indexación.

## Importación inicial

Se utilizó el formato nativo `.emdash`, con análisis previo, asignación de revisiones al administrador de producción y recibo final `verification: verified`, sin advertencias. Se migraron 128 entradas, 179 campos, 14 relaciones, 323 referencias, 33 archivos, 228 revisiones, dos menús y los dos ajustes SEO. Las 11 promociones continúan en borrador. Se excluyeron únicamente datos de pruebas ya en la papelera y taxonomías vacías de la instalación.

El paquete privado y los respaldos están en `.data/launch/`, ignorado por Git. WhatsApp y Brevo se configuraron aparte porque el exportador no transfiere opciones ni secretos de plugins. La moderación del blog exige aprobación de todos los comentarios.

## Calificaciones de cursos

Se preserva la D1 de votos existente y su API de Cloudflare Pages mediante la excepción de ruta `cursodeglobosonline.com/api/ratings*`, sin Worker asignado. La clave HMAC original no puede recuperarse de Pages y no está en disco; conservar ese endpoint evita reiniciar las identidades de votantes o alterar el control de duplicados. EmDash lee los mismos votos para el HTML y los datos estructurados.

Las nuevas estrellas del blog usan `/api/blog-ratings` en EmDash y la tabla independiente `blog_votes`. La migración `0002_blog_votes.sql` no modifica `course_votes`. No eliminar el proyecto Pages ni esa excepción mientras preste el servicio de votos. Una futura retirada requiere una migración explícita de la identidad de votantes, no generar otra clave sin más.

## Despliegues siguientes

1. Usar Node 24 y `npm ci`.
2. Ejecutar `npm run test:migration`, `npm run check` y verificar los cambios en desarrollo.
3. `npm run deploy:prod` compila con el dominio público y valida todos los recursos de producción antes de desplegar.
4. Comprobar las rutas afectadas. Para un cambio de estructura, ejecutar `PYTHONPATH=/tmp/globos-seo-python python3 scripts/audit-public-launch.py` con requests y beautifulsoup4 disponibles.

Nunca ejecutar el seed o una importación de desarrollo sobre producción después del lanzamiento. Las ediciones editoriales se hacen en el panel correspondiente. Desde la revisión SEO del 3 de octubre se utiliza también la caché nativa de objetos de EmDash en KV, con espacios separados por ambiente, TTL de 60 segundos y revalidación de 1 segundo. EmDash invalida contenidos y referencias al editar; la propagación eventual de KV puede retrasar su visibilidad pública alrededor de un minuto. Vista previa y modo de edición omiten esa caché. No se cachean páginas HTML completas, comentarios ni votos con este mecanismo.

## Reversión

El despliegue Pages anterior `83b5b6e2-8995-4164-bcf6-0f0719f19247` permanece disponible. Las rutas del Worker se superponen al origen anterior sin borrar sus dominios. Para devolver el tráfico a Pages, retirar exclusivamente las rutas `cursodeglobosonline.com/*` y `www.cursodeglobosonline.com/*` de `globos-emdash-production`. Conservar bases, archivos, secretos y la excepción de votos. Las ediciones realizadas después del lanzamiento quedan en EmDash y deben reconciliarse antes de una reversión prolongada.

## Pendientes funcionales conocidos

- Brevo: falta introducir la API key y validar la entrega desde `contacto@sably.co`.
- El formulario abre WhatsApp; aún no existe una bandeja de contactos. Su texto se corrigió para describir esa acción real.
- No se publican promociones hasta verificar oferta, cupón, fechas y elegibilidad en Hotmart.

## Verificación final y notificación a buscadores

- Producción: versión Worker `cd05ac1b-50e0-45a9-b8e2-cfec6571e697`.
- Desarrollo: versión Worker `2f99828f-cba6-438f-935d-c88dbce72c4e`.
- 25 pruebas aprobadas; Astro: 150 archivos, cero errores, cero warnings y 100 hints. Ambas compilaciones correctas.
- [Rastreo público](verification/launch-public.json): 120 páginas y 33 imágenes comprobadas; cero incidencias en las comprobaciones implementadas y cero títulos duplicados. No es una medición de Core Web Vitals ni una certificación integral de SEO.
- [Acceso y redirecciones](verification/public-access.json): páginas públicas, panel protegido, ruta codificada protegida, comentarios públicos, rechazo de escritura entre orígenes, 301 y 404. Las seis valoraciones existentes de cursos permanecen disponibles.
- [Desarrollo después del lanzamiento](verification/development-after-launch.json): Nosotros, España y administrador responden con autorización y mantienen noindex.
- Revisión visual de Nosotros en escritorio; interacción del menú móvil y geometría sin desbordamiento a 390 px. No se completó una captura visual móvil.
- [Search Console](verification/sitemap-submission.json): sitemap público enviado el 3 de octubre a las 08:18 UTC; respuesta 204 y `isPending: true`. No se solicitó Cambio de dirección ni se usó Indexing API.
- [IndexNow](verification/indexnow-submission.json): 120 URLs enviadas y aceptadas con HTTP 200. Ni este acuse ni el sitemap garantizan indexación.

## Revisión SEO posterior del 3 de octubre

Producción `3035ccd3-3b4e-4100-82f6-d7fb9fe9cf2d`; desarrollo `552b86f5-cb2d-47e6-97e6-6006c89991ad`. Se añadieron dos artículos nativos (30 publicados en total), controles de intención editorial y la caché KV descrita arriba; se repararon las tablas de 25 artículos sin reseed. Rastreo posterior: 122 URLs de sitemap, 35 imágenes y 130 páginas del grafo; 28 pruebas aprobadas. El rendimiento visual móvil sigue pendiente. Ver [informe de seguimiento](../seo/2026-10-03-followup.md) y sus recibos antes de utilizar las cifras históricas del lanzamiento como estado actual.
