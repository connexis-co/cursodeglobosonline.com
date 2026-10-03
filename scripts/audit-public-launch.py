"""Read-only checks of sitemap URLs, metadata and CMS images after migration."""
import os,json,pathlib,collections,concurrent.futures,datetime,urllib.parse,xml.etree.ElementTree as ET
import requests
from bs4 import BeautifulSoup
PUBLIC='https://cursodeglobosonline.com'
ORIGIN=os.environ.get('GLOBOS_AUDIT_ORIGIN',PUBLIC).rstrip('/')
HEADERS={}
if ORIGIN!=PUBLIC:
    assert ORIGIN=='https://globos-emdash-production.rodrigomisat.workers.dev'
    import base64
    values=dict(line.split('=',1) for line in pathlib.Path('.dev.vars.production').read_text().splitlines() if '=' in line)
    HEADERS['Authorization']='Basic '+base64.b64encode(('sably:'+json.loads(values['GLOBOS_ADMIN_PASSWORD'])).encode()).decode()
def fetch(url):
    parsed=urllib.parse.urlsplit(url)
    assert parsed.netloc==urllib.parse.urlsplit(PUBLIC).netloc
    return requests.get(ORIGIN+parsed.path+('?' + parsed.query if parsed.query else ''),headers=HEADERS,timeout=60)
def sitemap(url):
    r=fetch(url);r.raise_for_status();root=ET.fromstring(r.content)
    return root.tag.split('}')[-1],[el.text for el in root.findall('.//{http://www.sitemaps.org/schemas/sitemap/0.9}loc')]
_,children=sitemap(PUBLIC+'/sitemap-index.xml');urls=set()
for child in children:
    kind,locs=sitemap(child);assert kind=='urlset';urls.update(locs);print('Sitemap checked:',child,len(locs),flush=True)
def crawl(url):
    try:
        r=fetch(url);s=BeautifulSoup(r.content,'html.parser');canon=[l.get('href') for l in s.find_all('link',rel='canonical')]
        schemas=s.find_all('script',type='application/ld+json');errors=0
        for schema in schemas:
            try:json.loads(schema.string or schema.text)
            except ValueError:errors+=1
        return {'url':url,'status':r.status_code,'redirects':len(r.history),'canonical':canon,'title':s.title.get_text(' ',strip=True) if s.title else '', 'h1':len(s.find_all('h1')),'descriptions':len(s.find_all('meta',attrs={'name':'description'})), 'metaNoindex':any('noindex' in m.get('content','') for m in s.find_all('meta',attrs={'name':'robots'})), 'xRobots':r.headers.get('x-robots-tag'),'schemaErrors':errors, 'devReferences':'dev.cursodeglobosonline.com' in r.text,'seconds':round(r.elapsed.total_seconds(),3),'cmsImages':sorted(set(urllib.parse.urljoin(PUBLIC,img['src']) for img in s.find_all('img',src=True) if '/_emdash/api/media/file/' in img['src']))}
    except Exception as e:return {'url':url,'error':str(type(e).__name__)}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:pages=list(pool.map(crawl,sorted(urls)))
images=sorted(set(url for page in pages for url in page.get('cmsImages',[])))
def image(url):
    try:
        r=fetch(url);return {'url':url,'status':r.status_code,'type':r.headers.get('content-type')}
    except Exception as e:return {'url':url,'error':str(type(e).__name__)}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:media=list(pool.map(image,images))
issues=[]
for p in pages:
    if p.get('status')!=200 or p.get('redirects') or p.get('canonical')!=[p['url']] or p.get('h1')!=1 or p.get('descriptions')!=1 or p.get('metaNoindex') or p.get('schemaErrors') or p.get('devReferences') or (ORIGIN==PUBLIC and 'noindex' in (p.get('xRobots')or'')):issues.append(p['url'])
issues.extend(m['url'] for m in media if m.get('status')!=200 or not (m.get('type')or'').startswith('image/'))
duplicateTitles=[t for t,n in collections.Counter(p.get('title') for p in pages).items() if n>1]
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'origin':ORIGIN,'urls':len(urls),'images':len(images),'issues':issues,'duplicateTitles':duplicateTitles,'pages':pages,'media':media}
out=pathlib.Path('docs/migration/verification/launch-'+('public' if ORIGIN==PUBLIC else 'preview')+'.json');out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['pages','media']},ensure_ascii=False));raise SystemExit(1 if issues or duplicateTitles else 0)
