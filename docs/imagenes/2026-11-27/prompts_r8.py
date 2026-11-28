#!/usr/bin/env python3
"""prompts_r8.py → trabajos/r8.json. Burbuja completamente llena de globos pequeños (sin mitad vacía, que es donde el
generador inventa globos fantasma y reflejos)."""
import json
from prompts import REF, REFJ
from prompts_r2 import CAM, MANOS
from prompts_r6 import VALE, JENNY, MARGEN
from prompts_r7 import SALA, NO
BURB = ("The bubble balloon is one 24-inch round clear bubble completely packed with about thirty small 5-inch latex balloons "
        "that fill the entire sphere right up to the top, pressed against the plastic, so there is no empty space inside it "
        "at all. The small balloons are matte, powdery latex in solid fuchsia, turquoise, yellow, orange and lilac, each with "
        "only one tiny soft highlight; nothing is reflected on them or on the plastic: no windows, rooms, trees, faces or "
        "people, and no faint or pale extra balloons. The clear skin only adds a thin glossy rim. ")
J = {
 'cover-burbuja': ('jenny', CAM + SALA + JENNY +
    "Waist-up, she stands at a white worktable, beside (not behind) a finished stuffed bubble balloon that sits on a short "
    "white cylindrical gift-box base decorated with a big fuchsia satin bow. " + BURB +
    "The bubble is at the height of her face. Both her hands are below the bubble: the right hand steadies the white base, "
    "the left hand fluffs one loop of the satin bow; no arm passes behind the bubble. On the table: a white bowl of small "
    "inflated balloons, one plain ribbon spool, scissors." + MANOS + MARGEN + NO),
 'como-inflar-un-globo-burbuja': ('vale', CAM + SALA + VALE +
    "Waist-up, she sits at a white table next to a bubble balloon she has just stuffed and inflated, which rests on a thin "
    "white plastic ring stand on the table, to her side. " + BURB +
    "The bubble's short clear neck, a clear plastic tube about 3 cm wide, points toward the camera at the lower front of "
    "the bubble, twisted once and closed with a small plain white plastic clip, sharp and clearly visible. To the right on "
    "the table, away from the bubble, a compact electric balloon inflator: a small smooth white box with exactly two short "
    "conical nozzles on top and a power cord, nothing attached to the nozzles. She does not touch the bubble or the "
    "inflator: she holds a length of fuchsia satin ribbon between her two hands above the table and smiles at the bubble. "
    "No arm passes behind the bubble." + MANOS + MARGEN + NO),
}
T = [{'out': f'cand/{k}/r8_{v}.png', 'prompt': p, 'aspecto': '16:9', 'modelo': 'gemini-3-pro-image', 'tam': '2K',
      'refs': REFJ if q == 'jenny' else [REF[q]], 'via': 'openrouter'} for k, (q, p) in J.items() for v in 'ab']
if __name__ == '__main__':
    json.dump(T, open('trabajos/r8.json', 'w'), ensure_ascii=False, indent=1); print(len(T), 'trabajos')
