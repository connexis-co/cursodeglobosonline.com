/** One-time, idempotent media repair after seed setup. Existing editor assets are never replaced. */
import {readFile,writeFile} from 'node:fs/promises';
import {api,json,origin} from './dev-api.mjs';
import {mediaItemToValue} from 'emdash/media';
const seed=JSON.parse(await readFile('emdash.seed.json','utf8'));
const sources=JSON.parse(await readFile('docs/migration/media-sources.json','utf8'));
const report=[];let changed=0;const limit=Number(process.argv[2])||Infinity;
for(const [collection,entries] of Object.entries(seed.content))for(const entry of entries){
 const refs=sources.filter(m=>m.collection===collection&&m.slug===entry.slug).map(m=>[m.field,m]);if(!refs.length)continue;
 const base=`/_emdash/api/content/${collection}/${encodeURIComponent(entry.slug)}`;
 const current=await api(base+'?locale=es');const data={...current.item.data};let dirty=false;
 for(const [field,ref] of refs){
  if(data[field]){report.push({collection,slug:entry.slug,field,status:'preserved'});continue;}
  const m=ref,url=new URL(m.url);let bytes,type;
  if(m.source){bytes=await readFile(m.source);type=/\.png$/i.test(url.pathname)?'image/png':/\.webp$/i.test(url.pathname)?'image/webp':'image/jpeg';}
  else {const response=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error('Cannot import original media '+m.url);bytes=new Uint8Array(await response.arrayBuffer());type=response.headers.get('content-type')||'image/jpeg';}
  const filename=m.filename||url.pathname.split('/').pop();const form=new FormData();form.set('file',new Blob([bytes],{type}),filename);form.set('deduplicate','true');
  const uploaded=await api('/_emdash/api/media',{method:'POST',body:form});const media=uploaded.item;
  await api('/_emdash/api/media/'+media.id,json('PUT',{alt:m.alt||'',caption:m.caption||''}));
  data[field]={...mediaItemToValue('local',{...media,meta:{storageKey:media.storageKey}}),alt:m.alt||''};dirty=true;
  report.push({collection,slug:entry.slug,field,mediaId:media.id,filename,status:'imported'});
 }
 if(dirty){
  await api(base+'?locale=es',json('PUT',{data,_rev:current._rev}));
  if(current.item.status==='published'){const draft=await api(base+'?locale=es');await api(base+'/publish?locale=es',json('POST',{_rev:draft._rev}));}
  changed++;console.log('Media imported:',collection,entry.slug);
 }
 if(changed>=limit)break;
}
await writeFile('docs/migration/verification/media.json',JSON.stringify({checkedAt:new Date().toISOString(),changed,report},null,2)+'\n');
console.log('Updated entries:',changed);
