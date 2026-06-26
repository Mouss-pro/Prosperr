const CACHE = 'prospectpro-v1';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(!url.protocol.startsWith('http'))return;
  e.respondWith(caches.open(CACHE).then(cache=>cache.match(e.request).then(cached=>{
    const net=fetch(e.request).then(res=>{
      if(res&&res.status===200&&res.type!=='opaque')cache.put(e.request,res.clone());
      return res;
    }).catch(()=>cached);
    return cached||net;
  })));
});