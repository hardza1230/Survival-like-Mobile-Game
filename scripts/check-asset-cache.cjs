// Real browser/SW cache lifecycle only, no game or combat simulation.
const {chromium}=require('playwright'),http=require('node:http'),fs=require('node:fs'),assert=require('node:assert/strict');
(async()=>{let downloads=0;const server=http.createServer((req,res)=>{
 if(req.url.startsWith('/assets/')){downloads++;res.setHeader('Content-Type','text/plain');return res.end('painted-asset');}
 if(req.url==='/sw.js'){res.setHeader('Content-Type','application/javascript');return res.end(fs.readFileSync('sw.js'));}
 res.setHeader('Content-Type','text/html');res.end('<!doctype html><title>Cache lifecycle</title>');
});await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;let browser;
try{browser=await chromium.launch({channel:process.env.FORGE_BROWSER_CHANNEL||undefined,headless:true});const context=await browser.newContext(),page=await context.newPage();await page.goto(base);
await page.evaluate(async()=>{await navigator.serviceWorker.register('/sw.js');await navigator.serviceWorker.ready;if(!navigator.serviceWorker.controller)await new Promise(r=>navigator.serviceWorker.addEventListener('controllerchange',r,{once:true}));});
await page.evaluate(async()=>{await Promise.all([fetch('/assets/picture.webp?v=one'),fetch('/assets/picture.webp?v=one')]);});assert.equal(downloads,1);
await page.reload();await page.evaluate(()=>fetch('/assets/picture.webp?v=one'));assert.equal(downloads,1,'second launch reads local cache');
await context.setOffline(true);assert.equal(await page.evaluate(async()=>await(await fetch('/assets/picture.webp?v=one')).text()),'painted-asset');assert.equal(downloads,1);
await context.setOffline(false);await page.evaluate(()=>fetch('/assets/picture.webp?v=two'));assert.equal(downloads,2,'changed asset downloads once');
console.log('Browser cache passed: first download, simultaneous requests, reload without asset network, offline reuse and new hash update');
}finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
