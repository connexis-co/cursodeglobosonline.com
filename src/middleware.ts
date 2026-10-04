import {defineMiddleware} from 'astro:middleware';
import {publicCacheEligible,publicCacheTtl,publicMutationRequiresPurge,PUBLIC_CONTENT_TAGS} from './lib/public-cache';
import {readAll,rowData} from './lib/emdash-content';

// All editorial content is Spanish. /es/ is the Spain market route, not an
// optional language prefix. The [cc] pages validate markets against the CMS;
// Astro's automatic locale redirects would incorrectly reject Spain's URLs.
export const onRequest=defineMiddleware(async (context,next)=>{
 const response=await next();
 if(!context.cache.enabled)return response;
 // Comment moderation and plugin KV writes do not purge native content collection tags.
 if(publicMutationRequiresPurge(context.request,response))await context.cache.invalidate({tags:['globos-public']});
 if(publicCacheEligible(context.request)&&response.status===200
   &&response.headers.get('Content-Type')?.includes('text/html')
   &&!response.headers.has('Set-Cookie')&&!context.locals.user){
  const ttl=publicCacheTtl((await readAll('promotions')).map(rowData));
  if(ttl>0){context.cache.set({maxAge:ttl,tags:PUBLIC_CONTENT_TAGS});response.headers.set('Cache-Control','no-cache');}
  else context.cache.set(false);
 }else context.cache.set(false);
 return response;
});
