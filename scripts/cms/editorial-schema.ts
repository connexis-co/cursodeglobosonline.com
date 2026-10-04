import type {SeedFile,SeedField} from 'emdash/seed';
import {RELATIONS,RETIRED_FIELDS} from '../../src/lib/cms/relations';
const ref=(slug:string,label:string,target:string,multiple=false):SeedField=>({slug,label,type:'reference',validation:{targetCollection:target,multiple}});
export function upgradeEditorialSeed(seed:SeedFile){
 const collections=seed.collections!,content=seed.content!;
 const original=structuredClone(content);
 const add=(slug:string,label:string,fields:SeedField[])=>collections.push({slug,label,labelSingular:label,titleField:'name',supports:['drafts','revisions'],routable:false,group:'Catálogos relacionados',fields});
 add('subcategories','Subcategorías',[{slug:'name',label:'Nombre para selector (categoría / subcategoría)',type:'string',required:true},{slug:'short_name',label:'Nombre público',type:'string',required:true},{slug:'local_slug',label:'Identificador dentro de la categoría',type:'string',required:true},ref('category_link','Categoría','categories')]);
 add('producers','Productores',[{slug:'name',label:'Nombre',type:'string',required:true}]);
 content.subcategories=[];
 for(const cat of original.categories??[])for(const sub of cat.data.subcategories as {slug:string;name:string}[]??[]){const slug=cat.slug+'--'+sub.slug;content.subcategories.push({id:'subcategories:'+slug,slug,locale:'es',status:'published',data:{name:cat.data.name+' / '+sub.name,short_name:sub.name,local_slug:sub.slug,category_link:'$ref:categories:'+cat.slug}});}
 content.producers=[{id:'producers:masterclasses',slug:'masterclasses',locale:'es',status:'published',data:{name:'MasterClasses.La'}}];
 const labels:Record<string,string>={subcategory_link:'Subcategoría (incluye su categoría)',producer_link:'Productor',cluster_link:'Tema editorial',author_link:'Autor',course_link:'Curso relacionado',pillar_link:'Artículo pilar',related_links:'Artículos relacionados',country_link:'País',country_links:'Países incluidos (vacío: todos)',course_links:'Cursos incluidos (vacío: todos)',excluded_course_links:'Cursos excluidos'};
 for(const collection of collections){
  collection.fields=collection.fields.filter(f=>!RETIRED_FIELDS[collection.slug]?.includes(f.slug));
  for(const [slug,r] of Object.entries(RELATIONS[collection.slug]??{}))if(!collection.fields.some(f=>f.slug===slug))collection.fields.push(ref(slug,labels[slug]??slug,r.target,r.multiple));
 }
 for(const [col,entries] of Object.entries(content))for(const entry of entries){
  const old=original[col]?.find(e=>e.slug===entry.slug)?.data;if(!old)continue;
  for(const key of RETIRED_FIELDS[col]??[])delete entry.data[key];
  const set=(field:string,target:string,value:unknown)=>{if(value)entry.data[field]='$ref:'+target+':'+value;};
  if(col==='courses'){set('subcategory_link','subcategories',old.category+'--'+old.subcategory);set('producer_link','producers','masterclasses');}
  if(col==='cities')set('country_link','countries',old.country);
  if(col==='blog'){
   set('cluster_link','clusters',old.cluster);set('author_link','authors',old.author??original.authors?.[0]?.slug);
   set('course_link','courses',old.money_page==='catalogo'?undefined:old.money_page);entry.data.catalog_cta=old.money_page==='catalogo';
   set('pillar_link','blog',old.pillar);entry.data.related_links=(old.related as {text:string}[]??[]).map(x=>'$ref:blog:'+x.text);
  }
  if(col==='testimonials')set('course_link','courses',old.course_slug);
 }
 collections.find(c=>c.slug==='blog')!.fields.push({slug:'catalog_cta',label:'Enlazar al catálogo completo',type:'boolean',defaultValue:false});
 collections.find(c=>c.slug==='blog')!.commentsEnabled=true;
 const p=collections.find(c=>c.slug==='promotions')!;
 p.fields.push({slug:'offer_verified',label:'Oferta y cupón verificados para los cursos seleccionados',type:'boolean',defaultValue:false},{slug:'calendar_source',label:'Referencia del calendario',type:'text'},{slug:'verification_notes',label:'Comprobación de la oferta y condiciones',type:'text'});
 seed.menus??=[];seed.menus.push({name:'footer',label:'Pie de página · institucional',items:[['Nosotros','/nosotros/'],['Blog','/blog/'],['Contacto','/contacto/'],['Mapa del sitio','/sitemap/'],['Términos y condiciones','/legal/terminos/'],['Política de privacidad','/legal/privacidad/']].map(([label,url])=>({type:'custom' as const,label:label!,url:url!}))});
 // Parent catalogs precede their children; blog-to-blog forward links use the bootstrap second pass.
 const order=['countries','categories','clusters','authors','producers','subcategories','courses','blog','cities','testimonials','pages','videos','graphics','promotions'];seed.content=Object.fromEntries(order.filter(k=>content[k]).map(k=>[k,content[k]!]));
 const pages=collections.find(c=>c.slug==='pages')!;pages.routable=true;pages.urlPattern='/paginas/{slug}/';
 pages.fields.find(f=>f.slug==='path')!.label='Ruta pública (la política valida que corresponda al slug)';
}
