// Service Worker for MotionMap
// Caches images, audio files, and other assets for faster loading

const CACHE_NAME = 'motionmap-cache-v1';
const IMAGE_CACHE = 'motionmap-images-v1';
const AUDIO_CACHE = 'motionmap-audio-v1';

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && 
              cacheName !== IMAGE_CACHE && 
              cacheName !== AUDIO_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - smart caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome extensions and other protocols
  if (!url.protocol.startsWith('http')) return;

  // Strategy 1: Images - Cache First (fast!)
  if (request.destination === 'image' || 
      url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[Service Worker] Image from cache:', url.pathname);
            return cachedResponse;
          }

          // Not in cache - fetch and cache it
          return fetch(request).then((networkResponse) => {
            // Only cache successful responses
            if (networkResponse && networkResponse.status === 200) {
              console.log('[Service Worker] Caching new image:', url.pathname);
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Return placeholder if offline
            console.log('[Service Worker] Image failed, offline');
            return new Response('', { status: 404 });
          });
        });
      })
    );
    return;
  }

  // Strategy 2: Audio - Cache First
  if (request.destination === 'audio' || 
      url.pathname.match(/\.(mp3|wav|ogg)$/i)) {
    event.respondWith(
      caches.open(AUDIO_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[Service Worker] Audio from cache:', url.pathname);
            return cachedResponse;
          }

          return fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              console.log('[Service Worker] Caching new audio:', url.pathname);
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Strategy 3: HTML/API - Network First (always fresh content)
  if (request.destination === 'document' || 
      url.pathname.match(/\.(html|json)$/i) ||
      url.origin.includes('script.google.com')) {
    event.respondWith(
      fetch(request).then((networkResponse) => {
        // Optionally cache HTML pages
        if (request.destination === 'document') {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback to cache if offline
        return caches.match(request);
      })
    );
    return;
  }

  // Strategy 4: Everything else - Network First, fallback to cache
  event.respondWith(
    fetch(request).then((networkResponse) => {
      return networkResponse;
    }).catch(() => {
      return caches.match(request);
    })
  );
});

// Listen for messages from the app
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

console.log('[Service Worker] Loaded successfully');
