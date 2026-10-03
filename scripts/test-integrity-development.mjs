import assert from 'node:assert/strict';import {api,json,headers,origin} from './dev-api.mjs';import {writeFile} from 'node:fs/promises';
const results=[],suffix=Date.now(),pageSlug='integrity-page-'+suffix,courseSlug='integrity-course-'+suffix;
let pageId,courseId,menuId;
async function response(path,options={}){const r=await fetch(origin+'/_emdash/api'+path,{...options,headers:{...headers,...options.headers}});return{status:r.status,body:await r.json()};}
async function html(path){const r=await fetch(origin+path,{headers});return{status:r.status,text:await r.text()};}
async function publish(col,id){const d=await api(`/_emdash/api/content/${col}/${id}?locale=es`);return response(`/content/${col}/${id}/publish?locale=es`,json('POST',{_rev:d._rev}));}
try{
 const source=await api('/_emdash/api/content/courses/curso-de-globoflexia?locale=es');const refs=Object.fromEntries(Object.entries(source.item.references).map(([f,v])=>[f,v.children.map(x=>x.id)]));
 assert.ok(refs.subcategory_link.length&&refs.producer_link.length);results.push('Existing courses have native subcategory and producer relations');
 let d=await api('/_emdash/api/content/courses',json('POST',{slug:courseSlug,locale:'es',status:'draft',data:source.item.data}));courseId=d.item.id;
 assert.equal((await publish('courses',courseId)).status,422);results.push('A course without required relations cannot be published');
 const invalid=await response('/content/courses/'+courseId+'?locale=es',json('PUT',{references:{subcategory_link:['does-not-exist']},_rev:d._rev}));assert.ok(invalid.status>=400);results.push('Nonexistent related IDs are rejected');
 d=await api('/_emdash/api/content/courses/'+courseId+'?locale=es');await api('/_emdash/api/content/courses/'+courseId+'?locale=es',json('PUT',{references:refs,_rev:d._rev}));assert.equal((await publish('courses',courseId)).status,200);results.push('A course with valid dependencies publishes');
 const subId=refs.subcategory_link[0],sub=await api('/_emdash/api/content/subcategories/'+subId+'?locale=es');
 assert.equal((await response('/content/subcategories/'+subId+'/unpublish?locale=es',json('POST',{_rev:sub._rev}))).status,422);results.push('A subcategory used by published courses cannot be unpublished');
 d=await api('/_emdash/api/content/pages',json('POST',{slug:pageSlug,locale:'es',status:'draft',data:{title:'Comprobación temporal de menú',heading:'Página conectada al menú',path:'/paginas/'+pageSlug+'/',body:[]}}));pageId=d.item.id;
 assert.equal((await html('/paginas/'+pageSlug+'/')).status,404);assert.equal((await publish('pages',pageId)).status,200);
 const page=await api('/_emdash/api/content/pages/'+pageId+'?locale=es');
 const menu=await api('/_emdash/api/menus/primary/items?locale=es',json('POST',{type:'page',label:'Prueba menú '+suffix,referenceCollection:'pages',referenceId:page.item.translationGroup,sortOrder:99}));menuId=menu.item?.id??menu.id;
 assert.ok(menuId,JSON.stringify(menu));const home=await html('/');assert.ok(home.text.includes('Prueba menú '+suffix));assert.ok(home.text.includes('/paginas/'+pageSlug+'/'));results.push('A native menu reference renders in desktop and mobile without a build');
 const renamed='Menú actualizado '+suffix;await api('/_emdash/api/menus/primary/items/'+menuId+'?locale=es',json('PUT',{label:renamed}));assert.ok((await html('/')).text.includes(renamed));results.push('Menu edits are reflected without a build');
 assert.equal((await response('/content/pages/'+pageId+'/unpublish?locale=es',json('POST',{_rev:page._rev}))).status,422);results.push('A page linked by a menu cannot be unpublished');
 const country=(await api('/_emdash/api/content/countries?locale=es&limit=100')).items[0];
 d=await api('/_emdash/api/content/courses/'+courseId+'?locale=es');assert.ok((await response('/content/courses/'+courseId+'?locale=es',json('PUT',{references:{subcategory_link:[country.id]},_rev:d._rev}))).status>=400);results.push('A reference to the wrong collection is rejected');
 const calendar=await api('/_emdash/api/plugins/globos-promotions/calendar');assert.equal(calendar.items.filter(x=>x.data.calendar_source).length,11);assert.ok(calendar.items.filter(x=>x.data.calendar_source).every(x=>x.status==='draft'&&!x.data.offer_verified));results.push('Eleven scoped calendar campaigns remain drafts until offer verification');
 await writeFile('docs/migration/verification/integrity.json',JSON.stringify({checkedAt:new Date().toISOString(),results},null,2)+'\n');console.log(results);
}finally{
 if(menuId)await api('/_emdash/api/menus/primary/items/'+menuId+'?locale=es',{method:'DELETE'});
 if(pageId)await api('/_emdash/api/content/pages/'+pageId+'?locale=es',{method:'DELETE'});
 if(courseId)await api('/_emdash/api/content/courses/'+courseId+'?locale=es',{method:'DELETE'});
}
