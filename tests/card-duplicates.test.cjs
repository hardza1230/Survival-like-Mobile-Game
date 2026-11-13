// v8.1.135 owner: level-up cards that did the same thing in one hero's pool were made distinct.
const fs=require('fs'),vm=require('vm'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
function grab(n){const i=src.indexOf('const '+n+'=')>=0?src.indexOf('const '+n+'='):src.indexOf('const '+n+' =');let j=src.indexOf('=',i)+1,d=0,k=j;for(;k<src.length;k++){const c=src[k];if(c==='{'||c==='[')d++;else if(c==='}'||c===']'){d--;if(d===0){k++;break;}}}return src.slice(j,k);}
const ctx={};vm.runInNewContext(['BASIC_ATTACKS','BASIC_PATHS','TARO_PROGRESSION'].map(n=>'var '+n+'='+grab(n)+';').join('')+'this.r={BASIC_ATTACKS,BASIC_PATHS,TARO_PROGRESSION}',ctx);
const {BASIC_ATTACKS:A,BASIC_PATHS:P,TARO_PROGRESSION:T}=ctx.r,up=(h,id)=>A[h].upgrades.find(u=>u.id===id),pu=(h,id)=>P[h].flatMap(p=>p.upgrades).find(u=>u.id===id);
assert(!/\+1 (immortal )?Minion|Recruit/.test(up('yuzu','family').headline+up('yuzu','family').desc),'Best Friends no longer adds a Minion');
assert.equal(up('yuzu','seedling').max,5);
assert(!/less damage/.test(pu('yuzu','p_bodyguard').desc),'Close Guard is not a second Loyal Guard');
assert(!/radius|reach/i.test(pu('yuzu','y_keepripe').desc),'Golden Finish is not a second Zest Splash');
assert(!/damage/i.test(T.smite.arc[2]),'Spark High Voltage is not a second power card');
assert(/u\.id==='seedling'\)\{const count/.test(src)&&!/u\.id==='seedling'\|\|u\.id==='family'/.test(src),'+1 Minion headline only on Minion Squad');
assert(/b\.path==='tempest'&&u\.id==='rate'\)continue/.test(src),'Sentry build skips Lightning Rhythm (same as Reserve Cell)');
assert(/Math\.min\(3,b0\.lv\.size\|\|0\)/.test(src)&&!/\(1\+\.1\*\(b0\.lv\.size\|\|0\)\)/.test(src),'Sniper Twin Seed = pierce, not damage');
console.log('Card duplicates: Yuzu Best Friends/Close Guard/Golden Finish, Momo Sniper Twin Seed, Taro Spark/Sentry distinct passed');
