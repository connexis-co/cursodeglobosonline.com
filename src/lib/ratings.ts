import { env } from 'cloudflare:workers';
import { aggregates, type RatingsEnv } from './ratings-api';
import { emptyRating, emptyRatings, type RatingsByCourse, type CourseRating } from './ratings-config';
/** Request-time aggregates from this environment only; never query production from development. */
export async function getCourseRatings():Promise<RatingsByCourse>{const db=(env as RatingsEnv).RATINGS_DB;return db?aggregates(db):emptyRatings();}
export async function getCourseRating(slug:string):Promise<CourseRating>{return (await getCourseRatings())[slug]??emptyRating();}
