import {defineMiddleware} from 'astro:middleware';
import {publicCacheEligible,publicCachePolicy,publicMutationRequiresPurge,mediaMutationRequiresPurge,
 publicMediaRequest,PUBLIC_CONTENT_TAGS,MEDIA_TAG,MEDIA_POLICY} from './lib/public-cache';
import {readAll,rowData} from './lib/emdash-content';

// Pages plus the sitemaps, RSS and llms.txt that crawlers request repeatedly; all derive from published content.
const SHAREABLE_TYPE=/^(?:text\/html|application\/(?:rss\+)?xml|text\/xml|text\/plain)\b/;

// All editorial content is Spanish. /es/ is the Spain market route, not an
// optional language prefix. The [cc] pages validate markets against the CMS;
// Astro's automatic locale redirects would incorrectly reject Spain's URLs.
export const onRequest=defineMiddleware(async (context,next)=>{
 const response=await next();
 if(!context.cache.enabled)return response;
 // Comment moderation and plugin KV writes do not purge native content collection tags.
 if(publicMutationRequiresPurge(context.request,response))await context.cache.invalidate({tags:['globos-public']});
 if(mediaMutationRequiresPurge(context.request,response))await context.cache.invalidate({tags:[MEDIA_TAG]});
 if(publicMediaRequest(context.request)&&response.status===200&&!response.headers.has('Set-Cookie')){
  context.cache.set({...MEDIA_POLICY,tags:[MEDIA_TAG]});return response;
 }
 if(publicCacheEligible(context.request)&&(response.status===200||response.status===404)
   &&SHAREABLE_TYPE.test(response.headers.get('Content-Type')??'')
   &&!response.headers.has('Set-Cookie')&&!context.locals.user){
  const policy=publicCachePolicy((await readAll('promotions')).map(rowData),response.status);
  if(policy.maxAge>0){
   context.cache.set({...policy,tags:PUBLIC_CONTENT_TAGS});response.headers.set('Cache-Control','no-cache');
   // Astro's route cache does not decorate the error page it renders for unmatched URLs.
   if(response.status===404){
    response.headers.set('Cloudflare-CDN-Cache-Control',`public, max-age=${policy.maxAge}, stale-while-revalidate=${policy.swr}`);
    response.headers.set('Cache-Tag',PUBLIC_CONTENT_TAGS.join(','));
   }
  }
  else context.cache.set(false);
 }else context.cache.set(false);
 return response;
});
