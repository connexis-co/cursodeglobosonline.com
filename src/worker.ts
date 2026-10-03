import handler,{createScheduledHandler,PluginBridge} from '@emdash-cms/cloudflare/worker';
import {gate,protectResponse,type StagingAccessEnv} from './lib/staging-access';
import {parseLegacyRedirects,resolveLegacyRedirect,publicCanonicalRedirect} from './lib/legacy-redirects';
import redirects from '../public/_redirects?raw';
export {PluginBridge};
const rules=parseLegacyRedirects(redirects);
export default {...handler,async fetch(request,env,ctx){
 const denial=await gate(request,env);if(denial)return denial;
 const redirect=resolveLegacyRedirect(request,rules)||publicCanonicalRedirect(request);if(redirect)return protectResponse(redirect);
 if(new URL(request.url).pathname==='/robots.txt')return protectResponse(new Response('User-agent: *\nDisallow: /\n',{headers:{'Content-Type':'text/plain'}}));
 if(!handler.fetch)return protectResponse(new Response('Application unavailable',{status:503}));
 return protectResponse(await handler.fetch(request,env,ctx));
},scheduled:createScheduledHandler()} satisfies ExportedHandler<StagingAccessEnv & {GLOBOS_IMPORT_MEDIA?:string;ASSETS:Fetcher}>;
