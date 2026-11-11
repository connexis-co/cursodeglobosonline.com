import handler,{createScheduledHandler,PluginBridge} from '@emdash-cms/cloudflare/worker';
import {gate,protectResponse,type StagingAccessEnv} from './lib/staging-access';
import {parseLegacyRedirects,resolvePublicRedirect} from './lib/legacy-redirects';
import redirects from '../public/_redirects?raw';
export {PluginBridge};
const rules=parseLegacyRedirects(redirects);
export default {...handler,async fetch(request,env,ctx){
 // `astro dev` en este equipo: sin Basic para poder revisar el tema en el navegador local.
 // import.meta.env.DEV es false en el Worker compilado: dev.cursodeglobosonline.com sigue protegido.
 const localDev=import.meta.env.DEV&&['localhost','127.0.0.1'].includes(new URL(request.url).hostname);
 const denial=localDev?null:await gate(request,env);if(denial)return denial;
 // En `astro dev` el Worker va primero (`run_worker_first`) y se traga lo que debería servir Vite:
 // `public/`, `/@vite/client` y los módulos de los componentes (sin ellos no corre ningún script
 // de página en local). Se piden antes al binding de estáticos, que en dev es el propio Vite.
 // Un 304 también es respuesta válida: sin él, cada recarga con caché acababa en el 404 de Astro.
 if(localDev&&request.method==='GET'){
  const path=new URL(request.url).pathname;
  if(!path.startsWith('/_emdash')&&(path.startsWith('/@')||/\.[a-z0-9]+$/i.test(path))){
   const asset=await env.ASSETS.fetch(request).catch(()=>null);if(asset&&(asset.ok||asset.status===304))return asset;
  }
 }
 const redirect=resolvePublicRedirect(request,rules);if(redirect)return protectResponse(redirect);
 if(new URL(request.url).pathname==='/robots.txt')return protectResponse(new Response('User-agent: *\nDisallow: /\n',{headers:{'Content-Type':'text/plain'}}));
 if(!handler.fetch)return protectResponse(new Response('Application unavailable',{status:503}));
 return protectResponse(await handler.fetch(request,env,ctx));
},scheduled:createScheduledHandler()} satisfies ExportedHandler<StagingAccessEnv & {GLOBOS_IMPORT_MEDIA?:string;ASSETS:Fetcher}>;
