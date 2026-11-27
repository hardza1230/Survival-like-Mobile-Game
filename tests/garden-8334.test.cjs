// v8.3.34 owner plan E+B: Mochi Garden replaces Expedition — trips, rewards, helpers, camp, migration
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),s=fs.readFileSync('game.js','utf8');
const cfg=s.slice(s.indexOf('const GARDEN_ON=true;'),s.indexOf("const GARDEN_CARDS="));const ctx={Math};vm.createContext(ctx);vm.runInContext(cfg.replace(/^const /gm,'var '),ctx);
const J=x=>JSON.stringify(x);assert.equal(J(ctx.GARDEN_ZONES.map(z=>[z.sugar,z.cream,z.open])),J([[60,.5,5],[100,1,10],[150,1.5,15]]));
assert.equal(J(ctx.GARDEN_TRIP_H),J([1,4,8]));assert.equal(ctx.GARDEN_HERO_BONUS,.15);assert.equal(ctx.GARDEN_BOX_P,.08);assert.equal(ctx.GARDEN_CARD_P,.15);assert.equal(ctx.GARDEN_HELPERS.length,15);
assert.equal(J(ctx.GARDEN_CAMP.slice(1).map(c=>c.cost)),J([500,1500,4000,10000]));assert.equal(J(ctx.GARDEN_CAMP.map(c=>c.bonus)),J([0,.1,.2,.3,.45]));assert.equal(ctx.GARDEN_CAMP[2].slots,3);assert.equal(ctx.GARDEN_CAMP[4].long,12);
function method(n){const a=s.indexOf('\n  '+n+'(');assert(a>0,n);const t=s.slice(a+3),m=/\n  [A-Za-z_]\w*\(/.exec(t);return t.slice(0,m.index);}
const G=vm.runInNewContext('({'+['gardenCampInfo','gardenHelperLv','gardenMods','gardenEstimate'].map(method).join(',\n')+'})',{GARDEN_CAMP:ctx.GARDEN_CAMP,GARDEN_SLOTS:2,GARDEN_TRIP_H:[1,4,8],GARDEN_HELPER_XP:ctx.GARDEN_HELPER_XP,GARDEN_HELPERS:ctx.GARDEN_HELPERS,GARDEN_ZONES:ctx.GARDEN_ZONES,GARDEN_HERO_BONUS:.15,GARDEN_LONG_BONUS:.1,GARDEN_BOX_P:.08,GARDEN_CARD_P:.15,Math,Save:{garden:()=>({camp:{},help:{}})}});
const z=ctx.GARDEN_ZONES[0];assert.equal(G.gardenEstimate(z,['momo'],[],4).sugar,276,'60×4×1.15');assert.equal(G.gardenEstimate(z,['a','b','c'],[],8).sugar,Math.round(60*8*1.45*1.1),'3 heroes + long trip');
assert.equal(G.gardenEstimate(z,['momo'],['h0'],1).sugar,Math.round(60*1.15*1.05),'Sugar helper +5%');
assert(s.includes("buildDig(){ if(typeof GARDEN_ON!=='undefined'&&GARDEN_ON)return this.buildGarden();"),'Expedition route opens the garden');
assert(s.includes("expReady(){ if(typeof GARDEN_ON!=='undefined'&&GARDEN_ON)return this.gardenReady();"),'red dot = trip done or zone idle');
assert(s.includes("if(e&&e.crumbs>0){ d.sugar=clampSugar((d.sugar||0)+Math.floor(e.crumbs)); e.crumbs=0; }")&&s.includes("addCrumbs(n){ if(typeof GARDEN_ON!=='undefined'&&GARDEN_ON){ this.addSugar("),'Crumbs become Sugar');
assert(s.includes("if(now<t.start)t.start=now;"),'clock rollback cannot finish a trip early');
assert(s.includes("dig:'🌸 Mochi Garden'")&&s.includes("['dig','🌸','Mochi Garden','Send heroes on trips · collect while away']"),'renamed everywhere');
console.log('Mochi Garden 8.3.34: zones/rates, camp, helpers, estimates, route, red dot, crumbs, clock guard, names passed');
