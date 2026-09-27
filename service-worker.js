const VERSION = "1.6.1";
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
    "./js/database.js",
    "./js/database-hymns.js",

    "./pages/home.js",
    "./pages/hymns.js",
    "./pages/hymn.js",
    "./pages/splash.js",
    "./pages/settings.js",
    "./pages/favorites.js",

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
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => key !== CACHE ? caches.delete(key) : null)
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            return cached || fetch(event.request).then(response => {
                const copy = response.clone();
                caches.open(CACHE).then(cache => cache.put(event.request, copy));
                return response;
            });
        })
    );
});
