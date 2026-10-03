const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const src=fs.readFileSync('game.js','utf8'),start=src.indexOf('  showStageSummary(last){'),end=src.indexOf('\n  adDoubleSugar()',start);
const ctx={STAGES:[{name:'Nectar Hive'}],Save:{cp:()=>({lvl:16}),power:()=>5220},currencyDef:k=>({asset:k,emoji:'*'}),COLORS:{pink:0}};vm.createContext(ctx);
const C=vm.runInContext('class Summary{'+src.slice(start,end)+'}\nSummary',ctx);
for(const [w,h] of [[390,844],[320,568],[844,390]]){
 const objects=[],s=new C();function item(x,y,text,style){const o={x,y,text,style,setOrigin(){return this;},setDisplaySize(width,height){this.width=width;this.height=height;return this;}};objects.push(o);return o;}
 Object.assign(s,{W:w,H:h,stageIndex:0,character:'mint',elapsed:407,stageKills:1813,sugarStage:2672,_dailyBonus:5,_orderReward:{qty:10,unit:'Thread'},_openedBoxes:[{},{}],_powerBefore:5190,_powerAfter:5220,_firstMastery:true,_lastLvlUps:1,_runCurrency:Object.fromEntries(Array.from({length:12},(_,i)=>['c'+i,i+1])),physics:{pause(){}},player:{setVelocity(){}},over:{removeAll(){},add(){},setVisible(){}},textures:{exists:()=>true},add:{rectangle:item,image:item,text:item},_endBtn(box,cx,cy,bw,bh){return{x:cx-bw/2,y:cy-bh/2,w:bw,h:bh};},stopSummaryPresentation(){},buildSummaryExpBar(){},animateSummaryRewards(){this.presentations=(this.presentations||0)+1;},continueFromSummary(){this.continued=true;},showRewardedAd(t,fn){fn();},adDoubleSugar(){this.doubled=true;}});
 s.showStageSummary(false);assert(objects.some(o=>o.text==='stage_summary_panel'));assert(objects.some(o=>o.text==='Lv 16 · +1 pts'));assert.equal(objects.filter(o=>typeof o.text==='string'&&/^x\d+$/.test(o.text)).length,12);
 const panel=objects.find(o=>o.text==='stage_summary_panel');assert(s._summaryBtns[0].y>=panel.y+panel.height/2,'x2 below result panel');
 for(const b of s._summaryBtns)assert(b.x>=0&&b.y>=0&&b.x+b.w<=w&&b.y+b.h<=h,'button in viewport');
 const l=objects.find(o=>o.text==='Character Level'),v=objects.find(o=>o.text==='Lv 16 · +1 pts');assert(l.x+l.style.wordWrap.width<v.x-v.style.wordWrap.width,'columns separated');
 s._summaryBtns[0].fn();assert(s.doubled);s._summaryBtns.at(-1).fn();assert(s.continued);s._summaryDoubled=true;s.showStageSummary(true);assert.equal(s._summaryBtns.length,1);assert.equal(s.presentations,1);
}
console.log('Stage summary: three viewports, long rows, level columns, 12 currencies, ad and continue callbacks passed');
