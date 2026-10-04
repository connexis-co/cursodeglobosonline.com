import {readFile} from 'node:fs/promises';
export const origin='https://dev.cursodeglobosonline.com';
const line=(await readFile('.dev.vars','utf8')).split('\n').find(l=>l.startsWith('GLOBOS_DEV_PASSWORD='));
if(!line)throw Error('Development secret required');
const password=line.slice(line.indexOf('=')+1).replace(/^"|"$/g,'');
export const headers={authorization:'Basic '+Buffer.from('sably:'+password).toString('base64'),'X-EmDash-Request':'1',origin};
export async function api(path,options={}){const r=await fetch(origin+path,{...options,headers:{...headers,...options.headers},signal:AbortSignal.timeout(60000)});const data=await r.json();if(!r.ok)throw Error(`${options.method||'GET'} ${path}: ${r.status} ${JSON.stringify(data)}`);return data.data;}
export const json=(method,body)=>({method,headers:{'content-type':'application/json'},body:JSON.stringify(body)});
