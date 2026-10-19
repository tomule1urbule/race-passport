// Race Passport offline support.
// The app page is fetched fresh when online (so updates show up right away) and from cache when offline.
// Libraries, fonts, country shapes and town lists are cached after first use. Map tiles are not cached.
const CACHE = 'race-passport-v2';
const SHELL = ['./', './index.html', './art.js', './countries.json', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname.includes('nominatim') || url.hostname.includes('basemaps.cartocdn.com')) return; // always live
  const isPage = req.mode === 'navigate' || (url.origin === location.origin && url.pathname.endsWith('/index.html'));
  const isAppCode = url.origin === location.origin && url.pathname.endsWith('/art.js');
  if (isPage || isAppCode) {
    // network first, so a new version shows up on the next open
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(isPage ? './index.html' : req, copy)); return res; })
      .catch(() => caches.match(isPage ? './index.html' : req)));
    return;
  }
  e.respondWith(caches.match(req).then(hit => {
    const net = fetch(req).then(res => { if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; }).catch(() => hit);
    return hit || net;
  }));
});
