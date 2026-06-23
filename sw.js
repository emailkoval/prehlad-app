const CACHE = 'prehlad-v3';
const BASE = '/prehlad-app/';
const ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'icon-48.png',
  BASE + 'icon-72.png',
  BASE + 'icon-96.png',
  BASE + 'icon-144.png',
  BASE + 'icon-192.png',
  BASE + 'icon-512.png'
];

// Predinštaluj do cache
self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); })
  );
  self.skipWaiting();
});

// Vymaž staré cache
self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; })
            .map(function(k){ return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

// Network-first: vždy skús sieť, padni späť na cache
self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if(!url.pathname.startsWith(BASE)) return;

  e.respondWith(
    fetch(e.request).then(function(res){
      // Aktualizuj cache čerstvou verziou
      if(res && res.status === 200){
        var clone = res.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
      }
      return res;
    }).catch(function(){
      // Offline – vráť z cache, pri navigácii vráť index.html
      return caches.match(e.request).then(function(cached){
        return cached || caches.match(BASE + 'index.html');
      });
    })
  );
});
