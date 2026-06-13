/* Flow — Time-Dilated Budget · offline service worker */
const CACHE = "flow-tdbs-v13";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) => (k === CACHE ? null : caches.delete(k)))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Cache the Chart.js library (CDN) so the Charts screen works offline after the first load.
  if (url.origin !== location.origin) {
    if (url.hostname === "cdn.jsdelivr.net") {
      e.respondWith(caches.match(req).then((c) => c || fetch(req).then((res) => {
        if (res && res.ok) { const cp = res.clone(); caches.open(CACHE).then((ch) => ch.put(req, cp)); }
        return res;
      })));
    }
    // Other cross-origin (e.g. ExchangeRate-API, Google Drive) go straight to the network;
    // the app caches rates in localStorage and degrades gracefully when offline.
    return;
  }

  // Cache-first for the app shell, refreshing the cache in the background; fall back to the
  // cached index.html for navigations when fully offline.
  e.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => cached || caches.match("./index.html"));
      return cached || network;
    })
  );
});
