const VERSION="1.6.2";
const CACHE=`himnario-${VERSION}`;
const ARCHIVOS=[
 "./","./index.html","./manifest.json",
 "./css/app.css",
 "./js/app.js","./js/db.js","./js/hymns.js","./js/bible.js","./js/router.js","./js/ui.js","./js/importers.js",
 "./pages/home.js","./pages/hymns.js","./pages/hymn.js","./pages/bible.js","./pages/settings.js","./pages/studies.js",
 "./data/himnos.json","./data/bible-rvr1960.json",
 "./assets/icons/icon-192.png","./assets/icons/icon-512.png","./assets/icons/favicon.png"
];
self.addEventListener("install",event=>{
 event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARCHIVOS)).catch(e=>console.warn("Precache incompleto",e)));
 self.skipWaiting();
});
self.addEventListener("activate",event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
 self.clients.claim();
});
self.addEventListener("fetch",event=>{
 if(event.request.method!=="GET")return;
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(r=>{
   const copy=r.clone(); caches.open(CACHE).then(c=>c.put(event.request,copy)); return r;
 })));
});
