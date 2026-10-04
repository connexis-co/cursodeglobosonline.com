import {test} from 'node:test';
import assert from 'node:assert/strict';
import {isPrivateCmsRequest,isProductionAdmin,productionGate} from '../src/lib/production-access.ts';
const origin='https://cursodeglobosonline.com';
const env={GLOBOS_ENVIRONMENT:'production',GLOBOS_ADMIN_PASSWORD:'test-fixture-only'};
test('public website, blog comments and media remain accessible; editing APIs require authentication',async()=>{
  for(const path of ['/nosotros/','/blog/','/_emdash/api/comments/blog/01M3ZTPGJAFXPYB5JVZVT28FCV','/_emdash/api/media/file/example.webp']){
    assert.equal(await productionGate(new Request(origin+path),env),null,path);
  }
  for(const path of ['/_emdash/','/_emdash/api/content/blog','/%5Femdash/api/content/blog','/_emdash%2Fapi%2Fcontent%2Fblog','//_emdash/api/content/blog','/_emdash/api/comments','/_emdash/api/setup','/_emdash/api/plugins/globos-whatsapp/save']){
    const response=await productionGate(new Request(origin+path),env);assert.equal(response?.status,401,path);assert.match(response!.headers.get('Cache-Control')!,/no-store/);
  }
  assert.equal(isPrivateCmsRequest(new Request(origin+'/_emdash/api/media/file/example.webp',{method:'DELETE'})),true);
  assert.equal(isPrivateCmsRequest(new Request(origin+'/_emdash/api/comments/blog/post',{method:'PUT'})),true);
});
test('production previews stay private and development credentials cannot authorize production',async()=>{
  assert.equal((await productionGate(new Request('https://globos-emdash-production.example.workers.dev/'),env))?.status,401);
  const headers={authorization:'Basic '+Buffer.from('sably:test-fixture-only').toString('base64')};
  const request=new Request(origin+'/_emdash/',{headers});
  assert.equal(await isProductionAdmin(request,env),true);
  assert.equal(await isProductionAdmin(request,{...env,GLOBOS_ENVIRONMENT:'development'}),false);
  assert.equal(await isProductionAdmin(request,{...env,GLOBOS_ADMIN_PASSWORD:undefined}),false);
  assert.equal(await isProductionAdmin(new Request(origin+'/_emdash/',{headers:{'X-Globos-Preview-Token':'test-fixture-only'}}),env),false);
});
