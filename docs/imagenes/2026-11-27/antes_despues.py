#!/usr/bin/env python3
"""antes_despues.py — hoja antes/después: lee export.json y compara `git show main:<dest>` con el archivo actual."""
import io, json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont
B = os.path.dirname(os.path.abspath(__file__)); RAIZ = os.path.abspath(os.path.join(B, '..', '..', '..'))
J = json.load(open(os.path.join(B, 'export.json'))); W, H, P, L = 560, 315, 10, 26
f = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 16)
def caja(im):
    im = im.convert('RGB'); im.thumbnail((W, H)); c = Image.new('RGB', (W, H), (245, 245, 245)); c.paste(im, ((W - im.width) // 2, (H - im.height) // 2)); return c
N = int(sys.argv[1]) if len(sys.argv) > 1 else 9
for k in range(0, len(J), N):
    lote = J[k:k + N]; s = Image.new('RGB', (2 * W + 3 * P, len(lote) * (H + L + P) + P + 30), 'white'); d = ImageDraw.Draw(s)
    d.text((P, 6), 'ANTES', fill='black', font=f); d.text((W + 2 * P, 6), 'DESPUÉS', fill='black', font=f)
    for i, j in enumerate(lote):
        y = 30 + i * (H + L + P)
        antes = Image.open(io.BytesIO(subprocess.check_output(['git', '-C', RAIZ, 'show', 'main:' + j['dest']])))
        s.paste(caja(antes), (P, y)); s.paste(caja(Image.open(os.path.join(RAIZ, j['dest']))), (W + 2 * P, y))
        d.text((P, y + H + 4), j['dest'], fill='black', font=f)
    s.save(os.path.join(B, f'antes-despues-{k // N + 1}.jpg'), quality=84)
    print('hoja', k // N + 1)
