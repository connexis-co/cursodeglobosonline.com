/** Development-only metadata experiment informed by finalized September GSC data. */
import {api,json,origin,headers} from '../dev-api.mjs';
import {writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
assert.equal(origin,'https://dev.cursodeglobosonline.com');
const changes=[
 {slug:'tipos-y-tamanos-de-globos',title:'Tamaños de globos: tabla en cm, pulgadas y números',description:'Consulta la tabla de tamaños de globos en cm y pulgadas. Compara números, materiales y medidas para elegir globos de arcos, bouquets y figuras.'},
 {slug:'como-inflar-globos-largos',title:'Cómo inflar globos largos con inflador, paso a paso',description:'Infla globos largos 260 con inflador manual o eléctrico: qué boquilla usar, cuánta cola dejar y cómo hacer el nudo sin reventarlos. Guía paso a paso.'},
];
await mkdir('.data',{recursive:true});
const report=[];
for(const change of changes){
 const path='/_emdash/api/content/blog/'+change.slug+'?locale=es';
 const entry=await api(path);
 if(entry.item.seo?.title&&entry.item.seo.title!==change.title)throw Error('An editor has set an SEO title; review before replacing: '+change.slug);
 await writeFile('.data/seo-before-'+change.slug+'.json',JSON.stringify(entry,null,2),{mode:0o600,flag:'wx'}).catch(error=>{if(error.code!=='EEXIST')throw error;});
 const seo={...entry.item.seo,title:change.title,description:change.description};
 await api(path,json('PUT',{_rev:entry._rev,seo}));
 // Native SEO is stored independently: never publish pending editorial body changes.
 const page=await fetch(origin+'/blog/'+change.slug+'/',{headers,signal:AbortSignal.timeout(60000)});const html=await page.text();
 assert.equal(page.status,200);assert.ok(html.includes('<title>'+change.title+'</title>'));assert.ok(html.includes(change.description));
 report.push({slug:change.slug,before:entry.item.seo,after:seo,checkedAt:new Date().toISOString()});
}
await writeFile('docs/migration/verification/seo-title-experiment.json',JSON.stringify({environment:'development',productionApplied:false,changes:report},null,2)+'\n');
console.log('Two SEO metadata changes saved and verified in development; article bodies unchanged.');
