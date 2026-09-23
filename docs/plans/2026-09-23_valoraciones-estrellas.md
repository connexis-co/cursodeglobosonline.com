# Plan 2026-09-23 — Estrellas propias (estilo kk Star Ratings) y `aggregateRating`

> Petición de JP: «las estrellas deben ir obligatorio, impleméntalas y el dato estructurado como
> tal; además implementa un mecanismo para que las personas puedan calificar con estrellas ese
> curso, así como el plugin de WordPress kk Star Ratings».

## 1. Objetivo

Que cada ficha de curso muestre estrellas y deje votar de 1 a 5 con un clic, y que la media y
el número de votos salgan en el JSON-LD como `aggregateRating`, apto para el review snippet de
Google.

## 2. Decisiones

1. **Solo votos propios del sitio.** Google permite `aggregateRating` con valoraciones recogidas
   en la propia página, pero prohíbe agregar las de otros sitios. La valoración de Hotmart
   sigue visible y enlazada a su fuente, aparte y nunca en el schema.
2. **Arquitectura:** el sitio sigue siendo estático. Hay una única Pages Function
   (`functions/api/ratings.ts`) sobre Cloudflare D1 (`cursodeglobosonline-ratings`, y
   `…-ratings-preview` para previews). Toda la configuración está en `wrangler.jsonc` y las
   migraciones en `migrations/`. `_routes.json` (generado) solo invoca la función en
   `/api/ratings`: las demás páginas no pasan por ningún Worker.
3. **SEO en el build:** `src/lib/ratings.ts` lee `/api/ratings` de producción al compilar. El
   HTML visible y el `aggregateRating` usan el mismo dato, y el widget lo refresca en vivo.
   Si la API falla se usa el último `/ratings-snapshot.json` publicado; si tampoco hay, se
   compila sin estrellas en vez de romper el deploy (salvo con `RATINGS_REQUIRED=1`).
4. **Recompilación diaria** (`ratings-refresh.yml`): compara `/api/ratings` con
   `/ratings-snapshot.json` y solo despliega si cambiaron. Después avisa por IndexNow de las
   32 fichas canónicas.
5. **Anti-abuso sin fricción:** peticiones solo del mismo origen; un voto por navegador y curso,
   que se puede cambiar (UUID aleatorio en `localStorage`); como máximo 3 votantes distintos por
   IP y curso (familias y CGNAT móvil). El tope se aplica dentro del mismo `INSERT … WHERE`, así
   que no hay carreras entre lectura y escritura. Validación estricta del cuerpo (≤ 512 bytes).
6. **Privacidad:** no se guardan IP. `voter` e `ip_hash` son HMAC-SHA256 con el secreto
   `RATING_SALT` (secreto del proyecto de Pages, distinto en producción y en preview). La
   política de privacidad se actualizó (sección 3).
7. **Accesibilidad:** 5 botones con `aria-label` («4 de 5 estrellas: Muy bueno»), `aria-pressed`
   en tu voto, región `aria-live` para el resultado, foco visible, objetivos de 32 px y respeto
   de `prefers-reduced-motion`. Sin JS, las estrellas se ven pero no se puede votar.
8. **Medición:** evento `rate_course` (course_slug, rating, previous_rating) en dataLayer/GA4.
9. **Sin votos sembrados.** `MIN_VOTES_FOR_SCHEMA = 1`: el `aggregateRating` aparece con el
   primer voto real.

## 3. Riesgos

| Riesgo | Mitigación |
|---|---|
| Relleno de votos desde muchas IP | Tope por IP y curso, un voto por navegador y datos auditables en D1. Si pasa, añadir Turnstile. |
| El token de CI no tiene permiso sobre D1 y el deploy con bindings falla | Producción queda en la versión anterior, sin caída. Se ve en el primer deploy tras el merge. |
| Estrellas «atrasadas» en el HTML frente a la API | El widget refresca en vivo y el schema se actualiza en la recompilación diaria. |
| Un curso nuevo sin registrar en `RATEABLE_COURSES` | `assertRateable` corta el build con un mensaje claro. |

## 4. Resultado (2026-09-23)

- API probada con `scripts/test-ratings.mjs` (28 comprobaciones) en local (D1 local) y en un
  preview real de Cloudflare (D1 de preview, secreto y caché de borde): todo OK. La prueba corre
  en cada PR (`ci.yml`) sin credenciales.
- Con votos, el build publica `aggregateRating`. Ejemplo local: 3 votos → `ratingValue` 3.7 y
  «3,7 de 5 · 3 votos» visible, estrellas en las tarjetas del catálogo y línea en `llms.txt`.
- Widget verificado en escritorio y en móvil (375 px sin desbordamiento): vista previa al pasar el
  cursor, voto, cambio de voto, sincronía entre los dos widgets, tope por IP con mensaje claro y
  evento `rate_course`.
- Migración aplicada en las D1 de producción y de preview. Secreto `RATING_SALT` configurado en
  los dos entornos.

**Revisión de Copilot (PR #20), 4 hallazgos corregidos:**

1. *Crítico:* un fallo pasajero de la API durante la recompilación diaria habría publicado un
   build sin estrellas. Ahora el build cae al snapshot publicado; con `RATINGS_REQUIRED=1`
   (workflow diario) falla si no hay datos, y antes del deploy se comprueba que el build trae al
   menos los votos leídos en vivo (los votos nunca bajan).
2. El límite del cuerpo contaba caracteres UTF-16: ahora cuenta bytes (`Content-Length` y
   `arrayBuffer`), con prueba de 300 «ñ».
3. El GET de refresco podía pisar un voto recién guardado: los cursos votados en la visita ya
   no se repintan con ese GET.
4. Los builds de staging leían los votos de producción mientras su widget usa la D1 de preview:
   staging compila con `RATINGS_API_URL=off`.

**Pendiente de JP:** conseguir los primeros votos reales (p. ej. pedir a alumnas y contactos de
WhatsApp que califiquen el curso que tomaron). Si se conserva la base de datos del WordPress
anterior con kk Star Ratings (`wp_postmeta`: `_kksr_casts`, `_kksr_ratings`), se pueden importar
como votos históricos del dominio, documentando su procedencia.
