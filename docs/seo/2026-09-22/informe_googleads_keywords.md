# Keyword Planner (Google Ads API) — cursodeglobosonline.com

Fecha: 2026-09-22 · Fuente única: Google Ads API `KeywordPlanIdeaService.GenerateKeywordIdeas` · cuenta 3289698286 (Sably Ads, moneda COP, zona America/Bogota) · idioma español (1003) · red GOOGLE_SEARCH · 104 llamadas (13 grupos de ≤10 semillas × 8 países, 0 errores).

Ventana de datos: **sep-2025 → ago-2026** (12 meses de `monthly_search_volumes`). `vol` = `avg_monthly_searches` (promedio 12 meses, redondeado por Google).

Ideas únicas devueltas (normalizadas sin tilde): **14.922** → relevantes: **13.299** → grupos finales tras fusionar variantes: **6.690**. Excluidas por regla: fuera-de-nicho 600, retail/compra 476, retail/precio-producto 279, aerostatico 144, cantoya/papel 47, agua/juegos 35, otros sentidos 19, texto/dialogo/tipografia 7, bomba-ambigua 6, ingles 5, terraqueo/mapa 3, navegacional/concatenado 2.

## 0. Hallazgos clave

- **La demanda de 'curso' es pequeña frente a la informacional.** Mejores transaccionales: 'curso decoracion de eventos' 1.550 (AR 720), 'curso de decoracion con globos' 1.280 (MX 590, CO 210), 'curso de globoflexia' 700 (MX 480), 'curso de globos burbuja' 160; 'curso de bouquet de globos' 80 (piso 10×8) y 'curso de flores con globos' 0.
- **Universo informacional grande:** 'arco de globos' 26.200, 'decoracion con globos' 23.320, 'bouquet de globos' 11.580 (CO 4.400 = MX 4.400), 'centros de mesa con globos' 8.200, 'guirnalda de globos' 7.410, 'globoflexia' 7.360, 'como hacer un arco de globos' 6.740, 'flores de globos' 6.010.
- **México concentra ~39% del volumen del nicho**; CO, PE y AR ~10-12% cada uno.
- **Colombia usa 'bombas':** 'decoracion con bombas' CO 1.000, 'arco de bombas' CO 880 — casi nulo en los demás países.
- **Negocio/precios casi sin volumen:** 'cuanto cobrar por decoracion con globos' 0; lo más alto es 'arco de globos precio' 240. Son artículos para conversión/Discover, no para captar búsquedas.
- **Picos estacionales:** Navidad nov-dic (dic x7.0), Halloween oct (x8.9), Graduación (MX jun-jul; CO/CL nov; PE/AR dic; EC feb; US may; ES jun), Día de la Madre may (AR oct, ES abr), Día del Padre jun (ES mar), San Valentín feb (CO 'amor y amistad' sep), Virgen de Guadalupe dic (MX). Intención 'curso' pico ene (x1.21), valle dic.

## 1. Tamaño relativo por país (suma de volúmenes de los grupos del núcleo 'globos')

| País | Σ búsquedas/mes | % |
|---|---:|---:|
| MX | 518.410 | 39.3% |
| CO | 154.630 | 11.7% |
| PE | 133.740 | 10.1% |
| AR | 131.050 | 9.9% |
| US | 106.560 | 8.1% |
| ES | 102.210 | 7.7% |
| CL | 95.450 | 7.2% |
| EC | 77.410 | 5.9% |

> Suma de grupos (puede solapar por agrupación de Google); úsese como tamaño **relativo**, no absoluto.

## 2. Distribución por intención (clasificación heurística propia)

| Intención | grupos | Σ vol_total |
|---|---:|---:|
| producto | 1.962 | 572.560 |
| head_tecnica | 1.935 | 373.580 |
| informacional_ideas | 1.112 | 216.470 |
| informacional_howto | 1.448 | 164.510 |
| transaccional_curso | 138 | 13.830 |
| servicio_local | 48 | 5.830 |
| negocio_precios | 47 | 3.110 |

## 3. Top 60 keywords informacionales (blog)

Incluye `informacional_howto`, `informacional_ideas`, `head_tecnica` (término de técnica sin 'curso'; SERP no verificada en este estudio) y `negocio_precios`. **Ninguna contiene 'curso/clases'**, así que no compiten con las money pages. 'Enlace sugerido' = heurística por cluster.

| # | keyword (etiqueta) | vol total | top países | comp | intención | cluster | pico | variantes | enlace sugerido |
|---:|---|---:|---|---|---|---|---|---:|---|
| 1 | arco de globos | 26.200 | MX 9.900 · PE 4.400 · CL 2.900 | HIGH | head_tecnica | arcos_guirnaldas | estable | 17 | `/{cc}/cursos/decoracion-con-globos/` |
| 2 | decoracion con globos | 23.320 | MX 12.100 · PE 2.900 · CO 2.400 | MEDIUM | head_tecnica | decoracion_general | estable | 13 | `/{cc}/cursos/decoracion-con-globos/` |
| 3 | bouquet de globos | 11.580 | CO 4.400 · MX 4.400 · PE 720 | MEDIUM | head_tecnica | bouquets_arreglos | estable | 7 | `/{cc}/curso-de-bouquets-de-globos/` |
| 4 | arreglos de globos | 8.410 | MX 5.400 · EC 1.000 · PE 720 | HIGH | head_tecnica | bouquets_arreglos | estable | 10 | `/{cc}/curso-de-bouquets-de-globos/` |
| 5 | centros de mesa con globos | 8.200 | MX 4.400 · AR 1.600 · CO 880 | HIGH | head_tecnica | bouquets_arreglos | estable | 17 | `/{cc}/curso-de-bouquets-de-globos/` |
| 6 | guirnalda de globos | 7.410 | MX 5.400 · AR 590 · US 480 | HIGH | head_tecnica | arcos_guirnaldas | estable | 9 | `/{cc}/cursos/decoracion-con-globos/` |
| 7 | globoflexia | 7.360 | MX 2.900 · ES 1.300 · CO 1.000 | LOW | head_tecnica | globoflexia | estable | 2 | `/{cc}/curso-de-globoflexia/` |
| 8 | como hacer un arco de globos | 6.740 | MX 1.900 · CO 1.000 · AR 880 | MEDIUM | informacional_howto | arcos_guirnaldas | oct-25 (MX, x1.4) | 20 | `/{cc}/cursos/decoracion-con-globos/` |
| 9 | flores de globos | 6.010 | MX 2.900 · CO 590 · PE 590 | HIGH | head_tecnica | flores_con_globos | mar-26 (MX, x2.1) | 13 | `/{cc}/curso-de-flores-con-globos/` |
| 10 | arco de globos sencillo | 4.610 | MX 1.900 · CO 880 · PE 390 | MEDIUM | informacional_ideas | arcos_guirnaldas | estable | 8 | `/{cc}/cursos/decoracion-con-globos/` |
| 11 | globos perrito | 4.530 | MX 1.900 · ES 1.000 · AR 480 | MEDIUM | head_tecnica | globoflexia | estable | 11 | `/{cc}/curso-de-globoflexia/` |
| 12 | decoracion para boda civil sencilla en casa con globos | 4.490 | MX 1.900 · CO 720 · AR 590 | LOW | informacional_ideas | ocasiones | estable | 1 | `/{cc}/cursos/eventos/` |
| 13 | globos burbuja decorados | 4.380 | MX 3.600 · CO 480 · PE 90 | MEDIUM | head_tecnica | globo_burbuja | jun-26 (MX, x2.2) | 3 | `/{cc}/curso-de-globos-burbuja/` |
| 14 | arreglos de globos para cumpleaños | 3.900 | MX 1.600 · US 590 · PE 480 | HIGH | informacional_ideas | bouquets_arreglos | estable | 21 | `/{cc}/curso-de-bouquets-de-globos/` |
| 15 | decoración de globos sencillos | 3.640 | MX 1.600 · CO 720 · PE 480 | MEDIUM | informacional_ideas | decoracion_general | estable | 3 | `/{cc}/cursos/decoracion-con-globos/` |
| 16 | decoracion globos navidad | 3.620 | MX 1.900 · PE 590 · CO 390 | MEDIUM | informacional_ideas | ocasiones | dic-25 (MX, x7.6) | 41 | `/{cc}/cursos/eventos/` |
| 17 | decoracion con globos para cumpleaños | 3.240 | MX 1.300 · PE 480 · AR 480 | MEDIUM | informacional_ideas | ocasiones | estable | 27 | `/{cc}/cursos/eventos/` |
| 18 | tamaños de globos | 3.200 | MX 1.900 · CO 480 · PE 320 | MEDIUM | informacional_howto | tipos_marcas_materiales | oct-25 (MX, x2.1) | 6 | `/{cc}/cursos/decoracion-con-globos/` |
| 19 | sencillas decoracion de globos para matrimonio civil en casa | 2.790 | MX 1.600 · CO 480 · AR 210 | LOW | informacional_ideas | ocasiones | estable | 1 | `/{cc}/cursos/eventos/` |
| 20 | como decorar con globos en la pared | 2.710 | MX 1.000 · CO 390 · AR 390 | LOW | informacional_howto | arcos_guirnaldas | sep-25 (MX, x1.5) | 5 | `/{cc}/cursos/decoracion-con-globos/` |
| 21 | cumpleaños decoracion sencilla con globos | 2.660 | MX 1.000 · CO 720 · PE 320 | MEDIUM | informacional_ideas | ocasiones | estable | 10 | `/{cc}/cursos/eventos/` |
| 22 | adornos con globos | 2.590 | MX 1.900 · PE 210 · CL 110 | MEDIUM | head_tecnica | decoracion_general | estable | 3 | `/{cc}/cursos/decoracion-con-globos/` |
| 23 | globos decorativos | 2.550 | MX 880 · PE 480 · AR 320 | HIGH | head_tecnica | decoracion_general | estable | 1 | `/{cc}/cursos/decoracion-con-globos/` |
| 24 | columnas de globos | 2.500 | MX 1.000 · AR 390 · ES 320 | MEDIUM | head_tecnica | arcos_guirnaldas | estable | 5 | `/{cc}/cursos/decoracion-con-globos/` |
| 25 | decoracion con globos para mujer | 2.300 | MX 880 · PE 590 · CO 390 | MEDIUM | informacional_ideas | ocasiones | may-26 (MX, x1.5) | 10 | `/{cc}/cursos/eventos/` |
| 26 | arreglos de graduación de globos | 2.270 | MX 1.900 · EC 140 · US 90 | LOW | informacional_ideas | bouquets_arreglos | jun-26 (MX, x5.1) | 20 | `/{cc}/curso-de-bouquets-de-globos/` |
| 27 | figuras con globos | 2.260 | MX 1.000 · CO 320 · ES 320 | LOW | head_tecnica | globoflexia | abr-26 (MX, x1.4) | 9 | `/{cc}/curso-de-globoflexia/` |
| 28 | tipos de globos | 2.250 | MX 1.000 · PE 480 · CO 260 | MEDIUM | informacional_howto | tipos_marcas_materiales | oct-25 (MX, x1.4) | 4 | `/{cc}/cursos/decoracion-con-globos/` |
| 29 | decoracion de techo con telas y globos | 2.240 | MX 1.600 · CO 170 · AR 170 | LOW | head_tecnica | arcos_guirnaldas | estable | 1 | `/{cc}/cursos/decoracion-con-globos/` |
| 30 | arco de globos para cumpleaños | 2.150 | PE 390 · CL 390 · AR 390 | HIGH | informacional_ideas | arcos_guirnaldas | sep-25 (PE, x1.5) | 10 | `/{cc}/cursos/decoracion-con-globos/` |
| 31 | medio arco de globos sencillo | 2.120 | CO 590 · MX 590 · AR 320 | LOW | informacional_ideas | arcos_guirnaldas | oct-25 (CO, x1.5) | 2 | `/{cc}/cursos/decoracion-con-globos/` |
| 32 | decoracion navideña con globos para mesa | 2.080 | MX 880 · PE 390 · CO 320 | LOW | informacional_ideas | ocasiones | dic-25 (MX, x7.5) | 1 | `/{cc}/cursos/eventos/` |
| 33 | decoracion con globos rosa y dorado | 2.050 | MX 880 · CO 480 · PE 260 | MEDIUM | head_tecnica | tipos_marcas_materiales | estable | 11 | `/{cc}/cursos/decoracion-con-globos/` |
| 34 | decoración con globos sencilla | 1.980 | MX 880 · CO 320 · ES 320 | MEDIUM | informacional_ideas | decoracion_general | estable | 15 | `/{cc}/cursos/decoracion-con-globos/` |
| 35 | espada de globo | 1.930 | MX 720 · CL 390 · AR 210 | LOW | head_tecnica | globoflexia | estable | 5 | `/{cc}/curso-de-globoflexia/` |
| 36 | decoracion fiesta mexicana con globos | 1.920 | MX 1.600 · CO 110 · US 110 | HIGH | informacional_ideas | ocasiones | sep-25 (MX, x6.0) | 6 | `/{cc}/cursos/eventos/` |
| 37 | globos decorar | 1.920 | MX 1.300 · AR 210 · PE 140 | HIGH | head_tecnica | decoracion_general | estable | 4 | `/{cc}/cursos/decoracion-con-globos/` |
| 38 | sencilla decoracion con cortinas metalizadas y globos | 1.920 | MX 720 · CO 390 · AR 390 | LOW | informacional_ideas | arcos_guirnaldas | estable | 1 | `/{cc}/cursos/decoracion-con-globos/` |
| 39 | bouquet de globos sencillo | 1.910 | CO 880 · MX 590 · PE 90 | LOW | informacional_ideas | bouquets_arreglos | sep-25 (CO, x1.9) | 2 | `/{cc}/curso-de-bouquets-de-globos/` |
| 40 | como hacer un arco de globos sencillo paso a paso | 1.910 | MX 590 · CO 390 · AR 320 | LOW | informacional_howto | arcos_guirnaldas | jul-26 (MX, x1.6) | 1 | `/{cc}/cursos/decoracion-con-globos/` |
| 41 | decoracion con globos para hombre | 1.840 | MX 720 · PE 390 · CO 320 | MEDIUM | informacional_ideas | ocasiones | estable | 19 | `/{cc}/cursos/eventos/` |
| 42 | arco de globos para boda civil | 1.820 | MX 1.000 · CO 260 · PE 140 | LOW | informacional_ideas | arcos_guirnaldas | estable | 1 | `/{cc}/cursos/decoracion-con-globos/` |
| 43 | sencilla decoracion para confirmacion globos | 1.810 | MX 880 · AR 320 · CO 210 | LOW | informacional_ideas | decoracion_general | jun-26 (MX, x2.1) | 1 | `/{cc}/cursos/decoracion-con-globos/` |
| 44 | centro de mesa con globo burbuja | 1.780 | MX 1.300 · AR 320 · CO 50 | MEDIUM | head_tecnica | globo_burbuja | jul-26 (MX, x1.5) | 8 | `/{cc}/curso-de-globos-burbuja/` |
| 45 | decoración con globos para cumpleaños de hombres adultos | 1.780 | CO 590 · MX 390 · PE 320 | MEDIUM | informacional_ideas | ocasiones | sep-25 (CO, x1.6) | 1 | `/{cc}/cursos/eventos/` |
| 46 | fiesta decoracion con globos rojos y dorados | 1.770 | MX 720 · CO 390 · PE 210 | LOW | informacional_ideas | tipos_marcas_materiales | sep-25 (MX, x1.6) | 1 | `/{cc}/cursos/decoracion-con-globos/` |
| 47 | halloween con globos | 1.770 | MX 480 · AR 320 · ES 320 | HIGH | informacional_ideas | ocasiones | oct-25 (MX, x8.7) | 3 | `/{cc}/cursos/eventos/` |
| 48 | pared de globos | 1.770 | MX 880 · CO 170 · PE 170 | HIGH | head_tecnica | arcos_guirnaldas | estable | 3 | `/{cc}/cursos/decoracion-con-globos/` |
| 49 | decoracion con globos azul rey y dorado | 1.760 | MX 880 · CO 320 · PE 210 | LOW | head_tecnica | tipos_marcas_materiales | jun-26 (MX, x1.4) | 1 | `/{cc}/cursos/decoracion-con-globos/` |
| 50 | como inflar globo largo | 1.750 | MX 1.300 · CO 140 · US 90 | LOW | informacional_howto | globoflexia | jul-26 (MX, x1.9) | 2 | `/{cc}/curso-de-globoflexia/` |
| 51 | arco de globos para olimpiadas | 1.740 | PE 1.600 · EC 70 · MX 20 | LOW | informacional_ideas | arcos_guirnaldas | sep-25 (PE, x3.6) | 4 | `/{cc}/cursos/decoracion-con-globos/` |
| 52 | medio arco de globos | 1.740 | MX 590 · CO 320 · AR 260 | HIGH | head_tecnica | arcos_guirnaldas | estable | 10 | `/{cc}/cursos/decoracion-con-globos/` |
| 53 | globos en el techo | 1.710 | MX 590 · PE 260 · AR 260 | MEDIUM | head_tecnica | arcos_guirnaldas | estable | 7 | `/{cc}/cursos/decoracion-con-globos/` |
| 54 | sencillo centro de mesa con globos | 1.710 | MX 880 · AR 320 · CO 260 | MEDIUM | informacional_ideas | bouquets_arreglos | sep-25 (MX, x1.4) | 5 | `/{cc}/curso-de-bouquets-de-globos/` |
| 55 | figuras con globos largos | 1.680 | MX 590 · CO 320 · CL 320 | LOW | head_tecnica | globoflexia | jul-26 (MX, x1.6) | 4 | `/{cc}/curso-de-globoflexia/` |
| 56 | arco con flores de globos | 1.640 | MX 880 · CO 170 · PE 140 | HIGH | head_tecnica | flores_con_globos | may-26 (MX, x1.6) | 16 | `/{cc}/curso-de-flores-con-globos/` |
| 57 | decoracion con globos de halloween | 1.620 | MX 720 · CO 320 · PE 210 | MEDIUM | informacional_ideas | ocasiones | oct-25 (MX, x8.8) | 19 | `/{cc}/cursos/eventos/` |
| 58 | decoracion arco de globos | 1.600 | MX 590 · CO 260 · PE 260 | HIGH | head_tecnica | arcos_guirnaldas | estable | 15 | `/{cc}/cursos/decoracion-con-globos/` |
| 59 | globos decoracion de cumpleaños para mujer | 1.600 | CO 480 · PE 390 · MX 320 | LOW | informacional_ideas | ocasiones | sep-25 (CO, x2.2) | 15 | `/{cc}/cursos/eventos/` |
| 60 | globos adornados | 1.590 | MX 1.000 · PE 210 · CO 140 | MEDIUM | head_tecnica | decoracion_general | jul-26 (MX, x1.7) | 1 | `/{cc}/cursos/decoracion-con-globos/` |

## 4. Top 20 keywords transaccionales (curso)

| # | keyword | vol total | CO | MX | PE | EC | CL | AR | ES | US | comp | puja alta (COP) | pico |
|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---:|---|
| 1 | curso decoracion de eventos | 1.550 | 140 | 140 | 110 | 40 | 50 | 720 | 260 | 90 | HIGH | 4.516 | estable |
| 2 | curso de decoracion con globos | 1.280 | 210 | 590 | 110 | 30 | 50 | 110 | 90 | 90 | LOW | 1.113 | estable |
| 3 | curso de globoflexia | 700 | 90 | 480 | 20 | 10 | 30 | 30 | 30 | 10 | LOW | 740 | estable |
| 4 | curso de globos | 700 | 110 | 390 | 30 | 30 | 30 | 30 | 30 | 50 | LOW | 1.114 | estable |
| 5 | cursos de decoración para fiestas y eventos | 410 | 140 | 140 | 40 | 20 | 10 | 30 | 10 | 20 | LOW | 2.544 | ene-26 (CO, x1.6) |
| 6 | curso de globologia | 390 | 10 | 10 | 10 | 10 | 10 | 320 | 10 | 10 | MEDIUM | 998 | estable |
| 7 | curso de decoración con globos presencial | 270 | 30 | 90 | 20 | 10 | 20 | 40 | 30 | 30 | LOW | 799 | mar-26 (MX, x1.4) |
| 8 | cursos de decoración para fiestas y eventos gratis | 250 | 20 | 40 | 30 | 10 | 10 | 110 | 10 | 20 | MEDIUM | 778 | mar-26 (AR, x1.5) |
| 9 | clases de globos | 200 | 70 | 20 | 40 | 20 | 10 | 10 | 10 | 20 | LOW | 0 | sep-25 (CO, x1.6) |
| 10 | curso de decoracion de fiestas | 190 | 70 | 30 | 10 | 10 | 10 | 20 | 20 | 20 | LOW | 1.709 | estable |
| 11 | curso de ambientacion de eventos | 180 | 10 | 10 | 10 | 10 | 10 | 110 | 10 | 10 | HIGH | 4.499 | mar-26 (AR, x1.5) |
| 12 | curso de globos burbuja | 160 | 10 | 90 | 10 | 10 | 10 | 10 | 10 | 10 | LOW | 0 | jul-26 (MX, x2.3) |
| 13 | curso de decoración de eventos sena | 150 | 90 | 10 | 0 | 10 | 10 | 10 | 10 | 10 | LOW | 2.107 | sep-25 (CO, x1.6) |
| 14 | cursos de arreglos de globos | 150 | 10 | 70 | 10 | 20 | 10 | 10 | 10 | 10 | LOW | 1.204 | may-26 (MX, x1.6) |
| 15 | clases de decoracion de globos | 140 | 10 | 20 | 30 | 10 | 10 | 10 | 10 | 40 | LOW | 10.667 | estable |
| 16 | clases de globos para decorar | 140 | 20 | 40 | 20 | 10 | 10 | 10 | 10 | 20 | LOW | 0 | estable |
| 17 | cursos de decoración de eventos gratis | 130 | 10 | 10 | 10 | 10 | 10 | 20 | 50 | 10 | LOW | 1.431 | sep-25 (ES, x1.5) |
| 18 | curso de globos gratis | 120 | 20 | 40 | 10 | 10 | 10 | 10 | 10 | 10 | LOW | 0 | estable |
| 19 | curso de globos para principiantes | 120 | 10 | 50 | 10 | 10 | 10 | 10 | 10 | 10 | LOW | 0 | sep-25 (MX, x1.5) |
| 20 | curso de decoración de eventos presencial | 110 | 10 | 10 | 10 | 10 | 10 | 40 | 10 | 10 | HIGH | 4.495 | ene-26 (AR, x1.6) |

> Varias filas suman 80 = 10 en cada uno de los 8 países: 10 es el piso de Google (volumen muy bajo), no demanda real equivalente.

## 5. Negocio y precios (todas con vol_total ≥ 50)

| keyword | vol total | top países | comp |
|---|---:|---|---|
| arco de globos precio | 240 | MX 110 · PE 30 · AR 30 | HIGH |
| decoradores de fiestas precios | 200 | MX 90 · CO 30 · AR 20 | LOW |
| globos decoracion para inauguracion de negocio | 190 | MX 90 · CO 30 · PE 20 | MEDIUM |
| precio de decoración con globos | 160 | MX 70 · PE 20 · US 20 | MEDIUM |
| cuanto cuesta un arco de globos | 110 | MX 40 · CO 10 · PE 10 | HIGH |
| globos burbuja decorados precio | 110 | MX 50 · CO 10 · PE 10 | HIGH |
| negocio de globos | 110 | MX 40 · CO 10 · PE 10 | LOW |
| precio de arreglo de globos | 110 | MX 40 · CO 10 · PE 10 | MEDIUM |
| cotizacion de decoracion con globos | 100 | MX 30 · CO 10 · PE 10 | LOW |
| bouquet de globos precio | 90 | MX 20 · CO 10 · PE 10 | LOW |
| negocio de decoracion de eventos | 90 | MX 20 · CO 10 · PE 10 | LOW |
| cinta para arco de globos precio | 80 | CO 10 · MX 10 · PE 10 | UNSPECIFIED |
| cuanto cuesta hacer un arco de globos | 80 | CO 10 · MX 10 · PE 10 | LOW |
| globos para hacer figuras precio | 80 | CO 10 · MX 10 · PE 10 | UNSPECIFIED |
| negocio de decoracion con globos | 80 | CO 10 · MX 10 · PE 10 | UNSPECIFIED |
| negocio de decoracion de fiestas | 80 | CO 10 · MX 10 · PE 10 | LOW |
| precio de arcos de globos para fiestas | 80 | CO 10 · MX 10 · PE 10 | HIGH |
| arreglos de globos para cumpleaños precio | 70 | MX 20 · CO 10 · PE 10 | MEDIUM |
| como ser decoradora de eventos | 70 | CO 10 · MX 10 · PE 10 | UNSPECIFIED |
| cuanto cuesta una guirnalda de globos | 70 | CO 10 · MX 10 · PE 10 | UNSPECIFIED |
| emprendimiento decoracion de eventos | 70 | CO 10 · MX 10 · PE 10 | LOW |
| guirnalda de globos precio | 70 | CO 10 · MX 10 · PE 10 | UNSPECIFIED |
| negocio de arreglos para fiestas | 70 | CO 10 · MX 10 · PE 10 | UNSPECIFIED |
| negocio de globos personalizados | 70 | CO 10 · MX 10 · PE 10 | UNSPECIFIED |
| globos mil figuras precio | 60 | CO 30 · PE 10 · AR 10 | LOW |
| globos para globoflexia precio | 60 | CO 10 · MX 10 · EC 10 | UNSPECIFIED |
| precio de arco organico de globos | 60 | CO 10 · MX 10 · PE 10 | HIGH |
| base para arco de globos precio | 50 | CO 10 · MX 10 · PE 10 | UNSPECIFIED |
| columna de globos precio | 50 | CO 10 · MX 10 · AR 10 | UNSPECIFIED |
| cuanto cuesta una columna de globos | 50 | CO 10 · MX 10 · AR 10 | LOW |
| globos transparentes decorados precio | 50 | CO 10 · MX 10 · PE 10 | UNSPECIFIED |

Semillas de negocio **sin volumen medible** (0 en los 8 países): como cobrar una decoracion de globos, como vender arreglos con globos, cuanto cobrar por decoracion con globos, cuanto cobrar por un bouquet de globos, cuanto se gana decorando con globos, decoracion con globos para vender, ideas de negocio de globos, lista de precios decoracion con globos.

## 6. Producto/herramientas con potencial de guía (investigación comercial)

Intención mayoritariamente de compra; sirven para guías tipo 'qué inflador comprar', 'marcas de globos', 'tamaños', no para money pages.

| keyword | vol total | top países | comp | cluster |
|---|---:|---|---|---|
| globos de helio | 26.700 | MX 12.100 · CL 3.600 · AR 2.400 | MEDIUM | helio_inflado |
| globos burbuja | 25.360 | MX 18.100 · CO 1.900 · PE 1.300 | HIGH | globo_burbuja |
| inflador de globos | 18.920 | AR 4.400 · CO 2.900 · CL 2.900 | HIGH | helio_inflado |
| globos metálicos | 10.430 | MX 6.600 · PE 1.900 · CL 720 | HIGH | tipos_marcas_materiales |
| bomba para inflar globos | 9.420 | MX 8.100 · US 880 · CO 260 | HIGH | helio_inflado |
| letras globo | 9.370 | MX 4.400 · PE 1.600 · AR 880 | LOW | numeros_letras |
| maquina para inflar globos | 9.190 | MX 5.400 · US 1.600 · CL 880 | HIGH | helio_inflado |
| tanque de helio | 8.780 | MX 6.600 · US 1.000 · CL 480 | HIGH | helio_inflado |
| globos sempertex | 7.360 | MX 3.600 · CO 1.600 · US 720 | HIGH | tipos_marcas_materiales |
| globos largos | 6.350 | MX 2.900 · CL 880 · CO 480 | HIGH | globoflexia |
| globos dorados | 6.280 | MX 2.400 · PE 1.300 · AR 590 | HIGH | tipos_marcas_materiales |
| inflador de globos electrico | 5.550 | CO 1.300 · AR 1.000 · PE 880 | HIGH | helio_inflado |
| tanque de helio para globos | 4.940 | MX 4.400 · US 320 · CL 90 | HIGH | helio_inflado |
| globos de colores | 4.740 | MX 1.900 · PE 880 · ES 480 | HIGH | tipos_marcas_materiales |
| globos de numero | 4.690 | MX 2.400 · AR 590 · PE 480 | HIGH | numeros_letras |
| brillos para globos | 4.440 | MX 2.900 · US 720 · CO 320 | HIGH | helio_inflado |
| calibrador de globos | 4.050 | MX 2.400 · CO 390 · AR 320 | HIGH | helio_inflado |
| globo burbuja graduacion | 3.850 | MX 3.600 · CL 90 · PE 50 | MEDIUM | globo_burbuja |
| bombas de helio | 3.820 | ES 2.400 · CO 390 · US 390 | HIGH | helio_inflado |
| globos de latex | 3.700 | MX 2.400 · PE 320 · CO 210 | HIGH | tipos_marcas_materiales |

## 7. Estacionalidad (suma mensual de los grupos del núcleo por ocasión; índice = mes / promedio 12m)

| Ocasión | búsquedas/mes prom. (8 países) | mes pico 8 países (índice) | pico por país |
|---|---:|---|---|
| cumpleanos | 88.761 | sep-25 (x1.3) | CO sep-25, MX sep-25, PE sep-25, EC sep-25, CL sep-25, AR sep-25, ES sep-25, US sep-25 |
| graduacion | 28.194 | jul-26 (x4.4) | CO nov-25, MX jul-26, PE dic-25, EC feb-26, CL nov-25, AR dic-25, ES jun-26, US may-26 |
| boda | 23.148 | oct-25 (x1.3) | CO oct-25, MX oct-25, PE sep-25, EC sep-25, CL ene-26, AR oct-25, ES sep-25, US sep-25 |
| navidad | 19.302 | dic-25 (x7.0) | CO dic-25, MX dic-25, PE dic-25, EC dic-25, CL dic-25, AR dic-25, ES dic-25, US dic-25 |
| bautizo_comunion | 12.850 | may-26 (x1.3) | CO nov-25, MX jun-26, PE nov-25, EC jun-26, CL nov-25, AR oct-25, ES may-26, US abr-26 |
| san_valentin_amor_amistad | 10.834 | feb-26 (x3.8) | CO sep-25, MX feb-26, PE feb-26, EC feb-26, CL feb-26, AR feb-26, ES feb-26, US feb-26 |
| halloween | 6.472 | oct-25 (x8.9) | CO oct-25, MX oct-25, PE oct-25, EC oct-25, CL oct-25, AR oct-25, ES oct-25, US oct-25 |
| baby_shower | 4.028 | jul-26 (x1.2) | CO mar-26, MX jul-26, PE oct-25, EC sep-25, CL jul-26, AR abr-26, ES ago-26, US abr-26 |
| dia_madre | 3.019 | may-26 (x5.6) | CO may-26, MX may-26, PE may-26, EC may-26, CL may-26, AR oct-25, ES abr-26, US may-26 |
| dia_padre | 2.580 | jun-26 (x8.1) | CO jun-26, MX jun-26, PE jun-26, EC jun-26, CL jun-26, AR jun-26, ES mar-26, US jun-26 |
| virgen_guadalupe | 1.916 | dic-25 (x4.8) | CO dic-25, MX dic-25, PE dic-25, EC dic-25, CL sep-25, AR dic-25, ES nov-25, US dic-25 |
| quince_anos | 587 | ene-26 (x1.3) | CO sep-25, MX ene-26, PE may-26, EC jun-26, CL dic-25, AR oct-25, ES sep-25, US sep-25 |
| patrias | 139 | sep-25 (x5.5) | CO ene-26, MX sep-25, PE jul-26, EC sep-25, CL sep-25, AR sep-25, ES oct-25, US sep-25 |

**Curva mensual (índice vs promedio) — 8 países:**

| serie | sep-25 | oct-25 | nov-25 | dic-25 | ene-26 | feb-26 | mar-26 | abr-26 | may-26 | jun-26 | jul-26 | ago-26 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Nicho total | 1.06 | 1.13 | 1.05 | 0.96 | 0.89 | 0.87 | 0.91 | 0.95 | 1.02 | 1.12 | 1.14 | 0.91 |
| Intención curso | 1.11 | 1.09 | 0.85 | 0.76 | 1.21 | 0.97 | 1.06 | 1.00 | 1.05 | 0.91 | 1.06 | 0.93 |
| Globo burbuja | 0.76 | 0.78 | 0.94 | 0.74 | 0.87 | 0.96 | 0.72 | 0.78 | 0.99 | 1.65 | 2.00 | 0.81 |
| Globoflexia | 0.99 | 1.09 | 0.96 | 0.89 | 0.80 | 0.85 | 0.92 | 1.09 | 1.05 | 1.12 | 1.15 | 1.08 |
| Bouquets/arreglos | 1.13 | 1.13 | 0.99 | 0.82 | 0.98 | 0.93 | 0.96 | 0.94 | 1.04 | 1.13 | 1.11 | 0.84 |
| Flores con globos | 1.22 | 1.08 | 0.86 | 0.74 | 0.83 | 0.91 | 1.23 | 0.99 | 1.29 | 0.93 | 0.98 | 0.93 |
| Arcos/guirnaldas | 1.18 | 1.25 | 1.08 | 0.96 | 0.85 | 0.81 | 0.91 | 1.00 | 1.07 | 0.99 | 0.98 | 0.92 |

**Nicho total por país (índice):**

| país | sep-25 | oct-25 | nov-25 | dic-25 | ene-26 | feb-26 | mar-26 | abr-26 | may-26 | jun-26 | jul-26 | ago-26 | pico | valle |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| CO | 1.32 | 1.30 | 1.22 | 0.99 | 0.82 | 0.85 | 0.94 | 0.95 | 0.99 | 0.86 | 0.89 | 0.87 | sep-25 | ene-26 |
| MX | 0.90 | 1.02 | 0.95 | 0.88 | 0.87 | 0.85 | 0.88 | 0.95 | 1.01 | 1.36 | 1.45 | 0.87 | jul-26 | feb-26 |
| PE | 1.29 | 1.29 | 1.10 | 1.13 | 0.81 | 0.82 | 0.89 | 0.91 | 1.02 | 0.94 | 0.86 | 0.94 | sep-25 | ene-26 |
| EC | 1.09 | 1.14 | 1.04 | 1.18 | 1.02 | 1.01 | 0.91 | 0.87 | 1.05 | 0.97 | 0.88 | 0.84 | dic-25 | ago-26 |
| CL | 1.05 | 1.30 | 1.32 | 1.03 | 0.85 | 0.81 | 0.83 | 0.93 | 0.99 | 0.88 | 0.89 | 1.11 | nov-25 | feb-26 |
| AR | 1.20 | 1.20 | 1.17 | 1.06 | 0.94 | 0.87 | 0.95 | 0.90 | 0.90 | 0.90 | 0.85 | 1.06 | sep-25 | jul-26 |
| ES | 1.08 | 1.16 | 0.99 | 0.90 | 1.04 | 0.98 | 1.00 | 1.04 | 1.19 | 0.94 | 0.84 | 0.84 | may-26 | jul-26 |
| US | 1.16 | 1.12 | 0.97 | 0.92 | 0.95 | 0.95 | 0.97 | 0.97 | 1.13 | 0.99 | 0.92 | 0.95 | sep-25 | dic-25 |


**Graduación por país (suma mensual de keywords de graduación):**

| país | sep-25 | oct-25 | nov-25 | dic-25 | ene-26 | feb-26 | mar-26 | abr-26 | may-26 | jun-26 | jul-26 | ago-26 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| CO | 810 | 950 | 3.350 | 1.590 | 300 | 270 | 470 | 450 | 340 | 400 | 540 | 470 |
| MX | 1.740 | 1.800 | 1.470 | 1.290 | 2.350 | 3.400 | 5.280 | 5.300 | 16.820 | 108.030 | 119.670 | 5.590 |
| PE | 500 | 700 | 1.410 | 6.240 | 410 | 350 | 500 | 420 | 370 | 400 | 590 | 450 |
| EC | 320 | 270 | 360 | 220 | 1.320 | 2.300 | 1.120 | 450 | 440 | 700 | 650 | 240 |
| CL | 310 | 1.190 | 4.820 | 3.530 | 350 | 260 | 190 | 180 | 210 | 240 | 250 | 240 |
| AR | 380 | 670 | 2.180 | 2.460 | 200 | 230 | 320 | 190 | 220 | 220 | 240 | 320 |
| ES | 170 | 110 | 150 | 80 | 70 | 110 | 160 | 230 | 620 | 790 | 210 | 90 |
| US | 370 | 330 | 420 | 480 | 300 | 360 | 560 | 1.170 | 4.480 | 2.850 | 1.100 | 310 |

## 8. Limitaciones de los datos

- Volúmenes = promedios de 12 meses redondeados por Google en rangos (10, 20, 30… 1.000, 1.300, 1.600…). 10 es el piso: una keyword con 10 en los 8 países aparece con vol_total 80 sin que eso sea demanda real.
- Google agrupa variantes cercanas y a veces asigna a una long-tail el volumen de su grupo (p. ej. 'decoracion para boda civil sencilla en casa con globos' = 4.490). Tratar esas long-tail como indicio del tema, no de la frase exacta; validar con GSC/SERP.
- Variantes fusionadas (tilde, plural, orden, stopwords, typos de volumen idéntico): el volumen por país es el MÁXIMO de las variantes, no la suma. La lista de variantes queda en el JSON maestro.
- Idioma español (1003) + geo: en EE. UU. solo cuenta usuarios con Google en español → el mercado hispano de EE. UU. está subestimado.
- Pujas (low/high top-of-page) en **COP** (moneda de la cuenta Sably Ads), del país con más volumen; 0 = Google sin dato. Competencia = competencia de anunciantes, no dificultad SEO.
- Solo 12 meses (sep-2025→ago-2026): la estacionalidad no está validada multi-año. El pico de 'cumpleaños' en sep-2025 en los 8 países puede ser real o artefacto de ese año.
- Las ideas dependen de las semillas (13 grupos, 130 semillas); el universo no es exhaustivo. En Colombia 'bombas' = globos: se añadió un grupo específico.
- Intención, cluster, ocasión y enlace sugerido son clasificaciones heurísticas por regex (no vienen de Google) y no están validadas con SERP.
- Filtrado: se excluyeron aerostáticos, terráqueo, médicos, Globos de Oro, globos de cantoya/papel, globos de agua/juegos, tipografía 'letras de globito', retail ('cerca de mí', tiendas, mayoreo, precio de producto) y consultas solo en inglés. Detalle en kw_googleads_excluded.json.
