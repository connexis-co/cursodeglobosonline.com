#!/usr/bin/env python3
"""Valida un artículo MDX del blog contra el esquema de Astro y las reglas editoriales.
Uso: validate.py <slug>   (lee posts/<slug>.mdx junto a este script)"""
import sys, os, re, json, yaml
HERE = os.path.dirname(os.path.abspath(__file__))
MAP = json.load(open(os.path.join(HERE, '..', 'docs', 'seo', '2026-09-22', 'mapa-tematico.json')))
SLUGS = {a['slug'] for a in MAP['articles']}
COURSES = ['curso-de-globoflexia', 'curso-de-bouquets-de-globos', 'curso-de-flores-con-globos', 'curso-de-globos-burbuja']
CLUSTERS = ['arcos-y-guirnaldas', 'ideas-por-ocasion', 'arreglos-y-flores', 'globoflexia', 'tecnicas-y-materiales', 'negocio']
BANNED = ['sumérgete', 'fascinante mundo', 'en el mundo de', 'siguiente nivel', 'no es solo', 'manos a la obra', 'sin más preámbulos',
          'vibrante', 'desbloquea', 'potenciar', 'elevar tu', 'mágico', 'increíble', 'en conclusión', 'en definitiva', 'descubre cómo', 'adéntrate']
slug = sys.argv[1]
path = os.path.join(HERE, '..', 'src', 'content', 'blog', f'{slug}.mdx')
errs, warns = [], []
src = open(path, encoding='utf-8').read()
m = re.match(r'^---\n(.*?)\n---\n(.*)$', src, re.S)
if not m: print(json.dumps({'ok': False, 'errors': ['frontmatter no encontrado']})); sys.exit(1)
try:
    fm = yaml.safe_load(m.group(1))
except Exception as e:
    print(json.dumps({'ok': False, 'errors': [f'YAML inválido: {e}']})); sys.exit(1)
body = m.group(2)
req = ['title', 'description', 'cluster', 'primaryKeyword', 'keywords', 'moneyPage', 'moneyAnchor', 'hero', 'heroAlt', 'publishedAt']
for k in req:
    if k not in fm: errs.append(f'falta {k}')
d = fm.get('description', '') or ''
if not (80 <= len(d) <= 170): errs.append(f'description {len(d)} car. (80-170)')
elif not (135 <= len(d) <= 162): warns.append(f'description {len(d)} car. (objetivo 140-160)')
st = fm.get('seoTitle') or fm.get('title', '')
if len(st) > 60: errs.append(f'seoTitle {len(st)} car. (>60)')
if fm.get('cluster') not in CLUSTERS: errs.append(f"cluster inválido {fm.get('cluster')}")
if fm.get('moneyPage') not in COURSES + ['catalogo']: errs.append(f"moneyPage inválida {fm.get('moneyPage')}")
if fm.get('hero') != f'../../assets/blog/{slug}.jpg': errs.append(f"hero debe ser ../../assets/blog/{slug}.jpg")
if len(fm.get('heroAlt', '') or '') < 20: errs.append('heroAlt < 20 car.')
if not isinstance(fm.get('keywords'), list) or len(fm['keywords']) < 3: errs.append('keywords: lista de ≥3')
pk = (fm.get('primaryKeyword') or '').lower()
if re.search(r'\b(curso|cursos|clases)\b', pk): errs.append('primaryKeyword transaccional (curso/clases): canibaliza money page')
if str(fm.get('publishedAt')) != '2026-09-22': warns.append(f"publishedAt {fm.get('publishedAt')} (esperado 2026-09-22)")
for r in fm.get('related', []) or []:
    if r not in SLUGS or r == slug: errs.append(f'related inválido: {r}')
if fm.get('pillar') and fm['pillar'] not in SLUGS: errs.append(f"pillar inválido {fm['pillar']}")
if fm.get('isPillar') and fm.get('pillar'): warns.append('un pilar no debería declarar pillar')
faqs = fm.get('faqs', []) or []
if len(faqs) > 8: errs.append('más de 8 FAQs')
for f in faqs:
    if not isinstance(f, dict) or 'q' not in f or 'a' not in f: errs.append('FAQ mal formada')
if re.search(r'^# ', body, re.M): errs.append('el cuerpo no debe tener H1 (# )')
h2 = re.findall(r'^## (.+)$', body, re.M)
if len(h2) < 4: errs.append(f'solo {len(h2)} H2')
cta = re.findall(r'<CourseCta\b[^>]*/>', body)
if len(cta) != 1: errs.append(f'{len(cta)} <CourseCta/> (debe haber exactamente 1)')
for c in cta:
    mm = re.search(r'curso="([^"]+)"', c)
    if not mm or mm.group(1) not in COURSES + ['catalogo']: errs.append(f'CourseCta curso inválido: {c[:80]}')
opens, closes = len(re.findall(r'<Callout\b', body)), len(re.findall(r'</Callout>', body))
if opens != closes: errs.append('Callout sin cerrar')
for tag in re.findall(r'<([A-Z][A-Za-z]+)', body):
    if tag not in ('CourseCta', 'Callout'): errs.append(f'componente no permitido <{tag}>')
if re.search(r'<(?!/?(CourseCta|Callout)\b)[a-z][a-z0-9]*[\s>/]', body): warns.append('HTML en minúsculas dentro del MDX: revisa que sea válido en MDX')
if re.search(r'(?<![\\`])[{}]', re.sub(r'<(CourseCta|Callout)[^>]*>', '', body)): errs.append('llaves { } sueltas: MDX las interpreta como expresiones (escápalas)')
links = re.findall(r'\]\((/[^)\s]*)\)', body)
internal_ok = set(f'/blog/{s}/' for s in SLUGS) | set(f'/co/{c}/' for c in COURSES) | {'/co/cursos/', '/blog/'}
bad = [l for l in links if l not in internal_ok]
if bad: errs.append(f'enlaces internos inexistentes: {bad}')
blog_links = [l for l in links if l.startswith('/blog/') and l != '/blog/']
if len(set(blog_links)) < 2: errs.append(f'solo {len(set(blog_links))} enlaces a otros artículos (mínimo 2)')
if fm.get('pillar') and f"/blog/{fm['pillar']}/" not in links: errs.append('falta enlace al pilar en el cuerpo')
mp = fm.get('moneyPage')
if mp in COURSES and f'/co/{mp}/' not in links: warns.append('falta enlace de texto a la money page (además del CourseCta)')
words = len(re.sub(r'<[^>]+>', ' ', body).split())
lo, hi = (2200, 3400) if fm.get('isPillar') else (1300, 2300)
if words < lo * 0.9: errs.append(f'{words} palabras (mínimo ~{lo})')
elif words > hi * 1.15: warns.append(f'{words} palabras (máximo sugerido {hi})')
low = body.lower()
hits = [b for b in BANNED if b in low]
if hits: errs.append(f'frases prohibidas: {hits}')
if re.search(r'[\U0001F300-\U0001FAFF]', body): errs.append('emojis en el cuerpo')
if not re.search(r'<Callout[^>]*titulo="En resumen"', body): warns.append('falta el Callout "En resumen" al inicio')
print(json.dumps({'ok': not errs, 'errors': errs, 'warnings': warns, 'words': words, 'h2': len(h2), 'links': links}, ensure_ascii=False))
sys.exit(0 if not errs else 1)
