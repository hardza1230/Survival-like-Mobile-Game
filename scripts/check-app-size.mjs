#!/usr/bin/env node
// v8.2.26 owner: the shipped app (www/ without *-review.* pages, which android.yml / release-aab.yml strip) must stay under 190 MB
// (Google Play base module limit 200 MB, 10 MB headroom). Run after scripts/build-www.mjs; ci-checks.sh calls it in build().
import fs from 'node:fs'; import path from 'node:path';
const LIMIT = 190 * 1048576, WARN = 185 * 1048576;
let total = 0; const big = [];
(function walk(d) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name);
  if (e.isDirectory()) walk(p); else if (!/-review\./.test(e.name)) { const s = fs.statSync(p).size; total += s; big.push([s, p]); } } })('www');
const mb = n => (n / 1048576).toFixed(1) + ' MB';
console.log('shipped app size: ' + mb(total) + ' (limit ' + mb(LIMIT) + ')');
if (total > WARN) { big.sort((a, b) => b[0] - a[0]); console.log('largest files:\n' + big.slice(0, 8).map(([s, p]) => '  ' + mb(s) + '  ' + p).join('\n')); }
if (total > LIMIT) { console.error('APP TOO BIG: over 190 MB — trim assets (see CLAUDE.md §3 packing standard) before releasing'); process.exit(1); }
