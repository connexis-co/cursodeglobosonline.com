/** Anonymous HTML only. Query-bearing visits include previews, coupons and attribution. */
export function publicCacheEligible(request:Request):boolean {
 const url=new URL(request.url);
 return url.hostname==='cursodeglobosonline.com' && ['GET','HEAD'].includes(request.method)
  && !url.search && !request.headers.has('Cookie') && !request.headers.has('Authorization')
  && !request.headers.has('X-Globos-Preview-Token')
  && !/^\/(?:_emdash|api|admin|landing|cdn-cgi)(?:\/|$)/.test(url.pathname);
}

/** Expire before a scheduled offer starts or finishes; never serve a stale promotion. */
export function publicCacheTtl(promotions:Record<string,unknown>[],now=Date.now()):number {
 let seconds=300;
 for(const promotion of promotions){
  if(promotion.offerVerified!==true)continue;
  for(const key of ['startsAt','endsAt']){
   const time=Date.parse(String(promotion[key]??''));
   if(time>now)seconds=Math.min(seconds,Math.floor((time-now)/1000));
  }
 }
 return Math.max(0,seconds);
}

// Common header/footer relationships make conservative collection-level purges appropriate.
export const PUBLIC_CONTENT_TAGS=['globos-public','pages','courses','blog','testimonials','countries','cities',
 'categories','subcategories','producers','authors','clusters','videos','graphics','promotions',
 'emdash:settings','emdash:menu:primary','emdash:menu:footer'];

/** Native comment moderation and plugin KV writes also change rendered HTML. */
export function publicMutationRequiresPurge(request:Request,response:Response):boolean{
 if(!response.ok||!["POST","PUT","PATCH","DELETE"].includes(request.method))return false;
 const path=new URL(request.url).pathname;
 return path==="/_emdash/api/plugins/globos-whatsapp/save"
  || /^\/_emdash\/api\/admin\/comments(?:\/|$)/.test(path);
}
