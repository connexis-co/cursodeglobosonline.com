/** Cliente mínimo de la API de administración de EmDash para scripts editoriales explícitos.
 * `local` usa `astro dev` en este equipo con el secreto de desarrollo; nunca imprime secretos. */
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
export function environmentFromArgs(){
 const environment=process.argv.find(x=>x.startsWith('--environment='))?.split('=')[1];
 assert.ok(['local','development','production'].includes(environment),'Indica --environment=local|development|production');
 return environment;
}
export async function adminApi(environment){
 const origin=environment==='production'?'https://cursodeglobosonline.com':environment==='development'?'https://dev.cursodeglobosonline.com':`http://localhost:${process.env.PORT||4338}`;
 const secretFile=environment==='production'?'.dev.vars.production':'.dev.vars';
 const key=environment==='production'?'GLOBOS_ADMIN_PASSWORD':'GLOBOS_DEV_PASSWORD';
 const line=(await readFile(secretFile,'utf8')).split('\n').find(x=>x.startsWith(key+'='));
 assert.ok(line,'Falta el secreto local de administración');
 const raw=line.slice(line.indexOf('=')+1);const password=raw.startsWith('"')?JSON.parse(raw):raw;
 const headers={authorization:'Basic '+Buffer.from('sably:'+password).toString('base64'),origin,'X-EmDash-Request':'1'};
 if(environment==='local'){
  // `astro dev` no pasa por el proveedor externo: EmDash ofrece su sesión de desarrollo.
  const r=await fetch(origin+'/_emdash/api/setup/dev-bypass?redirect=/_emdash/admin',{headers,redirect:'manual'});
  const cookie=(r.headers.getSetCookie?.()??[]).map(c=>c.split(';')[0]).join('; ');if(cookie)headers.cookie=cookie;
 }
 async function api(path,options={}){
  const r=await fetch(origin+path,{...options,headers:{...headers,...options.headers},signal:AbortSignal.timeout(90000)});
  const text=await r.text();let body;try{body=JSON.parse(text)}catch{throw Error(`${options.method??'GET'} ${path} HTTP ${r.status}: respuesta no JSON`)}
  if(!r.ok)throw Error(`${options.method??'GET'} ${path} HTTP ${r.status}: ${JSON.stringify(body).slice(0,600)}`);return body.data;
 }
 const json=(method,body)=>({method,headers:{'content-type':'application/json'},body:JSON.stringify(body)});
 return {origin,headers,api,json};
}
