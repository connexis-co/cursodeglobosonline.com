/**
 * Black Friday 2026: la campaña pasa a ser la dueña del descuento (petición de JP, 11-11-2026).
 *
 * Hasta hoy el 50 % estaba escrito en la ficha de cada curso, sin fecha de fin. Para que la
 * cuenta atrás sea verdad, el descuento se muda a la campaña `bf-2026`:
 *
 *   1. La colección de promociones gana el campo «Nombre visible» (`label`).
 *   2. Se comprueba en el checkout de Hotmart, en ese momento, que cada curso cobra el precio de
 *      lista sin cupón y la mitad con `offDiscount=031016`. Si algo no cuadra, no se publica nada.
 *   3. Se publica la campaña: del 11 de noviembre al 1 de diciembre a las 00:00 (hora de
 *      Colombia), es decir, hasta el final del Cyber Monday. Se enlazan los cinco cursos
 *      comprobados: el borrador que vino del calendario de Sably solo traía cuatro, porque el de
 *      Decoración aún no existía, y un curso sin enlazar se quedaría a precio de lista.
 *   4. Las cinco fichas vuelven a su precio de lista y a su enlace sin cupón. Mientras la campaña
 *      está activa el sitio sigue cobrando lo mismo que antes; al terminar, vuelve el de lista.
 *
 * El orden importa: primero la campaña y después las fichas, para que nunca se vea el precio de
 * lista en medio. Y el código nuevo tiene que estar desplegado antes de ejecutar esto.
 *
 * Para volver al 50 % permanente: despublicar la campaña en el panel y ejecutar
 * `release-2026-11-11-descuento.ts --publish`.
 *
 * Uso: node --import tsx scripts/cms/release-2026-11-11-black-friday.ts --environment=local|development|production [--publish]
 * Sin --publish solo informa de lo que cambiaría.
 */
import {writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {adminApi,environmentFromArgs} from './_admin-api.mjs';
import {checkoutPrice,compareOffer,discountedPrice} from '../../src/plugins/globos-promotions/model.ts';

const environment=environmentFromArgs();
const publish=process.argv.includes('--publish');
const {origin,api,json}=await adminApi(environment);
const backupDir=`.data/release-2026-11-11/${environment}`;await mkdir(backupDir,{recursive:true});
const backup=(name:string,value:unknown)=>writeFile(`${backupDir}/${name}.json`,JSON.stringify(value,null,2),{mode:0o600,flag:'wx'}).catch(error=>{if(error.code!=='EEXIST')throw error;});

const COUPON='031016',PCT=50;
// Precio de lista de cada curso, verificado en el checkout sin cupón.
const LIST:Record<string,number>={
 'curso-de-decoracion-con-globos':59.99,
 'curso-de-globoflexia':49.99,
 'curso-de-bouquets-de-globos':49.99,
 'curso-de-flores-con-globos':79.99,
 'curso-de-globos-burbuja':49.99,
};
const CAMPAIGN={
 title:'Black Friday',
 label:'Black Friday',
 headline:'50 % de descuento en todos los cursos',
 button_label:'Ver los cursos',
 starts_at:'2026-11-11T05:00:00.000Z',
 ends_at:'2026-12-01T05:00:00.000Z',
 priority:100,
 url_key:'',
 coupon:COUPON,
 discount_pct:PCT,
 theme:'dark',
 offer_verified:true,
};
const log:string[]=[];

// 1 · Esquema ------------------------------------------------------------------------------
const fields=(await api('/_emdash/api/schema/collections/promotions/fields')).items as {slug:string}[];
if(fields.some(f=>f.slug==='label'))log.push('= el campo «Nombre visible» ya existe');
else{
 log.push('+ campo «Nombre visible» (label) en Promociones');
 if(publish)await api('/_emdash/api/schema/collections/promotions/fields',json('POST',{slug:'label',label:'Nombre visible (ej. Black Friday)',type:'string',validation:null,options:{}}));
}

// 2 · Checkout de Hotmart ------------------------------------------------------------------
const BROWSER={'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36','Accept-Language':'es'};
async function charged(base:string,coupon?:string):Promise<number|undefined>{
 const url=new URL(base);url.searchParams.delete('offDiscount');if(coupon)url.searchParams.set('offDiscount',coupon);
 const response=await fetch(url,{headers:BROWSER,redirect:'follow',signal:AbortSignal.timeout(40000)});
 assert.equal(new URL(response.url).hostname,'pay.hotmart.com',`${url.href} no termina en el checkout de Hotmart`);
 assert.ok(new URL(response.url).searchParams.get('ref'),`${url.href} llega al checkout sin el ref de afiliado`);
 return checkoutPrice(await response.text());
}
const courses:Record<string,any>={};
const verified:string[]=[];
for(const [slug,list] of Object.entries(LIST)){
 const current=await api(`/_emdash/api/content/courses/${slug}?locale=es`);courses[slug]=current;
 const base=String(current.item.data.hotmart_url);
 const [sinCupon,conCupon]=await Promise.all([charged(base),charged(base,COUPON)]);
 assert.equal(sinCupon,list,`${slug}: sin cupón Hotmart cobra ${sinCupon}, no ${list}`);
 const check=compareOffer(slug,list,PCT,conCupon);
 assert.ok(check.ok,`${slug}: con el cupón Hotmart cobra ${conCupon}, no ${check.expected}. ${check.note}`);
 verified.push(`${slug.replace('curso-de-','')} US$${conCupon} (lista ${list})`);
}
log.push(`✓ checkout de Hotmart: ${verified.join(' · ')}`);
const checkedAt=new Date();
const day=new Intl.DateTimeFormat('es',{dateStyle:'long',timeZone:'America/Bogota'}).format(checkedAt);
const notes=`Comprobado en el checkout de Hotmart el ${day}: sin cupón los cinco cursos cobran su precio de lista y con offDiscount=${COUPON} cobran la mitad (${verified.join('; ')}). El enlace conserva el ref de afiliado. Antes de cambiar el cupón, el porcentaje o las fechas, vuelve a comprobarlo con «Comprobar en Hotmart» en el calendario de promociones.`;

// 3 · Campaña ------------------------------------------------------------------------------
const data={...CAMPAIGN,verification_notes:notes};
// Los cursos de la campaña son exactamente los comprobados arriba; países, todos.
const courseIds=Object.keys(LIST).map(slug=>String(courses[slug].item.id));
const references={course_links:courseIds,excluded_course_links:[],country_links:[]};
const linked=(item:any,field:string):string[]=>((item.references?.[field]?.children??[]) as {id:string}[]).map(child=>child.id).sort();
const sameLinks=(item:any)=>Object.entries(references).every(([field,ids])=>JSON.stringify(linked(item,field))===JSON.stringify([...ids].sort()));
const same=(a:unknown,b:unknown)=>JSON.stringify(a)===JSON.stringify(b)||(typeof a==='boolean'&&Number(a)===b)||(typeof b==='boolean'&&Number(b)===a);
let campaign=await api('/_emdash/api/content/promotions/bf-2026?locale=es').catch(()=>null);
if(!campaign){
 log.push('+ campaña bf-2026 (no existía en este entorno)');
 if(publish){
  await api('/_emdash/api/content/promotions',json('POST',{slug:'bf-2026',locale:'es',status:'draft',data:{...data,calendar_source:'Black Friday 2026'},references}));
  campaign=await api('/_emdash/api/content/promotions/bf-2026?locale=es');
 }
}else{
 await backup('promotions-bf-2026-antes',campaign);
 // Las notas llevan la fecha de la comprobación: no cuentan como cambio si lo demás ya está.
 const diff=Object.entries(CAMPAIGN).filter(([key,value])=>!same(campaign.item.data[key],value)).map(([key])=>key);
 if(!sameLinks(campaign.item))diff.push('cursos enlazados');
 if(!diff.length&&campaign.item.status==='published')log.push('= la campaña bf-2026 ya está publicada con estos datos');
 else{
  log.push(`~ campaña bf-2026: ${diff.join(', ')||'publicar'}`);
  if(publish){
   if(diff.length)await api(`/_emdash/api/content/promotions/${campaign.item.id}?locale=es`,json('PUT',{_rev:campaign._rev,data:{...campaign.item.data,...data},references}));
   campaign=await api('/_emdash/api/content/promotions/bf-2026?locale=es');
  }
 }
}
// `draftRevisionId` es null cuando no hay cambios pendientes.
if(publish&&campaign&&(campaign.item.status!=='published'||(campaign.item.draftRevisionId&&campaign.item.draftRevisionId!==campaign.item.liveRevisionId))){
 await api(`/_emdash/api/content/promotions/${campaign.item.id}/publish?locale=es`,json('POST',{_rev:campaign._rev}));
}

// 4 · Fichas a precio de lista -------------------------------------------------------------
for(const [slug,list] of Object.entries(LIST)){
 const current=courses[slug],d=current.item.data;
 const url=new URL(d.hotmart_url);url.searchParams.delete('offDiscount');
 assert.equal(discountedPrice(list,PCT),{59.99:30,49.99:25,79.99:40}[list],`${slug}: el precio de campaña no es el verificado`);
 const changes:Record<string,unknown>={hotmart_url:url.toString(),price_usd:list,original_price_usd:null,discount_pct:null};
 const diff=Object.keys(changes).filter(key=>(d[key]??null)!==changes[key]);
 if(!diff.length){log.push(`= ${slug} ya está a precio de lista`);continue;}
 log.push(`~ ${slug}: ${diff.join(', ')} → base US$${list} sin cupón (la campaña cobra US$${discountedPrice(list,PCT)})`);
 if(!publish)continue;
 await backup(`courses-${slug}-antes-black-friday`,current);
 await api(`/_emdash/api/content/courses/${current.item.id}?locale=es`,json('PUT',{_rev:current._rev,data:{...d,...changes,price_checked_at:checkedAt.toISOString()}}));
 const fresh=await api(`/_emdash/api/content/courses/${slug}?locale=es`);
 await api(`/_emdash/api/content/courses/${fresh.item.id}/publish?locale=es`,json('POST',{_rev:fresh._rev}));
}

console.log(log.join('\n'));
console.log(publish?`Aplicado en ${environment} (${origin}).`:`Simulación en ${environment}: nada se modificó. Añade --publish para aplicar.`);
