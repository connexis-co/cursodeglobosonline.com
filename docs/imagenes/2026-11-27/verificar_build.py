#!/usr/bin/env python3
"""verificar_build.py <dist-antes> <dist-despues> — comprueba que el cambio de fotos no altera el layout ni rompe páginas.

Compara, página por página, cada <img>/<source>: mismos atributos width, height, class, sizes, loading y mismo número de
imágenes (las rutas con hash de /_astro/ cambian y se ignoran). Verifica además que cada src/srcset local exista en dist y
lista las diferencias de texto fuera de alt/src (no debería haber ninguna)."""
import os, re, sys
A, D = sys.argv[1], sys.argv[2]
IMG = re.compile(r'<(img|source)\b[^>]*>', re.I)
def attrs(t):
    return dict(re.findall(r'([\w:-]+)="([^"]*)"', t))
def norm(html):
    out = []
    for m in IMG.finditer(html):
        a = attrs(m.group(0)); out.append(tuple(a.get(k, '') for k in ('width', 'height', 'class', 'sizes', 'loading', 'fetchpriority')))
    return out
def sin_fotos(html):
    html = re.sub(r'/_astro/[\w.\-~]+\.(?:jpg|jpeg|png|webp|avif|css|js)', 'IMG', html)
    html = re.sub(r'alt="[^"]*"', 'alt=""', html)
    html = re.sub(r'"(?:description|caption|name)":"[^"]*"', '""', html) if False else html
    return html
pags = dif = rotas = texto = 0
for r, _, fs in os.walk(D):
    for f in fs:
        if not f.endswith('.html'):
            continue
        p = os.path.join(r, f); rel = os.path.relpath(p, D); q = os.path.join(A, rel); pags += 1
        h = open(p, encoding='utf8').read()
        if not os.path.exists(q):
            print('PÁGINA NUEVA', rel); dif += 1; continue
        h0 = open(q, encoding='utf8').read()
        if norm(h) != norm(h0):
            print('LAYOUT DISTINTO', rel); dif += 1
        if sin_fotos(h) != sin_fotos(h0):
            texto += 1
            if texto <= 5:
                print('TEXTO DISTINTO (fuera de src/alt)', rel)
        for m in IMG.finditer(h):
            a = attrs(m.group(0))
            for u in [a.get('src', '')] + [x.strip().split(' ')[0] for x in a.get('srcset', '').split(',')]:
                if u.startswith('/') and not u.startswith('//') and not os.path.exists(os.path.join(D, u.lstrip('/'))):
                    print('IMAGEN ROTA', rel, u); rotas += 1
antes = sum(f.endswith('.html') for _, _, fs in os.walk(A) for f in fs)
print(f'páginas: antes {antes}, después {pags} · layout distinto: {dif} · imágenes rotas: {rotas} · páginas con texto distinto fuera de src/alt: {texto}')
