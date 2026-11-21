// v8.2.52 เจ้าของ (ECRS ก่อน Closed test): E = ซ่อน Kitchen · ลบของค้าง Overcharge · S = สกุล Forge 5 → 3 (Jam/Honey → Twist Cream, เซฟเก่า ×2)
const fs=require('fs'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
assert.ok(/const KITCHEN_ON=false;/.test(src)&&src.includes("function kitchenOpen(){ return (typeof KITCHEN_ON==='undefined'||KITCHEN_ON)&&"),'Kitchen hidden');
assert.ok(src.includes("...(KITCHEN_ON?[['kitchen',"),'no Kitchen row in Activities');
assert.ok(!src.includes("'msn71_overcharge_pad','msn71_stalker_captain'"),'no Overcharge pad preload');
assert.ok(src.includes("const CUR_ALIAS={berryjam:'transmute',honeydrop:'transmute',"),'old keys alias to Twist Cream');
assert.ok(!/\{key:'berryjam'|\{key:'honeydrop'/.test(src),'removed from CURRENCY');
assert.ok(src.includes("if(!this.data._cur8252){")&&src.includes("c.transmute=(Number(c.transmute)||0)+n*2"),'save migration ×2');
const MR=src.match(/const MISSION_REWARDS=\{[^\n]*\};/)[0];assert.ok(!/berryjam|honeydrop/.test(MR),'mission rewards use Twist Cream');
console.log('ECRS 8.2.52: Kitchen hidden, Overcharge leftovers gone, Forge currencies 5→3 with migration passed');
