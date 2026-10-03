import {basicCredentials, matchesSecret, protectResponse} from './staging-access';

export interface ProductionAccessEnv {
  GLOBOS_ENVIRONMENT?: string;
  GLOBOS_ADMIN_PASSWORD?: string;
}
export const productionHost = 'cursodeglobosonline.com';

export async function isProductionAdmin(request: Request, env: ProductionAccessEnv): Promise<boolean> {
  if (env.GLOBOS_ENVIRONMENT !== 'production' || !env.GLOBOS_ADMIN_PASSWORD) return false;
  const credentials = basicCredentials(request);
  return credentials !== null && matchesSecret(credentials, `sably:${env.GLOBOS_ADMIN_PASSWORD}`);
}

/** Only explicitly public CMS routes bypass the administrator's authentication. */
export function isPrivateCmsRequest(request: Request): boolean {
  let path: string;
  try {path=decodeURIComponent(new URL(request.url).pathname).replace(/\/{2,}/g,'/');}
  catch {return true;}
  if (!/^\/_emdash(?:\/|$)/.test(path)) return false;
  if (['GET','HEAD'].includes(request.method) && /^\/_emdash\/api\/media\/file\/.+/.test(path)) return false;
  if (['GET','HEAD','POST'].includes(request.method) && /^\/_emdash\/api\/comments\/blog\/[A-Za-z0-9_-]+\/?$/.test(path)) return false;
  return true;
}

export async function productionGate(request: Request, env: ProductionAccessEnv): Promise<Response | null> {
  const url = new URL(request.url);
  if (url.hostname === productionHost && !isPrivateCmsRequest(request)) return null;
  if (await isProductionAdmin(request, env)) return null;
  return protectResponse(new Response('Authentication required.', {status:401, headers:{
    'WWW-Authenticate':'Basic realm="Curso de Globos · Administración", charset="UTF-8"',
  }}));
}
