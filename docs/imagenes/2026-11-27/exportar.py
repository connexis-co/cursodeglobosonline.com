#!/usr/bin/env python3
"""exportar.py export.json — recorta cada candidato aprobado al hueco del sitio (mismo nombre, tamaño y proporción).

export.json: [{"hueco": "...", "src": "cand/.../x.png" | ruta absoluta, "dest": "public/…jpg" (relativa a la raíz del repo),
  "tam": [ancho, alto], "caja": [x0, y0, x1, y1] | null (null = recorte centrado a la proporción de destino), "q": 82}]
Guarda además final/<hueco>.jpg (copia de lo exportado) para la hoja antes/después.
"""
import json, os, sys
from PIL import Image
B = os.path.dirname(os.path.abspath(__file__)); RAIZ = os.path.abspath(os.path.join(B, '..', '..', '..'))
for j in json.load(open(sys.argv[1])):
    src = j['src'] if os.path.isabs(j['src']) else os.path.join(B, j['src'])
    im = Image.open(src).convert('RGB'); W, H = im.size; w, h = j['tam']; r = w / h
    if j.get('caja'):
        x0, y0, x1, y1 = j['caja']
        assert abs((x1 - x0) / (y1 - y0) - r) < .01, (j['hueco'], 'la caja no tiene la proporción del destino')
    elif W / H > r:
        n = round(H * r); x0, y0, x1, y1 = (W - n) // 2, 0, (W - n) // 2 + n, H
    else:
        n = round(W / r); x0, y0, x1, y1 = 0, (H - n) // 2, W, (H - n) // 2 + n
    out = im.crop((x0, y0, x1, y1)).resize((w, h), Image.LANCZOS)
    dest = os.path.join(RAIZ, j['dest'])
    out.save(dest, quality=j.get('q', 82), optimize=True, progressive=True)
    os.makedirs(os.path.join(B, 'final'), exist_ok=True)
    print(j['hueco'], out.size, os.path.getsize(dest) // 1024, 'KB')
