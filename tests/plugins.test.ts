import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_SETTINGS,validateSettings,resolveWhatsApp} from '../src/plugins/globos-whatsapp/model.ts';
import {resolvePromotion,checkoutFor,type Promotion} from '../src/plugins/globos-promotions/model.ts';
const context={path:'/co/curso-de-globoflexia/',course:'curso-de-globoflexia',title:'Globoflexia',category:'globos',country:'co',countryName:'Colombia',countryNumber:'573001112233',url:'https://example.com/co/curso-de-globoflexia/'};
test('WhatsApp defaults use the CMS country number and encoded contextual text',()=>{
 const settings=validateSettings(DEFAULT_SETTINGS);const result=resolveWhatsApp(settings,context,new Date('2026-10-02T15:00:00Z'));assert.ok(result);assert.equal(new URL(result.url).pathname,'/573001112233');assert.match(new URL(result.url).searchParams.get('text')!,/Globoflexia/);
});
test('WhatsApp disabled, excluded paths, and outside business hours render no button',()=>{
 for(const changes of [{enabled:false},{hiddenPaths:['/co/*']},{startTime:'09:00',endTime:'10:00'}])assert.equal(resolveWhatsApp({...DEFAULT_SETTINGS,...changes},context,new Date('2026-10-02T22:00:00Z')),null);
});
test('WhatsApp refuses injected styles, broken dates and invalid phone numbers',()=>{
 for(const changes of [{color:'red;'}, {number:'abc'},{timezone:'invalid'},{startTime:'25:99',endTime:'10:00'}])assert.throws(()=>validateSettings({...DEFAULT_SETTINGS,...changes}));
});
const promo:Promotion={offerVerified:true,id:'test',headline:'Oferta',startsAt:'2026-10-02T00:00:00Z',endsAt:'2026-10-03T00:00:00Z',priority:1,countries:['co'],courses:['curso-de-globoflexia'],excludedCourses:[],urlKey:'',coupon:'ABC',checkoutUrl:'https://pay.hotmart.com/X?ref=affiliate',buttonLabel:'Ver',discountPct:10,theme:'brand'};
const pc={country:'co',course:'curso-de-globoflexia',key:''};
test('promotions honor country, exclusions and exclusive end times',()=>{
 assert.equal(resolvePromotion([promo],pc,Date.parse(promo.startsAt))?.id,'test');assert.equal(resolvePromotion([promo],pc,Date.parse(promo.endsAt)),undefined);
 assert.equal(resolvePromotion([promo],{...pc,country:'mx'},Date.parse(promo.startsAt)),undefined);
 assert.equal(resolvePromotion([{...promo,excludedCourses:[pc.course]}],pc,Date.parse(promo.startsAt)),undefined);
});
test('promotion checkout keeps affiliate attribution and rejects unsafe destinations',()=>{
 const url=new URL(checkoutFor(promo,''));assert.equal(url.searchParams.get('ref'),'affiliate');assert.equal(url.searchParams.get('offDiscount'),'ABC');
 assert.throws(()=>checkoutFor({...promo,checkoutUrl:'javascript:alert(1)'},''));assert.throws(()=>checkoutFor({...promo,checkoutUrl:'https://evil.example/'},''));
});

test('opciones de los globos: límites del panel y valores por defecto',async()=>{
 const {DEFAULT_SETTINGS:defaults,validateSettings:validate,LIMITS}=await import('../src/plugins/globos-balloons/model.ts');
 assert.deepEqual(validate(defaults),defaults);
 assert.equal(validate({...defaults,stringStyle:'serpentina'}).stringStyle,'serpentina');
 assert.equal(validate({...defaults,stringStyle:undefined}).stringStyle,'cuerda');
 assert.throws(()=>validate({...defaults,count:LIMITS.count+1}),/Cantidad en escritorio/);
 assert.throws(()=>validate({...defaults,countMobile:-1}),/Cantidad en móvil/);
 assert.throws(()=>validate({...defaults,size:10}),/Tamaño/);
 assert.throws(()=>validate({...defaults,stringStyle:'cadena'}),/Tipo de cuerda/);
 assert.throws(()=>validate({...defaults,enabled:'sí'}),/Mostrar globos/);
});

test('la campaña pone el precio: céntimos exactos, cupón en el enlace y nada si no mejora',async()=>{
 const {discountedPrice,promotedPrice,parsePromotion,promotionState,compareOffer,checkoutPrice,promotionLastDay,countdownParts}=await import('../src/plugins/globos-promotions/model.ts');
 // Los cinco precios verificados en el checkout de Hotmart el 11-11-2026, al 50 % y al 25 %.
 assert.deepEqual([59.99,49.99,79.99].map(v=>discountedPrice(v,50)),[30,25,40]);
 assert.deepEqual([59.99,49.99,79.99].map(v=>discountedPrice(v,25)),[44.99,37.49,59.99]);
 const bf=parsePromotion({title:'Black Friday 2026',headline:'50 % en los cinco cursos',startsAt:'2026-11-11T05:00:00.000Z',endsAt:'2026-12-01T05:00:00.000Z',priority:100,coupon:'031016',discountPct:50,theme:'dark',offerVerified:1},'bf-2026');
 assert.equal(bf.offerVerified,true);assert.equal(bf.label,'Black Friday');assert.equal(bf.id,'bf-2026');
 const list={priceUSD:49.99,hotmartUrl:'https://hotm.io/globoflexia-figuras-con-globos-curso-crashing'};
 const applied=promotedPrice(list,bf)!;
 assert.equal(applied.priceUSD,25);assert.equal(applied.originalPriceUSD,49.99);assert.equal(applied.discountPct,50);
 assert.equal(new URL(applied.hotmartUrl).searchParams.get('offDiscount'),'031016');
 assert.equal(applied.promo.label,'Black Friday');assert.equal(applied.promo.endsAt,bf.endsAt);assert.equal(applied.promo.deadline,true);
 // Si la ficha ya cobra eso de base (descuento fijo), la campaña solo pone su nombre: sin plazo,
 // porque al terminar el precio no cambia. Precio y enlace de la ficha quedan intactos.
 const fixed={priceUSD:25,originalPriceUSD:49.99,discountPct:50,hotmartUrl:list.hotmartUrl+'?offDiscount=031016'};
 const branded=promotedPrice(fixed,bf)!;
 assert.equal(branded.promo.deadline,false);assert.equal(branded.promo.label,'Black Friday');
 assert.deepEqual({priceUSD:branded.priceUSD,originalPriceUSD:branded.originalPriceUSD,discountPct:branded.discountPct,hotmartUrl:branded.hotmartUrl},fixed);
 // Una ficha que cobra menos que la campaña no se toca: se anunciaría un descuento menor que el real.
 assert.equal(promotedPrice({...fixed,priceUSD:20},bf),undefined);
 assert.equal(promotedPrice(list,{...bf,coupon:''}),undefined);
 assert.equal(promotedPrice({...list,hotmartUrl:'https://evil.example/'},bf),undefined);
 const during=Date.parse('2026-11-20T00:00:00Z');
 assert.equal(promotionState(bf,true,during),'live');assert.equal(promotionState(bf,false,during),'draft');
 assert.equal(promotionState({...bf,offerVerified:false},true,during),'unverified');
 assert.equal(promotionState(bf,true,Date.parse('2026-11-01T00:00:00Z')),'scheduled');
 assert.equal(promotionState(bf,true,Date.parse(bf.endsAt)),'ended');
 assert.equal(checkoutPrice('…"value":25,"USD"…'),25);assert.equal(checkoutPrice('sin precio'),undefined);
 assert.equal(compareOffer('x',49.99,50,25).ok,true);assert.equal(compareOffer('x',49.99,50,49.99).ok,false);
 assert.match(compareOffer('x',49.99,50,undefined).note,/no devolvió/);
 assert.equal(promotionLastDay(bf.endsAt),'30 de noviembre');
 assert.deepEqual(countdownParts(((2*24+3)*60+4)*60000+5000),{d:2,h:3,m:4,s:5});
});

test('la campaña se aplica según la URL: país, clave de anuncios y barra solo si rebaja algo',async()=>{
 const {scopeFromUrl,promoteCourse,announcedPromotion,verifiedPromotions,withRequestUrl,currentScope}=await import('../src/lib/promotions.ts');
 type Applied=import('../src/plugins/globos-promotions/model.ts').AppliedPromotion;
 assert.deepEqual(scopeFromUrl(new URL('https://x.test/mx/cdmx/curso-de-globoflexia/?promo=ads')),{country:'mx',course:'curso-de-globoflexia',key:'ads'});
 assert.deepEqual(scopeFromUrl(new URL('https://x.test/blog/guia/')),{country:undefined,course:undefined,key:''});
 assert.deepEqual(withRequestUrl(new URL('https://x.test/co/cursos/'),()=>currentScope()),{country:'co',course:undefined,key:''});
 assert.deepEqual(currentScope(),{});
 const row=(id:string,data:Record<string,unknown>)=>({id,data:{title:id,headline:'Oferta',startsAt:'2026-11-11T05:00:00.000Z',endsAt:'2026-12-01T05:00:00.000Z',coupon:'031016',discountPct:50,offerVerified:1,...data}});
 const promos=verifiedPromotions([row('bf',{priority:100}),row('buen-fin',{priority:120,countries:['mx'],coupon:'010775',discountPct:25}),row('borrador',{offerVerified:0,priority:999})]);
 assert.deepEqual(promos.map(p=>p.id),['bf','buen-fin']);
 const now=Date.parse('2026-11-20T00:00:00Z');
 const course=()=>({priceUSD:49.99,hotmartUrl:'https://hotm.io/x-curso-crashing'} as {priceUSD:number;originalPriceUSD?:number;hotmartUrl:string;promo?:Applied});
 const co=course();promoteCourse(co,'curso-de-globoflexia',promos,{country:'co'},now);assert.equal(co.priceUSD,25);assert.equal(co.promo?.id,'bf');
 // La campaña de México gana allí por prioridad; en la portada, sin país, no se aplica.
 const mx=course();promoteCourse(mx,'curso-de-globoflexia',promos,{country:'mx'},now);assert.equal(mx.priceUSD,37.49);assert.equal(mx.promo?.id,'buen-fin');
 const home=course();promoteCourse(home,'curso-de-globoflexia',promos,{},now);assert.equal(home.promo?.id,'bf');
 const after=course();promoteCourse(after,'curso-de-globoflexia',promos,{country:'co'},Date.parse('2026-12-01T05:00:00Z'));assert.equal(after.priceUSD,49.99);assert.equal(after.promo,undefined);
 const entries=[{id:'curso-de-globoflexia',data:co},{id:'curso-de-flores-con-globos',data:course()}];
 assert.equal(announcedPromotion(entries,{country:'co'})?.promo.id,'bf');
 assert.equal(announcedPromotion(entries,{country:'co',course:'curso-de-flores-con-globos'}),undefined);
 assert.equal(announcedPromotion([{id:'a',data:course()}],{}),undefined);
});
