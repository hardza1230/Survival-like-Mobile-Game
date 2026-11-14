// QA autoplay (headless bug finding — NOT balance): boots the built www/, enables GM god+×10 dmg on a throwaway save,
// plays each story stage with a simple bot (wander, auto-pick cards, skip dialogs) and records:
// page errors, console errors, stuck states, stage result/time, FPS, JS heap and texture MB.
// Usage: node scripts/build-www.mjs && NODE_PATH=/opt/node22/lib/node_modules node scripts/qa-autoplay.cjs [stages=0-14] [maxSec=240] [out=qa-report.json]
const fs=require('fs'),http=require('http'),path=require('path'),{chromium}=require('playwright');
const arg=process.argv.slice(2),stages=[];
// Endgame targets (v8.1.142): "endgame" = one run in each Delve room type + Pinnacle · or a comma list like "d:boss,d:siege,pinnacle"
if(/^(endgame|d:|pinnacle)/.test(arg[0]||''))stages.push(...(arg[0]==='endgame'?['d:normal','d:elite','d:vault','d:shrine','d:trial','d:siege','d:boss','d:city','pinnacle']:arg[0].split(',')));
else{const range=(arg[0]||'0-14').split('-').map(Number);for(let i=range[0];i<=(range[1]??range[0]);i++)stages.push(i);}
const MAX=+(arg[1]||240),OUT=arg[2]||'qa-report.json';
const mime={'.js':'text/javascript','.html':'text/html','.webp':'image/webp','.png':'image/png','.mp3':'audio/mpeg','.json':'application/json','.css':'text/css','.wav':'audio/wav','.ogg':'audio/ogg','.woff2':'font/woff2'};
(async()=>{
  const server=http.createServer((q,r)=>{try{const p=path.join(process.cwd(),'www',decodeURIComponent(new URL(q.url,'http://l').pathname));const f=fs.statSync(p).isDirectory()?path.join(p,'index.html'):p;r.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');r.end(fs.readFileSync(f));}catch{r.statusCode=404;r.end();}});
  await new Promise(r=>server.listen(0,r));const port=server.address().port;
  const browser=await chromium.launch({args:['--enable-precise-memory-info','--autoplay-policy=no-user-gesture-required']});
  const report={version:null,date:new Date().toISOString(),stages:[]};
  try{
    for(const idx of stages){
      const page=await browser.newPage({viewport:{width:390,height:844}}),errs=[],cerr=[];
      page.on('pageerror',e=>errs.push(String(e.message).slice(0,300)));
      page.on('console',m=>{if(m.type()==='error'){const t=m.text();if(!/Failed to load resource|404/.test(t))cerr.push(t.slice(0,300));}});
      await page.addInitScript(({idx})=>{try{window.__qaBot=true;window.__qaShotWanted=true;localStorage.clear();localStorage.setItem('mochi_gm','1');
        const s={tutorialDone:true,unlockedStage:14,character:'momo',gmOpt:{god:true,dmg:true},gmUsed:true,settings:{music:0,sfx:0}};localStorage.setItem('mochi_save',JSON.stringify(s));}catch(e){}},{idx});
      const t0=Date.now();await page.goto(`http://localhost:${port}/index.html`);
      const sceneReady=await page.waitForFunction(()=>{const g=window.__g,s=g&&g.scene&&g.scene.getScene('Game');return s&&s.sys.isActive()&&s.state==='menu';},null,{timeout:120000}).then(()=>true,()=>false);
      const res={stage:idx,boot:sceneReady,bootSec:(Date.now()-t0)/1000,result:null,sec:0,states:{},stuck:[],errors:errs,consoleErrors:cerr,fpsMin:null,fpsAvg:null,heapMaxMB:null,texMaxMB:null,level:0};
      if(!sceneReady){res.result='boot-timeout';report.stages.push(res);await page.close();continue;}
      report.version=await page.evaluate(()=>typeof GAME_VERSION!=='undefined'?GAME_VERSION:null);
      const startInfo=await page.evaluate(i=>{const s=window.__g.scene.getScene('Game');const d=Save.data;d.tutorialDone=true;d.unlockedStage=Math.max(d.unlockedStage||0,14);d.stageMastery=d.stageMastery||{};for(let k=0;k<15;k++)d.stageMastery[k]=d.stageMastery[k]||1;
        if(typeof i==='number'){s.startRun(i);return 'story '+i;}
        // Endgame: clear every Delve row above the target so it is open, then start it the way the Delve map button does
        const want=i==='pinnacle'?'boss':i.slice(2),dv=delveSave();let node=null;
        for(let D=1;D<=45&&!node;D++){for(const n of delveRow(D)){const nd=amapNode(n.id);if(nd.type===want&&(want!=='boss'||D>=10)){node=nd;break;}}}
        if(!node)return 'no node '+want;
        for(let D=1;D<node.d;D++)delveRow(D).forEach(n=>{dv.clears[n.id]=1;});dv.best=Math.max(dv.best||0,i==='pinnacle'?30:node.d-1);
        if(i==='pinnacle'){for(let D=1;D<=30;D++)delveRow(D).forEach(n=>{dv.clears[n.id]=1;});dv.best=30;d.pinnacleFreeUsed=false;s._farmFocusRequested='all';s.startPinnacle();return 'pinnacle';}
        d.mapTable={node:node.id,mods:[]};const rr=mapTableRecipe();s.stageDiff=1;s._recipeRequested=rr;s._domainRequested=false;s._farmFocusRequested='all';s.startRun(rr.theme);return 'delve '+want+' depth '+node.d+' '+node.id;},idx);
      res.start=startInfo;
      const fps=[];let heap=0,tex=0,last='',same=0,start=Date.now(),left=false;
      while((Date.now()-start)/1000<MAX){
        await page.waitForTimeout(1000);
        const st=await page.evaluate(()=>{const s=window.__g.scene.getScene('Game'),g=window.__g,P=s.player;let act='';
          try{
            if(s.state!=='cinematic')s._qaCin=0;
            if(s.state==='levelup'&&s._pathTeach){s._pathTeach.next();act='teach';}
            else if(s.state==='levelup'&&s.lvlCards&&s.lvlCards.length&&(s.levelCardReadyAt||0)<=s.time.now&&!(window.__qaShotWanted&&s.lvlCards[0].opt&&s.lvlCards[0].opt.kind==='Build Path'&&!window.__qaShotDone&&(window.__qaShotDone=1,window.__qaShotNow=1))){const c=s.lvlCards[0],x=(c.left+c.right)/2,y=(c.top+c.bottom)/2;s.pickCardAt(x,y);s.pickCardAt(x,y);act='card';}
            else if(s.state==='rolling'&&s._rollBtns&&s._rollBtns.length){s._rollBtns[0].fn();act='roll';}
            else if(s.state==='rewardChoice'&&s._rewardBtns&&s._rewardBtns.length){s._rewardBtns[0].fn();act='reward';}
            else if(s.state==='cinematic'){s._qaCin=(s._qaCin||0)+1;if(s._qaCin>=6&&s._finishStoryCutscene){s._finishStoryCutscene({x:195,y:420,id:-77});act='skip-cine';}}
            else if(s.state==='levelup')act='wait:'+(s.lvlCards||[]).length+':'+Math.round((s.levelCardReadyAt||0)-s.time.now);
            else if(s.state==='play'&&P&&P.body){if(P.hp<P.maxhp*.5)P.hp=P.maxhp;const t=s.time.now/1000,S=s._sig;let ob=null;try{ob=(s.mode==='wave'&&s._nearestWaveObjective)?s._nearestWaveObjective():null;}catch(e){}if(!ob&&S&&S.lanes){const L=S.lanes.find(L=>L.open&&(L.grow==null||L.grow>=1));if(L)ob=L.pts[0];}if(!ob&&s.mode==='waveclear'&&s._nearestEnemy)ob=s._nearestEnemy();const ox=ob?ob.x:(S&&S.x!=null)?S.x:(s.objNode?s.objNode.x:null),oy=ob?ob.y:(S&&S.y!=null)?S.y:(s.objNode?s.objNode.y:null);
              let tx=Math.cos(t*.7)*260,ty=Math.sin(t*.9)*260;if(ox!=null){tx=ox+Math.cos(t)*60;ty=oy+Math.sin(t)*60;}
              const a=Math.atan2(ty-P.y,tx-P.x),d=Math.hypot(tx-P.x,ty-P.y),j=s.joy;if(j&&(!j.active||j.id===-77)){j.active=d>30;j.id=d>30?-77:-1;j.dx=d>30?Math.cos(a):0;j.dy=d>30?Math.sin(a):0;}act='move';}
          }catch(e){act='bot-error:'+e.message;}
          const pm=performance.memory;const shot=!!window.__qaShotNow;window.__qaShotNow=0;return {shot,state:s.state,act,fps:g.loop.actualFps,heap:pm?pm.usedJSHeapSize/1048576:0,tex:s.texMB?s.texMB():0,level:s.level||0,orbs:s.orbs?s.orbs.countActive(true):0,kills:s.kills||0,foes:s.enemies?s.enemies.countActive(true):0,xp:Math.round(s.xp||0),xpNext:Math.round(s.xpNext||0),stage:s.stageIndex,elapsed:Math.round(s.elapsed||0),hp:P?Math.round(P.hp):null,boss:!!(s.boss&&s.boss.active),over:!!(s.over&&s.over.visible),loader:!!(document.querySelector('#loader')&&getComputedStyle(document.querySelector('#loader')).display!=='none')};});
        if(st.shot&&process.env.QA_SHOT_DIR){ await page.screenshot({path:path.join(process.env.QA_SHOT_DIR,'path_'+idx+'.png')}); }
        res.states[st.state]=(res.states[st.state]||0)+1;if(st.state==='play')fps.push(st.fps);heap=Math.max(heap,st.heap);tex=Math.max(tex,st.tex);res.level=st.level;res.elapsed=st.elapsed;res.orbsMax=Math.max(res.orbsMax||0,st.orbs);res.kills=st.kills;res.foesMax=Math.max(res.foesMax||0,st.foes);(st.elapsed%15===0&&(res.trace=res.trace||[]).length<80)&&(res.trace.push([st.elapsed,st.level,st.kills,st.foes,st.state]));res.xp=st.xp+'/'+st.xpNext;
        const sig=st.state+'|'+st.elapsed+'|'+st.level;if(sig===last)same++;else{same=0;last=sig;}
        if(same===20&&left)res.stuck.push({atSec:Math.round((Date.now()-start)/1000),state:st.state,elapsed:st.elapsed,act:st.act});
        if(same===20&&left)await page.evaluate(m=>{try{typeof QA!=='undefined'&&QA.report('stuck',m,'bot');}catch(e){}},'bot stuck '+st.state+' at '+st.elapsed+'s ('+st.act+')');
        if(st.act.startsWith('bot-error'))res.stuck.push({bot:st.act});
        if(['summary','win','over','dead','rushDone','epilogue'].includes(st.state)||st.over){res.result=st.state;break;}
        if(st.state!=='menu')left=true; if(st.state==='menu'&&left){res.result='back-to-menu';break;} if(!left&&(Date.now()-start)>90000){res.result='never-started';break;}
      }
      res.sec=Math.round((Date.now()-start)/1000);if(!res.result)res.result='timeout';
      await page.evaluate(r=>{try{typeof QA!=='undefined'&&QA.report('bot-result',r,'bot');}catch(e){}},'stage '+idx+' '+res.result+' '+res.sec+'s lvl '+res.level).catch(()=>{});await page.waitForTimeout(2500);
      if(fps.length){res.fpsMin=Math.round(Math.min(...fps));res.fpsAvg=Math.round(fps.reduce((a,b)=>a+b,0)/fps.length);}res.heapMaxMB=Math.round(heap);res.texMaxMB=Math.round(tex);
      report.stages.push(res);console.log(JSON.stringify({stage:idx,start:res.start,result:res.result,sec:res.sec,errors:errs.length,console:cerr.length,stuck:res.stuck.length,fps:res.fpsAvg,tex:res.texMaxMB,lvl:res.level,gameSec:res.elapsed,orbsMax:res.orbsMax,xp:res.xp,kills:res.kills,foesMax:res.foesMax}));
      fs.writeFileSync(OUT,JSON.stringify(report,null,1));await page.close();
    }
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
