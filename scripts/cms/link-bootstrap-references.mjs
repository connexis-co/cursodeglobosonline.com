/** Fresh-install second pass: resolves forward references after all seed entries exist. */
import {readFile} from 'node:fs/promises';import {api,json} from '../dev-api.mjs';
const seed=JSON.parse(await readFile('emdash.seed.json','utf8'));const ids=new Map();
for(const [col,entries] of Object.entries(seed.content))for(const e of entries){const current=await api(`/_emdash/api/content/${col}/${e.slug}?locale=es`);ids.set(e.id,current.item.id);}
for(const [col,entries] of Object.entries(seed.content))for(const e of entries){
 const wanted=Object.fromEntries(Object.entries(e.data).filter(([,v])=>(Array.isArray(v)?v:[v]).some(x=>typeof x==='string'&&x.startsWith('$ref:'))).map(([f,v])=>[f,(Array.isArray(v)?v:[v]).map(x=>{const id=ids.get(x.slice(5));if(!id)throw Error('Unknown seed reference '+x);return id;})]));
 if(!Object.keys(wanted).length)continue;
 const base=`/_emdash/api/content/${col}/${e.slug}?locale=es`,current=await api(base);
 const missing=Object.fromEntries(Object.entries(wanted).filter(([f])=>!current.item.references?.[f]?.children?.length));
 if(!Object.keys(missing).length)continue;
 if(current.item.draftRevisionId&&current.item.liveRevisionId)throw Error('Existing editorial draft; stop bootstrap repair.');
 await api(base,json('PUT',{references:missing,_rev:current._rev}));
 if(current.item.status==='published'){const fresh=await api(base);await api(`/_emdash/api/content/${col}/${e.slug}/publish?locale=es`,json('POST',{_rev:fresh._rev}));}
 console.log('Completed bootstrap links:',col,e.slug);
}
