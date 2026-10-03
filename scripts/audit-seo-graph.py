"""Read-only SEO/link graph crawl. Cache HTML privately; publish evidence without visitor data."""
import collections, concurrent.futures, datetime, hashlib, json, pathlib, urllib.parse, xml.etree.ElementTree as ET
import requests
from bs4 import BeautifulSoup
ORIGIN='https://cursodeglobosonline.com'
CACHE=pathlib.Path('.data/seo-review/html'); CACHE.mkdir(parents=True,exist_ok=True)
NS={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
def fetch(url):
    r=requests.get(url,timeout=70);r.raise_for_status();return r
def sitemap(url):
    root=ET.fromstring(fetch(url).content)
    return [e.text for e in root.findall('.//s:loc',NS)]
urls=set()
for child in sitemap(ORIGIN+'/sitemap-index.xml'):urls.update(sitemap(child))
def crawl(url):
    try:
        r=requests.get(url,timeout=70);s=BeautifulSoup(r.content,'html.parser')
        if r.status_code==200:(CACHE/(hashlib.sha256(url.encode()).hexdigest()+'.html')).write_bytes(r.content)
        links=[]
        for a in s.find_all('a',href=True):
            u=urllib.parse.urlsplit(urllib.parse.urljoin(url,a['href']))
            if u.netloc==urllib.parse.urlsplit(ORIGIN).netloc and not u.path.startswith(('/_emdash/','/api/')) and not u.query:
                links.append({'url':ORIGIN+u.path,'fragment':urllib.parse.unquote(u.fragment),'anchor':a.get_text(' ',strip=True)})
        def meta(key):return [m.get('content','') for m in s.find_all('meta',attrs={'name':key})]
        schemas=[]
        for el in s.find_all('script',type='application/ld+json'):
            try:schemas.append(json.loads(el.string or el.text))
            except ValueError:schemas.append({'error':'invalid JSON'})
        return {'url':url,'status':r.status_code,'finalUrl':r.url,'title':s.title.get_text(strip=True) if s.title else '',
            'canonical':[x.get('href') for x in s.find_all('link',rel='canonical')],'robots':meta('robots'),'description':meta('description'),
            'h1':[x.get_text(' ',strip=True) for x in s.find_all('h1')], 'links':links,'ids':[x['id'] for x in s.find_all(id=True)],
            'alternates':[{'language':x.get('hreflang'),'url':x.get('href')} for x in s.find_all('link',hreflang=True)],
            'images':[{'src':x.get('src'),'alt':x.get('alt'),'width':x.get('width'),'height':x.get('height'),'loading':x.get('loading'),'srcset':x.get('srcset')} for x in s.find_all('img')],
            'scripts':[x.get('src') for x in s.find_all('script',src=True)],'schemas':schemas,'seconds':r.elapsed.total_seconds()}
    except Exception as e:return {'url':url,'error':type(e).__name__}
pages={}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    for p in pool.map(crawl,sorted(urls)):
        pages[p['url']]=p
        if len(pages)%20==0:print('Sitemap pages',len(pages),flush=True)
extra={link['url'] for p in pages.values() for link in p.get('links',[]) if not pathlib.PurePosixPath(urllib.parse.urlsplit(link['url']).path).suffix}-set(pages)
print('Extra internal destinations',len(extra),flush=True)
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    for p in pool.map(crawl,sorted(extra)):pages[p['url']]=p
incoming=collections.defaultdict(set);broken=[];fragments=[]
for p in pages.values():
    for link in p.get('links',[]):
        target=pages.get(link['url']);incoming[link['url']].add(p['url'])
        if target and target.get('status',0)>=400:broken.append({'source':p['url'],**link,'status':target['status']})
        if target and target.get('status')==200 and link['fragment'] and link['fragment'] not in target.get('ids',[]):fragments.append({'source':p['url'],**link})
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sitemapUrls':sorted(urls),'pages':list(pages.values()),'brokenLinks':broken,'brokenFragments':fragments,'orphans':[u for u in sorted(urls) if not incoming[u]],'httpErrors':[{'url':p['url'],'status':p.get('status'),'error':p.get('error')} for p in pages.values() if p.get('status')!=200]}
path=pathlib.Path('.data/seo-review/graph.json');path.write_text(json.dumps(report,ensure_ascii=False,indent=2))
print(json.dumps({k:v if not isinstance(v,list) else len(v) for k,v in report.items() if k!='checkedAt'},ensure_ascii=False),flush=True)
