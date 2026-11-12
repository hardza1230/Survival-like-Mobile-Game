// v8.1.118 owner: monsters blend into the floor → soft image shadows (not Graphics ellipses: Android WebView black bars); camera closer 0.78.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const s=fs.readFileSync('game.js','utf8');
function method(n){const at=s.indexOf('  '+n+'('),tail=s.slice(at+1),nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);assert(at>=0&&nx,n);return s.slice(at,at+1+nx.index);}
assert(s.includes('const REF_W=430, BASE=0.78;'),'camera base zoom 0.78');
const ds=method('drawShadows');assert(ds.includes('this.drawFoeShadows?.()')&&!/enemies[^\n]*fillEllipse/.test(ds),'no Graphics ellipses for enemies');
const ctx=vm.createContext({document:{createElement:()=>({getContext:()=>({scale(){},createRadialGradient:()=>({addColorStop(){}}),fillRect(){}})})}});
const C=vm.runInContext('class C{'+method('drawFoeShadows')+'\n}C',ctx);const made=[];
const img=()=>{const o={active:true,visible:false,setDepth(){return o;},setPosition(x,y){o.x=x;o.y=y;return o;},setDisplaySize(w,h){o.w=w;o.h=h;return o;},setAlpha(a){o.a=a;return o;},setVisible(v){o.visible=v;return o;}};made.push(o);return o;};
const tex={};const foes=[{active:true,visible:true,alpha:1,x:10,y:20,displayWidth:100,displayHeight:100},{active:false},{active:true,visible:true,alpha:0}];
const sc=Object.assign(new C(),{textures:{exists:k=>k in tex,addCanvas(k){tex[k]=1;}},add:{image:img},camWorld:x=>x,enemies:{children:{iterate(f){foes.forEach(f);}}}});
sc.drawFoeShadows();assert.equal(made.length,1);assert(tex.mm_soft_shadow);assert.equal(made[0].x,10);assert.equal(made[0].y,60);assert.equal(made[0].w,72);assert(made[0].visible);
foes[0].active=false;sc.drawFoeShadows();assert.equal(made.length,1,'pooled');assert.equal(made[0].visible,false,'hidden when the monster is gone');
console.log('foe shadow ok');
// v8.1.120 owner: spawn rise (in-view spawns fade in + 0.42s no contact damage), occluding monsters fade, player light, EXP hop.
assert(method('spawnEnemy').includes('this.spawnRise?.(e,x,y)')&&method('touchEnemy').includes('(e._spawnGrace&&(this.time?.now||0)<e._spawnGrace))return;'),'spawn grace');
const sr=method('spawnRise');assert(sr.includes('v.contains?.(x,y)')&&sr.includes('e._spawnGrace=now+420')&&sr.includes('e._occ=false'));
const fs2=method('drawFoeShadows');assert(fs2.includes('e.setAlpha(e.alpha*.5)')&&fs2.includes("e.setAlpha(e._occA??1)")&&fs2.includes('this.drawPlayerLight?.()'),'occlusion fade + light');
assert(method('drawPlayerLight').includes("L.setDepth?.(-99500)")&&method('dropOrb').includes('o._hop={t:0,x0:x,y0:y'),'light + orb hop');
{ const C2=vm.runInContext('class C2{'+method('drawFoeShadows')+'\n}C2',ctx);const pl={x:0,y:0,depth:0};const e={active:true,visible:true,alpha:1,x:5,y:20,depth:20,displayWidth:60,displayHeight:60,setAlpha(a){this.alpha=a;return this;}};
  const sc2=Object.assign(new C2(),{player:pl,textures:{exists:()=>true},add:{image:img},camWorld:x=>x,enemies:{children:{iterate(f){f(e);}}}});
  sc2.drawFoeShadows();assert.equal(e.alpha,.5,'in front of the hero = half alpha');e.y=200;e.depth=200;sc2.drawFoeShadows();assert.equal(e.alpha,1,'restored');}
console.log('readability extras ok');
// v8.1.128 owner (polish set 1): throttled hit flash, mochi chunks on death, stage mood edge tint.
assert(method('enemyWeightHit').startsWith('  enemyWeightHit(e,amount,x,critical=false){\n    this.hitFlash?.(e);'),'flash on every hit path (damage() untouched)');
const hf=method('hitFlash');assert(hf.includes('(e.isBoss||e.isMini?650:300)')&&hf.includes('e.setTintFill(0xffffff)')&&hf.includes('delayedCall?.(55'),'throttled 55 ms flash');
assert(method('mochiChunks').includes('if(live>48)return;')&&s.includes('this.mochiChunks?.(e.x,e.y,'),'chunks capped');
assert(s.includes('const STAGE_MOOD=[')&&method('stageMood').includes("setAlpha(.26)")&&method('exitStage').includes('this.stageMood?.(null)'),'stage mood on/off');
console.log('polish set 1 ok');
// v8.1.129 owner (polish set 2): step dust, stage ambient motes, elite glow, zoom-in during boss charge.
assert(method('tickBossZoom').includes("*(this.boss?._big?.stage==='charge'?1.14:1)"),'charge zoom');
const er=method('tickEnemyReadability');assert(er.includes("this.add.image(e.x,e.y,'mm_rglow').setTint(0xffa040)")&&er.includes('gl._owner=e'),'elite glow');
const ta=method('tickStageAmbient');assert(ta.includes("if(!g.active||!o||!o.active||!o.isElite)")&&ta.includes('em._zone.setTo(v.x,v.y,v.width,v.height)'),'glow cleanup + motes follow camera');
assert(method('stageMood').includes('this.stageAmbient?.(i)')&&method('stageAmbient').includes('frequency:240')&&method('playerStepDust').includes('this._stepT=.2'),'ambient + dust');
assert(method('drawShadows').includes('this.playerStepDust?.(1/60); this.tickStageAmbient?.();'));
console.log('polish set 2 ok');
