// Bing Webmaster API: envía URLs (SubmitUrlbatch) y el feed RSS (SubmitFeed).
// Complementa a IndexNow (scripts/indexnow.mjs); úsalo tras publicar muchas URLs de golpe.
// La API key es PERSONAL y secreta: se lee de BING_WMT_API_KEY (nunca commitearla).
//
// Uso:
//   BING_WMT_API_KEY=... node scripts/bing-submit.mjs --quota           → cuota diaria/mensual
//   BING_WMT_API_KEY=... node scripts/bing-submit.mjs --feed            → envía /blog/rss.xml
//   BING_WMT_API_KEY=... node scripts/bing-submit.mjs URL [URL…]        → envía URLs concretas
//   BING_WMT_API_KEY=... node scripts/bing-submit.mjs --sitemap-blog    → URLs del sitemap del blog (dist/)
import { readFile } from 'node:fs/promises';

const SITE = 'https://cursodeglobosonline.com';
const KEY = process.env.BING_WMT_API_KEY;
if (!KEY) throw new Error('Falta BING_WMT_API_KEY');
const api = (method, query = '') => `https://ssl.bing.com/webmaster/api.svc/json/${method}?${query}apikey=${KEY}`;

async function call(method, body, query = '') {
  const res = await fetch(api(method, query), {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  console.log(`${method}: HTTP ${res.status} ${text.slice(0, 300)}`);
  if (!res.ok) process.exitCode = 1;
  return text;
}

const args = process.argv.slice(2);
if (args.includes('--quota')) {
  await call('GetUrlSubmissionQuota', undefined, `siteUrl=${encodeURIComponent(SITE + '/')}&`);
} else if (args.includes('--feed')) {
  await call('SubmitFeed', { siteUrl: SITE, feedUrl: `${SITE}/blog/rss.xml` });
} else {
  let urls = args.filter((a) => a.startsWith('https://'));
  if (args.includes('--sitemap-blog')) {
    const xml = await readFile('dist/sitemaps/sitemap-blog.xml', 'utf8');
    urls = [...xml.matchAll(/<loc>(https:\/\/[^<]+)<\/loc>/g)].map((m) => m[1]).filter((u) => !u.includes('/_astro/'));
  }
  if (urls.length === 0) throw new Error('Sin URLs que enviar');
  // Lotes de 100 (la doc de Microsoft no fija el máximo; 100 es conservador).
  for (let i = 0; i < urls.length; i += 100) {
    await call('SubmitUrlbatch', { siteUrl: SITE, urlList: urls.slice(i, i + 100) });
  }
}
