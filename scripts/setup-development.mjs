import {readFile} from 'node:fs/promises';
import {assertDevelopment} from './deploy-emdash.mjs';
const config=JSON.parse(await readFile('wrangler.jsonc','utf8'));assertDevelopment(config);
const password=(await readFile('.dev.vars','utf8')).split('\n').find(l=>l.startsWith('GLOBOS_DEV_PASSWORD=')).slice('GLOBOS_DEV_PASSWORD='.length).replace(/^"|"$/g,'');
const origin='https://dev.cursodeglobosonline.com';
const headers={authorization:'Basic '+Buffer.from('sably:'+password).toString('base64'),'X-EmDash-Request':'1','content-type':'application/json',origin};
for(let i=0;i<100;i++){
 const response=await fetch(origin+'/_emdash/api/setup',{method:'POST',headers,body:JSON.stringify({title:'Curso de Globos Online',tagline:'Aprende decoración con globos. Convierte cada fiesta en tu negocio.',includeContent:true}),signal:AbortSignal.timeout(120000)});
 let data;try{data=await response.json()}catch{throw Error('Setup returned non-JSON: '+response.status)}
 console.log('Setup request',i+1,response.status,JSON.stringify(data));
 if(!response.ok){if(response.status===409)break;process.exitCode=1;break;}
 if(data.data?.complete||data.data?.setupComplete||data.complete)break;
}
