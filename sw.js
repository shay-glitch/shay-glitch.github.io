const C = "shay-health-v4";
self.addEventListener("install", e => e.waitUntil(caches.open(C).then(c => c.addAll(["./", "index.html", "manifest.json"]))));
self.addEventListener("fetch", e => e.respondWith(fetch(e.request).catch(() => caches.match(e.request, { ignoreSearch: true }))));
