const fs=require('fs'),vm=require('vm'),assert=require('assert'),crypto=require('crypto');
const root=__dirname+'/../',src=fs.readFileSync(root+'game.js','utf8');
const manifest=JSON.parse(fs.readFileSync(root+'assets/incoming/audio_a22/MANIFEST.json','utf8'));
const order=fs.readFileSync(root+'docs/audio_orders/A22_BOSS_TWISTS_ROOT_RIFT.md','utf8');
const lines=new Map([...order.matchAll(/\| `(vo_ruby_[^`]+)` \| ([^|]+) \|/g)].map(m=>[m[1],m[2].trim()]));
assert.equal(manifest.length,28);assert.equal(lines.size,8);
for(const r of manifest){
 const data=fs.readFileSync(root+'assets/incoming/audio_a22/'+r.file);
 assert.equal(data.length,r.bytes);assert.equal(crypto.createHash('sha256').update(data).digest('hex'),r.sha256);
 const url='assets/audio/'+(r.kind==='voice'?'acting/':'sfx/a22/')+r.key+'.mp3';assert(fs.statSync(root+url).size>1000);assert(src.includes(url));
 if(r.kind==='voice'){assert.equal(r.text,lines.get(r.key));assert.equal(r.voice_id,'GVG9R2Ywg9D3iQVsW8Z6');assert(src.includes('"'+r.key+'":{"url":"'+url+'","text":'+JSON.stringify(r.text)));}
 assert(r.peakDbtp<=-1);
}
// Extract actual methods, rather than duplicating event implementation in this test.
const grab=n=>{const i=src.indexOf('\n  '+n+'(');assert(i>0,n);let end=src.indexOf('\n',i+1);while(src.startsWith('\n    ',end))end=src.indexOf('\n',end+1);return src.slice(i+3,end);};
const played=[],loops=[],stopped=[],voices=[],Save={data:{settings:{}}};
const Sfx={card(){played.push('fallback_card');},eventLoopStart(k,v){loops.push([k,v]);},eventLoopStop(k){stopped.push(k);}};
const VoiceActing={play(scene,key,valid,owner){voices.push({scene,key,valid,owner});return true;},stop(owner){stopped.push(owner);}};
const context={Math,Sfx,Save,VoiceActing,BOSS_TWIST_DUR:15,BOSS_TWIST_DEF:{roots:{emoji:'',name:'Roots',desc:''}}};
const C=vm.runInNewContext('class C{'+['a22Voice','a22RootLoop','bossTwistStart','clearCrownRoot'].map(grab).join('\n')+'};C',context);
const s=new C();Object.assign(s,{state:'play',_rubyEpoch:1,add:{},realTex(){return false;},a12(k){played.push(k);return k!=='a22_twist_roots';}});
const twist=s.bossTwistStart('roots');assert.deepEqual(played,['a22_twist_roots','a18_boss_mission']);assert.equal(voices[0].key,'vo_ruby_twist_roots');assert(voices[0].valid());
s._twist=null;assert(!voices[0].valid(),'late voice is rejected after twist ends');
s.bossTwistStart('roots');assert.equal(voices.length,1,'each twist voice once per stage/run');
Save.data.settings.noRuby=true;assert.equal(s.a22Voice('vo_ruby_perfect',()=>true,s,'perfect'),false);Save.data.settings.noRuby=false;
s.a22Voice('vo_ruby_perfect',()=>true,s,'perfect');const perfect=voices.at(-1);s._rubyEpoch++;assert(!perfect.valid(),'late audio from old stage is rejected');
let shutdown;Object.assign(s,{events:{once(n,fn){assert.equal(n,'shutdown');shutdown=fn;}},_lure:{heads:[{st:'warn',t:0},{st:'burrow',t:.1}]}});
s.a22RootLoop();assert.equal(loops.at(-1)[0],'a22_root_burrow');s.state='paused';s.a22RootLoop();assert.equal(stopped.at(-1),'a22_root_burrow');s.state='play';s.a22RootLoop();assert.equal(loops.length,2,'resume restarts only the shared root loop');
s._lure.fin={};s.a22RootLoop();assert.equal(stopped.at(-1),'a22_root_burrow');shutdown();assert.equal(s._a22Shutdown,false);
s.clearCrownRoot();assert.equal(s._lure,null);assert(stopped.includes('a22_root_burrow'));
// Rift warning must precede opening and not consume the existing event duration.
const constants=src.match(/const SR_EVENT_WARN=[^\n]*\n/)[0];
const R=vm.runInNewContext(constants+'class R{'+['seedRiftEventStart','seedRiftEventRun','seedRiftEventEnd'].map(grab).join('\n')+'};R',{Math,TAU:Math.PI*2,Sfx,VoiceActing});
const cue=[],vo=[];const obj=()=>({active:true,setStrokeStyle(){return this;},setDepth(){return this;},setVisible(){return this;},setAlpha(){return this;},setRadius(){return this;},destroy(){this.active=false;}});
const r=new R();Object.assign(r,{state:'play',mode:'wave',stageIndex:6,add:{circle:obj},camWorld(x){return x;},realTex(){return false;},a12(k){cue.push(k);return true;},a22Voice(k,valid){vo.push({k,valid});}});
const ev=r.seedRiftEventStart(),duration=ev.t;r.seedRiftEventRun(ev,1.49);assert.deepEqual(cue,['a22_rift_warn']);assert.equal(ev.t,duration);
r.seedRiftEventRun(ev,.02);assert.deepEqual(cue,['a22_rift_warn','a22_rift_open']);assert.equal(vo[0].k,'vo_ruby_rift_event');assert(vo[0].valid());assert(Math.abs(ev.t-(duration-.02))<1e-8);
r.seedRiftEventEnd(true);assert.equal(cue.at(-1),'a22_rift_close');assert(!vo[0].valid());assert(stopped.includes(ev));
const before=cue.length;r._srEv={carriers:[],objs:[]};r.seedRiftEventEnd(false);assert.equal(cue.length,before,'cancel does not play success close');
const preload=grab('preloadAll'),defer=grab('ensureDeferred');
assert(preload.includes("if(k.startsWith('sfx_a22_'))continue;"));assert(defer.includes("if(k.startsWith('sfx_a22_'))continue;"));
assert(grab('ensureStageAudio').includes("if(idx>=5)keys.push(...Object.keys(ASSET_AUDIO).filter(k=>k.startsWith('sfx_a22_')))"));
for(const k of ['seed_pop','seed_hatch','fruit_splat','twist_survive','root_warn','root_strike','anchor_break','perfect_dodge','root_combo','head_burst','rift_feed'])assert(src.includes("'a22_"+k+"'"),k);
assert(grab('crownRootFinTick').includes("Sfx.a21?.('hit_plant'"));
console.log('A22: 28 source/runtime files, exact Ruby text, fallback, once/epoch/noRuby guards, loop lifecycle and warning/open/close ordering passed');
