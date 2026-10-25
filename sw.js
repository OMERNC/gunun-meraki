// Günün Merakı — çevrimdışı önbellek, sürüm 202610252014
const CACHE = "merak-202610252014";
const CORE = ["./", "index.html", "manifest.webmanifest", "ikon-180.png", "ikon-192.png", "ikon-512.png", "manzara/dag.webp", "manzara/deniz.webp", "manzara/safak.webp", "manzara/tepeler.webp", "manzara/vadi.webp"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET" || req.url.includes("ntfy.sh") || req.url.includes("zaman=")) return;
  if(req.mode === "navigate"){
    e.respondWith(fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put("index.html", cp)); return r; }).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if(r.ok || r.type === "opaque"){ const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); }
    return r;
  })));
});
