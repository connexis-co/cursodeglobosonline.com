import {blogSeoError} from './blog-seo';
export const FIXED_PAGE_PATHS:Record<string,string>={inicio:'/',nosotros:'/nosotros/',contacto:'/contacto/',privacidad:'/legal/privacidad/',terminos:'/legal/terminos/'};
export const pagePath=(slug:string)=>FIXED_PAGE_PATHS[slug]??`/paginas/${slug}/`;
export function editorialError(collection:string,slug:string,d:Record<string,unknown>):string|undefined{
 if(collection==='blog'){const error=blogSeoError(d);if(error)return error;}
 if(collection==='pages'&&d.path!==pagePath(slug))return `La ruta de esta página debe ser ${pagePath(slug)}. Cambia el slug para crear otra página.`;
 for(const key of ['cta_url','hotmart_url','checkout_url'])if(d[key]){try{const u=new URL(String(d[key]),'https://example.com');if(!['https:','http:'].includes(u.protocol))return 'El enlace no es seguro.';if(key!=='cta_url'&&(u.protocol!=='https:'||!['hotm.art','go.hotmart.com','pay.hotmart.com','hotmart.com'].includes(u.hostname)))return 'El checkout debe ser HTTPS de Hotmart.';}catch{return 'El enlace no es válido.';}}
 if(collection==='courses'){
  const price=Number(d.price_usd),original=Number(d.original_price_usd);if(!Number.isFinite(price)||price<=0)return 'El precio debe ser mayor que cero.';
  if(d.original_price_usd&&original<price)return 'El precio anterior no puede ser menor al precio vigente.';
  const discount=Number(d.discount_pct);if(discount&&(!original||Math.abs(discount-(1-price/original)*100)>1))return 'El porcentaje debe corresponder a los precios verificados.';
 }
 if(collection==='promotions'){
  const start=Date.parse(String(d.starts_at)),end=Date.parse(String(d.ends_at));
  if(!Number.isFinite(start)||!Number.isFinite(end)||start>=end)return 'El inicio debe ser anterior al fin, con fechas válidas y zona horaria.';
  if(!d.offer_verified)return 'Verifica la oferta para los cursos seleccionados antes de publicar la promoción.';
  if(!String(d.verification_notes??'').trim())return 'Registra cómo verificaste la oferta y sus condiciones.';
  if(d.discount_pct!=null&&(Number(d.discount_pct)<0||Number(d.discount_pct)>100))return 'El descuento debe estar entre 0 y 100.';
 }
}
