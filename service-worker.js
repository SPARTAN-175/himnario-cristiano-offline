/*
======================================
Proyecto : Himnario Cristiano Offline
Archivo  : service-worker.js
Versión  : v0.3.0
Build    : 006
Autor    : Carlos & ChatGPT
======================================
*/

const VERSION = "0.3.0";

const CACHE = `himnario-${VERSION}`;

const ARCHIVOS = [

    "./",

    "./index.html",

    "./manifest.json",

    "./css/reset.css",
    "./css/variables.css",
    "./css/layout.css",
    "./css/components.css",
    "./css/pages.css",

    "./js/app.js",
    "./js/router.js",
    "./js/storage.js",

    "./pages/home.js",
    "./pages/hymns.js",
    "./pages/hymn.js",

    "./data/himnos.json",

    "./assets/icons/icon-192.png",
    "./assets/icons/icon-512.png",
    "./assets/icons/favicon.png"

];

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE)

        .then(cache => cache.addAll(ARCHIVOS))

    );

    self.skipWaiting();

});

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()

        .then(keys =>

            Promise.all(

                keys.map(key=>{

                    if(key!==CACHE){

                        return caches.delete(key);

                    }

                })

            )

        )

    );

    self.clients.claim();

});

self.addEventListener("fetch",event=>{

    event.respondWith(

        caches.match(event.request)

        .then(response=>{

            return response || fetch(event.request);

        })

    );

});
