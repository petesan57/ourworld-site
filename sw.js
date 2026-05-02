// OurWorld Service Worker v1.0
const CACHE_NAME = 'ourworld-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install: cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first, fall back to cache
self.addEventListener('fetch', event => {
  // Skip non-GET and Netlify function requests (chat API must always hit network)
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('/.netlify/functions/')) return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Cache a copy of successful responses for the main page
        if (response.ok && event.request.url.endsWith('/') || event.request.url.endsWith('index.html')) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Offline fallback — serve from cache
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // If nothing cached, return the main page (handles offline nav)
          return caches.match('/');
        });
      })
  );
});
