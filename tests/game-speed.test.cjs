const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('game.js','utf8');const at=src.indexOf('  setGameSpeed('),tail=src.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);
const S=vm.runInNewContext('class S{'+src.slice(at,at+1+next.index)+'\n}S',{Math,Number});
const s=new S();s.physics={world:{timeScale:1}};s.time={};s.tweens={};s.speedTxt={setText(t){this.text=t;}};
const match=/if\(hit==='speed'&&this.state==='play'\)\{([^}]+)\}/.exec(src);assert(match);const tap=vm.runInNewContext('(function(hit){'+match[0]+'})',{Sfx:{select(){} }});s.state='play';
for(const expected of [2,3,4,1,2,3,4,1]){tap.call(s,'speed');assert.equal(s.gameSpeed,expected);assert.equal(s.physics.world.timeScale,1/expected);assert.equal(s.time.timeScale,expected);assert.equal(s.tweens.timeScale,expected);assert.equal(s.speedTxt.text,'x'+expected);}
s.state='paused';tap.call(s,'speed');assert.equal(s.gameSpeed,1,'paused tap is ignored');
s._isHitStop=true;s.physics.world.timeScale=12;s.setGameSpeed(4);assert.equal(s.physics.world.timeScale,12,'speed cannot interrupt hit-stop');assert.equal(s.time.timeScale,4);s._isHitStop=false;s.setGameSpeed(s.gameSpeed);assert.equal(s.physics.world.timeScale,.25);
for(const [n,want] of [[NaN,1],[Infinity,1],[0,1],[-1,1],[9,4],[2.6,3]]){s.setGameSpeed(n);assert.equal(s.gameSpeed,want);assert(Number.isFinite(s.physics.world.timeScale));}
s.setGameSpeed(1);assert.equal(s.speedTxt.text,'x1');assert(src.includes('dt*=(this.gameSpeed||1)'),'combat clocks use chosen speed');assert(src.includes('this.setGameSpeed(1);'),'run start restores x1');
console.log('Game speed: real tap cycle x1/x2/x3/x4, physics inverse, timers/tweens, pause, hit-stop, invalid input and reset passed');
