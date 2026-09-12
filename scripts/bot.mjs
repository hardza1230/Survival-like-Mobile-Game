// scripts/bot.mjs — Auto-play smoke bot for Mochi Mayhem
// -----------------------------------------------------------------------------
// Boots the REAL game headless (Chromium via Playwright), forces into each stage,
// drives a survival bot that fights + auto-picks level-up cards, and reports
// crashes / console errors + a screenshot per stage.
//
// Purpose: catch technical breakage (runtime crashes, pool-overflow nulls,
// render glitches) FAST and repeatably — so manual playtesting can focus on
// feel/balance. It does NOT judge fun or difficulty.
//
// Setup (once per environment):
//   npm install --no-save playwright        # browser binaries are found via PLAYWRIGHT_BROWSERS_PATH
//
// Run:
//   npm run bot                             # all 5 stages, god-mode, 90s each
//   STAGES=1,2 SECS=45 GSPEED=4 node scripts/bot.mjs
//
// Env knobs:
//   STAGES   comma list of 0-based stage indexes   (default 0,1,2,3,4)
//   SECS     real seconds to drive per stage        (default 90)
//   GSPEED   in-game fast-forward multiplier         (default 4)
//   GOD      1 = keep bot alive to reach bosses, 0 = die naturally (default 1)
//   OUT_DIR  where screenshots + report.json go      (default scripts/bot-out)
//   PW_EXEC  explicit Chromium/headless_shell binary path (optional)
// Exit code is non-zero when any runtime/console error was seen.
// -----------------------------------------------------------------------------
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = process.env.GAME_ROOT || path.resolve(__dirname, '..');
const OUT = process.env.OUT_DIR || path.join(__dirname, 'bot-out');
fs.mkdirSync(OUT, { recursive: true });

const STAGES = (process.env.STAGES || '0,1,2,3,4').split(',').map(Number);
const SECONDS_PER_STAGE = Number(process.env.SECS || 90);
const GAME_SPEED = Number(process.env.GSPEED || 4);
const GODMODE = process.env.GOD !== '0';

// Locate a headless-capable Chromium. Playwright 1.48 launches the full chrome
// binary with the removed --headless=old flag, so prefer the headless_shell.
function findExec() {
  if (process.env.PW_EXEC) return process.env.PW_EXEC;
  const base = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  const candidates = [];
  try {
    for (const d of fs.readdirSync(base)) {
      if (d.startsWith('chromium_headless_shell')) candidates.push(path.join(base, d, 'chrome-linux', 'headless_shell'));
    }
  } catch (e) {}
  candidates.push(path.join(base, 'chromium_headless_shell-1194', 'chrome-linux', 'headless_shell'));
  const hit = candidates.find(p => fs.existsSync(p));
  if (hit) return hit;
  return undefined;   // let Playwright use its own bundled browser
}

const MIME = { '.html':'text/html', '.js':'text/javascript', '.json':'application/json',
  '.png':'image/png', '.jpg':'image/jpeg', '.webmanifest':'application/manifest+json',
  '.mp3':'audio/mpeg', '.wav':'audio/wav', '.svg':'image/svg+xml' };

// --- tiny static server so the game loads like on a real host ---
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end('nf'); return;
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise(r => server.listen(0, r));
const PORT = server.address().port;
const PAGE_URL = `http://127.0.0.1:${PORT}/index.html`;

const problems = [];
const log = (...a) => console.log(...a);

const browser = await chromium.launch({
  executablePath: findExec(),
  args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
});
const page = await browser.newPage({ viewport: { width: 414, height: 896 }, deviceScaleFactor: 2 });

page.on('console', m => { if (m.type() === 'error') problems.push({ kind: 'console.error', text: m.text() }); });
page.on('pageerror', e => problems.push({ kind: 'pageerror', text: e.message, stack: (e.stack || '').split('\n').slice(0, 4).join(' | ') }));

log(`▶ loading ${PAGE_URL}`);
await page.goto(PAGE_URL, { waitUntil: 'load', timeout: 60000 });

await page.waitForFunction(() => {
  const g = window.__g; if (!g) return false;
  const s = g.scene && g.scene.getScene && g.scene.getScene('Game');
  return s && s.state === 'menu' && s.player;
}, { timeout: 60000 });
log('✔ game booted to menu');

const results = [];
for (const idx of STAGES) {
  const before = problems.length;
  log(`\n=== STAGE ${idx + 1} ===`);

  await page.evaluate((i) => {
    const s = window.__g.scene.getScene('Game');
    if (s.state !== 'menu') s.state = 'menu';
    s.startRun(i);
  }, idx);

  // startRun is async (delayedCall chain) → wait for the starting-skill barrier
  await page.waitForFunction(() => {
    const s = window.__g.scene.getScene('Game');
    return s.state === 'startskill' || (s.startSkillCards && s.startSkillCards.length);
  }, { timeout: 20000 }).catch(() => {});

  // enter play programmatically; retry because openStartingSkillChoice can race us
  const enterPlay = () => page.evaluate(({ gs, god }) => {
    const s = window.__g.scene.getScene('Game');
    s.skills = { sprinkle: 1, star: 1, thunder: 1, whirl: 1 };
    if (s.rebuildRing) try { s.rebuildRing(); } catch (e) {}
    if (s.lvlUp) s.lvlUp.setVisible(false);
    if (s.startSkillCards) s.startSkillCards = null;
    s.buildSkillBar();
    s.physics.resume();
    s.state = 'play';
    s.startStage(s.stageIndex != null ? s.stageIndex : 0);
    if (s.setGameSpeed) s.setGameSpeed(gs);
    if (god && s.player) { s.player.maxhp = 1e6; s.player.hp = 1e6; }
  }, { gs: GAME_SPEED, god: GODMODE });
  await enterPlay();
  for (let tries = 0; tries < 6; tries++) {
    await page.waitForTimeout(250);
    const ok = await page.evaluate(() => {
      const s = window.__g.scene.getScene('Game');
      return s.state === 'play' && s.elapsed > 0;
    });
    if (ok) break;
    await enterPlay();
  }

  const t0 = Date.now();
  let outcome = 'timeout';
  let sawBoss = false;
  while (Date.now() - t0 < SECONDS_PER_STAGE * 1000) {
    const st = await page.evaluate((god) => {
      const s = window.__g.scene.getScene('Game');
      if (god && s.player) s.player.hp = s.player.maxhp;
      if (s.state === 'levelup' && s.lvlCards && s.lvlCards.length) {
        try { s.lvlCards[0].apply(); } catch (e) {}
        s.closeLevelUp();
      }
      if (s.state === 'summary') { try { s.continueFromSummary(); } catch (e) {} }
      let dx = Math.cos(Date.now() / 700), dy = Math.sin(Date.now() / 900);
      const e = s.nearestEnemy ? s.nearestEnemy(9999) : null;
      if (e && s.player) { const a = Math.atan2(e.y - s.player.y, e.x - s.player.x); dx = Math.cos(a + 1.2); dy = Math.sin(a + 1.2); }
      s.joy = { active: true, dx, dy };
      return { state: s.state, mode: s.mode, hp: s.player && Math.round(s.player.hp),
               level: s.level, kills: s.kills, elapsed: Math.round(s.elapsed),
               boss: !!(s.boss && s.boss.active) };
    }, GODMODE);
    if (st.boss) sawBoss = true;
    if (st.state === 'dead') { outcome = 'died'; break; }
    if (st.state === 'win' || st.mode === 'summary' || st.state === 'menu') { outcome = 'cleared'; break; }
    await page.waitForTimeout(120);
  }

  const snap = await page.evaluate(() => {
    const s = window.__g.scene.getScene('Game');
    return { state: s.state, mode: s.mode, hp: s.player && Math.round(s.player.hp),
             maxhp: s.player && Math.round(s.player.maxhp), level: s.level,
             kills: s.kills, elapsed: Math.round(s.elapsed), waveIndex: s.waveIndex };
  });
  await page.screenshot({ path: path.join(OUT, `stage${idx + 1}.png`) });

  const newProblems = problems.slice(before);
  results.push({ stage: idx + 1, outcome, sawBoss, ...snap, errors: newProblems.length });
  log(`  outcome=${outcome} boss=${sawBoss} hp=${snap.hp}/${snap.maxhp} lvl=${snap.level} kills=${snap.kills} t=${snap.elapsed}s wave=${snap.waveIndex} errors=${newProblems.length}`);
  newProblems.forEach(p => log(`   ⚠ ${p.kind}: ${p.text}`));

  await page.evaluate(() => {
    const s = window.__g.scene.getScene('Game');
    try { s.exitStage && s.exitStage(); } catch (e) {}
    s.state = 'menu';
    s.physics.resume();
  });
  await page.waitForTimeout(400);
}

await browser.close();
server.close();

const report = { when: new Date().toISOString(), secondsPerStage: SECONDS_PER_STAGE, gameSpeed: GAME_SPEED,
  godmode: GODMODE, results, totalErrors: problems.length, problems };
fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));

log('\n================ SUMMARY ================');
for (const r of results) log(`Stage ${r.stage}: ${String(r.outcome).padEnd(8)} boss:${r.sawBoss ? '✔' : '✗'} hp ${r.hp}/${r.maxhp} lvl ${r.level} kills ${r.kills} — ${r.errors} error(s)`);
log(`TOTAL runtime/console errors: ${problems.length}`);
log(`screenshots + report.json in: ${OUT}`);
process.exit(problems.length ? 1 : 0);
