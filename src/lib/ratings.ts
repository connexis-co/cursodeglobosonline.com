import { env } from 'cloudflare:workers';
import { aggregates, type RatingsEnv } from './ratings-api';
import { emptyRating, emptyRatings, type RatingsByCourse, type CourseRating } from './ratings-config';
/** Request-time aggregates from this environment only; never query production from development. */
export async function getCourseRatings():Promise<RatingsByCourse>{const db=(env as RatingsEnv).RATINGS_DB;return db?aggregates(db):emptyRatings();}
export async function getCourseRating(slug:string):Promise<CourseRating>{return (await getCourseRatings())[slug]??emptyRating();}

/** One aggregate query per request, shared by all blog cards and the article widget. */
import {getRequestContext} from 'emdash/request-context';
const blogCache=new WeakMap<object,Promise<RatingsByCourse>>();
export function getBlogRatings():Promise<RatingsByCourse>{
 const context=getRequestContext();const cached=context&&blogCache.get(context);if(cached)return cached;
 const db=(env as RatingsEnv).RATINGS_DB;const result=db?aggregates(db,undefined,'blog'):Promise.resolve({});
 if(context)blogCache.set(context,result);return result;
}
export async function getBlogRating(id:string):Promise<CourseRating>{return(await getBlogRatings())[id]??emptyRating();}
