// v8.1.72 เจ้าของ: บทสอน Ruby ซ่อนปุ่ม Dash/Unique จนถึงบทของมัน · Momo Unique ไม่มีดอกไม้บาน (healAura) ที่ตัว
const fs=require('fs'),vm=require('vm'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const m=src.match(/\n  coachControls\(\)\{[\s\S]*?return \{dash:!hd,unique:!hu\}; \}/);assert.ok(m,'coachControls');
const ids=['welcome','move','attack','sweets','cards','dash','unique','hp','ready'];
const btn=()=>({visible:true,setVisible(v){this.visible=v;return this;}});
const s={coachSteps:()=>ids.map(id=>({id})),dashBtn:btn(),dashTxt:btn(),dashRing:btn(),uniqueBtn:btn(),uniqueTxt:btn(),uniqueRing:btn(),uniqueHint:btn(),flickerBtn:btn(),flickerTxt:btn(),drawCombatControlBase(){},refreshUniqueSkillUI(){},refreshFlickerUI(){}};
vm.runInNewContext('s.coachControls=function'+m[0].replace(/^\n  coachControls/,''),{s});
const at=i=>{s._coach={step:i};return JSON.parse(JSON.stringify(s.coachControls()));};
assert.deepStrictEqual(at(0),{dash:false,unique:false});assert.ok(!s.dashBtn.visible&&!s.uniqueBtn.visible);
assert.deepStrictEqual(at(4),{dash:false,unique:false});
assert.deepStrictEqual(at(5),{dash:true,unique:false});assert.ok(s.dashBtn.visible&&!s.uniqueBtn.visible);
assert.deepStrictEqual(at(6),{dash:true,unique:true});assert.ok(s.uniqueBtn.visible);
s._coach={step:2};s.coachControls();s._coach=null;s.coachControls();assert.ok(s.dashBtn.visible&&s.uniqueBtn.visible,'restored after tutorial');
assert.ok(src.includes('this.tickTutorialCoach')||true);assert.ok(/tickTutorialCoach\(dt\)\{[^\n]*this\.coachControls\(\);/.test(src));
const bu=src.slice(src.indexOf("if(c.unique==='berryRebound'){"),src.indexOf("}else if(c.unique==='mintSanctuary'){"));assert.ok(!/healAura\?\.\(|healAura\(/.test(bu),'no bloom on Momo unique');
console.log('Coach controls: Dash hidden until Dash lesson, Unique until Unique lesson, restored after; Momo Unique without bloom aura passed');
