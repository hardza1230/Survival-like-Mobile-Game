// v8.3.30 owner 27 Nov: overview pages for heroes (builds, paths, talent trees, strengths/weaknesses)
// and items (gear, Forge mods, currencies, in-run mods). Tables come from game.js so they stay true;
// the Thai notes in NOTES are a hand-written reading of the code, not playtest results.
// Run: node scripts/build-overviews.cjs  → docs/HEROES_OVERVIEW.html + docs/ITEMS_OVERVIEW.html
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'game.js'), 'utf8');
const pre = src.slice(0, src.indexOf('class Game extends Phaser.Scene'));
const P = new Proxy(function () {}, { get: (t, k) => (k === 'prototype' ? {} : P), apply: () => P, construct: () => P });
const ctx = { console, Math, JSON, Date, Phaser: P, setTimeout, clearTimeout, fetch: () => Promise.reject(),
  window: { addEventListener() {}, location: { href: '', hostname: '' }, navigator: {} },
  document: { addEventListener() {}, createElement: () => P, getElementById: () => null, querySelector: () => null },
  localStorage: { getItem: () => null, setItem() {} }, navigator: { userAgent: '' }, location: { hostname: '', href: '' } };
vm.createContext(ctx);
vm.runInContext(pre.replace(/^(const|let) /gm, 'var ').replace(/^class (\w+)/gm, 'var $1=class $1'), ctx);
const C = ctx, VER = C.GAME_VERSION;
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const hex = n => '#' + (n >>> 0).toString(16).padStart(6, '0').slice(-6);
const stars = n => '●'.repeat(n) + '○'.repeat(Math.max(0, 5 - n));

const NOTES = {
  momo: { play: 'ปืนยิงเร็ว เดินคล่อง คริตแล้วฟื้นเลือด · เล่นง่ายสุด เหมาะผู้เล่นใหม่',
    good: ['เล่นได้ทุกระยะ ไม่ต้องเรียนรู้ระบบพิเศษ', '3 สายครอบคลุม บอส / ระยะใกล้ / ฝูง', 'Passive คริตแล้วฮีล ช่วยยืนระยะ'],
    bad: ['ไม่มีควบคุมฝูง (แช่แข็ง/ดึง/สตัน)', 'ทุกค่ากลาง ๆ ไม่มีจุดเด่นด้านทน'],
    paths: { sniper: ['ตีบอสหนักสุด (×3.84) ยิงทะลุ', 'ยิงช้า ฝูงล้อมลำบาก · แดช/โดนตีทำให้ยิงก่อนชาร์จเต็ม'],
      shotgun: ['ระเบิดดาเมจระยะใกล้ (ใน 120px แรงขึ้น)', 'ต้องเข้าใกล้ศัตรู เสี่ยงโดนตี'],
      ricochet: ['เคลียร์ฝูงเร็ว ยิงเร็วขึ้น 25% กระสุนเด้งแรงขึ้นเรื่อย ๆ', 'กระสุนเริ่มอ่อนลง 20% · บอสเดี่ยวช้ากว่า Sniper'] } },
  mint: { play: 'คุมฝูงด้วย Chill → Freeze · เร็วที่สุดในทีม HP/DEF ดี',
    good: ['คุมฝูงดีสุด ศัตรูช้า/แข็ง = โดนตีน้อย', 'เดินเร็ว 5/5 หนีเก่ง', 'บอสที่ติด Chill รับดาเมจเพิ่ม'],
    bad: ['ดาเมจพื้นฐานต่ำสุด (2/5)', 'สาย Glacier/Impaler ต้องตีซ้ำตามจังหวะ เข้าใจยากกว่า'],
    paths: { glacier: ['แช่แข็งแล้วแตก คุมฝูงทั้งกลุ่ม', 'ต้องตีซ้ำ 3 Frost ก่อนแตก · บอสได้แค่ Brittle'],
      barrage: ['ยิงต่อเนื่อง 2 หอก เร็ว 22% มีเศษน้ำแข็งเคลียร์ฝูง', 'หอกเกิน 2 ยิ่งเยอะยิ่งอ่อน 15%/หอก'],
      pierce: ['หอกชาร์จทะลุ ระยะ +30% ตีบอส/อีลิทดี (Rupture)', 'ยิงช้าลง 40% · ฝูงประชิดรับมือยาก'] } },
  cocoa: { play: 'นักชกแนวหน้า ถึกที่สุด · Flicker วาร์ปชกต่อเนื่อง · Unique ต่างกันทุกสาย',
    good: ['HP + DEF สูงสุด (5/5) ยืนแลกได้', 'Passive เลือดต่ำ 40% ทนขึ้นและแรงขึ้น', 'แต่ละสายมี Unique กดครั้งเดียวของตัวเอง'],
    bad: ['ช้าที่สุด (2/5) หนีไม่เก่ง', 'ระยะประชิดเป็นหลัก (ยกเว้น Fire Fist)', 'ระบบ Flicker/คอมโบ ต้องเรียนรู้'],
    paths: { brawler: ['ต่อยไกลได้ หมัดที่ 5 ลูกไฟระเบิดทะลุ · Rocket Gauntlet ล็อกเป้าแรงสุด', 'ดาเมจกระจาย ไม่หนักเท่า Titan ต่อเป้าเดียว'],
      titan: ['หมัดหนัก ×1.7 · Tremor ทำให้ศัตรูรับดาเมจ +6%/ชั้น · ฮีลดีขึ้น · Colossus Fist ×4.2', 'ช้าลง 45% · Blood Rage เสีย HP'],
      dashboxer: ['แดช +1 ชาร์จ ฟื้นเร็ว 25% คล่องที่สุดของโกโก้', 'หมัดอ่อนลง 10% · ต้องแดชเป็นจังหวะถึงจะคุ้ม'] } },
  taro: { play: 'สายฟ้าโยงหลายเป้า เดินเร็ว แดชแล้วปล่อยคลื่นสายฟ้า · ดาเมจสูงแต่บาง',
    good: ['ดาเมจ 4/5 + เร็ว 5/5', 'สายฟ้าโยงเคลียร์ฝูงเก่ง', 'Plasma Field ทำให้ศัตรูรับดาเมจ +25%'],
    bad: ['บางที่สุด HP/DEF 2/5 พลาดนิดเดียวเจ็บ', 'สาย Sentry ต้องอยู่ใกล้ป้อม'],
    paths: { storm: ['สายฟ้าแรงขึ้นทุกจั๊มพ์ · ไม่มีเป้าใหม่ = ลงบอสทั้งหมด (ดีทั้งฝูงและบอส)', 'ต้องเข้าใกล้กลุ่มศัตรูพอให้โยง'],
      smite: ['สปาร์กทั่วจอ เด้งขอบจอ ทะลุและแตกตัว เคลียร์ฝูงกว้าง', 'ดาเมจต่อเป้าเดียวกระจาย บอสเดี่ยวช้ากว่า Arc'],
      tempest: ['ตั้งป้อม 2–3 ลูก ช็อตรอบตัวหลายครั้งต่อวิ คุมพื้นที่', 'เดินไกลป้อมหาย · ไม่เหมาะด่านที่ต้องวิ่งมาก'] } },
  yuzu: { play: 'สู้คู่กับเพื่อนซิตรัส 1 ตัว · เมล็ดของ Yuzu มาร์กเป้า เพื่อนตีเป้ามาร์ก +25%',
    good: ['มี 2 ตัวช่วยกันตี (Yuzu + คู่หู)', '3 คู่หูเล่นต่างกันชัด: ไกล / แนวหน้า / เวท', 'Unique ให้คู่หูออกท่าใหญ่ + In Sync 4 วิ'],
    bad: ['ดาเมจพึ่งคู่หู ควบคุมอ้อม (เดินเข้าหาเพื่อเล็ง)', 'ค่าตัวกลาง ๆ ไม่ถึก ไม่เร็ว'],
    paths: { zestSwarm: ['Lime ยิงธนูทะลุระยะไกล มีกับดักรัด', 'ระยะใกล้อ่อน ต้องรักษาระยะ'],
      citrusGuardian: ['Pomelo แนวหน้า โล่ ทุบพื้นสตัน ปกป้อง Yuzu', 'ช้า ต้องให้ศัตรูเข้ามาใกล้'],
      juiceWorkshop: ['Blood Orange เวทพื้นที่ 3 รส มีฮีล (Honey Rescue)', 'ต้องรอจังหวะเวท ดาเมจทันทีน้อย'] } },
  sesame: { play: 'ผสมลูกแก้ว 3 สี (แดง/เขียว/ฟ้า) เป็น 10 คาถา คูลดาวน์แยก · ไม่มี Build Path (ใช้ต้นไม้ Rune)',
    good: ['ลึกที่สุด มี 10 คาถา บอส/เคลียร์/บัฟ ครบในตัวเดียว', 'HP/DEF 4/5 ทนพอสมควร', 'BBB ให้เกราะน้ำ · PMB ระเบิดทุกทิศ'],
    bad: ['เรียนรู้ยากที่สุด ต้องกดผสมบ่อยบนมือถือ', 'คริตพื้นฐานต่ำสุด (1%) · ดาเมจพื้นฐาน ×0.96'],
    paths: {} },
};

const css = fs.readFileSync(path.join(root, 'docs/MISSIONS_OVERVIEW.html'), 'utf8').match(/<style>[\s\S]*?<\/style>/)[0]
  .replace('</style>', `.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:8px}
.pp{display:flex;gap:6px;flex-wrap:wrap}.chipx{font-size:12px;padding:2px 8px;border-radius:999px;background:var(--chip);border:1px solid var(--line)}
.good{border-left:3px solid var(--keep);padding:4px 10px;background:var(--chip);border-radius:0 8px 8px 0;font-size:13.5px;margin:6px 0}
.badx{border-left:3px solid var(--cut);padding:4px 10px;background:var(--chip);border-radius:0 8px 8px 0;font-size:13.5px;margin:6px 0}
.good ul,.badx ul{margin:2px 0 2px 18px;padding:0}
details{margin:6px 0}summary{cursor:pointer;font-weight:600;font-size:13.5px}
.tree{display:grid;grid-template-columns:70px 1fr;gap:4px 8px;font-size:13px;margin:6px 0}.tree .lv{color:var(--mute);font-size:12px}
.dot{display:inline-block;width:10px;height:10px;border-radius:50%;vertical-align:middle;margin-right:4px}
</style>`);
const page = (title, sub, nav, body) => `<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
${css}
</head>
<body><main>
<h1>${esc(title)}</h1>
<div class="sub">${sub}</div>
<nav>${nav.map(([id, t]) => `<a href="#${id}">${esc(t)}</a>`).join('')}</nav>
${body}
<p class="note">สร้างจากโค้ดเกม v${esc(VER)} ด้วย <code>node scripts/build-overviews.cjs</code> · ตารางตัวเลขดึงจากโค้ดจริง · ข้อดี/ข้อเสียเป็นการอ่านโค้ดของ AI ไม่ใช่ผลทดสอบเล่น</p>
</main></body></html>
`;
const table = (head, rows) => `<div class="wrap"><table><tr>${head.map(h => `<th>${esc(h)}</th>`).join('')}</tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
const ul = a => `<ul>${a.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;

/* ---------- Heroes ---------- */
function treeHtml(id) {
  const T = C.PATH_TALENTS[id]; if (!T) return '';
  const rows = [['ราก', ['root']], ['ชั้น A', ['a1', 'a2']], ['ชั้น B', ['b1', 'b2']], ['ชั้น C', ['c1', 'c2']], ['ปลายสาย', ['capA', 'capB', 'capC']]];
  const known = new Set(rows.flatMap(r => r[1])), extra = Object.keys(T).filter(k => !known.has(k));
  if (extra.length) rows.push(['อื่น ๆ', extra]);
  return `<div class="tree">${rows.map(([lv, ks]) => { const items = ks.filter(k => T[k]); if (!items.length) return '';
    return `<div class="lv">${lv}</div><div>${items.map(k => `<b>${esc(T[k].name)}</b> (×${T[k].max})${T[k].soon ? ' <span class="st move">เร็ว ๆ นี้</span>' : ''} — ${esc(T[k].per)}`).join('<br>')}</div>`; }).join('')}</div>`;
}
let hb = '', hnav = [['roster', 'ภาพรวมทีม']];
const order = C.CHAR_ORDER;
hb += `<section id="roster"><h2>ภาพรวมทีม</h2><p class="lead">ฮีโร่ที่เล่นได้ ${order.length} ตัว (Berry Core พักไว้) · ค่า ●=ระดับ 1–5 จากหน้า Heroes · ปลดล็อกตามด่าน Story</p>` +
  table(['ฮีโร่', 'บทบาท', 'HP', 'ATK', 'SPD', 'DEF', 'ปลดล็อก', 'Unique', 'Passive'], order.map(h => { const c = C.CHARACTERS[h], r = c.rating, u = C.CHARACTER_UNIQUES[c.unique], ps = C.CHAR_PASSIVES[h];
    const un = C.CORE_UNLOCK_STAGE[h]; return [`${c.emoji} <b>${esc(c.name)}</b>`, esc(c.role), stars(r.hp), stars(r.atk), stars(r.spd), stars(r.def), un == null ? 'เริ่มเกม' : 'หลังผ่าน C1-' + (un + 1) + (c.cost ? ` · ${c.cost}` : ''), u ? `${u.emoji} ${esc(u.name)} (${u.cd} วิ)` : '-', ps ? `${ps.emoji} ${esc(ps.name)}` : '-']; })) + `</section>`;
for (const h of order) {
  const c = C.CHARACTERS[h], N = NOTES[h] || { good: [], bad: [], paths: {} }, u = C.CHARACTER_UNIQUES[c.unique], ps = C.CHAR_PASSIVES[h], w = C.SIGNATURE_WEAPONS[c.weapon];
  hnav.push([h, c.emoji + ' ' + c.name]);
  const s = c.stats, ut = C.UNIQUE_TIERS[c.unique] || {};
  let b = `<section id="${h}"><h2><span class="dot" style="background:${hex(c.color)}"></span>${c.emoji} ${esc(c.name)} <span class="tag ax">${esc(c.role)}</span></h2>
<p class="lead">${esc(N.play || c.desc)}</p>
<div class="pp"><span class="chipx">HP +${s.hp}</span><span class="chipx">DMG ×${s.dmg}</span><span class="chipx">SPD ×${s.spd}</span><span class="chipx">รับดาเมจ ×${s.def}</span><span class="chipx">Crit ${Math.round(s.crit * 100)}%</span><span class="chipx">CD ×${s.cdr}</span><span class="chipx">Regen ${s.regenFlat}/s</span></div>
<div class="good"><b>จุดเด่น</b>${ul(N.good)}</div><div class="badx"><b>จุดด้อย</b>${ul(N.bad)}</div>
<div class="m"><h3>อาวุธ · Unique · Passive</h3>
${w ? `<div>${w.emoji} <b>${esc(w.name)}</b> — ${esc(w.trait || '')}</div>` : ''}
${u ? `<div>${u.emoji} <b>${esc(u.name)}</b> (คูลดาวน์ ${u.cd} วิ) — ${esc(u.desc)}</div><div class="note">เลเวล Unique: ${Object.entries(ut).map(([k, v]) => 'Lv' + k + ' ' + esc(v)).join(' · ')}</div>` : ''}
${ps ? `<div>${ps.emoji} <b>${esc(ps.name)}</b> — ${esc(ps.desc)}</div>` : ''}</div>`;
  const paths = h === 'sesame' ? [] : (C.BASIC_PATHS[h] || []);
  for (const p of paths) {
    const pn = (N.paths || {})[p.id], pu = (h === 'cocoa' && C.COCOA_UNIQUES[p.id]) || (h === 'taro' && C.TARO_UNIQUES?.[p.id]) || (h === 'yuzu' && C.YUZU_UNIQUES?.[p.id]);
    b += `<div class="m"><h3>${esc(p.emoji || '')} ${esc(p.name)} ${C.BUILD_PATH_STYLES[p.id] ? `<span class="poe">${esc(C.BUILD_PATH_STYLES[p.id])}</span>` : ''}</h3>
<div>${esc(p.headline ? p.headline + ' · ' : '')}${esc(p.desc)}</div>
${pn ? `<div class="good">ดี: ${esc(pn[0])}</div><div class="badx">ระวัง: ${esc(pn[1])}</div>` : ''}
${pu ? `<div class="note">Unique ของสาย: ${pu.emoji || ''} <b>${esc(pu.name)}</b> — ${esc(pu.desc)}</div>` : ''}
<details><summary>การ์ดสาย (${p.upgrades.length})</summary>${table(['การ์ด', 'สูงสุด', 'ผล'], p.upgrades.map(x => [`<b>${esc(x.name)}</b>${x.headline ? '<br><span class="note">' + esc(x.headline) + '</span>' : ''}`, '×' + x.max, esc(x.desc || '')]))}</details>
<details><summary>ต้นไม้ Path Talent</summary>${treeHtml(p.id) || '<p class="note">ไม่มี</p>'}</details></div>`;
  }
  if (h === 'sesame') {
    const R = C.SES_RUNE_RECIPES || {};
    b += `<div class="m"><h3>⚫ คาถา Rune (ผสม 3 ลูก)</h3>${table(['สูตร', 'ชื่อ', 'หน้าที่', 'คูลดาวน์'], Object.entries(R).map(([k, r]) => [`<code>${k.toUpperCase()}</code>`, `${esc(r.emoji || '')} ${esc(r.name)}`, esc(r.role || ''), (r.cd ?? '-') + ' วิ']))}
<p class="note">P = แดง (ดาเมจ/ระเบิด) · M = เขียว (เคลื่อนที่/ความเร็วตี) · B = ฟ้า (ฟื้นเลือด/ยิงซ้ำ)</p>
<details><summary>ต้นไม้ Rune Talent</summary>${treeHtml('sesRune')}</details></div>`;
  }
  const T = C.CHAR_TALENTS[h] || [];
  b += `<details><summary>Hero Talent (ใช้แต้ม Talent ถาวร · ${T.length} ช่อง + Unique Mastery)</summary>${table(['Talent', 'สูงสุด', 'ต่อขั้น'], T.concat([C.UNIQUE_TALENT]).map(t => [`${t.emoji} ${esc(t.name)}`, '×' + t.max, esc(t.per)]))}</details>`;
  const M = C.MODIFIERS[h] || [], Fu = C.FUSIONS[h] || [];
  b += `<details><summary>Modifier ในรอบเล่น (${M.length} · ติดได้ ${C.MOD_MAX}) + Fusion (${Fu.length})</summary>${table(['ชื่อ', 'แท็ก', 'ผล'], M.map(m => [`${m.emoji} ${esc(m.name)}`, esc((m.tags || []).join(', ')), esc(m.desc)]).concat(Fu.map(f => [`${f.emoji} <b>${esc(f.name)}</b> <span class="st new">Fusion</span>`, esc('Relic: ' + f.relic), esc(f.desc)])))}</details></section>`;
  hb += b;
}
hb += `<section id="share"><h2>ระบบร่วมทุกฮีโร่</h2>
<div class="m"><h3>สกิลการ์ดระหว่างเล่น (${Object.keys(C.SKILLDEFS).length})</h3>${table(['สกิล', 'บทบาท', 'สูงสุด', 'ผล', 'ตื่น (Awaken)'], Object.values(C.SKILLDEFS).map(s => [`${s.emoji} ${esc(s.name)}`, esc(s.role || ''), '×' + s.max, esc(s.desc), s.awaken ? `${s.awaken.emoji} ${esc(s.awaken.name)} — ${esc(s.awaken.desc)}` : '-']))}</div>
<div class="m"><h3>Passive การ์ด (ติดได้ ${C.PASSIVE_CAP})</h3>${table(['Passive', 'สูงสุด', 'ผล'], Object.values(C.PASSIVES).map(p => [`${p.emoji} ${esc(p.name)}`, '×' + p.max, esc(p.desc)]))}</div>
<div class="m"><h3>Flavor Infusion</h3>${table(['ชื่อ', 'ผล'], C.FLAVOR_INFUSIONS.concat([C.INFUSION_UP]).map(f => [`${f.emoji} ${esc(f.name)}`, esc(f.desc)]))}</div></section>`;
hnav.push(['share', 'ระบบร่วม']);
fs.writeFileSync(path.join(root, 'docs/HEROES_OVERVIEW.html'), page('สรุปตัวละคร Mochi Mayhem', 'ฮีโร่ · Build Path · ต้นไม้ Talent · Unique · Modifier · จุดเด่น/จุดด้อย — เปิดดูบนมือถือ แตะหัวข้อเพื่อกระโดด', hnav, hb));

/* ---------- Items / Forge / Mods ---------- */
let ib = '', inav = [['gear', 'อุปกรณ์'], ['rarity', 'ระดับ/เลเวล'], ['sets', 'เซ็ต'], ['unique', 'Unique'], ['forge', 'Forge (Mod)'], ['cur', 'สกุลคราฟ'], ['run', 'ของในรอบเล่น'], ['shop', 'กล่อง/ร้าน']];
const tierTh = { start: 'เริ่มต้น', common: 'Common', rare: 'Rare', epic: 'Epic', legend: 'Legendary' };
ib += `<section id="gear"><h2>อุปกรณ์ 6 ช่อง</h2><p class="lead">${C.GEAR_SLOTS.map(s => s.emoji + ' ' + s.label).join(' · ')} · ตีบวกได้ถึง +${C.GEAR_ENH_MAX} · ของดรอปมีค่าพื้นฐาน + implicit + Mod ตาม rarity</p>` +
  C.GEAR_SLOTS.map(s => `<details><summary>${s.emoji} ${esc(s.label)} (${(C.GEAR[s.slot] || []).length})</summary>${table(['ชิ้น', 'ระดับ', 'บท', 'เซ็ต', 'ผล'], (C.GEAR[s.slot] || []).filter(g => g.name !== 'None').map(g => [`${g.emoji} ${esc(g.name)}`, tierTh[g.tier] || g.tier, g.chapter ?? '-', esc(g.set ? (C.GEAR_SETS[g.set]?.name || g.set) : '-'), esc(g.desc)]))}</details>`).join('') +
  `<div class="m"><h3>Implicit (ค่าติดตัวไอเทม)</h3>${table(['Implicit', 'ช่อง', 'ค่า', 'เลเวลขั้นต่ำ'], C.IMPLICIT_POOL.map(i => [`${i.emoji} ${esc(i.label)}`, esc(i.slots.join(', ')), i.r.join('–'), i.min]))}</div></section>`;
ib += `<section id="rarity"><h2>ระดับไอเทม · Item Level</h2>
${table(['Rarity', 'จำนวน Mod เริ่ม', 'แยกชิ้นได้ Twist Cream', 'ดรอปสกุลคราฟ'], Object.keys(C.AFFIX_COUNT).map(k => [tierTh[k] || k, C.AFFIX_COUNT[k], C.GEAR_DISMANTLE_BASE[k] ?? '-', esc(Object.entries(C.CURRENCY_DROP_POOLS[k] || {}).map(([a, b]) => a + ' ' + b + '%').join(' · ') || '-')]))}
${table(['บท', 'Item Level', 'Mod tier ดีสุด', 'ชื่อ'], C.ITEM_LEVEL_BANDS.map(b => ['C' + b.chapter, b.min + '–' + b.max, 'T' + b.bestAffixTier, esc(b.label)]))}
<p class="note">ยิ่งบทลึก item level สูง → ได้ Mod tier ที่ดีกว่า (ตามกฎ "ยิ่งยาก รางวัลยิ่งดี")</p></section>`;
ib += `<section id="sets"><h2>เซ็ตอุปกรณ์ (${Object.keys(C.GEAR_SETS).length})</h2>${table(['เซ็ต', 'โบนัส', 'สะสมครบ'], Object.values(C.GEAR_SETS).map(s => [`${s.emoji} ${esc(s.name)}`, Object.values(s.bonuses).map(x => esc(x.desc)).join('<br>'), esc(s.collect?.desc || '-')]))}</section>`;
ib += `<section id="unique"><h2>Unique Gear (${Object.keys(C.UNIQUE_GEAR).length})</h2><p class="lead">ของพิเศษ มีข้อดีแรง + ข้อแลก · ดรอปจากด่านตามธีม</p>${table(['ชิ้น', 'ช่อง', 'ผล'], Object.entries(C.UNIQUE_GEAR).map(([k, g]) => [`${g.emoji} ${esc(g.name)}`, esc(g.slot || k), esc(g.desc)]))}</section>`;
const F = C.FORGE_DEFS.filter(f => f.enabled), rowTh = { power: 'Power (โจมตี)', sustain: 'Sustain (ทน/ฟื้น)', play: 'Play (เล่น/เคลื่อนที่)' };
ib += `<section id="forge"><h2>Affix Forge — Mod บนอุปกรณ์</h2><p class="lead">เปิดใช้ ${F.length} จาก ${C.FORGE_DEFS.length} Mod ในแคตตาล็อก · ช่องไอเทมกำหนดแถวที่สุ่มได้ · Pity ${C.FORGE_PITY} ครั้ง</p>
${table(['ช่อง', 'แถว Mod ที่ได้'], Object.entries(C.FORGE_SLOT_ROWS).map(([k, v]) => [esc(k), esc(v.map(r => rowTh[r] || r).join(' · '))]))}
${Object.keys(rowTh).map(r => { const L = F.filter(f => f.row === r); return `<details${r === 'power' ? ' open' : ''}><summary>${rowTh[r]} (${L.length})</summary>${table(['#', 'Mod', 'ผล', 'ช่อง', 'ค่าสูงสุด (T1)', 'ต่ำสุด'], L.map(f => [f.number, `${f.emoji || ''} <b>${esc(f.label)}</b>`, esc(f.description), esc(f.slots.join(', ')), (f.tiers?.[0] || []).join('–') || f.maxValue, (f.tiers?.[f.tiers.length - 1] || []).join('–')]))}</details>`; }).join('')}
<div class="m"><h3>Mod พิเศษ (Special affix)</h3>${table(['Mod', 'ช่อง', 'Item Level ขั้นต่ำ', 'ค่า'], C.SPECIAL_AFFIX_POOL.map(a => [`${a.emoji} ${esc(a.label)}`, esc(a.slots.join(', ')), a.minItemLevel, (a.tiers?.[0] || []).join('–')]))}</div></section>`;
ib += `<section id="cur"><h2>สกุลคราฟ (${C.CURRENCY.length})</h2>${table(['สกุล', 'ใช้ทำอะไร'], C.CURRENCY.map(c => [`${c.emoji} <b>${esc(c.name)}</b>`, esc(c.desc)]))}
<p class="note">ได้จากภารกิจ (MISSION_REWARDS) · แยกชิ้นอุปกรณ์ · ดรอปตาม rarity · ย้าย Mod ใช้ ${C.FORGE_MOVE_COST} Recipe Ink · 🧶 Thread ได้จากการเล่นเท่านั้น (ห้ามขาย)</p>
${table(['ภารกิจ', 'รางวัลคราฟ'], Object.entries(C.MISSION_REWARDS).map(([k, v]) => [esc(C.WAVE_OBJECTIVES[k]?.name || k), esc(v[0] + ' ×' + v[1])]))}</section>`;
ib += `<section id="run"><h2>ของในรอบเล่น (หายเมื่อจบด่าน)</h2>
<div class="m"><h3>Relic (ติดได้ ${C.RELIC_CAP})</h3>${table(['Relic', 'สั้น ๆ', 'ผล'], Object.values(C.RELICS).map(r => [`${r.emoji} ${esc(r.name)}`, esc(r.headline || ''), esc(r.desc)]))}</div>
<div class="m"><h3>Trade-off (ติดได้ ${C.TRADE_MAX}) — ได้แรง เสียบางอย่าง</h3>${table(['ชื่อ', 'ได้', 'เสีย', 'รางวัลเพิ่ม'], C.TRADEOFFS.map(t => [`${t.emoji} ${esc(t.name)}`, esc(t.gain), esc(t.cost), esc(t.reward || '-')]))}</div>
<p class="note">Modifier + Fusion ของแต่ละฮีโร่ ดูที่หน้าสรุปตัวละคร</p></section>`;
ib += `<section id="shop"><h2>กล่อง / ร้าน</h2>${table(['กล่อง', 'ราคา', 'โอกาส'], C.CHESTS.map(c => [esc(c.name), c.cost, esc(c.odds.map(([a, b]) => (tierTh[a] || a) + ' ' + (b * 100).toFixed(1) + '%').join(' · '))]))}
<p class="note">ปิด/ซ่อนอยู่: Kitchen + Flavor Recipes (KITCHEN_ON=${C.KITCHEN_ON}) · Mail inbox (GEAR_INBOX_ON=${C.GEAR_INBOX_ON}) · ห้ามขายพลัง (LAUNCH_RULES กฎ 4)</p></section>`;
fs.writeFileSync(path.join(root, 'docs/ITEMS_OVERVIEW.html'), page('สรุปไอเทม คราฟ และ Mod', 'อุปกรณ์ · ระดับ/เลเวล · เซ็ต · Unique · Affix Forge · สกุลคราฟ · ของในรอบเล่น', inav, ib));
console.log('wrote docs/HEROES_OVERVIEW.html + docs/ITEMS_OVERVIEW.html (v' + VER + ')');
