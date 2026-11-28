#!/usr/bin/env python3
"""prompts_r3.py → trabajos/r3.json. Tercera tanda: retoques que pidieron los jueces de r2, portada de bouquets con encuadre
abierto y las fotos con Jenny (pendientes de r2 por el corte de crédito de Gemini directo)."""
import json
from prompts import REF
from prompts_r2 import CAM, LUGAR, VALE, MANOS, NO, ED
T = [j for j in json.load(open('trabajos/r2.json')) if any('/' + k + '/' in j['out'] for k in ('cover-burbuja', 'decoracion-guirnalda', 'como-inflar-un-globo-burbuja'))]
E = {
 'como-inflar-globos-largos': ('16:9', 'cand/como-inflar-globos-largos/r2_b.png',
    "remove all lettering from the spines and covers of the stacked books on the upper right shelf, leaving plain "
    "solid-color spines with no marks. No text anywhere."),
 'arco-de-globos': ('16:9', 'cand/arco-de-globos/r2_b.png',
    "remove the extra orange balloon at the top of the cluster she is holding against the arch rod, so the cluster has "
    "exactly four round balloons in a clover: pink top-left, yellow top-right, orange bottom-left, teal bottom-right, knots "
    "tucked at the center against the rod. No text anywhere."),
 'og-default': ('16:9', 'cand/og-default/r2_a.png',
    "her hair: instead of a ponytail she wears her long wavy dark-brown hair with caramel balayage ends loose, falling "
    "behind her shoulders, exactly like the woman in the second reference image, whose face she has. Keep her face angle, "
    "smile, gold hoop earrings, pose, hands, apron, the balloon arch and the whole room identical. No text anywhere."),
 'cover-globoflexia': ('1:1', 'cand/cover-globoflexia/r2_a.png',
    "the framed print on the wall shelf: replace its content with an abstract print of soft organic shapes and leaves in "
    "muted colors, with no shape that could read as a letter (remove the navy N-shaped pot). No text anywhere."),
}
for k, (asp, src, p) in E.items():
    T.append({'out': f'cand/{k}/r3_ed.png', 'prompt': ED + p, 'aspecto': asp, 'modelo': 'gemini-3-pro-image', 'tam': '2K',
              'refs': [src] + ([REF['caro']] if k == 'og-default' else [])})
P = (CAM + LUGAR + VALE +
     "Wide shot from across the room, about four meters away: she is small in the frame, standing behind a white worktable "
     "in a bright home studio. The top of her head is at one third of the image height; the table top is at two thirds; the "
     "top third of the picture is only wall and a high shelf, the bottom third is the front of the table and the floor. On "
     "the table beside her stands a compact helium balloon bouquet: six round latex balloons (fuchsia, turquoise, sunny "
     "yellow, lilac, chrome gold, chrome rose gold) and one smooth gold foil star, floating low on short curled ribbons tied "
     "to one small round balloon weight wrapped in fuchsia tissue standing on the table top. The highest balloon is level "
     "with the top of her head. Her right hand gathers the ribbons just below the balloons; her left hand rests on the table "
     "next to the weight. On the table: three plain ribbon spools in fuchsia, turquoise and gold, small scissors. On the "
     "shelves behind her: plain clear glass jars with smooth sides, no labels and no embossing, filled with balloons sorted "
     "by color. Her face, both hands, the whole bouquet and the weight all lie inside the middle horizontal band of the "
     "square (between 25% and 75% of the height)." + MANOS + NO)
for v in 'ab':
    T.append({'out': f'cand/cover-bouquets/r3_{v}.png', 'prompt': P, 'aspecto': '1:1', 'modelo': 'gemini-3-pro-image', 'tam': '2K', 'refs': [REF['vale']]})
json.dump(T, open('trabajos/r3.json', 'w'), ensure_ascii=False, indent=1)
print(len(T), 'trabajos')
