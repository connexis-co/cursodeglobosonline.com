"""Repeatable public HTTP/resource measurements, not a browser/Core Web Vitals test."""
import concurrent.futures
import datetime
import json
import os
from pathlib import Path
import re
import requests
from bs4 import BeautifulSoup

ORIGIN = 'https://cursodeglobosonline.com'
PATHS = ['/', '/blog/', '/blog/globos-con-confeti/', '/co/curso-de-globoflexia/']
session = requests.Session()
rows = []
resources = set()
for path in PATHS:
    for visit in range(2):
        response = session.get(ORIGIN+path, timeout=60)
        page = BeautifulSoup(response.content, 'html.parser')
        preloads = [tag['href'] for tag in page.select('link[rel="preload"][as="font"]')]
        styles = [tag['href'] for tag in page.select('link[rel="stylesheet"]')]
        scripts = [tag['src'] for tag in page.select('script[src]') if tag['src'].startswith('/')]
        resources.update(preloads+styles+scripts)
        rows.append({'path':path,'visit':visit+1,'status':response.status_code,
            'ttfbSeconds':round(response.elapsed.total_seconds(),3),'htmlBytes':len(response.content),
            'cache':response.headers.get('cf-cache-status'),'age':response.headers.get('age'),
            'serverTiming':response.headers.get('server-timing'),'cacheControl':response.headers.get('cache-control'),
            'vary':response.headers.get('vary'),'fonts':preloads,'styles':styles,'scripts':scripts,
            'h1':len(page.select('h1')),'canonical':[tag['href'] for tag in page.select('link[rel="canonical"]')],
            'noindex':'noindex' in response.headers.get('x-robots-tag','') or any('noindex' in t.get('content','') for t in page.select('meta[name="robots"]')),
            'brandSymbols':len(page.select('symbol#globos-brand-logo')),
            'brandReferences':len(page.select('use[href="#globos-brand-logo"]')),
            'starWidgets':len(page.select('[data-star-rating]')),'forms':len(page.select('form')),
            'whatsapp':bool(page.select('#globos-whatsapp')),
            'heroHidden':bool(page.select('h1.animate-fade-slide-up')),
            'schemasValid':all(json.loads(tag.text) is not None for tag in page.select('script[type="application/ld+json"]'))})

def resource(path):
    response = requests.get(ORIGIN+path,timeout=40)
    return {'path':path,'status':response.status_code,'bytes':len(response.content),
        'type':response.headers.get('content-type'),'cacheControl':response.headers.get('cache-control')}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    assets = list(pool.map(resource,sorted(resources)))
checks = []
for path,headers in [('/',{'Cookie':'globos_cache_test=1'}),('/?preview=true',{}),('/?utm_source=performance-audit',{}),
        ('/_emdash/admin',{}),('/_emdash/api/settings',{}),('/invalid-performance-check',{}),('/api/blog-ratings',{})]:
    r = requests.get(ORIGIN+path,headers=headers,timeout=60,allow_redirects=path=='/invalid-performance-check')
    checks.append({'path':path,'cookie':bool(headers),'status':r.status_code,'cache':r.headers.get('cf-cache-status'),
        'cacheControl':r.headers.get('cache-control'),'noindex':r.headers.get('x-robots-tag')})
out = Path(os.environ.get('GLOBOS_PERFORMANCE_OUTPUT','docs/migration/verification/performance-public.json'))
report = {'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'pages':rows,'assets':assets,'checks':checks}
out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'pages':[{k:r[k] for k in ['path','visit','status','ttfbSeconds','htmlBytes','cache','age']} for r in rows],
    'assets':assets,'checks':checks},ensure_ascii=False,indent=2))
assert all(r['status']==200 and r['h1']==1 and not r['noindex'] and len(r['fonts'])==2
    and r['canonical']==[ORIGIN+r['path']] and r['whatsapp'] and not r['heroHidden']
    and r['schemasValid'] and r['brandSymbols']==1 and r['brandReferences']>=2 for r in rows)
assert all(r['status']==200 for r in assets)
assert checks[0]['cacheControl']=='private, no-store' and checks[0]['cache']!='HIT'
assert checks[3]['status']==401 and checks[4]['status']==401 and checks[5]['status']==404
