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
// v8.1.122 owner: lobby flicker + "Preparing 0% 2%" loop after a GPU out-of-memory reload (stuck low-mem, budget below the lobby's need → evict/reload thrash).
assert(s.includes("localStorage.getItem('mochi_lowmem_reset122')")&&s.includes("_lowMemFlag||Number(navigator.deviceMemory||8)<=4)?340:"),'low-mem reset once + higher floor');
assert(method('texEvict').includes('_now-(_A[k]||0)<20000)continue;'),'recently loaded art is never evicted');
const lg=method('loopGuard');assert(lg.includes("this.textures.on('addtexture',k=>{ (this._texAddT||(this._texAddT={}))[k]=Date.now(); })")&&lg.includes('if(++burst>20)')&&lg.includes('location.reload()')&&!lg.includes('resetTextures'),'burst of crashes = save + reload');
assert(method('buildLobby').includes("this.texEvict?.(k=>k.startsWith('bk_'),null)"),'book art freed after the lobby');
console.log('memory thrash guards ok');
// v8.1.127 stability: Lobby GPU 431 → ~282 MB (headless): prefetch downloads only (no GPU decode), menu soft cap 300 MB, book art freed with retries.
assert(method('menuPrefetch').includes('fetch(verUrl(u))')&&!method('menuPrefetch').includes('this.ensureGroup('),'prefetch never decodes into GPU');
assert(s.includes('const MENU_TEX_SOFT_MB=300;')&&s.includes("if(this.texMB()>MENU_TEX_SOFT_MB)this.texEvict((k,c)=>c==='menu',MENU_TEX_SOFT_MB);"),'menu soft cap');
assert(method('buildLobby').includes("if((n||0)<4)free((n||0)+1);"),'book art freed with retries');
console.log('lobby memory ok');
