#!/usr/bin/env node
// v8.3.11 quiet test runner (saves AI tokens): runs every command of package.json "check:tests" in order,
// prints ONLY failing commands with their output, then one summary line. Stops at the first failure (like &&).
// CHECK_VERBOSE=1 prints every test's output.   Add new tests to "check:tests" (not "check").
import fs from 'node:fs'; import { spawnSync } from 'node:child_process';
const chain = JSON.parse(fs.readFileSync('package.json', 'utf8')).scripts['check:tests'] || '';
const cmds = chain.split(' && ').map(s => s.trim()).filter(Boolean);
const verbose = process.env.CHECK_VERBOSE === '1', t0 = Date.now();
let n = 0;
for (const c of cmds) {
  const r = spawnSync(c, { shell: true, encoding: 'utf8', maxBuffer: 64 << 20 });
  const out = (r.stdout || '') + (r.stderr || '');
  if (r.status !== 0) {
    console.error(`FAIL ${c}\n${out.trim().split('\n').slice(-40).join('\n')}`);
    console.error(`${n} passed · 1 failed · ${cmds.length - n - 1} not run`);
    process.exit(r.status || 1);
  }
  if (verbose && out.trim()) console.log(out.trim());
  n++;
}
console.log(`all ${n} checks passed (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
