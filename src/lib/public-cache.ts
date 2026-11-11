/**
 * Cookies set by measurement, advertising and Cloudflare's own edge services. They never change
 * the rendered HTML, so a visitor carrying only these still receives the shared cached page.
 * Any other cookie (EmDash session, edit mode, unknown) keeps the request private.
 */
const ANONYMOUS_COOKIE=/^(?:_ga(?:_[A-Z0-9]+)?|_gid|_gat(?:_.+)?|_gcl_[a-z]+|_gac_.+|FPID|FPLC|FPAU|FPGCL[A-Z]+|FPGSID|_fbp|_fbc|_uet(?:sid|vid)|_clck|_clsk|CLID|MUID|_ttp|__cf_bm|cf_clearance|_cfuvid|__gads|__gpi|__eoi)$/;

/** True when the request carries a cookie that may identify a session or change the response. */
export function hasPrivateCookies(request:Request):boolean {
 const header=request.headers.get('Cookie');if(!header)return false;
 for(const part of header.split(';')){
  const name=part.split('=',1)[0]!.trim();
  if(name&&!ANONYMOUS_COOKIE.test(name))return true;
 }
 return false;
}

/** Anonymous HTML only. Query-bearing visits include previews, coupons and attribution. */
export function publicCacheEligible(request:Request):boolean {
 const url=new URL(request.url);
 return url.hostname==='cursodeglobosonline.com' && ['GET','HEAD'].includes(request.method)
  && !url.search && !hasPrivateCookies(request) && !request.headers.has('Authorization')
  && !request.headers.has('X-Globos-Preview-Token')
  && !/^\/(?:_emdash|api|admin|landing|cdn-cgi)(?:\/|$)/.test(url.pathname);
}

export interface PublicCachePolicy {maxAge:number;swr:number}
/** Publishing purges by tag, so freshness only bounds changes that never purge (votes, offers). */
const HTML_POLICY:PublicCachePolicy={maxAge:3600,swr:86400};
/** Missing URLs are mostly crawler noise; publishing a page purges these too. */
const NOT_FOUND_POLICY:PublicCachePolicy={maxAge:600,swr:3600};

/**
 * Freshness for shared HTML. Neither the fresh nor the stale window may cross the start or end of
 * a published and verified promotion, so an expired offer is never served while revalidating.
 */
export function publicCachePolicy(promotions:Record<string,unknown>[],status=200,now=Date.now()):PublicCachePolicy {
 const base=status===404?NOT_FOUND_POLICY:HTML_POLICY;
 let boundary=Infinity;
 for(const promotion of promotions){
  // D1 guarda los booleanos como 0/1.
  if(promotion.offerVerified!==true&&promotion.offerVerified!==1)continue;
  for(const key of ['startsAt','endsAt']){
   const time=Date.parse(String(promotion[key]??''));
   if(time>now)boundary=Math.min(boundary,Math.floor((time-now)/1000));
  }
 }
 const maxAge=Math.max(0,Math.min(base.maxAge,boundary));
 const swr=Math.max(0,Math.min(base.swr,boundary-maxAge));
 return {maxAge,swr};
}

/** Kept for callers that only need the fresh window. */
export function publicCacheTtl(promotions:Record<string,unknown>[],now=Date.now()):number {
 return publicCachePolicy(promotions,200,now).maxAge;
}

// Common header/footer relationships make conservative collection-level purges appropriate.
export const PUBLIC_CONTENT_TAGS=['globos-public','pages','courses','blog','testimonials','countries','cities',
 'categories','subcategories','producers','authors','clusters','videos','graphics','promotions',
 'emdash:settings','emdash:menu:primary','emdash:menu:footer'];

/** Originals behind /cdn-cgi/image variants; "Replace original" keeps the key, so it purges this tag. */
export const MEDIA_TAG='globos-media';
export const MEDIA_POLICY:PublicCachePolicy={maxAge:86400,swr:604800};
export function publicMediaRequest(request:Request):boolean {
 const url=new URL(request.url);
 return url.hostname==='cursodeglobosonline.com' && ['GET','HEAD'].includes(request.method)
  && !url.search && /^\/_emdash\/api\/media\/file\/[^/]+$/.test(url.pathname);
}

/** Native comment moderation and plugin KV writes also change rendered HTML. */
export function publicMutationRequiresPurge(request:Request,response:Response):boolean{
 if(!response.ok||!["POST","PUT","PATCH","DELETE"].includes(request.method))return false;
 const path=new URL(request.url).pathname;
 return path==="/_emdash/api/plugins/globos-whatsapp/save"
  || /^\/_emdash\/api\/admin\/comments(?:\/|$)/.test(path);
}

/** Replacing or deleting a media item changes the bytes behind an existing storage key. */
export function mediaMutationRequiresPurge(request:Request,response:Response):boolean{
 if(!response.ok||!["PUT","PATCH","DELETE"].includes(request.method))return false;
 return /^\/_emdash\/api\/media\/[^/]+(?:\/replace)?\/?$/.test(new URL(request.url).pathname);
}
