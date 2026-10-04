/** Queue events immediately; load vendors after the initial paint or the first interaction.
 * No bot detection, lost consent state, or synthetic page views. Existing tag IDs stay intact.
 */
export function trackingScript(ids:{gtm:string;ga4:string;meta:string}):string {
 const config={gtm:/^GTM-[A-Z0-9]+$/.test(ids.gtm)?ids.gtm:'',
  ga4:/^G-[A-Z0-9]+$/.test(ids.ga4)?ids.ga4:'',meta:/^\d+$/.test(ids.meta)?ids.meta:''};
 return `(()=>{
 if(window.__globosTracking)return;window.__globosTracking=true;
 const ids=${JSON.stringify(config)};let started=false;
 window.dataLayer=window.dataLayer||[];
 if(ids.gtm)window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});
 if(ids.ga4){window.gtag=window.gtag||function(){window.dataLayer.push(arguments)};window.gtag('js',new Date());window.gtag('config',ids.ga4);}
 if(ids.meta&&!window.fbq){const f=window.fbq=function(){f.callMethod?f.callMethod.apply(f,arguments):f.queue.push(arguments)};window._fbq=f;f.push=f;f.loaded=true;f.version='2.0';f.queue=[];f('init',ids.meta);f('track','PageView');}
 const events=['pointerdown','keydown','touchstart'];
 const add=src=>{const s=document.createElement('script');s.async=true;s.fetchPriority='low';s.src=src;document.head.appendChild(s)};
 function start(){if(started)return;started=true;events.forEach(e=>removeEventListener(e,start,true));
  if(ids.gtm)add('https://www.googletagmanager.com/gtm.js?id='+ids.gtm);
  if(ids.ga4)add('https://www.googletagmanager.com/gtag/js?id='+ids.ga4);
  if(ids.meta)add('https://connect.facebook.net/en_US/fbevents.js');
 }
 events.forEach(e=>addEventListener(e,start,{once:true,capture:true,passive:true}));
 addEventListener('pagehide',start,{once:true});
 const idle=()=>requestAnimationFrame(()=>requestAnimationFrame(()=>{
  if('requestIdleCallback' in window)requestIdleCallback(start,{timeout:1200});else setTimeout(start,0);
 }));
 if(document.readyState==='complete')idle();else addEventListener('load',idle,{once:true});
})();`;
}
