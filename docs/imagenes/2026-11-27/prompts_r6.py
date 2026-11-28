#!/usr/bin/env python3
"""prompts_r6.py → trabajos/r6.json. JP amplió el tope para rehacer las tres fotos que faltaban. Las portadas se componen en
16:9 (todo cabe en el recorte de las tarjetas) y después se amplía el lienzo a cuadrado; «cómo inflar un globo burbuja»
muestra la burbuja recién inflada sobre la mesa, sin manos sobre el plástico."""
import json
from prompts import REF, REFJ, IDJ
from prompts_r2 import CAM, LUGAR, NO, MANOS, CARA, DEL
VALE = (f"The woman is exactly the person in the reference sheet: same face, same small mole, same gold hoop earrings, same "
        f"long dark brown wavy hair with caramel balayage ends, worn loose over her shoulders. Latina, early thirties, plain "
        f"white t-shirt under {DEL}. " + CARA)
JENNY = ("The woman is exactly the person in the three reference photos (same face, same features, same earrings, same body). "
         + IDJ + f" Her long straight jet-black hair is worn loose, tucked behind her ears and falling behind her shoulders. "
         f"Plain white t-shirt under {DEL}. " + CARA)
MARGEN = (" Wide 16:9 composition: her whole head, both hands and the whole balloon piece from its top to its base are fully "
          "inside the frame, with a clear margin of plain wall above and of table surface below; nothing important touches "
          "an edge.")
J = {
 'cover-bouquets': ('vale', CAM + LUGAR + VALE +
    "Waist-up, she stands behind a white worktable in a bright home studio. On the table beside her stands a compact "
    "tabletop helium balloon bouquet: five round latex balloons (fuchsia, turquoise, sunny yellow, lilac, chrome rose gold) "
    "and one smooth gold foil star, floating low and close together on short curled ribbons about 25 cm long, all tied to "
    "one small round balloon weight wrapped in fuchsia tissue that sits on the table. The highest balloon is level with the "
    "top of her head. Her right hand gathers the ribbons just above the weight; her left hand rests on the table next to "
    "the weight. On the table: three plain ribbon spools in fuchsia, turquoise and gold, small scissors. On the shelves "
    "behind her: plain smooth clear glass jars with no labels and no embossing, filled with balloons sorted by color." +
    MANOS + MARGEN + NO),
 'cover-burbuja': ('jenny', CAM + LUGAR + JENNY +
    "Waist-up, she stands at a white worktable in a bright home studio, beside (not behind) a finished stuffed bubble "
    "balloon: one large crystal-clear 24-inch round bubble balloon, perfectly smooth, filled in its lower half with many "
    "small 5-inch latex balloons in fuchsia, turquoise, yellow, orange, lilac and chrome gold, sitting on a short white "
    "cylindrical gift-box base decorated with a big fuchsia satin bow. The bubble is at the height of her face. The clear "
    "plastic is clean: through its upper half you see only the plain wall behind it, with small soft highlights and no "
    "reflections of faces, people, windows or rooms. Both her hands are below the bubble: the right hand steadies the white "
    "base, the left hand fluffs one loop of the satin bow; no arm passes behind the bubble. On the table: a white bowl of "
    "small inflated balloons, one plain ribbon spool, scissors." + MANOS + MARGEN + NO),
 'como-inflar-un-globo-burbuja': ('vale', CAM + LUGAR + VALE +
    "Waist-up, she stands behind a white worktable in a bright home studio, looking at a bubble balloon she has just "
    "inflated. The bubble stands on the table to her side, with only plain wall behind it: one crystal-clear 24-inch round "
    "bubble balloon, taut and smooth, resting on a low white ring so it does not roll, its short neck pointing up and "
    "closed with a small plain white clip, and inside it seven small 5-inch latex balloons in fuchsia, turquoise, yellow, "
    "orange and chrome gold. The clear plastic shows only the wall behind it and small soft highlights, no reflections of "
    "faces or rooms. Next to the bubble on the table sits a compact electric balloon inflator: a small smooth white box "
    "with exactly two short conical nozzles on top and a power cord, no label. Her hands do not touch the bubble: her right "
    "hand holds a loose length of fuchsia satin ribbon, her left hand rests flat on the table. Also on the table: a white "
    "bowl with small inflated balloons and a small dish of metallic confetti. No arm passes behind the bubble." +
    MANOS + MARGEN + NO),
}
T = [{'out': f'cand/{k}/r6_{v}.png', 'prompt': p, 'aspecto': '16:9', 'modelo': 'gemini-3-pro-image', 'tam': '2K',
      'refs': REFJ if q == 'jenny' else [REF[q]], 'via': 'openrouter'} for k, (q, p) in J.items() for v in 'ab']
if __name__ == '__main__':
    json.dump(T, open('trabajos/r6.json', 'w'), ensure_ascii=False, indent=1); print(len(T), 'trabajos')
