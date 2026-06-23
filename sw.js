const CACHE = 'prehlad-v2';
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

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(ASSETS); })
  );
  self.skipWaiting();
});

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

self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if(!url.pathname.startsWith(BASE)) return;
  e.respondWith(
    caches.open(CACHE).then(function(cache){
      return cache.match(e.request).then(function(cached){
        if(cached) return cached;
        return fetch(e.request).then(function(res){
          if(res && res.status === 200){
            cache.put(e.request, res.clone());
          }
          return res;
        }).catch(function(){
          // Ak sme offline a nenašli v cache, vráť index.html
          return cache.match(BASE + 'index.html');
        });
      });
    })
  );
});
