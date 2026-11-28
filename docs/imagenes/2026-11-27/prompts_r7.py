#!/usr/bin/env python3
"""prompts_r7.py → trabajos/r7.json. Burbujas con pared blanca lisa detrás (lo que se ve a través del plástico se leía como
globos fantasma) y ampliación a cuadrado de la portada de bouquets aprobada en 16:9."""
import json
from prompts import REF, REFJ
from prompts_r2 import CAM, MANOS
from prompts_r6 import VALE, JENNY, MARGEN
SALA = ("A bright, clean, contemporary middle-class room with a completely plain, empty white wall filling the whole background "
        "behind the table: no plants, no frames, no shelves, no furniture and no window anywhere in the frame; the daylight "
        "comes from a window behind the camera. ")
BURB = ("The bubble balloon is one crystal-clear 24-inch round bubble, taut and smooth. Inside it, about twelve small 5-inch "
        "latex balloons rest piled in its LOWER half: matte powdery latex in fuchsia, turquoise, yellow, orange and lilac, "
        "plain solid colors with one tiny soft highlight each and nothing reflected on them. The UPPER half of the bubble is "
        "empty: clean transparent plastic through which only the plain white wall is seen, with two small soft highlights and "
        "no reflections of windows, rooms, trees, faces or people, and no faint or pale extra balloons. ")
NO = (" Absolutely no text, letters, numbers, logos, watermarks, labels or stickers anywhere; every object is completely "
      "plain. Nothing on the floor.")
J = {
 'cover-burbuja': ('jenny', CAM + SALA + JENNY +
    "Waist-up, she stands at a white worktable, beside (not behind) a finished stuffed bubble balloon that sits on a short "
    "white cylindrical gift-box base decorated with a big fuchsia satin bow. " + BURB +
    "The bubble is at the height of her face. Both her hands are below the bubble: the right hand steadies the white base, "
    "the left hand fluffs one loop of the satin bow; no arm passes behind the bubble. On the table: a white bowl of small "
    "inflated balloons, one plain ribbon spool, scissors." + MANOS + MARGEN + NO),
 'como-inflar-un-globo-burbuja': ('vale', CAM + SALA + VALE +
    "Waist-up, she sits at a white table next to a bubble balloon she has just inflated, which rests on a low white plastic "
    "ring stand on the table, to her side. " + BURB +
    "The bubble's short clear neck sticks out at the bottom-front, twisted and closed with a small plain white plastic "
    "clip, clearly visible. Next to the bubble on the table sits a compact electric balloon inflator: a small smooth white "
    "box with exactly two short conical nozzles on top, both fully visible and not touching the bubble, with a power cord. "
    "She does not touch the bubble: she holds a length of fuchsia satin ribbon between her two hands and smiles at the "
    "bubble. No arm passes behind the bubble." + MANOS + MARGEN + NO),
}
T = [{'out': f'cand/{k}/r7_{v}.png', 'prompt': p, 'aspecto': '16:9', 'modelo': 'gemini-3-pro-image', 'tam': '2K',
      'refs': REFJ if q == 'jenny' else [REF[q]], 'via': 'openrouter'} for k, (q, p) in J.items() for v in 'ab']
AMP = ("Extend this photo to a square picture. Keep the whole original photo exactly as it is, at the same scale, as the "
       "horizontal middle band of the square, and only add new picture above and below it: above, the same plain wall and "
       "shelf continuing upward to the ceiling line; below, the same white worktable continuing toward the camera, then its "
       "front edge and the floor. Do not move, crop, redraw or restyle anything of the original photo: the woman, her face, "
       "her hands, the balloon bouquet, the weight, the jars and the spools stay identical. No text, labels or logos in the "
       "new areas, and no new objects or people.")
T.append({'out': 'cand/cover-bouquets/r7_amp.png', 'prompt': AMP, 'aspecto': '1:1', 'modelo': 'gemini-3-pro-image', 'tam': '2K',
          'refs': ['cand/cover-bouquets/r6_a.png'], 'via': 'openrouter'})
if __name__ == '__main__':  # solo al ejecutarlo directamente
    json.dump(T, open('trabajos/r7.json', 'w'), ensure_ascii=False, indent=1); print(len(T), 'trabajos')
