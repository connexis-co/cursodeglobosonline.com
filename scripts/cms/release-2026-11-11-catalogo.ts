/**
 * Publicación editorial explícita e idempotente del 11-11-2026.
 *
 * 1. Enlaces de Hotmart con el mismo acortador que usa sably.co (`hotm.io/…-curso-crashing`).
 *    Resuelven al mismo hotlink de afiliado que los `hotm.art` anteriores (comprobado el
 *    11-11-2026: mismo `go.hotmart.com/<código>` y mismo `?ref=` en el checkout).
 * 2. Precios base confirmados ese día en el checkout.
 * 3. Curso nuevo «Curso de Decoración con Globos» (producto J42873379B de MasterClasses.La),
 *    con temario, valoración y reseñas tomados de su ficha pública. Nada inventado.
 * 4. Portada: cinco cursos y encabezados orientados al catálogo, no a un curso concreto.
 *
 * Uso: node --import tsx scripts/cms/release-2026-11-11-catalogo.ts --environment=local|development|production [--publish]
 * Sin --publish solo informa de lo que cambiaría.
 */
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {mediaItemToValue} from 'emdash/media';
import {migrateBody} from '../portable-migration';
import {adminApi,environmentFromArgs} from './_admin-api.mjs';

const environment=environmentFromArgs();
const publish=process.argv.includes('--publish');
const {origin,api,json}=await adminApi(environment);
const CHECKED='2026-11-11T00:00:00.000Z';
const backupDir=`.data/release-2026-11-11/${environment}`;await mkdir(backupDir,{recursive:true});
const entry=(collection:string,slug:string)=>api(`/_emdash/api/content/${collection}/${slug}?locale=es`);
const exists=async(collection:string,slug:string)=>{try{return await entry(collection,slug)}catch(error){if(/HTTP 404/.test(String(error)))return null;throw error}};
async function backup(name:string,value:unknown){await writeFile(`${backupDir}/${name}.json`,JSON.stringify(value,null,2),{mode:0o600,flag:'wx'}).catch(e=>{if(e.code!=='EEXIST')throw e;});}
const log:string[]=[];
async function update(collection:string,slug:string,changes:Record<string,unknown>){
 const current=await entry(collection,slug);
 const diff=Object.fromEntries(Object.entries(changes).filter(([k,v])=>JSON.stringify(current.item.data[k])!==JSON.stringify(v)));
 if(!Object.keys(diff).length){
  // Un borrador guardado por una ejecución interrumpida todavía no es lo que ve el público.
  const pending=current.item.draftRevisionId&&current.item.draftRevisionId!==current.item.liveRevisionId;
  if(!pending){log.push(`= ${collection}/${slug} sin cambios`);return current;}
  log.push(`~ ${collection}/${slug}: borrador pendiente de publicar`);
  if(publish)await api(`/_emdash/api/content/${collection}/${current.item.id}/publish?locale=es`,json('POST',{_rev:current._rev}));
  return entry(collection,slug);
 }
 log.push(`~ ${collection}/${slug}: ${Object.keys(diff).join(', ')}`);
 if(!publish)return current;
 await backup(`${collection}-${slug}`,current);
 await api(`/_emdash/api/content/${collection}/${current.item.id}?locale=es`,json('PUT',{_rev:current._rev,data:{...current.item.data,...diff}}));
 const fresh=await entry(collection,slug);
 await api(`/_emdash/api/content/${collection}/${fresh.item.id}/publish?locale=es`,json('POST',{_rev:fresh._rev}));
 return entry(collection,slug);
}

// 1-2 · Enlaces con el acortador de Sably y fecha de verificación del precio.
const LINKS:Record<string,{url:string;price:number;original?:number;discount?:number}>={
 'curso-de-globoflexia':{url:'https://hotm.io/globoflexia-figuras-con-globos-curso-crashing?offDiscount=031016',price:25,original:49.99,discount:50},
 'curso-de-bouquets-de-globos':{url:'https://hotm.io/bouquet-de-globos-para-eventos-curso-crashing',price:49.99},
 'curso-de-flores-con-globos':{url:'https://hotm.io/flores-de-globos-curso-crashing',price:79.99},
 'curso-de-globos-burbuja':{url:'https://hotm.io/decoracion-de-globos-burbuja-curso-crashing',price:49.99},
};
for(const [slug,spec] of Object.entries(LINKS)){
 const current=await entry('courses',slug);
 assert.equal(current.item.data.price_usd,spec.price,`El precio publicado de ${slug} no coincide con el verificado`);
 await update('courses',slug,{hotmart_url:spec.url,price_checked_at:CHECKED});
}

// 3 · Curso general de decoración con globos.
const SLUG='curso-de-decoracion-con-globos';
const body=`Un arco que se desarma a media fiesta o una guirnalda con huecos casi nunca es culpa de los globos: es de la medida, del nudo y de la cuenta de materiales. Este curso de decoración con globos empieza por ahí, por lo que hace que un montaje aguante las horas del evento y se vea parejo en las fotos.

Lo produce MasterClasses.La, la misma productora de los demás cursos de este sitio, y es su formación más valorada en Hotmart: 4,7 sobre 5 con 177 valoraciones públicas.

### Primero la base: globos, inflado y calibrado

El primer módulo recorre los tipos, formas y tamaños de globo, en látex y en microfoil, y enseña a inflar con calibrador para que todas las piezas midan lo mismo. También el atado y el encintado de cada material y el uso de la termoselladora. Incluye una lista de proveedores y de materiales en PDF.

### Arcos perlados y guirnaldas, con sus fórmulas

El segundo módulo es el corazón del curso: cómo se arma un arco perlado, qué nudos lo aseguran y cómo fijarlo. Después, la guirnalda de globos y las composiciones que salen de ella. Cada técnica viene con su fórmula para calcular cuántos globos y cuánto material lleva, que es lo que evita comprar de más o quedarse corto el día del evento.

### Cobrar bien: precios, costos y contrato

El tercer módulo trata el montaje como un servicio. Explica cómo fijar precios a partir de los costos y gastos directos, trae un formulario de costos, una guía de comercialización y un modelo de contrato de servicios listo para adaptar.

### Acabados que suben el valor del montaje

El cuarto módulo reúne más de diez técnicas para decorar los globos. Como bono, un tutorial en video del pedestal de globos Baby Boom, una pieza que se vende sola en baby showers.`;

const data={
 title:'Curso de Decoración con Globos',
 short_description:'Aprende a montar arcos perlados y guirnaldas de globos con sus fórmulas de materiales, y a cotizar cada decoración. Videos, guías en PDF y certificado.',
 meta_description:'Curso de decoración con globos online desde {lugar}: arcos, guirnaldas, cálculo de materiales y precios. 4,7/5 en Hotmart con 177 valoraciones. Certificado.',
 level:'Principiante',lessons_count:9,
 modules:[
  {title:'Fundamentos de la decoración con globos',lessons_text:['Tipos, formas y tamaños: globos de látex y microfoil','Infladores y calibración','Atado y encintado de globos de látex y de microfoil','Uso de la termoselladora','PDF: aspectos técnicos, materiales y lista de proveedores'].join('\n')},
  {title:'La decoración con globos clásica',lessons_text:['Arcos perlados: tipos de nudos y aseguramiento','Fórmulas para calcular los materiales de un arco perlado','Creación y composición de una guirnalda de globos','Composiciones con guirnaldas','Cálculo de materiales para la guirnalda','PDF: diseños, fórmulas y tutoriales de nubes de globos'].join('\n')},
  {title:'Negocio y marketing',lessons_text:['Cómo fijar precios: costos, gastos directos y factores que los cambian','Marketing, comercialización y publicidad (guía en PDF)','5 claves para un negocio de globos','PDF: formulario de costos, guía del negocio y modelo de contrato de servicios'].join('\n')},
  {title:'Técnicas para añadir valor',lessons_text:'Más de 10 técnicas decorativas para adornar los globos'},
  {title:'Bono: pedestal de globos Baby Boom',lessons_text:'Video tutorial del pedestal Baby Boom, paso a paso'},
 ],
 learnings:['Elegir el globo correcto, de látex o microfoil, para cada montaje','Inflar con calibrador para que todas las piezas midan lo mismo','Armar arcos perlados y asegurarlos para que aguanten el evento','Componer guirnaldas de globos y derivar otros diseños de ellas','Calcular cuántos globos y cuánto material lleva cada decoración','Poner precio a un montaje a partir de sus costos','Usar un contrato de servicios y un formulario de costos propios','Aplicar más de 10 acabados decorativos sobre los globos'].map(text=>({text})),
 audience:['Personas que quieren empezar en la decoración con globos desde cero','Quienes ya decoran fiestas de familia y quieren cobrar por ello','Decoradoras de eventos que necesitan arcos y guirnaldas en su catálogo','Animadores y pasteleras que quieren sumar un servicio a sus pedidos'].map(text=>({text})),
 faqs:[
  {q:'¿Qué se aprende en el curso de decoración con globos?',a:'Los fundamentos (tipos de globo, inflado, calibrado, atado y encintado), los arcos perlados y las guirnaldas con sus fórmulas de materiales, más de 10 técnicas decorativas y un módulo de precios, costos, marketing y contrato de servicios.'},
  {q:'¿Sirve si nunca he decorado con globos?',a:'Sí. El primer módulo parte de los tipos y tamaños de globo y de cómo inflar y calibrar. No pide experiencia previa.'},
  {q:'¿En qué se diferencia de los otros cursos de globos del sitio?',a:'Es el curso general: arcos, guirnaldas y negocio. Globoflexia enseña figuras con globos largos; Bouquets, Flores y Globos Burbuja profundizan cada uno en un tipo de arreglo.'},
  {q:'¿Qué materiales necesito?',a:'Globos de látex de buena calidad, un inflador y un calibrador. El curso incluye una lista de materiales y de proveedores en PDF; la termoselladora se explica para los globos de microfoil.'},
  {q:'¿Incluye certificado?',a:'Sí. Al completar el curso recibes un certificado de estudios digital emitido a través de Hotmart.'},
  {q:'¿Qué valoración tiene el curso?',a:'En su ficha pública de Hotmart tiene 4,7 sobre 5 con 177 valoraciones (dato consultado el 11 de noviembre de 2026).'},
  {q:'¿Hay garantía?',a:'Sí. Hotmart da 7 días de garantía con devolución del 100% si el curso no era lo que esperabas.'},
 ],
 price_usd:59.99,price_checked_at:CHECKED,
 hotmart_url:'https://hotm.io/diseno-y-decoracion-con-globos-curso-crashing',
 hotmart_product_url:'https://hotmart.com/es/marketplace/productos/diseno-y-decoracion-con-globos/J42873379B',
 hotmart_rating_value:4.7,hotmart_rating_count:177,hotmart_rating_checked_at:CHECKED,
 featured:false,
 keywords:['curso de decoración con globos','curso de globos','curso de decoración con globos online','curso de arcos de globos','curso de guirnaldas de globos','curso de decoración de fiestas con globos'].map(text=>({text})),
 original_published_at:CHECKED,body:migrateBody(body),template:'globos-classic',
};

let course=await exists('courses',SLUG);
if(course){log.push(`= courses/${SLUG} ya existe (${course.item.status})`);await update('courses',SLUG,Object.fromEntries(Object.entries(data).filter(([k])=>!['body','original_published_at','featured'].includes(k))));}
else{
 log.push(`+ courses/${SLUG}`);
 if(publish){
  const [subcategory,producer]=await Promise.all([entry('subcategories','decoracion-con-globos--arcos'),entry('producers','masterclasses')]);
  // Portada propia: foto de guirnalda ya usada en el sitio (sin marcas de terceros).
  const form=new FormData();form.set('file',new Blob([await readFile('public/images/decoracion-guirnalda.jpg')],{type:'image/jpeg'}),'curso-de-decoracion-con-globos.jpg');form.set('deduplicate','true');
  const media=(await api('/_emdash/api/media',{method:'POST',body:form})).item;
  const alt='Guirnalda orgánica de globos en tonos coral, crema y dorado montada en un salón de eventos';
  await api('/_emdash/api/media/'+media.id,json('PUT',{alt,caption:'Curso de Globos Online'}));
  const cover={...mediaItemToValue('local',{...media,meta:{storageKey:media.storageKey}}),alt};
  await api('/_emdash/api/content/courses',json('POST',{slug:SLUG,locale:'es',status:'draft',data:{...data,cover},references:{subcategory_link:[subcategory.item.id],producer_link:[producer.item.id]}}));
  course=await entry('courses',SLUG);await backup(`courses-${SLUG}-created`,course);
  await api(`/_emdash/api/content/courses/${course.item.id}/publish?locale=es`,json('POST',{_rev:course._rev}));
  course=await entry('courses',SLUG);
 }
}

// Reseñas públicas del curso nuevo y de Globoflexia (texto literal de la ficha de Hotmart).
const REVIEWS=[
 {id:'hm-decoracion-con-globos-2024-10-21-jenny',course:SLUG,name:'Jenny',rating:5,date:'2024-10-21T00:00:00.000Z',text:'Exelente explicación,muy clara me sirve muchísimo el curso ,con encarna aprendí y me decidí a trabajar en decoración con globos,todo bello'},
 {id:'hm-decoracion-con-globos-2023-02-15-livier',course:SLUG,name:'Livier',rating:5,date:'2023-02-15T00:00:00.000Z',text:'Fácil de entrar, explicación concreta y detallada, conocimientos basados en la experiencia propia, atención inmediata a alumnas, consejos y mucho más, estoy agradecida con hosmart y todos los k colaboran para q se lleven a cabo estos cursos tan interesantes y efectivos, los felicito a todos.'},
];
for(const review of REVIEWS){
 if(await exists('testimonials',review.id)){log.push(`= testimonials/${review.id} ya existe`);continue;}
 log.push(`+ testimonials/${review.id}`);
 if(!publish||!course)continue;
 await api('/_emdash/api/content/testimonials',json('POST',{slug:review.id,locale:'es',status:'draft',data:{name:review.name,text:review.text,rating:review.rating,date:review.date,source:'Hotmart',source_url:data.hotmart_product_url},references:{course_link:[course.item.id]}}));
 const created=await entry('testimonials',review.id);
 await api(`/_emdash/api/content/testimonials/${created.item.id}/publish?locale=es`,json('POST',{_rev:created._rev}));
}

// 4 · Portada: catálogo de cinco cursos. El encabezado deja «decoración con globos» a la ficha del curso.
await update('pages','inicio',{
 title:'Curso de Globos Online: 5 Cursos con Certificado',
 description:'Cursos de globos online: decoración con globos, globoflexia, bouquets, flores y globos burbuja. Certificado, acceso de por vida y garantía de 7 días.',
 heading:'Cursos de globos online para',highlight:'vivir de las fiestas',
 lead:'Decoración con globos, globoflexia, bouquets, flores y globos burbuja. En video, paso a paso, con certificado de estudios y acceso para siempre.',
 catalog_title:'Cinco cursos de globos, uno para cada oficio',
 catalog_lead:'Elige por lo que quieres vender: montajes con arcos y guirnaldas, figuras para animar fiestas o arreglos para regalar. Todos incluyen certificado y acceso permanente.',
});

console.log(log.join('\n'));
console.log(publish?`Publicado en ${environment} (${origin}). Respaldos en ${backupDir}.`:`Simulación en ${environment}: nada se modificó. Añade --publish para aplicar.`);
