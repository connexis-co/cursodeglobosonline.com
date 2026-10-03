import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {api,json,headers,origin} from './dev-api.mjs';
const posts=(await api('/_emdash/api/content/blog?locale=es&limit=100')).items.filter(p=>p.status==='published');
const post=posts[0],other=posts[1],endpoint=`/_emdash/api/comments/blog/${post.id}`;
const marker='Comentario de prueba '+Date.now(),body=marker+' <b>texto literal</b>';
const payload={authorName:'Verificación temporal',authorEmail:'prueba@example.invalid',body};
const created=[],checks=[];
const html=async()=>{const r=await fetch(origin+'/blog/'+post.slug+'/',{headers,signal:AbortSignal.timeout(30000)});assert.equal(r.status,200);return r.text();};
async function status(id,value){await api(`/_emdash/api/admin/comments/${id}/status`,json('PUT',{status:value}));}
async function reject(path,input,expected){const r=await fetch(origin+path,{...json('POST',input),headers:{...headers,'content-type':'application/json'},signal:AbortSignal.timeout(30000)});assert.equal(r.status,expected);}
try{
 const submitted=await api(endpoint,json('POST',payload));created.push(submitted.id);assert.equal(submitted.status,'pending');checks.push('New comments require moderation, including CMS users');
 let publicList=await api(endpoint);assert.ok(!JSON.stringify(publicList).includes(marker));
 let page=await html();assert.ok(page.includes('data-blog-comment-form'));assert.ok(!page.includes(marker));checks.push('Pending comments are hidden in the public API and article');
 await status(submitted.id,'approved');publicList=await api(endpoint);assert.ok(publicList.items.some(x=>x.id===submitted.id));
 assert.ok(!JSON.stringify(publicList).includes('authorEmail'));assert.ok(!JSON.stringify(publicList).includes('ipHash'));checks.push('Approved comments are public without email or IP');
 page=await html();assert.ok(page.includes(marker));assert.ok(page.includes('&lt;b&gt;texto literal&lt;/b&gt;'));assert.ok(!page.includes('<b>texto literal</b>'));assert.ok(page.includes(`data-comment-reply="${submitted.id}"`));checks.push('Article renders approved text safely, with reply controls');
 const reply=await api(endpoint,json('POST',{...payload,body:marker+' respuesta',parentId:submitted.id}));created.push(reply.id);assert.equal(reply.status,'pending');await status(reply.id,'approved');
 const threads=await api(endpoint+'?threaded=true');assert.ok(threads.items.find(x=>x.id===submitted.id).replies.some(x=>x.id===reply.id));checks.push('Approved replies stay attached to their article and parent');
 await reject(`/_emdash/api/comments/blog/${other.id}`,{...payload,parentId:submitted.id},400);checks.push('Replies cannot reference a comment from another article');
 const trap=await api(endpoint,json('POST',{...payload,body:marker+' bot',website_url:'https://example.invalid'}));assert.equal(trap.status,'pending');assert.equal(trap.id,undefined);checks.push('Honeypot returns without storing a bot submission');
 await reject('/_emdash/api/comments/blog/nonexistent',{...payload},404);await reject('/_emdash/api/comments/courses/nonexistent',{...payload},403);checks.push('Missing articles and disabled collections reject comments');
 await status(reply.id,'spam');await status(submitted.id,'trash');assert.ok(!(await html()).includes(marker));checks.push('Moderation removes comments from the article');
 await writeFile('docs/migration/verification/comments.json',JSON.stringify({checkedAt:new Date().toISOString(),checks,emailSent:false},null,2)+'\n');console.log(checks);
}finally{for(const id of created.reverse())await api('/_emdash/api/admin/comments/'+id,{method:'DELETE'});console.log('Temporary comments removed.');}
