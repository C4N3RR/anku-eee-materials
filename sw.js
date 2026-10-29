const CACHE_NAME = 'anku-eee-shell-v25';
const PRECACHE_URLS = [
  './',
  './index.html',
  './404.html',
  './privacy.html',
  './site.webmanifest',
  './portal-admin.css?v=20261030-timetable8',
  './portal-admin.js?v=20261030-timetable8',
  './portal-config.js',
  './portal-security.js?v=20261030-timetable8',
  './app.js?v=20261030-timetable8',
  './theme-init.js',
  './analytics-init.js',
  './privacy-controls.js',
  './not-found-controls.js',
  './assets/vendor/tailwind.css',
  './assets/vendor/lucide.min.js',
  './favicon.svg',
  './assets/ankara-uni-logo.png',
  './assets/android-chrome-192x192.png',
  './assets/android-chrome-512x512.png',
  './assets/apple-touch-icon.png',
  './assets/link-icons/ptable.png',
  './assets/link-icons/eee-ankara.png',
  './assets/link-icons/wolframalpha.png',
  './assets/link-icons/youtube.png',
  './assets/link-icons/phet.png',
  './assets/link-icons/tdk.png',
  './assets/link-icons/lamar.png',
  './assets/link-icons/tuba.png',
  './assets/link-icons/dildernegi.png',
  './assets/link-icons/millikutuphane.png',
  './assets/link-icons/turkoloji.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key.startsWith('anku-eee-shell-') && key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never intercept Google Drive API or analytics requests
  if (
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('googletagmanager.com') ||
    url.hostname.includes('google-analytics.com')
  ) {
    return;
  }

  // Network-first for HTML navigation so git pushes show up immediately when online
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then((response) => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('./index.html')))
    );
    return;
  }

  // Stale-while-revalidate for same-origin static assets (logos, banners, icons)
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request)
          .then((response) => {
            if (response && response.status === 200) {
              const copy = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, copy)).catch(() => {});
            }
            return response;
          })
          .catch(() => cached);
        return cached || networkFetch;
      })
    );
  }
});
