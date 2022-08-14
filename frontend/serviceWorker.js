const endlessWordle = "endless-wordle-v1";

const assets = [
    "/",
    "/index.html",
    "/index.css",
    "/index.js",
    "/assets/wordle_logo/wordle_logo_16x16.png",
    "/assets/wordle_logo/wordle_logo_32x32.png",
    "/assets/wordle_logo/wordle_logo_120x120.png",
    "/assets/wordle_logo/wordle_logo_150x150.png",
    "/assets/wordle_logo/wordle_logo_180x180.png",
    "/assets/wordle_logo/wordle_logo_192x192.png",
    "/assets/wordle_logo/wordle_logo_512x512.png",

];

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(endlessWordle).then(cache => {
            cache.addAll(assets);
        })
    );
});

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})