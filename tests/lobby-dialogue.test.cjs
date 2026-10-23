const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),src=fs.readFileSync('game.js','utf8');
function method(n){const a=src.indexOf('  '+n+'('),m=/\n  [A-Za-z_]\w*\([^\n]*\)\s*\{/.exec(src.slice(a+1));assert(a>=0&&m);return src.slice(a,a+1+m.index);}
const a=src.indexOf('const LOBBY_LINES='),end=src.indexOf('\n};',a)+3,ctx={Save:{data:{character:'momo'}},CHARACTERS:Object.fromEntries(['momo','mint','cocoa','taro','yuzu','sesame'].map(id=>[id,{name:id}]))};vm.createContext(ctx);
vm.runInContext(src.slice(a,end),ctx);
const C=vm.runInContext('class C{'+['tickLobbyVoice','stopHubMotion'].map(method).join('\n')+'\n}C',ctx);
function scene(hero){ctx.Save.data.character=hero;const c=new C(),g=new Proxy({},{get:()=>()=>g}),root={active:true,setVisible(v){this.visible=v;}},text={height:28,setText(t){this.value=t;}};Object.assign(c,{state:'menu',menuScreen:'hub',_lobbyVoice:{hero,root,g,label:{setText(t){this.value=t;}},text,width:220,t:0,showing:false}});return c;}
function advance(c,secs){for(let i=0;i<Math.ceil(secs*10);i++)c.tickLobbyVoice(.1);}
for(const id of Object.keys(ctx.CHARACTERS)){const c=scene(id),v=c._lobbyVoice,seen=[];for(let i=0;i<6;i++){advance(c,i?11:0.1);assert(v.root.visible);assert(!seen.includes(v.text.value));seen.push(v.text.value);assert(v.label.value.includes(i%2?'thinking':'says'));}assert.equal(seen.length,6);}
{const c=scene('momo');c._rubyTalk={};advance(c,5);assert.equal(c._lobbyVoice.root.visible,false);assert.equal(c._lobbyLineCursor,undefined);c._rubyTalk=null;advance(c,2);assert(c._lobbyVoice.root.visible);c.menuScreen='gear';advance(c,2);assert.equal(c._lobbyVoice.root.visible,false);c.stopHubMotion();assert.equal(c._lobbyVoice,null);}
{const c=scene('mint');advance(c,.1);const cursors=c._lobbyLineCursor;c.stopHubMotion();assert.equal(cursors.mint,1);}
console.log('Lobby dialogue: distinct six-line personality loops, speech/thought alternation, Ruby priority, navigation/rebuild cleanup passed');
