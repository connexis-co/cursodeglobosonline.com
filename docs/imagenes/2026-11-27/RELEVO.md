# Relevo · fotos de cursodeglobosonline.com (27-nov-2026)

Estado en [`ENTREGA.md`](ENTREGA.md). PR #27 abierto contra `main`, sin fusionar (fusionar despliega a producción).

JP amplió el tope de gasto de USD 10 a 15 para rehacer tres fotos: `cover-bouquets`, `cover-burbuja` y
`como-inflar-un-globo-burbuja`. Tanda r6 (`prompts_r6.py`, `trabajos/r6.json`): candidatos en 16:9 en `cand/<hueco>/r6_*.png`.

Para terminar una portada cuadrada a partir de un 16:9 aprobado por los dos jueces:
1. Pedir al modelo que amplíe el lienzo a 1:1 (pared arriba, mesa abajo) con el 16:9 como referencia → `r7_amp.png`.
2. `python3 cuadrar.py cand/<hueco>/r6_x.png cand/<hueco>/r7_amp.png cand/<hueco>/r7_cuad.png` (vuelve a pegar la foto
   aprobada sobre el cuadrado).
3. Juez de realismo sobre el cuadrado (costuras, repeticiones, texto en lo añadido) y añadir a `export.json`.
4. `python3 exportar.py export.json`, `npm run build`, `python3 verificar_build.py <dist de main> dist`,
   `python3 antes_despues.py 7`, actualizar `ENTREGA.md`, commit y `gh pr edit 27`.

Claves en `~/.config/connexis/` (nunca imprimirlas). Gemini directo se queda sin crédito a ratos (402): usar
`"via": "openrouter"` en el trabajo; JP lo aprobó también para las referencias de Jenny.
