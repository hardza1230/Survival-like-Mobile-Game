// v8.0.23 Awards: 4 หมวด · ขั้น ★ · รับทีละขั้น · ฉายา/กรอบ · ติดตามสถิติใหม่
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const Save={data:{stageMastery:{},stageStars:{},bestiary:{},chars:[]},save(){},addSugar(n){this.s=(this.s||0)+n;},addThreads(n){this.t=(this.t||0)+n;},addShovels(n){this.sh=(this.sh||0)+n;}};
const ctx={Save,Math,Number,Object,String,CHARACTERS:{momo:{name:'Strawberry',emoji:'🍓'},mint:{name:'Mint',emoji:'🌿'}},HEROES_WIP:['sesame'],CHESTS:[{id:'silver'},{id:'gold'}],Sfx:{progress(k){ctx.cue=k;}}};vm.createContext(ctx);
vm.runInContext(src.slice(src.indexOf('const AW_CATS='),src.indexOf('\nconst ACHIEVEMENTS=['))+';this.R={AW_CATS,awardList,awReached,awClaimed,awReward,awReady,awFrames,awHidden};',ctx);
const {awardList,awReached,awClaimed,awReward,awReady,awFrames,awHidden}=ctx.R,d=Save.data;
{ const sec=awardList().filter(a=>a.secret); assert(sec.length>=5&&sec.length<=8,'5–8 secret awards'); const x=sec.find(a=>a.id==='sec_sugar'); assert(awHidden(x,{sugar:0,awards:{}})); assert(!awHidden(x,{sugar:100000,awards:{}})); assert(awReward(x,0).title,'secret gives a title'); }
let L=awardList();assert.deepEqual([...new Set(L.map(a=>a.cat))],['story','heroes','combat','collect']);
for(const c of [1,2,3])assert(L.find(a=>a.id==='ch'+c)&&L.find(a=>a.id==='stars'+c),'chapter clear + stars');
assert(L.find(a=>a.id==='hw_momo')&&L.find(a=>a.id==='hb_momo')&&!L.find(a=>a.id==='hw_mint'),'owned heroes only');
d.chars=['mint','sesame'];L=awardList();assert(L.find(a=>a.id==='hw_mint')&&!L.find(a=>a.id==='hw_sesame'),'new hero appears, WIP hidden');
assert(L.every(a=>a.tiers.every((t,i)=>!i||t>a.tiers[i-1])),'tiers increase');assert(L.every(a=>a.title),'every award has a title');
assert.equal(new Set(L.map(a=>a.id)).size,L.length);
d.chars=[];const ch1=L.find(a=>a.id==='ch1');assert.equal(awReached(ch1,d),0);assert(!awReady(d));d.chars=['mint'];d.stageMastery={0:1,1:1};assert.equal(awReached(ch1,d),2);assert(awReady(d));
d.stageStars={0:7,1:3};assert.equal(L.find(a=>a.id==='stars1').val(d),5);
d.bestiary={boss0:2,mini1:3,e_basic:200};assert.equal(L.find(a=>a.id==='kills').val(d),205);assert.equal(L.find(a=>a.id==='bosses').val(d),2);assert.equal(L.find(a=>a.id==='minis').val(d),3);
d.heroWins={momo:{wins:3,builds:{sniper:1,shotgun:1}}};assert.equal(awReached(L.find(a=>a.id==='hb_momo'),d),2);
assert.deepEqual({...awReward(ch1,0)},{sugar:80,shovel:2});assert.equal(awReward(ch1,3).chest,'gold');assert(awReward(ch1,4).title);assert(awReward(L.find(a=>a.id==='hb_momo'),2).title,'last tier of a 3-tier award gives the title');
// claim one tier at a time via the real method
const m=src.slice(src.indexOf('  awClaim(a){'),src.indexOf('\n',src.indexOf('  awClaim(a){')+400));
const cls=vm.runInContext('(class{'+src.slice(src.indexOf('  awClaim(a){'),src.indexOf('  buildSettings(){'))+'})',ctx);const sc=new cls();Object.assign(sc,{showBanner(){},buildAchievements(){},openChest(c,f){sc.chest=f;}});
d.awards={};d.titles=[];sc.awClaim(ch1);assert.equal(d.awards.ch1,1);assert.equal(Save.s,80);sc.awClaim(ch1);assert.equal(d.awards.ch1,2);assert.equal(Save.t,20);sc.awClaim(ch1);assert.equal(d.awards.ch1,2,'cannot claim past reached tier');assert.equal(ctx.cue,'achievement');
d.stageMastery={0:1,1:1,2:1,3:1,4:1};sc.awClaim(ch1);sc.awClaim(ch1);assert.equal(sc.chest,'gift','★4 = free gold chest');sc.awClaim(ch1);assert.deepEqual(d.titles,['Nest Breaker']);assert.equal(d.title,'Nest Breaker');assert.deepEqual(awFrames(d),['story']);
for(const k of ["Save.data.kicks=(Save.data.kicks||0)+1","Save.data.uniqueCasts=(Save.data.uniqueCasts||0)+1","d.chestsOpened=(d.chestsOpened||0)+1","r.builds[pth]=1","if(target==='achievements')return awReady(d);","' · '+d.title"])assert(src.includes(k),'hook '+k);
console.log('Awards: 4 categories, owned-hero awards, increasing ★ tiers, stats, one-tier claims with Sugar/Thread/Gold Chest/title, frames and tracking hooks passed');
{ const g=src.slice(src.indexOf('  buildAchievements('),src.indexOf('  awClaim(a){'));
  assert(g.includes("tag='aw_claim_all'")&&g.includes('awClaimAll()'),'Claim all button');
  assert(g.includes("if(cat==='heroes')")&&g.includes("tag='aw_hero_'+a.group")&&g.includes('this._awOpen'),'one row per hero, tap to expand');
  assert(g.includes("'??? Secret award'"),'secret names hidden');
  assert(/awClaimAll\(\)\{[^\n]*\n[^\n]*\n[^\n]*if\(r\.chest\)break;/.test(g),'Claim all skips Gold Chest steps');
  assert(src.includes("if(c.id==='silver'&&tier==='legend')(d.secrets||(d.secrets={})).silverLegend=1;")&&src.includes("if((g.gameSpeed||1)>=4)sc.x4=1;"),'secret tracking hooks'); }
console.log('Awards v8.0.28: Claim all, secrets, hero rows passed');
