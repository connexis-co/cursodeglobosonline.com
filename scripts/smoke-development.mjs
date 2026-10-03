import {readFile,writeFile,mkdir} from 'node:fs/promises';
const origin='https://dev.cursodeglobosonline.com';
const password=(await readFile('.dev.vars','utf8')).split('\n').find(l=>l.startsWith('GLOBOS_DEV_PASSWORD=')).slice('GLOBOS_DEV_PASSWORD='.length).replace(/^"|"$/g,'');
const authorization='Basic '+Buffer.from('sably:'+password).toString('base64');
const seed=JSON.parse(await readFile('emdash.seed.json','utf8'));
const paths=['/','/co/','/co/cursos/','/co/bogota/','/co/bogota/curso-de-globoflexia/','/landing/meta/curso-de-globoflexia/','/landing/google/curso-de-globoflexia/','/blog/flores-con-globos/','/co/curso-de-globoflexia/','/mx/curso-de-globos-burbuja/','/blog/','/blog/'+seed.content.blog[0].slug+'/','/nosotros/','/contacto/','/legal/privacidad/','/videos/','/recursos/','/no-existe-prueba/','/sitemap-index.xml','/sitemaps/blog.xml','/blog/rss.xml','/llms.txt','/api/ratings','/_emdash/admin','/_emdash/api/plugins/globos-whatsapp/config'];
await mkdir('docs/migration/verification',{recursive:true});const results=[];
for(const path of paths){
 const r=await fetch(origin+path,{headers:{authorization,'X-EmDash-Request':'1',origin},redirect:'follow',signal:AbortSignal.timeout(30000)});const text=await r.text();
 const expected=path==='/no-existe-prueba/'?404:200;
 const result={path,status:r.status,expected,noindex:r.headers.get('x-robots-tag'),private:r.headers.get('cache-control'),title:text.match(/<title>([^<]*)<\/title>/)?.[1],bytes:text.length,whatsapp:(text.match(/id="globos-whatsapp"/g)||[]).length,canonical:text.match(/rel="canonical"[^>]*href="([^"]+)"/)?.[1]};results.push(result);console.log(JSON.stringify(result));
 if(path==='/co/curso-de-globoflexia/')await writeFile('/tmp/globos-course.html',text);
 if(path.startsWith('/blog/')&&path.endsWith(seed.content.blog[0].slug+'/'))await writeFile('/tmp/globos-article.html',text);
 if(r.status!==expected){console.log('Unexpected response:',text.slice(0,250));process.exitCode=1;}
}
await writeFile('docs/migration/verification/smoke.json',JSON.stringify({checkedAt:new Date().toISOString(),results},null,2)+'\n');
