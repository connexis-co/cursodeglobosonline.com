import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {assertDevelopment} from './deploy-emdash.mjs';
assertDevelopment(JSON.parse(await readFile('wrangler.jsonc','utf8')));
const vars=Object.fromEntries((await readFile('.dev.vars','utf8')).split('\n').filter(x=>x&&!x.startsWith('#')).map(line=>{const n=line.indexOf('=');return[line.slice(0,n),line.slice(n+1).replace(/^"|"$/g,'')]}));
const keys=['GLOBOS_DEV_PASSWORD','EMDASH_AUTH_SECRET','RATING_SALT'];
if(keys.some(k=>!vars[k]))throw Error('Missing development secrets');
const result=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','secret','bulk','--config','wrangler.jsonc'],{input:JSON.stringify(Object.fromEntries(keys.map(k=>[k,vars[k]]))),stdio:['pipe','inherit','inherit']});
process.exit(result.status??1);
