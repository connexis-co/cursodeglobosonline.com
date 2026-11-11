import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {publicCacheEligible,publicCacheTtl,publicCachePolicy,publicMutationRequiresPurge,mediaMutationRequiresPurge,publicMediaRequest,hasPrivateCookies} from '../src/lib/public-cache';
import {trackingScript} from '../src/lib/tracking-script';

test('HTML cache cannot share authenticated, preview, campaign or non-production visits',()=>{
 const base='https://cursodeglobosonline.com';
 assert.equal(publicCacheEligible(new Request(base+'/blog/')),true);
 for(const path of ['/_emdash/admin','/_emdash/api/media/file/image.jpg','/api/blog-ratings','/landing/curso','/?promo=x','/?utm_source=google','/?preview=true'])
  assert.equal(publicCacheEligible(new Request(base+path)),false,path);
 for(const header of ['Cookie','Authorization','X-Globos-Preview-Token'])
  assert.equal(publicCacheEligible(new Request(base,{headers:{[header]:'test'}})),false,header);
 for(const cookie of ['emdash-edit-mode=true','astro-session=abc','_ga=GA1.1.1.1; emdash_session=x','unknown=1'])
  assert.equal(publicCacheEligible(new Request(base,{headers:{Cookie:cookie}})),false,cookie);
 for(const host of ['dev.cursodeglobosonline.com','globos-emdash-production.workers.dev','www.cursodeglobosonline.com'])
  assert.equal(publicCacheEligible(new Request('https://'+host)),false,host);
 assert.equal(publicCacheEligible(new Request(base,{method:'POST'})),false);
});

test('measurement and edge cookies keep visitors on the shared HTML cache',()=>{
 const base='https://cursodeglobosonline.com/blog/';
 for(const cookie of ['_ga=GA1.1.123.456','_ga_PHN6J5MTX6=GS1.1.1; _gcl_au=1.1.2','_fbp=fb.1.1; _fbc=fb.1.2','__cf_bm=x; _cfuvid=y','_clck=a; _clsk=b'])
  {assert.equal(hasPrivateCookies(new Request(base,{headers:{Cookie:cookie}})),false,cookie);
   assert.equal(publicCacheEligible(new Request(base,{headers:{Cookie:cookie}})),true,cookie);}
 assert.equal(hasPrivateCookies(new Request(base)),false);
 assert.equal(hasPrivateCookies(new Request(base,{headers:{Cookie:'_ga=1; emdash-edit-mode=true'}})),true);
});

test('HTML freshness and stale serving end before any verified promotion transition',()=>{
 const now=Date.parse('2026-10-04T12:00:00Z');
 const offer={offerVerified:true,startsAt:new Date(now+22500).toISOString(),endsAt:new Date(now+90000).toISOString()};
 assert.deepEqual(publicCachePolicy([offer],200,now),{maxAge:22,swr:0});
 assert.equal(publicCacheTtl([offer],now),22);
 assert.deepEqual(publicCachePolicy([{...offer,startsAt:new Date(now-1000).toISOString(),endsAt:new Date(now+900).toISOString()}],200,now),{maxAge:0,swr:0});
 const later={...offer,startsAt:new Date(now+7200_000).toISOString(),endsAt:new Date(now+9000_000).toISOString()};
 assert.deepEqual(publicCachePolicy([later],200,now),{maxAge:3600,swr:3600});
 assert.deepEqual(publicCachePolicy([{...offer,offerVerified:false}],200,now),{maxAge:3600,swr:86400});
 assert.deepEqual(publicCachePolicy([],200,now),{maxAge:3600,swr:86400});
 assert.deepEqual(publicCachePolicy([],404,now),{maxAge:600,swr:3600});
});

test('media originals are edge-cached and purged when replaced or deleted',()=>{
 const origin='https://cursodeglobosonline.com';
 assert.equal(publicMediaRequest(new Request(origin+'/_emdash/api/media/file/3JHMNHBKJNK6Y9DHJ97JH4D8TD.jpg')),true);
 for(const path of ['/_emdash/api/media/file/a.jpg?x=1','/_emdash/api/media/abc','/_emdash/api/media/file/a/b.jpg'])
  assert.equal(publicMediaRequest(new Request(origin+path)),false,path);
 assert.equal(publicMediaRequest(new Request('https://dev.cursodeglobosonline.com/_emdash/api/media/file/a.jpg')),false);
 assert.equal(publicMediaRequest(new Request(origin+'/_emdash/api/media/file/a.jpg',{method:'POST'})),false);
 for(const [path,method] of [['/_emdash/api/media/01ABC/replace','PUT'],['/_emdash/api/media/01ABC','DELETE'],['/_emdash/api/media/01ABC','PUT']])
  {assert.equal(mediaMutationRequiresPurge(new Request(origin+path,{method}),new Response(null,{status:200})),true,path);
   assert.equal(mediaMutationRequiresPurge(new Request(origin+path,{method}),new Response(null,{status:409})),false,path);}
 assert.equal(mediaMutationRequiresPurge(new Request(origin+'/_emdash/api/media/01ABC/usage',{method:'PUT'}),new Response()),false);
 assert.equal(mediaMutationRequiresPurge(new Request(origin+'/_emdash/api/media/01ABC'),new Response()),false);
});

test('vendor loading is deferred, events survive in queues, and interaction loads each script once',()=>{
 const listeners=new Map<string,Function[]>(),scripts:{src:string}[]=[],timers:Function[]=[];
 const sandbox:any={Date,document:{readyState:'loading',head:{appendChild:(s:any)=>scripts.push(s)},createElement:()=>({})},
  addEventListener:(name:string,fn:Function)=>listeners.set(name,[...(listeners.get(name)??[]),fn]),removeEventListener:()=>{},
  setTimeout:(fn:Function)=>timers.push(fn),requestAnimationFrame:(fn:Function)=>fn(),requestIdleCallback:(fn:Function)=>fn()};
 sandbox.window=sandbox;const context=vm.createContext(sandbox);
 const script=trackingScript({gtm:'GTM-KKP7WL8Q',ga4:'G-TEST123',meta:'123456'});
 vm.runInContext(script,context);
 assert.equal(scripts.length,0);
 sandbox.dataLayer.push({event:'generate_lead'});sandbox.fbq('track','Lead');
 for(const callback of listeners.get('pointerdown')??[])callback();
 assert.equal(scripts.length,3);assert.equal(new Set(scripts.map(s=>s.src)).size,3);
 assert.equal(sandbox.dataLayer.filter((e:any)=>e.event==='generate_lead').length,1);
 assert.equal(sandbox.fbq.queue.length,3);
 for(const fn of timers)fn();for(const fn of listeners.get('load')??[])fn();
 vm.runInContext(script,context);assert.equal(scripts.length,3);
});

test('without interaction vendors still load after painting, including browsers without idle callback',()=>{
 for(const idle of [true,false]){
  const scripts:any[]=[],timers:Function[]=[];const sandbox:any={Date,document:{readyState:'complete',head:{appendChild:(s:any)=>scripts.push(s)},createElement:()=>({})},
   addEventListener:()=>{},removeEventListener:()=>{},setTimeout:(fn:Function)=>timers.push(fn),requestAnimationFrame:(fn:Function)=>fn()};
  if(idle)sandbox.requestIdleCallback=(fn:Function)=>fn();sandbox.window=sandbox;
  vm.runInContext(trackingScript({gtm:'GTM-KKP7WL8Q',ga4:'',meta:''}),vm.createContext(sandbox));
  for(const fn of timers)fn();assert.equal(scripts.length,1);
 }
});

test("comment moderation and plugin changes purge public HTML only after successful writes",()=>{
 const origin="https://cursodeglobosonline.com";
 for(const [path,method] of [["/_emdash/api/plugins/globos-whatsapp/save","POST"],["/_emdash/api/admin/comments/123/status","PUT"],["/_emdash/api/admin/comments/123","DELETE"],["/_emdash/api/admin/comments/bulk","POST"]]){
  assert.equal(publicMutationRequiresPurge(new Request(origin+path,{method}),new Response(null,{status:200})),true);
  assert.equal(publicMutationRequiresPurge(new Request(origin+path,{method}),new Response(null,{status:403})),false);
  assert.equal(publicMutationRequiresPurge(new Request(origin+path),new Response()),false);
 }
 assert.equal(publicMutationRequiresPurge(new Request(origin+"/_emdash/api/admin/comments/counts",{method:"GET"}),new Response()),false);
 assert.equal(publicMutationRequiresPurge(new Request(origin+"/_emdash/api/comments/blog/123",{method:"POST"}),new Response()),false);
});
