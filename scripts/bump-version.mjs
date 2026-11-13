#!/usr/bin/env node
// v8.1.142 ECRS "combine": one command does every version-bump edit of the release skill.
// Usage: node scripts/bump-version.mjs "<changelog title>" "<item 1>|<item 2>" "<Thai QA line>" < delivery-block.md
//   stdin = the new CLAUDE.md "# Latest delivery: …" block (markdown, starts with "# Latest delivery").
// Does: GAME_VERSION patch+1 · CHANGELOG entry (today) · CLAUDE.md version line · new Latest block,
//       old Latest → Previous, old Previous → docs/CLAUDE_HISTORY.md · "รอ QA" line in docs/LAUNCH_RULES.md
import fs from 'node:fs';
const [title, items, qa] = process.argv.slice(2);
if (!title || !items) { console.error('usage: bump-version.mjs "<title>" "<a|b>" "<qa line>" < block.md'); process.exit(1); }
const block = fs.readFileSync(0, 'utf8').trim();
if (!/^# Latest delivery: /.test(block)) { console.error('stdin must start with "# Latest delivery: "'); process.exit(1); }
const esc = s => s.replace(/\\/g, '\\\\').replace(/'/g, '’');
if (/[฀-๿]/.test(title + items)) { console.error('changelog text must be English'); process.exit(1); }
let g = fs.readFileSync('game.js', 'utf8');
const cur = g.match(/const GAME_VERSION = '(\d+)\.(\d+)\.(\d+)';/); if (!cur) throw Error('GAME_VERSION not found');
const next = `${cur[1]}.${cur[2]}.${+cur[3] + 1}`, after = `${cur[1]}.${cur[2]}.${+cur[3] + 2}`;
const date = new Date().toISOString().slice(0, 10);
g = g.replace(cur[0], `const GAME_VERSION = '${next}';`);
const list = items.split('|').map(s => `'${esc(s.trim())}'`).join(',');
if (!g.includes('const CHANGELOG = [\n')) throw Error('CHANGELOG not found');
g = g.replace('const CHANGELOG = [\n', `const CHANGELOG = [\n  {v:'${next}',date:'${date}',title:'${esc(title)}',items:[${list}]},\n`);
fs.writeFileSync('game.js', g);
let c = fs.readFileSync('CLAUDE.md', 'utf8');
c = c.replace(/Current release: \*\*[\d.]+\*\*\. Next release:\s*[\d.]+\./, `Current release: **${next}**. Next release:${after}.`);
const pi = c.indexOf('# Previous delivery'), body = c.indexOf('## 1. ');
if (pi < 0 || body < 0) throw Error('delivery blocks not found');
const oldPrev = c.slice(pi, body);
c = c.slice(0, pi) + c.slice(body);
c = c.replace('# Latest delivery', '# Previous delivery');
c = c.replace('# Previous delivery', block.replace(/^# Latest delivery: (v[\d.]+ — )?/, `# Latest delivery: v${next} — `) + '\n\n# Previous delivery');
fs.writeFileSync('CLAUDE.md', c);
fs.appendFileSync('docs/CLAUDE_HISTORY.md', '\n' + oldPrev.replace('# Previous delivery', '# Delivery'));
if (qa) { const p = 'docs/LAUNCH_RULES.md', h = '## รอ QA (AI เพิ่ม · เจ้าของเทสแล้วลบ)\n'; let l = fs.readFileSync(p, 'utf8');
  if (l.includes(h)) { l = l.replace(h, h + `- v${next} ${qa}\n`); fs.writeFileSync(p, l); } }
console.log(`bumped to v${next}`);
