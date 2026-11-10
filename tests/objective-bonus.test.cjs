const fs=require('fs'),vm=require('vm'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
function method(n){const a=src.indexOf('\n  '+n+'(');assert(a>0,n);let i=src.indexOf('{',a),d=0;for(;i<src.length;i++){if(src[i]==='{')d++;else if(src[i]==='}'&&--d===0)break;}return src.slice(a+3,i+1);}
const names=['objBonusInit','objBonusFail','objBonusHit','objBonusTick','objBonusTag','objBonusPay'];
const ctx={Sfx:{},Math};vm.createContext(ctx);vm.runInContext('class S{'+names.map(method).join('\n')+'};this.S=S;',ctx);
const s=new ctx.S();s.player={x:0,y:0};s.floatText=()=>{};s.dist=(a,b,c,d)=>Math.hypot(a-c,b-d);s.sugarStage=0;s.sugarRun=0;let xp=0;s.gainXp=n=>xp+=n;s._storyBudget={reward:40};
let o={type:'survive',progress:0,target:48};s.waveObjective=o;s.objBonusInit(o,false);assert.ok(o.bonus.ok);
for(let i=0;i<5;i++)s.objBonusHit();assert.ok(o.bonus.ok);assert.strictEqual(s.objBonusTag(o),' · ⭐ 0');
assert.strictEqual(s.objBonusPay(o,20),10);assert.strictEqual(xp,20);s.objBonusHit();assert.ok(!o.bonus.ok);assert.strictEqual(s.objBonusPay(o,20),0);
o={type:'capture'};s.waveObjective=o;s.objBonusInit(o,false);o._bleedStk=1;s.objBonusTick(.1);assert.ok(o.bonus.ok,'walking to the ring does not cost the bonus');s._captureZone={x:0,y:0,radiusGoal:100};o._bleedStk=0;s.objBonusTick(.1);o._bleedStk=1;s.objBonusTick(.1);assert.ok(!o.bonus.ok);s._captureZone=null;
o={type:'hunt'};s.waveObjective=o;s.objBonusInit(o,true);assert.strictEqual(o.bonus,null);
o={type:'cleanAir'};s.waveObjective=o;s.objBonusInit(o,false);s._cleanAir={x:500,y:0,r:100};for(let i=0;i<31;i++)s.objBonusTick(.1);assert.ok(o.bonus.ok,'not counted before first entry');s._cleanAir.x=0;s.objBonusTick(.1);s._cleanAir.x=500;for(let i=0;i<31;i++)s.objBonusTick(.1);assert.ok(!o.bonus.ok);
assert.ok(src.includes('this.objBonusHit?.();')&&src.includes('this.objBonusTick?.(dt);')&&src.includes('this.objBonusPay?.(o,bonus)'));
console.log('Objective bonus goals: per-type goals, hit limit, bleed/cleanAir fail, planned lessons skipped, EXP +50% wave reward and Sugar +50% passed');
