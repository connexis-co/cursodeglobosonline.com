# Informe Ubersuggest — cluster de blog para cursodeglobosonline.com

- **Fecha de consulta:** 2026-09-22 · **Fuente única:** Ubersuggest MCP (cuenta `mcp__ubersuggest` = "main" y cuenta `mcp__ubersuggest_rodrigo`).
- **Consumo:** 97 llamadas (59 main + 38 rodrigo) y **0 errores**, sin respuestas 429. `user_limits`: ambas cuentas con 10.000 búsquedas de keywords / 10.000 content ideas / 900 reports. Cupo mensual de recálculo de métricas usado: main 2/700, rodrigo 9/700.
- **Crudos:** `research/uber_raw/uber_NNN_<cuenta>_<tool>_<param>_<locId>.json`: entrada y respuesta literal de cada llamada, con índice en `uber_raw/uber_index.json`. **Consolidados:** `uber_keywords.json` (804 filas keyword×país), `uber_serp.json`, `uber_content_ideas.json` (245 filas), `uber_competitors.json`, `uber_project_positions.json`.
- **Regla aplicada:** todos los números salen de las respuestas de Ubersuggest. Cuando una herramienta no devolvió datos, lo digo. Las hipótesis e inferencias van marcadas como tales.

Location IDs: CO 2170 · MX 2484 · ES 2724 · AR 2032 · US 2840. Idioma `es`.

---

## 1. Semillas del nicho (keyword_overview)

Vol = búsquedas/mes · SD = SEO difficulty · PD = paid difficulty · CPC en USD · rango = mínimo y máximo de la serie mensual de 13 meses que devuelve la API.

| Semilla | País | Vol | SD | PD | CPC | Intención (Uber) | Rango 13 m |
|---|---|---|---|---|---|---|---|
| globos burbuja | MX | **18.100** | 22 | 100 | 0,08 | Informational | 9.900–33.100 |
| globos burbuja | CO | 1.600 | **9** | 86 | 0,09 | Informational | 1.300–3.600 |
| globos burbuja | AR | 1.300 | 48 | 99 | 0,115 | — | 1.000–1.300 |
| globos burbuja | ES | 320 | 11 | 100 | 0,08 | Informational | 210–480 |
| decoración con globos | MX | **14.800** | 26 | 65 | 0,25 | Commercial | 8.100–22.200 |
| decoración con globos | CO | 2.400 | 21 | 60 | 0,14 | Commercial | 1.600–2.900 |
| decoración con globos | AR | 2.400 | 25 | 91 | 0,10 | Commercial | 1.900–3.600 |
| decoración con globos | ES | 880 | 15 | 99 | 0,29 | Commercial | 480–1.600 |
| arcos de globos | MX | **12.100** | 27 | 100 | 0,18 | — | 8.100–14.800 |
| arcos de globos | AR | 2.900 | 43 | 99 | 0,125 | — | 1.900–3.600 |
| arcos de globos | CO | 1.900 | 25 | 93 | 0,09 | Commercial | 1.000–2.400 |
| arcos de globos | ES | 1.900 | 16 | 100 | 0,30 | Commercial | 1.000–3.600 |
| centros de mesa con globos | MX | 6.600 | 22 | 52 | 0,21 | — | 4.400–8.100 |
| centros de mesa con globos | AR | 1.900 | 25 | 81 | 0,07 | Transactional | 1.300–2.400 |
| centros de mesa con globos | CO | 880 | 24 | 67 | 0,12 | Transactional | 590–1.300 |
| centros de mesa con globos | ES | 390 | 30 | 100 | 0,12 | Transactional | 170–590 |
| guirnalda de globos | MX | 5.400 | 22 | 100 | 0,11 | Transactional | 3.600–8.100 |
| guirnalda de globos | AR | 590 | 18 | 94 | 0,05 | Transactional | 390–880 |
| guirnalda de globos | ES | 320 | 28 | 100 | 0,08 | Transactional | 260–480 |
| guirnalda de globos | CO | 260 | 25 | 69 | 0,06 | Transactional | 110–390 |
| globoflexia | MX | 2.900 | 30 | 4 | 0,11 | Informational | 1.900–3.600 |
| globoflexia | ES | 1.300 | 30 | 36 | 0,04 | Informational | 1.000–1.600 |
| globoflexia | CO | 1.000 | 25 | 11 | 0,03 | Informational | 720–1.900 |
| globoflexia | AR | 210 | 27 | 14 | 0,03 | Informational | 140–320 |
| flores con globos | MX | 1.900 | 30 | 80 | 0,09 | Transactional | 1.000–3.600 |
| flores con globos | CO | 720 | 25 | 48 | 0,19 | Transactional | 390–1.000 |
| bouquets de globos | MX | 480 | 10 | 24 | 0,40 | Transactional | 320–720 |
| bouquets de globos | CO | 260 | 20 | 64 | 0,08 | Transactional | 210–390 |
| bouquet de globos (singular, vía match_keywords) | MX | 5.400 | 11 | 24 | 0,12 | Transactional | n/d |
| negocio de globos | MX | 40 | 15 | 6 | 0 | — | 30–70 |
| negocio de globos | CO | 10 | 13 | 1 | 0 | — | 0–10 |
| cuanto cobrar por decoracion con globos | MX / CO | **0** | 4 | 1 | 0 | — | sin serie |

Lectura:
- **MX es el mercado con más volumen informacional**, entre 5 y 10 veces el de CO en casi todas las semillas.
- **Las SD son bajas en todo el nicho**: casi todo está en SD 9–32 en MX y CO. El caso más fácil es "globos burbuja" en CO, con SD 9 y 1.600 búsquedas.
- **CPC muy bajos** (0,03–0,40 USD). El nicho vale por el tráfico y la autoridad, no por el valor comercial de cada clic.
- **Picos estacionales** tomados de las series:
  - "globos burbuja" MX llega a 33.100 en jul-2025 y en jun-2026, que coincide con las graduaciones.
  - "decoración con globos" MX pasa de 22.200 (jul-2025) a 8.100 (feb-2026).
  - "arcos de globos" ES llega a 3.600 en may-2025.
- **Dos avisos sobre la calidad del dato:**
  1. Ubersuggest trata la variante con tilde y la sin tilde como keywords distintas: "decoración con globos" MX tiene SD 26 y "decoracion con globos" MX tiene SD 18, con el mismo volumen de 14.800.
  2. Muchas filas devuelven intención `null`.

## 2. Long-tail informacional (match_keywords, keyword_suggestions)

Son 804 filas en total en `uber_keywords.json`. Esta tabla muestra la selección informacional o de "ideas" con volumen ≥ 90 (volumen, SD).

**MX**
- Globos burbuja:
  - globos burbuja graduacion 3.600 (SD 30) · globos burbuja graduación 2.900 (26) · de graduacion 1.600 (11) · de graduación 1.000 (22) · para graduación 880 (14)
  - globos burbuja decorados 4.400 (30) · centro de mesa con globos burbuja 1.300 (30)
  - globos burbuja con pintura 720 (31) · letras para globos burbuja 480 (28) · frases para globos burbuja 390 (30)
  - globos burbuja san valentín 390 (15) · tamaño de globos burbuja 320 (22) · medidas de globos burbuja 320 (28) · como inflar globos burbuja 210 (32)
- Arcos: como hacer arcos de globos 2.400 (32) · arcos de globos sencillo 2.400 (25) · medios arcos de globos 880 (29) · sin estructura 390 (32) · como armar arcos de globos 260 (32) · sin base 260 (31) · fácil y rápido 170 (32).
- Guirnaldas: como hacer una guirnalda de globos 880 (31) · como hacer guirnalda de globos 480 (31) · como hacer una guirnalda de globos sin base 110 (6).
- Globoflexia: que es la globoflexia 480 (28) · globoflexia que es 320 (25) · globoflexia fácil 210 (32) · globoflexia paso a paso 110 (5).
- Flores: flores con globos como hacer 590 (32) · flores con globos redondos 210 (32) · flores con globos largos 170 (32) · arco de flores con globos 880 (30).
- Helio:
  - inflar globos con helio 880 (15) · donde inflar globos con helio 590 (29) · como inflar globos con helio 210 (29)
  - cuanto cuesta inflar globos con helio 210 (19, **CPC 1,29**, el CPC más alto que encontré) · precio de globos con helio 720 (11)
- Centros de mesa: con globos y dulces 720 (25) · faciles 320 (32) · sencillos 320 (31) · como hacer centros de mesa con globos 90 (9).
- Ocasiones: decoracion con globos navideños 1.900 (28) · para bodas 1.300 (22) · para la virgen de guadalupe 1.300 (30) · de halloween 720 (26) · en casa 480 (32) · para graduacion 480 (25) · para primera comunión 390 (22).

**CO**
- como hacer arcos de globos 1.000 (26) · qué es globoflexia 210 (16) · globoflexia que es 170 (20) · flores globoflexia 110 (20)
- decoracion con globos en casa 260 (26) · decoracion con globos como hacer 210 (26) · decoracion con globos de halloween 320 (16) · decoracion con globos navideños 260 (**5**)
- decoracion con bombas 1.000 (25; "bombas" es el sinónimo local) · decoracion con bombas para cumpleaños 170 (19)
- globos burbuja decorados 480 (25)

**Negocio y precios.** Ubersuggest casi no tiene volumen para estas consultas:
- Sin datos: "cuanto cobrar por decoracion con globos" (0 en MX y CO), "cuanto cobrar por un arco de globos", "precio decoracion con globos", "precios decoracion globos" en CO y "cuanto cuesta un curso de globoflexia".
- Con volumen bajo: "nombres para negocio de globos" MX 140 (SD 20), "precio arco de globos" MX 140 (SD 35), "como emprender / iniciar / empezar un negocio de globos" 10 cada una, "emprender con globos" 10.
- **Conclusión:** con Ubersuggest no se puede justificar por volumen un artículo de "cuánto cobrar". Su valor tendría que salir de otro canal (Discover, conversión) o de otra fuente, como Google Ads Keyword Planner o DataForSEO.

## 3. Content ideas (estVisits y shares, útil para Discover)

**Por visitas estimadas, con locId MX:**
- Páginas de tienda y colecciones:
  - fantasiasmiguel.com "Globos Burbuja Transparentes para Fiestas": 9.287
  - theconfettiparty.com "Guirnalda de Globos a domicilio": 2.162
  - ponchycaprico.com "Globos Burbuja Personalizados a Domicilio en CDMX": 1.176
  - mercadolibre "Globos Burbuja De Graduacion": 773
- Contenido tutorial:
  - youtube.com "APRENDE a DECORAR con GLOBOS (serie completa)": 681
  - edutin.com "Curso de globoflexia [Gratis y Certificado]": 229 (108 dominios de referencia)
  - es.wikihow.com "Cómo hacer un arco de globos": 168 (33 shares)
  - giramon.net "Centros de mesa con globos": 115
  - posesnewborn.com "Cómo crear un precioso arco de globos": 102 (DA 15)
  - ruskus-patruskus.com "Cómo hacer figuras con globos [GLOBOFLEXIA FÁCIL]": 98

**Por shares totales (seed "globos" y "decorar con globos", MX).** Casi todos los shares vienen de Pinterest:

| Título | Dominio | Shares | Pinterest | Visitas est. |
|---|---|---|---|---|
| Decoración de Bodas con Globos: 32 Propuestas Originales | bodasyweddings.com | 22.183 | 21.649 | 33 |
| 15 Ideas sencillas para decorar con globos en Halloween | recreoviral.com | 18.637 | 18.544 | 0 |
| DIY para navidad con niños. Muñeco de nieve con globos | recicladocreativo.com | 17.664 | 17.634 | 2 |
| Decoraciones con globos para Halloween | kena.com | 17.382 | 17.368 | 1 |
| Cómo hacer una guirnalda de globos vídeo tutorial | sracricket.com | 1.052 | 1.025 | 6 |
| Globos calavera para el Día de los Muertos | happythought.co.uk | 678 | 678 | 2 |
| 7 formas de decorar globos para una fiesta | servicolor.com | 103 | 67 | 1 |

Lectura para Discover: los ángulos que se comparten son **listicles visuales y estacionales** (Halloween, Navidad, bodas, Día de Muertos) con muchas fotos. Esos mismos artículos tienen casi cero visitas orgánicas estimadas: rinden en social y Discover, no en búsqueda. El contenido tutorial "cómo hacer" es el que capta búsqueda.

Limitaciones de la herramienta:
- Sin `locId`, el orden `-estVisits` no se aplicó: las cuentas main y rodrigo devolvieron la misma lista.
- En este nicho casi todos los resultados tienen 0 shares.

## 4. SERPs informacionales (serp_analysis, 8 SERPs)

Keywords analizadas: como hacer arcos de globos (MX y CO), globoflexia (MX), globos burbuja (MX), centros de mesa con globos (MX), como hacer una guirnalda de globos (MX), como hacer flores con globos (MX) y decoracion con globos (CO). Fecha de cada SERP según la API: entre 2026-08-10 y 2026-09-22.

- **De 160 resultados orgánicos, 105 (66 %) son plataformas:** YouTube, Facebook (vídeos de Gustavo gg), Instagram, TikTok (@tornaglobos), Pinterest y Reddit. Solo 55 son sitios web.
- **Features:**
  - short_videos e images en 8 de 8 SERPs.
  - People Also Ask en 7 de 8 (todas menos "centros de mesa").
  - AI Overview en 2 de 8 (globoflexia y globos burbuja).
  - Local pack en 1 ("decoracion con globos" CO).
  - popular_products en 1 ("globos burbuja").
- **Webs con texto que rankean, y con qué autoridad** (clics estimados por la API):
  - Autoridad baja:
    - mossieur-ballon.com (DA 18): pos 5 en "globoflexia" MX, 96 clics
    - ruskus-patruskus.com (DA 18): pos 9, 18 clics
    - posesnewborn.com (DA 15): pos 14 en "como hacer arcos de globos" MX
    - comprarhelio.com (DA 36): pos 11 en "globoflexia" y pos 14 en "guirnalda"
    - giramon.net (DA 22): pos 10 en "centros de mesa"
    - balunglobos.com (DA 6): pos 6 en "centros de mesa", 344 clics
    - narosasp.com (DA 1): pos 11 en "guirnalda"
  - Autoridad alta: es.wikihow.com (DA 93), es.wikipedia.org (DA 96, 1.075 clics en "globoflexia" MX), lanacion.com.ar e infobae.com (DA 92–93).
- **"globos burbuja" MX tiene intención de compra:** MercadoLibre (6.941 clics), Pinterest (1.519) y Amazon, además de tiendas. Un artículo informacional ahí tiene que atacar las variantes "tamaños / medidas / cómo inflar / frases / graduación", no la cabeza.
- **"como hacer flores con globos" MX** muestra de la posición 13 en adelante resultados ajenos al tema (recetas). Hay poca oferta de calidad, así que es una oportunidad clara.
- **Inferencia:** la competencia de texto es débil. Para competir con el formato vídeo hacen falta artículos con **paso a paso con fotos propias, vídeo embebido o corto, y FAQ que respondan a las PAA**.

## 5. Competidores de contenido

| Dominio | Mercado consultado | DA | Keywords org. | Tráfico est. (último mes) | Backlinks / RD |
|---|---|---|---|---|---|
| comprarhelio.com (tienda con blog, ES) | ES | 36 | 560 | 10.902 (ago-2026) | 5.518 / 719 |
| mossieur-ballon.com (tutoriales de globoflexia) | MX | 18 | 1.621 | 48.512 (ago-2026)* | 3.063 / 626 |
| balloonsbyluzpaz.com | CO (ver nota) | 14 | 114 | 210 (ago-2026) | 5.845 / 810 |
| academia.balloonsbyluzpaz.com | CO | 14 | 48 | 98 (ago-2026) | (mismos que el dominio raíz) |
| superglobos.com (curso MX) | MX | 16 | 58 | 77 (ago-2026) | 823 / 191 |

\* mossieur-ballon.com: la cifra de 48.512 es la que da `domain_overview` para MX, pero sus top pages en español para MX suman unas 880 visitas. No pude reconciliar la diferencia; puede que incluya tráfico que no es en español. Tomar con cautela.

**comprarhelio.com.** Casi todo su tráfico viene de categorías de tienda: /globos/ 5.540 y home 2.235. Aun así, su **blog rankea en MX con DA 36**:
- /blog/como-inflar-globos-sin-helio-y-que-floten: pos 5 en "globos que flotan" (480, SD 28, 242 visitas est.) y en "como inflar globos sin helio" (320).
- /blog/que-es-la-globoflexia: pos 7 en "globoflexia que es" (320) y pos 11 en "globoflexia" (2.900).
- /blog/como-hacer-una-guirnalda-con-globos: pos 14 en "como hacer una guirnalda de globos" (880).
- /blog/como-hacer-columnas-de-globos: pos 10 en "torres de globos sencillas" (170).
- En ES, /blog/como-llenar-globos-de-helio tiene 299 visitas y 100 backlinks.

Son exactamente los temas del cluster que se propone.

**mossieur-ballon.com.** Su formato ganador es una serie de "iniciación a la globoflexia" con **una figura por URL**:
- perrito: 461 visitas; rankea "como hacer un perro de globo" (1.600, pos 6), "perros de globo" (1.900, pos 8) y "globo de perrito" (320, pos 4)
- hub /es/tutoriales: 209 visitas; "globoflexia" pos 5
- mariposa: 125 · espada: 56 · corazón: 16
- nudos: "nudo de globo" (2.400, pos 16)

**balloonsbyluzpaz.com.**
- `domain_top_countries` solo devuelve tráfico en en-US (Miami): 210 en ago-2026. Coincide con la cifra de la consulta con locId CO, así que esa cifra no es tráfico colombiano.
- Su serie histórica cae de 22.319 (sep-2024) a 210 (ago-2026).
- Sus keywords actuales son de marca y de servicios en Miami ("balloons by luz paz", "balloon decorations miami"). **No tiene motor de contenido en español.**
- academia.balloonsbyluzpaz.com cae de 4.421 (oct-2024) a 98 (ago-2026). Su única keyword relevante es "curso de decoracion con globos" CO en pos 8 (260).
- `domain_top_pages` con locId CO devolvió `noData`.

**superglobos.com (MX).** Pasa de 1.231 (ene-2025) a 77 (ago-2026). Su blog:
- "¿Cuáles son los mejores globos para decorar?": 30 visitas; "mejores marcas de globos" pos 6 (170)
- "¿Cuánto tiempo duran los globos inflados?": 15 visitas; "cuanto dura un globo con helio" pos 18 (320)

Conclusión sobre competidores: **ningún competidor en español tiene un cluster informacional fuerte y actual en LatAm.** Los cursos (Luz Paz, Superglobos) han perdido casi todo su tráfico orgánico. El texto que rankea es de tiendas (comprarhelio) o de un sitio de tutoriales (mossieur-ballon), ambos con DA bajo o medio.

## 6. Proyecto Ubersuggest de cursodeglobosonline.com (rank tracking)

**Configuración del proyecto:**
- Cuenta main, project_id `78195c4e…8365a07`, creado el 2022-12-28 y activo.
- Actualización semanal. Último dato: 2026-09-18. Próximo: 2026-09-25.
- 8 ubicaciones (CO, MX, US, PE, EC, ES, AR, CL).
- Cupo de keywords y de competidores lleno: **300/300** keywords×ubicación y **15/15** competidores.
- Competidores configurados: manosexpresivasmanualidades.com, superglobos.com, globomania.com.mx, globoscolombia.co, lacentraldelglobo.com, balloonsbyluzpaz.com, sempertex.com, globomagic.com.

**Posiciones en desktop**, comparando 2026-08-28 con 2026-09-18. Consulté CO, MX y US. PE, EC, ES, AR y CL están configurados, pero no los consulté en esta pasada.

| País | Keywords rastreadas | Top 10 | Top 100 (fuera del top 10) | Sin rankear | Movimiento |
|---|---|---|---|---|---|
| CO | 56 | 1 | 1 | 54 | 2 suben / 7 bajan |
| MX | 67 | 0 | 2 | 65 | 1 sube / 9 bajan |
| US | 27 | 0 | 4 | 23 | 2 suben / 3 bajan |

Keywords que rankean el 2026-09-18:
- CO:
  - "curso de globoflexia" (90): **pos 9** con /co/medellin/; antes pos 18 con /co/barranquilla/
  - "curso de decoracion con globos" (260): pos 16 con /co/medellin/; antes 23 con /co/barranquilla/
- MX:
  - "curso de globos burbuja" (90): 25 → 15 con /mx/curso-de-globos-burbuja/
  - "curso decoracion de globos" (590): 40 → 43, pero ahora con /mx/curso-de-globoflexia/
- US:
  - "curso de globos" (70): 42 → 14 con /us/
  - "curso de globos cerca de mi" (70): 29 → 24 con /us/losangeles/
  - "curso de decoracion con globos" (110): pos 47
  - "cursos de decoracion con globos" (140): 46 → 56

Salieron del top 100 entre el 28-ago y el 18-sep:
- CO: "curso de globos en el sena" (era 11), "curso de globos" (11), "cursos de decoracion con globos" (17, con la URL legacy /medellin/), "curso decoracion de globos" (18) y 3 más.
- MX: "curso de globoflexia" (era 21), "curso de globos" (32), "curso de decoracion con globos" (47) y 5 más.

Señales:
1. **Ninguna keyword informacional rastreada rankea** en CO, MX ni US. Entre ellas: globoflexia, como hacer arco de globos, que es globoflexia, flores con globos, bouquet de globos sencillos, decoracion con globos navideños y halloween. Es el hueco que tiene que cubrir el blog.
2. **Posible canibalización entre páginas de ciudad y de curso** (inferencia): para la misma keyword genérica la URL que rankea rota entre /co/barranquilla/, /co/medellin/ y la legacy /medellin/ en CO, y entre /mx/, /mx/cursos/decoracion-con-globos/ y /mx/curso-de-globoflexia/ en MX.
3. **Hueco en la configuración del proyecto:** el cupo de 300 keywords está lleno, así que para rastrear las keywords del blog habrá que liberar espacio.

Nota sobre el campo `si` del proyecto: es un código de intención. El mapeo que uso (1 = informacional, 2 = navegacional, 3 = comercial, 4 = transaccional) es **inferido**, porque cuadra con las etiquetas de keyword_overview. La API no lo documenta.

## 7. Propuesta de cluster (≥ 20 artículos) sin canibalizar las money pages

Criterio: atacar "cómo hacer / qué es / ideas / tamaños / precios", enlazar al curso de cada fila y **no** usar como keyword principal "curso de X", "cursos de decoración con globos" ni "globoflexia cursos", porque esas pertenecen a las money pages.

Mercado de referencia: MX, salvo que se indique otro. "Proyecto" significa que el dato sale de project_position_info. El resto sale de keyword_overview, match_keywords o domain_keywords.

| # | Artículo (ángulo) | Keyword principal (vol, SD) | Secundarias con dato | Enlaza a |
|---|---|---|---|---|
| 1 | Qué es la globoflexia: historia, tipos de globos y cómo empezar | que es la globoflexia 480 (28) | globoflexia que es 320 (25); CO: qué es globoflexia 210 (16); globoflexia 2.900 MX / 1.000 CO / 1.300 ES | curso-de-globoflexia |
| 2 | Cómo hacer un perrito con un globo | como hacer un perro de globo 1.600 (32)ª | perros de globo 1.900 (22)ª; globo de perrito 320 (22)ª | curso-de-globoflexia |
| 3 | Figuras de globoflexia fáciles: espada, flor, mariposa y corazón | globoflexia fácil 210 (32) | como hacer una espada de globo 480 (32)ª; mariposa con globos 320 (30)ª; corazón de globo 320 (31)ª | curso-de-globoflexia |
| 4 | Nudos básicos de globoflexia | nudo de globo 2.400 (29)ª | globoflexia paso a paso 110 (5) | curso-de-globoflexia |
| 5 | Cómo hacer un arco de globos sin estructura, paso a paso | como hacer arcos de globos 2.400 (32); CO 1.000 (26) | sin estructura 390 (32); sin base 260 (31); como armar 260 (32); fácil y rápido 170 (32) | cursos/decoracion-con-globos |
| 6 | Medio arco de globos: ideas y cuántos globos lleva | medios arcos de globos 880 (29) | arcos de globos sencillo 2.400 (25) | cursos/decoracion-con-globos |
| 7 | Cómo hacer una guirnalda de globos orgánica | como hacer una guirnalda de globos 880 (31) | como hacer guirnalda de globos 480 (31); sin base 110 (6); guirnalda de globos 5.400 (22) | cursos/decoracion-con-globos |
| 8 | Bases y estructuras para arcos: tipos y cuál elegir | base para arcos de globos 720 (22, Commercial) | bases para arcos 590 (22); estructura para arcos 210 (36) | cursos/decoracion-con-globos |
| 9 | Columnas de globos: cómo hacerlas | columnas de globos 1.000 (22) (proyecto) | como hacer columna de globos 110 (10) (proyecto); torres de globos sencillas 170 (30)ᵇ | cursos/decoracion-con-globos |
| 10 | Globos burbuja: qué son, tamaños y medidas | tamaño de globos burbuja 320 (22) | medidas 320 (28); 24 pulgadas 590 (17); globos burbuja 18.100 (22) | curso-de-globos-burbuja |
| 11 | Cómo inflar y decorar globos burbuja (confeti, pintura, vinilos) | globos burbuja con pintura 720 (31) | letras para globos burbuja 480 (28); como inflar globos burbuja 210 (32); ideas para decorar 170 (31) | curso-de-globos-burbuja |
| 12 | Globos burbuja para graduación: ideas | globos burbuja graduacion 3.600 (30) | graduación 2.900 (26); de graduacion 1.600 (11) | curso-de-globos-burbuja |
| 13 | Frases para globos burbuja: cumpleaños, San Valentín y graduación | frases para globos burbuja 390 (30) | san valentín 390 (15); 14 de febrero 320 (26) | curso-de-globos-burbuja |
| 14 | Centros de mesa con globos burbuja | centro de mesa con globos burbuja 1.300 (30) | centros de mesa globos burbuja 390 (30) | curso-de-globos-burbuja |
| 15 | Cómo hacer un bouquet de globos sencillo | como hacer un bouquet de globos 170 (33) | bouquet de globos sencillo 720 (32); para hombres 260 (30); mini bouquet 260 (29); con helio / sin helio 110 cada una | curso-de-bouquets-de-globos |
| 16 | Cómo hacer flores con globos redondos y largos | flores con globos como hacer 590 (32) | redondos 210 (32); largos 170 (32); CO: como hacer flores con globos 170 (26) (proyecto) | curso-de-flores-con-globos |
| 17 | Arco de flores con globos e ideas de decoración con globos y flores | arco de flores con globos 880 (30) | decoracion con globos y flores 390 (26); CO 210 (26) | curso-de-flores-con-globos |
| 18 | Centros de mesa con globos: ideas fáciles | centros de mesa con globos 6.600 (22) | con globos y dulces 720 (25); faciles 320 (32); como hacer 90 (9); AR 1.900 (25) | cursos/decoracion-con-globos |
| 19 | Cómo inflar globos con helio y cuánto duran | inflar globos con helio 880 (15) | como inflar 210 (29); cuanto dura un globo con helio 320 (12)ᶜ | cursos/decoracion-con-globos |
| 20 | Cómo inflar globos sin helio y que floten | globos que flotan 480 (28)ᵇ | como inflar globos sin helio 320 (27)ᵇ | cursos/decoracion-con-globos |
| 21 | Decoración con globos para Halloween (Discover) | decoracion con globos de halloween 720 (26); CO 320 (16) | ángulo con 18.637 shares (recreoviral) | curso-de-globoflexia / burbuja |
| 22 | Decoración con globos navideños (Discover) | decoracion con globos navideños 1.900 (28); CO 260 (5) | de navidad 880 (30); DIY navidad 17.664 shares | cursos/decoracion-con-globos |
| 23 | Decoración con globos para la Virgen de Guadalupe (MX, 12-dic) | decoracion con globos para la virgen de guadalupe 1.300 (30) | arcos de globos para la virgen 170 (6) | cursos/decoracion-con-globos |
| 24 | Decoración con globos para bodas: ideas (Discover y Pinterest) | decoracion con globos para bodas 1.300 (22) | para boda 1.000 (26); ángulo con 22.183 shares | cursos/decoracion-con-globos |
| 25 | Decoración con globos en casa, sencilla | decoracion con globos en casa 480 (32); CO 260 (26) | decoracion con globos como hacer 320 (32) | cursos/decoracion-con-globos |
| 26 | Nombres para negocio de globos (y cómo empezar) | nombres para negocio de globos 140 (20) | como emprender / iniciar un negocio de globos 10 cada una | cursos/emprendimiento |
| 27 | Cuánto cobrar por una decoración con globos | **sin volumen en Ubersuggest** | cuanto cuesta inflar globos con helio 210 (19, CPC 1,29); precio arco de globos 140 (35); precio de globos con helio 720 (11) | cursos/emprendimiento |

ª Keyword tomada de `domain_overview` de mossieur-ballon.com en MX (volumen y SD que Ubersuggest da para esa keyword en MX).
ᵇ Keyword tomada de `domain_keywords` de comprarhelio.com en MX.
ᶜ Dato del estudio del 2026-08-06, vía superglobos.com MX. En este run superglobos la muestra en pos 18 con vol 320 y SD 12.

**Calendario inferido de las series** (verificar con Keyword Planner):
- Halloween y Navidad: publicar ya (sep–oct).
- Virgen de Guadalupe: antes de diciembre.
- Globos burbuja para graduación: publicar en abril–mayo, antes del pico de jun–jul.
- San Valentín: publicar en enero.

## 8. Qué no se pudo obtener o conviene validar

- Volumen de "cuánto cobrar / precios / negocio": Ubersuggest devuelve 0 o nada. Validar con Google Ads o DataForSEO.
- Posiciones del proyecto en PE, EC, ES, AR y CL: no se consultaron en esta pasada. Están configuradas y se pueden pedir con `project_position_info`.
- Tráfico de balloonsbyluzpaz.com en CO: la API no devuelve keywords ni top pages para CO. Solo hay datos para en-US.
- Tráfico de mossieur-ballon.com en MX: inconsistencia entre el total (48.512) y la suma de sus top pages (~880).
- `content_ideas` sin `locId` ignora el parámetro de orden.
