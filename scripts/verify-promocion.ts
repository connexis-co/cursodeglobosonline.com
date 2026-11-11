/**
 * Comprueba que el sitio y la campaña vigente dicen lo mismo, y que Hotmart lo cobra.
 *
 * Recorre todas las URLs del sitemap de un entorno y, en cada página:
 *   - con campaña activa: la barra está, todos los botones de pago llevan el cupón y la ficha
 *     publica (título y datos estructurados) el precio de campaña;
 *   - sin campaña: no hay barra, ningún botón lleva cupón y la ficha publica el precio de lista.
 * Al final sigue un botón de cada curso hasta el checkout y compara el precio que cobra Hotmart.
 *
 * Solo lee. Uso: node --import tsx scripts/verify-promocion.ts development|production
 */
import {adminApi} from './cms/_admin-api.mjs';
import {checkoutPrice,discountedPrice} from '../src/plugins/globos-promotions/model.ts';

const env=process.argv[2];if(!['local','development','production'].includes(env))throw Error('Indica local, development o production');
const {origin,headers,api}=await adminApi(env);
// En producción se mira como visitante anónimo: es la respuesta que guarda la caché.
const visitor:Record<string,string>=env==='production'?{'user-agent':'Mozilla/5.0 verificacion-promocion'}:headers;
const get=async(path:string)=>{const r=await fetch(origin+path,{headers:visitor,signal:AbortSignal.timeout(120000)});return{status:r.status,body:await r.text()};};
let fail=0;const problems:string[]=[];
const check=(ok:boolean,where:string,message:string)=>{if(!ok){fail++;if(problems.length<40)problems.push(`✗ ${where}: ${message}`);}};

// Campaña que debería verse: la activa sin clave de anuncios, según el calendario del panel.
const calendar=await api('/_emdash/api/plugins/globos-promotions/calendar');
const live=(calendar.items as any[]).filter(item=>item.state==='live'&&!item.urlKey).sort((a,b)=>b.priority-a.priority)[0];
const courses=((await api('/_emdash/api/content/courses?limit=100&locale=es')).items as any[]).filter(item=>item.status==='published');
const list=Object.fromEntries(courses.map(item=>[item.slug,Number(item.data.original_price_usd??item.data.price_usd)]));
const expected=(slug:string)=>live?.discountPct?discountedPrice(list[slug],live.discountPct):Number(courses.find(c=>c.slug===slug)?.data.price_usd);
console.log(live?`Campaña activa: ${live.label} (−${live.discountPct} %, cupón ${live.coupon}), hasta ${live.endsAt}`:'Sin campaña activa: el sitio debe mostrar el precio de lista.');

// URLs públicas, desde el índice de sitemaps.
const locs=(xml:string)=>[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match=>new URL(match[1]!).pathname);
const index=await get('/sitemap-index.xml');
const paths=[...new Set((await Promise.all(locs(index.body).map(async path=>locs((await get(path)).body)))).flat())];
console.log(`${paths.length} URLs en el sitemap de ${origin}`);

const HOTMART=/href="(https:\/\/(?:hotm\.io|hotm\.art|go\.hotmart\.com|pay\.hotmart\.com)[^"]*)"/g;
const sample:Record<string,string>={};
const stats={bars:0,buyLinks:0,coursePages:0};
async function page(path:string):Promise<void>{
 const {status,body}=await get(path);
 check(status===200,path,`estado ${status}`);if(status!==200)return;
 const hasBar=body.includes('data-promo-barra');if(hasBar)stats.bars++;
 if(live){check(hasBar,path,'falta la barra de campaña');check(!hasBar||body.includes(`data-promo-ends="${live.endsAt}"`),path,'la barra no lleva el fin de la campaña');}
 else check(!hasBar,path,'hay barra sin campaña activa');
 const buy=[...body.matchAll(HOTMART)].map(match=>match[1]!.replaceAll('&amp;','&')).filter(link=>!link.includes('dp=1'));
 stats.buyLinks+=buy.length;
 for(const link of buy){
  const url=new URL(link),coupon=url.searchParams.get('offDiscount');
  if(live)check(coupon===live.coupon,path,`botón de pago sin el cupón de campaña: ${link.slice(0,90)}`);
  else check(!coupon,path,`botón de pago con cupón sin campaña: ${link.slice(0,90)}`);
 }
 const slug=path.split('/').filter(Boolean).find(part=>part.startsWith('curso-'));
 if(!slug||!(slug in list))return;
 stats.coursePages++;
 const price=expected(slug);
 const offer=/"@type":"Offer","price":"([\d.]+)"/.exec(body)?.[1];
 check(Number(offer)===price,path,`datos estructurados con precio ${offer}, se esperaba ${price}`);
 const title=/<title>([^<]*)/.exec(body)?.[1]??'';
 if(live)check(title.includes(`${live.discountPct}% OFF`),path,`el título no anuncia el descuento: ${title}`);
 else check(!/% OFF/.test(title),path,`el título anuncia un descuento sin campaña: ${title}`);
 check(buy.length>0,path,'la ficha no tiene botones de pago');
 if(buy[0])sample[slug]??=buy[0];
}
for(let i=0;i<paths.length;i+=6)await Promise.all(paths.slice(i,i+6).map(page));
console.log(`Páginas con barra: ${stats.bars}/${paths.length} · fichas de curso: ${stats.coursePages} · botones de pago revisados: ${stats.buyLinks}`);

// Un botón por curso, hasta el checkout.
for(const [slug,link] of Object.entries(sample)){
 const response=await fetch(link,{headers:{'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36','Accept-Language':'es'},redirect:'follow',signal:AbortSignal.timeout(40000)});
 const final=new URL(response.url),charged=checkoutPrice(await response.text());
 console.log(`  ${slug}: ${final.hostname}${final.pathname} ref=${final.searchParams.get('ref')} cupón=${final.searchParams.get('offDiscount')??'—'} sck=${final.searchParams.get('sck')} → cobra US$${charged} (sitio US$${expected(slug)})`);
 check(final.hostname==='pay.hotmart.com'&&Boolean(final.searchParams.get('ref')),slug,'el botón no llega al checkout con el ref de afiliado');
 check(charged===expected(slug),slug,`Hotmart cobra ${charged} y el sitio publica ${expected(slug)}`);
}
check(Object.keys(sample).length===Object.keys(list).length,'checkout',`solo se pudo seguir el botón de ${Object.keys(sample).length} de ${Object.keys(list).length} cursos`);

if(problems.length)console.log(problems.join('\n'));
console.log(fail?`\n${fail} comprobaciones fallidas`:'\nTodo correcto');process.exit(fail?1:0);
