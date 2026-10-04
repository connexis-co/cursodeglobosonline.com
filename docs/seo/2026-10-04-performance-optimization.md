# Optimización de rendimiento — 4 de octubre de 2026

La mejora está publicada en producción y desarrollo. Conserva la edición nativa de EmDash, las relaciones del CMS, los enlaces comerciales, las estrellas, los comentarios y las transformaciones de imágenes existentes.

## Resultados comprobados

| Medición HTTP | Antes | Después, sin caché | Después, con caché |
| --- | ---: | ---: | ---: |
| Portada | 6,893 s | 2,654 s | 0,084 s |
| Índice del blog | Ver evidencia inicial | 3,249 s | 0,081 s |
| Artículo de confeti | Ver evidencia inicial | 4,326 s | 0,090 s |
| Curso de globoflexia | Ver evidencia inicial | 5,793 s | 0,087 s |

Son tiempos hasta los encabezados HTTP desde este equipo, no LCP ni tiempos garantizados para todos los visitantes. Las muestras nuevas se tomaron durante un rastreo paralelo. La caché HTML aplica a visitas anónimas sin cookies ni parámetros; las visitas privadas o con cookies siguen generándose de forma dinámica. Los primeros accesos aún tienen margen de mejora.

La portada pasa de **239.333 a 217.378 bytes de HTML descomprimido**, una reducción del 9,2 %. La fuente Fraunces latina pasa de **121.016 a 66.336 bytes**, una reducción del 45,2 %. Los módulos públicos propios pesan entre 277 y 5.271 bytes por archivo en la muestra; el paquete grande de EmDash corresponde al administrador.

El [informe final de PageSpeed](https://pagespeed.web.dev/analysis/https-cursodeglobosonline-com/24g65fvnqr?form_factor=mobile), sobre la versión final, muestra:

| Laboratorio | Móvil | Escritorio |
| --- | ---: | ---: |
| Rendimiento | 70 | 72 |
| Accesibilidad / buenas prácticas / SEO | 100 / 100 / 100 | 100 / 100 / 100 |
| FCP | 1,7 s | 0,5 s |
| LCP | 10,0 s | 0,7 s |
| TBT | 210 ms | 930 ms |
| CLS | 0 | No transcrito |
| Speed Index | 3,3 s | 0,6 s |

La auditoría móvil anterior, después de optimizar imágenes pero antes de esta entrega, reportaba LCP 11,9 s, FCP 2,7 s, TBT 981 ms y CLS 0,008. Son pruebas independientes, no una comparación controlada. **El LCP móvil sigue alto y el bloqueo de terceros en escritorio sigue pendiente.** Una prueba intermedia dio NO_FCP y otra tuvo CLS anómalo; no se usan para afirmar resultados finales. El elemento LCP de la portada es su H1. Su desglose sin simulación dio 1.340 ms de retraso de renderizado; ese valor no equivale al LCP de 4G lenta.

PageSpeed también muestra datos de campo de los últimos 28 días del origen: LCP 1,3 s y CLS 0, con INP insuficiente. Esta ventana antecede al despliegue y no demuestra una mejora causada por él ni certifica todos los Core Web Vitals.

## Cambios y actualización del CMS

- Caché HTTP nativa de Astro con el proveedor Cloudflare. Máximo de cinco minutos; expira antes de que empiece o termine una promoción publicada y verificada, sin servir promociones caducadas mediante stale-while-revalidate.
- Etiquetas de las colecciones compartidas, ajustes y menús para la invalidación nativa al editar/publicar. Guardar WhatsApp o moderar comentarios también retira el HTML público. Las respuestas HTML varían por Cookie, Host, Authorization y el token de vista previa; administrador, API, desarrollo y vistas privadas quedan fuera.
- Caché nativa de objetos EmDash en KV con TTL de respaldo de una hora y comprobación de época cada segundo. EmDash omite sus snapshots eventualmente consistentes durante los llenados de caché de ruta. El TTL no sustituye la invalidación.
- Lecturas deduplicadas por petición. La portada hidrata tres artículos en lugar de todo el archivo; tarjetas y recomendaciones resuelven cluster/curso sin cargar autores, pilares y artículos relacionados que no muestran. Las páginas editoriales conservan sus relaciones completas. Países resumidos para cabeceras, formularios y catálogos; las páginas geográficas mantienen la jerarquía de ciudades completa.
- Logo vectorial compartido mediante un símbolo SVG, manteniendo colores, tamaños y accesibilidad. La portada muestra texto y botones desde el primer render, sin esperar a la animación de entrada.
- Fuentes locales reducidas, precarga y `font-display: optional`. En una primera visita lenta puede utilizarse la tipografía de respaldo durante esa navegación para evitar un cambio tardío del texto. Se conserva la licencia OFL y un script reproducible. Referencia: [precarga de fuentes opcionales en Chrome](https://web.dev/articles/preload-optional-fonts).
- Carga de GTM, GA4 y Meta después de pintar, o inmediatamente ante la primera interacción. Los eventos se encolan desde el inicio y cada proveedor se carga una vez. No hay detección de robots ni tratamiento especial para Lighthouse. Las visitas que abandonan muy pronto pueden medirse menos que con carga inmediata; iniciar scripts en pagehide no garantiza entrega.

## Validación

41 pruebas automatizadas aprobadas. Astro check: 165 archivos, cero errores y warnings, 99 hints. Builds y despliegues correctos. El rastreo final comprueba **122 URLs de sitemap y 43 imágenes**: sin errores HTTP, canonicals incoherentes, noindex inesperado, títulos duplicados ni JSON-LD inválido en las comprobaciones del auditor.

Se compararon los encabezados y enlaces del contenido principal antes/después en portada, blog, artículo y curso: todos iguales. Cuatro páginas de desarrollo conservan acceso privado y noindex. Se comprobó visualmente la portada móvil y previamente el menú, las estrellas y el formulario de comentarios. El navegador integrado no aplicó el cambio solicitado de viewport a 1.280 px; no se afirma una nueva revisión visual de escritorio. El informe Lighthouse de escritorio sí se obtuvo.

La prueba de invalidación guarda la **misma configuración** de WhatsApp y demuestra HIT → MISS → HIT, sin cambiar sus valores. El acceso autenticado devuelve BYPASS/private,no-store y el hostname workers.dev continúa protegido con 401. La invalidación de moderación se verifica mediante pruebas y revisión de las rutas nativas; no se moderó ni publicó un comentario real para probarla.

## Cuellos de botella que permanecen

El contenedor público `GTM-KKP7WL8Q` carga `G-PHN6J5MTX6` y `G-WVTB898GPH`, además de Google Tag Gateway. Tener dos propiedades no demuestra por sí mismo duplicación incorrecta. Falta verificar el objetivo de cada una y revisar etiquetas innecesarias dentro del contenedor; retirarlas a ciegas puede romper atribución. Meta avisa que el píxel `1711030209407213` no está disponible por sus permisos de tráfico: debe revisarse el dominio permitido en su configuración.

El HTML sin caché sigue dependiendo de múltiples consultas nativas de referencias del CMS. La reducción aplicada conserva integridad, pero no convierte esas páginas en estáticas. El siguiente trabajo de servidor requiere medir y reducir las lecturas restantes, especialmente en cursos y páginas geográficas. No se afirma rendimiento 100/100 ni aprobación de la validación de Google Search Console por estos cambios.

Producción: `328dcae7-67dd-4119-8e39-7de4e8bde104`. Desarrollo: `7ee099da-ec23-444f-ab7c-a241d1c0c71a`. Para revertir, usar la versión anterior de cada Worker; no se modificaron esquemas, datos editoriales ni recursos de almacenamiento.

Evidencias en `docs/migration/verification/performance-*.json`. Repetir HTTP con `scripts/audit-performance.py`, SEO con `scripts/audit-public-launch.py` y la invalidación con `scripts/audit-cache-invalidation.mjs` (este último realiza el guardado idéntico descrito y requiere la credencial local protegida).
