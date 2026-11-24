// v8.2.83 owner (A): Taro Spark Unique (Storm Mark) dragged on too long on bosses → 18 Sparks fire at once as a fan at the mark, explode on contact with big targets, mark 2 → 1 s.
const fs=require('fs'),vm=require('vm'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const grab=n=>{const i=src.indexOf('\n  '+n+'(');assert(i>0,n);let k=src.indexOf('\n',i+1);while(src.startsWith('\n    ',k))k=src.indexOf('\n',k+1);return src.slice(i+3,k);};
const C=vm.runInNewContext(src.match(/const TARO_MARK_RANGE=[^;]+;/)[0]+';({TARO_MARK_FAST,TARO_BURST_SPREAD,TARO_BURST_SPEED})',{});
assert.equal(C.TARO_MARK_FAST,1);
const T=vm.runInNewContext('class T{'+grab('taroTickSparkStorm')+'};T',{Math,TARO_STORM_GAP:.05,TARO_SPARK_GENS:2,TARO_STORM_FUSE:1.1,TARO_BURST_SPREAD:C.TARO_BURST_SPREAD,TARO_BURST_SPEED:C.TARO_BURST_SPEED});
const t=new T(),shots=[];t.player={x:0,y:0};t.taroSpawnProjectile=o=>shots.push(o);t._taro={run:1,pathEpoch:1,storm:{left:18,next:0,angle:0,step:.3,hit:5,blast:9,speed:480,pierce:2,attackId:3,run:1,pathEpoch:1,burst:true,aim:1}};
t.taroTickSparkStorm(.016);assert.equal(shots.length,18,'all 18 in one frame');assert.equal(t._taro.storm,null);
const a=shots.map(s=>s.angle);assert(Math.abs(Math.min(...a)-(1-C.TARO_BURST_SPREAD/2))<1e-9&&Math.abs(Math.max(...a)-(1+C.TARO_BURST_SPREAD/2))<1e-9,'fan centred on the mark');
assert(shots.every(s=>s.burst&&s.storm&&s.speed===480*C.TARO_BURST_SPEED&&s.damage===5&&s.blast===9),'same damage, faster');
assert(src.includes('this.castTaroSparkStorm(dm,ul,true,Math.atan2(e.y-p.y,e.x-p.x));'),'Storm Mark fires the fan at the mark');
assert(src.includes('until:t.time+TARO_MARK_FAST+(p.echoPath?.75:0),'),'mark 1 s');
assert(src.includes('if(p.burst&&big&&p.left>0){p.left=0;this.taroOrbFade?.(p);}'),'explodes on contact with a big target');
console.log('Spark burst 8.2.83: fan of 18 at the mark, explode on contact, 1 s mark passed');
