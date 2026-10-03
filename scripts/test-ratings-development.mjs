import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {writeFile} from 'node:fs/promises';
import {api,json,headers,origin} from './dev-api.mjs';
const slug='migration-rating-check-'+Date.now(),base='/_emdash/api/content/courses/'+slug;let created=false;
const source=await api('/_emdash/api/content/courses/curso-de-globoflexia?locale=es');
await writeFile('/tmp/globos-rating-test-cleanup.sql',`DELETE FROM course_votes WHERE course = '${slug}';\n`);
async function vote(voter,rating,extra={}){const r=await fetch(origin+'/api/ratings',{method:'POST',headers:{...headers,'Content-Type':'application/json',...extra},body:JSON.stringify({course:slug,rating,voter})});return{status:r.status,data:await r.json()};}
try{
 await api('/_emdash/api/content/courses',json('POST',{slug,locale:'es',status:'draft',data:{...source.item.data,title:'Curso temporal de prueba de votos'}}));created=true;
 const voter=randomUUID();assert.equal((await vote(voter,5)).status,400);
 let entry=await api(base+'?locale=es');await api(base+'/publish?locale=es',json('POST',{_rev:entry._rev}));
 assert.equal((await vote(voter,5,{origin:'https://unrelated.invalid'})).status,403);assert.equal((await vote(voter,9)).status,400);
 let r=await vote(voter,5);assert.equal(r.status,200);assert.equal(r.data.count,1);assert.equal(r.data.average,5);
 r=await vote(voter,3);assert.equal(r.data.count,1);assert.equal(r.data.average,3);
 assert.equal((await vote(randomUUID(),4)).status,200);assert.equal((await vote(randomUUID(),5)).status,200);assert.equal((await vote(randomUUID(),5)).status,429);
 await writeFile('docs/migration/verification/ratings.json',JSON.stringify({checkedAt:new Date().toISOString(),checks:['Draft courses cannot receive votes','Cross-origin voting denied','Rating range validated','Published new CMS course accepts votes','Changing a vote does not increment count','Fourth distinct voter at one IP is rate limited']},null,2)+'\n');
 console.log('Ratings tests passed for a temporary CMS course.');
}finally{if(created)await api(base+'?locale=es',{method:'DELETE'});}
