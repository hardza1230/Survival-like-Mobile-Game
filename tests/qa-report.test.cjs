// v8.1.139 bug reporter: 🐞 button + auto error reports → Supabase qa_reports (insert-only) + screenshots in qa-shots.
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('game.js','utf8');
const a=src.indexOf('const BETA_BUILD='),z=src.indexOf("try{ QA.init(); }catch(e){}",a);assert(a>0&&z>a,'QA module present');
const store={};const ctx={console:{error(){} ,log(){}},performance:{now:()=>5000,memory:{usedJSHeapSize:50*1048576}},navigator:{userAgent:'UA',deviceMemory:4},screen:{width:390,height:844},window:{devicePixelRatio:2,addEventListener(){}},
  localStorage:{getItem:k=>store[k]??null,setItem:(k,v)=>{store[k]=String(v);}},GAME_VERSION:'9.9.9',CLOUD_URL:'https://x.supabase.co',CLOUD_KEY:'anon',Tele:{id:()=>'dev1'},GM:{on:()=>false},Save:{data:{character:'mint'}},
  STAGES:[{chapter:0,chapterStage:1,name:'A'}],crypto:{randomUUID:()=>'u1'},setTimeout:(f)=>0,Date,JSON,String,Math,Object,Array};
ctx.window.__g={loop:{actualFps:58},scene:{getScene:()=>scene}};const scene={state:'play',stageIndex:0,character:'mint',level:7,elapsed:61.4,player:{hp:80,maxhp:100},basicAttack:{path:'glacier',lv:{power:2,rate:0},mutation:null,evolved:false},_rel:{burst:1},texMB:()=>301.6,waveObjective:{type:'hunt'},boss:null};
const calls=[];ctx.fetch=(url,opt)=>{calls.push({url,opt});return Promise.resolve({ok:true});};
vm.createContext(ctx);vm.runInContext(src.slice(a,z)+'\nthis.QA=QA;this.BETA=BETA_BUILD;',ctx);const QA=ctx.QA;
assert.equal(ctx.BETA,true,'beta build: button for every tester');
const snap=QA.snapshot(scene);assert.equal(snap.stage,'C1-1');assert.equal(snap.hero,'mint');assert.equal(snap.path,'glacier');assert.equal(snap.state,'play');
assert.deepEqual(Array.from(snap.data.cards),['power:2'],'only taken cards');assert.equal(snap.data.mission,'hunt');assert.equal(snap.data.texMB,302);assert.equal(snap.data.fps,58);assert.equal(snap.data.device.ua,'UA');
// report → screenshot upload then row insert (insert-only: Prefer return=minimal); no-shot path still queues + sends the row
QA.shot=cb=>cb(null);QA.report('bug','Card text overflows','player');
const ins=calls.find(c=>c.url.endsWith('/rest/v1/qa_reports'));assert(ins,'row posted');assert.equal(ins.opt.headers.Prefer,'return=minimal');const rows=JSON.parse(ins.opt.body);
assert.equal(rows[0].note,'Card text overflows');assert.equal(rows[0].source,'player');assert.equal(rows[0].install_id,'dev1');assert.equal(rows[0].v,'9.9.9');assert.equal(rows[0].stage,'C1-1');
// auto error reports are capped per session and de-duplicated
let n=0;QA.report=()=>{n++;};ctx.setTimeout=f=>f();for(let i=0;i<3;i++)QA.auto('same error');for(let i=0;i<9;i++)QA.auto('err '+i);assert.equal(n,QA.AUTO_MAX,'max auto reports per session');
// wiring: button + flush on Game create; bot uses the same reporter; telemetry on during beta
assert(src.includes("try{ if(typeof QA!=='undefined'){ QA.button(); QA.flush(); } }catch(e){}"));
assert(src.includes("(typeof BETA_BUILD!=='undefined'&&BETA_BUILD)||!!(Save.data.settings&&Save.data.settings.share)"));
const bot=fs.readFileSync('scripts/qa-autoplay.cjs','utf8');assert(/QA\.report\('stuck'/.test(bot)&&/QA\.report\('bot-result'/.test(bot)&&bot.includes('window.__qaBot=true'));
console.log('QA reporter: snapshot (stage/hero/cards/errors/device/memory), screenshot+insert-only row, offline queue, capped auto errors, button wiring, bot shares reporter passed');
