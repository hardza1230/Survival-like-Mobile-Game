const assert=require('assert'),fs=require('fs'),vm=require('vm');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const grab=re=>{const m=src.match(re);assert(m,'missing '+re);return m[0];};
const ctx={Math,Phaser:{Math:{Angle:{Wrap:a=>Math.atan2(Math.sin(a),Math.cos(a))}}}};vm.createContext(ctx);
vm.runInContext(grab(/const BOSS_SHOT=\[[\s\S]*?\];\nconst BOSS_SHOT_PIN=\{[^}]*\};/)+';this.BOSS_SHOT=BOSS_SHOT;this.PIN=BOSS_SHOT_PIN;',ctx);
assert.equal(ctx.BOSS_SHOT.length,15,'15 campaign bosses');
const behs=new Set(ctx.BOSS_SHOT.map(x=>x.b));for(const k of ['wave','bounce','split','home','boomer','delay'])assert(behs.has(k),'behaviour '+k);
assert(new Set(ctx.BOSS_SHOT.map(x=>x.c)).size===15,'every boss has its own colour');
const method=n=>{const i=src.indexOf('\n  '+n+'(');assert(i>0,n);const m=/\n  [A-Za-z_$][\w$]*\(/g;m.lastIndex=i+3;const j=m.exec(src).index;return src.slice(i+3,j);};
const G={};vm.runInContext('G.f={'+method('bossShotStyleAt')+'}',Object.assign(ctx,{G}));const f=G.f;
const boss={x:0,y:0,displayWidth:200,displayHeight:200};const S=Object.assign(Object.create(f),{stageIndex:3,_bigsNow:()=>[boss]});
assert.equal(S.bossShotStyleAt(50,0),ctx.BOSS_SHOT[3],'shot near boss uses its style');
assert.equal(S.bossShotStyleAt(900,0),null,'far shot (mobs) unchanged');
S._bsChild=true;assert.equal(S.bossShotStyleAt(0,0),null,'children do not restyle');S._bsChild=false;
boss.delveBoss=true;assert.equal(S.bossShotStyleAt(0,0),null,'Delve bosses keep their own shots');delete boss.delveBoss;
boss._pinnacleArt=true;assert.equal(S.bossShotStyleAt(0,0),ctx.PIN,'Pinnacle style');
assert(/if\(b\.beh\)this\.bossShotTick\(b,dt\)/.test(src),'tick hooked');assert(/killFoe\(b\)\{ b\.beh=null;/.test(src),'pool reset');
assert(/countActive\?\.\(true\)\|\|0\)>210\)return;/.test(src),'child cap');
const ns=src.match(/const BOSS_NO_SHOT=new Set\(\[([\d,]+)\]\)/);assert(ns&&ns[1]==='0,3,6,10,14','body-type bosses 0,3,6,10,14');
assert(/foeShot\(x,y,ang,speed,dmg,tint,scale\)\{\n    if\(this\.bossNoShotAt\?\.\(x,y,dmg\)\)return null;/.test(src),'body bosses suppress bullets');
const H={};vm.runInContext('H.f={'+method('bossNoShotAt')+'}',Object.assign(ctx,{H,BOSS_NO_SHOT:new Set([0,3,6,10,14])}));const moves=[];
const N=Object.assign(Object.create(H.f),{stageIndex:0,time:{now:5000},_bigsNow:()=>[boss],bossBodyMove:()=>moves.push(1)});delete boss._pinnacleArt;
assert.equal(N.bossNoShotAt(10,0,8),true);assert.equal(N.bossNoShotAt(10,0,8),true);assert.equal(moves.length,1,'one body move per 1.1s, the rest of the volley is dropped');
assert.equal(N.bossNoShotAt(900,0,8),false,'mob shots far away still fire');N.stageIndex=1;assert.equal(N.bossNoShotAt(10,0,8),false,'other bosses keep bullets');N.stageIndex=0;N._pinnacleRun=true;assert.equal(N.bossNoShotAt(10,0,8),false,'Pinnacle keeps bullets');
{const path=require('path'),crypto=require('crypto'),root=path.join(__dirname,'..'),m=JSON.parse(fs.readFileSync(root+'/assets/incoming/boss60/MANIFEST.json','utf8'));assert.equal(m.assets.length,20);
for(const a of m.assets){const b=fs.readFileSync(root+'/assets/incoming/boss60/'+a.file);assert.equal(b.length,a.bytes,a.key);if(a.sha256)assert.equal(crypto.createHash('sha256').update(b).digest('hex'),a.sha256,a.key);const w=fs.readFileSync(root+'/assets/art/boss_vfx/'+a.key+'.webp');assert.equal(w.slice(8,12).toString(),'WEBP');assert(src.includes("'assets/art/boss_vfx/"+a.key+".webp'"),a.key+' literal url');}
assert(/STAGE_SHEETS\[i\]\?\.push\('bshot_'\+String\(i\+1\)\.padStart\(2,'0'\)\)/.test(src),'bullets load per stage');assert(src.includes("const pk=st.p&&this.textures.exists(st.p)?st.p:null"),'painted bullet with fallback');
for(const k of ['vfx_body_shockwave','vfx_body_skydrop','vfx_body_sweep','vfx_body_charge'])assert(src.includes("fx('"+k+"'"),k+' hooked');}
console.log('Boss shots: 15 + Pinnacle styles, 6 behaviours, near-boss only, Delve/children excluded, pool reset and cap passed; 5 body-type bosses use shockwave/charge/sky drop/sweep instead; order 60 art hashes, per-stage loading, painted bullets + body-move FX passed');
