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

### UTF-16 chunk boundaries for connector upload

Windows .NET Substring / PowerShell JSON chunks can split an emoji surrogate pair; stdout then replaces both halves with U+FFFD. Verified with game.js upload: content length was equal but blob SHA differed. Pick chunk ends outside surrogate pairs (or use boundary-safe overlap/base64), normalize CRLF to LF as git does, and always require exact local/remote tree equality before updating the branch. If unequal, compare changed blob SHAs and locate differing code units; do not publish the mismatched tree.

## Painted Gear menu review (verified 2026-10-13)

Build www, then scripts/build-gear-power-review.mjs and scripts/check-gear-power-ui.cjs with Playwright/Chrome. Seven real Canvas viewports verify all five routes, lock guard, card aspect and text/touch bounds. Optional GEAR_POWER_SHOT_PATH saves the portrait screenshot. Asset manifest and selected prompts live beside production WebP files; validate actual alpha before accepting a transparent ImageGen output. Illustrated Gear cards intentionally use opaque complete card textures, while Stats frame/icon textures have transparent edges. After Pages succeeds, compare SHA-256 for published new assets against the tested local kit.

## Bounded base64 source upload (verified 2026-10-13, Taro T1)

For already-LF UTF-8 files, including game.js and large history, byte chunks of 24000 (divisible by 3) can be captured without printing source. Independent batches of eight file reads worked here. Validate each base64 length and alphabet, concatenate in byte-offset order, then create blobs with base64 encoding. This avoids UTF-16 surrogate splits; exact remote/local tree equality remains mandatory before updating the branch. Normalize working files to Git's LF form first or use the existing boundary-safe text route.

## Taro presentation review (verified 2026-10-13)
Build www, then scripts/build-taro-feedback-review.mjs and scripts/check-taro-feedback-ui.cjs with Playwright/Chrome. This is a static Canvas gallery invoking production visual helpers only, not a combat simulation: no combat update, damage, target selection or enemy spawning. As of v7.8.18 it checks repeated presentation updates without allocations, pause visibility, three portrait sizes, real Sentry texture and browser decoding of five reused short cues. The gallery now shows Rift Needle/Arc/Spark/Sentry/Beacon, with no legacy charge HUD. Optional TARO_FEEDBACK_SHOT_PATH saves a preview. Runtime build omits asset metadata JSON; the browser reads MP3 files directly while contract tests audit manifests in the checkout. New gameplay changes still require owner phone playtests.

## Complete source writes and binary read-back (2026-10-17, Temple UI)

In this workspace, a later pre-upload audit found two zero-byte PNGs and one truncated PNG despite earlier successful generation checks. Regenerating only those three from the retained raw images reproduced their original QA SHA-256 values exactly. No damaged copy was published. For subsequent image saves here, write the encoded bytes to a sibling temporary file, flush/fsync, then atomically rename and recheck actual byte length, complete PNG stream and SHA-256 immediately before staging/upload. This is an observed local-file issue, not proof that GitHub uploads universally truncate. Verify actual remote bytes after publication; connector metadata alone is insufficient for a prior truncation case. The existing 24,000-byte base64 chunk route remains available for upload.

## Bound generated-media responses (2026-10-18, art26)

On this Windows/code-mode session, a single loop accumulated 82 generatedImage outputs into a 147 MB response, exceeding the observed 64 MiB IPC response limit even though all images and ledger records were saved successfully. Use small batches (at most eight images here) or yield_control after each image to flush output. Save each result and provenance before emitting media. If the aggregate response fails, inspect the saved ledger and files before regenerating; do not duplicate completed jobs. This is an observed environment transport limit, not an image-model API limit.


## Offline source-art QA with exact WebP references (21 Oct2026)

In this disconnected workspace, ImageGen + GitHub connector and in-memory JavaScript PNG decode/encode/resize worked for source delivery. When native execution, Canvas and WebAssembly were unavailable, the libwebp asm.js build from chase-moskal/webp-hero (libwebp/dist/google/webp.js) decoded exact runtime WebP references. Disable DOM environment setup, replace only SDL I/O surface hooks with in-memory RGBA surface capture, and retain the decoder core and alpha. Test a known icon visually before using it for raster comparison proofs. Do not claim a browser/gameplay check from these source compositions. Keep proof PNGs below1MiB for this connector’s exact base64 readback path. Publish recoverable source milestones and verify full remote bytes, PNG streams and hashes before claiming delivery. Store selected prompts/provenance and distinguish optional skips from missing work. These are observations, not a requirement to bypass a working local environment.

## Lobby visual audit (23 Oct2026)

When owner requests visual audit, build www then scripts/build-lobby-review.mjs; run scripts/check-lobby-live-ui.cjs with Playwright NODE_PATH. Uses production Lobby/nav and synthetic menu data only, no combat. Checks360 dialogue states across five sizes/early-unlocked. LOBBY_SHOT_DIR saves menu screenshots. Cropped ordinary Phaser Images report full uncropped getBounds; use crop x/y/width/height transformed by world matrix to measure rendered panel extents. Static hero fallback is deterministic; phone animation/FPS remains owner review. Keep game.js UTF-8 LF after Windows file tools because existing contract regexes expect LF.
