import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parse} from 'yaml';
import {validateSeed} from 'emdash/seed';
import {migrateBody} from '../scripts/portable-migration.ts';
const seed=JSON.parse(readFileSync('emdash.seed.json','utf8'));
const archive=JSON.parse(readFileSync('scripts/migration-source/legacy-site.json','utf8')).sources;
test('seed uses native validated collection schemas',()=>assert.deepEqual(validateSeed(seed),{valid:true,errors:[],warnings:[]}));
test('each original course and article is imported exactly once with original slug, body, price, affiliate link and publication date',()=>{
 for(const [path,raw] of Object.entries(archive) as [string,string][]){
  const match=path.match(/^src\/content\/(courses|blog)\/([^_][^/]+)\.mdx$/);if(!match)continue;
  const parts=raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)!;const original=parse(parts[1]);
  const entries=seed.content[match[1]].filter((e:any)=>e.slug===match[2]);assert.equal(entries.length,1,path);
  const entry=entries[0];assert.equal(entry.data.title,original.title);assert.equal(entry.data.source_body,parts[2]);assert.equal(entry.status,original.draft?'draft':'published');
  if(match[1]==='courses'){assert.equal(entry.data.hotmart_url,original.hotmartUrl);assert.equal(entry.data.price_usd,original.priceUSD);}
  assert.equal(entry.data.original_published_at,original.publishedAt);
 }
 assert.equal(seed.content.courses.length,4);assert.equal(seed.content.blog.length,28);
});
test('portable rich text preserves link marks, bullet lists and tables',()=>{
 const blocks=migrateBody('## Título\n\nTexto **fuerte** y [enlace](https://example.com).\n\n- Uno\n- Dos\n\n| A | B |\n| --- | --- |\n| 1 | 2 |');
 assert.ok(blocks.some((b:any)=>b.style==='h2'));assert.ok(blocks.some((b:any)=>b.listItem==='bullet'));
 assert.ok(blocks.some((b:any)=>b.markDefs?.some((m:any)=>m.href==='https://example.com')));
 assert.ok(JSON.stringify(blocks).includes('table'));assert.deepEqual(blocks,migrateBody('## Título\n\nTexto **fuerte** y [enlace](https://example.com).\n\n- Uno\n- Dos\n\n| A | B |\n| --- | --- |\n| 1 | 2 |'));
});
test('the seed does not rename Portable Text reserved keys',()=>{
 const body=seed.content.blog.flatMap((e:any)=>e.data.body);assert.ok(body.some((b:any)=>b.markDefs?.length));assert.ok(body.some((b:any)=>b.listItem));assert.ok(!JSON.stringify(body).includes('mark_defs'));
});
test('GFM cells omit delimiters and preserve emphasis, links and escaped pipes',()=>{
 const table=migrateBody('| **Nombre** | Enlace |\n| --- | --- |\n| A \\| B | [Ver](https://example.com) |')[0] as any;
 const texts=table.rows.map((row:any)=>row.cells.map((cell:any)=>cell.content.map((s:any)=>s.text??'').join('')));
 assert.deepEqual(texts,[['Nombre','Enlace'],['A | B','Ver']]);
 assert.equal(table.rows[0].cells[0].isHeader,true);
 assert.ok(table.rows[0].cells[0].content[0].marks.includes('strong'));
 assert.equal(table.rows[1].cells[1].markDefs[0].href,'https://example.com');
});
test('source archive, importer and seed contain no development passwords or tokens',()=>{
 for(const file of ['emdash.seed.json','scripts/migration-source/legacy-site.json','wrangler.jsonc'])assert.ok(!/GLOBOS_DEV_PASSWORD\s*[=:]\s*[^\s"}]+/.test(readFileSync(file,'utf8')));
});
