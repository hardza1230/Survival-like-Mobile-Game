const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict'),{chromium}=require('playwright');
(async()=>{
 const server=http.createServer((q,r)=>{try{r.end(fs.readFileSync(path.join(process.cwd(),'www',new URL(q.url,'http://local').pathname)));}catch{r.statusCode=404;r.end();}});
 await new Promise(r=>server.listen(8098,'127.0.0.1',r));let browser;
 try{browser=await chromium.launch({channel:process.platform==='win32'?'chrome':undefined,headless:true});
 for(const [w,h] of [[320,568],[360,780],[412,915],[844,390]]){
  const page=await browser.newPage({viewport:{width:w,height:h}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(`http://127.0.0.1:8098/combat-hud-review.html?w=${w}&h=${h}`);await page.waitForFunction(()=>document.querySelector('#status').textContent==='Ready');
  const check=()=>page.evaluate(()=>{const s=window.hudReview,keys=['lvlTxt','killTxt','runSugarTxt','timeTxt','waveObjTxt','waveBonusTxt','bossName','bossHpTxt'],r=[];
   for(const k of keys){const t=s[k];if(!t.visible||!t.text)continue;const b=t.getBounds();r.push({key:k,text:t.text,x:b.x,y:b.y,right:b.right,bottom:b.bottom});}return r;});
  function validate(rows){for(const r of rows)assert(r.x>=0&&r.right<=w+.5&&r.y>=0&&r.bottom<=h+.5,JSON.stringify(r));for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){const a=rows[i],b=rows[j];assert(a.right<=b.x||b.right<=a.x||a.bottom<=b.y||b.bottom<=a.y,'HUD text collision '+JSON.stringify([a,b]));}}
  validate(await check());
  fs.mkdirSync('docs/reviews/combat_hud',{recursive:true});await page.screenshot({path:`docs/reviews/combat_hud/${w}x${h}.png`});
  // Production renderers with changed display values; no state tick, targeting or gameplay.
  for(const kind of ['hunt','season','boss','bossMission','replay','counters']){
   await page.evaluate(kind=>{const s=window.hudReview;s.waveObjTxt.setVisible(false);s.waveBonusTxt.setVisible(false);s.bossName.setVisible(false);s.waveObjBg.setVisible(false);s.waveObjBar.setVisible(false);s.bossBgW.setVisible(false);s.bossBar.setVisible(false);s.bossHpTxt.setVisible(false);s.replayProgressFrame.setVisible(false);s.replayProgressFill.setVisible(false);s.syncSeasonIcons(null);
    if(kind==='hunt'){s.waveObjective={type:'hunt',name:'Elite Showdown',emoji:'🎯',color:0xffd166,progress:1,target:3,_huntPhase:'clear',_huntKills:20,_huntKillGoal:25};s.renderWaveObjectiveHUD();}
    if(kind==='season'){s.waveObjTxt.setText('Spring 10/12 · Next season 30s · 2/4 full').setVisible(true);s.syncSeasonIcons({type:'seasonCycle',storm:{cur:{idx:0},passed:[false,false,true,true]}});}
    if(kind==='boss'||kind==='bossMission'){s.timeTxt.setText('Boss encounter');s.bossName.setText('Sour Ant Queen').setVisible(true);s.bossBgW.setVisible(true);s.bossBar.setVisible(true);s.bossHpTxt.setText('12,000 / 15,000').setVisible(true);if(kind==='bossMission'){s.waveObjective={type:'survive',name:'Survive the Swarm',emoji:'⏳',color:0x9be36f,progress:25,target:30};s._bonus={id:'nohit',hits:0,maxHits:2,reward:'relic'};s.renderWaveObjectiveHUD();}}
    if(kind==='replay'){s.bossName.setVisible(false);s.timeTxt.setText('Survival replay');s.waveObjTxt.setText('Stage progress · 75%').setVisible(true);s.replayProgressFrame.setVisible(true);}
    if(kind==='counters'){s.lvlTxt.setText('Lv 100');s.killTxt.setText('KOs 999999');s.runSugarTxt.setText('🍬 999999');}s.drawBars();s.drawBars();},kind);validate(await check());
   if(kind==='bossMission'){const bottom=await page.evaluate(()=>window.hudReview._hudBottom);assert(bottom<=150,'Boss+mission HUD too tall: '+bottom);await page.screenshot({path:`docs/reviews/combat_hud/${w}x${h}_boss.png`});}
  }
  await page.evaluate(()=>{const s=window.hudReview;s.hudVisible(false);if(s.controlBase.visible)throw Error('control plate leaks while HUD hidden');s.hudVisible(true);s.layoutCombatHUD();});
  assert.deepEqual(errors,[]);console.log(`Static production HUD ${w}x${h}: wave/hunt/season/boss+mission/replay/large counters, compact height, text bounds, separation and hide/resume passed`);await page.close();
 }
 }finally{await browser?.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
