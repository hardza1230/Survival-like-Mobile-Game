// v7.8.28 Starter cards never go to waste: Build Path cards show carry-over, and the two dead Cocoa mutations now act.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),src=fs.readFileSync('game.js','utf8');
function method(n){const a=src.indexOf('  '+n+'(',src.indexOf('class Game extends')),m=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src.slice(a+1));assert(a>=0&&m,n);return src.slice(a,a+1+m.index);}
const ctx={BASIC_ATTACKS:{taro:{upgrades:[{id:'arc',name:'Chain Bolt'},{id:'power',name:'Dense Charge'},{id:'surge',name:'Twin Bolt'}],mutations:[{id:'chainlord',name:'Chainlord'}]}}};vm.createContext(ctx);
const S=vm.runInContext('class S{'+method('pathCarryText')+'}S',ctx),s=new S();s.character='taro';s.basicAttack={path:null,lv:{arc:2,power:1},mutation:'chainlord'};
s.basicAttackInfo=function(){return this.basicAttack.path==='smite'?{upgrades:[{id:'arc',name:'Piercing Current'},{id:'power',name:'Dense Charge'}],mutations:[{id:'chainlord',name:'Chainlord'}]}:{upgrades:[],mutations:[]};};
const t=s.pathCarryText({id:'smite'});assert.equal(s.basicAttack.path,null,'path restored');assert(t.includes('Chain Bolt → Piercing Current ×2'));assert(t.includes('Dense Charge ×1'));assert(t.includes('Chainlord'));
s.basicAttack.lv={};s.basicAttack.mutation=null;assert.equal(s.pathCarryText({id:'smite'}),'','nothing owned, no line');
assert(src.includes("carry:this.pathCarryText?.(pt)||''")&&src.includes('isPath&&o.carry?'),'Build Path card shows carry line');
assert(/fin\?1\.55\*finMul\*\(basic\.mutation==='breaker'\?1\.25:1\)/.test(src),'Earthbreaker +25% is real');
assert(src.includes("if(fin&&mut==='breaker'){b.dmg*=1.25;"),'Earthbreaker on Fire Fist');
assert(src.includes("if(ti&&basic.mutation==='rush')this.cocoaLater(.16"),'Rushdown on Titan');
assert(src.includes("(b?.mutation==='chainlord'?2:0)+(b?.evolved?3:0)"),'Chainlord/Evolution add Static Arc jumps');
console.log('Starter carry-over: Build Path carry text, path restore, Earthbreaker/Rushdown/Chainlord fixes passed');
