# Guía de redacción — Blog de cursodeglobosonline.com

## 1. Objetivo de cada artículo
1. Resolver COMPLETO la intención informacional de la keyword primaria (mejor que el top 3 del SERP).
2. Ganar autoridad temática para el dominio (cluster → pilar → money page).
3. Ser apto para Google Discover: útil, específico, visual, con fecha y autoría; nada de clickbait.
4. Llevar al lector, de forma natural, a UNA money page (el curso de `moneyPage`).
5. Ser citable por asistentes de IA: datos concretos (medidas, cantidades, tiempos, costos de referencia), pasos numerados, tablas, respuestas directas a preguntas reales (PAA).

## 2. Anti-canibalización (regla dura)
- La keyword primaria NUNCA es "curso de X", "clases de X" ni variantes transaccionales: esas pertenecen a las páginas de curso.
- No repitas el tema de otro artículo del mapa: si tocas un subtema que tiene artículo propio, resume en 2-3 frases y ENLAZA a ese artículo (`/blog/<slug>/`).
- No uses como H1 ni como seoTitle frases que compitan con otro artículo del mapa.

## 3. Formato MDX (Astro)
Archivo: `src/content/blog/<slug>.mdx`. Frontmatter EXACTO (YAML válido; comillas simples si hay `:`):

```yaml
---
title: '<H1 del mapa, puedes pulirlo>'
seoTitle: '<≤ 60 caracteres, keyword al inicio>'
description: '<140-160 caracteres, AIDA, con beneficio concreto y llamada suave>'
discoverTitle: '<titular humano y específico para Discover/redes, sin clickbait>'
cluster: <uno de: arcos-y-guirnaldas | ideas-por-ocasion | arreglos-y-flores | globoflexia | tecnicas-y-materiales | negocio>
isPillar: <true|false>
pillar: <slug del pilar del cluster, omitir si este ES el pilar>
primaryKeyword: '<keyword primaria>'
keywords: ['<primaria>', '<secundaria 1>', '<secundaria 2>', ...]   # 4-10
moneyPage: <curso-de-globoflexia | curso-de-bouquets-de-globos | curso-de-flores-con-globos | curso-de-globos-burbuja | catalogo>
moneyAnchor: '<frase corta para la caja lateral, p. ej. "Aprende las 23 figuras con video, paso a paso">'
hero: ../../assets/blog/<slug>.jpg
heroAlt: '<descripción literal de la foto hero (la escribe el agente de imagen; deja una provisional)>'
publishedAt: 2026-09-22
related: ['<slug>', '<slug>', '<slug>']   # 2-4 slugs del mapa (vecinos o pilar)
faqs:
  - q: '<pregunta real (PAA)>'
    a: '<respuesta directa de 1-3 frases>'
  # 3-6 FAQs; NO repitas las preguntas que ya respondes como H2
---
```

Componentes disponibles SIN import:
- `<Callout tipo="consejo|ojo|dato" titulo="…">texto con **negritas**</Callout>` — 2-4 por artículo (trucos de taller, errores comunes, cifras clave).
- `<CourseCta curso="<moneyPage>" texto="<frase que conecte ESTE artículo con el curso>" />` — exactamente UNO dentro del cuerpo, después de la sección donde el lector ya obtuvo valor (normalmente tras el 40-60 % del texto). NO pongas otro al final: la plantilla ya añade uno.
- Markdown normal: `##` para H2 (el H1 lo pone la plantilla: NO escribas `#`), `###` H3, listas, tablas GFM, **negritas**, enlaces `[texto](/ruta/)`.

## 4. Estructura (AIDA sin que se note)
1. **Atención + Interés** (2-4 frases, sin H2): la situación concreta del lector y la promesa específica del artículo ("en 40 minutos y con unos 100 globos…"). Nada de "En el mundo de la decoración…".
2. **Resumen en 30 segundos**: un `<Callout tipo="dato" titulo="En resumen">` con 3-5 viñetas (respuesta directa para snippets e IA).
3. **Cuerpo**: los H2 del outline del mapa (puedes reordenar/mejorar), con pasos numerados, medidas, cantidades, materiales con cantidades, tabla comparativa cuando aplique, errores comunes, variantes.
4. **Deseo**: muestra el resultado profesional y el paso siguiente (qué separa lo casero de lo que se cobra) → aquí va el `<CourseCta>`.
5. **Acción** suave al final (1-2 frases): qué hacer hoy; enlace al pilar o a un artículo relacionado.

Longitud: pilares 2.200-3.200 palabras; satélites 1.300-2.000. Párrafos de 2-4 líneas. Un H2 cada 200-350 palabras.

## 5. Voz y estilo
- Español neutro latinoamericano, tuteo. Cercano y de oficio: suena a decoradora con años de montajes, no a folleto.
- Colombia dice "bombas"; México "globos". Usa "globos" y menciona "bombas" una vez donde encaje (SEO CO).
- Frases concretas > adjetivos. "Un globo de 12 pulgadas inflado a 11" es mejor que "globos del tamaño adecuado".
- PROHIBIDO (delatan IA o son relleno): "sumérgete", "descubre el fascinante mundo", "en el mundo de", "lleva tu X al siguiente nivel", "no es solo X, es Y", "en resumen" como muletilla de cierre, "¡Manos a la obra!", "sin más preámbulos", "vibrante", "desbloquear", "potenciar", "elevar", "increíble", "mágico", emojis en el texto, exclamaciones en serie, listas de 3 adjetivos, preguntas retóricas en cadena, conclusiones que repiten todo.
- Sin mayúsculas gritonas en títulos (solo la primera letra y nombres propios).

## 6. Datos y honestidad (anti-humo)
- NO inventes estadísticas, estudios, testimonios, nombres de clientes ni "según expertos".
- Medidas y cantidades técnicas (globos por metro de guirnalda, tamaños en pulgadas, tiempos de flotación con helio y Hi-Float, presión, etc.): usa rangos de oficio ampliamente documentados y, si dudas, verifica con WebSearch/WebFetch (fabricantes como Sempertex, Qualatex/Pioneer, Tuf-Tex; guías de balloon artists). Si citas un dato de un fabricante, nómbralo ("según la guía de inflado de Qualatex").
- Precios de mercado (cuánto cobrar, costo de materiales): da RANGOS de referencia y explica cómo calcularlos (materiales + horas + transporte + margen); si citas precios concretos, que salgan de una búsqueda real (p. ej. listados de Mercado Libre o tiendas) e indica país y fecha ("sep-2026, Mercado Libre México"). Nunca prometas ingresos.
- Datos de los cursos (solo estos, verificados el 2026-09-22): Globoflexia 23 videos, US$25 con 50 % de descuento (antes US$49,99); Bouquets 17 videos, US$49,99; Flores 31 videos, más de 15 flores, US$79,99; Globos burbuja 18 videos, US$49,99. Todos: certificado de estudios, acceso de por vida, garantía de 7 días de Hotmart, 100 % online. Si no necesitas el precio, no lo pongas.
- Seguridad: menciona precauciones reales donde toque (niños pequeños y látex/asfixia, alergia al látex, helio no se inhala, globos metalizados cerca de cables eléctricos, soltar globos al aire contamina).

## 7. Enlazado interno (obligatorio)
- 1 enlace a la money page con anchor natural descriptivo (además del `<CourseCta>`): p. ej. `[curso de globoflexia](/co/curso-de-globoflexia/)`. Las money pages viven en `/co/<slug-del-curso>/`. Catálogo: `/co/cursos/`.
- Si no eres el pilar: 1 enlace al pilar de tu cluster en los primeros 30 % del texto.
- 2-4 enlaces a artículos hermanos del mapa (solo slugs que existan en el mapa), con anchor descriptivo (nunca "clic aquí").
- Todos los enlaces internos terminan en `/`.
- Enlaces externos: solo a fuentes de autoridad cuando citas un dato (fabricantes, normas de seguridad); máximo 3.

## 8. SEO on-page
- Keyword primaria en: H1 (title), seoTitle (al inicio), primeras 100 palabras, al menos un H2, heroAlt si es natural, description.
- Secundarias y variantes (incluidas las PAA) repartidas en H2/H3 y texto con naturalidad. Nada de relleno de keywords.
- Tablas y listas numeradas donde el SERP muestre fragmentos destacados.
- `faqs`: preguntas reales del SERP (PAA) que no sean ya un H2.

## 9. Entrega
Escribe el archivo MDX. Revisa que el frontmatter sea YAML válido y cumpla: description 80-170 caracteres (objetivo 140-160), seoTitle ≤ 60, heroAlt ≥ 20 caracteres. Valor de retorno: slug, palabras aprox., keyword primaria, enlaces internos incluidos y cualquier dato que no pudiste verificar.
