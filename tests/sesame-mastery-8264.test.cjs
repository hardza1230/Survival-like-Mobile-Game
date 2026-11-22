// v8.2.64 owner: Sesame spells grow in number per run (Spell Mastery), Tidal Serpent becomes a small minion, Prismatic Armament shows an icon + extra flares.
const fs=require('fs'),vm=require('vm'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const a=src.indexOf('const SES_MASTERY_AT='),b=src.indexOf('function sesRunePush(');const ctx={};vm.createContext(ctx);vm.runInContext(src.slice(a,b)+';this.L=sesMasteryLv;',ctx);
assert.deepStrictEqual([0,2,3,6,7,11,12,17,18,40].map(ctx.L),[1,1,2,2,3,3,4,4,5,5],'Lv by casts 3/7/12/18');
for(const h of["q.cnt=r.key==='ppp'?3+(mlv-1)","q.index<(q.cnt||3)","for(let arm=0,na=q.cnt||3;arm<na;arm++)","q.life=6+(mlv-1);q.minion=true;","sesRuneExtras(s,q,r,mlv){","if(s.actors.length>=8)return null;","s.tideBurst=mlv>=5","e._decoyT=2.6","Lv'+nl+'!'","'★'.repeat(","+(s.empowerT>0?2:0)","s.armIcon","q.next=.9"])assert(src.includes(h),h);
console.log('Sesame mastery 8.2.64: Lv thresholds, multitude per spell, serpent minion, extras within actor cap, armament icon + flares passed');
