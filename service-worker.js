const CACHE = "seupacotin-calculadora-v2";
const ARQUIVOS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.webmanifest",
  "./manual-instrucoes.pdf",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ARQUIVOS)));
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys().then((chaves) =>
      Promise.all(chaves.filter((chave) => chave !== CACHE).map((chave) => caches.delete(chave)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evento) => {
  if (evento.request.method !== "GET") return;
  evento.respondWith(
    caches.match(evento.request).then((resposta) =>
      resposta || fetch(evento.request).then((rede) => {
        const copia = rede.clone();
        caches.open(CACHE).then((cache) => cache.put(evento.request, copia));
        return rede;
      }).catch(() => caches.match("./index.html"))
    )
  );
});
