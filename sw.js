/* Service worker: aplicația funcționează și fără internet. Datele nu trec pe aici. */
const V='jm-v2';
const CORE=['./','index.html','manifest.webmanifest','icon.svg','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.origin!==location.origin){ /* fonturi: din rețea, cu rezervă din cache */
    if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){e.respondWith(caches.open(V).then(c=>fetch(r).then(x=>{c.put(r,x.clone());return x}).catch(()=>c.match(r))))}
    return}
  /* rețea întâi pentru pagină, ca actualizările să ajungă; cache dacă nu e internet */
  e.respondWith(fetch(r).then(x=>{const cp=x.clone();caches.open(V).then(c=>c.put(r,cp));return x}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))))});
