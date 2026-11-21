// v8.2.50 เจ้าของ: เสียงพากย์บอสตอนสู้เบาไป → VO_BOSS_VOL (1.0 แทน .65) + duck เพลงเหลือ .42
const fs=require('fs'),assert=require('assert');const src=fs.readFileSync(__dirname+'/../game.js','utf8');
assert.ok(/const VO_BOSS_VOL=1;/.test(src));
assert.ok(src.includes("const bossVo=/^vo_b\\d/.test(key)&&scene.state==='play';")&&src.includes("volume:(bossVo?(typeof VO_BOSS_VOL!=='undefined'?VO_BOSS_VOL:1):.65)*Sfx.sv")&&src.includes("bossVo?.42:.7"),'boss voice louder in fights, music ducked more');
console.log('Boss VO 8.2.50 passed');
