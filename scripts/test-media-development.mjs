import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {headers,origin} from './dev-api.mjs';
const seed=JSON.parse(await readFile('emdash.seed.json','utf8'));
const paths=['/','/blog/',...seed.content.blog.map(p=>'/blog/'+p.slug+'/'),...seed.content.courses.map(p=>'/co/'+p.slug+'/')];
const media=new Set();
for(const path of paths){
 const r=await fetch(origin+path,{headers});assert.equal(r.status,200,path);const html=await r.text();
 if(path==='/blog/flores-con-globos/')assert.ok(html.includes('<table'),'Migrated editorial table is rendered');
 for(const match of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)){
  const url=new URL(match[1].replaceAll('&amp;','&'),origin);
  if(url.origin===origin){assert.ok(!url.pathname.startsWith('/_image'),`Unconfigured image transformer: ${path}`);media.add(url.href);}
 }
}
const results=[];
for(const url of media){
 const r=await fetch(url,{method:'HEAD',headers});assert.equal(r.status,200,url);assert.match(r.headers.get('content-type')||'',/^image\//,url);
 const anonymous=await fetch(url,{method:'HEAD'});assert.equal(anonymous.status,401,'Development image requires authentication');
 results.push({path:new URL(url).pathname,status:r.status,type:r.headers.get('content-type'),anonymousStatus:anonymous.status});
}
await writeFile('docs/migration/verification/media-runtime.json',JSON.stringify({checkedAt:new Date().toISOString(),pages:paths.length,results},null,2)+'\n');
console.log(`${paths.length} pages and ${results.length} unique image URLs verified; unauthenticated access blocked.`);
