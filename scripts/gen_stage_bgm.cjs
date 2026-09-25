// เพลงประจำด่าน 15 ด่าน (ด่านละเพลง) สร้างด้วยโค้ดล้วน — ใช้เครื่อง synth ของ gen_bgm_synth.cjs
// ใช้:  node scripts/gen_stage_bgm.cjs OUT_DIR [bgm_s01 ...]
//       python3 scripts/encode_mp3.py OUT_DIR assets/audio/bgm/stage 96
// แต่ละด่านกำหนดด้วยตาราง STAGES ข้างล่าง: คีย์/โหมด/จังหวะ/คอร์ด/เครื่องดนตรี/กลอง/เสียงบรรยากาศ
// ทำนองสร้างจาก "โมทีฟ" (seed ต่อด่าน) แล้วย้ายตามคอร์ด → ฟังเป็นเพลงเดียวกันทั้งท่อน ไม่สุ่มมั่ว
// โครง 16 ห้อง: 0-3 อินโทร (ไม่มีทำนอง) · 4-11 ท่อน A (โมทีฟซ้ำ) · 12-15 ท่อน B (สูงขึ้น เต็มขึ้น) → วนกลับเนียน
'use strict';
const fs = require('fs'), path = require('path');
const S = require('./gen_bgm_synth.cjs');
const { SR, Mix, note, wide, kick, snare, hat, shaker, tom, timpani, crash, wood, renderTrack, writeWav } = S;

const MODES = {
  major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], dorian: [0, 2, 3, 5, 7, 9, 10],
  mixo: [0, 2, 4, 5, 7, 9, 10], lydian: [0, 2, 4, 6, 7, 9, 11], harm: [0, 2, 3, 5, 7, 8, 11], phryd: [0, 1, 4, 5, 7, 8, 10],
};
// สุ่มแบบกำหนด seed ต่อด่าน (ทำนองเดิมทุกครั้งที่รัน)
let ms = 1; const mr = () => { ms = (ms * 16807) % 2147483647; return (ms - 1) / 2147483646; };
const pick = a => a[Math.floor(mr() * a.length)];

function deg2midi(st, d) { const sc = MODES[st.mode], o = Math.floor(d / 7), k = ((d % 7) + 7) % 7; return st.key + 12 * o + sc[k]; }
const isChordTone = (d, root) => [0, 2, 4].includes((((d - root) % 7) + 7) % 7);

const RHY = [
  [[0, 1], [1, 1], [2, 1.5], [3.5, .5]],
  [[0, .5], [.5, .5], [1, 1], [2, .5], [2.5, .5], [3, 1]],
  [[0, 1.5], [1.5, .5], [2, 2]],
  [[0, .75], [.75, .25], [1, .5], [1.5, .5], [2, 1], [3, 1]],
  [[0, .5], [.5, 1], [1.5, .5], [2, 1.5], [3.5, .5]],
];
const END = [[0, 3], [3, 1]];

// โมทีฟ 1 ห้อง = รายการ [beat, dur, degree-offset จากรากคอร์ด]
function makeMotif(st, lo = 0) {
  const r = st.rhythms ? RHY[pick(st.rhythms)] : pick(RHY);
  let d = lo + pick([0, 2, 4]);
  return r.map(([b, len], i) => {
    if (i > 0) d += pick([-2, -1, -1, 1, 1, 2, 0]);
    d = Math.max(lo - 2, Math.min(lo + 7, d));
    return [b, len, d];
  });
}
function motifToBar(st, motif, root, shift = 0) {
  return motif.map(([b, len, off]) => {
    let d = root + off + shift;
    if (Number.isInteger(b) && !isChordTone(d, root)) d += (mr() < 0.5 ? -1 : 1);
    return [b, len, d];
  });
}

// ===== เสียงบรรยากาศ =====
function noiseSwell(mix, t0, dur, vol, cut, pan = 0) {   // ลม/ไอน้ำ: noise กรองต่ำ ค่อย ๆ ขึ้นลง
  const s = Math.floor(t0 * SR), n = Math.floor(dur * SR), c = 1 - Math.exp(-2 * Math.PI * cut / SR); let a = 0, b = 0;
  for (let k = 0; k < n; k++) {
    a += c * (S.rnd() * 2 - 1 - a); b += c * (a - b);
    const env = Math.sin(Math.PI * k / n);
    mix.put(s + k, b * env * vol * 6, pan + 0.3 * Math.sin(k / n * 6.28), 0.4);
  }
}
const FX = {
  drip: (mix, c) => { for (let i = 0; i < 2; i++) if (mr() < 0.7) note(mix, c.beat(mr() * 4), 0.08, 84 + Math.floor(mr() * 10), { type: 'sine', decay: 0.07, a: 0.001, r: 0.05, slide: -7, vol: 0.07, pan: mr() * 1.4 - 0.7, send: 0.6 }); },
  sizzle: (mix, c) => { if (c.bi % 2 === 0) noiseSwell(mix, c.beat(0), 4 * c.spb, 0.012, 5000, 0.3); },
  wind: (mix, c) => { if (c.bi % 4 === 0) noiseSwell(mix, c.beat(0), 16 * c.spb, 0.03, 700, -0.2); },
  chime: (mix, c, st, ch) => { for (let i = 0; i < 3; i++) if (mr() < 0.5) note(mix, c.beat(Math.floor(mr() * 8) / 2), 0.5, deg2midi(st, ch + pick([0, 2, 4, 7, 9])) + 24, { type: 'bell', decay: 0.9, a: 0.001, r: 0.4, vol: 0.035, pan: mr() * 1.6 - 0.8, send: 0.7 }); },
  buzz: (mix, c, st) => note(mix, c.beat(0), 4 * c.spb, st.key + 12, { type: 'saw', lp: 500, a: 0.3, s: 0.8, r: 0.3, vol: 0.03, vib: 0.03, vibRate: 13, vibDelay: 0, send: 0.2, pan: 0.5 }),
  tick: (mix, c) => { for (let i = 0; i < 8; i++) wood(mix, c.beat(i * 0.5), i % 2 ? 0.05 : 0.08, i % 2 ? 0.5 : -0.5); },
  heart: (mix, c) => { kick(mix, c.beat(0), 0.35, 0.2); kick(mix, c.beat(0.4), 0.22, 0.2); },
};

// ===== กลองตามสไตล์ =====
function drums(mix, c, style, bi) {
  const intro = bi < 2;
  switch (style) {
    case 'soft':
      kick(mix, c.beat(0), 0.5); if (!intro) kick(mix, c.beat(2.5), 0.35);
      wood(mix, c.beat(1), 0.09); wood(mix, c.beat(3), 0.07, -0.4);
      for (let i = 0; i < 8; i++) shaker(mix, c.beat(i * 0.5), i % 2 ? 0.03 : 0.05); break;
    case 'groove':
      kick(mix, c.beat(0), 0.7); kick(mix, c.beat(1.5), 0.45); kick(mix, c.beat(2.5), 0.55);
      if (!intro) { snare(mix, c.beat(1), 0.32); snare(mix, c.beat(3), 0.32); }
      for (let i = 0; i < 8; i++) hat(mix, c.beat(i * 0.5), i % 2 ? 0.07 : 0.04); break;
    case 'four':
      for (let i = 0; i < 4; i++) kick(mix, c.beat(i), 0.75);
      if (!intro) { snare(mix, c.beat(1), 0.38); snare(mix, c.beat(3), 0.38); }
      for (let i = 0; i < 4; i++) hat(mix, c.beat(i + 0.5), 0.09, i === 3); break;
    case 'march':
      timpani(mix, c.beat(0), 36, 0.45); kick(mix, c.beat(2), 0.5);
      if (!intro) { snare(mix, c.beat(1), 0.25); snare(mix, c.beat(3), 0.25); snare(mix, c.beat(3.5), 0.15); snare(mix, c.beat(3.75), 0.18); }
      for (let i = 0; i < 4; i++) hat(mix, c.beat(i + 0.5), 0.04); break;
    case 'sparse':
      if (bi % 2 === 0) kick(mix, c.beat(0), 0.4);
      if (bi >= 8) { wood(mix, c.beat(2), 0.07); for (let i = 0; i < 4; i++) shaker(mix, c.beat(i + 0.5), 0.03); } break;
    case 'none': break;
  }
  if (style !== 'none' && bi % 4 === 3 && bi >= 4) [3, 3.25, 3.5, 3.75].forEach((b, i) => tom(mix, c.beat(b), 130 - i * 16, 0.25, i % 2 ? 0.3 : -0.3));
  if (bi === 0 || bi === 12) crash(mix, c.beat(0), 0.08);
}

// ===== ตารางเพลงประจำด่าน =====
// key = MIDI ของโทนิก (อ็อกเทฟทำนอง) · prog = คอร์ดเป็น scale degree (0 = I)
// pad/arp/lead = ชนิดเสียง · bass = pluck|pulse|long|walk · arpRate 2 = ตัวละ 8 ส่วน, 4 = 16 ส่วน
const STAGES = [
  { name: 'bgm_s01', title: 'Pantry Hideout',      key: 72, mode: 'major',  bpm: 112, prog: [0, 5, 3, 4], drum: 'soft',   bass: 'pluck', arp: 'bell',  arpRate: 2, lead: 'sqr',  pad: 'tri', fx: [] },
  { name: 'bgm_s02', title: 'Drain of Clogmaw',    key: 65, mode: 'mixo',   bpm: 104, prog: [0, 6, 3, 0, 4, 3, 0, 6], drum: 'groove', bass: 'pluck', arp: 'pluck', arpRate: 2, lead: 'sine', pad: 'saw', fx: ['drip'] },
  { name: 'bgm_s03', title: 'Chili Engine Room',   key: 69, mode: 'harm',   bpm: 132, prog: [0, 5, 3, 4], drum: 'four',   bass: 'pulse', arp: 'sqr',   arpRate: 4, lead: 'saw',  pad: 'saw', fx: ['sizzle'] },
  { name: 'bgm_s04', title: 'Frost Prison',        key: 71, mode: 'minor',  bpm: 88,  prog: [0, 5, 2, 6], drum: 'sparse', bass: 'long',  arp: 'bell',  arpRate: 2, lead: 'sine', pad: 'tri', fx: ['wind', 'chime'] },
  { name: 'bgm_s05', title: 'Crown Oven',          key: 74, mode: 'harm',   bpm: 116, prog: [0, 5, 1, 4], drum: 'march',  bass: 'pulse', arp: 'pluck', arpRate: 2, lead: 'brass', pad: 'saw', fx: ['heart'] },
  { name: 'bgm_s06', title: 'Fermented Canopy',    key: 67, mode: 'dorian', bpm: 100, prog: [0, 3, 0, 6], drum: 'soft',   bass: 'pluck', arp: 'bell',  arpRate: 2, lead: 'tri',  pad: 'saw', fx: ['drip'] },
  { name: 'bgm_s07', title: 'Mycelium Marsh',      key: 64, mode: 'dorian', bpm: 86,  prog: [0, 3, 4, 3], drum: 'sparse', bass: 'long',  arp: 'pluck', arpRate: 2, lead: 'sine', pad: 'saw', fx: ['drip', 'wind'], vib: 0.018 },
  { name: 'bgm_s08', title: 'Nectar Hive',         key: 69, mode: 'major',  bpm: 134, prog: [0, 4, 5, 3], drum: 'groove', bass: 'pulse', arp: 'pluck', arpRate: 4, lead: 'sqr',  pad: 'tri', fx: ['buzz'] },
  { name: 'bgm_s09', title: 'Four-Season Conservatory', key: 75, mode: 'lydian', bpm: 108, prog: [0, 1, 5, 4, 3, 1, 4, 0], drum: 'soft', bass: 'walk', arp: 'bell', arpRate: 2, lead: 'tri', pad: 'tri', fx: ['chime'] },
  { name: 'bgm_s10', title: 'Root Throne',         key: 73, mode: 'minor',  bpm: 96,  prog: [0, 5, 3, 4], drum: 'march',  bass: 'long',  arp: 'pluck', arpRate: 2, lead: 'brass', pad: 'choir', fx: ['heart'] },
  { name: 'bgm_s11', title: 'Ashen Seedfields',    key: 65, mode: 'minor',  bpm: 80,  prog: [0, 5, 6, 4], drum: 'sparse', bass: 'long',  arp: 'bell',  arpRate: 2, lead: 'sine', pad: 'choir', fx: ['wind'] },
  { name: 'bgm_s12', title: 'Hollow Orchard',      key: 74, mode: 'dorian', bpm: 94,  prog: [0, 6, 5, 4], drum: 'soft',   bass: 'pluck', arp: 'pluck', arpRate: 2, lead: 'tri',  pad: 'saw', fx: ['tick'] },
  { name: 'bgm_s13', title: 'Glass Greenhouse Ruins', key: 76, mode: 'lydian', bpm: 100, prog: [0, 1, 0, 4], drum: 'sparse', bass: 'long', arp: 'bell', arpRate: 4, lead: 'sine', pad: 'tri', fx: ['chime'] },
  { name: 'bgm_s14', title: 'The Seed Vault',      key: 67, mode: 'harm',   bpm: 110, prog: [0, 5, 3, 4], drum: 'groove', bass: 'pulse', arp: 'sqr',   arpRate: 2, lead: 'sqr',  pad: 'saw', fx: ['tick'] },
  { name: 'bgm_s15', title: 'Throne of the First Seed', key: 72, mode: 'minor', bpm: 118, prog: [0, 5, 2, 6, 3, 5, 4, 4], drum: 'march', bass: 'pulse', arp: 'pluck', arpRate: 4, lead: 'brass', pad: 'choir', fx: [] },
];

const LEAD = {
  sqr: { type: 'sqr', lp: 2400, a: 0.01, d: 0.1, s: 0.65, r: 0.12, vol: 0.085 },
  sine: { type: 'sine', a: 0.04, d: 0.1, s: 0.85, r: 0.3, vol: 0.16 },
  tri: { type: 'tri', a: 0.02, d: 0.1, s: 0.8, r: 0.2, vol: 0.14 },
  saw: { type: 'saw', lp: 2200, a: 0.01, d: 0.12, s: 0.7, r: 0.12, vol: 0.1 },
  brass: { type: 'saw', lp: 1100, lpEnv: 2200, lpDecay: 0.15, a: 0.03, d: 0.2, s: 0.75, r: 0.25, vol: 0.12 },
};

function buildDef(st, idx) {
  ms = 9001 + idx * 7919;
  const P = st.prog, bars = [];
  for (let i = 0; i < 16; i++) bars.push(P[i % P.length]);
  const motifA = makeMotif(st, 0), motifA2 = makeMotif(st, 0), motifB = makeMotif(st, 2);
  // ทำนองทั้งเพลง (คงที่ทั้ง 2 รอบของ renderTrack)
  const mel = bars.map((root, bi) => {
    if (bi < 4) return null;
    const endPhrase = bi === 7 || bi === 11 || bi === 15;
    if (endPhrase) return END.map(([b, len]) => [b, len, root + pick([0, 2])]);
    if (bi < 12) return motifToBar(st, bi % 2 ? motifA2 : motifA, root);
    return motifToBar(st, motifB, root);
  });
  const lead = { ...LEAD[st.lead], vib: st.vib ?? 0.006, send: 0.4, pan: 0.1 };
  const fxRnd = [];
  return {
    name: st.name, bpm: st.bpm, room: 0.8, wet: 0.8, bars: bars.map((d, bi) => ({ d, bi })),
    play(mix, c) {
      const { d, bi } = c.bar, spb = c.spb, full = bi >= 12;
      const tones = [d, d + 2, d + 4, d + 6].map(x => deg2midi(st, x));
      const rootM = deg2midi(st, d) - 24 - (deg2midi(st, d) - 24 > st.key - 17 ? 12 : 0);
      // แพด
      const padO = st.pad === 'choir'
        ? { type: 'tri', a: 0.4, s: 0.9, r: 0.6, vol: 0.06, send: 0.6, voices: 3, spread: 0.01, vib: 0.004 }
        : st.pad === 'tri' ? { type: 'tri', a: 0.3, s: 0.85, r: 0.5, vol: 0.05, send: 0.55, voices: 2 }
          : { type: 'saw', lp: full ? 1300 : 900, a: 0.4, s: 0.85, r: 0.6, vol: 0.045, send: 0.55, voices: 2 };
      for (const m of tones.slice(0, 3)) wide(mix, c.beat(0), 4 * spb, m - 12, padO);
      // เบส
      if (st.bass === 'pluck') [[0, 0, .5], [1.5, 7, .3], [2, 12, .4], [3, 7, .35]].forEach(([b, iv, v]) => note(mix, c.beat(b), 0.3, rootM + iv, { type: 'pluck', decay: 0.25, a: 0.004, r: 0.1, vol: v * 0.6, send: 0.1 }));
      else if (st.bass === 'pulse') for (let i = 0; i < 8; i++) note(mix, c.beat(i * 0.5), 0.4 * spb, rootM + (i % 4 === 3 ? 12 : 0), { type: 'saw', lp: 380, lpEnv: 1200, lpDecay: 0.07, a: 0.003, s: 0.6, r: 0.05, vol: 0.22, send: 0.05 });
      else if (st.bass === 'walk') [0, 4, 7, 9].forEach((iv, i) => note(mix, c.beat(i), 0.85 * spb, rootM + iv, { type: 'pluck', decay: 0.4, a: 0.004, r: 0.08, vol: 0.3, send: 0.08, lp: 900 }));
      else { note(mix, c.beat(0), 3.8 * spb, rootM, { type: 'saw', lp: 420, a: 0.1, s: 0.9, r: 0.4, vol: 0.2, send: 0.15 }); note(mix, c.beat(0), 3.8 * spb, rootM - 12, { type: 'sine', a: 0.1, s: 0.9, r: 0.4, vol: 0.14, send: 0.05 }); }
      // อาร์เพจโจ
      const n = st.arpRate * 4, order = [0, 1, 2, 3, 2, 1, 2, 3];
      const arpO = st.arp === 'bell' ? { type: 'bell', decay: 0.4, a: 0.002, r: 0.2, vol: 0.07 }
        : st.arp === 'sqr' ? { type: 'sqr', lp: 2600, decay: 0.1, a: 0.002, r: 0.04, vol: 0.05 }
          : { type: 'pluck', decay: 0.18, a: 0.003, r: 0.06, vol: 0.09 };
      for (let i = 0; i < n; i++) note(mix, c.beat(i * 4 / n), 0.3 * spb, tones[order[i % 8]] + (bi >= 8 && i % 4 === 0 ? 12 : 0), { ...arpO, vol: arpO.vol * (bi < 4 ? 1.15 : 0.85), pan: i % 2 ? 0.4 : -0.4, send: 0.4 });
      drums(mix, c, st.drum, bi);
      for (const f of st.fx) FX[f](mix, c, st, d);
      // ทำนอง
      const m = mel[bi];
      if (m) {
        for (const [b, len, dg] of m) note(mix, c.beat(b), len * spb * 0.92, deg2midi(st, dg), lead);
        if (full) for (const [b, len, dg] of m) note(mix, c.beat(b), len * spb * 0.92, deg2midi(st, dg) - 12, { ...lead, vol: lead.vol * 0.45, pan: -0.2 });
        if (bi >= 8 && bi < 12) for (const [b, len, dg] of m) if (Number.isInteger(b)) note(mix, c.beat(b), 0.4, deg2midi(st, dg - 2) + 12, { type: 'bell', decay: 0.5, a: 0.002, r: 0.2, vol: 0.04, pan: 0.45, send: 0.5 });
      }
    },
  };
}

const out = process.argv[2] || '.';
const want = process.argv.slice(3);
fs.mkdirSync(out, { recursive: true });
STAGES.forEach((st, i) => {
  if (want.length && !want.includes(st.name)) return;
  S.setSeed(4242 + i);
  const { L, R, sec } = renderTrack(buildDef(st, i));
  // ปรับความดังเฉลี่ยให้เท่ากันทุกด่าน (เพลงเบาบางไม่โดน normalize จนดังกว่าเพลงอื่น)
  let e = 0; for (let k = 0; k < L.length; k += 16) e += L[k] * L[k] + R[k] * R[k];
  const rms = Math.sqrt(e / (L.length / 16) / 2), g = Math.min(1, 0.19 / rms);
  for (let k = 0; k < L.length; k++) { L[k] *= g; R[k] *= g; }
  writeWav(path.join(out, st.name + '.wav'), L, R);
  console.log(st.name, st.title, sec.toFixed(1) + 's');
});
