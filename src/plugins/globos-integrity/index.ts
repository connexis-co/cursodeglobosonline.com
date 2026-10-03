import {definePlugin,ContentRepository,type ContentPolicyEvent} from 'emdash';
import {getDb} from 'emdash/runtime';
import {RELATIONS} from '@/lib/cms/relations';
import {editorialError,FIXED_PAGE_PATHS} from './model';
async function selectedGroups(collection:string,content:Record<string,unknown>){
 const db=await getDb();const group=String(content.translationGroup??content.id);
 const fields=await db.selectFrom('_emdash_fields as f').innerJoin('_emdash_collections as c','c.id','f.collection_id').select(['f.slug','f.validation']).where('c.slug','=',collection).where('f.type','=','reference').execute();
 const edges=await db.selectFrom('_emdash_content_references as e').innerJoin('_emdash_relations as r','r.id','e.relation_id').select(['r.slug','e.child_group']).where('e.parent_group','=',group).orderBy('e.sort_order').execute();
 let staged:Record<string,string[]>={};if(typeof content.draftRevisionId==='string'){const revision=await db.selectFrom('revisions').select('data').where('id','=',content.draftRevisionId).executeTakeFirst();if(revision)staged=JSON.parse(revision.data)._references??{};}
 return Object.fromEntries(fields.map(f=>{const relation=JSON.parse(f.validation??'{}').relation;return[f.slug,staged[f.slug]??edges.filter(e=>e.slug===relation).map(e=>e.child_group)];}));
}
async function policy(event:ContentPolicyEvent){
 const d=(event.content.data??{}) as Record<string,unknown>;
 if(event.collection==='pages'){const original=await new ContentRepository(await getDb()).findById('pages',String(event.content.id));if(original?.slug&&FIXED_PAGE_PATHS[original.slug]&&original.slug!==event.content.slug)return{cancel:true as const,reason:'Esta página tiene una ruta fija del tema. Conserva su slug y edita su contenido.'};}
 const fail=editorialError(event.collection,String(event.content.slug??''),d);if(fail)return{cancel:true as const,reason:fail};
 const definitions=RELATIONS[event.collection];if(!definitions)return;
 const groups=await selectedGroups(event.collection,event.content);const repo=new ContentRepository(await getDb());
 for(const [field,definition] of Object.entries(definitions)){
  const selected=groups[field]??[];
  if(definition.required&&!selected.length)return{cancel:true as const,reason:`Selecciona ${field} antes de publicar.`};
  for(const group of selected){
   const translations=await repo.findTranslations(definition.target,group);
   if(!translations.some(x=>x.locale==='es'&&x.status==='published'))return{cancel:true as const,reason:`${field}: el elemento relacionado debe estar publicado en español.`};
   if(definition.target===event.collection&&group===event.content.translationGroup)return{cancel:true as const,reason:'Un contenido no puede relacionarse consigo mismo.'};
  }
 }
 if(event.collection==='blog'&&!d.catalog_cta&&!(groups.course_link?.length))return{cancel:true as const,reason:'Selecciona un curso o activa el enlace al catálogo.'};
 if(event.collection==='blog'&&d.catalog_cta&&groups.course_link?.length)return{cancel:true as const,reason:'Elige un curso o el catálogo, no ambos.'};
 if(event.collection==='promotions'&&groups.course_links?.some(g=>groups.excluded_course_links?.includes(g)))return{cancel:true as const,reason:'Un curso no puede estar incluido y excluido en la misma promoción.'};
}
async function incomingReason(collection:string,id:string){
 const db=await getDb(),repo=new ContentRepository(db);const item=await repo.findById(collection,id);if(!item)return;
 if(collection==='pages'&&item.slug&&FIXED_PAGE_PATHS[item.slug])return 'Esta página forma parte de las rutas esenciales del sitio. Puedes editarla, pero no retirarla.';
 const menu=await db.selectFrom('_emdash_menu_items').select('id').where('reference_collection','=',collection).where('reference_id','=',item.translationGroup??item.id).executeTakeFirst();if(menu)return 'Hay un menú que enlaza este contenido. Retira ese enlace antes de retirar el contenido.';
 const rows=await db.selectFrom('_emdash_content_references as e').innerJoin('_emdash_relations as r','r.id','e.relation_id').select(['r.parent_collection','e.parent_group']).where('e.child_group','=',item.translationGroup??item.id).execute();
 for(const row of rows){const parents=await repo.findTranslations(row.parent_collection,row.parent_group);const used=parents.find(p=>p.status==='published');if(used)return `Lo utiliza ${row.parent_collection}/${used.slug}. Cambia esa relación antes de retirarlo.`;}
}
export function createPlugin(){return definePlugin({id:'globos-integrity',version:'1.0.0',capabilities:['hooks.content-policy:register','content:read'],hooks:{
 'content:beforePublish':policy,'content:beforeSchedule':policy,
 'content:beforeUnpublish':async e=>{const reason=await incomingReason(e.collection,String(e.content.id));if(reason)return{cancel:true,reason};},
 'content:beforeDelete':{errorPolicy:'abort',handler:async e=>{if(await incomingReason(e.collection,e.id))return false;}},
}});}
