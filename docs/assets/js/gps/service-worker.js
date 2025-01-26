const CACHE_NAME = 'gps-mapper-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet.heat/0.2.0/leaflet-heat.js',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.js',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.Default.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js'
];

// self.addEventListener('install', event => {
//     event.waitUntil(
//         caches.open(CACHE_NAME)
//             .then(cache => cache.addAll(ASSETS_TO_CACHE))
//     );
// });
// self.addEventListener('install', event => {
//     self.skipWaiting(); // Activate service worker immediately
//     event.waitUntil(
//         caches.open(CACHE_NAME)
//             .then(cache => cache.addAll(ASSETS_TO_CACHE))
//     );
// });
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(ASSETS_TO_CACHE)
                    .catch(error => {
                        console.error('Caching failed:', error);
                    });
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Take control of all pages immediately
    );
});

// self.addEventListener('fetch', event => {
//     event.respondWith(
//         caches.match(event.request)
//             .then(response => {
//                 return response || fetch(event.request);
//             })
//     );
// });
// self.addEventListener('fetch', event => {
//     event.respondWith(
//         caches.match(event.request)
//             .then(response => {
//                 // Network-first strategy for dynamic resources
//                 return fetch(event.request)
//                     .catch(() => response || caches.match('/index.html'))
//             })
//     );
// });
// self.addEventListener('fetch', event => {
//     event.respondWith(
//         caches.match(event.request)
//             .then(cachedResponse => {
//                 // Network-first strategy
//                 return fetch(event.request)
//                     .catch(() => cachedResponse || caches.match('/index.html'))
//             })
//     );
// });
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request)
                    .catch(() => caches.match('/index.html'));
            })
    );
});
