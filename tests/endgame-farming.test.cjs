const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8');
function method(n){const at=source.indexOf('  '+n+'('),tail=source.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return source.slice(at,at+1+next.index);}
const C=vm.runInNewContext('class Scene{'+['isEndgameRun','focusGearPool','checkEndgameCurse'].map(method).join('\n')+'\n}Scene');
const s=new C();Object.assign(s,{state:'play',mode:'wave',openEndgameCurse(){this.choices=(this.choices||0)+1;}});
assert.equal(s.checkEndgameCurse(1),false);assert.equal(s.choices,undefined);
s.recipeMode=true;assert.equal(s.checkEndgameCurse(.24),false);assert.equal(s.checkEndgameCurse(.25),true);assert.equal(s.checkEndgameCurse(.74),false);assert.equal(s.checkEndgameCurse(.75),true);assert.equal(s.checkEndgameCurse(1),false);assert.equal(s.choices,2);
s._curseCheckpoint=0;s.state='levelup';assert.equal(s.checkEndgameCurse(1),false);assert.equal(s._curseCheckpoint,0);s.state='play';s.recipeMode=false;s.endlessMode=true;assert(s.checkEndgameCurse(.3));s.endlessMode=false;s.bossRush=true;s.mode='breather';assert(s.checkEndgameCurse(.8));
const pool=['weapon','armor','gloves','boots','ring','amulet'].map(slot=>({slot}));s._farmFocus='weapon';assert.deepEqual(Array.from(s.focusGearPool(pool),x=>x.slot),['weapon']);s._farmFocus='armor';assert.deepEqual(Array.from(s.focusGearPool(pool),x=>x.slot),['armor','gloves','boots']);s._farmFocus='all';assert.equal(s.focusGearPool(pool),pool);
assert(!method('onWaveCleared').includes('openCrossroads'));
assert(method('startRun').includes('this._activeZoneMods=[]'));
assert(method('startRun').indexOf('openEndgamePreparation')<method('startRun').indexOf('Save.data.recipes='));
assert(method('grantGear').includes("this._farmFocus==='materials'"));
console.log('Endgame: story isolation, checkpoint gating, modal deferral, targeted gear pools and recipe consumption order passed');
