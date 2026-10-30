const VERSIONE="2026-10-30-1843";
const C="osm-"+VERSIONE;

self.addEventListener("install",e=>{
  self.skipWaiting();
  e.waitUntil(
    caches.open(C).then(c=>Promise.all(
      ["./","manifest.json","icon-192.png"].map(u=>c.add(u).catch(()=>{}))
    )).catch(()=>{})
  );
});

self.addEventListener("message",e=>{ if(e.data==="aggiornati")self.skipWaiting(); });

self.addEventListener("activate",e=>{
  e.waitUntil(
    caches.keys()
      .then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k))))
      .catch(()=>{})
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",e=>{
  const req=e.request;
  if(req.method!=="GET")return;
  let url;
  try{url=new URL(req.url);}catch(err){return;}
  if(url.origin!==self.location.origin)return;
  // Il file di versione non si mette MAI in cache: e' lui che segnala le novita'.
  if(url.pathname.indexOf("versione.json")>=0)return;
  e.respondWith(
    fetch(req).then(res=>{
      if(res&&res.ok){
        const copy=res.clone();
        caches.open(C).then(c=>c.put(req,copy)).catch(()=>{});
      }
      return res;
    }).catch(()=>
      caches.match(req).then(r=>r||caches.match("./"))
    )
  );
});
