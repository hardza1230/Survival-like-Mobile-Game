// QA bot suite (v8.1.165, owner 17 Nov): many bot "personas" that play in different ways so bugs show up from several angles.
// Bug finding first (page errors, console errors, stuck states, missions that never end, FPS/memory). Each run also keeps the
// in-game Combat Meter summary (mxSummary) so build-vs-build tables can be printed. Bots use a fresh save + GM ×10 damage (no gear/talents),
// so damage numbers are only good for comparing builds with each other — the owner decides balance on the phone.
// Usage:
//   node scripts/build-www.mjs
//   NODE_PATH=/opt/node22/lib/node_modules node scripts/qa-bots.cjs [--only=persona,persona] [--shard=1/4] [--par=2] [--max=240] [--out=qa-bots.json] [--list]
// Personas: build (every hero × build path) · cards (first/random/relic/modifier picks) · missions (walks onto every objective)
//           idle (never moves) · mortal (no god mode, kites and dodges) · screens (tablet / landscape / small phone)
//           stress (Low quality + ×3 speed) · endgame (Delve rooms + Pinnacle) · menus (taps every menu screen, scripts/qa-menus.cjs)
const fs=require('fs'),http=require('http'),path=require('path'),{spawnSync}=require('child_process'),{chromium}=require('playwright');
const A=Object.fromEntries(process.argv.slice(2).map(a=>{const m=a.match(/^--([^=]+)(?:=(.*))?$/);return m?[m[1],m[2]??'1']:[a,'1'];}));
const MAX=+(A.max||240),PAR=Math.max(1,+(A.par||2)),OUT=A.out||'qa-bots.json',ONLY=A.only?A.only.split(','):null;
const [SH_I,SH_N]=(A.shard||'1/1').split('/').map(Number);
const PHONE={width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:1};
const HEROES={momo:['sniper','shotgun','ricochet'],mint:['glacier','barrage','pierce'],cocoa:['brawler','titan','dashboxer'],taro:['storm','smite','tempest'],yuzu:['zestSwarm','citrusGuardian','juiceWorkshop']};

// ---- job list ----
function jobs(){const J=[],add=(persona,o)=>J.push({id:persona+':'+(o.tag||o.stage),persona,stage:4,hero:'momo',card:'first',move:'chase',god:true,dmg:true,speed:2,view:PHONE,quality:0,...o});
  for(const [h,paths] of Object.entries(HEROES))for(const p of paths)add('build',{tag:h+'.'+p,hero:h,card:'path:'+p,stage:h==='momo'||h==='mint'?4:9,move:'kite'});
  [['first',6],['random',7],['relic',8],['mod',10],['random',12]].forEach(([c,s],i)=>add('cards',{tag:c+'@'+s,stage:s,card:c,hero:['taro','mint','cocoa','yuzu','momo'][i],dmg:true}));
  [5,6,7,9,10,11,12,13,14].forEach(s=>add('missions',{tag:'s'+s,stage:s,hero:'mint',move:'chase',card:'random',dmg:true}));
  [3,6,11].forEach(s=>add('idle',{tag:'s'+s,stage:s,move:'idle',hero:'cocoa'}));
  [[0,'momo'],[4,'taro'],[8,'yuzu']].forEach(([s,h])=>add('mortal',{tag:h+'@'+s,stage:s,hero:h,god:false,move:'kite',card:'random',speed:1}));
  [['tablet',{width:800,height:1280,isMobile:true,hasTouch:true,deviceScaleFactor:1},2],['rotate',{width:800,height:1280,isMobile:true,hasTouch:true,deviceScaleFactor:1},5],['small',{width:360,height:640,isMobile:true,hasTouch:true,deviceScaleFactor:1},1]]
    .forEach(([t,v,s])=>add('screens',{tag:t,view:v,stage:s,hero:'yuzu',card:'random',dmg:true,rotate:t==='rotate'}));   // landscape alone only shows "turn your phone upright" (portrait game) → rotate mid-run and back instead
  [2,9].forEach(s=>add('stress',{tag:'s'+s,stage:s,quality:1,speed:3,hero:'taro',card:'random',dmg:true}));
  ['d:normal','d:elite','d:vault','d:shrine','d:trial','d:siege','d:boss','d:city','pinnacle'].forEach(s=>add('endgame',{tag:s,stage:s,hero:'mint',card:'random',dmg:true,speed:2}));
  add('menus',{tag:'all',kind:'menus'});
  if(A.set)for(const j of J)for(const kv of A.set.split(',')){const [k,v]=kv.split(':');j[k]=v==='true'?true:v==='false'?false:isNaN(+v)?v:+v;}   // e.g. --set=move:chase,dmg:true
  const SKIP=A.skip?A.skip.split(','):[];
  return J.filter(j=>!ONLY||ONLY.includes(j.persona)).filter(j=>!SKIP.includes(j.persona)).filter((_,i)=>i%SH_N===SH_I-1);}

// ---- in-page bot (runs every tick) ----
function botTick(cfg){const s=window.__g.scene.getScene('Game'),g=window.__g,P=s.player;let act='';
  try{
    if(!s.__qaHooked&&s.setupWaveObjective){s.__qaHooked=1;const M=window.__qaMis=window.__qaMis||[];const su=s.setupWaveObjective,co=s.completeWaveObjective,cl=s.clearWaveObjective;
      s.setupWaveObjective=function(...a){const r=su.apply(this,a);const o=this.waveObjective;if(o)M.push({type:o.type,stage:this.stageIndex,at:Math.round(this.elapsed||0),end:null});return r;};
      s.completeWaveObjective=function(...a){const m=M[M.length-1];if(m&&!m.end)m.end='done@'+Math.round(this.elapsed||0);return co.apply(this,a);};
      s.clearWaveObjective=function(...a){const m=M[M.length-1];if(m&&!m.end&&this.waveObjective)m.end='cleared@'+Math.round(this.elapsed||0);return cl.apply(this,a);};}
    if(s.state!=='cinematic')s._qaCin=0;
    const cards=s.lvlCards||[];
    if(s.state==='levelup'&&s._pathTeach){s._pathTeach.next();act='teach';}
    else if(s.state==='levelup'&&cards.length&&(s.levelCardReadyAt||0)<=s.time.now){
      const R=Math.random,k=c=>c.opt||{},want=cfg.card;let c=cards[0];
      if(want==='random')c=cards[Math.floor(R()*cards.length)];
      else if(want.startsWith('path:')){const id=want.slice(5);c=cards.find(x=>k(x).kind==='Build Path'&&k(x).key===id)||cards.find(x=>k(x).kind==='Basic Attack'||k(x).kind==='Power Up')||cards[0];}
      else if(want==='relic')c=cards.find(x=>k(x).kind==='Relic')||cards.find(x=>k(x).kind==='Modifier')||cards[0];
      else if(want==='mod')c=cards.find(x=>k(x).kind==='Modifier')||cards[0];
      (window.__qaPicks=window.__qaPicks||[]).push((k(c).kind||'?')+':'+(k(c).key||k(c).title||'?'));
      const x=(c.left+c.right)/2,y=(c.top+c.bottom)/2;s.pickCardAt(x,y);s.pickCardAt(x,y);act='card';}
    else if(s.state==='rolling'&&s._rollBtns&&s._rollBtns.length){s._rollBtns[Math.floor(Math.random()*s._rollBtns.length)].fn();act='roll';}
    else if(s.state==='rewardChoice'&&s._rewardBtns&&s._rewardBtns.length){s._rewardBtns[Math.floor(Math.random()*s._rewardBtns.length)].fn();act='reward';}
    else if(s.state==='cinematic'){s._qaCin=(s._qaCin||0)+1;if(s._qaCin>=6&&s._finishStoryCutscene){s._finishStoryCutscene({x:195,y:420,id:-77});act='skip-cine';}}
    else if(s.state==='levelup')act='wait';
    else if(s.state==='play'&&P&&P.body){
      if(cfg.speed>1&&s.gameSpeed!==cfg.speed&&s.setGameSpeed)s.setGameSpeed(cfg.speed);
      if(cfg.god&&P.hp<P.maxhp*.5)P.hp=P.maxhp;
      const t=s.time.now/1000,S=s._sig;let ob=null;try{ob=(s.mode==='wave'&&s._nearestWaveObjective)?s._nearestWaveObjective():null;}catch(e){}
      if(!ob&&S&&S.lanes){const L=S.lanes.find(L=>L.open&&(L.grow==null||L.grow>=1));if(L)ob=L.pts[0];}
      if(!ob&&s.mode==='waveclear'&&s._nearestEnemy)ob=s._nearestEnemy();
      const ox=ob?ob.x:(S&&S.x!=null)?S.x:(s.objNode?s.objNode.x:null),oy=ob?ob.y:(S&&S.y!=null)?S.y:(s.objNode?s.objNode.y:null);
      let dx=0,dy=0;
      if(cfg.move==='idle'){}
      else if(cfg.move==='kite'){ // push away from close foes and foe shots, pulled gently toward the objective
        for(const e of (s.enemies?.getChildren?.()||[])){if(!e.active)continue;const ex=P.x-e.x,ey=P.y-e.y,d=Math.hypot(ex,ey)||1;const R=e.isBoss?230:130;if(d<R){const w=(e.isBoss?2.2:1)*(R-d)/R;dx+=ex/d*w;dy+=ey/d*w;}}
        for(const b of (s.foeBullets?.getChildren?.()||[])){if(!b.active)continue;const ex=P.x-b.x,ey=P.y-b.y,d=Math.hypot(ex,ey)||1;if(d<170){const w=1.6*(170-d)/170;dx+=ex/d*w;dy+=ey/d*w;}}
        if(ox!=null){const ex=ox-P.x,ey=oy-P.y,d=Math.hypot(ex,ey)||1;if(d>40){dx+=ex/d*.6;dy+=ey/d*.6;}}else{let n=null,nd=1e9;for(const e of (s.enemies?.getChildren?.()||[])){if(!e.active)continue;const d=Math.hypot(e.x-P.x,e.y-P.y);if(d<nd){nd=d;n=e;}}if(n&&nd>200){dx+=(n.x-P.x)/nd*.5;dy+=(n.y-P.y)/nd*.5;}else{dx+=Math.cos(t*.5)*.3;dy+=Math.sin(t*.6)*.3;}}   // no objective: drift toward the pack so attacks land
      }else{let tx=Math.cos(t*.7)*260,ty=Math.sin(t*.9)*260;if(ox!=null){const r=cfg.move==='chase'?25:60;tx=ox+Math.cos(t)*r;ty=oy+Math.sin(t)*r;}dx=tx-P.x;dy=ty-P.y;if(Math.hypot(dx,dy)<30){dx=0;dy=0;}}
      const d=Math.hypot(dx,dy),j=s.joy;if(j&&(!j.active||j.id===-77)){j.active=d>.05;j.id=d>.05?-77:-1;j.dx=d>.05?dx/d:0;j.dy=d>.05?dy/d:0;}act='move';
    }
  }catch(e){act='bot-error:'+e.message;}
  const pm=performance.memory;
  return {state:s.state,act,fps:g.loop.actualFps,heap:pm?pm.usedJSHeapSize/1048576:0,tex:s.texMB?s.texMB():0,level:s.level||0,kills:s.kills||0,foes:s.enemies?s.enemies.countActive(true):0,
    stage:s.stageIndex,elapsed:Math.round(s.elapsed||0),hp:P?Math.round(P.hp):null,boss:!!(s.boss&&s.boss.active),over:!!(s.over&&s.over.visible),obj:s.waveObjective?s.waveObjective.type:null};}

function startRun(i){const s=window.__g.scene.getScene('Game');const d=Save.data;d.tutorialDone=true;d.unlockedStage=Math.max(d.unlockedStage||0,14);d.stageMastery=d.stageMastery||{};for(let k=0;k<15;k++)d.stageMastery[k]=d.stageMastery[k]||1;
  if(typeof i==='number'){s.startRun(i);return 'story '+i;}
  const want=i==='pinnacle'?'boss':i.slice(2),dv=delveSave();let node=null;
  for(let D=1;D<=45&&!node;D++){for(const n of delveRow(D)){const nd=amapNode(n.id);if(nd.type===want&&(want!=='boss'||D>=10)){node=nd;break;}}}
  if(!node)return 'no node '+want;
  for(let D=1;D<node.d;D++)delveRow(D).forEach(n=>{dv.clears[n.id]=1;});dv.best=Math.max(dv.best||0,i==='pinnacle'?30:node.d-1);
  if(i==='pinnacle'){for(let D=1;D<=30;D++)delveRow(D).forEach(n=>{dv.clears[n.id]=1;});dv.best=30;d.pinnacleFreeUsed=false;s._farmFocusRequested='all';s.startPinnacle();return 'pinnacle';}
  d.mapTable={node:node.id,mods:[]};const rr=mapTableRecipe();s.stageDiff=1;s._recipeRequested=rr;s._domainRequested=false;s._farmFocusRequested='all';s.startRun(rr.theme);return 'delve '+want+' depth '+node.d+' '+node.id;}

async function runStage(browser,port,job){
  const ctx=await browser.newContext({viewport:{width:job.view.width,height:job.view.height},isMobile:!!job.view.isMobile,hasTouch:!!job.view.hasTouch,deviceScaleFactor:job.view.deviceScaleFactor||1});
  const page=await ctx.newPage(),errs=[],cerr=[];
  page.on('pageerror',e=>errs.push(String(e.message).slice(0,300)));
  page.on('console',m=>{if(m.type()==='error'){const t=m.text();if(!/Failed to load resource|404|net::ERR/.test(t))cerr.push(t.slice(0,300));}});
  await page.addInitScript(j=>{try{window.__qaBot=true;localStorage.clear();localStorage.setItem('mochi_gm','1');
    const s={tutorialDone:true,unlockedStage:14,character:j.hero,chars:['momo','mint','cocoa','taro','yuzu','sesame'],gmOpt:{god:j.god,dmg:j.dmg},gmUsed:true,settings:{music:0,sfx:0,quality:j.quality},settingsAuto74:!!j.quality};
    localStorage.setItem('mochi_save',JSON.stringify(s));}catch(e){}},job);
  const res={id:job.id,persona:job.persona,hero:job.hero,card:job.card,move:job.move,view:job.view.width+'x'+job.view.height,result:null,sec:0,errors:errs,consoleErrors:cerr,stuck:[],missions:[],picks:[],fpsMin:null,fpsAvg:null,heapMaxMB:null,texMaxMB:null,level:0};
  const t0=Date.now();await page.goto(`http://localhost:${port}/index.html`);
  const ready=await page.waitForFunction(()=>{const g=window.__g,s=g&&g.scene&&g.scene.getScene('Game');return s&&s.sys.isActive()&&s.state==='menu';},null,{timeout:120000}).then(()=>true,()=>false);
  res.bootSec=Math.round((Date.now()-t0)/1000);
  if(!ready){res.result='boot-timeout';await ctx.close();return res;}
  res.version=await page.evaluate(()=>typeof GAME_VERSION!=='undefined'?GAME_VERSION:null);
  res.start=await page.evaluate(startRun,job.stage).catch(e=>'start-error '+e.message);
  const fps=[];let heap=0,tex=0,last='',same=0,left=false;const start=Date.now();
  while((Date.now()-start)/1000<MAX){
    await page.waitForTimeout(400);
    if(job.rotate&&left){const el=(Date.now()-start)/1000;if(!res._rot1&&el>40){res._rot1=1;await page.setViewportSize({width:job.view.height,height:job.view.width});}else if(res._rot1===1&&el>48){res._rot1=2;await page.setViewportSize({width:job.view.width,height:job.view.height});}}
    const st=await page.evaluate(botTick,job).catch(e=>({state:'eval-error',act:String(e.message).slice(0,120),elapsed:0,level:0}));
    if(st.state==='play')fps.push(st.fps);heap=Math.max(heap,st.heap||0);tex=Math.max(tex,st.tex||0);res.level=st.level;res.elapsed=st.elapsed;res.kills=st.kills;res.foesMax=Math.max(res.foesMax||0,st.foes||0);
    const sig=st.state+'|'+st.elapsed+'|'+st.level+'|'+st.obj;if(sig===last)same++;else{same=0;last=sig;}
    if(same===50&&left){res.stuck.push({atSec:Math.round((Date.now()-start)/1000),state:st.state,elapsed:st.elapsed,act:st.act});
      await page.evaluate(m=>{try{typeof QA!=='undefined'&&QA.report('stuck',m,'bot');}catch(e){}},'bot '+job.id+' stuck '+st.state+' at '+st.elapsed+'s ('+st.act+')').catch(()=>{});}
    if(String(st.act).startsWith('bot-error')&&res.stuck.length<5)res.stuck.push({bot:st.act});
    if(['summary','win','over','dead','rushDone','epilogue'].includes(st.state)||st.over){res.result=st.state;break;}
    if(st.state!=='menu')left=true;if(st.state==='menu'&&left){res.result='back-to-menu';break;}if(!left&&(Date.now()-start)>90000){res.result='never-started';break;}
  }
  res.sec=Math.round((Date.now()-start)/1000);if(!res.result)res.result='timeout';
  const tail=await page.evaluate(()=>{const s=window.__g.scene.getScene('Game');let mx=null;try{const m=s.mxSummary?.();if(m)mx={sec:m.sec,dealt:m.dealt,dBoss:m.dBoss,dMini:m.dMini,dMob:m.dMob,taken:m.taken,kills:m.kills,src:(m.src||[]).slice(0,5),bsrc:(m.bsrc||[]).slice(0,5),wv:m.wv,lv:m.lv,end:m.end};}catch(e){mx={err:e.message};}
    return {mx,missions:window.__qaMis||[],picks:(window.__qaPicks||[]).slice(0,40),path:s.basicAttack?.path||null};}).catch(()=>({}));
  Object.assign(res,{mx:tail.mx||null,missions:tail.missions||[],picks:tail.picks||[],path:tail.path||null});
  if(fps.length){res.fpsMin=Math.round(Math.min(...fps));res.fpsAvg=Math.round(fps.reduce((a,b)=>a+b,0)/fps.length);}res.heapMaxMB=Math.round(heap);res.texMaxMB=Math.round(tex);
  if(process.env.QA_SHOT_DIR&&(errs.length||res.stuck.length||!['summary','win','dead','over','timeout'].includes(res.result)))await page.screenshot({path:path.join(process.env.QA_SHOT_DIR,job.id.replace(/[^a-z0-9.@_-]/gi,'_')+'.png')}).catch(()=>{});
  await ctx.close();return res;}

function runMenus(job){const out=path.resolve('qa-menus-'+SH_I+'.json');const r=spawnSync(process.execPath,[path.join(__dirname,'qa-menus.cjs'),'30',out],{stdio:'inherit',env:process.env,timeout:20*60*1000});
  let data=null;try{data=JSON.parse(fs.readFileSync(out,'utf8'));}catch(e){}
  const errs=[],cerr=[];for(const sc of (data&&data.screens)||[])for(const h of (Array.isArray(sc.problems)?sc.problems:[]))for(const e of h.errors||[])errs.push(sc.screen+' ['+(h.tap||'?')+']: '+String(e).slice(0,240));
  return {id:job.id,persona:'menus',result:r.status===0?'done':'exit '+r.status,errors:errs,consoleErrors:cerr,stuck:[],menus:data};}

(async()=>{const J=jobs();
  if(A.list){for(const j of J)console.log(j.id);console.log(J.length+' jobs');return;}
  const server=http.createServer((q,r)=>{try{const p=path.join(process.cwd(),'www',decodeURIComponent(new URL(q.url,'http://l').pathname));const f=fs.statSync(p).isDirectory()?path.join(p,'index.html'):p;
    const mime={'.js':'text/javascript','.html':'text/html','.webp':'image/webp','.png':'image/png','.mp3':'audio/mpeg','.json':'application/json','.css':'text/css'};r.setHeader('Content-Type',mime[path.extname(f)]||'application/octet-stream');r.end(fs.readFileSync(f));}catch(e){r.statusCode=404;r.end();}});
  await new Promise(r=>server.listen(0,r));const port=server.address().port;
  const browser=await chromium.launch({...(process.env.QA_BROWSER_CHANNEL?{channel:process.env.QA_BROWSER_CHANNEL}:{}),args:['--enable-precise-memory-info','--autoplay-policy=no-user-gesture-required']});
  const report={date:new Date().toISOString(),shard:SH_I+'/'+SH_N,runs:[]};const save=()=>fs.writeFileSync(OUT,JSON.stringify(report,null,1));
  try{const queue=J.filter(j=>j.kind!=='menus'),menus=J.filter(j=>j.kind==='menus');
    const worker=async()=>{while(queue.length){const j=queue.shift();let r;try{r=await runStage(browser,port,j);}catch(e){r={id:j.id,persona:j.persona,result:'runner-error',errors:[String(e.message).slice(0,300)],consoleErrors:[],stuck:[]};}
      report.version=report.version||r.version;report.runs.push(r);save();
      console.log(JSON.stringify({id:r.id,result:r.result,sec:r.sec,errors:r.errors.length,console:r.consoleErrors.length,stuck:r.stuck.length,fps:r.fpsAvg,lvl:r.level,missions:(r.missions||[]).map(m=>m.type+(m.end?'✓':'…')).join(' ')}));}};
    await Promise.all(Array.from({length:PAR},worker));
    for(const j of menus){const r=runMenus(j);report.runs.push(r);save();console.log(JSON.stringify({id:r.id,result:r.result,errors:r.errors.length,console:r.consoleErrors.length}));}
  }finally{save();await browser.close();server.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
