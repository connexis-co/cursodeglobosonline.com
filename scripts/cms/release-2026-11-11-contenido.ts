/**
 * Segunda publicación editorial del 11-11-2026, explícita e idempotente:
 *
 *  A. Fotos hiperrealistas: portadas de los 5 cursos y fotos principales de dos artículos que
 *     llevaban un esquema ilustrado. Archivos en `docs/editorial/2026-11-11/fotos/`.
 *  B. Parche SEO del contenido de las fichas (`docs/seo/2026-11-11-parche-contenido-cursos.json`).
 *  C. Artículos nuevos del blog (`docs/editorial/2026-11-11/articulos.json` + `<slug>.md`):
 *     los marcados «publicar» salen ya; los «programar», en su fecha.
 *
 * Uso: node --import tsx scripts/cms/release-2026-11-11-contenido.ts --environment=local|development|production [--publish] [--solo=fotos,cursos,blog]
 * Sin --publish solo informa de lo que cambiaría. Lo que falte en disco se salta y se avisa.
 */
import {readFile,writeFile,mkdir,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {mediaItemToValue} from 'emdash/media';
import {migrateBody} from '../portable-migration';
import {adminApi,environmentFromArgs} from './_admin-api.mjs';

const environment=environmentFromArgs();
const publish=process.argv.includes('--publish');
const only=process.argv.find(x=>x.startsWith('--solo='))?.split('=')[1]?.split(',')??['fotos','cursos','blog'];
const {origin,api,json}=await adminApi(environment);
const DIR='docs/editorial/2026-11-11';
const backupDir=`.data/release-2026-11-11/${environment}`;await mkdir(backupDir,{recursive:true});
const exists=(path:string)=>access(path).then(()=>true,()=>false);
const entry=(collection:string,slug:string)=>api(`/_emdash/api/content/${collection}/${slug}?locale=es`);
const find=async(collection:string,slug:string)=>{try{return await entry(collection,slug)}catch(error){if(/HTTP 404/.test(String(error)))return null;throw error}};
async function backup(name:string,value:unknown){await writeFile(`${backupDir}/${name}.json`,JSON.stringify(value,null,2),{mode:0o600,flag:'wx'}).catch(e=>{if(e.code!=='EEXIST')throw e;});}
const log:string[]=[];
const texts=(list:string[])=>list.map(text=>({text}));

/** Guarda los cambios como borrador y publica. `same` decide si un campo ya está al día. */
async function update(collection:string,slug:string,changes:Record<string,unknown>,label=Object.keys(changes).join(', ')){
 const current=await entry(collection,slug);
 const diff=Object.fromEntries(Object.entries(changes).filter(([k,v])=>JSON.stringify(current.item.data[k])!==JSON.stringify(v)));
 if(!Object.keys(diff).length){
  const pending=current.item.status==='published'&&current.item.draftRevisionId&&current.item.draftRevisionId!==current.item.liveRevisionId;
  if(!pending){log.push(`= ${collection}/${slug} sin cambios (${label})`);return;}
  log.push(`~ ${collection}/${slug}: borrador pendiente de publicar`);
  if(publish)await api(`/_emdash/api/content/${collection}/${current.item.id}/publish?locale=es`,json('POST',{_rev:current._rev}));
  return;
 }
 log.push(`~ ${collection}/${slug}: ${Object.keys(diff).join(', ')}`);
 if(!publish)return;
 await backup(`${collection}-${slug}-contenido`,current);
 await api(`/_emdash/api/content/${collection}/${current.item.id}?locale=es`,json('PUT',{_rev:current._rev,data:{...current.item.data,...diff}}));
 if(current.item.status!=='published')return; // un programado o borrador conserva su estado
 const fresh=await entry(collection,slug);
 await api(`/_emdash/api/content/${collection}/${fresh.item.id}/publish?locale=es`,json('POST',{_rev:fresh._rev}));
}

async function upload(file:string,name:string,alt:string){
 const form=new FormData();form.set('file',new Blob([await readFile(file)],{type:'image/jpeg'}),name);form.set('deduplicate','true');
 const media=(await api('/_emdash/api/media',{method:'POST',body:form})).item;
 await api('/_emdash/api/media/'+media.id,json('PUT',{alt,caption:'Curso de Globos Online'}));
 return {...mediaItemToValue('local',{...media,meta:{storageKey:media.storageKey}}),alt};
}

// ── A · Fotos ────────────────────────────────────────────────────────────────────────────────
const FOTOS:{file:string;collection:'courses'|'blog';slug:string;field:'cover'|'hero';alt:string}[]=[
 {file:'cover-globoflexia',collection:'courses',slug:'curso-de-globoflexia',field:'cover',alt:'Animador termina un perrito de globoflexia con un globo largo turquesa en una fiesta infantil'},
 {file:'cover-flores',collection:'courses',slug:'curso-de-flores-con-globos',field:'cover',alt:'Decoradora coloca una flor de globos rosa con centro amarillo en un centro de mesa'},
 {file:'cover-bouquets',collection:'courses',slug:'curso-de-bouquets-de-globos',field:'cover',alt:'Mujer ata las cintas de un bouquet de globos dorados, blancos y rosa a una caja de desayuno sorpresa'},
 {file:'cover-burbuja',collection:'courses',slug:'curso-de-globos-burbuja',field:'cover',alt:'Decoradora sostiene un globo burbuja transparente con globos pastel dentro y cola de tassels'},
 {file:'cover-decoracion',collection:'courses',slug:'curso-de-decoracion-con-globos',field:'cover',alt:'Dos decoradoras arman un arco orgánico de globos terracota, crema y verde sobre un aro metálico'},
 {file:'blog-globos-con-confeti',collection:'blog',slug:'globos-con-confeti',field:'hero',alt:'Manos frotan un globo transparente con confeti de colores contra una manga de lana para repartirlo'},
 {file:'blog-perrito-con-globo',collection:'blog',slug:'perrito-con-globo',field:'hero',alt:'Manos tuercen un globo largo rosado a medio camino de un perrito, junto a uno ya terminado'},
];
if(only.includes('fotos'))for(const foto of FOTOS){
 const path=`${DIR}/fotos/${foto.file}.jpg`;
 if(!await exists(path)){log.push(`! falta ${path}: se salta`);continue;}
 const current=await find(foto.collection,foto.slug);
 if(!current){log.push(`! no existe ${foto.collection}/${foto.slug}: se salta`);continue;}
 if(current.item.data[foto.field]?.alt===foto.alt&&current.item.data[foto.field]?.filename===`${foto.file}.jpg`){log.push(`= ${foto.collection}/${foto.slug} ya tiene la foto nueva`);continue;}
 log.push(`~ ${foto.collection}/${foto.slug}: ${foto.field} ← ${foto.file}.jpg`);
 if(!publish)continue;
 const value=await upload(path,`${foto.file}.jpg`,foto.alt);
 await update(foto.collection,foto.slug,foto.field==='hero'?{hero:value,hero_alt:foto.alt}:{cover:value},foto.field);
 log.pop(); // update() ya dejó su línea
}

// ── B · Parche SEO de las fichas ─────────────────────────────────────────────────────────────
const patchFile='docs/seo/2026-11-11-parche-contenido-cursos.json';
if(only.includes('cursos')){
 if(!await exists(patchFile))log.push(`! falta ${patchFile}: se salta el parche de fichas`);
 else{
  const patch=JSON.parse(await readFile(patchFile,'utf8')) as Record<string,Record<string,unknown>>;
  for(const [slug,fields] of Object.entries(patch)){
   const changes:Record<string,unknown>={};
   for(const [key,value] of Object.entries(fields)){
    if(['short_description','meta_description'].includes(key)){assert.equal(typeof value,'string');changes[key]=value;}
    else if(['learnings','audience','keywords'].includes(key)){assert.ok(Array.isArray(value)&&value.every(x=>typeof x==='string'),`${slug}.${key} debe ser una lista de textos`);changes[key]=texts(value as string[]);}
    else if(key==='faqs'){assert.ok(Array.isArray(value)&&value.every(x=>x&&typeof x.q==='string'&&typeof x.a==='string'),`${slug}.faqs mal formado`);changes[key]=value;}
    else if(key==='body'){assert.equal(typeof value,'string');assert.ok(!/^#{1,2}\s/m.test(value as string),`${slug}.body no puede llevar H1 ni H2`);changes[key]=migrateBody(value as string);}
    else log.push(`! ${slug}.${key}: campo no admitido, se ignora`);
   }
   if(typeof changes.short_description==='string')assert.ok((changes.short_description as string).length<=170,`${slug}.short_description supera 170 caracteres`);
   if(typeof changes.meta_description==='string')assert.ok((changes.meta_description as string).replace('{lugar}','Estados Unidos').length<=165,`${slug}.meta_description supera 165 caracteres con el país más largo`);
   if(Object.keys(changes).length)await update('courses',slug,changes);
  }
 }
}

// ── C · Artículos nuevos ─────────────────────────────────────────────────────────────────────
interface Articulo{slug:string;title:string;seoTitle:string;description:string;primary:string;keywords:string[];pillar:string;course:string;related:string[];faqs:{q:string;a:string}[];status:'publicar'|'programar';publishAt?:string;heroAlt:string}
const specFile=`${DIR}/articulos.json`;
if(only.includes('blog')){
 if(!await exists(specFile))log.push(`! falta ${specFile}: se saltan los artículos`);
 else{
  const specs=JSON.parse(await readFile(specFile,'utf8')) as Articulo[];
  const list=await api('/_emdash/api/content/blog?locale=es&limit=100');
  const idBySlug=new Map<string,string>(list.items.map((x:{slug:string;id:string})=>[x.slug,x.id]));
  for(const spec of specs){
   assert.ok(!/^cursos?\b/i.test(spec.primary),`${spec.slug}: la búsqueda principal no puede empezar por «curso»`);
   assert.ok(spec.seoTitle.length<=62&&spec.description.length<=162,`${spec.slug}: título SEO o descripción demasiado largos`);
   if(spec.status==='programar')assert.ok(spec.publishAt&&!Number.isNaN(Date.parse(spec.publishAt)),`${spec.slug}: falta la fecha de programación`);
   // Si el script se ejecuta después de la fecha prevista, el artículo sale ya en vez de fallar.
   if(spec.status==='programar'&&new Date(spec.publishAt!)<=new Date()){log.push(`! ${spec.slug}: su fecha (${spec.publishAt}) ya pasó; se publica ahora`);spec.status='publicar';}
   const md=`${DIR}/${spec.slug}.md`;const photo=`${DIR}/fotos/blog-${spec.slug}.jpg`;
   if(!await exists(md)||!await exists(photo)){log.push(`! ${spec.slug}: falta ${!await exists(md)?md:photo}; se salta`);continue;}
   if(idBySlug.has(spec.slug)){const existing=await entry('blog',spec.slug);log.push(`= blog/${spec.slug} ya existe (${existing.item.status}${existing.item.scheduledAt?' para '+existing.item.scheduledAt:''})`);continue;}
   log.push(`+ blog/${spec.slug} → ${spec.status==='publicar'?'publicar ahora':'programar '+spec.publishAt}`);
   if(!publish)continue;
   const [template,course]=await Promise.all([entry('blog',spec.pillar),entry('courses',spec.course)]);
   const hero=await upload(photo,`${spec.slug}.jpg`,spec.heroAlt);
   const when=spec.status==='publicar'?new Date().toISOString():new Date(spec.publishAt!).toISOString();
   const data={title:spec.title,seo_title:spec.seoTitle,description:spec.description,discover_title:spec.title,is_pillar:false,
    primary_keyword:spec.primary,keywords:texts(spec.keywords),money_anchor:'Ver el curso y su temario',hero,hero_alt:spec.heroAlt,
    original_published_at:when,faqs:spec.faqs,body:migrateBody((await readFile(md,'utf8')).split(/\n## Preguntas frecuentes\b/)[0]!.trimEnd()+'\n'),template:'globos-classic',catalog_cta:false};
   const refs={cluster_link:template.item.references.cluster_link.children.map((x:{id:string})=>x.id),author_link:template.item.references.author_link.children.map((x:{id:string})=>x.id),
    course_link:[course.item.id],pillar_link:[idBySlug.get(spec.pillar)],related_links:spec.related.map(x=>idBySlug.get(x))};
   assert.ok(Object.values(refs).flat().every(Boolean),`${spec.slug}: alguna referencia (pilar, curso o relacionados) no existe`);
   await api('/_emdash/api/content/blog',json('POST',{slug:spec.slug,locale:'es',status:'draft',data,references:refs}));
   const created=await entry('blog',spec.slug);idBySlug.set(spec.slug,created.item.id);await backup(`blog-${spec.slug}-creado`,created);
   if(spec.status==='publicar')await api(`/_emdash/api/content/blog/${created.item.id}/publish?locale=es`,json('POST',{_rev:created._rev}));
   else await api(`/_emdash/api/content/blog/${created.item.id}/schedule?locale=es`,json('POST',{_rev:created._rev,scheduledAt:when}));
  }
 }
}

console.log(log.join('\n'));
console.log(publish?`Aplicado en ${environment} (${origin}). Respaldos en ${backupDir}.`:`Simulación en ${environment}: nada se modificó. Añade --publish para aplicar.`);
