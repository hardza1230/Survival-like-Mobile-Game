// สร้างเพลง BGM วนลูปด้วยโค้ดล้วน (ไม่ใช้เน็ต/ไม่มีลิขสิทธิ์) → WAV 16-bit stereo 44.1k
// ใช้:  node scripts/gen_bgm_synth.cjs OUT_DIR
// แล้วแปลงเป็น mp3:  python3 scripts/encode_mp3.py OUT_DIR assets/audio/bgm   (ต้อง pip install lameenc)
// ลูปเนียน: เรนเดอร์เพลง 2 รอบต่อกัน แล้วตัดรอบที่ 2 มาใช้ → หางรีเวิร์บ/โน้ตค้างของรอบก่อนไหลเข้าต้นลูปพอดี
'use strict';
const fs = require('fs'), path = require('path');
const SR = 44100, TAU = Math.PI * 2;

let seed = 12345;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

class Mix {
  constructor(sec) {
    this.n = Math.ceil(sec * SR);
    this.L = new Float32Array(this.n); this.R = new Float32Array(this.n);
    this.sL = new Float32Array(this.n); this.sR = new Float32Array(this.n);
  }
  put(i, v, pan, send) {
    if (i < 0 || i >= this.n) return;
    const a = (pan + 1) * Math.PI / 4, l = Math.cos(a) * v, r = Math.sin(a) * v;
    this.L[i] += l; this.R[i] += r;
    if (send) { this.sL[i] += l * send; this.sR[i] += r * send; }
  }
}

function polyblep(t, dt) {
  if (t < dt) { t /= dt; return t + t - t * t - 1; }
  if (t > 1 - dt) { t = (t - 1) / dt; return t * t + t + t + 1; }
  return 0;
}

// โน้ต 1 ตัว: type sine|tri|saw|sqr|bell|pluck · env: a,d,s,r หรือ decay (pluck แบบ exp)
function note(mix, t0, dur, midi, o = {}) {
  const f0 = mtof(midi) * (o.detune || 1);
  const a = o.a ?? 0.005, d = o.d ?? 0.1, s = o.s ?? 0.8, r = o.r ?? 0.1;
  const len = Math.floor((dur + r) * SR), start = Math.floor(t0 * SR);
  const vol = o.vol ?? 0.2, pan = o.pan ?? 0, send = o.send ?? 0.25;
  const type = o.type || 'sine';
  let ph = rnd(), ph2 = 0, ph3 = 0, lp1 = 0, lp2 = 0;
  const vibD = o.vib || 0, vibR = o.vibRate || 5.2, vibDel = o.vibDelay ?? 0.25;
  for (let k = 0; k < len; k++) {
    const t = k / SR;
    let env;
    if (o.decay) env = (t < a ? t / a : Math.exp(-(t - a) / o.decay)) * (t > dur ? Math.max(0, 1 - (t - dur) / r) : 1);
    else {
      if (t < a) env = t / a;
      else if (t < a + d) env = 1 - (1 - s) * (t - a) / d;
      else env = s;
      if (t > dur) env *= Math.max(0, 1 - (t - dur) / r);
    }
    if (env <= 0 && t > dur) break;
    let f = f0;
    if (vibD && t > vibDel) f *= 1 + vibD * Math.sin(TAU * vibR * t) * Math.min(1, (t - vibDel) / 0.3);
    if (o.slide) f *= Math.pow(2, o.slide * Math.max(0, 1 - t / 0.06) / 12);
    const dt = f / SR;
    ph += dt; if (ph >= 1) ph -= 1;
    let v;
    switch (type) {
      case 'saw': v = 2 * ph - 1 - polyblep(ph, dt); break;
      case 'sqr': v = (ph < 0.5 ? 1 : -1) + polyblep(ph, dt) - polyblep((ph + 0.5) % 1, dt); break;
      case 'tri': v = 1 - 4 * Math.abs(ph - 0.5); break;
      case 'bell': {
        ph2 += dt * 2.76; ph3 += dt * 5.4;
        v = Math.sin(TAU * ph) + 0.45 * Math.sin(TAU * ph2) * Math.exp(-t * 6) + 0.2 * Math.sin(TAU * ph3) * Math.exp(-t * 11);
        v *= 0.6; break;
      }
      case 'pluck': { ph2 += dt * 2; v = 0.7 * Math.sin(TAU * ph) + 0.3 * Math.sin(TAU * ph2) * Math.exp(-t * 9); break; }
      default: v = Math.sin(TAU * ph);
    }
    if (o.lp) {   // low-pass 2 ชั้น (มี envelope ให้เปิดกว้างตอนต้นโน้ตได้)
      const cut = o.lpEnv ? o.lp + o.lpEnv * Math.exp(-t / (o.lpDecay || 0.15)) : o.lp;
      const c = 1 - Math.exp(-TAU * cut / SR);
      lp1 += c * (v - lp1); lp2 += c * (lp1 - lp2); v = lp2;
    }
    mix.put(start + k, v * env * vol, pan, send);
  }
}
// เสียงหนา: หลายเสียงดีทูนกระจายซ้าย-ขวา
function wide(mix, t0, dur, midi, o = {}) {
  const n = o.voices || 2, spread = o.spread ?? 0.008;
  for (let i = 0; i < n; i++) {
    const x = n === 1 ? 0 : i / (n - 1) * 2 - 1;
    note(mix, t0, dur, midi, { ...o, detune: 1 + x * spread, pan: (o.pan || 0) + x * 0.6, vol: (o.vol ?? 0.2) / Math.sqrt(n) });
  }
}

// ===== กลอง =====
function kick(mix, t0, vol = 0.9, send = 0.05) {
  const s = Math.floor(t0 * SR), len = Math.floor(0.42 * SR); let ph = 0;
  for (let k = 0; k < len; k++) {
    const t = k / SR, f = 45 + 95 * Math.exp(-t * 28);
    ph += f / SR;
    const v = Math.sin(TAU * ph) * Math.exp(-t * 7.5) + (k < 90 ? (rnd() * 2 - 1) * 0.25 * (1 - k / 90) : 0);
    mix.put(s + k, v * vol, 0, send);
  }
}
function snare(mix, t0, vol = 0.45, send = 0.22) {
  const s = Math.floor(t0 * SR), len = Math.floor(0.25 * SR); let ph = 0, hp = 0, prev = 0;
  for (let k = 0; k < len; k++) {
    const t = k / SR; ph += 190 / SR;
    const n = rnd() * 2 - 1; hp = 0.85 * (hp + n - prev); prev = n;
    const v = hp * Math.exp(-t * 16) * 0.8 + Math.sin(TAU * ph) * Math.exp(-t * 25) * 0.6;
    mix.put(s + k, v * vol, 0.05, send);
  }
}
function hat(mix, t0, vol = 0.12, open = false, pan = 0.25) {
  const s = Math.floor(t0 * SR), dec = open ? 9 : 45, len = Math.floor((open ? 0.3 : 0.07) * SR);
  let hp = 0, prev = 0;
  for (let k = 0; k < len; k++) {
    const n = rnd() * 2 - 1; hp = 0.6 * (hp + n - prev); prev = n;
    mix.put(s + k, hp * Math.exp(-k / SR * dec) * vol, pan, 0.1);
  }
}
function shaker(mix, t0, vol = 0.06, pan = -0.3) {
  const s = Math.floor(t0 * SR), len = Math.floor(0.09 * SR); let hp = 0, prev = 0;
  for (let k = 0; k < len; k++) {
    const t = k / SR, n = rnd() * 2 - 1; hp = 0.7 * (hp + n - prev); prev = n;
    const env = Math.min(1, t / 0.015) * Math.exp(-t * 30);
    mix.put(s + k, hp * env * vol, pan, 0.15);
  }
}
function tom(mix, t0, f = 110, vol = 0.5, pan = 0) {
  const s = Math.floor(t0 * SR), len = Math.floor(0.5 * SR); let ph = 0;
  for (let k = 0; k < len; k++) {
    const t = k / SR; ph += f * (1 + 0.6 * Math.exp(-t * 18)) / SR;
    mix.put(s + k, Math.sin(TAU * ph) * Math.exp(-t * 6) * vol, pan, 0.3);
  }
}
function timpani(mix, t0, midi = 36, vol = 0.55) {
  const s = Math.floor(t0 * SR), len = Math.floor(1.6 * SR), f = mtof(midi); let p1 = 0, p2 = 0;
  for (let k = 0; k < len; k++) {
    const t = k / SR; p1 += f * (1 + 0.04 * Math.exp(-t * 10)) / SR; p2 += f * 1.5 / SR;
    const n = k < 300 ? (rnd() * 2 - 1) * 0.3 * (1 - k / 300) : 0;
    mix.put(s + k, (Math.sin(TAU * p1) + 0.35 * Math.sin(TAU * p2) * Math.exp(-t * 4) + n) * Math.exp(-t * 2.4) * vol, 0, 0.35);
  }
}
function crash(mix, t0, vol = 0.14) {
  const s = Math.floor(t0 * SR), len = Math.floor(2.2 * SR); let hp = 0, prev = 0;
  for (let k = 0; k < len; k++) {
    const n = rnd() * 2 - 1; hp = 0.5 * (hp + n - prev); prev = n;
    mix.put(s + k, hp * Math.exp(-k / SR * 2.2) * vol, (k % 2 ? 0.3 : -0.3), 0.3);
  }
}
function wood(mix, t0, vol = 0.12, pan = 0.4) { note(mix, t0, 0.04, 91, { type: 'sine', decay: 0.03, a: 0.001, r: 0.02, vol, pan, send: 0.2 }); }

// ===== รีเวิร์บ (Freeverb ย่อ) =====
function reverb(mix, room = 0.8, damp = 0.3, wet = 0.9) {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491], aps = [556, 441, 341];
  const run = (inp, off) => {
    const out = new Float32Array(inp.length);
    for (const c of combs) {
      const buf = new Float32Array(c + off); let idx = 0, filt = 0;
      for (let i = 0; i < inp.length; i++) {
        const y = buf[idx]; filt = y * (1 - damp) + filt * damp;
        buf[idx] = inp[i] * 0.015 + filt * room; idx = (idx + 1) % buf.length; out[i] += y;
      }
    }
    for (const a of aps) {
      const buf = new Float32Array(a + off); let idx = 0;
      for (let i = 0; i < out.length; i++) {
        const b = buf[idx], x = out[i]; out[i] = -x + b; buf[idx] = x + b * 0.5; idx = (idx + 1) % buf.length;
      }
    }
    return out;
  };
  const rl = run(mix.sL, 0), rr = run(mix.sR, 23);
  for (let i = 0; i < mix.n; i++) { mix.L[i] += rl[i] * wet; mix.R[i] += rr[i] * wet; }
}

// ===== ประกอบเพลง =====
function renderTrack(def) {
  const spb = 60 / def.bpm, barSec = spb * 4, loopSec = barSec * def.bars.length;
  const mix = new Mix(loopSec * 2 + 4);
  for (let pass = 0; pass < 2; pass++) {
    const T0 = pass * loopSec;
    def.bars.forEach((bar, bi) => {
      const t = T0 + bi * barSec;
      def.play(mix, { t, spb, bar, bi, beat: b => t + b * spb });
    });
  }
  reverb(mix, def.room ?? 0.8, 0.3, def.wet ?? 0.9);
  const s = Math.floor(loopSec * SR), n = Math.floor(loopSec * SR);
  const L = mix.L.slice(s, s + n), R = mix.R.slice(s, s + n);
  let peak = 0; for (let i = 0; i < n; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  const g = 1.6, norm = Math.tanh(g);
  for (let i = 0; i < n; i++) { L[i] = Math.tanh(L[i] / peak * g) / norm * 0.9; R[i] = Math.tanh(R[i] / peak * g) / norm * 0.9; }
  return { L, R, sec: loopSec };
}

function writeWav(file, L, R) {
  const n = L.length, buf = Buffer.alloc(44 + n * 4);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 4, 4); buf.write('WAVE', 8); buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, L[i])) * 32767), 44 + i * 4);
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, R[i])) * 32767), 46 + i * 4);
  }
  fs.writeFileSync(file, buf);
}

// melody: [beat, midi, dur]
function playMel(mix, ctx, mel, o) { for (const [b, m, d] of mel) note(mix, ctx.beat(b), d * ctx.spb * 0.95, m, o); }

// ---------- 1) Chapter 2 · Fermented Garden (สวนหมัก ลึกลับ น่ารัก) ----------
const CH = {
  Dm9: { root: 38, pad: [65, 69, 72, 76] }, G6: { root: 43, pad: [62, 64, 67, 71] },
  Em7: { root: 40, pad: [64, 67, 71, 74] }, Am7: { root: 45, pad: [64, 67, 69, 72] },
  Bbmaj7: { root: 46, pad: [58, 62, 65, 69] }, C6: { root: 48, pad: [60, 64, 67, 69] },
  Asus4: { root: 45, pad: [57, 62, 64, 69] },
};
const ch2Mel = [
  [[0, 74, 1], [1, 76, .5], [1.5, 77, .5], [2, 76, 1], [3, 72, 1]],
  [[0, 71, 1.5], [1.5, 74, .5], [2, 79, 1.5], [3.5, 76, .5]],
  [[0, 74, 1], [1, 71, 1], [2, 67, .5], [2.5, 71, .5], [3, 74, 1]],
  [[0, 72, 3], [3, 71, .5], [3.5, 69, .5]],
  [[0, 70, 1], [1, 74, 1], [2, 77, 1.5], [3.5, 76, .5]],
  [[0, 76, 1], [1, 72, .5], [1.5, 74, .5], [2, 76, 1], [3, 79, 1]],
  [[0, 77, 1.5], [1.5, 76, .5], [2, 74, 2]],
  [[0, 69, 2], [2, 74, 1], [3, 76, 1]],
];
const ch2 = {
  name: 'bgm_ch2', bpm: 96, room: 0.82,
  bars: ['Dm9', 'G6', 'Em7', 'Am7', 'Dm9', 'G6', 'Bbmaj7', 'C6', 'Dm9', 'G6', 'Em7', 'Am7', 'Bbmaj7', 'C6', 'Dm9', 'Asus4'].map(k => CH[k]),
  play(mix, c) {
    const { bar, bi, spb } = c, B = bi >= 8;
    for (const m of bar.pad) wide(mix, c.beat(0), 4 * spb, m, { type: 'saw', lp: 900, a: 0.5, d: 0.5, s: 0.8, r: 0.8, vol: 0.05, send: 0.5, voices: 2 });
    // เบสดีดสาย (pizzicato)
    [[0, 0, .45], [1.5, 7, .3], [2, 12, .4], [3, 7, .35], [3.5, 0, .3]].forEach(([b, iv, v]) =>
      note(mix, c.beat(b), 0.25, bar.root + iv, { type: 'pluck', decay: 0.22, a: 0.004, r: 0.1, vol: v * 0.55, send: 0.15 }));
    // คาลิมบาไล่คอร์ด
    const pat = [0, 1, 2, 3, 2, 1, 2, 3];
    pat.forEach((ix, i) => note(mix, c.beat(i * 0.5), 0.3, bar.pad[ix] + 12, { type: 'bell', decay: 0.35, a: 0.002, r: 0.2, vol: B ? 0.07 : 0.09, pan: i % 2 ? 0.35 : -0.35, send: 0.4 }));
    // กลองนุ่ม ๆ
    if (bi % 8 !== 0 || B) { kick(mix, c.beat(0), 0.55); kick(mix, c.beat(2.5), 0.4); }
    wood(mix, c.beat(1), 0.1); wood(mix, c.beat(3), 0.08, -0.4);
    for (let i = 0; i < (B ? 16 : 8); i++) shaker(mix, c.beat(i * (B ? 0.25 : 0.5)), (i % 2 ? 0.035 : 0.055));
    if (B) playMel(mix, c, ch2Mel[bi - 8], { type: 'sine', a: 0.05, d: 0.1, s: 0.85, r: 0.25, vol: 0.16, vib: 0.006, send: 0.45 });
    else if (bi >= 4) playMel(mix, c, ch2Mel[bi - 4].filter((_, i) => i % 2 === 0).map(([b, m, d]) => [b, m + 12, d]), { type: 'bell', decay: 0.6, a: 0.003, r: 0.3, vol: 0.06, send: 0.5, pan: 0.2 });
  },
};

// ---------- 2) Chapter 2 Boss (ดุ มันส์) ----------
const CB = {
  Dm: { root: 38, pad: [62, 65, 69] }, Bb: { root: 46, pad: [62, 65, 70] }, Gm: { root: 43, pad: [62, 67, 70] },
  A: { root: 45, pad: [61, 64, 69] }, C: { root: 48, pad: [60, 64, 67] },
};
const ch2bLead = [
  [[0, 74, .5], [.5, 77, .5], [1, 81, 1], [2, 79, .5], [2.5, 77, .5], [3, 76, .5], [3.5, 77, .5]],
  [[0, 74, 1.5], [1.5, 70, .5], [2, 74, .5], [2.5, 77, .5], [3, 79, 1]],
  [[0, 79, .5], [.5, 77, .5], [1, 74, 1], [2, 70, .5], [2.5, 74, .5], [3, 79, .5], [3.5, 82, .5]],
  [[0, 81, 2], [2, 76, .5], [2.5, 79, .5], [3, 73, 1]],
  null, null, null,
  [[0, 81, 1], [1, 79, .5], [1.5, 76, .5], [2, 73, 2]],
];
const ch2b = {
  name: 'bgm_ch2_boss', bpm: 140, room: 0.7, wet: 0.6,
  bars: ['Dm', 'Bb', 'Gm', 'A', 'Dm', 'Bb', 'Gm', 'A', 'Bb', 'C', 'Dm', 'Dm', 'Gm', 'A', 'Dm', 'A'].map(k => CB[k]),
  play(mix, c) {
    const { bar, bi, spb } = c, B = bi >= 8;
    for (let i = 0; i < 4; i++) kick(mix, c.beat(i), 0.8);
    snare(mix, c.beat(1)); snare(mix, c.beat(3));
    if (bi % 4 === 3) { snare(mix, c.beat(3.5), 0.3); snare(mix, c.beat(3.75), 0.35); }
    for (let i = 0; i < 4; i++) hat(mix, c.beat(i + 0.5), 0.1, i === 3);
    if (bi % 8 === 0) crash(mix, c.beat(0));
    // เบสสลับอ็อกเทฟ 8 ส่วน
    for (let i = 0; i < 8; i++) note(mix, c.beat(i * 0.5), 0.45 * spb, bar.root - 12 + (i % 2 ? 12 : 0), { type: 'saw', lp: 350, lpEnv: 1400, lpDecay: 0.08, a: 0.003, d: 0.1, s: 0.6, r: 0.05, vol: 0.28, send: 0.05 });
    // สแตบคอร์ด
    for (const b of [0.5, 1.5, 2.5, 3.25]) for (const m of bar.pad) wide(mix, c.beat(b), 0.18 * spb, m, { type: 'saw', lp: 1800, lpEnv: 2500, lpDecay: 0.06, a: 0.003, s: 0.5, r: 0.08, vol: 0.06, send: 0.25, voices: 2 });
    if (!B) {
      const mel = ch2bLead[bi] || ch2bLead[bi - 4];
      playMel(mix, c, mel, { type: 'sqr', lp: 2600, a: 0.005, d: 0.1, s: 0.7, r: 0.08, vol: 0.11, vib: 0.005, send: 0.3 });
    } else {
      const ar = [0, 1, 2, 1];
      for (let i = 0; i < 16; i++) note(mix, c.beat(i * 0.25), 0.2 * spb, bar.pad[ar[i % 4]] + 12 + (i >= 8 ? 12 : 0), { type: 'sqr', lp: 3000, decay: 0.12, a: 0.002, r: 0.05, vol: 0.07, pan: i % 2 ? 0.4 : -0.4, send: 0.3 });
      wide(mix, c.beat(0), 4 * spb, bar.pad[2] + 12, { type: 'saw', lp: 1500, a: 0.3, s: 0.8, r: 0.3, vol: 0.06, send: 0.4, voices: 2 });
    }
  },
};

// ---------- 3) Chapter 3 · Throne of the First Seed (ยิ่งใหญ่ อบอุ่น เศร้านิด ๆ) ----------
const C3 = {
  Cm: { root: 36, pad: [60, 63, 67, 72] }, Ab: { root: 44, pad: [60, 63, 68, 72] }, Eb: { root: 39, pad: [58, 63, 67, 70] },
  Bb: { root: 46, pad: [58, 62, 65, 70] }, Fm: { root: 41, pad: [60, 65, 68, 72] }, G: { root: 43, pad: [59, 62, 67, 71] },
};
const ch3Mel = [
  [[0, 72, 1.5], [1.5, 75, .5], [2, 80, 2]],
  [[0, 79, 1], [1, 77, 1], [2, 74, 2]],
  [[0, 75, 1.5], [1.5, 74, .5], [2, 72, 1], [3, 67, 1]],
  [[0, 72, 3], [3, 74, 1]],
  [[0, 75, 1.5], [1.5, 77, .5], [2, 80, 1.5], [3.5, 79, .5]],
  [[0, 79, 2], [2, 74, 1], [3, 71, 1]],
  [[0, 72, 1], [1, 75, 1], [2, 79, 2]],
  [[0, 77, 1], [1, 75, 1], [2, 74, 2]],
];
const ch3 = {
  name: 'bgm_ch3', bpm: 84, room: 0.86,
  bars: ['Cm', 'Ab', 'Eb', 'Bb', 'Cm', 'Ab', 'Fm', 'G', 'Ab', 'Bb', 'Cm', 'Cm', 'Fm', 'G', 'Cm', 'G'].map(k => C3[k]),
  play(mix, c) {
    const { bar, bi, spb } = c, B = bi >= 8;
    for (const m of bar.pad) wide(mix, c.beat(0), 4 * spb, m, { type: 'saw', lp: B ? 1400 : 1000, a: 0.7, d: 0.5, s: 0.85, r: 1.0, vol: 0.055, send: 0.55, voices: 3, spread: 0.006 });
    note(mix, c.beat(0), 4 * spb, bar.root, { type: 'saw', lp: 500, a: 0.2, s: 0.9, r: 0.6, vol: 0.2, send: 0.2 });
    note(mix, c.beat(0), 4 * spb, bar.root - 12, { type: 'sine', a: 0.2, s: 0.9, r: 0.6, vol: 0.16, send: 0.05 });
    // เซเลสตาไล่คอร์ด
    const pat = [0, 2, 3, 1, 2, 3, 1, 2];
    pat.forEach((ix, i) => note(mix, c.beat(i * 0.5), 0.4, bar.pad[ix] + 12, { type: 'bell', decay: 0.5, a: 0.002, r: 0.3, vol: B ? 0.05 : 0.08, pan: i % 2 ? 0.4 : -0.3, send: 0.5 }));
    if (B) {
      playMel(mix, c, ch3Mel[bi - 8], { type: 'saw', lp: 1700, a: 0.09, d: 0.2, s: 0.85, r: 0.4, vol: 0.13, vib: 0.007, vibRate: 5, send: 0.5 });
      playMel(mix, c, ch3Mel[bi - 8], { type: 'sine', a: 0.09, s: 0.85, r: 0.4, vol: 0.06, send: 0.5, detune: 0.5 });   // เงาอ็อกเทฟล่าง
      timpani(mix, c.beat(0), bar.root, 0.5);
      if (bi % 2 === 1) { tom(mix, c.beat(3), 98, 0.3, -0.3); tom(mix, c.beat(3.5), 82, 0.35, 0.3); }
    } else {
      if (bi % 4 === 0) timpani(mix, c.beat(0), bar.root, 0.35);
      if (bi >= 4) tom(mix, c.beat(2), 90, 0.18);
    }
    if (bi === 8) crash(mix, c.beat(0), 0.1);
  },
};

// ---------- 4) Chapter 3 Boss (มหากาพย์ ดุดัน) ----------
const C3B = {
  Cm: { root: 36, pad: [60, 63, 67] }, Ab: { root: 44, pad: [60, 63, 68] }, G: { root: 43, pad: [59, 62, 67] },
  Fm: { root: 41, pad: [60, 65, 68] }, Bb: { root: 46, pad: [58, 62, 65] }, Bdim: { root: 47, pad: [59, 62, 65] },
};
const ch3bB = [
  [[0, 77, .5], [.5, 80, .5], [1, 84, 1], [2, 80, .5], [2.5, 79, .5], [3, 77, 1]],
  [[0, 80, .5], [.5, 84, .5], [1, 87, 1], [2, 84, 1], [3, 80, 1]],
  [[0, 83, 1.5], [1.5, 79, .5], [2, 74, 1], [3, 77, 1]],
  [[0, 79, 3], [3, 83, 1]],
  [[0, 77, .5], [.5, 80, .5], [1, 84, 1], [2, 80, .5], [2.5, 79, .5], [3, 77, 1]],
  [[0, 80, .5], [.5, 84, .5], [1, 87, 1], [2, 84, 1], [3, 80, 1]],
  [[0, 79, 1], [1, 83, 1], [2, 86, 2]],
  [[0, 83, 4]],
];
const ch3bC = [
  [[0, 84, 2], [2, 87, 2]], [[0, 86, 4]], [[0, 84, 2], [2, 79, 2]], [[0, 87, 4]],
  [[0, 84, 2], [2, 80, 2]], [[0, 82, 2], [2, 86, 2]], [[0, 83, 4]], [[0, 86, 2], [2, 83, 2]],
];
const ch3b = {
  name: 'bgm_ch3_boss', bpm: 150, room: 0.75, wet: 0.65,
  bars: ['Cm', 'Cm', 'Ab', 'G', 'Cm', 'Cm', 'Ab', 'G', 'Fm', 'Ab', 'G', 'G', 'Fm', 'Ab', 'Bdim', 'G', 'Ab', 'Bb', 'Cm', 'Cm', 'Ab', 'Bb', 'G', 'G'].map(k => C3B[k]),
  play(mix, c) {
    const { bar, bi, spb } = c, sec = bi < 8 ? 0 : bi < 16 ? 1 : 2;
    // กลองหนัก
    [0, 0.75, 1.5, 2, 2.75, 3.5].forEach((b, i) => kick(mix, c.beat(b), i % 3 === 0 ? 0.85 : 0.6));
    snare(mix, c.beat(1), 0.5); snare(mix, c.beat(3), 0.5);
    for (let i = 0; i < 8; i++) hat(mix, c.beat(i * 0.5), i % 2 ? 0.09 : 0.05);
    if (bi % 8 === 0) crash(mix, c.beat(0), 0.16);
    if (bi % 8 === 7) [3, 3.25, 3.5, 3.75].forEach((b, i) => tom(mix, c.beat(b), 140 - i * 18, 0.4, i % 2 ? 0.3 : -0.3));
    // เบสควบม้า
    [0, 0.5, 0.75, 1, 1.5, 1.75, 2, 2.5, 2.75, 3, 3.5, 3.75].forEach(b =>
      note(mix, c.beat(b), 0.22 * spb, bar.root - 12, { type: 'saw', lp: 300, lpEnv: 1200, lpDecay: 0.06, a: 0.002, s: 0.6, r: 0.04, vol: 0.26, send: 0.03 }));
    // คอรัส
    for (const m of bar.pad) wide(mix, c.beat(0), 4 * spb, m, { type: 'tri', a: 0.25, s: 0.9, r: 0.4, vol: 0.07, send: 0.6, voices: 3, spread: 0.01, vib: 0.004 });
    if (sec === 0) {
      for (const b of [0, 0.75, 1.5, 2.5, 3]) for (const m of bar.pad) wide(mix, c.beat(b), 0.2 * spb, m + 12, { type: 'saw', lp: 1400, lpEnv: 2800, lpDecay: 0.07, a: 0.004, s: 0.5, r: 0.1, vol: 0.06, send: 0.35 });
    } else if (sec === 1) {
      playMel(mix, c, ch3bB[bi - 8], { type: 'saw', lp: 2200, a: 0.02, d: 0.15, s: 0.8, r: 0.15, vol: 0.13, vib: 0.006, send: 0.4 });
      playMel(mix, c, ch3bB[bi - 8], { type: 'sqr', lp: 1800, a: 0.02, s: 0.8, r: 0.15, vol: 0.05, send: 0.4, detune: 0.5 });
    } else {
      const ar = [0, 1, 2, 1];
      for (let i = 0; i < 16; i++) note(mix, c.beat(i * 0.25), 0.2 * spb, bar.pad[ar[i % 4]] + 12, { type: 'sqr', lp: 2600, decay: 0.1, a: 0.002, r: 0.04, vol: 0.06, pan: i % 2 ? 0.45 : -0.45, send: 0.3 });
      playMel(mix, c, ch3bC[bi - 16], { type: 'saw', lp: 2000, a: 0.08, s: 0.85, r: 0.3, vol: 0.12, vib: 0.007, send: 0.5 });
    }
  },
};

const out = process.argv[2] || '.';
fs.mkdirSync(out, { recursive: true });
for (const def of [ch2, ch2b, ch3, ch3b]) {
  seed = 12345;
  const { L, R, sec } = renderTrack(def);
  writeWav(path.join(out, def.name + '.wav'), L, R);
  console.log(def.name, sec.toFixed(1) + 's');
}
