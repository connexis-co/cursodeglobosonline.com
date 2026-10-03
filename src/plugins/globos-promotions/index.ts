import { definePlugin, getEmDashEntry } from 'emdash';
import { escapeHtmlAttr } from 'emdash/page';
import { readAll, rowData } from '@/lib/emdash-content';
import { resolvePromotion,checkoutFor,type Promotion } from './model';
const items=(v:unknown)=>Array.isArray(v)?v.map(x=>typeof x==='string'?x:String(x.text??'')):[];
export function createPlugin(){return definePlugin({id:'globos-promotions',version:'1.0.0',capabilities:['hooks.page-fragments:register','content:read'],admin:{pages:[{path:'/calendar',label:'Calendario de promociones',icon:'calendar'}]},routes:{calendar:{methods:['GET'],permission:'content:read_drafts',request:{body:'none'},handler:async ctx=>{const items=[];let cursor:string|undefined;do{const page=await ctx.content!.list('promotions',{limit:100,cursor});items.push(...page.items);cursor=page.hasMore?page.cursor:undefined;}while(cursor);return{items:items.filter(x=>x.status!=='trash')};}}},hooks:{'page:fragments':async({page})=>{
 const url=new URL(page.url);if(url.pathname.startsWith('/_emdash'))return null;
 const parts=url.pathname.split('/').filter(Boolean),country=/^[a-z]{2}$/.test(parts[0]??'')?parts[0]:'co',course=parts.at(-1)??'';
 const promos=(await readAll('promotions')).map(r=>{const d=rowData(r);return {...d,priority:Number(d.priority)||0,id:String(d.slug??r.id),countries:items(d.countries),courses:items(d.courses),excludedCourses:items(d.excludedCourses)} as unknown as Promotion;});
 const p=resolvePromotion(promos,{country,course,key:url.searchParams.get('promo')??''});if(!p)return null;
 let base=p.checkoutUrl??'';if(!base){const result=await getEmDashEntry('courses',course,{locale:'es'});base=String((result.entry?.data as Record<string,unknown>|undefined)?.hotmart_url??'');}let href='';try{if(base)href=checkoutFor(p,base);}catch{return null;}
 const e=escapeHtmlAttr;const background=p.theme==='festive'?'#9c254d':p.theme==='dark'?'#17121a':'#402036';
 const html=`<aside id="globos-promotion" aria-label="Promoción vigente" style="padding:12px 20px;background:${background};color:white;text-align:center"><strong>${e(p.headline)}</strong> ${href?`<a rel="sponsored nofollow noopener" href="${e(href)}" style="margin-left:12px;text-decoration:underline">${e(p.buttonLabel||'Ver promoción')}</a>`:''}<small style="display:block">Vigente hasta ${e(new Intl.DateTimeFormat('es-CO',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Bogota'}).format(new Date(p.endsAt)))} (hora Colombia)</small></aside>`;
 return [{kind:'html',placement:'body:start',key:'globos-promotion',html}];
}}});}
