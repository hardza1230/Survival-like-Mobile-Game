// v8.1.118 owner: monsters blend into the floor → soft image shadows (not Graphics ellipses: Android WebView black bars); camera closer 0.78.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const s=fs.readFileSync('game.js','utf8');
function method(n){const at=s.indexOf('  '+n+'('),tail=s.slice(at+1),nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);assert(at>=0&&nx,n);return s.slice(at,at+1+nx.index);}
assert(s.includes('const REF_W=430, BASE=0.78;'),'camera base zoom 0.78');
const ds=method('drawShadows');assert(ds.includes('this.drawFoeShadows?.()')&&!/enemies[^\n]*fillEllipse/.test(ds),'no Graphics ellipses for enemies');
const ctx=vm.createContext({document:{createElement:()=>({getContext:()=>({scale(){},createRadialGradient:()=>({addColorStop(){}}),fillRect(){}})})}});
const C=vm.runInContext('class C{'+method('drawFoeShadows')+'\n}C',ctx);const made=[];
const img=()=>{const o={active:true,visible:false,setDepth(){return o;},setPosition(x,y){o.x=x;o.y=y;return o;},setDisplaySize(w,h){o.w=w;o.h=h;return o;},setAlpha(a){o.a=a;return o;},setVisible(v){o.visible=v;return o;}};made.push(o);return o;};
const tex={};const foes=[{active:true,visible:true,alpha:1,x:10,y:20,displayWidth:100,displayHeight:100},{active:false},{active:true,visible:true,alpha:0}];
const sc=Object.assign(new C(),{textures:{exists:k=>k in tex,addCanvas(k){tex[k]=1;}},add:{image:img},camWorld:x=>x,enemies:{children:{iterate(f){foes.forEach(f);}}}});
sc.drawFoeShadows();assert.equal(made.length,1);assert(tex.mm_soft_shadow);assert.equal(made[0].x,10);assert.equal(made[0].y,60);assert.equal(made[0].w,72);assert(made[0].visible);
foes[0].active=false;sc.drawFoeShadows();assert.equal(made.length,1,'pooled');assert.equal(made[0].visible,false,'hidden when the monster is gone');
console.log('foe shadow ok');
