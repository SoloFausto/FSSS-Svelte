/* eslint-disable no-restricted-globals */
'use strict';

const VERSION = 'v1';
const STATIC_CACHE = `static-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;

const ESSENTIAL_URLS = [
  '/', // fallback for navigations
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  // Precache essentials; ignore missing files
  event.waitUntil((async () => {
    const cache = await caches.open(STATIC_CACHE);
    for (const url of ESSENTIAL_URLS) {
      try {
        await cache.add(new Request(url, { cache: 'reload' }));
      } catch (_) {
        // Ignore if the file doesn't exist in this deployment
      }
    }
  })());

  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Enable navigation preload for faster navigations
    if ('navigationPreload' in self.registration) {
      try {
        await self.registration.navigationPreload.enable();
      } catch (_) {}
    }

    // Clean up old caches
    const names = await caches.keys();
    await Promise.all(
      names.filter((n) => n !== STATIC_CACHE && n !== RUNTIME_CACHE)
           .map((n) => caches.delete(n))
    );

    await self.clients.claim();
  })());
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const req = event.request;

  if (req.method !== 'GET') return;

  // App shell navigations: network-first with cache fallback
  if (req.mode === 'navigate') {
    event.respondWith(handleNavigation(event));
    return;
  }

  // Static assets (css/js/images/fonts): cache-first
  if (isSameOrigin(req.url) && isAssetRequest(req)) {
    event.respondWith(cacheFirst(req, STATIC_CACHE));
    return;
  }

  // Other GET requests: network-first with runtime cache fallback
  event.respondWith(networkFirst(req, RUNTIME_CACHE));
});

// Helpers

function isSameOrigin(url) {
  return new URL(url, self.location.href).origin === self.location.origin;
}

function isAssetRequest(request) {
  const dest = request.destination;
  if (['style', 'script', 'image', 'font'].includes(dest)) return true;

  const { pathname } = new URL(request.url);
  return /\.(css|js|mjs|wasm|png|jpe?g|gif|svg|webp|ico|json|woff2?|ttf|otf|eot|mp3|mp4|webm|ogg)$/i.test(pathname);
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response && (response.ok || response.type === 'opaque')) {
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response && (response.ok || response.type === 'opaque')) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (_) {
    const cached = await cache.match(request);
    if (cached) return cached;
    // As a last resort, return offline shell for HTML
    if (request.headers.get('accept')?.includes('text/html')) {
      const fallback = await caches.match('/');
      if (fallback) return fallback;
    }
    throw _;
  }
}

async function handleNavigation(event) {
  try {
    const preload = 'preloadResponse' in event ? await event.preloadResponse : undefined;
    if (preload) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(event.request, preload.clone());
      return preload;
    }

    const response = await fetch(event.request);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(event.request, response.clone());
    return response;
  } catch (_) {
    const cached = await caches.match(event.request);
    if (cached) return cached;
    const shell = await caches.match('/');
    if (shell) return shell;
    return new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
  }
}