# Tarea para Claude Cowork — Solicitar indexación manual en Google Search Console

> Copia TODO el bloque "PROMPT" de abajo y pégalo en Claude Cowork (con acceso al navegador
> y la sesión de Google de connexis.co@gmail.com ya iniciada). La lista de URLs está priorizada:
> primero las páginas de curso, que hoy no rankean porque Google les da la autoridad a los hubs
> de ciudad y a las URLs viejas de WordPress (ver `docs/seo/2026-09-22_auditoria-seo-y-canibalizacion.md`).
>
> Límite de Google: ~10-12 solicitudes de indexación por día y por propiedad. La lista está
> partida en tandas diarias. Si GSC muestra "Se ha superado la cuota", se para y se sigue mañana.

---

## PROMPT

```
Eres mi asistente para Google Search Console. Trabaja SOLO en el navegador, en
https://search.google.com/search-console, propiedad "cursodeglobosonline.com" (tipo Dominio,
sc-domain:cursodeglobosonline.com). No cambies ninguna configuración, no borres nada, no
envíes ni quites sitemaps, no añadas usuarios. Tu única acción permitida es
"Inspeccionar URL" y "Solicitar indexación".

Para CADA URL de la tanda de hoy, en orden:
1. Pega la URL completa en la barra superior "Inspeccionar cualquier URL de ..." y pulsa Enter.
2. Espera a que cargue el resultado (puede tardar 10-60 s).
3. Anota el estado que muestra:
   - "La URL está en Google" / "URL is on Google"
   - "La URL no está en Google" / "URL is not on Google" (anota el motivo: "Rastreada: actualmente
     sin indexar", "Descubierta: actualmente sin indexar", "Página alternativa con etiqueta
     canónica adecuada", etc.)
   - "URL canónica seleccionada por Google" (si es distinta de la inspeccionada, anótala)
4. Pulsa "Solicitar indexación" (Request indexing) aunque ya esté en Google — así Google vuelve a
   rastrear la versión nueva (títulos, datos estructurados y enlaces nuevos).
5. Espera el cuadro "Solicitud de indexación enviada" y ciérralo (botón "Entendido"/"Got it").
6. Si aparece "Se ha superado la cuota" / "Quota exceeded": DETENTE, no insistas, y reporta en
   qué URL quedaste.
7. Si aparece un error de prueba en vivo, pulsa "Reintentar" una sola vez; si vuelve a fallar,
   anótalo y pasa a la siguiente.

Al terminar, dame una tabla: URL | estado antes | canónica elegida por Google | indexación
solicitada (sí/no) | observaciones. Guarda la tabla en un mensaje final.

TANDA DE HOY: <pega aquí la tanda del día>
```

---

## Tandas (orden de prioridad)

### Día 1 — money pages de Colombia + home (lo más urgente)
```
https://cursodeglobosonline.com/co/curso-de-globos-burbuja/
https://cursodeglobosonline.com/co/curso-de-globoflexia/
https://cursodeglobosonline.com/co/curso-de-flores-con-globos/
https://cursodeglobosonline.com/co/curso-de-bouquets-de-globos/
https://cursodeglobosonline.com/
https://cursodeglobosonline.com/co/
https://cursodeglobosonline.com/co/cursos/
https://cursodeglobosonline.com/blog/
https://cursodeglobosonline.com/mx/curso-de-globoflexia/
https://cursodeglobosonline.com/mx/curso-de-globos-burbuja/
```

### Día 2 — México y Perú (mercados con más volumen tras CO)
```
https://cursodeglobosonline.com/mx/curso-de-flores-con-globos/
https://cursodeglobosonline.com/mx/curso-de-bouquets-de-globos/
https://cursodeglobosonline.com/mx/
https://cursodeglobosonline.com/pe/curso-de-globoflexia/
https://cursodeglobosonline.com/pe/curso-de-globos-burbuja/
https://cursodeglobosonline.com/pe/curso-de-flores-con-globos/
https://cursodeglobosonline.com/pe/curso-de-bouquets-de-globos/
https://cursodeglobosonline.com/co/cursos/decoracion-con-globos/
https://cursodeglobosonline.com/mx/cursos/
https://cursodeglobosonline.com/pe/
```

### Día 3 — Argentina, Chile y Ecuador
```
https://cursodeglobosonline.com/ar/curso-de-globoflexia/
https://cursodeglobosonline.com/ar/curso-de-globos-burbuja/
https://cursodeglobosonline.com/ar/curso-de-flores-con-globos/
https://cursodeglobosonline.com/ar/curso-de-bouquets-de-globos/
https://cursodeglobosonline.com/cl/curso-de-globoflexia/
https://cursodeglobosonline.com/cl/curso-de-globos-burbuja/
https://cursodeglobosonline.com/cl/curso-de-flores-con-globos/
https://cursodeglobosonline.com/cl/curso-de-bouquets-de-globos/
https://cursodeglobosonline.com/ec/curso-de-globoflexia/
https://cursodeglobosonline.com/ec/curso-de-globos-burbuja/
```

### Día 4 — España, EE. UU. y Ecuador (resto)
```
https://cursodeglobosonline.com/es/curso-de-globoflexia/
https://cursodeglobosonline.com/es/curso-de-globos-burbuja/
https://cursodeglobosonline.com/es/curso-de-flores-con-globos/
https://cursodeglobosonline.com/es/curso-de-bouquets-de-globos/
https://cursodeglobosonline.com/us/curso-de-globoflexia/
https://cursodeglobosonline.com/us/curso-de-globos-burbuja/
https://cursodeglobosonline.com/us/curso-de-flores-con-globos/
https://cursodeglobosonline.com/us/curso-de-bouquets-de-globos/
https://cursodeglobosonline.com/ec/curso-de-flores-con-globos/
https://cursodeglobosonline.com/ec/curso-de-bouquets-de-globos/
```

### Días 5 en adelante — artículos del blog
Ver la sección "Artículos del blog" al final (se generan con el lanzamiento del blog; primero
los pilares, luego los satélites de mayor volumen).

<!-- BLOG_URLS -->

---

## Por qué a mano y no por API

La API de Indexing de Google solo admite oficialmente páginas de ofertas de empleo y
transmisiones en vivo; usarla para cursos o artículos no está soportado. Lo automatizable ya
está hecho: sitemap enviado por API de Search Console, IndexNow (Bing, Yandex, Seznam, Naver,
Yep) y Bing Webmaster API. La solicitud manual en GSC es el complemento para Google.
