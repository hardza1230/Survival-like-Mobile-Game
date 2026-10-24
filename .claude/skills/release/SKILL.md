---
name: release
description: >
  Ship a new Mochi Mayhem version to the live game: bump GAME_VERSION, add the CHANGELOG
  entry and the CLAUDE.md "Latest delivery" block, run the same checks as the Pages CI,
  commit, merge the deploy branch, push it alone, confirm the "Deploy Web (GitHub Pages)"
  run and the live version, then push the session branch. Use when the user says
  release, ship, deploy, publish, push it live, "ปล่อย", "ขึ้นเวอร์ชัน", "deploy เลย",
  or when a finished game change needs to reach the phone. Not for docs-only commits
  (those skip the version bump; see "Docs-only" below).
---

# Release a version (Mochi Mayhem)

The owner checks every release on the phone by the version number, so a release is only
done when the live game shows the new `GAME_VERSION`. Talk to the owner in Thai; every
in-game string (CHANGELOG included) is English with the ’ apostrophe inside '…' literals.

Deploy branch: `claude/vampire-survival-mobile-game-yo9e8w` (only branch that can deploy).
Session branch: whatever this session was assigned (e.g. `ccr-…`). Another session may push
to the deploy branch at the same time — always fetch and merge first, never force.

## 1. Pick the version

1. `git fetch origin claude/vampire-survival-mobile-game-yo9e8w` and read its
   `const GAME_VERSION = 'x.y.z'` (`git show origin/claude/vampire-survival-mobile-game-yo9e8w:game.js | grep -m1 "const GAME_VERSION"`).
2. Next version = the higher of (deploy branch, local) + 1 patch.
   - Read the top of CLAUDE.md for a pinned "Next version" note (e.g. owner chose v8.0.0
     after 7.9.98). Follow it, then delete or update that note in the same commit.
   - Patch/minor must stay < 1000 (`scripts/set-android-version.mjs` versionCode =
     major·1e6 + minor·1e3 + patch). The owner prefers to skip patch 99/100 by moving to the
     next line (7.8.104 → 7.9.1, 7.9.98 → 8.0.0); ask if a bump would land there.
3. If the other session already used the number you planned, take the next one.

## 2. Edit the three version places

- `game.js` line ~53: `const GAME_VERSION = 'x.y.z';` — keep this exact form (pages.yml and
  build-www.mjs grep it).
- `game.js` `const CHANGELOG = [` — insert a new first entry:
  `{v:'x.y.z',date:'YYYY-MM-DD',title:'Short player-facing title',items:['What changed for the player','…']},`
  Player language, no code names, 1–4 items.
- `CLAUDE.md` — add `# Latest delivery: vx.y.z — <title> (owner)` with one dense paragraph
  (what/where in code, numbers, tests touched) above the current Latest block, and rename
  the old `# Latest delivery:` heading to `# Previous delivery:`.
- If the release changes "สถานะปัจจุบัน"/"ถัดไป" facts, update those sections too.

## 3. Checks (must all pass before committing)

Run what the Pages CI runs, in this order (Playwright is pre-installed; never run
`playwright install`):

```bash
npm run check
node scripts/build-www.mjs && node scripts/build-forge-review.mjs && node scripts/build-lobby-review.mjs && node scripts/build-ruby-story-review.mjs
NODE_PATH=/opt/node22/lib/node_modules node scripts/check-forge-live-ui.cjs
NODE_PATH=/opt/node22/lib/node_modules node scripts/check-lobby-live-ui.cjs
NODE_PATH=/opt/node22/lib/node_modules node scripts/check-ruby-story-ui.cjs
```

- If `.github/workflows/pages.yml` gained new build/check steps, run those too (read the
  "Assemble web assets" and "Verify menu visuals" steps).
- A failing test after an intended text/number change: update the test/fixture to the new
  intended value and say so in the delivery block. Never skip or delete a test to go green.
- Owner rules: no headless balance simulation, no screenshots to judge looks — the owner
  tests on the phone. Browser checks above are contract checks, which is fine.
- Also scan new user-facing strings for Thai characters (`[฀-๿]` inside quotes).

## 4. Commit

- English message: `vx.y.z: <what changed>` + short body.
- No model names anywhere (files, commit). End the message with the attribution lines the
  session's system reminder gives (Co-Authored-By / Claude-Session).
- Read `git diff --stat` first; don't commit `www/`, `android/`, `node_modules/`, scratch files.

## 5. Deploy (order matters)

1. `git fetch origin claude/vampire-survival-mobile-game-yo9e8w`.
   If `git merge-base --is-ancestor origin/claude/vampire-survival-mobile-game-yo9e8w HEAD`
   fails, `git merge origin/claude/vampire-survival-mobile-game-yo9e8w`, resolve, re-run
   section 3 if game code merged, and re-check the version is still the newest.
2. Check no Pages run is in progress (mcp__github__actions_list, workflow `pages.yml`,
   load it with ToolSearch `select:mcp__github__actions_list`). If one is running (other
   session), wait for it — both share the `pages` concurrency group and cancel each other.
3. Push the deploy branch ALONE: `git push origin HEAD:claude/vampire-survival-mobile-game-yo9e8w`
   (fast-forward only; network failure → retry 2s/4s/8s/16s).
4. Do not sit and poll. Schedule a check-in ~5 min out with `send_later` (claude-code-remote),
   tell the owner the deploy is running, and end the turn.
5. On the check-in: find the run for the pushed SHA.
   - success → the run's last step already verifies the live `version.json` and `game.js`
     match `GAME_VERSION`. Then push the session branch: `git push -u origin HEAD:<session-branch>`.
   - failure → read the job log (mcp__github__get_job_logs), fix the cause, re-check, push
     again. Never leave the live game on a failed deploy without telling the owner.
   - cancelled → another push hit the concurrency group; re-run (actions_run_trigger
     rerun) or push again once nothing is running.
6. If a stop hook complains the session branch is unpushed while the deploy runs, explain
   that pushing it now would cancel the live deploy.

## 6. Report to the owner (Thai, short)

Version number, what changed for the player (1–3 lines), what to test on the phone, and
that the live game shows the new version (or what is still pending).

## Docs-only

Changes only to `docs/`, `CLAUDE.md`, `.claude/` don't trigger pages.yml and need no
version bump: commit, merge-check, push deploy branch then session branch right away.
