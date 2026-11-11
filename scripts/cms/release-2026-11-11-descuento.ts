/**
 * Cupón del 50 % en los cinco cursos (decisión de JP, 11-11-2026).
 *
 * `offDiscount=031016` ya se usaba en Globoflexia. Comprobado ese día en el checkout de Hotmart
 * (dos capturas: por la mañana y justo antes de publicar): con el cupón los cinco bajan a la mitad
 * (US$30 / 25 / 25 / 40 / 25). El precio que se publica es el del checkout con cupón; el tachado,
 * el del checkout sin él.
 *
 * Uso: node --import tsx scripts/cms/release-2026-11-11-descuento.ts --environment=local|development|production [--publish]
 * Sin --publish solo informa de lo que cambiaría.
 */
import {writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {adminApi,environmentFromArgs} from './_admin-api.mjs';

const environment=environmentFromArgs();
const publish=process.argv.includes('--publish');
const {origin,api,json}=await adminApi(environment);
const CHECKED='2026-11-11T00:00:00.000Z';
const COUPON='031016';
const backupDir=`.data/release-2026-11-11/${environment}`;await mkdir(backupDir,{recursive:true});
// [precio con cupón, precio de lista], verificados en el checkout.
const PRICES:Record<string,[number,number]>={
 'curso-de-decoracion-con-globos':[30,59.99],
 'curso-de-globoflexia':[25,49.99],
 'curso-de-bouquets-de-globos':[25,49.99],
 'curso-de-flores-con-globos':[40,79.99],
 'curso-de-globos-burbuja':[25,49.99],
};
const log:string[]=[];
for(const [slug,[price,list]] of Object.entries(PRICES)){
 const current=await api(`/_emdash/api/content/courses/${slug}?locale=es`);
 const d=current.item.data;
 // El precio de lista publicado debe ser el verificado: si alguien lo cambió, se revisa a mano.
 assert.ok([d.price_usd,d.original_price_usd].includes(list),`${slug}: el precio publicado (${d.price_usd}/${d.original_price_usd}) no coincide con el verificado (${list})`);
 const url=new URL(d.hotmart_url);url.searchParams.set('offDiscount',COUPON);
 const changes:Record<string,unknown>={hotmart_url:url.toString(),price_usd:price,original_price_usd:list,discount_pct:50,price_checked_at:CHECKED};
 const diff=Object.fromEntries(Object.entries(changes).filter(([k,v])=>JSON.stringify(d[k])!==JSON.stringify(v)));
 if(!Object.keys(diff).length){log.push(`= ${slug} ya tiene el 50 %`);continue;}
 log.push(`~ ${slug}: ${Object.keys(diff).join(', ')} → US$${price} (lista US$${list})`);
 if(!publish)continue;
 await writeFile(`${backupDir}/courses-${slug}-descuento.json`,JSON.stringify(current,null,2),{mode:0o600,flag:'wx'}).catch(error=>{if(error.code!=='EEXIST')throw error;});
 await api(`/_emdash/api/content/courses/${current.item.id}?locale=es`,json('PUT',{_rev:current._rev,data:{...d,...diff}}));
 const fresh=await api(`/_emdash/api/content/courses/${slug}?locale=es`);
 await api(`/_emdash/api/content/courses/${fresh.item.id}/publish?locale=es`,json('POST',{_rev:fresh._rev}));
}
console.log(log.join('\n'));
console.log(publish?`Aplicado en ${environment} (${origin}).`:`Simulación en ${environment}: nada se modificó. Añade --publish para aplicar.`);
