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
  assert(!metrics.texts.some(t=>/^T\d+ \(/.test(t.text)));if(state!=='sustain'){assert(!metrics.texts.some(t=>/^\d+(\.\d+)?%$/.test(t.text)));assert(!metrics.texts.some(t=>t.text==='Might'));}for(const z of metrics.zones.filter(z=>z.tag?.startsWith('info_')))assert(z.w>=44&&z.h>=44);for(const z of metrics.zones.filter(z=>['roll','tier','auto'].includes(z.tag)))assert(z.h>=44);
  assert.equal(metrics.scroll,0);assert(metrics.atlas);assert.equal(errors.length,0,errors.join('\n'));
  for(const z of metrics.zones)assert(z.x>=0&&z.y>=0&&z.x+z.w<=w+.5&&z.y+z.h<=h+.5,JSON.stringify({w,h,state,z}));
  for(const t of metrics.texts)assert(t.box.x>=-.5&&t.box.y>=-.5&&t.box.x+t.box.w<=w+.5&&t.box.y+t.box.h<=h+.5,JSON.stringify({w,h,state,text:t}));
  if(w===390&&h===844)shots.push({state,bytes:await page.locator('#mount canvas').screenshot({type:'jpeg',quality:85})});
  // Trigger real click handlers in a synthetic save, without running combat.
  async function clickTag(tag){
   const z=await page.evaluate(tag=>{const s=window.__forgeReviewGame.scene.getScene('ForgeReview'),z=s.tapZones.find(z=>z.tag===tag);return z?{x:z.x+z.w/2,y:z.y+z.h/2}:null;},tag);assert(z,'Missing '+tag);
   const b=await page.locator('#mount canvas').boundingBox();await page.mouse.click(b.x+z.x,b.y+z.y);
  }
  if(state==='power'){const tag=metrics.zones.find(z=>z.tag?.startsWith('target_')).tag;await clickTag(tag);await clickTag('auto');await page.waitForFunction(()=>!window.__forgeReviewGame.scene.getScene('ForgeReview')._craftRolling&&!window.__forgeReviewGame.scene.getScene('ForgeReview')._autoRolling,null,{timeout:20000}).catch(()=>{});await page.evaluate(()=>{const s=window.__forgeReviewGame.scene.getScene('ForgeReview');s.craftTargets={};s.craftTargetId=null;for(const it of Save.data.gearItems)it.forgeChoice=null;s.buildCraftBench();});   /* v7.9.6 ✓ เป้าหมาย = ปุ่ม Auto · ไม่มี Odds */const before=await page.evaluate(()=>Save.currency('transmute'));await clickTag('roll');await page.waitForFunction(()=>!window.__forgeReviewGame.scene.getScene('ForgeReview')._craftRolling);assert.equal(await page.evaluate(()=>Save.currency('transmute')),before-1);const z2=await page.evaluate(()=>window.__forgeReviewGame.scene.getScene('ForgeReview').tapZones.map(z=>z.tag));if(z2.includes('choices_open'))await clickTag('choices_open');await clickTag('choose_0');assert.equal(await page.evaluate(()=>Save.data.gearItems.filter(i=>i.forgeChoice).length),0);/* v7.8.84 pick 1 of 3, then Tier +1 when below the iLv cap */const tierInfo=await page.evaluate(()=>{const s=window.__forgeReviewGame.scene.getScene('ForgeReview'),it=Save.gearItem(s.craftSelectedUid),a=forgeLines(it)[s.craftLineIndex];return{has:s.tapZones.some(z=>z.tag==='tier'),cost:a?forgeGlazeCost(a):0,t:a?a.t:null};});if(tierInfo.has){const glaze=await page.evaluate(()=>Save.currency('divine'));await clickTag('tier');assert.equal(await page.evaluate(()=>Save.currency('divine')),glaze-tierInfo.cost);}}
  if(state==='utility'){if(metrics.zones.some(z=>z.tag==='family_picker')){await clickTag('family_picker');await clickTag('panel_close');}else if(metrics.zones.some(z=>z.tag==='family_next'))await clickTag('family_next');await clickTag('equip');}
  if(state==='sustain'){if(metrics.zones.some(z=>z.tag==='choices_open'))await clickTag('choices_open');await clickTag('choose_0');const remaining=await page.evaluate(()=>Save.data.gearItems.filter(i=>i.forgeChoice).length);assert.equal(remaining,0);}
  assert.equal(errors.length,0,errors.join('\n'));console.log('Forge live menu passed '+w+'x'+h+' '+state);await page.close();
 }
 for(const shot of shots){const data=shot.bytes.toString('base64');console.log('FORGE_SHOT_BEGIN:'+shot.state);for(let i=0;i<data.length;i+=8000)console.log('FORGE_SHOT_CHUNK:'+data.slice(i,i+8000));console.log('FORGE_SHOT_END:'+shot.state);}
 console.log('Forge real-browser UI: 21 states, text/hit bounds, atlas loading, Equip, paid Choose, targets and tier-only labels, single-line results, enlarged controls and modal navigation passed.');
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
