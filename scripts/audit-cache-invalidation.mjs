import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
const origin='https://cursodeglobosonline.com';
const line=(await readFile('.dev.vars.production','utf8')).split('\n').find(l=>l.startsWith('GLOBOS_ADMIN_PASSWORD='));
if(!line)throw Error('Local production authentication is required');
const secret=line.slice(line.indexOf('=')+1).replace(/^"|"$/g,'');
const headers={authorization:'Basic '+Buffer.from('sably:'+secret).toString('base64'),'X-EmDash-Request':'1',origin};
const get=async(path,opts={})=>{const r=await fetch(origin+path,{...opts,signal:AbortSignal.timeout(60000)});return {r,body:await r.text()};};
const before=await get('/');assert.equal(before.r.status,200);
const warm=await get('/');assert.equal(warm.r.headers.get('cf-cache-status'),'HIT');
const config=await get('/_emdash/api/plugins/globos-whatsapp/config',{headers});assert.equal(config.r.status,200);
const settings=JSON.parse(config.body).data.config;assert.ok(settings);
// Save the exact current settings; no contact, event, price or editorial data is changed.
const save=await get('/_emdash/api/plugins/globos-whatsapp/save',{method:'POST',headers:{...headers,'Content-Type':'application/json'},body:JSON.stringify(settings)});
assert.equal(save.r.status,200);assert.deepEqual(JSON.parse(save.body).data.config,settings);
const refreshed=await get('/');assert.equal(refreshed.r.status,200);assert.notEqual(refreshed.r.headers.get('cf-cache-status'),'HIT');
const hit=await get('/');assert.equal(hit.r.headers.get('cf-cache-status'),'HIT');
const privatePage=await get('/',{headers});assert.equal(privatePage.r.status,200);assert.equal(privatePage.r.headers.get('cache-control'),'private, no-store');assert.notEqual(privatePage.r.headers.get('cf-cache-status'),'HIT');
const alternate=await fetch('https://globos-emdash-production.rodrigomisat.workers.dev/',{signal:AbortSignal.timeout(60000)});await alternate.arrayBuffer();assert.equal(alternate.status,401);
const report={checkedAt:new Date().toISOString(),operation:'save unchanged WhatsApp configuration',settingsUnchanged:true,
 warm:warm.r.headers.get('cf-cache-status'),afterSave:refreshed.r.headers.get('cf-cache-status'),nextVisit:hit.r.headers.get('cf-cache-status'),
 authenticated:{status:privatePage.r.status,cache:privatePage.r.headers.get('cf-cache-status'),cacheControl:privatePage.r.headers.get('cache-control')},
 workersDev:{status:alternate.status,cache:alternate.headers.get('cf-cache-status')}};
await writeFile('docs/migration/verification/performance-cache-invalidation.json',JSON.stringify(report,null,2)+'\n');console.log(report);
