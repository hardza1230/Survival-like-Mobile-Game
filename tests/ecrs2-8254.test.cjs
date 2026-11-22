// v8.2.54 ECRS รอบ 2 (เจ้าของอนุมัติ 22 พ.ย. · ข้อมูลผู้เล่นจริงจาก run_stats): E1 Inbox · E2 Miners · E3 Daily chest ของ Expedition · E4 Play Stats/Combat Meter · E5 Ranking · S1 กล่อง Gear จ่ายด้วย Sugar · S4 Ch1 ไม่มี Run trait/Mimic
const fs=require('fs'),assert=require('assert'),vm=require('vm');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const m=n=>{const i=src.indexOf('\n  '+n+'(');assert.ok(i>0,n);const r=/\n  [A-Za-z_$][\w$]*\(/g;r.lastIndex=i+4;const x=r.exec(src);return src.slice(i,x?x.index:undefined);};
// flags
for(const f of ['const GEAR_INBOX_ON=false;','const RANKING_ON=false, DEV_STATS_ON=false;','const MINERS_ON=false;','const EXP_DAILY_ON=false;','CH1_CALM_UNTIL = 5;'])assert.ok(src.includes(f),f);
// E1: overflow → bag (protected) or salvage · no inbox
const R=m('receiveGearInstance');assert.ok(R.includes("if(typeof GEAR_INBOX_ON!=='undefined'&&!GEAR_INBOX_ON){ if(protectedItem){ this.data.gearItems.push(item)"),'protected overflow goes to the bag');
assert.ok(src.includes("if(!this.data._inbox8254&&")&&src.includes("for(const it of ib)if(it){ it.isNew=true; this.data.gearItems.push(it); } this.data.gearInbox=[];"),'old inbox items moved to the bag once');
assert.ok(src.includes("if(t==='gearInbox'&&typeof GEAR_INBOX_ON!=='undefined'&&!GEAR_INBOX_ON)return false;"),'Inbox / Mail button hidden');
// E2: miners migration runs on a fake save
{ const i=src.indexOf("    if(!this.data._miners8254){");const blk=src.slice(i,src.indexOf('\n',i));const ctx={Date,Math,MINER_LEVELS:[null,{rate:3,cap:8,cost:300},{rate:5,cap:10,cost:600}]};vm.createContext(ctx);
  ctx.self={data:{threads:10,miners:{lv:2,at:Date.now()-2*3600e3,store:4}}};vm.runInContext('(function(){'+blk+'\n}).call(self)',ctx);const d=ctx.self.data;
  assert.strictEqual(d.threads,10+14,'stored + 2h of mining paid out (4 + 5×2)');assert.strictEqual(d.miners.lv,0,'miners stopped');assert.strictEqual(d.exp.mb,2,'level → permanent Expedition crumb bonus'); }
assert.ok(m('expKill').includes('*(1+.1*Math.min(5,e.mb||0))'),'Expedition crumbs +10% per old miner level');
// E3: daily chest gone
assert.ok(src.includes("expDailyReady(){ if(typeof EXP_DAILY_ON!=='undefined'&&!EXP_DAILY_ON)return false;"),'no daily chest / red dot');
assert.ok(src.includes("{id:'m_dig',k:'dig'"),'Expedition still in Daily Quests');
// E4/E5
assert.ok(m('buildSettings').includes("...((typeof DEV_STATS_ON!=='undefined'&&!DEV_STATS_ON&&!(typeof GM!=='undefined'&&GM.on()))?[]:[{k:'stats'"),'Play Stats only for GM');
assert.ok(m('rewardsTabs').includes("...((typeof RANKING_ON==='undefined'||RANKING_ON)?[['ranking','👑 Ranks',false]]:[])")&&m('rewardsTabs').includes('nT=(typeof RANKING_ON'),'Ranking tab hidden, 3 tabs fill the row');
// S1: chests cost Sugar
{ const ctx={Math,GACHA_LEVELS:[{cost:150},{cost:320}],gachaMaxBand:()=>1};vm.createContext(ctx);vm.runInContext(src.match(/function chestSugarCost\(c\)\{[^\n]*\}/)[0]+';this.f=chestSugarCost;',ctx);
  assert.strictEqual(ctx.f({id:'silver'}),450);assert.strictEqual(ctx.f({id:'gold'}),1280); }
const O=m('openChest');assert.ok(O.includes('const cs=chestSugarCost(c); if((d.sugar||0)<cs)return; d.sugar=(d.sugar||0)-cs;')&&!O.includes('d.threads=Save.threads()-c.cost'),'chests never take Thread');
assert.ok(!m('buildChestShop').includes("'Open · 🧶 '"),'no Thread price on chest buttons');
// S4
assert.ok(m('rollRunTrait').includes("(this.stageIndex||0)<(typeof CH1_CALM_UNTIL!=='undefined'?CH1_CALM_UNTIL:5))return;"),'no run trait in Chapter 1');
console.log('ECRS2 8.2.54: Inbox→bag, Miners→Expedition bonus, no Expedition daily chest, dev stats/ranking hidden, Sugar chests, calm Chapter 1 passed');
