const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8');
function method(n){const at=source.indexOf('  '+n+'('),tail=source.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return source.slice(at,at+1+next.index);}
const Scene=vm.runInNewContext('class Scene{'+['getBullet','attachChargedSeed','attachProjectileArt','killBullet'].map(method).join('\n')+'\n}Scene');
const s=new Scene();let destroyed=0;
const fx={setOrigin(){return this;},setDepth(){return this;},setScale(v){this.scale=v;return this;},destroy(){destroyed++;}};
const b={active:false,texture:{key:'proj_sprinkle'},body:{enable:false,velocity:{x:0,y:0},setAllowGravity(){},stop(){this.velocity.x=this.velocity.y=0;}},setActive(v){this.active=v;return this;},setVisible(v){this.visible=v;return this;},setPosition(x,y){this.x=x;this.y=y;return this;},setTexture(key){this.texture.key=key;return this;},setAlpha(v){this.alpha=v;return this;},setScale(){return this;},setTint(){return this;},setRotation(){return this;},setDepth(){return this;}};
Object.assign(s,{camWorld:o=>o,add:{image:()=>fx},textures:{exists:()=>true,get:()=>({getSourceImage:()=>({height:320})})},bullets:{getFirstDead:()=>b}});
s.getBullet(10,20,0xffffff,.2);const body=b.body;s.attachChargedSeed(b,40);
assert.equal(b.body,body);assert.equal(b.texture.key,'proj_sprinkle');assert.equal(b.alpha,0);assert.equal(fx.scale,.125);
s.killBullet(b);assert.equal(destroyed,1);assert.equal(b._chargeFx,null);assert.equal(b.active,false);assert.equal(b.body.enable,false);
s.getBullet(30,40,0xffffff,.2);assert.equal(b.alpha,1);assert.equal(b.body.enable,true);assert.equal(b.x,30);assert.equal(b.y,40);
s.attachChargedSeed(b,40);s.getBullet(50,60,0xffffff,.2);assert.equal(destroyed,2);assert.equal(b._chargeFx,null);assert.equal(b.alpha,1);
s.textures.exists=()=>false;s.attachChargedSeed(b,40);assert.equal(b.alpha,1);
assert(source.includes('this.drawChargedSeed(x0,y0,a,len,bw)'));
assert(source.includes('base:{dmg:1.75,cd:1.4,range:0.3}'));
console.log('Charged projectile: original collider, expiry/reuse cleanup, alpha reset and missing-texture fallback passed');
// Exercise lifecycle of the actual painted aura/shield implementation.
const ArtScene=vm.runInNewContext('class Scene{'+['trackArtVfx','clearArtVfx','drawShellBubble','cancelSnipe','drawWindTrail'].map(method).join('\n')+'\n}Scene');
function image(){return {active:true,visible:true,handlers:{},once(k,fn){this.handlers[k]=fn;return this;},destroy(){this.active=false;if(this.handlers.destroy)this.handlers.destroy();},setDepth(){return this;},setVisible(v){this.visible=v;return this;},setPosition(x,y){this.x=x;this.y=y;return this;},setDisplaySize(w,h){this.width=w;this.height=h;return this;},setAlpha(v){this.alpha=v;return this;},setOrigin(){return this;},setRotation(){return this;}};}
const a=new ArtScene(),created=[],tweens=[];Object.assign(a,{textures:{exists:()=>true},camWorld:o=>o,add:{image(){const o=image();created.push(o);return o;},graphics(){throw Error('Painted path must not allocate Graphics');}},tweens:{add(o){tweens.push(o);},killTweensOf(){}},player:{x:20,y:30},state:'play',elapsed:1,_shield:2});
a.drawShellBubble();const shield=a._shellArt;assert.equal(shield.x,20);assert.equal(shield.y,30);assert(shield.alpha<=.55);a._shield=0;a.drawShellBubble();assert(!shield.visible);
a._shield=1;a.player.x=40;a.drawShellBubble();assert(shield.visible);assert.equal(shield.x,40);assert.equal(created.length,1);
const aura=a.trackArtVfx(image());a._snipe={aura,g:image()};a.cancelSnipe();assert(!aura.active);assert.equal(a._snipe,null);
a.drawWindTrail(0,0,Math.PI/2,1500,30,1);assert.equal(created.length,2);assert.equal(tweens.length,1);assert(a._artVfx.size===2);
a.clearArtVfx();assert.equal(a._artVfx.size,0);assert(created.every(o=>!o.active));assert.equal(a._shellArt,null);
assert(source.includes("this.attachProjectileArt(b,'proj_mint_shard'"));
assert(source.includes("spawnFxAnim('fx_mint_shatter'"));assert(source.includes("spawnFxAnim('fx_mint_gale'"));
console.log('Painted VFX: shield follows/reuses/hides, charge cancellation, image wind trail and transition cleanup passed');
