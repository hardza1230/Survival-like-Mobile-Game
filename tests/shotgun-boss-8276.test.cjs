// v8.2.76 owner: Strawberry Shotgun point blank melted bosses → (A) no ×2 within 120px on bosses/minis, (B) pellets 7+ of one blast on the same boss deal half.
const fs=require('fs'),vm=require('vm'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const i=src.indexOf('\n  pathBulletDmg(b,e){'),j=src.indexOf('\n  damage(e,amount',i);const ctx={SG_BOSS_FULL_PELLETS:6};vm.createContext(ctx);vm.runInContext('class K{'+src.slice(i,j)+'};this.K=K;',ctx);
const s=new ctx.K();s.player={x:0,y:0};s.dist=(a,b,c,d)=>Math.hypot(a-c,b-d);
const pel=t=>({dmg:10,sgPellet:true,closeMul:.4,sgBlast:t});
const mob={x:50,y:0},boss={x:50,y:0,isBoss:true};
assert.equal(s.pathBulletDmg(pel(1),mob),10*2*1.4,'regular foes keep ×2.8');
const d=[];for(let k=0;k<8;k++)d.push(s.pathBulletDmg(pel(1),boss));
assert.deepStrictEqual(d.map(x=>+x.toFixed(6)),[14,14,14,14,14,14,7,7],'boss: ×1.4, pellets 7+ half');
assert.equal(s.pathBulletDmg(pel(2),boss),14,'next blast resets');
assert.equal(s.pathBulletDmg(pel(3),{x:150,y:0,isMini:true}),14,'120–200px unchanged');
console.log('Shotgun vs boss 8.2.76: no point-blank ×2 on bosses, pellets 7+ half per blast, regular foes unchanged passed');
