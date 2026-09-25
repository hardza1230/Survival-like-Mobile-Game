// สร้างเสียงสั้นแบบ "ท่อนดนตรี" (ไม่วนลูป) ด้วยเครื่อง synth เดียวกับเพลง → WAV stereo
// ใช้:  node scripts/gen_stingers_synth.cjs OUT_DIR
//       python3 scripts/encode_mp3.py OUT_DIR assets/audio/sfx/gen 128
'use strict';
const path = require('path'), fs = require('fs');
const S = require('./gen_bgm_synth.cjs');
const { SR, Mix, note, wide, kick, snare, tom, timpani, crash, reverb, writeWav } = S;

// เรนเดอร์ครั้งเดียว + รีเวิร์บ + normalize + ตัดหางเงียบ
function renderOnce(sec, fn, room = 0.8, wet = 0.8) {
  const mix = new Mix(sec);
  fn(mix);
  reverb(mix, room, 0.3, wet);
  let peak = 0; for (let i = 0; i < mix.n; i++) peak = Math.max(peak, Math.abs(mix.L[i]), Math.abs(mix.R[i]));
  let end = mix.n - 1; while (end > 0 && Math.abs(mix.L[end]) < peak * 0.003 && Math.abs(mix.R[end]) < peak * 0.003) end--;
  const n = end + 1, L = mix.L.slice(0, n), R = mix.R.slice(0, n), fade = Math.floor(0.25 * SR);
  for (let i = 0; i < n; i++) { const f = i > n - fade ? (n - i) / fade : 1; L[i] = Math.tanh(L[i] / peak * 1.4) / Math.tanh(1.4) * 0.9 * f; R[i] = Math.tanh(R[i] / peak * 1.4) / Math.tanh(1.4) * 0.9 * f; }
  return { L, R };
}
const brass = (mix, t, dur, m, vol = 0.09) => wide(mix, t, dur, m, { type: 'saw', lp: 900, lpEnv: 2600, lpDecay: 0.18, a: 0.03, d: 0.2, s: 0.75, r: 0.35, vol, send: 0.45, voices: 3, spread: 0.007, vib: 0.004 });

const defs = {
  // ⚠️ บอสกำลังมา: กลองศึก 3 ตูม + ไซเรนทุ้มไถลลง + แตรต่ำ (โทนเข้ม ไม่แหลม ไม่น่ากลัวเกินธีมน่ารัก)
  sfx_boss_warn: () => renderOnce(3.4, mix => {
    [0, 0.42, 0.84].forEach((t, i) => { timpani(mix, t, 33 - i, 0.75); kick(mix, t, 0.8); tom(mix, t + 0.2, 70 - i * 6, 0.35); });
    for (const d of [0.994, 1, 1.006]) note(mix, 0.05, 1.3, 50, { type: 'saw', lp: 700, a: 0.08, s: 0.9, r: 0.5, vol: 0.12, detune: d, vib: 0.03, vibRate: 3.2, vibDelay: 0, send: 0.4 });
    for (const m of [38, 41, 44]) brass(mix, 1.25, 0.9, m + 12, 0.11);   // คอร์ดดิมินิช ค้างให้ตึง
    crash(mix, 1.25, 0.12);
  }, 0.7, 0.6),
  // 🏆 ล้มบอส: ตะลุมพุก + แตรขึ้น 3 จังหวะ + คอร์ดใหญ่จบ + ระฆังประกาย
  sfx_boss_clear: () => renderOnce(4.2, mix => {
    [0, 0.08, 0.16, 0.24, 0.32].forEach((t, i) => timpani(mix, t, 36, 0.25 + i * 0.05));
    [[0.45, [67, 71, 74]], [0.68, [67, 71, 74]], [0.9, [69, 72, 76]]].forEach(([t, ch]) => ch.forEach(m => brass(mix, t, 0.16, m, 0.08)));
    crash(mix, 1.15, 0.14); kick(mix, 1.15, 0.9); timpani(mix, 1.15, 31, 0.6);
    for (const m of [55, 62, 67, 71, 74, 79]) brass(mix, 1.15, 1.6, m, 0.075);
    [79, 83, 86, 91, 95].forEach((m, i) => note(mix, 1.2 + i * 0.09, 0.4, m, { type: 'bell', decay: 0.8, a: 0.002, r: 0.4, vol: 0.09, pan: i % 2 ? 0.4 : -0.4, send: 0.5 }));
  }),
  // 🎉 ชนะเกม / จบบท: แฟนแฟร์ยาวกว่า มีท่อนทำนอง
  sfx_victory: () => renderOnce(6.5, mix => {
    const mel = [[0, 72, .3], [.3, 72, .15], [.45, 72, .15], [.6, 76, .3], [.9, 79, .6], [1.5, 77, .3], [1.8, 76, .3], [2.1, 79, .3], [2.4, 84, 1.6]];
    for (const [t, m, d] of mel) { brass(mix, t, d, m, 0.1); note(mix, t, d, m + 12, { type: 'bell', decay: 0.4, a: 0.002, r: 0.2, vol: 0.05, send: 0.5 }); }
    [[0, [48, 55, 64]], [0.9, [53, 60, 65]], [1.8, [55, 62, 67]], [2.4, [48, 55, 64, 67, 72]]].forEach(([t, ch]) => ch.forEach(m => wide(mix, t, t < 2.4 ? 0.85 : 2.2, m, { type: 'tri', a: 0.05, s: 0.8, r: 0.6, vol: 0.07, send: 0.5, voices: 2 })));
    [0, 0.6, 0.9, 1.5, 1.8, 2.1].forEach(t => { kick(mix, t, 0.5); snare(mix, t + 0.15, 0.2); });
    crash(mix, 2.4, 0.15); timpani(mix, 2.4, 36, 0.6);
  }),
};

const out = process.argv[2] || '.';
fs.mkdirSync(out, { recursive: true });
for (const name of process.argv.slice(3).length ? process.argv.slice(3) : Object.keys(defs)) {
  S.setSeed(777);
  const { L, R } = defs[name]();
  writeWav(path.join(out, name + '.wav'), L, R);
  console.log(name, (L.length / SR).toFixed(2) + 's');
}
