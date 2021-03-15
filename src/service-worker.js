const CORE_CACHE_VERSION = 'fam-cache-V3';
const CORE_ASSETS = [
    '/offline',
    '/css/style.css',
    '/connection-error.svg',
    '/js/index.js',
    '/manifest.json',
];

self.addEventListener('install', (event) => {
    console.log('install the service worker');

    // pre saves the offline page in the cache
    event.waitUntil(
        caches.open(CORE_CACHE_VERSION).then((cache) => {
            return cache.addAll(CORE_ASSETS)
                .then(() => self.skipWaiting());
        })
    );
});

self.addEventListener('activate', () => {
    console.log('activate');
});

self.addEventListener('fetch', (event) => {
    // do crazy cool things

    if (event.request.method === 'GET' && CORE_ASSETS.includes(getPathName(event.request.url))) {
        // if (event.request.method === 'GET' && CORE_ASSETS.includes(new URL(event.request.url).pathname)) {
        console.log('Core get request: ', event.request.url);
        // cache only strategy
        event.respondWith(
            caches.open(CORE_CACHE_VERSION)
            .then(cache => cache.match(event.request.url))
        )
    }
    // html get request
    else if (event.request.method === 'GET' && (event.request.headers.get('accept') !== null && event.request.headers.get('accept').indexOf('text/html') > -1)) {
        event.respondWith(
            fetch(event.request)
            .catch(() => {
                return caches.open(CORE_CACHE_VERSION)
                    .then(cache => cache.match('/offline'))
            })
        )
    }
})

function getPathName(requestUrl) {
    const url = new URL(requestUrl);
    console.log('url pathname is ', url.pathname)
    return url.pathname;
}