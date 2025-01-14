const CORE_CACHE_VERSION = 'v2'
const CORE_CACHE_NAME = 'fam-cache' + CORE_CACHE_VERSION;
const CORE_ASSETS = [
    '/offline',
    '/css/style.css',
    '/connection-error.svg',
    '/js/index.js',
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
    event.waitUntil(clients.claim()); // Service workers works direct instead after a reload in multiple browser tabs
    // resource https://developer.mozilla.org/en-US/docs/Web/API/Clients/claim 
    console.log('activate service worker. Removing old cache versions if needed');

    // removes old cache if version is updated
    event.waitUntil(
        caches.keys() // RESOURCE https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage // https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage/keys
        .then((keylist) => {
            return Promise.all([
                keylist
                .filter(cacheKey => cacheKey.includes('fam-cache') && cacheKey !== CORE_CACHE_NAME) // array of strings with caches that include fam-cache but are not the current version
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

    // MOVIE PAGE SPECIFIC
    else if (htmlGetRequest(event.request) && event.request.url.match('/movies')) {
        // resource targetting url by client https://github.com/w3c/ServiceWorker/issues/985#issuecomment-253755588
        // resource: https://stackoverflow.com/questions/45663796/setting-service-worker-to-exclude-certain-urls-only/45670014#45670014 

        // If there is internet, save the HTML to cache
        // If there is no internet, find the cache and open the /movies page
        event.respondWith(
            fetchAndCache(event.request, 'html-cache')
            .catch(() => {
                return caches.open('html-cache')
                    .then(cache => cache.match('/movies'))
            })
        )
    }

    // html get request
    // If the page is in the chache, open the page through the cashe for faster loading
    // Update the cache in the meanwhile, next page visits include the updates.
    else if (htmlGetRequest(event.request)) {

        event.respondWith(
            caches.open('html-cache')
            .then(cache => cache.match(event.request))
            .then(response => response ? response : fetchAndCache(event.request, 'html-cache'))
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



// HELPER FUNCTIONS ----------------
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
    return url.pathname;
}