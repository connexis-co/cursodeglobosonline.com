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
const promo:Promotion={id:'test',headline:'Oferta',startsAt:'2026-10-02T00:00:00Z',endsAt:'2026-10-03T00:00:00Z',priority:1,countries:['co'],courses:['curso-de-globoflexia'],excludedCourses:[],urlKey:'',coupon:'ABC',checkoutUrl:'https://pay.hotmart.com/X?ref=affiliate',buttonLabel:'Ver',discountPct:10,theme:'brand'};
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
