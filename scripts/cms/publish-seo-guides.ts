/** Explicit, idempotent editorial release. Uses native revisions/references; never seeds a live CMS. */
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {mediaItemToValue} from 'emdash/media';
import {migrateBody} from '../portable-migration';

const environment=process.argv.find(x=>x.startsWith('--environment='))?.split('=')[1];
assert.ok(environment==='development'||environment==='production','Select an explicit environment');
const publish=process.argv.includes('--publish');
const origin=environment==='production'?'https://cursodeglobosonline.com':'https://dev.cursodeglobosonline.com';
const secretFile=environment==='production'?'.dev.vars.production':'.dev.vars';
const key=environment==='production'?'GLOBOS_ADMIN_PASSWORD':'GLOBOS_DEV_PASSWORD';
const line=(await readFile(secretFile,'utf8')).split('\n').find(x=>x.startsWith(key+'='));
assert.ok(line,'Local administrator secret required');
const raw=line.slice(line.indexOf('=')+1);const password=raw.startsWith('"')?JSON.parse(raw):raw;
const headers={authorization:'Basic '+Buffer.from('sably:'+password).toString('base64'),origin,'X-EmDash-Request':'1'};
async function api(path:string,options:RequestInit={}){
 const r=await fetch(origin+path,{...options,headers:{...headers,...options.headers},signal:AbortSignal.timeout(90000)});
 const body=await r.json() as {data:any};if(!r.ok)throw Error(`${options.method??'GET'} ${path} HTTP ${r.status}: ${JSON.stringify(body)}`);return body.data;
}
const json=(method:string,body:unknown):RequestInit=>({method,headers:{'content-type':'application/json'},body:JSON.stringify(body)});
const privateDir=`.data/seo-guides/${environment}`;await mkdir(privateDir,{recursive:true});
const dir='docs/editorial/2026-10-03';
const specs=[
 {slug:'perrito-con-globo',title:'Cómo hacer un perrito con un globo largo, paso a paso',seoTitle:'Perrito con un globo largo: paso a paso para empezar',
 description:'Aprende a hacer un perrito con un globo 260: materiales, orden de las burbujas, tres bloqueos y soluciones si las orejas o las patas se desarman.',
 primary:'perro globoflexia',keywords:['perro globoflexia','perrito con globo','como hacer un perro con un globo'],
 source:'figuras-con-globos',pillar:'globoflexia',course:'curso-de-globoflexia',related:['figuras-con-globos','como-inflar-globos-largos','tipos-y-tamanos-de-globos'],
 alt:'Esquema de un perrito con un globo largo: uniones de las orejas, las patas delanteras y las patas traseras.',
 faqs:[{q:'¿Cuántos globos necesito para hacer un perrito?',a:'Para el perro clásico de esta guía basta un globo largo 260. Ten otro de repuesto para practicar.'},{q:'¿Por qué se desarman las patas del perro?',a:'Las dos burbujas de cada par deben bloquearse juntas en su base. Sostén las torsiones anteriores mientras cierras el grupo.'}]},
 {slug:'globos-con-confeti',title:'Globos con confeti: cómo inflarlos y hacer que se pegue',seoTitle:'Globos con confeti: cómo inflarlos y repartir el relleno',
 description:'Prepara globos de látex con confeti: cómo inflarlos con aire o helio, repartir los papelitos y revisar por qué se quedan en el fondo. Guía práctica.',
 primary:'globos con confeti',keywords:['globos con confeti','como inflar globos con confeti','globos con confeti sin helio'],
 source:'como-inflar-globos',pillar:'tipos-y-tamanos-de-globos',course:'curso-de-bouquets-de-globos',related:['como-inflar-un-globo-burbuja','cuanto-dura-un-globo-con-helio','bouquet-de-globos'],
 alt:'Esquema de tres globos transparentes con confeti que muestra la secuencia de inflar, frotar suavemente y girar.',
 faqs:[{q:'¿Los globos con confeti se pueden usar sin helio?',a:'Sí. Con aire puedes sujetarlos a una base o incorporarlos en una guirnalda. No flotarán por sí solos.'},{q:'¿El globo transparente de látex es igual que un globo burbuja?',a:'No. Comprueba el material y el sistema de cierre del envase: las indicaciones de inflado del látex no se deben trasladar automáticamente a una burbuja.'}]},
];
const list=await api('/_emdash/api/content/blog?locale=es&limit=100');
const idBySlug=new Map<string,string>(list.items.map((x:{slug:string;id:string})=>[x.slug,x.id]));
async function entry(col:string,slug:string){return api(`/_emdash/api/content/${col}/${slug}?locale=es`);}
async function backup(slug:string,value:unknown){await writeFile(`${privateDir}/${slug}-before.json`,JSON.stringify(value,null,2),{mode:0o600,flag:'wx'}).catch(e=>{if(e.code!=='EEXIST')throw e;});}
const report:{slug:string;id:string;status:string;url:string}[]=[];
for(const spec of specs){
 if(idBySlug.has(spec.slug)){
  const existing=await entry('blog',spec.slug);assert.equal(existing.item.data.primary_keyword,spec.primary,'Existing entry has a different intent; review it');
  if(publish&&existing.item.status==='draft'){
   const saved=JSON.parse(await readFile(`${privateDir}/${spec.slug}-before.json`,'utf8'));
   assert.equal(existing._rev,saved._rev,'An editor changed the draft; review before resuming');
   await api(`/_emdash/api/content/blog/${existing.item.id}/publish?locale=es`,json('POST',{_rev:existing._rev}));
   existing.item.status='published';
  }
  report.push({slug:spec.slug,id:existing.item.id,status:existing.item.status,url:origin+'/blog/'+spec.slug+'/'});continue;
 }
 const template=await entry('blog',spec.source);const course=await entry('courses',spec.course);
 const form=new FormData();form.set('file',new Blob([await readFile(`${dir}/${spec.slug}.webp`)],{type:'image/webp'}),spec.slug+'.webp');form.set('deduplicate','true');
 const uploaded=await api('/_emdash/api/media',{method:'POST',body:form});const media=uploaded.item;
 await api('/_emdash/api/media/'+media.id,json('PUT',{alt:spec.alt,caption:'Ilustración editorial propia · Curso de Globos Online'}));
 const now=new Date().toISOString();
 const data={title:spec.title,seo_title:spec.seoTitle,description:spec.description,discover_title:spec.title,is_pillar:false,
  primary_keyword:spec.primary,keywords:spec.keywords.map(text=>({text})),money_anchor:'Ver el curso y su temario',
  hero:{...mediaItemToValue('local',{...media,meta:{storageKey:media.storageKey}}),alt:spec.alt},hero_alt:spec.alt,
  original_published_at:now,faqs:spec.faqs,body:migrateBody(await readFile(`${dir}/${spec.slug}.md`,'utf8')),template:'globos-classic',catalog_cta:false};
 const refs={cluster_link:template.item.references.cluster_link.children.map((x:{id:string})=>x.id),author_link:template.item.references.author_link.children.map((x:{id:string})=>x.id),course_link:[course.item.id],pillar_link:[idBySlug.get(spec.pillar)],related_links:spec.related.map(x=>idBySlug.get(x))};
 assert.ok(Object.values(refs).flat().every(Boolean),'All references must resolve');
 await api('/_emdash/api/content/blog',json('POST',{slug:spec.slug,locale:'es',status:'draft',data,references:refs}));
 const created=await entry('blog',spec.slug);idBySlug.set(spec.slug,created.item.id);
 await backup(spec.slug,created);
 if(publish)await api(`/_emdash/api/content/blog/${created.item.id}/publish?locale=es`,json('POST',{_rev:created._rev}));
 report.push({slug:spec.slug,id:created.item.id,status:publish?'published':'draft',url:origin+'/blog/'+spec.slug+'/'});
 console.log('Created',environment,spec.slug,publish?'published':'draft');
}
// Link from the matching established guides. Never overwrite a pending editorial draft.
const incoming=[
 {from:'figuras-con-globos',to:'perrito-con-globo',paragraph:'Para practicar el animal clásico con una sola pieza, sigue el [paso a paso del perrito con un globo]('+origin+'/blog/perrito-con-globo/). Allí verás el orden de las burbujas y cómo cerrar los tres bloqueos.'},
 {from:'globoflexia',to:'perrito-con-globo',paragraph:'Puedes practicar estos bloqueos con la [guía del perrito de globoflexia]('+origin+'/blog/perrito-con-globo/), dedicada a esa figura y sus errores más comunes.'},
 {from:'como-inflar-un-globo-burbuja',to:'globos-con-confeti',paragraph:'Si el envase indica látex transparente, utiliza la [guía de globos de látex con confeti]('+origin+'/blog/globos-con-confeti/). Sus indicaciones de inflado y nudo son distintas de las de una burbuja de plástico.'},
 {from:'como-inflar-globos',to:'globos-con-confeti',paragraph:'Para repartir los papelitos dentro de un globo de látex transparente, consulta [cómo preparar globos con confeti]('+origin+'/blog/globos-con-confeti/). La guía separa el montaje con aire de la flotación con helio.'},
];
if(publish)for(const link of incoming){
 const current=await entry('blog',link.from);assert.equal(current.item.draftRevisionId,null,'Pending editor draft: '+link.from);
 if(JSON.stringify(current.item.data.body).includes('/blog/'+link.to+'/'))continue;
 await backup(link.from,current);
 const body=[...current.item.data.body];const firstHeading=body.findIndex(x=>x._type==='block'&&String(x.style).startsWith('h'));
 const paragraph=migrateBody(link.paragraph).map((block,i)=>({...block,_key:`seo-${link.to}-${i}`}));body.splice(firstHeading<0?body.length:firstHeading,0,...paragraph);
 const references=Object.fromEntries(Object.entries(current.item.references).map(([key,value]:[string,any])=>[key,value.children.map((x:{id:string})=>x.id)]));
 references.related_links=[...new Set([idBySlug.get(link.to),...(references.related_links??[])])];
 await api(`/_emdash/api/content/blog/${current.item.id}?locale=es`,json('PUT',{_rev:current._rev,data:{...current.item.data,body,editorial_updated_at:new Date().toISOString()},references}));
 const fresh=await entry('blog',link.from);await api(`/_emdash/api/content/blog/${current.item.id}/publish?locale=es`,json('POST',{_rev:fresh._rev}));
 console.log('Linked',link.from,'→',link.to);
}
await writeFile(`${privateDir}/result.json`,JSON.stringify({environment,published:publish,checkedAt:new Date().toISOString(),articles:report},null,2)+'\n');
console.log(JSON.stringify(report));
