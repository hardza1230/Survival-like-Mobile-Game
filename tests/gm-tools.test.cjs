const fs=require('fs'),vm=require('vm'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const a=src.indexOf('const GM_ENABLED='),b=src.indexOf('/* v8.1.55 เจ้าของ: ทำเนียบหลายหมวด');const store={};
const ctx={localStorage:{getItem:k=>k in store?store[k]:null,setItem:(k,v)=>{store[k]=String(v)},removeItem:k=>{delete store[k]}},Save:{data:{},save(){}}};vm.createContext(ctx);vm.runInContext(src.slice(a,b)+';this.GM=GM;',ctx);
const {GM}=ctx;assert.ok(!GM.on());assert.ok(!GM.unlock('0000'));assert.ok(GM.unlock('1234'));assert.ok(GM.on());
assert.ok(!GM.opt('god'));GM.toggle('god');assert.ok(GM.opt('god'));assert.ok(ctx.Save.data.gmUsed);
store.mochi_save='REAL';assert.ok(GM.startTest());assert.ok(GM.testing());assert.strictEqual(store.mochi_save,undefined);store.mochi_save='TEST';assert.ok(GM.endTest());assert.strictEqual(store.mochi_save,'REAL');assert.ok(!GM.testing());
GM.off();assert.ok(!GM.on());assert.ok(!GM.opt('god'));
assert.ok(src.includes("GM.testing()))return;")&&src.includes('Save.data.gmUsed||')&&src.includes("GM.opt('god'))return;")&&src.includes("s==='gm')this.buildGm()"));
console.log('GM tools: code gate, options, gmUsed marks save (no rankings), test profile swaps and restores real save, cloud guarded passed');
