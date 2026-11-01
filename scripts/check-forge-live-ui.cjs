const fs=require('fs'),assert=require('assert/strict'),http=require('http'),path=require('path');
const {chromium}=require('playwright');
(async()=>{
 const root=path.resolve('www');
 const server=http.createServer((req,res)=>{const file=path.join(root,new URL(req.url,'http://localhost').pathname);try{const ext=path.extname(file),mime={'.html':'text/html','.js':'text/javascript','.png':'image/png','.webp':'image/webp','.ttf':'font/ttf'};res.setHeader('Content-Type',mime[ext]||'application/octet-stream');res.end(fs.readFileSync(file));}catch(e){res.statusCode=404;res.end('Not found');}});
 await new Promise(r=>server.listen(8088,'127.0.0.1',r));const browser=await chromium.launch({...(process.env.FORGE_BROWSER_CHANNEL?{channel:process.env.FORGE_BROWSER_CHANNEL}:{}),headless:true,args:['--no-sandbox']});
 const sizes=[[320,568],[360,640],[390,844],[430,932],[691,1536],[768,1024],[844,390]];
 const shots=[];try{
 for(const [w,h]of sizes)for(const state of ['power','sustain','utility']){
  const page=await browser.newPage({viewport:{width:Math.max(1000,w+40),height:Math.max(1000,h+110)}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8088/forge-review.html?w='+w+'&h='+h+'&state='+state);
  await page.waitForFunction(()=>document.getElementById('status').textContent.startsWith('Ready'),{timeout:30000});
  const metrics=await page.evaluate(()=>{const s=window.__forgeReviewGame.scene.getScene('ForgeReview'),texts=s.menu.list.filter(n=>n.type==='Text');return{scroll:s._mScrollMax,W:s.W,H:s.H,atlas:s.textures.exists('fg_ui_atlas'),zones:s.tapZones.map(z=>({x:z.x,y:z.y,w:z.w,h:z.h,tag:z.tag})),texts:texts.map(t=>({text:t.text,box:{x:t.getBounds().x,y:t.getBounds().y,w:t.getBounds().width,h:t.getBounds().height}}))};});
  assert(!metrics.texts.some(t=>/^T\d+ \(/.test(t.text)));if(state!=='sustain'){assert(!metrics.texts.some(t=>/^\d+(\.\d+)?%$/.test(t.text)));assert(!metrics.texts.some(t=>t.text==='Might'));}for(const z of metrics.zones.filter(z=>z.tag?.startsWith('info_')))assert(z.w>=44&&z.h>=44);for(const z of metrics.zones.filter(z=>/^(add|up|rm)_/.test(z.tag||'')))assert(z.h>=30);assert(!metrics.zones.some(z=>['roll','tier','auto'].includes(z.tag)),'random roll removed');
  assert.equal(metrics.scroll,0);assert(metrics.atlas);assert.equal(errors.length,0,errors.join('\n'));
  for(const z of metrics.zones)assert(z.x>=0&&z.y>=0&&z.x+z.w<=w+.5&&z.y+z.h<=h+.5,JSON.stringify({w,h,state,z}));
  for(const t of metrics.texts)assert(t.box.x>=-.5&&t.box.y>=-.5&&t.box.x+t.box.w<=w+.5&&t.box.y+t.box.h<=h+.5,JSON.stringify({w,h,state,text:t}));
  if(w===390&&h===844)shots.push({state,bytes:await page.locator('#mount canvas').screenshot({type:'jpeg',quality:85})});
  // Trigger real click handlers in a synthetic save, without running combat.
  async function clickTag(tag){
   const z=await page.evaluate(tag=>{const s=window.__forgeReviewGame.scene.getScene('ForgeReview'),z=s.tapZones.find(z=>z.tag===tag);return z?{x:z.x+z.w/2,y:z.y+z.h/2}:null;},tag);assert(z,'Missing '+tag);
   const b=await page.locator('#mount canvas').boundingBox();await page.mouse.click(b.x+z.x,b.y+z.y);await page.waitForTimeout(350);
  }
  /* v8.0.83 Simple Forge: + Add a mod → 3-card picker → buy · Upgrade ★ · double-tap Remove · one currency */
  const tags=async()=>page.evaluate(()=>window.__forgeReviewGame.scene.getScene('ForgeReview').tapZones.map(z=>z.tag));const cash=()=>page.evaluate(()=>Save.currency('transmute'));const price=()=>page.evaluate(()=>{const s=window.__forgeReviewGame.scene.getScene('ForgeReview');return forgePrice(Save.gearItem(s.craftSelectedUid));});
  assert(!metrics.texts.some(t=>/🔨|Forge Points|Glaze/.test(t.text)),'no Forge Points / Glaze text');assert(metrics.texts.some(t=>t.text==='MOD ROWS'));
  if(state==='power'){const ad=(await tags()).find(t=>t&&t.startsWith('add_'));assert(ad,'empty row offers + Add');const p0=await price(),c0=await cash();await clickTag(ad);assert.equal(await cash(),c0-p0,'v8.0.87 + Add random mod pays and adds at once');assert(!(await tags()).some(t=>t&&t.startsWith('offer_')),'no picker');
   const up=(await tags()).find(t=>t&&t.startsWith('up_'));if(up){const p1=await price(),c1=await cash();await clickTag(up);assert.equal(await cash(),c1-p1);}}
  if(state==='utility'){await clickTag('gear_browse');await clickTag('panel_close');await clickTag('equip');}
  if(state==='sustain'){assert.equal(await page.evaluate(()=>Save.data.gearItems.filter(i=>i.forgeChoice).length),0,'old pending roll refunded');const rm=(await tags()).find(t=>t&&t.startsWith('rm_'));if(rm){const c=await cash(),p1=await price();await clickTag(rm);await clickTag(rm);assert((await tags()).includes('add_'+rm.slice(3)),'removed row is empty');assert.equal(await cash(),c-p1,'remove costs the craft price');}}
  assert.equal(errors.length,0,errors.join('\n'));console.log('Forge live menu passed '+w+'x'+h+' '+state);await page.close();
 }
 for(const shot of shots){const data=shot.bytes.toString('base64');console.log('FORGE_SHOT_BEGIN:'+shot.state);for(let i=0;i<data.length;i+=8000)console.log('FORGE_SHOT_CHUNK:'+data.slice(i,i+8000));console.log('FORGE_SHOT_END:'+shot.state);}
 console.log('Forge real-browser UI: 21 states, text/hit bounds, atlas loading, Equip, Forge random add/upgrade/paid remove, enlarged controls and modal navigation passed.');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
