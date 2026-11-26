// Loading DOM and recovery controls only; no combat simulation or visual screenshots.
const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict'),{chromium}=require('playwright');
(async()=>{
 const source=fs.readFileSync('index.html','utf8'),style=source.slice(source.indexOf('<style>'),source.indexOf('</style>')+8),a=source.indexOf('  window.GameLoader = {'),script=source.slice(a,source.indexOf('\n  };',a)+5),b=source.indexOf('<div id="game-loader"'),dom=source.slice(b,source.indexOf('<div id="err-box"',b));
 const gameSource=fs.readFileSync('game.js','utf8'),methodAt=gameSource.indexOf('\n  ensureGroup('),methodNext=gameSource.indexOf('\n  buildDeferredAnims(',methodAt),groupMethod=gameSource.slice(methodAt+1,methodNext);
 const fixture='<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+style+dom+'<div id="probe-game" style="position:fixed;left:-9999px;width:2px;height:2px"></div><script src="/phaser.min.js"></script><script>'+script+';window.probeGroup=({'+groupMethod+'}).ensureGroup;const ASSET_IMAGES={picture:"assets/art/entry/transition836.webp?probe=1",missing:"assets/missing.webp"},ASSET_SHEETS={},ASSET_FX={},STAGE_SHEET_KEYS=new Set();function deferredImage(){return false;}function verUrl(u){return u;}</script>';
 const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://localhost');if(u.pathname==='/phaser.min.js'){res.setHeader('Content-Type','application/javascript');res.end(fs.readFileSync('phaser.min.js'));return;}if(u.pathname==='/'){res.setHeader('Content-Type','text/html');res.end(fixture);return;}const file=path.resolve('.'+u.pathname);if(!file.startsWith(path.resolve('assets')+path.sep)||!fs.existsSync(file)){res.statusCode=404;res.end();return;}res.setHeader('Content-Type','image/webp');if(u.searchParams.has('probe'))setTimeout(()=>res.end(fs.readFileSync(file)),400);else res.end(fs.readFileSync(file));});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));let browser;
 try{
  browser=await chromium.launch({headless:true,channel:process.env.FORGE_BROWSER_CHANNEL||undefined});const page=await browser.newPage({viewport:{width:393,height:852}});await page.goto('http://127.0.0.1:'+server.address().port);
  await page.evaluate(()=>{const L=window.GameLoader;L._introDone=true;L.stageCover('assets/art/entry/transition836.webp','The Sour Ant Nest');L.show('Preparing stage artwork…',0);L.stageProgress(3,10,'Preparing stage artwork…');});
  assert.equal(await page.locator('#load-percent').textContent(),'3 / 10 artwork · 30%');
  const positions=await page.evaluate(async()=>{const el=document.getElementById('load-portal'),image=new Image();image.src='assets/art/entry/transition836.webp';await image.decode();const animation=el.getAnimations()[0];animation.pause();const p=[];for(let i=0;i<12;i++){animation.currentTime=i*120+20;p.push(getComputedStyle(el).backgroundPosition);}return p;});
  assert.equal(new Set(positions).size,12,'all twelve sprite cells animate');
  await page.evaluate(()=>{window.retries=0;window.backs=0;window.GameLoader.error('Artwork is still loading.',()=>{window.retries++;window.GameLoader.show('Trying again…',.1);},()=>{window.backs++;window.GameLoader.hide();});});
  await page.locator('#load-retry').click();assert.equal(await page.evaluate(()=>window.retries),1);assert.equal(await page.locator('#game-loader').evaluate(e=>e.classList.contains('load-error')),false);
  await page.setViewportSize({width:360,height:640});await page.evaluate(()=>window.GameLoader.error('Please try again.',()=>{},()=>{window.backs++;window.GameLoader.hide();}));
  for(const id of ['load-retry','load-back']){const box=await page.locator('#'+id).boundingBox();assert(box&&box.width>=44&&box.height>=44&&box.x>=0&&box.y>=0&&box.y+box.height<=640,'recovery control fits a small phone');}
  await page.locator('#load-back').click();await page.waitForFunction(()=>document.getElementById('game-loader').style.opacity==='0');assert.equal(await page.evaluate(()=>window.backs),1);
  await page.emulateMedia({reducedMotion:'reduce'});await page.evaluate(()=>{window.GameLoader.stageCover('assets/art/entry/transition836.webp','Stage');window.GameLoader.show('Preparing…',.5);});assert.equal(await page.locator('#load-portal').evaluate(e=>getComputedStyle(e).animationName),'none');
  await page.evaluate(()=>{window.probeDone=0;window.probeErrors=[];window.probeGame=new Phaser.Game({type:Phaser.CANVAS,width:8,height:8,parent:'probe-game',audio:{noAudio:true},banner:false,scene:{create(){window.probeScene=this;this.ensureGroup=window.probeGroup;this.prioritizeLoad=()=>{};this.buildDeferredAnims=()=>{};this.texSafeRemove=k=>{if(this.textures.exists(k))this.textures.remove(k);};this.textures.createCanvas('picture',8,8);this.ensureGroup(k=>k==='picture',()=>window.probeDone++,{all:true,strict:true,onError:(keys,reason)=>window.probeErrors.push({keys,reason})});}}});});
  await page.waitForFunction(()=>!!window.probeScene);assert.equal(await page.evaluate(()=>window.probeDone),0,'placeholder and pending real HTTP image cannot complete readiness');
  await page.waitForFunction(()=>window.probeDone===1);assert(await page.evaluate(()=>!(window.probeScene.textures.get('picture').getSourceImage() instanceof HTMLCanvasElement)),'real Phaser texture replaces placeholder');
  await page.evaluate(()=>window.probeScene.ensureGroup(k=>k==='missing',()=>window.probeDone++,{all:true,strict:true,onError:(keys,reason)=>window.probeErrors.push({keys,reason})}));await page.waitForFunction(()=>window.probeErrors.length===1);assert.equal(await page.evaluate(()=>window.probeDone),1,'repeated real HTTP 404 cannot report ready');assert.equal(await page.evaluate(()=>window.probeErrors[0].reason),'request_failed');await page.evaluate(()=>window.probeGame.destroy(true));
  const fitCode=gameSource.slice(gameSource.indexOf('const MAX_CANVAS_PX='),gameSource.indexOf('const _vs0='));
  const touch=await browser.newPage({viewport:{width:393,height:852},hasTouch:true,isMobile:true});
  await touch.goto('http://127.0.0.1:'+server.address().port);
  for(const [width,height,fit] of [[393,852,false],[800,1280,false],[640,640,true],[852,393,true],[393,852,false]]){
   await touch.setViewportSize({width,height});
   const result=await touch.evaluate(code=>{
    const view=new Function('const RENDER_BASE_DPR=1.5,DESKTOP_FIT=false;'+code+';return applyCanvasFit();')();
    const canvas=document.querySelector('canvas')||document.body.appendChild(document.createElement('canvas'));
    const rect=canvas.getBoundingClientRect(),loader=document.getElementById('game-loader').getBoundingClientRect();
    return {view,canvasWidth:rect.width,canvasX:rect.x,loaderWidth:loader.width,loaderX:loader.x};
   },fitCode);
   assert.equal(result.view.fit,fit);
   assert(result.view.w<result.view.h,'game layout stays portrait on wide touch windows too');
   assert(Math.abs(result.canvasWidth-result.loaderWidth)<1&&Math.abs(result.canvasX-result.loaderX)<1,'canvas and loading screen share the same frame');
   assert(Math.abs(result.canvasWidth-result.view.w)<1,'displayed canvas matches game layout width');
  }
  await touch.close();
  console.log('Stage loading browser UI: twelve real atlas frames, progress, retry/back, small-phone controls, reduced motion and real Phaser delayed/404 texture loading passed');
 }finally{await browser?.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
