const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const s=fs.readFileSync('game.js','utf8');
function method(n){const a=s.indexOf('  '+n+'('),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(s.slice(a+1));assert(a>=0&&next);return s.slice(a,a+1+next.index);}
const Save={data:{settings:{vfx:2}}},ctx={Save,Map,Set,Math};vm.createContext(ctx);
const Scene=vm.runInContext('class Scene{'+['heroScreenEffect','clearStatusArt','tickStatusArt'].map(method).join('\n')+'}Scene',ctx);
let objects=[],hook=null;
function obj(){const o={active:true,destroy(){this.active=false},setText(t){this.text=t;return this},setVisible(v){this.visible=v;return this},setAlpha(v){this.alpha=v;return this},setPosition(x,y){this.x=x;this.y=y;return this},setDisplaySize(w,h){this.w=w;this.h=h;return this}};const p=new Proxy(o,{get(t,k){return k in t?t[k]:()=>p}});objects.push(p);return p;}
const scene=new Scene();Object.assign(scene,{time:{now:0},textures:{exists:()=>true},camWorld:o=>o,add:{image:(x,y,k,f)=>{const o=obj();o.frame=f;o.key=k;return o},text:()=>obj()},cameras:{main:{worldView:{x:20,y:30,width:644,height:1080}}},events:{on:(n,f)=>hook=f,off:()=>hook=null}});
for(const [hero,path,frame] of [['momo','ricochet',0],['momo','shotgun',1],['momo','sniper',2],['mint','glacier',3],['mint','impaler',4],['mint','barrage',5],['cocoa','brawler',6],['cocoa','titan',7],['cocoa','dashboxer',8],['taro','',9],['sesame','',10],['yuzu','',11],['berry','',12]]){
 scene.character=hero;scene.basicAttack={path};scene.time.now=0;scene.heroScreenEffect(10,1);const images=objects.slice(-2);assert(images.every(o=>o.frame===frame));scene.time.now=375;hook();assert(images.every(o=>o.w<=644*.18&&o.alpha<=.34));scene.time.now=751;hook();assert(images.every(o=>!o.active));assert.equal(hook,null);
}
Save.data.settings.vfx=0;const before=objects.length;scene.heroScreenEffect();assert.equal(objects.length,before);Save.data.settings.vfx=2;
const enemy={active:true,x:30,y:50,body:{halfHeight:20},_trem:8,_tremT:100,_frostBurnStacks:5,_frostBurnUntil:8000};let enemies=[enemy];scene.enemies={children:{iterate:f=>enemies.forEach(f)}};scene.time.now=200;scene.tickStatusArt();assert.equal(scene._statusArt.size,1);let pack=scene._statusArt.get(enemy);assert.equal(pack.pairs[0].tx.text,'8');assert.equal(pack.pairs[1].tx.text,'5');enemy.x=90;scene.tickStatusArt();assert(pack.pairs[0].im.x>30);scene.time.now=3201;scene.tickStatusArt();assert.equal(pack.pairs[0].im.visible,false);assert.equal(pack.pairs[1].im.visible,true);enemy.active=false;scene.tickStatusArt();assert.equal(scene._statusArt.size,0);assert(pack.items.every(o=>!o.active));
enemies=Array.from({length:100},()=>({...enemy,active:true}));scene.tickStatusArt();assert.equal(scene._statusArt.size,40);Save.data.settings.vfx=0;scene.tickStatusArt();assert.equal(scene._statusArt.size,0);
assert(s.includes('clearArtVfx(){this.clearStatusArt?.()'));
console.log('P1 feedback: 13 skill mappings, edge bounds/lifetime/off/cleanup, status follow/expiry/pooling/cap and extra Tremor stacks passed');
