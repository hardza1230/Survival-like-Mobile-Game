const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8'),start=source.indexOf('  buildSpecialCores(){'),end=source.indexOf('\n  // ⛏️',start);
const cores=['magnet','dash','insight','treasure','signature'].map((id,i)=>({id,name:id+' Core',rank:i+1,frame:i,icon:'icons',desc:'+10% stat / level',effect:n=>'+'+n+'% bonus'}));
let rank=7,threads=40,levels={dash:3,insight:2},purchases=0;
const Save={data:{rank},threads:()=>threads,specialCoreLvl:id=>levels[id]||0,specialCoreCost:()=>6,buySpecialCore:()=>{purchases++;return true;}};
const ctx={Save,SPECIAL_CORES:cores,rankName:n=>'Rank '+n,Sfx:{clear(){}}};vm.createContext(ctx);const C=vm.runInContext('class Layout{'+source.slice(start,end)+'}\nLayout',ctx);
function run(w,h){const s=new C(),zones=[],objects=[];function obj(x,y,key){const o={x,y,key,setOrigin(){return this;},setDisplaySize(w,h){this.width=w;this.height=h;return this;},setAlpha(){return this;}};objects.push(o);return o;}
Object.assign(s,{W:w,H:h,menu:{removeAll(){},add(){},setVisible(){}},textures:{exists:()=>true},templeArtFrames(){},_screenBg(){},menuToast(){},buildMenuScreen(){},_zone(x,y,w,h,fn){assert(x>=0&&y>=0&&x+w<=s.W+.1&&y+h<=s.H+.1,'hitbox outside viewport');zones.push({x,y,w,h,fn});},add:{image:obj,text:obj}});s.buildSpecialCores();return {s,zones,objects};}
for(const [w,h] of [[390,844],[320,568],[844,390]]){const r=run(w,h),cards=r.objects.filter(o=>o.key==='temple_core_card');assert(cards.length>=1);for(const c of cards)assert(c.y+c.height/2<h-50);r.s._specialCorePage=99;r.s.buildSpecialCores();}
const full=run(390,844);assert.equal(full.objects.filter(o=>o.key==='temple_core_card').length,5);assert(!full.objects.some(o=>String(o.key).startsWith('More cores')));full.zones[0].fn();assert.equal(purchases,1);
Save.data.rank=0;const locked=run(390,844);assert.equal(locked.zones.length,1,'locked cores cannot purchase');
console.log('Special Core layout: tall/compact/landscape, page clamping, hitbox bounds, all five cores, purchase and locks passed');
