// v8.1.45 Thread shop → v8.2.55 owner: real money buys 🍭 Lollipops (looks only), never 🧶 Thread (Thread buys power).
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const a=src.indexOf('const IAP_PACKS='),b=src.indexOf('function pickWeighted(list){');
const ctx={window:{},Date,Math,Object};
ctx.Save={data:{threads:0,lollipops:0},threads(){return this.data.threads||0;},addThreads(n){this.data.threads=this.threads()+n;},spendThreads(n){if(this.threads()<n)return false;this.data.threads-=n;return true;},
  lollipops(){return this.data.lollipops||0;},addLollipops(n){this.data.lollipops=this.lollipops()+n;},spendLollipops(n){if(this.lollipops()<n)return false;this.data.lollipops-=n;return true;},save(){}};
ctx.localDayKey=()=>'2026-11-08';
vm.createContext(ctx);vm.runInContext(src.slice(a,b)+';this.Iap=Iap;this.IAP_PACKS=IAP_PACKS;this.MOCHI_PASS=MOCHI_PASS;',ctx);
const {Iap,Save}=ctx;
assert.strictEqual(Iap.available(),false);
let res;Iap.buy('lolli_60',(ok,why)=>res=[ok,why]);assert.deepStrictEqual([...res],[false,'unavailable']);assert.strictEqual(Save.lollipops(),0);
assert.ok(ctx.IAP_PACKS.every(p=>/^lolli_/.test(p.id)&&p.lolli>0&&p.thread==null),'packs sell Lollipops only');
assert.strictEqual(Iap.grant('lolli_200'),380);assert.strictEqual(Iap.grant('lolli_200'),200);
assert.strictEqual(Iap.grant('nope'),0);
const now=Date.now();assert.strictEqual(Iap.grant('mochi_pass',now),300);assert.strictEqual(Iap.passDaysLeft(now),30);
assert.strictEqual(Iap.claimPass(now),60);assert.strictEqual(Iap.claimPass(now),0);assert.strictEqual(Save.data.mochiPass.left,29);Save.data.mochiPass.left=0;Save.data.mochiPass.day='x';assert.strictEqual(Iap.claimPass(now),0,'no more than 30 claims');
assert.strictEqual(Save.lollipops(),380+200+300+60);assert.strictEqual(Save.threads(),0,'real money never gives Thread');
assert.ok(src.includes("['thread','🍭 Shop']")&&src.includes('buildThreadShop(top)'));
console.log('Lollipop shop: packs, first-purchase double, Mochi Pass daily claim, billing unavailable guard, no Thread from money passed');
