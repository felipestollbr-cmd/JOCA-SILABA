/* Service Worker do Sílaba Aventura com o Joca.
 * Cacheia somente a aplicação estática. Respostas da API externa nunca são cacheadas aqui.
 */
const CACHE_NAME = 'joca-static-v1.3.0';
const APP_SHELL = [
  '/',
  '/index.html',
  '/gameClient.js',
  '/world-data.js',
  '/joca-character.svg',
  '/combat.js',
  '/learning-content.js',
  '/manifest.json',
  '/icon-joca.svg',
  '/service-worker.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith('joca-static-') && key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET') return;
  // API Railway, fontes externas e demais recursos de outros domínios: não interceptar nem cachear.
  if (url.origin !== self.location.origin) return;
  const isAppShell = APP_SHELL.includes(url.pathname) || url.pathname === '/';
  if (!isAppShell) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached && request.mode !== 'navigate') return cached;
    try {
      const response = await fetch(request);
      if (response.ok) cache.put(request, response.clone());
      return response;
    } catch (error) {
      if (cached) return cached;
      if (request.mode === 'navigate') {
        return (await cache.match('/index.html')) ||
          new Response('Joca está offline. Conecte-se à internet e abra o jogo uma vez para guardar os mundos.', {
            status: 503, headers: {'Content-Type':'text/plain; charset=utf-8'}
          });
      }
      throw error;
    }
  })());
});
