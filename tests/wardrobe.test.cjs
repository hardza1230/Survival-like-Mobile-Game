const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const a=src.indexOf('const COSMETICS='),b=src.indexOf('function pickWeighted(list){');
const ctx={};ctx.Save={data:{threads:500},save(){},spendThreads(n){if(this.data.threads<n)return false;this.data.threads-=n;return true;}};
vm.createContext(ctx);vm.runInContext(src.slice(a,b)+';this.Cos=Cos;this.COSMETICS=COSMETICS;',ctx);
const {Cos,Save,COSMETICS}=ctx;
assert.strictEqual(COSMETICS.length,28);vm.runInContext('this.COS_SLOTS=COS_SLOTS;this.COS_DYES=COS_DYES;',ctx);assert.strictEqual(ctx.COS_SLOTS.length,7);for(const [sl] of ctx.COS_SLOTS)assert.ok(COSMETICS.filter(c=>c.slot===sl).length>=3,sl);
assert.ok(Cos.buy('wing_cream'));assert.strictEqual(Save.data.threads,50);assert.strictEqual(Cos.equipped('wings').id,'wing_cream');
assert.ok(!Cos.buy('wing_cream'));assert.ok(!Cos.buy('pet_mochi'));assert.strictEqual(Cos.equipped('pet'),null);
assert.strictEqual(Cos.col(Cos.item('wing_cream')),0xfff4e0);Cos.nextDye('wing_cream');assert.strictEqual(Cos.col(Cos.item('wing_cream')),0xffb6d9);for(let i=0;i<4;i++)Cos.nextDye('wing_cream');assert.strictEqual(Cos.dye('wing_cream'),0);assert.ok(!Cos.nextDye('pet_mochi'));Cos.toggle('wing_cream');assert.strictEqual(Cos.equipped('wings'),null);assert.ok(!Cos.toggle('pet_mochi'));
for(const m of ['lobbyCosHalo','cosDashFx','lobbyCos','buildWardrobe','cosTap','cosSetup','tickCos'])assert.ok(src.includes('\n  '+m+'('),m);
assert.ok(src.includes("s==='wardrobe')this.buildWardrobe()")&&src.includes('this.tickCos?.(dt)')&&src.includes('this.cosSetup?.()'));
console.log('Wardrobe: 28 cosmetics in 7 slots, free dyes, Thread purchase, auto-equip, toggle, no-afford guard and hooks passed');
{ const path=require('path');const m=src.match(/  (cos_[a-z0-9_]+):\{url:'(assets\/art\/cosmetics\/[^']+)',fw:(\d+),fh:(\d+),frames:(\d+)/g)||[];assert.strictEqual(m.length,26,'26 cosmetic FX sheets');
  for(const row of m){const [,k,u]=row.match(/(cos_[a-z0-9_]+):\{url:'([^']+)'/);assert.ok(fs.existsSync(path.join(__dirname,'..',u)),u);}
  for(const c of COSMETICS){const k=c.tk||('cos_'+c.id);assert.ok(src.includes('  '+k+':{url:'),k);assert.ok(src.includes('  '+c.icon[0]+':{url:'),c.icon[0]);}
  assert.ok(/art\\\/\(\?:menu_orders\|login30\|cosmetics\|/.test(src),'cosmetics lazy');console.log('Wardrobe art 66+67: 26 lazy FX sheets present, every cosmetic and icon sheet registered'); }
