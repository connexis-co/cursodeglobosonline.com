import {getEmDashEntry} from 'emdash';
import {getRequestContext} from 'emdash/request-context';
import {RELATIONS} from './relations';
interface Row{id:string;data:unknown}
const caches=new WeakMap<object,Map<string,Row>>();
export function hydrateRelations(collection:string,row:Row):Promise<Row>{
 const definitions=RELATIONS[collection];if(!definitions)return Promise.resolve(row);
 const ctx=getRequestContext();let cache=ctx?caches.get(ctx):undefined;if(ctx&&!cache){cache=new Map();caches.set(ctx,cache);}
 const key=collection+':'+row.id;const hit=cache?.get(key);if(hit)return Promise.resolve(hit);
 const task=(async()=>{
  const references=Object.fromEntries(Object.keys(definitions).map(k=>[k,{limit:100}]));
  const result=await getEmDashEntry(collection,row.id,{locale:'es',references});if(result.error)throw result.error;if(!result.entry)return row;
  const data={...(result.entry.data as Record<string,unknown>)};
  for(const [field,definition] of Object.entries(definitions)){
   const page=result.entry.references?.[field];if(page?.nextCursor)throw Error('Reference selection exceeds 100: '+collection+'.'+field);
   const entries=page?.entries??[];
   const slugs=entries.map(e=>String((e.data as Record<string,unknown>).slug??e.id));
   const output=definition.output.replace(/[A-Z]/g,c=>'_'+c.toLowerCase());data[output]=definition.multiple?slugs:slugs[0]??'';
   if(collection==='courses'&&field==='producer_link')data.producer=(entries[0]?.data as Record<string,unknown>|undefined)?.name??'';
   if(collection==='courses'&&field==='subcategory_link'&&entries[0]){
    const sub=await hydrateRelations('subcategories',entries[0]);const d=sub.data as Record<string,unknown>;
    data.category=d.category;data.subcategory=d.local_slug;
   }
  }
  if(collection==='blog'&&data.catalog_cta)data.money_page='catalogo';
  return{...row,data};
 })();return task.then(value=>{cache?.set(key,value);return value;});
}
