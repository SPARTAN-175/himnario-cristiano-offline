const CACHE = "himnario-v1";

const archivos = [

    "./",

    "./index.html",

    "./css/reset.css",

    "./css/variables.css",

    "./css/layout.css",

    "./css/components.css",

    "./css/pages.css",

    "./js/app.js",

    "./js/router.js"

];

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE)

            .then(cache => cache.addAll(archivos))

    );

});

self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)

            .then(respuesta => {

                return respuesta || fetch(event.request);

            })

    );

});
