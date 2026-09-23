// IndexNow: avisa a Bing, Yandex, Seznam, Naver, Yep, Internet Archive y Amazonbot
// (comparten los envíos) de las URLs nuevas o actualizadas tras un deploy a producción.
// La clave es pública por diseño: vive en public/<clave>.txt (protocolo IndexNow).
//
// Uso:
//   node scripts/indexnow.mjs            → URLs del sitemap con lastmod de los últimos 2 días
//   node scripts/indexnow.mjs --all      → todas las URLs de los sitemaps (tras migración/rediseño)
//   node scripts/indexnow.mjs URL [URL…] → URLs concretas
// Lee dist/ (ejecutar después de `npm run build`).
import { readdir, readFile } from 'node:fs/promises';

const HOST = 'cursodeglobosonline.com';
const keyFile = (await readdir('public')).find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) throw new Error('No se encontró el archivo de clave IndexNow en public/');
const KEY = keyFile.replace('.txt', '');

const args = process.argv.slice(2);
const all = args.includes('--all');
const explicit = args.filter((a) => a.startsWith('https://'));

async function sitemapUrls() {
  const index = await readFile('dist/sitemap-index.xml', 'utf8');
  const files = [...index.matchAll(/<loc>https:\/\/[^/]+\/(sitemaps\/[^<]+)<\/loc>/g)].map((m) => m[1]);
  const since = Date.now() - 2 * 86_400_000;
  const urls = [];
  for (const file of files) {
    const xml = await readFile(`dist/${file}`, 'utf8');
    for (const [, block] of xml.matchAll(/<url>([\s\S]*?)<\/url>/g)) {
      const loc = block.match(/<loc>([^<]+)<\/loc>/)?.[1];
      const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1];
      if (!loc) continue;
      if (all || (lastmod && Date.parse(lastmod) >= since)) urls.push(loc);
    }
  }
  return urls;
}

const urlList = [...new Set(explicit.length ? explicit : await sitemapUrls())].slice(0, 10_000);
if (urlList.length === 0) {
  console.log('IndexNow: nada que enviar');
  process.exit(0);
}

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${urlList.length} URLs → HTTP ${res.status} ${await res.text()}`);
if (![200, 202].includes(res.status)) process.exit(1);
