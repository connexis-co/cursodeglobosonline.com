/** One-time native-revision repair for the legacy GFM importer; no reseeding. */
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const environment=process.argv.find(x=>x.startsWith('--environment='))?.split('=')[1];
assert.ok(environment==='development'||environment==='production');
const production=environment==='production';
const origin=production?'https://cursodeglobosonline.com':'https://dev.cursodeglobosonline.com';
const key=production?'GLOBOS_ADMIN_PASSWORD':'GLOBOS_DEV_PASSWORD';
const line=(await readFile(production?'.dev.vars.production':'.dev.vars','utf8')).split('\n').find(x=>x.startsWith(key+'='));assert.ok(line);
const raw=line.slice(line.indexOf('=')+1);const password=raw.startsWith('"')?JSON.parse(raw):raw;
const headers={authorization:'Basic '+Buffer.from('sably:'+password).toString('base64'),origin,'X-EmDash-Request':'1','content-type':'application/json'};
async function api(path:string,method='GET',body?:unknown){const r=await fetch(origin+path,{method,headers,body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(90000)});const result=await r.json() as {data:any};assert.ok(r.ok,`${path}: ${r.status} ${JSON.stringify(result)}`);return result.data;}
const dir=`.data/seo-guides/${environment}/table-repair`;await mkdir(dir,{recursive:true});
const report=[];
for(const collection of ['blog','courses']){
 const list=await api(`/_emdash/api/content/${collection}?locale=es&limit=100`);assert.ok(!list.nextCursor,'Paginate before proceeding');
 for(const row of list.items){
  const path=`/_emdash/api/content/${collection}/${row.id}?locale=es`;
  const current=await api(path);const body=structuredClone(current.item.data.body);if(!Array.isArray(body))continue;
  let count=0;
  for(const table of body.filter(b=>b._type==='table')){
   const cells=table.rows.flatMap((r:any)=>r.cells);
   // Every cell in the affected importer starts with its structural delimiter.
   // Leave any independently edited or unrelated table untouched.
   if(!cells.length||!cells.every((c:any)=>String(c.content?.[0]?.text??'').startsWith('|')))continue;
   for(const cell of cells){
    const first=cell.content[0],last=cell.content.at(-1);
    first.text=first.text.replace(/^\|\s?/, '');
    last.text=last.text.replace(/\s?\|$/, '');
    count++;
   }
  }
  if(!count)continue;
  assert.equal(current.item.draftRevisionId,null,'Pending editor draft; manual review: '+row.slug);
  assert.equal(current.item.status,'published');
  await writeFile(`${dir}/${collection}-${row.slug}.json`,JSON.stringify(current,null,2),{mode:0o600,flag:'wx'}).catch(e=>{if(e.code!=='EEXIST')throw e;});
  const references=Object.fromEntries(Object.entries(current.item.references).map(([k,v]:[string,any])=>[k,v.children.map((x:any)=>x.id)]));
  await api(path,'PUT',{_rev:current._rev,data:{...current.item.data,body},references});
  const updated=await api(path);
  await api(`/_emdash/api/content/${collection}/${row.id}/publish?locale=es`,'POST',{_rev:updated._rev});
  report.push({collection,slug:row.slug,cells:count});console.log(collection,row.slug,count);
 }
}
await writeFile(`${dir}/result.json`,JSON.stringify({environment,checkedAt:new Date().toISOString(),repaired:report},null,2));
console.log('Entries repaired',report.length);
