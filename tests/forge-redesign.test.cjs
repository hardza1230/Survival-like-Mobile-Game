const assert=require('assert/strict'),vm=require('vm');const{fixture,method}=require('./forge-fixture.cjs');const{ctx,base}=fixture();base.slot='boots';ctx.GEAR_SLOTS=['weapon','armor','gloves','amulet','ring','boots'].map(slot=>({slot,emoji:'◇'}));ctx.implicitText=()=> 'Pickup +19%';ctx.ensureImplicit=()=>({id:'pickup'});ctx.implicitDef=()=>({});ctx.IMPLICIT_COLOR=ctx.IMPLICIT_COLOR||['#c5b6ce'];ctx.MOD_TIER_COLOR=ctx.MOD_TIER_COLOR||{1:'#e9e2f2',2:'#7ee08f',3:'#6fb8ff',4:'#c891ff',5:'#ffae3d'};ctx.TIER_LABEL={common:{name:'Common',color:'#c7bdd6'},rare:{name:'Rare',color:'#7fb0ff'},epic:{name:'Epic',color:'#c891ff'},legend:{name:'Legend',color:'#ffae3d'},mythic:{name:'Mythic',color:'#ff5d8f'},ancient:{name:'Ancient',color:'#4fe0c8'},divine:{name:'Divine',color:'#fff3a8'}};ctx.Phaser={Display:{Color:{HexStringToColor:()=>({color:0xffffff})}}};let items,wallet,writes;
ctx.Save={data:{sugar:3000},gearItemsForSlot:s=>s?items.filter(it=>it.slot===s):items,gearItem:uid=>items.find(it=>it.uid===uid),isGearEquipped:uid=>uid==='u0',equippedGearItem:()=>items[0],currency:k=>wallet[k]||0,equipGearInstance(slot,uid){writes++;this.isGearEquipped=u=>u===uid;return true;}};ctx.Sfx={back(){},error(){},select(){},equipment(){},craft(){}};ctx.Save.save=()=>{};
// v8.0.83 Simple Forge page: summary card + 3 MOD ROWS (Upgrade ★ / + Add a mod / Merge to open) + 3-card picker overlay
const names=['forgeText','forgeIcon','forgeButton','forgeResetPick','forgeSelectItem','forgeOpenPanel','_buildCraftBenchRaw','drawForgePanel','pwSection','_craftContext','_forgeItem','_forgePay','_forgeDone','forgeOpenAdd','forgeAdd','forgeUpgrade','forgeRemove'],S=vm.runInContext('class S{'+names.map(method).join('\n')+'\n}S',ctx);
function scene(W,H,{locked=false,modCount=3,selected='u0',empty=false,itemLevel=55,grade='epic',pending=false}={}){
 wallet={transmute:40};ctx.Save.data.currency=wallet;writes=0;ctx.Save.isGearEquipped=u=>u==='u0';items=empty?[]:Array.from({length:11},(_,i)=>({uid:'u'+i,slot:'boots',baseId:'test',grade,itemLevel,locked,affixes:[{id:'f_might',v:7,t:6,line:0},{id:'f_vital_dough',v:30,t:6,line:1},{id:'f_treasure_aroma',v:7,t:6,line:2}].slice(0,modCount)}));if(pending)items.find(i=>i.uid===selected).forgeChoice={paid:'transmute',options:[]};
 const s=new S();Object.assign(s,{W,H,gearSlot:'boots',craftSelectedUid:selected,craftLineIndex:0,nodes:[],tapZones:[],cards:[],showBanner(){},menuToast(){},screenFlash(){}});
 function node(x=0,y=0,label='',style={}){const o={x,y,text:String(label),style,width:String(label).length*(parseFloat(style.fontSize)||12)*.5,active:true,setOrigin(){return q;},setText(t){this.text=String(t);this.width=this.text.length*(parseFloat(this.style.fontSize)||12)*.5;return q;},setX(x){this.x=x;return q;},setFontSize(z){this.style.fontSize=z;return q;}};const q=new Proxy(o,{get:(o,k)=>k in o?o[k]:()=>q});s.nodes.push(q);return q;}
 s.menu={y:0,removeAll(){s.nodes=[];s.cards=[];},add(){},setVisible(){}};s.add={graphics:()=>node(),rectangle:()=>node(),image:(x,y)=>node(x,y),text:node};s.textures={exists:k=>!k.startsWith('fg_ui_')};s._screenBg=()=>{};
 const inside=(x,y,w,h,k)=>{assert(x>=0&&x+w<=W+.01,`${k} x ${x}+${w}>${W}`);assert(y>=0&&y+h<=H+.01,`${k} y ${y}+${h}>${H}`);};
 s.pwCard=(x,y,w,h)=>{inside(x,y,w,h,'card');s.cards.push({x,y,w,h});return node(x,y);};s.forgeChrome=(key,x,y,w,h)=>{inside(x,y,w,h,key);return node(x,y);};
 s._zone=(x,y,w,h,fn)=>{inside(x,y,w,h,'zone');assert(w>0&&h>0);s.tapZones.push({x,y,w,h,fn});};s.buildCraftBench=()=>s._buildCraftBenchRaw();return s;
}
const screens=[[320,568],[360,640],[390,844],[430,932],[691,1536],[768,1024],[844,390]];
const T=(s,t)=>s.tapZones.find(z=>z.tag===t),has=(s,re)=>s.nodes.some(n=>re.test(n.text));
for(const[W,H]of screens)for(const locked of[false,true]){
 const s=scene(W,H,{locked});s._buildCraftBenchRaw();assert(has(s,/^(✓ )?Equipped$/));assert(has(s,/^MOD ROWS$/));assert(has(s,/Twist Cream · next craft 🟢1$/));
 assert(!has(s,/🔨|Forge Points|Glaze/),'no FP / Glaze text');for(const t of ['roll','tier','auto','odds','swap','add','up','remove'])assert(!T(s,t),t+' old control removed');
 for(let i=0;i<3;i++){assert.equal(!!(T(s,'up_'+i)||T(s,'cap_'+i)),!locked);assert.equal(!!T(s,'rm_'+i),!locked);}assert.equal(!!T(s,'unlock'),locked);
 for(const z of s.tapZones.filter(z=>/^(up|rm|add|unlock)/.test(z.tag||'')))assert(z.h>=30,z.tag+' tap height');
 // rows stay inside the mods card and do not overlap
 const R=s._forgeRowRects;for(let i=1;i<3;i++)assert(R[i].y>=R[i-1].y+R[i-1].h);const M=s._forgeLayout.mods;assert(R[2].y+R[2].h<=M.y+M.h);assert.equal(s.menu.y,0);
}
// Empty rows → + Add a mod opens a 3-card picker; tapping a card buys at ★1 for Twist Cream
for(const[W,H]of screens){const s=scene(W,H,{modCount:0});s._buildCraftBenchRaw();assert.equal(s.nodes.filter(n=>n.text==='Empty').length,3);for(let i=0;i<3;i++)assert(T(s,'add_'+i));
 ctx.Math=Object.assign(Object.create(Math),{random:()=>.99});T(s,'add_1').fn();assert(!s.tapZones.some(z=>z.tag?.startsWith('offer_')),'v8.0.87 no picker: random mod added at once');ctx.Math=Math;
 assert.equal(wallet.transmute,39);const id=api().forgeLines(items[0])[1].id;assert(id);assert(!s._forgePanel);
 assert(T(s,'up_1')||T(s,'cap_1'));assert(T(s,'add_0'));assert(has(s,/^MOD 2  ·  Lv 1 \/ \d$/));}
function api(){return ctx.api;}
// Rarity-only rows: Common = 1 row even at high iLv; locked rows route to Merge (no paid control)
for(const[W,H]of screens)for(const itemLevel of [1,30]){const s=scene(W,H,{modCount:0,grade:'common',itemLevel});s._buildCraftBenchRaw();assert(T(s,'add_0'));assert(!T(s,'add_1')&&!T(s,'add_2'));assert(T(s,'merge_1')&&!T(s,'merge_2'),'v8.0.87 only the next locked row shows');assert.equal(s.nodes.filter(n=>n.text==='🔒 Merge to open').length,1);assert(has(s,/^Needs Rare\+$/));}
// v8.0.87 Divine: 6 rows fit on every screen; Legend shows a Mythic row to merge into
for(const[W,H]of screens){const s=scene(W,H,{modCount:0,grade:'divine'});s._buildCraftBenchRaw();for(let i=0;i<6;i++)assert(T(s,'add_'+i),'divine row '+i);const R=s._forgeRowRects;assert(R[5].y+R[5].h<=s._forgeLayout.mods.y+s._forgeLayout.mods.h);const l=scene(W,H,{modCount:0,grade:'legend'});l._buildCraftBenchRaw();assert(T(l,'merge_3'));assert(has(l,/^Needs Mythic\+$/));}
{const s=scene(390,844,{modCount:0,grade:'rare',itemLevel:1});s._buildCraftBenchRaw();assert(T(s,'add_0')&&T(s,'add_1')&&T(s,'merge_2'),'rare iLv1 opens 2 rows');}
// Star cap: the Upgrade pill becomes the reason
{const s=scene(390,844,{itemLevel:1,grade:'rare',modCount:1});items[0].affixes[0].t=10;s._buildCraftBenchRaw();assert(!T(s,'up_0'));assert(T(s,'cap_0'));assert(has(s,/^Max Lv \d at iLv 1( · next at iLv \d+)?$/));}
// Remove = double tap
{const s=scene(390,844);s._buildCraftBenchRaw();T(s,'rm_2').fn();assert(api().forgeLines(items[0])[2]);assert(has(s,/^Tap 🗑 again · 🟢1$/));T(s,'rm_2').fn();assert.equal(api().forgeLines(items[0])[2],null);assert(T(s,'add_2'));assert.equal(wallet.transmute,39,'v8.0.87 remove costs the craft price');}
// Bad mod row: 💀 BAD label, no Upgrade, remove hint
{const s=scene(390,844,{modCount:1});items[0].affixes=[{id:'b_frail',v:-30,t:0,line:0}];s._buildCraftBenchRaw();assert(has(s,/^MOD 1  ·  💀 BAD$/));assert(!T(s,'up_0'));assert(T(s,'cap_0'));assert(has(s,/^−30 Max HP$/));}
{const s=scene(390,844,{pending:true});s._buildCraftBenchRaw();assert(!items[0].forgeChoice);assert.equal(wallet.transmute,41,'old pending roll refunded');}
{const s=scene(390,844,{selected:'u1'});s._buildCraftBenchRaw();T(s,'equip').fn();assert.equal(writes,1);assert(!T(s,'equip'));}
{const s=scene(390,844,{empty:true});s._buildCraftBenchRaw();assert(has(s,/^No craftable gear$/));}
{const s=scene(390,844);s._buildCraftBenchRaw();T(s,'gear_browse').fn();assert(s.tapZones.some(z=>z.tag==='picker_u3'));s.tapZones.find(z=>z.tag==='picker_u3').fn();assert.equal(s.craftSelectedUid,'u3');assert(!s._forgePanel);}
{const s=scene(390,844);s._curMenu='craft';s._navStack=['hub','gLoadout','gear'];s.buildMenuScreen=()=>{if(s._curMenu!==s.menuScreen)s._navStack.push(s._curMenu);s._curMenu=s.menuScreen;};s._buildCraftBenchRaw();T(s,'forge_back').fn();assert.equal(s.menuScreen,'gLoadout');assert.deepEqual(s._navStack,['hub']);}
assert.equal(vm.runInContext("gearAffixName('Plain Boots',[null,null,null])",ctx),'Plain Boots');
console.log('Simple Forge page: seven viewports, Upgrade/Add/Merge rows, 3-card picker + persistence, star-cap reason, double-tap remove, lock, refund, equip, browse and back passed');
