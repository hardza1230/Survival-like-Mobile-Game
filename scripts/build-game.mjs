#!/usr/bin/env node
// v8.3.11 game code lives in src/NN-*.js (edit those). This joins them in file-name order into game.js,
// which stays committed so tests, build-www, pack scripts and the deploy hook keep reading one file.
//   node scripts/build-game.mjs          → write game.js
//   node scripts/build-game.mjs --check  → fail if game.js ≠ src/ (someone edited game.js directly, or forgot to build)
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import { execSync } from 'node:child_process';
const dir = 'src';
const parts = fs.readdirSync(dir).filter(f => /^\d\d-[\w-]+\.js$/.test(f)).sort();
if (!parts.length) { console.error('build-game: no src/NN-*.js parts'); process.exit(1); }
const joined = parts.map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('');
const cur = fs.existsSync('game.js') ? fs.readFileSync('game.js', 'utf8') : null;
if (process.argv.includes('--check')) {
  if (cur !== joined) {
    console.error('game.js is out of sync with src/. Edit src/NN-*.js (not game.js), then run: npm run build:game');
    process.exit(1);
  }
  console.log('game.js matches src/ (' + parts.length + ' parts)');
} else {
  // never silently throw away a direct edit of game.js: only overwrite a game.js this script wrote or the committed one
  const h = t => crypto.createHash('sha256').update(t).digest('hex');
  let stamp = null, gitDir = null; try { gitDir = execSync('git rev-parse --git-dir', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); stamp = fs.readFileSync(gitDir + '/build-game-hash', 'utf8').trim(); } catch {}
  let head = null; try { head = h(execSync('git show HEAD:game.js', { maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] })); } catch {}
  if (cur !== null && cur !== joined && !process.argv.includes('--force') && ![stamp, head].includes(h(cur))) {
    console.error('build-game: game.js was edited directly. Move that edit into src/NN-*.js (or rerun with --force to discard it).');
    process.exit(1);
  }
  if (cur !== joined) fs.writeFileSync('game.js', joined);
  try { if (gitDir) fs.writeFileSync(gitDir + '/build-game-hash', h(joined)); } catch {}
  console.log('game.js built from ' + parts.length + ' src parts (' + joined.split('\n').length + ' lines)');
}
