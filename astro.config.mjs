import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import emdash from 'emdash/astro';
import { d1, r2 } from '@emdash-cms/cloudflare';
const site=process.env.SITE_URL || 'https://dev.cursodeglobosonline.com';
export default defineConfig({site,i18n:{defaultLocale:'es',locales:['es'],routing:{prefixDefaultLocale:false}},output:'server',trailingSlash:'ignore',adapter:cloudflare({imageService:'passthrough'}),
 integrations:[react(),mdx(),emdash({database:d1({binding:'DB'}),storage:r2({binding:'MEDIA'}),siteUrl:site,auth:{type:'globos-development',entrypoint:fileURLToPath(new URL('./src/auth/development.ts',import.meta.url)),config:{autoProvision:true,syncRoles:true}},plugins:[
 {id:'globos-whatsapp',version:'1.0.0',entrypoint:fileURLToPath(new URL('./src/plugins/globos-whatsapp/index.ts',import.meta.url)),adminEntry:fileURLToPath(new URL('./src/plugins/globos-whatsapp/admin.tsx',import.meta.url)),adminPages:[{path:'/whatsapp',label:'WhatsApp',icon:'message-circle'}]},
 {id:'globos-promotions',version:'1.0.0',entrypoint:fileURLToPath(new URL('./src/plugins/globos-promotions/index.ts',import.meta.url))},
 ]})],server:{port:Number(process.env.PORT)||4338},vite:{plugins:[tailwindcss()]},build:{inlineStylesheets:'auto'}});
