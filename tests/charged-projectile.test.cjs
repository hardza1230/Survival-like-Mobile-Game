const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const source=fs.readFileSync('game.js','utf8');
function method(n){const at=source.indexOf('  '+n+'('),tail=source.slice(at+1),next=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);return source.slice(at,at+1+next.index);}
const Scene=vm.runInNewContext('class Scene{'+['getBullet','attachChargedSeed','killBullet'].map(method).join('\n')+'\n}Scene');
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
