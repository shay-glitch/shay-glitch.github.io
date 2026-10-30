const C = "shay-health-v5";
self.addEventListener("install", e => { self.skipWaiting(); e.waitUntil(caches.open(C).then(c => c.addAll(["./", "index.html", "manifest.json", "icon-180.png", "icon-512.png"]))); });
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k === "shay-health-v4").map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => e.respondWith(fetch(e.request).catch(() => caches.match(e.request, { ignoreSearch: true }))));
self.addEventListener("notificationclick", e => { e.notification.close(); e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(cs => cs.length ? cs[0].focus() : self.clients.openWindow("./"))); });
