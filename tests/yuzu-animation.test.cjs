// Production visual adapters only; no combat, enemy spawning or gameplay updates.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),crypto=require('node:crypto'),src=fs.readFileSync('game.js','utf8');
const ctx={Math,Map,Set,WeakMap,WeakSet};vm.createContext(ctx);const at=src.indexOf('  // Citrus Companions: one owned actor'),end=src.indexOf('  tickFR(dt){');
const C=vm.runInContext('class C{'+src.slice(at,end)+'}C',ctx);
function node(key=''){const n={x:20,y:30,active:true,texture:{key},flipX:false,originX:.5,originY:.5,displayWidth:53,displayHeight:53};for(const k of['setTint','clearTint','setText','clear','fillStyle','fillRoundedRect','fillRect','strokeCircle','lineStyle'])n[k]=function(){return this;};n.setFrame=function(v){this.frame=v;return this;};n.setTexture=function(k,f){this.texture.key=k;this.frame=f;return this;};n.setOrigin=function(x,y=x){this.originX=x;this.originY=y;return this;};n.setDisplaySize=function(x,y){this.displayWidth=x;this.displayHeight=y;return this;};n.setRotation=function(v){this.rotation=v;return this;};n.setDepth=function(v){this.depth=v;return this;};n.setAlpha=function(v){this.alpha=v;return this;};n.setPosition=function(x,y){this.x=x;this.y=y;return this;};n.setFlipX=function(v){this.flipX=v;return this;};n.fillEllipse=function(x,y,w,h){this.ellipse={x,y,w,h};return this;};n.destroy=function(){this.active=false;};return n;}
function scene(kind='lime',red=false){const s=new C(),m={kind,spr:node('yz_'+kind),label:node(),bar:node(),shadow:node(),hp:80,maxhp:80,down:0,revive:0,growth:0,vx:0,vy:0,anim:0};Object.assign(s,{state:'play',player:{x:0,y:0},textures:{exists:()=>true},hubMotionAllowed:()=>!red,_yuzuCrew:[m],tweens:{killTweensOf(){}}});return{s,m};}
for(const kind of['pomelo','lime','bloodorange'])for(const fps of[30,60,120]){
 const{s,m}=scene(kind),x=m.spr.x,y=m.spr.y,size=kind==='pomelo'?64:53,foot=y+size*(248/256-.5);s.yuzuVisual(m,0);
 for(let i=0;i<fps*2;i++){s.yuzuVisual(m,1/fps);assert.equal(m.spr.x,x);assert.equal(m.spr.y,y);assert(Math.abs(m.spr.y+(248/256-m.spr.originY)*m.spr.displayHeight-foot)<.00001);assert(m.spr.displayWidth>size*.9&&m.spr.displayWidth<size*1.35);assert.equal(m.shadow.depth,y+1);assert(m.shadow.depth<m.spr.depth);}
 assert(m._yzVisual.clock>1.99);const clock=m._yzVisual.clock;s.state='paused';s.yuzuVisual(m,20);assert.equal(m._yzVisual.clock,clock);
}
for(const fps of[30,60,120]){const{s,m}=scene('pomelo');m.vx=100;s.yuzuVisual(m,0);for(let i=0;i<fps;i++){m.spr.x+=110/fps;s.yuzuVisual(m,1/fps);}assert(Math.abs(m._yzVisual.gait-Math.PI*2)<.000001);const gait=m._yzVisual.gait;for(let i=0;i<10;i++)s.yuzuVisual(m,1/fps);assert.equal(m._yzVisual.gait,gait,'stationary actor does not treadmill');}
for(const kind of['pomelo','lime','bloodorange']){
 const{s,m}=scene(kind);let released=0;m.action={kind:kind==='lime'?'arrow':'orb',t:0,wind:.2,end:.5,release:()=>released++};
 for(const[t,frame]of[[0,8],[.06,9],[.11,10],[.19,11],[.2,12],[.29,13],[.36,14],[.49,15]]){m.action.t=t;s.yuzuVisual(m,1/60);assert.equal(m.spr.texture.key,'yz_48_'+kind);assert.equal(m.spr.frame,frame);}
 assert.equal(released,0,'rendering never emits damage/projectiles');m.action=null;m.down=2;m.recoverFor=5;s.yuzuVisual(m,0);assert.equal(m.spr.texture.key,'yz_47_'+kind);assert.equal(m.spr.frame,5);
}
{const{s,m}=scene('pomelo');m.lunge={t:.164,a:0};s.yuzuVisual(m,0);assert.equal(m.spr.frame,11);m.lunge.t=.165;s.yuzuVisual(m,1/60);assert.equal(m.spr.frame,12,'painted strike matches existing55% damage threshold');}
{const{s,m}=scene('bloodorange');m.castFlavor=1;m.action={kind:'brew',t:.4,wind:.32,end:.57};s.yuzuVisual(m,0);assert.equal(m.spr.texture.key,'yz_47_bloodorange');assert.equal(m.spr.frame,1);}
{const{s,m}=scene('lime');s.textures.exists=k=>!k.startsWith('yz_48_');m.action={kind:'arrow',t:.2,wind:.16,end:.36};s.yuzuVisual(m,.02);assert.equal(m.spr.texture.key,'yz_47_lime');}
{const{s,m}=scene('pomelo',true);m.motion={kind:'roll',t:.4,prep:.12};for(let i=0;i<30;i++)s.yuzuVisual(m,1/30);assert.equal(m.spr.rotation,0);assert.equal(m._yzVisual.sx,1);assert.equal(m._yzVisual.bob,0);m.motion=null;m.groundY=m.spr.y+75;s.yuzuVisual(m,.03);assert(m.shadow.ellipse.w<64*.62);}
{const{s,m}=scene();s.yuzuVisual(m,.02);const all=[m.spr,m.shadow,m.label,m.bar];s.clearYuzuCrew();assert(all.every(o=>!o.active));}
const manifest=JSON.parse(fs.readFileSync('assets/art/yuzu48/MANIFEST.json','utf8'));assert.equal(manifest.length,3);
for(const a of manifest){for(const[p,h]of[[a.path,a.sha256],[a.source,a.source_sha256]])assert.equal(crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex'),h);assert.equal(a.frames,16);assert.equal(a.frame,256);assert.equal(a.alpha[0],0);assert(a.key.startsWith('yz_'));assert(src.includes("url:'"+a.path+"',frame:256"));}
console.log('Yuzu animation:48frames/hash contracts,30/60/120FPS anchored feet, movement-driven gait/no treadmill, pause/reduced motion/shadow cleanup, release-frame parity/fallback/flavors and untouched gameplay coordinates passed');
// v50 production presentation: no HP bar, one small timed-buff ring, stable foot/shadow.
for(const kind of ['pomelo','lime','bloodorange'])for(const red of [false,true]){
 const{s,m}=scene(kind,red);s.character='yuzu';s.basicAttack={path:({pomelo:'citrusGuardian',lime:'zestSwarm',bloodorange:'juiceWorkshop'})[kind]};
 let rectangles=0,circles=0,arc=null,text='';m.bar.fillRect=m.bar.fillRoundedRect=()=>{rectangles++;return m.bar;};m.bar.strokeCircle=(x,y,r)=>{circles++;assert.equal(r,11);return m.bar;};
 m.bar.beginPath=()=>m.bar;m.bar.arc=(x,y,r,a,b)=>{arc={r,a,b};return m.bar;};m.bar.strokePath=()=>m.bar;m.label.setText=v=>{text=v;return m.label;};
 s.yuzuVisual(m,0);assert.equal(rectangles,0);assert.equal(circles,0);
 const u=s._yzBuff={m,player:s.player,basic:s.basicAttack,epoch:0,kind,t:2.2,total:6};s.yuzuVisual(m,.01);assert.equal(rectangles,0);assert.equal(circles,1);assert(text.endsWith('3s'));assert.equal(arc.r,11);assert(Math.abs((arc.b-arc.a)/(Math.PI*2)-2.2/6)<1e-8);
 s.state='paused';s.yuzuVisual(m,10);assert.equal(u.t,2.2);s.clearYuzuBuff();circles=0;s.yuzuVisual(m,0);assert.equal(circles,0);
}
console.log('Yuzu v50 presentation: all three identities normal/reduced retain anchored animation and shadow, hide HP, display one11px countdown ring and remaining seconds, pause/clear passed');
