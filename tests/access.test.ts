import test from 'node:test';
import assert from 'node:assert/strict';
import {gate,protectResponse} from '../src/lib/staging-access.ts';
import {parseLegacyRedirects,resolveLegacyRedirect,publicCanonicalRedirect} from '../src/lib/legacy-redirects.ts';
import {readFileSync} from 'node:fs';
import {assertDevelopment} from '../scripts/deploy-emdash.mjs';
const url='https://dev.cursodeglobosonline.com';
test('development fails closed before secrets exist or when credentials are invalid',async()=>{
 assert.equal((await gate(new Request(url),{}))?.status,503);
 for(const authorization of ['', 'Basic invalid','Basic '+btoa('wrong:test-password')])assert.equal((await gate(new Request(url,{headers:{authorization}}),{GLOBOS_DEV_PASSWORD:'test-password'}))?.status,401);
});
test('requested username authenticates with the configured secret; it cannot be omitted',async()=>{
 const headers={authorization:'Basic '+btoa('sably:test-password')};assert.equal(await gate(new Request(url,{headers}),{GLOBOS_DEV_PASSWORD:'test-password'}),null);
 assert.equal(await gate(new Request(url,{headers:{'X-Globos-Preview-Token':'test-password'}}),{GLOBOS_DEV_PASSWORD:'test-password'}),null);
});
test('all development responses deny indexing and shared caching, including redirects',()=>{
 const r=protectResponse(Response.redirect(url+'/blog/',301));assert.equal(r.status,301);assert.equal(r.headers.get('cache-control'),'private, no-store');assert.match(r.headers.get('x-robots-tag')! ,/noindex/);assert.match(r.headers.get('vary')!,/Authorization/);
});
test('legacy redirects retain query attribution and never redirect outside this origin',()=>{
 const rules=parseLegacyRedirects(readFileSync('public/_redirects','utf8'));const r=resolveLegacyRedirect(new Request(url+'/curso-globoflexia/?utm_source=example'),rules);assert.equal(r?.headers.get('location'),url+'/co/curso-de-globoflexia/?utm_source=example');assert.throws(()=>parseLegacyRedirects('/x https://example.com 301'));
 assert.equal(publicCanonicalRedirect(new Request(url+'/_emdash/api/setup',{method:'POST'})),null);
});
test('deployment rejects production domains, database substitutions and a missing access gate',()=>{
 const config=JSON.parse(readFileSync('wrangler.jsonc','utf8'));assert.doesNotThrow(()=>assertDevelopment(config));
 for(const mutate of [(c:any)=>c.routes[0].pattern='cursodeglobosonline.com',(c:any)=>c.d1_databases[0].database_id='production',(c:any)=>c.assets.run_worker_first=false]){const copy=structuredClone(config);mutate(copy);assert.throws(()=>assertDevelopment(copy));}
});
