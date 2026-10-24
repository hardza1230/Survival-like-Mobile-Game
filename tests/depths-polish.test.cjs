const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const src=fs.readFileSync('game.js','utf8');
const a=src.indexOf('function digTable(depth)'),b=src.indexOf('function digThreadAmt');const ctx={Math,Phaser:{Utils:{Array:{GetRandom:x=>x[0]}}},DIG_ITEMS:{gem:{rare:true},chest:{rare:true},gift:{rare:true},stair:{rare:true},part:{rare:true}}};vm.createContext(ctx);vm.runInContext(src.slice(a,b),ctx);
for(const dep of [1,5,12])assert(!vm.runInContext('digTable('+dep+')',ctx).some(r=>r[0]==='stone'||r[0]==='scroll'),'cut Core Stones / Scrolls never roll');
for(let k=0;k<200;k++){const bd=vm.runInContext('digMakeBoard(6,6)',ctx);assert(!bd.some(c=>/^stone_|^scroll$/.test(c.c)));}
assert(src.includes('DIG_SHOP_DAILY_LIMIT=1;'),'1 Sugar shovel purchase per day');
assert(src.includes("if(m[1]){ const sv=[3,4,6][i]; Save.addShovels(sv);"),'all Daily boxes give shovels');
assert(src.includes("const AW_REWARD=[{sugar:80,shovel:2},{thread:20,shovel:2},{sugar:200,thread:25,shovel:3},"),'Awards give shovels');
assert(src.includes("if(r.shovel)Save.addShovels(r.shovel);"));
assert(src.includes("Math.min(3,this.stageDiff||1))+2; Save.addShovels(n);"),'stage boss clear gives more shovels');
assert(src.includes("this._digLadder=(gi>=0&&!d.gemFound&&!d.board[gi].open)?{x:gi%N,y:Math.floor(gi/N),N}:null;"),'distance numbers');
assert(src.includes("const dd=Math.max(Math.abs(ci%L.N-L.x),Math.abs(Math.floor(ci/L.N)-L.y))"));
assert(/digLightAt\(i\)\{[^\n]*d\.lightUsed===d\.depth/.test(src)&&src.includes('d.lightUsed=d.depth;'),'1 free light per floor');
assert(src.includes("tag='miners_collect'"),'Lobby miners collect');
assert(!/'✦ hint\\n/.test(src)&&!src.includes('🌬️ = ladder nearby'),'old legend text removed');
console.log('Depths: no cut items, distance numbers, free light per floor, Lobby miners, more shovels / fewer Sugar buys passed');
