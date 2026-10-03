import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {writeFile} from 'node:fs/promises';
import {api,json,headers,origin} from './dev-api.mjs';
const slug='migration-blog-rating-check-'+Date.now();
let currentSlug=slug,created=false,id;
const base=()=> '/_emdash/api/content/blog/'+currentSlug;
const source=await api('/_emdash/api/content/blog/tipos-y-tamanos-de-globos?locale=es');
async function vote(voter,rating,extra={}){
 const r=await fetch(origin+'/api/blog-ratings',{method:'POST',headers:{...headers,'Content-Type':'application/json',...extra},body:JSON.stringify({post:id,rating,voter}),signal:AbortSignal.timeout(60000)});
 return {status:r.status,data:await r.json()};
}
try{
 await api('/_emdash/api/content/blog',json('POST',{slug,locale:'es',status:'draft',data:{...source.item.data,title:'Artículo temporal de prueba de votos'},references:Object.fromEntries(Object.entries(source.item.references).map(([k,v])=>[k,v.children.map(c=>c.id)]))}));created=true;
 let entry=await api(base()+'?locale=es');id=entry.item.id;
 assert.match(id,/^[0-7][0-9A-HJKMNP-TV-Z]{25}$/);
 await writeFile('/tmp/globos-blog-rating-test-cleanup.sql',`DELETE FROM blog_votes WHERE post_id = '${id}';\n`);
 const voter=randomUUID();assert.equal((await vote(voter,5)).status,400);
 await api(base()+'/publish?locale=es',json('POST',{_rev:entry._rev}));
 assert.equal((await vote(voter,5,{origin:'https://unrelated.invalid'})).status,403);
 assert.equal((await vote(voter,9)).status,400);
 let r=await vote(voter,5);assert.equal(r.status,200,JSON.stringify(r));assert.equal(r.data.count,1);assert.equal(r.data.average,5);
 r=await vote(voter,3);assert.equal(r.data.count,1);assert.equal(r.data.average,3);
 assert.equal((await vote(randomUUID(),4)).status,200);assert.equal((await vote(randomUUID(),5)).status,200);assert.equal((await vote(randomUUID(),5)).status,429);
 const get=await fetch(origin+'/api/blog-ratings',{headers});const summaries=await get.json();assert.equal(summaries.posts[id].count,3);assert.equal(summaries.posts[id].average,4);
 const page=await fetch(origin+'/blog/'+slug+'/',{headers});const html=await page.text();assert.equal(page.status,200);assert.ok(html.includes('data-content-id="'+id+'"'));assert.ok(html.includes('data-rating-kind="blog"'));assert.ok(html.includes('data-count="3"'));
 const courses=await(await fetch(origin+'/api/ratings',{headers})).json();assert.ok(!Object.hasOwn(courses.courses,id));
 await writeFile('docs/migration/verification/blog-ratings.json',JSON.stringify({checkedAt:new Date().toISOString(),checks:['Stable CMS ID used for article votes','Draft cannot receive votes','Cross-origin voting denied','Rating range validated','Published article accepts votes','Changing a vote keeps count','Fourth distinct browser per IP rate limited','GET summary agrees with stored votes','Article renders same aggregate on server','Course votes stay separate']},null,2)+'\n');
 console.log('Blog ratings tests passed with a disposable article.');
}finally{if(created)await api(base()+'?locale=es',{method:'DELETE'});}
