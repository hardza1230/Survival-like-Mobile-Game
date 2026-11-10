const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const a=src.indexOf('const COSMETICS='),b=src.indexOf('function pickWeighted(list){');
const ctx={};ctx.Save={data:{threads:500,cos:{own:{wing_ruby:1,halo_crown:1,pet_bird:1},eq:{wings:'wing_ruby',halo:'halo_crown',pet:'pet_bird'}}},save(){},spendThreads(n){if(this.data.threads<n)return false;this.data.threads-=n;return true;}};
vm.createContext(ctx);vm.runInContext(src.slice(a,b)+';this.Cos=Cos;this.COSMETICS=COSMETICS;',ctx);
const {Cos,Save,COSMETICS}=ctx;
assert.strictEqual(COSMETICS.length,28);vm.runInContext('this.COS_SLOTS=COS_SLOTS;this.COS_DYES=COS_DYES;this.SKINS=SKINS;this.SKIN_PRICE=SKIN_PRICE;this.COS_RETIRED=COS_RETIRED;',ctx);assert.strictEqual(ctx.COS_SLOTS.length,5);assert.strictEqual(ctx.COS_SLOTS[0][0],'skin');
for(const [sl] of ctx.COS_SLOTS)if(sl!=='skin')assert.ok(Cos.shop(sl).length>=3,sl);
// v8.1.70 ของติดตัวเลิกขาย: คืนด้ายครั้งเดียว ของที่ไม่ติดตัวยังอยู่
const refund=COSMETICS.find(c=>c.id==='wing_ruby').price+COSMETICS.find(c=>c.id==='halo_crown').price;Cos.data();assert.strictEqual(Save.data.threads,500+refund);assert.strictEqual(Save.data.cos.refund69,refund);assert.ok(!Cos.owns('wing_ruby')&&Cos.owns('pet_bird'));assert.strictEqual(Cos.equipped('wings'),null);assert.strictEqual(Cos.equipped('pet').id,'pet_bird');Cos.data();assert.strictEqual(Save.data.threads,500+refund,'refund once');
assert.ok(!Cos.buy('wing_cream'),'retired not for sale');assert.ok(Cos.shop('wings').length===0);
Save.data.threads=500;Save.data.cos.own={};Save.data.cos.eq={};
assert.ok(Cos.buy('pet_mochi'));assert.strictEqual(Save.data.threads,200);assert.strictEqual(Cos.equipped('pet').id,'pet_mochi');
assert.ok(!Cos.buy('pet_mochi'));assert.ok(!Cos.buy('pet_turtle'));assert.strictEqual(Cos.equipped('trail'),null);
assert.strictEqual(Cos.col(Cos.item('pet_mochi')),0xffd6e8);Cos.nextDye('pet_mochi');assert.strictEqual(Cos.col(Cos.item('pet_mochi')),0xffb6d9);for(let i=0;i<4;i++)Cos.nextDye('pet_mochi');assert.strictEqual(Cos.dye('pet_mochi'),0);assert.ok(!Cos.nextDye('pet_turtle'));Cos.toggle('pet_mochi');assert.strictEqual(Cos.equipped('pet'),null);assert.ok(!Cos.toggle('pet_turtle'));
// สกิน: ยังไม่มีอาร์ต = ขายไม่ได้ · มีอาร์ต = ซื้อ/ใส่/ถอดรายฮีโร่
assert.strictEqual(ctx.SKINS.length,6);assert.ok(!Cos.buySkin('momo_sakura'),'no art no sale');
ctx.ASSET_IMAGES={card_momo__sakura:'assets/x.webp'};Save.data.threads=1300;assert.ok(Cos.buySkin('momo_sakura'));assert.strictEqual(Save.data.threads,100);assert.strictEqual(Cos.skin('momo').id,'momo_sakura');assert.strictEqual(Cos.skin('mint'),null);
assert.ok(!Cos.setSkin('mint','momo_sakura'),'skin belongs to its hero');assert.ok(Cos.setSkin('momo',null));assert.strictEqual(Cos.skin('momo'),null);assert.ok(Cos.setSkin('momo','momo_sakura'));assert.ok(!Cos.buySkin('momo_sakura'));
for(const m of ['lobbyCosHalo','cosDashFx','lobbyCos','buildWardrobe','wardBar','wardHero','cosAnchor','cosAttach','cosFollow','cosEnsurePrev','wardSkins','wardSkinBar','skinKey','skinLoad','skinSwap','skinFixAnims','cosTap','cosSetup','tickCos'])assert.ok(src.includes('\n  '+m+'('),m);
assert.ok(src.includes("s==='wardrobe')this.buildWardrobe()")&&src.includes('this.tickCos?.(dt)')&&src.includes('this.cosSetup?.()')&&src.includes('this.skinSwap?.(true)'));
{ const nw=src.match(/const NAV_WRAP=\[([^\]]*)\]/)[1]; for(const m of ['buildWardrobe','buildPatrol','buildRanking','buildGm','buildHeroes'])assert.ok(nw.includes("'"+m+"'"),'nav bar wrap '+m); }
console.log('Wardrobe: Skins + 4 shop slots, wings/halo/ring refund once, skins need art and belong to one hero, free dyes, Thread purchase, auto-equip, toggle, no-afford guard and hooks passed');
{ const path=require('path');const m=src.match(/  (cos_[a-z0-9_]+):\{url:'(assets\/art\/cosmetics\/[^']+)',fw:(\d+),fh:(\d+),frames:(\d+)/g)||[];assert.strictEqual(m.length,31,'26 cosmetic FX sheets + 5 HD pets');
  for(const row of m){const [,k,u]=row.match(/(cos_[a-z0-9_]+):\{url:'([^']+)'/);assert.ok(fs.existsSync(path.join(__dirname,'..',u)),u);}
  for(const c of COSMETICS){const k=c.tk||('cos_'+c.id);assert.ok(src.includes('  '+k+':{url:'),k);assert.ok(src.includes('  '+c.icon[0]+':{url:'),c.icon[0]);}
  assert.ok(/art\\\/\(\?:menu_orders\|login30\|cosmetics\|/.test(src),'cosmetics lazy');console.log('Wardrobe art 66+67: 26 lazy FX sheets present, every cosmetic and icon sheet registered'); }
