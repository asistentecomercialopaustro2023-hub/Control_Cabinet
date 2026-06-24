const CACHE_NAME = "ice-control-cabinets-v1";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./outputs/control-cabinets-v3.html",
  "./outputs/html5-qrcode.min.js",
  "./recursos/pinguino.png",
  "./recursos/ice-192.png",
  "./recursos/ice-512.png",
  "./recursos/calendario.png",
  "./recursos/ubicacion.png",
  "./recursos/rol.png",
  "./recursos/usuario.png",
  "./recursos/contraseña.png",
  "./recursos/escanear.png",
  "./recursos/resumen.png",
  "./recursos/inventario.png",
  "./recursos/reporte.png"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then(response => response || caches.match("./outputs/control-cabinets-v3.html")))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      return response;
    }))
  );
});
