const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const s=fs.readFileSync('game.js','utf8');
function fn(name){const a=s.indexOf('function '+name+'(');assert(a>=0,name);return s.slice(a,s.indexOf('\n',a));}
function method(name){const at=s.indexOf('  '+name+'('),tail=s.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);assert(at>=0&&next,name);return s.slice(at,at+1+next.index);}
const ctx={Save:{data:{settings:{}}}};vm.createContext(ctx);vm.runInContext([fn('mxFmt'),fn('mxClock'),s.slice(s.indexOf('function mxLines('),s.indexOf('const Stats={'))].join('\n'),ctx);
const names=['mxReset','mxSrcName','mxDeal','mxDash','mxKill','mxTick','mxSummary'];
vm.runInContext('class S{'+names.map(method).join('\n')+'\n mxOverlay(){}}',ctx);
const g=vm.runInContext('new S()',ctx);Object.assign(g,{elapsed:10,level:3,waveIndex:0,state:'play',_coachUnique:2,game:{loop:{actualFps:60,delta:16}},enemies:{countActive:()=>5},foeBullets:{countActive:()=>2}});
g.mxReset();const boss={isBoss:true,hp:100,maxhp:100,active:true},mob={hp:10,maxhp:10,active:true};
g._mxSrc='thunder';g.mxDeal(mob,25,true);mob.hp=-15;g.mxDeal(boss,40,false);boss.hp=60;g._taroDamageContext={source:'chain'};g.elapsed=14;g.mxDeal(boss,60,false);boss.hp=0;g.mxKill(boss);g.mxKill(mob);g._taroDamageContext=null;g.mxDash();g._coachUnique=3;
const m=g.mxSummary();assert.equal(m.dealt,110);assert.equal(m.over,15);assert.equal(m.crits,1);assert.equal(m.dBoss,100);assert.equal(m.dMob,10);assert.equal(m.kills,2);assert.equal(m.dash,1);assert.equal(m.uq,1);
assert.equal(m.fights.length,1);assert(m.fights[0].done);assert.equal(m.fights[0].dps,25);assert.equal(m.src.map(x=>x[0]).join(),'taro.chain,thunder');
const L=ctx.mxLines(m);assert(L.length>=5&&L.some(l=>l.startsWith('fight: Boss')));
g.mxDeal({isDummy:true,hp:5},5);assert.equal(g.mxSummary().dealt,110);
console.log('Combat meter: overkill-free dealt, boss/mob split, fight TTK/DPS, Taro/skill sources, kills, dash/unique counts and report lines passed');
