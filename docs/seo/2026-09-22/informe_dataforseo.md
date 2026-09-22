# DataForSEO: validación y enriquecimiento del universo de keywords de cursodeglobosonline.com

Fecha: 2026-09-22. Fuente: DataForSEO API v3, con Basic auth desde el entorno. No se guardó ninguna credencial.

## Coste

| Bloque | Endpoint | Llamadas | Coste (USD) |
|---|---|---|---|
| Dificultad MX + CO | `dataforseo_labs/google/bulk_keyword_difficulty/live` | 2 | 0,09696 |
| Intención | `dataforseo_labs/google/search_intent/live` | 1 | 0,04848 |
| Overview MX + CO (volumen DFS, histórico mensual desde 2018-2019, tipos de SERP en caché) | `dataforseo_labs/google/keyword_overview/live` | 2 | 0,08412 |
| Ideas sin filtro (salió ruido de categoría) | `dataforseo_labs/google/keyword_ideas/live` | 2 | 0,26400 |
| Ideas filtradas a `%globo%` o `%bombas%` | `dataforseo_labs/google/keyword_ideas/live` | 2 | 0,26400 |
| Búsquedas relacionadas, profundidad 2 | `dataforseo_labs/google/related_keywords/live` | 12 | 0,18300 |
| SERP real en móvil (44 SERPs + 2 de prueba) | `serp/google/organic/live/advanced` | 46 | 0,17700 |
| **Total** | | **67** | **1,11756** |

- Presupuesto: US$4. Se gastó **US$1,12** (28 %).
- El saldo de la cuenta pasó de 20,663 a 19,546 USD. Lo comprobé con `appendix/user_data`, que es gratis.
- El registro por llamada está en `dfs_raw/_cost_ledger.jsonl`.
- La pasada de `keyword_ideas` sin filtro fue un error de planteamiento y costó US$0,26: devolvió ideas de toda la categoría (cortes de cabello, perfumes…). Solo 29 de 1.000 contenían "globo" o "bomba". La repetí con filtro.

## 1. Validación del universo (304 keywords)

**Qué se eligió** (`dfs_select.py`), sacado de `kw_googleads_master.json` sin las keywords locales:
- top 40 de transaccional_curso
- 35 de negocio_precios
- 90 de informacional_howto
- 70 de informacional_ideas
- 50 de head_tecnica
- 15 de producto (herramientas)
- las variantes de "bombas" con volumen en CO ≥300

**Volúmenes:** el volumen de DataForSEO coincide exactamente con el de Keyword Planner en 256 de 262 keywords en MX y en 231 de 237 en CO. La mediana de la razón es 1,00. Los dos datos salen de Google Ads, así que **no es una validación independiente**, pero confirma que el universo es consistente. La novedad está en el **histórico mensual de varios años** (2018/2019 → ago-2026) que trae `keyword_overview`.

**Dificultad (KD de DataForSEO Labs, 0–100, basada en los backlinks del top 10):**
- **MX:** 204 keywords con dato; **175 tienen KD 0**, 14 están entre 1 y 10, 6 entre 11 y 30, y 9 por encima de 30. Las 100 restantes no tienen dato.
- **CO:** 174 con dato; 112 tienen KD 0 y 37 están por encima de 30. Las 130 restantes no tienen dato.
- En CO los KD altos aparecen en how-to de cola larga: "medio arco de globos paso a paso" 71, "como hacer una guirnalda de globos" 69, "globoflexia facil" 68, "como decorar con globos para cumpleaños" 68, "como inflar globos metalicos" 62.
- En MX: "arco de globos paso a paso" 68, "como inflar un globo con la boca" 64, "curso de decoracion de fiestas" 59, "curso de bouquet de globos" 53.
- Lectura: casi no hay competencia por enlaces en el nicho. Aun así, un KD 0 de DataForSEO en español suele significar "sin datos de enlaces", no "fácil". La competencia real está en el formato de la SERP (ver §3).

**Intención (search_intent, idioma es):** 181 informacional, 73 comercial, 48 transaccional y 2 navegacional.
- Coincide con las reglas del agente anterior en los how-to: 83 de 90 salen informacionales.
- En las keywords de **"curso"** hay mezcla: 20 comerciales, **18 informacionales** y 2 transaccionales.
  - Informacionales: "curso de globos" 0,80, "curso de globologia" 0,92, "clases de globos" 0,84, "curso de globoflexia" 0,50, "curso de bouquet de globos" 0,56, "curso de globos burbuja" 0,44.
  - Comerciales: "curso de decoracion con globos" 0,83 y "curso decoracion de eventos" 0,65.
- En la SERP de "curso de globoflexia" en MX mandan los cursos gratis:
  - edutin "Gratis y Certificado", educagratis.cl y un PDF en Scribd
  - AI Overview y PAA "¿Dónde puedo encontrar cursos gratuitos de globoflexia?"
  - **Implicación:** las money pages de globoflexia, bouquets y burbuja tienen que responder "¿gratis?, ¿precio?, ¿certificado?" (FAQ) para competir con esa intención.
- Detalle por keyword: `dfs_kd_intent.json`, con kd_mx, kd_co, intención y probabilidades, volumen DFS, CPC en USD, medias anuales, últimos 24 meses y serp_item_types en caché.

## 2. Tendencia multi-año (dato nuevo, `keyword_overview`)

**La demanda de Google del nicho está cayendo.** Los datos son la suma de las keywords con los 12 meses completos en 2023 y 2025.

| | MX (245 kw) | CO (219 kw) |
|---|---|---|
| Total 2025 / 2023 | **0,78 (−22 %)** | **0,60 (−40 %)** |
| informacional_ideas | 0,60 | 0,46 |
| head_tecnica | 0,75 | 0,61 |
| informacional_howto | 0,86 | 0,79 |
| transaccional_curso | 0,81 | 0,67 |
| negocio_precios | 0,73 | 0,71 |
| producto | 1,10 | 0,97 |

Medias mensuales por año de los términos principales:
- **"decoracion con globos":** MX 38.692 (2022) → 15.725 (2025). CO 16.550 (2020) → 2.667 (2025).
- **"arco de globos":** MX 16.958 (2022) → 10.933 (2025). CO 8.850 (2021) → 2.058 (2025).
- **"centros de mesa con globos":** MX 9.258 (2023) → 5.592 (2025).

**Temas que crecen de 2023 a 2025 (MX):**
- "flores de globos": 1.983 → 3.275/mes (**×1,65**); en CO ×1,47
- "como decorar con globos en la pared": ×2,25 (CO ×1,55)
- "decoracion con globos rosa y dorado": ×2,06
- "arco con flores de globos": ×3,44
- "arco de globos para entrada": ×3,8
- "tipos de columnas de globos": ×3,98
- "globos inflados con helio": ×4,27
- "decoracion con globos de halloween": 100 → 620/mes
- "paquetes de globos para decorar": ×2,85
- "ideas para decorar con globos sencillo": ×2,61
- En CO además: "inflador de globos" ×1,48, "bombas sempertex" ×1,24, "globos largos" ×1,32 y "como adornar con globos sencillo" ×2,14

**Lo que más cae:** "decoración de cumpleaños para mujer sencilla con globos" (MX ×0,15, CO ×0,16) y "globos decoracion de cumpleaños para mujer" (×0,31 y ×0,25).

**Estacionalidad de "cumpleaños" (corrige un supuesto del informe de Ads):**
- El "pico de sep-2025" no se repite. Con las 16 keywords de cumpleaños de MX, septiembre queda en 0,88, 0,94, 0,84 y 0,87 frente a la media del año en 2022–2025. El mes más alto es enero.
- En CO septiembre queda en 0,95–1,05.
- En la ventana sep-25 → ago-26 septiembre sí parece un pico (MX 1,23, CO 1,62). La causa es la tendencia a la baja: sep-2025 es el mes más antiguo de la ventana.
- Todo el conjunto de MX tiene su pico en **julio** (×1,20 / 1,21 / 1,33 en 2023–2025), por las graduaciones.

**Consecuencias:**
1. Priorizar los temas que crecen (flores con globos, pared, combinaciones de color, arco con flores, columnas, helio).
2. El descenso más fuerte está en las "ideas", que se van a Pinterest y TikTok. Esos temas valen más como piezas visuales para **Discover, Google Imágenes y Pinterest** que como contenido para enlaces azules.
3. Los how-to técnicos resisten mejor.

Advertencia: Google redondea el volumen histórico en tramos y puede reagrupar variantes. La caída puede estar exagerada en algunas keywords, pero el patrón aparece en casi todas.

## 3. SERP real (móvil Android, depth 20, `load_async_ai_overview`, PAA con click_depth 1)

Hay 30 SERPs **main**:
- 29 en MX y "decoracion con bombas" en CO.
- Elegí las keywords informacionales de más volumen y quité las variantes casi iguales de un tema ya incluido.
- Añadí halloween y la Virgen de Guadalupe por estacionales, y dos técnicas de helio.

Además hay 5 SERPs en CO para comparar y 9 **extra** para objetivos concretos (negocio, cómo hacer, money pages de curso). Solo aparecen entre 11 y 18 resultados orgánicos por SERP, porque el depth cuenta también los bloques.

**Qué aparece en las 30 SERPs main** (y la posición mediana del primer bloque):

| Bloque | SERPs | Posición |
|---|---|---|
| images | 29 | 1 |
| short_videos | 29 | 3 |
| people_also_search | 29 | — |
| video | 27 | 4 |
| people_also_ask | 26 | 5 |
| primer orgánico | — | **5** |
| popular_products | 7 | — |
| local_pack | 4 | — |
| AI Overview | 4 | — |
| featured snippet | **0** de 44 | — |

- En móvil el primer enlace azul sale detrás de imágenes y videos.
- **AI Overview** aparece en 4 de las main: globoflexia, tipos de globos, halloween con globos y cuanto dura un globo con helio.
- También aparece en arco de globos CO, arco de bombas CO, globoflexia CO, "cuanto cobrar por decoracion con globos" (MX y CO) y "curso de globoflexia" MX.

**Qué tipo de contenido ocupa los 300 puestos del top 10** (clasificación automática por dominio, URL y título):

| Tipo | Puestos | % |
|---|---|---|
| Video (YouTube 41, FB/IG video 31, TikTok 13) | 85 | 28 % |
| Tienda / ecommerce | 83 | 28 % |
| Pinterest | 52 | 17 % |
| Red social sin video | 18 | 6 % |
| Editorial (tutorial 15, explicativo 12, listicle 3, Wikipedia 1) | 31 | 10 % |
| Servicio local | 11 | 4 % |
| Otros (bancos de imágenes, PDF, sin clasificar) | 20 | 7 % |

**Dominios más frecuentes** (número de SERPs main en las que están en el top 10):

| Dominio | SERPs |
|---|---|
| youtube.com | 25 |
| facebook.com | 21 |
| listado.mercadolibre.com.mx | 18 |
| instagram.com | 14 |
| mx.pinterest.com | 13 |
| amazon.com.mx | 12 |
| co.pinterest.com | 11 |
| es.pinterest.com | 10 |
| monyur.com | 8 |
| tiktok.com | 8 |
| sweetsurpriseboutique.com.mx | 6 |
| balunglobos.com | 5 |
| regalos.teleglobos.com.mx | 5 |
| es.wikihow.com | 4 |
| balloonica.mx | 4 |

- En los carruseles de video, el creador **"Gustavo GG"** sale en 132 elementos. Facebook aporta 138 elementos de video, TikTok 65, Instagram 64 y YouTube 54.
- **cursodeglobosonline.com no aparece en ninguna de las 44 SERPs.**

**Lectura por tipo de SERP:**
- **Donde gana el contenido editorial**, que es lo que más fácil puede ganar el blog:
  - "cuanto dura un globo con helio": 7 de 10 editoriales, más AI Overview
  - "globoflexia" MX: 4, más AI Overview
  - "tipos de globos": 4, más AI Overview
  - "como inflar globo largo": 4
  - "como inflar globos metalicos": 3
  - "tamaños de globos", "como hacer un arco de globos" y "como hacer flores con globos": 2 cada una
  - En todas, los que rankean son sitios pequeños: monyur, fiestafacil, wikihow, balloonstoreco, mossieur-ballon, ruskus-patruskus.
- **Donde dominan las tiendas**, así que la intención es de compra:
  - "arreglos de globos para cumpleaños": 6 de 10
  - "arreglos de globos", "globos burbuja decorados" y "decoracion globos navidad": 5
  - "arco de globos" MX, "guirnalda", "decoracion con globos", "columnas", "flores de globos" y "globos perrito": 3–4
  - Aquí el artículo tiene que ser "ideas + cómo hacerlo" con galería original, y hay que esperar más tráfico de Imágenes y Discover que de enlaces azules.
- **Donde manda Pinterest o el video**, con contenido visual:
  - "como decorar con globos en la pared": 4 Pinterest + 5 video
  - "rosa y dorado": 4 Pinterest
  - "techo con telas y globos": 3 Pinterest + 6 video/social
  - "boda civil": 6 video/social
  - Se necesitan fotos propias, pines y un video corto incrustado.
- **Intención ambigua:**
  - "globos perrito" es de producto (MercadoLibre, Amazon) y sus PAA hablan del Balloon Dog de Jeff Koons. Para el tutorial conviene apuntar a "perrito con globos largos" o "como hacer un perrito con globos": esa SERP es 100 % video y Pinterest, sin tiendas.
  - "arreglos de graduación de globos" está contaminada con ceremonias de graduación (UNAM, UACJ, gob.mx).
- **Negocio y precios:** "cuanto cobrar por decoracion con globos" tiene **0 de volumen** en Planner, pero:
  - En MX y CO hay AI Overview y PAA de precios.
  - El top 10 lo forman publicaciones de grupos de Facebook, videos, un PDF en Scribd y una sola guía (sanjorgeparty.com).
  - De 158 preguntas PAA únicas en las 35 SERPs main y CO, **24 son de precio, coste o negocio**. Con las 9 extra suben a 38 de 191. Hay demanda real, y con contenido débil enfrente.
- **Money pages de curso:**
  - "curso de decoracion con globos" MX: 7 de 10 son cursos (perfectparty.com.mx CDMX, academia.balloonsbyluzpaz.com, globarte.com.mx, edutin.com, fantasiasmiguel.com ×2, un PDF en slideshare), más local pack.
  - La misma búsqueda en CO: Instagram, globoscolombia.co (talleres), tiendacompensar.com, balloonsbogota.com, SENA (betowa) y local pack. En la PAA sale "¿Hay un curso de decoración con globos en el SENA?".
  - "curso de globoflexia" MX: edutin (gratis con certificado), perfectparty, curso gratis en YouTube, PDF en Scribd, educagratis.cl y AI Overview.

## 4. Huecos: keywords nuevas (`dfs_ideas.json`)

- Se reunieron 3.417 ideas únicas de `keyword_ideas` y `related_keywords`, en MX y CO.
- **834 ya estaban** en el universo, comparando por forma normalizada y por raíces.
- Con las mismas reglas de relevancia del agente de Ads, 471 son nuevas.
- Tras un filtro extra de homónimos quedan **156 útiles** (`blog_relevant=true`). Ese filtro es mío y heurístico: quita "falda globo", "pastelería El Globo", "globo faríngeo", "válvula de globo", "mazo leñador", experimentos escolares, piñatas…

**Las más útiles** (volumen DFS de MX / CO; KD 0 salvo que se indique):
- **Herramientas y materiales** (guía "qué necesitas para decorar con globos"):
  - "base para globos" 4.400/390, "base de globos" 1.000, "soporte para globos" 1.000/210, "base para globos de metal" 590, "base para globos de pvc" 260
  - "aro para globos" 1.300, "aro de globos" 880, "estructura para globos" 720, "estructura para arco de globos desmontable" 320
  - "abrillantador de globos" 1.900 y "spray para globos brillo" 210. Esto encaja con la PAA "¿Qué líquido se le pone a los globos para que brillen?", que aparece en 4 SERPs.
- **Técnica:**
  - "medidas de globos" 1.600, que es un hueco del cluster tamaños
  - "globos foil" / "globo foil" 1.300/210
  - "inflar globos con helio" 720/210, "helio para inflar globos" 590/110
  - "globo tamaño 9" 210, "tamaños de globos sempertex" / "tamaños de bombas sempertex" (CO 90)
- **Globo burbuja** (hueco claro): "plumones para globo burbuja" 590, "gel para globo burbuja" 480, "vinil para globo burbuja" 480, "base para globo burbuja" 480, "marcador para globos burbuja" 390/70
- **Ideas:**
  - "globos decorados" 1.000 (KD 13), "techos decorados con globos" 390, "marcos de globos" 390, "mampara decorada con globos" 320
  - "carro alegórico con globos" 480, "pared decoracion dia de las madres con globos" 590, "ramillete de globos" 170/50
  - En CO: "bombas de racimo" 320

## 5. Archivos

Todos en `research/`:
- `dfs_kd_intent.json`: las 304 keywords con KD MX/CO, intención, volumen y CPC de DataForSEO, medias anuales, 24 meses y tipos de SERP en caché
- `dfs_ideas.json`: 471 keywords nuevas con volumen y KD de MX/CO, intención, cluster, ocasión, fuentes y `blog_relevant`
- `dfs_serps.json`: 44 SERPs con features, posiciones, AI Overview y sus dominios citados, PAA, "también se buscó", videos y top 10 con tipo de contenido
- `dfs_raw/`: todas las respuestas crudas y `_cost_ledger.jsonl`
- Scripts: `dfs.py` (cliente con tope de presupuesto), `dfs_select.py`, `dfs_merge_kd.py`, `dfs_ideas_consolidate.py`, `dfs_run_serps.py`, `dfs_run_serps_extra.py`, `dfs_summarize_serps.py`

## Limitaciones

- Volumen, KD e intención son **datos de DataForSEO Labs**. El volumen sale de Google Ads, así que no es independiente del Keyword Planner.
- KD no tiene dato en 100 keywords de MX y 130 de CO.
- Las SERPs son **una sola captura** (2026-09-22, móvil Android, sin ciudad concreta dentro del país). Pueden cambiar según la ciudad, el dispositivo y el día.
- Clasifiqué el tipo de contenido del top 10 con reglas automáticas, sin revisar cada URL. Hay errores sueltos, por ejemplo tiendas que acaban en "otro".
- La elección de las 30 SERPs y el filtro de ruido de las ideas son decisiones mías, documentadas en los scripts.
- La PAA expandida en móvil viene como respuesta de IA de Google, sin dominio de origen. Solo guardé las preguntas.

## Anexo A. Resumen por SERP

Columnas:
- **Ed.:** resultados editoriales en el top 10
- **Tienda**
- **Pin.:** Pinterest
- **Video+Social**
- **Vol. 8p:** volumen de Keyword Planner sumando los 8 países

| Keyword [país] | Rol | Vol. 8p | AIO | PAA | Ed. | Tienda | Pin. | Video+Social | Top 3 |
|---|---|---|---|---|---|---|---|---|---|
| arco de globos [mx] | main | 26200 | no | 6 | 1 | 4 | 2 | 2+0 | listado.mercadolibre.com.mx, sweetsurpriseboutique.com.mx, youtube.com |
| decoracion con globos [mx] | main | 23320 | no | 6 | 0 | 4 | 1 | 1+2 | perfectparty.com.mx, instagram.com, facebook.com |
| bouquet de globos [mx] | main | 11580 | no | 6 | 1 | 3 | 2 | 3+0 | mx.pinterest.com, sweetsurpriseboutique.com.mx, regalos.teleglobos.com.mx |
| arreglos de globos [mx] | main | 8410 | no | 6 | 0 | 5 | 1 | 0+2 | ponchycaprico.com, sweetsurpriseboutique.com.mx, globygift.com |
| centros de mesa con globos [mx] | main | 8200 | no | 6 | 0 | 3 | 1 | 4+2 | mx.pinterest.com, facebook.com, listado.mercadolibre.com.mx |
| guirnalda de globos [mx] | main | 7410 | no | 6 | 0 | 4 | 3 | 1+0 | balunglobos.com, listado.mercadolibre.com.mx, pinterest.com |
| globoflexia [mx] | main | 7360 | sí | 6 | 4 | 0 | 2 | 4+0 | es.wikipedia.org, mossieur-ballon.com, facebook.com |
| como hacer un arco de globos [mx] | main | 6740 | no | 6 | 2 | 1 | 0 | 7+0 | facebook.com, instagram.com, youtube.com |
| flores de globos [mx] | main | 6010 | no | 0 | 0 | 3 | 3 | 4+0 | elconejo.com.mx, listado.mercadolibre.com.mx, facebook.com |
| globos perrito [mx] | main | 4530 | no | 6 | 0 | 4 | 1 | 2+2 | listado.mercadolibre.com.mx, globosyglobos.com.mx, tiktok.com |
| decoracion para boda civil sencilla en casa con globos [mx] | main | 4490 | no | 6 | 1 | 0 | 2 | 5+1 | es.pinterest.com, cl.pinterest.com, nupciasmagazine.com |
| globos burbuja decorados [mx] | main | 4380 | no | 0 | 0 | 5 | 4 | 1+0 | ponchycaprico.com, mx.pinterest.com, listado.mercadolibre.com.mx |
| arreglos de globos para cumpleaños [mx] | main | 3900 | no | 6 | 0 | 6 | 3 | 0+0 | mx.pinterest.com, sweetsurpriseboutique.com.mx, enviaflores.com |
| decoracion globos navidad [mx] | main | 3620 | no | 6 | 0 | 5 | 2 | 3+0 | listado.mercadolibre.com.mx, pinterest.com, fiestafacil.com |
| decoracion con globos para cumpleaños [mx] | main | 3240 | no | 0 | 0 | 4 | 1 | 1+2 | perfectparty.com.mx, instagram.com, sweetsurpriseboutique.com.mx |
| tamaños de globos [mx] | main | 3200 | no | 6 | 2 | 3 | 1 | 4+0 | fiestafacil.com, monyur.com, mx.pinterest.com |
| como decorar con globos en la pared [mx] | main | 2710 | no | 6 | 0 | 0 | 4 | 4+1 | mx.pinterest.com, youtube.com, es.pinterest.com |
| columnas de globos [mx] | main | 2500 | no | 0 | 0 | 4 | 1 | 4+0 | co.pinterest.com, listado.mercadolibre.com.mx, balunglobos.com |
| decoracion con globos para mujer [mx] | main | 2300 | no | 6 | 0 | 4 | 3 | 3+0 | es.pinterest.com, listado.mercadolibre.com.mx, co.pinterest.com |
| arreglos de graduación de globos [mx] | main | 2270 | no | 6 | 0 | 3 | 1 | 1+1 | listado.mercadolibre.com.mx, globygift.com, pinterest.com |
| figuras con globos [mx] | main | 2260 | no | 6 | 1 | 4 | 1 | 4+0 | facebook.com, ruskus-patruskus.com, listado.mercadolibre.com.mx |
| tipos de globos [mx] | main | 2250 | sí | 6 | 4 | 1 | 2 | 1+0 | monyur.com, fantasyglobos.com.mx, es.pinterest.com |
| decoracion de techo con telas y globos [mx] | main | 2240 | no | 6 | 0 | 0 | 3 | 5+1 | tiktok.com, pinterest.com, pinterest.com |
| decoracion con globos rosa y dorado [mx] | main | 2050 | no | 6 | 0 | 3 | 4 | 2+0 | es.pinterest.com, mx.pinterest.com, listado.mercadolibre.com.mx |
| halloween con globos [mx] | main | 1770 | sí | 6 | 1 | 3 | 1 | 3+0 | listado.mercadolibre.com.mx, co.pinterest.com, monyur.com |
| como inflar globo largo [mx] | main | 1750 | no | 6 | 4 | 0 | 0 | 5+1 | magomadrid.es, facebook.com, ventamagia.com |
| decoracion con globos para la virgen de guadalupe [mx] | main | 1430 | no | 6 | 0 | 3 | 1 | 3+2 | mx.pinterest.com, articulo.mercadolibre.com.mx, listado.mercadolibre.com.mx |
| como inflar globos metalicos [mx] | main | 1330 | no | 6 | 3 | 1 | 0 | 5+0 | balloonstoreco.com, instagram.com, es.wikihow.com |
| decoracion con bombas [co] | main | 1080 | no | 6 | 0 | 2 | 2 | 2+1 | co.pinterest.com, facebook.com, co.pinterest.com |
| cuanto dura un globo con helio [mx] | main | 760 | sí | 6 | 7 | 1 | 0 | 1+0 | funtastyc.es, facebook.com, theconfettiparty.com |
| arco de globos [co] | co_compare | 26200 | sí | 6 | 0 | 3 | 2 | 3+0 | listado.mercadolibre.com.co, suenosyfantasias.com, co.pinterest.com |
| decoracion con globos [co] | co_compare | 23320 | no | 6 | 0 | 1 | 1 | 3+2 | co.pinterest.com, giramon.net, facebook.com |
| bouquet de globos [co] | co_compare | 11580 | no | 6 | 0 | 3 | 1 | 3+1 | balloonsbogota.com, suenosyfantasias.com, co.pinterest.com |
| globoflexia [co] | co_compare | 7360 | sí | 10 | 2 | 0 | 2 | 6+0 | es.wikipedia.org, youtube.com, mossieur-ballon.com |
| arco de bombas [co] | co_compare | 970 | sí | 6 | 0 | 4 | 2 | 3+0 | youtube.com, listado.mercadolibre.com.co, co.pinterest.com |
| curso de decoracion con globos [co] | extra | 1280 | no | 6 | 0 | 2 | 0 | 3+2 | instagram.com, globoscolombia.co, youtube.com |
| curso de decoracion con globos [mx] | extra | 1280 | no | 6 | 0 | 0 | 0 | 1+2 | perfectparty.com.mx, youtube.com, instagram.com |
| como hacer flores con globos [mx] | extra | 1260 | no | 0 | 2 | 0 | 1 | 7+0 | youtube.com, youtube.com, tiktok.com |
| curso de globoflexia [mx] | extra | 700 | sí | 6 | 1 | 0 | 0 | 2+1 | edutin.com, perfectparty.com.mx, youtube.com |
| como hacer un bouquet de globos [co] | extra | 310 | no | 6 | 1 | 0 | 1 | 7+1 | youtube.com, instagram.com, youtube.com |
| como hacer globos burbujas [mx] | extra | 240 | no | 6 | 0 | 0 | 1 | 9+0 | facebook.com, youtube.com, facebook.com |
| cuanto cobrar por decoracion con globos [co] | extra | s/d | sí | 6 | 1 | 1 | 0 | 5+2 | facebook.com, youtube.com, facebook.com |
| cuanto cobrar por decoracion con globos [mx] | extra | s/d | sí | 6 | 1 | 2 | 0 | 2+2 | facebook.com, youtube.com, partypaiute.com |
| perrito con globos largos [mx] | extra | s/d | no | 6 | 0 | 0 | 2 | 7+0 | tiktok.com, facebook.com, instagram.com |

## Anexo B. Preguntas PAA por SERP (para H2 y FAQ)

- **arco de globos [mx]**: ¿Cuánto cobran por un arco de globos? · ¿Cómo se llaman los arcos de globos? · ¿Cuántos globos lleva un arco de globos? · ¿Qué material necesito para hacer un arco de globos? · ¿Qué tela se usa para los arcos de globos? · ¿Qué material puedo usar para hacer un arco?
- **decoracion con globos [mx]**: ¿Qué ideas hay para hacer con globos? · ¿Qué tipo de decoración se puede hacer con globos? · ¿Cómo se le llama al arte de decorar con globos? · ¿Qué se necesita para hacer una decoración con globos? · ¿Qué líquido se le pone a los globos para que brillen? · ¿Cuánto cuestan 100 globos?
- **bouquet de globos [mx]**: ¿Qué es un bouquet de globos? · ¿Qué significa la palabra bouquet? · ¿Cuánto cuesta un bouquet de globos? · ¿Qué tipos de bouquet hay? · ¿Cuáles son las 5 flores más bonitas? · ¿Cuáles son los 4 ciclos florales?
- **arreglos de globos [mx]**: ¿Cuánto se cobra por un arreglo de globos? · ¿Cómo se llaman los arreglos con globos? · ¿Cuánto cuesta que te hagan un arco de globos? · ¿Dónde puedo encontrar páginas de decoraciones para fiestas? · ¿Cuánto cobra un decorador de fiestas? · ¿Dónde puedo encontrar páginas de decoraciones?
- **centros de mesa con globos [mx]**: ¿Dónde puedo encontrar centros de mesa económicos? · ¿Dónde venden globos en el centro de la CDMX? · ¿Cuánto cobran por decoración con globos? · ¿Qué ideas hay para hacer con globos? · ¿Qué actividades divertidas se pueden hacer con globos? · ¿Qué líquido se le pone a los globos para que brillen?
- **guirnalda de globos [mx]**: ¿Cuántos globos se ocupan para una guirnalda? · ¿Cuánto cuesta una guirnalda de globos? · ¿Qué es una guirnalda de globos? · ¿Qué globos se pueden usar para hacer guirnaldas? · ¿Qué hilo se usa para hacer guirnaldas de globos? · ¿Cuántos días dura una guirnalda de globos?
- **globoflexia [mx]**: ¿Qué es la globoflexia y para qué sirve? · ¿Cuánto cuesta un curso de globoflexia? · ¿Cómo se llama la persona que hace globoflexia? · ¿Dónde puedo comprar globos por mayoreo? · ¿Cuánto cuesta un paquete de 100 globos? · ¿Qué tan rentable es un negocio de globos?
- **como hacer un arco de globos [mx]**: ¿Qué material se necesita para hacer un arco de globos? · ¿Cuántos globos necesito para hacer un arco de globos? · ¿Cómo se puede armar un arco? · ¿Qué hilo se utiliza para hacer arcos de globos? · ¿Cómo se llama la cinta para armar un arco de globos? · ¿Qué material se usa para hacer arcos?
- **flores de globos [mx]**: (sin PAA)
- **globos perrito [mx]**: ¿Dónde puedo comprar un globo con forma de perrito? · ¿Cuál es el significado de la escultura de Jeff Koons "Balloon Dog"? · ¿Dónde está el Balloon Dog de Jeff Koons? · ¿Cómo se llama el perrito de globo? · ¿Cuánto cuesta la escultura de perro globo de Jeff Koons? · ¿Cómo se llama la raza de perro que parece peluche?
- **decoracion para boda civil sencilla en casa con globos [mx]**: ¿Cómo hacer una boda civil sencilla y económica? · ¿Qué ideas hay para decorar una boda civil en casa? · ¿Qué ideas originales hay para una boda civil? · ¿Cómo adornar para un matrimonio civil? · ¿Qué cosas no deben faltar en una boda civil? · ¿Qué decoración de flores se puede usar para una boda civil?
- **globos burbuja decorados [mx]**: (sin PAA)
- **arreglos de globos para cumpleaños [mx]**: ¿Cuánto cuesta un arreglo de globos para cumpleaños? · ¿Cuánto cuesta que te hagan un arco de globos? · ¿Qué puedo arreglar para un cumpleaños? · ¿Cuánto vale una decoración con globos? · ¿Cuánto cobrar por adornar con globos? · ¿Cuánto cuestan 100 globos?
- **decoracion globos navidad [mx]**: ¿Qué precio tiene una decoración con globos? · ¿Qué está en tendencia para Navidad? · ¿Qué ideas hay para hacer con globos? · ¿Cuál es el mejor globo para decorar? · ¿Qué se le pone a los globos para que duren más? · ¿Cuánto cuestan los globos Sempertex?
- **decoracion con globos para cumpleaños [mx]**: (sin PAA)
- **tamaños de globos [mx]**: ¿Qué tamaños hay de globos? · ¿Qué número son los globos de 30 cm? · ¿Cuáles son los tamaños de las bombas? · ¿Cuáles son los globos número 12? · ¿Cuánto miden los globos del número 10? · ¿Cuáles son los globos número 7?
- **como decorar con globos en la pared [mx]**: ¿Qué es bueno para pegar globos en la pared? · ¿Cómo poner unos globos en la pared? · ¿Qué ideas hay para hacer con globos? · ¿Cómo se llama la cinta para pegar globos en la pared? · ¿Qué pegamento puedo usar para pegar globos? · ¿Cómo pegar en la pared sin dañarla?
- **columnas de globos [mx]**: (sin PAA)
- **decoracion con globos para mujer [mx]**: ¿Qué ideas hay para hacer con globos? · ¿Qué tipo de decoración se puede hacer con globos? · ¿Cuáles son 10 juegos con globos para adultos? · ¿Qué actividades divertidas se pueden hacer con globos? · ¿Cuáles son los 5 juegos recreativos? · ¿Qué dinámica con globos se puede realizar con padres de familia?
- **arreglos de graduación de globos [mx]**: ¿Cuánto se cobra por un arreglo de globos? · ¿Qué ideas hay para temáticas de graduaciones? · ¿Cuánto cuestan los globos de graduación? · ¿Qué ideas hay para celebrar una graduación? · ¿Qué recuerdos se pueden dar en una graduación? · ¿Qué dinámicas divertidas puedo usar en una fiesta de graduación?
- **figuras con globos [mx]**: ¿Cómo se llama el arte de hacer figuras con globos? · ¿Qué cosas puedo hacer con globos? · ¿Cómo se llaman los globos con figuras? · ¿Qué actividad divertida se puede hacer con globos? · ¿Cuáles son 10 juegos con globos para adultos? · ¿Cuáles son los 5 juegos recreativos?
- **tipos de globos [mx]**: ¿Cuáles son los cuatro tipos de globos? · ¿Cómo se llaman los globos para decoración? · ¿Cuáles son los 7 tipos de globos de texto más comunes en las historietas? · ¿Cuáles son los globos foil? · ¿Cómo se llaman todos los tipos de globos? · ¿Cuánto dura un globo foil inflado?
- **decoracion de techo con telas y globos [mx]**: ¿Cómo puedo decorar mi techo con telas? · ¿Qué usar para pegar globos en el techo? · ¿Cómo puedo decorar mi techo? · ¿Qué globos se quedan en el techo? · ¿Qué ideas hay para colgar globos en el techo? · ¿Cómo se llama la cinta para pegar los globos en el techo?
- **decoracion con globos rosa y dorado [mx]**: ¿Cómo combinar dorado con rosado? · ¿Qué ideas hay para hacer con globos? · ¿Qué color combina con rosa y dorado? · ¿Qué color combina con el rosa en decoración? · ¿Qué colores no combinan con el rosa? · ¿Qué color hace que el rosa resalte?
- **halloween con globos [mx]**: ¿Cómo hacer ojos con globos? · ¿Qué ideas hay para una fiesta temática de Halloween? · ¿Qué actividades creativas puedo organizar para Halloween? · ¿Cómo es una fiesta de Halloween? · ¿Qué no debe faltar en una fiesta de Halloween? · ¿Cuáles son 5 cosas que no sabías sobre Halloween?
- **como inflar globo largo [mx]**: ¿Cómo puedo inflar un globo largo con la boca? · ¿Cómo se inflan los globos largos y delgados? · ¿Cómo se llaman los globos que son largos? · ¿Cuáles son las técnicas para inflar globos? · ¿Cómo inflar globos manualmente? · ¿Cómo es la técnica del globo?
- **decoracion con globos para la virgen de guadalupe [mx]**: ¿Qué color de flores se usa para la Virgen de Guadalupe? · ¿Qué necesito para hacer una decoración con globos? · ¿Qué colores son alusivos a la Virgen de Guadalupe? · ¿Cuál es la flor favorita de la Virgen de Guadalupe? · ¿Cuál es la flor que representa a la Virgen María? · ¿Cuáles son las 5 flores que menciona la Biblia?
- **como inflar globos metalicos [mx]**: ¿Con qué se inflan los globos metálicos? · ¿Cómo inflar globos manualmente? · ¿Se pueden volver a inflar los globos metálicos? · ¿Cómo inflar los globos de letras? · ¿Cuáles son las técnicas para inflar globos? · ¿Qué máquina puedo usar para hacer letras para globos?
- **decoracion con bombas [co]**: ¿Cómo se llama cuando decoras con globos? · ¿Qué tipos de bombas hay para decorar? · ¿Qué tipo de decoración se puede hacer con globos? · ¿Qué ideas hay para hacer con globos? · ¿Qué líquido se le pone a los globos para que brillen? · ¿Qué actividades divertidas se pueden hacer con globos?
- **cuanto dura un globo con helio [mx]**: ¿Cómo hacer para que un globo de helio dure más? · ¿Cuánto cuesta llenar un globo con helio? · ¿Qué pasa si inflo los globos un día antes? · ¿Cuánto dura el efecto del helio? · ¿Cuánto tiempo aguanta un globo con helio? · ¿Cuántos globos de helio se inflan con un tanque?
- **arco de globos [co]**: ¿Cómo se llaman los arcos de globos? · ¿Cuánto cuesta un arco de globos en Colombia? · ¿Qué precio tiene un arco de globos? · ¿Qué se necesita para hacer un arco de globos? · ¿Cómo realizar un arco? · ¿Cuáles son las medidas de un arco tradicional?
- **decoracion con globos [co]**: ¿Qué ideas hay para hacer con globos? · ¿Qué tipo de decoración se puede hacer con globos? · ¿Cómo se llama el arte de decorar con globos? · ¿Qué se necesita para hacer una decoración con globos? · ¿Qué líquido se le pone a los globos para que brillen? · ¿Qué material usar para pegar globos a las paredes?
- **bouquet de globos [co]**: ¿Qué es un bouquet de globos? · ¿Qué significa la palabra bouquet? · ¿Qué tipos de bouquet hay? · ¿Cuánto cuesta un bouquet de globos? · ¿Cuánto cuestan 100 globos? · ¿Cuánto tiempo dura un bouquet de globos?
- **globoflexia [co]**: ¿Qué es la globoflexia y para qué sirve? · ¿Cómo se llama la persona que hace globoflexia? · ¿Cómo se llaman los globos de globoflexia? · ¿Dónde puedo encontrar cursos gratuitos de globoflexia? · ¿Hay cursos de globos en el SENA? · ¿Dónde puedo hacer cursos online gratuitos con certificado? · ¿Qué cursos virtuales gratuitos con certificado hay disponibles en Colombia? · ¿Cuál es la mejor plataforma de cursos gratuitos? · ¿Qué cursos virtuales gratuitos hay disponibles en Colombia? · ¿Cuáles son 10 cursos virtuales gratuitos que ofrece Google?
- **arco de bombas [co]**: ¿Cuánto vale un arco de bombas? · ¿Cómo preparar un arco? · ¿Cómo se llaman los arcos de globos? · ¿Cuánto se cobra por un arco de globos? · ¿Qué precio tiene un arco? · ¿Cuántos globos se necesitan para un arco de 1 metro?
- **curso de decoracion con globos [co]**: ¿Cuánto cuesta un curso de decoración de globos? · ¿Hay un curso de decoración con globos en el SENA? · ¿Dónde puedo encontrar cursos gratuitos de globos? · ¿Cuánto cobra un decorador de globos? · ¿Qué tan rentable es un negocio de decoración con globos? · ¿Cuántos globos se necesitan para un arco de 1 metro?
- **curso de decoracion con globos [mx]**: ¿Cuánto cuesta un curso de globos? · ¿Cuánto cobra un decorador de globos? · ¿Dónde puedo encontrar cursos gratuitos de globos? · ¿Cuánto cuesta un curso de decoración de interiores? · ¿Qué tengo que estudiar para ser decoradora de interiores? · ¿Cómo aprender decoración de interiores gratis?
- **como hacer flores con globos [mx]**: (sin PAA)
- **curso de globoflexia [mx]**: ¿Cuánto cuesta un curso de globoflexia? · ¿Dónde puedo encontrar cursos gratuitos de globoflexia? · ¿Qué tan rentable es un negocio de globos? · ¿Qué es el curso de globoflexia? · ¿Cómo se llama la persona que hace globoflexia? · ¿Dónde puedo encontrar un curso de globología?
- **como hacer un bouquet de globos [co]**: ¿Cuáles son los bouquets de globos? · ¿Cuál es la diferencia entre ramo y bouquet? · ¿Qué pegamento es bueno para pegar globos? · ¿Cómo hacer bouquets de flores naturales? · ¿Qué lleva un bouquet de flores? · ¿Cuáles son las 5 flores más bonitas?
- **como hacer globos burbujas [mx]**: ¿Qué se necesita para hacer globos burbujas? · ¿Qué líquido se le pone al globo burbuja? · ¿Cuál es la técnica para inflar globos burbuja? · ¿Qué pegamento se le pone a los globos burbujas? · ¿Cómo sellar un globo burbuja para que no se desinfle? · ¿Qué gel se le pone a los globos burbujas?
- **cuanto cobrar por decoracion con globos [co]**: ¿Cuánto se cobra por una decoración con globos? · ¿Cómo hacer un presupuesto para una decoración con globos? · ¿Cuánto puede cobrar un decorador? · ¿Cuánto debo cobrar por un arco de globos? · ¿Cuánto cuesta un arco de globos en Colombia? · ¿Cómo cobrar un arco de globos?
- **cuanto cobrar por decoracion con globos [mx]**: ¿Qué precio tiene una decoración con globos? · ¿Cuánto se cobra por decorar un evento? · ¿Cuánto puede cobrar un decorador? · ¿Cómo cobrar una decoración de fiesta? · ¿Cuánto se puede cobrar por una decoración de globos? · ¿Cuánto cuestan las decoraciones para eventos?
- **perrito con globos largos [mx]**: ¿Cuál es el significado de la escultura de Jeff Koons "Balloon Dog"? · ¿Dónde está el Balloon Dog de Jeff Koons? · ¿Cuánto cuesta la escultura de perro globo de Jeff Koons? · ¿Cómo se llama el perrito de globo? · ¿Qué es el perro globo de Jeff Koons? · ¿Qué simbolizan los globos?
