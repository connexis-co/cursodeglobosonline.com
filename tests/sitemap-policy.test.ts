import test from 'node:test';
import assert from 'node:assert/strict';
import {isSitemapEligible} from '../src/lib/sitemap-policy.ts';
const site='https://cursodeglobosonline.com',path='/blog/guia/';
test('sitemaps respect editorial exclusions and canonical destinations',()=>{
 assert.equal(isSitemapEligible(undefined,path,site),true);
 assert.equal(isSitemapEligible({noIndex:true},path,site),false);
 assert.equal(isSitemapEligible({noIndex:false,canonical:path},path,site),true);
 assert.equal(isSitemapEligible({canonical:site+path},path,site),true);
 assert.equal(isSitemapEligible({canonical:'/blog/otra/'},path,site),false);
 assert.equal(isSitemapEligible({canonical:'https://other.example/blog/guia/'},path,site),false);
 assert.equal(isSitemapEligible({canonical:'https://['},path,site),false);
});
