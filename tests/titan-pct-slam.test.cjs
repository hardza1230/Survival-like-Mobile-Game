// v7.6.12 Colossus Fist: บอส/มินิในวงโดนเพิ่ม % Max HP ตาม Rage (1/2/3/5%, มินิครึ่ง) · ไม่คริ (_frDmg) · ข้ามช่วงอมตะ/เฟสล็อก
const fs=require('fs'),vm=require('vm'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
function method(n){const at=src.indexOf('  '+n+'('),tail=src.slice(at+1),nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return src.slice(at,at+1+nx.index);}
const S=vm.runInNewContext('class S{'+method('titanPctSlam')+'}S',{});
const mk=(o)=>Object.assign({active:true,x:0,y:0,maxhp:100000,body:{halfWidth:30}},o);
const run=(lv,list)=>{const s=new S(),hits=[];s.dist=(a,b,c,d)=>Math.hypot(a-c,b-d);s.enemies={children:{iterate:f=>list.forEach(f)}};s.damage=(e,a)=>hits.push([e,a,s._frDmg]);s.titanPctSlam(0,0,300,lv);return hits;};
const boss=mk({isBoss:true}),mini=mk({isMini:true,x:100}),mob=mk({x:50}),far=mk({isBoss:true,x:900}),locked=mk({isBoss:true,_phaseGateLocked:true});
let h=run(4,[boss,mini,mob,far,locked]);assert.equal(h.length,2);assert.equal(h[0][1],7500);assert.equal(h[1][1],3750,'mini half');assert(h.every(x=>x[2]===true),'no crit / powerMul');
assert.deepEqual(run(1,[boss]).map(x=>x[1]),[1500]);assert.deepEqual(run(3,[boss]).map(x=>x[1]),[4500]);assert.equal(run(4,[mk({isBoss:true,x:470})]).length,1,'1.5x reach');assert.equal(run(0,[boss]).length,0,'no bonus without rage');
assert(/titanPctSlam\?\.\(x,y,r,lv\)/.test(src),'wired into the Titan release');assert(src.includes('this.titanSeek?.(x,y,r,lv,unit*rm)'),'seek wired');
console.log('Titan % slam (v8.1.62): 1.5/3/4.5/7.5%, 1.5x reach, titanSeek wired, boss max HP, minis half, mobs/out-of-range/locked skipped, no crit, wired passed');
