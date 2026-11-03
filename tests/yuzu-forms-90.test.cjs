// v8.0.90 owner: Yuzu companions evolve through 3 forms, stronger Uniques, cutscenes without effects.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const src=fs.readFileSync('game.js','utf8');
function method(n){const a=src.indexOf('  '+n+'(',src.indexOf('class Game extends')),m=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src.slice(a+1));assert(a>=0&&m,n);return src.slice(a,a+1+m.index);}
const ctx={};vm.createContext(ctx);vm.runInContext(src.slice(src.indexOf('const YUZU_FORMS='),src.indexOf('const YUZU_UNIQUES={'))+';this.F=YUZU_FORMS;this.K=YUZU_FORM_KILLS;',ctx);
for(const k of ['pomelo','lime','bloodorange'])assert.equal(ctx.F[k].length,3,k);
const S=vm.runInContext('(class{'+['yuzuForm','yuzuFormKills','yuzuChooseForm','yuzuEvolveFx','yuzuPower'].map(method).join('\n')+'})',ctx);const s=new S();const ev=[];
Object.assign(s,{yuzuRank:()=>0,yuzuTalent:()=>0,showBanner:(a,b)=>ev.push(b),screenFlash(){},vfxHitRing(){},yuzuSound(){}});
s.basicAttack={character:'yuzu',path:'zestSwarm',lv:{},ranks:{}};s.syncBasicAttack=()=>{};
assert.deepEqual([0,1,2,3].map(g=>s.yuzuForm({kind:'pomelo',growth:g})),[1,1,1,1],'growth cannot auto-evolve');
const m={kind:'lime',form:1,formKills:0,spr:{x:0,y:0}};s._yuzuCrew=[m];for(let i=0;i<100;i++)s.yuzuFormKills(m);assert.equal(s.yuzuForm(m),1);assert(s.yuzuChooseForm(s.basicAttack,1));assert.equal(s.yuzuForm(m),2);assert.equal(ev.pop(),'Lime Archer');assert(s.yuzuChooseForm(s.basicAttack,2));assert.equal(s.yuzuForm(m),3);assert.equal(ev.pop(),'Lime Skyhunter');assert(!s.yuzuChooseForm(s.basicAttack,2),'card idempotent');
s.player={dmgMul:1};assert(Math.abs(s.yuzuPower()-21.6*1.6)<1e-8,'third form keeps +60% power over the reduced base');s.basicAttack.lv.companion_form=1;assert(Math.abs(s.yuzuPower()-21.6*1.3)<1e-8,'second form keeps +30% power');s.basicAttack.lv.companion_form=2;
assert(/fk='yz_'\+m\.kind\+'_f'\+form,key=form>1&&this\.textures\.exists\(fk\)\?fk:/.test(src),'form art when delivered');
// Stronger Uniques
assert(/\[\[350,1\.5,\.6\],\[700,2,\.45\]\]\.forEach/.test(method('yuzuCommandLand')),'Pomelo aftershocks');
assert(/for\(const da of \[-\.16,\.16\]\)this\.yuzuShot/.test(method('yuzuCommand')),'Lime fan of 3');
assert(/const fin=s\.n===0;this\.yuzuArea\(u\.m,s\.x,s\.y,fin\?230:150,\(fin\?2\.4:1\)/.test(method('yuzuTickStorm')),'Blood Orange big finale');
// Cutscenes: no effects
const c2={};vm.createContext(c2);vm.runInContext(src.slice(src.indexOf('const MC_FX_RE='),src.indexOf('function bossMotionId('))+';this.P=mcPlain;',c2);
const sc=c2.P({title:'x',mote:'spark',shots:[{bg:['cs_a'],flash:[1,2],pow:'POP!',lines:[0,1],L:[['cs_fx_sparkle',0,0,1,1],['vfx_cs61_crown_shatter',0,0,1,1],['cs61_b01_freed',0,0,1,1],['ruby_talk_proud',0,0,1,1]]}]});
assert(sc.plain);assert.equal(sc.mote,null);assert.deepEqual([...sc.shots[0].L.map(l=>l[0])],['cs61_b01_freed','ruby_talk_proud']);assert(!sc.shots[0].flash&&!sc.shots[0].pow&&!sc.shots[0].lines);assert.equal(sc.shots[0].motes,0);
assert(/if\(!red&&!sc\.plain\)\{ this\.mcMotes/.test(src));
console.log('Yuzu v8.0.90: 3 forms (names, card choice, no kill evolution, power, art hook), stronger Uniques, cutscenes keep only art passed');
