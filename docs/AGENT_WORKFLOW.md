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

### Exact binary release through the connector (verified 3 Nov 2026, 8.1.10)

The existing checkout plus Node REPL can transfer `git cat-file blob <sha>` bytes as base64 in bounded 400,000-character chunks directly into the orchestration store without printing image/source data. Join in order, require `4 * ceil(bytes / 3)` characters, create each blob with base64 encoding and require its Git SHA to equal the local blob. Compose changed directories from leaves upward with `create_tree(tree_elements, base_tree_sha)`; require every tree and the full root to equal the local committed tree before `create_commit` and `update_ref(branch_name, expected_sha, force:false)`. Current write tools use `repository_full_name`; workflow read tools use `repo_full_name`. A transient disconnected blob response was safely retried because blobs are immutable; require the same SHA on retry. The 8.1.10 release verified all98 remote files/52,123,689bytes against local Git bytes, fully decoded every changed image, fetched and soft-aligned the identical tree. Preserve runtime metadata/readback evidence before the helper overwrites its default names for a later docs-only commit. These are proven tool details for this session, not prerequisites for a working native push.

### One stalled Pages checkout (verified 2026-11-03)

- Mint8.1.9 Pages41646209601 hung inside initial shallow Git fetch for10min, while same-source Android41646209525 succeeded. The canceled job log confirmed it never reached code validation; this did not indicate an art/game-code failure.
- A CI-only commit added a5min timeout to the Pages checkout step and started a fresh runner, deliberately canceling our stalled run via existing concurrency. Pages41647720647 succeeded; live8.1.9/all8art hashes verified. Use bounded recovery for an observed stuck runner; avoid repeatedly pushing or changing runtime/version numbers just to retry.
- Preserve source readback evidence before generating metadata for CI/docs-only commits; the helper overwrites default .git/ses811-* filenames. Verify the new final tree/head and published result again.

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

## Ruby illustrated narration review (23 Oct2026)

Build www then scripts/build-ruby-story-review.mjs; scripts/check-ruby-story-ui.cjs uses real production renderer with synthetic narration, all stories/memories and six portrait/landscape sizes. RUBY_STORY_SHOT_DIR saves screenshots. Underlying magenta proves opaque paper/black coverage. Clock substitution is review-only to exercise600ms page debounce; no combat. Existing hubIconBox gives actual alpha bounds for padded Ruby portraits; ordinary image getBounds includes invisible margins. Restrict landscape scene height above footer, and defer menu rebuilds while Ruby dialogue is active. Preserve event aspect ratio rather than covering phone canvas.

## Three-panel narration animation review (23 Oct2026)

The Ruby review clock now uses native Date.now plus an offset for fast600ms debounce checks. Freezing Date.now also freezes Phaser TweenManager, so actual fade checks must keep native time advancing; settle offset changes, then use real time for420ms alpha transitions. Review checks accumulation and crop-aware nested frame bounds across six sizes, reduced motion, close/late callback cleanup, and saves1/2/3-panel stills; optional GIF is a three-step storyboard, not an animation recording. Concurrent remote changes were preserved through a local checkpoint and resolved three-way merge, then merge --quit plus soft reset to fetched HEAD kept the combined tested index while aligning the connector parent. Always recheck expected remote head before publication.

## Contextual Ruby narration review (24 Oct2026)

The Ruby Canvas harness also exercises the production generic spotlight guide, reserved Build/Mutation/Evolution hint area,4-beat clear bridge and stage-title curtain without combat. The Lobby check additionally opens the real stars guide and verifies the highlighted stage box stays visible atfive phone sizes. A captured animation GIF should retain measured screenshot intervals and be labelled presentation capture,not gameplay. The GitHub fetch connector rejected percent-encoded slashes in branch names on this session;the literal slash branch URL worked. Blob creation/tree equality and immutable byte readback remain the proven publication route.


## Order45 source packing (24 Oct2026)

Built-in ImageGen previews can show RGB glow hidden under alpha0; judge cutouts composited onto gray/white before rejecting. Retain donors and exact prompts. Threshold alpha>=32 locates the subject crop; preserve original alpha inside and add24px transparent padding. Inspect grid valleys/manual boundaries rather than assuming generated sheets align perfectly. Full-screen overlays reserve the bottom28%; FX common scale preserves painted growth. When exec_command temporarily stalled in this Windows session, Node REPL fs plus child_process.execFile was verified for mechanical pack/QA and git read/fetch; use the terminal again when responsive.

For order45 the GitHub create_tree call over330 deep repository paths timed out422. Proven fallback: create flat leaf trees per scene/source/review folder in parallel, compose story_motion tree, then replace its entry in incoming and assets trees before composing the repository tree. The final root must equal local git write-tree. This avoids rebuilding a huge base tree through hundreds of nested paths and preserves unrelated files.

## Recovering a missing checkout (31 Oct2026)

The original E:/Heart/TT checkout was absent. A filtered shallow clone restored68metadata/core quickly; a full asset pack stalled. A bounded parallel download of missing files from the immutable68raw URL restored5284asset files plus78support files, verifying both byte lengths and Git blob SHA-1 before atomic placement. For a partial clone, read-only Git commands may still try to fetch missing baseline blobs. Restoring verified loose blobs locally (standard blob header+zlib, deduplicate identical OIDs before parallel writes) resolved that. Preserve a partial clone instead of deleting it, never overwrite a dirty checkout, and use this as a recovery fallback rather than a normal checkout workflow. Fullcheck/build then passed.


## Windows browser contracts without installing Playwright (verified2 Nov2026)

This Codex desktop installation bundles Playwright under AppData/Local/OpenAI/Codex/runtimes/cua_node/<runtime>/bin/node_modules. Workspace require.resolve may fail even though this bundled package exists. Locate the installed package.json, set NODE_PATH to that node_modules for check-forge-live-ui/check-lobby-live-ui/check-ruby-story-ui, and set FORGE_BROWSER_CHANNEL=chrome to use installed Chrome. Verified allthree contracts for8.0.95/96. Runtime directoryhash can change; find actualpath ratherthan assuming this machine path everywhere. No npm or browser installation needed. Keepgame.js LF onWindows (Path.write_bytes); text-mode write_text defaults can introduceCRLF andbreakexistingmultiline sourcecontractregexes.

## Pages retry artifact isolation (verified5Nov2026)

An8.1.17 Pages deployment passed every game/browser check but remained updating_pages until the default600s timeout. Re-running the failed job created a second artifact named github-pages; deploy-pages then rejected the duplicate names. Use upload-pages-artifact@v3 input name and deploy-pages@v4 input artifact_name with the same github-pages-${{ github.run_attempt }} expression. These inputs were verified against the pinned official action.yml files. The current workflow also allows1200000ms for the roughly396MB site artifact. A fresh run41890956493 succeeded, and all133new boss assets matched live hashes. Avoid repeatedly restarting queued deployments; inspect actual failures and logs first. This was a publishing failure, not a game-check failure.

## Validate source cuts before output padding (verified5Nov2026)

The owner found clipped/unfinished boss sprites after8.1.17 had passed output-border/hash checks. The rigid256source split had already removed tips and leaked adjacent-pose pieces before padding. In8.1.18, partition at actual transparent source gutters before packing; independently decode the original PNG and validate source seams, exclusive complete partitions and known old-cut losses. Preserve crop rectangles and one shared uniform actor transform. Current threshold is alpha16for painted source contours, with a five-pixel corridor/two-clear-pixel edges; packed output borders are strictly zero alpha. Review every actual runtime cell as an alpha composite on the game's dark palette. Raw PNG RGB hidden under transparency can look like colored fringe in an image viewer: original Root Knight's16frame set looked fringed in its raw preview but composited cleanly, so its complete walk/attack/death animations were retained. New limited-mini four-pose frame1 means attack, whereas the shared body renderer treats frames0/1asidle; translate the adapter and test the real release pose. Fullchecks/tenbrowsercontracts andlive143file verification passed.

### Exact endpoint preservation in motion sheets (8.1.19)

When interleaving new drawings with old WebP endpoint cells, copy full RGBA cells with paste (no mask) and save lossless WebP with exact=True. Lossless alone may rewrite RGB under alpha zero; alpha-compositing onto a blank atlas also discards those hidden RGB values. Decode the saved atlas and compare every RGBA byte to the packed canvas. This release verified all192 retained endpoint cells exactly, while independently checking original-source transparent cuts before packing.
