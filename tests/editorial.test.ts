import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {editorialError} from '../src/plugins/globos-integrity/model.ts';
import {RELATIONS,RETIRED_FIELDS} from '../src/lib/cms/relations.ts';
const seed=JSON.parse(readFileSync('emdash.seed.json','utf8'));
test('reference targets exist and source fields no longer accept arbitrary slugs',()=>{
 for(const [collection,fields] of Object.entries(RELATIONS))for(const [slug,relation] of Object.entries(fields)){
  const c=seed.collections.find((c:{slug:string})=>c.slug===collection);const f=c.fields.find((f:{slug:string})=>f.slug===slug);
  assert.equal(f.type,'reference');assert.equal(f.validation.targetCollection,relation.target);assert.ok(seed.collections.some((c:{slug:string})=>c.slug===relation.target));
 }
 for(const [col,slugs] of Object.entries(RETIRED_FIELDS))for(const slug of slugs)assert.ok(!seed.collections.find((c:{slug:string})=>c.slug===col).fields.some((f:{slug:string})=>f.slug===slug));
 for(const entries of Object.values(seed.content) as {data:Record<string,unknown>}[][])for(const e of entries)for(const value of Object.values(e.data))for(const v of Array.isArray(value)?value:[value])if(typeof v==='string'&&v.startsWith('$ref:')){const[target,...slug]=v.slice(5).split(':');assert.ok(seed.content[target!].some((x:{slug:string})=>x.slug===slug.join(':')),v);}
});
test('page paths match actual Astro routes and unsafe CTA URLs are refused',()=>{
 assert.equal(editorialError('pages','example',{path:'/paginas/example/',cta_url:'/co/cursos/'}),undefined);
 assert.match(editorialError('pages','example',{path:'/does-not-exist/'})!,/ruta/);
 assert.match(editorialError('pages','example',{path:'/paginas/example/',cta_url:'javascript:alert(1)'})!,/seguro/);
});
test('commercial publication requires coherent prices and verified promotions',()=>{
 assert.equal(editorialError('courses','x',{price_usd:25,original_price_usd:49.99,discount_pct:50,hotmart_url:'https://go.hotmart.com/X'}),undefined);
 assert.ok(editorialError('courses','x',{price_usd:50,original_price_usd:30}));
 const p={starts_at:'2026-11-20T05:00:00Z',ends_at:'2026-11-28T05:00:00Z',offer_verified:true,verification_notes:'Oferta comprobada'};
 assert.equal(editorialError('promotions','x',p),undefined);
 assert.ok(editorialError('promotions','x',{...p,offer_verified:false}));assert.ok(editorialError('promotions','x',{...p,ends_at:p.starts_at}));assert.ok(editorialError('promotions','x',{...p,verification_notes:''}));
});
