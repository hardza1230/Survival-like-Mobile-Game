// v8.2.40 owner: mission spotlight once per mission per stage (was first 3 ever) + targets for Herald/Golem/Clean Air/Seed Rift · in-play banners: short title, one-line description under the mission bar
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const a=src.indexOf('const BANNER_LINE_MAX'),b=src.indexOf('const RUN_WAIT_MAX');const ctx={};vm.createContext(ctx);vm.runInContext(src.slice(a,b)+';this.f=bannerLine;this.M=BANNER_LINE_MAX;',ctx);
const f=ctx.f;
assert.strictEqual(f('Short one'),'Short one');
assert.strictEqual(f('It pulls you in and eats the plates — dash into a plate to make it choke!'),'Dash into a plate to make it choke!');
assert.strictEqual(f('Kill inside to keep it open · grab 🔮 splinters · open 🤲 chests'),'Kill inside to keep it open · grab 🔮 splinters');
const subs=[...src.matchAll(/showBanner\??\.?\('[^']*','([^']{59,})'/g)].map(m=>m[1]);assert(subs.length>20);
for(const t of subs){const l=f(t);assert(l.length>0&&l.length<=ctx.M,t);}
assert(src.includes("const run=this._qfRun||(this._qfRun={}); if(!force&&run[type])return;"),'once per stage');
assert(src.includes("this.rubyHide?.(true);this._rubyQ=[];this._qfRun={};"),'reset each stage');
assert(src.includes("if(type!=='hunt')this.questFocusWhenReady(o,type);"),'waits for targets');
for(const k of ["type==='grandmasGolem'&&this._sig","type==='seedRift'&&this._sig?.type==='seedRift'","type==='cleanAir'&&this._cleanAir?.v2"])assert(src.includes(k),k);
assert(src.includes("const inPlay=this.state!=='menu'&&this.state!=='title',"),'banner play mode');
console.log('Banner + spotlight 8.2.40: one-line descriptions, once per stage, late targets passed');
// v8.2.41 owner: after the mission deal, wait for the player (▶ Start or 🔄 Reroll) when a reroll is offered
assert(src.includes("if(!rb)T(base+n*DEAL_SHOW_MS+700,finish);"),'auto-start only without reroll');
assert(src.includes("'▶  Start the stage'"),'start button');
assert(src.includes("if(on(go)){")&&src.includes("if(!rb&&this.time.now-t0>350)finish();"),'tap outside does not skip the choice');
console.log('Mission deal 8.2.41: waits for Start or Reroll passed');
