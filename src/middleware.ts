import {defineMiddleware} from 'astro:middleware';

// All editorial content is Spanish. /es/ is the Spain market route, not an
// optional language prefix. The [cc] pages validate markets against the CMS;
// Astro's automatic locale redirects would incorrectly reject Spain's URLs.
export const onRequest=defineMiddleware(async (_context,next)=>next());
