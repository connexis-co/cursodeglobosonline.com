import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {api,json} from '../dev-api.mjs';
async function listContent(col){const items=[],seen=new Set();let cursor;do{const d=await api('/_emdash/api/content/'+col+'?locale=es&limit=100'+(cursor?'&cursor='+encodeURIComponent(cursor):''));items.push(...d.items);cursor=d.nextCursor;if(cursor&&seen.has(cursor))throw Error('Repeated content cursor');if(cursor)seen.add(cursor);}while(cursor);return items;}
const seed=JSON.parse(await readFile('emdash.seed.json','utf8'));
await mkdir('.data',{recursive:true});
const snapshotFile='.data/editorial-before.json';let snapshot;
try{snapshot=JSON.parse(await readFile(snapshotFile,'utf8'));}catch{
 snapshot={};for(const c of seed.collections){try{snapshot[c.slug]=await listContent(c.slug);}catch(e){if(!String(e).includes('404'))throw e;snapshot[c.slug]=[];}}
 await writeFile(snapshotFile,JSON.stringify(snapshot),{mode:0o600});
 const schemas={};for(const col of Object.keys(snapshot)){if(snapshot[col].length)schemas[col]=await api('/_emdash/api/schema/collections/'+col+'/fields');}await writeFile('.data/editorial-schema-before.json',JSON.stringify(schemas),{mode:0o600});
}
const existing=(await api('/_emdash/api/schema/collections')).items;
for(const c of seed.collections){
 if(!existing.some(x=>x.slug===c.slug))await api('/_emdash/api/schema/collections',json('POST',{slug:c.slug,label:c.label,labelSingular:c.labelSingular,supports:c.supports,routable:c.routable??true,titleField:c.titleField,group:c.group}));
}
for(const c of seed.collections){
 const fields=(await api('/_emdash/api/schema/collections/'+c.slug+'/fields')).items;
 for(const f of c.fields)if(!fields.some(x=>x.slug===f.slug))await api('/_emdash/api/schema/collections/'+c.slug+'/fields',json('POST',{...f,validation:f.validation??null,options:f.options??{}}));
 if(c.slug==='pages')await api('/_emdash/api/schema/collections/pages',json('PUT',{routable:true,urlPattern:'/paginas/{slug}/'}));
 console.log('Schema ready:',c.slug);
}
const live={};
for(const c of seed.collections)live[c.slug]=await listContent(c.slug);
for(const col of ['producers','subcategories'])for(const e of seed.content[col])if(!live[col].some(x=>x.slug===e.slug)){
 const data=Object.fromEntries(Object.entries(e.data).filter(([k])=>!k.endsWith('_link')));
 await api('/_emdash/api/content/'+col,json('POST',{slug:e.slug,locale:'es',status:'draft',data}));
}
for(const col of ['producers','subcategories'])live[col]=await listContent(col);
const refId=(target,slug)=>{const t=live[target].find(x=>x.slug===slug);if(!t)throw Error(`Missing target ${target}/${slug}`);return t.id;};
const retired={courses:['category','subcategory','producer'],blog:['cluster','author','money_page','pillar','related'],cities:['country'],testimonials:['course_slug'],videos:['course'],promotions:['countries','courses','excluded_courses'],categories:['subcategories']};
for(const col of ['producers','subcategories','courses','blog','cities','testimonials','videos','promotions'])for(const row of live[col]){
 if(row.status==='trash')continue;
 const base=`/_emdash/api/content/${col}/${row.id}?locale=es`;
 const current=await api(base);const old=snapshot[col]?.find(x=>x.id===row.id)?.data;
 const wanted=seed.content[col]?.find(x=>x.slug===row.slug);const refs={};
 const set=(field,target,values)=>refs[field]=(Array.isArray(values)?values:[values]).filter(Boolean).map(s=>refId(target,s));
 const data={...current.item.data};
 if(old){
  if(col==='courses'){set('subcategory_link','subcategories',old.category+'--'+old.subcategory);set('producer_link','producers','masterclasses');}
  if(col==='blog'){set('cluster_link','clusters',old.cluster);set('author_link','authors',old.author||live.authors[0].slug);set('course_link','courses',old.money_page==='catalogo'?null:old.money_page);set('pillar_link','blog',old.pillar);set('related_links','blog',(old.related||[]).map(x=>typeof x==='string'?x:x.text));data.catalog_cta=old.money_page==='catalogo';}
  if(col==='cities')set('country_link','countries',old.country);
  if(col==='testimonials')set('course_link','courses',old.course_slug);
  if(col==='videos')set('course_link','courses',old.course);
  if(col==='promotions')for(const [f,k,target] of [['country_links','countries','countries'],['course_links','courses','courses'],['excluded_course_links','excluded_courses','courses']])set(f,target,(old[k]||[]).map(x=>typeof x==='string'?x:x.text));
 }
 if(col==='subcategories')set('category_link','categories',String(wanted.data.category_link).replace('$ref:categories:',''));
 // A second run never resets editors' reference selections.
 const hasRefs=current.item.references&&Object.values(current.item.references).some(x=>x.children?.length);
 if(hasRefs){console.log('Already linked:',col,row.slug);continue;}
 if(current.item.liveRevisionId&&current.item.draftRevisionId)throw Error(`Existing draft: ${col}/${row.slug}. Preserve it before migration.`);
 await api(base,json('PUT',{data,references:refs,_rev:current._rev}));
 if(row.status==='published'||['producers','subcategories'].includes(col)){const fresh=await api(base);await api(`/_emdash/api/content/${col}/${row.id}/publish?locale=es`,json('POST',{_rev:fresh._rev}));}
 console.log('Linked:',col,row.slug);
}
// Fields are removed only after every entry's references were migrated; private JSON snapshot retains source values.
for(const [col,slugs] of Object.entries(retired)){
 const fields=(await api('/_emdash/api/schema/collections/'+col+'/fields')).items;
 for(const slug of slugs)if(fields.some(x=>x.slug===slug))await api('/_emdash/api/schema/collections/'+col+'/fields/'+slug,{method:'DELETE'});
}
console.log('Editorial relation migration complete.');
