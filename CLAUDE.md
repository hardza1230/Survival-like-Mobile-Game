# Latest delivery: v7.9.91 — Clearer loading + persistent storage (owner)

GameLoader.set (patched in game.js) percent line: window.__dlPhase (set by downloadAllAssets while fetching) → '⬇️ Downloading n% (n / N)'; else LoadMeter dev ≥ net → '📦 Preparing n% (seen / count)', else '⬇️ Loading'. downloadAllAssets first calls navigator.storage.persist() so Android is less likely to evict the ~288 MB cache. Owner question answered: per-file ?v= hashes mean only changed files re-download; the boot bar every launch is decoding cached files into GPU memory, plus game.js on each new version.

# Previous delivery: v7.9.90 - Ruby's illustrated storybook

Five built-in ImageGen originals (four event paintings + recipe paper), source/prompts/hash manifest and real Canvas proofs retained in assets/incoming/ruby_storybook/. Runtime451,184bytes; menu-lazy only, per-story image loading. Pre-stage C1-1 through C1-5 two-page stories, before first tutorial too; grandma/jar art reused. rubyTalk now opaque paper/black full-screen, contained event art, expression portrait, manual Back/Next/Skip,600ms debounce, deferred once-only completion/save and menu rebuild guard. Post-clear memories retained; no combat/balance changes. Required check/build and six real Canvas viewports passed; Pages CI includes story review. See docs/art_orders/43_RUBY_STORYBOOK.md and publication state in docs/SESSION_HANDOFF.md.

# Latest delivery: v7.9.89 — Lobby layout and missing art

Real Canvas audit repaired currency collisions, dimmed controls, dialogue over hero, locked shortcut gaps and stage title/power collisions. Two built-in ImageGen assets: painted Settings and empty currency panel,11,020 runtime bytes, existing Lobby lazy loader. Reused existing panels/hero/shadow. Source/prompt/hash manifest/review screenshots in assets/incoming/lobby_polish/; docs/art_orders/42_LOBBY_POLISH.md. Five portrait sizes × early/unlocked ×36 lines pass real Canvas bounds/collision/routes (360 dialogue states); check now in Pages CI. Required check/build passed; publication status in docs/SESSION_HANDOFF.md. Menu screenshots explicitly requested by owner; no combat simulation.

# Latest delivery: v7.9.88 — ImageGen winter magic and Lobby panels

Four original ImageGen assets retained with exact prompts in assets/incoming/mint_winter_update/. Runtime293,070bytes (~3.25MiB decoded):4-frame dash shard,8-frame snowstorm, cream/gold speech and blue cloud thought panels. FX are Mint-stage-only; panels Lobby-lazy. Sprite playback follows gameplay time, full fallback/cleanup, original damage/body/range unchanged. scripts/pack-mint-winter-art.py reproduces source-pixel packing; MANIFEST/QA and offline GIFs included. Added tests/winter-art.test.cjs. Owner phone visual/FPS remains pending; publication state in docs/SESSION_HANDOFF.md.

# Previous delivery: v7.9.87 — Ruby art, Mint winter magic, Lobby voices and gear limits

Order36 is integrated: 14 half-size WebPs (186,478 bytes), A/C stage-lazy and B/D menu-lazy; Ruby expressions, large talk portraits, animated quest pointer/sparkle, optional memory scenes after first C1-1/C1-5 clear. Lobby heroes cycle six personality-specific spoken/thought lines without tap capture, yielding to Ruby/tutorials.

Crystal Impaler Unique Frost Lance emits a homing shard every 70 world pixels actually travelled (base350px =5; Long Lance rank3 665px =9 when targets/budget allow). Each repeat dash has its own accumulator; nearest target is measured from the shard, no boss priority. Shards reuse painted ice art, single-hit Chill and shared24 projectile budget, with epoch/pool reset. Direct lance/Impale/Rupture retained.

Glacier Bloom leaves one stationary4s snowstorm: eight .5s pulses including release, each .45×Bloom power (+20%/Shard Spray rank), bounded snowfall and knockback. A hit dealing ≥8% max HP guarantees freeze; otherwise25% chance (35% with Permafrost). Freeze1s +.6/Long Winter rank. Bosses/mini/immune get Brittle, no forced displacement/freeze. Permafrost adds Chill per pulse; card/pause screens preserve lifetime; transitions clear field/tween/art. Owner owns actual combat/balance/FPS review.

Gear: iLv1–11 Power/+3;12–24 Power+Sustain/+5;25–44 all3/+7;45+ all3/+10. Enforced in direct mutations and effective stats, leaving legacy rolls/enhancement data intact. Locked paid choices have one-time refund; first Forge lesson still works. See docs/GEAR_LEVEL_LIMITS.md.

Validation: required automated check and web build; new Ruby/Mint/Lobby/gear regression suites. No browser screenshots or simulated balance runs per owner instruction. Deployment state is in docs/SESSION_HANDOFF.md.

# Art delivery36 — rewritten Ruby mascot

14 PNG32 assets /22frames delivered to assets/incoming/ruby_mascot/: six expressions, four talk portraits, four-frame point loop, six-frame black ADD sparkle and two memory illustrations. Seven ImageGen originals and exact prompts retained. PNG CRC/hash/alpha checks and offline60px /360×780 layout proofs passed. Source-only; preserve current runtime and lazy-load A/C in stage, B/D in menu when integrating. Phone overlap/cadence/FPS pending.

# Art delivery40 — Bazaar chest source kit

All7 PNG32 /22frames delivered to assets/incoming/chest_shop/ with6 built-in ImageGen donors, exact prompts, manifests, PNG CRC/hash/alpha QA, six-frame GIFs, exact closed-frame0 matching, Thread20px gallery, nine-slice and rarity-tint proofs. WebP candidates844,676bytes. Source-only; runtime v7.9.78 untouched. Next: Bazaar/Chests lazy wiring and phone cadence/FPS. Existing combat ic_thread key is used by a Knot effect; see delivery notes before replacing the texture key.

# Art39 opening revision — explicit owner choice: AI-painted frames

Active bk_open_long now uses12 AI-painted poses, mechanically extracted/registered to fixed left hinge and height. Geometric opening/renderer retired to history/. PROMPTS and OPENING_SOURCE record actual provenance; no exact original-pixel match is claimed. Required WebP1,212,176bytes; with clean-cover helper1,285,026bytes. Crossfade static cover into painted frame0 before playing. Source-only; v7.9.68 runtime untouched.

# Art delivery39 — Book opening plus source kit

All9 PNG32 /51 frames delivered to assets/incoming/book_opening_plus/ with selected ImageGen donors, exact prompts, source-pixel12-frame opening, clean-cover helper, manifest/CRC/hash/alpha QA and offline previews. Exact-size WebP candidates total1,290,464bytes; including clean-cover helper1,363,314bytes under1.5MB. Source-only; preserve runtime v7.9.68 and its order38 integration. Next: lazy bookOpening / navigation wiring per order39 and phone playback/skip/FPS review.

# Art delivery38 — Tutorial UI source kit

13 PNG32 / 23 frames delivered to assets/incoming/tutorial_ui/: nine step icons, pointer hand, nine-slice panel and two six-frame VFX strips. Five original built-in ImageGen sources, exact prompts, manifest, PNG CRC/hash/alpha/dimension QA, 48/72px galleries, vertical panel proof and animation previews included. Source-only; runtime version unchanged. Next: tutorial-only lazy WebP packing and integration per order38; owner phone visual/timing/FPS pending.

# ⚠️ DEPLOY BRANCH — read first

The live game (GitHub Pages / APK live update) deploys ONLY from `claude/vampire-survival-mobile-game-yo9e8w`. Pushes to any other branch (session branches like `ccr-*` or `claude/*`) run the Pages workflow but it fails, so the game stays on the old version. Owner has approved this permanently: after committing, always push to the vampire branch too (`git push origin HEAD:claude/vampire-survival-mobile-game-yo9e8w`, fast-forward only; if it is not an ancestor, merge it in first, never force). Push the vampire branch ALONE (not in the same moment as the session branch): both runs share the Pages concurrency group, so the session-branch run cancels the vampire deploy (v7.0.0/7.0.1 got cancelled this way). Then confirm the "Deploy Web (GitHub Pages)" run for that branch succeeded and the in-game version matches `GAME_VERSION`.

# 🧭 Model routing (owner 23 Oct) — pick the cheapest model that fits

Owner approved delegating simple work to cheaper subagents (`.claude/agents/`). The main session (Opus) plans, decides, reviews diffs, bumps GAME_VERSION/CHANGELOG, commits and deploys.
- **quick (Haiku):** look-ups in game.js, "did art arrive?", Actions run status, file lists, small exact doc edits (CLAUDE.md blocks, README rows).
- **builder (Sonnet):** clear code changes where what/where is already known — given numbers, text rewording, wiring delivered art by an existing pack script/pattern, copy-an-existing-UI-piece, art order docs from an outline.
- **Main (Opus) itself:** design and owner questions, unclear bugs, balance, new mechanics, multi-system features, final review.
- Skip delegation when the job is one or two tool calls (spawning costs more than doing it). Always read the subagent's diff (`git diff`) before committing.

# Art delivery34 — Lobby hero motion source kit

48 PNG32 sheets /372 frames delivered to assets/incoming/lobby_hero_motion/<hero>/ for Momo/Yuzu/Mint/Cocoa/Taro/Sesame; built-in ImageGen prompts/provenance, manifests, complete PNG CRC/hash/alpha/frame/endpoint QA,48 light/dark actual-stage GIFs,6 storyboards and silhouette proof.512×640 cells; every one-shot starts/ends on exact idle0 pixels. Cocoa neutral496px (approximately500px) keeps arm margins. Source-only; runtime version unchanged. Next:75% WebP packing and selected-hero Lobby-only lazy animation integration per order34; never boot load; owner phone visual/timing/FPS pending. Sesame WIP wiring unchanged. Read UPLOAD_VERIFICATION.json for remote-byte proof.

# Art delivery33 — warm Lobby UI source kit

26 PNG32 /38 frames delivered to assets/incoming/lobby_ui/ with MANIFEST, built-in ImageGen PROMPTS, full PNG CRC/hash/alpha/frame QA and exact-size 360×780 +412×915 offline compositions on stage_card_s01/s11 using existing card_momo. Source at2x; packed50% decoded2.332MiB <6MiB. Native-endcap stretch matrix,28/56px icon gallery, no image text, no Energy slot or hero-specific frame motifs. Source-only; runtime v7.9.50 unchanged. Next: scripts/pack-lobby-ui.py + Lobby-only lazy load and fallback-preserving binding per order33; owner phone visual/FPS pending. Small center stage accent is reserved for a code overlay so nine-slice stays undistorted. Exact remote-byte proof in UPLOAD_VERIFICATION.json.

# Art delivery32 — card icons round2

51 PNG32 source icons delivered to assets/incoming/card_icons_2/ (46 required +5 optional redraws; E4 Ice Breaker retained after actual-icon review). Array manifest, exact ImageGen prompts, full PNG/hash/alpha/bbox QA, native24/90px light/dark galleries, Mutation-pair and C-vs-main-path comparisons plus byte readback proof. Source-only; runtime version unchanged. Next: pack256-to128 and integrate per order32, per-stage card loading and relic budget review; owner phone visual/FPS pending.

# Art delivery31 — C1–C2 arena Counters

12 PNG32 source assets /51 frames delivered to assets/incoming/arena_counters_c1_c2/, with array manifest, ImageGen prompts, full PNG/hash QA, 46px actual-floor/EXP/magnet comparison pages and byte readback verification. Source-only; runtime version unchanged. Next: pack WebP and integrate per order31, keeping fallback/56px kick/6s lifetime/damage/stun unchanged; owner phone visual/FPS pending.

# Art delivery30 — C3 and Pinnacle boss VFX

48 PNG32 sources /226 frames delivered to assets/incoming/boss_vfx_c3/, with array manifest, built-in ImageGen prompts, source provenance, technical QA, actual runtime-floor proof pages and byte readback verification. Source-only; runtime v7.9.28 unchanged. Next: pack A/B with existing max-channel alpha/unpremultiply pipeline, preserve C alpha, stage-lazy integration + owner phone review. No C1-C2 Counter extras.

# Art delivery 29 — Flavor Drops

7 PNG32 source assets /61 frames delivered to assets/incoming/exp_orbs/ with manifest, exact built-in ImageGen prompts, technical QA, offline tiny-size/Sugar/200-drop/effect/loop proofs and seven WebP candidates totaling136,794 bytes (<250KB). Source delivery only; game.js / runtime v7.9.25 unchanged (concurrent upstream v7.9.24–25 preserved). Next: stage-lazy EXP integration and owner phone visual/FPS review. Preserve v7.9.12 ground-only EXP behavior; do not restore boss auto-vacuum from the outdated order29 note.

# Art delivery 18 — Taro Spark + Ball Lightning

21 Oct: J1 Storm Mark button icon delivered to assets/incoming/taro_storm_mark/ —256×256 PNG32 real alpha, manifest/prompts/QA and52px proof. Source-only; runtime v7.9.27 unchanged. Next: existing256→128 WebP pack and Spark Unique button hookup/phone review.

16 PNG32 sources delivered to assets/incoming/taro_spark_ball/ with manifest, prompts, QA and delivery notes. A/B/C were subsequently integrated in v7.8.25; phone visual/FPS review remains pending. See the current art order for runtime status.

# Art delivery 20 — Hero VFX gaps

21 PNG32 sources / 100 frames delivered to assets/incoming/hero_vfx_gaps/ with MANIFEST.json, PROMPTS.json, QA_REPORT.json and DELIVERY_README.md. Exact source dimensions/grids and PNG data checked. Runtime integration is complete: 21/21 wired in v7.8.45–46, including the restored C8 landing dust. Seam/apex/timing and phone visual/FPS review remain pending. Historical delivery paragraphs below retain their original per-version context.

# Art delivery 26 — Transition and card icons

82 PNG32 sources /90 frames delivered to assets/incoming/transition_card_icons/:77 distinct card icons plus5 transition assets. Manifest, built-in ImageGen prompts, technical QA, 24/90px icon galleries, hero-family review, tile pairs and both-direction offline transition previews included. Source decoded32.832MiB; runtime wiring, boot GPU budget and phone FPS pending. No game-version change; preserve current v7.8.67. All100 initial delivery files byte-verified from GitHub at1c770afb; exact proof in UPLOAD_VERIFICATION.json.

# Art delivery 25 — Hub motion

25 PNG32 assets /81 frames delivered to assets/incoming/hub_motion/:20 required A/B/C plus5 optional animated menu icons. User approved Python source-pixel extraction; original visible Momo/flower pixels preserved, AI only for occluded/new portions and VFX/icon/blink sources. Source placement0px, fully opaque interiors match original RGB exactly; backgrounds/alpha edges intentionally differ. Decode/CRC/grid/hash/alpha, blink, ±6deg joints, loop and source-memory checks reviewed; decoded28.208MiB <40MiB. Incoming only; runtime packing/loading, tweens, boot cap and phone FPS pending. All49 final delivery/follow-up files full-byte verified on GitHub at5dc47db; UPLOAD_VERIFICATION.json records exact proofs. Art23/24 already published and fully verified.

# Art delivery 24 — Pause UI

19 modular PNG32 assets /43 frames delivered to assets/incoming/pause_ui/. Native gradients/endcaps retained, real alpha, separate icons and runtime text. Both412x860 and360x780 no-scroll screen assemblies, corner stability at requested sizes and white11px text reviewed. Incoming only; runtime integration pending. Order23 complete, full31-file GitHub byte readback verified at3ffe1bc. Next: order25 Hub motion.

# Art delivery 23 — Level Up UI

20 PNG32 assets / 66 frames delivered to assets/incoming/levelup_cards_ui/ with manifest, final built-in ImageGen prompts and QA previews. All table rows delivered (summary corrected 19→20). 9-slice, four tint palettes, alpha and 11px text contrast checked. Incoming only; runtime integration pending. Next art: order 24 Pause, then order 25 Hub motion.

# 🚧 HEROES IN DEVELOPMENT — Sesame (owner 21 Oct) — read first

Yuzu finished in v7.9.37–39 (Orchard Swarm, owner-approved) and removed from HEROES_WIP. Owner: Sesame is not finished. Do NOT change Sesame's cards, paths, talents, mods, fusions, balance or art wiring (and leave them out of card/relic audits and ECRS passes) until the owner starts work on that hero. game.js `HEROES_WIP=['sesame']` shows a '🚧 In development' badge on its roster card; remove an id from it when the owner says that hero is being finished. Shared systems (relics, trade-offs, infusions) may still change, but do not add Sesame-specific fixes. Note: v7.9.17 already changed Yuzu Chain Feast/Quick Paws and Sesame Prism Echo/Retreat Shot before this rule.

# Previous delivery: v7.9.86 — No spawns outside the map (owner)

inMapPt(x,y,m=80) (global, before STORY_HP_MUL): point outside ±(WORLD/2−80) → random point within 220px of the map centre. Used (with a typeof fallback for method-extract tests) in spawnEnemy, spawnElite, spawnMiniBoss, spawnFinalBoss and the far-straggler teleport. Crates unchanged.

# Previous delivery: v7.9.85 — Story monsters +20% HP (owner: heroes hit too hard)

STORY_HP_MUL 1.2 (before CARD_UNLOCK) on Story (not recipeMode) mob HP in spawnEnemy, spawnElite base, mini HP and boss HP; Delve/Kitchen unchanged. Each site uses typeof fallback 1 so method-extract tests keep their numbers. Recommended Power (stageThreat) not changed.

# Previous delivery: v7.9.84 — Elite Poison in Hunt (owner)

tickHuntCurse rewritten: while a marked Elite is alive (elite phase), _huntPois counts up; after 6s poison stacks 1 + floor((t−6)/4) (max 10), every .5s hp −= maxhp·.003·stack (can kill), green tint/ring + '☠️ Poison ×N' float, banner 'Elite Poison' once. Old distance-based Hunter’s Curse (never lethal) replaced. endHuntCurse resets _huntPois/_huntStk (target killed, clear phase, objective cleared). Ruby hunt tip mentions poison.

# Previous delivery: v7.9.83 — Craft locked until Forge, hidden heroes, Build lesson (owner)

buildGear Craft action: featureOpen('craft') false → '🔒 Forge after C1-2' disabled. buildChars roster and Codex hero pages list only momo + Save.data.chars (or FIGHTER_PLAYTEST_ALL); locked heroes no longer shown (tests/hero-roster updated). pathTeach(): first Build Path offer (drawCardIntro 'path') → Ruby overlay in lvlUp, 3 pages for Strawberry (what a Build is · Sniper/Shotgun/Ricochet · pick again every stage), 2 generic pages for others; pickCardAt routes taps to _pathTeach.next while open, cards locked (levelCardReadyAt Infinity) until done; reset in startStage.

# Previous delivery: v7.9.82 — Escort the Wisp bleed (owner)

tickPurifyWisp: outside escortR → w._out grows, bleed stacks min(10, 1+floor(out/1.5)) with a '🩸 Bleeding ×N' float on change; every .5s player.hp −= maxhp·.004·stack (no iframe, red tint flash, die at 0; skipped in tutorial). Back in range: _out decays ×4 then stacks reset. Ruby purge tip mentions bleeding.

# Previous delivery: v7.9.81 — Quest camera guide, Ruby story, boss music fix (owner)

questFocusTargets(type) (hunt elite / purge wisp+cores / capture / cleanAir / nectar flowers / root anchors) + questFocus(type,force): state 'cinematic' + physics.pause, cam.pan to each target (≤4), donut spotlight (stroke 3000 trick, canvas-safe) + label, then pan back + startFollow; first 3 per type (Save.data.questFocusSeen), tap skips via _finishStoryCutscene. Called 350ms after setupWaveObjective (not hunt) and on the first marked Elite of a hunt wave (direct call, the hunt test forbids timers). Ruby: RUBY_TIPS rewritten in Ruby's voice; RUBY_STORY[15] (Ruby = ruby-jam Mochi Core, recipe keeper, lost her flavor to the Hunger, memories return per boss) via rubyStoryAt(i) from startStage, first visit only (Save.data.rubyStory); rubyWrap() word-wraps the box (brackets kept whole); Weave tour talk lines rewritten. Art order 36 rewritten (14 files: in-run faces, talk portraits, point pose, memories). Music: Sfx._lateTrack loads boss/mini bgm on demand and plays it on filecomplete if still fighting (_wantTrack cleared by playStageBgm/playMainBgm). Card types at C1-1 are basic only by design (CARD_UNLOCK).

# Previous delivery: v7.9.80 — Book opening only at game start (owner)

showMenu no longer plays bookCover after a stage (or on Replay/any return to the menu); title tap without the book art no longer plays the cover either. Only the title → bookOpening / bookOpeningPlus remains. bookCover/bookTurn code kept.

# Previous delivery: v7.9.79 — Art order 40 chest shop wired

scripts/pack-chest-shop.py (sha/bytes vs MANIFEST, 50% per cell, WebP q86) → assets/art/chest/ (7 files, ~340 KB). CHEST_KEYS lazy ('chest' in LAZY_MENU_ART_RE, loadChestArt from buildChestShop, rebuilds the Bazaar when loaded). TEMPLE_UI chest_*_open / vfx_chest_rays [256,256,6] + bz_chest_card 9-slice 32. Shop cards use tuPanel bz_chest_card; chestVisual uses chest_<id>; openChest plays chest_<id>_open cells 1–5 from 620ms (shake shortened), chest slides down under the prize; vfx_chest_rays ADD loop tinted by tier replaces vfx_glow. ic_thread now assets/art/chest/ic_thread.webp (boot, also the Weave knot) + Lobby Thread pill icon. All keep the old fallbacks.

# Previous delivery: v7.9.78 — Taro C2-3 / Yuzu C3-1 + hidden Sugar plus (owner)

CORE_UNLOCK_STAGE taro 5→6 (playable from C2-3), yuzu 9 (C3-1); HERO_INTROS idx 7 taro + idx 10 yuzu (lore lines). Sesame stays hidden until finished (planned C3-3). Lobby Sugar + zone only when featureOpen('bazaar'). Owner kept one-by-one feature reveals.

# Previous delivery: v7.9.77 — Chest shop, Thread pill, feature reveal, book order, no hero spin (owner)

Bazaar first tab 'chests' → buildChestShop(top): CHESTS silver (🧶30, free once per localDayKey via chestFreeDay, odds common .5/rare .42/epic .075/legend .005) + gold (🧶120, rare .3/epic .6/legend .1, chestPity → Legend at CHEST_PITY 10); openChest(c,isFree) spends Thread, rolls pickWeighted, grantGear at the top GACHA band item level (fallback epic/rare/common, refund half), reveal screen with _chestOpen (buildMenuScreen returns while set) → Collect. chestVisual uses chest_<id> (art order 40 `docs/art_orders/40_CHEST_SHOP.md`, 7 files) → prize_chest → 🧰. Lobby: Thread pill under Sugar (tag thread_pill → chests). featureReveal → _featQ queue, featRevealNext: NEW card (glow, FEAT_ICON, name, Ruby FEAT_LINE) → tap → icon flies to FEAT_TAG zone + ring → next; applyGearTut waits until the queue ends; robust to menu rebuilds (_featC/_featFly fallback 1.5s). bookOpeningPlus reveal builds the Lobby with _enterRise + _enterRiseDelay 2100 (pieces hidden until the book finishes), finish no longer rebuilds (_bkRose). lobbyHeroTap 5-tap = bigger sway (amp 4), no spin.

# Previous delivery: v7.9.76 — Locked systems hidden, appear as you progress (owner)

FEATURE_OPEN {key: stories cleared} (before kitchenOpen): bazaar/gActivity/daily/achievements/news/gear/gearInbox 1 · craft/char/gCodex/skills/bestiary 2; kitchen = kitchenOpen; others always. storyCleared() = max(unlockedStage, cleared stageMastery). featureOpen(t) (gearInbox also when the inbox has items) filters drawNavBar tabs, Lobby sideBtn, HUB_GROUPS rows/tiles and the gLoadout rows. featureReveal() from buildLobby: first run marks all open as seen (old saves get no toasts), later new ones → Save.data.featSeen + menuToast '✨ New: … unlocked!' after 1.2s. Browser: stage 0 = Home+Upgrade only, 1 = +Bazaar/Activities/side buttons, 2 = +Heroes/Codex + toast, 0 errors. Sugar pill (tag bazaar) still opens the Bazaar before Stage 1.

# Previous delivery: v7.9.75 — Ruby Weave tour, tutorial hero size, story hero unlocks (owner)

rubyTalk(lines,done) (before drawSpotlight): menu overlay with Ruby avatar + name pill + line n/N, single full-screen zone tag ruby_talk (tap after .6s). applyGearTut weave tour: talk() once per flag _wtTalk1 hub · _wtTalk2 gLoadout · _wtTalk3 upgrade (before the core spotlight) · _wtTalk4 upgrade after buying (Weave Up/Rank) → then the old spotlight steps (labels shortened). showCoachIntro sets player scale to _pBase (was 1 until the first update → hero looked 2× on the first card). FIGHTER_PLAYTEST_ALL=false; CORE_UNLOCK_STAGE mint 0→1 (playable from C1-3), cocoa 4 (C2-1), taro 5 (C2-2), yuzu 9 (C3-1) pending owner; Sesame hidden (WIP). Browser: tour talks → spots in order, 0 errors.

# Previous delivery: v7.9.74 — Download the whole game once (owner picked ข)

Opening.create → downloadAllAssets(cb) before scene.start('Game'): allAssetUrls() = verUrl of every ASSET_IMAGES/SHEETS/FX/AUDIO (+LH_SHEETS only if LH_USE_SHEETS) · waits ≤3s for the SW controller on a fresh install · skips URLs already in caches 'mochi-assets-v1' · 8 parallel fetches (SW stores them cache-first) · GameLoader 'Downloading game data (one time) · n / N' · localStorage mochi_dl_done = mochi_dl_<GAME_VERSION>_<ASSET_VER>_<count> only when nothing failed; offline → skip. Browser: first launch 1831 files cached, second launch 9 server requests, 0 errors. Total ~288 MB on a real phone.

# Previous delivery: v7.9.73 — Reset / sign out restart, Inbox row removed (owner)

wipeAndRestart(cloudToo) (before doGoogleAuth): Reset progress (3 taps) → Save.reset + rev old+1 pushed to the cloud if signed in (Cloud.push) → clear mochi_cloud_base → location.reload (title → tutorial). Sign out → Cloud.signOut + local save removed (cloud copy kept) → reload. gLoadout rows drop gearInbox (Mail in Lobby). Item 4 (download everything once at first launch) not done: 1863 files = 288 MB (audio 85 MB); SW already caches each file cache-first after first use — waiting for owner choice.

# Previous delivery: v7.9.72 — Texture budget 600 MB on 8 GB phones (owner)

TEX_BUDGET_MB: low-mem flag or deviceMemory ≤4 → 250, deviceMemory ≥8 → 600, else 400. Note: navigator.deviceMemory is capped at 8 by browsers and missing on some WebViews (missing → 400).

# Previous delivery: v7.9.71 — Lobby rises in after the book (owner)

menuEnterAnim rise mode (this._enterRise): y+70 → y, 720ms Back.out, delay 150–800ms bottom pieces first. Both bookOpening/bookOpeningPlus finish() with reveal on hub reset _enterLast and rebuild with _enterRise so the Lobby floats up as the book zooms away.

# Previous delivery: v7.9.70 — Lobby art reload fix

Owner: Lobby lost its frames after v7.9.69. The ~40 MB book art pushed texBudget over TEX_BUDGET_MB, which evicted lb_* textures, and loadLobbyArt only ever loaded once (_lbArt stayed true). loadLobbyArt now re-checks realTex on every call and clears _lbArt when the load finishes. Browser: title → book → Lobby 29/29 LB keys, 0 errors.

# Previous delivery: v7.9.69 — Art order 39 wired (book opening + Bazaar/Upgrade/Mail icons)

scripts/pack-book-opening-plus.py copies the delivered q78 WebP candidates (bytes vs MANIFEST/HELPER_MANIFEST): 7 book sheets → assets/art/book (BKP_KEYS, lazy, ~1.2 MB, ~40 MB decoded), icons → assets/art/lobby (in LB_KEYS). loadBookPlus from buildTitle; bookOpening → bookOpeningPlus when bkPlusReady: clean plate + bk_emblem_spin loop at (222,359) 340×380 + vfx_bk_magic ADD from 650ms → bk_clasp 6×100ms at (400,384) + shake at 1500 → 150ms crossfade to bk_open_long cell0 at 2150 → 12×100ms from 2300 (reveal builds Lobby here, veil fades) → bk_page_riffle 8×77 at 3400 → vfx_bk_burst ADD 6×83 at 3950 → zoom/fade at 4250; tap skips; after end the BKP textures are removed (one use per launch). Old order 28 opening stays the fallback. Nav Upgrade uses ic_nav_upgrade (fallback ic_nav_gear), Bazaar ic_nav_bazaar, Mail ic_side_mail.

# Previous delivery: v7.9.68 — Book opening, tutorial fix, art order 38 wired, new bottom bar (owner)

bookOpening(done,reveal) (after bookCover): title tap → cover floats in (scale .78→1, Back.out) + dust → glow ×2 + shake → bk_cover_open 5×150ms + slow zoom (reveal=Lobby built under the cover here) → 2 bk_page_turn flips → zoom 1.45 + fade; tap skips via _bookSkip; new players (reveal false) → startChapterTutorial at the zoom. Art order 39 `docs/art_orders/39_BOOK_OPENING_PLUS.md` (12-frame cover, clasp, emblem, magic, riffle, burst, ic_nav_bazaar/upgrade, ic_side_mail) awaits art. Tutorial freeze: sweets-step level-up opened as the step changed → coach intro over the cards → state play with cards visible. Now queueLevelUp holds levels during welcome/move/attack/sweets, the step advance waits for state play, showMenu hides lvlUp. Art 38: scripts/pack-tutorial-ui.py → assets/art/tutorial (13 files, 180 KB, TUT_KEYS, lazy 'tutorial' in LAZY_MENU_ART_RE, loadTutArt from title/startChapterTutorial/startCoach, texEvict skips tut_ keys during the tutorial); tut_card_frame tuPanel in showCoachIntro, vfx_tut_ring frame loop in buildCoachSpotlight, finger origin (.297,.016), tutGreatFx on step success. Nav: Home · Heroes · Bazaar (bazaar/tradein) · Upgrade (was Gear) · Activities; chapter/stage map to Home. Lobby stage panel = zone tag 'chapter' + '📜 All stages ›' pill (Weave tour step 5 now 'tap the stage box'); Inbox → 'Mail' left under Awards. Browser: fresh save title → book → tutorial with real level-ups to summary, returning title → book → Lobby, chapter + bazaar tabs, 0 errors.

# Previous delivery: v7.9.67 — Shorter tutorial lines tied to the lore + art order 38 (owner)

coachSteps get ids (welcome/move/attack/sweets/cards/dash/unique/hp/ready) and 2 short lines each that tell the story (Great Hunger eating Mochitopia’s flavors, enemies drop stolen sweets, pantry floor cracking → C1-1 fall). showCoachIntro shows texture tut_ic_<id> (72px, card top-right) when loaded, else the emoji in the title; buildCoachSpotlight uses tut_finger when loaded. Art order 38 `docs/art_orders/38_TUTORIAL_UI.md`: 9 step icons, finger, vfx_tut_ring, tut_card_frame (9-slice), vfx_tut_great → assets/incoming/tutorial_ui/, awaits art.

# Previous delivery: v7.9.66 — Title → tutorial for new players + slower coach tutorial (owner)

showMenu shows the title screen for every first launch (tutorialDone no longer required); title tap with !tutorialDone → startChapterTutorial (startRun(0) + coach). coachSteps now 9 steps with title/body intro cards: welcome · move (cumulative walk 700px, c.trav) · attack (3 enemies at 230px) · sweets (4 orbs dropped around the player, collect 3 via _coachOrbs counted in collectOrb while _inTutorial, timeout 30) · level-up card · Dash ×2 · Unique (uniqueCd=0, 6 enemies, timeout 25) · HP · ready. _coachNext → showCoachIntro(step,go): state 'coachIntro' + physics.pause, Ruby avatar card (STEP n/N, 26px title, 16px body lines), tap allowed after 1.2s (pointerdown routes coachIntro → coachIntroTap) then fade → play + step setup + small goal bubble (Ruby avatar instead of card_berry). Success = '✅ Great job!' banner 1.3s, next step after 1.6s (was 0.7s). _coachFinish destroys the intro. Browser: fresh save → title → tutorial intros/steps, 0 errors.

# Previous delivery: v7.9.65 — Stage box spacing (owner: stars too close to the edge)

buildLobby stage panel: SM 30 = right margin for stars + power line (was 14 / 20), starW panH·.22 (was .24), title centre and name-fit width use SM.

# Previous delivery: v7.9.64 — Title screen (owner picked idea 1 for the unused wand Strawberry art)

showMenu: first menu entry after app launch (window.__titleShown unset, no __pendingMenu/__pendingRun, tutorialDone) → menuScreen 'title' and no book cover. buildTitle(): hub_ui_background + buildHubScene (order 25 puppet Strawberry with wand, petals via startHubAmbience) + bottom shade + hub_ui_logo at h·.62 (bob + vfx_hub_logo_shine every ~5–6.5s; hubFlash now allows 'title') + pulsing 'TAP TO START' + version; full-screen zone tag title_start (noBounce) → hub (Lobby) + bookCover. navBarOn excludes 'title'. Browser 360×780/412×915: title → hub, 0 errors.

# Previous delivery: v7.9.63 — Lobby polish 5/6/8/10 (owner)

Empty stars get a gold 10-point outline (Graphics strokePoints over lb_star cell 1). Power line in the stage panel uses soft '#ffc58a' when ratio<.9 (no red); BATTLE with ratio<.7 first shows a toast 'Recommended N — tap BATTLE again to go' (_lbWarnAt/_lbWarnSi, 4s window). Side buttons: right Inbox/News/Daily, left Codex + Awards. Nav tab 'Play' renamed 'Stages' (map-book icon kept). Browser 360×780 checked.

# Previous delivery: v7.9.62 — Cleaner Lobby (owner picked critique 1–4)

LOBBY_FACE {hero:[cx/w, cy/h, size/h, foot]} (before CHARACTERS): profile avatar = square crop of card_<hero> at the face (roster_ banner kept as fallback). buildLobby: dim overlay .24 over the stage background, soft halo (hero colour edge → warm centre) behind the hero, glow ellipse + thin ring + light shadow at the real feet (fy uses foot fraction; Cocoa art ends at .902). Power pill removed → '⚡ cur / rec' right-aligned under the stars inside the stage panel (ps.hex colour); 'New cards here' line → gold 'NEW: …' badge on the panel top edge; hero stands at panY−10 (−20 with badge). Browser 360×780 + 412×915 checked.

# Previous delivery: v7.9.61 — Lobby hero warp + fairer C1-2 Sewer Flood (owner)

LH_USE_SHEETS=false: order 34 frame sheets look boiling (every frame redrawn by AI, mean frame diff 20–35) → off (code kept). lobbyHeroWarp(key,x,y,H): card_<hero> split into 28 horizontal setCrop strips in a container at the feet; hubTween counter st.t → breathing (scaleY 1±.018 about the feet, scaleX inverse) + per-strip x sway (h²·4.2·sin(1.15t) + h³·1.6·sin(3.3t+5h), top moves most); zone lobby_hero (noBounce) → lobbyHeroTap: squash .12 → hop 22 → Bounce back; 5 taps in 3s = squash .16 + hop 70 + full spin; sway amp ×2.2 easing back. Canvas-safe (no Mesh). C1-2 arenaMech: Sewer Flood sweeps warn 1900 / dur 3800 (was 1500/2400) / gap 250 (was 170) / band 60, P2 vertical sweep starts after the first ends (+400ms) instead of 1400ms in; arenaSweep hit check now forgives the gap edge (+6px, was −10). Browser: warp strips move (top ±3px, feet 0), tap/poke run, 0 errors.

# Previous delivery: v7.9.60 — Ruby mascot guide + pause icon fix (owner)

RUBY_TIPS (before WAVE_OBJECTIVES): say (2 lines, [word] = highlighted gold/green/pink) + short for every wave objective type, huntClear, mini, boss, magnet, heal, chest. rubySay(text,ms,{replace}) queue → rubyNext draws a UI container (depth 64, by pad+182, centred, black box white border, avatar inside left, purple 'Ruby' pill) sliding in; rubyAvatar uses texture mascot_ruby if loaded, else a code-drawn pink mochi with a ruby gem (art order 36 docs/art_orders/36_RUBY_MASCOT.md). rubyOn: state play, no coach/tutorial. rubyTip(key) from setupWaveObjective end (Save.data.rubySeen[key] <3 → full say 4.3s, else short 2.7s), spawnMiniBoss (+3.2s), spawnFinalBoss (+4.2s); rubyOnce on first collectHeal/collectVac/collectChest. The 12s objective pulse now reminds via Ruby short line + progress (≤ every 24s) instead of the player bubble; showSpeechBubble skipped while Ruby shows, Ruby closes an open bubble. showBanner moves below the Ruby box while it is up. Pause: crest icon at the gem centre (y .333·crH, size .34·crH); Resume play icon at the green socket (x+bh·280/260, .42·bh). Browser: survive/capture tips shown, pause icons centred, 0 errors.

# Previous delivery: v7.9.59 — Smoother menus, no Loading screen on page change (owner)

Both blocking GameLoader 'Loading…' spots in buildMenuScreen (group art _grpOk and lazy art menuLazyMissing) now go through menuLoadSoft(s,start,onDone,recheck): quiet ensureGroup; finished within 300ms → one build, else build at once with fallback art (_menuNoWait=s skips both checks) and rebuild when the art arrives (first block rebuilds normally so the lazy check still runs). menuPrefetch() (from buildLobby, once at a time) quietly loads lazy art of char/gLoadout/gActivity/chapter/upgrade/gear one screen after another. Nav tab tap sets _navDir (±1 by tab order) → menuEnterAnim slides the new page's pieces in from that side (x ±18%W, 260ms) instead of rising. Browser: 4 nav tabs, 0 loader shows, 0 errors.

# Previous delivery: v7.9.58 — Art order 34 Lobby hero motion wired (owner)

scripts/pack-lobby-hero-motion.py (sha/bytes vs each hero MANIFEST, 75% → 384×480 per frame in one row, WebP q88) → assets/art/lobby_hero/<hero>/ (48 sheets incl. Sesame — owner said wire it, ~3 MB per hero). LH_SHEETS (literal urls so build-www copies them), LH_MS frame times (idle/tap/def, from MANIFEST), LH_FOOT 451 / LH_BODY 390. Never at boot: lhLoad(keys) loads spritesheets on demand (filecomplete-spritesheet-<k>) and lhAnim makes per-frame-duration anims. buildLobby: idle ready → sprite (origin foot, scale heroH·.975/390 = same size as card_<hero>) + greet when hero changed or coming from another screen; else old static card + bob and loads idle/greet/tap then rebuilds. hubEvery 8–14s → random act1–4 (not same twice, skipped <8s after a tap or FPS <35). Zone tag lobby_hero (noBounce) → lhTap: 5 taps in 3s = poke, else tap. After one-shots end → idle, lhDrop keeps only idle+tap (and current hero's idle/greet/tap when switching hero). Browser 360×780: greet → idle, tap, poke, act2, hero switch to Yuzu, 0 errors.

# Previous delivery: v7.9.57 — Dokapon-style Forge roll (owner)

randomCraftSelected pays + stores forgeChoice first, then forgeSpin(item,line,pool,options,big): rebuild with _forgeSpinView (pool list instead of the choice panel; fc also false while this._forgeSpin), _forgePoolRows = visible pool row rects. Light (gold graphics) hops random rows 14× (45ms → slower, Sfx.wheelTick) and lands on option 1 (pin ★1), then 5 hops each to options 2/3; flips _poolPage when a result is on another page; survives menu rebuilds (lazy art) by re-creating light/pins from the current rows. Tap anywhere = finish (handleTap top), leaving the screen ends it; finish → Sfx.craft + buildCraftBench (choice panel). Auto-roll unchanged. Browser 360×780: 3 pins, page flips, 0 errors.

# Previous delivery: v7.9.56 — Red dots for gear + Kitchen (owner: other missing spots)

_gearBetter() (cached by hero/equipped/item uid+enhanceLv+itemLevel+affix count): any non-starter bag item with gearPowerDelta > 0 → hasTargetBadge('gear') (→ gLoadout/Gear nav) + dot on the ⚡ Equip Best button. hasTargetBadge('kitchen'): kitchenOpen and an active slot missing t or e while a non-cut part of that kind is owned (→ gActivity). Checked, no dot needed: Bazaar has no free item, heroes are all open (FIGHTER_PLAYTEST_ALL), Bestiary has no claim.

# Previous delivery: v7.9.55 — Missing notification dots (owner: e.g. Talents)

heroTalentSpendable(id) (global, next to talCost): TP > 0 and some open, non-max node costs ≤ TP — Core uses the same 3-chain parent rule as buildTalents (n.costs or talCost), Build Path trees use talentBranch + talNodeOpen/talNodeCost. hasTargetBadge new targets: talents (current hero), weave (UPG_ORDER.some(Save.talCanBuy) or all max + threads ≥ promoteThreadCost), specialCores (rank ≥1, a core below Lv3 with threads ≥ cost); char = new unlock OR talents; upgrade = perks|dig|weave|specialCores (so Gear nav/tiles light up). Dots drawn on the Heroes 'Talents' tab, each roster hero card with spendable TP, and the Temple Special Cores tab. Browser: TP 0/3 and Sugar 0/999999 toggle the right targets, Talents screen shows the dots, 0 errors.

# Previous delivery: v7.9.54 — Livelier menus (owner picked ideas 1–3)

menuEnterAnim(scr,n) at the end of buildMenuScreen (after setupMenuScroll, only the first n objects = before nav bar/tutorial overlays): only when the screen changes (_enterLast); skips _menuBackdrop, _noEnter, invisible, already-tweening objects and big backgrounds (>90% W and >35% H); each piece y+16 → y (280ms Back.out) + alpha 0 → its own alpha, delay by its screen y (0–200ms). BATTLE breathes: counter tween k 1↔1.035 900ms yoyo on the button parts (panel, icon, label, shine; marked _noEnter) about its centre, this._lbBreathe; _pressBounce stops it and restores the base transform first. drawBadgeDot: heartbeat scale ×1.38 twice (150ms yoyo, repeat 1) then loopDelay 1100ms, random phase; graphics fallback now drawn at local 0,0 + setPosition; tween removes itself when the dot is destroyed (replaces the old infinite alpha pulse). Browser: pages enter, BATTLE 1.000→1.035, dots 1.35/1.0, 0 errors.

# Previous delivery: v7.9.53 — Bouncy menu buttons (owner: tap should feel bouncy and fun)

Graphics prototype patch (before class Game): fillRoundedRect/strokeRoundedRect/fillRect/strokeRect/fillCircle/strokeCircle grow g._bb, clear() resets it (Phaser Graphics has no getBounds). handleTap → _pressBounce(z,fn,kind): menu state only, not nav zones (they slide), ignored while _pressBusy; collects non-backdrop visible menu objects whose box (Graphics _bb or getBounds + scroll) is ≤1.3× the zone and centred inside it; scales them about the zone centre k 1→.86 (60ms) →1.08 (70ms) then runs fn inside a Sfx._uiPending wrap (press sound plays at tap), then eases back to 1 if still alive. Nothing to bounce / no this.time → old immediate path (tests). Browser: side button bounces then opens News; double tap opens once; 0 errors.

# Previous delivery: v7.9.52 — Bottom menu highlight slides (owner: tab change looked like a warp)

drawNavBar: all 5 tabs equal width (active weight 1.3 removed, so icons stay put); tab tap stores this._navFrom={t,at}; on the next draw (<600ms) the active highlight (tuPanel lb_nav_active, or a positioned Graphics fallback) starts at the old tab x and tweens to the new one 240ms Cubic.out, active icon pops from ×.78 (Back.easeOut, 90ms delay) and its label fades in. Browser: Home → Gear highlight x 3 → 219, 0 errors.

# Previous delivery: v7.9.51 — Art order 33 Lobby UI wired (owner)

scripts/pack-lobby-ui.py (sha/bytes vs MANIFEST, 50% per cell, nineSlice halved, black VFX → lum×1.35 alpha) → assets/art/lobby/ (26 files, 192 KB, ~2.3 MiB decoded). Keys in ASSET_IMAGES + TEMPLE_UI cells (tuPanel/tuImg/tuFrames) + LB_KEYS; lazy via LAZY_MENU_ART_RE 'lobby' and loadLobbyArt() (one ensureGroup, rebuilds the menu) called from buildLobby and drawNavBar. buildLobby: profile lb_profile_frame + lb_avatar_ring, Sugar lb_currency_pill (+ zone tag bazaar), cog on lb_side_btn, side buttons lb_side_btn + ic_side_*, hero lb_hero_shadow, power lb_power_pill, stage panel lb_stage_panel (✦ CHAPTER n ✦ · C1-1 · name · lb_star ×3) split from the BATTLE button lb_battle_btn (cell 2 when the stage is not ready, 'SOON') + ic_lb_battle + vfx_lb_battle_shine every ~3s; lobby_play tag now on BATTLE; arrows lb_arrow_btn (flipX right, alpha .4 disabled); 2 vfx_lb_sparkle on panel corners. drawNavBar: lb_nav_bg, lb_nav_active, lb_nav_divider, ic_nav_* (fallback hub_btn_*/emoji), labels under every tab, active weight 1.3. Every piece falls back to the old graphics. Browser 360×780 + 412×915: all 26 loaded, tags intact, 0 errors.

# Previous delivery: v7.9.50 — Card types unlock stage by stage (owner: reveal card types gradually, part of the tutorial)

CARD_UNLOCK {path:1, relic:2, unique:3, mod:4, mutation:5, evolution:5, infusion:6, trade:7} = story stage index where the type opens; cardOpen(t) (true outside Story / tutorial / no Save) uses max(stageIndex, unlockedStage) so replays of early stages keep everything. Gates: Build Path Lv5, Infusion Lv13, Mutation, Evolution, Unique cards, Relic Lv6/12/18 + offerRelic (events fall back to currency) + mini wheel relic slot, Modifier/Trade-off in the relic screen (trade also keeps stageIndex≥5). First appearance of a type → newCardIntro marks Save.data.cardSeen[t] and drawCardIntro draws a 'NEW CARD TYPE' note under the cards (cards shrink 78px, taps ready after 900ms); cardTypeOf(o) maps cards to types, CARD_INTRO holds the texts. Lobby shows '✨ New cards here: …' above the plate for unseen types of that stage. Calls are this.cardOpen?.() for the method-extract tests. Browser: C1-1 Lv6 = basic only; C1-2 Lv6 = Build Path + note; Lobby hint; 0 errors.

# Previous delivery: v7.9.49 — Fix: frozen screen after a stage (owner)

startRun hides this.menu; every builder calls menu.setVisible(true) itself but buildLobby (v7.9.48) did not → after summary Continue the world stayed visible with only the nav bar. buildLobby now sets it, and buildMenuScreen sets it after the builders whenever state==='menu'. Browser: stage clear → epilogue → summary → Continue → Lobby visible, 0 errors.

# Previous delivery: v7.9.48 — Lobby (owner picked 1–4 from another game's screenshots)

buildHub → buildLobby() when the nav bar is on (portrait + tutorialDone; old hub stays for tutorial/landscape). Lobby: background = stage_card_sNN of lobbyStage() (default unlockedStage, stepping back over not-ready stages; this._lobbyStage via ‹ › arrows, limited to unlocked + isStageReady) with smooth top/bottom shade · hero card_<char> (transparent full body) standing above the plate with shadow + bob · gold STAGE plate 'C<ch>-<n>' (chapterStage or count within chapter) + name + ⭐ n/3 + power line (powerStatus) → tap = startStoryStage (tag lobby_play) · profile chip top-left (roster_<char> cropped square avatar, name Lv, char EXP bar, ⚡ Power, 🎖 Rank; tap → Heroes) · Sugar pill + cog (gMore) top-right + version text · side buttons (tags side_<t>) Inbox/News/Daily/Awards right, Codex left, badges via hasTargetBadge. Missing textures load via ensureGroup then rebuild. Nav bar: open tab weight 1.9 with gold pill + label, others icon-only (Play dark-pink), zone tag = target (z.nav=true) so the Weave tour/gear tutorial find 'gLoadout'/'chapter' on the Lobby. drawSpotlight sets _spotBuild → buildMenuScreen skips the bar when the page drew its own spotlight (Weave core step). No tab is locked (Gear is needed for the Weave tour, Activities opened from the start in v7.8.90). Browser 360×780: Lobby + Gear screens OK, Weave tour 5 steps → Stage 1 spotlight, 0 errors.

# Previous delivery: v7.9.47 — Bottom menu bar + phone Back button (owner)

NAV_H 62. buildMenuScreen: navBarOn(s) (menu, portrait, tutorialDone, no cloud conflict, not atlas/rift/recipes/recipeprep) → this.H temporarily = H−NAV_H while the screen builder runs (so every page lays out above the bar), restored in finally, then drawNavBar(menuScreen,H0) before applyGearTut (tutorial spotlights still filter zones/dim the bar). drawNavBar: 5 tabs Home(hub, 🏠) · Heroes(char) · Play(chapter, raised pink circle) · Gear(gLoadout) · Activities(gActivity) with hub_btn_* icons via hubIconFit, active tab by navTabOf(s) (group mapping), badge dots (hasTargetBadge char / hasGroupBadge), all objects _menuBackdrop/_menuFixedY and zones fixedY + tag nav_<t> (stay fixed while scrolling); tap = _navStack reset, _curMenu='hub'. setupMenuScroll measures against H−NAV_H when the bar is on. handleBackKey(): menu → book skip / busy guard / the screen's back zone / else hub / on hub 'Press back again to exit' (2s) → 'exit'; play/paused → togglePause; other states ignored. Bottom of game.js: Capacitor native App plugin backButton listener (exitApp on 'exit'), else history.pushState + popstate (browser back/gesture; re-push unless exit). Browser 360×780: 18 menu screens, 0 non-nav zones under the bar; tab tap → gLoadout; back: upgrade → gLoadout → hub → toast → exit; play ↔ paused; 0 errors. Note: headless first mouse tap after load is not delivered for any menu button (pre-existing, not the bar).

# Previous delivery: v7.9.46 — Weave tutorial tour (owner: after the tutorial it warped into Weave, never said where it is or how to leave, then warped to stage select)

openTutorialWeave now goes to the Hub with this._weaveTour='hub' instead of menuScreen 'upgrade'. applyGearTut (top) drives a spotlight tour with drawSpotlight + single tap zone: hub → tag gLoadout 'Step 1/5' → gLoadout tag upgrade 'Step 2/5' (sets _tutorialWeaveCoach) → buildUpgrade core spotlight 'Step 3/5' (marks _weaveSpotAt) → after buying _weaveTour='back' (no warp) → q.back zone 'Step 4/5' (again on gLoadout) → hub tag chapter 'Step 5/5 … Now tap Play!' → _stage1Coach + stage screen (existing Stage 1 spotlight). Fallbacks: nothing affordable on Weave → skip to the Back step; landing on the Hub mid-tour restarts step 1. Old direct path kept when _weaveTour is not set. Browser (real taps): hub → gLoadout → upgrade → core → back → back → Play, 0 errors.

# Previous delivery: v7.9.45 — Replay restart, no level-up over the boss wheel, end-screen taps (owner)

Replay on the defeat screen called startRun directly (level/skills reset, but enemies, boss and objects of the last try stayed) → now window.__pendingRun=stageIndex + scene.restart; showMenu sees __pendingRun and calls startRun after 60ms (skips the book cover). Boss kill: onBossDown gainXp(left orbs) queued a level-up that opened 650ms later on top of the reward wheel (700ms) → cards could not be tapped; gainXp and the queueLevelUp callback skip while mode==='reward' or _bossLootOpen (pending levels kept; Boss Rush opens them on the next gain). End screens (dead/rushDone/summary/epilogue/rewardChoice): the anti-spam lock started at the FIRST tap (always eaten) and each early tap extended it up to 2.6s → owner's 'Upgrade Flavor Cores' felt unresponsive; update() now records _stAt when state changes and taps are blocked only for 700ms after the screen opened; _overBtns/_epilogueBtns/_summaryBtns hit boxes padded 10px. Browser: defeat → Replay one tap → stage fresh (Lv1, 0 old enemies); reward mode gainXp → no level-up; 0 errors. No Android hardware back handling exists (owner asked for back-button ideas).

# Previous delivery: v7.9.44 — Yuzlings visibly bite (owner: minions just stick to enemies and damage appears)

Cause: bites dealt damage instantly when in range while the Yuzling sat on the enemy centre, and playYuzuMinionAttack ran all 8 frames of yuzling_attack_sheet (incl. hurt 5 / sleepy 6). Now: stand-off point = target edge (halfWidth+14 on the Yuzling's side), reach = max(58, standR+18)+ripen; in range + cd ready → m.lunge {dur .3, ax/ay, ux/uy, tgt} (cd 99 while lunging): wind back −8px with frame 2 (charge), dash +22px frame 3, juice frame 4; damage at k .55 via the old bite block (doBite), small knock .06 on non-boss; lunge ends → walk sheet, cd from the bite block (or .2 if the target died). Lunge cancelled (cd reset) when thrown/knocked/dashing. Browser: frames 2/3/4, src yuzu.bite, no stuck cd after toss+rush, 0 errors.

# Previous delivery: v7.9.43 — Yuzu teamwork (owner picked 1 + 2/3 + 7 from critique round 2)

1: yuzuLand sets m.stayT=YUZU_STAY 3 + stayX/Y → leash centre for that Yuzling is the landing point (Toss cluster 420 > leash 300 made tossed Yuzlings walk straight back). 2/3: assigned Set → Map count; ≤YUZU_FOCUS 3 per target, score d−70 if already targeted (gang up, Pack Instinct can trigger). 7: YUZU_START 3→4; yuzuNeed(o,fam): before a Build YUZU_EARLY_NEED 6, after 10+2·(size−START), −2·family, min 4 (used by yuzuOnKill + yuzuOrchFrac). Not done (owner may pick): Loyal Guard rework, Second Serving vs Parting Gift duplicate, Yuzu armor per nearby Yuzling, fixed formation slots. Browser: start 4 / need 6, targets 3,3,3, tossed Yuzling stays, 0 errors (caught and fixed a `new Mat()` typo first).

# Previous delivery: v7.9.42 — Yuzu ง+จ (owner)

ง: YUZU_BITE 7→14, bite cd YUZU_BITE_CD 1.8 (was 0.9, min .32→.64) = same base DPS, heavier hits · bites no longer call poseAttack (Toss keeps it) · m.popT .16 → scale hop in tickYuzuCrew (skipped while in the air) · vfxHitRing at the target, ≤1 per 90ms. จ: yuzuOrchFrac() (−1 if not Yuzu) → drawOverheadStatus draws a 3px green bar under EXP (bg +5px, key includes it) · Ripen count = min(size, YUZU_RIPEN_CAP 6) instead of max(2,ceil(size/2)); yuzuCap() = 6+family on Ripen so growth past 6 becomes Orchard power · Ripen desc 'Up to 6 Yuzlings…' (fixture yuzu regenerated). Browser: frac .21, Ripen keeps 5, size 6 + over 1 after kills, bites land, 0 errors.

# Previous delivery: v7.9.41 — Yuzu feel fixes (owner picked ก+ข+ค from the critique)

Owner said Yuzu felt odd; critique: player has no agency, crew roams the whole screen (leash 640–780) and leaves Yuzu alone, crew stacks/jitters, weak bite feedback, invisible growth, tinted placeholder art. Done: ก YUZU_LEASH 300 (targets within 300px of Yuzu, boss via priorityBossTarget(YUZU_BOSS_LEASH 380)), else crew returns to formation · ข charPassiveOnDash → yuzuRush(): every free Yuzling gets m.dash toward YUZU_RUSH_LEN 240 along moveDir (no input → nearest enemy), spread ±44px, bite×YUZU_RUSH_MUL 2 once per enemy, src yuzu.rush (m.dash now takes mul/src; parade keeps 1.5) · ค separation every 2nd frame (YUZU_SEP 26, half push each), smooth movement m.vx/vy approaching want=min(speed, speed·dist/90+40) with k=1−e^(−9dt), flip only when |dx|>12. Toss cluster range (420) unchanged. taro-foundation strips the new charPassiveOnDash line. Browser: crew max 54px from Yuzu with foes at 600px, 10 rush, 0 errors.

# Previous delivery: v7.9.40 — Sesame Mirror Network step 1 (owner: ตามแนะนำ on all 5 questions)

docs/SESAME_MIRROR_NETWORK.md §10 answered: mirror on Dash, 3 mirrors × 20s, Oath Focus = +6%/mirror, mirrors break only from big boss attacks, names Mirror Maze / Reflect / Phase Swap / Glass World. Consts SES_MIRROR_MAX 3, SES_MIRROR_LIFE 20, SES_MIRROR_REACH 700, SES_BOUNCE .15, SES_PRISM. charPassiveOnDash → sesPlaceMirror (vfx_magic_circle ring + rectangle shard, oldest replaced) · tickSesMirrors (from tickCharSignature; fades last 2s) · sesMirrorBreak(test) next to both yuzuKnock calls (spawnHazard impact, bossNovaWave band) · clearSesMirrors in clearCharSignature / when not Sesame. castMirrorBeam rewritten: points = Sesame + mirrors within 700 (oldest→newest), each segment fireBeam(…,{ox,oy}) ×(1+.15·i), then the old beam fan from the last point to the nearest boss/mini (else nearest enemy) ×(1+.15·bounces); 3 bounces = Mirror Mark ×2; standing-still _sesFocus removed (wide +1.5/bounce). fireBeam takes opt.ox/oy. damage() Oath Focus: +6%·min(3,mirrors)·CP.s (was +18% standing still). Meter src sesame.beam/bounce/mark. Texts: CHARACTERS.sesame desc, CHAR_PASSIVES.sesame. Tests: taro-foundation strips the new charPassiveOnDash line, taro-t5-resolvers damage hash. Browser: 3 mirrors, bounce damage, break, menu clear, 0 errors. Cards/paths unchanged (step 2 next). Sesame stays in HEROES_WIP.

# Previous delivery: v7.9.39 — Yuzu step 3: cards, Evolutions, Unique Mutations (Yuzu leaves HEROES_WIP)

Path cards now 5 per Build: Ripen p_heavyPeel/p_bodyguard + y_fastripe (kills ×.8^lv), y_keepripe (25%/lv keep stage on knock-out), y_giantslam (slam r ×(1+.2·lv)) · Toss p_pulp/p_feast + y_strongarm (gap ×.88^lv), y_bigsplat (r +20%/lv), y_double (every 4th/3rd throw sends 2) · Harvest p_sourMixer/p_sweetHelper + y_seedluck (+10%/lv), y_longroot (+3s), y_elder (×1.25 size/reach/life). Mutation hardy (m.hardyUsed: first yuzuDown ignored, reset on regrow). YUZU_EVOLUTIONS (basicAttackInfo yuzu branch + Codex rows): Golden Orchard (ripe cap 4 'ROYAL', need 20, new/knocked Yuzlings min stage 1) · Citrus Catapult (yuzuLand rethrows once to an enemy 40–230px away, a.bounced) · Endless Orchard (sprout kill → gen2 seed, gen2 sprouts don't seed). UNIQUE_MUTS citrusGuardian ripe_fest (parade end +1 stage) / ripe_shield (_shield += gold+ count, max 3) · zestSwarm toss_rain (second volley +1s) / toss_home (a.tgt follow) · juiceWorkshop grow_burst (parade end: sprouts burst r80 bite×2) / grow_grove (Elder at Yuzu). HEROES_WIP=['sesame']. Fixture yuzu regenerated. Browser: cards offered per path, evo names, hardy, ripe_fest 1→2, catapult bounces 6, grove elder, 0 errors. Talents (step 4) and art order 33 still to do.

# Previous delivery: v7.9.38 — Yuzu Orchard Swarm step 2: three Builds + Unique per Build

Same path ids (talent points kept): citrusGuardian = Ripen (base dmg 1.2, crew max(2,ceil(size/2)), m.ripe 0–3 from the minion's own bite kills [3,6,12]×.8^y_fastripe, bite ×1.5^ripe, range +12·ripe, ripe 3 = giant slam r90 ×.6 · yuzuRipeLook tint/scale · knock-out −1 stage) · zestSwarm = Yuzling Toss (base dmg .9, no extra count; _yuzuToss every 1.4·.88^y_strongarm s throws the free Yuzling nearest Yuzu at yuzuCluster(420) → yuzuThrow/arc → yuzuLand r70 bite×2.2; kills charge YUZU_TOSS_CHARGE 25 → giant r150 ×6 + knock; y_double/y_bigsplat hooks) · juiceWorkshop = Harvest Sprouts (yuzuOnKill 30% (+10%·y_seedluck) seed → 1s → yuzuSprout (8s, ×.6, cap 10/16 forced), elite/mini → yuzuElder (20s, r110 hit/1s, crew within 140 +20%, max 2); Cheese is a separate crew member that waters: seeds sprout now, sprouts +2s, heal). yuzuBite() shared base. Unique yuzuParadeCast(ul): regrow seeds, crew dashes into the cluster (bite×1.5 once per enemy) · Toss throws the whole crew · Harvest plants a sprout per Yuzling · Ripen +1 stage while parade · ul2 ×1.7 · ul3 cd ×.5 · ul4 end burst. Meter sources yuzu.bite/toss/giantToss/parade/sprout/elder/cheese via _mxSrc. y_* card ids referenced for step 3 (not offered yet). Texts: path names/descs, BUILD_PATH_STYLES, CHARACTERS.yuzu, citrusParade + tiers, Heavy Peel/Sour Mixer/Sweet Helper, Growing Family. Fixture yuzu basic/paths regenerated. Browser: all 3 paths + Unique each, giant toss, elder, ripen + knock, 0 errors.

# Previous delivery: v7.9.37 — Yuzu Orchard Swarm step 1 (owner approved design)

Owner answers: knock-outs only from big boss attacks, start 3 / cap 12, Toss auto + kill-charge giant toss, names Ripen / Yuzling Toss / Harvest Sprouts (docs/YUZU_ORCHARD_SWARM.md §10). Consts YUZU_START 3, YUZU_CAP 12 (+lv.family), YUZU_HARD_CAP 17, YUZU_BITE 7 (was 8), YUZU_REGROW 6. yuzuOrch {size,kills,over} (reset in clearYuzuCrew) · yuzuOnKill from killEnemy after uqOnKill: need = max(4, 10+2·(size−3)−2·family) → size+1 or over+1 (≤10, bite ×(1+.03·over)); Guardian path skipped. count = size + pm.count + cheese. yuzuKnock(test) called in spawnHazard impact (r+8) and bossNovaWave band (|d−rr|<28) → yuzuDown (seed: tint, half scale, AI skipped) · regrow after 6s, ×2 speed within 150px of Yuzu (Crew Leader passive text now true) → yuzuRegrow. Growing Family desc/headline changed; fixture cocoa-rework-baseline yuzu basic updated. Browser: 3 → 4 after 10 kills, hazard/wave knock, regrow, 0 errors. Next: step 2 (three paths + Unique variants).

# Previous delivery: v7.9.36 — Clearer first tutorial (owner)

coachSteps: icon + say (action) + sub (how) + label ('TAP' for dash/unique). drawCoachBubble = big card top-middle (y max(86,13%H), 22px title, STEP n/6, goal line, drop-in tween) instead of the 52px bottom strip over the Dash button. buildCoachSpotlight: ring r44, TAP pill left of the ring, move step = finger sliding left↔right at 62%H (tickTutorialCoach). coachSpotTarget dash/unique read this.dashBtn/uniqueBtn positions. Done banner '✅ Nice! Next step…'.

# Previous delivery: v7.9.35 — Tutorial audit + no page transitions (owner)

Browser run of every tutorial on the minified www build. Coach (6 steps → summary +140 Sugar), Weave coach → Stage 1 spotlight, Mint/Cocoa hero intros, manual pages: OK. Gear tutorial (gearTut 0–4) was dead since the hub redesign + esbuild minify: applyGearTut matched tap zones by fn source text. Fixes: src() normalizes " → ', Talent regex /\.tal\[\w+\.id\]=\w+\+1/, fallback routes by tag (st0 → 'bazaar' + _bazTab='gamble' since gacha moved there in v7.8.95, st1–2 'gear', st3 'craft', then 'gLoadout', then back zone), _gearTutLabel for tests. openGachaReveal: 420/920ms callbacks skip visuals if status text destroyed (item still granted). tutorialPages: drag anywhere, Lv-up cards rank up (no Awaken), 'Pick a Build Path' replaces removed Recipes page. menuTransition returns at once (owner: no page transitions; bookCover on showMenu stays).

# Previous delivery: v7.9.34 — Book cover on every menu page change (owner)

menuTransition: when bookReady → end any running cover (_bookSkip) and play bookCover() (same as stage → menu) instead of bookTurn (kept, unused). Curtain fallback unchanged when the book art is not loaded.

# Previous delivery: v7.9.33 — No EXP during the final boss (owner)

killEnemy drop line: skip dropOrb while this.boss is an active isBoss (not Boss Rush). The boss itself already dropped none (v6.54.8); summons/adds during the fight now drop none too. Hearts/field drops unchanged.

# Previous delivery: v7.9.32 — Smaller EXP drops (owner)

XP_ORB_PX [0,36,44,52,62,73,94] → [0,22,26,31,37,44,56] (−40%). Shadow/trail/merge VFX scale from it; orb body keeps the old 30·sc world size (pickup unchanged).

# Previous delivery: v7.9.31 — Art order 32 (card icons round 2) wired

scripts/pack-card-icons-2.py (sha/bytes check vs MANIFEST, 256→128 WebP q90, runtimeTarget per row; ic_mod_shatter skipped by art) → assets/art/card_icons/ (ic_uq_* 5, ic_uqm_* 24, 13 new ic_path_*, 5 redrawn mods/fusion), build_paths/p_static + p_footwork overwritten, icons/relic_streak + relic_laststand. New keys in ASSET_IMAGES; ic_* appended to CARD_ICON_KEYS (stage-lazy). cardArtKey: o.uniqueCard → ic_uqm_<id> (Unique Mutation) / ic_uq_<id minus uq_>. 13 path cards' iconKey → own ic_path_<id>. tests/fixtures/cocoa-rework-baseline iconKeys updated. Browser: all keys load in a stage, 0 errors.

# Previous delivery: v7.9.30 — Art order 31 (C1–C2 counters + shared ring/hit) wired

scripts/pack-arena-counters-c1-c2.py (same pipeline as order 30) → assets/art/counters/ (12 files, ~240 KB). Loading: generic counter_cCN_* → STAGE_SHEETS[(C−1)·5+N−1] (also covers C3), vfx_counter_* → every stage. counterArt(b) now maps all 15 stages (+ Pinnacle). spawnCounter: option frame (counter_c15_dishes = 5 still frames, hungerFeast passes i%5; non-loop sheets show frame 0), ring = vfx_counter_ring tinted (scale tween keeps the display size), launched counter hitting the boss plays vfx_counter_hit tinted (c.tint). antTunnel uses counterArt before nest_eggs. Fallbacks unchanged.

# Previous delivery: v7.9.29 — Art order 30 (C3 + Pinnacle boss VFX) wired

scripts/pack-boss-vfx-c3.py (sha check vs MANIFEST, lum×1.35 alpha for black sheets, counters keep alpha, prints ASSET_FX lines with fill bbox) → assets/art/boss_vfx/ (48 files, ~4.1 MB, ~700 KB/stage like C1–C2). Loading: vfx_b11…b15 via the vfx_bNN loop; vfx_bpin_*/counter_pin_* → STAGE_SHEETS[14]; counter_c3N_* → STAGE_SHEETS[N+9]. bossKit now 0–14 and returns vfx_bpin_* first when _pinnacleRun/boss._pinnacleArt. Kit lane() helper → kitLane (C3-3 uses prism_beam); chargeTelegraph on stage 10 uses stampede_trail. Signatures in BOSS_KITS: harvestMoon, dryWind/witherWind (wither_pull life), emptyHeart, shatterDome (dome_shard hold 4 per hazard), lastSeed, rootCage ×2 (rootCageArt: art gap at 90°, drawn as a circle rotated to (g+.5)·TAU/n), firstBloom, devour (pin_maw), eclipse. Arena: arenaSweep/arenaGrid/arenaRings take art (bands left/right of the gap · seed tile frames 0–1 warn then 2–5 · ring segments along the arc outside the gap); scythe_cut at the half-screen hit; nectar_drip follows the real Hollow Bloom (replaces drip dots); mirror beams = prism_beam sprites per segment. spawnCounter: key ||= counterArt(b) (C3 stage / Pinnacle) → looping sprite 54px. Every hook falls back to the old graphics. Phone visual/FPS review pending.

# Previous delivery: v7.9.28 — Art order 18 J Storm Mark icon wired

ic_taro_storm_mark.png (sha matches MANIFEST) → assets/art/build_paths/taro_storm_mark.webp (128 lossless, same as other Taro Unique icons) + ASSET_IMAGES.ic_taro_storm_mark; syncUniqueIcon already picks it for the smite path. Order 18 now fully wired.

# Previous delivery: v7.9.27 — EXP drop shadows + art order 30 written (owner)

xp_orb_shadow (assets/art/exp, ASSET_IMAGES, XP_ORB_KEYS) · xpShadow(o) from orbSkin: one image per orb (o._sh, depth 79998, width XP_ORB_PX·.6, offset _shDy = .42·size), moved only while flying, hidden in the orb loop when the orb is inactive or in the candy fallback. Art order 30 `docs/art_orders/30_BOSS_ATTACK_VFX_C3.md`: 48 files (A stage kits vfx_b11…b15 + vfx_bpin warn/impact/wave/lane · B 18 signatures/arena art · C 6 counter objects PNG32) → assets/incoming/boss_vfx_c3/, awaits art. Code notes in the order (bossKit 0–14 + pin, arena hooks).

# Previous delivery: v7.9.26 — Art order 29 Flavor Drops wired

6 packed WebP → assets/art/exp/ (hash-checked vs MANIFEST; shadow A2 not used — 300 extra sprites, skipped for FPS). XP_ORB_KEYS pushed to every STAGE_SHEETS (not boot); warmStageTextures regex adds xp_. ASSET_SHEETS.xp_orbs (96), ASSET_FX vfx_xp_pickup/_big/_trail(loop)/_merge, ASSET_IMAGES xp_bar_icon. orbStyle adds t (T6 ≥50). orbSkin(o,v): xp_orbs + anim xp_t1…6 (xpOrbAnim, random start frame), world size XP_ORB_PX[t]/.75, body.setSize keeps the old 30·sc world body (pickup unchanged); else candy+tint fallback; first call swaps HUD ⭐ xpIcon to xp_bar_icon (hudList updated). Drops don't spin, scale pulse ±5%. Flying orbs (_vac or in pickup range) get xpTrail (pool ≤40, tinted XP_TIER_COL, swept when owner inactive). collectOrb: vfx_xp_pickup tinted / _big for T5–T6, xpFxOk ≤6 per 100ms, else old sparkle. Merge (≥300 orbs) → orbSkin + vfx_xp_merge. tests/story-budget stubs orbSkin/xpTrailOff/xpFxOk. Browser: 30 drops T1–T6 + 300-merge + vacuum, 0 errors. Phone FPS at 300 drops pending (fallback idea: static frame for T1–T2).

# Previous delivery: v7.9.25 — Card before → after (owner, from a reference screenshot)

_cardProgress(o,hl) (called after _cardHeadline in drawReadableChoiceCard): basic upgrade cards with lvl>1, max>1 (not mutation/evolution/path/infusion/relic/mod/fusion/trade-off) whose headline is a single leading '+N', '+N%' or '+Ns' (no other digits) show 'cur·N → (cur+1)·N rest', e.g. '+16% → +24% attack speed'; additive per rank, uq_cd uses 1−.9^n. Font shrinks to fit one line (hl.prog).

# Previous delivery: v7.9.24 — Plain card text (owner: many descriptions still confusing)

Text only. ~60 desc/headline rewrites for Momo/Mint/Cocoa/Taro basic upgrades, mutations, Build Path cards and path upgrades + TARO_PROGRESSION (storm/smite/tempest arc/surge/chainlord/stormcaller/evolution) + taroAttackInfo pre-path Arc Reach/Extra Arcs/mutations/evolutionDesc. Removed jargon: 'converts/excess/overflow', 'percentage points', 'root', 'base power', 'cap applies', 'Charged Unique:' → 'Your Unique beam …'. Script kept at scratchpad plain.py (D(id,name,desc,headline)). Tests: taro-needle-arc headline strings ('+1 Arc jump', '+1 Arc at once'), cocoa-rework-baseline regenerated.

# Previous delivery: v7.9.23 — Instinct → relics + path card counts (owner)

RELICS streak (p._cond.c_streak +2) / laststand (c_close +2), added in gainRelic and subtracted in resetRelics via this._relCond (no stacking across stages); condRelicCard no longer offered (function kept). New path cards (all fx {}, lv-based): Taro storm p_arc_shock (taroDealDamage kind 'chain' → e._arcShockT 2s, damage() ×(1+.04·lv)), p_arc_twin (castTaroChainBasic(level,_echo) every 4th/3rd cast recasts after 180ms), p_arc_ground (taroAfterDirect heal .4%·lv, .25s cd) · smite p_spark_shock (kinds spark/sparkChild, .03·lv) · tempest p_sentry_ward (sentryWardMul in hurtPlayer: <160px of a non-beacon node ×(1−.05·lv)) · Mint barrage p_bar_wide (frostShatterBurst bloomR ×(1+.2·lv)), p_bar_chain (25%·lv chance burst again at a nearby enemy ×.6, _barChain guard), p_bar_echo (castFrostLance every 4th/3rd volley recast +250ms, _barEcho guard) · Momo ricochet r_spark (ptOnBounce 15%·lv zap nearest within 170 for 40%) · Cocoa brawler p_streak (b._fist set in cocoaFireFist, reset in getBullet; pathBulletDmg ×(1+.02·lv·stacks≤10), 3s) · dashboxer p_leapstun (cocoaDashLeap knock .4·lv non-boss). Path card counts now 5–7 everywhere (Momo 7/5/5, Mint 7/5/7, Cocoa 5/6/5, Taro 5/5/5). Browser smoke 7 builds + 4 relics: 0 errors.

# Previous delivery: v7.9.22 — ⭐ Unique cards (owner: layer 1 + 2, option ก)

UNIQUE_CARDS (uq_power ×1.2/rank via uqMul() in uniquePower() + castStormBeacon dm · uq_cd ×.9^rank in uniqueCooldown · uq_kill −.1s/rank per kill (uqOnKill after relicOnKill) · uq_echo explodeAt r150 relicDmg(4) 0.4s after cast · uq_ready +15% move (spd line) and basicRate ×.87 while uniqueCd≤0) stored in basicAttack.lv. UNIQUE_MUTS[path] 2 options → basicAttack.uqMut (one pick, not for HEROES_WIP). Offered in rollBasicAttackUpgrades after the loop when this._uqUses≥3 (counted in uniqueCastFx, reset in resetRelics), kind '⭐ Unique'/'⭐ Unique Mutation', gold colour, group 'universal' when focused. uniqueCastFx() is inserted after every `_coachUnique++` (useCharacterSkill except Momo sniper hold, sniper release, mintUniqueStart, berry blast). Tap mutations in uniqueCastFx; hold ones via uqMutHook: snipe (releaseSnipe: hits/c), blast (releaseBerryBlast), bloom (releaseGlacierBloom: frozen count), lance (releaseFrostLance). Taro: plasma_wide (castTaroPlasma max ×1.35), plasma_twin (recast ×.6 after 1.9s), mark_jump (taroTickMark moves the mark once when the target dies), mark_nova (taroEndMark extra ring ×2.2 r), over_long (overUntil +1.5), over_finale (uqOverFinale: 8-orb ring ×2 per sentry). Cocoa: rocket_ring/heat (_uqHotT → cocoaFireFist explode), rage_after/guard (only when _titanRelease>0), phantom_refund (_uqWinT kills −.5s)/slam. Guard = uqGuardMul() in hurtPlayer. Browser smoke 12 paths × 2 mutations + all 5 shared cards at max: 0 errors. Numbers untuned.

# Previous delivery: v7.9.21 — Card ECRS round 2 (owner: ตามที่แนะนำ)

E1 Mint p_quiver removed · C4 Mint p_executioner card removed (hitImpaler execute code kept, lv 0) · E2 Taro p_overload Spark Power removed · E4 TRADEOFFS t_burn removed · E3 Taro p_static = fx {} + taroAfterDirect storm kill shards 3+lv targets, damage ×(1+.33·lv) · C1 Cocoa p_recharge = Leap Mend (cocoaDashLeap heals 1.5%·lv max HP when it finds a target; the −0.5s/rank Unique refund in doDash removed) · C2 dashp = charges only (cocoaDashBuffPct = .1 + _pm.dashm) · C3 Taro m_focus = Storm Battery (kind killCharge: modOnKill counts to n=15, next hit in modDmgMul ×5, _killChg) · S1 rate headlines '+8% attack speed' (Momo/Cocoa/Taro/Quick Arc, Mint +7%, tempest '+8% sentry fire rate') · S3 headline on every Momo/Mint/Cocoa/Taro card; Taro path mutations clear the fixed headline (their desc changes per path). Tests: mint-build-path (no Quiver), taro-progression (no path dmg mul), fixtures cocoa-rework-baseline (taro basic+paths), taro-v7817-dash (doDash refund), taro-t5. Still open for new card ideas: C5 Momo Seed Bloom, C6 Instinct → relics, R1 path card counts (Taro Arc 2, Mint Barrage 2, Cocoa Fire Fist/Dash Boxer 4 vs Sniper 7 / Impaler 7), R2 Unique tag, R3 Cocoa Close Crush, R4 Taro Overcharge, S2 long descs, S4 Petal Spread text.

# Previous delivery: v7.9.20 — Slower page turn + more warning on boss arena attacks (owner)

Owner: menu transition too fast; some new boss skills hit before you can react (e.g. C1-2 flood). bookTurn frames 54→82ms, dust 40→60, total 360→540ms; curtain 340→500 (flat fallback 300→450). Arena: arenaSweep warn 900→1500 dur 1600→2400 gapW 150→170 · second sweeps (C1-2 P2, C2-5, Pinnacle tongue) start 1400ms after the first · arenaGrid warn 850→1300 gap 420→600 (C1-3 call 700/850→1100/1300) · arenaRings warn 700→1100 shrink 2600→3400 (Pinnacle 3000→3800) · arenaHands warn 900→1400 speed ×~.77 · arenaPillars warn 1300→1800 · C3-1 scythe 1300→1900 · C3-3 mirror beam warn 1100→1600 · hiveRush lane warn 720/620/560→1000/900/820 · antTunnel lock 700/560→950/800. Arena smoke 13 bosses × 3 phases: 0 errors.

# Previous delivery: v7.9.19 — ECRS remaining items (owner: ทำข้อที่เหลือต่อ)

Skipped by the WIP rule: CC2 (far layering is Sesame-only), CS1 (Sesame mutations), RR1 (only Yuzu crit relics left after Momentum removal). CC5 left as is: each hero has one execute mod + its fusion upgrade, no in-hero duplicate. Done: CC4 Crown Breaker = every 40 boss/mini hits (≥6s apart, _crownHits/_crownAt) → knock .8 + atkCd 1.2 + relicDmg(6) crush (does NOT use bossStun so arena mechanics are not delayed); Taro m_judge → Static Buildup (kind stackShock: every 6th hit on the same enemy relicDmg(1.5) + knock .6 non-boss) and f_skyjudge → kind skyStrike (modTick every 4s: highest-HP enemy in camera view, modBoom r80 ×5). CC3 Mint m_shatter → kind frozenKill (frozen/brittle kill → modBoom r90 ×1.2 + freeze). CR1 hero-specific mods: Momo m_spray → Petal Kick (kind dashSeeds: 6-seed ring, bounce 1), Cocoa m_rage → kind dashRage (modOnDash +1 stack max 5, modDmgMul ×(1+.06·stk), charPassiveOnHurt clears). RR2 synergies: Full Belly (harvest+shell), Frozen Jam (chill+jam, stuck freeze 1s), Sharp Edge (firstbite+glass, ×1.70). RS1/CS2: relic headlines for splinter/leech/burst/glass/lastbreath; Deadeye/Titan Fist/Giant Hunter '+15% vs Bosses & elites', Long-Range Current '+12% beyond 300px'. Browser smoke 4 heroes × new mods + 7 relics + miniboss: 0 errors; Rolling Rage 1→2→3, ×1.18, hurt → 0.

# Previous delivery: v7.9.18 — In-development badge for Sesame + Yuzu (owner)

HEROES_WIP const (next to FIGHTER_PLAYTEST_ALL); buildChars roster card draws a yellow '🚧 In development' pill at the top of the card; showCharacterInfo unlock line says cards/balance will change.

# Previous delivery: v7.9.17 — ECRS relics + duplicate cards (owner: ตามแนะนำ)

Relics: jam = Sticky Jam (relicJamTrail → puddle r70, 12 ticks×250ms via artDelay, pins non-boss once (frozen .5), damage() ×1.25 via inJamPool; max 4 pools) · chill = Cold Snap (damage(): every 6s → relicColdSnap freezes target + 110px non-boss 1s; _coldSnapAt) · shell also triggers on elite/mini/boss kill (trophy removed) · momentum, magnet removed (fusions f_quakeking→dashcharge, f_horizon→firstbite; Sticky Rush = jam+dashcharge) · TRADEOFFS t_glass, t_core removed · condRelicCard c_dash removed (p._cond.c_dash still works for gear). Cards: Yuzu p_feast Chain Feast = kill → 30%/rank next bite ready, p_pulp Quick Paws = swarm run +20%/rank · Cocoa p_footwork Hot Hands = every 8/6/4th fist explode 60 ×1.3 (_ffHot), p_blitz removed, Phantom Jab takes the combo hold (cocoaComboHold uses p_phantom) · Taro p_sentry_pulse Close Charge = sentries <260px of Taro tick ×(1+.12·lv) (pulse no longer ×.9^rank), p_squall Forked Arc removed · Sesame p_facet Prism Echo = every 4th/3rd cast re-fires at 50% after 300ms, p_swift Retreat Shot = charPassiveOnDash sets _sesRetreatT +2s → next beam ×(1+.3·lv) · Momo buckshot removed. Tests: charged-projectile jam case, taro-progression Forked Arc case, fixtures (cocoa-rework-baseline, taro t1/t5 hashes). Browser smoke 8 hero/path combos with relics + dashes: 0 errors. Still open from the ECRS list: CC2–CC5 (far/frozen/boss/execute layering), CR1 hero mods, CS1 Sesame mutations, RR1/RR2, RS1/CS2.

# Previous delivery: v7.9.16 — Clearer damage card wording (owner)

Owner asked how 'power' cards differ from '+damage'. One-attack multipliers (basic 'power' cards of every hero incl. taroAttackInfo, path fx:{dmg} cards Heavy Peel/Sour Mixer/Static Shards/Spark Power/Refraction/Steady Hand, talent _P({dmg}) nodes) now read '+N% <X> hit (multiplies)' + desc 'Multiplies with your “+% damage” total.'; dmgMul pool sources (Weave Attack Power, hero Talent dmg nodes, Path Focus, mod f_might) read '+N% all damage (adds up)'. Text only, no number changes. tests/talent-icons normalizes the new labels; cocoa-rework-baseline regenerated (non-Cocoa heroes + Taro basic).

# Previous delivery: v7.9.15 — Arena mechanics for every boss + card clean-up (owner)

arenaMech(b) (called via arenaMechDue at the top of drainBossAttack[boss]/chili/frost/rootmother/behemoth/chronobloom/trueRootmother and kitAttack[boss]) picks per stage: 1 Clogmaw arenaSweep h (+v in P2) + 🧽 · 2 Griddle arenaGrid checker/rows/cols + 🍳 · 3 Golem arenaPillars (hide behind a pillar from the breath, pillar breaks) + 🧊 · 5 Bud arenaPods (3 kickable pods, b._podShield → damage() ×0.3 until all kicked; 8s → nova) · 6 Behemoth arenaFog (moving clean-air bubble, 1→2) + 🍄 · 8 Chronobloom arenaHands (two rotating clock hands, segment hit) + 🌱 · 9 True Rootmother sweep h then v (+2 pods in P2) · 10 Colossus half-screen scythe on the player's side of the boss + 🌾 · 11 Hollow Bloom arenaDecoys (2 fake images + real boss dripping nectar, all fire) + 🍑 · 12 Glass Gardener 3 💎 mirror counters + beam path boss→mirrors (kick a mirror = shorter path + 3%) · 13 Seedwarden arenaRings (2/3 rotating shrinking rings with one gap) + 💣 · 14 First Planter grid/sweep/rings/crown pods by phase · Pinnacle jaws (rings) / tongue (sweep h+v) + 🍖. Tools: arenaTick/runArenaTicks (update), arenaView (camera worldView), arenaDmg (16+6·si, mini .9, Pinnacle 1.15), arenaEnd. Browser: all 13 × 3 phases ran, 0 errors. Cards (from a full audit): renames Loopback / Fade Burst (two Overloads), Static Shards (Arc Power ×2), Frost Stack (Deep Freeze/Deep Chill), Steady Draw (Momo vs Mint Heavy Draw), Deep Impale, Wide Pound, Sixth Slam, Finishing Blow, Split Light, Calm Mirror, Ice Breaker, Peel Pop, Last Squeeze, Giant Hunter, Thick Rind, Marksman’s Oath, Mochi Heart+; unused/fitting icons for s_slug/s_seek/s_return/p_heavydraw/p_executioner/p_froststack/p_chainshatter/p_ember/p_crater/p_slamwave/p_recharge/p_sentry_overload/p_sentry_link; SKILL_ICON.yuzling; text fixes (Hailstorm cap 2, Minty freeze, Sentinel style). Effect-duplicate cards listed for the owner to pick (not changed). Fixtures: cocoa-rework-baseline (non-Cocoa paths regenerated), taro-t5 damage hash.

# Previous delivery: v7.9.14 — Faster start (owner: loading got slow again)

Causes: 8 releases in a day (each new version waits for the full game.js via ?fresh= with no timeout) + v7.9.10 put journal/book in UI_ART_RE so the cached-start preloadAll waited for them. Fixes: UI_ART_RE drops journal|book (they stay lazy via MENU_GROUPS/LAZY_MENU_ART_RE + loadBook). sw.js ?fresh= = race network vs cached shell, FRESH_TIMEOUT 6000 (network keeps filling the cache → next launch is new). build-www.mjs minifies www/game.js with esbuild (import, else `npx --yes esbuild@0.24.2`, else ship full) then restores the exact `const GAME_VERSION = 'x'` text the pages.yml post-deploy check greps (esbuild merges consts → split with ';'). 2342→1979 KB raw, gzip 767→625 KB. Minified build passed the boss arena smoke + check-forge-live-ui 21 states. Source game.js is unchanged (tests read the source).

# Previous delivery: v7.9.13 — Boss arena mechanics pilot (owner picked pilot 3)

Owner wants skill-based boss mechanics like Terraria's Queen Bee. Following docs/BOSS_ARENA_MECHANICS.md P1+P2. Shared: arenaMechDue(b) (first 4.5s, then every 12/10/8.5s by phase, skipped while b._arenaBusy), bossStun(b,sec,label) (knock+atkCd), bossPctHit(b,pct) (damage() with _infTick so flat ATK is skipped; phase gate still applies), spawnCounter(b,x,y,{emoji,key,tint,life,onHit,drift,onArrive}) + tickArenaMech (dash kick = dashTime>0 or <.22s after dash, within 56px → flies to boss → onHit; unkicked 6s → warns 1s then small blast) + clearArenaMech (from clearBossObjects). Pilots hooked at the top of each attack fn: hiveRush (Hornet Queen C2-3: 3/4/5 side-to-side screen rushes at the player's row, lane warning 720/620/560ms, speed 1100/1250, then 🍯 jelly counter = 3% + stun + 40% slow 3.2s), antTunnel (Ant Empress C1-1: burrows (body off), shadow chases 2s then locks 700/560ms, erupts with hit + nova; phase 2 adds a fake shadow, the real one drips acid; 🥚 nest_eggs counter = 4% + stun), hungerFeast (Great Hunger C1-5: drainPull 4.2s 150/175/195 + 4/5 plates drifting into the mouth, each arrival heals 3%, kicking one = 3% + stun + pull ends). Browser: all three ran, kick → 3–5% boss HP + stun, 0 errors. Next after owner playtest: remaining 12 bosses + Pinnacle per the doc.

# Previous delivery: v7.9.12 — EXP stays on the ground (owner)

Owner: no flying EXP — the player must walk over it. settleStoryBudget no longer touches orbs (collected=0); leftover orbs keep their _storyBudget and pay through collectOrb. killEnemy boss branch no longer sets _vac on all orbs; onBossDown still pays any orbs left at stage end. tests/story-budget.test.cjs adds pick(s) (collect active orbs) before the settle assertions. Pickup magnets (vacuum item, Sweet field) unchanged.

# Previous delivery: v7.9.11 — Remaining boss kits + wave-end EXP visible (owner)

BOSS_KITS const (before BOSS_LINES) = data-driven kits: m2 Boiling Pan, m3 Giant Ice Block, m4 Banquet Executioner, m5 Sporewarden Mantis, m10–m14 C3 minis, b10–b14 C3 bosses, pin = Pinnacle (stage 14 + _pinnacleArt). Each kit {c tint, base, p2, p3, moves{n banner, h hint, pose, run(ctx) → cooldown}}; ctx helpers ring(n,gap,spd)/fan(a,n,step,spd)/lane(a,ms) (vfx_line telegraph)/haz/adds/T(delayed, b.active guard) + s (scene) for chargeTelegraph/bossNovaWave/drainPull/spawnBossObject. kitAttack(b) dispatched in _bossThinkCore before the generic pick for isBoss&&si≥10 or isMini&&si∈{2,3,4,5,10–14}; kitPose → c3BossPose / stage5Pose / chapter2Pose. Damage = old generic scale (shot 9+3·si, hazard 16+6·si, mini ×.9, Pinnacle ×1.15); phases use the generic 50%/25% thresholds. Browser: all 67 moves fired incl. delayed parts, 0 errors. settleStoryBudget: wave-end orbs still pay instantly (story-budget test) but now spawn a copy that tweens into the player (owner saw EXP vanish). Owner phone review pending; Candlewick/arena mechanics T1–T8 still open.

# Previous delivery: v7.9.10 — Art orders 27 (journal Equipment/Forge) + 28 (book transition) wired

scripts/pack-art-orders-27-28.py: 27 → assets/art/journal (50%/frame, 401 KB, 6.2 MiB decoded, lazy with gear/craft via MENU_GROUPS + LAZY_MENU_ART_RE), 28 → assets/art/book (80%/frame, 985 KB, 22 MiB). TEMPLE_UI gets jr_/bk_ cells (tuFrames/tuImg). Journal: JR_REQ all loaded → this._jrSkin (reset in buildMenuScreen, set in buildGear/_buildCraftBenchRaw); helpers jrOn/jrPanel (kMax caps corner size)/jrImg/jrIcon/jrText/jrFit/jrButton (primary with socket icon, secondary, accent, icon, pill, pill2, pager)/jrHeader/jrInkPass (JR_INK maps the old light text colours to ink; _jrKeep = text on dark pieces). _screenBg → jr_page_bg + jrHeader; heroButton → jrButton; forgeChrome/forgeButton map keys (panel/panel_on/row_pick/chip/slot/summary/footer, Tier = accent, ‹ › = pager); every site keeps the purple fallback. Book: BOOK_KEYS, loadBook (ensureGroup; also started during the stage summary), bookTurn (6 frames 320ms + shadow .4 + spine + dust envelope, flipX for Back) in menuTransition when bookReady, else the order 26 curtain; bookCover on every showMenu (closed 150ms + glow → 5 frames; tap skips via _bookSkip in handleTap; 1.4s safety). Browser: cover, page turn, Equipment/Forge 360×800 OK; check-forge-live-ui 21 states + npm check pass. Phone visual/FPS review pending.

# Previous delivery: v7.9.9 — Box opening + boss talk loop (owner)

playBoxOpening(list,done) runs at the end of onStageClear before showStageEpilogue: this.over overlay (veil .96, setVisible(true) — children must NOT use camUI or they vanish), grid ≤15 boxes ('chest' tinted by FIELD_DROP_TABLE tier colour, better tiers last, '+N more'), each shakes then reveals gear_<id> art + name (openRunBoxes now returns id/ilv); legend = Sfx.legend + flash; full-screen _rollBtns tap = open all; Continue → done. Skipped in tutorial / no boxes. Boss lines: BOSS_LINES[stage] = [intro, defeat, mini, [boss loop×3], [mini loop×2]] rewritten short/simple. bossSay types 38ms/char, holds max(3300,1800+len·70)ms (defeat 1800); tickBossSay loops lines 6–9s after the previous one ends (b._sayAt/_sayI reset at both boss spawns). Browser smoke: boxes revealed + Continue, C1-3 boss intro → Sizzle → Feel the heat → Stove, 0 errors.

# Previous delivery: v7.9.8 — EXP never lost (owner) + art order 29

dropOrb: ≥300 active orbs → value merges into the nearest orb within 90px of the same budget (tint/scale by new value); pool full → gainXp in every mode (was Story only). Boss kill (killEnemy isBoss) sets _vac on all orbs; onBossDown collects any left (paid to story budget) and gainXp. Browser check: 500 drops → 300 orbs holding 500 EXP, 0 errors. Art order 29 `docs/art_orders/29_EXP_ORBS.md`: 'Flavor Drops' 6 tiers (shape + colour, not the Sugar candy), shadow, pickup/big pickup/trail/merge VFX, HUD icon — awaits art.

# Art delivery 27 + 28 — Journal UI / book transition (20 Oct)

Order27: 30 PNG32 /69 atlas frames (all A1–F2 rows; old summary33 corrected) in assets/incoming/journal_gear_ui/. Order28:7 PNG32 /26 frames (old summary30 corrected) in assets/incoming/book_transition/. Built-in ImageGen sources, manifest/prompts/technical+visual QA, offline page assemblies at360x800/412x915, slice/tint/text samples and both-direction page/cover GIFs included. Original mockup refs unchanged. **Wired in v7.9.10 (see that delivery block).** Journal recommended50% pack (~6.239MiB decode); book80% per frame (~22.061MiB decode, full source34.473MiB exceeds24MB). Never preload these at boot. Keep curtain fallback and original hit tags. Delivery_README and UPLOAD_VERIFICATION.json record details and byte proof.

# Previous delivery: v7.9.7 — Forge ECRS set 2 (owner: R1+R2+S2+E2)

forgeLayout portrait gets the slots row back (36/42/46px) and a shorter footer (64/66/70). R1 _buildCraftBenchRaw slot strip: 6 chips (equipped or first item art, count badge), tap = that slot's equipped item, tap the active slot again = next item in that slot (tags fslot_<slot>, forgeSelectItem). E2 summary name tap no longer opens the item-info panel (gear_info removed; ⇄ list kept). S2 footer: currency block and hint line removed; primary button label carries the count ('Roll · emoji N', 'Auto until ✓ (n) · …', 'Pick a result above · …' while a choice is pending). R2 locked item → primary button '🔓 Unlock to craft' (tag unlock) toggles the lock in place. Also fixed: Auto button passed icon so forgeButton drew only the icon — label now shown. check-forge-live-ui 21 states + npm check pass.

# Previous delivery: v7.9.6 — Forge ECRS set 1 (owner: C1+C2+E1+S1)

_buildCraftBenchRaw: C1 one primary button — ticked targets (forgeAdvOpen) → 'Auto until ✓ (n)' tag auto → autoRollToTarget, else 'Roll' tag roll; separate Auto/auto_locked button removed (Tier +1 kept, wider buttons). C2 implicit/current lines/choice options use modLine + MOD_TIER_COLOR by tierStars (implicit IMPLICIT_COLOR). E1 per-row i buttons (current_info_/info_) and Odds removed; pool rows show 'chance% · modDesc ✓' + tier label. S1 pool rows 34px (RH), header 'Tap mods you want · Auto rolls until one lands' when advanced, target zones only when forgeAdvOpen. modLine tolerates defs without fmt. Tests: forge-redesign (no odds/info, target → auto, pool_next optional, colour consts in ctx) + scripts/check-forge-live-ui.cjs (target → auto, no odds) — 21 states pass.

# Previous delivery: v7.9.5 — Plain one-line mods (owner picked A, list approved)

MOD_EFFECT {forge id | implicit id: template with {v}} for the 36 rollable mods + 18 implicits; modLine(d,v) = template with d.fmt(v) (fallback label + fmt for retired mods). drawModCompare uses modLine and drops the description row when a template exists (fit ✓ stays in the line). modDesc(d) returns the template without {v} (capitalised) so Forge shows the name + the same plain wording. Wording tweaks vs the approved list where fmt already carries the unit/sign: Slow Recovery '{v} regen' (fmt '+x HP/s'), Fresh Meal '{v} max HP healed on kill', Quick Preparation '{v} faster skill cooldown', Emergency/Dash Guard/Boss Padding 'damage reduction …'. Browser smoke 360×800 OK.

# Previous delivery: v7.9.4 — Equipment ECRS E2 + R2 (owner)

E2: Save.drainGearInbox() claims Inbox items while the bag has room; buildGear calls it first and toasts '📦 N items moved from Inbox to your bag'. R2: bag header = title/filter · Sets · count · (📦N only when Inbox has items) · ♻ (Salvage weaker; armed → ⚠ + banner with totals) · ⚡ (Equip Best), 36×26 heroButtons; the old 36px bag-action row is gone (bagY row removed, y+=34), old 's'/'m' drawActions removed. equipment-redesign test expects '⚡' / '♻'. Browser smoke 360×800: inbox 3 → 0 (bag 33/100), header icons, no page errors.

# Previous delivery: v7.9.3 — Equipment ECRS set 2 (owner: R1+C3+S2)

buildGear actions: R1 unequipped item row 1 = ⚔ Equip | ⚒ Enhance (SL.e; Save.enhance(uid) works on bag items; risk warning line shows for any selected item); equipped = full-width Enhance. C3 lock = small 🔒/🔓 chip at the card's bottom-right (zone flagged lockChip); row 2 = 🧪 Craft | right slot: equipped → 🔒 Locked/🔓 Lock toggle, locked bag item → '🔓 Unlock to salvage', else ♻ Salvage (starter → 'Starter items are protected'). S2 conf(ck,label)/arm(ck): confirm keys (sal:uid crafted salvage, salw bulk, enh:uid:lv) rebuild the screen with '⚠ Tap again to confirm' on the button instead of a banner. equipment-redesign test finds the lock via lockChip. Browser smoke 360×800 OK.

# Previous delivery: v7.9.2 — Equipment ECRS set 1 (owner: C1+C2+E1+S1, bag stays 2 rows)

buildGear: E1 portrait removed → top bar _pwBox full width (name Lv + ATK/DEF, no delta colouring now) + 6 slots in one row (ss ≤64). C1 this.gearFilter: slot tap toggles filter (gearSlot=slot, page 0, selection reset); bag shows only that slot, sorted equipped first then gearCompareScore desc; header 'Gloves ✕' clears. invRows fixed 2. C2 when selected is not equipped and an item is equipped: 2-column compare card (EQUIPPED | THIS ITEM · tap again to equip: art, name, gearBaseStatText one line scaled, tier · Lv · +enh) + ATK/DEF delta line (gearADDelta, green/red/yellow); equipped item keeps the old single card. S1: tapping the already-selected unequipped bag cell equips it. tests/equipment-portrait.test.cjs removed (tested the deleted portrait crop). Browser smoke 360×800: filter, compare, 0 scroll at 360×640–412×915, no page errors.

# Previous delivery: v7.9.1 (was v7.8.104; owner asked for the 7.9 line) — New version on first launch (owner)

Cause: sw.js shellFetch races network vs cache with SHELL_TIMEOUT 3.5s; game.js is 2.3MB so slow phones got the cached old version and only saw the update on the 2nd open. Fix: index.html fetches version.json (2.5s cap) before appending game.js; if version ≠ localStorage mochi_last_ver (written by game.js at load) → src += '&fresh=<v>' + GameLoader 'Updating to v…'. sw.js: version.json network-only (cache fallback), ?fresh= requests wait for the network and update the shell cache (fallback cache on error). Also scripts/set-android-version.mjs versionCode = major·1e6+minor·1e3+patch (old formula failed at patch 100 → APK build broke since v7.8.100). Browser check (localhost SW): first/stale/normal loads OK, 0 errors.

# Previous delivery: v7.8.103 — Cloud Play Stats + save mismatch check (owner)

Supabase game_saves got column stats jsonb (migration game_saves_add_stats). Cloud.queueStats() (3s debounce, after Stats.end and every sync) updates stats = last 150 runs; pull reads stats → Stats.merge (dedupe by t|hero|stage, sorted). Save.save stamps savedAt + lastDev (Tele.id). Cloud.base()/setBase(rev) in localStorage mochi_cloud_base {uid,rev} = rev last synced (set on push success / adopt). syncCloud: same rev → setBase · base known: cloud==base → push, local==base → adopt, else ASK · no base: fresh save → adopt, remote.lastDev missing or this device → newer wins (legacy), other device → ASK. ASK = Save._cloudConflict + Cloud.hold (push/queuePush skip) → buildMenuScreen shows buildCloudConflict (two summary cards: stages/rank/sugar/heroes/items/last saved; Keep This Device = rev max+1 & push, Use Cloud = adoptCloud: reset to SAVE_DEFAULTS + load). Browser smoke with mocked Cloud: conflict shown, Use Cloud adopts, local-newer pushes silently, stats merged, 0 errors.

# Previous delivery: v7.8.102 — Boss lines on screen (owner: camera panned away, line not seen)

bossSay(text,who,ms) is now a UI text box (camUI, W/2·H·0.70, name line + quoted line, depth 130) instead of a world bubble. bossIntro schedules the intro line at 1750ms (camera on the boss, during cinematic) and sets b._said; minis still via tickBossSay; defeat line via bossLine(1). Smoke C1-3: line visible during cinematic, mini + defeat OK, 0 errors. Run trait (owner: no notice in replay — single banner slot was overwritten): traitTxt HUD line under kills (pad+74, emoji+name, shown with HUD only while _runTrait) + banner delay 2.3→4.6s. Equipment no scroll (owner): buildGear estimates _top(ss)+_below(rows) → invRows 3→2 if short, then shrinks slot cells ss (min 40); item card 78→64; action rows pinned at _actTop=max(y+60,h−92−warn); drawModCompare(…,maxY) compacts (drops desc lines, then '+N more mods'). Measured with 40 items + 4-mod item: 360×740/800, 390×844, 412×915 = 0 scroll; 360×640 still 61px.

# Previous delivery: v7.8.101 — Boss voices + Reroll/Banish removed (owner)

BOSS_LINES[stage] = [intro, defeat, mini] (15 stages, English). storyVoice() = story only (no recipe/rush/rift/tutorial/pinnacle). bossSay(text,follow,x,y,ms) world text bubble (font 13/viewZoom, depth 9000, one at a time, follows target); tickBossSay() in update after the state check — this.boss._said (reset at both this.boss=b) → intro/mini line once play resumes after the cinematic. Boss kill (killEnemy isBoss) shows defeat line 2.3s and delays onBossDown 1600→2400. Removed level-up 🎲 Reroll/🚫 Banish buttons + banish tap mode + REROLL_MAX/BANISH_MAX/rerollLeft/banishLeft + Rank Perks Spare Cards/Cull (banishedKeys stays {} for pools). Load deletes rankPerks keys not in RANK_PERKS → RP refunded (also fixes v7.8.88 vigor/might/ironWill points that were never refunded). Browser smoke C1-3: mini/boss/defeat lines shown, level-up opens, 0 errors.

# Previous delivery: v7.8.100 — Lens: Interest Curve (replay events) + Surprise (run traits)

RUN_TRAITS (swift: enemy spd ×1.15 + xpMul ×1.25 · sugar: enemy hp ×1.15 + sugarFindMul ×1.35 · frenzy: cdMul ×0.87 + dmgTakenMul ×1.15 · lucky: mini wheel upChance +0.25). rollRunTrait() in launchStageLoadout begin() after startStage — story only, stageIndex ≥ 2, not tutorial/recipe/bossRush/pinnacle/rift; banner after 2.3s; player part re-applied in applyMeta reset block; enemy part in spawnEnemy before maxhp. Replay: _replayMeter.nextEv 60–90s → triggerRecipeEvent(true) (treasure/shrine/rare elite/merchant if relic slot free; shrine ticks via tickReplayProgress; shrine buff removal keyed to _artEpoch). Browser smoke: replay C1-3 rolled Frenzy (cdMul 0.835) + merchant event, no errors.

# Previous delivery: v7.8.99 — Menus stop scrolling (owner)

setupMenuScroll: _mScrollMax only when content bottom > H+2 (the +24 padding made every page that reached the last 24px scroll a little: settings/news/kitchen/stats/codex/bestiary 7–19px). Achievements portrait: gap 5 when >10 rows, rh min 38 (14 rows fit 360×780). Browser measure of 25 menu screens + Special Cores at 360×780 and 390×844: all 0 scroll.

# Previous delivery: v7.8.98 — Portrait only (owner)

index.html #rotate-lock overlay: touch device (pointer:coarse) with innerWidth>innerHeight → 'Please turn your phone upright' + __g.loop.sleep(); back to portrait → wake; also retries screen.orientation.lock('portrait'). Desktop (fine pointer) unaffected. Native APK/AAB already portrait via scripts/set-android-landscape.mjs (name is old; it sets portrait) and manifest.webmanifest orientation portrait. Landscape layout code in game.js left in place (unused on phones now). Browser check: 844×390 touch → overlay + loop stopped; rotate → resumes.

# Previous delivery: v7.8.97 — Rewards merged into the wheel (owner picked A, Relic 30%)

openPrizeWheel opts: prizes (custom pool, no tier upgrade), title, relic (adds 🔮 slot weight base·WHEEL_RELIC_CHANCE/(1−0.30) after Mimic, always shown), bonusText(tier) (line under result), double (after land: '✓ Take it' | '🎲 Double or Nothing' via _rollBtns, DoN → openDoubleOrNothing(p,done)); done now gets (tier, winner). Miniboss collectChest: grantMiniChestBonus(finalTier,true) (quiet) + offerRelic only when won.id==='relic' (no more 'Relic slots full' banner). openBossLootCards = gold wheel (sugar 5, currency 5, shovel 4, thread 5, gear 3, jackpot 2.4 weights; old 3-card + reroll gone). Browser smoke: boss wheel → 2 buttons → done; mini wheel with relic slot resolves.

# Previous delivery: v7.8.96 — Hybrid audience: later Forge depth + Special Cores

forgeAdvOpen() = stageMastery[4] || unlockedStage≥5 (no save/stageMastery → open, keeps tests) gates Forge 'Tier +1' (tag tier → 'tier_locked' + banner) and Auto (tag auto → 'auto_locked'); Roll unchanged. Temple Special Cores tab scOpen = rank≥1 (locked label + toast). check-forge-live-ui passes locally. Next: reward screens merge (owner wants to keep the wheel) — awaiting owner pick.

# Previous delivery: v7.8.95 — Equipment ECRS 4,5,7,8,11 (owner)

buildGear: Bazaar bar removed (setBot = gby-4) · inventory sorted GEAR_SLOTS order → equipped first → itemLevel desc → grade · set button label = set emoji + short name + n/pieces (gearSetCounts uses data.gear which equipGearInstance keeps in sync — 2/3 vs 0/5 were different sets) · bag row under Inventory header (bagY): '♻ Salvage weaker' | '⚡ Equip Best'; bottom = Equip/Enhance + Craft|Lock|Salvage · MOD_TIER_COLOR by tierStars (★1 white, ★2 green, ★3 blue, ★4 purple, ★5 orange) colours mod line + star in drawModCompare (Forge screen unchanged).

# Previous delivery: v7.8.94 — Equipment ECRS 1,2,3,6,9,10 (owner)

buildGear detail: one rarity label (tl.name, was 'Epic · Rare' with craftState) · drawModCompare implicit line drops IMPLICIT_TIER ('Common') · gearAffixName returns base name (all screens) · ★ Favorite button removed, load migrates favorite→locked (checks on .favorite kept) · SL: row1 Equip/Enhance, row2 Craft 28% | Lock 18% | '♻ Salvage +N🧶 +N🍬', row3 '♻ Salvage weaker' | '⚡ Equip Best' (true 2-row needs item 7: move bag actions to the Inventory header) · '📦 Inbox N' label (zone widened, count moved left). Pending owner: 4 (Bazaar bar), 5 (Set 2/3 vs set line), 7, 8 (sort), 11 (★1 stars).

# Previous delivery: v7.8.93 — ECRS E: dead code removed (~600 lines) + R10/R11/S12

Removed unreachable: old skill/passive/awaken card pool (rollUpgrades now 1 line) and old starting-skill picker (openStartingSkillChoice keeps the Basic Attack route) · Bear Beat Rush (beat*, BEAT_*) · legacy Taro castTaroBeacon/castTaroSmiteBasic/castTempestBasic/taroFireNeedle/taroNeedleVisual/taroTempestDash · old Forge/Gear actions (annul/scour/promote, rerollAffix, setAffixes, setGearRarity, sell/dismantleGearInstance, equipGearBase, bazaarGambleGear, _playAffixRoulette, slot*, chestSpin) · Recipe/Atlas leftovers (rollRecipeDrops, drawRecipeBar/Panel, migrateRiftToRecipes, makeRecipe, atlas* helpers, pact*) · Tag Sets data (TAG_SETS/UP_TAGS/TAGS_OF/TAG_TIERS/tagCounts/upTags/tagList) · misc dead methods/consts and both if(false) lines. Kept as test markers: gearStatText, rollOneAffixLocked, CRAFT_AFFIX_CAP, POWER_TUNING, POWER_BASE_HIT, taroRefreshRod, taroBeaconProfile; SKILLDEFS still feeds the loadout/Codex. tests/taro-smite + taro-tempest (not in npm check, covered only the removed legacy Taro code) deleted; validator contracts updated. R10: achievement 'hell' → 'Pinnacle Breaker' (pinnacleKills≥1, old diffBest≥3 still counts). R11: diffBest no longer written. S12: Codex row subtitle 'Weapons, Relics, Items and Sets'. Browser smoke boot + 5 hero stage starts: no page errors.

# Previous delivery: v7.8.92 — Performance pass (owner list, verified first)

Verified each claim in code. Done: _guardsNow() per-frame guard list (damage() stage 6–9 was iterating all enemies per hit) · _bigsNow() per-frame boss/mini list for priorityBossTarget · creamWave squared distances · tickEnemyPresentation caches anim/signature strings on this._presC (anims.exists still live — sheets load lazily) · burst() pools dots (_burstPool ≤140) · drawDashRing redraws only when charge/position changes · drawOverheadStatus draws once at local origin, moves og.setPosition, redraws/setText only when hp/max/lv/xp change · RENDER_DPR Auto = 1.5 (was 2; High still 3, Low 1.25). Checked and left: popDmg already pooled + throttled (2 tweens is fine); drawUniqueRing (side calls inside, risky); XP bar glint animates every frame by design; full spatial grid not done (120 enemy iterate sites — big refactor, ask owner).

# Previous delivery: v7.8.91 — ECRS S: text fixes

Relic card headline = [synergy, fusion, d.headline].filter(Boolean) (was 'undefined…' which _cardHeadline dropped). 'chill' → 'freeze briefly' on frost tag set, m_coldarc, t_core (Chill = Mint stacks only). Sesame mutations: fortress '+25% beam width', retaliate '+25% beam damage' (castMirrorBeam). Rocket Gauntlet desc/banner: extra blasts go to every gauntlet aimed at a Boss/Mini (code picks target, not on-hit). startReplayRun banner explains replay rules (no objectives, Elite 8×, mini half/boss full). condRelicCard kind 'Instinct'; mixed relic screens title '🔮 SPECIAL PICK'. c_streak text already fixed in v7.8.88.

# Previous delivery: v7.8.90 — ECRS R: onboarding order

Build Path card at Lv5 (rollBasicAttackUpgrades; Relic stays 6/12/18, Infusion 13). Hub need[] Activities 2→0 (Daily open from start). gearTut split: steps 0–1 (gacha+equip) after Stage 1 (gift Sugar only), steps 2–3 (Forge) wait for stageMastery[1] and give 3 Twist Cream once (d._craftTutGift), step 4 (Talent) waits for stageMastery[2]. Temple tab row: Rank Perks · Special Cores (new tab → _templeSpecial) · Depths; Kitchen moved to gActivity rows (locked text/toast until kitchenOpen), its back = gActivity. Perks page Special Cores banner kept.

# Previous delivery: v7.8.89 — Boss Rush hidden (owner)

gActivity row 'bossrush' removed (comment left) and router s==='bossrush' → buildHub. buildBossRush/run code kept; re-add the row to bring it back.

# Previous delivery: v7.8.88 — ECRS consolidation (stat layers, currencies, conditions, status, fusion, achievements, names)

Permanent HP/DMG = Weave + hero Talents only: RANK_PERKS vigor/might/ironWill removed (RP refund automatic, PERK_TIER_REQ {2:2,3:5}), Ancient deepRoots = +1 regen only; no Weave compensation (owner may want it — removed max was HP ×1.30, DMG +25%, taken ×0.88). Currencies: Shards → Thread 1:1 (addShards/spendShards alias threads, load migration, Enhance/salvage/UI 🧶, Bazaar sell-shards + boss Gear Shards card removed); Scrolls → Thread (SCROLL_THREADS 15, Ancient = ANCIENT_THREAD_COST 60, mini-prize scroll removed); Forge CURRENCY = transmute 'Twist Cream' (all lines, craftCurrencyForLine) + divine; CUR_ALIAS alt/chaos→transmute, forgeMigrate merges on v1 saves, drop pools 95/5…70/30. condRelicCard only c_dash, c_streak 'Kill Streak' (desc max +40% = real), c_close (c_low/c_still/c_full/c_boss cut as dupes; _cond.c_boss still used by Bossbreaker Gloves). applyBurn/applyFreeze helpers used by infusions, tag ignite/chill, recipe fire/ice/freeze, modFreeze, relic chill, cocoa quakestun/minty, misc; tickInfusion no longer needs an Infusion (burn from ignite sources was silently never ticking). Fusion: relic cards show '🧬 + Evolution → name', Evolution card lists fusion relics. QUESTS removed → 5 new ACHIEVEMENTS (stage2/3/4, gear3, legend), questClaimed migrated via QUEST_TO_ACH. Renames: relic glass → Cracked Crystal, p_titanfist → Titan Fist, p_secondwind → Blood Mend, uq_giant_gloves → Bossbreaker Gloves. Also removed dead craftRecipe/claimFreeRecipe/RECIPE_CRAFT.

# Previous delivery: v7.8.87 — ECRS out-of-run cleanup

Removed: Overcap (talTotal no longer adds it, Save.overcap gone, Temple star text), Core Stones (Save.coreStones/addCoreStone, Dig legend, dead digResolve branch; Depth Gift gives +STONE_THREADS Thread; boss loot Core Stone card dropped; load refund kept), Sugar Orders (SUGAR_ORDERS, Save.sugarOrder/buy/cancel/complete, Bazaar orders branch, _orderReward + summary row; load refund kept), Pact tab + buildPact, buildAtlasTreeOld, Delve header Points, old Atlas board code after buildAtlasMap, recipebag route + buildRecipes, buildZoneModifiers/rerollZoneMods (zoneModMul/zoneModsUnlocked stay neutral). advanceDaily = DailyQ.tick only (ensureDaily kept for login claim); _dailyRun clear bonus block removed. unlockCoreCharacters no longer returns early on FIGHTER_PLAYTEST_ALL → data.chars records unlocks, 'family' achievement completable (roster still open via the flag).

# Previous delivery: v7.8.86 — Delve depth = difficulty for loot (owner picked ข)

delveLoot(d) = {tier: d≥10 'legend' else 'epic', mul: min(3, 1+0.05·d)}; currencyTierFor returns it in Delve (recipeMode && _amapNode && !_pinnacleRun); grantCurrencyReward multiplies n by mul there. Delve node panel line shows 'Epic/Legend loot ×mul'. Story still always diff 1; Boss Rush keeps its own 1–3 choice (Hell = legend from 2 bosses — not changed, owner may want a cap).

# Previous delivery: v7.8.85 — ECRS E-batch: reroll/banish back, Kitchen signatures, dead card branches

openLevelUp: plain card screens (no chest/relic/path/infusion/mutation/evolution/tutorial) get 🎲 Reroll (rerollLeft = REROLL_MAX 3 + perk reroll) and 🚫 Banish (banishLeft = BANISH_MAX 2 + perk banish) buttons under the cards (lvlActionBtns, hit-tested first in pickCardAt); banish mode → tap a basic card → banishedKeys['b:'+key] (all pools already respect it) → reroll. FR_SIGNATURES with cut effects remapped: hurt+cleanse Candy Armor, lowHp+freeze Brain Freeze, unique+shots Double Helping, timer10+vacuum Slow Simmer. Removed 6 if(false&&…) branches (Dual Infusion, Fusion card, mod/trade injection) and the damage() infusion2 proc. Not removed (owner-approved off, harmless, tests reference them): TAG_SETS/TAGS_OF/UP_TAGS/tagCounts data, rollRarity (fixed common). ECRS report pending owner: Story difficulty forced to 1 (Hard/Hell only Boss Rush/Pinnacle), perf top items, C/R/S lists.

# Previous delivery: v7.8.84 — Equipment remove 1–4 / add 1–4 + Forge 1–4 (owner)

Forge: randomCraftSelected → forgeRollOptions(item,line,pool,3) → item.forgeChoice={line,options,old}; chooseForgeSustain(i) now any line (pending.line) · forgeKeepCurrent discards · choice panel 3 options + Keep · divineFocusedLine = tier +1 only (cap affixBestTierForItem, cost forgeGlazeCost = 11−t) · autoRollToTarget: 3 candidates per currency, miss = no replace, FORGE_PITY 20 forces target · forgeLayout slots/items rows null (picker removed; summary icon ⇄ opens all-slot item list, forgeSelectItem sets gearSlot). Equipment: IMPLICIT_POOL slots drop role dupes (i_hp armor, i_spd boots, i_cd amulet, i_crit/i_critdmg gloves) · Save.salvageGearInstance (shards+sugar) replaces Sell/Dismantle buttons · gearCompareScore (boots m = speed+dashCd diff) for arrows · gearEquipBest (gearPowerDelta per slot) · gearWorseItems + ♻ All ▼ (computed on tap, double-tap confirm) · bottom row thirds: Salvage | All ▼ | Equip Best · gacha bar → Bazaar button (_bazTab gamble, band cycle as card alt) · auto-salvage toggle already existed in Inbox · removed dead rerollGearAffix, gearEnhCost, craftLockFor, MOD_LINE_MAX, TIER_LOCK_COST, GACHA_COST, LEGEND_FORGE_COST, AFFIX_REROLL_COST. Kept: legacy AFFIX_POOL (old saves), 72 planned FORGE_CATALOG rows (catalog test), base item desc/apply (gearInstanceStats path).

# Previous delivery: v7.8.83 — Equipment phase 2: slot roles (owner approved table)

gearBaseStats: ATK only weapon (100%) + ring (35%); Armor only armor slot; role fields f=(iLv−1)/99, uq=quality·(1+.05·enh): gloves crit (1+4f)·uq % + critDmg (5+25f)·uq %, armor hp (5+55f)·quality·enhance (table said 10→160 but that gave Power +37% at iLv90; 5→60 replaces the lost boots/amulet Armor ≈ Power ±5%), boots speed (3+5f)·uq % + dashCd (2+6f)·uq %, amulet skillCd (2+6f)·uq % (cdMul). applyGearBaseStats applies them (maxhp, critChance, critMul, baseSpeed, dashCdMul, cdMul); gearBaseStatText shows them. Recommended Power unchanged.

# Previous delivery: v7.8.82 — Equipment phase 1 (owner: readable mods)

FORGE_ROLLABLE (36 numbers: power 1,2,3,4,6,7,10,11,12,49,57 · sustain 13,14,15,16,17,18,20,21,63,64,115 · play 29,31,32,33,41,42,45,48,97,100,117,118,122,139) gates FORGE_DEFS.enabled → forgePool/rollAffixes/craftAffixPoolForItem; existing affixes of other mods still apply. tierStars(mod,t)=5−floor(t·5/n) (T0–2 ★5 … T9–10 ★1) via tierStarText in forgeTierRange (Forge), craft results/roulette/banners, drawModCompare, compare list; Odds popup grouped by star. FORGE_MOD_TAGS + forgeModFits(mod) vs WEAPON_TAGS[hero] → green ✓ in drawModCompare and Forge pool. Phase 2 (slot roles table) awaits owner.

# Previous delivery: v7.8.81 — Equipment short-term fixes (owner: do the recommended 1–5)

enhanceOdds destroy=0 everywhere (failure = −1 level, floor +3; Save.enhance destroy branch now unreachable) · gearBaseStats enhance +8%→+12%/lv (+10 ×2.2) · gearSetCompareText uses gearSetPieces(id).length (was hard-coded /3) · gearPool: set weapons of earlier chapters stay in the weapon pool · buildGearLandscape removed (it showed GEAR base desc that applyScaledGear never applies) → landscape uses buildGear with 10 inventory columns (menu scroll handles height; equipment test adds 844×390) · buildGearClean/gearCleanCfg/gearCleanList + router case removed (unreachable since v7.8.67). craftState rarity turned out not to be shown anywhere (no change). Medium/long-term proposals (slot roles, 30–40 readable mods, build-changing uniques, fewer Forge currencies) await owner.

# Previous delivery: v7.8.80 — Split Spark falloff + secondary procs at 1/4

Owner: split sparks should get weaker each split. taroSwarmProfile split .55→.45 (card p_spark_split .75→.65) → gen1 45%/gen2 20% (card 65%/42%); sparkChild hits roll .7–1.3 instead of taroLightningRoll .2–1.8. Owner picked ข for procs: modOnHit runs for Taro terminal sources with chance ×.25 (Overcharge, Living Tempest, hitBoom/hitChain; recursion still blocked by _modTick + modBoom ≤8/.25s), Chill relic 10%→2.5% on terminal. Still gated: modOnKill, relic dashcharge, gearCritArc, _uqCritBurst, forge hit counters.

# Previous delivery: v7.8.79 — Storm Mark homing = Unique sparks only + on-hit cards from Taro secondary hits

Owner picked ก: mark homing (projectile tick mk0) and TARO_MARK_BONUS/big re-hit (taroProjectileHit marked) only for p.storm sparks; normal sparks fly as usual. On-hit audit: TARO_SOURCE_POLICY terminal sources (sparkChild, sentry, beacon, repeat, splash, shrapnel, nova, bomb) skipped every on-hit proc → Sentry got nothing from Infusions/HP on Hit, Spark only on gen-0 sparks (children = 73% dmg). Now damage() runs infusionOnHit (Sweet/Sour/Spicy/Minty) + _tagIgnite/_tagChill for terminal too; forgeDamage HP on Hit (mod 17, 0.5s cd) moved to direct||terminal. Still gated for terminal (by design, recursion/spam): modOnHit hitBoom/hitChain (Taro m_over Overcharge, f_tempest Living Tempest), modOnKill, relic dashcharge/chill, gearCritArc, _uqCritBurst, forge hit counters/23. Reported to owner.

# Previous delivery: v7.8.78 — Gear arrows + Spark Unique growth cap

buildGear cells: ▲/▼ at bottom-left for non-equipped items from gearADDelta (ATK+DEF sum; green/red, yellow/orange when ATK and DEF move opposite ways). castStormBeacon: smite path uses min(2, taroUniqueGrowth) (owner: Storm Mark took 200k of a 500k boss; sim Lv30 dmgMul 1.07: one cast = 1717 on boss vs 23 for 3s of normal attacks — growth ×4.48 × 18 homing storm sparks + mark ×1.5). Plasma/Overdrive keep full growth.

# Previous delivery: v7.8.77 — Spark basic attack fewer/slower (owner)

taroSwarmProfile smite: count = min(10, floor(rawRoots+1)) (was +3 → start 2, Lv4+ 3 instead of 4/5), excess threshold same shift, interval = max(.45, unitC×1.3) (was max(.35, unitC)). Damage per spark unchanged.

# Previous delivery: v7.8.76 — Invisible Sparks + Storm Mark count

taroProjectileVisual no longer gated by taroVisualBudget (transient-fx cap 20 shared with hit/bounce art made new projectiles fx=null → damage without visuals); projectile tick re-creates a missing/destroyed fx. Projectile sprites stay bounded by caps (80 normal + 72 storm sparks, 60 orbs). Storm Mark spark storm: 18 sparks one ring (quiet), still ×0.5.

# Previous delivery: v7.8.75 — Recommended Power on the new curves

stageThreat uses storyHp/storyDmg (mobs) and _bStoryC (boss HP) + boss dmg floor 1.5× tank. Recommended Power C1-1…C3-5: 130 160 190 240 290 350 440 540 660 820 1010 1230 1580 2030 2610 (was 130 150 200 240 320 420 600 690 830 1030 1140 1350 1580 1860 2200).

# Previous delivery: v7.8.74 — Spark Unique nerf (owner: too strong)

castTaroSparkStorm(dm,ul,quiet): when called from Storm Mark (quiet) hit/blast ×0.5 (qm). Mark strike/blast, +50% mark bonus, TARO_MARK_TIME 2 unchanged. Standalone Spark Storm fallback (no target on screen) stays full.

# Previous delivery: v7.8.73 — Card text audit fixes

Audited every hero card (BASIC_ATTACKS / BASIC_PATHS / MODIFIERS / FUSIONS / TARO_PROGRESSION). Fixed stale text: Spark Build desc (no boss curve), Sentry Build 'up to 3', Static Arc Reach 'Spark damage', smite arc renamed High Voltage (was Charged Current, too close to p_judge Charged Sparks), Mint p_quiver = +18% shard dmg (Barrage already at 2-lance cap). Reported to owner, not changed: shared icons inside a path (Cocoa titan/dashboxer/brawler cards, Mint barrage/pierce/glacier, Momo s_draw/s_seek/s_return, Mint rime+chill, Taro sentry overload/link use basic icons), Yuzu basic cards no icons, Momo Petal Spread under Sniper.

# Previous delivery: v7.8.72 — Spark normal attack not firing (owner)

taroSpawnProjectile: spark cap was 36 counting every spark incl. split children (1→4) and storm sparks, so casts returned null. Now normal sparks cap 80 (storm sparks counted separately, cap 72); a full pool makes a gen-0 cast retire the oldest (lowest left) normal sparks; children still refused at cap (parent keeps flying).

# Previous delivery: v7.8.71 — Arc 0.2s again + Weave max card layout

TARO_ARC_HOP_MS back to 200 (owner; loop-back hop stays). buildUpgrade: maxed cores use temple_core_card_max geometry (medallion 130·k, text 250·k, right 213·k) instead of the normal sheet's (111/205/263) — icon/text/button looked skewed.

# Previous delivery: v7.8.70 — 360×780 UI audit fixes

Audited every menu screen + HUD/level-up/pause/defeat at 360×780 (browser screenshots). Fixed: drawRosterHeader min scale q=max(p,.44) (candy icon covered Sugar) + fitted currency/title text · temple header frame sized to the fitted title (was 11px under Back/chip) · _rowBtn subtitle single line with ellipsis (2-line wrap covered titles in Settings) · Reward Inbox content y 64→96 portrait + real bag cap in empty text · Daily: 100-pt chest clamped inside panel, shared label y, quest counter after the bar · Dig miners label fitted before Hire · Bazaar duplicate Sugar line removed · Achievements summary/top lower · Boss Rush list on a dark panel, locked colour lighter · level-up hint shorter ('tap a card twice to pick') and lvlTitleArt keeps text off the ribbon caps (W-120). Not changed: Delve map black fog band (unexplored), pause HP number overflow only with absurd HP.

# Previous delivery: v7.8.69 — Taro tuning (owner)

TARO_OVER_TIME 4→3 · Sentry/Beacon orbs no longer steer to bosses (v7.8.41 seek/linger block removed; TARO_ORB_SEEK/TURN/LINGER now unused) · Spark: permanent boss seek (TARO_SPARK_SEEK branch) removed; Storm Mark TARO_MARK_TIME 6→2, target only on camera view, homing only while the mark is on view (±40px), castTaroStormMark also calls castTaroSparkStorm(dm,ul,quiet) so sparks appear · smite arc card = Charged Current: damage ×(1+.10·min(6,arc)), pierce left as is (sparks are not consumed) · TARO_ARC_HOP_MS 200→350; loop-back jumps (single target, also boss focus j>0) use taroArcLoopHop: bolt curves out ~90–130px and back, damage on return (0.45 hop) · Plasma end → taroMagField(x,y,max): t.mag 10s (TARO_MAG_TIME), damage() ×TARO_MAG_MUL 1.25 inside, graphics depth 4, ticked from taroTickPlasma. Fixture hashes updated. Owner phone check pending.

# Previous delivery: v7.8.68 — Art order 26 wired (card icons + menu curtain)

scripts/pack-art-order-26.py: 73 card icons 256→128 WebP in assets/art/card_icons/ (CARD_ICON_KEYS pushed to every STAGE_SHEETS = stage-lazy), relic_dashcharge/firstbite/harvest/trophy → assets/art/icons/ (boot like other relics), transition → assets/art/transition/ (boot: tr_curtain 540×960 opaque, tr_edge 80×960, tr_emblem 256, ASSET_FX vfx_tr_edge_sparkle 4×128×256 loop + vfx_tr_puff 3×2×128, lum alpha NORMAL). cardArtKey(o) in drawReadableChoiceCard maps Modifier m_→ic_mod_, Fusion f_→ic_fus_, Trade-off t_→ic_trade_, Flavor Infusion→ic_inf_, mutation→ic_mut_<hero>_<id>, evolution→ic_evo_<hero>, cocoa dashp/drum→ic_cocoa_ (missing texture = old icon; Yuzu has none by design). menuTransition: tileSprite curtain + edge (flipX backward) + 2 sparkles + emblem shrink/spin then puff, 340ms; old flat wipe stays as fallback. Boot GPU cocoa 298.5/300 MB — no room left for more boot art. Phone visual/FPS QA pending.

# Previous delivery: v7.8.67 — Equipment bag + hub polish (owner)

buildGear portrait: inventory = Save.gearItemsForSlot(null) (all slots, starters hidden), 5 cols × 3 rows per page (this.gearInvPage), square cells = art + 'Lv' tag top-right (NEW dot, equipped green border + ✓, +N enhance); tapping a cell sets gearSlot = item.slot so Equip/Enhance act on its slot. Clean/Sell/Scrap row and the slot-label button removed (Set button sits next to the Inventory title; Clean screen still exists but has no entry). drawModCompare = mod list (implicit + mods, tier, free slots) with modDesc() line (Forge description or MOD_DESC). Enhance: warning line when od.brk/destroy>0; destroy risk needs a 2nd tap (_gearConfirm 'enh:uid:lv'). Hub: only Play uses the _anim sprite, all icons share iconSz and hubIconFit (alpha bbox via hubIconBox) so visible content is equal; settings cog 44→36 (tap zone stays 44).

# Previous delivery: v7.8.66 — Boss/miniboss scaling (owner picked A+B+C+D)

Story only (Recipe/Delve keep old formula). A: boss HP = STAGES[0].bossHp·2·1.75/0.9 (3578) × _bStoryC[i], _bStoryC = storyHp×1.127^i = [1,1.45,2.11,3.07,4.47,6.49,9.44,13.73,19.96,29.02,42.18,61.33,96.76,152.67,240.88] (×1.454/stage, ×1.578 into C3-3..5; anchored C1-1 and C3-2 to old values) — replaces realStageBossMul jumps (C2-1 was ×2.16). C2 bosses now 23–44% softer, C3-3/4/5 +25/59/93% (C3-5 862k Normal). B: mini HP = 25% of the stage boss base. C: mini uses the boss _bossScale (Normal fixed, Hard/Hell bossHpMul·diff). D: dmg floor mini ≥1.2×, boss ≥1.5× Tank contact dmg (18·1.3·storyDmg·pg·diff). stageThreat/recommended Power still old formula. Owner phone check pending.

# Previous delivery: v7.8.64–65 — Monster scaling pass (owner)

v7.8.64 siege base HP 260→72. v7.8.65 (owner picked 1–3 + C3-3..5 steeper): spawnEnemy story HP curve storyHp=[1,1.29,1.664,2.147,2.769,3.572,4.608,5.945,7.669,9.893,12.761,16.462,23.047,32.266,45.172] (×1.29/stage, ×1.40 into C3-3..5) and dmg storyDmg=[1,1.082,…,2.38,2.689,3.038,3.433] (×1.082, ×1.13) replace stageCurveValue+BALANCE.c2* hp/dmg multipliers in story (Recipe keeps the old formula); C3 speed ×1.08 like C2-5 · siege dmg 24→18 (= tank), xp 10→5 · spawnElite hp = 120·s with the mob curve (1.5× tank), elite dmg on storyDmg. Note: C1-2…C2-5 mobs are 5–15% softer than before (old curve was uneven), C3-3…C3-5 harder (C3-5 basic 920→1211 HP). Tests/fixtures updated (batch9 fixture regenerated from real spawns). Owner phone check pending.

# Previous delivery: v7.8.61–63 — Arc 0.2s hops, Root Throne cleanup, Spark Storm rings, Sentry Overdrive

TARO_ARC_HOP_MS 200 (owner) and the pre-path starter castTaroNeedle (Static Arc = Taro normal attack before a Build) now hops too · hub Gear/Codex icons static (anim frames wobble). v7.8.63: elites on stages 6/7/9 use c22_bulwark / c23_wax_guard / c25_bark_guard art (was generic purple e_tank) · v7.8.64 siege base HP 260→72 (90% of tank 80) on every stage incl. C2-4 · C2-5 spawnWaveEnemy: siege → basic 60% and ≤2 live Root Choir · Spark Storm TARO_STORM_COUNT 36 fixed (2 rings) · Sentry: TARO_BL_SPEED 110→145, base orb radius 85→105 (cap 140), TARO_SENTRY_MAX 3 (taroPlaceNode cap + castTaroSentry), TARO_ORB_CAP 60 · castTaroOvercharge = Sentry Overdrive: fill to 3, 8-orb ring per sentry, t.overRing=5+n / t.overDmg, for TARO_OVER_TIME 4s every pulse fires a radial ring and pulses ×1.5, no detonation. Owner phone check pending.

# Previous delivery: v7.8.58–60 — Hero feedback, art orders 23–25 wired, stage stars, menu wipe

v7.8.58: Spark sparks no longer consumed on hit (live until timer; blast via taroOrbFade) · Spark Storm = 2 clockwise rings (st.step=4π/count) · Arc hops delayed TARO_ARC_HOP_MS 200 per jump (85 in v7.8.58; owner asked slower in v7.8.61) (target picks unchanged; immediate when no this.time) · Mint Barrage lance cap 2 (mintVolleyProfile) · frostLanceFinisher (dash end: nearest ≤160px, 1.4× hit, heal 30% dealt ≤8% max HP) · Glacier Bloom freeze adds 2 Frost Burn stacks ('FROSTBITE') · Cocoa Rocket Gauntlet life 6s, homeSpeed 640, homeRange 1400 (bullet homing now honours b.homeSpeed/homeRange) · Phantom Rush +1 leap per Dash since last cast (max 5, gap .3→.15) · queueLevelUp: LEVEL UP text then cards after LEVELUP_DELAY_MS 650.
v7.8.59: scripts/pack-ui-orders-23-25.py → assets/art/{levelup,pause,hub_motion}. UI pieces share TEMPLE_UI/tuPanel (Object.assign). Level-up/pause keys (PLAY_UI_KEYS) load with every stage (STAGE_SHEETS), not at boot. Hub layers are boot (bootKeep ^hub_(momo|fg|sky|window|cloud)_|^vfx_hub_); hub_ui_background now = hub_bg_far (no Momo; old image kept at assets/art/hub_reference/background.webp). buildHubScene: root container in 1080×1920 canvas units scaled to the bg cover; HUB_LAYERS [key,x,y,w,h,originX,originY,anchorX,anchorY]; puppet sway/bob/blink via hubTween/hubEvery (cleaned in stopHubMotion). Boot GPU now cocoa 295/300 MB — tight. drawReadableChoiceCard uses lvl_card_base+accent (tinted), lvlSocket, lvlPill, lvlBadge, glow/ribbon/shine/sparkle art; highlightCard → lvl_card_select; lvlTitleArt + vfx_lvl_open; lvlConfirmFx; drawHeldBar chips. buildPauseArt (portrait, art loaded) replaces buildPause layout; old layout = fallback. Relic "undefined" headline fixed.
v7.8.60: STAGE_STARS (clear · end ≥70% HP · never <30% HP via _minHpPct in update) · evalStageStars at start of onStageClear (story only, before the clear heal) → Save.data.stageStars[idx] bitmask, new stars pay (30+10·idx)·diff.reward Sugar · stars on stage cards + summary · menuTransition curtain wipe on screen change (no menu alpha — world grid would flash).
Owner phone review pending for all of the above.

# Previous delivery: v7.8.57 — Boss attack VFX C1–C2 (art order 22) wired

59 sheets packed by scripts/pack-boss-vfx-c1-c2.py (lum×1.35 alpha) → assets/art/boss_vfx/ · ASSET_FX vfx_bNN_* (warn/wave/crown_cage/bubble_cage carry fill:[w,h] bbox) · loaded per stage: loop after STAGE_SHEETS pushes vfx_bNN_* into STAGE_SHEETS[NN-1]. Helpers: bossKit(kind) → 'vfx_bNN_kind' for stageIndex 0–9 if texture loaded · kitSize(k,r) → outer ring width = 2r (height ≥55% of width) · kitLane(img,{key,h}) overlays a lane sprite on an existing vfx_line image (hides it, copies pos/rot/size/alpha each postupdate → timing unchanged) · bossSig(name,…) = heroFx must · bossSigHold (pause at frame 4). Hooked: spawnHazard warn+impact, bossNovaWave wave, chargeTelegraph lane (+C2-3 dive_trail), aim lines in ant rush/chili belt/behemoth reaper/hunger cleave/rootmother scythe, frost bar marks, chili furnace fire_cross, hunger oven cross, and all 19 signatures. Radius/timing/damage untouched; proj_foe untouched; every hook falls back to the old visuals. Phone visual/FPS review pending.

# Previous delivery: v7.8.56 — Seasonal Wisp HP and Spark miniboss tuning

Owner reports C2-4 purple fan-shot enemy survives longer than minibosses. Seasonal Wisp uses siege HP: stage 8 only 260→130 before existing stage/wave scaling; five-shot fan, guard aura and other roles/stages unchanged. Spark (smite) miniboss damage ×.85 once in taroDealDamage, including Static Charge/Storm Mark; bosses/mobs/elites/Arc/Sentry unchanged. Owner phone comparison pending. Automated targeted adapters plus npm check and build:www verify implementation; deployment must be verified separately.

# Previous delivery: v7.8.55 — C2-4 Seasonal Harvest (owner picked A, replaces Season Storm trials)

Same objective type 'seasonCycle' (renamed Seasonal Harvest) · o.storm.harvest[4], SEASON_PETALS 12 · objOnKill → seasonHarvest: non-boss kill = 1 petal (Elite 3) into the current season; full season → spill 50% into the emptiest season · passed[k] when full (icons ✓, full season = no hazard) · all 4 full → complete · stormEndSeason no-op in harvest · HUD 'emoji Season n/12 · next season Ns · k/4 full' · storm keeps ≥10 live foes. Browser sim: first clear C2-4 finished (harvest → hunt → boss → reward).

# Previous delivery: v7.8.54 — Spark Static Charge 10→40 hits

Owner: after v7.8.51 (hit size + homing) Spark hit bosses so often that Static Charge strikes melted them (meter v7.8.52 C2-3★1: Royal Stinger mini 5.0s at 5634 DPS vs Arc 14s, Sentry 49s). TARO_STATIC_HITS 10→40 (mul stays 13). Also Season Storm clarity (owner only learned seasons rotate after ~10 runs): HUD = current season trial + seconds left, or next untested trial + wait; intro banner explains rotation; failed-trial banner says it returns in 30s with the easier goal; HUD text no longer prefixed with objective name (overflowed at 360px).

# Previous delivery: v7.8.53 — C2-4 Season Storm always finishes

Owner: C2-4 stuck. Repro (browser sim, first clear): Season Storm wave — Spring passes, Summer/Autumn/Winter allow max 1 hit, a failed trial only returns 40s later with the same rule, and reserves run out so the field is empty → endless loop. stormRule(i,o): each failure of that season adds +1 allowed hit (Spring −3 kills, min 4); storyCanSpawn seasonNeedsFoes also keeps ≥6 live foes during the storm. Replay of C2-4 reached the boss fine in sim.

# Previous delivery: v7.8.52 — Taro Sentry vs bosses (owner picked A+B+C)

A: Shock cap on boss/mini TARO_SHOCK_MAX_BIG 15 (+75%), mobs stay 5 · B: taroDischarge — every TARO_DISCHARGE_HITS 25 orb zaps on the same boss/mini (Sentry or Beacon orbs) → strike ×TARO_DISCHARGE_MUL 10 zap dmg × shock, beacon_strike art · C: every Sentry orb bursts on fade dmg×(1+overload) radius×1.4 (was only with Overload card). Browser A/B (lv1 Sentry, 15s, boss + 16 mobs): boss dmg 2289→5463 (×2.4), mob 9764→13116 (+34%). Owner to re-run C2-1★1 benchmark.

# Previous delivery: v7.8.51 — Taro Spark hits more (owner picked A+B)

Owner: Spark hit few monsters. A: hit test = enemy body halfWidth (or 35% display width) + TARO_SPARK_HIT_R 10·scale (was 30% of width ≈12px) · B: sparks without boss/mark steering curve toward the nearest not-yet-hit enemy within TARO_SPARK_HOME_R 180 at TARO_SPARK_HOME_TURN 2.4 rad/s. Browser A/B (24 static mobs, 6 casts): 16.7 → 28.5 hits per cast. Meter text adds 'spark: N hits per cast'. If clear becomes too strong, owner may want Spark per-hit damage −10–15%.

# Previous delivery: v7.8.50 — Temple polish (owner: art looked washed out, page scrolled)

veil over screen_temple_* .5→.22 · altar glows NORMAL blend behind the trio (ADD over it washed the cores out) · altH = min(190, h-26-(150+8+36+3·(106+gap)+8+btnH)) so Weave fits without scrolling · Perks cardH/aH shrink by (h-hs-312)/3 so it fits too · rank line text stroked.

# Previous delivery: v7.8.49 — Temple Weave UI (art order 21) wired

34 pieces packed by scripts/pack-temple-weave-ui.py → assets/art/temple/ui/ (bg 720×1280, UI 50% of 2× source, MANIFEST with scaled nineSlice) · lazy with upgrade/perks group (art/temple/). TEMPLE_UI const = [cellW,cellH,cols,nineSlice]. Helpers: tuHas / tuFrames (cellN + c{cell}_{0..8} slice frames) / tuImg / tuPanel (own 9-slice from images, corners scale k=h/cellH, canvas-safe — no Phaser NineSlice) / tuTab / tuHeader / tuSparkle. _screenBg skins header (back, title frame, currency chip) when artKey starts screen_temple_. buildUpgrade: altar trio + per-core glow (portrait with room), tabs, power bar, core cards (portrait only; landscape keeps graphics), stars, buy buttons, knot, Weave Up. buildRankPerks: tier banners/line, req chip, perk cards/pips/buttons, Special Cores banner + compass, Ancient 2 columns (page scrolls), reset button. drawBadgeDot uses ui_notify_dot when loaded. All with old graphics fallback. Phone visual QA pending.

# Previous delivery: v7.8.48 — Replay = kills only

Owner: no timer skip on replays. tickReplayProgress: mini only at kills ≥ goal/2, boss only at kills ≥ goal (REPLAY_TIME_CAP removed). storyCanSpawn adds replayNeedsFoes (meter not done & mode wave) so spawns never run out after the 340 quota.

# Previous delivery: v7.8.47 — Fuller replays

Owner: replays (stage already cleared) had fewer kills than the first clear → lower level at the boss. REPLAY_GOAL 140→240 meter (0.75/kill → ~320 kills ≈ first-clear 5-wave quota 322), REPLAY_QUOTA spawn budget 240→340, REPLAY_TIME_CAP 300s (was RECIPE_HUNGER_CAP 180; mini fallback at half). Completion reward unchanged (200).

# Previous delivery: v7.8.46 — C8 Cocoa landing dust wired

Owner re-uploaded vfx_cocoa_landing_dust.png (282,702 bytes, sha matches QA). Packed to bpx_cocoa_landing_dust (6×256, once); cocoaLandingFx plays it (must, width max(160, r*2/.9)) and returns before the old crack/dust graphics (kept as fallback). Order 20 now 21/21 wired; phone visual/FPS QA pending.

# Previous delivery: v7.8.45 — Hero VFX gaps (art order 20) wired

20 of 21 sheets packed to assets/art/hero_vfx/ (scripts/pack-hero-vfx-gaps.py, bpx_<hero>_* lazy per hero + shared vfx_unique_crescendo). New helper heroFx(key,x,y,w,{h,rot,must,hold,life,follow,tint,alpha,ts}) — w = on-screen width, ground ovals fill ~90% of frame so size = radius*2/.9. Cocoa: titan_slam on every Titan pound (must, not only landed) + Colossus Rage 0 + Bear Grit Slam; slam_mark replaces cocoaMark graphics; rage_preview/rage_target (≤12 pooled) in tickTitanRage (titanRageArtOff cleans up); crater in titanRageImpact lv≥1; dash_buff follows player; dash_trail segments in cocoaTrailHit. Momo: seed_pop (momoSeedPop throttled 4/100ms) on pre-path + path hits + berrySplash; aim_line / aim_cone via snipeArt in tickSnipe; dash petals via heroDashFx (called from ancientEchoDash). Mint: chill_hit throttled, freeze holds frame 4 while e.frozen>0 (mintFreezeFx + heroFxTick in update), needle_hit, lance_charge, Frost Lance aim line, Bloom preview. Taro: rift_step in charPassiveOnDash, shrapnel in taroAfterDirect (fixture hashes updated). U1 in uniqueCrescendo. Every hook keeps the old code visual as fallback. C8 landing_dust source restored to the full 282,702 bytes matching QA (SHA-256 d321f8e96200b46be1c53ae96739e1416e1b4fc0e6d242dd7851e16eea329e86); runtime integration remains pending and code fallback stays at the owner's request.

# Previous delivery: v7.8.44 — Share Play Stats phase 1 (owner device only)

Settings → 📡 Share Play Stats (st.share, default off). Stats.end → Tele.enqueue(row) → localStorage queue mochi_tele_q (max 40) → Tele.flush POSTs batches of 10 to CLOUD_URL/rest/v1/run_stats with the anon key (also flushed on showMenu). Row: install_id (random, mochi_install_id), v, hero, path, mode, stage, diff, result, sec, data{level,kills,wave,cause,dmgTaken,kit,cards,mx,device}. Supabase project mochi-mayhem was paused (Cloud Save was down) → restored 2026-10-17. Table SQL in docs/telemetry/run_stats.sql (insert-only RLS, size checks); migration via MCP was cancelled — table NOT created yet, awaiting owner. Phase 2 (store): default-on with notice, compact rows, sampling, Privacy Policy + Data safety.

# Previous delivery: v7.8.43 — Combat Meter one-run completeness

Owner wants to play each hero once. Added: card picks with level/time and the cards passed over (mxPick in pickCardAt), casts per skill (castSkill caller), Unique ready-but-unused seconds, game-speed share, avg mob lifetime/HP (e._mxBorn in spawnEnemy), biggest hit taken + source, last-5s damage taken by source, end-of-run player stats, loot (sugar/boxes/currency), objective name per wave, device UA/screen in the copy header.

# Previous delivery: v7.8.42 — Deeper Combat Meter for the all-hero benchmark

Owner plans to play every hero on the same stage with the same gear. Added: per-wave rows (time, DPS, kills, taken) incl. a 'boss' segment, boss/mini damage by source (bsrc), boss phase2/3 timings per fight, biggest hit, survival (min HP%, seconds under 30%, healed via HP-delta in mxTick), movement px, standing-still %, active-attack % (seconds with damage), XP/min (gainXp hook). Stats.toText appends a BENCH CSV block (one row per metered run: hero, build, stage, result, sec, run/hero Lv, power, kills/min, avg/peak DPS, boss & mini sec/DPS, taken/min, min HP%, healed, uniques, unique share%, FPS).

# Previous delivery: v7.8.41 — Taro boss tuning from Combat Meter (owner approved)

From C2-1★1 meter data (Arc boss 14.4s / Spark 24.7s / Sentry 57s+, Uniques 0–3%): Sentry/Beacon orbs steer to boss/mini within 360 (2.6 rad/s), slow to ×0.3 when within 0.7·radius, per-orb hit gap on big targets 0.18s (TARO_ORB_SEEK/TURN/LINGER/BIG_GAP). Static Charge ×8 → ×13. castStormBeacon multiplies dm by taroUniqueGrowth() = 1+0.12·(run level−1) for Plasma / Overcharge / Storm Mark; Storm Mark strike/blast base ×2, Overcharge boom base ×4. Targets: Sentry boss ~20–25s, mini ~15s; Spark boss ~18s; Uniques ~10% share. Arc untouched (needs other-hero baseline). Owner to re-run the same 3 builds on C2-1★1 and paste Copy last 3 runs.

# Previous delivery: v7.8.40 — Meter fixes + first Taro numbers

Level log now per level from this run's first frame (was reusing previous run's level). Fight names cleaned. First data (C2-1★1, same gear): Arc 1:56 win, boss 55.6k in 14.4s (3878 DPS), mini 13.0s, 111 kills/min · Spark 2:43 win, boss 24.7s (2255), mini 13.9s, 67/min, sparkChild 87% of dmg · Sentry died 3:46, boss 57s (983, 5% left), mini 55.2s (256), 66/min. Uniques only 0–3% of damage on all three. Balance proposal in chat, awaiting owner.

# Previous delivery: v7.8.39 — Copy last 3 runs

Owner pasted all 33 runs; chat cut it off and all were pre-meter. Play Stats now has two buttons: Copy last 3 runs (Stats.copy(3) → toText(last)) and Copy all.

# CLAUDE.md — สมองของโปรเจกต์ (อ่านไฟล์นี้ก่อนเริ่มงานทุกครั้ง)

> ไฟล์นี้คือ "ความจำถาวร" ของโปรเจกต์ ถ้าเปิดเซสชันใหม่/เพิ่ง `/clear` มา
> อ่านไฟล์นี้ให้จบก่อน จะได้ทำงานต่อได้ทันทีโดยไม่ต้องให้เจ้าของเล่าซ้ำ
> **เมื่อจบงานแต่ละก้อน ให้ปรับ "สถานะปัจจุบัน" และ "ถัดไป" ในไฟล์นี้ให้ตรงเสมอ**


## 1. โปรเจกต์คืออะไร
เกมมือถือแนว **survival-like** (ศัตรูรุมเป็นฝูง + สกิลยิงเอง + เลเวลอัพ) ชื่อ **Mochi Mayhem**
- ธีม: น่ารัก โมจิ (ไม่ใช่แวมไพร์ — เจ้าของเปลี่ยนแล้ว)
- เป้าหมาย: ขึ้น **Google Play Store** เพื่อหารายได้
- เงื่อนไขสำคัญ: เจ้าของทำงาน **บนมือถือเท่านั้น** และ **ให้ AI เขียนโค้ดทั้งหมด**
  (เจ้าของเป็นผู้กำกับ/โปรดิวเซอร์ ไม่เขียนโค้ดเอง)

## 2. การตัดสินใจที่ล็อกแล้ว (อย่าเปลี่ยนโดยไม่ถาม)
- **เอนจิน:** Phaser 3 (เกมเว็บ/HTML5, TypeScript/JS) — เลือกเพราะทำบนมือถือล้วนได้
  (โค้ดอยู่บนคลาวด์ของ Claude, เจ้าของแค่เปิดลิงก์เทสในเบราว์เซอร์มือถือ)
- **เส้นทางขึ้นสโตร์:** เกมเว็บ → ห่อเป็นแอปด้วย **Capacitor** → build APK ผ่าน cloud → Play Store
- **หลักการทำงาน:** ออกแบบ/จูนระบบให้สนุกก่อน (กราฟิกกล่อง ๆ) → ทำ UX → **ลงกราฟิก AI เป็นขั้นสุดท้าย**
  (เพราะกราฟิกแพง/ช้าสุด ทำก่อนแล้วรื้อ = เสียของ)
- **🏆 กฎเหล็ก (กฎหลักของเกม):** **ยิ่งยาก รางวัลยิ่งดี** · (19 ต.ค. เจ้าของเลือก: Story เล่นระดับเดียว · ความยาก endgame = ความลึก Delve → สกุลเงินดีขึ้น `delveLoot`; Boss Rush ซ่อนไว้ก่อน v7.8.89) — ทุกระบบรางวัลใหม่ต้องเคารพกฎนี้ (`DIFFS[].reward`, `diffMul()`)
- **🎯 ผู้เล่นเป้าหมาย (19 ต.ค. เจ้าของเลือก ค):** แบบผสม — หน้าตาน่ารักเล่นง่ายช่วงต้น · ความลึกแบบสายบิลด์ (Forge/Kitchen/Delve/Special Cores) ค่อย ๆ เปิดหลัง Chapter 2–3 · ฟีเจอร์ใหม่ต้องไม่เพิ่มภาระช่วงต้นเกม
- **🔊 เสียง/เพลง = สร้างด้วยโค้ด (เจ้าของตัดสินใจ ก.ย. 2026):** เอฟเฟกต์ใช้ `scripts/gen_sfx_jsfxr.cjs` (jsfxr) · เพลงใช้ `scripts/gen_bgm_synth.cjs` + `scripts/encode_mp3.py` · ไม่ต้องรอไฟล์จากเว็บ/เจ้าของ (sandbox เข้า pixabay/kenney ไม่ได้)
- **สาขา git:** `claude/vampire-survival-mobile-game-yo9e8w` (ชื่อเก่าติดมาจากธีมแวมไพร์)

- **v4.47.0 (Production raster pickups):** เปลี่ยน Heal Mochi, Gear Gift, stage gimmick 6 ชิ้น และพื้น Training Ground จาก SVG เป็น PNG raster จริง · pickup 256×256 โปร่งใส · พื้น 512×512 ทึบ · release gate ตรวจขนาด/alpha/PNG stream/การผูก runtime และห้าม SVG กลับเข้ามาใน `ASSET_IMAGES`

## 3. โครงไฟล์
- `index.html` — หน้าเกม (โหลด phaser.min.js + game.js)
- `game.js` — โค้ดเกมทั้งหมด (คลาส Boot วาดกราฟิกด้วย **Canvas 2D** `createCanvas`, คลาส Game = ฉากเล่น)
- `phaser.min.js` — เอนจิน Phaser 3.80.1 (vendored, มาจาก npm)
- `assets/` — รูปจริง (AI/วาดมือ) โหลดแทนกราฟิกโค้ด · `ASSET_IMAGES`=รูปนิ่ง · `ASSET_SHEETS`=สไปรต์ตัวละคร (จตุรัส) · `ASSET_FX`=VFX flipbook (game.js)
  · **VFX flipbook (v1.9.0):** `ASSET_FX`={key:{url,fw,fh,frames,rate,anchor}} เฟรมไม่ต้องจตุรัส · Boot.preload โหลด spritesheet + Boot.create สร้าง anim (repeat0) · helper `spawnFxAnim(key,x,y,{rotation,scaleX,scaleY,scale,anchor,depth,alpha})` = sprite เล่นครั้งเดียว **additive blend** (พื้นดำหาย+เรืองแสง) ทำลายตัวเองตอน animationcomplete · anchor 'left'=ยิงจากตัวออกไป(origin 0,0.5) 'center'=ระเบิดกลาง · **มีแล้ว (v1.9.x, ทุกตัว 8เฟรม พื้นดำ ADD):** `fx_beam`(352×366 fireBeam sx=len/fw sy=0.42·wide/15 anchor left) · `fx_boom`(explodeAt จรวด/ระเบิด center) · `fx_frostnova`(frost skill center) · `fx_vortex`(cloud skill center) · `fx_slash`(whirl skill, center+offset ตามเล็ง — strip นี้มีกรอบขาวคั่นเฟรม ตัดด้วย flood-fill ลบขาวจากขอบเฟรม) · `fx_levelup`(61×64 vfxLevelUp center) · `fx_thunder`(61×64 zap สายฟ้า anchor bottom — strip มีแถบขาวคั่นเฟรม ลบด้วย "ลบแถว/คอลัมน์สว่างเต็มความกว้าง" เพราะบอลต์แตะขอบ flood-fill ไม่ได้) · `fx_heal`(collectHeal center) · `fx_wave`(creamWave/สกิล wave center)
  · **anchor:** 'left'(origin 0,0.5 ยิงออกขวา) · 'center'(0.5,0.5) · 'bottom'(0.5,1 ห้อยจากบนลงจุด เช่นสายฟ้า)
  · **กติกาอาร์ต VFX จาก AI:** ขอ **พื้นดำสนิท (solid black bg)** · strip อนิเมชัน = เฟรมเรียงเท่า ๆ กัน · grid VFX นิ่งตัดด้วย `scripts/cutout_vfx_grid.cjs` (flood-fill ลบเทา)
  · **⚠️ blend = NORMAL ไม่ใช่ ADD (v1.9.5):** ADD ระเบิดเป็นขาวบนพื้นสว่าง (พื้นด่าน1พาสเทล) → เปลี่ยน spawnFxAnim เป็น NORMAL (opt `add:true` ถ้าอยาก ADD) · sheet ต้อง **alpha ตามความสว่าง** (lum×1.35) + **saturation gate** (chroma<15 && lum<200 → โปร่ง) ลบกรอบเทา/พื้นเทาที่ platform ย่อภาพติดมา
  · **platform ย่อ strip ~3x สูง** (เฟรมโดนบีบแนวตั้ง) → resize สูง ×3 คืนสัดส่วนก่อนประมวลผล
  · **VFX เพิ่ม (v1.9.5, W×192):** fx_chilinova(chili) fx_mine(mine) fx_donutimpact(meteorStrike) fx_bossnova(boss nova) fx_bossportal/fx_bosssummon(boss summon) fx_enrage(boss phase2 aura loop) · projectile รูปจริง proj_rocket/fork/boomer(คีย์เขียว) · texture 'bubble'(กระสุน bubble ลอย)
  · **มีแล้ว:** char_momo_sheet.png (สไปรต์ 8 เฟรม 128px `CF`: [0 idle,1 blink,2 squash,3 stretch,4 cheer,5 hurt,6 ko,7 cast])
  · **อนิเมชันศัตรู/บอส (v1.9.x):** `ASSET_SHEETS[k].anim={frames,rate,yoyo?}` → Boot.create สร้าง anim `k+'_walk'` (repeat -1) · `e_dasher`(88px มดวิ่ง4เฟรม) `e_siege`(110px ปืนคัพเค้ก4เฟรม) `boss5`(160px เชฟขม idle 3เฟรม IDLE/HOVER/ACTIVE yoyo) · spawnEnemy/spawnFinalBoss เล่น `key+'_walk'` ถ้ามี (ไม่มี=หยุด anim+setFrame0 กัน pool ค้าง) · **frame=native size เดิม → setScale/setCircle เดิมใช้ได้ ไม่ต้องแก้** · ตัดจาก `assets/raw/*` ด้วย `scripts/cut_enemy_sheets.cjs`/`cut_boss5_sheet.cjs` (bbox alpha + fit เซลล์จตุรัส bottom-center) · **atlas ต้นฉบับพื้น transparent (alpha) ไม่ใช่ขาว** — detect ด้วย alpha>60
  · **`assets/raw/`** = โฟลเดอร์รับอาร์ตดิบจากเจ้าของ (อัปผ่าน GitHub มือถือ เพราะรูปใหญ่ในแชทไฟล์ไม่ถึงเครื่อง) → AI ตัดลง `assets/` ตัวจริง
  · Boot.preload โหลด image/spritesheet → mk() ข้ามการวาดโค้ดถ้ามีรูป (`isArtKey`) · `setCharScale()` ปรับ `_pBase`=60/frame + body radius 24 คงที่ (โชว์เท่ากราฟิกเดิม 60px) + ตั้ง `_hasFrames`
  · **อนิเมชันเฟรม (`updatePose`+`poseFlash`)**: ปกติ=ยืน+กะพริบ · พุ่ง=stretch · ลงพื้น=squash · โดนตี=hurt · เคลียร์เวฟ=cheer · ตาย=ko · กดอัลติ=cast — ทำงานทับเจลลี่สปริง (frame=ท่า, scale=ความเด้ง ไม่ตีกัน)
  · ตัด/เลือกเฟรมจากตาราง AI: `scripts/cutout_sheet.mjs SRC OUT CELL COLS ROWS "idx,idx,..."` (เลือก/เรียงช่องที่ต้องการ)
  · เพิ่มรูปใหม่: ตัดพื้นใส/ตัดสตริป (scripts/cutout.mjs, cutout_sheet.mjs) → assets/ → เติม key · build-www คัดลอก assets/ (ระดับบนสุด non-recursive) · pages.yml trigger รวม assets/**
  · **v1.5.0 ลงกราฟิกจริงเพิ่ม (จาก assets/assets/ ที่เจ้าของอัปโหลด · ย่อ+แฟลตเข้า assets/ ด้วย Chromium canvas):** พื้นหลัง `bg1..bg5` (768px, `bgTile` TileSprite depth -100002 alpha0.9 tileScale1.6, gridBg fillAlpha=0 เหลือแต่เส้น, สลับ texture ใน startStage) · `e_dasher`(44) `e_siege`(76) แทนการย้อมสี · มินิบอส `mb1..mb5`(140, spawnMiniBoss ใช้ถ้ามี isArt) · ไอเทม `chest`(48) `crate`(48) `vac`(34) แทนกราฟิกโค้ด (mk() ข้ามเองเพราะ isArtKey) · ต้นฉบับดิบอยู่ `assets/assets/**`
  · **VFX (v1.5.0):** `fx_chili/fx_frost/fx_hazard`(256) + `fx_donut`(96) · helper `fxBurst(key,x,y,radius,dur,spin)` (image ขยาย+จาง แบน oval) · เสียบใน chili/frost/spawnHazard/meteorStrike (มี fallback วงโค้ดถ้าโหลดไม่ได้)
  · **v1.6.0:** ตัวละครใหม่ `char_taro/char_sesame`(128, รูปนิ่ง `_hasFrames`=false → เจลลี่อย่างเดียว) เพิ่มใน CHARACTERS+CHAR_ORDER (taro=nova/spd, sesame=freeze/hp+dmg) · VFX อัลติ `fx_ult_bomb/fx_ult_vortex`(256) เสียบใน useActive bomb/blackhole · ไอคอน `ic_*`(64) map `SKILL_ICON`/`PASS_ICON` (มีบางตัว) helper `iconKey(k,isPass)` เสียบใน buildSkillBar+drawHeldBar+openLevelUp (fallback อีโมจิ) · boss5 = อาร์ตเชฟขมใหม่ · **build-www.mjs ข้ามโฟลเดอร์ย่อยตอน copy (กัน EISDIR จาก assets/assets/)**
  · **v1.6.3:** ปุ่มเมนูเป็น **แบนโมเดิร์น** (เลิกใช้อาร์ตลูกกวาด `ui_btn_*` แล้ว) · helper `uiPillBtn(cont,cx,cy,w,h,color,emoji,label,fn)` วาดด้วย graphics: เงา+ไล่เฉด(`_lighten/_darken`)+กลอสบน+ขอบสว่าง+ไอคอนวงกลมซ้าย+ข้อความขาว · buildHub 4 ปุ่ม(pink/toast/grape/mint) fit-to-band 0.40–0.90 มีช่องว่างเสมอ · buildPause 2 ปุ่ม (fn=null แล้ว push `_pauseBtns` เอง)
  · **ยังไม่ได้ใช้ (เหลือใน assets/assets/):** `ui_card_frame` (พาเนลตกแต่งหลายช่อง มีโบว์/สตรอว์เบอร์รีตายตัว → 9-slice ไม่ได้ ต้องอาร์ตกรอบเรียบ ๆ), ไอคอนสกิลที่เหลือ (12 สกิล+6พรยังใช้อีโมจิ), sprite sheet เวอร์ชันอนิเมชัน (_sheet), heroes_taro_sesame_sheet — ดู docs/ART_BIBLE.md
- `docs/ART_BIBLE.md` — คัมภีร์อาร์ต/ดีไซน์ละเอียด (lore/สี/ตัวละคร/ศัตรู/บอส/สกิล/UI/ไอคอน/แอนิเมชัน) สำหรับ AI ทำอาร์ต
- `docs/LORE.md` — เนื้อเรื่องโลก Mochitopia
- **`docs/art_orders/` — ใบสั่งอาร์ตจริงแทนของชั่วคราว (ใช้ตัวนี้เป็นหลัก):** README (ตารางชุดงาน+สถานะ, ที่วางไฟล์ `assets/incoming/<batch>/` → ฝั่งโค้ดย้ายไป `assets/art/<batch>/` + ใส่ ASSET_IMAGES, MANIFEST template, ขั้นตอนตรวจ) · 00 style guide · 01 พื้น seamless 10 ด่าน · 02 decor รายด่าน · 03 ศัตรู Ch3 · 04 มินิ/บอส Ch3 · 05 ขุด · 06 ไอคอน perk/relic (relic_ ต้องเพิ่ม hook) · 07 ไอคอน Kitchen `fr_t_/fr_e_/fr_m_` (ต้องเพิ่ม hook) · 08 Pinnacle · 09 เมนู (การ์ดด่าน `stage_card_sNN`, พื้นหลังหน้า `screen_*`, ปุ่ม Hub `hub_btn_*`, ไทล์ `tile_<target>` — ทั้งหมดต้องเพิ่ม hook) · โฟลเดอร์รอรับ `assets/incoming/<batch>/` + `assets/art/<batch>/` สร้างไว้ครบ 20 batch (.gitkeep)
- `docs/` — เอกสารดีไซน์/แผนทั้งหมด (ART_BIBLE, LORE, CHARACTER_BIBLE, BALANCE_PLAN, POE_ECONOMY_PLAN, PLAYTEST_CASES, ART_ORDER_*, PROJECT_SUMMARY_TH ฯลฯ)
- `CLAUDE.md` — ไฟล์นี้
- **`docs/HANDOFF_NEXT_AI.md` — งานค้าง + ข้อเสนอแนะจากมุมผู้เล่น (AI ตัวใหม่อ่านต่อจาก CLAUDE.md)**
- **Build APK (Capacitor):** `package.json` + `capacitor.config.json` (appId com.mochimayhem.game, webDir www)
  + `scripts/build-www.mjs` (ประกอบ www/) + `.github/workflows/android.yml` (build บน GitHub Actions → APK artifact,
  push tag `v*` = ออก Release). โฟลเดอร์ `android/`,`www/`,`node_modules/` สร้างตอน build ไม่ commit.
  **APK สำหรับทดสอบเป็น debug** — workflow `release-aab.yml` มี signed AAB (`bundleRelease`) แล้ว ใช้ keystore/secrets ตาม `docs/RELEASE_SIGNING.md`; การตั้งค่าจริงและ signed release ยังไม่ยืนยัน
- **Live update (แก้แล้วไม่ต้องลง APK ใหม่):** `.github/workflows/pages.yml` deploy www → **GitHub Pages**
  + `capacitor.config.json` `server.url` = https://hardza1230.github.io/Survival-like-Mobile-Game/
  ⇒ Debug APK โหลดจาก Pages หลัง deploy สำเร็จ; การเปลี่ยน native shell อาจต้องลง APK ใหม่ · Release AAB ลบ server.url และ bundle เกมในแอป ไม่ใช้ Pages live update · เว็บมี service worker cache จึงต้องตรวจเวอร์ชันจริง
  · ต้องเปิด Pages ครั้งแรก: Settings→Pages→Source: GitHub Actions
  · **หมายเหตุ:** เพราะ server.url ชี้ Pages → APK ตัวใหม่ต้อง build หลังตั้ง Pages (ตัว build แรกสุดยังเป็นออฟไลน์)


## 4. สถานะปัจจุบัน (v7.9.88 · 23 ต.ค. 2026)
- เวอร์ชันล่าสุดดูที่ `GAME_VERSION` ใน game.js และบล็อก Latest delivery ด้านบน
- ระบบหลักครบ: Story 3 Chapter (15 ด่าน) → Endgame Mochi Delve (แผนที่ seed ต่อความลึก, บอส Delve, Pinnacle), Boss Rush, Kitchen Recipe, Temple Weave/Depths/Rank Perks, Gear, Talent ราย Build Path, ตัวละคร 6 ตัว แต่ละตัว 3 Build Path
- ล่าสุด (v7.8.45–60): ดาวรายด่าน 3 ดวง + แอนิเมชันสลับหน้าเมนู (v7.8.60) · อาร์ตใบ 23–25 (Level Up / Pause / เมนูเคลื่อนไหว) ผูกแล้ว (v7.8.59) · ปรับ Spark/Arc/Mint/Cocoa ตามเจ้าของ + หน่วงการ์ดเลเวลอัพ (v7.8.58) · อาร์ตท่าบอส C1–C2 ใบ 22 ผูกครบ 59 ไฟล์ (v7.8.57) · อาร์ต Hero VFX ใบ 20 ครบ 21/21 · อาร์ตหน้า Temple ใบ 21 ครบ 34 ชิ้น · Replay ฆ่าครบ ~320 ตัวถึงเจอบอส (ไม่มีตัดเวลา) · Taro Spark ระยะโดน+เลี้ยวหา / Static Charge 40 ครั้ง / มินิบอส ×0.85 · Taro Sentry Shock 15 ชั้นบนบอส + Discharge + ระเบิดตอนหมดอายุ · C2-4 เปลี่ยนเป็น Seasonal Harvest (เก็บกลีบ 4 ฤดู) + Seasonal Wisp HP ครึ่ง
- **รอเจ้าของเล่นทดสอบบนมือถือ:** Spark/Sentry/Arc benchmark ที่ C2-1★1 (ของชุดเดียวกัน), C2-4 Harvest, หน้า Temple ใหม่, Hero VFX FPS
- **รอเจ้าของตัดสินใจ:** Yuzu ทำใหม่ทั้งหมด (เสนอชุด Orchard Swarm / Zest Battery ตีไกล / Citrus Knights) · ท่าบอส/กลไกสนาม (ดูข้อ 5) · Supabase ตาราง run_stats ยังไม่สร้าง (docs/telemetry/run_stats.sql)
- รายละเอียดทุกเวอร์ชันเก่า: `docs/CLAUDE_HISTORY.md`

### บั๊กที่เคยเจอ & วิธีแก้ (กันพลาดซ้ำ)
- **UI ขยาย 2–2.5 เท่า/เมนูหลุดขอบใน v2.3.1:** `Scale.RESIZE` คืน logical CSS px อยู่แล้ว แต่โค้ดยังคูณ game size และหาร `W/H` ด้วย DPR ตามวิธีเก่า → layout เหลือพื้นที่ครึ่งเดียวแล้วกล้องขยายซ้ำ · แก้ด้วย logical CSS size + `config.resolution` (ข้างบน)
- **ภาพเบลอบนมือถือ (high-DPI):** อย่าขยาย logical game size เอง ให้ใช้ `config.resolution=RENDER_DPR` เพื่อเพิ่ม backing resolution โดยไม่เปลี่ยน layout/input
- **scrollFactor(0) ไม่รับ camera zoom** → UI ที่ตั้ง sf0 จะเรนเดอร์ 1:1 (มุมซ้ายบน) เมื่อกล้อง zoom; ต้องใช้ sf1
- **`camera.ignore(group)` เป็น snapshot** → กลุ่ม (enemies/bullets/orbs) ว่างตอน setup เลยไม่กันสมาชิกที่เกิดทีหลัง
  → ศัตรูเกิดใหม่เรนเดอร์บน uiCam ด้วย = "ภาพซ้อนค้าง". แก้ด้วยเรียก `this.camWorld(obj)` ทุกครั้งที่ spawn (spawnEnemy/getBullet/dropOrb/มินิ/บอส/elite/nova)
- **Phaser `setInteractive()` กับ shape (rectangle) กดไม่ค่อยติดบนมือถือ** → ใช้ "แตะที่ไหนก็ได้" +
  ตรวจตำแหน่งแตะเอง (ดู `pickCardAt`, pointerdown handler) แทน
- **scale config ห้ามใส่ `width:'100%'`** → ทำให้พิกัดแตะเพี้ยน ใช้ `Scale.RESIZE` เฉย ๆ
- **dash แรงไป = หลุดจอ** → คุมความเร็ว (~560) + `dashTime` สั้น + กล้อง lerp 0.16
- **เกมเด้ง `Cannot read properties of null (reading 'body')` ตอนของล้นจอ/x3 (v1.9.2):** pool เต็ม (maxSize) → `getFirstDead(false)` คืน null และ `create()` เกิน cap ก็คืน null → บรรทัดถัดมาอ่าน `X.body` = crash · **ทุก getFirstDead-or-create ต้อง guard `if(!X)return` (drop items/spawnEnemy/foeShot ข้ามได้) หรือ recycle `getFirstAlive()` (bullet/mini/boss ที่ห้ามข้าม)** · x3 ทำ physics step ถี่ = ของตาย/เกิดถี่ = pool เต็มง่ายขึ้น
- **ปุ่มเร่งเวลา x2/x3 เร่งแค่โจมตี (v1.9.x):** Arcade `physics.world.timeScale` **กลับด้าน** (ค่ามาก=step ห่าง=ช้าลง) การเคลื่อนที่ทุกอย่างใช้ velocity=physics → `setGameSpeed` ตั้ง `=s` ทำให้ช้าลง (ส่วน time/tween/dt เร็วขึ้น = เร่งแค่ timer/โจมตี) → แก้เป็น **`=1/s`** · hitStop ก็กลับด้าน (0.05=เร็ว 20x ไม่ freeze) → ใช้ค่ามาก (12) = freeze จริง


## 5. ถัดไป
- **ใบสั่งอาร์ต 29:** ผูกครบแล้ว v7.9.26–27 (รวมเงา) · รอตรวจภาพ/FPS บนมือถือ
- **ใบสั่งอาร์ต 30:** ส่งครบ 48 ไฟล์และผูกแล้ว v7.9.29 · รอตรวจภาพ/FPS บนมือถือ
- **ใบ 18 J:** ไอคอน Storm Mark ผูกแล้ว v7.9.28 · รอดูบนมือถือ
- **ใบสั่งอาร์ต 31:** ส่งครบ 12 ไฟล์และผูกแล้ว v7.9.30 · รอตรวจภาพบนมือถือ
- **ใบสั่งอาร์ต 33 (22 ต.ค.) หน้า Lobby:** 26 ไฟล์ (`docs/art_orders/33_LOBBY_UI.md`, ref `ref/33_lobby_*.webp`, เจ้าของเลือกแนวอบอุ่นภาพที่ 2) · ส่งอาร์ตครบ 26/26 → `assets/incoming/lobby_ui/` (2.332 MiB, รอแพ็ก/ผูกโค้ด) · ใบ Yuzu เดิมที่วางเป็น 33 ใช้เลข 35
- **ใบสั่งอาร์ต 34 (22 ต.ค.) ฮีโร่ขยับใน Lobby + นิสัย:** 48 ชีต (`docs/art_orders/34_LOBBY_HERO_MOTION.md`: ตารางนิสัย 6 ตัว + idle/greet/act1–4/tap/poke ต่อตัว, 512×640/เฟรม เท้า y600) · ส่งครบ 48 และผูกแล้ว v7.9.58 ครบ 6 ตัว · รอ QA มือถือ/FPS
- **ใบสั่งอาร์ต 38 (23 ต.ค.) บทสอน:** ส่งครบ 13 ไฟล์ · ผูกครบแล้ว v7.9.68 · รอ QA มือถือ
- **ใบสั่งอาร์ต 39 (23 ต.ค.) เปิดหนังสือหลัง TAP TO START + ไอคอน Bazaar/Upgrade/Mail:** 9 ไฟล์ (`docs/art_orders/39_BOOK_OPENING_PLUS.md`) · ส่งครบ 9 ไฟล์ + ปกเรียบ · ผูกแล้ว v7.9.69 · รอ QA มือถือ · ใบ 37 ถูกยกเลิก (เลขว่าง)
- **ใบสั่งอาร์ต 40 (23 ต.ค.) หีบใน Bazaar + ไอคอน Thread:** 7 ไฟล์ · ส่งครบ 7 ไฟล์ · ผูกแล้ว v7.9.79 · รอ QA มือถือ
- **ใบสั่งอาร์ต 36 (23 ต.ค.) มาสคอต Ruby:** 5 หน้า (`docs/art_orders/36_RUBY_MASCOT.md`) · โค้ดพร้อม v7.9.60 ใช้ภาพวาดชั่วคราว · รออาร์ต
- **ใบสั่งอาร์ต 32 (21 ต.ค.):** ส่งครบ 51 ไฟล์ (E4 Ice Breaker คงภาพเดิม) · ผูกแล้ว v7.9.31 · รอตรวจภาพบนมือถือ
- **ท่าบอส (18 ต.ค. ตรวจโค้ดแล้ว):** บอสหลัก C1–C2 ทั้ง 10 ตัวมีชุดท่าเฉพาะตัวแล้ว · **v7.9.11 ครบแล้ว:** บอส C3 ทั้ง 5 + Pinnacle + มินิ C1-3/4/5, C2-1, C3 ทั้ง 5 มีท่าเฉพาะใน BOSS_KITS (C1-2 มินิใช้ชุดของบอส Drain) · Delve Warden/Candlewick มีท่าเฉพาะ · ระบบกลางกลไกสนาม + Counter Object (`docs/BOSS_ARENA_MECHANICS.md`) **ครบทุกบอส v7.9.13 (นำร่อง 3) + v7.9.15 (อีก 12 + Pinnacle)** · รอเจ้าของเล่นปรับจังหวะ · Candlewick ในแผน (เดินจุดเทียน) ขัดกับของจริง (เดินดับเทียน) ต้องให้เจ้าของเลือก
- **ใบสั่งอาร์ต 22 (18 ต.ค.):** เอฟเฟกต์ท่าบอส C1–C2 59 ไฟล์ — บอส C1–C2 มีท่าเฉพาะแล้วแต่ใช้ภาพกลาง (vfx_telegraph/fx_bossnova/vfx_cream_ring/vfx_line ย้อมสี) · ส่งอาร์ตครบ 59 PNG32 / 278 เฟรมที่ `assets/incoming/boss_vfx_c1_c2/` พร้อม manifest/prompts/QA · **ผูกแล้ว v7.8.57** (59/59: `assets/art/boss_vfx/`, `scripts/pack-boss-vfx-c1-c2.py`, helper `bossKit/kitSize/kitLane/bossSig/bossSigHold`) · รอ QA ภาพ/FPS บนมือถือ
- **ใบสั่งอาร์ต 23 (18 ต.ค.) — ผูกแล้ว v7.8.59, รอ QA มือถือ:** หน้าเลือกการ์ด/Level Up 19 ไฟล์ (`docs/art_orders/23_LEVELUP_CARD_UI.md`) — ตอนนี้วาดด้วยโค้ดล้วน · รออาร์ตส่ง `assets/incoming/levelup_cards_ui/` · โน้ตผูกโค้ดอยู่ท้ายใบสั่ง (`drawReadableChoiceCard`/`highlightCard`/`drawHeldBar`/`openLevelUp`)
- **ใบสั่งอาร์ต 24 (18 ต.ค.) — ผูกแล้ว v7.8.59, รอ QA มือถือ:** หน้าหยุดเกม 19 ไฟล์ ตามภาพอ้างอิงเจ้าของ (`docs/art_orders/24_PAUSE_SCREEN_UI.md`, ref `docs/art_orders/ref/24_pause_ref.webp`) · รออาร์ตส่ง `assets/incoming/pause_ui/` · ผูกที่ `buildPause`
- **ใบสั่งอาร์ต 25 (18 ต.ค.) — ผูกแล้ว v7.8.59, รอ QA มือถือ:** หน้าเมนูหลักเคลื่อนไหว 20 ไฟล์ + 5 ทางเลือก (`docs/art_orders/25_HUB_MENU_MOTION.md`) — แยก `hub_ui_background` เป็นชั้น + โมโม่หุ่นเชิด (pivot ใน MANIFEST) + VFX · ระวังงบบูต GPU (cocoa 285/300 MB) · รออาร์ตส่ง `assets/incoming/hub_motion/` · ผูกที่ `buildHub`/`startHubAmbience`
- **ใบสั่งอาร์ต 26 — ผูกแล้ว v7.8.68, รอ QA มือถือ:** ม่านสลับหน้าเมนู 5 + ไอคอนการ์ด 77 · `docs/art_orders/26_TRANSITION_AND_CARD_ICONS.md`
- **ค้างจากเซสชัน 18 ต.ค.:** ยังไม่ได้ตรวจ UI แนวนอน · การ์ด Weave ที่เต็มยังไม่ได้ถ่ายภาพยืนยัน · รอเจ้าของเลือกเรื่องการ์ด (ไอคอนซ้ำในสาย, Petal Spread ใต้ Sniper, ชื่อ Overload ซ้ำ, Sesame Extra Pane/Facet ซ้ำ)
- **Yuzu ทำใหม่ (21 ต.ค. เจ้าของเลือก):** แก่น Orchard Swarm + สาย Ripen / Yuzling Toss / Harvest Sprouts · `docs/YUZU_ORCHARD_SWARM.md` อนุมัติแล้ว · ขั้น 1 (แก่นฝูง) v7.9.37 · ขั้น 2 (3 สาย + Unique) v7.9.38 · ขั้น 3 (การ์ด/Mutation/Evolution/Unique Mutation, ออกจาก HEROES_WIP) v7.9.39 · ถัดไปขั้น 4 Talent 3 สาย + ขั้น 5 ใบสั่งอาร์ต 35
- **Sesame ทำใหม่ (21 ต.ค. เจ้าของเลือก):** แก่น Mirror Network (Dash วางกระจก, เส้นแสงเด้ง) + สาย Mirror Maze / Reflect / Phase Swap + Unique Glass World · `docs/SESAME_MIRROR_NETWORK.md` อนุมัติ (ตามแนะนำทุกข้อ) · ขั้น 1 (กระจก + เส้นแสงเด้ง) v7.9.40 · ถัดไปขั้น 2 สาย + Glass World
- รับ feedback หน้า Forge ใหม่ · Kitchen upkeep · Story C2–C3 · item mods · Delve
- งานค้างระยะยาว: มือถือ visual/FPS QA ของอาร์ตที่ส่งแล้ว (`docs/art_orders/16_CURRENT_ART_BACKLOG.md`), Play Store (พักไว้)
- **เจ้าของ: ไม่ต้องจำลองเล่น headless เพื่อจูนบาลานซ์ เจ้าของเทสเอง** (จำลองเพื่อหาบั๊กค้างได้)
- **เจ้าของ (18 ต.ค.): ไม่ต้องเปิดเกมถ่ายภาพหน้าจอตรวจ UI/อาร์ตเอง — เจ้าของตรวจบนมือถือเอง** (เพื่อความเร็ว) · ใช้ `npm run check` + อ่านโค้ดพอ · deploy ให้รอในเบื้องหลัง ไม่ต้องนั่งรอ

## 6. เอกสารออกแบบ (Artifacts — ความจำภาพ)
เอกสารเหล่านี้เผยแพร่เป็น artifact แล้ว (ถ้าต้องแก้ให้ publish ทับ URL เดิม):
- แผนรวม (stack + กราฟิก + รายได้ + Play Store)
- GDD/ระบบเกม + endgame + lore  ← ล่าสุด/สำคัญสุด
- Prototype เล่นได้ (mochi_play.html — ประกอบจาก phaser+game.js ในโฟลเดอร์ scratchpad ของเซสชัน)
- **ฐานเคส Playtest:** `docs/PLAYTEST_CASES.md` — รวม feedback/บั๊กจากเครื่องจริงด้าน balance, ศัตรู, skill/VFX/card, character, performance, state และ regression checklist
- **Playbook แนวนอน/Fullscreen:** `docs/LANDSCAPE_FULLSCREEN_UI_KNOWLEDGE.md` — รวมเคส v2.3.0–v2.3.1, สาเหตุ, วิธีแก้, layout รายหน้า และ checklist visual QA บนมือถือ

## 7. วิธีเทส / build
- เทสเร็ว: publish `game.js` รวมกับ phaser เป็น artifact HTML แล้วเปิดในเบราว์เซอร์มือถือ
  (ประกอบด้วย: head + `<script>`phaser.min.js`</script>` + `<script>`game.js`</script>`)
- เทสในเครื่อง: `npx serve .` แล้วเปิด index.html
- ตรวจโค้ด/asset contract ก่อน publish เสมอ: `npm run check`
- ทดสอบ flow, balance, touch controls, telegraph และ FPS บนมือถือจริงก่อนปล่อยเวอร์ชัน เพราะ automated validator ไม่แทน manual playtest

## 8. คอนเวนชัน
- **ทำงานสาขาเดียวเท่านั้น: `claude/vampire-survival-mobile-game-yo9e8w`** — commit บ่อย, push ด้วย `-u origin <branch>`
  · **⚠️ สำคัญ (v1.9.0):** GitHub Pages (live update) deploy ได้จาก **สาขานี้สาขาเดียว** เท่านั้น
    สาขาอื่น **deploy ล้มเหลวทุกครั้ง** (github-pages environment ไม่อนุญาต) → push ไปแล้วเกม live ไม่อัปเดต
  · ถ้าเซสชันถูกมอบหมายสาขาอื่นมา **ให้ย้ายมาทำบนสาขา vampire นี้เสมอ** (เจ้าของอนุมัติแล้ว "ทำขาเดียว")
    ไม่ต้อง mirror 2 สาขาอีกต่อไป
  · **รวมสาขาแล้ว (ล่าสุด):** เคยมีสาขาเซสชัน `claude/check-commit-version-i5326x` ที่มีของล่าสุด →
    รวมกลับเข้า vampire และลบทิ้งแล้ว เหลือ vampire สาขาเดียวเป็น source of truth
- **อย่าลืม bump `GAME_VERSION` + เพิ่ม `CHANGELOG` ใน game.js ทุกครั้งที่มีของใหม่** ไม่งั้นหน้าอัปเดตในเกมจะโชว์เวอร์ชันเดิม (เจ้าของดูเลขนี้เช็คว่าอัปเดตขึ้นไหม)
- commit message ภาษาอังกฤษ อธิบายชัด; อย่าใส่ชื่อรุ่นโมเดลในไฟล์/commit
- ภาษาที่คุยกับเจ้าของ: **ไทย**
- **🌐 ข้อความในเกม = ภาษาอังกฤษล้วน (v3.5.0):** เจ้าของเจาะตลาดโลก → **ทุก string ที่ผู้เล่นเห็นต้องเป็นอังกฤษ** (เมนู/การ์ด/แบนเนอร์/ชื่อศัตรู/บอส/story/CHANGELOG) · เขียนโค้ดใหม่ให้ข้อความ user-facing เป็นอังกฤษตั้งแต่แรก · **โค้ด comment เป็นไทยได้** (โน้ตพัฒนา ไม่ถึงผู้เล่น) · ใช้ typographic apostrophe `’` ในข้อความอังกฤษที่อยู่ใน single-quoted literal (กัน syntax พัง) · เช็ค: ไม่มี Thai char ใน quoted string (`node --check` + สแกน `[฀-๿]` ใน literal)


## อัปเดต v2.29.0 — Character Combat Profiles & Signature Weapons
- ตัวละครทั้ง 6 ตัวมี Combat Profile ใหม่ แยก HP, ATK, SPD, DEF, CRIT, CDR และบทบาท
- อาวุธประจำตัว: โมโม่=ปืนเมล็ดหัวใจ, มินต์=แกนลมเย็น, โกโก้=ถุงมือตราหมี, ตาโร่=เข็มทิศสายฟ้า, งาดำ=กระจกคำสัตย์, Berry Core=ปืนแกนแยม
- ผู้เล่นเริ่มด้วยอาวุธประจำตัวและเลือกอาวุธรอง 1 ชิ้น; อาวุธประจำตัวนับรวมในเพดานอาวุธ 4 ช่อง
- Weapon Mastery มีผลเฉพาะอาวุธประจำตัว และ resetStageLoadout() ต้องคืนอาวุธประจำตัวทุกด่าน

