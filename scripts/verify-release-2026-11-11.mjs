/**
 * Comprobación de un entorno después de publicar la versión del 11-11-2026: estados, títulos,
 * capa de globos, certificado, sello, enlaces de Hotmart con atribución, sitemap y recursos.
 * Solo lee. Uso (desde la raíz del proyecto): node scripts/verify-release-2026-11-11.mjs development|production
 */
import {adminApi} from './cms/_admin-api.mjs';
const env=process.argv[2];if(!['development','production'].includes(env))throw Error('Indica development o production');const {origin,headers,api}=await adminApi(env);
const pub=env==='production'?{'user-agent':'Mozilla/5.0 verificacion'}:headers; // en producción, como visitante anónimo
const get=async p=>{const r=await fetch(origin+p,{headers:pub,signal:AbortSignal.timeout(90000)});return {status:r.status,body:await r.text()}};
let fail=0;const check=(ok,msg)=>{if(!ok){fail++;console.log('  ✗',msg)}};
for(const p of ['/','/co/','/mx/','/co/cursos/','/co/medellin/','/mx/curso-de-decoracion-con-globos/','/co/curso-de-globoflexia/','/es/curso-de-flores-con-globos/','/blog/','/blog/globoflexia/','/blog/perrito-con-globo/','/sitemap-index.xml','/sitemaps/sitemap-cursos-mx.xml']){
 const {status,body:h}=await get(p);const html=!p.endsWith('.xml');
 const title=(h.match(/<title>([^<]*)/)||[])[1]||'';
 console.log(status,p,'|',title.slice(0,70));
 check(status===200,'estado '+status);
 if(!html)continue;
 check(h.includes('data-bandada'),'falta la capa de globos');
 check(!/hotmart\.com\/es\/marketplace/.test(h),'enlace al marketplace sin ref');
 check(!/ilustrativ/i.test(h),'queda «ilustrativo»');
 check(!/hotm\.art\//.test(h),'queda un enlace hotm.art');
 check(/gabarito/i.test(h),'falta la tipografía nueva');
 if(/\/curso-de-/.test(p)){check(h.includes('cert-hoja'),'falta el certificado');check(h.includes('Sello: garantía'),'falta el sello');check(/hotm\.io\/[^"]+sck=/.test(h),'botón sin hotm.io+sck');check(h.includes('brand/hotmart'),'falta el logo de Hotmart');check((h.match(/<h1/g)||[]).length===1,'no hay un único H1')}
}
for(const a of ['/images/globos/frambuesa-640.webp','/images/globos/sol-320.webp','/brand/hotmart.svg']){const r=await fetch(origin+a,{headers:pub});console.log(r.status,a,r.headers.get('content-type'));check(r.status===200,'recurso '+a)}
const cfg=await api('/_emdash/api/plugins/globos-balloons/config');console.log('panel de globos:',JSON.stringify(cfg.config));
const mx=(await get('/sitemaps/sitemap-cursos-mx.xml')).body;check(mx.includes('curso-de-decoracion-con-globos'),'el curso nuevo no está en el sitemap');
console.log(fail?`\n${fail} comprobaciones fallidas`:'\nTodo correcto');process.exit(fail?1:0);
