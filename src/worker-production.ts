import handler,{createScheduledHandler,PluginBridge} from '@emdash-cms/cloudflare/worker';
import {productionGate,productionHost,isPrivateCmsRequest,type ProductionAccessEnv} from './lib/production-access';
import {protectResponse} from './lib/staging-access';
import {parseLegacyRedirects,resolvePublicRedirect} from './lib/legacy-redirects';
import redirects from '../public/_redirects?raw';
export {PluginBridge};
const rules=parseLegacyRedirects(redirects);
export default {...handler,async fetch(request,env,ctx){
  const url=new URL(request.url);
  if(url.hostname===`www.${productionHost}`){const redirect=resolvePublicRedirect(request,rules,productionHost);if(redirect)return redirect;url.hostname=productionHost;url.protocol='https:';return Response.redirect(url.href,301);}
  const denial=await productionGate(request,env);if(denial)return denial;
  const privateResponse=url.hostname!==productionHost||isPrivateCmsRequest(request)||request.headers.has('Authorization');
  const finish=(response:Response)=>{
    const headers=new Headers(response.headers);
    headers.set('X-Content-Type-Options','nosniff');
    headers.set('Referrer-Policy','strict-origin-when-cross-origin');
    headers.set('X-Frame-Options','SAMEORIGIN');
    if(request.headers.has('Cookie')||privateResponse){headers.set('Cache-Control','private, no-store');headers.set('Cloudflare-CDN-Cache-Control','no-store');}
    if(headers.get('Content-Type')?.includes('text/html')){
      const vary=new Set((headers.get('Vary')??'').split(',').map(v=>v.trim()).filter(Boolean));
      for(const name of ['Cookie','Host','Authorization','X-Globos-Preview-Token'])vary.add(name);headers.set('Vary',[...vary].join(', '));
    }
    const secured=new Response(response.body,{status:response.status,statusText:response.statusText,headers});
    return privateResponse?protectResponse(secured):secured;
  };
  const redirect=resolvePublicRedirect(request,rules);if(redirect)return finish(redirect);
  if(url.pathname==='/robots.txt')return finish(new Response(`User-agent: *\nAllow: /\nAllow: /_emdash/api/media/file/\nDisallow: /_emdash/\nDisallow: /api/\nDisallow: /landing/\nSitemap: https://${productionHost}/sitemap-index.xml\n`,{headers:{'Content-Type':'text/plain; charset=utf-8'}}));
  if(!handler.fetch)return finish(new Response('Application unavailable',{status:503}));
  return finish(await handler.fetch(request,env,ctx));
},scheduled:createScheduledHandler()} satisfies ExportedHandler<ProductionAccessEnv & {ASSETS:Fetcher}>;
