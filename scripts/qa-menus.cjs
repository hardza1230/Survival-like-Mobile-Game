// QA menu monkey (v8.1.142): opens every Lobby / Endgame / Temple / Forge / Gear screen with a fully unlocked rich save
// and taps random buttons (tap zones) on each, recording page errors + console errors per screen and the button that caused them.
// Leaves a stage run immediately if a button starts one. Bug finding only — no balance.
// Usage: node scripts/build-www.mjs && NODE_PATH=/opt/node22/lib/node_modules node scripts/qa-menus.cjs [tapsPerScreen=40] [out=qa-menus.json]
const fs=require('fs'),http=require('http'),path=require('path'),{chromium}=require('playwright');
const TAPS=+(process.argv[2]||40),OUT=process.argv[3]||'qa-menus.json';
const SCREENS=['hub','endgame','atlas','dig','upgrade','perks','skills','recipes','craft','merge','gear','gLoadout','gMore','gearInbox','tradein','bazaar','wardrobe','char','story','chapter','stage','bestiary','news','playstats','settings'];
(async()=>{
  const server=http.createServer((q,r)=>{try{const p=path.join(process.cwd(),'www',decodeURIComponent(new URL(q.url,'http://l').pathname));const f=fs.statSync(p).isDirectory()?path.join(p,'index.html'):p;r.end(fs.readFileSync(f));}catch{r.statusCode=404;r.end();}});
  await new Promise(r=>server.listen(0,r));const port=server.address().port;
  const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:390,height:844}});
  let errs=[];page.on('pageerror',e=>errs.push('page: '+String(e.message).slice(0,300)));
  page.on('console',m=>{if(m.type()==='error'){const t=m.text();if(!/Failed to load resource|404/.test(t))errs.push('console: '+t.slice(0,300));}});
  await page.addInitScript(()=>{try{window.__qaBot=true;if(!sessionStorage.getItem('qa_seeded')){sessionStorage.setItem('qa_seeded','1');localStorage.clear();localStorage.setItem('mochi_gm','1');
    localStorage.setItem('mochi_save',JSON.stringify({tutorialDone:true,unlockedStage:14,character:'momo',gmUsed:true,settings:{music:0,sfx:0}}));}}catch(e){}});
  await page.goto(`http://localhost:${port}/index.html`);
  await page.waitForFunction(()=>{const s=window.__g&&window.__g.scene.getScene('Game');return s&&s.state==='menu';},null,{timeout:120000});
  // rich endgame save: everything unlocked, lots of currency, Delve 30 deep, gear in the bag
  await page.evaluate(()=>{const d=Save.data;d.tutorialDone=true;d.unlockedStage=14;d.stageMastery={};for(let i=0;i<15;i++)d.stageMastery[i]=3;
    try{Save.unlockCoreCharacters?.(false);}catch(e){} d.chars=Array.from(new Set([...(d.chars||[]),'momo','mint','cocoa','taro','yuzu','sesame']));
    Save.addSugar(500000);Save.addThreads(20000);try{for(const c of CURRENCY)Save.addCurrency(c.key,200);}catch(e){} d.rank=(d.rank||0)+20;
    try{const dv=delveSave();for(let D=1;D<=30;D++)delveRow(D).forEach(n=>{dv.clears[n.id]=1;});dv.best=30;}catch(e){}
    try{const s=window.__g.scene.getScene('Game');for(let i=0;i<12;i++)s.grantGear?.(['common','magic','rare','epic'][i%4]);}catch(e){}
    Save.save();});
  const report={date:new Date().toISOString(),version:await page.evaluate(()=>GAME_VERSION),screens:[]};
  for(const sc of SCREENS){
    errs=[];const hits=[];let taps=0,left=0;
    const opened=await page.evaluate(sc=>{const s=window.__g.scene.getScene('Game');try{if(s.state!=='menu')s.showMenu?.();s.menuScreen=sc;s.buildMenuScreen();return s.menuScreen;}catch(e){return 'ERR '+e.message;}},sc);
    if(errs.length)hits.push({tap:'(open)',errors:errs.splice(0)});
    for(let t=0;t<TAPS;t++){
      const r=await page.evaluate(sc=>{const s=window.__g.scene.getScene('Game');
        if(s.state!=='menu'){try{s.scene.restart();}catch(e){}return {left:true,state:s.state};}
        if(s.menuScreen!==sc&&Math.random()<.5){try{s.menuScreen=sc;s.buildMenuScreen();}catch(e){return {err:'reopen '+e.message};}}
        const z=(s.tapZones||[]).filter(z=>z&&z.fn&&!/reset|gm_|title_start/.test(String(z.tag||'')));if(!z.length)return {none:true};
        const pick=z[Math.floor(Math.random()*z.length)];const label=(pick.tag||'')+'@'+Math.round(pick.x)+','+Math.round(pick.y)+' on '+s.menuScreen;
        try{pick.fn();}catch(e){return {label,err:e.message};}return {label};},sc).catch(e=>({err:'eval '+e.message}));
      taps++;await page.waitForTimeout(r&&r.left?2500:250);
      if(r&&r.left){left++;await page.waitForFunction(()=>{const s=window.__g&&window.__g.scene.getScene('Game');return s&&s.state==='menu';},null,{timeout:60000}).catch(()=>{});}
      if(r&&r.err)errs.push('tap threw: '+r.err);
      if(errs.length)hits.push({tap:r&&r.label,errors:errs.splice(0)});
    }
    const row={screen:sc,opened,taps,leftToRun:left,problems:hits};report.screens.push(row);
    console.log(JSON.stringify({screen:sc,opened,taps,left,problems:hits.length,first:hits[0]||null}).slice(0,600));
    fs.writeFileSync(OUT,JSON.stringify(report,null,1));
  }
  await browser.close();server.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
