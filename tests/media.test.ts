import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,existsSync} from 'node:fs';
const refs=JSON.parse(readFileSync('docs/migration/media-sources.json','utf8'));
test('all legacy blog covers have a recoverable media source and alt text',()=>{
 const entries=JSON.parse(readFileSync('emdash.seed.json','utf8')).content.blog;
 for(const entry of entries){const ref=refs.find((r:any)=>r.collection==='blog'&&r.slug===entry.slug&&r.field==='hero');assert.ok(ref,entry.slug);assert.ok(ref.alt);assert.ok(ref.source&&existsSync(ref.source),entry.slug);}
});
test('bootstrap does not depend on unauthenticated media fetches from the private development site',()=>{
 assert.ok(!readFileSync('emdash.seed.json','utf8').includes('"$media"'));
 assert.ok(!readFileSync('src/worker.ts','utf8').includes('GLOBOS_IMPORT_MEDIA==='));
});
