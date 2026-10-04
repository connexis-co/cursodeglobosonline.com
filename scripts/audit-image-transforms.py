"""Read-only checks of Cloudflare resizing, responsive HTML and actual transferred image bytes."""
import concurrent.futures,datetime,json,pathlib,urllib.parse
import requests
from bs4 import BeautifulSoup
PUBLIC='https://cursodeglobosonline.com'
ACCEPT={'Accept':'image/avif,image/webp,image/*,*/*;q=0.8'}
pages=[];candidates={}
for path in ['/','/blog/','/blog/globos-con-confeti/','/blog/arco-de-globos/','/co/curso-de-globoflexia/']:
 r=requests.get(PUBLIC+path,timeout=60);r.raise_for_status();s=BeautifulSoup(r.content,'html.parser')
 images=[]
 for img in s.find_all('img',src=True):
  source=img['src'];variants=[]
  for candidate in img.get('srcset','').split(', '):
   if ' ' in candidate:
    url,descriptor=candidate.rsplit(' ',1)
    if descriptor.endswith('w') and descriptor[:-1].isdigit():variants.append((int(descriptor[:-1]),url))
  chosen=next((u for w,u in variants if w==640),source)
  url=urllib.parse.urljoin(PUBLIC,chosen)
  if '/cdn-cgi/image/' in url:
   candidates[url]=True
  images.append({'src':source,'srcset':img.get('srcset'),'sizes':img.get('sizes'),'width':img.get('width'),'height':img.get('height'),'loading':img.get('loading'),'fetchpriority':img.get('fetchpriority')})
 assert any('/cdn-cgi/image/' in i['src'] for i in images),path
 assert all(i.get('sizes') for i in images if i.get('srcset')),path
 pages.append({'url':PUBLIC+path,'status':r.status_code,'images':images})
def measure(url):
 try:
  original=url.split('/cdn-cgi/image/',1)[1].split('/',1)[1]
  origin=urllib.parse.urljoin(PUBLIC,original)
  assert urllib.parse.urlsplit(origin).netloc=='cursodeglobosonline.com'
  result=requests.get(url,headers=ACCEPT,timeout=60)
  raw=requests.get(origin,headers=ACCEPT,timeout=60)
  assert result.status_code==200 and raw.status_code==200
  assert result.headers.get('content-type','').startswith('image/')
  assert result.headers.get('cf-resized') and not result.history,'Fallback to original instead of transformation'
  return {'url':url,'original':origin,'status':result.status_code,'format':result.headers.get('content-type'),'originalFormat':raw.headers.get('content-type'),'bytes':len(result.content),'originalBytes':len(raw.content),'savingPercent':round(100*(1-len(result.content)/len(raw.content)),1),'cfResized':result.headers.get('cf-resized'),'cacheStatus':result.headers.get('cf-cache-status')}
 except Exception as e:return {'url':url,'error':type(e).__name__+': '+str(e)}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:images=list(pool.map(measure,sorted(candidates)))
private=[]
for url in [PUBLIC+'/_emdash/admin','https://dev.cursodeglobosonline.com/']:
 r=requests.get(url,allow_redirects=False,timeout=60);assert r.status_code==401
 private.append({'url':url,'status':r.status_code,'robots':r.headers.get('x-robots-tag')})
issues=[i for i in images if i.get('error')]
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'accept':ACCEPT['Accept'],'pages':pages,'images':images,'privateAccess':private,'issues':issues,'note':'Transferred bytes compare original and selected variant. This is not a browser LCP measurement.'}
p=pathlib.Path('docs/migration/verification/image-transform-public.json');p.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'pages':len(pages),'transformedImages':len(images),'issues':issues,'originalBytes':sum(i.get('originalBytes',0) for i in images),'transformedBytes':sum(i.get('bytes',0) for i in images)},ensure_ascii=False))
raise SystemExit(1 if issues else 0)
