const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
(async()=>{
 const entries=new Map(),handlers={},origin='https://game.test';let calls=0,offline=false,quota=false;
 const cache={match:async r=>entries.get(r.url)?.clone(),put:async(r,v)=>{if(quota)throw Error('quota');entries.set(r.url,v.clone());}};
 const context={Request,Response,Headers,URL,Map,setTimeout,caches:{open:async()=>cache},fetch:async()=>{calls++;if(offline)throw Error('offline');await new Promise(r=>setTimeout(r,5));return new Response('asset-'+calls);},self:{location:{origin},addEventListener:(k,fn)=>handlers[k]=fn,skipWaiting(){},clients:{claim(){}}}};
 vm.runInNewContext(fs.readFileSync('sw.js','utf8'),context);
 async function get(path){let response,work;handlers.fetch({request:new Request(origin+path),respondWith:p=>response=p,waitUntil:p=>work=p});const r=await response;await work;return r;}
 const path='/assets/hero.webp?v=hash1';await Promise.all([get(path),get(path)]);assert.equal(calls,1);
 offline=true;assert.equal((await get(path)).headers.get('x-mochi-cache'),'hit');assert.equal(calls,1);
 offline=false;await get('/assets/hero.webp?v=hash2');assert.equal(calls,2);offline=true;await get(path);assert.equal(calls,2);
 offline=false;quota=true;assert.equal((await get('/assets/full.webp?v=1')).status,200);
 const src=fs.readFileSync('game.js','utf8'),start=src.indexOf('  preloadAll('),end=src.indexOf('  // v6.49.6',start),body=src.slice(start,end);
 assert(!body.includes('dl(ASSET_IMAGES[k])'));assert(!body.includes('this.fillAssetCache()'));assert(src.includes('function downloadAllAssets(done){ done(); }'));
 console.log('Asset cache: persistent repeat/offline hits, changed hashes, concurrent deduplication, quota fallback and no startup bulk sweep passed');
})().catch(e=>{console.error(e);process.exitCode=1;});
