const fs=require('fs'),vm=require('vm'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
function method(n){const a=src.indexOf('\n  '+n+'(');assert(a>0,n);let i=src.indexOf('{',a),d=0;for(;i<src.length;i++){if(src[i]==='{')d++;else if(src[i]==='}'&&--d===0)break;}return src.slice(a+3,i+1);}
const ctx={Math,forgeCurrency:()=> 'cream'};vm.createContext(ctx);vm.runInContext('class S{'+['missionPoint','missionLootBurst'].map(method).join('\n')+'};this.S=S;',ctx);
const s=new ctx.S();const pool=[];const mk=()=>{const g={active:true,body:{enable:true,reset(){},setAllowGravity(){}},setActive(){return g},setVisible(){return g},setPosition(x,y){g.x=x;g.y=y;return g},setTexture(){return g},clearTint(){return g},setAlpha(){return g},setScale(){return g}};pool.push(g);return g;};
s.loots={getFirstDead:()=>null,create:()=>mk()};s.player={x:0,y:0};s.textures={exists:()=>true};s.camWorld=g=>g;s.tweens={killTweensOf(){},add(){}};let delayed;s.time={delayedCall:(ms,f)=>delayed=f};
let cur=0,gear=null;s.spawnCurrencyDrop=()=>cur++;s.spawnLoot=(x,y,b)=>{gear={rare:s._lootMinRare,b,active:true,setPosition(){return gear}};return gear;};s.sugarStage=40;s.sugarRun=40;s.stageIndex=11;
const out=s.missionLootBurst({bonus:{ok:true}},40);
const sug=pool.filter(g=>g.dropType==='sugar');assert.ok(sug.length>=4&&sug.length<=6);assert.strictEqual(sug.reduce((a,g)=>a+g.sugarVal,0),40);assert.strictEqual(s.sugarStage,0);
assert.strictEqual(cur,1);assert.ok(gear&&gear.rare===true&&gear.b===2);assert.strictEqual(s._lootMinRare,false);
delayed();assert.ok(out.every(g=>g._mag));
gear=null;s.missionLootBurst({bonus:{ok:false}},12);assert.strictEqual(gear,null);
assert.ok(src.includes("if(g.dropType==='sugar')")&&src.includes("this._lootMinRare&&g.lootTier==='common'"));
console.log('Mission loot burst: sugar split into pickups (total kept), material drop, bonus gear min Rare (boost 2 in ch3), auto-magnet after 6s passed');
