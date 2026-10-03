import {readFile,rm} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
export function assertProduction(config) {
  if(config.name!=='globos-emdash-production'||config.account_id!=='6e36c2fb07c21f30ed3c0d6e824884bc'||config.vars?.GLOBOS_ENVIRONMENT!=='production')throw Error('Expected isolated production Worker');
  const databases={DB:'555eda5c-bab2-4ff5-bdc4-4417c14de4d3',RATINGS_DB:'5c4f6bae-6301-43de-9b1b-16ac873a87ce'};
  if(config.d1_databases?.length!==2||config.d1_databases.some(d=>databases[d.binding]!==d.database_id))throw Error('Unexpected production databases');
  if(config.r2_buckets?.length!==1||config.r2_buckets[0].bucket_name!=='globos-emdash-production-media')throw Error('Unexpected media bucket');
  if(config.kv_namespaces?.length!==1||config.kv_namespaces[0].id!=='909e08c406e84feeac6264af9a1fda84')throw Error('Unexpected sessions');
  if(config.preview_urls!==false||config.assets?.run_worker_first!==true)throw Error('Administrator access gate must run first');
  const allowed=new Set(['cursodeglobosonline.com/*','www.cursodeglobosonline.com/*']);
  if(config.routes?.some(r=>!allowed.has(r.pattern)||r.zone_id!=='887ff3793749dccf03657c0c08697aae'))throw Error('Unexpected public route');
  if(config.vars.EMDASH_SITE_URL!=='https://cursodeglobosonline.com')throw Error('Unexpected canonical origin');
}
if(import.meta.url===new URL(process.argv[1],'file://').href){
  for(const path of ['wrangler.production.jsonc','dist/server/wrangler.json'])assertProduction(JSON.parse(await readFile(path,'utf8')));
  await rm('dist/server/.dev.vars',{force:true});
  const result=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','deploy','--config','dist/server/wrangler.json'],{stdio:'inherit',env:{...process.env,WRANGLER_LOG_PATH:process.env.WRANGLER_LOG_PATH||'/tmp/globos-wrangler.log'}});
  process.exit(result.status??1);
}
