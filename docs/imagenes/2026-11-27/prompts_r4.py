#!/usr/bin/env python3
"""prompts_r4.py → trabajos/r4.json. Cuarta y última tanda: retoques pedidos por los jueces de r3 y un nuevo intento de
«cómo inflar un globo burbuja» con un momento más simple (burbuja recién inflada, cuello pellizcado, inflador en la mesa)."""
import json
from prompts import REFJ
from prompts_r2 import CAM, LUGAR, JENNY, MANOS, NO, ED, CENTRO
E = {
 'cover-bouquets': ('1:1', 'cand/cover-bouquets/r3_b.png',
    "Zoom out: shrink the whole scene to about 78% of its size, keep it centered, and extend the picture on all sides with "
    "the same room (more plain wall above, more white table surface at the bottom, more shelf on the right, more window on "
    "the left) so that her face, both hands, the gold foil star and the whole magenta balloon weight lie between 25% and "
    "75% of the image height. Keep her face, hands, balloons, jars and spools identical. No labels, no text anywhere."),
 'decoracion-guirnalda': ('4:3', 'cand/decoracion-guirnalda/r2_b.png', ED +
    "1) make the yellow balloon she is placing much smaller: a small 5-inch latex balloon, about half the diameter of the "
    "coral balloons around it, pressed into the gap between the pink and coral balloons; 2) replace the white tape roll in "
    "her other hand with a small flat roll of balloon glue dots (a narrow white backing strip with small clear round "
    "adhesive dots). Change nothing else. No text anywhere."),
 'cover-burbuja': ('1:1', 'cand/cover-burbuja/r2_b.png', ED +
    "erase the faint ghost face and the washed-out duplicate pastel balloons in the upper half of the clear bubble balloon; "
    "the upper half must be clean transparent plastic showing only the soft wall and window behind it, with natural "
    "highlights. Keep the small balloons in the lower half, the woman, her face, her hands, the bow and the base exactly as "
    "they are. No text anywhere."),
 'arco-de-globos': ('16:9', 'cand/arco-de-globos/r2_b.png', ED +
    "remove only the orange balloon at the top-back of the cluster she holds (the one between the pink and the yellow "
    "balloons), filling that area with plain wall and the white arch pole, so the cluster is exactly four balloons (pink, "
    "yellow, orange, teal) joined at one center knot touching the arch pole. Do not touch her hands, arms, face or any "
    "other balloon. No text anywhere."),
}
T = [{'out': f'cand/{k}/r4_ed.png', 'prompt': p, 'aspecto': a, 'modelo': 'gemini-3-pro-image', 'tam': '2K', 'refs': [s]} for k, (a, s, p) in E.items()]
P = (CAM + LUGAR + JENNY +
     "Waist-up, she stands at a white worktable holding up a just-inflated crystal-clear 24-inch bubble balloon in front of "
     "her chest, a little to her side so it does not hide her face. The bubble is round, taut and smooth, clean transparent "
     "plastic with soft highlights and nothing reflected in it, and inside it are seven small 5-inch latex balloons in "
     "fuchsia, turquoise, yellow, orange and chrome gold resting at the bottom. With her right hand she pinches the "
     "bubble's short narrow neck closed between thumb and index finger, the neck pointing down; her left hand supports "
     "the bubble from below on the other side, open palm. On the table, not touching her hands: a compact electric balloon "
     "inflator (a small smooth white box with two short conical nozzles on top, no label), a white bowl with more small "
     "inflated balloons, a small dish of metallic confetti and one ribbon spool. Neither arm passes behind or inside the "
     "bubble." + MANOS + CENTRO + NO)
T += [{'out': f'cand/como-inflar-un-globo-burbuja/r4_{v}.png', 'prompt': P, 'aspecto': '16:9', 'modelo': 'gemini-3-pro-image', 'tam': '2K', 'refs': REFJ} for v in 'ab']
if __name__ == '__main__':
    json.dump(T, open('trabajos/r4.json', 'w'), ensure_ascii=False, indent=1); print(len(T), 'trabajos')
