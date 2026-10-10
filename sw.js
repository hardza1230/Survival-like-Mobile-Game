// Mochi Mayhem service worker (v6.87.1)
// assets/*?v=<hash> = cache-first (URL เปลี่ยนเมื่อไฟล์เปลี่ยน)
// หน้า/โค้ดเกม (index.html, game.js, phaser) = network-first มี timeout → ออนไลน์ได้เวอร์ชันใหม่ทันที · เน็ตช้า/ออฟไลน์ใช้ตัวในเครื่อง
const CACHE='mochi-assets-v1', SHELL='mochi-shell-v1', SHELL_TIMEOUT=3500;
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
function isShell(url,req){ return req.mode==='navigate'||/\/(index\.html)?$/.test(url.pathname)||/\.(js|css|json|webmanifest)$/.test(url.pathname)&&!/\/assets\//.test(url.pathname); }
async function shellFetch(req){
  const u=new URL(req.url),c=await caches.open(SHELL), key=u.origin===self.location.origin?new Request(u.pathname.replace(/\/$/,'/index.html')):req;
  const net=fetch(req).then(res=>{ if(res&&(res.ok&&res.status===200||res.type==='opaque'))c.put(key,res.clone()).catch(()=>{}); return res; });
  const hit=await c.match(key);
  if(!hit)return net;
  return Promise.race([net.catch(()=>hit),new Promise(r=>setTimeout(()=>r(hit),SHELL_TIMEOUT))]);
}
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin){ if(url.hostname==='cdn.jsdelivr.net')e.respondWith(shellFetch(req)); return; }   // v6.87.1 Supabase SDK
  if(/\/assets\//.test(url.pathname)&&!url.searchParams.has('v')){ e.respondWith(shellFetch(req)); return; }   // v6.87.1 ภาพหน้าโหลด/CSS ที่ไม่มี ?v
  const isAsset=(/\/assets\//.test(url.pathname)&&url.searchParams.has('v'));
  if(!isAsset){ if(isShell(url,req))e.respondWith(shellFetch(req)); return; }
  e.respondWith(caches.open(CACHE).then(async c=>{
    const hit=await c.match(req); if(hit){ const h=new Headers(hit.headers); h.set('x-mochi-cache','hit'); return new Response(hit.body,{status:hit.status,statusText:hit.statusText,headers:h}); }
    const res=await fetch(req);
    if(res&&res.ok&&res.status===200){ c.put(req,res.clone()).catch(()=>{});
      c.keys(url.origin+url.pathname,{ignoreSearch:true}).then(ks=>ks.forEach(k=>{if(new URL(k.url).search!==url.search)c.delete(k);})).catch(()=>{}); }
    return res;
  }));
});
