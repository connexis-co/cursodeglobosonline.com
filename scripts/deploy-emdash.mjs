import {readFile,rm} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
export function assertDevelopment(config){
 if(config.name!=='globos-emdash-dev'||config.account_id!=='6e36c2fb07c21f30ed3c0d6e824884bc'||config.vars?.GLOBOS_ENVIRONMENT!=='development')throw Error('Only the isolated development Worker is authorized.');
 if(config.routes?.length!==1||config.routes[0].pattern!=='dev.cursodeglobosonline.com'||!config.routes[0].custom_domain)throw Error('Unexpected deployment domain.');
 const expected={DB:'46f1b9d1-c426-46a7-8aa4-016bebd05595',RATINGS_DB:'59e66256-9615-4fa7-b8e2-09b92005da27'};
 if(config.d1_databases?.length!==2||config.d1_databases.some(d=>expected[d.binding]!==d.database_id))throw Error('Unexpected database binding.');
 if(config.r2_buckets?.length!==1||config.r2_buckets[0].bucket_name!=='globos-emdash-dev-media')throw Error('Unexpected media bucket.');
 const namespaces={SESSION:'8c8b74fc3dbd4e37823b5f8ad10a90b1',CACHE:'f68a42cb471343d19c33c72465c59695'};
 if(config.kv_namespaces?.length!==2||new Set(config.kv_namespaces.map(k=>k.binding)).size!==2||config.kv_namespaces.some(k=>namespaces[k.binding]!==k.id))throw Error('Unexpected session/cache namespace.');
 if(config.workers_dev!==false||config.preview_urls!==false||config.assets?.run_worker_first!==true)throw Error('Development access protection is required.');
}
if(import.meta.url===new URL(process.argv[1],'file://').href){
 for(const file of ['wrangler.jsonc','dist/server/wrangler.json'])assertDevelopment(JSON.parse(await readFile(file,'utf8')));
 // The Cloudflare adapter copies local preview secrets; they are never deployment artifacts.
 await rm('dist/server/.dev.vars',{force:true});
 const result=spawnSync(process.execPath,['node_modules/wrangler/bin/wrangler.js','deploy','--config','dist/server/wrangler.json'],{stdio:'inherit',env:{...process.env,WRANGLER_LOG_PATH:process.env.WRANGLER_LOG_PATH||'/tmp/globos-wrangler.log'}});
 process.exit(result.status??1);
}
