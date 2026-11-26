#!/usr/bin/env node
// v8.1.142 ECRS "combine": one command does every version-bump edit of the release skill.
// Usage: node scripts/bump-version.mjs "<changelog title>" "<item 1>|<item 2>" "<Thai QA line>" < delivery-block.md
//   stdin = the new CLAUDE.md "# Latest delivery: …" block (markdown, starts with "# Latest delivery").
// Does: GAME_VERSION patch+1 · CHANGELOG entry (today) · CLAUDE.md version + Latest line · docs/DELIVERIES.md new Latest block,
//       old Latest → Previous, old Previous → docs/CLAUDE_HISTORY.md · "รอ QA" line in docs/QA_PENDING.md
import fs from 'node:fs';
const [title, items, qa] = process.argv.slice(2);
if (!title || !items) { console.error('usage: bump-version.mjs "<title>" "<a|b>" "<qa line>" < block.md'); process.exit(1); }
const block = fs.readFileSync(0, 'utf8').trim();
if (!/^# Latest delivery: /.test(block)) { console.error('stdin must start with "# Latest delivery: "'); process.exit(1); }
const esc = s => s.replace(/\\/g, '\\\\').replace(/'/g, '’');
if (/[฀-๿]/.test(title + items)) { console.error('changelog text must be English'); process.exit(1); }
// v8.2.15 owner: News showed "a" for ten updates — items must be real player-facing sentences
if (items.split('|').some(s => s.trim().length < 12)) { console.error('each changelog item must be a real sentence (≥ 12 chars) — the News screen shows them to players'); process.exit(1); }
// v8.3.11 game code is split into src/NN-*.js → edit the parts, then rebuild game.js (scripts/build-game.mjs)
import { execFileSync } from 'node:child_process';
const partOf = re => { const f = fs.readdirSync('src').filter(n => /^\d\d-[\w-]+\.js$/.test(n)).sort().find(n => re.test(fs.readFileSync('src/' + n, 'utf8'))); if (!f) throw Error('src part not found for ' + re); return 'src/' + f; };
const vFile = partOf(/const GAME_VERSION = '/), cFile = partOf(/const CHANGELOG = \[\n/);
let g = fs.readFileSync(vFile, 'utf8');
const cur = g.match(/const GAME_VERSION = '(\d+)\.(\d+)\.(\d+)';/); if (!cur) throw Error('GAME_VERSION not found');
const next = `${cur[1]}.${cur[2]}.${+cur[3] + 1}`, after = `${cur[1]}.${cur[2]}.${+cur[3] + 2}`;
const date = new Date().toISOString().slice(0, 10);
g = g.replace(cur[0], `const GAME_VERSION = '${next}';`);
fs.writeFileSync(vFile, g); g = fs.readFileSync(cFile, 'utf8');
const list = items.split('|').map(s => `'${esc(s.trim())}'`).join(',');
if (!g.includes('const CHANGELOG = [\n')) throw Error('CHANGELOG not found');
g = g.replace('const CHANGELOG = [\n', `const CHANGELOG = [\n  {v:'${next}',date:'${date}',title:'${esc(title)}',items:[${list}]},\n`);
fs.writeFileSync(cFile, g);
execFileSync(process.execPath, ['scripts/build-game.mjs'], { stdio: 'inherit' });
// v8.2.19: full release notes live in docs/DELIVERIES.md (Latest + Previous); CLAUDE.md keeps one short line (shorter context every session)
let c = fs.readFileSync('CLAUDE.md', 'utf8');
c = c.replace(/Current release: \*\*[\d.]+\*\*\. Next release:\s*[\d.]+\./, `Current release: **${next}**. Next release:${after}.`);
const nb = block.replace(/^# Latest delivery: (v[\d.]+ — )?/, `# Latest delivery: v${next} — `), head = nb.slice('# Latest delivery: '.length, (nb + '\n').indexOf('\n'));
if (!/Latest delivery: \*\*[^\n]*?\*\*/.test(c)) throw Error('CLAUDE.md "Latest delivery: **…**" line not found');
c = c.replace(/Latest delivery: \*\*[^\n]*?\*\*/, () => `Latest delivery: **${head}**`);
fs.writeFileSync('CLAUDE.md', c);
let d = fs.readFileSync('docs/DELIVERIES.md', 'utf8');
const pi = d.indexOf('# Previous delivery'), li = d.indexOf('# Latest delivery');
if (pi < 0 || li < 0) throw Error('delivery blocks not found in docs/DELIVERIES.md');
const oldPrev = d.slice(pi).trimEnd() + '\n';
d = d.slice(0, pi).trimEnd() + '\n';
d = d.replace('# Latest delivery', '# Previous delivery');
d = d.replace('# Previous delivery', nb + '\n\n# Previous delivery');
fs.writeFileSync('docs/DELIVERIES.md', d);
fs.appendFileSync('docs/CLAUDE_HISTORY.md', '\n' + oldPrev.replace('# Previous delivery', '# Delivery'));
if (qa) { const p = 'docs/QA_PENDING.md', h = '## รอ QA (AI เพิ่ม · เจ้าของเทสแล้วลบ)\n'; let l = fs.readFileSync(p, 'utf8');
  if (l.includes(h)) { l = l.replace(h, h + `- v${next} ${qa}\n`); fs.writeFileSync(p, l); } }
console.log(`bumped to v${next}`);
