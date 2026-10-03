"""Read-only production crawl and GSC URL inspection. Credentials remain outside the repo.

Usage: python3 scripts/audit-search-console.py /path/to/service-account.json
Requires requests, beautifulsoup4 and google-auth. Never submits indexing requests.
"""
import concurrent.futures as futures
import collections
import datetime
import json
import pathlib
import sys
import threading
import urllib.parse
import xml.etree.ElementTree as ET

import requests
from bs4 import BeautifulSoup
from google.oauth2.service_account import Credentials
from google.auth.transport.requests import AuthorizedSession

ORIGIN = 'https://cursodeglobosonline.com'
PROPERTY = 'sc-domain:cursodeglobosonline.com'
OUT = pathlib.Path('docs/migration/verification')
NS = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
credentials = Credentials.from_service_account_file(sys.argv[1], scopes=['https://www.googleapis.com/auth/webmasters.readonly'])
local = threading.local()

def google():
    if not hasattr(local, 'session'):
        local.session = AuthorizedSession(credentials)
    return local.session

def read_sitemap(url):
    assert url.startswith(ORIGIN + '/')
    r = requests.get(url, timeout=40)
    r.raise_for_status()
    root = ET.fromstring(r.content)
    return root.tag.split('}')[-1], [x.text for x in root.findall('.//s:loc', NS)]

def crawl(url):
    try:
        r = requests.get(url, timeout=45)
        soup = BeautifulSoup(r.text, 'html.parser')
        def meta(attr, value):
            return [x.get('content') for x in soup.find_all('meta', attrs={attr: value})]
        schemas = []
        schema_errors = 0
        for script in soup.find_all('script', type='application/ld+json'):
            try:
                schemas.append(json.loads(script.string or script.text))
            except ValueError:
                schema_errors += 1
        return {'url': url, 'status': r.status_code, 'finalUrl': r.url,
            'redirects': [{'url': h.url, 'status': h.status_code, 'location': h.headers.get('location')} for h in r.history],
            'title': soup.title.get_text(' ', strip=True) if soup.title else '',
            'description': meta('name', 'description'), 'robots': meta('name', 'robots'),
            'xRobotsTag': r.headers.get('x-robots-tag'),
            'canonical': [x.get('href') for x in soup.find_all('link', rel='canonical')],
            'h1': [x.get_text(' ', strip=True) for x in soup.find_all('h1')],
            'alternates': [{'lang': x.get('hreflang'), 'href': x.get('href')} for x in soup.find_all('link', hreflang=True)],
            'links': sorted(set(urllib.parse.urljoin(r.url, x['href']).split('#')[0] for x in soup.find_all('a', href=True) if x['href'].startswith(('/', ORIGIN)))),
            'schemas': schemas, 'schemaErrors': schema_errors,
            'image': meta('property', 'og:image'), 'elapsedSeconds': round(r.elapsed.total_seconds(), 3)}
    except Exception as e:
        return {'url': url, 'error': type(e).__name__}

def inspect(url):
    try:
        r = google().post('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', json={
            'inspectionUrl': url, 'siteUrl': PROPERTY, 'languageCode': 'en-US'}, timeout=50)
        data = r.json()
        return {'url': url, 'status': r.status_code, 'result': data.get('inspectionResult', data.get('error', {}))}
    except Exception as e:
        return {'url': url, 'error': type(e).__name__}

OUT.mkdir(parents=True, exist_ok=True)
_, sitemap_urls = read_sitemap(ORIGIN + '/sitemap-index.xml')
urls = set()
sitemaps = []
for sitemap in sitemap_urls:
    kind, entries = read_sitemap(sitemap)
    assert kind == 'urlset'
    urls.update(entries)
    sitemaps.append({'url': sitemap, 'count': len(entries)})
planning = json.loads((OUT / 'gsc-planning-2026-10-03.json').read_text())
extras = {p['page'] for p in planning['topPages']} | {ORIGIN + x for x in ['/co/cursos/eventos/', '/co/cursos/decoracion-con-globos/', '/curso-globoflexia/', '/peru/', '/cali/']}
all_urls = sorted(urls | extras)
with futures.ThreadPoolExecutor(max_workers=5) as pool:
    pages = list(pool.map(crawl, all_urls))
with futures.ThreadPoolExecutor(max_workers=3) as pool:
    inspections = list(pool.map(inspect, all_urls))
sitemap_response = google().get('https://www.googleapis.com/webmasters/v3/sites/' + urllib.parse.quote(PROPERTY, safe='') + '/sitemaps', timeout=40)
report = {'checkedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'property': PROPERTY,
    'scope': 'All current sitemap URLs plus top traffic/legacy samples; not the complete GSC Page Indexing report.',
    'robots': requests.get(ORIGIN + '/robots.txt', timeout=30).text,
    'sitemapStatus': sitemap_response.json(), 'sitemaps': sitemaps, 'sitemapUrls': sorted(urls), 'pages': pages, 'inspections': inspections}
(OUT / 'gsc-indexing-2026-10-03.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'sitemapUrls': len(urls), 'inspectedUrls': len(all_urls),
    'httpStatuses': dict(collections.Counter(p.get('status', 'error') for p in pages)),
    'indexingStates': dict(collections.Counter(p.get('result', {}).get('indexStatusResult', {}).get('coverageState', 'error') for p in inspections))}, ensure_ascii=False))
