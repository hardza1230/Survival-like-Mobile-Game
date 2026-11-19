// v8.2.23 ใบ 85 ของในภารกิจ: MANIFEST + ไฟล์แพ็ก + คีย์ stage-lazy + จุดผูก (มีภาพ = ใช้ภาพ · ไม่มี = ของเดิม)
const fs=require('fs'),path=require('path'),crypto=require('crypto'),assert=require('assert'),vm=require('vm');const root=path.join(__dirname,'..'),src=fs.readFileSync(root+'/game.js','utf8');
const m=n=>{const i=src.indexOf('\n  '+n+'(');assert.ok(i>0,n);const r=/\n  [A-Za-z_$][\w$]*\(/g;r.lastIndex=i+4;const x=r.exec(src);return src.slice(i,x?x.index:undefined);};
const rows=JSON.parse(fs.readFileSync(root+'/assets/incoming/mission85/MANIFEST.json','utf8'));assert.strictEqual(rows.length,12);
for(const r of rows){ const b=fs.readFileSync(root+'/assets/incoming/mission85/'+r.file);assert.strictEqual(b.length,r.bytes,r.key);assert.strictEqual(crypto.createHash('sha256').update(b).digest('hex'),r.sha256,r.key);
  const w=fs.readFileSync(root+'/assets/art/mission85/'+r.key+'.webp');assert.ok(w.slice(0,4).toString()==='RIFF'&&w.slice(8,12).toString()==='WEBP',r.key);
  assert.ok(src.includes(r.key+":{url:'assets/art/mission85/"+r.key+".webp'"),'registered '+r.key); }
assert.ok(/fp85\|mp85\|ll85\|ult85\|hs85\|hh85\|/.test(src),'stage-lazy class');assert.ok(m('missionArtKeys').includes("const M85={0:['hh85_','hh87_'],3:['fp85_']"),'loaded with the mission home stage (+ Ch2 side missions)');
const F=m('fpCrate');assert.ok(F.includes("this.realTex?.('fp85_crates')?this.artSpr('fp85_crates'")&&F.includes('const box=!spr&&'),'crate art or old box');
assert.ok(m('fpCrateGone').includes('c.spr.setFrame?.(c.row*3+2)')&&m('fpTick').includes('c.spr?.setFrame?.(c.row*3+1)'),'painted / broken frames');
assert.ok(m('fpOpen').includes("c85?'fp85_captain_statue':'fp_statues'")&&m('fpOpen').includes("g85?'fp85_general_statue':'fp_statues'"),'statues');
assert.ok(m('mpShadeTick').includes("this.artFollow?.(e,'mp85_shade',90)")&&m('llExtrasTick').includes("this.artFollow?.(e,'ll85_moth',56)")&&m('hsExtrasTick').includes("this.artFollow?.(e,'hs85_sapper',64)"),'follow art on shade/moth/sapper');
assert.ok(m('llExtrasTick').includes("this.sigArt('ll85_light_wisp'")&&m('hsExtrasTick').includes("this.sigArt('hs85_supply_crate'"),'wisp + supply crate');
assert.ok(m('ultPad').includes("'ult85_curse_pads'")&&m('ultPad').includes('pf=ci>=6?ci-6:'),'new curse pads use frames 0–1');
const H=m('hhTick');assert.ok(H.includes("this.artSpr('hh85_beam'")&&H.includes('g?.lineBetween?.(H.x,H.y,e.x,e.y)'),'beam art or drawn line');assert.ok(H.includes("'hh85_empower_aura'")&&H.includes('S.auras.length<12')&&H.includes("'hh85_minion_icons'"),'aura pool + minion icons');
console.log('Art order 85: 12 sheets packed, stage-lazy, wired with fallbacks passed');
