const C = "shay-health-v3";
self.addEventListener("install", e => e.waitUntil(caches.open(C).then(c => c.addAll(["./", "v4.html", "manifest.json"]))));
self.addEventListener("fetch", e => e.respondWith(fetch(e.request).catch(() => caches.match(e.request, { ignoreSearch: true }))));
