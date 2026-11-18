// v8.2.18 เจ้าของ "ต่อเลย": Golem ชิ้นทอง + ลูกน้องคุ้มกัน · Creeping Roots รากแม่ 3 แบบ + แตกตัว + แตกกิ่งในแบบเบา · Seed Rift ตัวขนเมล็ดหลายแบบ
const fs=require('fs'),assert=require('assert'),vm=require('vm');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const m=n=>{const i=src.indexOf('\n  '+n+'(');assert.ok(i>0,n);const r=/\n  [A-Za-z_$][\w$]*\(/g;r.lastIndex=i+4;const x=r.exec(src);return src.slice(i,x?x.index:undefined);};
const K=src.match(/const GG_GOLD=[^\n]*?;(?=   \/\/)/)[0].replace(/^const /,'var ');
const ctx={Math,console,TAU:Math.PI*2,WORLD:4000,GOLEM_PARTS:null,Phaser:{Math:{Clamp:(v,a,b)=>Math.max(a,Math.min(b,v))}}};vm.createContext(ctx);vm.runInContext(K,ctx);
vm.runInContext(src.match(/const GOLEM_PARTS=[^\n]*;/)[0].replace(/^const /,'var '),ctx);
vm.runInContext('class S{'+['ggCarrier','ggDropPart','ggGoldLoot','ggList','crSplit','srPick','srCarrier','srSplit','sigArt','artSpr','artIsSpr'].map(m).join('')+'};this.K=S;',ctx);
const obj=()=>{const o={x:0,y:0,visible:true,setTint(){return o},setVisible(v){o.visible=v;return o},setText(){return o},setPosition(){return o}};return o;};
const mk=()=>{const sc=new ctx.K(),en=[],drops=[];Object.assign(sc,{stageIndex:4,player:{x:0,y:0},drops,sigText:()=>obj(),sigAdd:o=>o,textures:{exists:()=>false},
  spawnCurrencyDrop(x,y,k){drops.push(k);return {};},spawnLoot(){drops.push('gearbox');return {};},
  sigSpawnAt:(x,y,el,type)=>{const e={x,y,type,elite:!!el,active:true,maxhp:100,hp:100,scaleX:1,setScale(s){e.scaleX=s;},setTint(){}};en.push(e);return e;}});return [sc,en,drops];};
{ const [sc,en]=mk();const S={carriers:[],parts:[],drops:[],want:[]},c={p:ctx.GOLEM_PARTS[0],gold:true};sc.ggCarrier(S,c);const e=c.e;assert.ok(e._ggGold&&e.maxhp>100,'golden carrier is tougher');assert.strictEqual(en.length,1+ctx.GG_ESCORT,'carrier comes with escorts');
  S.carriers.push(c);sc.ggDropPart(S,e,c.p.k);assert.ok(S.drops[0].gold,'golden part drops'); }
{ const [sc,,drops]=mk();sc.ggGoldLoot({gold:['head']},{x:0,y:0});assert.deepStrictEqual(drops,['recipeink']);drops.length=0;sc.ggGoldLoot({gold:['head','arms']},{x:0,y:0});assert.deepStrictEqual(drops,['recipeink','recipeink','gearbox'],'2 golden parts = gear box');drops.length=0;sc.ggGoldLoot({gold:[]},{x:0,y:0});assert.strictEqual(drops.length,0); }
assert.ok(m('ggTick').includes('if((S.gold||[]).includes(k))sec*=.7;')&&m('ggSpawnGolem').includes('(S.gold||[]).length*.4'),'golden parts = faster skills, tougher golem');
{ const [sc,en]=mk();const L={open:true,pts:[0,1,2,3,4].map(i=>({x:i*10,y:0}))};sc.crSplit({x:0,y:0},L,2);assert.strictEqual(en.length,2,'splitting root: 2 small');assert.ok(en.every(e=>e._lanePath===L&&e._laneI===2&&e.maxhp<100)); }
assert.ok(Object.keys(ctx.CR_KINDS).length===3&&ctx.CR_KINDS.thick.cut>ctx.CR_KINDS.fast.cut&&ctx.CR_KINDS.thick.type==='tank','root kinds');assert.ok(src.includes('if(e&&e._crSplit){ e._crSplit=false;'),'split kill hook');
assert.ok(src.includes('branch:full?18:CR_BRANCH_LIGHT'),'light mode branches too');
{ const [sc,en]=mk();const S={tag:'t',carriers:[],x:500,y:0};const a=sc.srCarrier(S,0,0,'armored');assert.ok(a._srWorth===2&&a.type==='tank','armored carrier counts 2');const sp=sc.srCarrier(S,0,0,'split');assert.ok(sp._srSplit);
  sc.srSplit(sp,S);const kids=S.carriers.slice(2);assert.strictEqual(kids.length,2);assert.ok(kids.every(k=>k._seedCarrier==='t'&&!k._srSplit&&k._srWorth===1&&k._goTo.x===500),'split carriers keep running to the rift');
  const seen=new Set();for(let i=0;i<400;i++)seen.add(sc.srPick());assert.strictEqual(seen.size,4,'all carrier kinds appear'); }
assert.ok(src.includes("o.progress=Math.min(o.target,o.progress+w); this.floatText?.(e.x,e.y-50,w>1?"),'worth counts');
console.log('Mission polish 8.2.18: golden golem parts + escorts, root mother kinds + splitting, seed carrier kinds passed');
