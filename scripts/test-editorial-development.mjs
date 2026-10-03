import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {api,json,headers,origin} from './dev-api.mjs';
const slug='migration-editor-check-'+Date.now();const base='/_emdash/api/content/pages/'+slug;
let created=false;const results=[];
async function page(){const r=await fetch(origin+'/paginas/'+slug+'/',{headers});return{status:r.status,html:await r.text()};}
try{
 await api('/_emdash/api/content/pages',json('POST',{slug,status:'draft',data:{title:'Prueba editorial temporal',path:'/paginas/'+slug+'/',heading:'Versión inicial',body:[],template:'globos-classic'}}));created=true;
 assert.equal((await page()).status,404);results.push('A draft has no public page');
 let entry=await api(base+'?locale=es');assert.equal(entry.item.locale,'es');results.push('New content defaults to Spanish');await api(base+'/publish?locale=es',json('POST',{_rev:entry._rev}));
 let rendered=await page();assert.equal(rendered.status,200);assert.ok(rendered.html.includes('Versión inicial'));results.push('Publishing makes the page visible without a build');
 entry=await api(base+'?locale=es');await api(base+'?locale=es',json('PUT',{data:{...entry.item.data,heading:'Versión nueva pendiente'},_rev:entry._rev}));
 rendered=await page();assert.ok(rendered.html.includes('Versión inicial'));assert.ok(!rendered.html.includes('Versión nueva pendiente'));results.push('Unpublished edits do not replace published content');
 entry=await api(base+'?locale=es');await api(base+'/publish?locale=es',json('POST',{_rev:entry._rev}));
 rendered=await page();assert.ok(rendered.html.includes('Versión nueva pendiente'));results.push('Published edits appear immediately');
 entry=await api(base+'?locale=es');await api(base+'?locale=es',json('PUT',{_rev:entry._rev,seo:{title:'Título SEO editorial comprobado',description:'Descripción comprobada desde el panel.',noIndex:true}}));
 entry=await api(base+'?locale=es');await api(base+'/publish?locale=es',json('POST',{_rev:entry._rev}));rendered=await page();assert.ok(rendered.html.includes('<title>Título SEO editorial comprobado</title>'));assert.ok(rendered.html.includes('Descripción comprobada desde el panel.'));results.push('Native SEO panel controls title and description');
 console.log(results);
 await writeFile('docs/migration/verification/editorial.json',JSON.stringify({checkedAt:new Date().toISOString(),results},null,2)+'\n');
}finally{if(created){await api(base+'?locale=es',{method:'DELETE'});console.log('Temporary editorial test moved to trash.');}}
