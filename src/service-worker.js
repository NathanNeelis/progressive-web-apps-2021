const CORE_CACHE_VERSION = 'v1'
const CORE_CACHE_NAME = 'fam-cache' + CORE_CACHE_VERSION;
const CORE_ASSETS = [
    '/offline',
    '/css/style.css',
    '/connection-error.svg',
    '/js/index.js',
    // '/manifest.json',
];

self.addEventListener('install', (event) => {
    console.log('install the service worker');

    // pre saves the offline page in the cache
    event.waitUntil(
        caches.open(CORE_CACHE_NAME).then((cache) => {
            return cache.addAll(CORE_ASSETS)
                .then(() => self.skipWaiting());
        })
    );
});

self.addEventListener('activate', (event) => {
    console.log('activate');
    event.waitUntil(
        caches.keys() // RESOURCE https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage // https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/keys
        .then((keylist) => {
            return Promise.all([
                keylist
                .filter(cacheKey => cacheKey.includes('fam-cache') && cacheKey !== CORE_CACHE_NAME)
                .forEach(outdatedCache => caches.delete(outdatedCache))
            ])
        })
    )
});

self.addEventListener('fetch', (event) => {
    // do crazy cool things

    if (event.request.method === 'GET' && CORE_ASSETS.includes(getPathName(event.request.url))) {
        // cache only strategy --> CSS / JS / etc..
        event.respondWith(
            caches.open(CORE_CACHE_NAME)
            .then(cache => cache.match(event.request.url))
        )
    }

    // html get request
    if (htmlGetRequest(event.request)) {
        event.respondWith(
            caches.open('html-cache')
            .then(cache => cache.match(event.request))
            .then(response => response ?
                response :
                fetchAndCache(event.request, 'html-cache'))
            .catch(() => {
                return caches.open(CORE_CACHE_NAME)
                    .then(cache => cache.match('/offline'))
            })
        )

        event.waitUntil(
            fetchAndCache(event.request, 'html-cache')
        )
    }
})

function fetchAndCache(request, cacheName) {
    // adds each visited page to cache
    return fetch(request)
        .then(response => {
            const clone = response.clone()
            caches.open(cacheName)
                .then(cache => cache.put(request, clone))
            return response
        })
}
// Checks if the request is a GET and a HTML request
function htmlGetRequest(request) {
    return request.method === 'GET' && (request.headers.get('accept') !== null && request.headers.get('accept').indexOf('text/html') > -1)
}

function getPathName(requestUrl) {
    const url = new URL(requestUrl);
    // console.log('url pathname is ', url.pathname)
    return url.pathname;
}