import {readFile,writeFile} from 'node:fs/promises';import {api,json} from '../dev-api.mjs';
const source=JSON.parse(await readFile('docs/migration/calendar-source.json','utf8'));
const courses=(await api('/_emdash/api/content/courses?locale=es&limit=100')).items.filter(x=>x.status==='published');
const countries=(await api('/_emdash/api/content/countries?locale=es&limit=100')).items;
const current=(await api('/_emdash/api/content/promotions?locale=es&limit=100')).items;
const seeded=[];
for(const e of source.events){
 if(current.some(x=>x.slug===e.id))continue;
 const scoped=JSON.parse(e.paises).filter(code=>countries.some(c=>c.slug===code));
 const selected=courses.filter(c=>['amor-amistad-co-2026','dia-madre-2027'].includes(e.id)?/flores|bouquets/.test(c.slug):e.id==='regreso-clases-2026'?c.slug==='curso-de-globoflexia':true);
 if(!selected.length)continue;
 await api('/_emdash/api/content/promotions',json('POST',{slug:e.id,locale:'es',status:'draft',data:{title:e.nombre,headline:`${e.nombre}: aprende decoración con globos`,starts_at:new Date(e.desde*1000).toISOString(),ends_at:new Date(e.hasta*1000).toISOString(),priority:e.prioridad,url_key:e.url_key,button_label:'Ver oferta',theme:['blackFriday','cyber'].includes(e.tema)?'dark':'festive',offer_verified:false,calendar_source:'Calendario interno de Sably · '+e.id,verification_notes:`Pendiente: validar fechas de campaña y elegibilidad del producto en Hotmart. La referencia de Sably propone ${e.pct}% y cupón ${e.cupon}; no se aplican automáticamente.`},references:{country_links:scoped.map(code=>countries.find(c=>c.slug===code).id),course_links:selected.map(c=>c.id),excluded_course_links:[]}}));seeded.push(e.id);
}
const menuResponse=await api('/_emdash/api/menus?locale=es');const menus=Array.isArray(menuResponse)?menuResponse:menuResponse.menus??menuResponse.items;
if(!menus.some(x=>x.name==='footer')){
 await api('/_emdash/api/menus',json('POST',{name:'footer',label:'Pie de página · institucional',locale:'es'}));
 for(const [label,path] of [['Nosotros','/nosotros/'],['Blog','/blog/'],['Contacto','/contacto/'],['Mapa del sitio','/sitemap/'],['Términos y condiciones','/legal/terminos/'],['Política de privacidad','/legal/privacidad/']])await api('/_emdash/api/menus/footer/items?locale=es',json('POST',{type:'custom',label,customUrl:path}));
}
await api('/_emdash/api/schema/collections/promotions',json('PUT',{dateField:'starts_at'}));
await writeFile('docs/migration/verification/calendar.json',JSON.stringify({checkedAt:new Date().toISOString(),created:seeded,configured:source.events.map(e=>e.id),published:0,source:source.source},null,2)+'\n');console.log('Calendar drafts:',seeded.length,'; footer menu configured.');
