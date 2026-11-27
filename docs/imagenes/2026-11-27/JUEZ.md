# Jueces de las fotos de cursodeglobosonline.com (27-nov-2026)

Dos lecturas independientes por imagen, hechas por subagentes que no generaron la foto. Las dos tienen que aprobar.
Una foto aprobada la ven miles de personas en un sitio que vende cursos de decoración con globos: ante la duda, rechazo.

## Cómo mirar (obligatorio, las dos lecturas)
Con `python3` y PIL, por cada candidato guarda en `juez/<hueco>/insp/`:
1. la imagen entera reducida a 1400 px de ancho;
2. el recorte que servirá el sitio (se indica en el encargo: banda central 16:9 de un cuadrado, 4:3, 16:9…);
3. recortes **ampliados al 200 %** (resize ×2 con LANCZOS sobre el original) de cada cara y de cada mano, y de cualquier
   superficie que pueda llevar letras (bolsas, carretes, infladores, cuadros, papeles).
Míralos con Read de uno en uno. No te fíes de la vista general.

## Lectura 1 · Juez de oficio (decoradora profesional de globos)
Contrasta contra [`OFICIO-globos.md`](OFICIO-globos.md) (procedimiento real y lista «lo que NUNCA ocurre»). Además, los
puntos de JP para fotos de un oficio:
1. Materiales en la mesa coherentes con el trabajo que se ve (mismos colores y tipos de globo).
2. La persona mira lo que hace, con cara agradable; no posa ni mira a cámara.
3. Lleva delantal o uniforme (azul noche con tiras coral), sin logos ni letras.
4. Gesto del oficio correcto: herramienta real, bien sujeta, en la etapa que toca. Figuras de globoflexia que se puedan
   hacer de verdad (un perrito tiene hocico, dos orejas, cuello, dos patas delanteras, cuerpo, dos traseras y cola).
5. Productos con etiqueta de forma creíble y **no legible**; ninguna marca real; ninguna letra ni número.
6. Ambiente decorado, limpio, de clase media o más; trabajo terminado abundante, colorido y con variedad de globos
   (látex mate, metalizados, foil, burbuja o confeti) que dé ganas de aprender.
Defectos duros (uno = rechazo): globos fundidos o atravesados por cinta o varilla, globos de aire flotando, nudos al
frente, helio sin peso, burbuja arrugada o con nudo de látex, inflador o bomba imposibles, texto legible, escena humilde
o sucia, restos de globo en el piso.
Puntúa 0–10 `oficio` y `deseo` (¿da ganas de aprenderlo?, ¿se entiende en un segundo en el recorte del sitio?).
Aprueba con oficio ≥ 8, deseo ≥ 8 y cero defectos duros.

## Lectura 2 · Juez de realismo (editor de fotografía escéptico)
1. Cuenta personas, brazos, manos y **dedos** al 200 %, siguiendo cada dedo hasta su mano y cada mano por el antebrazo
   hasta un hombro plausible. Una mano de más, dedos que no son 5, dedos fundidos con el globo o con la herramienta,
   objetos flotando o atravesados: defecto duro. Escribe el conteo.
2. Cara: mirada viva, ojos alineados, piel con poros (no cera ni porcelana), dientes naturales, pelo con hebras sueltas.
   Si el encargo indica personaje con hoja de referencia, compara: ¿es la misma persona? (parecido ≥ 8 de 10).
3. Luz coherente entre sujeto y fondo, sombras de contacto, telas con peso, reflejos creíbles en globos metalizados.
4. Aspecto sintético: brillo HDR, simetría perfecta, neblina dorada, objetos «de juguete», fondo incoherente.
5. Cualquier letra, número, logotipo o seudotexto con forma de palabra: defecto duro (indica dónde).
Puntúa 0–10 `realismo` (¿pasaría por foto de un fotógrafo?) y `arte` (color, composición, foco en el recorte del sitio).
Aprueba con realismo ≥ 8, arte ≥ 8 y cero defectos duros.

## Salida
Escribe `juez/<hueco>/oficio.md` o `juez/<hueco>/realismo.md` (según tu lectura) con: tabla por candidato (notas,
defectos duros, veredicto `aprobada | retoque | rechazo`), conteo de personas/manos/dedos, hallazgos concretos, el
candidato recomendado y, si ninguno pasa, la crítica exacta en inglés para regenerar. Si hay UN defecto localizado y fácil
de borrar, marca `retoque` con la instrucción en inglés. No edites ningún otro archivo.
