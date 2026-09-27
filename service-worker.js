const CACHE="hco-v1.5";
const ASSETS=["./","./index.html","./manifest.json","./css/app.css","./js/app.js","./js/db.js","./js/router.js","./js/ui.js","./js/hymns.js","./js/bible.js","./js/importers.js","./pages/home.js","./pages/hymns.js","./pages/hymn.js","./pages/bible.js","./pages/settings.js","./data/hymns.json","./data/bible-catalog.json","./data/bible-rvr1960.json","./assets/icons/icon-192.png","./assets/icons/icon-512.png","./assets/icons/favicon.png"];
self.addEventListener("install",event=>{
  event.waitUntil(
    caches.open(CACHE)
      .then(cache=>cache.addAll(ASSETS))
      .then(()=>self.skipWaiting())
  );
});
self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(key=>key.startsWith("hco-")&&key!==CACHE).map(key=>caches.delete(key))))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  const req=event.request;
  const path=new URL(req.url).pathname;
  const codeFile=path.includes("/js/")||path.includes("/pages/");
  if(codeFile){
    event.respondWith(
      fetch(req).then(response=>{
        const copy=response.clone();
        caches.open(CACHE).then(cache=>cache.put(req,copy));
        return response;
      }).catch(()=>caches.match(req).then(response=>response||caches.match("./index.html")))
    );
    return;
  }
  event.respondWith(
    caches.match(req).then(response=>response||fetch(req).then(networkResponse=>{
      const copy=networkResponse.clone();
      caches.open(CACHE).then(cache=>cache.put(req,copy));
      return networkResponse;
    }).catch(()=>caches.match("./index.html")))
  );
});
