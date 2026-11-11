# Auditoría SEO del contenido de las fichas de curso — 11 de noviembre de 2026

Alcance: los campos editables del CMS de las 5 fichas (`short_description`, `meta_description`, `body`, `learnings`, `audience`, `faqs`, `keywords`). No se tocó plantilla, CMS ni código. El texto final está en `docs/seo/2026-11-11-parche-contenido-cursos.json`.

Fuentes: contenido leído del sitio local (`localhost:4338`, versión `/co/`); Google Ads Keyword Planner (sep-2025 a ago-2026, 8 países; 10 es el piso de Google); DataForSEO (SERP y PAA del 22-09); Ubersuggest; mapa temático; Search Console real de 90 días (11-ago a 8-nov, país × consulta × página); auditoría de hoy, §4 (reparto de intenciones).

## 0. Lo que se repite en las cinco fichas

1. **La búsqueda principal casi no está en el texto editable.** En las 4 fichas antiguas, «curso de X» solo aparece en la FAQ «¿es gratis?» (y en globoflexia, en el 2.º párrafo). Ningún `###` lleva la palabra clave. La plantilla ya la repite en el H1 y en 5 o 6 H2, así que el parche la pone una sola vez por campo: meta, primer párrafo y una FAQ.
2. **«Online» no está en ningún campo editable de globoflexia** y en bouquets solo en una FAQ. «Presencial» y «clases» no aparecen en ninguna ficha; «principiantes», solo en una línea de `audience` de flores y de burbuja.
3. **FAQ duplicadas con la plantilla.** La plantilla añade 3 FAQ por país (tomar el curso desde el país, validez del certificado, moneda). La FAQ del CMS «¿Cómo accedo al curso?» responde lo mismo que la primera, en las 4 fichas antiguas. Se sustituye por «¿online o presencial?», que sí tiene búsquedas.
4. **Precios escritos a mano en 5 respuestas de FAQ** (globoflexia 2, bouquets 1, flores 1, burbuja 1) y en la `short_description` y la meta de globoflexia. La plantilla ya pinta precio y descuento; esas cifras van además al JSON-LD de FAQ y quedan mal en cuanto cambie el precio o el cupón. El parche las quita.
5. **`learnings[0]` es el texto alternativo de la portada** cuando la imagen no tiene `alt` en el CMS (`CourseLanding.astro`, línea 145, y `CourseCard.astro`). Se reordena para que la primera frase diga qué enseña el curso.
6. **`keywords` no se publica en la ficha** (solo se guarda). Impacto SEO nulo, pero hoy lista búsquedas que son del blog («centros de mesa con globos», «cómo hacer figuras con globos», «globo unicornio paso a paso»). Se deja solo con variantes de «curso de X», como pide la nota 5 del mapa temático.
7. **Promesas de ingreso sin respaldo** en 3 cuerpos (globoflexia, bouquets y burbuja): «se cobra bien en cualquier ciudad», «el bono que paga el curso», «el producto con mejor margen del nicho». Las fichas de Hotmart avisan de que el curso no garantiza resultados. Se cambian por lo que contiene cada módulo.

Search Console, 90 días: las consultas con «curso/clases/taller» suman 6.498 impresiones y 188 clics en todo el sitio. Las fichas reciben muy poco: globoflexia 798 impresiones (pos. 21,9), burbuja 135 (26,1), bouquets 29 (59,8), flores 15 (61,9). La de decoración aún no está publicada.

## 1. Curso de Decoración con Globos (nuevo: cambios mínimos)

| Búsqueda | Vol./mes (8 países) | País | Search Console 90 d | Hoy aparece en | Falta → dónde se añade |
|---|---:|---|---|---|---|
| curso de decoración con globos | 1.280 | MX 590 · CO 210 | 751 imp., repartidas en ciudades | meta, 1.er párrafo, FAQ 1 | nada |
| curso de globos | 700 | MX 390 · CO 110 | 1.078 imp., pos. 42 | no aparece | FAQ 2 |
| cursos de decoración para fiestas y eventos | 410 | CO 140 · MX 140 | 135 imp., pos. 4,3 (ciudades de CO) | no | `audience` |
| curso de globología | 390 | AR 320 | 50 imp., pos. 9,6 (en `/ar/` y Rosario) | no | FAQ nueva |
| curso de decoración con globos presencial | 270 | MX 90 · AR 40 | «presencial/cerca de mí»: 210 imp. | no | FAQ nueva |
| clases de globos · de decoración de globos | 200 · 140 | CO 70 · PE 40 | 107 imp., pos. 12,7 | no | FAQ nueva |
| curso de globos gratis | 120 | MX 40 | 21 imp., pos. 28 | no | FAQ nueva |
| curso de globos para principiantes | 120 | MX 50 | 6 imp. | no | FAQ 2, `audience` |

Hallazgos:

1. El texto es concreto y coincide con el temario. No se toca `body`, `short_description` ni `learnings`.
2. «Curso de globos» (700/mes), que esta ficha debe ganar según la auditoría §4, no aparece en ningún campo. Entra reformulando una pregunta: «¿Es un curso de globos para principiantes?» (misma respuesta).
3. Faltan tres preguntas con demanda medida: gratis o precio (PAA en las SERP de CO y MX de «curso de decoración con globos»), presencial u online, y globología. El blog del sitio ya da «globología» como sinónimo de decoración con globos; el volumen está en Argentina y hoy esas búsquedas caen en `/ar/` y en ciudades.
4. Para no pasar de 8 FAQ salen dos: «¿Incluye certificado?» (la plantilla ya lo responde en su FAQ por país; el dato pasa a la FAQ «¿es gratis?») y «¿Qué valoración tiene el curso?» (nadie lo busca y el 4,7/5 ya está en el hero y en el 2.º párrafo).
5. Meta: con «Estados Unidos» medía 163 caracteres. Se quita «y precios», que además se leía como si la página listara precios. Queda entre 144 y 154.
6. No aplicado, a criterio de JP: en el cuerpo, «es el corazón del curso» y «una pieza que se vende sola en baby showers» son las dos únicas frases de relleno.

Qué cambia: `meta_description`, primera línea de `audience`, `faqs` (4 iguales, 1 reformulada, 3 nuevas, 2 fuera) y `keywords` (+3 variantes).

## 2. Curso de Globoflexia

| Búsqueda | Vol./mes | País | Search Console 90 d | Hoy aparece en | Falta → dónde se añade |
|---|---:|---|---|---|---|
| curso de globoflexia | 700 | MX 480 · CO 90 | 625 imp.; ficha MX pos. 12, ficha CO pos. 57 | 2.º párrafo, FAQ «gratis» | meta, 1.er párrafo; «globoflexia» en short y `###` |
| cursos de globoflexia · globoflexia curso | s/d · 320 MX (Ubersuggest) | MX | 236 imp., pos. 11,5 · 67 imp., pos. 11,6 | — | cubiertas con la principal |
| curso de globoflexia gratis | 110 | MX 50 (Ubersuggest) | 1 imp. | FAQ (con precios) | FAQ sin cifras |
| clases de globoflexia | 100 | — | 13 imp., pos. 10,7 | no | FAQ «en línea o presencial» |
| curso de globoflexia online · en línea | 80 | — | 6 imp., pos. 11,3 · 4 imp., pos. 16 | no | meta, FAQ |
| curso de globoflexia cerca de mí · presencial | 90 MX (Ubersuggest) | MX | ≈ 14 imp. | no | FAQ |
| curso de figuras con globos | 70 | — | — | short | 1.er párrafo, `learnings` |
| para principiantes · desde cero | 10 MX | — | — | «desde cero» en short | FAQ, cuerpo, `audience` |
| globos largos (sinónimo de globo 260) | 6.350, de producto | MX 2.900 | en el blog | no | short, 1.er párrafo, FAQ de materiales |

Hallazgos:

1. **Es la ficha con más opción de primera página**: en México sale en posición 12 por «curso de globoflexia» (340 impresiones) y entre 9 y 13 por sus variantes, con 2 clics. La meta actual no contiene «curso de globoflexia» ni «online», y gasta unos 25 caracteres en un precio que el título ya muestra.
2. `short_description` no dice «globoflexia» y lleva el descuento; ese texto es también la descripción del JSON-LD, la tarjeta del catálogo y `llms.txt`.
3. El primer párrafo es una anécdota del perrito; la búsqueda principal llega en el segundo. El nuevo abre con qué enseña y cuántas figuras (15, contadas en el temario de la propia ficha).
4. Los tres `###` no llevan ninguna búsqueda («De los nudos a la pantera rosa», «Un oficio para cobrar desde el primer evento», «Bonos incluidos»).
5. Relleno o promesa: «retorcer sin miedo», «las figuras que nunca fallan», «de las habilidades con retorno más rápido que existen», «se cobra bien en cualquier ciudad», «estudiantes con espíritu creativo». Y dos rayas largas en una frase.
6. Canibalización con el blog: `keywords` incluía «cómo hacer figuras con globos», que es de `/blog/figuras-con-globos/`. Las consultas informativas («qué es globoflexia», 1.105 imp.) ya las gana el blog; la ficha no compite ahí.
7. Canibalización entre fichas: esta ficha recibe más de 250 impresiones de búsquedas generales («curso de globos», «curso decoración de globos»), 200 de ellas en México en posición 19,9, porque no existía la ficha general. Se añade la FAQ «¿Este curso enseña arcos y guirnaldas de globos?», que remite al curso de decoración.
8. «Curso de globología» (390, AR 320) estaba asignada a esta ficha en el mapa temático. Se mueve a la de decoración: globología es decoración con globos, no figuras.
9. Sale la FAQ «¿El descuento del 50% es real?»: repite cifras que pinta la plantilla y depende de la decisión pendiente sobre el cupón. Si JP la quiere conservar, conviene sin números.

Qué cambia: todos los campos. `body` reescrito con 4 `###` (bases, 15 figuras, para quién, bonos).

## 3. Curso de Bouquets de Globos

| Búsqueda | Vol./mes | País | Search Console 90 d | Hoy aparece en | Falta → dónde se añade |
|---|---:|---|---|---|---|
| curso de bouquets de globos · de bouquet | 80 · 80 (piso de 10 por país) | — | 0 imp. | FAQ «gratis» | meta, 1.er párrafo |
| cursos de arreglos de globos | 150 | MX 70 | 10 imp., pos. 4,3 (en `/pe/`, `/ec/` y ciudades) | no | `###`, `audience`, FAQ |
| curso para hacer arreglos con globos | 80 | — | 2 imp. | no | FAQ nueva |
| clases de arreglos de globos | 60 | — | — | no | FAQ «clases online» |

Hallazgos:

1. La demanda propia es mínima. La mayor es «cursos de arreglos de globos» y la ficha no usa «arreglos con globos» ni «arreglos de globos» en ningún campo; solo «arreglo» suelto. Las 29 impresiones de la ficha son de búsquedas generales («curso de globos», «curso de decoración con globos»).
2. La meta dice «para vender desde {lugar}», que se lee como exportar. No contiene «curso».
3. `###` sin búsqueda y con las fórmulas a evitar: «El bono que paga el curso», «Hecho para vender, no solo para decorar».
4. Sin respaldo: «el producto perfecto», «se vende solo», «de los detalles más vendidos en Latinoamérica», «el primer pedido ya sale con margen», «el bouquet de desayuno sorpresa que más se vende».
5. Español de un solo país en un cuerpo común a ocho: «amor y amistad», «grados», «se entrega en moto». Queda «San Valentín o Amor y Amistad».
6. Dato: la FAQ del bono dice «cuatro videos» y el temario lista 3 lecciones en 4 partes. Se escribe «en cuatro partes».
7. «Constancia» en una FAQ y «certificado» en el resto de la página y en el JSON-LD. Se unifica y «constancia» queda una vez entre paréntesis.
8. Canibalización: `keywords` listaba «bouquets de globos paso a paso», «centros de mesa con globos» y «desayunos sorpresa con globos», las tres del blog. La FAQ nueva «¿Es un curso de arreglos con globos o solo de bouquets?» separa esta ficha de las de decoración y flores.

Qué cambia: todos los campos. `body` con 3 `###` (técnica, presupuesto, bono).

## 4. Curso de Flores con Globos

| Búsqueda | Vol./mes | País | Search Console 90 d | Hoy aparece en | Falta → dónde se añade |
|---|---:|---|---|---|---|
| curso de flores con globos | 0 en Ads | — | 0 imp. | FAQ «gratis» | meta, 1.er párrafo |
| curso de flores de globos | s/d | — | 0 imp. | no | `audience` («flores de globos») |
| flores de globos (informativa) | 6.010 | MX 2.900 | la gana el blog | — | no se ataca desde la ficha |

Hallazgos:

1. **Promete algo que el curso no enseña.** `short_description`, meta, `learnings`, cuerpo y `keywords` hablan de «centros de mesa». El mapa temático del 22-09 comprobó en Hotmart que las lecciones son «Centro de flor con Telgopor» y «Centro de flor con cd»: el centro de una flor, no un centro de mesa. Esa promesa va también al JSON-LD (`teaches`). El parche la retira y escribe «centro de flor».
2. La meta dice «31 videos»; Hotmart lista 28 lecciones numeradas. El texto nuevo no da cifra de videos.
3. No hay demanda medible de «curso de flores»: la ficha vive del tráfico que le mande el blog (`/blog/flores-con-globos/`). El objetivo aquí es exactitud y conversión, no posición.
4. Canibalización: la FAQ «¿Qué es la técnica de distorsión?» repite el H2 del blog «Flores en distorsión: qué es la técnica y cuándo usarla». Pasa a «¿El curso enseña la técnica de distorsión?». `keywords` tenía «flores con globos paso a paso» y «flor de globo 5 pétalos», del blog.
5. Relleno: «el detalle que convierte una decoración corriente en una que la gente fotografía», «no se compran en cualquier esquina», «explicada de verdad», «acabados que parecen de vitrina», «Una flor suelta no se vende; un centro de mesa sí», «ganas de un oficio bonito».
6. El cuerpo nuevo nombra las flores del temario y aclara «Telgopor (icopor o unicel)», que cambia de nombre según el país.

Qué cambia: todos los campos. `body` con 4 `###` (esenciales, distorsión y avanzadas, estructuras y bouquets, bono).

## 5. Curso de Globos Burbuja

| Búsqueda | Vol./mes | País | Search Console 90 d | Hoy aparece en | Falta → dónde se añade |
|---|---:|---|---|---|---|
| curso de globos burbuja | 160 | MX 90 | 224 imp.; ficha MX pos. 13, CO pos. 20, ES pos. 8 | FAQ «gratis» | meta, 1.er párrafo |
| cursos de globos burbuja · curso globos burbuja | s/d | — | 22 imp., pos. 11 · 16 imp., pos. 5,4 | — | cubiertas con la principal |
| curso de globos burbuja presencial | s/d | — | 5 imp., pos. 12,8 | no | FAQ «¿Hay clases presenciales?» |
| decoración con globos burbuja (informativa) | 470 | MX 260 · CO 110 | en el blog | `keywords` | sale de `keywords`: es del blog |

Hallazgos:

1. Segunda ficha más cerca de la primera página (México, posición 13). Ni la meta ni la `short_description` dicen «curso de globos burbuja».
2. `short_description` empieza con «Domina el globo burbuja, confeti, tassels…»: la lista mezcla el globo con las técnicas y no se entiende.
3. Canibalización: la FAQ «¿Qué es exactamente un globo burbuja?» compite con el H2 «¿Qué es un globo burbuja…?» de `/blog/globos-burbuja-decorados/`. Se cambia por «¿Qué se aprende en el curso de globos burbuja?». Además, esa respuesta sitúa el efecto mármol «por fuera», y una reseña de Hotmart lo describe como pintura dentro del globo; el texto nuevo no dice dentro ni fuera.
4. Sin respaldo: «el producto con más margen de la decoración actual», «el que los clientes piden por nombre», «se vende varias veces por encima de su costo», «el más pedido en fiestas infantiles», «el producto de moda».
5. Un tercio de las impresiones de la ficha (52 de 146) son búsquedas generales de decoración con globos. Se añade la FAQ «¿En qué se diferencia del Curso de Decoración con Globos?».
6. Faltaba una FAQ para principiantes; la ficha es «todos los niveles».

Qué cambia: todos los campos. `body` con 3 `###` (relleno y color, unicornio y boy or girl, bonos).

## 6. Variantes por país: qué entra y qué no

| Variante | Evidencia | Decisión |
|---|---|---|
| bombas (CO) | «decoración con bombas» CO 1.000, «arco de bombas» 880; en Search Console, 513 imp., todas informativas y ya en el blog; ninguna consulta «curso … bombas» | No entra: el cuerpo es común a 8 países. Si se quiere, una FAQ solo para Colombia en la plantilla |
| globología (AR) | «curso de globología» 390 (AR 320); 50 imp., pos. 9,6 | FAQ en decoración |
| presencial · cerca de mí | «curso de decoración con globos presencial» 270; 210 imp. | FAQ de modalidad en las 5 |
| online · en línea | «curso de globoflexia online» 80; 98 imp., pos. 7,1 | Meta de las 5 y FAQ; «en línea» en globoflexia, por México |
| gratis | «curso de globos gratis» 120, «de globoflexia gratis» 110; PAA en CO y MX | FAQ en las 5, sin cifras |
| clases | «clases de globos» 200 (CO 70), «clases de globoflexia» 100; 228 imp., pos. 16,7 | Una vez, en la FAQ de modalidad |
| para principiantes · desde cero | «curso de globos para principiantes» 120 (MX 50) | FAQ y `audience` |
| arreglos con globos | «cursos de arreglos de globos» 150 (MX 70) | Bouquets: `###`, `audience`, FAQ |
| globos largos · torsión | «globos largos» 6.350 (producto); «torsión» sin volumen propio | Como sinónimos en globoflexia, una o dos veces |
| taller | 95 imp., 49 de «taller de globoflexia para niños Málaga» (intención local) | Una vez, en decoración |
| con certificado | sin volumen medido; la plantilla ya tiene H2 y FAQ propios | Solo en la meta |
| a distancia · virtual | sin datos en Ads; 4 imp. | No entra |
| SENA (CO) | 79 imp.; «curso de decoración de eventos sena» 150 (CO 90) | No entra: solo Colombia y sin verificar la oferta del SENA. Va en `/co/cursos/` |
| ramo de globos · centros de mesa | informativas, del blog | No entran |

## 7. Datos estructurados frente a lo visible

| Campo del JSON-LD | ¿Coincide? | Nota |
|---|---|---|
| `name`, `educationalLevel` | Sí | — |
| `description` | Sí | Es la `short_description`; en globoflexia arrastra «50% de descuento aplicado en el enlace» |
| `offers.price` | Sí | 59,99 · 25,00 · 49,99 · 79,99 · 49,99 USD, igual que la caja de compra |
| `teaches` | Sí | Son los `learnings`; en flores incluye «centros de mesa» |
| `FAQPage` | Sí | FAQ del CMS más 3 de plantilla; 5 respuestas con precios a mano y una pregunta duplicada por ficha |
| `instructor` | Solo globoflexia | Hotmart público no nombra instructor (`hotmart_datos.json`) |
| `educationalCredentialAwarded` | Sí | «Certificado de estudios»; bouquets decía «constancia» |
| `aggregateRating` | Sí | Solo votos propios; en producción, 5/5 con 2 votos en globoflexia y flores |
| `image` | En producción sí | En local sale vacío en las 4 fichas antiguas: faltan sus portadas en ese entorno |
| `hasCourseInstance` | Incompleto | Sin `courseWorkload`, que Google pide para el resultado enriquecido de curso. Es de plantilla |

## 8. Fuera del parche (otros campos o plantilla)

1. Flores: `lessons_count` 31 frente a 28 lecciones en Hotmart; título del módulo «Estructuras, centros y bouquets» y lecciones «Centro con Telgopor / con CD».
2. Bouquets: el módulo del bono tiene 3 lecciones y la FAQ antigua decía 4 videos; conviene confirmar con el productor.
3. Decoración: el hero dice «9 videos» y el temario lista 17 filas, PDF incluidos. Confirmar que 9 es el número de videos.
4. Globoflexia: confirmar con el productor el nombre del instructor y los 23 videos.
5. Plantilla: `courseWorkload` en el schema y, si interesa, una FAQ por país con el sinónimo local.

## 9. Cómo medir

Dos a cuatro semanas después de publicar, en Search Console por consulta y página:

- «curso de globoflexia» en México: de posición 12 a las 10 primeras, y CTR de la ficha (hoy 2 clics en 428 impresiones).
- «curso de globos» y «curso de decoración con globos»: que pasen de las ciudades y de `/mx/curso-de-globoflexia/` a la ficha nueva.
- «curso de globología» en Argentina: que aparezca `/ar/curso-de-decoracion-con-globos/`.
- «curso de globos burbuja» en México: de posición 13 hacia la primera página.

## 10. No verificado

- Las `keywords` actuales se leyeron de `src/content/courses/*.mdx`, no del CMS: la ficha no las publica.
- Datos del curso tomados de la ficha sin contrastar hoy con Hotmart: 23 videos e instructor de globoflexia, 18 videos de burbuja, «más de 15 flores». Lo de «centro de flor» y las 28 lecciones de flores sale de las notas del mapa temático del 22-09, no de una consulta nueva.
- Que «globología» equivalga a decoración con globos se apoya en el blog del sitio y en el reparto por país de Ads y Search Console; no se revisó una SERP argentina.
- La ficha de decoración no tiene datos propios de Search Console: no está publicada.
- No se probó el parche en el CMS ni se vio renderizado. Los límites usados (8 FAQ, 5 a 8 `learnings`, 3 a 6 `audience`) son los del esquema antiguo de `content.config.ts`.
- `courseWorkload`: según la documentación de Google para el resultado de curso; no se pasó la prueba de resultados enriquecidos.
