# Cloudflare Images en EmDash — 4 de octubre de 2026

Se verificó la activación de transformaciones de Cloudflare en el dominio público y se conectó el tema de EmDash. Antes, las imágenes de las plantillas usaban directamente el original; ahora el navegador puede elegir una variante según el espacio mostrado y la densidad de pantalla.

## Integración

- Componente `ResponsiveImage` compartido para portadas del blog, tarjetas de cursos/artículos, miniaturas de menú, certificados, autores, portada y biblioteca. Se conservan alt, dimensiones existentes, prioridad de las imágenes principales y carga diferida de las secundarias.
- Ocho anchos fijos entre 96 y 1600 píxeles; cada uso limita el máximo y declara `sizes`. Calidad 80, negociación automática AVIF/WebP según Accept y `fit=scale-down`, con retorno al original si falla una transformación.
- El servicio nativo de imágenes del adaptador Astro se habilita en producción para bloques y galerías de EmDash. Se autoriza como origen remoto el dominio público, conservando los componentes nativos y su edición. El servicio nativo puede elegir formatos/parámetros distintos de las plantillas.
- Los posters de video se optimizan; los archivos de video conservan su fuente.
- Desarrollo usa originales y passthrough: sus medios requieren autenticación y Cloudflare no debe intentar leerlos sin credenciales. SVG, GIF, proveedores externos y fuentes con parámetros privados no se transforman con el helper de las plantillas.
- Los datos del CMS, imágenes originales, metadatos sociales, JSON-LD y sitemaps conservan sus referencias originales. No se importó contenido ni se modificó su publicación.

## Comparación inicial comprobada

Peticiones con `Accept: image/avif,image/webp,image/*,*/*;q=0.8`, variante de 640 píxeles, calidad 80. Ambas transformaciones respondieron 200, AVIF y cabecera `cf-resized`.

| Imagen | Original (bytes) | Variante (bytes) | Reducción |
| --- | ---: | ---: | ---: |
| 01M40GPJBEKE0P87ZS7W8XPZHR.webp | 41,206 | 14,943 | 63.7% |
| decoracion-guirnalda.jpg | 120,368 | 14,813 | 87.7% |

La reducción corresponde a los bytes de esas imágenes, no al tiempo total de carga ni a un cambio demostrado del LCP.

## Rendimiento móvil pendiente

Una nueva auditoría solicitada con `forceUpdate: true` devuelve LCP **11,9 s**, FCP **2,7 s**, TBT **981 ms** y CLS **0,008**. Señala 391 KB de JavaScript no utilizado (ahorro estimado 2,3 s) y redirecciones (630 ms). La muestra anterior había mostrado LCP 11,7 s y TBT 298 ms; no se concluye mejora del LCP ni que las imágenes hayan causado esa variación.

El proveedor no entrega aquí el elemento LCP ni la traza de ejecución. Las categorías de campo FAST no incluyen ventana, muestra ni INP suficiente para certificar Core Web Vitals. La siguiente investigación debe identificar el elemento LCP y las etiquetas/scripts que bloquean; esta entrega no desactiva la medición comercial.

## Verificaciones y operación

36 pruebas automatizadas aprobadas; Astro check: 158 archivos, cero errores y warnings, 99 hints. Builds y despliegues correctos. Cuatro páginas de desarrollo verificadas con autenticación, noindex y sin solicitar transformaciones de medios privados.

El rastreo público comprobó 122 URLs y 43 recursos de imagen CMS (las variantes hacen que este conteo difiera del anterior de originales), sin incidencias ni títulos duplicados. Se comprobaron cinco páginas de referencia y 45 URLs transformadas: todas devolvieron una imagen 200 con `cf-resized`, sin redirigir al original por error. Las variantes observadas fueron 44 AVIF y una WebP. No se interpreta la suma de bytes del auditor como peso de una página: puede comparar más de una variante del mismo original.

Las cinco páginas no contienen bloques nativos de imagen/galería dentro del cuerpo; la integración del servicio nativo queda verificada por configuración y build, no por un bloque nuevo publicado para esta prueba. No se creó contenido de prueba en producción. No se completó una revisión visual en navegador en esta sesión.

Producción: `873bd1ed-d5e7-4b3c-be2b-f5fdade26509`. Desarrollo: `867bb61f-8eda-4141-83ac-af7359a6039d`.

- [Prueba inicial de transformación](../migration/verification/image-transform-probe.json).
- [HTML e imágenes de referencia en producción](../migration/verification/image-transform-public.json).
- [Rastreo del sitemap](../migration/verification/image-public-regression.json).
- [Desarrollo privado](../migration/verification/image-development.json).
- [Auditoría móvil](../migration/verification/image-pagespeed-mobile.json).

Para repetir: `PYTHONPATH=/tmp/globos-seo-python python3 scripts/audit-image-transforms.py`; requiere requests y beautifulsoup4. El resultado compara peticiones HTTP reales y no utiliza un navegador de laboratorio.

Referencia: [parámetros y estructura de las transformaciones de Cloudflare](https://developers.cloudflare.com/images/optimization/features/). Las variantes usan el original como fuente y no suben otra copia al CMS.
