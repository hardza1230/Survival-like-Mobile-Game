// Mochi Mayhem service worker (v6.46) — เก็บไฟล์ภาพ/เสียงไว้ในเครื่อง
// assets/*?v=<hash> = cache-first (URL เปลี่ยนเมื่อไฟล์เปลี่ยน) · หน้า/โค้ดเกม = network-first (live update ยังทำงาน)
const CACHE='mochi-assets-v1';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET')return;
  const url=new URL(req.url); if(url.origin!==self.location.origin)return;
  const isAsset=(/\/assets\//.test(url.pathname)&&url.searchParams.has('v'));
  if(!isAsset)return; // ปล่อยให้เบราว์เซอร์จัดการเอง (network)
  e.respondWith(caches.open(CACHE).then(async c=>{
    const hit=await c.match(req); if(hit)return hit;
    const res=await fetch(req);
    if(res&&res.ok&&res.status===200){ c.put(req,res.clone()).catch(()=>{});
      // ลบเวอร์ชันเก่าของไฟล์เดียวกัน (hash ต่างกัน)
      c.keys().then(ks=>ks.forEach(k=>{const u=new URL(k.url);if(u.pathname===url.pathname&&u.search!==url.search)c.delete(k);})).catch(()=>{}); }
    return res;
  }));
});
