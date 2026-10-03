import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parseLegacyRedirects,resolvePublicRedirect} from '../src/lib/legacy-redirects';
const rules=parseLegacyRedirects(readFileSync('public/_redirects','utf8'));
const host='https://cursodeglobosonline.com';
test('legacy PageSpeed variants collapse while campaign and checkout attribution survive',()=>{
 const request=new Request(host+'/cali/curso-de-globoflexia/?PageSpeed=noscript?PageSpeed%3Dnoscript&utm_source=google&gclid=abc&promo=octubre');
 const result=resolvePublicRedirect(request,rules);assert.equal(result?.status,301);
 const destination=new URL(result!.headers.get('location')!);
 assert.equal(destination.pathname,'/co/cali/curso-de-globoflexia/');
 assert.equal(destination.searchParams.has('PageSpeed'),false);
 assert.equal(destination.searchParams.get('utm_source'),'google');
 assert.equal(destination.searchParams.get('gclid'),'abc');
 assert.equal(destination.searchParams.get('promo'),'octubre');
 assert.equal(resolvePublicRedirect(new Request(destination),rules),null);
});
test('www legacy categories and missing slashes resolve directly to their final equivalent',()=>{
 const r=resolvePublicRedirect(new Request('https://www.cursodeglobosonline.com/pe/cursos/eventos/'),rules,'cursodeglobosonline.com');
 assert.equal(r?.headers.get('location'),host+'/blog/#ideas-por-ocasion');
 const course=resolvePublicRedirect(new Request(host+'/curso-globoflexia'),rules);
 assert.equal(course?.headers.get('location'),host+'/co/curso-de-globoflexia/');
});
test('retired WordPress paths and literal wildcard URLs are not redirected to unrelated content',()=>{
 for(const path of ['/wp-content/plugins/*','/wp-content/themes/Impreza/*','/wp-content/uploads/missing.jpg','/wp-json/','/xmlrpc.php','/comments/feed/','/locations.kml','/*','/%2A','/wp-admin/*']) {
  assert.equal(resolvePublicRedirect(new Request(host+path),rules),null,path);
 }
 assert.equal(resolvePublicRedirect(new Request(host+'/feed/'),rules)?.headers.get('location'),host+'/blog/rss.xml');
});
test('only the broken search placeholder is removed; APIs, real queries and POST bodies are unaffected',()=>{
 assert.equal(resolvePublicRedirect(new Request(host+'/?s=%7Bsearch_term_string%7D&utm_campaign=curso'),rules)?.headers.get('location'),host+'/?utm_campaign=curso');
 for(const path of ['/?s=globos','/_emdash/api/content/blog?PageSpeed=noscript','/api/blog-ratings?PageSpeed=noscript'])assert.equal(resolvePublicRedirect(new Request(host+path),rules),null);
 assert.equal(resolvePublicRedirect(new Request(host+'/feed/?PageSpeed=noscript',{method:'POST',body:'important'}),rules),null);
});
test('redirect cycles fail closed and temporary redirect semantics are retained',()=>{
 assert.equal(resolvePublicRedirect(new Request(host+'/one/'),parseLegacyRedirects('/one/ /two/ 301\n/two/ /one/ 301')),null);
 assert.equal(resolvePublicRedirect(new Request(host+'/offer/'),parseLegacyRedirects('/offer/ /co/ 302'))?.status,302);
});
