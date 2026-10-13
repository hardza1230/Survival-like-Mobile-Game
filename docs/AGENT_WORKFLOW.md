# Agent workflow memory

Purpose: preserve proven ways of working across chats. Read once at the start; load deeper project history only for a relevant question. These are observations and methods, not permanent claims about every future environment.

## Project identity

- Repository: `hardza1230/Survival-like-Mobile-Game` (Mochi Mayhem).
- Runtime/deploy branch: `claude/vampire-survival-mobile-game-yo9e8w`.
- Live game: https://hardza1230.github.io/Survival-like-Mobile-Game/
- Rules and current release: `CLAUDE.md`; latest task checkpoint: `docs/SESSION_HANDOFF.md`.
- User communication: Thai. Player-visible game text: English.

## GitHub: preferred route in the observed setup

Verified 2026-10-13 in Codex desktop on Windows:

- The connected GitHub plugin can read and write the repository without a local GitHub CLI login. Prefer it for authenticated writes here.
- Local Git successfully cloned/fetched public content, but push stalled in the credential manager. The GitHub CLI (`gh`) was unavailable. Do not try to reinstall tools or trigger login again when the connected GitHub route is available.
- For an authorized multi-file change: get the current parent commit and base tree; create a tree from the changed files; create one commit; update the intended branch with `force: false` and the expected old head. If the head changed, inspect/rebase the change rather than forcing it.
- GitHub tool names can change. Discover the equivalent capabilities from the current tool inventory rather than assuming old names exist.
- A completed repository write is not a completed deployment. Check the Pages workflow and the published `version.json` / `GAME_VERSION` before claiming the game updated.

### Large files and exact upload verification

- `game.js` exceeds 2 MB. In this session the connected file-content tool returned an empty content field despite a valid SHA, including line-range requests. That was a tool limitation, not an empty source file. Use the checked-out file when this occurs.
- Transfer local file contents through the available orchestration/file tools in bounded chunks when needed. Reassemble exactly; do not print the entire game source into the conversation.
- Respect the repository's line-ending normalization. For this repository the committed text blobs used LF. Compare the constructed remote tree SHA with the local committed tree SHA before updating the branch; they must match if uploading the same changes.
- Do not store credentials, access tokens or temporary login links in these documents.

## Local environment: observations, not prerequisites

- Ask the app's workspace-dependency discovery tool for runtime/library paths instead of guessing old absolute paths.
- A Windows Git clone initially failed with the Schannel credentials error; `git -c http.sslBackend=openssl ...` worked in that environment.
- Sandboxed Node initially failed while resolving the user-profile path. `NODE_OPTIONS=--preserve-symlinks --preserve-symlinks-main` worked there. Do not add this globally when Node already works.
- Bundled Playwright was available, but its downloaded Chromium executable was absent. The installed Chrome channel worked for menu QA. Discover what is available before downloading another browser.
- A permission-context change produced Git's dubious-ownership error for the agent-created checkout. A per-command `safe.directory` exception scoped to that verified checkout worked; do not disable ownership checks globally.
- Treat an identical failed command as evidence to change route. Retry only when something material changed. Report the concrete blocker if no route is available.

## Checks and context management

- Forge browser review: run `node scripts/build-forge-review.mjs` after changing game.js. `npm run build:www` does not regenerate the standalone review; stale www/forge-review.js can make browser QA exercise old behavior. Use synthetic saves and inspect the generated source version before QA.
- Hub browser review: build www, then run `node scripts/build-hub-review.mjs` and `node scripts/check-hub-live-ui.cjs` with Playwright available. Optional `FORGE_BROWSER_CHANNEL=chrome` selects installed Chrome. Review uses synthetic menu-only data and checks normal/reduced motion, bounds, rebuild budgets and navigation cleanup.
- Runtime changes: use the required `npm run check` and `npm run build:www`, plus relevant real-menu/browser checks. Do not simulate headless combat; the user tests gameplay.
- Documentation-only changes: check links, facts and the diff. Avoid rerunning the entire game suite or bumping the game version just for workflow notes.
- Save concise checkpoints after a meaningful implementation milestone, after verification, and before publish/deploy. Mark intended, running, failed and verified operations separately.
- A checkpoint should let another agent continue without this conversation. Include recoverable file/commit locations and the next action; do not copy full logs or speculation.
- Checkpoints reduce lost progress after a stalled chat; they do not prevent app/network failures or guarantee that unsaved work survives.

## Heroes menu review (verified 2026-10-13)

Build www, then scripts/build-heroes-review.mjs and scripts/check-heroes-live-ui.cjs with Playwright. Uses real Phaser Canvas, original art and synthetic menu data; verifies tabs, text bounds, all six previews, confirmation/idempotence and details/source overlays. Uses pointer taps for visible controls and direct route callbacks for overflow; existing scrolling is covered separately. No combat simulation. Screenshot paths HEROES_SHOT_PATH and STATS_SHOT_PATH are optional.
