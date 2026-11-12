// v8.1.124 owner: bosses stop, stand still, charge, then unleash a big attack; rest after (opening).
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const s=fs.readFileSync('game.js','utf8');
function method(n){const at=s.indexOf('  '+n+'('),tail=s.slice(at+1),nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);assert(at>=0&&nx,n);return s.slice(at,at+1+nx.index);}
assert(method('bossThink').includes('if(this.bossBigMove?.(b,dt)){'),'hooked before normal attacks');
assert(s.includes('if(e._bigHold&&e._big&&e.isBoss&&this.boss===e){ e.setVelocity(0,0); return; }'),'boss stands still');
assert((s.match(/this\.boss=b;this\._bossEpoch=\(this\._bossEpoch\|\|0\)\+1;b\._big=null;b\._bigHold=false;b\._bigT=0;/g)||[]).length===2,'fresh state per boss');
const ctx=vm.createContext({TAU:Math.PI*2,STAGES:[{boss:'Ant Queen'}],Sfx:{bossWarn(){},zap(){}}});
const C=vm.runInContext('class C{'+method('bossBigMove')+'\n}C',ctx);const objs=[];const mk=()=>{const o={active:true,setStrokeStyle(){return o;},setDepth(){return o;},setScale(){return o;},setPosition(){return o;},destroy(){o.active=false;}};objs.push(o);return o;};
const sc=Object.assign(new C(),{stageIndex:0,state:'play',_bossEpoch:1,player:{x:0,y:100},add:{circle:mk},camWorld:x=>x,tweens:{add(){}},time:{delayedCall(ms,f){if(ms<1000)f();}},showBanner(){},screenShake(){},screenFlash(){},floatText(){},dist:(a,b,c,d)=>Math.hypot(a-c,b-d),hurt:0,hurtPlayer(d){this.hurt+=d;},shots:0,foeShot(){this.shots++;}});
const b={isBoss:true,active:true,x:0,y:0,dmg:40,setVelocity(){}};
assert.equal(sc.bossBigMove(b,13.9),false,'not yet');assert.equal(sc.bossBigMove(b,.2),true,'starts at 14 s');assert(b._bigHold&&b._big.stage==='charge');
assert.equal(sc.bossBigMove(b,1.5),true);assert.equal(b._big.stage,'rest');assert(sc.hurt>=15,'player inside the red circle is hit');assert.equal(sc.shots,36,'two rings of 18');
assert.equal(sc.bossBigMove(b,1.2),false,'rest over');assert(!b._bigHold&&!b._big);
b.phase2=true;sc.bossBigMove(b,11.1);assert(b._big,'phase 2 every 11 s');sc._bossEpoch=2;assert.equal(sc.bossBigMove(b,.1),false);assert(!b._bigHold,'new boss epoch clears stale state');
console.log('boss big move ok');
