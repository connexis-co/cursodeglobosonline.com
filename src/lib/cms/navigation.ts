import {getMenu,type MenuItem} from 'emdash';
import {pagePath} from '@/plugins/globos-integrity/model';
export {pagePath};
export async function navigation(name:string,country='co'):Promise<MenuItem[]>{
 const menu=await getMenu(name,{locale:'es'});
 function adapt(item:MenuItem):MenuItem{let url=item.url;const match=url.match(/^\/paginas\/([^/]+)\/?$/);if(match)url=pagePath(match[1]!);url=url.replace(/^\/co\//,`/${country}/`);return{...item,url,children:item.children.map(adapt)};}
 return(menu?.items??[]).map(adapt);
}
