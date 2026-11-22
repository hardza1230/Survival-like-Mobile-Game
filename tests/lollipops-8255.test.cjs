// v8.2.55 owner (22 Nov): 🍭 Lollipops = the real-money currency. Looks only (Wardrobe items + skins), never power.
// 🧶 Thread stays earned-only and keeps buying power (Enhance / Weave Rank / Ancient) + looks.
const fs=require('fs'),assert=require('assert'),vm=require('vm');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
// 1) Lollipops can only be spent by the Wardrobe payer (Cos.pay) — guards against a future power sink
const spends=[...src.matchAll(/spendLollipops\(/g)].map(m=>src.lastIndexOf('\n',m.index));
const lines=spends.map(i=>src.slice(i+1,src.indexOf('\n',i+1)));
assert.ok(lines.length>=2,'spend + Cos.pay');
for(const l of lines)assert.ok(/^\s*(spendLollipops\(n\)\{|pay\(n,cur\)\{)/.test(l),'spendLollipops only in Save + Cos.pay: '+l.slice(0,80));
assert.ok(!/addThreads\([^)]*lolli|threads[^\n]{0,40}=[^\n]{0,40}lollipops\(\)/.test(src),'no Lollipop → Thread conversion');
// 2) Cos pays with either currency at the same price
const a=src.indexOf('const Cos={')>0?src.indexOf('const Cos={'):src.indexOf('const Cos =');assert.ok(a>0,'Cos');
const end=src.indexOf('\n};',a)+3;const ctx={Math,Object,COSMETICS:[{id:'pet_x',slot:'pet',price:300}],COS_RETIRED:[],SKIN_PRICE:1200,SKINS:[],COS_DYES:[['x',null]]};
ctx.Save={data:{threads:500,lollipops:400,cos:null},threads(){return this.data.threads;},lollipops(){return this.data.lollipops;},spendThreads(n){if(this.data.threads<n)return false;this.data.threads-=n;return true;},spendLollipops(n){if(this.data.lollipops<n)return false;this.data.lollipops-=n;return true;},save(){}};
vm.createContext(ctx);vm.runInContext(src.slice(a,end).replace(/^const Cos\s*=/,'this.Cos=')+';',ctx);const Cos=ctx.Cos;
const d=Cos.data();assert.ok(d&&d.own,'cos data');
assert.ok(Cos.buy('pet_x','lolli'));assert.strictEqual(ctx.Save.data.lollipops,100);assert.strictEqual(ctx.Save.data.threads,500,'Lollipops paid, Thread untouched');
d.own={};assert.ok(Cos.buy('pet_x'));assert.strictEqual(ctx.Save.data.threads,200,'default = Thread');
d.own={};assert.ok(!Cos.buy('pet_x','lolli'),'not enough Lollipops');
// 3) power sinks still use Thread / Sugar only
for(const k of ['promote(){','unlockAncient(id){','  openChest(c,isFree){'])assert.ok(!src.slice(src.indexOf(k),src.indexOf('\n',src.indexOf(k))).includes('ollipop'),'no Lollipops in '+k);
// 4) UI: dual buttons only when the player has Lollipops; GM tool; lobby pill only when >0
assert.ok(src.includes("wardPayRow(x,by,bw,hh,price,buy,btn,tag){ const L=Save.lollipops?.()||0; if(L<=0)return false;"),'no Lollipops = old buttons');
assert.ok(src.includes("['🍭','+1,000 Lollipops',()=>{Save.addLollipops(1000);"),'GM');
assert.ok(src.includes("const lp=Save.lollipops?.()||0; if(lp>0){"),'lobby pill only when owned');
console.log('Lollipops 8.2.55: money → Lollipops → looks only; Thread untouched by money; dual pay in Wardrobe passed');
