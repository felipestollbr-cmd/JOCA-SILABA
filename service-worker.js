// Service Worker para Sílaba Aventura com o Joca
// Permite funcionar offline e cachear recursos

const CACHE_NAME = 'joca-v1.0.2';
const RUNTIME_CACHE = 'joca-runtime';

// URLs a serem cacheadas na instalação
const urlsToCache = [
  '/',
  '/index.html',
  '/gameClient.js',
  '/world-data.js',
  '/joca-character.svg',
  '/manifest.json',
  '/service-worker.js'
];

// ========================================
// INSTALAÇÃO DO SERVICE WORKER
// ========================================
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Cacheando arquivos principais...');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker instalado!');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('❌ Erro ao cachear:', err);
      })
  );
});

// ========================================
// ATIVAÇÃO DO SERVICE WORKER
// ========================================
self.addEventListener('activate', event => {
  console.log('🚀 Service Worker: Ativando...');
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // Remover caches antigos
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log(`🗑️  Removendo cache antigo: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker ativado!');
      return self.clients.claim();
    })
  );
});

// ========================================
// INTERCEPTAÇÃO DE REQUISIÇÕES
// ========================================
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // NÃO cachear requisições ao backend (3001)
  if (url.port === '3001' || url.hostname === 'localhost:3001') {
    event.respondWith(fetch(request));
    return;
  }

  // Estratégia: Cache First para HTML/CSS/JS/Imagens
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request)
        .then(response => {
          // Se encontrou no cache, retorna
          if (response) {
            console.log(`📦 Cache hit: ${request.url}`);
            return response;
          }

          // Se não achou no cache, tenta rede
          return fetch(request)
            .then(response => {
              // Cachear resposta bem-sucedida
              if (!response || response.status !== 200 || response.type === 'error') {
                return response;
              }

              // Clone a resposta
              const responseToCache = response.clone();

              // Cachear em runtime cache
              caches.open(RUNTIME_CACHE)
                .then(cache => {
                  cache.put(request, responseToCache);
                });

              return response;
            })
            .catch(() => {
              // Se estiver offline e não tiver no cache
              console.warn(`📶 Offline: ${request.url}`);
              
              // Retornar página offline customizada
              if (request.headers.get('accept').includes('text/html')) {
                return caches.match('/index.html');
              }
              
              return new Response(
                'Sem conexão com a internet. Abra o jogo novamente quando tiver conexão.',
                { status: 503, statusText: 'Service Unavailable' }
              );
            });
        })
    );
  } else {
    // Para requisições não-GET, apenas fazer fetch
    event.respondWith(fetch(request));
  }
});

// ========================================
// SINCRONIZAÇÃO EM BACKGROUND (Opcional)
// ========================================
self.addEventListener('sync', event => {
  if (event.tag === 'sync-game-progress') {
    event.waitUntil(
      // Sincronizar progresso do jogo quando voltar online
      syncGameProgress()
    );
  }
});

async function syncGameProgress() {
  try {
    console.log('📤 Sincronizando progresso do jogo...');
    // Implementar sincronização aqui
  } catch (error) {
    console.error('❌ Erro ao sincronizar:', error);
    throw error;
  }
}

// ========================================
// NOTIFICAÇÕES PUSH (Opcional)
// ========================================
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: 'icon-192.png',
      badge: 'icon-192.png',
      tag: 'joca-notification'
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || 'Sílaba Aventura com o Joca',
        options
      )
    );
  }
});

// ========================================
// LOG
// ========================================
console.log('%c🎮 Sílaba Aventura com o Joca', 'font-size: 20px; color: #5c94fc; font-weight: bold;');
console.log('%cService Worker carregado com sucesso!', 'color: #2ECC71; font-size: 14px;');
