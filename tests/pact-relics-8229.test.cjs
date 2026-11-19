// v8.2.29 owner (SCAMPER round 3A): Pact Relics — drawbacks move to the stage, rewards get better; 3 reworked + 8 new (Chapter 2+)
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const meth=n=>{const at=src.indexOf('\n  '+n+'(');assert(at>=0,n);const nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src.slice(at+2));return src.slice(at+1,at+2+nx.index);};
const ctx={Math};vm.createContext(ctx);
vm.runInContext(src.slice(src.indexOf('const RELICS = {'),src.indexOf('/* ---- CHARACTER COMBAT PROFILES'))+src.match(/const TRADEOFFS=\[[\s\S]*?\}\}\];/)[0]+';this.R=RELICS;this.T=TRADEOFFS;this.FX=RP_FX;this.C=RP_CURSES;class K{'+['rpIds','rpMul','rpAdd','rpHas','rpMsnRw','rpCurPlus','rpMissionSetup','rpWaveCurse'].map(meth).join('\n')+'\n};this.K=K;',ctx);
const NEW=['stormlantern','goldenappetite','elitebait','cursedcrown','frostdebt','rootpact','hastyclock','glassgarden'];
for(const k of NEW){const r=ctx.R[k];assert(r&&r.ch2&&r.stage&&r.reward&&r.headline.length<=28,k);assert(ctx.FX[k],k+' has stage fx');assert(!/[฀-๿]/.test(r.desc+r.stage+r.reward));}
assert(ctx.R.glass.stage&&ctx.FX.glass.foeHp===1.2,'Cracked Crystal: stage cost');
const ta=ctx.T.find(t=>t.id==='t_armor'),tr=ctx.T.find(t=>t.id==='t_rush');assert(/^Stage:/.test(ta.cost)&&ta.reward&&/^Stage:/.test(tr.cost)&&tr.reward);
const p={dmgTakenMul:1,baseSpeed:100,cdMul:1};ta.apply(p);assert.strictEqual(p.baseSpeed,100,'armor no longer slows the hero');tr.apply(p);assert.strictEqual(p.dmgTakenMul,.65,'rush no longer adds damage taken');assert(p.sugarFindMul>1);
const s=new ctx.K();s._rel={elitebait:true,t:false};s.basicAttack={trades:['t_armor']};
assert.strictEqual(s.rpMul('eliteRate'),3);assert.strictEqual(s.rpMul('eliteDrop'),2.25);assert.strictEqual(s.rpMul('nothing'),1);
s._rel={cursedcrown:true,hastyclock:true,frostdebt:true,stormlantern:true,rootpact:true};s.basicAttack={};
assert(Math.abs(s.rpMsnRw('hunt')-2.1)<1e-9);assert(Math.abs(s.rpMsnRw('frozenPantry')-3.15)<1e-9);assert.strictEqual(s.rpCurPlus('mirrorPath'),1);assert.strictEqual(s.rpCurPlus('breakRoots'),1);assert.strictEqual(s.rpMul('msnTime'),.85);
const o={type:'frozenPantry',target:20};s.rpMissionSetup(o);assert.strictEqual(o.target,26);const o2={type:'creepingRoots'};s.rpMissionSetup(o2);assert.strictEqual(o2._rpFast,1.25);
s.time={delayedCall(){}};const c=s.rpWaveCurse();assert(c&&c.fx);assert(s.rpMul('spawn')>=1);s._rel={};assert.strictEqual(s.rpWaveCurse(),null);
s._rel={glassgarden:true};assert.strictEqual(s.rpAdd('starsugar'),1);s._rel={goldenappetite:true};assert.strictEqual(s.rpAdd('gold'),.12);
// hooks
for(const h of ["(this.rpMul?.('eliteRate')||1)","(this.rpMul?.('eliteDrop')||1)","this.rpAdd?.('lootUp')","this.rpAdd?.('gold')","this.rpMul?.('msnTime')","this.rpMsnRw?.(o.type)","this.rpCurPlus?.(o.type)","this.rpMul?.('foeShot')","this.rpMul?.('shade')","dt*(o._rpFast||1)","this.rpMul?.('spawn')","this.rpMul?.('foeHp')","this.rpAdd?.('starsugar')","this.rpWaveCurse?.()","this.rpMissionSetup?.(o)"])assert(src.includes(h),h);
assert(src.includes("(!RELICS[k].ch2||ch2)"),'new relics only from Chapter 2');
console.log('Pact Relics 8.2.29: 3 reworked + 8 new, stage fx, rewards, hooks passed');
