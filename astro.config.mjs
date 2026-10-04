import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import {cacheCloudflare} from '@astrojs/cloudflare/cache';
import emdash from 'emdash/astro';
import {emdashSmtp} from 'emdash-smtp';
import { d1, r2, kvCache } from '@emdash-cms/cloudflare';
const production=process.env.GLOBOS_BUILD_ENV==='production';
// Preserve the existing production measurement container; development stays separate.
if(production)process.env.PUBLIC_GTM_ID??='GTM-KKP7WL8Q';
const site=production?'https://cursodeglobosonline.com':process.env.SITE_URL || 'https://dev.cursodeglobosonline.com';
export default defineConfig({cache:{provider:cacheCloudflare()},site,image:{domains:['cursodeglobosonline.com']},i18n:{defaultLocale:'es',locales:['es'],routing:'manual'},output:'server',trailingSlash:'ignore',adapter:cloudflare({imageService:production?'cloudflare':'passthrough',configPath:production?'wrangler.production.jsonc':'wrangler.jsonc'}),
 integrations:[react(),mdx(),emdash({database:d1({binding:'DB'}),storage:r2({binding:'MEDIA'}),objectCache:kvCache({binding:'CACHE',defaultTtl:3600,revalidate:1000,keyPrefix:'globos-v1'}),siteUrl:site,auth:{type:production?'globos-production':'globos-development',entrypoint:fileURLToPath(new URL(production?'./src/auth/production.ts':'./src/auth/development.ts',import.meta.url)),config:{autoProvision:true,syncRoles:true}},plugins:[
 emdashSmtp(),
 {id:'globos-seo',version:'1.0.0',entrypoint:fileURLToPath(new URL('./src/plugins/globos-seo/index.ts',import.meta.url))},
 {id:'globos-integrity',version:'1.0.0',entrypoint:fileURLToPath(new URL('./src/plugins/globos-integrity/index.ts',import.meta.url))},
 {id:'globos-whatsapp',version:'1.0.0',entrypoint:fileURLToPath(new URL('./src/plugins/globos-whatsapp/index.ts',import.meta.url)),adminEntry:fileURLToPath(new URL('./src/plugins/globos-whatsapp/admin.tsx',import.meta.url)),adminPages:[{path:'/whatsapp',label:'WhatsApp',icon:'message-circle'}]},
 {id:'globos-promotions',version:'1.0.0',entrypoint:fileURLToPath(new URL('./src/plugins/globos-promotions/index.ts',import.meta.url)),adminEntry:fileURLToPath(new URL('./src/plugins/globos-promotions/admin.tsx',import.meta.url)),adminPages:[{path:'/calendar',label:'Calendario de promociones',icon:'calendar'}]},
 ]})],server:{port:Number(process.env.PORT)||4338},vite:{plugins:[tailwindcss()]},build:{inlineStylesheets:'auto'}});
