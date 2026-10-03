import {hydrateRelations} from './cms/hydrate';
import type { CollectionEntry as LegacyEntry } from 'astro:content';
import { getEmDashCollection, getEmDashEntry } from 'emdash';
import type { Country, City } from './countries';
import type { Category } from './categories';
import type { CityLocal } from './cities';
import type { Author } from './authors';
import type { BlogCluster } from './blog-clusters';
export type RichBlock=Record<string,unknown> & {_type:string};
export type CollectionEntry<C extends 'courses'|'blog'|'testimonials'>=LegacyEntry<C>&{richBody:RichBlock[];data:LegacyEntry<C>['data']&{video?:string};contentRef:{collection:string;id:string;slug:string}};
export interface Row {id:string;data:unknown}
export async function readAll(collection:string):Promise<Row[]> {
 const rows:Row[]=[];let cursor:string|undefined;const seen=new Set<string>();
 do {const result=await getEmDashCollection(collection,{locale:'es',status:'published',limit:100,cursor});if(result.error)throw result.error;rows.push(...result.entries);if(!result.hasMore)break;if(!result.nextCursor||seen.has(result.nextCursor))throw Error('Invalid CMS pagination');cursor=result.nextCursor;seen.add(cursor);}while(true);
 // Bound D1 relation reads: a blog index can contain hundreds of entries.
 const hydrated:Row[]=[];for(let i=0;i<rows.length;i+=4)hydrated.push(...await Promise.all(rows.slice(i,i+4).map(row=>hydrateRelations(collection,row))));return hydrated;
}
function decode(value:unknown):unknown {if(Array.isArray(value))return value.map(decode);if(value&&typeof value==='object'&&'_type' in value)return value;if(value&&typeof value==='object'&&!(value instanceof Date))return Object.fromEntries(Object.entries(value).map(([k,v])=>[k.startsWith('_')?k:k==='original_published_at'?'publishedAt':k==='editorial_updated_at'?'updatedAt':k.replace(/_([a-z])/g,(_,c:string)=>c.toUpperCase()),decode(v)]));return value;}
export const rowData=(r:Row)=>decode(r.data) as Record<string,unknown>;
const data=rowData;
const text=(v:unknown)=>typeof v==='string'?v:'';
const items=(v:unknown)=>Array.isArray(v)?v.map(x=>typeof x==='string'?x:text((x as Record<string,unknown>).text)):[];
const date=(v:unknown)=>new Date(v as string);
export function imageSource(value:unknown):string {
 if(typeof value==='string')return value;
 if(value&&typeof value==='object'){const v=value as Record<string,unknown>;if(typeof v.url==='string')return v.url;if(typeof v.src==='string')return v.src;const key=(v.meta as Record<string,unknown>|undefined)?.storageKey;if(typeof key==='string')return '/_emdash/api/media/file/'+key.split('/').map(encodeURIComponent).join('/');if(v.provider==='local'&&typeof v.id==='string')return '/_emdash/api/media/file/'+encodeURIComponent(v.id);}
 return '';
}
function adapt<C extends 'courses'|'blog'|'testimonials'>(collection:C,row:Row):CollectionEntry<C>{
 const d={...data(row)};const slug=text(d.slug)||row.id;
 for(const k of ['price','originalPrice'])if(d[k+'Usd']!==undefined){d[k+'USD']=d[k+'Usd'];delete d[k+'Usd'];}
 for(const f of ['publishedAt','updatedAt','priceCheckedAt','date'])if(d[f])d[f]=date(d[f]);
 for(const f of ['keywords','audience','learnings','related'])d[f]=items(d[f]);
 if(collection==='courses'){
  d.modules=Array.isArray(d.modules)?d.modules.map(v=>{const m=v as Record<string,unknown>;return{title:text(m.title),lessons:text(m.lessonsText).split('\n').filter(Boolean)}}):[];
  d.instructor=d.instructorName?{name:d.instructorName,title:d.instructorTitle??'',bio:d.instructorBio??'',photo:imageSource(d.instructorPhoto)||undefined}:undefined;
  d.hotmartRating=d.hotmartRatingValue?{value:d.hotmartRatingValue,count:d.hotmartRatingCount,checkedAt:date(d.hotmartRatingCheckedAt)}:undefined;
  d.video=imageSource(d.video)||undefined;d.cover=imageSource(d.cover)||undefined;d.faqs??=[];
 }
 if(collection==='blog'){
  const image=d.hero as Record<string,unknown>|undefined;const src=imageSource(image);
  d.hero={src:src||'/og-default.jpg',width:Number(image?.width)||1600,height:Number(image?.height)||900,format:'webp'};d.draft=false;d.faqs??=[];d.related??=[];
 }
 return {id:slug,collection,data:d,body:plainText(d.body),richBody:Array.isArray(d.body)?d.body:[],contentRef:{collection,id:text(d.id)||row.id,slug}} as CollectionEntry<C>;
}
export function plainText(v:unknown):string {if(typeof v==='string')return v;if(Array.isArray(v))return v.map(plainText).join(' ');if(v&&typeof v==='object'){const r=v as Record<string,unknown>;return typeof r.text==='string'?r.text:plainText(r.children??r.content??[]);}return '';}
export async function getCollection<C extends 'courses'|'blog'|'testimonials'>(collection:C,filter?:(entry:CollectionEntry<C>)=>boolean):Promise<CollectionEntry<C>[]> {const entries=(await readAll(collection)).map(r=>adapt(collection,r));return filter?entries.filter(filter):entries;}
export async function getEntry<C extends 'courses'|'blog'|'testimonials'>(collection:C,slug:string):Promise<CollectionEntry<C>|undefined>{const result=await getEmDashEntry(collection,slug,{locale:'es'});if(result.error)throw result.error;return result.entry?adapt(collection,await hydrateRelations(collection,result.entry)):undefined;}
export const getCourses=()=>getCollection('courses');
export const getCourse=(slug:string)=>getEntry('courses',slug);
export async function getCountries():Promise<Country[]> {const [rows,cities]=await Promise.all([readAll('countries'),readAll('cities')]);return rows.map(row=>{const d=data(row);return {...d,cities:cities.filter(c=>data(c).country===d.code).map(c=>({slug:text(data(c).citySlug),name:text(data(c).name)}))} as unknown as Country;});}
export async function getCountry(code:string):Promise<Country|undefined>{return(await getCountries()).find(c=>c.code===code);}
export async function getCategories():Promise<Category[]>{const [rows,subs]=await Promise.all([readAll('categories'),readAll('subcategories')]);return rows.map(r=>{const d=data(r),slug=text(d.slug)||r.id;return {...d,slug,subcategories:subs.filter(s=>data(s).category===slug).map(s=>({slug:text(data(s).localSlug),name:text(data(s).shortName)}))} as unknown as Category;});}
export async function getCategory(slug:string):Promise<Category>{const cat=(await getCategories()).find(c=>c.slug===slug);if(!cat)throw Error(`Unknown category ${slug}`);return cat;}
export async function getCityLocal(slug:string):Promise<CityLocal|undefined>{const row=(await readAll('cities')).find(r=>data(r).citySlug===slug);return row?{hook:text(data(row).hook),faqs:(data(row).faqs??[]) as CityLocal['faqs']}:undefined;}
export async function getAuthors():Promise<Author[]>{return(await readAll('authors')).map(r=>({...data(r),slug:text(data(r).slug)||r.id,sameAs:items(data(r).sameAs),photo:imageSource(data(r).photo)||undefined}) as unknown as Author);}
export async function getAuthor(slug:string):Promise<Author>{const all=await getAuthors();const author=all.find(a=>a.slug===slug)??all[0];if(!author)throw Error('No published authors');return author;}
export async function getClusters():Promise<BlogCluster[]>{return(await readAll('clusters')).map(r=>({...data(r),slug:text(data(r).slug)||r.id}) as unknown as BlogCluster);}
export async function getBlogCluster(slug:string):Promise<BlogCluster>{return(await getClusters()).find(c=>c.slug===slug)??{slug,name:slug,short:''};}

export interface Document {id:string;data:Record<string,any>;contentRef:{collection:string;id:string;slug:string};richBody:RichBlock[]}
export async function getDocument(collection:string,slug:string):Promise<Document|undefined>{const result=await getEmDashEntry(collection,slug,{locale:'es'});if(result.error)throw result.error;if(!result.entry)return;const d=rowData(await hydrateRelations(collection,result.entry));return{id:slug,data:d,contentRef:{collection,id:String(d.id??result.entry.id),slug},richBody:Array.isArray(d.body)?d.body:[]};}
export async function listDocuments(collection:string):Promise<Document[]>{return(await readAll(collection)).map(r=>{const d=rowData(r),slug=String(d.slug??r.id);return{id:slug,data:d,contentRef:{collection,id:String(d.id??r.id),slug},richBody:Array.isArray(d.body)?d.body:[]};});}
