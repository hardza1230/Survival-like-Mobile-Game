#!/usr/bin/env node
// v8.2.19 PreToolUse hook (Bash): stops a game push to the deploy branch that skipped the release gates.
// Blocks (exit 2, reason on stderr → shown to Claude) when the push changes game files and
//   1) GAME_VERSION is the same as on the deploy branch (forgot scripts/bump-version.mjs), or
//   2) `bash scripts/ci-checks.sh` has not passed in this checkout within the last 3 hours.
// Pushes that don't change what players get (docs, tests, scripts, .claude/) pass. Any git error → allow (never block by accident).
import fs from 'node:fs';
import { execSync } from 'node:child_process';
const DEPLOY = 'claude/vampire-survival-mobile-game-yo9e8w', MAX_AGE_H = 3;
let input = '';
try { input = fs.readFileSync(0, 'utf8'); } catch { process.exit(0); }
let cmd = '';
try { cmd = JSON.parse(input)?.tool_input?.command || ''; } catch { process.exit(0); }
if (!/\bgit\s+push\b/.test(cmd) || !cmd.includes(DEPLOY)) process.exit(0);
const sh = c => execSync(c, { encoding: 'utf8', maxBuffer: 64 << 20, stdio: ['ignore', 'pipe', 'ignore'] }).trim();   // game.js is several MB
try {
  const base = `origin/${DEPLOY}`;
  const files = sh(`git diff --name-only ${base}...HEAD`).split('\n').filter(Boolean);
  if (!files.some(f => /^(game\.js|src\/|index\.html|download\.html|manifest\.webmanifest|phaser\.min\.js|sw\.js|assets\/)/.test(f))) process.exit(0);   // only what players get needs a new version
  const ver = s => (s.match(/const GAME_VERSION = '([\d.]+)'/) || [])[1];
  // the hook runs before the command, so a `git commit && git push` line still sees the old HEAD → also read the working tree
  const cmp = v => (v || '0').split('.').map(Number).reduce((a, n) => a * 1000 + n, 0);
  let here = ver(sh('git show HEAD:game.js')); try { const w = ver(fs.readFileSync('game.js', 'utf8')); if (cmp(w) > cmp(here)) here = w; } catch {}
  const there = ver(sh(`git show ${base}:game.js`));
  const why = [];
  try { execSync('node scripts/build-game.mjs --check', { stdio: 'ignore' }); } catch { why.push('game.js is out of sync with src/ — edit src/NN-*.js and run npm run build:game before pushing'); }   // v8.3.11
  if (here && there && here === there) why.push(`GAME_VERSION is still ${here} (same as the deploy branch) — run scripts/bump-version.mjs (release skill §2) before pushing game changes`);
  const stamp = `${sh('git rev-parse --git-dir')}/ci-checks-pass`;
  const age = fs.existsSync(stamp) ? (Date.now() / 1000 - +fs.readFileSync(stamp, 'utf8')) / 3600 : Infinity;
  if (!(age < MAX_AGE_H)) why.push(`bash scripts/ci-checks.sh has not passed in the last ${MAX_AGE_H} h — run it (release skill §3) and push again`);
  if (why.length) { console.error('Deploy push blocked by scripts/hooks/guard-deploy-push.mjs:\n- ' + why.join('\n- ')); process.exit(2); }
} catch { process.exit(0); }
process.exit(0);
