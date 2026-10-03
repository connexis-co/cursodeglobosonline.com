# Search Console y preparación SEO de EmDash — 3 de octubre de 2026

El sitio ya aparece en Google. De las **119 URLs del sitemap actual**, la inspección de Google confirma **118 indexadas** y una rastreada, actualmente sin indexar. La prioridad es conseguir más clics y visitas comerciales, y conservar las URLs y señales existentes durante el cambio de CMS.

## Datos y alcance

Propiedad: `sc-domain:cursodeglobosonline.com`. Rendimiento web finalizado del **3 al 30 de septiembre**, comparado con el **6 de agosto al 2 de septiembre**. Fuente: GSC SEO & Content Planner y API oficial Search Analytics. Se usó la cuenta de servicio facilitada por el propietario, con alcance de solo lectura; su clave no se guarda en el repositorio.

| Métrica | Período actual | Anterior |
|---|---:|---:|
| Clics | 261 | 173 |
| Impresiones | 12.509 | 2.755 |
| CTR | 2,09 % | 6,28 % |
| Posición media | 8,40 | 15,58 |

Los clics suben aproximadamente un **51 %**. La caída del CTR coincide con mucha más exposición y con páginas informativas nuevas; no demuestra una penalización ni un descenso global de visibilidad. La posición media mezcla consultas, países y dispositivos: no significa que todas las búsquedas comerciales estén en la primera página. El 78,9 % de los clics procede de móvil. Colombia aporta 149 clics; España, 36; Perú, 22; México, 14 con 2.406 impresiones y CTR de 0,58 %.

Se rastrearon las 119 URLs del sitemap y cinco muestras adicionales de URLs antiguas/excluidas. Se consultó URL Inspection para las 124. Dos consultas devolvieron error interno 500 de Google; se repitieron correctamente. Esos errores **no eran respuestas 500 de la web**. Este muestreo completo del sitemap **no sustituye el informe global de Indexación de páginas**, que también contiene URLs históricas fuera del sitemap. No se verificaron en esta consulta los informes privados de acciones manuales, seguridad ni Core Web Vitals. [Alcance de URL Inspection](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect).

Evidencias: [rendimiento](../migration/verification/gsc-planning-2026-10-03.json), [rastreo e inspección](../migration/verification/gsc-indexing-2026-10-03.json), [consultas por artículo, países y dispositivos](../migration/verification/gsc-opportunities-2026-10-03.json). Las consultas devueltas son filas disponibles, no una lista exhaustiva: GSC omite consultas por privacidad y aplica límites. No se estimaron conversiones ni ingresos.

## Estado de indexación

| Hallazgo | Evidencia | Acción |
|---|---|---|
| 118 de 119 URLs del sitemap indexadas | `Submitted and indexed` en la API | Preservar rutas, contenido publicado y redirecciones durante el cambio de CMS. |
| `/blog/decoracion-con-globos-para-mujer/` rastreada sin indexar | Último rastreo 23/09; robots permitido; descarga correcta; canonical de Google coincide | No hay un bloqueo técnico que retirar. Ya tiene contenido, enlaces y presencia en sitemap. Revisar diferenciación editorial y solicitar una nueva inspección tras el lanzamiento; Google decide la inclusión. |
| Categoría `/co/cursos/decoracion-con-globos/` excluida por noindex | Categoría única que duplica catálogo, fuera del sitemap | Exclusión intencional. Mantener hasta que existan categorías con oferta diferenciada. |
| `/cali/` y `/curso-globoflexia/` aparecen como redirecciones | Redirección a sus nuevas URLs de ciudad/curso | Comportamiento esperado. No solicitar indexar las URLs antiguas. |
| `/co/cursos/eventos/` muestra un 404 antiguo | Google conserva rastreo de 13/08; hoy responde 301 al bloque pertinente del blog | La corrección ya existe en producción y se conserva en EmDash. Esperar un nuevo rastreo. |
| Sitemap registrado sin errores ni avisos | Enviado y leído el 23/09 | Reenviar el índice después del corte, con las URLs finales comprobadas. |

Las 119 URLs actuales responden 200 sin redirecciones, tienen un H1, un canonical propio y títulos únicos; ninguna emite noindex. No hubo JSON-LD mal formado en el rastreo. La inspección detectó resultados enriquecidos válidos en 112 de las 124 URLs consultadas; las otras 12 no traían ese apartado, lo que no constituye por sí mismo un error.

El campo `contents[].indexed = 0` que devuelve Sitemaps API está **obsoleto** y no significa «cero páginas indexadas». Para este informe se usaron inspecciones individuales. [Documentación de Sitemaps API](https://developers.google.com/webmaster-tools/v1/sitemaps).

## Correcciones implementadas en desarrollo

1. **Sitemap conectado con el estado editorial.** Las páginas fijas y adicionales solo entran si están publicadas. Las páginas, artículos, cursos, vídeos y recursos con noindex o canonical a otra URL se excluyen. Al retirar esa exclusión vuelven a aparecer. Se incluyó el perfil editorial y se escaparon correctamente las URLs en XML.
2. **Marcado del blog.** El plugin local `globos-seo` reemplaza el BlogPosting básico de EmDash con un único nodo que conserva autor Person/Organization, enlace al perfil, editorial, idioma y fechas. El equipo editorial se identifica como Organization. Las personalizaciones SEO del CMS siguen llegando al marcado. [Guía de Article de Google](https://developers.google.com/search/docs/appearance/structured-data/article).
3. **Hreflang.** No se imprimen alternates en páginas excluidas ni cuando el editor cambia su canonical a otra URL.
4. **Navegación.** Corregido el CSS del encabezado para que alcance los enlaces generados por el menú del CMS: espaciado en escritorio y filas del menú móvil.
5. **Estrellas del blog.** Tarjetas y artículos muestran votos reales, o «Aún sin votos». Se puede votar dentro del artículo y actualizar el voto. El ID estable del CMS vincula los votos al artículo; cursos y blog tienen almacenamiento separado. El resumen superior se actualiza al votar. No se atribuyeron estrellas ficticias ni se añadió AggregateRating a BlogPosting para prometer estrellas en Google. [Tipos admitidos y condiciones de review snippets](https://developers.google.com/search/docs/appearance/structured-data/review-snippet).
6. **Dos cambios de metadatos en el CMS de desarrollo**, como experimento de CTR basado en búsquedas observadas: tamaños de globos destaca la tabla de cm/pulgadas/números; inflado de globos largos destaca el inflador y el paso a paso. No se modificaron cuerpos ni se publicaron revisiones editoriales pendientes. [Cambios exactos](../migration/verification/seo-title-experiment.json).

Estas correcciones están en **dev.cursodeglobosonline.com**. La web pública conserva sus contenidos actuales. Desarrollo sigue autenticado y excluido de buscadores.

## Oportunidades prioritarias

| Artículo | Impresiones | Clics | CTR | Posición media | Próxima mejora |
|---|---:|---:|---:|---:|---|
| Tipos y tamaños de globos | 1.717 | 6 | 0,35 % | 7,23 | Metadatos preparados en EmDash; mantener visible la tabla y desarrollar un recurso gráfico útil a partir de ella. |
| Arco de globos | 1.105 | 4 | 0,36 % | 7,94 | Probar una calculadora de cantidades con supuestos claros y fotografías propias del paso a paso. El título actual ya responde a cómo hacerlo y cuántos globos lleva. |
| Cuánto dura un globo con helio | 915 | 0 | 0 % | 8,45 | Mantener tabla por material/tamaño y fuentes; añadir una comparación visual propia y revisar resultados reales antes de cambiar el enfoque. |
| Cómo inflar globos largos | 779 | 3 | 0,39 % | 7,75 | Metadatos preparados; priorizar un vídeo demostrativo de inflador/boquilla, cola y nudo cuando haya material real. |
| Cómo inflar un globo burbuja | 720 | 1 | 0,14 % | 7,59 | Demostración del sellado y de la variante con globos dentro. El título actual ya aborda el fallo más relevante. |

El CTR esperado del conector es una heurística, no una meta garantizada: respuestas directas, imágenes y otros formatos de resultados pueden reducir los clics. No se asume que cambiar un título por sí solo cause una mejora. Medir por **misma página, consulta, país y dispositivo** durante 28 días finalizados después del lanzamiento; no usar el CTR global para juzgar estos dos cambios.

En páginas comerciales, proteger especialmente Medellín (38 clics), Barranquilla (37), Bucaramanga (18) y Cali (17). «Curso de globos» tiene posición media 23,18 y «curso de globoflexia», 17,30. Mantener claras modalidad online, temario y precio verificado, y enlaces a la ficha específica. No crear más versiones de ciudad del mismo curso para estas consultas: ya se consolidan mediante canonical en la ficha de país. Que distintas ciudades/países compartan una consulta en GSC no basta para declarar canibalización perjudicial.

## Verificación y lanzamiento

Pruebas locales: 23 aprobadas, cero errores de tipado, build Astro/Node 24 correcto. En desarrollo se verificaron votos nuevos/cambio de nota, separación blog/cursos, rechazo de borradores, origen y límites de abuso; los votos temporales se borraron. Se probó el ciclo editorial real de publicación, SEO y sitemap con páginas temporales recuperables. El navegador integrado volvió a devolver `ERR_BLOCKED_BY_CLIENT`; se comprobaron HTML, CSS, APIs y marcado, pero no se certifica revisión visual de escritorio/móvil.

Antes de cortar a producción:

1. Conservar las URLs que hoy funcionan; reconciliar cualquier edición posterior de la web pública. Transferir solo los dos cambios SEO aprobados en el manifiesto, sin reemplazar producción con un volcado de desarrollo.
2. Preparar recursos y autenticación **propios de producción**, importar contenido y votos reales, y aplicar también la migración `0002_blog_votes.sql` a su base de valoraciones. El Worker de esta rama es deliberadamente de desarrollo y no debe conectarse sin cambios al dominio público.
3. Compilar con la URL pública correcta. Verificar canonical, hreflang, JSON-LD, RSS, imágenes y sitemaps sin referencias a `dev`. Mantener la autenticación/noindex en desarrollo; retirar esos bloqueos solo en la configuración independiente de producción.
4. Comprobar rendimiento móvil e imágenes responsive antes del lanzamiento: la migración sirve originales del CMS y todavía requiere definir sus variantes optimizadas. No se inventó una puntuación nueva de Core Web Vitals.
5. Tras el despliegue público, comprobar 200/301/404, contenido, metadatos, imágenes y archivos estáticos. Enviar **https://cursodeglobosonline.com/sitemap-index.xml** a la misma propiedad GSC. No usar Cambio de dirección: no se cambia de dominio.
6. Usar Inspección de URL para solicitar rastreo de la home, las fichas comerciales prioritarias, los dos artículos con metadatos modificados y el artículo de decoración para mujer. Validar correcciones solo en informes cuyo problema realmente se haya resuelto. No solicitar indexar URLs antiguas, duplicadas ni desarrollo.

No se envió todavía el sitemap de desarrollo ni solicitudes de indexación. La API de inspección solo consulta estado; el reenvío de sitemap y la solicitud manual de URLs se hacen después del despliegue público. Google advierte que solicitar rastreo no garantiza indexación y puede tardar días o semanas. [Cómo solicitar un nuevo rastreo](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).
