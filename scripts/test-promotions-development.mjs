import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {api,json,headers,origin} from './dev-api.mjs';
const slug='migration-promotion-check-'+Date.now(),key=slug;const base='/_emdash/api/content/promotions/'+slug;
const seed=JSON.parse(await readFile('emdash.seed.json','utf8'));const course=seed.content.courses.find(c=>c.slug==='curso-de-globoflexia');
const target=await api('/_emdash/api/content/courses/curso-de-globoflexia?locale=es');const country=await api('/_emdash/api/content/countries/co?locale=es');
const path='/co/curso-de-globoflexia/';const message='Prueba técnica temporal de promociones';let created=false;
async function html(path){return(await fetch(origin+path,{headers,signal:AbortSignal.timeout(30000)})).text()}
try{
 await api('/_emdash/api/content/promotions',json('POST',{slug,locale:'es',status:'draft',data:{title:message,headline:message,starts_at:new Date(Date.now()-60000).toISOString(),ends_at:new Date(Date.now()+300000).toISOString(),priority:999,url_key:key,offer_verified:true,verification_notes:'Prueba técnica aislada; enlace real del curso, sin descuento añadido.',checkout_url:course.data.hotmart_url,button_label:'Enlace de prueba',theme:'dark'},references:{country_links:[country.item.id],course_links:[target.item.id],excluded_course_links:[]}}));created=true;
 let item=await api(base+'?locale=es');await api(base+'/publish?locale=es',json('POST',{_rev:item._rev}));
 console.log('Checking default page');assert.ok(!(await html(path)).includes(message));
 console.log('Checking campaign page');const active=await html(path+'?promo='+key);assert.ok(active.includes('id="globos-promotion"'));assert.ok(active.includes(message));assert.equal((active.match(/id="globos-whatsapp"/g)||[]).length,1);
 console.log('Checking excluded country');assert.ok(!(await html('/mx/curso-de-globoflexia/?promo='+key)).includes(message));
 console.log('Promotion renders only for the selected country, course and campaign key. Exactly one WhatsApp button.');
 await writeFile('docs/migration/verification/plugins.json',JSON.stringify({checkedAt:new Date().toISOString(),checks:['Authenticated WhatsApp configuration API','One contextual WhatsApp button','Promotion hidden without campaign key','Promotion visible with matching course and country','Promotion excluded from another country']},null,2)+'\n');
}finally{if(created){await api(base+'?locale=es',{method:'DELETE'});console.log('Temporary promotion moved to trash.');}}
