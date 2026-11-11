# Rendimiento: caché compartida y snapshot de contenido — 5 de octubre de 2026

Publicado en producción (`6da52ad9-dfed-40cc-80cf-adf1c888e5a1`, tras la corrección del incidente descrito abajo) y en desarrollo. Versión anterior para revertir: `328dcae7-67dd-4119-8e39-7de4e8bde104` (`npx wrangler rollback` sobre `globos-emdash-production`). No se modificaron esquemas, datos editoriales ni recursos de almacenamiento.

## Diagnóstico

La caché HTML del 4 de octubre funcionaba en pruebas de laboratorio, pero casi no la usaban los visitantes reales:

1. **Cualquier cookie sacaba la visita de la caché.** El Worker añadía `Vary: Cookie` y marcaba `private, no-store` ante cualquier cookie. GTM crea `_ga`, `_gcl_au` y `_fbp` en la primera página, así que desde la segunda navegación cada visita se renderizaba completa: 1,3–3,7 s y unas 150 consultas a D1 en `/blog/`.
2. **Cinco minutos de vida por centro de datos.** Con poco tráfico, la copia caducaba antes de que llegara el siguiente visitante del mismo país.
3. **Render sin caché muy caro.** Cada fila de cada colección se volvía a leer con sus referencias: 80–88 consultas en la portada, 145–157 en el blog y los artículos, 466–474 en las portadas de país. En el tráfico real, el log mostraba 17–22 s desde Singapur, 5 s desde Londres y 4 s desde Atlanta, con 280–380 ms de CPU por página. D1 registraba 587.700 lecturas en 24 horas.
4. **Imágenes originales sin caché.** `/_emdash/api/media/file/*` respondía `max-age=0` y BYPASS (1–1,5 s). Las variantes de `/cdn-cgi/image` dependen de ese original cada vez que su caché expira.
5. Las 404, los sitemaps, el RSS y `llms.txt` no se cacheaban; los rastreadores los piden constantemente.

## Cambios

- **Cookies de medición (`src/lib/public-cache.ts`, `src/worker-production.ts`).** Una lista explícita (`_ga*`, `_gid`, `_gcl_*`, `_fbp`, `_fbc`, Clarity, Bing UET y las de Cloudflare) no saca la visita de la caché. Cualquier otra cookie, incluidas las de sesión y edición de EmDash, mantiene la respuesta privada. Se retiró `Vary: Cookie`: según la documentación de Workers Cache, las cookies no forman parte de la clave, y ese `Vary` creaba una variante por visitante.
- **Barra de edición `toolbar: 'client'`** (`astro.config.mjs`). Es la opción que EmDash recomienda detrás de una caché compartida: el HTML es igual para todos y quien inició sesión ve una píldora «Editar», que recarga con `?_edit`, una versión que nunca se cachea.
- **Frescura (`publicCachePolicy`).** HTML durante 1 h con `stale-while-revalidate` de 24 h; las 404 durante 10 min con 1 h de margen. Ninguno de los dos plazos cruza el inicio ni el fin de una promoción publicada y verificada, igual que antes. Publicar y moderar siguen purgando por etiquetas.
- **Snapshot de contenido (`src/lib/cms/snapshot.ts`).** Las colecciones publicadas e hidratadas se guardan en memoria del isolate y en KV (`globos-snapshot-v2:`), con una firma leída del primario de D1 en cada render: recuentos, `updated_at`, versiones, borrados, programaciones, referencias y SEO. Una sola consulta de unos 5 ms y 475 filas leídas. Como D1 no tiene réplicas, la firma es fuertemente consistente: un render posterior a una publicación nunca usa un snapshot anterior. Por eso es seguro durante los llenados de caché de ruta, donde EmDash omite su propia caché de objetos. Si una publicación ocurre durante una reconstrucción, esas filas se usan solo en esa petición. Cada snapshot vive como máximo 2 horas. Se desactiva con la variable `GLOBOS_CONTENT_SNAPSHOT=off` y no actúa en vista previa ni en modo edición.
- **Filas completas.** El listado de EmDash no trae el panel SEO, así que el snapshot guarda la entrada completa (`getEmDashEntry`) de cada fila. La prueba editorial lo detectó en la primera versión; está corregido y verificado.
- **Originales de imagen.** Caché de borde de 1 día con 7 días de margen y la etiqueta `globos-media`. «Reemplazar original» y borrar purgan esa etiqueta. El navegador conserva la política de EmDash.
- **404, sitemaps, RSS y `llms.txt`** comparten la política y las etiquetas del HTML.
- **Smart Placement** en ambos Workers. Los HIT se siguen respondiendo en el borde; solo los renders van al lugar elegido. Producción ya muestra `cf-placement: remote-YYZ`.
- **LCP de las fichas de curso.** `ResponsiveImage` usaba `loading="lazy"` incluso con `fetchpriority="high"`. La imagen principal del curso y de las landings ahora carga `eager`.
- **Estrellas.** Diez SVG en línea por calificación (130 en la portada, unos 34 KB de HTML) pasan a dos capas con una imagen repetida y el mismo aspecto, incluidos los rellenos parciales.

## Resultados

Medidos desde Miami. Evidencia: `docs/migration/verification/performance-2026-10-05.json`.

| Medición | Antes | Después |
| --- | ---: | ---: |
| Visita con cookies de GA/Meta | BYPASS, 1,3–3,7 s | HIT, 0,22 s |
| Página sin caché | muestras de 1–10 s | 122 URLs del sitemap: p50 0,37 s · p90 1,27 s |
| Página con caché, conexión nueva (curl) | 0,20–0,24 s | 0,20–0,23 s (sin cambio; ya era rápido) |
| Consultas D1 por render | portada 80–88 · blog 145–157 · país 466–474 | p50 5 · p90 19 · máx. 28 |
| CPU por invocación (p50, log en vivo) | 280–380 ms en renders | 40 ms |
| Portada de país sin caché (desarrollo, en caliente) | 3,2–4,2 s | 0,20–0,25 s |
| Segunda petición a una 404 | 1,2–3,6 s, sin caché | HIT, 0,22 s |

Lighthouse 12 en móvil, con la caché ya caliente:

| Página | Throttling real (4G lenta, CPU 4x) | Estimación simulada (la de PageSpeed) |
| --- | --- | --- |
| Portada | 89 · LCP 2,0 s · TBT 360 ms | 68 · LCP 9,6 s |
| Curso de globoflexia | 93 · LCP 2,0 s | 70 · LCP 9,9 s |
| Artículo de confeti | 94 · LCP 1,9 s | 71 · LCP 9,9 s |
| Portada sin terceros | **99 · LCP 1,8 s · TBT 0 ms** | — |

Validación: 43 pruebas, `astro check` sin errores ni avisos, 20 páginas de desarrollo con HTML idéntico al anterior (salvo el marcado de las estrellas y el script de la barra) y las pruebas editoriales, de promociones e integridad de desarrollo aprobadas. Esas pruebas cubren publicar, editar, el panel SEO, `noindex`, canonical, el sitemap, las relaciones y los menús. El log en vivo registró 609 invocaciones sin excepciones durante los despliegues.

## Lo que queda: terceros inyectados por Cloudflare (decisión de JP)

El LCP de 9–10 s que muestra PageSpeed **no es del servidor**: Lighthouse mide 80–140 ms de respuesta. **Cloudflare inyecta el Google tag gateway** (`/zd7n/`) al principio del `<head>`. Ese script carga GTM, dos propiedades GA4 (`G-PHN6J5MTX6`, `G-WVTB898GPH`), Google Ads, Microsoft Clarity, el píxel de Meta y los scripts de Hotmart (incluido su banner de cookies) **antes del primer pintado**. Así se salta el cargador diferido del sitio, y GTM termina cargándose dos veces. La estimación simulada de PageSpeed cuenta todo eso como camino crítico.

Recomendación, ordenada por impacto:

1. En Cloudflare › cursodeglobosonline.com › Google tag gateway, desactivar la **inyección automática** de la etiqueta. El cargador del sitio ya carga GTM después del pintado y conserva los eventos en cola. Si se quiere mantener la medición de primera parte, se puede adaptar el cargador para que use la ruta del gateway.
2. Revisar el contenedor `GTM-KKP7WL8Q`: si hacen falta dos GA4, Clarity y los scripts de Hotmart en todas las páginas. Hotmart añade cuatro peticiones y su propio banner de consentimiento.
3. Opcional: desactivar Cloudflare Web Analytics si no se usa, porque también se inyecta (10 KB).
4. Opcional: una regla WAF para `*.php` y `/wp-admin/*`. Hay escáneres desde Corea que piden decenas de rutas PHP inexistentes; ahora se responden desde caché, pero no hace falta atenderlas.

Pendiente técnico menor: las visitas con `utm_*`, `gclid` o `fbclid` siguen sin caché porque la clave incluye la query. Ahora se renderizan en 0,3–0,7 s. Unificarlas requiere una entrada de pasarela que normalice la URL (`ctx.exports` o `cf.cacheKey`).

## Observaciones para pruebas futuras

- Los «cuelgues» de unos 75 s que aparecieron en algunas mediciones venían de este Mac. macOS corta el `connect` TCP a los 75 s (`net.inet.tcp.keepinit`), y uno de ellos llegó como HIT con `age: 75`: Cloudflare lo sirvió al instante, pero la petición llegó tarde.
- Cada despliegue vacía la caché HTML, porque la versión del Worker forma parte de la clave. El snapshot en KV sobrevive. Después de desplegar conviene recorrer el sitemap para calentar la caché superior; el rastreo de 122 URLs tarda menos de 2 minutos.

## Incidente: bucle de redirección en `/blog/` (corregido)

Workers Cache usa como clave la **ruta, no el dominio**. Durante la verificación final se pidió `https://www.cursodeglobosonline.com/blog/`. El Worker respondió con el 301 hacia el dominio sin www sin cabeceras de caché, y Cloudflare lo guardó por heurística bajo la clave `/blog/`. Desde ese momento, `https://cursodeglobosonline.com/blog/` recibía ese 301 desde la caché, apuntando a sí mismo (`ERR_TOO_MANY_REDIRECTS`). Duró unos 30 minutos.

Corrección (`6da52ad9`): toda respuesta para un host distinto del principal (redirecciones de `www`) sale con `Cache-Control: private, no-store` y `Cloudflare-CDN-Cache-Control: no-store`. Además, **todas** las respuestas llevan `Vary: Host`, no solo el HTML. El despliegue invalidó la entrada errónea. Se comprobó que, tras pedir `www`, el dominio principal sigue respondiendo 200 en `/blog/`, `/blog`, la portada, un curso, un artículo y el sitemap.

Si algún navegador guardó ese 301, lo seguirá usando sin consultar al servidor hasta que se limpie: recarga forzada (Cmd+Shift+R) o borrar los datos del sitio.

Regla para el futuro: cualquier respuesta cuyo contenido dependa del host, del protocolo o de credenciales debe salir `no-store` o con el `Vary` correspondiente. **Nunca** se puede dejar que se almacene una redirección entre hosts.
