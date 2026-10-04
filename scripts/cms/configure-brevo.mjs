import {api,json} from '../dev-api.mjs';import {writeFile} from 'node:fs/promises';
const path='/_emdash/api/plugins/emdash-smtp/admin';
await api(path,json('POST',{type:'form_submit',action_id:'save_global',values:{primaryProviderId:'brevo',fromEmail:'contacto@sably.co',fromName:'Curso de Globos Online · Sably',replyTo:'contacto@sably.co',logLevel:'errors'}}));
await api(path,json('POST',{type:'block_action',action_id:'select_provider',value:'brevo'}));
const response=await api(path,json('POST',{type:'page_load',page:'/providers'}));const text=JSON.stringify(response);
if(!text.includes('contacto@sably.co')||!text.includes('Brevo'))throw Error('SMTP admin did not reflect Brevo configuration');
await writeFile('docs/migration/verification/brevo.json',JSON.stringify({checkedAt:new Date().toISOString(),plugin:'emdash-smtp@0.4.0',provider:'brevo',sender:'contacto@sably.co',apiKeyConfigured:false,emailSent:false,deliveryNotTested:true},null,2)+'\n');
console.log('Brevo and sender configured. API key absent; no email sent.');
