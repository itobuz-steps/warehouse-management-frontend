const CACHE_NAME = 'connectionError';

// Store ALL your important files here
const FILES_TO_CACHE = [
  '../../../pages/connection-out.html',
  '../../../scss/error.scss',
  '../../api/interceptor.js',
];

// 1. Install → Cache all necessary files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// 2. Fetch → Serve from network → fallback to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      // If offline and HTML page requested → show offline page
      if (event.request.destination === 'document') {
        return caches.match('/pages/connection-out.html');
      }

      // Otherwise → try to load from cache
      return caches.match(event.request);
    })
  );
});
