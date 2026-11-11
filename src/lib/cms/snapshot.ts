import {env,waitUntil} from 'cloudflare:workers';
import {getRequestContext} from 'emdash/request-context';

/**
 * Published, relation-hydrated collections shared across requests.
 *
 * Hydrating references costs one EmDash entry read per row (hundreds of D1 queries on country,
 * blog and 404 pages). The snapshot keeps that result in isolate memory and KV, keyed by a
 * signature read from the D1 primary on every request. The signature is strongly consistent, so
 * a route-cache fill after a publish never renders from an older snapshot — the reason EmDash
 * bypasses its own eventually consistent object cache during fills.
 */
interface Row {id:string;data:unknown}
interface SnapshotEnv {DB?:D1Database;CACHE?:KVNamespace;GLOBOS_CONTENT_SNAPSHOT?:string}

/** Collections covered by the signature. Any other collection is always read directly. */
const COLLECTIONS=['authors','blog','categories','cities','clusters','countries','courses','graphics',
 'pages','producers','promotions','subcategories','testimonials','videos'] as const;
const KNOWN=new Set<string>(COLLECTIONS);
/** Upper bound for a change the signature cannot observe; publishing is detected immediately. */
const MAX_AGE_MS=2*3600_000;
// Bump when the row shape changes so stored snapshots from older code are never reused.
const KV_PREFIX='globos-snapshot-v2:';
const KV_TIMEOUT_MS=1500;

// Row counts, timestamps and version totals change on publish, unpublish, trash, delete and
// scheduled visibility. Reference edits (insert, delete or reorder) change the reference totals.
// One row of scalar subqueries: D1 rejects a UNION of this many SELECTs (~5 ms, ~500 rows read).
const SIGNATURE_SQL='SELECT '+[
 ...COLLECTIONS.map(c=>`(SELECT COUNT(*)||'|'||IFNULL(MAX(updated_at),'')||'|'||TOTAL(version)||'|'||IFNULL(MAX(deleted_at),'')`
  +`||'|'||IFNULL(MAX(published_at),'')||'|'||TOTAL(status='published')||'|'||TOTAL(scheduled_at IS NOT NULL AND scheduled_at<=?1) FROM ec_${c}) AS ${c}`),
 `(SELECT COUNT(*)||'|'||IFNULL(MAX(created_at),'')||'|'||TOTAL(rowid)||'|'||TOTAL(sort_order*rowid)||'|'||TOTAL(sort_order) FROM _emdash_content_references) AS refs`,
 `(SELECT COUNT(*)||'|'||IFNULL(MAX(updated_at),'') FROM _emdash_seo) AS seo`,
].join(',');

const runtime=env as unknown as SnapshotEnv;

export function snapshotEnabled(collection:string):boolean {
 if(!KNOWN.has(collection)||runtime.GLOBOS_CONTENT_SNAPSHOT==='off'||!runtime.DB)return false;
 const context=getRequestContext();
 return !context||!(context.editMode||context.preview||context.dbIsIsolated);
}

async function computeSignature():Promise<string|null> {
 try{
  const {results}=await runtime.DB!.prepare(SIGNATURE_SQL).bind(new Date().toISOString()).all();
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(results)));
  return [...new Uint8Array(digest).slice(0,16)].map(b=>b.toString(16).padStart(2,'0')).join('');
 }catch(error){console.error('[snapshot] signature failed',error);return null;}
}
const signatures=new WeakMap<object,Promise<string|null>>();
/** One signature query per request, shared by every collection it renders. */
function signature():Promise<string|null> {
 const context=getRequestContext();
 const cached=context&&signatures.get(context);if(cached)return cached;
 const result=computeSignature();if(context)signatures.set(context,result);return result;
}

const DATE='$$globosDate';
function encode(value:unknown):string {
 return JSON.stringify(value,function(this:Record<string,unknown>,key,val){const original=this[key];return original instanceof Date?{[DATE]:original.toISOString()}:val;});
}
function decode<T>(raw:string):T|null {
 try{return JSON.parse(raw,(_key,value)=>value&&typeof value==='object'&&typeof value[DATE]==='string'&&Object.keys(value).length===1?new Date(value[DATE]):value) as T;}
 catch{return null;}
}
interface Stored {builtAt:number;rows:Row[]}
/** Encoded text per collection: every request decodes its own copy, so no render can mutate another's rows. */
const memory=new Map<string,{signature:string;builtAt:number;encoded:string}>();

function withTimeout<T>(promise:Promise<T>,ms:number):Promise<T|null> {
 let timer:ReturnType<typeof setTimeout>|undefined;
 return Promise.race([promise,new Promise<null>(resolve=>{timer=setTimeout(()=>resolve(null),ms);})]).finally(()=>clearTimeout(timer));
}

function remember(collection:string,sig:string,encoded:string):Row[]|null {
 const stored=decode<Stored>(encoded);
 if(!stored||!Array.isArray(stored.rows)||Date.now()-stored.builtAt>=MAX_AGE_MS)return null;
 memory.set(collection,{signature:sig,builtAt:stored.builtAt,encoded});
 return stored.rows;
}

/** Return `build()`'s rows, from memory or KV when the published content has not changed. */
export async function snapshotRows(collection:string,build:()=>Promise<Row[]>):Promise<Row[]> {
 if(!snapshotEnabled(collection))return build();
 const sig=await signature();if(!sig)return build();
 const cached=memory.get(collection);
 if(cached&&cached.signature===sig&&Date.now()-cached.builtAt<MAX_AGE_MS){const rows=decode<Stored>(cached.encoded)?.rows;if(rows)return rows;}
 const key=`${KV_PREFIX}${sig}:${collection}`;const kv=runtime.CACHE;
 if(kv){
  const raw=await withTimeout(kv.get(key,{type:'text',cacheTtl:300}),KV_TIMEOUT_MS).catch(()=>null);
  const rows=raw?remember(collection,sig,raw):null;if(rows)return rows;
 }
 const built=await build();
 const encoded=encode({builtAt:Date.now(),rows:built.map(row=>({id:row.id,data:row.data}))} satisfies Stored);
 // A publish during the build may have mixed versions; keep those rows for this request only.
 if(await computeSignature()!==sig)return built;
 const rows=remember(collection,sig,encoded);
 if(kv)waitUntil(kv.put(key,encoded,{expirationTtl:MAX_AGE_MS/1000}).catch(error=>console.error('[snapshot] KV write failed',error)));
 return rows??built;
}
