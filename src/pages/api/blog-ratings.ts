import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { ratingsGet, ratingsPost, type RatingsEnv } from '@/lib/ratings-api';
export const GET:APIRoute=({request,locals})=>ratingsGet({request,env:env as RatingsEnv,kind:'blog',waitUntil:p=>locals.cfContext.waitUntil(p)});
export const POST:APIRoute=({request,locals})=>ratingsPost({request,env:env as RatingsEnv,kind:'blog',waitUntil:p=>locals.cfContext.waitUntil(p)});
