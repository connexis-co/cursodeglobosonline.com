#!/usr/bin/env python3
"""cuadrar.py <base_16x9.png> <ampliada_1x1.png> <salida.png> — portada cuadrada a partir de una foto 16:9 ya aprobada.

El modelo amplía el lienzo (pared arriba, mesa abajo); aquí se localiza la foto original dentro del cuadrado (escala y
desplazamiento por mínima diferencia) y se vuelve a pegar encima con los bordes difuminados, para que la banda central 16:9
(cara, manos, pieza) sea la foto que juzgaron los jueces y no una versión regenerada."""
import sys
import numpy as np
from PIL import Image
base, amp, out = sys.argv[1:4]
S = Image.open(base).convert('RGB'); O = Image.open(amp).convert('RGB'); W, H = O.size
g = lambda im, k: np.asarray(im.convert('L').resize((im.width // k, im.height // k), Image.BILINEAR), dtype=np.float32)
K = 8; Og = g(O, K); mejor = None
for esc in [x / 1000 for x in range(940, 1061, 10)]:
    w = round(W * esc); h = round(w * S.height / S.width); Sg = g(S.resize((w, h), Image.BILINEAR), K); sh, sw = Sg.shape
    for dy in range(0, Og.shape[0] - sh + 1):
        for dx in range(max(0, (Og.shape[1] - sw) // 2 - 6), min(Og.shape[1] - sw, (Og.shape[1] - sw) // 2 + 6) + 1) if sw <= Og.shape[1] else []:
            d = float(np.abs(Og[dy:dy + sh, dx:dx + sw] - Sg).mean())
            if mejor is None or d < mejor[0]:
                mejor = (d, esc, dx * K, dy * K, w, h)
d, esc, x0, y0, w, h = mejor
print(f'diferencia media {d:.1f} (0-255) · escala {esc:.3f} · posición x {x0}, y {y0} · banda {w}x{h}')
P = S.resize((w, h), Image.LANCZOS); F = 36
a = np.ones((h, w), np.float32)
r = np.linspace(0, 1, F, dtype=np.float32)
a[:F, :] *= r[:, None]; a[-F:, :] *= r[::-1][:, None]
if x0 > 0 or x0 + w < W:
    a[:, :F] *= r[None, :]; a[:, -F:] *= r[::-1][None, :]
R = O.copy(); R.paste(P, (x0, y0), Image.fromarray((a * 255).astype('uint8')))
R.save(out); print('ok', out, R.size, '· banda 16:9 centrada del cuadrado:', (H - round(W * 9 / 16)) // 2, 'a', (H + round(W * 9 / 16)) // 2, '· foto original de y', y0, 'a', y0 + h)
