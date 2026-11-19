// v8.2.19 เจ้าของ "ทำต่อ": Mirror Path เงาบังแสง+ลำแสงเผา · Last Light ผีเสื้อขโมยแสง+วิญญาณแสง · Vault/Trial คำสาปใหม่+แถบขั้นรางวัล · Siege Sapper+ลังเสบียง · Domain บอส 3 เฟส
const fs=require('fs'),assert=require('assert'),vm=require('vm');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const m=n=>{const i=src.indexOf('\n  '+n+'(');assert.ok(i>0,n);const r=/\n  [A-Za-z_$][\w$]*\(/g;r.lastIndex=i+4;const x=r.exec(src);return src.slice(i,x?x.index:undefined);};
const K=src.match(/const [A-Z][A-Z0-9_]*=[^\n]*?GG_GOLD=[^\n]*?;(?=   \/\/)/)[0].replace(/^const /,'var ');
const ctx={Math,console,TAU:Math.PI*2,WORLD:4000};vm.createContext(ctx);vm.runInContext(K,ctx);vm.runInContext(src.match(/const ULT_CURSES=[^\n]*?;/)[0].replace(/^const /,'var '),ctx);
vm.runInContext('class S{'+['segD','mpShadeTick','llExtrasTick','ultLadder','hsExtrasTick','hsOnKill','artIsSpr'].map(m).join('')+'};this.K=S;',ctx);
const obj=()=>{const o={visible:true,setTint(){return o},setVisible(v){o.visible=v;return o},setText(t){o.text=t;return o},setStrokeStyle(){return o},setFrame(){return o},setOrigin(){return o},setDepth(){return o}};return o;};
const mk=()=>{const sc=new ctx.K(),en=[],hits=[];Object.assign(sc,{stageIndex:4,player:{x:0,y:0,hp:50,maxhp:100},sigText:()=>obj(),sigAdd:o=>o,add:{text:()=>obj()},dist:(a,b,c,d)=>Math.hypot(a-c,b-d),fpFull:()=>false,objectivePosition:()=>({x:200,y:0}),
  damage:(e,d)=>hits.push([e,d]),enemies:{children:{iterate:f=>en.forEach(f)}},
  sigSpawnAt:(x,y,el,type)=>{const e={x,y,type,active:true,setTint(){},setActive(v){e.active=v;},setVisible(){}};en.push(e);return e;}});return [sc,en,hits];};
assert.ok(Math.abs(new ctx.K().segD(5,5,0,0,10,0)-5)<1e-9&&Math.abs(new ctx.K().segD(20,0,0,0,10,0)-10)<1e-9,'point-segment distance');
{ const [sc,en,hits]=mk();const M={x:400,y:0,lit:true,pow:1,pc:2.4,ring:obj(),t:obj()};const S={cx:0,cy:0,mirrors:[M],shades:[],shadeCd:0,beamCd:0,dimmed:0};sc.mpShadeTick(.1,{},S);const sh=en.find(e=>e._mpShade);assert.ok(sh&&sh.type==='tank'&&sh._goTo.x===200,'shade walks to the beam');
  sh.x=200;sh.y=10;for(let k=0;k<40&&M.lit;k++)sc.mpShadeTick(.1,{},S);assert.ok(!M.lit&&S.dimmed===1&&M.pc===1.2,'a shade on the beam dims the mirror');assert.ok(hits.some(h=>h[0]===sh),'the beam burns what blocks it'); }
{ const [sc,en]=mk();const L={x:0,y:0,hp:200,maxhp:220,alive:true};const S={lamps:[L],mothCd:0,wispCd:99,moths:[]};sc.llExtrasTick(.1,{},S);const mo=en.filter(e=>e._llMoth===L);assert.strictEqual(mo.length,2,'moths fly at a lantern');
  mo[0].x=10;mo[0].y=0;sc.llExtrasTick(.1,{},S);assert.strictEqual(L.hp,200-ctx.LL_MOTH_STEAL,'moth steals light');assert.ok(!mo[0].active);
  S.wispCd=0;sc.llExtrasTick(.1,{},S);assert.ok(S.wisp,'light wisp appears');sc.player={x:S.wisp.x,y:S.wisp.y};sc.llExtrasTick(.1,{},S);assert.strictEqual(L.hp,L.maxhp,'wisp rekindles the weakest lantern');assert.ok(!S.wisp); }
{ assert.ok(ctx.ULT_CURSES.some(c=>c.id==='ghosts')&&ctx.ULT_CURSES.some(c=>c.id==='quake'),'new curses');assert.ok(m('ultCurseTick').includes("tick('ghosts',")&&m('ultCurseTick').includes("tick('quake',"));assert.ok(m('ultPad').includes("ci>=0&&ci<6?'ult_curse_pads'"),'new curse pads drawn in code');
  const [sc]=mk();const S={x:0,y:0,r:2,rounds:4,phase:'decide',pot:30,boxes:1};sc.ultLadder(S);assert.ok(/^✅ ✅ ▫️ 👑\n🍬 30  🎁×1$/.test(S.lad.text),S.lad.text);assert.ok(m('ultRoundWon').includes("'Risk it: +🍬~'+nx"),'risk pad shows the next gain'); }
{ const [sc,en]=mk();const S={x:0,y:0,R:230,gates:[{x:500,y:0}],saps:[],sapCd:0,sup:0,crate:null,pot:10,potT:obj()},o={progress:8};sc.hsExtrasTick(.1,o,S);const sp=en.find(e=>e._hsSapper);assert.ok(sp&&sp._goTo.x===0,'sapper runs for the pot');
  sp.x=10;sc.hsExtrasTick(.1,o,S);assert.strictEqual(S.pot,10-ctx.HS_SAPPER_COST,'sapper blows the pot');const s2=sc.sigSpawnAt(0,0);s2._hsSapper=true;sc.sigNear=()=>true;sc.hsOnKill(s2,o,S);assert.strictEqual(S.pot,10-ctx.HS_SAPPER_COST+2,'stopping a sapper +2');
  o.progress=15;sc.hsExtrasTick(.1,o,S);assert.ok(S.crate,'supply crate');sc.player={x:S.crate.x,y:S.crate.y,hp:50,maxhp:100};sc.hsExtrasTick(.1,o,S);assert.ok(!S.crate&&sc.player.hp===75,'crate heals 25%'); }
assert.ok(m('hdTick').includes('ph=hpf>HD_PHASE[0]?1:hpf>HD_PHASE[1]?2:3')&&m('hdTick').includes("if(ph>=2)tick('quake',")&&m('hdTick').includes("tick('hands',ph===3?6:9,"),'Breachlord 3 phases');
assert.ok(src.includes('e._mpShade=false; e._llMoth=null; e._hsSapper=false;'),'released on clear');
console.log('Mission polish 8.2.19: mirror shades + burning beam, moths + light wisp, new trial curses + reward ladder, siege sappers + supplies, Breachlord phases passed');
