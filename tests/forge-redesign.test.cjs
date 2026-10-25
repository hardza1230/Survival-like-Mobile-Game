const assert=require('assert/strict'),vm=require('vm');const{fixture,method}=require('./forge-fixture.cjs');const{ctx,base}=fixture();base.slot='boots';ctx.GEAR_SLOTS=['weapon','armor','gloves','amulet','ring','boots'].map(slot=>({slot,emoji:'◇'}));ctx.implicitText=()=> 'Pickup +19%';ctx.ensureImplicit=()=>({id:'pickup'});ctx.implicitDef=()=>({});ctx.IMPLICIT_COLOR=ctx.IMPLICIT_COLOR||['#c5b6ce'];ctx.MOD_TIER_COLOR=ctx.MOD_TIER_COLOR||{1:'#e9e2f2',2:'#7ee08f',3:'#6fb8ff',4:'#c891ff',5:'#ffae3d'};ctx.TIER_LABEL={common:{name:'Common'},rare:{name:'Rare'},epic:{name:'Epic'},legend:{name:'Legend'}};let items,wallet,writes;
ctx.Save={data:{sugar:3000},gearItemsForSlot:s=>s?items.filter(it=>it.slot===s):items,gearItem:uid=>items.find(it=>it.uid===uid),isGearEquipped:uid=>uid==='u0',equippedGearItem:()=>items[0],currency:k=>wallet[k]||0,equipGearInstance(slot,uid){writes++;this.isGearEquipped=u=>u===uid;return true;}};ctx.Sfx={back(){},error(){},select(){},equipment(){}};ctx.Save.save=()=>{};
const names=['forgeText','forgeIcon','forgeButton','forgeResetPick','forgeSelectItem','forgeOpenPanel','_buildCraftBenchRaw','drawForgePanel'],S=vm.runInContext('class S{'+names.map(method).join('\n')+'\n}S',ctx);
function scene(W,H,{locked=false,line=0,pending=false,modCount=3,selected='u0',empty=false,itemLevel=55}={}){
 wallet={alt:40,transmute:40,chaos:40,divine:10};ctx.Save.data.currency=wallet;writes=0;ctx.Save.isGearEquipped=u=>u==='u0';items=empty?[]:Array.from({length:11},(_,i)=>({uid:'u'+i,slot:'boots',baseId:'test',grade:'epic',itemLevel,locked,affixes:[{id:'f_might',v:7,t:6,line:0},{id:'f_vital_dough',v:30,t:6,line:1},{id:'f_treasure_aroma',v:7,t:6,line:2}].slice(0,modCount)}));if(pending)items.find(i=>i.uid===selected).forgeChoice={options:[{id:'f_vital_dough',v:30,t:5},{id:'f_slow_recovery',v:5,t:5}]};
 const s=new S();Object.assign(s,{W,H,gearSlot:'boots',craftSelectedUid:selected,craftLineIndex:line,nodes:[],tapZones:[],boxes:[]});
 function node(x=0,y=0,label='',style={}){const o={x,y,text:String(label),style,width:String(label).length*(parseFloat(style.fontSize)||12)*.5,active:true,setOrigin(){return q;},setText(t){this.text=String(t);this.width=this.text.length*(parseFloat(this.style.fontSize)||12)*.5;return q;},setX(x){this.x=x;return q;},setFontSize(z){this.style.fontSize=z;return q;}};const q=new Proxy(o,{get:(o,k)=>k in o?o[k]:()=>q});s.nodes.push(q);return q;}
 s.menu={y:0,removeAll(){s.nodes=[];s.boxes=[];},add(){},setVisible(){}};s.add={graphics:()=>node(),rectangle:()=>node(),image:(x,y)=>node(x,y),text:node};s.textures={exists:k=>!k.startsWith('fg_ui_')};s._screenBg=()=>{};
 s.forgeChrome=(key,x,y,w,h)=>{assert(x>=0&&x+w<=W+.01,key);assert(y>=0&&y+h<=H+.01,`${key}: ${y}+${h}>${H}`);s.boxes.push({key,x,y,w,h});return node(x,y);};
 s._zone=(x,y,w,h,fn)=>{assert(x>=0&&x+w<=W+.01);assert(y>=0&&y+h<=H+.01);assert(w>0&&h>0);s.tapZones.push({x,y,w,h,fn});};s.buildCraftBench=()=>s._buildCraftBenchRaw();s.chooseForgeSustain=()=>writes++;return s;
}
const screens=[[320,568],[360,640],[390,844],[430,932],[691,1536],[768,1024],[844,390]];
const T=(s,t)=>s.tapZones.some(z=>z.tag===t),pick=s=>s.tapZones.find(z=>z.tag?.startsWith('pick_'));
// v8.0.33 Forge Points: no Roll / Auto / Tier / targets · pick a mod → Add or Swap · filled row → Star up / Remove
for(const[W,H]of screens)for(const locked of[false,true])for(const line of[0,1,2]){
 const s=scene(W,H,{locked,line});s._buildCraftBenchRaw();assert(s.nodes.some(n=>n.text==='✓ Equipped'||n.text==='Equipped'));assert(s.nodes.some(n=>/^★3$/.test(n.text)));
 for(const t of ['roll','tier','auto','odds'])assert(!T(s,t),t+' removed');assert(!s.tapZones.some(z=>z.tag?.startsWith('target_')));assert(!s.nodes.some(n=>/^\d+(\.\d+)?% · /.test(n.text)),'no roll chance');
 assert(s.nodes.some(n=>/^🔨 \d+\/20/.test(n.text)),'Forge Points shown');assert.equal(T(s,'unlock'),locked);assert.equal(T(s,'remove'),!locked);
 if(!locked){pick(s).fn();assert(T(s,'swap')&&T(s,'pick_cancel'),'picked mod → Swap');s.tapZones.find(z=>z.tag==='pick_cancel').fn();assert(!T(s,'swap'));}
 for(const z of s.tapZones.filter(z=>['add','swap','up','remove','unlock'].includes(z.tag)))assert(z.h>=44);assert.equal(s.menu.y,0);
}
for(const[W,H]of screens)for(const line of[0,1,2]){const s=scene(W,H,{modCount:0,line});s._buildCraftBenchRaw();assert(s.nodes.some(n=>n.text==='Empty'));assert(!T(s,'add'),'Add waits for a pick');pick(s).fn();assert(T(s,'add'));}
{const s=scene(390,844,{pending:true});s._buildCraftBenchRaw();assert(!items[0].forgeChoice);assert.equal(wallet.transmute,41,'old pending roll refunded');}
{const s=scene(390,844,{selected:'u1'});s._buildCraftBenchRaw();s.tapZones.find(z=>z.tag==='equip').fn();assert.equal(writes,1);assert(!s.tapZones.some(z=>z.tag==='equip'));}
{const s=scene(390,844,{empty:true});s._buildCraftBenchRaw();assert(s.nodes.some(n=>n.text==='No craftable gear'));}
{const s=scene(320,568,{line:2});s._buildCraftBenchRaw();assert(!s.tapZones.some(z=>z.tag?.startsWith('family_')));assert.equal(s._forgeVisiblePool.length,vm.runInContext("forgePool({slot:'boots',itemLevel:55},2).length",ctx));}
assert.equal(vm.runInContext("gearAffixName('Plain Boots',[null,null,null])",ctx),'Plain Boots');
console.log('Single-screen Forge Points: seven viewports, lock/pick/swap/add states, no random roll, old roll refund, equip and paging passed');
{const s=scene(390,844);s._curMenu='craft';s._navStack=['hub','gLoadout','gear'];s.buildMenuScreen=()=>{if(s._curMenu!==s.menuScreen)s._navStack.push(s._curMenu);s._curMenu=s.menuScreen;};s._buildCraftBenchRaw();s.tapZones.find(z=>z.tag==='forge_back').fn();assert.equal(s.menuScreen,'gLoadout');assert.deepEqual(s._navStack,['hub']);assert.equal(s._navStack.pop(),'hub');}
// Early gear exposes its level gates and offers no paid controls on locked rows.
for(const [W,H]of screens)for(const [itemLevel,cap]of [[1,1],[11,1],[12,2],[24,2],[25,3]])for(const line of [0,1,2]){
 const s=scene(W,H,{itemLevel,line,modCount:0});s._buildCraftBenchRaw();assert.equal(!!pick(s),line<cap);
 if(line>=cap){assert(!T(s,'add'));assert(s.nodes.some(n=>n.text==='Requires iLv '+[1,12,25][line]+' gear'));}
}
// Rarity gate: a Common item opens only the Power slot until it is merged.
for(const[W,H]of screens){const s=scene(W,H,{itemLevel:30,line:1,modCount:0});items.forEach(i=>i.grade='common');s._buildCraftBenchRaw();assert(!pick(s));assert(s.nodes.some(n=>n.text==='Merge to open this slot'));assert(s.nodes.some(n=>/^🔨 \d+\/8/.test(n.text)));}
console.log('Forge level-gate UI: all seven layouts, iLv and rarity gates passed');
