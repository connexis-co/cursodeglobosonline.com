# Renovación de fotos del sitio · 27-nov-2026

Pedido de JP: sustituir las fotos poco llamativas por fotografía realista, colorida y bien enfocada, con los personajes
aprobados de Sably (Jenny, Caro, Vale, Andrés), globos variados (látex vivo, metalizados, foil, burbuja, confeti) y
mejorar la imagen del certificado. Sin cambios de textos, precios, URL, enlaces de compra, analítica ni estructura.

Hojas: [`antes-despues-1.jpg`](antes-despues-1.jpg), [`antes-despues-2.jpg`](antes-despues-2.jpg) y, para lo que quedó a
un retoque, [`pendientes/hoja-pendientes.jpg`](pendientes/hoja-pendientes.jpg).

## Resultado

De 36 fotos del sitio (sin contar logos ni iconos): **15 sustituidas**, **21 se quedan** (19 porque ya son buenas o no
se tocan, 2 porque lo generado no pasó a los dos jueces).

### Sustituidas (aprobadas por juez de oficio y juez de realismo)

Notas: oficio / deseo · realismo / arte / parecido con la hoja del personaje. Veredictos completos en `juez/<hueco>/`.

| Archivo | Personaje | Candidato | Oficio | Realismo |
|---|---|---|---|---|
| `public/images/cursos/cover-flores.jpg` | mujer inventada (foto ya aprobada en sably.co, sin coste) | sably r1_b | 8 / 9 | 8 / 8 / – |
| `public/images/cursos/cover-globoflexia.jpg` | Caro | r3_ed | 8 / 8 | 8 / 8 / 7 |
| `public/images/cursos/cover-bouquets.jpg` | Vale | r7_cuad_c (r6_a ampliada a cuadrado) | 8 / 8 | 8 / 8 / 8 |
| `public/images/certificado-mockup.jpg` | sin personas | r2_b | 9 / 8 | 9 / 9 / – |
| `public/images/decoracion-guirnalda.jpg` (inicio) | Jenny | r5_edb | 8 / 8 | 8 / 8 / 8 |
| `public/og-default.jpg` | Caro | r2_a | 8 / 8 | 8 / 8 / 7 |
| `src/assets/blog/decoracion-con-globos.jpg` | Caro | r1_b | 8 / 9 | 8 / 8 / 8 |
| `src/assets/blog/centros-de-mesa-con-globos.jpg` | Caro | r1_b | 8 / 8 | 9 / 9 / 8 |
| `src/assets/blog/como-inflar-globos.jpg` | Vale | r2_a | 8 / 8 | 8 / 8 / 9 |
| `src/assets/blog/como-inflar-globos-largos.jpg` | Caro | r3_ed | 8 / 8 | 8 / 8 / 7 |
| `src/assets/blog/globoflexia.jpg` | Andrés | r2_ed | 8 / 8 | 8 / 8 / 8 |
| `src/assets/blog/cuanto-cobrar-por-decoracion-con-globos.jpg` | Vale | r2_ed | 8 / 9 | 8 / 8 / 8 |
| `src/assets/blog/tipos-y-tamanos-de-globos.jpg` | solo una mano | r2_ed | 8 / 8 | 8 / 8 / – |
| `src/assets/blog/bouquet-de-globos.jpg` | Jenny | r2_ed | 8 / 8 | 8 / 8 / 8 |
| `src/assets/blog/arco-de-globos.jpg` | Vale | r4_ed | 8 / 8 | 8 / 8 / 7 |

Mismos nombres de archivo, formato (JPEG progresivo) y tamaño de cada hueco: portadas 900×900, blog 2400×1350,
`og-default` 1200×685. El certificado y la foto del inicio pasan de 1100×802 a 1100×825, que es lo que ya declaraba el
`<img>` (4:3). Se actualizó el `heroAlt` de los 9 artículos y el `alt` de la foto del inicio; ningún `alt` presenta a
nadie como alumna o instructora.

### Se quedan con la foto actual porque lo generado no pasó (candidatas en `pendientes/`)

| Hueco | Mejor candidata | Qué falta |
|---|---|---|
| `public/images/cursos/cover-burbuja.jpg` | Jenny, `pendientes/cover-burbuja-r8b-16x9.jpg` (burbuja llena, sin globos fantasma; oficio 8 / 8, a un retoque) | Sobre los globos pequeños quedan reflejos nítidos de una ventana con edificios y la silueta de un fotógrafo. Además está en 16:9: habría que ampliarla a cuadrado con `cuadrar.py`. Antes, diez candidatos y dos retoques rechazados por globos fantasma en el plástico. |
| `src/assets/blog/como-inflar-un-globo-burbuja.jpg` | ninguna | Doce candidatos rechazados: primero por la mecánica del inflado, después por globos fantasma y reflejos en el plástico, y el último (burbuja llena, limpia) por un inflador imposible pegado a la burbuja. |

Los últimos trabajos de Jenny se lanzaron por OpenRouter, con el visto bueno de JP en la sesión, porque el crédito
prepago de Gemini directo se agotó (error 402).

### Se quedan porque ya son buenas o no se tocan

Las otras 18 portadas del blog (columnas, pared, cortinas, Halloween, boda, graduación, hombre, mujer, primera comunión,
rosa y dorado, Virgen de Guadalupe, Navidad, Año Nuevo, figuras, flores, burbuja decorados, guirnalda, helio), la foto
real del instructor y los logos e iconos.

## Método

Guiones en esta carpeta, adaptados de `sably.co/docs/equipo/2026-11-27/` (`pauta/ugc/METODO.md`, `PROMPT-JP.md`,
`fotos-cursos/gen.py`): `prompts.py` y `prompts_r2…r4.py` → `trabajos/*.json` → `gen.py` (tope propio, `gasto.csv`) →
jueces → `exportar.py export.json` → `antes_despues.py`. Modelo: `gemini-3-pro-image` a 2K con la hoja del personaje como
referencia. Reglas del oficio: [`OFICIO-globos.md`](OFICIO-globos.md). Rúbrica: [`JUEZ.md`](JUEZ.md).

Cada candidato pasó por dos subagentes Opus que no lo generaron, con manos y caras ampliadas al 200 %: 30 lecturas en
diez rondas. De 85 imágenes generadas se publican 14 (más la reutilizada). Lo que más falló: herramientas (bombas e
infladores mal construidos), globos 260 sin inflar que salían como pajitas, seudotexto en etiquetas y racimos con 5 o 6
globos. Lo que lo arregló: luz de ventana y cámara de celular en vez de «estudio», cara tres cuartos para que se
reconozca el personaje, quitar del encargo lo que el generador rompe y retoques puntuales sobre el candidato casi bueno.
Para las portadas cuadradas funcionó componer en 16:9 (todo cabe en el recorte de las tarjetas), pedir al modelo que
amplíe el lienzo y volver a pegar encima la foto aprobada (`cuadrar.py`). Lo que no se resolvió: el globo burbuja
transparente, donde el generador inventa globos fantasma y reflejos.

## Gasto

USD **11,89** de un tope de 15 (`gasto.csv`; JP lo amplió de 10 a 15 para rehacer tres fotos): 85 imágenes a ≈ 0,14.
Unos 6,28 por Gemini directo y unos 5,61 por
OpenRouter con el mismo modelo, usado mientras Gemini directo estuvo sin crédito (las de Jenny, solo tras el visto
bueno de JP).

## Comprobación

`npm run lint`: 0 errores. `npm run build`: 281 páginas antes y después. `verificar_build.py` contra el build de `main`:
0 páginas con `<img>` distintos (ancho, alto, clases, `sizes`), 0 imágenes rotas; fuera de las rutas de las fotos solo
cambia el `alt` de los 9 artículos (también en `og:image:alt`) y el de la foto del inicio. El CSS gana una utilidad sin uso (`.shrink`, 8 bytes)
porque Tailwind lee también esta carpeta de `docs/`.

## Dudas para quien revise

1. **Jenny**: sale en dos fotos publicadas (la principal del inicio y el bouquet del blog) y en una pendiente. JP la autorizó de palabra en la sesión;
   la autorización escrita habla de «contenidos de Sably» y de «voz de la marca, nunca alumna, docente ni testimonio».
   Aquí aparece decorando, sin nombre. Conviene que JP confirme que cubre este sitio.
2. `og-default` y `cover-globoflexia`: Caro con coleta, parecido 7 de 10 con su hoja.
3. `bouquet-de-globos` (blog): el globo de arriba toca el borde superior.
4. `cover-flores`: la mujer no lleva delantal y no es un personaje con nombre; es la foto que ya se publicó en sably.co.
5. PR contra `main` (como los dos últimos), porque `develop` va 9 commits por detrás.
