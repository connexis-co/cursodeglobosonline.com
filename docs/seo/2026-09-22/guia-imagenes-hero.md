# Guía de imágenes hero — Blog de cursodeglobosonline.com

Basada en la skill `imagenes-ultrarrealistas` de JP (proceso probado: 40/40 fotos aprobadas).
El problema casi nunca es el modelo: es el método (prompt fotográfico + referencias + juez).

## Especificación técnica
- Una foto hero por artículo, 16:9, SIN texto, SIN logos, SIN marcas de globos legibles.
- Generador: `python3 ~/.claude/skills/imagenes-ultrarrealistas/scripts/gen.py --modelo nbpro --prompt-file <prompt.txt> --aspecto 16:9 --out <tmp>.png [--ref ref.jpg ...]`
  (Nano Banana Pro = `gemini-3-pro-image`, sale a 2K). Carga antes la clave del proyecto:
  `set -a; source "<SP>/secrets.env"; set +a` (la variable de entorno tiene prioridad sobre la del archivo de la skill). Nunca imprimas la clave.
- Economía: 1 candidato con `nbpro`. Si el juez encuentra un defecto LOCALIZADO (texto, logo, mano rara), EDITA con `--modelo nb2 --ref <candidato.png>` y un prompt de retoque mínimo. Solo si no sirve de base, 1 candidato más con `nbpro`; como ÚLTIMO recurso (más caro, máx. 1536 px de ancho) `--modelo sunburst` (OpenAI gpt-image-2.5-sunburst, clave OPENAI_API_KEY ya en secrets.env). Tope: 4 llamadas por imagen.
- Entrega: JPG calidad 86, recortado exacto a 16:9 y redimensionado a **2400×1350** (PIL, `Image.LANCZOS`), en `src/assets/blog/<slug>.jpg`. Si el original es menor de 2400 px de ancho, NO lo amplíes más de 1,3×: usa el tamaño original recortado a 16:9 (mínimo aceptable 1920×1080).
- Python con PIL: `<SP>/venv/bin/python`.

## Estilo: REALISMO ASPIRACIONAL (lección de JP 18-09-2026)
- Real pero deseable: salones de eventos limpios, jardines cuidados, casas bonitas de clase media latinoamericana, talleres ordenados, luz natural agradable de día o luz cálida interior bien expuesta.
- Nada de lugares descuidados, paredes manchadas, basura, cielos lúgubres, escenas tristes.
- Personas: latinoamericanas (mestizas, afrodescendientes, blancas; variedad), 20-55 años, ropa casual de trabajo o de evento; manos trabajando; que NO miren a cámara; piel con textura; nada de sonrisas de catálogo.
- Globos: látex con reflejos reales, pequeñas imperfecciones de tamaño (como en montajes reales), nudos visibles, cinta de arco/tira perforada, pesas, infladores. Paletas actuales (tonos tierra, pastel, dorado/cromado, blanco y verde salvia, etc.) acordes al tema.
- Composición pensada para 16:9 en tarjeta y para Discover: sujeto claro, algo de aire, que se entienda el tema al primer vistazo en miniatura.

## Plantilla de prompt (inglés, fotográfico documental)
"Candid documentary photograph, shot on a Fujifilm X-T5 with a 35mm lens at f/2.8, natural light. <escena concreta del imageConcept: quién, qué hace con las manos, qué montaje, dónde, hora del día>. Realistic latex balloons with natural specular highlights, slight size variation, visible knots, <materiales>. Setting: <lugar aspiracional latinoamericano>. Subtle film grain, true-to-life colors. Reference images (if any) are for context only; do not copy any person, sign or lettering; create a completely new photograph. No text, no letters, no numbers, no logos, no brand names printed on balloons, no watermarks, no HDR, no oversaturation, no plastic skin, no catalogue smiles, nobody looking at the camera."

Referencias reales (opcional, sube el realismo): 2-5 fotos con licencia libre (Wikimedia Commons, Unsplash, Pexels) del tipo de montaje; tapa caras y textos con PIL antes de enviarlas. Son solo referencia interna: nunca se publican.

## Juez escéptico (obligatorio, otro agente)
Mira la imagen completa y en recortes (caras, manos, nudos, bordes de globos, fondo) con la herramienta Read. Aprueba solo si:
- realismo ≥ 8/10 (parece foto de una decoradora real, no render), atractivo ≥ 7/10;
- cero defectos duros: texto o letras legibles (incluidas marcas en los globos), logos, manos/dedos deformes, globos fusionados o sin nudo imposible, objetos flotando sin sentido, caras deformes, escena que no corresponde al artículo;
- encaja con el tema exacto del artículo (p. ej. si el artículo es de "medio arco de globos", se ve un medio arco).
Si no pasa: crítica concreta → el generador corrige (máx. 2 rondas).

## heroAlt
Descripción literal y útil de la foto (qué se ve, 80-140 caracteres), con la keyword primaria solo si es natural. Sin "imagen de".
