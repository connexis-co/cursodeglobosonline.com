import {readFile} from 'node:fs/promises';import {api,json} from './dev-api.mjs';
const seed=JSON.parse(await readFile('emdash.seed.json','utf8'));
for(const c of seed.collections){const {group,sortOrder,admin,dateField}=c;await api('/_emdash/api/schema/collections/'+c.slug,json('PUT',{group,sortOrder,admin,...(dateField?{dateField}:{})}));console.log('Admin group:',c.slug,group);}
