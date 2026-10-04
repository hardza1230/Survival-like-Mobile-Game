const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('game.js','utf8');
function method(n){const at=source.indexOf('  '+n+'('),tail=source.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);assert(at>=0&&next);return source.slice(at,at+1+next.index);}
const Scene=vm.runInNewContext('class Scene{'+['trackArtVfx','clearArtVfx','frRing','recipeZoneArt','frEffect'].map(method).join('\n')+'\n}Scene',{Math,COLORS:{ice:0x9fe8ff},Phaser:{Math:{Between:()=>0}}});
function scene(){const s=new Scene(),objects=[],hits=[],tweens=[];
 const image=(x,y,key)=>{const o={active:true,x,y,key,scaleX:1,scaleY:1,once(){return this;},setDisplaySize(w,h){this.w=w;this.h=h;return this;},setDepth(){return this;},setAlpha(v){this.alpha=v;return this;},setScale(x,y=x){this.scaleX=x;this.scaleY=y;return this;},destroy(){this.active=false;}};objects.push(o);return o;};
 const enemies=[{active:true,x:0,y:0,setVelocity(){},setTint(){}},{active:true,x:500,y:0}];
 Object.assign(s,{textures:{exists:()=>true},add:{image},camWorld:o=>o,tweens:{add(c){tweens.push(c);},killTweensOf(){}},player:{x:0,y:0},enemies:{children:{iterate(fn){enemies.forEach(fn);}}},dist:Math.hypot.bind(Math),relicDmg:n=>n*10,frHit(e,n){hits.push(n);},floatText(){},nearestEnemy:()=>null,_frZones:[],state:'play'});
 s.dist=(x,y,a,b)=>Math.hypot(x-a,y-b);Object.assign(s,{objects,hits,tweenList:tweens,enemiesList:enemies});return s;}
for(const [e,d] of [['shock',18],['burst',14],['sour',6]]){const s=scene();s.frEffect({e});assert.equal(s.objects[0].key,'vfx_recipe_'+e);assert.equal(s.hits.length,1);assert.equal(s.hits[0],d);s.clearArtVfx();assert(s.objects.every(o=>!o.active));}
{const s=scene();s.frEffect({e:'freeze'});assert.equal(s.enemiesList[0].frozen,1.2);assert.equal(s.hits.length,0);assert.equal(s.objects[0].key,'vfx_recipe_freeze');}
{const s=scene();s.frEffect({e:'immune'});assert.equal(s.player.iframe,1);assert.equal(s.objects[0].key,'vfx_recipe_immune');}
for(const [e,R,t,d] of [['burn',90,3,5],['hole',160,2,4.5]]){const s=scene();s.frEffect({e});const z=s._frZones[0];assert.equal(z.R,R);assert.equal(z.t,t);assert.equal(z.dmg,d);assert.equal(z.spr.key,'vfx_recipe_'+e);s.clearArtVfx();assert.equal(s._frZones.length,0);assert(!z.spr.active);}
{const s=scene(),bullet={active:true,x:30,y:0,body:{enable:true},setActive(v){this.active=v;return this;},setVisible(v){this.visible=v;return this;}};s.foeBullets={children:{iterate(fn){fn(bullet);}}};s.frEffect({e:'cleanse'});assert(!bullet.active&&!bullet.body.enable);assert.equal(s.objects[0].key,'vfx_recipe_cleanse');}
console.log('Recipe art: original damage, freeze, immunity, zone radius/duration, cleanse and transition cleanup passed');
