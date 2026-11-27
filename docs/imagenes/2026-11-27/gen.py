#!/usr/bin/env python3
"""gen.py trabajos.json — fotos del sitio con Gemini (adaptado del guion de sably.co/fotos-cursos).

trabajos.json: [{"out": "cand/<hueco>/a.png", "prompt": "…", "aspecto": "1:1" | "16:9" | "4:3",
  "modelo": "gemini-3-pro-image" | "gemini-nano-banana-2.1", "tam": "2K", "refs": ["/ruta/absoluta.png", …]}]
Si "out" existe no se regenera. La clave se lee de ~/.config/connexis/media-ia.env y nunca se imprime.
Registro y tope propios: gasto.csv de esta carpeta, tope duro USD 10.
"""
import base64, concurrent.futures as cf, csv, datetime, fcntl, json, os, sys, time, urllib.error, urllib.request
B = os.path.dirname(os.path.abspath(__file__))
G = 'https://generativelanguage.googleapis.com/v1beta/'
CSV, TOPE = os.path.join(B, 'gasto.csv'), 10.0
TAR = {'gemini-nano-banana-2.1': (1.5e-6, 30e-6, 7.5e-6, {'1K': .0336, '2K': .0504, '4K': .113}),
       'gemini-3-pro-image': (2e-6, 120e-6, 12e-6, {'1K': .134, '2K': .134, '4K': .24})}


def clave(n, f='media-ia.env'):
    for l in open(os.path.expanduser('~/.config/connexis/' + f)):
        if l.strip().startswith(n + '='):
            return l.split('=', 1)[1].strip().strip('"\'')
    raise SystemExit('falta la clave ' + n)


def gem(ruta, body):
    for i in range(4):
        try:
            rq = urllib.request.Request(G + ruta, json.dumps(body).encode(), {'Content-Type': 'application/json', 'x-goog-api-key': clave('GEMINI_API_KEY')})
            return json.load(urllib.request.urlopen(rq, timeout=400))
        except urllib.error.HTTPError as e:
            msg = e.read()[:600].decode(errors='replace')
            if e.code in (429, 500, 502, 503) and i < 3 and 'spending cap' not in msg:
                time.sleep(25 * (i + 1)); continue
            raise RuntimeError(f'{e.code} {msg}')


def openrouter(M, prompt, refs, aspecto, tam):
    """Mismo modelo por OpenRouter (se usó cuando se agotó el crédito prepago de Gemini directo). Devuelve (png, usd)."""
    cont = [{'type': 'text', 'text': prompt}] + [{'type': 'image_url', 'image_url': {'url': 'data:image/' + ('png' if r.endswith('png') else 'jpeg') + ';base64,' + b64f(r)}} for r in refs]
    body = {'model': 'google/' + M, 'messages': [{'role': 'user', 'content': cont}], 'modalities': ['image', 'text'],
            'image_config': {'aspect_ratio': aspecto, 'image_size': tam}, 'usage': {'include': True}}
    for i in range(3):
        try:
            rq = urllib.request.Request('https://openrouter.ai/api/v1/chat/completions', json.dumps(body).encode(), {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + clave('OPENROUTER_API_KEY', 'openrouter.env')})
            r = json.load(urllib.request.urlopen(rq, timeout=400)); break
        except urllib.error.HTTPError as e:
            msg = e.read()[:400].decode(errors='replace')
            if e.code in (429, 500, 502, 503) and i < 2:
                time.sleep(20 * (i + 1)); continue
            raise RuntimeError(f'{e.code} {msg}')
    if r.get('error'):
        raise RuntimeError(str(r['error'])[:300])
    ims = (r['choices'][0]['message'].get('images') or [])
    usd = float((r.get('usage') or {}).get('cost') or 0)
    return (base64.b64decode(ims[-1]['image_url']['url'].split(',', 1)[1]) if ims else None), usd


def b64f(p):
    return base64.b64encode(open(p, 'rb').read()).decode()


def _mover(usd, fila):
    with open(CSV, 'a+', newline='') as f:
        fcntl.flock(f, fcntl.LOCK_EX); f.seek(0)
        total = sum(float(r['usd']) for r in csv.DictReader(f))
        if total + usd > TOPE:
            return None
        f.seek(0, 2); w = csv.writer(f)
        if f.tell() == 0:
            w.writerow(['fecha', 'modelo', 'usd', 'archivo', 'nota'])
        w.writerow([datetime.datetime.now().isoformat(timespec='seconds'), fila[0], f'{usd:.5f}', fila[1], fila[2]])
        return total + usd


def uno(j):
    out = os.path.join(B, j['out']); t = j.get('tam', '2K'); M = j.get('modelo', 'gemini-3-pro-image')
    ti, to, tt, precio = TAR[M]
    if os.path.exists(out):
        return j['out'] + ' ya existe'
    reserva = precio[t] + .01
    if _mover(reserva, (M, j['out'], 'reserva')) is None:
        return j['out'] + ' TOPE ALCANZADO, no se genera'
    refs = [r if os.path.isabs(r) else os.path.join(B, r) for r in j.get('refs', [])]
    if j.get('via') == 'openrouter':
        try:
            png, usd = openrouter(M, j['prompt'], refs, j['aspecto'], t)
        except Exception as e:
            _mover(-reserva, (M + ' (openrouter)', j['out'], 'error, se libera'))
            return f"{j['out']} ERROR {e}"
        _mover((usd or precio[t]) - reserva, (M + ' (openrouter)', j['out'], 'ajuste' if png else 'sin imagen'))
        if not png:
            return j['out'] + ' sin imagen'
        os.makedirs(os.path.dirname(out), exist_ok=True)
        open(out, 'wb').write(png)
        if open(out, 'rb').read(2) == b'\xff\xd8' and out.endswith('png'):
            from PIL import Image
            Image.open(out).save(out)
        return f"{j['out']} ok {usd:.4f} (openrouter)"
    partes = [{'text': j['prompt']}] + [{'inlineData': {'mimeType': 'image/png' if r.endswith('png') else 'image/jpeg', 'data': b64f(r)}} for r in refs]
    try:
        r = gem(f'models/{M}:generateContent', {'contents': [{'parts': partes}], 'generationConfig': {'responseModalities': ['IMAGE'], 'imageConfig': {'aspectRatio': j['aspecto'], 'imageSize': t}}})
    except Exception as e:
        _mover(-reserva, (M, j['out'], 'error, se libera'))
        return f"{j['out']} ERROR {e}"
    u = r.get('usageMetadata', {}); det = {d['modality']: d['tokenCount'] for d in u.get('candidatesTokensDetails', [])}
    usd = u.get('promptTokenCount', 0) * ti + det.get('IMAGE', 0) * to + (u.get('thoughtsTokenCount', 0) + det.get('TEXT', 0)) * tt
    ims = [p['inlineData'] for c in r.get('candidates', []) for p in c.get('content', {}).get('parts', []) if 'inlineData' in p and not p.get('thought')]
    _mover((usd or precio[t]) - reserva, (M, j['out'], 'ajuste' if ims else 'sin imagen'))
    if not ims:
        return j['out'] + ' sin imagen'
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'wb').write(base64.b64decode(ims[-1]['data']))
    if open(out, 'rb').read(2) == b'\xff\xd8' and out.endswith('png'):
        from PIL import Image
        Image.open(out).save(out)
    return f"{j['out']} ok {usd:.4f}"


def total():
    return sum(float(r['usd']) for r in csv.DictReader(open(CSV))) if os.path.exists(CSV) else 0.0


if __name__ == '__main__':
    with cf.ThreadPoolExecutor(4) as ex:
        for x in ex.map(uno, json.load(open(sys.argv[1]))):
            print(x, flush=True)
    print(f'TOTAL {total():.3f} de {TOPE}')
