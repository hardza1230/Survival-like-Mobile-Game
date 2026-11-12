// v8.1.117 owner: C1-1 clear → Lobby froze. Removing a placeholder texture still on screen killed the WebGL loop ('glTexture' of null).
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');const s=fs.readFileSync('game.js','utf8');
function method(n){const at=s.indexOf('  '+n+'('),tail=s.slice(at+1),nx=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(tail);assert(at>=0&&nx,n);return s.slice(at,at+1+nx.index);}
assert.equal((s.match(/this\.textures\.remove\(k\); \['_idle','_walk'\]/g)||[]).length,1,'only texSafeRemove drops placeholders directly');
assert.equal((s.match(/this\.texSafeRemove\(k\)/g)||[]).length,3,'preloadAll, ensureGroup, ensureDeferred use the safe path');
assert(s.includes('  create(){\n    this.loopGuard?.();\n    this._sesRuneButtons=null;'),'loop guard installed in the Game scene');
const C=vm.runInContext('class C{'+['texSafeRemove','texHeal','loopGuard'].map(method).join('\n')+'}C',vm.createContext({console:{error(){}}}));
const list={a:1},ev={};const textures={list,exists:k=>k in list,remove(k){delete list[k];},on(n,f){ev[n]=f;},get:k=>({has:f=>f===3})};
const spr=k=>({texture:{key:k},frame:{name:3,source:{}},scene:{},setTexture(k2,f){this.texture={key:k2};this.f=f;return this;},anims:{stop(){}}});
const o=spr('a'),other=spr('b');list.b=1;const sc=new C();Object.assign(sc,{textures,anims:{exists:()=>false},game:{scene:{getScenes:()=>[{children:{list:[{list:[o]},other]}}]}}});
sc.texSafeRemove('a');assert.equal(o.texture.key,'__DEFAULT');assert.equal(other.texture.key,'b');assert(!('a' in list));
list.a=1;ev.addtexture('a');assert.equal(o.texture.key,'a');assert.equal(o.f,3,'real art restored with the same frame');
const bad=spr('gone');bad.frame.source=null;sc.game.scene.getScenes=()=>[{children:{list:[bad,other]}}];list.gone=1;assert.equal(sc.texHeal(),1);assert.equal(bad.texture.key,'__DEFAULT');assert.equal(other.texture.key,'b');
let calls=0;const L={callback(){calls++;throw new Error('glTexture');}};sc.game.loop=L;sc.game.renderer={resetTextures(){}};sc.loopGuard();sc.loopGuard();L.callback(0,16);L.callback(0,16);assert.equal(calls,2,'guard wraps once and swallows the crash');
console.log('texture safety ok');
