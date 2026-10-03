/** Deterministic, offline content migration. Never writes to a live database. */
import { readFile, writeFile, mkdir, readdir, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, dirname, basename, relative } from 'node:path';
import { parse } from 'yaml';
import ts from 'typescript';
import { markdownToPortableText } from 'emdash/client';
import { validateSeed, type SeedFile, type SeedField } from 'emdash/seed';
import { migrateBody } from './portable-migration';
const archive=JSON.parse(await readFile('scripts/migration-source/legacy-site.json','utf8')) as {sources:Record<string,string>};
const sources=archive.sources;
type Data=Record<string,unknown>;
function literal(n:ts.Expression):unknown {
 if(ts.isStringLiteralLike(n))return n.text;
 if(ts.isNumericLiteral(n))return Number(n.text);
 if(n.kind===ts.SyntaxKind.TrueKeyword)return true;if(n.kind===ts.SyntaxKind.FalseKeyword)return false;
 if(ts.isAsExpression(n)||ts.isParenthesizedExpression(n))return literal(n.expression);
 if(ts.isArrayLiteralExpression(n))return n.elements.map(x=>literal(x as ts.Expression));
 if(ts.isObjectLiteralExpression(n))return Object.fromEntries(n.properties.map(p=>{if(!ts.isPropertyAssignment(p))throw Error('Unsupported property');return[p.name.getText().replace(/^['"]|['"]$/g,''),literal(p.initializer)];}));
 if(n.getText()==='SITE.parent.url')return 'https://sably.co';
 throw Error(`Unsupported expression: ${n.getText()}`);
}
function exported(path:string,name:string):unknown {
 const original=sources[path]!;const source=path.endsWith('.astro')?original.split('---')[1]!:original;const ast=ts.createSourceFile(path,source,ts.ScriptTarget.Latest,true);
 for(const s of ast.statements)if(ts.isVariableStatement(s))for(const d of s.declarationList.declarations)if(d.name.getText()===name&&d.initializer)return literal(d.initializer);
 throw Error(`Missing ${path}:${name}`);
}
const field=(slug:string,label:string,type:SeedField['type']='string',extra:Partial<SeedField>={}):SeedField=>({slug,label,type,...extra});
const required={required:true};
const repeat=(slug:string,label:string,fields:SeedField[])=>field(slug,label,'repeater',{validation:{subFields:fields}});
const texts=(slug:string,label:string)=>repeat(slug,label,[field('text','Texto','text',required)]);
const faqs=()=>repeat('faqs','Preguntas frecuentes',[field('q','Pregunta','string',required),field('a','Respuesta','text',required)]);
const template=field('template','Plantilla','select',{defaultValue:'globos-classic',validation:{options:['globos-classic']}});
const archiveFields=[field('source_path','Archivo de origen'),field('source_sha256','Huella de origen'),field('source_body','Original de migración (no se publica)','text')];
const body=field('body','Contenido','portableText',{searchable:true});
const collections:NonNullable<SeedFile['collections']>=[];
function collection(slug:string,label:string,fields:SeedField[],urlPattern?:string){collections.push({slug,label,labelSingular:label,titleField:fields.some(f=>f.slug==='title')?'title':'name',supports:['drafts','revisions','seo','search','scheduling'],...(urlPattern?{urlPattern}: {routable:false}),fields:[...fields,...archiveFields]});}
collection('courses','Cursos',[
 field('title','Nombre del curso','string',required),field('metaTitle','Título SEO'),field('metaDescription','Descripción SEO','text'),field('category','Categoría','select',{required:true,validation:{options:(exported('src/lib/categories.ts','CATEGORIES') as Data[]).map(x=>String(x.slug))}}),field('subcategory','Subcategoría'),
 field('shortDescription','Descripción corta','text',required),field('level','Nivel','select',{validation:{options:['Principiante','Intermedio','Avanzado','Todos los niveles']}}),field('durationHours','Duración en horas','number'),field('lessonsCount','Número de lecciones','integer'),
 repeat('modules','Temario',[field('title','Módulo'),field('lessonsText','Lecciones (una por línea)','text')]),texts('learnings','Qué aprenderás'),texts('audience','Para quién'),faqs(),
 field('priceUSD','Precio USD verificado','number'),field('originalPriceUSD','Precio anterior real USD','number'),field('priceCheckedAt','Fecha de verificación','datetime'),field('discountPct','Descuento real %','integer'),field('coupon','Cupón'),field('hotmartUrl','Enlace de afiliado','url',required),field('hotmartProductUrl','Fuente Hotmart','url'),field('producer','Productor'),field('students','Estudiantes verificados','integer'),
 field('hotmartRatingValue','Valoración externa Hotmart','number'),field('hotmartRatingCount','Número de opiniones externas','integer'),field('hotmartRatingCheckedAt','Verificada el','datetime'),
 field('instructorName','Instructor'),field('instructorTitle','Cargo'),field('instructorBio','Biografía','text'),field('instructorPhoto','Foto del instructor','image'),field('cover','Portada','image'),field('video','Video','file'),field('featured','Destacado','boolean'),texts('keywords','Palabras clave'),field('publishedAt','Publicación original','datetime'),body,template],'/co/{slug}/');
collection('blog','Artículos',[
 field('title','Título','string',required),field('seoTitle','Título SEO'),field('description','Descripción','text',required),field('discoverTitle','Título para redes'),field('cluster','Tema editorial'),field('isPillar','Artículo pilar','boolean'),field('pillar','Slug del artículo pilar'),field('primaryKeyword','Palabra clave principal'),texts('keywords','Palabras clave'),field('moneyPage','Curso relacionado'),field('moneyAnchor','Texto de llamada al curso'),field('hero','Imagen principal','image'),field('heroAlt','Descripción de la imagen'),field('author','Autor'),field('publishedAt','Publicación original','datetime'),field('updatedAt','Última actualización editorial','datetime'),texts('related','Artículos relacionados (slugs)'),faqs(),body,template],'/blog/{slug}/');
collection('countries','Países',[field('name','País','string',required),field('code','Código','string',required),field('flag','Bandera'),field('hreflang','Idioma regional'),field('currency','Moneda'),field('currencySymbol','Símbolo'),field('usdRate','Tasa de referencia USD','number'),field('priceRound','Redondeo','number'),field('whatsapp','WhatsApp'),field('phoneDisplay','Teléfono visible')]);
collection('cities','Ciudades',[field('name','Ciudad','string',required),field('country','País','string',required),field('citySlug','Slug en URL'),field('hook','Contexto de la ciudad','text'),faqs()]);
collection('categories','Categorías',[field('name','Nombre','string',required),field('short','Descripción','text'),field('emoji','Emoji'),field('icon','Icono'),repeat('subcategories','Subcategorías',[field('slug','Slug'),field('name','Nombre')])]);
collection('clusters','Temas del blog',[field('name','Nombre','string',required),field('short','Descripción','text')]);
collection('authors','Autores',[field('name','Nombre','string',required),field('type','Tipo','select',{validation:{options:['Person','Organization']}}),field('bio','Biografía','text'),field('jobTitle','Cargo'),field('photo','Foto','image'),texts('sameAs','Perfiles públicos')],'/blog/autor/{slug}/');
collection('testimonials','Testimonios documentados',[field('name','Autor','string',required),field('courseSlug','Curso'),field('text','Testimonio','text'),field('rating','Valoración original','number'),field('date','Fecha','datetime'),field('source','Fuente'),field('sourceUrl','Enlace de la fuente','url')]);
collection('pages','Páginas',[field('title','Título','string',required),field('path','Ruta pública','string',required),field('description','Descripción SEO','text'),field('eyebrow','Etiqueta'),field('heading','Encabezado'),field('highlight','Texto destacado'),field('lead','Introducción','text'),field('updatedLabel','Etiqueta de actualización'),field('ctaLabel','Texto de botón'),field('ctaUrl','Enlace de botón'),field('catalogTitle','Título del catálogo'),field('catalogLead','Introducción al catálogo','text'),repeat('method','Método',[field('icon','Icono'),field('title','Título'),field('text','Descripción','text')]),faqs(),body,template]);
collection('videos','Videoteca',[field('title','Título','string',required),field('description','Descripción','text'),field('video','Video','file'),field('poster','Portada','image'),field('transcript','Transcripción','text'),field('course','Curso relacionado'),field('duration','Duración ISO 8601'),body],'/videos/{slug}/');
collection('graphics','Gráficos y recursos',[field('title','Título','string',required),field('description','Descripción','text'),field('image','Imagen','image'),field('alt','Texto alternativo'),field('credit','Crédito'),field('license','Licencia'),body],'/recursos/{slug}/');
collection('promotions','Promociones',[field('title','Campaña','string',required),field('headline','Mensaje del banner','string',required),field('startsAt','Inicio (con zona horaria)','datetime',required),field('endsAt','Fin (exclusivo)','datetime',required),field('priority','Prioridad','integer'),field('urlKey','Activar solo con ?promo='),texts('countries','Países (códigos)'),texts('courses','Cursos incluidos (slugs)'),texts('excludedCourses','Cursos excluidos'),field('coupon','Cupón Hotmart'),field('discountPct','Descuento verificado %','integer'),field('checkoutUrl','Checkout verificado','url'),field('buttonLabel','Texto del botón'),field('theme','Estilo','select',{validation:{options:['brand','dark','festive']}})]);
const content:NonNullable<SeedFile['content']>={};
function add(c:string,slug:string,data:Data,path?:string,status:'published'|'draft'='published'){
 const raw=path?sources[path]:JSON.stringify(data);
 (content[c]??=[]).push({id:`${c}:${slug}`,slug,locale:'es',status,data:{...data,...(path?{source_path:path,source_sha256:createHash('sha256').update(raw!).digest('hex')}: {})}});
}
const mediaManifest:Array<{source:string;target:string}>=[];
async function media(value:unknown,base:string,alt:string){
 if(typeof value!=='string'||!value)return value;
 if(/^https:\/\//.test(value))return {$media:{url:value,alt}};
 const source=value.startsWith('/')?resolve('public','.'+value):resolve(dirname(base),value);
 const ext=basename(source);const target='/migration-media/'+createHash('sha256').update(value).digest('hex').slice(0,12)+'-'+ext;
 mediaManifest.push({source:relative(process.cwd(),source),target});
 return {$media:{url:'https://dev.cursodeglobosonline.com'+target,alt,filename:ext}};
}
for(const [path,raw] of Object.entries(sources))if(/^src\/content\/(courses|blog)\/.+\.mdx$/.test(path)&&!basename(path).startsWith('_')){
 const match=raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);if(!match)throw Error(`Invalid frontmatter ${path}`);
 const data=parse(match[1]!) as Data;const c=path.includes('/courses/')?'courses':'blog';const slug=basename(path,'.mdx');
 for(const k of ['learnings','audience','keywords','related'])if(Array.isArray(data[k]))data[k]=(data[k] as string[]).map(text=>({text}));
 if(data.modules)data.modules=(data.modules as {title:string;lessons:string[]}[]).map(m=>({title:m.title,lessonsText:m.lessons.join('\n')}));
 if(data.instructor){const i=data.instructor as Data;Object.assign(data,{instructorName:i.name,instructorTitle:i.title,instructorBio:i.bio,instructorPhoto:i.photo?await media(i.photo,path,String(i.name)):undefined});delete data.instructor;}
 if(data.hotmartRating){const h=data.hotmartRating as Data;Object.assign(data,{hotmartRatingValue:h.value,hotmartRatingCount:h.count,hotmartRatingCheckedAt:h.checkedAt});delete data.hotmartRating;}
 for(const k of ['hero','cover'])if(data[k])data[k]=await media(data[k],path,String(data.heroAlt??data.title));
 data.template='globos-classic';data.source_body=match[2];data.body=migrateBody(match[2]!);const draft=!!data.draft;delete data.draft;
 add(c,slug,data,path,draft?'draft':'published');
}
const countries=exported('src/lib/countries.ts','COUNTRIES') as (Data&{code:string;cities:Data[]})[];
const local=exported('src/lib/cities.ts','CITY_LOCAL') as Record<string,Data>;
for(const country of countries){const {cities,...data}=country;add('countries',country.code,data,'src/lib/countries.ts');for(const city of cities)add('cities',`${country.code}-${city.slug}`,{...city,citySlug:city.slug,country:country.code,...local[String(city.slug)]},'src/lib/cities.ts');}
for(const [c,path,name] of [['categories','src/lib/categories.ts','CATEGORIES'],['clusters','src/lib/blog-clusters.ts','BLOG_CLUSTERS']] as const)for(const data of exported(path,name) as Data[])add(c,String(data.slug),data,path);
for(const [slug,a] of Object.entries(exported('src/lib/authors.ts','AUTHORS') as Record<string,Data>))add('authors',slug,{...a,sameAs:(a.sameAs as string[]??[]).map(text=>({text}))},'src/lib/authors.ts');
for(const data of JSON.parse(sources['src/content/testimonials.json']!) as Data[])add('testimonials',String(data.id),data,'src/content/testimonials.json');
// Migrate static editorial pages to structured rich text, preserving the source for audit.
function textOf(html:string){return html.replace(/\{SITE\.name\}/g,'Curso de Globos Online').replace(/\{SITE\.url\}/g,'https://cursodeglobosonline.com').replace(/\{SITE\.email\}/g,'contacto@cursodeglobosonline.com').replace(/\{SITE\.stats\.students\}/g,'+100').replace(/\{SITE\.stats\.ventures\}/g,'+80').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();}
for(const [slug,path] of [['nosotros','src/pages/nosotros/index.astro'],['privacidad','src/pages/legal/privacidad/index.astro'],['terminos','src/pages/legal/terminos/index.astro']] as const){
 const raw=sources[path]!;const fragment=slug==='nosotros'?raw.split('class="mt-8 space-y-5')[1]!.split('</div>')[0]!:raw.split('class="mt-8 space-y-6')[1]!.split('</div>')[0]!;
 const paragraphs=[...fragment.matchAll(/<(h2|p)\b[^>]*>([\s\S]*?)<\/\1>/g)].map(m=>(m[1]==='h2'?'## ':'')+textOf(m[2]!)).join('\n\n');
 add('pages',slug,{title:raw.match(/<BaseLayout\s+title="([^"]*)"/)![1],description:raw.match(/description="([^"]*)"/)![1],path:slug==='nosotros'?'/nosotros/':`/legal/${slug}/`,heading:slug==='nosotros'?'La escuela de los que viven de las fiestas':textOf(raw.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)![1]!),eyebrow:slug==='nosotros'?'Nosotros':'',lead:slug==='nosotros'?'Curso de Globos Online es la filial de decoración y globos del ecosistema Sably.':'',updatedLabel:slug==='nosotros'?'':textOf(raw.match(/<p[^>]*>Última actualización:[\s\S]*?<\/p>/)![0]),body:migrateBody(paragraphs),source_body:raw,template:'globos-classic',...(slug==='nosotros'?{ctaLabel:'Ver los cursos',ctaUrl:'/co/cursos/'}:{})},path);
}
add('pages','inicio',{title:'Curso de Decoración con Globos Online con Certificado',description:'4 cursos online de decoración con globos: globoflexia, bouquets, flores y globos burbuja. Certificado, acceso de por vida y garantía de 7 días.',path:'/',heading:'Cursos de decoración con globos para',highlight:'vivir de las fiestas',lead:'Globoflexia, bouquets, flores y globos burbuja: técnica paso a paso, 100% online, con certificado de estudios y acceso para siempre.',ctaLabel:'Explorar los cursos',ctaUrl:'/co/cursos/',catalogTitle:'Cuatro cursos, un oficio que se paga solo',catalogLead:'Empieza por el que más te llame: todos incluyen certificado, acceso permanente y bonos pensados para vender desde la primera semana.',method:exported('src/pages/index.astro','metodo'),faqs:exported('src/pages/index.astro','faqs'),body:[],template:'globos-classic'},'src/pages/index.astro');
add('pages','contacto',{title:'Contacto | Curso de Globos Online',description:'¿Dudas sobre los cursos de decoración con globos? Escríbenos por WhatsApp o correo y te respondemos con toda la información.',path:'/contacto/',eyebrow:'Contacto',heading:'Hablemos de tu próximo curso',lead:'Respondemos dudas sobre temarios, precios en tu moneda, formas de pago y certificados.',body:[],template:'globos-classic'},'src/pages/contacto/index.astro');
const seed:SeedFile={version:'1',defaultLocale:'es',meta:{name:'Globos Classic',description:'Plantilla Astro de Curso de Globos Online; contenido separado de presentación'},settings:{title:'Curso de Globos Online',tagline:'Aprende decoración con globos. Convierte cada fiesta en tu negocio.'},collections,content,menus:[{name:'primary',label:'Navegación principal',items:[{type:'custom',label:'Cursos',url:'/co/cursos/'},{type:'custom',label:'Blog',url:'/blog/'},{type:'custom',label:'Nosotros',url:'/nosotros/'},{type:'custom',label:'Contacto',url:'/contacto/'}]}]};
const snake=(key:string)=>({publishedAt:'original_published_at',updatedAt:'editorial_updated_at'}[key]??key.replace(/([a-z0-9])([A-Z])/g,'$1_$2').toLowerCase());
function normalizeFields(fields:SeedField[]){for(const f of fields){f.slug=snake(f.slug);if(f.validation?.subFields)normalizeFields(f.validation.subFields as SeedField[]);}}
function normalizeData(v:unknown):unknown{if(Array.isArray(v))return v.map(normalizeData);if(v&&typeof v==='object'&&'_type' in v)return v;if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k.startsWith('_')||k==='$media'?k:snake(k),normalizeData(x)]));return v;}
for(const c of collections)normalizeFields(c.fields);
for(const entries of Object.values(content))for(const e of entries)e.data=normalizeData(e.data) as Data;
const mediaReferences:Array<Record<string,unknown>>=[];
for(const [collection,entries] of Object.entries(content))for(const entry of entries)for(const [field,value] of Object.entries(entry.data)){
 if(!value||typeof value!=='object'||!('$media' in value))continue;
 const ref=(value as {$media:{url:string;alt?:string;filename?:string}}).$media;
 const pathname=new URL(ref.url).pathname;const local=mediaManifest.find(m=>m.target===pathname);
 mediaReferences.push({collection,slug:entry.slug,field,...ref,...(local?{source:local.source}:{})});delete entry.data[field];
}
await mkdir('docs/migration',{recursive:true});await writeFile('docs/migration/media-sources.json',JSON.stringify(mediaReferences,null,2)+'\n');
for(const [index,c] of collections.entries()){c.group=['courses','promotions','testimonials'].includes(c.slug)?'Cursos y ventas':['countries','cities'].includes(c.slug)?'Mercados':'Contenido editorial';c.sortOrder=index;c.admin={quickCreate:!['countries','cities','categories','clusters','authors'].includes(c.slug)};if(['blog','courses'].includes(c.slug))c.dateField='original_published_at';}
const result=validateSeed(seed);if(!result.valid)throw Error(result.errors.join('\n'));
await writeFile('emdash.seed.json',JSON.stringify(seed,null,2)+'\n');
await mkdir('docs/migration',{recursive:true});await writeFile('docs/migration/inventory.json',JSON.stringify({sourceCommit:'f846950',counts:Object.fromEntries(Object.entries(content).map(([k,v])=>[k,v.length])),media:mediaManifest},null,2)+'\n');
console.log('Validated migration:',Object.fromEntries(Object.entries(content).map(([k,v])=>[k,v.length])));
