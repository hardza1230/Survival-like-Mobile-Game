# Moved from CLAUDE.md sections 1, 2, 6–8 (31 Oct 2026, token trim 2)

# Previous delivery: v8.1.126 — owner: lead (signature) mission for every Chapter 2/3 stage

STAGES[5–14] gain `lead`: C2-1 defendNectar (added to its objectives; was Delve-only) · C2-2 cleanAir · C2-3 creepingRoots · C2-4 seasonCycle · C2-5 breakRoots · C3-1 seedRift · C3-2 shakeTrees · C3-3 mirrorPath · C3-4 vaultAltar · C3-5 lastLight. Existing lead logic (bag builder moves the lead to the end of the bag → first mission, once per run via `_leadUsed`). Test special-picks block.

# Previous delivery: v8.1.125 — owner: Frozen Pantry paint phase = short pause, whole map frozen, hero does not attack

fpOpen sets `S.global` (fpTimeStop ignores the dome radius → every non-boss enemy gets `_timeStop`, refreshed every 0.3 s) and `this._holdFire` (update skips the auto-cast skills loop; orbit contact still runs). Cleared in fpThaw, sigClear and startStage. Paint time `T` full 16→10 · light 22→12 (+1.2 s wave). damage() deliberately untouched (taro T5 hash fixture). Tests sig-missions (time-stop line now expects far enemies stopped too) + special-picks block.

# Previous delivery: v8.1.124 — owner: bosses should stop, stand still and use big attacks

`bossBigMove(b,dt)` (story/rush bosses with `isBoss`, not Delve bosses, not tutorial) runs first in `bossThink`: timer `_bigT` 14 s (phase 2: 11 · phase 3+: 9) → charge 1.4 s: `_bigHold` (enemy loop zeroes velocity for `this.boss`), red ring R 280 + inner fill growing, banner "⚠️ <boss> gathers power!", bossWarn → slam: hurtPlayer(max 15, dmg×0.9) if inside R, 2 bullet rings (18, phase 3: 24; bd = dmg×0.45) 240 ms apart, shockwaves, shake/flash → rest 1.1 s standing ("💫 Opening!") → release (atkCd ≤ .8). While active the normal kit is held (atkCd forced ≥ .6) but phase transitions still run. `this._bossEpoch` bumped and `_big/_bigHold/_bigT` reset where `this.boss=b` is assigned (2 spawn paths) so a pooled sprite never keeps a stale hold. Test `tests/boss-big-move.test.cjs`.

# Previous delivery: v8.1.123 — owner: Frozen Pantry paint smaller + watery; equipment slots readable (glow/gradient instead of frame)

`fpBlob`: 2 puddle images per step from one canvas texture `mm_puddle` (96², 5 overlapping soft radial blobs = amorphous), pastel tint, random rotation/stretch, 22–42 px, spread tween 0.25→1 over 0.65–0.95 s, ring-buffer max 320 (`S.pud`, `S.pi`), depth -98000 via sigAdd; fallback circles (no add.image, vm tests) smaller (14–30). fpTick paint phase wobbles ready puddles every 2nd frame (±6% scale). `gearRarityFx(item,x,y,w,h)` replaces `menuRarityFrame` in buildGear equipped row + inventory cells: bottom-up gradient (fillGradientStyle, rarity colour .42→0), soft radial glow `mm_rglow` tinted (Epic+ pulses, Legend+ two ✦ sparkles; tweens killed on destroy); icons smaller (slot .84→.66, cell .72→.62). Other menuRarityFrame uses (compare/forge panels) unchanged. C1-5 boss Maw of the Void `05_void_maw` 250 px α.6 → 150 px α.3 (phase 4: 210 px α.45); Eclipse (big move) unchanged. Tests special-picks (block), equipment-redesign ctx stubs.

# Previous delivery: v8.1.122 — owner bug: Lobby flicker / Preparing 0–2% loop / huge text after GPU out-of-memory · + special picks should feel like picking real things (Relic vault, Evolution forge) + art order 80

`openLevelUp`: relic pick (`_relicPick`, not chest, 1–3 opts, not tutorial) → `drawRelicVault(opts,startY,hint)`; single evolution option → `drawEvoForge(o,startY,hint)`; else the old cards. Both push `lvlCards` entries with `onFocus` (highlightCard calls it instead of the card glow; pickCardAt keeps their hint), so the tap-twice confirm, apply, Stats and SFX are unchanged. Vault: 3 columns, light beam + pedestal (code graphics, or `vault80_pedestal`), floating icon (`lvlObjIcon`: iconKey/key texture or emoji), glow, info panel (name/desc/headline), focus = icon ×1.35 + others dimmed; `vault80_bg` if loaded. Forge: anvil (code or `forge80_anvil`), floating `ic_path_<path>`, spark loop (stops when its card leaves lvlCards), focus = hotter sparks. Art order `docs/art_orders/80_SPECIAL_PICKS.md` (21 files: vault bg/pedestal, anvil, recipe book spread + page glow, 15 Build Path cards + back) — recipe book (Mutation) and Build Path card code come when the art arrives. Test `tests/special-picks.test.cjs`.

Memory bug (owner saw "Graphics memory ran out"): the context-lost handler (v6.91) reloads with `mochi_lowmem` set forever → budget 250 MB, but the Lobby alone needs ~430 MB (same in v8.1.115, measured headless) → `texBudget` evicted freshly loaded art, screens reloaded it → evict/reload loop (flicker, loader 0↔2%, DPR 1 = big text). Fixes: one-time clear of `mochi_lowmem` (`mochi_lowmem_reset122`); TEX_BUDGET_MB low 340 / normal 420 / ≥8 GB 520 (was 250/400/600); `texEvict` never evicts textures added in the last 20 s (`_texAddT` stamped by the `addtexture` listener in loopGuard); loopGuard no longer calls renderer.resetTextures and saves + reloads after >20 errors in 3 s; `buildLobby` frees `bk_*` book-opening art (~44 MB) 1.5 s after the lobby is up. Tests texture-safety + gpu-memory-budget updated.

# Previous delivery: v8.1.121 — owner: mission card too much text / too fast / cluttered; Mint Impaler Unique refund

`missionIntro` card = 3 lines: emoji+name, one line (armed: "Step on ✨ to begin"; desc if ≤48 chars, else `RUBY_TIPS[type].short` without brackets), 🎁 reward; holds 5.5 s (was 3.5 s) then shrinks into the HUD. Declutter: setupWaveObjective `rubyTip(type, 6200)` (650 in tutorial) and objBonusInit "⭐ Bonus" float at 6.6 s (was 1.9 s), so nothing overlaps the card. Mint Impaler (`releaseImpalerCharge`, path 'pierce'): each lance fired → `uniqueCd -= 0.5` (min 0). Escort Wisp `_wispTuning().escortR` 220 → 160 (owner). Test mission-template updated.

# Previous delivery: v8.1.120 — owner: survivor-genre readability extras (items 3, 6, 7, 8; item 4 low-HP vignette already existed in tickNearDeath)

`spawnRise(e,x,y)` (end of spawnEnemy): resets `_occ`; spawn inside camera worldView (non-boss) → alpha 0→1 300 ms, purple ground ring, `_spawnGrace` now+420 ms → `touchEnemy` returns. Occlusion fade in `drawFoeShadows`: enemy with depth above the player, |dx|<0.42×width, dy<0.7×height → alpha ×0.5 (`_occ/_occA`, restored when clear; shadow uses the original alpha). `drawPlayerLight()` (called from drawFoeShadows): canvas radial gradient `mm_player_light` 256², image 620×460 ADD at depth -99500, alpha .17 (.12 in Chapter 2.5D), only in play. EXP hop: `dropOrb` sets `o._hop` (14–36 px, 0.3 s, 22 px arc) — orb loop moves it and skips magnet/pickup until landed (vacuum cancels). Tests foe-shadow (extras block), sig-missions touchEnemy contract loosened.

# Previous delivery: v8.1.119 — owner: green grid under the first Lobby; remove the white outline around the hero

Green grid = `syncBgTile` floor pool drawn with the TileSprite `displayTexture` '__MISSING' (bgTile created with 'bg1', which is stage-lazy and not loaded at boot → Phaser missing-texture green boxes, visible under the Lobby). Now: displayTexture key missing / '__*' / not in TextureManager → hide bgTile + pool and return; pool images start as '__DEFAULT'. Hero outline: `tickPlayerReadability` no longer draws `_readPlayerEdge` (cream tint-fill copy ×1.055, alpha .48 from v8.0.35); destroys a leftover one; foot ring `cr_player_ring` kept. Tests arena-edges (missing-floor block + textures stub) and combat-readability (no edge, ring checks) updated.

# Previous delivery: v8.1.118 — owner: camera too far, monsters blend into the floor

`computeViewZoom` BASE 0.70 → 0.78 (~11% closer). `drawFoeShadows()` (called from drawShadows each frame, iso): one canvas radial-gradient texture `mm_soft_shadow` (128×48, created once) + image pool `_foeSh` at depth -99000 (camWorld; same texture/depth = one batch), per visible enemy: width 0.72×displayWidth (26–260), height ×0.34, at y+0.4×displayHeight, alpha follows the enemy (×1.25 in Chapter 2.5D); extra pool images hidden. Not Graphics ellipses (old Android WebView black-bar bug). Test `tests/foe-shadow.test.cjs`. Owner to check FPS + shadow placement on the phone. Open questions from the owner: Elite has no own art (reuses the stage monster scaled + crest) → art order on request; ink/brush outline style (Demon Slayer-like) → asked whether outline or shadow, art order for one hero as a sample.

# Previous delivery: v8.1.117 — owner bug: C1-1 clear → Lobby froze

Cause: placeholder (canvas) textures were removed with `textures.remove` while an object still showed them → WebGL `frame.source` null → 'glTexture' TypeError inside the render step kills Phaser's RAF loop (screen frozen). Reproduced headless (stage start before boot preload finished, `p_box` dropped by preloadAll). Fix: `texSafeRemove(k)` (used by preloadAll `drop`, ensureGroup `add`, ensureDeferred `add`) moves every object using k to `__DEFAULT`, removes, and restores the real texture + frame on the TextureManager `addtexture` event. Safety net `loopGuard()` (Game create) wraps `game.loop.callback`: an exception → `texHeal()` (objects with a missing texture/frame.source → `__DEFAULT`), console.error ×5 max, renderer.resetTextures, and the loop keeps running. Test `tests/texture-safety.test.cjs`.

# Previous delivery: v8.1.116 — owner (mission review steps 4+3) shared mission presentation + per-mission rewards; Ruby corner; boss speech over the head

`MISSION_REWARDS` (next to SIG_MISSIONS): fixed reward per mission type (currency key + count, or 'gear'); `missionReward(o)` adds +1 at stage 6+ and 11+ (gear = Rare+, Epic+ at 11+/endgame); `missionRewardGive(o)` drops it once at `missionPoint` (forgeQuantity forced 1) in completeWaveObjective (before cleanup) and the replay bounty. Template: `missionIntro(o,armed)` = camUI card (MISSION n/m · name · desc · Reward · "Step on ✨") that shrinks into the HUD bar after 3.5 s, replaces the beginWave banner + duplicate speech bubble (banner kept as fallback) and the replay bounty banner; `missionGo` = colour shockwave (loud on arm-pad trigger: sound+flash+GO); `missionStamp` = MISSION COMPLETE / BONUS CLEAR / BOUNTY COMPLETE stamp (scale 2.1→1 punch, sparkles, reward line) instead of the completion banner; arm pad shows the reward above it. Ruby (`rubyNext`): avatar 58px in the top-right corner (safe pad), bubble to her left with a tail, text area bw-26 (fixes overflow/overlap), raised by=pad+138. `bossSay(text,who,ms,src)`: callers pass the boss; world text 11px screen size (scaled by 1/camera zoom) centred above the head, quote only, follows the boss; no boss → old top-left tag. New test `tests/mission-template.test.cjs` (contracts + stub smoke). combat-hud UI check already failed before this release (not in the release list).

# Previous delivery: v8.1.115 — owner (mission review step 1): Grandma's Pot = PoE Ritual tribute shop, tied to the story

After the last course `gpTable` (replaces the old gpServe burst; gpServe kept unused): tribute = flavor + saved `Save.data.potFlavor`; `gpMenu` offers 4 dishes (deferred dish first, Sugar Bowl always, then random from Sugar Feast 10 / Berry Jam×2 9 / Recipe Ink 12 / Gear Box(rare) 13 / Epic Box 22 (full only) / Hunger Stone 30 (20%)) + a ✔ Done plate, in an arc around the pot; standing 0.5 s on a plate buys it (`gpBuy`: sugar loot burst / Save.addCurrency / _runBoxes / hungerStones). Ends on Done, 25 s, nothing affordable, or walking >520px away → `gpFinish`: half the leftover flavor saved (cap 30) + the priciest unaffordable dish deferred (`potDeferred`). Story: Grandma is frozen in the Sugar Frost Prison (C1-4) but her pot remembers her recipes → Pot only in pools after `stageMastery[3]` (c1FirstPool + replayBountyPool), one-time Ruby lines on the first pot (`potStory`) and first table (`potTableSeen`; no VO yet). Tests sig-missions Pot + Chapter 1 pacing updated.

# Previous delivery: v8.1.114 — owner (mission review step 2): lighter Chapter 1 first play

`C1_LATER_LEAGUE=['hungersMouth','grandmasPot','grandmasGolem']` + `c1FirstPool(pool)` applied in both wave-objective bag builders: on stages 0–4, when the stage is not yet mastered, Chapter 1 not cleared (`storyCleared()<5`) and not Delve/rift/Boss Rush/replay meter, those three are removed (lead then has nothing to promote). First play keeps Hunger Herald (C1-1 lead) and Frozen Pantry (C1-4, now `lead:'frozenPantry'`). Replay bounties and Delve unchanged. Mission review plan (owner agreed): 2 ✅ → 1 Pot as "choose a recipe" (distinct verb) → 4 shared start/end presentation template; 3 unique rewards + 5 per-mission play stats alongside. Test sig-missions gained a Chapter 1 pacing block.

# Previous delivery: v8.1.113 — owner: Frozen Pantry time-stop status, grey world, rainbow paint

New enemy flag `e._timeStop` (separate from `frozen`, so Mint shatter/brittle bonuses are untouched): enemy loop `if(e._timeStop){ setVelocity(0,0); return; }` after the frozen line, presentation pauses anims, `touchEnemy` returns (no contact damage); reset in spawnEnemy and on death; `fpTimeStop(S,on)` stops non-boss enemies within dome R+30 (grey tint 0xc9c9d2), re-applied every 0.3 s during paint, released in fpThaw and sigClear. Dome is now opaque white-grey (0xe9e9ef α.82, depth -98500); fpBlob paints rainbow pastel blobs (7-colour cycle along the path, α .42–.6) above it + twinkling ✦/✧ sparkles (≤40 alive, depth -97900). Test sig-missions gained a time-stop block.

# Previous delivery: v8.1.112 — owner: Frozen Pantry activation presentation (like PoE Legion)

fpOpen: jar shakes 0.3 s → flash/shake/bossWarn + big fp_shatter → two expanding ice shockwave rings (40→520px, 760/980 ms) + persistent "time stands still" dome (circle R520, pale blue, depth -98500, fades in) + banner "⏳ TIME STANDS STILL"; statues now rise (scale + 18px lift) when the wave reaches them (delay 380 ms + dist/0.68 px·ms⁻¹) instead of a fixed stagger; paint timer +1.2 s for the wave (bar clamped). fpThaw: bigger flash/shake, dome flashes white and shatters (scale 1.12, fade), second shockwave, banner "⏳ TIME RESUMES", the break-free banner 0.7 s later. Enemies outside are not frozen (would trigger Mint shatter bonuses). No reward/timing change beyond +1.2 s paint time.

# Previous delivery: v8.1.111 — owner: Frozen Pantry reworked like the PoE Legion monolith

fpSetup/fpBtnOver/fpBtnHit/fpOpen/fpBlob/fpThaw/fpWake/fpResolve/fpVanish/fpTick/fpOnKill. Near the jar (120px) a UI pill "🧊 Open the Jar" (camUI container, W/2,H-232; tap via pointerdown `fpBtnHit`, joystick ignores it via `joyBlocked→fpBtnOver`; vm/no-container fallback opens on approach). Open → frozen army in 3 (light) / 4 (full) clusters around the jar: 14 / 24 statues (full: last one = Frost General), every 4th 🎁; they pop up one by one (45 ms stagger, Back-ease scale + fp_shatter). Time frozen 22 s / 16 s (bar over the player): walking paints the ground with soft multi-colour blobs (Graphics depth -98000, ≤520 blobs, every 16px moved) + vfx78_statue_paint swirl following the player; a statue within 95px fills in .35 s (general .9 s) and turns pink. Timer end or all painted → `fpThaw`: all painted statues spawn at once (sigSpawnAt), unpainted shatter (loot lost, bonus fail); full: 25 s to beat them or they vanish. Chest kill = sugar (4+1.1·si)·(gen 2.5) loot burst. A12 lg_statue_wake moved to fpThaw. Tests sig-missions (Frozen block), vfx78-art (paint swirl), audio-a12 updated.

# Previous delivery: v8.1.110 — owner: lobby stage scene did not load (green grid); Depths music

Root cause: when the stage card is evicted/not loaded a canvas placeholder with the same key exists; lobbyPreload filtered with `textures.exists` (placeholder counted as loaded → never fetched) and buildLobby drew the placeholder (green grid). Both now use `realTex`; `_lobbyLoading` is a timestamp (retry after 8 s if a load stalls). menuMusic: Depths (`dig`) back on the main menu track (owner) — temple track now only Mochi Patrol.

# Previous delivery: v8.1.109 — owner: Patrol uses the Weave music; Weave back to the main menu music

menuMusic map: `{patrol:'bgm_menu_temple',dig:'bgm_menu_temple',kitchen:'bgm_menu_kitchen'}` (was upgrade/perks/dig → temple). Flavor Weave (`upgrade`) and Rank Perks (`perks`) now fall through to the main menu track like other lobby screens; Mochi Patrol plays tea_for_two_temple (A12 pt_ambient_loop still layered quietly).

# Previous delivery: v8.1.108 — wired A13 + A12 + order 79 (+ order 69 confirmed), delivered by the art/audio AI on asset-delivery/a13-a12-79-69

**A13** 31 Ruby VO → `assets/audio/acting/`, one `Object.assign(A07_CATALOG,…)` row block (core lore 3, mission tips 14, shorts 14; texts verified identical to RUBY_TIPS/CORE_LORE_LINES); `A13_PENDING` removed from tests/ruby-a09-voice (+A13 block), voice-acting catalog count 515. **A12** 36 SFX → `assets/audio/sfx/a12/`, `sfx_<key>` in ASSET_AUDIO (background-loaded like A11); new scene helper `a12(k,vol,gap)` (ui_* → Sfx.menuCue, else orderCue; returns false when the file is missing so old cues still play, e.g. gpRound `a12('lg_pot_ritual')||Sfx.bossWarn`); hooks per the A12 table in hm*/hd*/fp*/hh*/gp*/gg*/cr*/hs*/ult*/forgeUpgrade (line>0)/forgeMove/codexUpgrade/Domain button/patrolPop/buildPatrol; ui_memory_gain in Save.addKill (mem>0, gap 2 s); pt_ambient_loop via Sfx.eventLoopStart in buildPatrol, stopped in patrolStop. Test tests/audio-a12.test.cjs. **79** `scripts/pack-results79.py` → `assets/art/results79/` (6 WebP, 203 KB, rays luminance-alpha); sc79_* stage-lazy (artClass + stageArtKeys after bv46_key), core79_heart_seed menu-lazy (preloaded in openTutorialWeave); TEMPLE_UI sc79_header_plate 9-slice + sc79_star_socket 2 cells; hooks in summaryHeaderDeco (plate/rays/medallion back), showStageSummary (medallion frame over the masked hero, star sockets) and rubyGuide `opt.art` (Heart Seed above Ruby's box in the core-lore talk); every hook keeps the v8.1.100 code graphics as fallback. Test tests/results79-art.test.cjs. **69** all 62 hero files pass `qa-skin69.py --fix`; repack is byte-identical to what is live (Mint integrated 11 Nov) → docs only.

# Previous delivery: v8.1.107 — owner: lobby showed the backup picture after the book opened

buildLobby no longer falls back to `hub_ui_background` (owner: looked odd) — new `lobbyPreload()` (stage_card_sNN + hero card + roster, called from buildTitle and buildLobby) starts loading on the title screen; until it arrives the lobby uses a dark plain rect, and when it lands the lobby rebuilds (waits while `_bookCover` is up) with the stage scene fading in (`_lobbyBgIn`, 600 ms). Other lobby art still lazy (loadLobbyArt).

# Previous delivery: v8.1.106 — owner: Grandma's Pot reworked as a PoE-style Ritual

Owner: old pot (collect ingredients → deliver) felt empty → Ritual, only the reward drop differs. gpSetup/gpCard/gpDark/gpRound/gpOnKill/gpTick/gpServe (gpWanted/gpDrop removed): ring R210 around the pot, phase wait → player enters → courses (light 2 / full 3; foes 5|7 + 2·course spawned on the ring edge via sigSpawnAt, gold tint, full last course +1 elite) · outside the ring darkened (circle stroke 1400px at depth 90030, alpha .55) · spice hazard from course 2 (full: all) = 70px telegraph 1.1 s near the player, hurt 6+2.5·stage · kills inside R+40 add flavor (elite 4) · course ends when its foes are dead or 30 s · rest 2.5 s · serve: sugar (9+1.6·si)·(full 1.4)·(.6+.8·ratio), missionLootBurst bonus box when ratio ≥ .8. Tip/desc/quest-focus text updated (A13 lines too). gp_ingredients / gp_recipe_card art now unused. Test sig-missions Pot block rewritten.

# Previous delivery: v8.1.105 — owner: edge spawns, stuck pickups, spread missions, hero reveal

`inMapPt` now clamps to the map (was: off-map points teleported to a random spot ≤220px from map center → monsters popped mid-screen; Yuzu companions too). spawnEnemy without radOverride uses new `edgeSpawnPt(ang)` = camera worldView rectangle +42px along ang, clamped; if clamped into view, tries 11 other angles (mission/event spawns pass radOverride and are unchanged). Pickups: tickLootMagnet collects when |dx|+|dy|<30; orb loop collects when pulled and d<24 (overlap no longer required). objectivePosition: n>1 → minR×1.6, maxR×2.2, random base angle (single-point missions unchanged). `heroRevealed(id)` (global, near HERO_INTROS): hero listed in Heroes roster/codex/switch arrows only after its intro flag / mcSeen scene / stageMastery[idx] / selected. Tests: spawnEnemy extract lists gained edgeSpawnPt; hero-roster flags + reveal check.

# Previous delivery: v8.1.104 — Ruby mission tips for 14 signature/League missions + new orders A13 / 79

RUBY_TIPS gained say/short for all SIG_MISSIONS (seedRift…hungerDomain) → rubyTip at objective start now speaks for them (was silent; text only, voice pending). tests/ruby-a09-voice.test.cjs: `A13_PENDING` set exempts these 14 from the short-voice check until A13 is wired. New orders (art/audio AI wires them itself): `docs/audio_orders/A13_RUBY_LORE_MISSION_VOICE.md` (31 Ruby VO: core lore 3 + tips 14 + shorts 14) · `docs/art_orders/79_RESULTS_HEADER_CORE_LORE.md` (6: results header plate/medallion/back/rays/star socket + Heart Seed illustration for the core lore, hooks into summaryHeaderDeco / rubyGuide opt.art). Pending list for the other AI: `docs/PENDING_ART_AUDIO_ORDERS.md`.

# Previous delivery: v8.1.103 — owner: Flavor Cores tied to the story (Ruby explains)

Lore (STORY_CANON §2): Flavor Cores = 3 threads Grandma wove into the Heart Seed — Life Core (true form → HP), Flavor Spark (stolen flavor → DMG), Oath Shell (promise to protect → armor); Sugar = flavor taken back from monsters; feeding the cores makes the Seed hold every freed friend's form tighter (why one upgrade powers all heroes). Code: `CORE_LORE_LINES` (3 pages) shown via rubyGuide (target gLoadout) at the first step of the post-tutorial weave tour in applyGearTut (once per tour, `_coreLoreDone`; sets Save.data.coreLoreTaught; skipped with noRuby), then the old spotlight tour continues. Tutorial Complete hint text updated. Test tests/core-lore.test.cjs (added to npm run check). Owner: Overcharge ring removed for now — `OVERCHARGE_ON=false` makes overchargeOffer return false (code kept; set true to restore).

# Previous delivery: v8.1.102 — owner: book opening into the lobby

bookOpeningPlus: vfx_bk_magic ring moved from the emblem to the right clasp (kx,ky, 260·sc) · page riffle (rf) and burst (bs) layers removed (owner saw a full page flash) → when the 12-frame cover opening ends, op hides and finish() fades straight into the lobby; `BKP_KEYS` no longer loads bk_page_riffle/vfx_bk_burst; safety end at 6500 ms; lobby rise delay 1500 ms (was 2100). menuEnterAnim rise: 34 px (was 70), 900 ms Cubic.easeOut (was Back), alpha 700 ms, stagger 900 ms; items already tweening (idle heroes) now fade in instead of popping. Test tests/book-open-continuity.test.cjs rewritten.

# Previous delivery: v8.1.101 — owner: loot bomb hidden by the prize wheel (Spin)

Miniboss death: spawnChest('mini') delayed 2300 ms (0 in tutorial/Boss Rush; tier rolled at death; skipped if state menu/summary or `_lootTok` changed — exitStage bumps it) so the bigFoeLoot burst (1.9 s hold → vacuum) plays before the wheel can open. Boss: new `bossLootShow(x,y,_bossLoot)` in onBossDown = visual-only burst (8 sugar + up to 4 gift sprites scatter, hold, fly to player at 1.5 s; float text at 1.9 s; rewards already granted by bigFoeLoot, totals unchanged) → openBossLootCards at 2400 ms (was 700). Old 900 ms boss-loot float text removed. No reward change.

# Previous delivery: v8.1.100 — owner: speech tags, level-up card juice, Stage Clear header

bossSay → left-anchored tag at (8, pad+182) 13px, width min(230,.6W), slides in from the left, drops below Ruby's bubble when both show; rubyNext bubble → right-anchored top-right tag (bw=min(.66W,280), 46px avatar, 12–13px text, slides in from the right). Level-up cards: "Tap to choose" pill → `lvlCta` (CHOOSE › pill in the card's darkened color, pulse) · `lvlCardJuice` (icon pop+bob, shine sweep on non-special cards, 2 twinkling corner ✦, entrance flash; off with reducedMotion). Stage Clear: `summaryHeaderDeco` (gold-trimmed header panel, circular hero medallion with mask, rotating rays, divider, sparkles) + star sockets and a panel behind the stars row. Tests levelup75-art / stage-summary-layout stubs extended. No gameplay/reward change.

# Previous delivery: v8.1.99 — owner: Mint lance bloom off for level 1 + Barrage; book opening continuity

frostShatterBurst: noBloom = !basicAttack.path (before a build) || path==='barrage' → no mintBurstFx and no bloom AoE damage; shards unchanged (Glacier/Impaler keep the bloom). Barrage card p_bar_wide renamed Far Shards: shard life ×(1+.2·rank) instead of bloom radius (fixture tests/fixtures/cocoa-rework-baseline.json updated). bookOpeningPlus: page-riffle layer added below the opening cover (bk order plate,em,cl,rf,op,…), shown at 2150 ms, rests on frame 0 after the riffle (was hidden → blank gap). Test tests/book-open-continuity.test.cjs.

# Previous delivery: v8.1.98 — review fix: breach collapse effect restored

v8.1.96 (art order 76) rewrote the breach timer (total open time capped at lifeMax 20s via S.openLeft — kills extend life only up to the remaining cap) and dropped `artFx('hm_collapse')` when phase → 'close'; restored. The 20s cap is a gameplay change made by the art AI — owner confirmed 12 Nov: they ordered it (endless kill-extension meant the mission could never finish) — keep the cap.

# Previous delivery: v8.1.97 — Attack and defeat animations for six special enemies (art order 77)

Twelve reference-guided sheets share their opening frame with the existing idle art. The attack ends on that idle pose. The packed sheets use the same frame sizes as the active idle assets (6.71 MB WebP, 35.78 MB decoded across mission groups). Stage-lazy overlays play at the existing skill hooks or at close range, then return to idle. A successful death clip replaces the old death pose. Missing textures keep the original visuals. tests/motion77-art.test.cjs covers wiring, cooldowns, the return to idle, death deduplication and fallback.

# Previous delivery: v8.1.96 — Breach enemies, live rift edge and a fixed deadline (art order 76)

Eight sources packed into 128 px frames (419 KB WebP, 3.15 MB decoded). Breach and Domain use stage-lazy overlays, falling back to tinted stage enemies and their original defeat visuals. Hunger’s Mouth has a procedural violet floor tint and animated boundary, a 20-second open cap and a collapse of up to 0.85 seconds. Spawn rates, damage and reward formulas remain intact. tests/breach76-art.test.cjs exercises sustained kills, collapse, asset registration and fallbacks.

# Previous delivery: v8.1.95 — League mission and upgrade effects (art order 78)

Fifteen ImageGen sources and packed flipbooks (1.43 MB WebP, 26.97 MB decoded across all groups). Thirteen stage effects are loaded by mission, two menu effects by Forge or Bestiary. Frozen Pantry reuses a paint loop while a statue is being filled and removes it on wake, loss or mission cleanup. Prior effects remain active. tests/vfx78-art.test.cjs verifies hashes, routes, hooks and loop lifecycle.

# Previous delivery: v8.1.94 — distinct level-up cards (art order 75)

Eight ImageGen sources verified and packed by scripts/pack-levelup75.py (192 KB WebP, 5.22 MB decoded only during play). The Normal, Mutation, Relic and Unique templates share the existing 9-slice layout with a distinct crest. Special frame FX animate at 8 fps and stay still under reduced motion. The old card art and drawn panel are fallbacks. No changes to card selection or effects. tests/levelup75-art.test.cjs covers source integrity, stage-lazy assets, categories and fallbacks.

# Previous delivery: v8.1.93 — art orders 70–74 wired (63 files)

scripts/pack-missions71-74.py: MANIFEST sha check → WebP q88 (black bg → luminance alpha, frames ≥512 halved except hm_rim) → assets/art/{league72,missions71,trial74,league73,patrol70}/ + menu icons moved to assets/art/menu74/ (ic_memory renamed ic_memory_book: key already used). Index assets/art/missions71_74_index.json. Mission art = ASSET_FX, artClass 'stage' (prefix fp|hm|hh|gp|gg|hs|ult|msn71 / cr_root_), loaded per stage by missionArtKeys(idx) inside stageArtKeys (Delve adds hm/hs/ult). Menu art (menu74, patrol70) = ASSET_IMAGES/ASSET_SHEETS menu-lazy; menuGroupRe adds menu74 everywhere, patrol70 on patrol/gActivity/hub. Helpers: artSpr/sigArt (sprite or old emoji), artIsSpr, artFx (one-shot, NORMAL blend), artFollow/artFollowTick/artFollowClear (overlay on special enemies: herald, golem, warlord, hand lord, Breachlord, stalker captain; base enemy alpha .01, restored on clear). Patrol: patrolScene (sky crop + mid/ground tileSprite parallax), patrolFoe (pt_foes row anims), patrolPop, pt_loot, pt_dim. Delve map tk → amap_trial/amap_siege. Codex badge/memory icon on Bestiary Codex button. Test tests/missions71-74-art.test.cjs.

# Previous delivery: v8.1.92 — owner: Hunger Stone opens a special room (Hunger's Domain, PoE Breachstone style)

Delve node panel: when Save.data.hungerStones>0 (not home/boss/vault/shrine) a 🪨 Domain ×n button sits next to Start → _domainRequested → startRecipeRun spends 1 stone, _domainRun → room mission forced 'hungerDomain' (in SIG/LEAGUE_MISSIONS). hd* methods: flood 30s (breach foes around the player every .55s, 8% elite, 35% splinter each) → hdLord: clears remaining breach foes (phase 'clearing'), spawns Breachlord (elite ×2.2 size, hp ×10·(1+.05d); fallback spawnElite(true,true)) → skills: 12-shot ring 3.2s, hazard on player 4.5s, 2 elite hands 9s → hdDown: Sugar (40+6d)(1+.05si), 3 row-currency drops, +20 splinters, grantGear('legend'). Dying = stone already spent. Art: hm_breachlord added to order 72 (21 files).

# Previous delivery: v8.1.91 — owner: Breach like PoE (Hunger's Mouth rework) + art orders 72 (Breach revised) / 74 (Trial)

hm* rewritten: seek (✋ hand, touch ≤85px) → hmOpen (ring R grows 115/150 px/s to 820/1150, interior fill .18, 2/3 🤲 chests appear as the ring reaches them) → timer life 11/9s, max 20, kill inside +.35s (elite +1.5, lord +5) → breach foes (e._breach, tint 0xc59bff) spawn in packs inside the ring away from the player → drops 🔮 shards (30%, elite 3, lord 10; walk ≤90px) → hmSplinters: Save.data.splinters, every 100 → hungerStones++ (stone has no use yet — owner to decide) → close: ring shrinks 420px/s, breach foes outside it vanish → hmBurst loot by kills. Full: Hand of the Hunger at 40 kills (elite ×1.6, ×4hp). Art: order 72 group B now 8 files (hand/rim/chest/splinter/icons/lord/collapse, total 20); new order 74 Sugar Crown Trial + Delve room icons (replaces order 71 group D).

# Previous delivery: v8.1.90 — order 69 festival skins as in-game preview + automatic art QA (owner: ก + ค)

scripts/qa-skin69.py <hero> [--fix]: PASS/FAIL per candidate vs original (size, feet ±6, centre ±10, edge touch) · --fix auto-aligns frames into incoming/skins69/<hero>/aligned/. scripts/pack-skins69-heroes.py packs passing heroes → assets/art/skins69/<hero>/<key>.webp. Registered: card_/roster_<hero>__<tag> in ASSET_IMAGES (menu-lazy via LAZY_MENU_ART_RE art/skins69/) and 39 char_*__<tag> sheets in ASSET_SHEETS (hero class, runArtKeys loads only the worn tag; lazyArt treats key__tag as lazy so boot budget unchanged). Live: momo sakura, cocoa chef, taro star, yuzu summer, sesame moon (skinReady → buyable 1200 threads). Mint 4 sheets fail edge test → art side redraws those frames only (rule written at top of docs/SESSION_HANDOFF.md).

# Previous delivery: v8.1.89 — owner: Ruby lines carried over into the next stage

startStage bumps this._rubyEpoch, rubyHide(true) and clears _rubyQ. Delayed Ruby lines (rubyTip, rubyOnce → rubyLater(delay,fn); rubyVoiceReact delayed go) only run if the epoch still matches. rubyStoryAt keeps its own stageIndex check. If the owner meant something else carrying over (not Ruby), ask for a screenshot.

# Previous delivery: v8.1.88 — owner: remove bottom skill bar, Ruby talks less

drawBars: skillBar always setVisible(false) (buildSkillBar still builds chips for other code). rubyVoiceReact: 30s gap between reactions (was 8s) except clear/bossdown; objdone/wave/timer at most once per stage (this._rubyOnce reset in startStage).

# Previous delivery: v8.1.87 — League phase 7: Memory Book (Bestiary + Codex) + art order 73 · League plan complete

Memory Book = existing Bestiary + Memories/Codex (owner note "Bestiary → codex upgrade · keep soul"). Save.addKill: each tier crossed → data.memories += MEMORY_TIER [1,2,4]; Save._memory87 back-pays tiers already reached. Codex per monster (data.codex[id], CODEX_MAX 5, cost = lv+1 Memories, needs bestiaryLv ≥ BEST_MAX_TIER) via codexUpgrade(id); bestWeakMul = BEST_WEAK_MUL + codexLv·CODEX_STEP(.03) for weak-spot monsters (_bestW Set unchanged). UI: header shows 💭, detail panel button tag codex_up (close zone back=false so it can be tapped). Art order 73 (7 files: golem oven/parts/body, siege circle/warlord, ic_memory, codex badges). All 7 league phases done; waiting on art 72/73 and owner tuning.

# Previous delivery: v8.1.86 — League phase 4: Siege of the Hunger (Delve room, Legion 5 Way)

Delve node type 'siege' (d≥3, .165≤r<.205 after trial) → delveMission 'hungerSiege' (AMAP_TYPES siege 🏰). hs* methods: fixed circle R230 · 5 gates at R+300 · waves every 2.4s from 2/3/5 random gates (by progress 0/15/30s), 2+floor(d/8) foes each · progress = seconds inside (target 45) · outside: timer pauses + pot −1/s · kill while player inside → pot +1 (elite 3, Warlord 15) · 45% Hunger Warlord at 22s (elite ×1.6 size, ×4 hp) · end = hsBurst pot·(1+.05d)·(.8+.15si). In SIG_MISSIONS + LEAGUE_MISSIONS (spawn force + row-currency drop). Next: phase 7 Memory Book + art order 73.

# Previous delivery: v8.1.85 — League phase 6: Grandma's Golem (C1-5) + art order 72

grandmasGolem (Metamorph): gg* methods + GOLEM_PARTS (head 🍰 jam shots · arms 🥨 hazard slam · legs 🥖 speed ×1.4 · tail 🍭 2 helpers/7s · heart 💗 regen .8%/s). Collect: one elite carrier per part (e._ggPart, staggered spawn, respawn if lost) → kill drops part → walk over = take · oven ring 100: stand 2s with ≥min parts (light 3 parts/min 2 · full 5/min 3) = ggBake → golem = sigSpawnAt elite (e._golem, scale 1.5+.1n, hp ×(2|3)+.8n) with skills of baked parts → ggDown loot (8+2si)(1+.35n)(full ×1.4). C1-5 objectives ['grandmasGolem','hunt','capture','purge'] lead. Berry Jam / Star Sugar icons now reuse currency_wild_jam / currency_wish_candy. Art order 72 (15 files: league missions + Honey Drop/Recipe Ink icons) written. Next: phase 4 Siege (Delve), phase 7 Memory Book.

# Previous delivery: v8.1.84 — League phase 5: Reforge row currencies + Recipe Ink move (phase 4 Siege skipped for now by owner)

Owner picked: 4 currencies, move (source loses mod), drops from League + normal drops (not Bazaar). CURRENCY += berryjam 🍓 / honeydrop 🍯 / starsugar ⭐ / recipeink 🖋️ (no icon art yet → prize_currency + d.tint). forgeRowCur(line): 0 transmute · 1 berryjam · 2 honeydrop · 3–5 starsugar; forgeUpPrice = row 1 forgePrice, else 1+floor(crafts/6). Add/Remove = Twist Cream forgePrice (unchanged). _forgePay(item,key,price) / _forgeDone(...,key). Move: 🖋️ button per filled non-bad row (tag mv_i) → forgeOpenMove → panel type 'move' (drawForgeMovePanel: items with an empty open row whose forgePool takes the mod) → forgeMove (1 Ink, source row null, Lv clamped to target forgeStarCap). Drops: CURRENCY_DROP_POOLS rare/epic/legend gain row currencies (common/Bazaar box stay Twist Cream); leagueCurrencyDrop on every LEAGUE_MISSIONS completion (1, full 2, Herald +1). Save._reforge84 starter gift (4/2/1/1) for played saves. Test tests/reforge-rows.test.cjs. Next: phase 4 Siege (Delve) when owner wants, phase 6 Golem, phase 7 Memory Book + art (incl. 4 currency icons).

# Previous delivery: v8.1.83 — League phase 3: Hunger Herald (C1-1) + Grandma's Pot (C1-3)

LEAGUE_MISSIONS const (sigSpawnAt _sigForce + 70s replay bounty). hungerHerald (Harbinger): hh* · Herald = sigSpawnAt elite ×1.3 (full hp ×1.5), e._herald, wanders via e._goTo (new point every 2.6–4s, biased away from player) · 2/3 gates spawn packs of 3/4 every 3.4/2.6s · kill Herald (sigOnKill → hhDown) = gates close + loot incl. forge currency (no noCur) · despawned Herald respawns at gate 0. C1-1 is fully planned (CH1_EARLY_WAVE_PLAN) so Herald shows only as the first replay bounty (`lead` + this._bountyLead in replayBountyTick). grandmasPot (Ritual idea A): gp* · recipe 🍓🍋🍫 (light 3+3 · full 3+2+2, 50% +⭐ from elites) · kills drop ingredients (42% + pity 4, 75% wanted) · walk over = carry (🧺 above player) · pot ring 100 = deposit needed ones · spoil 16s/12s · trickle spawns when <6 foes within 520 · nothing for 12s → Grandma tosses one · done = gpServe loot (⭐ ×1.6). C1-3 objectives ['grandmasPot','hunt','capture','purge'] lead → wave 0. Next: phase 4 Siege of the Hunger (Delve room).

# Previous delivery: v8.1.82 — League phase 2: Hunger's Mouth (C1-2) + Creeping Roots (C2-3)

hungersMouth (Breach): hm* methods · ring shrinks (light 10px/s max 340 cap 40s · full 15px/s max 440 cap 55s, ×2.2 in last 20%) · kill while the player stands inside (enemy ≤ R+300, auto-aim kills far) → pot +1 (elite 3, Tongue 12), R +16/+44 · spawns on the ring edge · R≤40 or cap → hmBurst (missionLootBurst pot·(.7+si·.2), full ×1.3) · full: Tongue of the Hunger elite at 18s. Stage 2 objectives ['hungersMouth','hunt','capture','purge'] + `lead:'hungersMouth'` (both bag builders push st.lead last = first wave; _leadUsed reset per stage). creepingRoots (Blight, replaces defendNectar on C2-3): cr* methods · 2 lanes light / 3 + split at 18s full · lane = 5 waypoints drawn on S.laneG · foes spawned at root mother get e._lanePath/_goTo (enemy AI target override + not culled; cleared on kill/sigClear) · stand on root mother 2.2s = cut · flower 300hp (attackers ≤120px), heal near, wilt = timer −20% (no player HP loss) · all cut = early end + loot. sigSpawnAt sets this._sigForce for league types → storyCanSpawn allows up to maxLive. Next: phase 3 Hunger Herald (C1-1) + Grandma's Pot (C1-3).

# Previous delivery: v8.1.81 — League missions phase 1: Frozen Pantry (owner: PoE leagues adapted to lore)

Plan + owner decisions in `docs/design/OWNER_NOTES_POE_LEAGUES.md` (phases 1–7). frozenPantry in SIG_MISSIONS, fp* methods: walk to 🫙 jar (seek) → N statues ring the jar (not enemies, auto-aim ignores them) → painting ring around the player (PR 140) fills a statue in 1.8s (General 3s) → sigSpawnAt wakes it (e._fpTok, global this._fpSeq) → kill = progress, 🎁 statues drop missionLootBurst. fpFull() = replay (_replayMeter) / riftMode / storyCleared()>=10: 6 statues, woken foe must die in 14s (20s General) or fpVanish (silent remove, loot lost), unpainted statues shatter at 34s, 40% Frost General. Light (first play Ch1–2): 4 statues, no timers, no General. Stage C1-4 objectives ['survive','hunt','frozenPantry','capture']. Next: phase 2 Hunger's Mouth (C1-2) + Creeping Roots (C2-3).

# Previous delivery: v8.1.80 — Ultimatum-style Sugar Crown Trial (owner: B endgame + upgrade Vault Altar)

Mission type 'ultimatum' (in SIG_MISSIONS) via ult* methods on the _sig layer: each round pick 1 of 3 ULT_CURSES pads (swarm/elite/noheal/bombs/shots/drain, stacking, mult += v) → goal from ULT_GOALS (survive in gold circle 20s / slay 14+4r in 28s / defend altar 300hp 20s / collect 5 seeds 22s) → pot += base·(1+.5r)·mult, +1 box from round 2 → decide pads 8s: 🎁 take (default) / ⚔️ risk → clear all rounds = full pot + epic box; fail = half pot & half boxes (owner did not pick; recommendation used). Delve: node type 'trial' (d≥4, r<.165) → delveMission 'ultimatum' (4 rounds). Story stage 14 vaultAltar = same engine, 2 rounds (old pact code removed). No arm pad / Overcharge on trials. Loss penalty "half" can be switched to "all" in ultFinish.

# Previous delivery: v8.1.79 — missions round 3: old-mission upgrades + opt-in start + Overcharge

missionArm (story budget, not planned/forceType/tutorial/recipe/rift/rush, not survive/fill/hunt): ✨ pad 120–170px away; tickWaveObjective returns early (progress/bonus paused) until player steps in or 10s. overchargeOffer (from completeWaveObjective normal path, not survive/fill): ⚡ pad 5s → 12s run (2 foes/0.9s + 1 elite) → o._ocMul=2 (bonus ×2) + held gear box; ignored = normal completion; tickWaveObjective skipped while o._oc. Escort: wisp ×1.7 when player ≤110px; raid direction ⚠. Clean Air: cleanAirBubbles (≤3 on the path, +1.5s). Seasonal: seasonDropPetal/seasonPetalTick (petals are ground pickups, magnet 110px, 14s life) + seasonShrineTick (4 shrines, stand 1s = call season). Roots: pulse every 3s (need 1.3 instead of 2.6) + 3 guardians on first approach. Next: round 4 art orders (Ch3 signature props, pads, petals, bubbles, captain).

# Previous delivery: v8.0.90 — Yuzu companion forms, stronger Yuzu Uniques, effect-free cutscenes (owner)

Cutscenes: mcScene → mcPlain (MC_FX_RE /^(cs_fx_|vfx_)/ layers removed so they don't load, flash/pow/lines dropped, motes 0, sc.plain skips mcMotes) for every motion comic incl. boss 61 (crown shatter/flavor return gone). Yuzu forms: YUZU_FORMS names ×3 per companion, YUZU_FORM_KILLS [14,32] (y_fastripe/Ripen scale), yuzuForm (Pomelo = growth map [1,2,2,3]), yuzuFormKills from yuzuOnKill (Lime/Blood Orange), yuzuEvolveFx (banner/flash/ring/grow sound); yuzuPower ×(1+.2·(form-1)) for Lime/Blood Orange; sprite uses yz_<kind>_f<form> when present (art order 63) else base art scaled ×(1+.12·(form-1)); label = form name. Uniques: Pomelo land → hitStop + 2 aftershocks (350ms r×1.5 ×.6, 700ms r×2 ×.45); Lime 2 side arrows ±.16 rad (300%); Blood Orange last storm burst r230 ×2.4 + shake. Tests: new yuzu-forms-90. Art order 63 + audio order A06 written by helper (docs). Owner phone check pending.


# Previous delivery: v8.0.89 — 8 new build-targeted Relics (owner: more variety, some builds want them)

RELICS +8 (22 total) with for (card hint '👍 …') and paths (rollRelicChoices weight ×1.8 when basicAttack.path matches): heavydough (+30% dmg, cdMul×1.2), sugarrush (−15% dmg, cdMul×.8), frostcandy (+30% vs frozen/chill/Brittle), copperwhisk (+30% vs Tempest shock/Static Shock), longspoon (+25% >350px), crowdcrush (+25% <160px), twinbake (Unique +40% via _mxSrc 'unique', uniqueCdMul×.85), giantslayer (+25% elite/mini/boss, −10% others). Synergies Deadeye (heavydough+longspoon → +50%), Frenzy (sugarrush+crowdcrush → +50%), Deep Freeze (frostcandy+chill → +60%). Hook: damage() RL block → relicDmg89(e,RL); gain effects in gainRelic. No art yet (emoji fallback; relic_<key> icons can be ordered). Tests: new relics-89; damage hash in tests/fixtures/taro-t5-resolvers.json updated. Sesame not targeted. Owner phone check pending.


# Previous delivery: v8.0.88 — Taro Sentry: 1 sentry + Extra Sentry card, Reserve Cell = fire rate (owner)

taroSwarmProfile tempest: sentries=min(TARO_SENTRY_MAX 3, 1+rank surge+stormcaller 1+evolved 1); fire=1+.10·min(6,base.arc) → pulse=max(.3,unitC·.62/fire); nodeLife fixed 5 (was 5+arc·.35). castTaroSentry keeps f.sentries (Overdrive Unique still fills to 3 temporarily). TARO_PROGRESSION.tempest: arc 'Reserve Cell — Sentries fire 10% faster', surge 'Extra Sentry +1 sentry (max 3)', chainlord/stormcaller/evolution texts updated; path desc. Test: taro-swarm (1 sentry start, surge 2 → 3, fire/pulse). Owner phone check pending (balance feel at Lv1).


# Previous delivery: v8.0.87 — Forge random mods + bad mods, Lv text, 3 rarities above Legend (owner)

Forge (owner reversed parts of FORGE_SIMPLE.md): forgeAdd(line) pays then rolls forgeRollMod (FORGE_BAD_CHANCE .2 → FORGE_BAD_DEFS b_dull/b_frail/b_soft/b_shaky/b_slow_prep/b_sour_cure, negative bands through forgeApply numbers 1/13/14/3/57/63, def.effect text, bad:true; else pickWeightedMod) — no 1-of-3 picker (drawForgeOffer/forgeRollOffer gone, forgeOpenAdd = alias). forgePool ignores rows (any mod any row, duplicates stack). Bad mods: no upgrade ('Remove it with 🗑'), row '💀 BAD'. forgeRemove double-tap now pays forgePrice (not a craft, _forgeDone noCraft). tierStarText → 'Lv n'/'Bad', forgeStarCapText 'Max Lv n at iLv x · next at iLv y', row label 'MOD i · Lv a / cap'. Grades: GRADE_ORDER/gradeRank, RAR_LINES mythic 4/ancient 5/divine 6, GRADE_NEXT legend→mythic→ancient→divine (Merge only), TIER_LABEL colors, quality 1.6/1.8/2.0, BASE_TIER_OFFSET 0/-1/-1, dismantle base, protection gradeRank≥3, sort maps; forgeLineCount (3..6) in forgeLines, forgeLineOpen <6, Forge UI shows open rows + next locked row ('Needs X+') with rowH fitted; Merge carry → first free row (no bad mods); rarity frame/gem clamp + tint for new grades. Enhance tip: powerTips skips enh once d.enhDone (set in Save.enhance). Tutorial step 3: tap add_ = done. Tests rewritten: affix-sound, forge-150, forge-redesign (divine 6 rows on 7 screens, bad row), forge-simple, gear-level-limits, power-hub-layout hash, check-forge-live-ui. Owner phone check pending.


# Previous delivery: v8.0.86 — owner list: Depths gate/intro, 30-day login, Talent/Rank guides, short lines, Mint Glacier/Barrage

Depths: FEATURE_OPEN.dig=5 (storyCleared, = Chapter 1) + FEAT_TAG/ICON/LINE/NAME → featureReveal intro; Weave tile shows '🔒 After Chapter 1' + toast, Rank page Depths tab hidden, route 'dig' falls back to upgrade, m_dig quest req:4, dailySpec dig→kills while locked, dig badge gated. DIG_ANCIENT_FLOOR=15: digTable chest weight 0 below floor 15 (legend shows lock). Login: LOGIN_CAL = 7-day week ×4 + day 29 cur 6 + day 30 gold (big), LOGIN_DAYS; popup 6×5 grid sized to screen. talentsOpen() (sm[2] or unlockedStage≥3): Talents tab 🔒 + toast, buildHeroes falls back to roster, badge gated. rankTeach(): first visit to Weave with an unpicked Rank Reward → rubyGuide on 'weave_perks' (d.rankTaught). Text: HERO_INTROS, RUBY_TIPS say/short and RUBY_STORY rewritten to one short simple line. Mint: mintVolleyProfile glacier cap 1 (extra → bloomMul), barrage hitMul max(.4,1-.15·(raw-2)) on lance + shard dmg (descs + cocoa-rework-baseline fixture updated); Glacier Bloom draws no ground ring and no vfx_glacier_bloom when the snowstorm art shows (fallback keeps both). Fix: buildLobby stage-name wrap width ≥48 (landscape boot threw 'wordWrapWidth < a single character', which also blocked story art in landscape). Tests updated: daily-quests, login-calendar, mint-build-path, mint-evolutions. Owner phone check pending.


# Previous delivery: v8.0.85 — order 62 status effects wired + Forge double-header fix (owner screenshot)

scripts/pack-status-62.py → assets/art/status_fx/ (438 KB, 3.75 MiB decoded): 16 ASSET_FX 96px×6 (st_burn/chill/brittle/sour/stun/shock/mark loops, st_p_* hero loops, st_fx_apply/barrier_break/cleanse) + ASSET_SHEETS st_icons 64px 6×4 (ST62_ICON map). artClass st_ = stage; stageArtKeys pushes them for every stage. tickStatusArt: statusList62(e) priority stun(knock≥.4, not boss)>frozen>shock(Tempest _shock live or Static _arcShockT)>mark>sour>burn>brittle>chill>lured>enraged; 1 loop/enemy (ST62_LOOP, ≤24 total, chill at feet, Tempest with aura → no st_shock), ≤3 icons/enemy in the same row as Tremor/Frost Burn (shock icon hidden while the Tempest marker shows), st_fx_apply tinted (ST62_COL) when a status starts (≤6/frame). tickHeroStatus62: ≤2 loops (poison/bleed>slow>barrier>guard>haste), cleanse/barrier-break one-shots, HUD icon row after statTxt (shell/barrier text dropped when icons exist); bleed via _heroBleed/_heroBleedAt in captureBleed/escort. Stale objects after scene.restart rebuilt. Not done: old full-body poison/bleed tint kept, no starving/quakestun icon use. Forge fix: _screenBg(drawHeader=false) now returns before the standard title/sugar header (only Forge passes false). Tests: new status62-art; p1-feedback extracts statusList62; forge-simple header regression. Owner phone check pending (readability, FPS with many statuses).


# Previous delivery: v8.0.84 — order 61 boss defeat cutscenes wired (owner: ImageGen delivered all 35)

scripts/pack-boss-cutscene-61.py (MANIFEST bytes/sha) → assets/art/story/boss61/ 3.4 MB: Fall/Onward 540×960 q84, Freed 384×512 alpha, FX lum×1.35 alpha 256px frames (crown_shatter 8×256², flavor_return 8×256×512). Keys in ASSET_IMAGES/ASSET_FX = story-lazy 'menu' class, dropped after playing (drop regex cs_|cs61_|vfx_cs61_). bossCutscene61(idx) → bossMotionScene 3 shots (v61): Fall (+crown_shatter at CS61_CROWN via new layer opt bgPt/bgW, shake + pow), Freed (old cs_boss_NN_memory bg + freed rising + release line), Onward (chapter path + flavor_return + why/Next). mcShot: sh.fit='portrait' on landscape = whole portrait image at viewW (cover copy α.28 behind) so the crown is never cropped. Fallback: art fails to load → playMotionComic swaps to bossMotionScene(idx,true) (v8.0.73 2 shots) and remembers _mc61Off. Flow/rewards/seen/replay unchanged. Test: new boss-cutscene61-art. Owner phone check pending (timing ~8s, FPS, landscape).


# Previous delivery: v8.0.83 — Simple Forge (owner picked docs/FORGE_SIMPLE.md) + art order 62

Forge Points gone (FP_*, gearFP, fpStarCost, forgeAct, lucky). New actions: forgeOpenAdd(line) → 3 distinct weighted offers saved on item.forgeOffers[line] (no free reroll) → drawForgeOffer cards → forgeAdd(line,id) at ★1; forgeUpgrade(line) +1★ (cap reason forgeStarCapText 'Max ★n at iLv x · next ★ at iLv y'); forgeRemove(line) free double-tap. Price forgePrice=1+floor(crafts/2), Merge deletes crafts/forgeOffers. Glaze retired: CURRENCY = Twist Cream only, CUR_ALIAS divine→transmute, drops/Bazaar transmute only, save _glazeMig 1 Glaze→3 Twist Cream. forgeLineOpen = rarity only (Equipment free-slot count too). Page: Power theme (screen_gear_power_789, pwCard summary + pw_hero_forge, MOD ROWS add_/up_/cap_/rm_/merge_ tags, icons mod_add/star_up/mod_remove; ic_lucky/vfx_lucky no longer loaded). Tutorial step 3 = add_ → offer_. Tests: new forge-simple; rewrote affix-sound, forge-redesign, forge-150, gear-level-limits (rows/active legacy rows now rarity-based), gear-merge, menu-orders-art (retired lucky), check-forge-live-ui/build-forge-review. Art order 62 status effects (16 files, assets/incoming/status62/) written, waiting for art. Owner phone check pending.


# Previous delivery: v8.0.82 — Taro Arc loop cap (owner: Arc still too strong vs bosses)

TARO_ARC_LOOP_MAX 2: boss focus per root = min(victims, 3) hits (100% + 2×60%·Overload), normal loop-back onto the last target ≤2, pre-path Static Arc loops ≤2. Late Arc vs boss ≈ 3 roots × 2.2 = 6.6 hit-units (v8.0.79: 19.2). Mob chains unchanged (new targets still jump up to victims). Tests: taro-chain (3 hits), taro-needle-arc (3), taro-feedback strip. Owner phone check pending.


# Previous delivery: v8.0.81 — Merge in the Power theme (owner)

buildMerge restyled in place (logic/tags unchanged): bg screen_gear_power_789; intro = pwCard summary with rarity_up icon + pw_hero_merge α.3; item cards/material cells 0x261e30; RESULT card 0x423039 with rarity border; keep-mod rows Power palette (selected gold 0xf4d9a1); section labels 11px cream + merge_keep icon. Next: Forge (owner finds Forge the most confusing system — redesign discussion pending). Owner phone review pending.


# Previous delivery: v8.0.80 — art order 60 wired (painted boss bullets + body-move FX)

scripts/pack-boss-60.py (MANIFEST bytes/sha; black sheets lum×1.35 unpremultiplied alpha; bullets kept 128px so scale/hitbox unchanged) → assets/art/boss_vfx/ vfx_body_* (ASSET_FX shockwave 6×256 · skydrop 8×256 rate 8 · sweep 6×384×256 · charge 6×256×128) + bshot_01…15/pin (ASSET_IMAGES), 312 KB. Loading per stage: STAGE_SHEETS[i] gets bshot_NN, body FX only for stages 0/3/6/10/14, pin → [14]. BOSS_SHOT[i].p / PIN.p → bossShotApply uses the painted texture (no tint, rotated to direction, no spin) when loaded, else the v8.0.72 code shapes. bossBodyMove overlays heroFx on the same hazards (timings/radii unchanged): shockwave at impact (700ms) per circle, skydrop with each circle, sweep arc at impact, charge dust following the boss. tests/boss-shots extended; headless smoke 0 errors. Owner phone review pending.


# Previous delivery: v8.0.79 — Taro Arc nerf + art orders 58/59 wired (owner)

Arc (owner: cheats vs lone boss, strong at build start): taroCombatProfile storm +1 root removed (Lv1 = 1 root × 4 jumps; roots still +Lv4/Lv6/cards); boss focus jumps j>0 ×TARO_ARC_LOOP .6 (×(1+.15·Overload)) instead of 100% each (Lv1 boss hits 8×100% → 1+3×.6). Tests: taro-chain (4 hits), taro-progression rawRoots 1, taro-feedback strip. Orders 58/59: scripts/pack-menu-58-59.py (sha check, 50%, WebP q90 alpha) → mobile_ui_789 pw_hero_* (384×192), pw_empty_* (192), menu59_icons (1152×768, 264,784 B). ASSET_IMAGES literals + ASSET_SHEETS.menu59_icons; MENU59 order, M59_ROW (hub rows), M59_EMOJI (_rowBtn settings). Helpers m59Img / loadMenuSheet / pwArt (lazy, rebuild on load, null fallback). Hooks: rewardsTabs icons, buildHubGroup rows, _rowBtn emoji icons, Weave summary art α.3, empty Equipment/Merge/Forge pictures. Bazaar/Heroes tab icons and Lobby side buttons not yet wired. tests/power-family extended. Owner phone review pending.


# Previous delivery: v8.0.78 — Equipment in the Power theme (owner)

buildGear restyled in place (layout/logic/tags unchanged): bg screen_gear_power_789; summary bar, slots, bag cells and item/mod panels use the Power palette (0x261e30 + 0x6d536d border; selected 0x423039 + gold 0xf4d9a1; equipped mint 0x85d5b2). Slots without gear art show pwIcon slot_<slot> (α .9 equipped starter / .5 empty, brought to top over the slot frame). Bag header ⚡/♻ draw pwIcon equip_best/salvage when power57 is loaded (zone labels '⚡'/'♻' kept for tests/tutorial). tests/power-family extended. Next: Merge → Forge. Owner phone review pending.


# Previous delivery: v8.0.77 — art order 57 + Weave in the Power theme (owner)

Order 57 atlas (24 icons, 6×4) packed by scripts/pack-power-57.py (sha check, 384→192 cells, WebP q90 alpha 100) → assets/art/mobile_ui_789/gear_power57_icons.webp (316,750 B, 1152×768). ASSET_SHEETS.power57_icons, PW57 = cell order. pwIcon(key) lazy-loads via loadPower57 (rebuilds the screen) and returns null → callers fall back to emoji. Shared pwCard/pwSection (Power palette). buildUpgrade portrait → buildWeavePW: Power bg, summary (weave_crest, rank name, Thread, mint core-power bar), YOUR CORES 3 rows (core icons, Lv + stars, total, mint gain, sugar price pill; first affordable row gold), RANK UP row (Weave pill when all max), MORE tiles Rank Rewards/Depths (tags weave_perks/weave_dig). Same buy/promote/tutorial/spotlight logic; landscape keeps old page. tests/power-family. Next: Equipment → Merge → Forge in the same style (docs/design/power_family). Owner phone review pending.


# Previous delivery: v8.0.76 — Lobby stage name not cut (owner)

buildLobby stage box: after the power line (pw2) the name is re-laid left-aligned at px+20 with room up to the power text (−10); 11→10px, then 2-line wrap at 10px from below the C?-? label to panel bottom −8, ellipsis only as last resort. Owner phone review pending.


# Previous delivery: v8.0.75 — tidier menus (owner: UI looked messy; picked all 4 fixes + one Rewards row)

_screenBg strips leading emoji from titles; generic header = Back pill + Sugar chip (0x291733 fill, 0xe5bb6b border, hr_ic_candy/ic_sugar icon) matching drawRosterHeader. Equipment/Forge _jrSkin=false (plum fallback; journal code/jrOn kept). drawNavBar dots via navBadge: char = new hero only, gLoadout = Mail/shovels/unpicked rank reward, gActivity = Login/Daily/Awards claimable (no more 'upgrade possible' dots). Rank Rewards fonts 8.5–10 → 10.5–11px, greys → #c3b8d0; Awards/Daily T() min 11px, #a89cb6 → #cfc1d4. HUB_GROUPS gActivity: one 'rewards' row (hasClaimableTarget('rewards')). Gold Chest pity pips skipped when they would hit the button. index.html Thai strings → English. Equipment 'No items yet' brighter. Lobby stage name fixed in v8.0.76. Owner phone review pending.


# Previous delivery: v8.0.74 — body-type bosses without bullets (owner picked 5 bosses + all 4 moves)

BOSS_NO_SHOT {0,3,6,10,14} (C1-1 Ant Empress, C1-4 Frost Golem, C2-2 Behemoth, C3-1 Colossus, C3-5 First Planter; their minis too; Pinnacle/Delve excluded). foeShot first calls bossNoShotAt: a shot born near such a boss/mini is dropped; at most one bossBodyMove per 1.1s per boss (e._nsAt) rotating e._nsK: shockwave (6 spawnHazard r46 along the line to the player, 110ms apart) · charge (chargeTelegraph 650/700/26, ≤1 per 1.6s, else hazard on player) · sky drop (3 hazards r64 around the player's position, 180ms apart) · sweep (5 hazards r56 on a 140px ±60° arc). Hazard dmg = shot dmg ×2, tint = BOSS_SHOT colour. Kit timing/other moves unchanged. tests/boss-shots extended; headless smoke 0 errors. Owner phone difficulty/feel review pending.


# Previous delivery: v8.0.73 — boss victory comics shorter/clearer/varied (owner)

bossMotionScene: 2 shots (👑 title + beats[0] · “release” + STAGE_EPILOGUE why + 'Next: C?-? · name' if total <118 chars), noTitle (mcTitle skips to shot 0), fast advance max(ms+600,1700+34/char) vs old 2200+45/char. 4 stagings by idx%4 (actor/Ruby side, entrance offset, pan/zoom), flash = BOSS_SHOT[idx].c, shake idx%3==1, pow word per variant, mote per idx. Same art/keys. tests/boss-stories (2 shots), check-boss-motion-ui j<2 (run with FORGE_BROWSER_CHANNEL=chromium). docs/BOSS_MOTION_COMICS.md. Owner phone pacing review pending.


# Previous delivery: v8.0.72 — boss bullet identity (owner picked colour/shape + behaviours)

Code-drawn 128px white textures boss_orb/boss_shard/boss_star (dark outline, tinted; same size as cr_foe_bolt so hitbox unchanged). BOSS_SHOT[stageIndex 0–14] + BOSS_SHOT_PIN {k,c,s,b}. foeShot → bossShotStyleAt(x,y): shot born within .6·size+40px of an active boss/mini (not delveBoss, not _bsChild) gets bossShotApply (texture/tint/scale, beh). bossShotTick from the foe tick: wave (sine ±.55), home (1.7 rad/s for 1.3s), boomer (reverse at .85s), bounce (camera edges ≤2), split (3 kids at .7s, ×.55 dmg), delay (stop .55s, blink, 6-ring at 1.25s ×.5 dmg); bossShotKids capped at 210 active. killFoe resets beh/spin/alpha. Mob shots unchanged. tests/boss-shots. Headless smoke 16 styles 0 errors. Owner phone feel/difficulty review pending (split/delay add small bullets).


# Previous delivery: v8.0.71 — Rewards hub (owner: merge Daily + Login + Awards)

Lobby right side News · 🎁 Rewards (tag side_rewards, route 'rewards' → daily or achievements by _rwLast/badges), left Codex · Mail. rewardsTabs(active) draws 📅 Login (loginPopup('daily') or 'Day n claimed' toast) · 📋 Daily · 🏆 Awards (tags rw_<k>, red dots) under the header and returns its height; buildDaily/buildAchievements shift content by it. FEATURE_OPEN rewards 1, reveal targets side_rewards, daily/achievements skipped in featureReveal (new 'rewards' card instead). hasTargetBadge('rewards'). gActivity rows unchanged. tests/rewards-hub. Owner phone review pending.


# Previous delivery: v8.0.70 — Twin Seed, ad button, equip lesson, chest Thread, Weave header (owner batch)

Strawberry card id size (saves kept) Juicy Burst → Twin Seed: pre-path/path volleys +1 seed at 15%/rank (pre-path also above the 12 cap), seedPop off; Sniper charge ×(1+.1·rank). summaryAdButton: green container, scale yoyo + wiggle + shine (off with reduced motion), tag ad. questFocus spotlight no longer tap-skippable (taps during movement skipped it); its own timer ends it. Gear tutorial step 1 on Equipment: selects newest unequipped item, spotlights gear_equip only (old regex could hit a bag cell and pass the step), then d._gearTutQE → spotlight ⚡ (tag gear_best) → gearTut 2. openChest reveal shows '🧶 Thread N' pill (updates on refund). _screenBg temple header art off (shared header, veil .54); buildUpgrade/buildRankPerks fonts NunitoUI; layout/art unchanged. tests: stage-summary-layout, taro-foundation castSkill strip, momo fixture. Owner phone review pending.


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
- **🎨 คุมธีมโดยรักษาเกมเดิม (เจ้าของย้ำ 27 ต.ค. 2026): “เกมเดิมที่งานภาพเป็นระเบียบขึ้น” สำคัญที่สุด** — งานคุมธีมให้เก็บโครงหน้า ตำแหน่งปุ่ม เส้นทางใช้งาน ระบบ ตัวละคร ฉาก และอาร์ตเดิม ปรับเฉพาะฟอนต์ สีแผง ขอบ วัสดุ และสถานะของปุ่ม/Back/ช่องเงินให้เข้าชุดกัน ใช้ ImageGen เฉพาะชิ้นที่ขาดหรือหลุดชัดเจน ชุดภาพ42มุมมองใน docs/design/unified_theme เป็นภาพสำรวจสี/วัสดุเท่านั้น ไม่ใช่แบบอนุมัติให้รื้อหน้า เปลี่ยนเกม หรือสร้างอาร์ตทั้งหมดใหม่ การเปลี่ยนโครงหน้า/ขั้นตอน/ระบบต้องมีคำขอที่ครอบคลุมการเปลี่ยนนั้นจากเจ้าของ
- **เอนจิน:** Phaser 3 (เกมเว็บ/HTML5, TypeScript/JS) — เลือกเพราะทำบนมือถือล้วนได้
  (โค้ดอยู่บนคลาวด์ของ Claude, เจ้าของแค่เปิดลิงก์เทสในเบราว์เซอร์มือถือ)
- **เส้นทางขึ้นสโตร์:** เกมเว็บ → ห่อเป็นแอปด้วย **Capacitor** → build APK ผ่าน cloud → Play Store
- **หลักการทำงาน:** ออกแบบ/จูนระบบให้สนุกก่อน (กราฟิกกล่อง ๆ) → ทำ UX → **ลงกราฟิก AI เป็นขั้นสุดท้าย**
  (เพราะกราฟิกแพง/ช้าสุด ทำก่อนแล้วรื้อ = เสียของ)
- **🏆 กฎเหล็ก (กฎหลักของเกม):** **ยิ่งยาก รางวัลยิ่งดี** · (19 ต.ค. เจ้าของเลือก: Story เล่นระดับเดียว · ความยาก endgame = ความลึก Delve → สกุลเงินดีขึ้น `delveLoot`; Boss Rush ซ่อนไว้ก่อน v7.8.89) — ทุกระบบรางวัลใหม่ต้องเคารพกฎนี้ (`DIFFS[].reward`, `diffMul()`)
- **🎯 ผู้เล่นเป้าหมาย (19 ต.ค. เจ้าของเลือก ค):** แบบผสม — หน้าตาน่ารักเล่นง่ายช่วงต้น · ความลึกแบบสายบิลด์ (Forge/Kitchen/Delve/Special Cores) ค่อย ๆ เปิดหลัง Chapter 2–3 · ฟีเจอร์ใหม่ต้องไม่เพิ่มภาระช่วงต้นเกม
- **🔊 เสียง/เพลง = สร้างด้วยโค้ด (เจ้าของตัดสินใจ ก.ย. 2026):** เอฟเฟกต์ใช้ `scripts/gen_sfx_jsfxr.cjs` (jsfxr) · เพลงใช้ `scripts/gen_bgm_synth.cjs` + `scripts/encode_mp3.py` · ไม่ต้องรอไฟล์จากเว็บ/เจ้าของ (sandbox เข้า pixabay/kenney ไม่ได้)
- **สาขา git:** `claude/vampire-survival-mobile-game-yo9e8w` (ชื่อเก่าติดมาจากธีมแวมไพร์)


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

# Moved from CLAUDE.md sections 2–5 (31 Oct 2026, token trim)

## from section 2
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
- **ใบสั่งเสียงชุด A (25 ต.ค.) `docs/audio_orders/A00–A05`:** A01 เสียงเมนูใหม่ (Merge/Forge Points/Login/Daily/Awards/Codex/Depths/Rank/Power, 32) · A02 เสียงในด่าน (กลไกสนามบอส/Counter/ฆ่าบอส/ภารกิจ/สถานะ/Ruby, 30) · A03 Yuzu (15) · A04 เพลงหน้าแรก + เพลงฉากเรื่อง 4 อารมณ์ + Bazaar + คำการ์ตูน + ชนะ/แพ้ (20) · A05 เสียงพึมพำ Ruby/ฮีโร่ Lobby/บอส (31, ไม่รวม Sesame) · รอเสียง (โน้ตผูกโค้ดท้ายแต่ละใบ)
- **ใบสั่งอาร์ต 35, 50–54 (25 ต.ค.) ของที่ยังใช้อีโมจิ/กรอบโค้ด:** 35 Yuzu Orchard (17) · 50 Merge + Forge Points (14) · 51 Login + Daily (10) · 52 Awards (7) · 53 Bestiary + Recipe Book (9) · 54 Depths + Rank Rewards (5) · รออาร์ต (โน้ตผูกโค้ดอยู่ท้ายแต่ละใบ)
- **ใบสั่งอาร์ต 56 (31 ต.ค.) Yuzu Seedlings:** 9 ไฟล์ (`docs/art_orders/56_YUZU_SEEDLINGS.md`) · โค้ด v8.0.67 ใช้ Yuzling ย้อมสีชั่วคราว · ระวังงบ GPU Yuzu 299/300 · รออาร์ต
- **ใบสั่งอาร์ต 49 (24 ต.ค.) กรอบโปรไฟล์ 4 แบบจาก Awards:** 4 ไฟล์ (`docs/art_orders/49_PROFILE_FRAMES.md`) · รออาร์ต (ตอนนี้เส้นสีโค้ด)
- **ใบสั่งอาร์ต 48 (24 ต.ค.) กลไกสนามบอส C1–C2:** ส่งครบ 12 ชีต · ผูกแล้ว v8.0.21 · รอ QA มือถือ
- **ใบสั่งอาร์ต 47 (24 ต.ค.) HUD ส่วนบน + ปุ่มเร่งความเร็ว:** ส่งครบ 18 ไฟล์ · ผูกแล้ว v8.0.10 · รอ QA มือถือ
- **ใบสั่งอาร์ต 46 (24 ต.ค.) แก้ 2 ช็อตเรื่อง:** ส่งครบ 3 ไฟล์ · ผูกแล้ว v8.0.8 · รอ QA มือถือ
- **ใบสั่งอาร์ต 45 (Motion Comic):** ส่งครบ 103 ชิ้น · ผูกแล้ว v8.0.2 (S10 Sesame ยังไม่ผูก) · รอ QA มือถือ
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

## อัปเดต v2.29.0 — Character Combat Profiles & Signature Weapons
- ตัวละครทั้ง 6 ตัวมี Combat Profile ใหม่ แยก HP, ATK, SPD, DEF, CRIT, CDR และบทบาท
- อาวุธประจำตัว: โมโม่=ปืนเมล็ดหัวใจ, มินต์=แกนลมเย็น, โกโก้=ถุงมือตราหมี, ตาโร่=เข็มทิศสายฟ้า, งาดำ=กระจกคำสัตย์, Berry Core=ปืนแกนแยม
- ผู้เล่นเริ่มด้วยอาวุธประจำตัวและเลือกอาวุธรอง 1 ชิ้น; อาวุธประจำตัวนับรวมในเพดานอาวุธ 4 ช่อง
- Weapon Mastery มีผลเฉพาะอาวุธประจำตัว และ resetStageLoadout() ต้องคืนอาวุธประจำตัวทุกด่าน


# Moved from CLAUDE.md (31 Oct 2026) — delivery notes v8.0.68 and older, art deliveries

# Previous delivery: v8.0.69 — art order56 Seedlings

Nine built-in ImageGen deliverables:4eight-frame baby citrus actors,6frame pop/regrow/sourburst,4frame seed projectile, Seedling Sprout icon. Exact128/64/256cell PNG32 sheets incoming/yuzu_seedlings with originals/PROMPTS/MANIFEST/QA/source-only previews; mechanically aligned foot120/common scale, no invented frames. Runtime9lossless half-size WebPs265,294B/1.14MiB decoded in art/yuzu_seedlings, hash manifest. New keys Yuzu-stage-only (not selected-hero boot), retains299MBboot<300cap. Movement-driven4walk frames, anticipation from existingCD then release/recover5–7, pause/reduced/stale/missing-art fallback, soft hurt tint, owned7max tiny shadows, same8sregrow with last.45s reused actor sprite showing regrowth. Shared4FXcap extended6frames; all death pops tint neutral cream, Pop sourburst straight-alpha NORMAL;18pxseed projectile4frame loop; card usesic_yz_seedling. Actual67counts/HP/CD/damage/contact/timer/gates/AI/64Citrus Command unchanged. Tests/yuzu-seedlings-art all9hashes/pose30–120FPS/pause/Low/reduced/stale/FXcap/spawn/projectile; old49card bindings checked. Fullcheck/build required. No game capture/headless combat; owner phone appearance/FPS pending.

Older delivery / art delivery notes: docs/CLAUDE_HISTORY.md (search there for a version or art order number).


# Latest delivery: v8.0.68 — Yuzu talent text fixes + art order 56

Talents checked against code: Royal Parade 'In Sync lasts 2s longer' (was old buff text), three path roots '+6% companion and Seedling hits' (yzDmg is in yuzuPower), Wide Landing names Meteor Peel too, Acid Notes 'Sour-marked enemies take 4% more damage' (no 'percentage points'). Numbers unchanged; tests/talent-icons royalLabel updated. Art order docs/art_orders/56_YUZU_SEEDLINGS.md (9 files: 4 Seedling sheets 8×128, pop/regrow/seed shot/sour burst, card icon) awaits art.

# Previous delivery: v8.0.67 — Yuzu Seedlings minions (owner picked 1ก 2ก 3ก 4ข)

New shared Yuzu card seedling (max 3, icon yc59_starter): YZ_SEED_COUNT 1/3/5 + Evolution 2 (max 7). Weak (×.12–.18 yuzuPower), mortal (contact −1 HP/.6s, boss 3), pop → regrow 8s. YZ_SEED_KIND: pre-Build bite · Pomelo tank hp8 + yuzuTaunt 110px · Lime throw (yuzuShot mini, no splash) · Blood Orange pop burst r70 ×.6 + Sour. Reuses minion_yuzling 30px tinted, no new art. yuzuTickSeeds from tickYuzuCrew, clearYuzuSeeds in clearYuzuCrew. docs/YUZU_SEEDLINGS.md; tests yuzu-companions v67. Owner phone balance/FPS pending.

# Previous delivery: v8.0.66 — every hero unlocks in Chapter 1 (owner picked ข)

CORE_UNLOCK_STAGE {mint:0,cocoa:1,taro:2,yuzu:3} → playable C1-2/C1-3/C1-4/C1-5 (Sesame still WIP/hidden). HERO_INTROS idx 1–4 with texts for Rotting Drain / Chili Engine / Frost Prison / Crown Oven; Motion Comic s06–s09 reuse cs_s02/03/04/05 far backgrounds (old cs_s06–09 far art registered but unused). RUBY_STORY[1–4] name the freed friend; FEATURE_OPEN.char 2→1; FEAT_LINE char generic. Old saves unlock on load (unlockCoreCharacters). docs/STORY_CANON.md tables + 7.4 updated. tests/hero-unlock-ch1 (in npm check). Owner phone review pending.

# Previous delivery: v8.0.65 — Citrus Command polish (owner picked ก+ข+ค+ง)

Aim zoom-out only after 250ms hold (tap = no pulse); Lime drag aim fires along pt.ang (800px); yuzuCmdLeapPt caps Pomelo/Yuzling leap 450px, duration .35+d/1200 ≤.7, aim circle at capped spot; Flavor Storm pull 35px/pulse (min d−10). In Sync still 4s (จ waits for Combat Meter data). tests yuzu-companions v65 block. Owner phone review pending.

# Previous delivery: v8.0.64 — Yuzu Citrus Command Unique (owner picked A)

Hold Unique = aim (shared _snipe hold, kind 'yuzu', yuzuCmdAim/yuzuCmdPoint: drag ≤380 or auto 🎯/priority/walk dir), release/tap → yuzuCommand: Pomelo/Yuzling leap 'command' motion + yuzuCommandLand slam r160 ×6 stun .8; Lime command_arrow pierce 99 ×5 + 6s 🎯 on first big hit; Blood Orange u.storm 3 pulses r150 ×2.2 + pull (yuzuTickStorm). Then 4s In Sync (old buff, cmd:true, no old end finisher), 🎯 ×1.5. Names Meteor Peel / Piercing Shot / Flavor Storm; Unique Mutations + 3 talents reworded, ids kept, no new art. docs/YUZU_UNIQUE_V2.md; tests yuzu-companions v64 block + old finisher tests updated. Owner phone feel/balance pending.

# Previous delivery: v8.0.63 — C3-3…C3-5 boss/mini HP nerf (owner: too much HP)

_bStoryC and _mStoryC (mini = 25% of it) indices 12–14: 96.76/152.67/240.88 → 82.25/114.5/159 (−15/−25/−34%), Story only; Recipe/Delve and stageThreat (Recommended Power) unchanged. Owner phone check pending.

# Previous delivery: v8.0.62 — Yuzu mark scope fix + unlock headlines + Ruby aim tip (owner picked ก+ง+ค) + Unique v2 draft

ก: yuzuEnemyPriority plain again; yuzuFocusRank (mark 1.5) only in yuzuPickTarget/yuzuTarget, so leash 740/800, arsenal rank>0 gating, cluster and FX ignore the mark. ง: rank-0 unlock cards headline '🔓 Unlocks X' (makeCard, not after Evolution); Trap Setter/Honey Notes/Slow Steep talents name their needed card. ค: RUBY_TIPS.yuzuAim via rubyOnce on first mark. docs/YUZU_UNIQUE_V2.md: Citrus Command (hold-aim leap move per path + 4s In Sync, reuses yuzu51/54 art) recommended, Ripe Meter / Juice Swap alternatives — awaiting owner. tests yuzu-companions v62 block. Owner phone review pending.

# Previous delivery: v8.0.61 — Yuzu steady mark + mission-first priority + unlock-card guarantee (owner picked ก+ข+ง)

ก: yuzuMark holds ≥2s (k.age) and moves only after 2 consecutive seed hits on the same new enemy (k.pend); hit on the mark refreshes 4s. ข1: yuzuEnemyPriority mission5 → Wisp4 → boss3 → mini2 → mark1.5 → elite1 → mob0 (mark lifts only mobs/elites, ×1.25 stays). ง: yuzuUnlockGuard(out,atk) at both rollBasicAttackUpgrades returns: after Build, if a rank-0 unlock card is in the pool and one level-up missed it, next roll swaps a non-heal/non-path card for one (_yzUnlockMiss, reset in clearYuzuCrew). docs/YUZU_FOCUS.md; tests/yuzu-companions v61 block. Owner phone review pending.

# Previous delivery: v8.0.60 — Yuzu seed focus + card skill unlocks + Dash fix + cleanup (owner picked ก+ข+ง)

ก: yuzuSeedAim (nearest enemy in ±.6 rad of player velocity, else old target); seed hit → yuzuMark (4s, one mark, pooled-id safe, owned _yzMarkG gold arcs); yuzuEnemyPriority marked=6 (above mission 5); companion hits on the mark ×1.25. ข: yuzuHasSkill — start normal + Pulp Slam / Zest Volley / Crimson Comet + Unique; rank 1 of y_giantslam→Rind Breaker, y_bigsplat→Sour Trap, p_pulp→Vaulting Shot, y_strongarm→Pin & Pierce, y_longroot→Sour Garden, y_elder→Spicy Bloom, y_seedluck→Honey Rescue; Evolution unlocks all; card/path/evo texts updated, ids unchanged. Dash: yuzuRush skips while the companion has a valid target or action/motion, else ≤1 rush/1.2s (Footprints/Dash shield still every Dash). ง: removed yuzuHurt/Knock/Down/Recovery/Regrow/MaxHp/Brew/FinishInfusedShot, companion hp/down/revive/hurt/brew fields, Help label, down/revive/hurt poses, old orb/infused shots, boss-hazard yuzuKnock calls. docs/YUZU_FOCUS.md; tests yuzu-companions (v60 block) + animation/polish/spectacle updated. Owner phone review pending.

# Previous delivery: v8.0.59 — Yuzu card copy and48ImageGen icons

Owner requests all Yuzu cards reviewed after54arsenals. Preserve original card layout, IDs, rank caps, stats and all combat methods. Starter/hero copy now always-ready single buddy; path-aware Zest Splash describes sweeps/Lime splash+Vault/Sigils, Swift Ranger covers Volley/Vault/Pin, Ready Quiver all4Lime skills, Sour Snare uses companion-power units, Acid Notes quantified, Honey/Spell talents renamed, display-only Focus mutation names and Peel Promise. Full Recipe effects and matching art.48built-in ImageGen icons (3donors+Dash refinement), sources/exact prompts incoming/yuzu59; mechanical scripts/pack-yuzu-59.py,96px lossless icons art/build_cards/yuzu59 with hashes/crops. Existing3path keys now accurate single companions;45new keys stage-lazy/Yuzu-only, all48used including path-specific Evolution and Unique Power. Generic Unique/infusion/trade icons reused. No new battle VFX/AI/balance/companions. docs/YUZU_CARDS.md. New isolated48bindings/Recipe/3paths/cold-art/other-hero checks, existing draft fixture loads new presentation helper; fullcheck/build required. No game screenshots/headless combat; owner phone appearance review pending.

# Latest delivery: v8.0.58 — existing controls consistency pass

Owner said continue after57header pilot, while preserving original game. controlTheme reuses existing header roles; native uiPillBtn/paintedNavButton/Heroes tabs/journal labels/Forge fallback and menuToast typography/outlines aligned. Native gloss20→10%, softer label shadow and1.5pxborder; painted tabs retain original textures/geometry/active alpha, quieter gold halo. Original caller base/semantic/hero colors, light-paper ink/disabled states, assets, positions/sizes/corners/fit rules/tap zones/tags/callbacks/sounds/costs/navigation/2600mstoast lifecycle retained. No new ImageGen/assets/GPU/gameplay, no42mockup replacement. docs/UI_THEME_POLISH.md pass2. Existing roster/progression/Forge7layouts/menu-motion passed; fullcheck/build required. No game captures/headless combat; phone appearance review pending.

# Latest delivery: v8.0.57 — restrained header consistency pass

Owner priority: original game, more orderly visuals. Small pilot only: headerTheme shared NunitoUI/cream/warm-gold/ink roles in existing generic headers, Heroes, journal Equipment/Forge and fallback Forge text. Generic native Back slightly warmer plum/thinner border; title strokes quieter. Keeps original page content, backgrounds/art/painted controls/coordinates/fit rules/tap zones/Back stack/currency format/tutorial tags/navigation/gameplay/economy. Paper remains paper with dark ink; no layout mockup recreation, no new ImageGen/assets/GPU cost. docs/UI_THEME_POLISH.md. Existing targeted roster/Power/Forge checks passed, fullcheck/build required. No screenshots/headless combat. Phone appearance review pending; this is pass1, not an entire-game redesign.42design previews remain local reference only, not approved replacement screens.

# Latest delivery: v8.0.56 — illustrated Power hub

Owner approved docs/design/power_hub concept. Live buildGearPower uses calm plum/cream/mint panels, compact crystal Power summary, real sorted3tips with first highlighted, complete wrapped cost/risk descriptions measured before layout, all pending-action chips wrapping instead of disappearing, portrait2×2/landscape4shortcuts. Six built-in ImageGen icons (crest/Weave/equipment/3matching shields→higher shield/Forge/Talent), source/exact prompt/alpha proof/hash incoming/power56, mechanical pack-power-56.py, menu-lazy576×384/192cells/183,310B/.844MiB atlas art/mobile_ui_789/gear_power56_icons.webp. Reuses existing scenic background with quiet content veil; no new background or flattened UI. Live text/progress/rounded surfaces/hit targets in code, normal navigation/routes/save/cost/sorted gains unchanged (powerTips hash verified). Short phones scroll naturally; min66shortcut/42pending tap heights, no hidden Mail/Rank/Talent/Weave actions. Gain counter+fill only if motion allowed; no full-screen glow or infinite FX. Isolated menu helpers6sizes/empty/missing-art/long-risk/allroutes/huge-values/reduced/stale contract passed; fullcheck/build required. No game screenshots/headless combat. Phone aesthetic/touch review owner pending.

# Latest delivery: v8.0.55 — Mint Impaler character charge sheets

Replace floating glow/charge VFX plane with one actual player sprite using24built-in ImageGen frames: stationary charge8, moving charge8, release/recovery8. Generated Mint identity references, original+refinement+exact prompts incoming/mint55, mechanical component bounding crop/common scale/122px foot baseline/128px cells via scripts/pack-mint-55.py, runtime3lossless1024×128 alpha sheets/1.5MiB hero-lazy in art/mint55 with hashes. Stationary frames follow original320+80HeavyDraw ms, moving charge follows existing speed-driven gait, release uses new owned pose and skips repeated preparation. Reduced charge stillframe5, pause/hurt/Dash/stale player/basic/path/epoch/death/missing-sheet guards and clear sound cleanup. No second character or charge PNG layer; no changed damage/CD/charge/projectile/collider/world coordinates. docs/MINT_IMPALER_POSE.md. Isolated pose/casting adapters30/60/120FPS and existing numerical contracts; fullcheck/build required. Source matte inspected; no combat simulation/screenshots. Owner phone pacing/appearance/FPS review pending.

# Latest delivery: v8.0.54 — full companion arsenals +40ImageGen frames

Blood Orange live normal becomes captured-ground delayed Flavor Sigil (no orb normal), AI Comet/Garden/Bloom/Honey, one large spell lock; Perfect Blend strengthens Sigils/spells and defers one final wave until active big spell ends. Pomelo3-hit Peel Combo (.85/1/1.45, third radial) +forward Rind Breaker, retains Slam/Roll/growth. Lime arcing Vaulting Shot bypasses screens +spawn-safe Pin&Pierce, retains arrows/Volley/Trap/Focus. Immortal single buddy/mission-boss priority and saved IDs/talent points/Recipe remain; descriptors converted. Owned bounded sim-time12spell queue, interrupted-event victim cursor, stale/death/path/epoch/clear, serial windup/release; no new physics bodies/EXP/mob spawns. Existing48shots/10zones/8FX/4painted cap, quiet flower zones/.18, essential Low Sigil still, reduced/fallback; old orb/brew helpers compatibility-only. Three built-in ImageGen donors concurrently generated20mage+8Pomelo+12Lime frames. Runtime3lossless128px-cell WebPs531,640bytes/2.5MiB hero-only, Yuzu299MB<300cap; source/exact prompts/matte proof incoming/yuzu54, hashes/clips/crops art/yuzu54/MANIFEST, mechanical pack-yuzu-54.py. Existing ElevenLabs reused. docs/YUZU_ARSENAL.md. Component timing/AI/ownership/overlay/geometry/mark/combo/art hash tests plus fullcheck/build required, no combat simulation/screenshots. New mechanics change balance; phone pacing/strength/FPS owner QA pending.

# Latest delivery: v8.0.53 — subtle stage life

15campaign theme profiles reuse existing stage-lazy leaf/pollen/spore art or tiny glow for dust/drips/embers/snow/ash.6reused images max/Auto reduced3/boss2/Low+reduced0,12px painted/3–4px motes/3×9drips, alpha≤.22, side rim bands and player165/boss220/Wisp120 exclusion, background depth only. Up to8visible streamed background props sway≤.025rad (roots.006) or slowly pulse88–100%original opacity; boss3, flash-off static opacity. Sample.5s, deterministic local visual noise/no gameplay RNG, unscaled real-time play clock. Owned stage/player/epoch/shutdown/clear, original transform metadata guard on recycled props, tutorial/Recipe bypass, missing-art fallback. Existing solid props/physics/AI/hazards/rewards/parallax untouched. No new ImageGen/audio/textures/GPU cost. docs/STAGE_LIFE.md, stage-life isolated15theme/budget/pause/reduced/owner/pool/RNG tests; fullcheck/build required. No combat simulation/screenshots; phone subtlety/FPS owner review pending.

# Latest delivery: v8.0.52 — hero/enemy motion weight

Owner priorities1+2. Reuse original hero/enemy action sheets; no new ImageGen/texture/audio/GPU cost needed. Seven heroes continuous12frame speed-driven gait (16FPS base), stop/Dash settle without150ms squash hold, Sniper/Impaler/Shotgun/Titan/magic recoil profiles, stationary charge holds first2frames then real release skips repeated preparation, rapid stationary clips retain first55%, moving casts keep running. Existing Chocolate bespoke poses retained; all-hero bounded120Hz spring integration. Owned player/hero/path/epoch/reset, pause/reduced motion. Enemy cached heavy/swift/ranged/normal cadence/sway and160ms directional hit weight, without overriding windup/attack/Dash; freeze/pool/death/boss exclusion. Configured colliders/world coords/AI/attacks/EXP untouched; no new position offsets or scale limits. docs/ACTOR_MOTION_WEIGHT.md. New isolated actor-weight tests7heroes30/60/120FPS and existing motion contracts; Taro damage hash strips only cosmetic hook, validator tracks continuous gait. Required fullcheck/build and exact publish; no combat simulation/screenshots, owner phone feel/alignment/FPS pending.

# Latest delivery: v8.0.51 — companion buff/finisher spectacle

3built-in ImageGen donors/24frames: golden peel armor/ground rupture, leaf bow/light arrow, three-flavor wreath/petal bloom. Source+exact prompts+matte alpha proof incoming/yuzu51; runtime3lossless1536×192 sheets/876,448bytes/3.375MiB in art/yuzu51, manifest source/cell-crop/hash records, mechanical pack-yuzu-51.py. Yuzu297MB<300GPUcap, other heroes unchanged. Opening/brief active accent/last.6s gathering/real-time finisher; new painted heavy arrow keeps old projectile physics. Small hit/trail/bounce accents and existing ElevenLabs low-volume pow_thud/pop plus gathering/release; no new sound synthesis. Reuse shared4FX cap/420px/.5large/.68small/NORMAL, finisher priority, buff-owned opening/recast/clear, pooled marker identity/follow depth, Low old projectile/fallback and reduced still≤.35s. v50 damage/timing/AI/immortality/cards/EXP unchanged. docs/YUZU_UNIQUE_SPECTACLE.md; expanded helper/frame/lifecycle/hash adapters and fullcheck/build required; source alpha inspected, no combat simulation/screenshots. Owner phone subjective sound/readability/FPS pending.

# Latest delivery: v8.0.50 — always-ready companions / buff Uniques / mission AI

Companions immortal, no down/touch rescue/HP gauge and no enemy bullet interception. Golden Peel Armor6s (shield/heavy wide sweeps/push/slam finisher), Hunter’s Focus6s (piercing short bursts/transferable marks/heavy arrow finisher), Perfect Blend7s (shield/stronger bouncing orbs/Sour tags/terminal fire burst/flavor wave). Owned simulation-time pause/recast/stale/death/path/epoch/clear guards and one-shot finishers; countdown ring/label; reuse48/49art, no added GPU assets. Target mission→active Wisp raider→boss→mini→elite→mob, .15s priority scans with same-tier stickiness, ranged priority approach/longer bounded pursuit; density-aware slam/pierce/bounces retain crowd clearance. Saved IDs/points intact; HP/recovery/Hardy/Bodyguard/KeepRipe/Unique mutations/talents repurposed for useful shields/skills/damage. Existing48shots/10zones/8FX/4painted caps; Focus queue8, Sour tags64/pool-safe. docs/YUZU_BUFFS.md supersedes old HP/revival/Unique rules. Isolated helper regression, fullcheck/build required; no gameplay simulation/screenshots. Owner phone balance/feel review pending.

# Latest delivery: v8.0.49 — companion skill spectacle

Original ImageGen7clips28frames/3donors enhance normal/special/Unique releases: Pomelo peel sweep/slam/Fortress/roll; Lime arrow muzzle/volley/rain; Blood Orange honey/Sour/flame and Infusion accents. Visual-only hooks preserve all damage/range/CD/hit/AI/card/EXP/reward formulas and48animation; no mini-minions/new Unique mechanics.4new decorative sprites max,420px cap, finite frames, large alpha.5/small.68, NORMAL, Low skip/reduced brief still, pause/owner/player/basic/epoch/down-follow/shutdown/central clear guards. Existing8FX/48shots/10zones caps retained. Hero-lazy7MiB/1,525,758bytes in art/yuzu49 with hashes; donors/exact prompts incoming/yuzu49; pack-yuzu-49.py. docs/YUZU_SKILL_SPECTACLE.md. Fullcheck/build2301assets, Yuzu293MB within300cap; static production Canvas13showcases×3sizes×normal/reduced+Low, lifecycle/hash regressions passed. No combat simulation; phone crowd-readability/feel/FPS owner review pending.

# Latest delivery: v8.0.48 — smoother companion animation

Presentation-only refinement before mini-minions:3ImageGen atlases48frames (8walk+8attack per companion),2,241,182bytes/12MiB decoded Yuzu-only. Exact prompts/originals/refined Lime/Blood Orange retained incoming/yuzu48; source/final hashes/crops/scales in art/yuzu48/MANIFEST; mechanical pack-yuzu-48.py removes neighboring-row scraps by subject crop, aligns248px foot baseline and normalizes old apparent size. Movement-driven gait, damped breathing/weight/recoil/settle, stable visual foot origin and one reused ground shadow per companion; reduced-motion/paused stillness, prior47special/flavor/fallback poses retained.18production gameplay helpers byte-identical to47, including attack release timing, AI, damage, CD, projectile/motion logic; gameplay coordinates unchanged. No mini-minions. Existing168pose+24projectile Canvas review plus new72frame normal/reduced continuous clip viewer passed; 30/60/120FPS visual contracts, fullcheck/build passed (2294assets). Preview incoming/yuzu48/animation_preview.gif is deterministic2× presentation, not gameplay. docs/YUZU_ANIMATION.md; phone feel/FPS owner QA pending.

# Latest delivery: v8.0.47 — Yuzu animation, AI and attack identity

Three companions now have owned prepare→release→recover actions (normal shots/volley/brew/trap), frame-aligned once-only emissions, pause/cards/stale owner/clear/Dash cancellation. Explicit leap/roll/landing/hurt/down/revive poses, own down identity and old-art fallback; Pomelo sweep crescent/slam impact, Lime drawn seed arrows, Blood Orange distinct aroma/fire/three brews. Four ImageGen alpha sheets28frames/1,317,802bytes (7MiB decoded Yuzu-only), source+prompts+Blood Orange refinement preserved in incoming/yuzu47, manifest/runtime art/yuzu47; pack-yuzu-47.py. AI sticky550ms targets/pooled ids, player leash, ranger/mage range hysteresis, deliberate retreat, fast return and only extreme-distance recovery warp. Offensive brews/traps wait for targets; heal still useful between fights. Original damage/projectile/cooldown formulas/cards/talents/rewards/EXP/one-companion cap unchanged; actual cadence now includes prepare/recover/landing. docs/YUZU_POLISH.md. Existing contracts+new action/AI adapters and production static Canvas168poses/24projectiles/3sizes/normal+reduced. Phone pacing/balance/FPS owner review pending, no combat simulation.

# Latest delivery: v8.0.46 — boss final blow + Wayseed Key

Campaign-only owned final-blow freeze, curse fragments/boss dissolve/freed-flavor light, new ImageGen Wayseed Key for next locked story stage, curtain into boss Motion Comic BEFORE existing boss rewards. Stage-lazy256px alpha key; sources/prompts/manifests under assets/incoming/boss_victory46 and assets/art/boss_victory; docs/BOSS_VICTORY.md. First14frontier bosses give persistent idempotent storyGateKeys[next] and unlock next stage; old progress/replays/finale/special modes retain behavior; separate from Rift/Pinnacle keys. No economy/EXP/damage changes. Copied boss pose independent of pool; suppress old duplicate ghosts/flash/slowmo only on this route. Real-time x1–x4 durations, reduced motion850/1150ms, normal1750/2100ms, Low/flash preferences, modal wait and owned cleanup/stale guards. Static Canvas24cases/3sizes/normal+reduced/3bosses+key, regression keys all14doors. Phone feel/audio/FPS owner review pending; no combat simulation.

# Latest delivery: v8.0.45 — boss aftermath Motion Comics + heavier Impaler

All15 campaign boss stories now play AFTER victory as45 layered shots, with15 original built-in ImageGen backgrounds, independently animated existing boss/Ruby actors and bounded existing curse/release FX. Boss comic then applicable original chapter ending then Stage Clear; no old still-image/text recap or pre-fight story modal. First viewing/skip uses existing Motion Comic seen state; Bestiary replays same scenes. Player/stage/epoch/death/shutdown ownership prevents stale continuation or marking seen. Special modes/noRuby bypass. Boss art is menu/scene-lazy and evicted between scenes; reduced motion keeps still layers. Original17 chapter comics/canon/rewards/hero unlocks retained. Sources/prompts: assets/incoming/boss_motion45; manifest/runtime: assets/art/story/boss45; docs/BOSS_MOTION_COMICS.md. Static production Canvas review630shots across7viewports and normal/reduced motion, including actual registered Ruby actor and atlas-frame checks; no combat simulation.

Crystal Impaler normal lances +35% damage full/partial; existing charge/CD/speed/pierce/collider unchanged. Painted lance size full68+6rank, giant108, partial38; full impact uses bounded Mint shatter and existing big-target hitstop/shake throttles. Crystal Rupture inherits stronger hit; Unique formulas unchanged. Owner phone gameplay/balance/FPS review remains pending.

# Latest delivery: v8.0.44 — Stage Clear celebration + post C1-2 tutorial recovery

Stage Clear: responsive portrait/landscape, existing hero cheer, two new built-in ImageGen assets (quiet plum strawberry clearing + pale-gold reward frame), frame15-slice preserving corners/centre crest, Sugar/best gear/material highlights, permanent EXP/Power growth, optional paged Run/Loot/Stars and Bestiary link. Primary honest Lobby/Delve/final-summary action; secondary ad with stale-owner guard. Sub-second-ish reward reveals/short EXP, tap-empty reveals immediately, reduced-motion stills/cleanup. Collected boxes granted once by unchanged openRunBoxes, displayed in results rather than separate opening screen. First-time story/important chapter endings kept; ordinary seen recap skips on replay, marker saved only on arrival at results. Quit keeps distinct presentation, corrected growth snapshots and no stale stars/mastery. No battle/reward balance changes.

Post C1-2 tutorial loop: old regex missed captured-route Power Forge entry and selected starter/locked/no-FP gear bounced between Equipment and Upgrade. Tag routing, eligible focus, direct Forge resume, nonblocking wait when no eligible item; one-time gift preserved. Forge internal rebuild reapplies mod spotlight; failed payment cannot complete lesson. Existing iLv/rarity caps retained. Tests cover route/focus/no-gear/no-FP recovery, paged details/all loot, late callbacks/ads/reduced motion, source hashes. scripts/build-results-review.mjs and check-results-live-ui.cjs render production UI only, no combat. Assets/provenance: assets/art/stage_clear and assets/incoming/stage_clear44/PROMPTS.json; mechanical pack-stage-clear.py. Owner phone visual/gameplay review pending.

# Latest delivery: v8.0.43 — Sniper charge +20%

Owner requested both automatic charge and held Unique stronger. Sniper seed multiplier3.2→3.84 (current Basic), manual beam base×1.2 including split/Railgun scaling. Partial/full charge both+20%; same charge time/CD, ranks/Talents/Evolution scaling, pierce and other builds. Updated Build description and strawberry-builds expected values plus partial/full/evolved/card regression. Cocoa isolation snapshot updated only for the new Sniper description; legacy fallback unchanged. v8.0.42 outline fix retained. Owner phone balance review pending.

# Latest delivery: v8.0.42 — Player outline depth fix

Pale silhouette copied the prior frame depth before isometric Y sorting, so walking upward placed it over the player. tickPlayerReadability now runs after current player depth and shadow updates, retaining current pose/frame/transform and reusing both sprites. Regression executes the production presentation sequence across upward/downward/stationary movement, negative Y and non-iso, checking outline/ring depth and pose parity. No assets, physics or balance changes. Owner phone visual review pending; no local gameplay simulation/screenshots.

# Latest delivery: v8.0.41 — Stories for all15 campaign bosses

BOSS_STORIES15 canon-linked profiles (past/motive/goal/intro/2battle lines/final words). First encounter before existing bossIntro gets a single opaque black theatrical scene with existing boss sprite/optional idle/bob, Ruby memory and boss quote, explicit Fight/Skip; saves bossStoriesSeen only on valid explicit continuation, never cancellation. Replays bypass automatically; defeated bosses have Read story in Bestiary (includes aftermath, no Tier3 grind). storyVoice excludes tutorial/Delve/Rift/BossRush/Pinnacle; miniboss dialogue kept. Modal physics pause/resume, pointer debounce/ownership, player/stage/epoch/dead guards, tween/sprite/scene/exit/death cleanup; reduced motion stills. Generic C3 intro no longer repeats Frost Prison hints. Existing boss reveal timings/AI/rewards/difficulty, campaign epilogues, hero unlocks and canon unchanged. No new image/audio assets. docs/BOSS_STORIES.md; tests/boss-stories added (15 identities,180 layouts, seen/skip/replay/special-mode/lifecycle). Owner phone visual/readability/story review pending; no local gameplay simulation/screenshots.

# Latest delivery: v8.0.40 — Mint Lance Burst endpoint fix

Owner reports Crystal Impaler card “Ice blast at the end” absent. Frost Lance completion used only generic hit ring and returned permanently on last-frame non-play overlay. Added finishFrostLance one-shot completion with pending resume, owned player/basic/epoch/death/menu guards and clearArtVfx cleanup; finisher runs once even if it opens a card overlay. frostLanceBlast uses forced existing fx_mint_shatter at220px (110px radius), including empty endpoint/Low VFX; existing shatter SFX, same damage .6*(1+.5*rank)*cast damage, phase exclusions, scoped unique/damage-number context restored with finally. No new assets, no damage/range buffs. tests/mint-storm-shards exercises rank0/1/2, empty/immune/outside, repeated callback, pause/card and finisher-induced card deferral, canceled runs. Phone visual review pending; no local gameplay simulation/screenshots.

# Latest delivery: v8.0.39 — ElevenLabs audio orders A01–A05 (SFX)

139 original ElevenLabs SFX v2 donors with exact prompts/response ids, mechanical packed mono44.1k128kbps MP3, measured decoded true peak<=-1dBTP/onset<5ms/target duration; source/final/QA manifests per incoming/audio kit. Runtime assets/audio/{menu_progress,battle_events,yuzu,story_music,voices}, literal ASSET_AUDIO paths. Menu/event/companion/story/wordless voice hooks use existing Sfx and volume/mute/throttle, menu max2 cues, global voice .14s minimum, Settings Character Voices toggle. Arena loops restart from simulation ticks, stop on pause/clear/death/mute/zero volume; Yuzu sounds only decoded for selected Yuzu. Owner enabled Sound Effects ONLY: six A04 background music tracks pending Music Generation permission, existing music retained. No new synthesis by code, no Runway. Subjective phone listening required (especially voice consistency/short transient crops); no gameplay simulation/screenshots. Reproduce scripts/prepare-audio-orders.py, generate-elevenlabs-orders.py (uses fresh Windows User credential, never tracked), pack-elevenlabs-orders.py; audio-orders contract added to npm check.

# Latest delivery: v8.0.38 — Yuzu Citrus Companions

Owner approved docs/YUZU_COMPANIONS.md: one Yuzling before Build, then Pomelo/Lime/Blood Orange (saved path ids citrusGuardian/zestSwarm/juiceWorkshop). Yuzu seed shots; owned HP/down5s/touch revive/Dash; Pomelo sweep/taunt/slam/own-kill growth3/roll, Lime first-arrow guaranteed crit/long-range bonus/volley/trap, Blood Orange homing2-bounce orbs/aura/Sweet→Sour→Spicy. Per-path Unique, five core/fifteen path cards/four Mutations/three Evolutions/six Unique Mutations/thirty path Talents reworked; saved ids/point allocations retained. No extra mob spawns or EXP changes. Seven ImageGen alpha sheets40frames (lossless256px) under assets/art/yuzu_companions, original donors/prompts/QA under incoming; scripts/pack-yuzu-companions.py. 48shot/10zone/8effect caps, swept collision and pooled target identity, central damage/procs, owned cleanup. Tests yuzu-companions plus full suite; owner phone balance/FPS review pending. Audio must use ElevenLabs directly per owner: semantic yz hooks and revised A03 order ready, no new audio generated yet; waiting API connection. Do not use Runway or procedural audio as a substitute.

# Latest delivery: v8.0.37 — Taro Arc nerf (owner: too strong + too fast)

taroCombatProfile base storm {dmg .75→.6, cd 1→1.25}: Arc primaryDamage −20%, cast interval ×1.25 (rate −20%). Jump growth (≤×1.6), roots/victims, loop-back 60%, boss focus, Double Arc, shrapnel unchanged. Spark/Sentry untouched. tests/taro-foundation expects .6. Owner phone check pending.

# Previous delivery: v8.0.36 — remove wave Bonus Challenges

Owner explicitly requested removing hidden Bonus Challenges entirely. Removed speed/hit/kill challenge state, timers, hurt/kill hooks, random Relic/currency payouts, failure Elite ambushes and bonus HUD/layout. Main objective rewards/EXP/heal, Hunt targets and optional Supply Cache / Sugar Courier events retained. story-missions regression now rejects challenge payouts/ambushes and checks removed hooks; hunt recovery stub cleaned. Phone gameplay remains owner review.

# Latest delivery: v8.0.35 — combat readability polish

Seven ImageGen alpha sprites (68,324bytes) in assets/art/combat_readability; donors/prompts/revision/QA in incoming/combat_readability; scripts/pack-combat-readability.py. Hostile bolt uses same128x128 physics texture frame/scale/life/damage/velocity. Shared circular spawnHazard warnings gain exact-radius clear-center rim and760ms countdown arc; original r+8 damage/timing retained, themed art dimmed beneath. Player gets reused foot marker/5.5% silhouette outline; at most12Elite crests and10transient windup/crit sparks, central clearArtVfx/pool cleanup. Large friendly animated VFX opacity capped.68 (selected huge boss overlays.58), persistent Mint snow.62. Common gear/currency glow quieter, no beams; rarer gear retains beam plus small glint. Critical numbers throttled90ms/160ms dense, smaller stroke/scale/lifetime, painted spark replaces emoji; forced numbers preserved. No balance/rewards/colliders changed. tests/combat-readability added to npm check. Owner phone visual/FPS review pending, no local gameplay/screenshots.

# Latest delivery: v8.0.34 — ImageGen menu art50–54 integrated

44 source-verified half-size WebP sheets/143frames (797,626bytes) in assets/art/menu_orders; reproduce scripts/pack-menu-orders-50-54.py. Literal ASSET_IMAGES paths for build hashing; MENU_ORDER_ART + TEMPLE_UI cells/slices. Menu-group lazy loading, menu-only classification and eviction; Login popup retries after eviction. Hooks: Equipment/Merge rarity frames and Merge beams; Forge points/action icons and lucky/star/hammer FX; Login panel/cells/rewards/stamp/halo; Daily boxes/leaves/pips/reroll; Awards medals/stars/secrets/ribbon/claim FX plus Lobby title; Bestiary empty portrait cards/tiers/weak icon/detail and Recipe page/chips/unknown/seal; Depths lantern/light/badges/miner plus Rank10 icons/Lobby miner. Paper ink/layout adapted. Animation timers removed on image/container destruction, reduced motion stills. Existing gameplay/rewards/tap zones retained. tests/menu-orders-art covers44source hashes/half-size cells/slices/lazy isolation/timer lifecycle; included npm check. Owner phone visual/FPS review pending. Source kits/provenance preserved.

# Art delivery48 - C1/C2 boss arena source kit

12 ImageGen source sheets /52frames complete under assets/incoming/boss_arena_c1_c2/.11black VFX +1true-alpha ice pillar; 13donors include the initial hot warning and a brighter rim edit. Exact dimensions/frames/anchors/ground and phases, source/preview hashes, center-alpha/seam QA, mechanical crop/periodic packing logs, all-frame/GIF and real-floor source compositions retained. Half-size preview WebPs558,292bytes;3.15625MiB decoded combined (per-stage loading intended). Fog source edges exact in both axes, bands horizontally. Source only: no runtime/version/gameplay edits. Integrator must also load shared b06 shield in stage9; pillar needs explicit stage3. Follow order48 and runtime suggestions, retain code fallback and all original hit tests/timings. No live gameplay/FPS claim.

# Latest delivery: v8.0.33 — Forge Points (owner: Last Epoch part, step 2)

Random Forge removed (randomCraftSelected/forgeSpin/chooseForgeSustain/forgeKeepCurrent/autoRollToTarget/divineFocusedLine, choices panel). Globals after forgeGlazeCost: FP_MAX {common 8, rare 14, epic 20, legend 26}, FP_ADD 4, FP_SWAP 5, FP_REMOVE 1, FP_LUCKY .15, FORGE_DROP_MUL .5; gearFP(item) (item.fp, missing = full), fpStarCost(s)=s+1, tierForStar (best tier of a star band), forgeStarCap (stars of affixBestTierForItem), makeAffixAtStar (tier clamped to the iLv best, value rolled inside that tier). forgeAct(kind) add (empty row + this.forgePick, Twist Cream 1) / swap (keeps the old star) / up (Crystal Glaze 1, ★ cap by iLv) / remove (free): checks points then currency with banners, 15% lucky (not remove) keeps points, saves, rebuilds. _buildCraftBenchRaw: summary '🔨 fp/max · Rarity · iLv', pool rows = tap to pick (tag pick_<id>, 'max ★N' / 'now'), footer unlock / locked_line / add / swap + pick_cancel / up + remove; rows closed by rarity say 'Merge to open'; old saves' forgeChoice refunded once on open. mergeGear deletes item.fp (refill). grantCurrencyReward ×FORGE_DROP_MUL with random rounding. Gear tutorial step 3: pick_ row then forgeAct add/swap. Tests: affix-sound (forgeAct costs/lucky/guards), forge-150, gear-level-limits, forge-redesign rewritten; check-forge-live-ui + build-forge-review use forgeAct.

# Previous delivery: v8.0.32 — Gear Merge (owner: Survivor-style merge + Last Epoch forge, step 1)

Rarity now per item: RAR_LINES {start 0, common 1, rare 2, epic 3, legend 3}, GRADE_NEXT, gearGrade(item) (item.grade, else base.tier). forgeLineOpen = iLv cap (affixCountCap) AND line < RAR_LINES[grade] (a line that already holds a mod stays open; items with no grade/base = no rarity limit). gearBaseStats quality and affixBestTierForItem use the item grade. Save.mergeCanMain / mergeFodder (same slot + grade, not equipped/locked/favorite/forgeChoice/starter, cheapest first) / mergeCarryOptions (fodder mods whose row fits an empty open line of the result) / mergeGear(main,[f1,f2],carry): grade +1, iLv + enhanceLv = max of the 3, carried mod via forgeSetLines, fodder removed, d.merges++. buildMerge (route 'merge', NAV_WRAP, nav tab gLoadout, FEATURE_OPEN merge 2): MAIN + 2 material cards (‹ › cycles mergeable mains), RESULT box (rarity, iLv, mod slots, 'More slots at iLv …'), KEEP 1 MOD rows, materials grid, '🔗 Merge → X' (tags merge_go / merge_f_<uid> / merge_mod_<id> / merge_slot_k / merge_prev|next); mergeNow flies the materials into MAIN then flash + banner. Entries: Equipment row 2 Craft | 🔗 Merge n/2 (dot when ready) | Salvage, Power page 4th tile. tests/gear-merge added; forge-redesign test items now epic. Next: v8.0.33 Forge Points (FP 8/14/20/26, pick mods, star up, lucky 15%, remove random roll).

# Previous delivery: v8.0.31 — Power page A + C (owner)

powerTips: every card scored by simulated heroPower gain (save restored after each try): gear (best bag item per slot), Weave (per core, buy as many levels as Sugar allows ≤TAL_MAX → total gain, 'Weave X ×n · Your Sugar buys n levels · 🍬cost'), Talent (best affordable core node incl. parent rule → 'Talent: name'), Enhance (+ 'may drop a level on a miss' from +3); sorted by gain, top 3. Non-Power items → top.wait: Mail, Rank reward, Talent only on Build trees, Weave Rank up → 'WAITING' pill row (tags wait_<k>, red dots). Forge tip removed. buildGearPower (C): this._pwShown {cid,v}; when Power rose since the last view the number counts up 900ms, bar fills from the old ratio, '+N ⚡' pops beside the final number, Sfx.progress('core'). tests/power-summary updated.

# Previous delivery: v8.0.30 — Bestiary 3 tiers + weak spots (owner)

BESTIARY_THRESHOLDS [1,100,1000], bestiaryTiers(id) bosses/minis [1,5,25], BEST_MAX_TIER 3, BEST_TIER_SUGAR [30,80,200] (addKill pays per tier crossed). FIELD_CODEX (after bestiaryLv) adds C1-2…C2-5 field species 'f<stage>_<bestSlug(roleName)>' (C2 ones carry their c2N_*_animated tex, emoji fallback in menus); every entry gets role/lore (BEST_ROLE_LORE tips, boss/mini lines), stage and ord (sorted by stage, field → mini → boss); BESTIARY_IDS. Scene.bestiaryKey(e) (cached _bk/_bkS/_bkR; stage 1–9 roleName → field id, else old type logic) used by killEnemy; first kill → this._newSpecies. bestWeakMul(e) = BEST_WEAK_MUL 1.05 when the species is tier 3 (this._bestW built in startStage), applied inside condDmgMul (damage() itself unchanged). Summary: row '📖 New! Monsters found' (tap → continueFromSummary(id) → bestiary with _bestFocus/_bestSel; not on last-stage/Delve). buildBestiary rewritten: 2×6 cards (??? until met, 3 tier pips, next goal / weak spot), tap → detail panel (tiers + Sugar, note + weak spot or lock), tags best_<id>/best_close. tests/bestiary added.

# Previous delivery: v8.0.29 — Recipe Book (owner)

Codex screen titled 'Recipe Book'; first tab '📖 Builds' (old 'weapons' tab id maps to 'builds'; buildWeaponCodex now unused). recipeCards(hero,path) (before applyPathTalents) = BASIC_PATHS upgrades + UNIQUE_MUTS[path] ('uq:<id>'); recipeSeen → Save.data.recipeBook[hero][path] {cardId:1,_path,_done}. recipeNote(c) after mxPick in pickCardAt: Build Path pick marks _path, path/Unique Mutation picks mark the id (WIP heroes and tutorial skipped); all found → _done + Save.addThreads(RECIPE_PATH_THREAD 30) + banner. buildRecipeBook(top): hero chips (awHeroList with BASIC_PATHS, n/all) tags rb_hero_<h> · 3 Build chips tags rb_path_<id> · card rows (icon/name/headline + ✓, unseen '???'). HUB_GROUPS/FEATURE_NAME/FEAT_LINE say Recipe Book. tests/recipe-book added.

# Previous delivery: v8.0.28 — Awards Claim all, secrets, hero rows (owner)

awardList adds 7 secret:true awards (tiers [1] → title): story sec_week (loginCal.n≥7) · sec_deep (dig.best≥20) · combat sec_close (win ≤5% HP) · sec_x4 (win at gameSpeed 4) · collect sec_sugar (≥100k) · sec_silver (Legend from Silver Chest) · sec_titles (3 titles). Save.data.secrets {x4,close,silverLegend} set in Stats.end win / openChest. awHidden(a,d) → row '??? Secret award', excluded from ALMOST THERE and awFrames. awClaimAll(): loops every ready step except Gold Chest steps (r.chest stops that award), one banner with totals; button '🎁 Claim all (n)' tag aw_claim_all under the top row. Heroes tab: hw_/hb_ grouped per hero (tag aw_hero_<h>, this._awOpen expands the two rows indented). Art order 49 docs/art_orders/49_PROFILE_FRAMES.md (pf_frame_story/heroes/combat/collect 520×150 9-slice) awaits art. tests/awards extended.

# Previous delivery: v8.0.27 — Temple Depths thinking + shovels (owner)

digTable drops stone/scroll (weight → thread 54+.6·depth; DIG_ITEMS/resolve kept for old boards). buildDig: this._digLadder {x,y,N} while the ladder is unfound → drawDigCell (cont._i) shows the Chebyshev distance on dug empty/taken tiles (1 red · 2 orange · 3 yellow · 4+ blue; old 🌬️ draft only as fallback). 3 buttons: Daily/shop · 🔦 Light (d.lightUsed≠depth = free, toggles this._digLight; next tap → digLightAt(i): c.peek on the 3×3 unopened tiles, shown faint over the soil, no shovel) · ladder. Legend text updated. DIG_SHOP_DAILY_LIMIT 3→1. Shovels: Daily boxes [3,4,6] (all 3, after stage 2), AW_REWARD ★1 +2 ★2 +2 ★3 +3 (awClaim + preview), stage clear diff+2. Lobby: '🧶 +N ready' pill under the Thread pill while Save.minersReady() (tag miners_collect → minersCollect). tests/depths-polish added.

# Previous delivery: v8.0.26 — Power summary page (owner)

buildGearPower (gLoadout) rewritten: title 'Power'; panel = powerStatus(next ready stage from unlockedStage) cur vs Recommended + bar + label + 'N Power to go'; 'BEST WAYS TO GET STRONGER' = powerTips() top 3 (gear: sum of best gearPowerDelta per slot · weave: best talCanBuy core by simulated +1 level heroPower gain (upgrades restored) or Rank up when all max · tal: free TP (pri 30) · perk: rankUnpicked (26) · enh: equipped item with Thread for next +1, simulated gain · mail: inbox (15) · forge: has currency (6); score = gain or pri), tap → that page (enh sets gearSelectedUid), tags tip_<k>; bottom buttons Weave(upgrade)/Equipment(gear)/Forge(craft) keep tags + badges (Weave tour still finds 'upgrade'). Bazaar removed from this page. tests/power-summary added. scripts/check-gear-power-ui.cjs (old card art review, not in CI) is now stale.

# Previous delivery: v8.0.25 — Bazaar 3 tabs (owner)

buildBazaar tabs chests/shop/trade (old ids map TAB={buy,orders→shop, gamble→chests, sell→trade}). buildChestShop = Silver · Gold (pity line '🌟 N more opens → guaranteed Legend' + 10 pips) · Sugar Chest (= openGachaReveal, iLv band chip tag sugar_band, tag chest_sugar; Sugar chest now counts chestsOpened + DailyQ 'chest', Collect returns to Bazaar chests). bazaarStock = 4 gear (slot 0 = bazaarWeakSlot(): lowest equipped itemLevel+tier+enhance, empty = weakest → rec index, card '⭐ … Recommended · your weakest slot') + 2 materials. Save.bazaarFreeRefresh() (d.bazaarFreeDay vs bazaarDaySeed) → refreshBazaar uses it first ('🔄 Refresh · FREE' + dot), then the old 60/120/240 paid ones. Trade tab = Trade-in card + sell list. Lobby Bazaar default tab chests. tests/bazaar-tabs added; progression-polish uses the new tabs.

# Previous delivery: v8.0.24 — 7-day login calendar (owner)

LOGIN_CAL (before POWER_TUNING) 7 rows sugar 150 · thread 20 · cur 3 random CURRENCY · silver · thread 30 · sugar 600 · gold; Sugar ×(1+.5·chapter). LoginCal {data → Save.data.loginCal {i next index, last dayKey, n}, ready = last≠today, claim → {r,i,lines,chest}} (missed days never reset; after day 7 i wraps to 0; DailyQ muted). loginPopup(from) (before starTeach): first Lobby of the day (buildLobby delayedCall 700) or Daily page; waits (retry 1.5s) for Ruby/feature reveal/Weave tour/gearTut 0–1/book; 7 cells (4+3, day 7 wide), today pulses, full-screen zone tag login_claim → chest days openChest(c,'login') (_chestBack 'hub', not counted in chestsOpened) else lines on the button + login_close. starTeach waits for _loginC. buildDaily drops the old login panel (quests only). Badge daily = LoginCal.ready() || DailyQ.claimable. tests/login-calendar added; progress-sound drops the old daily claim case.

# Previous delivery: v8.0.23 — New Awards (owner)

awardList() (before ACHIEVEMENTS, which stays only for old-save ids): AW_CATS story/heroes/combat/collect · Story ch1–3 clears [1..5], stars1–3 [3,6,9,12,15], rank, pinnacle · Heroes per owned non-WIP hero hw_<h> wins [1,5,15,30,60] + hb_<h> Builds won [1,2,3], roster · Combat kills, bosses (bestiary boss\d+), minis, kicks (Save.data.kicks at counter launch), uniques (Save.data.uniqueCasts in uniqueCastFx) · Collection gear, legend, chests (d.chestsOpened in openChest, not gift/weekly), bestiary. Save.data.heroWins[h]={wins,builds} from Stats.end win (g.character, basicAttack.path). awReached/awClaimed (d.awards[id] = tiers claimed) · AW_REWARD ★1 🍬80 · ★2 🧶20 · ★3 🍬200+🧶25 · ★4 free Gold Chest (openChest(gold,'gift') → Collect returns to Awards) · last ★ 🧶60 + title (d.titles, d.title). awFrames = categories with any fully claimed award → d.frame. buildAchievements: ★ total, title chip + frame chip (tap cycles), ALMOST THERE (3 nearest unclaimed by %), 4 tabs with dots, rows (colour stripe, stars, bar, next goal, Claim + reward preview). awClaim mutes DailyQ. Lobby profile: 'Rank N · Title' + coloured frame stroke. Badge 'achievements' = awReady. tests/awards added; progress-sound keeps only the daily claim case.

# Previous delivery: v8.0.22 — Rank Rewards (owner: merge Rank Perk + Special Core)

RANK_REWARDS (replaces the SPECIAL_CORES apply; SPECIAL_CORES kept only for refunds): ranks 1–5 × 2 options — Blink −15% dash cd / Signature −12% Unique cd · Revival Candle / Last Stand −25% taken <30% HP · Swift Feet +10% speed / Feast +2 HP per kill · Flash Step −20% dash cd / Encore −18% Unique cd · Giant Slayer +20% boss dmg / Keen Eye +8% crit. Save.data.rankPick {rank: id}; Save.rankPick/rankHas/setRankPick (rank-gated, switch free)/rankUnpicked. applySpecialCores(p) now applies active picks. rankAutoBonus(rank) = Sugar +5%/rank (≤40%), crafting currency +5%/rank (≤25%) → rankSugarMul/_currencyLuckMul; _boxLuckMul = 1. _reviveLeft uses rankHas('revive'). Load migration _rrMig: refunds Special Core Thread (base·n(n+1)/2), clears specialCores + rankPerks, old Revival Candle → rank 2 pick (RP stays only for Kitchen slots). Temple tabs: Rank Rewards · Depths (2 tabs). buildRankPerks = Rank Rewards rows (tier banner per rank, 2 cards, glow when unpicked, red dot) + Ancient section; reset button, Special Cores tab/page and Save special-core buy methods removed. Badge 'perks' = unpicked rank. tests: rank-rewards added, special-cores + special-core-layout removed, progress-sound drops the core-buy marker.

# Previous delivery: v8.0.21 — Art order 48 wired (C1–C2 boss arena)

scripts/pack-boss-arena-c1-c2.py (sha/bytes vs assets/incoming/boss_arena_c1_c2/MANIFEST, copies the delivered 50% WebP packs, same lum-alpha pipeline as order 30; pillar keeps alpha) → assets/art/boss_vfx/ 11 + assets/art/counters/arena_b04_ice_pillar (558 KB). ASSET_FX at half size; stage loop regex now /^(?:vfx|arena)_b(\d\d)_/ and vfx_b06_pod_shield also goes to STAGE_SHEETS[9]. Hooks (all keep the old graphics): antTunnel shadow sprites (fake = alpha .55 + grey tint, pulse keeps display scale) + bossSig 01_burrow_burst on the real eruption · Sewer Flood / Root Surge arenaSweep art · Hot Grid arenaGrid art · arenaPillars: invisible rect keeps geometry, arena_b04 sprite (origin .5/.9375, y+35) frames 1→2→3 + fade when it blocks; frost_breath sprite grows like the old circle then plays frames 1–3 · arenaPods: shield sprite follows the boss while _podShield>0 · arenaFog: tileSprite fog (frame by time, world-anchored tilePosition) + bubble sprites at r·2.1 · arenaHands: hand sprites origin (0,.5) rotated per hand. tests/boss-arena-art (in npm check). Real-browser: stages 0/1/2/3/5/6/8/9 × 2 phases with art loaded, 0 errors.

# Previous delivery: v8.0.20 — New Daily Quests (owner)

DQ_POOL rows {id,k (tick kind),b (0 easy/1 medium/2 hard),target,go,req}; DQ_BAND picks 4/4/2 (seeded dqPick, no duplicate kind inside a band); dqDef('win_<hero>') builds 'Clear a stage with <hero>' (medium, only when ≥2 non-WIP heroes via dqHeroes). DQ_BOXES by done count 3/6/8 (DailyQ.count; pts() = count). DailyQ.reroll(i): 1 free per day (q.rr), same band, not finished. Weekly Save.data.dqWeek {wk Monday key, days, got}: a day is added when count ≥ DQ_WEEK_NEED 8; 7 days → Gold Chest via openChest(gold,'weekly') (no Thread, no free-silver use; _chestBack returns Collect to Daily). Old dailyQ without v:2 regenerates. New tick kinds: unique (uniqueCastFx), dash (dashPress = Dash button), kick (counter launched), star3 (evalStageStars mask 7), chest (openChest), objective (completeWaveObjective, story, not the fill→hunt step), win_<hero> (Stats.end win). buildDaily: login panel 68px, Today panel with bar + 3 boxes + Week strip + gold chest, 10 compact rows (band colour stripe, 🔄 button while the reroll is unused). tests/daily-quests rewritten.

# Previous delivery: v8.0.19 — Gear from the Bazaar, Delve after the story, chest lesson (owner)

grantGear: non-gacha/non-trade Story drops (field boxes, stage-end boxes, wheel/boss gear) get affixes [] + craftState common while !Save.data._craftTutGift && storyCleared()<3 (chests/gacha keep 0–1 mod). earlyLootMul .45→.25 (Story stageIndex<5). featureOpen('recipes') = Save.endgameUnlocked() → Activities hides Recipe Maps until the story is done. applyGearTut step 0: gift CHESTS[0].cost Thread (was gacha Sugar), Bazaar tab forced to 'chests', zone = tag chest_silver (fallback /openChest\(/), label 'Open a Silver Chest for a new item!'.

# Previous delivery: v8.0.18 — Fairer missions, livelier Ruby, Momo hits, counters (owner)

completeWaveObjective: zoneObj (purge/capture/cleanAir/breakRoots/defendNectar) → Sugar bonus ×1.5 + heal 20% max HP (banner '· ❤️ +20%'). captureBleed(dt,inside,o) after tickCaptureFX in the capture tick: o._out starts −2 (4.5s to reach the ring), bleed from 2.5s outside, stacks 1+floor((out−2.5)/1.5) ≤10, maxhp·.004·stack per .5s (same as Escort), inside → out decays ×4; banner once. spawnCounter: life 6→10, non-drift counters pushed to ≥260px from the boss (toward the player if on top of it); arenaPods life 8→11. castBerryBlaster power ×1.15 for sniper/shotgun. rubyReact(c,av,m,…) replaces the stiff avatar bob in rubyNext: alert = squash-jump + shake + '!' pop + box shake; happy/cheer = double hop; sad = droop; else squash breathing.

# Previous delivery: v8.0.17 — Heavier boss kills, Unique glow, Dash squash (owner)

killSlowmo(power) from the top of killEnemy for active boss (1) / mini (.6): _slowmo + _isHitStop guard, physics.world.timeScale 12 + tweens.timeScale .04 for 90+30·power ms (camera flash 110ms), then physics 1/(gs·.35) + tweens gs·.35 for 380+320·power ms, then setGameSpeed(gameSpeed) — real-time setTimeout so it does not depend on x1–x4 or scene timers. uniqueReadyGlow(g,b,col) from drawUniqueRing's ready branch: pulsing outer/inner rings, 2 orbiting white sparkles, one-shot expanding white ring for 600ms after it becomes ready (_uqReadyAt reset while on cooldown). dashPress() from the Dash-button tap (before doDash, state play; doDash text unchanged for the legacy hash tests): dashBtn/dashTxt scale .8 → 1 (Back.out 240ms, dashTxt keeps ctrlScale). Boss HP ghost now holds 180ms and shrinks ×.22/frame (was 380/.08). Mission card block moved down 8px (D in drawCombatHUDPanels: timeTxt, pips, objective, card, replay meter).

# Previous delivery: v8.0.16 — Punchier battle HUD (owner picked 1–5)

hudJuice() from drawBars: killTxt/runSugarTxt digits change → scale 1→1.3 yoyo 70ms; survive objective with waveTimer<5 → waveObjTxt blinks #ff4d5e/#ffd0d4 every 220ms (colour cached in T._jc, restores o.color). liquidTube(…,o) gains palettes 2/3 (boss ≤50% / ≤25%: darker reds, flow ×1.5 / ×2.2) and o.ghost: boss uses faster smoothing (.35) plus ghost {v,hitAt,last} — white strip from current fill to the old value, holds 380ms after the last drop then shrinks ×.08/frame, resets when HP rises/boss hidden. speedPopup() on the speed-button tap: big 'xN ⏩' text at H·.38, Back.out pop then fade up (reused object, depth 70). No gameplay changes.

# Previous delivery: v8.0.15 — Liquid boss bar, mission pop, fitted top bar, boss skull (owner picked 1–4)

drawLiquidBar → liquidTube(g,L,frac,key,pal,pop) shared drawer (pal 0 aqua-green mission, 1 pink-red boss). Boss: hudBossLiqG at bossBgW (x−w/2, y, w, h 8; bg y+16, rects alpha 0), frac bossBar.width/(bgW−4). completeWaveObjective sets _liqPop → 750ms ripple (amp .8→3.4, faster wave) + white flash + expanding glow ring, drawn from _liqLast even after the objective HUD clears. Top island width _hudTopW = sugar right edge (kill end +28+sugar width) +4, step 4, ≤ w−152; runSugarTxt right-aligned there; art hud_top_panel uses it. drawWavePips end marker = _bossPipImg (hud_ic_kill 12px tinted 0xff8fb0, else 💀 text; in hudList, hidden on early return/hudVisible(false)). Combat HUD check 4 sizes passed.

# Previous delivery: v8.0.14 — Flowing mission bar (owner)

drawLiquidBar() from drawBars (graphics hudLiqG depth 53, camUI, hidden with hudVisible(false)): rounded tube r3 at this._liq {x,y,w,h 10} (set in drawCombatHUDPanels objective branch; mw=min(230,w−84)), fill = waveObjBar.width/mw eased ×.12, teal base 0x1fb5a8 + light top 0x52e3b8, moving diagonal stripes, sine surface line, 3 bubbles, glowing head; waveObjBg/Bar rects alpha 0 (still drive state). Mission card = one centred backing from y40 sized to content (wave row / mission text / bar +32, ≤ w−24) holding the wave title + pips row: timeTxt centred with pips right of it (this._pipX0/_pipY → drawWavePips seg 10, h 6; drawWavePips re-run on layout change). renderBonusHUD keeps text/state but never shows the line (bonus still counts/rewards). Combat HUD check 4 sizes passed.

# Previous delivery: v8.0.13 — Minimal ImageGen battle HUD

Four new text-free ImageGen donors in assets/incoming/battle_hud_minimal/ create soft plum glass with thin cream rims, small sugar glints, rose boss accent and mint active button state. Mechanically packed to four sibling WebPs (24,016 bytes) in assets/art/hud_minimal/; original art47 source/runtime files retained. Existing four HUD keys map to these files, with new matching nineSlice values. hudArtSync places cached stat/mission/boss panels behind live text and bars; compact8.0.12 geometry, stage-lazy registration, code fallback and hit targets preserved. Boss title inset accommodates the tiny candy accent. No gameplay changes or boot additions. Full npm check and build passed, original/packed alpha/dimensions/hash/decode QA passed. No new live screenshots or phone FPS/touch claim; owner reviews on phone.

# Previous delivery: v8.0.12 — Compact battle HUD

Removed ornamental full-width header, counter/level frames and boss frame from runtime composition; retained painted small counter and control icons. Level/kills/Sugar share a 29px glass island, quick-control hit circles unchanged. Wave title and tiny pips share one row. Mission text has a narrow backing and 3px progress fill; bonus is a short separate line. Boss name and numeric HP share a row above a 4px bar in a 29px strip. Dynamic height follows visible objective/bonus/replay rows, with relic/trait lines below. Layout/text fits cache by display state to avoid rasterizing text every frame; resize invalidates cache. No combat balance, touch routing or extra boot assets changed. Existing Canvas review expanded to boss+mission and large counters at four sizes; full npm check and build passed. Screens: docs/reviews/combat_hud/ (offline production-renderer review; phone FPS/touch not asserted).

# Previous delivery: v8.0.11 — Cleaner battle top (owner: top looked cluttered, no top EXP bar)

Header is one row (10,8,w−20,40): lvlTxt (22,19) · killTxt after the Lv badge (y21) · runSugarTxt right-aligned at w−140 (left of the speed button) · buttons unchanged (cbY). Top EXP bar + xpIcon removed in both art and code modes (EXP stays under the player); stageTxt kept at alpha 0 (title curtain/Pause show the stage). Everything below moved up 22: HUD_ROWS {objective 69, progress 104, bossName 131, bossBg 149, bossBar 151, bossHp 156} (boss rows shift with the plate: plate y = card bottom+6, so a miniboss during an objective sits under the card), timeTxt 52, wave pips pad+58, mission bar 103/104, bonus 114, card bottom 133 (81 without objective), statTxt under the card or plate. Mission card = plain dark .62 rounded rect (hud_mission_card art no longer drawn); hud_exp_frame/fill unused. Combat HUD check 4 sizes × 5 states passed.

# Previous delivery: v8.0.10 — Art order 47 battle HUD wired (owner)

scripts/pack-battle-hud-top.py (sha/bytes vs assets/incoming/battle_hud_top/MANIFEST, 50% WebP q88) → assets/art/hud/ (18 files, 45 KB). HUD_KEYS pushed into every STAGE_SHEETS (stage-lazy, not boot); TEMPLE_UI cells/nineSlice halved. hudArtSync() from drawBars (checks realTex of all HUD_KEYS once per second; missing/evicted → hudArtClear restores the code HUD): containers hudArtC (depth 50.5, in hudList) / hudBtnC (58.5) hold tuPanel top panel / mission card / boss plate / EXP frame + cropped fill / mission bar (fill tinted by waveObjBar colour, rects alpha 0) / boss bar (crop by bossBar.width) / Lv badge (lvlTxt dark) / kill + Sugar pills with icons ('KOs '/'🍬 ' prefixes stripped while art is on). drawWavePips → hudPipsArt (done/current/upcoming frames). Buttons: hud_round_btn (frame 1 when speed>1, 2 for 140ms after a press via _hudPress), hud_speed_ring frame gameSpeed−1, hud_ic_pause (▶ text while paused), hud_ic_sound frame by Sfx.muted; circles alpha 0, hit areas unchanged. tests/battle-hud-art (in npm check); combat HUD review loads the art (?noart for the old look). Real-browser 4 sizes × 5 states + boss shot, 0 errors.

# Previous delivery: v8.0.9 — Mint Lance Charges (owner)

Crystal Impaler card l_twin (id kept for saves) Twin Lance → Lance Charges: max 2 ranks, headline '+1 Unique charge'. lanceChMax() (after mintLv) = 1+min(2,l_twin) on Mint pierce path, else 1. tickLanceCharges(dt) from update after the uniqueCd decrement: while the Unique is ready (uniqueCd≤0) and _lnBank < max−1, _lnT counts up to uniqueCooldown → _lnBank+1. releaseFrostLance: old 2s second-dash window removed; if a banked charge exists → _lnBank−1 and uniqueCd .35 (instant re-use), else the normal full cd from mintUniqueStart. drawUniqueRing draws max pips above the button (filled = ready + banked). _lnBank/_lnT reset with _uqUses. Fixture cocoa-rework-baseline l_twin text updated. Real-browser: max 3, banked 2 → 3 dashes (cd .35, .35, 9.4), 0 errors.

# Previous delivery: v8.0.8 — Art order 46 wired (owner)

scripts/pack-story-shot-redo.py (sha/bytes vs assets/incoming/story_shot_redo/MANIFEST, 50% WebP q84) → assets/art/story/ cs_s00_far_city_night (540×960, 138 KB), cs_s01_far_roots_burst (76 KB), cs_fx_root_burst (6×270, ASSET_FX rate 10, 126 KB); menu-lazy like order 45. S00 shot 3 = painted night city (crown painted, puppet removed; tint/night fields no longer used there), crowd people → mochi + curse smoke. S01 now 10 shots: calm pantry (berry idle, crack at 2.1s + small shake) → cut to roots_burst (shake + purple flash, berry scared x85, root_burst FX hold + curse smoke, CRACK! pow index 1) → fall (lines index 2) … POP index 8. tests/story-motion-art checks the order 46 MANIFEST + keys + menu class. Real-browser shots checked, 0 errors.

# Previous delivery: v8.0.7 — Clear battle HUD

Arena HUD now groups level/EXP, counters and quick controls on a dark plum/gold header, with a separate wave/objective/progress/bonus card. Wave pips no longer overlap objective text; long text fits narrow phones; seasonal icons share a bounded row. Boss information has its own backing, relic/trait lines move below it. Dash/Unique retain their hit circles/left-hand/size settings and gain solid backing discs; skills share a small tray. Display copy is shorter; gameplay/cooldowns/rewards unchanged. No new art bytes or boot textures. Static production Canvas checks four sizes × five display states, existing controls tests plus npm check/build. Proofs: docs/reviews/combat_hud/. Publication: SESSION_HANDOFF.

# Art delivery46 — pantry roots and cursed night source kit

Three built-in ImageGen assets delivered to assets/incoming/story_shot_redo/:two1080×1920opaque scenes and six540pxrootburstframes. Pantry eruption uses faceless thorn roots;city is starry night with the established heart-gem Crown and violet curse. Exact prompts,original donors,manifest/CRC/hash/alpha QA,two mobile compositions,FXgraycontact/GIF retained. Source-only,runtime8.0.7unchanged;wiring notes in order46. Existing S05root remains. HUD8.0.7Pages/APK passed and all10published files4,727,033bytes match exact local Gitblobs.

# Previous delivery: v8.0.6 — Story shots redone + art order 46 (owner)

Owner on phone: S01 shot 1 cartoon root (cs_pup_root_tip with a mouth) looked silly; S00 shot 3 “In one night…” was daytime with an unexplained rainbow ribbon; S01 nest shot had Ruby and later the seed appear from nowhere. Data only: S00 shot 3 = MC_CITY with new shot fields tint 0x565aa8 + night .38 (mcShot: bg setTint, dark rect after bgs), crown_glow in the sky, curse_smoke ×2, no flavor ribbon, snow motes. S01 shot 1 = berry idle → scared at the shake, crack (hold) + purple curse smoke + purple flash, no root. S01 now 9 shots: land (THUD, blank mochi creeps in) → Ruby slides out from behind a crystal toward the blank mochi → “This way!” Ruby + Strawberry dash into the old roots → faint seed glow first, seed fades in → wake → transform (POP index 7) → Ruby talk. Art order 46 docs/art_orders/46_STORY_SHOT_REDO.md: cs_s01_far_roots_burst, cs_s00_far_city_night, cs_fx_root_burst (6×540) → assets/incoming/story_shot_redo/, awaits art (code notes in the order). Real-browser shots checked, 0 errors.

# Previous delivery: v8.0.5 — Smoother movement stick (owner: sometimes it barely moves)

Causes: speed = drag/60px linear (20px = 33%), fixed base (drifting finger had to come back 60+px to turn), and a finger already down when a card/story screen closed never started the stick (needed lift + retouch); pointerupoutside did not release it. Now joyStart/joyMove/joyEnd/joyBlocked (after the input setup, before update): dead zone 5px, full speed at 30px (20px = 60%), base follows the finger when dragged past 60px, joy.id −1 on end; pointermove adopts a held pointer (state play, p.isDown, not on Unique/Dash/Flicker, no titan/snipe hold); pointerupoutside ends the stick. Real-browser: 20px .6, 110px base follows, reverse −1 at once, held finger adopted, 0 errors.

# Previous delivery: v8.0.4 — Story gallery (owner)

MC_GALLERY (before STAGE_TAGLINES) = story order [id, emoji, name, stageMastery index needed (−1 = tutorialDone)]; mcOpen(id) = mcSeen or that stage cleared. buildLobby: pink '📖 Story' pill at the stage box top-right (only when any scene is open; zone 64×44 tag 'story', added after the panel zone so it wins); NEW badge now centred in the space left of the pill. Route s==='story' → buildStoryBook(): screen_chapter bg, 'Story so far · n / 17', 2-column tiles (emoji, name, tagline; locked = 🔒 ??? 'Keep playing to unlock', toast on tap), tile tags story_<id> → storyReplay(id) (clears _mcFail, playMotionComic, toast if art fails, rebuild story screen). tests/story-motion-art checks the gallery covers every scene + route/pill. Real-browser: Lobby pill → gallery 10/17 → s02 replay → back, 0 errors.

# Previous delivery: v8.0.3 — Cinematic title cards + comic effects (owner)

cineTitle(parent,o,reg) (before mcShot): film-style title — 16 drifting ADD motes, kicker (letter-spaced gold) fades/rises at 300ms, title (glow shadow, padding so it is not clipped) rises+scales .95→1 at 800ms/1500ms, gold line grows at 1900ms, italic tagline at 2500ms/1400ms, all ×speed; returns {objs,dur,out(ms,cb)}. rubyEntryCurtain uses it with STAGE_TAGLINES[idx] (15 English lines, after MC_HERO_SCENE): first visit speed 1 + 700ms hold (~5.6s total incl. 1s fade-out), replays speed .55; rubyEnterStage waits via a counter tween until c._t0+c._need, then out(1000) → finish (camera fadeIn 650); tap anywhere skips (pointerdown top: _rubyEntry._skip → out 300). Motion Comic: mcTitle card before shot 0 (kicker MOCHITOPIA · STORY, sc.title, sc.tag, speed .72, tap skips); per-scene tag/mote/pow set in an IIFE after MOTION_COMICS (s01 CRACK!/THUD!/POP!, s04 SHATTER!, s16 KRAK!, heroes POOF! …). mcShot adds: mcMotes (dust/ember/snow/spark, 14), mcLines focus lines at shake (white wedges redrawn every 60ms) + sh.lines (s01 fall), mcRays at flash (14 ADD rays rotating), mcPow (comic word pop + Sfx.boom), vignette, top letterbox bar (slides in on shot 0), dip-from-black 320ms, typewriter caption (pre-wrapped, left-aligned block centred; first tap completes the line, mc.typing). Reduced motion skips motes/lines/rays/dip/typing. tests/story-motion-art stubs mcTitle; scripts/check-ruby-story-ui waits for the longer arrival (was a fixed 650ms). Real-browser: 17 scenes + curtain (5.66s), 0 errors.

# Previous delivery: v8.0.2 — Art order 45 Motion Comic wired (owner)

scripts/pack-story-motion.py (sha/bytes vs each folder MANIFEST via ASSET_INDEX, 50% WebP q84, ADD FX as RGB) → assets/art/story/ (103 files, 4.9 MB, ~137 MiB decoded in total but one scene at a time). Keys in ASSET_IMAGES (cs_*) + ASSET_FX (cs_fx_*, add:true = ADD blend); 'story' added to LAZY_MENU_ART_RE (MENU_ONLY_RE already had it). Data after RUBY_STORYBOOK: MOTION_COMICS s00–s09, s11–s17 (s10 Sesame skipped, HEROES_WIP) — shot {bg:[far,mid,fg],zoom,pan,scroll,ms,shake,flash,cap,L:[[key,x,y,w,h,{at,out,to,ms,ease,bob,glow,rot,sq,fps,loop,fr,hold,fade}]]} on a 360×780 reference frame; s02–s05 captions reuse RUBY_STORYBOOK text; mcHero() builds s06–s09. Player (before rubyStageStory): mcGate(id,cont) (false when missing/seen/failed/noRuby) · mcGateList · playMotionComic (state 'cinematic' + physics pause if play, opaque veil, ensureGroup all+fx 12s timeout, missing art → _mcFail + done(false) = old storybook/panel fallback; finish saves Save.data.mcSeen, s01 also storyIntroSeen/rubyStorybook[0]; removes cs_ textures) · mcShot (cover bgs with parallax .35/.7/1.15 zoom/pan tweens, contain-scaled layers, FX frames by time events, uiCam shake, flash rect, caption band H·.7, Skip pill, auto-advance max(ms+900, 2200+45/char)) · reduced motion = end states. Tap handler now passes p to _finishStoryCutscene. Hooks: new player title tap → s00+s01 → tutorial · rubyStageStory(idx) → MC_STAGE_STORY (all seen = storybook marked, no pages) · startStoryStage hero intro → MC_HERO_SCENE s06–s09 · launchStageLoadout stage 5 → s12 (sets storyCh2Seen) / stage 10 → s14 · showStageEpilogue → MC_AFTER_STAGE 4:s11 9:s13 14:s16 · spawnFinalBoss stage 12 → s15 · buildMenuScreen atlas → s17; story hooks skip recipe/rift/rush/tutorial/pinnacle. tests/story-motion-art.test.cjs (in npm check). Real-browser: all 17 scenes played, 0 cs_ textures left, title → s00 → s01 → tutorial, 0 errors. Owner phone review of staging/timing/FPS pending.

# Previous delivery: v8.0.1 — Bottom bar on every page + no old hub (owner)

Cause: many buttons rebuilt their page by calling the builder directly (buildSettings/buildTalents/buildCraftBench/…), skipping buildMenuScreen, so the page laid out at full H and drawNavBar never ran. navWrapBuild(f,a) + NAV_WRAP list (bottom of game.js, before new Phaser.Game) wraps every page builder: outside buildMenuScreen (_inMenuBuild flag) it sets H−NAV_H, _navOn, runs the builder, draws the bar and setupMenuScroll; inside buildMenuScreen it is a no-op pass-through. Old hub: navBarOn no longer requires tutorialDone, so portrait always uses buildLobby (BATTLE already routes to startChapterTutorial before the tutorial). Real-browser check 360×780: 19 screens + Talents keep 5 nav zones after direct rebuild, pre-tutorial hub = Lobby, 0 errors.

# Art delivery45 — layered Story Motion Comic source kit

All3batches delivered:103PNG32/54FXframes forS00–S17,54retained built-in ImageGen originals,exact prompts,20per-folder manifests/QA,gray contacts,14mobile keyshots and actual-layerS01GIF11.2seconds. Source-only in assets/incoming/story_motion/;runtime8.0.1unchanged. Story canon draft2/section7preserved;Ruby never transforms. See README/ASSET_INDEX and order45. Next separate code task:50%WebP lazy data-driven player and fallback-preserving story hooks;never boot-load all scenes. Publication status in SESSION_HANDOFF.

# Previous delivery: v8.0.0 — Mint Barrage nerf (owner: most unbalanced build)

BASIC_PATHS mint barrage base dmg 0.62→0.55 (desc '55% damage'; fixture cocoa-rework-baseline updated) and frostShatterBurst bloom AoE multiplier 1.6→1.3 only when basicAttack.path==='barrage' (Glacier/others keep 1.6; boss/mini ×.6 kept). Shards, cd .78, Echo/Chain/Wide Bloom, Hailstorm unchanged. Rough effect: lance hits −11%, bloom AoE −28%. Owner to compare on phone.

# Previous delivery: v7.9.98 — One story canon + art order 45 (owner)

docs/STORY_CANON.md (draft 2 + plot holes 7.1–7.13, owner approved): a Crown on the First Tree cursed the kingdom into mochi and eats their flavor (= The Great Hunger); the starving Hunger's roots crack the pantry, Strawberry finds the waking Heart Seed and becomes a person; each boss returns flavor so the seed frees the next friend; ending = Planter lifts the Crown, Heart Seed planted, curse breaks, Hunger sleeps (Delve/Pinnacle). Ruby = jam spirit made by Grandma (royal head cook, frozen in C1-4, flavor in the Crown), never cursed, never transforms. Text rewritten: RUBY_STORY, RUBY_STORYBOOK, clear memories + bridge, STAGE_STORY_BEATS, STAGE_EPILOGUE (fixture presentation-art-baseline regenerated), STAGES lore, playStoryPanel intro/ch2/boss lines, coachSteps welcome/attack/unique, HERO_INTROS, achievement family name; 'Momo' → 'Strawberry' in story text; Bitter Chef removed. docs/LORE.md points to the canon. Art order 45 docs/art_orders/45_STORY_MOTION_COMIC.md: layered motion-comic cutscenes S00–S17 (~100 files, 3 batches) + playMotionComic code notes. No combat changes.

# Previous delivery: v7.9.97 - Painted discovery theater

Built-in ImageGen confectionery theater replaces oversized combat-glow backgrounds for new features,Gacha,Bazaar/trade-in and stage rewards.512x768 WebP,menu lazy with owned late-load fallback. Full opaque plum/cream/gold backdrop,icons above pedestal,refined Ruby message panel and bounded highlights;original costs/rewards/claim/fly routing retained. Original source,exact prompt,manifest and real feature/item Canvas proofs in assets/incoming/reveal_theater/. See SESSION_HANDOFF.md for checks/publication.

# Previous delivery: v7.9.96 - Cinematic Ruby stories and contextual teaching

Stories focus on a large painted shot with a slow push-in, entrance motion, scene-specific snow/embers/memory motes, quiet story cues, dim moving background and previous-shot strip. Existing ImageGen art is reused; zero new runtime asset bytes. Narration accepts 2+ shots; clear memories use four beats including the next-stage cause/destination. Owned tween cleanup, missing-art fallback, manual Back/Follow/Skip and reduced motion retained. Read version3 is saved only on completion/Skip so older readers see the revised presentation once.

Training no longer consumes the C1-1 story or opens the book cover. Live exercises use their existing spotlight coach, with welcome/health/finish notes retained. Weave lectures removed; stars use the actual stage-box spotlight and save on dismissal. Build/Mutation/Evolution hints occupy the reserved space below the actual choices, avoiding a second lecture over the cards. Post-clear memories now replace the relevant epilogue at the clear boundary, preserving its causal bridge; no old-memory backlog on arbitrary Hub rebuilds. Stage-title curtain spans asset preparation and hands off to a brief arena reveal, including replay entries. Other heroes/balance/rewards unchanged. See docs/RUBY_CINEMATIC_FLOW.md and SESSION_HANDOFF.md for validation/publication.

# Previous delivery: v7.9.95 - Three-panel Ruby comics

Five built-in ImageGen originals /15 event shots retained in assets/incoming/ruby_comic/ with exact prompts, extraction/runtime hash manifest and gallery. Runtime1,050,148bytes, scene-specific menu loading. Early stories and both post-clear memories reveal three comic panels one at a time with420ms fade; earlier pictures remain, Back/Skip retained, reduced motion immediate, reveal tweens cleaned on rebuild/destroy. Short captions and paper/black background retained. Old read1 migrates to2 only on complete/skip so previous readers see revised comics once. Required check/build and six-view Canvas review; status in docs/SESSION_HANDOFF.md. See docs/art_orders/44_RUBY_COMIC.md. Concurrent v7.9.91-94 loading, Battle Recipes, Ruby guidance, feature reveal, gear/Forge and Lobby changes are preserved. No combat/balance changes.

# Previous delivery: v7.9.94 — Rarer early gear, tap-to-stop Forge, Lobby bubble over the head (owner)

Gear: gearEnhanceCap iLv<12 +1 · <25 +3 · <45 +6 · else +10; rollAffixes caps drop mods 0/1/2/3 by iLv (<12/<25/<45); earlyLootMul() = .45 in Story stageIndex<5 on mini/elite/crate gear rolls (docs/GEAR_LEVEL_LIMITS.md). Forge: randomCraftSelected and autoRollToTarget use forgeRollOptions(…,1); forgeSpin loops a random-row light (75ms) with '👆 TAP to stop!' until handleTap → _forgeSpin.finish = stop → 7 slowing hops onto the paid result, tap again = finish, 10s auto-stop. Lobby: LOBBY_LINES rewritten short/cheeky; startLobbyVoice(hero,headX,headY,width,minY,left,right) from buildLobby (LOBBY_FACE head top, clamped ≤ zone top+10, between side buttons); tick sets root above the head, raster panel flipped Y so the tail points down, pop .8→1. Lobby + Forge real-browser checks pass locally.

# Previous delivery: v7.9.93 — Ruby guides counters, stars, Mutation/Evolution; feature-reveal fly fix (owner)

counterTeach(x,y) from spawnCounter: first counter per run (max 2 saves, d.counterTaught) → rubyTip('counter') + questFocus('counter',true,[target]) (questFocus now takes optional targets). starTeach() 900ms after buildLobby once (d.starTaught; waits for feature reveals, Weave tour, gearTut 0–1) → rubyTalk about 3 stars + Sugar + replay + mini wheel. pathTeach(kind) also for first mutation/evolution card (2 pages each). Feature reveal: second+ item used an empty tapZones → flew to the bottom; now keeps _featZones (Lobby zones) and hides every queued target's real icon (featHideAt bounds match) until its fly arrives (featShow).

# Previous delivery: v7.9.92 — Grandma’s Battle Recipes (owner picked ข+ค)

RUBY_STORYBOOK[1] (shown before C1-2) gains page 3 (ruby_memory_jar art): Ruby finds Grandma’s Battle Recipes and can hold one at a time → why Builds open from C1-2 and are picked each floor. CARD_INTRO.path = '📖 Battle Recipe' (first-time note only); pathTeach Strawberry pages renamed One Big Seed / Seed Spray / Bouncing Seeds, other heroes get 'Grandma wrote Battle Recipes for you too'. Everywhere else still says Build Path (option ข). tests/ruby-storybook uses each chapter's page count.

# Previous delivery: v7.9.91 — Clearer loading + persistent storage (owner)

GameLoader.set (patched in game.js) percent line: window.__dlPhase (set by downloadAllAssets while fetching) → '⬇️ Downloading n% (n / N)'; else LoadMeter dev ≥ net → '📦 Preparing n% (seen / count)', else '⬇️ Loading'. downloadAllAssets first calls navigator.storage.persist() so Android is less likely to evict the ~288 MB cache. Owner question answered: per-file ?v= hashes mean only changed files re-download; the boot bar every launch is decoding cached files into GPU memory, plus game.js on each new version.

# Previous delivery: v7.9.90 - Ruby's illustrated storybook

Five built-in ImageGen originals (four event paintings + recipe paper), source/prompts/hash manifest and real Canvas proofs retained in assets/incoming/ruby_storybook/. Runtime451,184bytes; menu-lazy only, per-story image loading. Pre-stage C1-1 through C1-5 two-page stories, before first tutorial too; grandma/jar art reused. rubyTalk now opaque paper/black full-screen, contained event art, expression portrait, manual Back/Next/Skip,600ms debounce, deferred once-only completion/save and menu rebuild guard. Post-clear memories retained; no combat/balance changes. Required check/build and six real Canvas viewports passed; Pages CI includes story review. See docs/art_orders/43_RUBY_STORYBOOK.md and publication state in docs/SESSION_HANDOFF.md.

# Previous delivery: v7.9.89 — Lobby layout and missing art

Real Canvas audit repaired currency collisions, dimmed controls, dialogue over hero, locked shortcut gaps and stage title/power collisions. Two built-in ImageGen assets: painted Settings and empty currency panel,11,020 runtime bytes, existing Lobby lazy loader. Reused existing panels/hero/shadow. Source/prompt/hash manifest/review screenshots in assets/incoming/lobby_polish/; docs/art_orders/42_LOBBY_POLISH.md. Five portrait sizes × early/unlocked ×36 lines pass real Canvas bounds/collision/routes (360 dialogue states); check now in Pages CI. Required check/build passed; publication status in docs/SESSION_HANDOFF.md. Menu screenshots explicitly requested by owner; no combat simulation.

# Previous delivery: v7.9.88 — ImageGen winter magic and Lobby panels

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



# Previous delivery: v7.8.8 — Compact Heroes and header gear

Owner accepted the calm Hub theme. More is now a 44px gear beside version, retaining the Settings/Guide group; five cards remain below. Heroes tabs are narrower and at least 36px tall; native rounded controls avoid stretching ornate images. Select footer is at least 44px tall, role chip fits its text and Details is a top-right !. Stats uses the ImageGen concept direction: larger single-line labels/values, category-colored edges and source !; full formulas remain in the existing source modal. Hero/castle art, equipped stats and selection behavior preserved. See docs/HERO_MOBILE_POLISH.md.

# Previous delivery: v7.8.7 — Calmer, livelier home

Owner requested less dense art, more color contrast and a little movement. Castle/Strawberry plate and logo preserved; quiet native Canvas cards replace repeated floral chrome. Coral Play, mint Heroes, indigo Gear, warm gold Activities, cyan Codex and neutral More; smaller icons and clearer lower backdrop. Eight faint drifting petals, 1.5px logo float and Play outline pulse use tracked tweens, stopped on navigation/rebuild/stage start/shutdown and disabled by reduced motion. Routes, unlocks, badges, guide/reward rules preserved. See docs/HUB_CALM_MOTION.md.

# Previous delivery: v7.8.6 — Forge mobile readability

Owner selected single-line mod results, larger touch controls and tier-only labels from the ImageGen preview. Main-page results show one effect name plus Tn; installed rows retain their effect value and display only Tn at right. Full ranges/chances remain in details and Odds. Roll/Tier/Auto are 44px tall; result-info controls are 44×44; current-mod info is 44px wide. Small portrait geometry rebalanced; no economy or save changes. See docs/FORGE_MOBILE_READABILITY.md.


# Previous delivery: v7.8.5 — Simpler Affix Forge

Forge Back unwinds navigation to Gear & Power, then Hub, without returning to Forge. All three rows now spend one corresponding currency for one immediate random compatible mod; Utility no longer selects a family. Auto rolls the selected row. Short effect labels in current/result rows; full conditions remain in details. Already-paid Sustain choices remain recoverable. See docs/FORGE_SIMPLIFICATION.md.


# ⚠️ DEPLOY BRANCH — read first

The live game (GitHub Pages / APK live update) deploys ONLY from `claude/vampire-survival-mobile-game-yo9e8w`. Pushes to any other branch (session branches like `ccr-*` or `claude/*`) run the Pages workflow but it fails, so the game stays on the old version. Owner has approved this permanently: after committing, always push to the vampire branch too (`git push origin HEAD:claude/vampire-survival-mobile-game-yo9e8w`, fast-forward only; if it is not an ancestor, merge it in first, never force). Then confirm the "Deploy Web (GitHub Pages)" run for that branch succeeded and the in-game version matches `GAME_VERSION`.

# Latest delivery: v6.69.0 — Kitchen upkeep and rework

Owner approved: recipes had no downside. FR_SLOT_MAX 5→3; frUpkeep/applyFrUpkeep (applyMeta + computeHeroStats 'Kitchen upkeep'): per active recipe −6% maxHP, −4% dmgMul, +2% per DO ★ above 1 and +2% signature. Effects heal/recover/shield/immune/cdr marked cut (hidden in bag, skipped by frActive). Save.migrateKitchen3 (flag kitchen3) returns parts from slots ≥3 and cut parts, frSlots capped 3, frSlotRP=5. frHit sets _frDmg → damage() skips powerMul and crit. frEffect pw capped 2.5. Rage/Haste 4s with 8s cd. Minty refreeze ≥3s per foe (e._frIceAt). npm check passed.

# Previous delivery: v6.68.0 — Story C2–C3 buff, Temple cost nerf

Owner chose buff 1 + nerf Sugar upgrades. STORY_MOB_TAIL 1.18→1.28 (stage curve tail after index 5, story only; recipeMode keeps 1.18/1.17); realStageBossMul(i,endgame) ×2 for i≥5 when not recipeMode (boss + mini). Save.talCost rank factor 1.15^rank→1.25^rank. stageThreat/recommended power follow automatically. Kitchen review given to owner, not changed. npm check passed.

# Previous delivery: v6.67.0 — Item mods: no prefix/suffix, max 3, Play mods

Owner chose mod critique item 1 + remove prefix/suffix. All affix defs kind='mod' at runtime (MOD_LINE_MAX 3, CRAFT_AFFIX_CAP 3, AFFIX_COUNT legend 3); Save.migrateModLines3 trims old items to 3 best tiers (flag modLines3). Craft bench one MODS column; compare one MODS section. 6 Play mods (category 'play', weight ~30): m_dashnova (doDash → gearModBoom), m_critarc (damage crit → gearCritArc, 2 foes), m_killshell (killEnemy → gearKillShell, shield cap 2), m_stillfocus/m_opener (damage mul), m_thorns (charPassiveOnHurt, 1s cd). Fields reset in applyMeta. Validator affix count 41. npm check + headless craft screen passed.

# Previous delivery: v6.66.0 — Delve cards chosen like Story

Owner: normal cards in Delve should not auto-apply; pick like Story. openLevelUp recipe redirect to recipeLevelUp removed again; closeLevelUp reopens for pending levels (recipeLevelUp/Sugar Rush/every-5 draft unused). Endgame Build stays removed. npm check passed.

# Previous delivery: v6.65.0 — Endgame Build removed

Owner clarified "auto build" meant Endgame Build. startRecipeRun no longer calls applyEgBuild (_egBuilt=false); Delve panel Build chip/over-budget gate removed, Start full width (buildEgBuild/egBuild helpers now dead code). v6.62 auto upgrades restored (openLevelUp recipe redirect + closeLevelUp recipe branch). v6.64 slower meters kept. npm check passed.

# Previous delivery: v6.64.0 — Slower meters, manual Delve cards

Owner: replay progress and Delve Hunger fill slower; remove auto build. replayOnKill 1/8→0.75/6; HUNGER_PER_KILL .25→.19, elite 8→6, FEAST_SHARE .15→.12, MISSION_HUNGER .2→.16. openLevelUp no longer redirects recipeMode to recipeLevelUp (Sugar Rush auto stats + every-5 draft now unused); closeLevelUp reopens for pending levels in recipe too. npm check passed.

# Previous delivery: v6.63.0 — Delve play mods

Owner chose critique item 1. RECIPE_MECH_MODS +5 play:true mods: splitter (non-boss death → 2 fast minis 35% HP, _splitKid no re-split), restless (still >1s → 1% maxHP per 0.25s), shrink (circle from run start 950→360 at 6.5/s, outside 1.5%/0.25s), elitepack (eliteEvery×0.4), twinboss (elite HP×6 bodyguard 0.9s after boss). tickDelveMods in update when recipeMode; clearDelveMods in startRecipeRun/exitStage. delveMods guarantees 1 play mod when count>0; play mods allowed at any depth. Not playtested.

# Previous delivery: v6.62.0 — Delve auto upgrades

Owner: in Endgame Delve, normal cards auto-upgrade; special cards are chosen. recipeLevelUp rolls rollBasicAttackUpgrades(3): special cards → _specQ shown via openRecipeDraft (remaining levels deferred in pendingLvl); otherwise first normal card auto-applies (fallback endless stat); _egBuilt keeps endless stats; Sugar Rush + every-5 Modifier/Trade-off/Relic draft unchanged. npm check passed.

# Previous delivery: v6.61.0 — Phantom Rush Shadow Mark

Owner chose idea 1. Each Phantom leap slam marks the target (_shadowN max 4, _shadowUntil 5s); damage() ×(1+0.08·marks). npm check passed.

# Previous delivery: v6.60.9 — Phantom Rush vs bosses

Owner: Phantom Rush weak vs bosses. Each auto-leap slam adds a direct hit of slam×1.6 to the targeted boss/mini (respects phase gates); ordinary foes unchanged. npm check passed.

# Previous delivery: v6.60.8 — Phantom Rush reuse fix

Owner bug: Dash refund drops Unique cd to 0 but Unique can't be pressed. Cause: useCharacterSkill blocks while _cocoaUniqueT>0, and Phantom Rush set it to its full 5–7s duration. Now 1.5s (leap window); _cocoaPhantom still lasts its full duration. npm check passed.

# Previous delivery: v6.60.7 — Unique button moved up

Owner: Unique hard to tap when Dash shows charges. layoutControls unique gap above Dash 8k→30k px. npm check passed.

# Previous delivery: v6.60.6 — Chocolate punches while walking

No-path Chocolate uses bpPose('char_cocoa_attack') in castCocoaRush so the punch pose plays while moving. npm check passed.

# Previous delivery: v6.60.5 — Chocolate attacks while walking

Owner: other paths should also show attack poses while walking. castCocoaRush Fire Fist (fire_jab/fire_fin) and Dash Boxer (dash_jab) use bpPose (plays while moving) instead of poseAttack; no-path Chocolate keeps poseAttack. npm check passed.

# Previous delivery: v6.60.4 — Titan jump attacks

Owner: Titan should keep walking and attacks become jumps. castCocoaRush titan uses bpPose hop/slam (plays while moving) and, if joystick active, glides toward target reach*.35 (finisher .5) over wind-up via cocoaGlideTo(noLine). Damage point/iframes unchanged. npm check passed.

# Previous delivery: v6.60.3 — Build path art wired

Owner art (ea6493a, 44 files) packed by scripts/pack-build-path-art.py to assets/art/bp_fx (character sheets halved to 128px cells; black VFX converted to luminance alpha, NORMAL blend). Keys: char_cocoa_{titan_slam,titan_hop,titan_charge,titan_walk,titan_colossus,fire_jab,fire_fin,rocket,dash_leap,dash_jab,phantom,hurt,victory}, char_mint_lance_charged, bpx_* VFX (stageCritical filters bpx_<char>). BP_POSE_SCALE restores on-screen size. Helpers bpPose (timed override in updatePose), bpFx, bpLoop, attachProjectileAnim; impale markers via tickImpaleMarks. Hooks in castCocoaRush, titanRageImpact, tickTitanRage (aura + charge/walk loop), cocoaFireFist, castCocoaUnique, cocoaPool, cocoaDashLeap, cocoaLandingFx, castFrostLance/queueHailstorm/impaler/applyImpale, hitBerrySeed. npm check + headless smoke passed; owner phone visual/FPS review pending.

# Previous delivery: v6.60.2 — Roomier Shotgun

Owner: Shotgun felt squeezed. Close boss/elite spread .045→.11 (jitter ±.04), pellet life .3→.4 in both fire paths. npm check passed.

# Previous delivery: v6.60.1 — Fire Fist without homing

Owner: removed Heat Seeker card (p_homing) and fist homing; Fire Fist fists fly straight. Rocket Gauntlet Unique still homes. npm check passed.

# Previous delivery: v6.60.0 — Chocolate path Talents (commit 4/4, card/Mutation/Evo/Infuse/Talent plan complete)

PATH_TALENTS brawler/titan/dashboxer rewritten (node IDs kept, saved ranks stay). New _pt keys read via ptv(k): ffRange/ffBlast/ffBurn/ffTwin/ffMeteor, trSpeed/trRel/trCost/trRegen/rage4/trGuard/trLust, dbLeap/dbSlam/dbRefund. Rage Four capstone: titanMaxLv()=4, TITAN_RAGE_MUL[4]=5.5, bar draws 4 segments. Bloodlust in charPassiveOnKill; Iron Body in ptTakenMul. Talent icon art still maps by old node IDs (names changed). talent-icons hash updated. npm check passed; owner phone review pending.

# Previous delivery: v6.59.9 — Chocolate Infuse synergy (commit 3/4)

cocoaInfMatch/cocoaHasInf: Spicy+Fire Fist burn ×1.5 (infusionOnHit); Sour+Titan release sets e._titanMarkT 4s → +25% damage taken in damage(); Sweet+Titan Blood Rage HP cost ×0.7; Minty+Dash Boxer leap landing freezes non-boss 1s (cocoaLeapMutation). Matching Infusion cards headline "★ Build match: …". npm check passed. Next: commit 4 Talents.

# Previous delivery: v6.59.8 — Chocolate Evolutions (commit 2/4)

Fire Fist evo Inferno Overdrive: finisher fireball adds 3 fire meteors (cocoaLater hits along aim). Titan evo Cocoa Colossus: level-3 release also hits all foes within 900 (×0.5 release power) and heals 10% max HP. Dash Boxer evo Phantom Chocolatier: cocoaEvoDash fires 2 homing shadow fists every Dash. npm check passed. Next: commit 3 Infuse synergy, commit 4 Talents.

# Previous delivery: v6.59.7 — Chocolate path cards + path Mutations (commit 1/4)

Fire Fist cards Blast Radius (p_shock +25% blast), Rapid Fire (p_footwork cd .92), Twin Fists, Ember Trail, Heat Seeker; Titan Quick Fury, Lava Crater; Dash Boxer Long Leap, Slam Wave, Rush Battery. COCOA_PATH_MUTS gives each path 3 Mutations (brawler rush/napalm/ricochet, titan breaker/bloodpact/quakestun, dashboxer counter/afterimage/chainleap) via cocoaAttackInfo. Fire/lava pools: cocoaPool/tickCocoaPools (cap 12, cleared in clearCocoaCombat).

# Previous delivery: v6.59.6 — Rocket Gauntlet

Owner chose Rocket Gauntlet as the Fire Fist (brawler) Unique, replacing Chocolate Cyclone. castCocoaUnique brawler: 3/4/4/5 homing proj_rocket gauntlets (Unique Lv1–4) at distinct strongest targets within 620 (boss>mini>max HP), dmg unit*1.1, explode r; gauntlets targeting Boss/Mini add 3 (Lv4: 4) sticky blasts at the target every .35s from .75s. CD 20→18. Tests updated (one hit per gauntlet; pause test moved to titan). npm check passed; owner phone review pending.

# Previous delivery: v6.59.5 — Fire Fist

Owner: replace Earth Stomp (path id 'brawler' kept) with fire-fist projectiles. castCocoaRush brawler targets within max(380,reach*2.6) and calls cocoaFireFist: getBullet proj_rocket tinted orange, speed 720, dmg unit*.85; 5th = big piercing fireball (speed 620, explode reach*.9 scaled by wave ranks, ×1.55·finMul); rush mutation fans 3 fireballs. Combo advances on fire. Stomp slow removed. Tests mock getBullet (dmg setter records a hit). npm check passed; owner phone review pending.

# Previous delivery: v6.59.4 — Titan hold-to-charge

Owner: charge should be a held button that sinks while held, cooldown starts on release, shorter cooldown, walk while charging. Titan Unique is now hold (isTitanHold): pointerdown sets _titanHold, tickTitanRage charges only while held (walking allowed, HP drain kept), button scales .86; release → releaseTitanCharge → useCharacterSkill with _titanRelease level; Colossus Fist uses TITAN_RAGE_MUL/radius/titanRageImpact. Basic finisher no longer spends rage. Colossus cd 24→12. Standing-still auto charge removed. npm check passed; owner phone review pending.

# Previous delivery: v6.59.3 — Titan channel

Owner: Titan charge must not be interrupted. tickTitanRage moving = titanMoving() (joystick input only, not body velocity), so contact knockback no longer stops/decays the charge; touchEnemy skips player knockback while titanChanneling(). npm check passed; owner phone review pending.

# Previous delivery: v6.59.2 — Earth Stomp

Owner chose Earth Stomp to replace Brawler (id 'brawler' kept for saves). Flicker disabled (_cocoaFlickerOn=false); stomp hits all foes within reach*1.05 (finisher 1.35) centred on Chocolate, shake per stomp, finisher waves/rush mutation around player; Brawler path move speed ×0.8. Path name/desc updated. Flicker tests rewritten for stomp. npm check passed; owner phone review pending.

# Previous delivery: v6.59.1 — Titan charge bar

Owner: slower charge, bar above head with level dividers, bigger release = longer cooldown. TITAN_RAGE_SEC 0.9→1.8s/level; bar (60px, dividers at 1/3, 2/3, gold pulse at max) replaces arc/dots; TITAN_RAGE_CD [0,1.2,2.6,4.5]s applied to skillCd.meteor on release. npm check passed; owner phone review pending. Brawler: owner asked for 10 new concepts.

# Previous delivery: v6.59.0 — Titan Blood Rage

Owner: Titan needs spectacle and a bigger risk. Standing still near enemies charges _titanRage 0→3 (0.9s/level) draining 2.5% maxHP/s ×(1+0.5·level) (min 1 HP); moving decays it. Finisher spends it: TITAN_RAGE_MUL [1,1.8,2.8,4.2], radius +15%/level; titanRageImpact scales hit-stop/shake/flash/rings/crater/TITAN CRUSH text with level. Titan regen +1.2% maxHP/s while not charging (outside normal cap). Cards p_ironblood (−20% cost, +0.4% regen) and p_secondwind (heal 4%×level on lv2+ release). npm check passed; owner phone review pending. Brawler replacement still awaiting owner choice.

# Previous delivery: v6.58.8 — Pickups and EXP

Owner: heal popup showed long decimals (rounded now); hearts/magnets always collectable (full HP or no ground EXP just consumes them). Story magnets max 2/stage, 50s gap, chance elite .10 / ordinary .012; special modes elite .08 / ordinary .005, crate .04. Story enemy EXP 2x→1.7x, Hunt 24→20, mini 60→50. field-pickups/story-budget tests updated; full npm check passed.

# Previous delivery: v6.58.7 — Chocolate punch feel

Owner: basic punches whiffed and animation/impact out of sync. Target range reach*1.6→1.2, punch aims at target (move dir only fallback), impact point stops at target distance. Non-Titan wind-up .05/.10→.12/.16 so damage lands at arm extension; attack clip may restart once past 55% (recovery). Full npm check passed; owner phone feel review pending.

# Previous delivery: v6.58.6 — Chocolate glow fix

Owner bug: constant flashing aura around Chocolate from Lv1. Cause: castSkill drew vfxCastGlow on every Bear Core Combo tick (even with no enemy). Skipped for cocoa meteor; punch impact FX unchanged. Verified with headless screenshot; npm check passed.

# Previous delivery: v6.58.5 — Dash Boxer Unique recharge

Owner request: every Dash on the Dash Boxer path reduces Unique cooldown by 1s (applied in doDash after cocoaDashLeap). Full npm check passed.

# Previous delivery: v6.58.4 — Dash Boxer vs bosses

Owner: Dash path fun but mini/boss fights hard, Unique unclear. Dash Leap now prefers a boss/mini within 320px (unless aiming away), grants iframes and adds an extra boss slam on landing. Phantom Rush Unique auto-leaps 3–4 times onto the strongest enemy (boss first) then gives free shadow Dashes; Unique descriptions/banners say plainly what each path does. Full npm check passed; owner phone review pending.

# Previous delivery: v6.58.3 — Chocolate identity and impact

From owner-approved critique items 1 and 3. The Flicker ON/OFF button is gone. Each path has one identity: Brawler auto-flickers (gliding) to monsters within 150px and punches in place when a foe is already adjacent or none is in reach; Titan stands and winds up; Dash Boxer uses Dash Leap. Finisher punches add 40ms hit-stop, stronger shake (Titan heavier) and 340 knockback. Five combo dots above Chocolate show rhythm; the fifth glows before the finisher. Dash Leap landing adds dust ring, ground cracks and 35ms hit-stop. Flicker/build/control tests rewritten for the new rules; full npm check passed. Owner phone feel review pending. Critique items 2 (visible path defence), 4 (decision moments) and 5 (Uniques tied to play) remain proposals.

# Previous delivery: v6.58.2 — sticky Flicker and Dash Boxer leap

Owner feedback: Flicker should stay with the monster instead of returning, and move more slowly between targets; Dash Boxer should feel like a dash-plunge (Xiao-like). Flicker no longer returns to an anchor: each strike glides 260ms to the next target and Chocolate stays where the chain ends; camera keeps following the player. Dash Boxer Dash leaps (200ms glide) to the best monster within 280px in the aimed direction (nearest when not aiming), punches along the path and slams on landing (110px, 1.5x finisher, light shake); no target = normal Dash with trail. Flicker/build tests updated; full npm check passed. Owner phone feel review pending.

# Previous delivery: v6.58.1 — smoother Chocolate Flicker and active Dash Boxer

Owner feedback: Flicker felt abrupt and too far; Dash Boxer Dash did nothing visible. Flicker now glides (150ms ease-out) to each target with a path line and purple afterimages, waits a little longer between punches and glides back to the moving anchor after a normal finish (cancel still snaps back). Range narrowed to Titan 190 / Brawler 220 / Dash Boxer 250. Dash Boxer: every Dash now punches enemies along its path once and ends with a finishing punch; Phantom Rush keeps its stronger trail. Flicker tests updated for glide timing; full npm check passed. Owner phone feel review pending.

# Previous delivery: v6.58.0 — Chocolate Flicker and discoverable Unique controls

Chocolate has a separate Flicker ON/OFF button beside Unique. A new run starts OFF; selection persists during the run and pause. ON auto-warps from 260/300/340 range (Titan/Brawler/Dash Boxer), punches 1/2/3 times with base power divided across the sequence, then returns to an anchor that follows player movement. Boss/Mini stays locked while active, phase-valid and in range; joystick heading selects ordinary targets. Retreat input prevents new chains and cancels an active chain; Dash cancels before its movement/Recipe triggers (even without a remaining charge, the chain still cancels). OFF finishes only the current primary punch. Hurt/reset/changed player/path/epoch cancel stale hits and restore camera follow. Warp destinations/anchors stay within world bounds; camera follows the anchor during attacks; visible punches grant no new iframe. Existing hit-phase checks, path effects/Evolutions, mutations, saved IDs/Talents and path Uniques are preserved. Actual primary punches use a windup/impact/recovery sequence from existing art. The auto-cast loop waits for an active chain without consuming another full cooldown, with 100ms visual recovery after a normal return. No kill/charge requirement against single bosses.

Unique buttons show TAP or HOLD, CHARGE %, RELEASE at full charge and cooldown seconds. The four existing hold Uniques are Strawberry Sniper/Shotgun and Mint Glacier/Pierce. A white progress ring becomes gold at full charge. Only the owning finger can release, including outside the canvas; a second finger cannot replace an active charge or leak graphics. No charge damage or timing was rebalanced. Controls respect left/right hands, all three sizes and HUD hiding. Equipment remains at the restored v6.56.5 layout.

Validation: actual combat/control regressions cover all Flicker paths, split power, boss lock, target aim, retreat/OFF/Dash/hurt/reset/pause, stale identity, bounds, camera restore, queue budgets and real auto-cast pacing; all charge states, viewport layouts and real input callbacks are exercised. Full npm check/build passed, and the browser fixture exercised all three paths and actual controls. Its charge release is simulated. Continuous phone input/feel/FPS and comparative boss balance remain owner playtest work.

# Previous delivery: v6.57.1 — Chocolate animation smoothing

Chocolate Dash advances the existing 12-frame running cycle at 1.6x cadence and retains gait phase on exit. Stationary punch clips run for at least 320ms and finish without repeated resets; moving cancels suppressed clips so stopping cannot reveal a stale punch. Hurt retains priority. Cocoa visual jelly recovery uses bounded 120Hz substeps and exponential lean easing. Damage, hit schedules, movement/colliders, build rules, saved IDs and other heroes remain unchanged. Existing sprite art and instantaneous padding compensation are retained. Focused motion tests cover clip continuity, hidden-pose cancellation, Dash frames, hurt/fallback and 30/60/120 FPS spring recovery. Full checks/build and browser motion/combat fixture passed; continuous phone feel/FPS review pending. Equipment stays at the owner-restored v6.56.5 layout.

# Previous delivery: v6.57.0 — Chocolate C1–C5 build rework

Cocoa keeps path/card/Talent IDs and saved investment. Five-hit Basic combos advance only on landed, phase-valid primary punches. Brawler keeps rhythm for 2.5s and emits at most 3 finisher waves (overflow wave ranks add power); Titan uses fixed 240/320ms wind-ups and a 500ms minimum attack interval; Dash Boxer keeps combo progress on Dash and empowers the next landed punch. One-tap Unique: Bear Slam before choosing a path, moving Chocolate Cyclone, a fixed-location Colossus Fist chosen Boss > Mini > Elite > strongest ordinary, or Phantom Rush with separate expiring temporary Dash charges and once-per-target actual Dash-path damage. Unique levels, Drum refunds/minimum reuse, existing Talent effects, mutations, Recipe ranks and conditional damage flow are preserved. Evolutions are Overdrive, Colossus and Phantom Chocolatier; card/Codex/Recipe/Unique text follows the path. Legacy hold/drag/swipe/warp gameplay is removed. Runtime jobs are capped, paused with combat, bound to player/basic/path/epoch and cleared at death/exit/reset/start/shutdown. Reuses painted Cocoa punch, bear impact and existing sounds; no new generated art. Actual-cast tests and browser fixture review cover the new mechanics; full checks and build:www passed on the merged v6.56.5 base. Owner phone feel/FPS/balance review pending.

Equipment remains at the restored v6.56.5 layout. The Chocolate rework does not reapply the v6.56.2–3 redesign.

# Previous delivery: v6.56.5 — Equipment page reverted to the pre-v6.56.2 layout at owner request (v6.56.4 menu scrolling kept). Do not reapply v6.56.2–3 Equipment redesign without asking.

# Previous delivery: v6.56.4 — responsive menu touch

Shared menus have frame-time independent momentum scrolling, immediate touch highlights, horizontal/vertical drag cancellation, stop-moving-list tap suppression, stale-velocity rejection and pointer/screen lifecycle cleanup. Fixed equipment footer stays aligned through existing scroll compensation. Atlas gestures and combat remain unchanged. Full checks/build and owner phone feel/FPS validation are separate; owner phone review pending.

# Previous delivery: v6.56.3 — equipment browsing and decision flow

Equipment uses instance cards with readable names/mod previews, All/New/Crafted/Favorite filters, newest/iLv/rarity/enhancement sorting and a paginated explicit-mod picker. Gacha and utility actions are under More tools. Selecting an item opens a dedicated detail page; Equip/Enhance, Compare and Craft stay pinned while details scroll. Compare starts with all normalized numerical stat gains/losses, including base/implicit/affix effects, and collapses unchanged mod rows behind a counted toggle. Full item mods remain visible with shared Prefix/Suffix headings. Existing action callbacks, enhancement costs/risks, protection guards and gear/save values remain; missing/destroyed items are handled. Fixed footer objects/zones are compensated by existing menu scrolling and cleared on screen builds. Focused tests cover browsing immutability, filters/sorts/mod intersections, actual render methods and scroll hit coordinates. Owner phone touch/FPS review pending.

# Previous delivery: v6.56.2 — equipment mods and comparison

Equipment selection shows full implicit/unique/prefix/suffix lines again, including equipped items. Compare opens a separate scrollable page with equipped/selected item names, base ATK/armor, wrapped mod values, tier and explicit increase/decrease/gained/lost/unchanged/different labels. Item arrows allow browsing without equipping; landscape Equipment also exposes Mods/Compare. Original equipment, crafting, enhancement, sell/dismantle guards and save values remain. Regression tests exercise actual render methods, long text at three viewports, missing mods, same-item inspection and navigation without item mutations. Owner mobile review pending.

# Previous delivery: v6.56.1 — endings, epilogues and growth

Two painted victory/defeat environments, all fifteen stage epilogue illustrations and three eight-frame growth effects are integrated. Sources/prompts/packing: assets/incoming/ending_growth. Runtime: assets/ui/results, assets/story/epilogues and assets/vfx/growth_*.webp. Portrait epilogues stack illustration and text; landscape separates them into columns. Story wording and Continue/Summary state guards remain; Rift skips epilogues. Painted backgrounds sit behind the existing summary/death panel and final victory. Level-ups, first mastery, character level gains in summary, Build selection, Evolution and Unique auto-upgrade have NORMAL alpha effects; world effects throttle and central cleanup cancels them, summary effects cancel on redraw/navigation/shutdown. Original EXP/TP/rewards/revive/save/gameplay calculations remain. Reward reveal/Jackpot and crafting art remain separate future work. Owner mobile visual/FPS review pending.

# Previous delivery: v6.56.0 — painted Talent icons

All 218 Core and Build path Talent nodes across seven heroes have individually mapped painted atlas icons. Runtime 128px frames: assets/art/talents; raw generated PNGs, normalized RGBA atlases, exact prompts, node/frame packing and contact review: assets/incoming/talent_icons. Tree nodes and selected details share the same art. Locked art is dimmed with a separate lock badge, ranks and capstone borders remain visible. Heroes/Talents menu group loads atlas sheets; missing art preserves emoji. Talent definitions, effects, ranks, TP costs, prerequisites, capstone exclusivity, reset/save and gameplay balance remain. tests/talent-icons.test.cjs compares the original definition hash and exercises actual rendering/point spending at three viewports, alpha contracts and missing art. Owner mobile visual review pending.

# Previous delivery: v6.55.99 — monster animation Batch 9

Batch 9 is implemented: seven Four-Season Conservatory and seven Root Throne species each have 16 authored movement/idle/action/hurt/death poses (224 total). Runtime lossless-alpha WebP: assets/art/ch2_seasons and assets/art/ch2_root. Raw/packed PNGs, exact prompts, manifest, packing and animated review: assets/incoming/ch2_s4_animations and assets/incoming/ch2_s5_animations. Equinox Colossus Elite shares the existing golem identity while retaining .42 scale and [48,80,80] circle. Four shooters have preparation/fire clips, both dashers have windup/dash and both bombers warn once per life. Existing stats, colliders, aura values (.76 Seasons/.78 Root), five/six-shot siege volleys, objective nodes, boss/miniboss controllers and P1–P5 balance remain. Root identity references use atlas cells 0/1/6/2/3/4/5 in named species order; the old generic fallback retains its original type/frame mapping. Batch 9 regression fixtures capture original combat at v6.55.98. All scoped art orders A–E are delivered; owner mobile visual/FPS and gameplay review remain pending.

# Previous delivery: v6.55.98 — Build path VFX

Five painted Build effects are integrated: Berry Blast, Shotgun muzzle flash, Glacier Bloom, Glacier Shatter (eight authored frames each), and static Frost Lance ground trail. Runtime alpha WebP: assets/vfx; raw/packed PNGs, exact prompt, frame metadata and review: assets/incoming/vfx_path_uniques. Effects use NORMAL blend, central tracked cleanup and original missing-art fallbacks. Existing three-per-200ms shatter visual budget remains; trail expiry removes art and transition cleanup removes both art and trail damage state. Damage/range/charge timing, freeze duration, three-second trail/0.4s damage ticks, twin dash and card effects remain. Owner phone visual/FPS review pending. Remaining art: batch 9, 14 ordinary season/root creatures.

# Previous delivery: v6.55.97 — Build card icons

Fifteen Build upgrade cards now have distinct painted icons: four Sniper, five Shotgun, three Glacier Bloom and three Crystal Impaler cards. The 4x4 source sheet keeps the final cell reserved/transparent. Runtime lossless alpha WebP: assets/art/build_cards; original/normalized sheet, 256px RGBA PNGs, exact prompt, packing and preview: assets/incoming/build_cards. Only upgrade iconKey mappings change; build-selection art, effects, ranks, prices, draft weighting and P1–P5 balance remain. Owner mobile visual review pending. Remaining art: batch 9 (14 ordinary season/root creatures) and Unique VFX.

# Previous delivery: v6.55.96 — Chef equipment art

Head Chef Medal and Golden Spoon Ring now use painted 256px RGBA icons through the existing gear image loader and shared equipment/crafting/Bazaar/reward views. Runtime: assets/gear/amulets/am_chef.png and assets/gear/rings/ri_chef.png. Combined sheet, original generation, exact prompt and packing metadata: assets/incoming/chef_gear. Prices, enhancement effects, stats and Royal Chef set bonuses are unchanged. Owner mobile visual review pending. Remaining art: batch 9 (14 ordinary season/root creatures), Unique build card icons and Unique VFX.

# Previous delivery: v6.55.95 — Elite and special creature art

Elite/special art batch B is implemented: Crown Sapling, Mini Jelly, Chapter 3 Elite, Feast Target and Mimic Chest each have 16 authored poses. Packed RGBA PNG/raw/exact prompts/packing/contact/animated review: assets/incoming/elite_summons; runtime lossless alpha WebP: assets/art/elite_summons. Crown Sapling uses C2-1 atlas cell 6 identity; Chapter 3 Elite uses the ash/gold crowned seed knight design from the brief. Feast carries a food plate and uses flee clips, without an attack clip. Mimic is a toothy living chest. Existing world sprite boxes/circle radii/centers are preserved when 62px generic Elite and 48px chest art become 256px frames. Mini Jelly keeps .36 scale and [70,58,70] circle. HP/damage/speed/EXP, Elite gates, Warden half-HP three-child split, Feast timers/Hunger share and Mimic chance/tier/reward remain. Animated Feast pool reuse cancels its escape fade and clears fleeing state; missing sheets retain original art. Boss/miniboss pose/death controllers remain separate. Owner mobile visual/FPS review pending. Ordinary season/root art (batch 9), Chef gear and card/Unique VFX art remain.

# Previous delivery: v6.55.94 — monster animation Batch 8

Seven Nectar Hive creatures including Tiny Grub receive 16 authored poses each. Flying species flap wings; Dartwing has windup/dash, both Pollen Sniper and Choir Moth have preparation/firing, Honey Bomb has a once-per-life low-HP warning. Runtime assets: assets/art/ch2_nectar. Original/raw/packed sources, exact prompts, packing and review: assets/incoming/ch2_s3_animations. Original HP/damage/speed/EXP, circles, wax guard aura and 0.74 guard multiplier, flower targeting, Choir Moth three-shot fan, caps and Story P1–P5 remain. Atlas cell 7 flower fallback, generic Elite and boss/miniboss art remain. Tiny Grub has an existing atlas/type mapping but no current spawn caller or special stat branch; its existing basic stats/1 EXP remain, without adding summons. Owner mobile visual/FPS review pending. Next: batch 9, Four-Season Conservatory and Root Throne.

# Previous delivery: v6.55.93 — monster animation Batch 7B

Seven Mycelium Marsh creatures including Sporeling have generated 16-pose sheets, RGBA PNG sources and lossless WebP runtime assets. Source/raw/manifest/exact prompts/packing/review: assets/incoming/ch2_s2_animations; runtime: assets/art/ch2_mycelium. Existing stage loading, per-species fallback and central presentation handle movement/idle/actions/hurt/death/freeze/pool reuse. Both Sniper and Oracle prepare/firing clips; Cap Hopper has windup/dash; Mold Sac warns once per life. Original HP/damage/speed, collider circles, guard aura, Drifter acid, Mold Sac two-child split, zero Sporeling EXP, live caps and P1–P5 balance remain. Old atlas cell 7 stays for Clean Air Wisp; generic Elite and boss/miniboss art are outside 7B. Packing reuses scripts/pack-canopy-animations.py with --batch mycelium; default 7A mode remains intact. Owner mobile visual/FPS review pending. Next: monster batch 8, Nectar Hive including Tiny Grub.

# Previous delivery: v6.55.92 — monster animation Batch 7A

Six Fermented Canopy species have generated 16-pose sheets, packed RGBA PNG sources and lossless WebP runtime assets. Source/raw/manifest/exact prompts/packing/review: assets/incoming/ch2_s1_animations; runtime: assets/art/ch2_canopy. Stage loading, original atlas fallback, movement/idle/action/hurt/death, shooter windup, bomber warning, freeze/thaw and pooled reset use the existing presentation controller. Original combat, collision circles, Story P1–P5 and pacing are preserved. Audit correction: C2-1 Elite is separate Crown Sapling (atlas cell 6), not Root-Back Beetle; its art stays intact and its animation is now listed in batch 10. Owner performs mobile visual/FPS review; pending. Next monster batch: 7B, seven Mycelium Marsh creatures including Sporeling. See docs/MONSTER_ANIMATION_PLAN.md and docs/art_orders/14_REMAINING_ART.md.

# Previous delivery: v6.55.91 — P5 all-hero Story drafts

P4 Story draft guarantees now cover Yuzu/Cocoa/Taro/Sesame across 12 existing paths. Berry and all heroes before path selection receive eligible core attack choices. Recovery preserves one path/core choice; full/banished upgrades remain excluded. Existing authored effects, ranks, milestones, special-mode/noSpecial pools, P1 earned EXP, P2 pickups, P3 Hunts and P4 cadence remain unchanged. Owner has not played P4 and explicitly requested keeping current values; no power/crowd/boss retuning. See docs/ALL_HERO_DRAFTS_P5_2026_10_08.md. P1–P5 code implementation complete; mobile/balance playtesting remains pending.

# Previous delivery: v6.55.90 — P4 Story build choices and late-wave pressure

Normal Story Strawberry/Mint drafts guarantee an eligible chosen-path upgrade, plus an eligible shared attack choice when slots allow; critical healing preserves the path slot. Banished/maxed cards stay excluded, noSpecial loot and special modes keep weighted pools, and special milestone screens keep their gates. Stage 3–15 late objective waves refill at 1.4s/5 foes then 1.2s/6 foes, within existing live/shooter caps and finite reserves. Stages 1–2, timed Swarm, replay cadence, mini/boss modes and special modes retain their pace. P1 earned EXP, P2 pickups and P3 staged Hunts remain. See docs/BUILD_PRESSURE_P4_2026_10_08.md. Owner gameplay/mobile tuning is pending; P5 remains pending.

# Previous delivery: v6.55.89 — P3 staged Story missions

Story Hunts alternate clear-to-Elite steps (6/8/10 ordinary kills per round by chapter), retaining marked-target counts. Opening fill ends with one Elite showdown. HUD displays step progress. Intermediate transitions pay no reward and preserve P1 earned EXP/P2 pickups. Objective-owned Elite retries survive upgrade pauses and missing targets; clear steps suppress Elite spawning/curse. Exhausted clear-step reserves replenish only missing required foes within live caps. Recipe/Rift/Boss Rush/Endless/Tutorial and replay meter retain their flows. See docs/STAGED_MISSIONS_P3_2026_10_08.md. P4/P5 remain pending; owner gameplay/mobile tuning remains required.

# Previous delivery: v6.55.88 — P2 field recovery and earned-EXP magnets

P2 is implemented for Story across all 15 stages. Hearts heal 18% max HP with item bonuses (35% max HP ceiling), remain usable later at full HP, and obey a shared 2-ground/4-per-stage cap and 25s drop interval; mini can bypass the interval only. Elite heart chance stays 18%, crate chance is 20%, ordinary foes never drop hearts. Magnets use 1-ground/3-per-stage/35s limits, require earned ground EXP for combat drops, and have kill-weighted bad-luck protection. No guaranteed post-mini Story magnet; P1 already gathers earned orbs. Empty Story magnets remain on the ground. Story lifesteal/lifeOnKill share 3% max HP recovery per active second and respect no-heal/pact rules; Hungry Pact disables items only as its description promises. Stage entry resets limits; wave transitions retain them and ground items. Story crowds, kill EXP and rewards from P1 remain. Special modes keep prior drop rules/heal amount, while full-HP/zero-effect heart preservation is shared. Actual-method pickup regressions, full checks and www build pass. User owns all gameplay/mobile/balance testing. P3–P5 remain pending. See docs/FIELD_PICKUPS_P2_2026_10_08.md.

# Previous delivery: v6.55.87 — P1 earned growth

P1 is implemented: story combat EXP is earned per defeated enemy, no combat issuance cap and no automatic missing-EXP top-up. storyEnemyXp uses 2x authored enemy EXP, Hunt target 24 and miniboss 60. Five successful encounter rewards are fixed 20/30/40/50/60 (200 total), not a guaranteed end-stage level. Failed/timeout objectives only collect earned orbs. Settlement tracks questPaid to prevent duplicate reward; replay mini gets 40, final progress pays remaining 160, without changing shared quota. Story orb allocation failure pays earned EXP immediately; normal collection/completion each apply XP multiplier once. Final-boss escorts also grant earned EXP; boss defeat gathers their earned orbs without a second objective bonus. Linear Story level curve, spawn caps/quotas/timed Swarm, Hunt recovery, optional Mint in Stage 3 and boss HP tuning stay. Tutorial/Recipe/Rift/Boss Rush/Endless retain original EXP. Tests now prove more actual kills -> more EXP and levels, harder targets matter, collected/uncollected earned parity, no completion compensation, failure/replay idempotence, full orb pool fallback and multipliers across 15 stages. Full checks/www build pass; actual gameplay balance remains user-owned. P2 health/magnet/drop balance and subsequent quest/card phases are pending, not included in P1. See docs/EARNED_GROWTH_P1_2026_10_08.md. Old quota/guaranteed-Lv18 notes below are historical.

# Previous delivery: v6.55.86 — recover missing Hunt targets

Reported C1-5 wave4 Hunt stuck with no monsters. Found a lost-retry path: failed spawn used a one-shot timer whose callback dropped the retry if level-up was open. Hunt now owns a retry deadline and actual objective tick ensures one marked target while playing; failures retry every 1s, defeated targets have a 700ms gap. Recovery handles a disappeared target without crediting a kill, avoids duplicate targets, and has no delayed callback crossing objectives/runs. Story ordinary reinforcements reserve one live slot when Hunt lacks a target; reserved target bypasses ordinary quota but shares hard live cap. Target resets pooled alpha/flee/blink state and cancels old tweens. Spawn and active target positions clamp inside arena; flee stops at the arena edge. Quest targets/progress/rewards, Swarm tuning and Story XP budget are unchanged. Actual-method tests cover C1-5 wave4 cap exhaustion plus level-up, full pool, all 15 stages sequential Hunt completion, disappearance, dedup, arena bounds and objective/mode replacement. Full check/build pass; user owns in-game/mobile verification.

# Previous delivery: v6.55.85 — restore timed Swarm pressure

Player feedback: v6.55.84 reduced crowds too far and timed Survive the Swarm exhausted its reinforcement quota before the countdown. Timed story Swarm now replenishes until waveTimer reaches zero, with hard live caps and unchanged bounded EXP. This exemption is only active timed Story survive, not objective/replay/mini/boss/Endgame. Base story live caps 18/22/26/30/34 (+4 per later chapter); Swarm adds 6, movement objectives use 80%. Timed refill: groups 6–8 every 1.2s below 85% cap, surge pulses at ~10s then every 14s, max 10–14 in available slots. Other objective/replay refill: 4–5 every 1.6s below 80%. Finite objective quotas now 50/56/64/72/80; replay shared quota 240. XP per enemy still uses original 30/32/36/40/44 units (replay 182), so more reinforcements do not dilute early EXP. Combat/settlement cap remains 1020 base EXP total and Lv5/8/11/14/18 milestones. Timed reinforcements can grant normal Sugar within the fixed encounter duration, but cannot extend its timer or EXP budget. Mini/boss caps, Stage 3 free hero choice and Story HP scaling remain v6.55.84. Actual stage-loop regressions prove new enemies still arrive in the final five seconds under rapid clears, live caps hold for slow clears, and settlement EXP matches both. Full checks/build pass; user owns in-game/mobile balance review.

# Previous delivery: v6.55.84 — finite story waves and fair EXP

All 15 story stages use finite shared spawn quotas, lower live caps and a linear in-stage EXP curve (next level = 12 + 6*(level-1)). Five encounter budgets 84/126/180/234/396 total 1020 base EXP and milestones Lv5/8/11/14/18; slot 3 is the existing mandatory miniboss, not an extra quest. Combat gets rounded 60%, completion pays the remainder plus unused combat budget, collecting issued active orbs first. Failed orb allocation does not consume budget; settlement is idempotent and EXP multipliers apply once. Quotas 30/32/36/40/44 include ordinary elites, summons and boss escorts; Hunt targets are reserved outside reinforcement quota but share live caps. Base live caps 12/14/16/18/20, +4 per later chapter; movement objectives use 75%, shooters max 2/3/4. Spawn batches 3–4 every 2.4s, refill below 60%; no extra story swarm burst or pressure expansion. Miniboss live caps 8/10/12 and final-boss caps 4/6/8; final adds have a separate finite 8/12/16 quota, no EXP. Quota limits prevent unbounded EXP and Sugar farming. Kill-count HP escalation is disabled for finite story waves; boss level HP growth is 2.5%/level (Endgame stays 5.5%). Stage 3 forced Mint gate removed, optional introduction retained. Existing quest types/targets/art remain, fill target matches quota, story overtime preserves bounded EXP. Successful quests clear remaining enemies immediately and pause for all queued cards. Cleared-stage replay: one shared 182 quota, goal 140 progress, 390 base XP checkpoint at mini defeat, 1020 total before final boss. Existing scheduleStageEvent waits through upgrades. Recipe/Rift/Boss Rush/Endless/tutorial retain their own rules. Automated checks and www build pass; user owns all in-game/mobile/balance testing, especially Stage 1–2 regression and Stage 3 Mint feedback. See docs/STORY_WAVE_BUDGET_2026_10_08.md.

# Previous delivery: v6.55.83 — Strawberry/Momo S1–S5

Strawberry/Momo is one hero (runtime momo). S1–S5 code is complete: focused ordinary cards use path/shared/universal 65/20/15 weights, with foreign-path exclusion, critical-HP Recovery and exhausted-pool fallback. Basic and Unique descriptions are distinct; count overflow converts to power, and existing upgrade IDs/ranks remain stored and visible in Recipe builds. Sniper automatically charges one heavy seed (340ms +60ms per Heavy Draw rank); dash/hurt releases a weaker partial shot. Extra seed investment adds 12% power each. Heart Railgun grants full Basic +30% power/10 target penetration and fully charged manual Unique +40% damage. Shotgun caps at 12 pellets, overflow +8% power each; Petal Breacher grants +35% power, +20% close impact and a heavy center pellet without automatic piercing. Ricochet still bounces after Evolution, visits each enemy lifetime once, caps at 8 bounces and additive 2.2x growth; Heart Pinball adds two bounces and a 25% final splash. Isolated surviving bosses receive a bounded fallback impact (max 80% seed base power). New path cards: Heavy Draw, Heart Slug, Seeking Hearts and Lone Heart. Shared active seed cap 32, splash max 16 targets, painted splash VFX max 3/200ms. Basic volleys, charges and delayed Unique hits guard run epoch and basic identity; pooled metadata resets. Actual-method regression/stress checks, full npm check and www build pass. User performs all in-game/mobile/balance/FPS testing; those results remain pending. Reused existing painted art. See docs/STRAWBERRY_MOMO_AUDIT_2026_10_08.md. Mint and monster batches remain independent.

# Previous delivery: v6.55.82 — Mint M4 path Evolutions + Strawberry/Momo audit

Mint M1–M4 implementation is complete. Existing path/evolved save fields now select Hailstorm Arsenal (barrage: six queued 70%-power lances every 4s), Absolute Zero (glacier: +65% opening Shatter radius, +1 chain step up to 3, still six bursts), or Heaven Piercer (pierce: every third successful evolved full throw +35% power, 8+rank penetration and +35% Rupture). Partial/capped shots do not advance the evolved cycle. Cards/Codex/Recipe editor show path Evolutions. All Mint lances/shards share a 24-active cap; shards max 6/burst and 12/200ms; reaction VFX max 3/200ms. Glacier blooms replace shard spray and map Shard Bloom investment to power; excess Glacier lance count becomes +12% bloom power each. Standard lance fallback timers and Arsenal use run-scoped artDelay; stale projectile epochs reject hits. Heavy impact is throttled to 25ms hit-stop/350ms. Actual-method stress/regression checks and www build pass; user performs all in-game/mobile/balance/FPS testing. Reused painted art, no new sprite assets. Strawberry/Momo are one hero (runtime momo); audit documents Ricochet losing bounces after Evolution, count/text inconsistencies and proposed S1–S5, not implemented. See docs/STRAWBERRY_MOMO_AUDIT_2026_10_08.md. Monster batches remain independent.

# Previous delivery: v6.55.81 — Mint Crystal Impaler M3

Crystal Impaler automatically charges one heavy lance (320ms, +80ms per Heavy Draw rank). Dash/hurt releases a weaker partial shot without adding or consuming Impale. Full hits add Impale (max 3, expires after 5s); the next full hit triggers Crystal Rupture with a 600ms target cooldown. Targeting prefers boss/miniboss, then elite, then ordinary enemies. Heavy Draw, Impaler and Executioner cards added; Overpenetration preserves the old p_coldblood ID. Extra lance investment converts to +12% damage per extra lance; old Shard Bloom ranks improve Rupture. Existing Unique can apply full-charge Impale. Phase gates, pooled resets, run cancellation and duplicate overlap are covered by actual-method tests. Full automated checks and web build pass. User owns in-game/mobile testing. Next: M4 path Evolutions and visual polish; monster batches remain independent.

# Previous delivery: v6.55.80 — Mint Glacier M2

Glacier now builds three Frost stacks on Frozen/Brittle targets; the next frost hit triggers Shatter or Crystal Rupture. Bosses/minibosses and explicit freeze-immune foes use three-second Brittle without hard freeze. Existing Frozen path/Talent/mod bonuses also affect Brittle. New cards Deep Freeze and Chain Shatter retain existing path IDs and all prior ranks. Reaction caps: two propagation steps, six bursts per reaction and per 200ms window, 24 neighbors per burst, three painted VFX per window, 450ms target cooldown. All damage scales from Frost Lance power, never max HP. Phase immunity is respected; spawn/pool reset clears stacks and uses a separate lifetime token. Glacier Unique detonation is run-scoped/cancelable and guards recycled targets. Full automated checks and web build pass. User owns in-game/mobile testing; balance/visual acceptance awaits their feedback. Next: M3 Crystal Impaler charge/Impale/Rupture, then M4 Evolutions/polish. Monster art batches remain independent.

# Previous delivery: v6.55.79 — Mint build paths M1

Glacier Bloom / Barrage / Crystal Impaler names now share existing runtime IDs glacier/barrage/pierce. Ordinary Mint rolls use 65/20/15 path/shared/universal weights with exhausted-pool fallback and critical-HP Recovery; foreign path upgrades and rapid-fire cards on non-Barrage paths are excluded. Packed Quiver and all excess Barrage lance bonuses convert above the three-lance cap into +18% shard damage per excess lance, including after Evolution. Existing Talent/gear IDs and invested ranks remain valid; Endgame old off-path investment stays visible/costed/applied. Regression tests, full checks and web build pass. Browser smoke/phone visual review pending (Chromium download invalid ZIP). Next Mint task: M2 Glacier Frost stacks/Brittle/chain Shatter; M3/M4 remain planned. See docs/MINT_BUILD_PATH_REWORK_2026_10_07.md. Monster animation 7A/7B status is independent and unchanged.

# Previous delivery: v6.55.16 — monster animation commit 6

Ten real 16-pose sheets cover Chapter 1 stage 5 and Chapter 3 ordinary monsters, plus Stage 5 Elite. Runtime: assets/art/monster_batch6; source/manifest/prompts/packing/review: assets/incoming/monster_batch6. Original Chapter 3 apparent sizes, combat stats, collision circles and action timers are preserved. New Stage 5 keys use one authored defeat ghost. Actual-method tests, full checks and web build pass; phone visual/performance review is pending. Remaining commits 7–10; next is Chapter 2 stages 1–2 including Sporeling. Chapter 3 generic Elite remains in commit 10. See docs/MONSTER_ANIMATION_PLAN.md.

## Previous delivery: v6.55.15 — monster animation commit 5

Chapter 1 Ice monsters now use five real 16-frame painted sheets (Wisp, Shard, Caster, Frost Bubble, Guardian), including Guardian Elite. Runtime: assets/art/ch1_ice; sources/manifest/exact prompts/packing/review: assets/incoming/ch1_ice_animations. Combat values, timers, original collision circles and frostbite flags are preserved. Actual-method tests, full checks and web build pass; phone visual/performance review is pending. Remaining monster animation commits 6–10; next is commit 6 (existing Chapter 1 stage 5 and Chapter 3 sheets). See docs/MONSTER_ANIMATION_PLAN.md.

## Previous delivery: v6.55.14 — monster animation commit 4

Chapter 1 Fire monsters now use five real 16-frame painted sheets (Ember, Chili, Grinder, Pressure Pot, Golem), including Golem Elite. Runtime: assets/art/ch1_fire; source/manifest/exact prompts/packing/review: assets/incoming/ch1_fire_animations. Chili has left-facing art and separately repaired dash/recovery poses; Pressure Pot also has left-facing art; Ember, Grinder and Golem face right. Combat values, colliders and timers are preserved. Actual-method tests, full checks and web build pass; phone visual/performance review is pending. Remaining monster animation commits 5–10; next is commit 5 (Ice). See docs/MONSTER_ANIMATION_PLAN.md.

## Previous delivery: v6.55.13 — monster animation commit 3

Chapter 1 Drain monsters now use five real 16-frame painted sheets (Slime, Dasher, Caster, Bomber, Tank), including the Tank Elite. Runtime assets: assets/art/ch1_drain; source/manifest/prompts/review: assets/incoming/ch1_drain_animations. Combat stats, hitboxes and attack timing are unchanged. Tests and web build pass. Phone visual/performance review is pending. Next requested batch is commit 4 (Fire); commits 4–10 remain. See docs/MONSTER_ANIMATION_PLAN.md.

## Current release — v6.55.12 (Monster animation commit 2)

Six Chapter 1 ant species have generated raster walk/idle/action/hurt/death sheets. PNG sources, prompts, packing report and animated review preview: assets/incoming/ch1_ant_animations. Runtime WebPs: assets/art/ch1_ants. Animated selection precedes old readable/static fallback; source frame size stays 96px. Spitter/Acid prepare shots without changing cadence; Scout windup/dash and contact bite hooks use authored frames; living injured bombers show a one-time warning. Both authored facing directions are supported. Actual-method tests prove eight role mappings and original HP/damage/scales/circles. Full checks/web build pass; phone review pending. Remaining monster commits 3–10; next: Drain monsters. See docs/MONSTER_ANIMATION_PLAN.md.

## Current release — v6.55.11 (Monster animation commit 1)

Central monster presentation now owns idle/move and timed action poses, pauses animation while frozen, clears pooled state, and keeps walk-sheet proportions stable. Existing Acid Ant and stage 5 reset timers were removed. Hunt and Mini Jelly texture overrides reset presentation correctly. Optional action/death clips can be registered by later art batches; no new monster art in this commit. Actual-method tests and full checks/web build pass; phone visual review pending. Next: commit 2, Chapter 1 ant animation. Full 10-commit plan and integration schema: docs/MONSTER_ANIMATION_PLAN.md.

## Current release — v6.55.10 (VFX art batch 5)

Painted Recipe meteor, orbiting lollipops and Dango helper replace runtime emoji presentation. Source PNGs: assets/incoming/vfx_recipe_summons; lossless WebPs: assets/vfx. Meteor warning/impact reuse batch 4 shock art. Combat and targeting values remain unchanged. All summon art clears on transitions; meteor epoch guard prevents damage crossing runs. Actual-method tests cover meteor timings/damage/cancellation, summon reuse/expiry and original helper shots. Full checks/web build pass; phone visual/performance review pending. All five scoped VFX batches are created and integrated; see assets/incoming/vfx_mint/NEXT_BATCHES.md.

## Current release — v6.55.9 (VFX art batch 4)

Eight painted Recipe effects: shock, burst, freeze, sour, cleanse, immunity, burning ground and pulling hole. PNG sources: assets/incoming/vfx_recipe_fields; runtime WebPs: assets/vfx. Original combat values are preserved. Zone tweens stop at expiry; all tracked art and recipe zone references clear on transitions. Full automated checks/web build required; phone visual review pending. Remaining: batch 5 meteor, orbiting candy and helper.

## Current release — v6.55.8 (VFX art batch 3)

Three new painted VFX: purple-only Void Pull, Relic jam blob, Great Hunger metamorph sheet. Source PNGs in assets/incoming/vfx_void_jam_boss; runtime WebPs in assets/vfx. Old brown Cocoa Vortex inspected and rejected because the existing cast explicitly requires purple-only visuals.

Void Pull keeps original radius, pull force, tick/final damage and duration. Jam keeps three deposits at 0/50/100px, 500/560/620ms detonation, 70px blast and original damage. Great Hunger keeps phase pose, invulnerability/phase logic, flashes and warnings; one NORMAL-blended eight-frame burst replaces the generic rays/seal/shadow presentation.

Run-scoped art timers are cancelled when art is cleared; an epoch guard prevents stale callbacks damaging a newly started run. Tests cover interruption at four times, natural void damage, jam positions/detonations and boss presentation cleanup. Full checks/web build pass; phone visual/performance review pending.

Next: VFX batch 4 (Recipe shock/freeze/sour/cleanse/burn/hole), then batch 5 (meteor/orbit/buddy). See assets/incoming/vfx_mint/NEXT_BATCHES.md.

## Current release — v6.55.7 (VFX art batch 2)

Batch 2 includes three new generated raster assets: Strawberry charge aura, wind-cut ribbon and shield bubble. PNG intake: assets/incoming/vfx_charge_shield. Runtime WebP assets: assets/vfx. Strawberry/Momo auto Sniper and held Unique show the charge halo; released Unique leaves the painted wind ribbon. Aiming line and charge meter remain procedural for precise feedback. Shield art follows the player, adjusts with stacks and hides at zero shields.

Batch 1 Mint assets are now wired too: ice-shard visual retains its original pooled collider, shatter/Gale sheets use NORMAL blend and 8 frames at 20fps. Gale trail uses an authored sheet frame instead of rectangle/leaf emoji when art is present. Combat/balance values remain those of v6.55.6.

Tracked presentation objects clean up on menu/next run/shutdown, aura on cancel, bullet art on expiry/pool reuse. Full automated suite and web build pass; phone visual/performance review pending. Next: batch 3 (Void Pull, jam trail, boss transformation), then Recipe effects and helpers. See assets/incoming/vfx_mint/NEXT_BATCHES.md.

## Current release — v6.55.6 (4 Oct 2026)

Continued from branch head v6.55.5 (6a36a21), including Stage 3 Mint introduction/forced first clear and all intervening development. This entry supersedes older version/status headings below.

- Strawberry/Momo Sniper basic shots and charged Unique now use `assets/vfx/strawberry_charge_projectile.webp`. Separate visual preserves the original physics hitbox; pool reuse and exit destroy it.
- Mystery/Boss Loot modal owns its reveal timers and container. Close, replacement, stage exit/start and shutdown cancel pending callbacks and recursively stop tweens, destroy children and guard repeated reward acceptance. Double/Reroll continuation retains its existing flags.
- Mint Piercer Build damage multiplier 1.60 → 1.75 (+9.375% relative); cooldown, range and pierce count unchanged. Card description matches.
- Validation: full `npm run check`, reward lifecycle fixtures and `npm run build:www`. No local Chromium available; phone visual/playtest remains pending.
- Next: phone review of Boss Loot Keep/Double/Reroll → next stage, charged projectile readability and Mint Piercer balance.

## Mint fully sprite based — v6.0.64

User explicitly requested sprite sheets for every action. Gameplay no longer creates or updates the cutout rig, loads its atlas, or routes ghosts/attacks/hits through it. Existing sprite sheets handle all Mint actions. Frost Lance restores its original 360ms attack pose and immediate projectile launch. Experimental rig code/assets/tools remain available for reference, but are inactive in gameplay. Automated checks/build pass; mobile visual review remains pending.

## Mint sprite running restored — v6.0.63

User preferred the authored sprite-sheet run over the procedural rig gait. Mint now shows the existing sprite sheets for idle, run, moving casts, dash, hurt, Wind Rush and KO. Rig remains available only for a stationary spear throw. Sprite updatePose/animatePlayer continue to drive the original run; root visibility is mutually exclusive with the player sprite. Dash trails use the visible presentation. Frost Lance keeps the v6.0.62 release timing (192ms). Mobile transition review remains pending.

## Mint spear throw — v6.0.62

Mint rig adds wind-up, release, follow-through and recovery while retaining the accepted smooth run. Frost Lance waits 192ms for the hand release when the rig is active; the sprite fallback still fires immediately. Held spear disappears at release and fades back during recovery. Wind Rush retains its original thrust pose. Verify the throw timing and readability on a phone.

## Mint smooth joint motion — v6.0.61

Accepted directional pose retained. Replaced one-pole joint easing with velocity-continuous critically damped springs, including boot roll and locomotion blend. Motion samples at up to 120Hz substeps so 20/30/60/120 FPS yield matching joint trajectories. Cubed-sine foot lift/roll softens toe-off and landing. Repeated casts retain joint velocity. Preview generator now renders native 60 FPS; four-second video has 240 native frames, GIF 30 FPS. Full checks/build pass; device frame-rate/feel confirmation pending. Preview docs/previews/mint_run_v6_0_61_60fps.mp4.

## Mint directional run correction — v6.0.60

Feedback identified backward-bent free elbow and front-facing feet shuffling outward. Free forearm flexion reversed to forward. Replaced frontal separate foot lanes with sagittal forward/back stride; both knees bend backward with stable far/near skin identity. Hip origins narrowed, swing foot advances from rear to front while stance returns rearward; toe lift bounded. Generated matching right-facing profile boots and added reproducible boot overlay packer. Contact cycle and run GIF inspected; full checks/build pass, mobile feel review pending. Preview docs/previews/mint_run_v6_0_60.gif.

## Mint flowing run — v6.0.59

User accepted limb shapes but gait felt robotic with arms tucked against body. Added visible bent-elbow free-arm pumping, coordinated weapon-arm movement during locomotion, smooth squared-sine swing lift, wider stride, sinusoidal double-step hip bounce, forward torso lean/head counter-motion and delayed hair/skirt sway. Free arm now draws over dress. Idle/run transitions use existing exponential blends; gait phase remains distance based and continuous through casts. Tests verify arm swing/elbow bend/foot clearance/layering and stop blend in addition to no crossed feet and stable grip. Preview: docs/previews/mint_run_v6_0_59.gif. Real-device feel review pending.

## Mint neutral limb art rebuild — v6.0.58

Device/preview feedback still showed bent arms and inward boots. Previous gait fixes did not correct baked diagonal source skins. Repainted eight neutral vertical limb parts with imagegen, retaining head/torso/hair/lance. Centered shoulder/elbow/hand skin origins, matched short link lengths, moved shoulders onto painted torso sockets, shortened arm chain and calibrated fist/lance attachment. Packer replaces limb slots and refreshes inline frame bounds reproducibly. Production-pose contact sheet and GIF reviewed; Full tests/build pass; real-device visual confirmation pending. See docs/MINT_RIG_TRIAL.md.

## Mint gait / grip correction — v6.0.57

Replaced opposed frontal leg swinging with two-bone IK foot targets in separate lanes. Smaller stride and lift, upright boots, shorter chibi legs, root aligned to existing ground shadow. Distance-based phase independent of frame rate, smoother torso/hair motion. Relaxed right elbow and attached lance: no local hand-to-weapon translation during casts. Regression checks cover 360 moving/casting samples without crossed feet, planted boot angles and equal phase at 30/60 FPS. Preview updated; real-device motion review still pending.

## Mint 2D cutout rig trial — v6.0.56

Mint gameplay now uses a painted 16-part atlas with 15 hierarchical bones and 14 rigid skins. Forward kinematics, blended joint transitions, continuous gait, upper-body lance attacks, blink, hair sway, dash/hurt and bounded rig ghost snapshots. Original physics sprite remains invisible and handles combat/collision; old sprite art is fallback when rig texture is unavailable. Other heroes and menu portraits unchanged. Production-pose preview: docs/previews/mint_rig_motion.gif; specification and reproduction: docs/MINT_RIG_TRIAL.md. Automated rig integration checks, full checks and build; real-device visual/performance review pending before migrating other heroes.

## Temple UI / character EXP / digging lifecycle — v6.0.55

Aligned Special Core button labels and polygon diamonds to painted sockets. Sugar is clamped to 9,999,999 on load, save and add, including direct rewards/sales. Summary displays permanent character EXP with multi-level animation; Sugar x2 moved below rewards panel, animation never awards EXP twice. Dig callbacks/tweens cancel on redraw, navigation and shutdown; completed pending digs settle exactly once; destroyed objects and original icon scales guarded. Automated feedback and destroyed-object digging fixtures added. Real-device visual/animation review pending. Next: assess Mint 2D rig as a separate task before migrating characters.

## C2-5 miniboss art/animation — v6.0.54

Replaced Ancient Root Knight four-pose atlas with imagegen 16-frame 4x4 RGBA sheet. Pack script keeps alpha, normalizes 256px cells with 18px gutters. Idle 0–3, walk 4–7, cleave 8–11, shield 12–13, summon 14, defeat 15. Charge uses faster walk cycle. Boot and lazy stage loader both register actions; walk supports metadata start index. Attack timers guard texture, death and pool tokens; spawn invalidates old tokens. Existing combat timing/damage retained; render scale compensates for padding and preserves the miniboss world collider radius. Full checks/build pass, green-backdrop cutout QA and walk preview inspected; mobile movement/attack review pending. Details: docs/art_orders/C2_5_ROOT_KNIGHT_ANIMATION.md.

## Sound design complete — commit 6, v6.0.53

All six sound-design commits implemented, 40 short generated WAVs total. Final stage summary: at most eight Sugar ticks, sequential currency reveals, Mastery/level cue and one ad x2 cue. Immediate exit/redraw/shutdown cancel pending presentation; x2 does not replay rewards. Final automated audit checks all new PCM assets for peaks/lengths and menu gain/voice budgets. Full npm check and www build pass; real-device listening remains pending. Next: mobile listening review; no sound implementation commits remain in docs/SOUND_DESIGN_ROADMAP.md.

## Sound commit 5 — v6.0.52

Ten permanent-progress/reward WAVs: core, talent, overcap, promotion, perk, ancient, daily, achievement, quest and claim. Regular/special Cores, hero talents, Rank Perks/Ancients and inventory inbox claims wired after saved changes. Daily and achievement callbacks guard duplicate reward taps; talents recheck current TP/cap. Checks/build and reward callback/mix tests pass; mobile listening pending. Next: sound commit 6, stage results and final mix.

## Sound commit 4 — v6.0.51

Eight equipment WAVs cover equip, lock/unlock, enhancement success/break/destruction, dismantle and sell. Inventory and legacy equip/enhance callbacks plus inbox dismantle emit after actual results. Uses bounded menu sound player with mute/volume/fallback. Checks/build and callback result tests pass; mobile listening pending. Next: sound commit 5, permanent progression and reward claims.

## Sound commit 3 — v6.0.50

Four dedicated generated WAVs (160–250 ms): affix capacity, numeric reroll, removal and reset. Actual mutation methods emit outcomes after currency/state updates. Locked items, missing lines and insufficient resources cannot emit success sounds. Existing confirmation flow preserved. Automated action/mix/WAV checks and www build pass; mobile listening pending. Next: sound commit 4, equipment actions.

## Sound commit 2 — v6.0.49

Dedicated deterministic forge WAVs for manual/auto roulette, visual tick cadence, single result cue, cancellation and exhausted resources. Craft voices use a separate two-voice limit with tick throttling; outcomes stop reel audio. Removed chest/slot/combat sound layering only in crafting roulette. Repeated Stop during reveal is guarded by the roll token. Tests: craft-sound and full npm check/build. Mobile listening review pending. Next: commit 3, affix changes.

# CLAUDE.md — สมองของโปรเจกต์ (อ่านไฟล์นี้ก่อนเริ่มงานทุกครั้ง)

> ไฟล์นี้คือ "ความจำถาวร" ของโปรเจกต์ ถ้าเปิดเซสชันใหม่/เพิ่ง `/clear` มา
> อ่านไฟล์นี้ให้จบก่อน จะได้ทำงานต่อได้ทันทีโดยไม่ต้องให้เจ้าของเล่าซ้ำ
> **เมื่อจบงานแต่ละก้อน ให้ปรับ "สถานะปัจจุบัน" และ "ถัดไป" ในไฟล์นี้ให้ตรงเสมอ**

## Sound commit 1 — v6.0.48
- Six-step roadmap: `docs/SOUND_DESIGN_ROADMAP.md`; only step 1 implemented
- Four deterministic short WAVs from `scripts/gen_ui_sfx.py`; semantic UI dispatch consolidates callback clicks; max two UI voices, independent of combat cap, SFX volume/mute respected
- Shared Back, craft confirmation and explicit rejection banners have distinct cues. Craft roulette and outcome sounds remain for steps 2–6.
- Next: listen on mobile, then sound commit 2 (craft roulette)

## Stage summary art — v6.0.47
- Generated `assets/ui/results/stage_summary_panel.webp`, painted medal/frame/reward tray/pink button
- Viewport-fit portrait panel; independent wrapped label/value columns; level-up points and mastery kept concise; currency tray supports 12 items
- Rewarded Sugar x2 and continue callbacks preserved; daily bonus and Sugar Order shown as separate rows
- Checks/build and summary layout test pass: three viewports, eight statistic rows, 12 currencies, ad/continue callbacks. Browser screenshot unavailable in this environment.
- Next: mobile visual review, especially compact/landscape reading sizes

## Special Temple Cores art — v6.0.46
- Generated raster card: `assets/ui/temple/special_core_card.webp`; gold/ivory frame, mint crystal socket and jade button
- Responsive rows show more cores on tall screens; dynamic text/icons/level gems overlaid; footer uses existing painted navigation art
- Checks/build and layout harness (390×844, 320×568, 844×390; bounds, locks, purchase, pagination) pass. Browser visual capture unavailable: Chromium download failed.
- Next: verify readable text, purchase hitboxes, MAX/locked states and portrait/landscape on mobile

## สถานะ All-hero movement — v6.0.45
- ใช้แนว Mint กับ Strawberry/Momo, Cocoa, Taro, Yuzu, Sesame และ Berry ที่รองรับเซฟเดิม
- เดิน/พุ่งไม่ถูก attack sheet ขัดจังหวะ; gait clock ต่อเนื่อง; ลด breathing/waddle/squash และมี cast recoil ทุกตัว
- ยืนโจมตียังมีท่าเต็มตัว, hurt และ Momo dash เฉพาะตัวคงเดิม; ใช้ภาพเดิม ยังไม่แยกแขน/ขา
- `npm run check` (รวม motion regression ทั้ง 7 ตัว) และ `npm run build:www` ผ่าน
- ถัดไป: เล่นเทสทุกตัวบนมือถือ โดยเฉพาะ Cocoa melee ขณะเดิน และ Momo dash/hurt

## สถานะ Mint movement trial — v6.0.44
- เดินต่อขณะยิง Frost Lance / Mint Gale, gait clock ไม่เริ่มใหม่เมื่อโจมตีหรือหยุดสั้น ๆ
- ลด breathing / waddle / squash; เพิ่ม recoil เบา ๆ; ชดเชย padding พร้อม texture ในเฟรมเดียว
- ใช้ชีตเดิม: ขณะเดินไม่ได้แยกแขนขว้างหอก; ยืนใช้ attack sheet เต็มตัว
- ตรวจ `npm run check`, motion regression และ `npm run build:www` ผ่าน
- ถัดไป: เล่นเทส Mint บนมือถือ เปรียบเทียบการเดินยิง / หยุดยิง / Gale / Dash และขนาดตัว

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
- **🏆 กฎเหล็ก (กฎหลักของเกม):** เลือกระดับความยากได้ 1-5 ต่อด่าน · **ยิ่งยาก รางวัลยิ่งดี** — ทุกระบบรางวัลใหม่ต้องเคารพกฎนี้ (`DIFFS[].reward`, `diffMul()`)
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
  **ยังเป็น debug APK** — ขึ้นสโตร์จริงต้องเพิ่ม keystore + signed release AAB (`bundleRelease`)
- **Live update (แก้แล้วไม่ต้องลง APK ใหม่):** `.github/workflows/pages.yml` deploy www → **GitHub Pages**
  + `capacitor.config.json` `server.url` = https://hardza1230.github.io/Survival-like-Mobile-Game/
  ⇒ APK เป็นตัวหุ้มโหลดจาก Pages ทุกครั้งที่เปิด · push โค้ด = แอปอัปเดตเอง (ต้องต่อเน็ต, ออฟไลน์ยังไม่ได้)
  · ต้องเปิด Pages ครั้งแรก: Settings→Pages→Source: GitHub Actions
  · **หมายเหตุ:** เพราะ server.url ชี้ Pages → APK ตัวใหม่ต้อง build หลังตั้ง Pages (ตัว build แรกสุดยังเป็นออฟไลน์)

## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v6.55.87 — P1 earned growth · 8 ต.ค. 2026)
- **v6.55.87:** P1 คืนคุณค่า EXP: ทุก kill ได้ EXP ตามศัตรู ยกเลิก cap/top-up จบเควสได้โบนัสคงที่ รวบรวมเฉพาะออร์บที่หาได้แล้ว ไม่รับประกัน Lv18; checks/build ผ่าน รอเจ้าของเล่นเทส P2 เลือด/แม่เหล็กยังรอ.
- **v6.55.86:** แก้ Hunt เป้าหาย/ไม่เกิด: objective-owned retry หลังหน้าการ์ด, สำรอง live slot, กันเป้าซ้ำและหนีออกนอกสนาม actual-method tests/checks/build ผ่าน รอเจ้าของทดสอบ C1-5 เวฟ 4.
- **v6.55.85:** แก้ Swarm มอนหมดก่อนเวลา: เติมต่อจน countdown จบ เพิ่ม live caps/ชุดเกิด/ระลอก; เควสทั่วไปยังมี quota เพิ่มขึ้น EXP ฐานเดิมและ Lv18 ก่อนบอส ตรวจ tick loop/checks/build ผ่าน รอเจ้าของเล่นจริง.
- **v6.55.84:** ทุกด่านเนื้อเรื่องใช้โควต้ามอน/งบ EXP และสูตรเลเวลเชิงเส้น เป้าหมาย Lv18 ก่อนบอส; ด่าน 3 ไม่บังคับ Mint; checks/build ผ่าน รอเจ้าของเล่นเทสด่าน 1–3 และช่วงท้าย ดู docs/STORY_WAVE_BUDGET_2026_10_08.md.
- **v6.55.83:** Strawberry S1–S5 ลงโค้ดครบ: focused cards, Sniper heavy seed, Ricochet visited/cap/boss fallback, Shotgun close-range Evolution, timer/pool/performance budgets; automated checks/build ผ่าน เจ้าของทดสอบในเกมเอง ผลสมดุล/มือถือยังรอ feedback.
- **v6.55.82:** Mint M1–M4 ลงโค้ดครบ; path Evolutions/เพดานโปรเจกไทล์และเอฟเฟกต์/ข้อความ/เซฟเดิมตรวจผ่าน และ build ผ่าน เจ้าของเล่นเทสเอง ถัดไปแก้ตาม feedback หรือ Strawberry S1–S5 เมื่อสั่ง. วิเคราะห์ Strawberry/Momo (ตัวเดียวกัน) อยู่ใน docs/STRAWBERRY_MOMO_AUDIT_2026_10_08.md.
- **v6.55.81:** M3 ชาร์จหอก/Impale/Rupture และการ์ดครบ; automated tests และ build ผ่าน เจ้าของเล่นทดสอบในเกมเอง ถัดไป M4 Evolutions/polish.
- **v6.55.80:** M2 Frost/Brittle/Shatter + Deep Freeze/Chain Shatter เสร็จ; automated tests และ build ผ่าน เจ้าของเล่นทดสอบในเกมเอง ถัดไป M3–M4.
- **v6.55.79:** Mint M1 ชื่อสาย/น้ำหนักการ์ด/เพดานหอกเสร็จ; M2–M4 ยังรอทำ รายละเอียดและผลตรวจอยู่ที่หัวไฟล์และ docs/MINT_BUILD_PATH_REWORK_2026_10_07.md.
- **v6.55.17 (เจ้าของ: account ใหม่ผ่าน Stage 3-5 สบายเกิน · ด่าน 1-2 ให้รู้สึกดี ที่เหลือของจริง):** `getPowerGuide` ผ่อน HP/ดาเมจเฉพาะ stageIndex<2 · ด่าน 3+ พลังเกินแนะนำ → ศัตรู HP +25%/ratio เกิน (เพดาน +35%) ดาเมจ +15% (เพดาน +20%) · `realStageBossMul` บอส/มินิ ด่าน 3-4 ×1.6 ด่าน 5 ×1.5 · EXP ด่าน 3+ (ไม่ใช่ recipe) โต ×1.32+9 (เดิม ×1.26+6) · npm run check ผ่าน · **ยังไม่ได้เล่นจริง — จูนตัวเลขได้**
- **v6.55.18 (เจ้าของ: Stats บอกแหล่งที่มา):** `previewStats` เก็บ snapshot หลังแต่ละแหล่ง (`p._trace`: Hero profile/Signature weapon/Talents/Flavor Weave/Special Cores/Gear + mods/Gear sets/Bestiary/Rank Perks/Ancient Perks/Stat cap) · เพิ่ม set bonus + deepRoots ให้ตรง applyMeta · หน้า Stats แตะแถว → `showStatSources` แผงแยกที่มา · ยังไม่เห็นหน้าจอจริง (ไม่มี Chromium ในเครื่องนี้)
- **v6.55.19 (เจ้าของ: คริบ่อยจาก Gear+Mod · ของสวมใส่ทำให้เก่งเกินตั้งแต่แรก · แก้ค่าด่าน 5 สลับ C2-1 + ดันเวฟต้นด่าน 3-5):** `gearBaseScale(iLv)` iLv1=35%→iLv60=100%→iLv100=115% · `applyScaledGear` สเกล delta ของ GEAR.apply (บวก=คูณ f, คูณ=ยกกำลัง f) ใช้ใน applyMeta/previewStats/gearInstanceStats (ไม่สเกล tier start) · affix crit tiers [[4,5],[3,4],[3,3],[2,2],[1,2]] (เดิม [[6,7],...,[2,2]]) · gloves iLv crit 0.06→0.04 · `gachaMaxBand()` เปิด gacha ได้ถึง band ที่ lo ≤ storyItemLevelBase(unlockedStage)+4 · `realStageBossMul` ด่าน 5 1.5→1.25 · มอนด่าน 3-5 เวฟ 1-2 HP ×1.35 · tests fire/ice/late-monster อัปเดต HP · ยังไม่เล่นจริง
- **v6.55.20 (เจ้าของเลือกข้อ 1):** Oath Shell (`UPGRADES.def`) เดิม dmgTakenMul×0.985^tot ไม่มีเพดาน → `p.armor+=4*tot` (ลดด้วย 100/(100+armor)) · **บั๊ก:** touchEnemy ไม่เคยคิด armor → คูณ armorDamageMultiplier แล้ว · Stats Defense รวม armor + แผงที่มาแยก armor ต่อแหล่ง
- **v6.55.21 (เจ้าของ: armor ยังแรง · heal on dash โกง):** Oath Shell +4 → +1.5 armor/เลเวล (20 lv ≈23%, 40 ≈38%, 80 ≈55% ไม่รวม gear) · Kitchen DO 'heal' 5% → 2% maxHP · WHEN 'dash' icd 1.5s (เดิม 0.25 default)
- **v6.55.22 (เจ้าของ: ที่มา stat ละเอียดกว่านี้):** previewStats mark ราย Talent/Path talents/Weave แต่ละแก่น/Gear แต่ละชิ้น (ชื่อ iLv +enh %สเกล) + iLv bonus แยก/Mod แต่ละบรรทัด (label T ชิ้น)/Set แต่ละขั้น+collection/Perk แต่ละตัว · แผงย่อแถว 15-26px ให้พอดีจอ
- **v6.55.23 (เจ้าของ: เลเวลตัวละครขึ้นไว):** `charExpNeed` 40+35l → 50+40·l^1.35 (สะสมถึง Lv10 2.3k→4.8k, Lv20 8.2k→21.6k) · `characterExpProgress` เปลี่ยนเป็นวนลูป · **รอเจ้าของเลือก: talent เฉพาะสาย**
- **v6.55.24 (เจ้าของ: แผงที่มา stat ให้จัดกลุ่ม/ไอคอน/% Pareto/สูตร):** `showStatSources` เขียนใหม่ · กลุ่ม 🧬 Hero / ✦ Temple / ⚔️ Gear / 🏆 Progress / 🔒 Limits (หัวกลุ่ม + ยอดรวม) · ทุกแถว value + แถบ + bonus share % (คิดเฉพาะโบนัส ไม่รวม Hero base) · ★ แหล่งใหญ่สุด, ≥30% สีทอง · กล่อง ⓘ สูตรอ่านง่ายต่อ stat (Attack Power = 90% base + increased บวกกัน แล้วคูณ Item Power/Crit) · **บั๊ก:** ช่องว่าง 'None' (tier start) ได้โบนัส iLv → `applyItemLevelBonus` ข้าม tier start · ตรวจภาพด้วย Chromium (`/opt/pw-browsers` ใช้ได้ในเครื่องนี้) ภาพที่ docs/previews/stats_sources_v6_55_24.png
- **งานถัดไปที่เจ้าของจองไว้: Talent เฉพาะสาย** ตาม `docs/TALENT_PATH_DESIGN.md` (ยังรอตอบ 3 คำถามท้ายไฟล์)
- **v6.55.25 (เจ้าของ: เรียงตามสูตร + กลุ่มย่อยสีอ่อนกว่า):** หน้า Stats เรียง Attack Power → Crit → Cooldown → Max HP → Defense → Regen → Move Speed · แผงที่มาเป็นขั้น ① Base → ② Bonuses (บวกกัน/คูณกัน ตาม stat) → ③ × Separate multipliers (Item Power/Crit dmg/Armor) · แถวย่อยตัวหนังสือ/ตัวเลข/% สีอ่อนและไม่หนา หัวกลุ่มเข้มหนา
- **v6.55.26 (เจ้าของเลือกข้อ 2):** ดาเมจฐานฮีโร่ `dmgMul` 0.90 → 1 (4 จุด: create/startRun/stage reset/previewStats) · HP ศัตรู ×1/0.9 ทุกแหล่ง (spawnEnemy, spawnElite, มินิ, บอส รวม recipe) → ความยากเท่าเดิม · แผงที่มาเรียก 'Starting value' · tests animation 5 ไฟล์เทียบ e.hp*0.9
- **v6.55.27:** แผงที่มาเอากล่อง ① Base ออก (ค่าเริ่ม 100% อยู่ในกล่องสูตร) · ขั้นเหลือ ① Bonuses → ② × Separate multipliers
- **v6.55.28 (เจ้าของ: Flavor Weave เลเวลสูงเร็ว Pareto 50%):** Flavor Spark +3% → +2%/เลเวล · `talCost` base×(lvl+1)×(1+rank)×1.15^rank (เดิม ×(1+0.8·rank)) → Sugar สะสมถึงยศ 5 ×1.7, ยศ 10 ×2.9, ยศ 15 ×5
- **v6.55.29 (เจ้าของ: Power ไม่แม่นพอเทียบ balance):** `previewStats` → global `computeHeroStats(cid,basic)` · `Save.power` = `heroPower` = 100×√(Offense×Defense/90) · Offense = dmgMul×powerMul×(1+crit×(critMul−1))×(1+avgATK×FLAT_EFF/12)/cdMul · Defense = maxHP/(dmgTaken×armor)×(1+regen×8/HP) · ค่าแนะนำ `stageRecommendedPower(i)` คำนวณจาก `stageThreat` (√(HP มอน×HP บอส), √(ดาเมจมอน×ดาเมจบอส)) เทียบด่าน 1 · field `recommendedPower` เดิมเหลือไว้ให้ validator เท่านั้น · สเกลใหม่: ด่าน 1 100 → C1-5 240 → C2-5 610 → C3-5 1170 · ฮีโร่ใหม่ 108-144 · ⚠ powerGuide/over-scaling ด่าน 3+ ใช้สเกลใหม่ → account ที่อัปเยอะจะเจอศัตรูถึกขึ้นตามเพดานเดิม (+35% HP)
- **v6.55.30 (เจ้าของ: ไม่เอาการ์ด rare/epic):** `rollRarity()` คืน common เสมอ (ทุกการ์ดเลเวลอัพ/endless/heal) · RARITIES ยังอยู่ (ไม่ได้ลบ UI)
- **v6.55.31 (เจ้าของเลือก 1):** Power รวมค่าประมาณการ์ด/เลเวลในด่าน `RUN_CARD_OFF`=1.5 `RUN_CARD_DEF`=1.15 (×1.31) · ค่าแนะนำคูณ `RUN_CARD_MUL` เท่ากัน → อัตราส่วน/powerGuide ไม่เปลี่ยน · ด่าน 1 แนะนำ ≈130
- **v6.55.32 (เจ้าของ: mod ยาว → Implicit/Prefix/Suffix):** `gearImplicit(base)` = สแตตหายากสุดของ base.apply บรรทัดเดียว (`IMPLICIT_RANK`, tier Common→Mythic, legend +1) · `applyScaledGear` ใช้แค่ implicit (unique ยังเต็ม) · ลบโบนัส iLv ราย slot · AFFIX_COUNT epic3 legend4 (สูงสุด 3P+3S) · หน้า compare โชว์ ATK/Armor + IMPLICIT·PREFIX·SUFFIX · ภาพ docs/previews/gear_implicit_v6_55_32.png · ⚠ ไอเทมอ่อนลง (เหลือ stat เดียวจาก base)
- **v6.55.33 (เจ้าของ: implicit พิเศษ · mod ไป prefix/suffix · คราฟ 6 ช่อง · หาไอเทมที่คราฟไม่เจอ):** `IMPLICIT_POOL` 18 แบบ rank 0-4 + `min` iLv (Area/Bounce/Low-HP 35+, Projectile/Unique CD 50+, Revive 70+) · `ensureImplicit(item)` สุ่ม seed จาก uid เก็บ `item.implicit` · base.apply ไม่ใช้แล้ว (ยกเว้น unique/start) · hook `p.gearCount` (→ _pm.count + momo shots) `p.gearBounce` (sprinkle) `p.gearArea` (_pm.range) · AFFIX_POOL +7 = 35 (stride/reach/fleet/armorflat/ringhp/reaver/nimble · weapon มี suffix แล้ว) · `CRAFT_AFFIX_CAP` 6 ทุก rarity, `AFFIX_KIND_MAX` 3 · `sortAffixesByKind` · หน้า Forge: แถว IMPLICIT + คอลัมน์ PREFIX/SUFFIX · roll กรองตาม kind (`craftKind`) · ปุ่ม Equip now / View in Equipment · `craftedAt` เรียงก่อน + ป้าย ⚒ + ย่อย/ขายต้องแตะ 2 ครั้ง · ภาพ docs/previews/craft_implicit_v6_55_33.png
- **v6.55.34 (เจ้าของ: เลือกเป้าหลายอัน · T5 = T5 หรือดีกว่า):** `this.craftTargets` {id: tierMax|null} แตะ pool = toggle · แตะ TIERS = ตั้งขั้นต่ำของเป้า (ฟรี แทน tier lock แบบจ่าย; craftTierLock ไม่ถูกตั้งแล้ว) · autoRoll hit = id อยู่ในเป้า (kind เดียวกับช่อง) และ t ≤ ขั้นต่ำ
- **v6.55.35 (เจ้าของ 1+3 + Item Power):** `gearPowerDelta(item,basePow)` สลับ equippedGear ชั่วคราวแล้ว heroPower · กริด Equipment ▲/▼ ต่อชิ้น + บรรทัด ⚡ Power ก่อน→หลัง · หน้า `gearClean` (ปุ่ม 🧹 Clean up): เลือกเกรด/เฉพาะที่แย่กว่า/ขายหรือย่อย ยืนยัน 2 แตะ ไม่แตะ สวม/ล็อก/★/craftedAt/unique · `Save.data.gearCleanCfg` · auto on drop ทำงานทุกดรอป (เดิมแค่ตอนเต็ม) `gearAutoOut` sell/dismantle · `gearAutoKeepUp` เก็บชิ้นที่เพิ่ม Power
- **v6.55.36 (เจ้าของเลือกข้อ 2):** `gearBaseStats` enhance +4%→+8%/ขั้น · ทุกขั้นได้ ≥+1 (max(round(b·enh), round(b)+el)) · implicit/mod ยังไม่โตตามขั้นตี
- **v6.55.37 (เจ้าของ: แรงไป):** เอาขั้นต่ำ +1/ขั้นออก · enhance = round(base×(1+0.08·lv)) ทุก iLv ×1.8 ที่ +10
- **v6.55.38 (เจ้าของ: ขั้นสูงใช้เศษเยอะ ขั้นต่ำใช้น้อย):** `gearEnhShardCost` = round(2·1.5^lv) → 2/3/5/7/10/15/23/34/51/77 (รวมถึง +10 = 227, เดิม 120)
- **v6.55.39 (Talent เฉพาะสาย commit 1/8 · เจ้าของ: Capstone เลือก 1 · 5 TP · ทำตามแผน):** `talentBranch(pt)` = 10 slot root/a1/a2/b1/b2/c1/c2/capA-C id `pt_<path>_<slot>` · ค่าเริ่ม `_ptGeneric` (R ล้วน) ทับด้วย `PATH_TALENTS[path][slot]` · `talNodeOpen` (x1≥root1, x2≥x1 2, cap≥x2 1 + cap เดียว) · `talNodeCost` cap=5 · `talSpent` นับ cap · migration `talV2` คืน TP ของ `b_*` + toast · UI แท็บสาย = root บน 3 คอลัมน์ + Capstone ล่าง (ยัง Coming soon) · ภาพ docs/previews/talent_path_v6_55_39.png · **ถัดไป commit 2: Momo 3 สาย (Sniper/Shotgun/Ricochet) node เฉพาะ + Capstone**
- **v6.55.40–43 (Talent เฉพาะสาย commit 2–5):** Momo/Mint/Cocoa/Taro ครบ 3 สาย node + Capstone จริง · Momo ใช้ `_K` (ค่าใน `p._pt` + hooks ใน sprinkle/pathBulletDmg/ptOnBounce/ptSkinBurst/releaseSnipe/doDash) · ตัวอื่นใช้ `_P(fx)` → `ptMergeFx` รวมเข้า b._pm ใน syncBasicAttack · ลดดาเมจรับใน `ptTakenMul` (still/ghillie/stillWall/moveGuard/farmor/chin/dashGuard) · Mint `ptOnFreeze` · ⚠ ต้องจูน: Titan ×2.53, Smite ×2.14, Tempest cd 0.36 · **เจ้าของสั่งพัก commit 6–8 (Sesame/Yuzu/badge+tuning) ไว้ก่อน** (Sesame/Yuzu ยังใช้ node กลาง + Capstone Coming soon)
- **v6.55.44 (เจ้าของ: เทียบ mod ที่ใส่กับที่เลือก · เลือกข้อ 1+3):** หน้า Equipment เลิกโชว์ mod 2 คอลัมน์ในการ์ด → `drawModCompare` ตารางเต็มกว้างใต้การ์ด: แถว Implicit + P/S ต่อ mod id (`modCompareRows`) คอลัมน์ EQUIPPED/SELECTED/CHANGE · สถานะ New/Lost/▲/▼/Same/Swap เรียงต่างมากก่อน Same จาง · บรรทัดสรุป 🟢 Gain/🔴 Lose/🔁 Implicit · ซ่อนเมื่อดูชิ้นที่ใส่อยู่ · ภาพ docs/previews/mod_compare_v6_55_44.png · ไอเดียค้าง: สี tier, ช่องว่างคราฟต่อ, แตะแถวดูช่วงค่า
- **v6.55.45 (บั๊กเจ้าของ: Affix Forge ล้นจอ เลื่อนไม่ได้):** เมนูเลื่อนได้ทุกหน้า (ยกเว้น hub/atlas) · `setupMenuScroll(s)` ท้าย buildMenuScreen วัด bounds ลูกใน this.menu → `_mScrollMax` + พื้นสีเติมใต้จอ · ถ้าเลื่อนได้ pointerdown เก็บ `_mDrag` → ลาก >8px = เลื่อน (`setMenuScroll` ตั้ง menu.y) · ปล่อยไม่ลาก = handleTap (บวก offset scroll ให้ zone) · wheel ใช้ได้ · scroll คงตำแหน่งเมื่อ rebuild หน้าเดิม · popup ที่วาดใน menu (roulette/auto-roll/gacha/bazaar slot) รีเซ็ต scroll 0 ก่อน
- **v6.55.46 (เจ้าของ: ช่องว่างสำหรับคราฟต่อ):** drawModCompare บรรทัด '🛠 Open craft slots P x · S y → P · S (N free)' (AFFIX_KIND_MAX ลบจำนวน mod) เขียว=ชิ้นที่เลือกว่างมากกว่า · ดูชิ้นที่ใส่อยู่ก็โชว์ (ไม่มีลูกศร)
- **v6.55.47 (เจ้าของ: ลูกศรขึ้น/ลง):** ตารางเทียบ mod ใส่ ▲/▼ ท้ายค่าชิ้นที่เลือก + คอลัมน์ CHANGE (New=▲ เขียว, Lost=▼ แดง, Swap=⇅) · บรรทัดสรุป ▲ Gain/▼ Lose
- **v6.55.48 (เจ้าของ: ข้อ 1-3 จากรีวิว UI):** หน้า Equipment ตัวละครเล็กลง (topH 0.25h ≤190) + ปุ่ม ▲ Hide/▼ Hero (`Save.data.gearFold` → ช่องสวมใส่แถวเดียว 6 ช่อง) · Gacha ย้ายใต้ช่องสวมใส่ · กริดไม่โชว์ Starter/_none · `_clampFonts(11)` ห่อ add.text ตอน buildGear/buildCraftBench (ฟอนต์ขั้นต่ำ 11px) · ภาพ docs/previews/equipment_v6_55_48.png · ไอเดียค้าง: ลดข้อมูลซ้ำ (Power เด่นจุดเดียว) + ลำดับสีปุ่มล่าง
- **v6.55.49 (เจ้าของ: กรอบ Profile):** ตัวละครหน้า Equipment = กรอบสี่เหลี่ยมมนขอบทอง ครอปหัวจาก card_<id> (setCrop 62% กว้างจากบน 3%) + ป้ายชื่อ Lv · topH 0.19h ≤160
- **v6.55.50 (เจ้าของ: จัดให้เป็นระเบียบ):** แถบ ⚡ Power ก่อน→หลัง ใหญ่สีเขียว/แดง อยู่ใต้กริดก่อนการ์ดเทียบ (ลบบรรทัด Power ล่าง + Gain/Lose ใน drawModCompare) · ปุ่ม: ⚔ Equip/⚒ Enhance เต็มกว้าง 40px · แถวสอง 🧪 Craft + ☆ + 🔓 + ⋯ · Sell/Dismantle ซ่อนใน More (`this._gearMore`=uid)
- **v6.55.51 (เจ้าของ: ตัวละครไม่มีประโยชน์ เอาไว้มุมซ้ายเล็ก ๆ):** อวาตาร์ 46px ซ้ายสุด (ครอปหัว + Lv) + ช่องสวมใส่ 6 ช่องแถวเดียวเสมอ · ลบปุ่ม Hide (`gearFold` ไม่ใช้แล้ว) · แถบเซ็ทเต็มกว้าง
- **v6.55.52 (เจ้าของ: อยากเห็นอาร์ตอาวุธ/เกราะใหญ่):** การ์ด EQUIPPED/SELECTED มีอาร์ตใหญ่ AH=min(92,0.22w) กลางการ์ด + วงแสงสีเกรด · ชื่อ 2 บรรทัดกลาง · กริดไอคอน 35→50px ช่องสูง 76
- **v6.55.53 (เจ้าของ: ใหญ่เกิน):** การ์ดเทียบ อาร์ต AH=min(58,0.15w) ซ้าย + ชื่อขวา 3 บรรทัด · กริดไอคอน 42px ช่องสูง 66
- **v6.55.54 (เจ้าของ: ของที่ใส่อยู่ต้องเห็นชัด):** ช่องสวมใส่ 3×2 ใหญ่ ss≤68 อาร์ต 86% (weapon/armor/gloves · amulet/ring/boots) · อวาตาร์ 56px มุมซ้ายบน · topH 150
- **v6.55.55 (เจ้าของ: การ์ดตัวละครสูง 2 แถว · ช่องชิด · gacha กว้างเท่าช่อง · เซ็ทบอกชิ้นที่ขาด · เซ็ทมีสร้อย/แหวน):** อวาตาร์ 0.95ss × (2ss+8) · ช่องห่าง 8 ss≤70 กลุ่มจัดกลางจอ · gacha สูง 36 กว้างเท่าอวาตาร์+กริด · กล่องเซ็ท (สูงสุด 2 เซ็ท) ไอคอนทุกชิ้น ใส่=สว่าง/ขาด=จาง + 'Missing:' + 'Need N more → โบนัส' · am_ribbon/ri_copper → home · am_clover/ri_silver → brigade · ใหม่ am_chef/ri_chef (epic, ยังไม่มีอาร์ต ใช้ emoji) → chef · home/brigade/chef 5 ชิ้น มีโบนัส 5 pcs · wind/fortune ยัง 3 ชิ้น
- **v6.55.56 (เจ้าของ: เอากล่องเซ็ทออก เป็นปุ่มข้าง Clean up):** ลบกล่องเซ็ท · ปุ่ม '<emoji> Set n/tot' (เซ็ทที่ใส่มากสุด) ต่อจากชื่อหมวดในแถวหัวกริด + ปุ่ม 🧹 Clean ต่อท้าย · แตะ = Codex › Sets
- **v6.55.57 (เจ้าของ: ภาพตัวละครขยายซ้ายเต็ม · ตัวอักษร −1):** กริดช่องสวมใส่ชิดขวา (x0=w−12−gridW) อวาตาร์ x=12 กว้างถึงกริด · หน้า gear `_clampFonts(10)` (เดิม 11)
- **v6.55.58 (เจ้าของ: Trade-in ไม่แสดงของที่ใส่อยู่):** `tradeWorn(x)` = isGearEquipped หรือ (equippedGear ของช่องหาย และ gear[slot]===baseId)
- **v6.55.59 (เจ้าของ: Trade-in แตะแล้วโชว์รายละเอียด):** `_tradeView`=uid ล่าสุดที่แตะ · แผง PH 128 เหนือปุ่มล่าง: ชื่อ/เกรด/iLv/base stat/implicit/P-S mod+T
- **v6.55.60 (เจ้าของเลือก Berry Blast):** Momo สาย Shotgun Unique = `isBlastUnique` ใช้ `_snipe` ร่วม (`s.blast`, ชาร์จ 450ms) · tickSnipe วาดกรวย 300px + วง 120 · `releaseBerryBlast`: กรวย 120°(+20°/b_wide) ดาเมจ (14+5ul)·dm·up ×เม็ดตามระยะ ใกล้<120 ×2×pointblank · ผลักมอนธรรมดา · ถอย `hop` 80(+40/b_recoil) + iframe · b_double ยิงซ้ำ 0.35s ×0.6 · การ์ด b_wide/b_recoil/b_double · headless: 8 ตัวตาย 1 ยิง ถอย 80 0 error · ยังไม่เล่นจริง
- **v6.55.61 (เจ้าของเลือก Mint 1+3, Gale คงไว้สาย Barrage):** `mintChargeKind()` glacier→'bloom' pierce→'lance' ใช้ `_snipe.kind` · Glacier Bloom ชาร์จ 1s r=(110+150c)×(1+.25 m_grow) แช่มอนธรรมดา 2s(+.6 m_hold) บอส/มินิช้า+chill · ก่อนละลายตัวที่ยังแช่ แตก ×2 (m_shard กระเด็น 90px 40%/rank) · Frost Lance Charge ชาร์จ .4s พุ่ง 350(+30% l_far) ทะลุ+chill อมตะ .45 · `_iceTrails` 3s ช้า+ดาเมจ (`tickIceTrails`) · l_twin พุ่งซ้ำใน 2s · l_burst ระเบิดท้าย · headless 3 สาย 0 error · ยังไม่เล่นจริง
- **v6.55.62 (เจ้าของ: Shotgun ไม่ต่างจากยิงธรรมดา แค่กว้าง):** สาย shotgun cd ×1.3 · เม็ด ×0.8 (เดิม .6) life .3 (~300px) · knockback ติดตัว 110 (+PT.kb) · pathBulletDmg sgPellet: <120 ×2(1+closeMul), <200 ×(1+closeMul), >260 ×0.6 · `shotgunKick` แสงปากกระบอก+สั่นจอ+เด้งถอย ทุกชุด · ใกล้ DPS ≈×1.75 กลางเท่าเดิม ไกลลด · headless 0 error · ยังไม่เล่นจริง
- **v6.55.63 (เจ้าของ: จอสั่นกว่านี้ + เสียงลูกซอง):** `sfx_shotgun.wav` (gen_sfx_jsfxr: ระเบิดสั้น+thump 58Hz+คลิกปั๊ม 2 ครั้ง 0.35s) · `Sfx.shotgun()` · shotgunKick screenShake 130ms 0.0075 (เดิม 70/0.003) · เม็ด shotgun ไม่เล่น Sfx.shoot รายเม็ดแล้ว · ยังไม่มีใครฟังจริง
- **v6.55.64 (เจ้าของ: ลูกซองยิงรัวกว่านี้ เม็ดเยอะกว่านี้):** cd ×1.3→×0.9 · เม็ด +2→+5 (เพดาน 18) · ดาเมจ/เม็ด ×0.8→×0.45 · DPS ใกล้ ≈×1.6 ของ v6.55.63 · ยังไม่เล่นจริง
- **v6.55.65 (เจ้าของ: Unique ทำอะไรบอสไม่ค่อยได้):** Berry Blast บอส/มินิ ×2 · Glacier Bloom บอส/มินิ โดน hit×1.5 ทันที + ตอนน้ำแข็งแตก hit×4 (+40%/m_shard) · Frost Lance บอส/มินิ ×1.8 · ยังไม่เล่นจริง
- **v6.55.66 (เจ้าของ: มอนธรรมดาแรงขึ้น มินิ/บอสเบาลง):** ดาเมจมอนธรรมดา+elite ×1.3 (spawnEnemy/spawnElite) · มินิ/บอส b.dmg ×0.75 (ท่าที่อ้าง b.dmg เบาลงตาม) · tests animation อัปเดต ×1.3 · ยังไม่เล่นจริง
- **v6.55.67 (เจ้าของ: heal on hit / dash on hit ทำให้อมตะ):** Kitchen `frHealCap` ฮีลรวมทุกสูตร ≤5% maxHP ต่อ 2 วิ (heal/recover) · `frGuardOk` shield/immune cooldown ร่วม 4 วิ · immune 1 วิคงที่ (ไม่คูณ ★) · trigger hurt icd 0.25→1.5 · ยังไม่เล่นจริง
- **v6.55.68 (เจ้าของ: อมตะหลังโดนตีนานขึ้นอีกนิด):** `HURT_IFRAME_MUL` 0.6→0.8 · ชนมอน 0.36→0.48 วิ · กระสุน default 0.30→0.40 วิ
- **v6.55.69 (บั๊กเจ้าของ: Berry Blast เลขดาเมจไม่ขึ้นทุกตัว):** popDmg throttle → Berry Blast/Frost Lance ตั้ง `_sgHit` รอบ damage ต่อตัว = โชว์เลขทุกตัว
- **v6.55.70:** Glacier Bloom (แช่+แตก) ตั้ง `_sgHit` เหมือนกัน → เลขดาเมจขึ้นทุกตัว
- **v6.55.71 (เจ้าของ: ออกนอกวงแล้วความคืบหน้าลด ทำไม่เสร็จ):** Capture ออกนอกวงไม่ลด progress (เดิม −0.35/วิ) · Defend Nectar ดอกตายหมดไม่หัก −7 วิ (ยังโดนดาเมจ) · ภารกิจอื่นไม่มีการลดอยู่แล้ว
- **v6.55.72 (เจ้าของ: การ์ด EQUIPPED/SELECTED กินที่ · ตารางอ่านยาก):** ลบการ์ดเทียบ 2 ใบ → แถบชื่อชิ้นที่เลือก 1 บรรทัด · ป้าย EQUIPPED ในช่องกริด (แทน ✓) · drawModCompare ใหม่: ฟอนต์ 11 แถวสูง 20 แถบสลับสี หัว PREFIX/SUFFIX เต็มแถว คอลัมน์ MOD/NOW/NEW/สถานะ + แถว ATK/Armor ผ่าน `this._cmpBase`
- **v6.55.73 (เจ้าของ):** แถบ ⚡ Power ก่อน→หลัง ย้ายไปใต้ภาพตัวละคร (`_pwBox/_pwG/_pwT`) · กาชาย่อกว้างเท่ากริดช่องสวมใส่ แถวเดียวกัน
- **v6.55.74 (เจ้าของ):** ปุ่ม toggle 💰 Sell / 🔩 Scrap ข้าง Clean (`this._gearQuick`) · เปิดแล้วแตะไอเทมที่ไม่ได้สวม = ขาย/ย่อยทันที (lock/★ ไม่ถูกแตะ) กรอบเขียว/ส้มบอกชิ้นที่ทำได้
- **v6.55.75 (เจ้าของ: ATK +1 ทำให้ mod อื่นไร้ค่า · เลือกยก mod ขั้นต่ำ):** `expandAffixTiers` lo = round(T1hi×1.2×0.4) (เดิม T5lo×0.5) → T10 ≈40% ของ T0 · migration `affixLo2` ยกค่า v เก่าเข้าช่วง tier เดิม
- **v6.55.76 (เจ้าของ: เพิ่มเยอะไป):** lo ×0.4→×0.2 (T10 ≈20% ของ T0) · migration `affixLo3` ย้ายค่า v ที่อยู่นอกช่วง tier (ต่ำหรือสูงเกิน) ไปกลางช่วง
- **v6.55.77 (เจ้าของเลือกข้อ 2 แบบ PoE):** `ATK_PCT`=0.05 · damage() ATK roll + flatDmg = ×(1+แต้ม×5%) แทนบวกตรง (FLAT_EFF ไม่ใช้ใน damage แล้ว) · heroOffense ใช้สูตรเดียวกัน (+flatDmg)
- **v6.55.78 (เจ้าของเลือกข้อ 1):** `weaponLocalMod/weaponLocalPct` · affix `dmg` + implicit `i_dmg` บนอาวุธ = local คูณ ATK อาวุธ ×(1+v×`WEAPON_LOCAL_MUL`(3)/100) ใน gearBaseStats · ข้าม apply ทั่วไป 4 จุด (applyScaledGear/gearInstanceStats/computeHeroStats/applyMeta) · ตารางเทียบแถว 'Weapon ATK x-y (+N%)' + ป้าย '→ ATK'
- **เวอร์ชันปัจจุบัน v6.55.78** (`GAME_VERSION`) · deploy จากสาขา `claude/vampire-survival-mobile-game-yo9e8w` เท่านั้น · Monster animation commit 1–6 เสร็จ (ดูหัวไฟล์)
- **งานค้าง:** (1) Monster animation commit 7 Chapter 2 ด่าน 1–2 รวม Sporeling → 8 Nectar รวม Tiny Grub → 9 Season/Root → 10 Elite/summon รวม Mini Jelly + Chapter 3 generic Elite + รีวิวภาพ/ประสิทธิภาพบนมือถือ (`docs/MONSTER_ANIMATION_PLAN.md`) (2) รีวิวบนมือถือจริงที่ค้าง: Mint Piercer balance เท่านั้น (เจ้าของทดสอบผ่านแล้ว 4 ต.ค. 2026: monster animation 2–6, VFX batch 1–5, Boss Loot Keep/Double/Reroll, เสียงทั้งหมด) (3) Play Store (พักไว้): ลบบัญชีในแอป, store listing, keystore, closed test
- **v6.54.9 (เจ้าของ: อยากได้การ์ดสุ่มแบบ Jackpot แทน):** onBossDown → `openBossLootCards` (การ์ดคว่ำ 3 ใบจาก 7 ชนิด: Sugar/Currency/พลั่ว/ด้าย/🔩/หินแก่น/Gear · JACKPOT 25%+10%/ระดับยาก) แล้วค่อย revealStageReward · openMysteryCards รับ opt {prizes,title,hint} + fallback emoji ถ้าไม่มี artKey · ยกเลิก Sugar Bounty v6.54.8 (บอสยังไม่ดรอป orb/หัวใจ)
- **v6.54.8 (เจ้าของ: ของดรอปบอสไร้ประโยชน์เพราะจบด่าน):** killEnemy บอสใหญ่ไม่ dropOrb/dropHeal → Sugar Bounty (60+30·stage)×diff reward เข้า sugarStage ตรง + แบนเนอร์ · มินิ/elite ดรอปเหมือนเดิม
- **v6.55.5 (เจ้าของ):** บังคับ Mint ทุกครั้งที่กด Stage 3 จนกว่าจะเคลียร์ด่าน 3 (`stageMastery[2]`) ไม่ผูกกับ mintIntro แล้ว
- **v6.55.4 (เจ้าของ):** กด Stage 3 ครั้งแรกด้วยตัวอื่น → `showMintWarning` (การ์ด Mint + บับเบิล 'ร้อนมาก ปล่อยฉันจัดการ') → ปุ่ม Choose Mint → หน้า Heroes สปอต tag `char_mint` (`_mintCoach` ใน applyGearTut) กดได้ใบเดียว → ตั้ง Mint + `mintIntro` แล้วเข้าด่าน 3 ทันที
- **v6.55.3 (เจ้าของ):** Stage 3 เวฟแรกครั้งแรก โชว์ playStoryPanel การ์ด card_mint แนะนำ Mint (ครั้งเดียว `Save.data.mintIntro`, ไม่โชว์ใน recipe/rift/rush/tutorial)
- **v6.55.2 (เจ้าของ):** หน้าสรุปด่าน หลอด Character EXP ใหญ่/สว่างขึ้น เด้งอนิเมชัน 1.6 วิ · gainCharExp รวม EXP หลายครั้งในรันเดียว (`_charExpGain` รีเซ็ตใน startRun) · ปิด `drainPull` (บอสไม่ดูดผู้เล่นแล้ว)
- **v6.55.1 (บั๊กเจ้าของ: Hunt เป้าหนีออกนอกจอ):** `_huntFlee` ระยะ 380→230 (หนีเฉพาะเมื่อเข้าใกล้ ไม่หนีหลุดจอ)
- **v6.55.0 (เจ้าของ 2+6):** Boss Loot หลังเปิดการ์ด: ✅ Keep / 🎲 Double or Nothing (`openDoubleOrNothing` 3 ใบ 💀1 ×2 2) / 📺 Reroll (Ad, ครั้งเดียวต่อบอส `_bossRerolled`) · `openMysteryCards` opt.choice/reroll/noReroll
- **v6.54.7 (เจ้าของ):** ซื้อแก่นใน tutorial Weave สำเร็จ → `_stage1Coach` + toast → 0.9 วิ ไปหน้าเลือกด่าน Chapter 1 · applyGearTut สปอต stage card tag `stage_0` 'Play Stage 1!' (กรองให้กดได้ใบเดียว)
- **v6.54.6 (เจ้าของ: เปิดรอบ 2 ยังนาน):** วัด: ภาพทั้งหมด 747 ไฟล์ 149 Mpx (UI 78 / ในด่าน 71) คอขวด = decode ไม่ใช่เน็ต · ครั้งต่อไป (mochi_full_cached) `preloadAll(null,false,UI_ART_RE)` บล็อกแค่ภาพ UI (ข้าม ASSET_SHEETS/FX และภาพไม่ match `UI_ART_RE`) → fin แล้วเริ่มเฟส 2 แบบเงียบ · startRun เช็ค `!_allLoaded` → ถ้าเฟส 2 ยังไม่จบ preloadAll(done) โชว์หลอดรอ · headless: เฟส 1 12.4 วิ (เดิมรวม ~26 วิ) · ครั้งแรกสุดยังโหลดครบแบบเดิม
- **v6.54.3 (เจ้าของ: บังคับโหลดทั้งหมดหน้าแรกแล้วเก็บในเครื่อง):** Game.create เรียก preloadAll แบบมีหลอดทุกครั้ง (เลิกโหมด quiet เมื่อ mochi_full_cached) · ไฟล์เก็บใน Service Worker cache เดิม → ครั้งต่อไปโหลดจากเครื่อง
- **v6.54.1 (บั๊กเจ้าของ: ไอคอนไทล์โหลดไม่ทันตอน tutorial):** buildMenuScreen ถ้า loader ยังโหลดอยู่ → load.once('complete') (+สำรอง 4 วิ) วาดหน้าเดิมใหม่ (`_rebuildOnLoad`, ข้ามถ้ากาชากำลังเปิด)
- **v6.54.0 (เจ้าของ):** (1) เซ็ทเป็นช่องทาง burn ของ: `SET_DEPOSIT_NEED`=5 · `Save.data.setDeposit[baseId]` · แตะไอคอนชิ้นใน Codex › Sets = removeGearInstance ชิ้นสำรอง (ไม่สวม/lock/fav) +1 · หลอดใต้ไอคอน + '+N' สำรอง · `gearSetCollected` = ทุกชิ้นครบ 5 → collect bonus (2) 'Skill Codex' → 'Codex' (3) applyGearTut ขั้น 4 = ลงแต้ม Talent (แถม 1 TP ถ้าไม่มี, `_talTutGift`) นำทาง Back → Heroes → แท็บ Talents (tag `tab_<id>`, แท็บ Heroes เรียก buildMenuScreen แล้ว) → Upgrade · verified headless ครบถึง step −1
- **v6.53.0 (เจ้าของ: guideline ชุดเซ็ทแบบ TT2 Equipment Crafting):** GEAR_SETS +home (w_whisk/gl_mitt/ar_apron) brigade (w_knife/gl_iron/ar_plate) fortune (am_star/ri_gold/bo_swift) · ทุกเซ็ทมี `collect` = มีครบทุกชิ้นในกระเป๋า (`gearSetCollected`/`gearOwnsBase`) → โบนัสถาวรเล็กใน applyMeta · `SET_ORDER` · Codex แท็บ 🧩 Sets (`buildSetCodex`: ไอคอนชิ้น ???/มี/สวม, ✅ โบนัส 2/3 ชิ้น, 🏆 collected) · หน้า Equipment แถบสถานะเซ็ทใต้กาชา (แตะไป Codex)
- **v6.52.2 (เจ้าของ: แบบ Tap Titans 2 ให้ต้องเลือก):** buildTalents แท็บต่อสาย (`_talTab` core/ id สาย) · root บน แตก 3 คอลัมน์ (โหนดที่เหลือ round-robin) เส้นมุมฉาก · โหนดสี่เหลี่ยม+เลเวล+⬆ เมื่ออัปได้ · แผงล่าง Lv/each level/ปุ่ม Upgrade พร้อมราคา · `talCost(r)`=r+1 TP (แพงขึ้น) · `talSpent` (ผลรวมสามเหลี่ยม) ใช้คำนวณ Reset · talentBranch 7 โหนด (เพิ่ม Precision _p / Second Wind _r / Guard _g, id เดิม 0/1/2/3 คงไว้)
- **v6.52.1 (เจ้าของ: การ์ดคำยาว · Talent แบบ Tap Titans 2):** การ์ดเลเวลอัพ: แท็ก (ส่วนหลัง '  ·  '/' ⬆ ') ย้ายไปบรรทัดดาว · ตัดท่อนแรกที่ซ้ำหัวข้อเขียว · headline ≤30 ตัวไม่มี … · **Talent tree:** คอลัมน์ Core (CHAR_TALENTS เดิม) + สายต่อ Build Path (`talentBranch(pt)` 4 โหนด id `b_<path>_0..3`: Focus +6% dmg ×3 · Rhythm −4% cd ×3 · Resolve +8% HP ×2 · Mastery +12% dmg +6% crit) · โหนดถัดไปปลดเมื่อโหนดบน ≥1 · แผงรายละเอียด+ปุ่ม +1 ล่าง · `applyPathTalents` ทำงานเมื่อเลือกสายในรัน (syncBasicAttack, `b._ptal`) และใน applyMeta ถ้ามีสายแล้ว · Reset เดิมคืน TP ทุกโหนด
- **v6.52.0 (เจ้าของ: หลังล้มบอสด่านแรก สอนใส่/สุ่ม/คราฟไอเทม):** `applyGearTut()` ท้าย buildMenuScreen · เริ่มเมื่อ stageMastery[0] + tutorialDone + unlockedStage≤1 (`Save.data.gearTut` 0..3, −1 จบ; เซฟที่ไกลกว่าด่าน 2 = −1) · ของขวัญ 🍬ราคากาชาขั้นแรก + transmute 3 · ขั้น: สุ่มกาชา → Quick Equip (เลือกไอเทมใหม่ล่าสุดให้เอง) → Craft this → Roll affix · หาโซนจาก fn source + tag ไทล์ (gear/craft) · ไม่อยู่หน้าที่ถูก = สปอต Gear & Power/ไทล์ · สปอตไลต์ + กรองให้กดแค่ปุ่มเป้า + Skip มุมขวาล่าง · verified headless ครบ 4 ขั้น
- **v6.51.2 (เจ้าของ):** BASIC_PATHS name → ชื่อบิ้วสั้นทุกตัว (Sniper/Shotgun/Ricochet · Freeze/Barrage/Piercer · Brawler/Titan/Dash · Chain/Smite/Tempest · Prism/Focus/Sentinel · Swarm/Guardian/Workshop + ' Build') · การ์ดสายตัดบรรทัด 'BUILD PATH · PICK ONE' ริบบิ้น 'PICK ONE BUILD' · buildOver: ชื่อด่าน·ความยากใต้หัว, TIME/KILLS/LV ตัวใหญ่, Sugar/Power/Hero EXP ตัวใหญ่มีสี, สาเหตุตาย 1 บรรทัด + สถานะพลัง
- **v6.51.1 (เจ้าของ: เริ่มด่านกระตุก):** วัด headless: JS เริ่มด่านถูก (~35ms) แต่ครั้งแรกมีเฟรมยาว 200ms+ ตอนมอนชุดแรกโผล่ (decode/อัป texture ครั้งแรก) · `warmStageTextures(idx)` ใน startRun ครั้งแรกต่อด่าน+ตัวละคร (`_warmed`) วาดภาพ e_/proj_/fx_/vfx_/pickup/char/ด่าน alpha .01 ทีละ 24/เฟรมหลังหน้า 'Preparing battle…' · หลังแก้เฟรมยาวสุดหลังเริ่ม 221→115ms (swiftshader)
- **v6.51.0 (เจ้าของ: การ์ดพิเศษให้เด่น):** drawReadableChoiceCard: Mutation/Evolution/Relic/Path/Infusion/Fusion/Modifier = กรอบสีเต้น+ริบบิ้นบนการ์ด+แสงวิ่ง+ประกาย ✦ + เสียง legend (throttle 0.8s)
- **v6.50.9 (บั๊กเจ้าของ: ทริกไม่ขึ้น ยังเห็นข้อความ MB):** น่าจะโดนแคช index.html เก่า → patch GameLoader.set + วนทริกจาก game.js (โหลด ?v=Date.now() เสมอ) ก่อน fileFromDevice
- **v6.50.8 (เจ้าของ: Back กดไม่ค่อยติด):** _screenBg zone Back ขยาย x0-110, y by−16..by+bh+12 + ธง back · handleTap เช็ค Back ก่อนทุก zone
- **v6.50.7 (เจ้าของ):** buildUpgrade เหนือปุ่มซื้อแก่นมีข้อความ 'Upgrade: '+u.show(1) (ได้เท่าไหร่ต่อเลเวล)
- **v6.50.6 (เจ้าของ: tutorial บังคับกด):** `drawSpotlight(cont,x,y,w,h,label)` มืดรอบ+เจาะรู+กรอบทองเต้น+นิ้วชี้ · หน้าจบ tutorial สปอตปุ่ม Upgrade Flavor Cores (ซ่อน/ปิด Skip) · หน้า Weave ตอน _tutorialWeaveCoach สปอตปุ่มซื้อแก่นแรกที่ซื้อได้ และกรอง tapZones เหลือปุ่มนั้น
- **v6.50.5 (เจ้าของ):** หน้าโหลด load-status โชว์ทริกการเล่น GameLoader.TIPS 10 ข้อ สุ่มเริ่ม วนทุก 4 วิ (แทน label/MB) · hide เคลียร์ interval
- **v6.50.4 (เจ้าของ: เวฟ1 ไม่ต้องมีภารกิจ ฆ่าเติมหลอด):** objective ใหม่ `fill` (WAVE_OBJECTIVES) ฆ่ามอนธรรมดา +1 ใน objOnKill · target 30+10·stage · ไม่มี timer · **บั๊ก:** แผนเดิมใช้ key 1/3/4 แต่ waveIndex เริ่ม 0 → เวฟแรกจริงสุ่ม (เจอ capture) · ด่าน 1 = 0 fill/1 survive/2 มินิ/3 survive/4 hunt · lesson นับจาก key ของแผน · ด่าน 2-3 เวฟแรกยังสุ่ม
- **v6.50.3 (เจ้าของ: ด่านแรกเอา capture ออก):** CH1_EARLY_WAVE_PLAN ด่าน 1 เวฟ 3 capture → survive (Survive/มินิ/Survive/Hunt) · capture ยังสอนที่ด่าน 3 เวฟ 1
- **v6.50.2 (เจ้าของ: ไม่ทันเห็นภารกิจ · Stage 1 ไม่มี capture):** ภารกิจใหม่โชว์บับเบิลเหนือหัวตัวละคร 4.2 วิ + เสียง · เตือนทุก 12 วิเป็นบับเบิลพร้อม progress · ด่านที่เคลียร์แล้วเล่นซ้ำเป็นโหมด replay (หลอดฆ่า ไม่มีภารกิจ) จึงไม่เจอ capture — capture อยู่เวฟ 3 ตอนเล่นครั้งแรก
- **v6.50.1 (เจ้าของ):** เม็ด shotgun โชว์เลขทุกเม็ด (popDmg force + เยื้องตำแหน่งเล็กน้อย แทนเลขรวม ×N) · popDmg 20/28→16/23px ÷viewZoom
- **v6.50.0 (เจ้าของ: Shotgun ยิงบอสหลายนัดแต่เห็นโดน 2 ฮิต):** ต้นเหตุ (1) เล็ง nearestEnemy = ลูกน้องที่ใกล้กว่าบอส (2) popDmg throttle 90ms → เม็ดที่โดนพร้อมกันเห็นเลขเดียว · แก้: สาย shotgun เล็งบอส/มินิ/elite ใน 430 ก่อน (`_sgBig`) spread แคบทั้งระยะ · `b.sgPellet` → hitEnemy wrapper ตั้ง `_sgHit` → damage() รวมเป็นเลขเดียว 'รวม ×N' (หน่วง 45ms, popDmg param `force`) · verified headless: บอส+ลูกน้องขวาง โดนครบทุกเม็ด เลข '43 ×6' · **เพลงให้เลือก:** `bgm_pick_01..10` ใน MENUS ของ gen_stage_bgm → `music_choices/*.mp3` (รอเจ้าของเลือกแล้วค่อยใส่เป็น bgm_s01)
- **v6.49.9 (เจ้าของ: เสียงเลเวลอัพก้อง แสบหู):** sfx_levelup_soft ใหม่ (gen_stingers_synth): C4-E4-G4-C5 sine/tri สั้น clean ไม่มี reverb (เดิม bell C5-C6 + C7 + send)
- **v6.49.8 (เจ้าของ: เพลงด่าน 1 ก้องเหมือนถ้ำ → 8-bit):** STAGES bgm_s01 ใน gen_stage_bgm: 132BPM major I-V-vi-IV, groove, pulse bass, sqr arp 16th, sqr lead · แถวรองรับ `room`/`wet` (s01 0.25/0.08 แทน 0.8/0.8) · bgm_m01 (มินิ) สร้างใหม่ตาม
- **v6.49.7 (บั๊กเจ้าของ: tutorial ไม่มีเพลง):** startStage สาขา `_inTutorial` return ก่อน `Sfx.playStageBgm` → เพิ่ม playStageBgm(1) ในสาขานั้น
- **v6.49.6 (เจ้าของ: ไล่ตรวจระบบโหลดทั้งหมด):** บั๊กหลัก: ใน preloadAll `fin` โค้ดปิดหน้าโหลด/รีเซ็ต `_preloadQuiet`/rebuild เมนู ถูก `//` comment ทับตั้งแต่ v6.49.0 → เปิดครั้งแรกค้าง 100% (ยืนยันด้วย headless) · แยก `fin(partial)` (ปล่อยผู้เล่น) กับ `finalize()` (loader complete จริง → `_allComplete`, mochi_full_cached, `_stageArtReady` เฉพาะด่านที่ภาพครบ) · watchdog นับ 'fileprogress' ด้วย 10 วิ → partial ไม่ตั้งว่าโหลดครบ (ของขาดโหลดผ่าน ensureStageArt/ensureGroup) แล้ว finalize ตอน complete · startRun ระหว่าง quiet preload ไม่รอทั้งเกม ไป ensureStageArt เลย · `fillAssetCache()` 4 วิหลัง finalize เติมไฟล์ที่ไม่อยู่ใน cache SW (เปิดครั้งต่อไป 0 MB) · Phaser `loader.timeout` 120 วิ · sw.js ลบเวอร์ชันเก่าด้วย `keys(path,{ignoreSearch})` แทนวนทั้ง cache · gate เมนูใช้ `_allComplete`
- **v6.49.5 (บั๊กเจ้าของ: เข้า Chapter 1 แล้วโหลดอีกรอบค้าง 30%):** gate 'Loading…' ใน buildMenuScreen ข้ามเมื่อ `mochi_full_cached`/`_allLoaded` · ที่เหลือมี timeout 8 วิ + try/catch กันค้าง
- **v6.49.4 (เจ้าของ: มองดาเมจไม่เห็น):** popDmg ตัวใหญ่ 20/28px ÷viewZoom + ขอบเข้ม+เงา · เด้งแล้วค้าง ~0.35 วิก่อนลอยจาง · throttle 90ms (มอน>60 200ms)
- **v6.49.3 (บั๊กเจ้าของ: กดปุ่มเมนูแล้วตารางเขียววาบ):** buildMenuScreen เลิก fade alpha 0→1 (เห็นกริดโลกด้านหลัง)
- **v6.49.2 (เจ้าของ: เพลงเมนูให้เข้าตอนแสงโผล่):** index.html `GameLoader.lightOn()` ที่ 4.5 วิของฉากเปิด (k-window-flash 48%) → หยุดเพลงโหลด + event `mochi-intro-light` · playMainBgm รอ event นี้แทน intro-finished
- **v6.49.1 (บั๊กเจ้าของ: ค้างที่ 100% บนมือถือ):** loader ไม่ยิง 'complete' (น่าจะถอดรหัสเสียงค้างใน WebView) · preloadAll มี watchdog: ไม่มีไฟล์ใหม่ 6 วิ → fin() (กันเรียกซ้ำด้วย finDone) · ของที่ขาดโหลดตอนใช้ผ่าน ensureGroup/ensureStageArt
- **v6.49.0 (เจ้าของ: เปิดแอปแล้วโหลด 126 MB ทุกครั้ง):** sw.js ใส่ header `x-mochi-cache: hit` · LoadMeter แยก from device/downloaded (`fileFromDevice` อ่าน xhrLoader header) · localStorage `mochi_full_cached` → เปิดครั้งต่อไปซ่อนหน้าโหลดทันที (ฉากเปิด→เมนู) แล้ว `preloadAll(null,true)` เบื้องหลัง · startRun ระหว่างนั้นเรียก preloadAll(done) → โชว์หลอด · ไม่ต้องติดตั้ง APK ใหม่ (live update)
- **v6.48.2 (เจ้าของ: เห็นหลอดวิ่ง 100% แล้วเริ่มใหม่ + อยากเห็น MB/ความเร็ว):** global `LoadMeter` (plan รวมขนาดทุก asset จาก `ASSET_FILE_SIZES` ที่ build-www ใส่ · mark ต่อไฟล์ผ่าน loader event 'load'/'loaderror' + fetch BGM) ใช้ทั้ง Boot และ preloadAll → หลอดเดียวต่อเนื่อง ข้อความ 'x / y MB · เหลือ · MB/s · ~วิ' · รันจากซอร์ส (ไม่ build) ไม่มีขนาด → นับเป็นจำนวนไฟล์
- **v6.48.1 (เจ้าของ: ได้ยินเพลงเปลี่ยนกลางหน้าโหลด เหมือนโหลด 2 รอบ):** ต้นเหตุ showMenu ใน Game.create เรียก playMainBgm → หยุดเพลงหน้าโหลดกลางการโหลด · playMainBgm รอ `mochi-intro-finished` ถ้าฉากเปิดยังไม่จบ (`_waitIntro`) → เพลงหน้าโหลดเพลงเดียวจนเข้าเมนู
- **v6.48.0 (เจ้าของ: รวมโหลดไว้หน้าแรกก่อนเมนู):** Opening ไม่ซ่อนหน้าโหลด · Game.create เรียก preloadAll ทันที (เดิมรอฉากเปิดจบ) → หลอดเดียวบนหน้าโหลดแรก · fin เรียก GameLoader.hide → เริ่มฉากเปิด → เมนู
- **v6.47.1 (บั๊กเจ้าของ: ภาพหายหน้า Choose Chapter):** bootKeep เพิ่ม chapter*_cover/chapter_endgame_cover/tile___* · preloadAll จบแล้ว rebuild ทุกหน้าเมนู (เดิมแค่ hub)
- **v6.47.0 (เจ้าของเลือก: โหลดหมดตอนหน้าแรก):** `preloadAll(done)` เรียกหลัง intro จบ (แทน warm) · โหลดทุก ASSET_IMAGES/SHEETS/FX + SFX พร้อมหลอด GameLoader 'Loading game data… N%' · เพลง `bgm_*` แค่ `fetch` ให้ Service Worker เก็บลงเครื่อง ไม่ decode (decode นาน) · จบแล้วตั้ง `_allLoaded/_deferDone`, tier1/2 done, `_stageArtReady` ทุกด่าน, `_grpOk` = Proxy true · startRun ถ้ายังไม่ `_allLoaded` รอ preloadAll · วัด 10Mbps (headless CPU ช้า): ครั้งแรก 39 วิ, ครั้งที่ 2 22 วิ (เน็ต 2MB, ที่เหลือคือ decode ภาพ) · กด Play→เข้าด่าน 0.5 วิ · ตรวจบั๊ก auto-play 6 รัน (ด่าน 1/5/8/13 + Delve 7/10) 0 error
- **v6.46.0 (แผนโหลด C2):** `sw.js` Service Worker · cache-first เฉพาะ `assets/*?v=hash` (Cache `mochi-assets-v1`, ลบเวอร์ชันเก่าของ path เดียวกันเมื่อ hash ใหม่) · หน้า/game.js ปล่อย network (live update เดิม) · register ใน index.html (https/localhost) · build-www คัดลอก sw.js · วัด 10Mbps www/: รอบ 2 network 24→8 req, 6.1→2.0MB · เหลือคอขวด decode (C4)
- **v6.45.0 (เจ้าของ: วางแผนแก้โหลดให้ไม่ติดขัด — แผน 5 commit ใน /root/.claude/plans/wise-foraging-neumann.md · ทำ C1):** เข้าด่านไม่รอ tier1 ทั้งก้อนแล้ว · `stageCritical(k,u,ch,endgame)` = tier1 ลบของตัวละครอื่น/`STAGE_LATE_RE` (build_paths/rewards/menu_buttons/icons/ui, currency, results, gear, levelup icons)/`ENDGAME_ART_RE` (ถ้าไม่ใช่ endgame)/อาร์ต ch3 (ถ้าด่าน<10)/training_floor (หลังจบ tutorial) และ FX ทั้งหมด · `critKey/critReady(idx)` · `ensureGroup(match,done,{all,fx,quiet,label})` รับ predicate · `buildDeferredAnims()` แยกจาก fin · spawnFxAnim สร้าง anim เองถ้ายังไม่มี · ส่วนด่านใน ensureStageArt + ensureStageAudio รอเฉพาะคีย์ตัวเอง (เดิมรอ loader 'complete' = รอเบื้องหลังทั้งหมด; audio timeout 8 วิ, แก้ listener progress รั่ว) · วัด 10Mbps กด Play ทันทีที่ hub: ด่าน 1 35.9→9.8 วิ, C2-1 mint 11.8, C3-1 yuzu 10.6 · **ถัดไป C2 Service Worker → C3 prefetch → C4 main thread → C5 UX**
- **v6.44.0 (เจ้าของ: กดแดช/Unique รัวตอนตายแล้วข้ามหน้าจบ · หน้าจบ chapter ให้เหมือน Endgame · ปุ่ม x2 เด่นขึ้น):** pointerdown ล็อกแตะ 0.9 วิเมื่อเข้า state dead/rushDone/summary/epilogue/rewardChoice (`_endLockAt`, แตะระหว่างล็อกต่อเวลา +0.38 วิ เพดาน 2.6 วิ) · `endLock(ms)` · `_endBtn` ปุ่มเงา+กลอส+fade-in (+pulse) · buildOver ใช้แผง `stage_summary_panel` แบบหน้าสรุป: Replay ในช่องปุ่มแผง, Revive เขียวเต้น, Hub/Delve, ทิปพลัง · showStageSummary ปุ่ม REWARD x2 ส้มทองใหญ่เต้น + Continue/Back to Delve
- **v6.43.0 (เจ้าของ 2 ข้อ):** (1) `ENDGAME_XP_MUL`=0.7 คูณ EXP ใน gainXp เมื่อ recipeMode · (2) `MENU_GROUPS`/`menuGroupRe(s)` แมปหน้าเมนู→โฟลเดอร์ (upgrade/perks=temple+ui/temple+icons+currency · kitchen · dig · atlas/recipes=delve+pinnacle+build_paths+biomes · gear/craft/bazaar=gear+currency+character_cards · chars/talents · skills/bestiary · อื่น=icons+currency) · `ensureGroup(re,cb)` โหลดเฉพาะกลุ่ม + `prioritizeLoad` ย้ายไฟล์ขึ้นหัว `this.load.list.entries` (Phaser Set ไม่ iterable ต้องใช้ .entries) + re-queue ไฟล์ที่หลุดคิว + timeout 20 วิ · buildMenuScreen รอแค่กลุ่ม (`_grpOk[s]`) ไม่รอ tier1/tier2 แล้ว (tier ยังโหลดเบื้องหลังเหมือนเดิม) · PNG ใหญ่ 18 ไฟล์ (temple/build_paths/rewards/currency/gear) → webp q88 ขนาดภาพเดิม 14→3.4MB (character_cards ต้อง PNG ตาม validator) · วัด 10Mbps: upgrade 2.3s gear 5.7s dig 0.8s atlas ~4s kitchen ~2s · **ถ้าเพิ่มหน้าเมนูใหม่ที่ใช้อาร์ต deferred ต้องเติมใน MENU_GROUPS**
- **v6.42.1 (บั๊กเจ้าของ: crash `reading 'slice'` ใน Delve):** biome sweet ดาวตกเรียก `sugarRush()` ไม่ส่ง got → `got.slice` พัง · banner รองรับ got ว่าง
- **v6.42.0 (เจ้าของเลือกข้อ 1: หลอดเติมด้วยเป้าหมาย):** `HUNGER_PER_KILL`=0.25 (เดิม 1) · elite 8 เดิม · `tickFeast` ใน tickRecipeHunger: เป้า 🍖 Feast (spawnElite HP×2.2 ส้ม scale×1.2, `e._feast`) ครั้งแรก 6 วิ แล้วทุก `FEAST_EVERY`=16 วิ (ทีละตัว) · หนีเมื่อผู้เล่นใกล้ <320 (ใช้ `_huntFlee`) · อยู่ `FEAST_LIFE`=22 วิ ไม่ทัน = `_fleeing` หายไป · ฆ่า = +`FEAST_SHARE` 15% ของ goal + ตัวต่อไปมาเร็วขึ้น · ภารกิจถ้ำเสร็จ +`MISSION_HUNGER` 20% · ลูกศรชี้ Feast ก่อนภารกิจ · reset `_feast` ใน spawnEnemy/spawnElite · verified headless เต็มหลอด ~58 วิ (ยืนนิ่ง ยิงโดน feast ไกล ๆ) 0 error · **ยังไม่เล่นจริง**
- **v6.41.0 (เจ้าของเห็นด้วย: การต่อสู้ไม่มีความหมาย แค่รอหลอดเต็มแล้วฆ่าบอส):** `itemPowerMul` 1.025/lv ถึง iLv60 (×4.3) แล้ว 1.005/lv (iLv89 ×5.0 เดิม 8.8, iLv100 ×5.2) · ชั้นบอส Delve กลับเป็น HP ×2 (v6.40 ตั้ง 2.5) · จำลองเซฟเจ้าของ: C3-5 20 วิ (เดิม 8) · Warden ชั้น 10 ~5 วิ · Candlewick ชั้น 20 ~2 นาที+ ยืนนิ่ง (เดิม 34 วิ) · **ยังไม่เล่นจริง — ถ้าชั้น 20 ยาวไปลด delveMul ช่วงต้น**
- **v6.40.0 (เจ้าของ: จูนจากเซฟจริงบน Supabase):** เซฟเจ้าของ (momo Lv33, power 8310, อาวุธ iLv89 → powerMul 8.8, dmg×3.47, crit 51%, Delve best 18) · จำลอง headless (`scratchpad/bal.cjs` โหลดเซฟ + บล็อก supabase): บอสเนื้อเรื่อง C2-5/C3-5 ตาย 8-10 วิ · **บั๊ก 1:** บอส Delve v6.39 โดน phase gate ใน damage() ล็อกอมตะ (ไม่มี bossThink core ปลด) → `if(e.isBoss&&!e.delveBoss)` · **บั๊ก 2:** Great Hunger (stage 4) เทียบ `f<=0.40` (float bug แบบ v4.51) ค้างอมตะที่ 40% → `b.hp<=b.maxhp*X` · **จูน:** `delveMul` หลังชั้น 20 hp 1.05/ชั้น dmg 1.04/ชั้น (เดิม 1.08/1.06 → ชั้น 40 = 12.4× แทน 21.7×, ชั้น 60 = 33× แทน 101×) · หลังแก้: Warden ชั้น 10 ตาย 3 วิ (ของเจ้าของแรงเกิน), Candlewick ชั้น 20 34 วิ
- **v6.39.0 (อาร์ตบอส Delve จาก AI อีกตัว):** ตัดภาพ → `assets/art/delve_bosses/` (tier1 ไม่ใช่ art/delve ที่เป็นเมนู) · ASSET_SHEETS `boss_delve10/20` frame 320 · ของประกอบ 8 ชิ้นใน ASSET_IMAGES · `setupDelveBoss(b)` ท้าย spawnFinalBoss เมื่อ recipeMode + node boss: d%20===10 = Warden, อื่น = Candlewick · scale .72 circle(92,68,110) · `bossThink` → `delveBossThink` แทนท่าเดิมทั้งหมด (`b._dv`, `_dvObjs`, `tickDelveObjs`) · Warden: กระโดดทับ (1/2/3 ครั้งตาม HP/คลั่ง, เป้าเล็งนำ) ทิ้ง puddle ช้า · 50% แตกเจลลี่ลูก 3 (spawnEnemy tank, HP 5% บอส) · Candlewick: จุดเทียน (เดินชน = ดับ) เทียนปล่อยวงไฟทุก 2.6 วิ · สาดขี้ผึ้ง 3-4 แอ่ง (ช้า+ดาเมจ) · 40% เป่าไฟ = `_dvDark` สี่เหลี่ยมมืด + geometry mask กลับด้าน (รูรอบผู้เล่น/เทียน/บอส) · ล้างใน clearBossObjects/bossDefeat (ภาพเฟรม 7)/exitStage · verified headless 0 error · **ยังไม่เล่นจริง — จูนดาเมจ/ความถี่**
- **v6.38.0 (เจ้าของ: ยัง ~15 วิ):** บูตโหลดแค่ `bootKeep` (hub_btn_/menu_hub/vfx_poof/replay_progress_art) + `bootKeepAudio` (bgm_main, sfx_ui_*) = 6.7MB/32 ไฟล์/~2 วิ localhost · `ensureDeferred(cb,tier)` 2 ชั้น: tier1 = ทุกอย่างที่ไม่ match `MENU_ONLY_RE` + FX + เสียง (เข้าด่านรอแค่ชั้นนี้ ผ่าน ensureStageArt) · tier2 = `MENU_ONLY_RE` (art/temple,kitchen,delve,dig · incoming · character_cards · ui/temple) เริ่มต่ออัตโนมัติหลัง tier1 · หน้าเมนูที่ไม่ใช่ hub รอ tier2 · callback เรียกผ่าน setTimeout (เริ่ม loader ใน complete ไม่ได้ → ค้าง) · fin เรียก `registerStageAnimations(ทุก sheet)` · **hub ห้ามใช้ texture อื่นนอก bootKeep — ถ้าเพิ่มต้องเติมใน bootKeep**
- **v6.37.0 (เจ้าของ: โหลดเข้าเกมนาน):** วัดเดิม 59MB/1220 ไฟล์/9 วิ (localhost) → 31MB/604/5.2 วิ · `DEFER_RE`/`bootDeferred(url)` ไม่โหลดตอนบูต: art/temple,rewards,build_paths,kitchen,delve,biomes,pinnacle,dig,icons,ch3_bosses,ch3_enemies,floors · ui/currency · gear · icons/levelup · incoming + ASSET_FX ทั้งหมด · `ensureDeferred(cb)` โหลดเบื้องหลัง (เริ่มจาก warm หลัง intro) + สร้าง anim FX/_walk/c3 idle/portal · ลบ placeholder canvas ที่ Boot วาดแทน key เดียวกันก่อนโหลด · gate: `ensureStageArt` รอ deferred · `buildMenuScreen` หน้าที่ไม่ใช่ hub รอ deferred (GameLoader 'Loading…') · เพลงโหลด/เมนู → `_lite.mp3` (56k mono / 80k) · **ถ้าเพิ่มอาร์ตใหม่ในโฟลเดอร์ข้างบน จะโหลดแบบ deferred อัตโนมัติ — hub ห้ามพึ่ง texture กลุ่มนี้**
- **v6.36.0 (เจ้าของสั่ง 3 ข้อ):** (1) ตัด Influence (`amapInfluence` คืน {} · ตัวคูณ/โบนัสเดิมเลยไม่ทำงาน) · ช่อง INFLUENCE ในแผง → NEXT MILESTONE (Pact milestone ชั้น 10/20/30/40/60 ต่อฮีโร่) · (2) `setupBiome2/tickBiome2`: frosty แผ่นน้ำแข็ง 6 แผ่นแช่มอน 1.6s (cd 3s/ตัว) ผู้เล่นช้า · sweet ดาวตก 8-11 วิ เตือน 1.4s → ดาเมจมอน + ยืนในวง = `sugarRush()` +3 Sugar · sour ฝนกรด 2 จุด/2.2-3 วิ → มอน `_sourT` 4s + 30% · fermented มอน 18% `_bloat` ตาย → `bloatBurst` r95 ลูกโซ่ (เพดาน 24) · `bzMake/bzPlace/bzWarn` · ใช้อาร์ต biome_* เดิม · (3) ใบสั่ง `docs/art_orders/13_DELVE_BOSSES.md` (Jelly Warden ชั้น 10 · Madame Candlewick ชั้น 20, 3 ครั้ง) · **ถัดไป: รออาร์ต → เขียนกลไกบอส 2 ตัว**
- **v6.35.0 (เจ้าของ: ไอคอนบน node เอียง/ไม่สมูท · แผงข้อมูลอ่านยาก):** node บนแผนที่ Delve เหลือแค่อาร์ต (+✓ธง/▼ ถัดไป) · ไอคอนรางวัล/◆mod/จุดอิทธิพล/ภารกิจ ย้ายไปแผง · แผงใหม่ PH 232: ชื่อ+ป้ายชนิด, Depth/เคลียร์, ตาราง 2×2 FLAVOR/REWARD/MISSION/INFLUENCE, แถว MODS ชิปเท่ากัน, HP×/Rewards×, Build+Start
- **v6.34.1 (บั๊กเจ้าของ: กด Endgame แล้วแอปค้าง/ปิด):** ต้นเหตุ v6.34 ปูพื้นรสบนแผนที่ Delve เป็น tileSprite ต่อช่วงในแถว = 158 ชิ้น สร้าง 5.2 วิ (มือถือ OOM) · ลบออก กลับเป็นแถบสีเดิม (fog tileSprite เดียวยังอยู่) → 62ms · **อย่าใช้ tileSprite จำนวนมากในเมนู**
- **v6.34.0 (อาร์ต R1–R3 จาก AI อีกตัว):** ตัดแผ่นรวมด้วย PIL → `assets/art/biomes/` (พื้น 5 รส webp 1024 + ของในฉาก 10 ชิ้น 256) · `assets/art/delve/` (node 6 แบบ 192, home 384, cleared_mark, fog, bossfloor 5 ใบ 752×416) · `assets/art/ch3_enemies/c3_e_*_walk.png` ชีต 4×128 สเกลให้เท่าภาพนิ่งเดิม (ย้ายจาก ASSET_IMAGES → ASSET_SHEETS anim 4 เฟรม, hitbox เดิม) · `assets/art/pinnacle/boss_pinnacle_sheet.webp` 4×2 เฟรม 256 (เท่า c3_boss5 → สเกลเดิม) · hooks: setupBiome ตั้งพื้นตามรสทุกถ้ำ (กลไกยังมีแค่ Spicy) · แผนที่ Delve วาด tileSprite พื้นรสต่อช่วงในแถว + fog ใต้ fogD + ธง cleared + การ์ดบอสจาง ๆ ในแผงเมื่อเลือกชั้นบอส · Pinnacle ใช้ boss_pinnacle (เลิกย้อมม่วง, enrage = เฟรม 6) + ชื่อบนหลอด · ต้นฉบับยังอยู่ assets/incoming (build-www ไม่คัดลอก) · verified headless 0 error 0 404
- **v6.33.0 (เจ้าของเลือก: biome ต่อรส เริ่ม Spicy):** `setupBiome(nd)` ใน startRecipeRun (`_biome`=รสของถ้ำ) · spicy: พื้น `biome_spicy_floor` (วาด canvas placeholder ใน `makeSpicyFloor` ถ้ายังไม่มีอาร์ต) · 7 ปล่องลาวา `_vents` (🌋+glow) ย้ายไปข้างหน้าผู้เล่นเมื่อห่าง >1000 · รอบ 4.6-6.2 วิ เตือน 1.1 วิ → `ventErupt` ฆ่ามอนธรรมดา 60% maxHP (มินิ 4%, บอส 1.2%) + ผู้เล่นโดนถ้ายืนอยู่ · มอน 15% เป็น Ember (`e._ember`, reset ใน spawnEnemy) ทิ้งไฟ `dropEmber` ทุก 1.3 วิ (อยู่ 2.4 วิ, เพดาน 26) · `clearBiome` ใน clearStageProps/exitStage · ใบสั่งอาร์ต `docs/art_orders/12_BIOME_SPICY.md` · **ถัดไป: เจ้าของเล่นดูความรู้สึก → อีก 4 รส → Perfect Dodge**
- **v6.32.0 (เจ้าของ 4 ข้อ):** (1) บอสใน Delve ไม่มี cutscene แพนกล้อง (`bossIntroQuick` เมื่อ recipeMode) · (2) ทางบนแผนที่เป็นมุมฉาก ลง→เลี้ยว→ลง จุดเลี้ยวตาม seed + ขอบดำ · (3) ลบแท็บ/การใช้ Pact: เงื่อนไขย้ายเป็น `RECIPE_PACT_MODS` (tyrant/frail/ravenous/pantry มี `pact:{}`) → `_pact` สร้างจาก mod ของถ้ำ · `_pactHeat`=0 · `claimPactMilestones` ใช้ heat=floor(depth/5) (ชั้น 10/20/30/40/60) · (4) `DELVE_MISSIONS` hunt/purge/capture/cleanAir/defendNectar/breakRoots · `delveMission(n)` seed ต่อถ้ำ (ไม่มีใน home/boss/vault/shrine) · startRecipeRun → `setupWaveObjective(1,{forceType})` · `_recipeMission` · บอสมาเมื่อ Hunger เต็ม **และ** ภารกิจเสร็จ · complete/fail ใน recipe ไม่เปลี่ยน mode (fail = เริ่มใหม่ 2.5 วิ) · survive/seasonCycle ไม่ใช้ (ผูกเวลา/ด่าน) · verified headless 6 ภารกิจเริ่มได้ บอสมา 0 error
- **v6.31.0 (เจ้าของ: Map Table ซ้ำกับแผนที่ · mod สุ่มต่อถ้ำ ยิ่งลึกยิ่งยาก):** ลบ `buildRecipePrep` · route recipes/rift/recipeprep → atlas board · แตะถ้ำ = เลือก + แผงล่าง 150px (ข้อมูล/ชิป mod แตะดู/HP×·Rewards×/🛠 Build/🔥 Heat/▶ Start) · `delveMods(n)`/`delveModCount` seed ต่อถ้ำ: floor(d/6)+35%·1, elite+1, boss≥2, vault/shrine/city−1, เพดาน 4, mod กลไกตั้งแต่ชั้น 10 · `mapTableRecipe` ใช้ `nd.mods` (ไม่จ่าย currency, `mapModCostOk` เลิกใช้) · node โชว์ ◆N · validator ตรวจ mod ไม่ซ้ำ/เพิ่มตามความลึก
- **v6.30.0 (Mochi Delve · เจ้าของอนุมัติแผน):** แทน Atlas 100 node ทั้งหมด · `delveRow(d)`/`delveLinks(d)` สร้างจาก seed ต่อความลึก (cache `_DROWS/_DLINKS`) · กว้าง 25 คอลัมน์ (`DELVE_W`=12) แต่ละช่วง 10 ชั้นเป็นทรงเพชร (`delveHW`) บีบเป็น 👑 ชั้นบอส node เดียวทุก 10 ชั้น · เขตรส `delveFlavorAt(x,d)` value-noise · ทางตัน = 💎 vault/⛩️ shrine · 🏰 Candy City 50%/ช่วง · 💀 elite 8% · id = 'x,d' (`amapNode/amapAdj/amapOpen/amapNext` ชื่อเดิม) · เซฟ `Save.data.delve={clears,best}` (`delveSave`, atlasMapVer=3 ชดเชยแผนที่เก่า 🍬40/แมพ + chaos ผ่าน `delveComp`) · `delveMul(d)` hp 1.08^d dmg 1.06^d reward 1+0.05d (ใน riftMul + recipeMul) · บอสชั้น HP×2 elite×1.5 · แต้ม = บอส 3 + shrine 1 · Pinnacle ฟรีเมื่อ best≥30 · UI `buildAtlasMap` วาดเฉพาะแถวรอบมุมมอง (`_amBand`, rebuild ใน `atlasBandCheck`) · fog: แถว > deepest+4 ซ่อน ยกเว้น 🏰/👑 ถึง +9 · validator ตรวจ deterministic/BFS ถึงชั้น 200/ชั้นบอส · อาร์ตตาม `docs/art_orders/11_MOCHI_DELVE.md` ยังเป็น placeholder (hook `delve_node_<type>`, `delve_home`) · **ยังไม่มีใครเล่นจริง — จูนตัวคูณความลึก**
- **v6.29.0 (เจ้าของเลือก 1+2+3 จากรีวิวหน้าเตรียมรัน):** `AMAP_REWARDS`/`amapRewardOf(id)` (seed 81300) ⚔️weapon 🛡️armor 💠materials 🍬sugar(×1.5 ใน finishRecipeBoss ผ่าน `_sugarRewardMap`) แทนปุ่ม Farming target · ไอคอนรางวัลมุมซ้ายบนของ node · `PACT_MILESTONES` heat 2/4/6/8/12 → 500 Sugar/5 epic currency/Pinnacle key/legend/unique ครั้งเดียวต่อตัว (`Save.data.pactBestChar`, `claimPactMilestones`) · กล่อง Build ย่อเหลือ 1 บรรทัด
- **v6.28.0 (เจ้าของแจ้ง 2 ข้อ):** `clearOrbs()` ใน startStage (EXP ด่านเก่าค้าง · clearPickups ไม่เคยล้าง orbs) · continueFromSummary ถ้า recipeMode → menuScreen 'atlas' แท็บ board แทน hub
- **v6.27.0 (เจ้าของส่งเพลงมา):** หน้าโหลด (index.html LoaderMusic) → `assets/audio/bgm/menu/bgm_loading_forgotten_wind.mp3` (แปลงจาก WebM 112k) · crystal_memory ยังอยู่
- **v6.26.0 (เจ้าของส่งเพลงมา):** bgm_main → `assets/audio/bgm/menu/bgm_menu_moonlit_rose.mp3` (แปลงจาก WebM 112k) · over_the_hill ยังอยู่ สลับกลับได้
- **v6.25.0 (เจ้าของ: เพลงโหลด+เมนูแนว FF9):** MENUS ใน gen_stage_bgm +`bgm_loading_crystal_memory` (A minor 72BPM i-VI-III-VII ฮาร์ป pluck + sine lead vibrato + choir + chime/wind, 53s) · `bgm_menu_over_the_hill` (G dorian 104BPM walk bass + bell arp + tri lead + choir, 37s) · 96k → assets/audio/bgm/menu · bgm_main ชี้ over_the_hill · index.html LoaderMusic ชี้ crystal_memory · เพลงเดิม (chiptune_pop/fairy_kingdom/crystal_clash) ยังอยู่ สลับกลับได้ · ยังไม่มีใครฟังจริง
- **v6.24.0 (เจ้าของเลือกข้อ 1+2 แทนแต้ม ⬆):** Recipe เลเวลอัพ → `recipeLevelUp()` (แทน slotLevelUp ใน openLevelUp): เลเวลทั่วไป = สุ่มสแตต endless ทันที + `sugarRush()` (`SUGAR_RUSH_SEC`=5: cdMul×0.6, dmgMul+0.25, คลื่นกระแทก r170 relicDmg×1.2 ผลักมอน, ไม่ stack แค่ต่อเวลา, คืนค่าใน `tickSugarRush` ที่ update หลัง elapsed) · ทุก `RECIPE_DRAFT_EVERY`=5 เลเวล = `_draftQ` → `openRecipeDraft()` 3 ใบจาก modCard/tradeCard/relic (dedupe) ผ่าน _forcedOpts + หัว 🌟 DRAFT · closeLevelUp recipe: ถ้ายังมี draft/pending → กลับ play แล้วเปิดต่อ 250ms · ปุ่ม ⬆/openUpgradePanel ไม่ถูกใช้แล้ว (dead code) · verified headless L2→L31 drafts ที่ 5/10/15/…, rush คืนค่า, 0 error
- **v6.23.1 (บั๊กเจ้าของ: ค้างหลังเลือก Relic):** ต้นเหตุ closeLevelUp ใน recipeMode เรียก openLevelUp เมื่อ pendingLvl>0 → openLevelUp ส่งต่อ slotLevelUp แล้ว return ทิ้ง state 'levelup'+physics pause = เกมค้าง (เกิดเมื่อมีแต้ม ⬆ ค้างแล้วได้ Relic: starting relic/merchant/bonus) · แก้: recipeMode ไม่เปิดซ้ำ กลับ play + refreshUpBtn · verified headless แต้ม 2 คงอยู่ state play
- **v6.23.0 (เจ้าของ: Mochitopia อยู่กลาง ออกไปแต่ละทิศ):** ผังใหม่ seed 62300 · 5 ภูมิภาค = 5 แฉก (`L.dirs` ทุก 72°) · `AMAP_RINGS` วงที่ rr 0-4 = T1-3/4-6/7-9/10-13/14-16 (tier สุ่มในวง) · eng = ด่าน ch(0/5/10 ตามวง)+reg · hub = col1,2 ของวงในทุกแฉก (10 จุดเริ่ม) · ทางข้ามแฉกติดกัน 50%/วง · Guardian ปลายแฉก · `atlasPinnacleOpen` = ครบ 5 Guardian (`amapGuardiansDown`) · Pinnacle = แตะ Mochitopia ตรงกลาง · `amapRegionOpen` = true เสมอ · layout radial S=1900 · เซฟ `atlasMapVer=2` รีเซ็ต atlasMap/atlasClears ครั้งเดียว · ปุ่ม 🏠 home
- **v6.22.0 (เจ้าของเลือก 3A Influence · 5 รสก่อน เพิ่มทีหลัง):** `AMAP_FLAVORS` spicy/frosty/sweet/sour/fermented · `amapFlavorOf(id)` seed 70100+id·7919 (ไม่กระทบ seed ผัง) · `Save.data.atlasClears[id]` นับทุกการเคลียร์ (เซฟเก่า = 1) · `amapInfluence(id)` รวมรสของเพื่อนบ้านที่เคลียร์ ตาม clears เพดาน `AMAP_INF_CAP`=3/รส · startRecipeRun ตั้ง `_amapInf` + banner · riftMul: ชั้นละ hp/dmg +10% reward +15% · frosty hp+6%/spd−7% · fermented dmg+8% · spicy hazard 6%/ชั้นต่อ kill · sweet spawn เร็ว · sour eliteEvery×(1−0.15) · finishRecipeBoss: spicy currency · frosty shards · sweet Sugar · sour gear 50%/ชั้น · fermented unique +3% · Atlas: วงสีรส + จุดชั้นอิทธิพล · prep box/Totals แสดงผล · **ยังไม่ทำ:** สูตรพิเศษเมื่อ 2 รสครบ 3 ชั้น, 3B Seeds, 3C Corruption
- **v6.21.0 (เจ้าของ: zoom/pan Atlas ให้เห็นความอลังการ):** `atlasLayout()` ผืนเดียว 360×~2700 (hub ล่าง, 5 แถบภูมิภาคสูง 440, Pinnacle บน) · `_amView` container + geometry mask ใน `_amRect` · `_amv={x,y,s,min}` จำตำแหน่งข้าม rebuild · `atlasPointerDown/Move/Up` (ลาก pan, 2 นิ้ว pinch, แตะไม่ลาก = `atlasTapAt` หา node ใกล้สุด) hook ใน setupInput ก่อน handleTap + wheel · แถบปุ่ม 5 ภูมิภาค/✦/➕/➖ · แถบสี region = placeholder (`atlas_region_bg_N` ถ้ามีอาร์ต)
- **v6.20.0 (เจ้าของ: อยากได้ 100 แมพแบบ PoE · ไม่ใช้ด่านเดิม · ใช้พื้น tutorial ไปก่อน):** `AMAP_REGIONS` 5 ภูมิภาค (T1-3/4-6/7-9/10-13/14-16) × 20 · `atlasGraph()` ผังตายตัว seed 61900 (กริด 4 คอลัมน์ × 5 แถว/ภูมิภาค, union-find ให้เชื่อมครบ, ข้ามภูมิภาคผ่าน Guardian เท่านั้น) · node={tier ตายตัว,type normal/vault×2/shrine×2/guardian,name/emoji placeholder,imp=map mod ฟรี,eng=ด่านเดิมที่ยืม roster ศัตรู,hue} · เซฟ `Save.data.atlasMap` · `amapOpen/amapNext/amapRegionOpen` · atlasPoints = แมพที่เคลียร์ (shrine 3) max 120 · mapTable ใช้ `node` (tier ไม่เลือกแล้ว) · recipe มี `r.node` · startRecipeRun พื้น train_floor ย้อม hue + ลบ props · guardian บอส HP ×1.5 · vault +Sugar · Pinnacle = ชนะ guardian ภูมิภาค 5 · UI `buildAtlasMap` แท็บภูมิภาค 5+✦ แตะ=ข้อมูล แตะซ้ำ=ไป prep · ศัตรูยังยืมด่านเดิม (รอคอนเซ็ปต์ใหม่จากเจ้าของ) · ใบสั่งอาร์ต 10_ATLAS_MAP อัปเดต
- **v6.19.0 (เจ้าของ: Map Table ไม่เห็นภาพการเดินทาง):** `ATLAS_LAYERS` 3 วง Kitchen(0-4,T≤5)/Garden(5-9,T≤10)/Throne(10-14,T≤16) · node ปลดเมื่อเพื่อนบ้าน (วงเดียวกันติดกัน/วงบน-ล่าง index เดียวกัน) เคลียร์ · เริ่มที่ hub → node 2 · `atlasTierCapFor` · mapTable/recipeprep วนเฉพาะ `atlasOpenThemes` · `buildAtlasMap` แท็บ Board: เส้นทาง/หมอก/▼ node แนะนำ/✨ unique · แตะ node = ไป recipeprep · Pinnacle เปิดเมื่อจบวง Throne (ครั้งแรกฟรี `pinnacleFreeUsed`) · อาร์ต placeholder → ใบสั่ง `docs/art_orders/10_ATLAS_MAP.md` (ให้ ChatGPT ทำ) · M5 node ทางแยกยังไม่ทำ
- **v6.18.0 (เจ้าของ: ทำแบบ PoE):** แหล่ง `p.dmgMul*=X` ทั้ง 64 จุดแปลงเป็น `p.dmgMul+=(X)-1` (increased บวกรวม) ยกเว้น `st.dmg` ฐานตัวละคร · บัฟชั่วคราว shrine/crossroads blood ถอดด้วย −0.3/−0.25 · endless/cook +0.05 · clampPlayerStats dmgMul ≥0.1 · more = powerMul/condDmgMul/modDmgMul/bossDmg/relic/berserk ใน damage() · `FLAT_EFF` (momo1 mint.4 cocoa.6 taro1 sesame1.5 yuzu.5 berry1) + `FLAT_EFF_PATH` (sniper2.5 shotgun.6 ricochet.8) คูณ flat
- **v6.17.0 (เจ้าของ: flat แบบ PoE + ไม่มีเพดาน):** damage() บวก (flatDmg+gearAttackRoll)×dmgMul เป็นบรรทัดแรกหลัง phase gate (ไม่ใช่ dot `_infTick`) → โดนตัวคูณทุกตัว+Power+คริ · ลบบรรทัดบวก flat เดิม · edge tiers 5-band [[6,8],[5,5],[3,4],[2,3],[1,2]] · `STAT_CAPS` = dmgMul ∞ / crit 1 / cdMin 0 / takenMin 0 / speed ∞ (ทุกแหล่งลด cd/taken เป็นคูณ จึงไม่ถึง 0)
- **v6.16.0 (เจ้าของ: ไม่ลดบอส ให้บัฟผู้เล่นตาม progress):** revert v6.15.1 (เลือดบอสเดิม) · `itemPowerMul(iLv)`=1.03^(iLv−1) (หลัง 60 โต 1.015/lv, iLv100≈10) · อาวุธที่สวม (ไม่ใช่ start) ตั้ง `p.powerMul` ใน applyMeta + previewStats · คูณใน damage() ข้าง condDmgMul (นอกเพดาน STAT_CAPS) · วัด headless Lv30 อาวุธ iLv ตามด่าน: C1-5 15s · C2-5 38s · C3-5 momo 65s/mint 88s (เดิมไม่มี power 20/135/300s)
- **v6.15.0 (Idle I-Dig, เจ้าของ: ข้อ 3 เป็นแหล่งด้าย):** `MINER_LEVELS` Lv1-5 (ด้าย 3/5/7/9/12 ต่อชม., เก็บ 8-16 ชม., จ้าง/อัป 🍬300/600/1000/1500/2200) · `Save.miners()` `{lv,at,store}` · `minersTick` สะสมตามเวลาจริง (นาฬิกาถอย = รีเซ็ต at ไม่ให้ของ) · `minersCollect/minersUpgrade/minersReady` (≥50% ความจุ → จุดแดง Depths) · แถว 👷 ล่างหน้า buildDig · แผน idle อื่น (Bakery/Expedition/สวน/Bounty) เจ้าของยังไม่สั่ง
- **v6.14.0 (B9):** Starting Relic: startRecipeRun หลังเริ่มเวฟ 0.9 วิ เรียก `offerRelic()` (เลือก 1 ใน 3, หยุดเกม) เฉพาะ Recipe/Endgame ถ้ายังไม่มี relic · ใช้ช่อง relic ปกติ (RELIC_CAP)
- **v6.13.0 (B8):** `UNIQUE_GEAR` 5→12 (key ซ้ำช่องใช้ `slot` เช่น weapon2/gloves2) · Twin Whisk cd×0.75 dmg×0.85 · Ember Spice Mitts `_tagIgnite` 25% · Frostbite Treads `_tagChill` 20% spd×0.9 · Four-Leaf Gummy crit+12% critMul−0.25 · Whirlwind Heart `_cond.c_dash`+2 · Rage Apron `_tdBerserk` + `_uqGlass` 0.85 · Giant-Slayer Gloves `_cond.c_boss`+3 spd×0.9 · ทุกธีมมี unique 2-3 ชิ้น · validator ล็อก 12
- **v6.12.0 (B7):** Dual Infusion: มี `b.infusion` แล้ว + เลเวล≥22 → การ์ด 3 ใบธาตุอื่น ตั้ง `b.infusion2` (reset ทุกด่านพร้อม basicAttack) · ติด 50% ของฮิตใน damage ต่อจาก infusion หลัก · ไม่มีตัวคูณ direct · นับแท็กใน tagCounts · tickInfusion ทำงานถ้ามีธาตุใดธาตุหนึ่ง
- **v6.11.0 (B5):** endlessStatDefs เพิ่มการ์ดเงื่อนไข 7 ใบ (c_low/c_dash/c_still/c_full/c_boss/c_streak/c_close, max ต่อใบ) stack ใน `p._cond` (reset ใน applyMeta) · `condDmgMul(e)` คูณใน damage ก่อน Berserker · `condTakenMul()` ใน touchEnemy/hurtPlayer · doDash ตั้ง `_lastDashAt` · การ์ดตัวเลขเดิมยังอยู่
- **v6.10.0 (B6):** `FUSIONS[char]` 2 สูตร/ตัว = Evolution + Relic เฉพาะ (momo burst/crown · mint chill/splinter · cocoa momentum/lastbreath · taro dashcharge/crown · sesame glass/magnet · yuzu harvest/jam) ใช้ kind เดียวกับ Modifier (`modDef` หา FUSIONS ก่อน) เก็บใน `b.mods` id `f_*` (ไม่นับ MOD_MAX) · `fusionReady()` → การ์ด Fusion ใบเดียวต่อจากช่วง evolution ใน rollBasicAttackUpgrades · Relic ที่จับคู่น้ำหนัก ×2 ใน rollRelicChoices · Pause แนวตั้งมี 🧬 Fusion Goals (✓/○ Evolve + Relic) ต่อจากตาราง Tags · verified headless การ์ด Fusion ขึ้น + apply + screenshot pause 0 error
- **v6.9.0 (B4):** `TRADEOFFS` 8 ใบใช้ร่วม (Glass Heart/Slow Burn/Heavy Armor/Sugar Rush/Berserker/Frozen Core/Hungry Pact/Sniper’s Oath) `{gain,cost,apply(p),tags}` · `tradeCard()` ออกเมื่อ stageIndex≥5 หรือ recipeMode และเลเวล≥5 โอกาส 25%/รอบ (แทนช่องสุดท้าย ไม่ทับ Modifier) · `TRADE_MAX`=2 ใน `b.trades` · Berserker คูณดาเมจ 1+%HP ที่หายใน damage (`_tdBerserk`, reset ใน applyMeta) · tag fire4/frost4 ใช้ Math.max กันทับค่า Slow Burn/Frozen Core · verified headless: บท 2 = Trade-off 24/300 การ์ด, บท 1 = 0, apply ถูก 0 error
- **v6.8.0 (B3):** `MODIFIERS[char]` 6 ใบ/ตัว (momo mint cocoa taro sesame yuzu · ตัวอื่นใช้ชุด momo) · `MOD_MAX`=3/ด่าน เก็บใน `b.mods` · `modCard()` แทรกในการ์ดปกติตั้งแต่เลเวล 4 (35% หรือการันตีถ้าการ์ดอาวุธหมด) · kind: hitBoom/hitChain/nthHit/killBurst/killTrap/dashNova/dashTrail/pulse/stillPower/movePower/closeBonus/farBonus/execute/bossBonus/frozenMul · hooks: `modDmgMul` คูณใน damage ก่อน relic · `modOnHit` ต่อจาก tag proc · `modOnKill` ใน killEnemy · `modOnDash` ใน doDash · `modTick` ใน update · ดาเมจ proc = relicDmg(mul) ผ่าน `modBoom` (กัน recursion `_modTick` + งบ 8 ครั้ง/0.25s) · แท็กของ mod นับใน tagCounts · verified headless mint ครบ 6 ใบทำงาน 0 error · ยังไม่ได้จูนบนมือถือ
- **v6.7.1 (B2):** buildPause แนวตั้งมีตาราง 🏷️ Build Tags 2×4 (เรียงจำนวนมาก→น้อย, จุด ●○ ตามขั้น, บรรทัด 'N more → โบนัสถัดไป' หรือ MAX) ระหว่างกรอบ Held กับรายการ Relic (`tagBot`) · การ์ดเลเวลอัพต่อท้าย '⬆ ❄️×4 bonus' ถ้าเลือกแล้วถึงขั้นโบนัส (เฉพาะการ์ดที่ยังไม่เคยมี) · verified screenshot 390×844 0 error
- **v6.7.0 (เจ้าของสั่ง B1 จากแผนบิ้วหลากหลาย):** `TAG_SETS` 8 แท็ก fire/frost/spark/crit/guard/swarm/ranged/melee โบนัสที่ `TAG_TIERS` 2/4/6 (`t[i]`/`b[i]`) · fire4 `_tagIgnite` 15% ติดไฟ (spicy) · frost4 `_tagChill` 12% แช่ (hook ใน damage ต่อจาก infusion, reset ใน applyMeta) · `WEAPON_TAGS` ต่อตัว · `UP_TAGS` แมป id การ์ด/สาย/mutation (ไม่อยู่ในตาราง = แท็กแรกของอาวุธ) · `TAGS_OF.infusion/relic/affix` เป็น array · `upTags(id)` · `tagCounts()` นับอาวุธฐาน+การ์ดที่มี+path+infusion+mutation+evo+relic+mod ไอเทมที่สวม (แท็กละ 1/ชิ้น) · refreshTagSets เรียกทุก syncBasicAttack · การ์ดทุกใบต่อท้ายแท็กผ่าน makeCard · **แผนต่อ: B2 แท็กบน Pause → B3 Modifier → B4 Trade-off (ออกตั้งแต่บท 2) → B6 · B9 Starting Relic เฉพาะ Endgame · การ์ดตัวเลขเดิมคงไว้ก่อน**
- **v6.6.2 (เจ้าของ):** revert v6.6.1 → แผงอัปเกรดกลับมาหยุดเกมแบบ v6.6.0
- **v6.6.0 (เจ้าของ: สล็อตน่ารำคาญ):** Recipe เลเวลอัพ = สะสมแต้ม (`pendingLvl`) ปุ่ม ⬆ N pt มุมขวา (`refreshUpBtn`, y=pad+150) · แตะ = `openUpgradePanel` หยุดเกม (state rolling) แถว endlessStatDefs แตะ = ใช้ 1 แต้ม · 🎲 Auto spend all · ▶ Resume · ใช้ทุก recipeMode (ไม่ต้อง _egBuilt) · verified headless 0 error
- **v6.5.0 (เจ้าของ):** เลิกไอเทมแมพ → Map Table ในหน้า Endgame (`mapTable`/`mapTableRecipe`) เลือกธีม + tier ≤ `mapTierCap()` (=recipeMaxClear+1) + mod ≤3 จ่าย currency ตาม `MAP_MOD_COST` transmute/regal/exalt · `migrateMapTable` คืนแมพเก่าเป็น currency ครั้งเดียว · บอสไม่ดรอปแมพแล้ว (เคลียร์ = ปลด tier ถัดไป) · verified headless 0 error
- **v6.4.0 (เจ้าของ):** หน้าเตรียมรันเป็นหน้าแรกของ endgame: route 'recipes'/'rift'/'recipeprep' → `buildRecipePrep` (หัว '📜 Endgame') · คลังเดิมย้ายเป็น menuScreen 'recipebag' (`buildRecipes`, ปุ่ม Run → Select แล้วกลับหน้าแรกโดยตัด navStack) · เลือกแผนที่ tier สูงสุดอัตโนมัติ · คลังว่าง = ปุ่ม Get free Tier 1 · กล่องแผนที่มี Change › · แถวปุ่ม Maps/Atlas/Pinnacle(🗝keys) เหนือ Start Run · verified screenshot + nav, 0 error
- **v6.3.0 (เจ้าของสั่งข้อ 2 จากรีวิว):** หน้าเตรียมรันหน้าเดียว `buildRecipePrep` (menuScreen 'recipeprep', ปุ่ม Run ในหน้า Recipe มาที่นี่ `_prepRecipe`) · กล่องแผนที่ (tier/ธีม/mods) · Build สรุป+Edit › · Pact สรุป+Edit › · เป้าดรอป 4 ปุ่ม (แทน openEndgamePreparation สำหรับ Recipe) · ตัวคูณรวม HP/dmg/boss/reward/goal · Start Run (บล็อกถ้า build เกินแต้ม) · Back ผ่าน _navStack · verified screenshot 390×844, 0 error
- **v6.2.5 (เจ้าของ):** autoEndgameCurse สุ่มได้ 'ไม่มีคำสาป' เป็น 1 ช่องเท่ากับคำสาปแต่ละตัว (โอกาส 1/(N+1)) + แบนเนอร์ No curse
- **v6.2.4 (เจ้าของ):** หน้า Endgame Build แต่ละแถวมีคำอธิบาย (desc ของ path/inf/mut/evo/upgrade) · คำสาปกลางรัน endgame สุ่มให้เลย ไม่หยุดเกม (`autoEndgameCurse`, หน้าเลือกเดิมเหลือใน openEndgameCurseChoice) · verified headless screenshot + curse ติด state play
- **v6.2.3 (เจ้าของ):** Recipe บอสมาเมื่อหลอด Hunger เต็มเท่านั้น (late=false, ไม่มี time cap) · หลอดใช้อาร์ต `replay_progress_art` ย่อ (กว้าง min(250,72%), สูง 24/11) ผ่าน `renderRecipeProgress` + หมุด event ใน pipG · drawRecipeBar เหลือ dead code
- **v6.2.2 (เจ้าของเลือกข้อ 5):** Recipe เลเวลอัพ = `slotLevelUp` สล็อตเล็กมุมขวาบน (y=pad+150) หมุน 12 tick แล้วให้สแตต endless ทันที เกมไม่หยุด · คิวต่อเมื่อเลเวลซ้อน (`_slotBusy`) · relic offer (_forcedOpts) ยังหยุดเกมตามเดิม · verified headless 2 เลเวล state play ตลอด 0 error
- **v6.2.1 (เจ้าของ):** Recipe Hunger goal 260+10·tier (เดิม 150+6) · `RECIPE_TIME_CAP`=300 วิ (บอสมาเอง; replay ยังใช้ RECIPE_HUNGER_CAP 180) · RECIPE_PAR 100→170
- **v6.2.0 (เจ้าของเลือก 1ข+2ข):** Endgame Build: `Save.data.egBuild[char]`={path,inf,mut,evo,lv} ตั้งในหน้า `buildEgBuild` (ปุ่ม 🛠 Build หน้า Recipe) · แต้ม `egBuildPoints()`=8+atlasPoints · ราคา path2 inf2 mut3 evo4 upgrade 1/rank · `applyEgBuild` ใน startRecipeRun (ลบ +3 เลเวล) · Recipe เลเวลอัพ = `endlessCards` เท่านั้น · Run ถูกบล็อกถ้าเกินแต้ม · verified headless build ติด + การ์ด endless, 0 error · ยังไม่เห็นหน้าจอจริง
- **v6.1.1 (เจ้าของ):** Recipe run โชว์หลอด Hunger (`drawRecipeBar` แทนจุดเวฟใน drawWavePips) หมุด event 30/40%+70% และบอสปลายหลอด
- **v6.1.0 (เจ้าของเลือก Hades Pact):** `PACT_TERMS` 8 เงื่อนไข (hp/dmg/speed/horde/boss/frail/heal/hunger) แท็บ 🔥 Pact ใน Atlas (`buildPact`) · `Save.data.pact` ใช้กับทุก Recipe · snapshot `this._pact/_pactHeat` ใน startRun · reward ×(1+0.07·heat) ใน riftMul · `Save.data.pactBest` · verified headless heat 8 ตัวคูณถูก 0 error · **ยังไม่เล่นจริง**
- **v6.0.79 (เจ้าของ):** bgm_main → `bgm_menu_chiptune_pop.mp3` (C major 128BPM groove+pulse bass+sqr arp 16th+sqr lead, ลูป 30 วิ) · Crystal Clash ยังเก็บไว้
- **v6.0.78 (เจ้าของ):** หน้าโหลดเล่น `bgm_loading_fairy_kingdom.mp3` (F lydian 88BPM pluck+choir+sine lead) ผ่าน `window.LoaderMusic` ใน index.html (HTML Audio, เคารพ settings.sound/musicVol, autoplay โดนบล็อก = เล่นตอนแตะแรก) · fade ตอน finishIntro หรือ playMainBgm
- **v6.0.77 (เจ้าของ: แนว FF9 สู้บอส):** bgm_main → `bgm_menu_crystal_clash.mp3` (MENUS ใน gen_stage_bgm: E harmonic minor 150BPM march+pulse bass+sqr arp 16th+brass lead+choir) · เพลงเดิม mochi_morning ยังอยู่ สลับกลับได้
- **v6.0.76 (เจ้าของ):** กรอบเปรียบเทียบ Equipment โชว์สแตตครบ (เลิก slice 5) + ส่วน MODS ของแต่ละชิ้นในกรอบ แทนบรรทัด affix ใต้กรอบ
- **v6.0.75 (เจ้าของแจ้ง):** กรอบเปรียบเทียบ Equipment โชว์ mod คราฟต์ที่เคยหาย (lifesteal/flatDmg/regenPct/healEffect/sugar-box-currency find/uniqueCd) ใน `GEAR_COMPARE_STATS` + `gearInstanceStats`
- **v6.0.74 (เจ้าของสั่ง):** ปุ่ม AUTO ของกล่อง currency ย้ายเข้าไปในการ์ด Crafting supply box (`bazaarProductCard` รองรับ `product.alt={label,fn}` ปุ่มกลางการ์ด) · ตัดการ์ด AUTO แยกออก
- **v6.0.73 (เจ้าของสั่ง: ยังเหมือน Hunt → เลือกข้อ 2 พายุฤดู):** seasonCycle = **Season Storm** (แทน Elemental Swap ของ v6.0.72) · `o.storm={passed[4],cur}` · ทุกฤดู (10 วิ) มีบททดสอบ `stormRule`: 🌸 ฆ่า 10 (มอนฟื้น 4%/วิ) · ☀️ ยืนนิ่ง 1.4 วิ = ไหม้ (โดน ≤1) · 🍂 ลมดันตำแหน่ง 75px/วิ + เส้นลมเตือน 1 วิ เล็งจุดที่จะลอยไป (โดน ≤1) · ❄️ พื้นลื่น (velocity lerp) + แผ่นน้ำแข็งเตือน 1.1 วิ (โดน ≤1) · ผ่านครบ 4 = จบ · ไม่ผ่านไม่เสีย รอรอบหน้า · ฤดูที่ผ่านแล้ว = พักไม่มีภัย · ฤดูแรกที่เริ่มกลางทาง (partial) ไม่นับ · ระหว่างภารกิจปิดภัยเดิมของ tickSeasonArena (ยกเว้นฮีลฤดูใบไม้ผลิ) · `stormHit` ดาเมจ 7-8% maxHP · HUD `stormHudText` · verified headless ยืนนิ่งโดนครบ 3 ฤดู, flow จบภารกิจ, 0 error
- **v6.0.72 (เจ้าของสั่ง):** ภารกิจ seasonCycle (C2-4) เลิกยืนในวง → **Elemental Swap**: มอนธรรมดาติดฤดู (`seasonTag`, `e._seasonObj/_season`, 40% = ฤดูปัจจุบัน) วาดวงสีใต้ตัวใน objNodeG (ฤดูปัจจุบัน = วงทึบเต้น) · ฆ่าตัวฤดูปัจจุบัน +1 ใน `objOnKill` · ผิดฤดูไม่นับ (หลอดไม่ลด) · target 24 · ลูกศรชี้มอนฤดูปัจจุบันที่ใกล้สุด · HUD โชว์ฤดู · verified headless 0 error
- **v6.0.71 (เจ้าของสั่ง):** Bazaar กล่อง Equipment → **Gear Trade-in** (menuScreen `tradein`, `buildTradeIn/doTradeIn`): เลือก 3 ชิ้น (ไม่รวม lock/fav/สวมอยู่/start) → ได้ 1 ชิ้น iLv = เฉลี่ย +2..+5 (cap 100) เกรดสุ่มจากเกรดของที่ใส่ (legend→epic) ผ่าน `grantGear(tier,{tradeLv})` mod ปกติ · แก้ `bazaarSlotReveal` ล้าง tapZones กันแตะปุ่มใต้ตอนหมุน (เดิมทำ error) · verified headless 0 error
- **v6.0.70 (เจ้าของสั่ง):** Crystal Glaze (`divineFocusedLine`) = สุ่ม tier ใหม่ในช่วงที่ไอเทมทำได้ แทนสุ่มค่า · กล่อง currency Bazaar ได้ 1 ชิ้น ราคา `bazaarCurrencyBoxCost()` = ค่าเฉลี่ยราคาขาย 90% (~130) · ปุ่ม AUTO เปิดวนจน Sugar หมดหรือแตะหยุด
- **v6.0.69 (เจ้าของสั่ง):** ขาย currency ใน Bazaar ได้ 90% ของราคาซื้อ (เดิม 60%)
- **v6.0.68 (เจ้าของสั่ง):** ช่องเก็บของ gear 24→100 (`gearInventoryCap`, เซฟเก่าต่ำกว่า 100 ถูกยกเป็น 100 ตอนโหลด)
- **v6.0.67 (เจ้าของสั่ง):** การ์ดสาย Sniper อัป Unique ชาร์จ (`snipeMods()`): s_heavy ดาเมจ +45%/ชาร์จ +0.35s · s_quick ชาร์จเร็ว 22%/ดาเมจ −12% · s_bore ลำกว้าง +40%/cd +15% · s_split ลำข้าง +1 (55%)/ลำหลัก −10% (max2) · ยังไม่เล่นจริง
- **v6.0.66 (เจ้าของสั่ง):** Momo สาย Sniper: ปุ่ม Unique = `startSnipeCharge` กดค้างชาร์จ 1.1 วิ (หลอดเหนือหัว, เต็ม=ทอง) · ลากนิ้ว >18px กำหนดทิศ (`moveSnipeAim`, ไม่ลาก = เล็ง strongestEnemy) · `tickSnipe` วาดเส้นเล็ง+หลอด · tickBossZoom ×0.72 ขณะชาร์จ · ปล่อย `releaseSnipe` = เส้นตรง 1500px ทะลุทุกตัว ดาเมจ (60+22ul)×dm×up×(0.45+1.55c) เต็ม ×1.25 บอส/มินิ ×1.2 · `drawWindTrail` แกนขาว+ลมแหวกสองข้าง · ยกเลิกเมื่อ state≠play/exitStage · verified headless 6/6 hit, zoom 0.74→1.0, 0 error · **ยังไม่เล่นจริง**
- **v6.0.65 (เจ้าของสั่ง):** ลบ Mint rig ทั้งหมด (โค้ด MINT_RIG_*/class, atlas `mint_rig_parts`, assets/incoming/mint_rig, scripts pack/preview, test, previews) · Mint ใช้ sprite sheet ทุกท่า · บันทึกเหตุผลใน `docs/MINT_RIG_TRIAL.md` · **อย่าทำ rig กลับมา — ใช้เฟรม sprite + เจลลี่/VFX แทน**
- **v5.90.0:** Yuzu, Taro และ Sesame มี run sheet 12 เฟรมและ attack sheet 8 เฟรม; ท่าโจมตีเล่นเมื่อใช้สกิลประจำตัว/Unique และกลับสู่ท่าวิ่งหรือ idle เมื่อจบ; ท่าเจ็บ/ล้มจาก action sheet เดิมยังใช้ต่อ
## 4. สถานะก่อนหน้า (v5.89.0 — Fighter Playtest)
- **v5.89.0:** ช่วงทดสอบก่อนขึ้น Store เปิดนักสู้ทั้ง 6 ตัวในหน้า Heroes/Talents ทันทีด้วย `FIGHTER_PLAYTEST_ALL`, ยังไม่เขียน chars เพิ่มและไม่ให้ milestone ปลดล็อกระหว่างทดสอบ; เซฟ progress เดิมคงอยู่เพื่อกติกาหลังปล่อยจริง · **ถัดไป:** ทดสอบเลือกเล่นทุกตัวบนมือถือและกลับมากำหนด milestone ก่อนปล่อย Store
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v5.88.0 — Human Yuzu Art)
- **v5.88.0:** เปลี่ยน Yuzu จากโมจิทรงกลมเป็นตัวละครร่างคน chibi ตาม Mint/Taro, แทน sprite sheet 8 เฟรมและการ์ดตัวละคร, ลูกสมุนกับ Cheese คงเดิม · ตรวจ PNG / build / validators ผ่าน
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v5.87.0 — Yuzu Citrus Crew)
- **v5.87.0:** Yuzu เป็นนักอัญเชิญตัวละครหลักลำดับ 5 หลังผ่าน C2-5; Sesame เก็บเป็นตัวลับสำหรับเซฟที่มีอยู่ (`docs/YUZU_CITRUS_CREW.md`) · เพิ่มการ์ด 5, Build Path 3, Mutation 3, Evolution/Unique, ลูกส้มและ Cheese ผู้ช่วย Workshop พร้อม sprite sheet โปร่งใส 8 เฟรม · `npm run check`, build:www และ runtime harness ผ่าน · **ถัดไป:** เล่นทดสอบบนมือถือจริงและจูนจำนวน/ดาเมจลูกสมุน, ทำ art card เต็มตัวหากภาพตัวละครบนหน้าเลือกยังไม่ชัด
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v5.84.0 — Sugar Orders)
- **v5.84.0:** `docs/SUGAR_ORDERS.md` · Bazaar เพิ่มแท็บ Orders ให้เลือกพลั่ว/ด้าย/Twist Cream/Wild Jam ด้วย Sugar แล้วรับหลังผ่านด่านปกติ · รางวัลคูณตาม `DIFFS[].reward`, หนึ่งคำสั่งต่อครั้ง, แพ้/ออกยังคงอยู่, ยกเลิกได้เงินคืน, บันทึกในผลสรุป · `game.js` เต็มถูกกู้คืนจาก v5.81 และใส่การแก้ v5.82–83 กลับครบหลังไฟล์บน branch ถูกตัดในขั้นส่งไฟล์ก่อนหน้า · static checks ผ่าน · **ถัดไป:** ทดสอบ UI บนมือถือและสมดุลราคาจากการเล่นจริง
- **v5.83.0:** รายการ 14 ข้อและสถานะใน `docs/PLAYTEST_FEEDBACK_2026_09_27.md` · Mint Barrage สูงสุด 3 หอก/ลดดาเมจต่อหอก · Juicy Burst splash บน seed ที่ทะลุเป้าและแก้ path upgrade array ถูก push Deep Flavor ซ้ำ · Clean Air กว้าง/เร็ว/สั้นขึ้น · Escort วิ่งและชำระแกนเร็วขึ้น · Beat Rush เพิ่ม AUTO (แรงน้อยกว่า manual) และลดเวลาต้องลาก/ปัด · Depths ซื้อพลั่วด้วย Sugar ได้จำกัดรายวัน · static validators ผ่าน · **ถัดไป:** เล่นจริงบนมือถือ, จูน Mint Glacier/Pierce และ Cocoa 3 สายให้ต่างเด่น, ตรวจการ์ด Mint รายใบ
- **v5.82.0:** เพิ่ม `docs/STRAWBERRY_BUILD_FEEDBACK_2026_09_27.md` ติดตามงานและเกณฑ์ทดสอบ · Shotgun บีบ spread เมื่อชิดศัตรูตัวใหญ่ · Ricochet ยิงถี่ขึ้น 25% · Sniper ชาร์จ 0.34 วินาทีแล้วกระสุน ×3.2 ทะลุเป้า คูลดาวน์เพิ่ม 18% · Unique ของ Sniper ยิงระเบิดซ้ำที่เป้าหมายเลือดสูงสุด · ตรวจ static validators ผ่าน · **ถัดไป:** ทดสอบเล่นบนมือถือครบสามสายโดยเฉพาะจำนวน hit บอสและ FPS
- **v5.81.0:** การ์ด Build Path แสดงชื่อสายและบทบาทเด่น ไม่แสดง Lv1 หรือดาวแบบการ์ดอัปเกรด · ใช้ emoji แต่ละสายแทนไอคอนอาวุธร่วมกัน · หัวข้อบอกว่าเลือกได้สายเดียวต่อรันและแตะซ้ำยืนยัน
- **v5.80.0:** เวฟ 3–4 มีโอกาสเจอ Sugar Courier ให้ล่าก่อนหนี หรือ Supply Cache ให้ทุบโหลทอง 3 ใบภายในเวลา · ได้ Sugar ตามระดับความยากและ Currency · ไม่บังคับผ่านเวฟ และไม่ปรากฏในการเล่น Stage 1 ครั้งแรก
- **v5.79.0 (เจ้าของเลือกแนวทาง A: ทางแยกกลางด่าน):** global `CROSSROADS` 5 แบบ (treasure: crate×7+vac+swarm · blood: −30% HP, dmg×1.25 cd×0.9 90 วิ · duel: elite HP×3 `e._duelElite` ฆ่าแล้ว → `duelEliteDown` offerRelic/currency · rest: ฮีล 40% · gamble: 50% currency 3 / 50% elite 2 ตัว) · `onWaveCleared(keep,fromMini)` ตอนมินิตาย → `openCrossroads(next)` สุ่ม 3 ประตูรอบผู้เล่น R≤170 · เดินเข้า (<52) = `chooseCrossroad` · 14 วิไม่เลือก = ข้าม · `resumeAfterCrossroads(ms)` เข้าช่วงพัก → เวฟถัดไป (`_xrNext`) · `tickCrossroads` ใน update · `clearCrossroads` ใน startStage/exitStage · ไม่เกิดใน tutorial/recipe/bossRush · verified headless ครบ 5 ประตู+timeout+screenshot, 0 error · **ยังไม่มีใครเล่นจริง**
- **v5.78.0 (เจ้าของเลือกข้อ 1+3):** `deathFling(e)` ภาพมอนธรรมดากระเด็นหมุนออกจากผู้เล่น 280ms (ใช้งบ `fxOk`) · ฆ่า ≥6 ตัวใน 260ms = screenShake 90ms 0.0035 (cd 450ms, `_mkT/_mkShakeAt`) · กระสุนศัตรูใช้ `proj_foe` (= proj_enemy + ขอบเข้มจาก PIL) ไม่ย้อมสีตามด่านแล้ว · verified headless C2-2 screenshot, 0 error
- **v5.77.0:** `CH1_EARLY_WAVE_PLAN` กำหนดภารกิจเวฟ 1/3/4 ของด่าน 1–3 ไม่สุ่ม, เวฟ 2 คงมินิบอส · แบนเนอร์มี Mission 1/3–3/3 + คำสั่งตรง · ด่าน 1 Hunt เหลือ 2 เป้า · Recipe/Rift ไม่ใช้แผนนี้ · รายละเอียด `docs/CHAPTER1_EARLY_MISSIONS.md`
- **v5.76.0:** Mint ปลดถาวรเมื่อผ่าน Stage 1 และ Cocoa เมื่อผ่าน Stage 5 โดยไม่ใช้ Sugar · เซฟเก่าที่เคยผ่านได้สิทธิ์ย้อนหลังและตัวที่เคยซื้อยังอยู่ · การ์ด Heroes แสดงสไตล์/คำอธิบาย/วิธีปลดและปุ่มข้อมูล · Taro/Sesame หยุดการซื้อใหม่จนพัฒนาเสร็จ; milestone Ch2/Ch3 และนโยบายตัวละครใหม่แบบ league อยู่ใน `docs/CHARACTER_UNLOCK_PLAN.md` (ยังไม่สร้างระบบจ่ายเงินจริง)
- **v5.75.0:** helper `hasTargetBadge`/`hasClaimableTarget`/`hasGroupBadge` ใช้เงื่อนไขเดียวกันจาก Hub ไปหน้ากลุ่มและไทล์ · Daily (รับประจำวัน/ภารกิจ), Achievement, Reward Inbox, Gear ใหม่, Rank Points, พลั่วฟรี, Updates · หน้าปลายทาง Daily/Achievement/Rank มีจุดแดง และกรอบเหลืองที่กลุ่มชี้รางวัลที่รับได้ · `hubNextStep` ให้รางวัลค้างมาก่อนคำแนะนำอัปเกรด
- **v5.74.0:** กล่องมินิบอสที่เป็น Mimic มีวงแดงเต้น + ป้าย ⚠️ MIMIC? ก่อนเก็บ และแบนเนอร์เตือน · หลังเผยตัวศัตรูหยุดชั่วคราว 0.9 วินาทีให้หลบ · cue ถูกล้างเมื่อเก็บ/ล้างฉาก/ใช้ pool ซ้ำ
- **v5.73.0:** ภารกิจรายวันหมุนเวียนผ่านด่าน/ฆ่าศัตรู 60 ตัว/ขุดเปิด 5 ช่อง · ด่านที่สุ่มไม่เกินที่ปลดแล้ว; ผู้เล่นก่อน Stage 4 ใช้ Normal · เก็บ spec ของวันในเซฟไม่เปลี่ยนกลางวัน · ความคืบหน้าฆ่าศัตรูข้ามรันและการขุดรับโบนัสอัตโนมัติ · migration ของ daily เดิมที่รับแล้วไม่แจกซ้ำ
- **v5.72.0:** จบบทสอนครั้งแรกได้พลั่ว 10 อัน (แทนพลั่วเริ่มต้น 5) พร้อม Sugar เดิม · รับฟรีวันละครั้ง 10 อัน (`DIG_FREE_PER_DAY=1`, `DIG_FREE_SHOVELS=10`) · เซฟที่รับฟรีไปแล้วในวันอัปเดตถือว่าใช้สิทธิ์วันนี้ และเซฟที่รับรางวัลบทสอนแล้วไม่แจกย้อนหลัง/ซ้ำ
- **v5.71.0 (เจ้าของ 3 ข้อ):** (1) ขุดฟรี `DIG_FREE_PER_DAY=8` ครั้ง/วัน ครั้งละ `DIG_FREE_SHOVELS=5` (`Save.digFreeLeft`, `dig.freeN`) · (2) `newbieGuard()` ด่าน 1 Normal (ไม่ใช่ rush/rift) รับดาเมจ ×0.6 ผ่าน cocoaGuard (ใช้ทั้ง touchEnemy/hurtPlayer) · spawnWaveEnemy ด่าน 1 ตัวไม่ใช่ basic 55% เปลี่ยนเป็น basic · (3) waveObjTxt 15px + 🎯 นำหน้า · banner เริ่มเวฟ 'MISSION: desc' 3.8 วิ แล้วตัวหนังสือภารกิจเด้ง · เด้งเตือนทุก 12 วิ · verified headless ขุด 8×5=40, guard 0.6, HUD โชว์ภารกิจ, 0 error
- **v5.70.2 (เจ้าของ: เพลงสู้บอส/มินิติด ๆ หาย ๆ เวลาบอสออกท่า):** ต้นเหตุ `Sfx.duckBgm` ลดเสียงเพลงทุกครั้งที่เล่น hurt/bigKill/bossWarn/ult · แก้: ระหว่าง `_bgmIntense` (เพลงบอส/มินิ) duck ที่สั้นกว่า 1 วิ = ข้าม · duck สั้นที่อื่นลดแค่ ≥×0.75 · duck ยาว (beatLoop/chestSpin/bossClear/victory/dead) คงเดิม · verified headless เพลงบอสระดับคงที่ 0.34 ตอนโดนตีรัว, 0 error
- **v5.70.1 (บั๊กเจ้าของ: account ใหม่ tutorial ขั้น Dash ไม่ผ่าน):** ต้นเหตุ v5.69 แทรกโค้ดตัดคอมโบใน doDash แล้ว `this._coachDash++` ไปอยู่หลัง `//` comment → ไม่เคยนับ · ย้ายออกมานอก comment · verified headless momo/cocoa dash นับ +1, 0 error
- **v5.70.0 (เจ้าของ: Dash สะสมพุ่งได้หลายรอบ · การ์ด punch +1 ไม่เห็นผล):** doDash (cocoa) ใช้ชาร์จ `_dpCh` แทน dashReady (กันกดซ้อนตอน dashTime>0.06) · `cocoaDashMax()`=2+lv.dashp+_pm.dashc · `cocoaDashRecharge()`=1.3×dashCdMul×cocoaDashCdMul ชาร์จคืนทีละอันใน tickCocoaDash (ตั้ง dashReady ตามชาร์จ) · จุดทอง+วงชาร์จรอบปุ่ม dash · reset ใน resetRelics · การ์ด dashp → Dash Stack (+1 ชาร์จ + บัฟเดิม) · Blitz +1 ชาร์จ · Brawler base count→`wave:1` (ท่าปิด beat 4 ปล่อยคลื่นกระแทก r=reach×1.5 ×0.8) · p_jab → `p_shock` Shock Knuckles +1 คลื่น (COUNT_IDS) · pathMods มี wave · verified headless dash 2 ครั้งติด ครั้ง 3 ไม่ได้ ชาร์จคืน 2, 0 error
- **v5.69.0 (เจ้าของ: กด dash ระหว่างคอมโบแล้วกระตุก · แย็บเยอะไป อยากเป็นจังหวะ 1-2-3-4-5 หมุนท่า):** castCocoaRush: `SETS` 4 ชุด × 5 ท่า (jab/cross/hookL/hookR/body/overhand/upper/slam) · beat=step%5 ท่าละ 1 หมัด · ชุดหมุนทุก 5 ครั้ง · RHYTHM [0.72,0.72,0.78,0.78,1.15] · ลบ BODY RUSH/ONE-TWO แบบรัว · lean = เจลลี่อย่างเดียว (ไม่ tween ตำแหน่ง) · ท่าปิด (beat 4) ต่อหมัดสั้น = _pm.count+rush+aw · `cc.gen` token: `live()` เช็ค gen · doDash (cocoa) gen++ step=0 killTweensOf(player) skillCd.meteor≥0.3 · verified headless 11 จังหวะ, dash ตัดคอมโบ พุ่ง 167px, 0 error
- **v5.68.0 (เจ้าของ: คอมโบพุ่งหาบอสจนแนบหน้า · อัลติไปตีมอนไม่โดนบอส):** castCocoaRush step 0 LUNGE ไม่ tween เข้าหาเป้าแล้ว (lean + ต่อยจากที่ยืน) · cocoaBeatBurst: ถ้ามีบอส/มินิใน 900 → ทุกจุดเล็งบอส (`B._bossT`) · จบ burst ถ้าเป้าบอส → กระโดดถอยจากบอส 150px + iframe 1.2s · verified headless มินิห่าง 500 โดน, จบห่าง 141, 0 error
- **v5.67.0 (เจ้าของ: ผูกอาร์ตจาก AI อีกตัว):** 3 batch (dig 18, icons 26, menu_buttons 25) แปลง PNG → webp q85 ที่ `assets/art/<batch>/` (ต้นฉบับยังอยู่ incoming) + ASSET_IMAGES · dig ใช้ hook เดิม (dig_bg/tile/crack/shovel/item/chest_open) · perk_* ใน Rank Perks card (+Ancient เดิม) · relic_*: การ์ด relic (`iconKey`), แถว Relic ใน drawHeldBar, Codex (`_codexRows` รองรับ `r.icon`) · hub_btn_*: `uiMenuCard(...,iconKey)` · tile_<target>: `_buildHubTiles` + แถวกลุ่ม + `_smallBtnIcon(t,key)` ปุ่ม Depths/Kitchen/Rank Perks ในหน้า Weave · art_orders README 05/06/09C-D = 🟩 · verified screenshot hub/gLoadout/upgrade/perks/dig 0 error 0 404
- **v5.66.0 (เจ้าของ: ตัวไม่วาร์ปตามการโจมตี ดูตลก · ชาร์จเต็มแรงไป):** cocoaBeatBurst: หมัดแรกของแต่ละจุด (`it.first`) เลือกเป้า `c._te` (สุ่มใน 4 ตัวใกล้สุด ≤620) แล้ววาร์ปผู้เล่นไปห่างเป้า 42px + เส้นพุ่งสีหมัด + เงาส้ม + body.reset · หมัดที่เหลือต่อยเป้าเดิม · gap 55→70ms · PER ครึ่งหนึ่ง (jab3/hook2/heavy2×1.6/upper2) · unit ×1.5→×1.15 · finale ×2.5→×1.8 · verified headless 8 จุด ตัวย้ายตามเป้า, 0 error
- **v5.65.0 (เจ้าของ: Dash กลับเป็นแบบเดิม ไม่ต้องมี combo · ชาร์จเปลี่ยนเป็นบัฟ):** doDash ไม่เรียก cocoaDashPunch แล้ว (เหลือเป็น dead code) · `cocoaDashBuff()` ทุก dash → `_dashBuffT` 2.5s (+1s ต่อ _pm.dashc) · `cocoaDashBuffMul()` = 1+0.1+0.15·lv.dashp+_pm.dashm คูณ unit ใน castCocoaRush · `cocoaDashCdMul()` counter ×0.6, evo ×0.7, Dash Boxer ×0.75 คูณ dashCdMax · counter: cocoaGuard ×0.7 ระหว่างบัฟ · `tickCocoaDash` นับเวลา+ประกายส้ม · ลบจุดชาร์จรอบปุ่ม · การ์ด dashp → Dash Rush, Blitz/Phantom/Counter/EVO desc ใหม่, ลบ dashp/p_blitz ออกจาก COUNT_IDS · verified headless dash → ×1.4 (lv2) หมดหลัง 2.5s, 0 error
- **v5.64.0 (เจ้าของ: ลูกศรใหญ่ขึ้น · dash พุ่งเข้าบอสหนีไม่ได้ตอนโดนดูด · คอมโบลื่นกว่านี้):** ลูกศร Beat Rush min(150,W·0.36)px, แถวลูกศร 30px · cocoaDashPunch: เดินอยู่ = หาเป้าเฉพาะในกรวย ±0.8 rad ตามทิศจอย ≤380 ไม่มี = return false → dash หนีปกติ (ไม่เสียชาร์จ) · ยืนนิ่ง = ตัวใกล้สุด · ต่อยบอส/มินิแล้วถอยหลัง 110px + iframe 0.45 · castCocoaRush RHYTHM [0.72,0.6,0.78,0.7,0.85,1.0] · windup hook 80/one-two 110/upper 100/slam 220 · ว่าง >1.6s เริ่มใหม่ที่ LUNGE (`cc.last`) · verified headless หันหนี = dash ปกติชาร์จคงเดิม, หันเข้า = ต่อยใช้ชาร์จ, 0 error
- **v5.63.0 (เจ้าของ: ถอด recipe on dash แล้วอาการ shockwave หาย · อยากให้ Dash เป็น stack · เอฟเฟกต์ใหญ่ไป · ออกแบบการ์ดใหม่):** Dash Punch = ชาร์จสะสม `_dpCh` (reset ใน resetRelics) max `cocoaDashMax()`=1+lv.dashp+_pm.dashc · ชาร์จคืนทีละอัน `cocoaDashRecharge()` 1.3s×dashCdMul (counter ×0.6, evo ×0.5) ใน `tickCocoaDash` · กด 1 ครั้ง = ต่อย 1 เป้า (≤380) ไม่ chain · `_dpBusy` กันกดซ้อนระหว่างพุ่ง · ไม่มีมอน = dash ปกติ · ปุ่ม dash วาดจุดชาร์จสีทอง + วงชาร์จคืน · dash punch ไม่เรียก fireRecipes('dash') แล้ว · **การ์ดโกโก้:** power/rate/size · combo→Knockout Force · dashp→Dash Charge · ใหม่ `drum` Drum Heart (cocoaBeatCharge ×1+0.15/rank) · mutation +`counter` Counter Bear (ชาร์จเร็ว 40%, รัศมี 120) · path guardian → `dashboxer` Dash Boxer (base dmg0.9 dashc1 dashm0.5 · p_blitz +1 charge · p_phantom +20%) · pathMods มี dashc/dashm · EVO desc meteor ใหม่ · fx_flickerstrike เล็กลง (dash R/150, burst r/256) + finale shockwave เล็กลง · verified headless max 4 ชาร์จ ลด/คืนถูก, 0 error
- **v5.62.0 (เจ้าของ: วงไม่ต้องติดมอน ขึ้นบนจอแทน · กดค้างนาน = จุดเยอะ = คอมโบ/ลูกศรเยอะ):** `beatHoldNodes()` 0 ถ้ากด <0.35s (quick) ไม่งั้น 3+floor((h−0.35)/0.3) เพดาน `BEAT_NODE_MAX`=12 · `tickBeatCharge` วงชาร์จ+ป้าย 🥁×N เหนือปุ่ม (เริ่มตอนปล่อยนิ้ว ไม่ auto-start แล้ว, ลบ ignoreId/_holdPid) · startBeatRush(full,nodes): `B.nodes` จุดสุ่มพิกัดจอ 12-88%×27-74% ไม่ทับกัน · เวลา 3+0.3N วิ · ลากได้ครบทุกจุด (วงรับ 36px) · ลูกศร = clamp(ceil(0.6·chain)+1,2,8) (quick 2) · cocoaBeatBurst: หมัดแต่ละจุดเลือกมอนใกล้ตัว ≤620 วน 6 ตัวแรก ไม่มีมอน = รอบตัว · verified headless 9 จุด→ลาก 9→7 ลูกศร→burst, quick=2, 0 error
- **v5.61.0 (เจ้าของ: วงใหญ่เกิน/มอนไม่อยู่จอเดียวลากไม่ถึง · เดินเฉย ๆ ก็ต่อย):** startBeatRush full: เลือกมอนในจอใกล้สุด ≤9 → tween ธรรมดาเข้าวงรอบตัว r=0.3·min(view) (สลับ 0.55/0.9) 260ms Back.out (บอส/มินิอยู่ที่เดิม) · วงสีบนจอ r16 คงที่ (บอสวงทอง +6) · วงรับนิ้ว 40px จอ (`hr=40/z`) · castCocoaRush: ไม่มีศัตรูใน reach+220 = ไม่ต่อย ทั้งเดินและยืน (cd×0.5) · verified headless 8 ตัวอยู่กลางจอ screenshot, เดินไม่มีมอน 0 หมัด, 0 error
- **v5.60.0 (เจ้าของ: ยืนนิ่งไม่ตี, ท่าแรกต้องพุ่ง, ท่าไม่ซ้ำ จังหวะต่างกันแบบมวย, เอา HITS ออก):** castCocoaRush เขียนใหม่ 6 ท่า `_cc.step%6`: LUNGE (tween พุ่ง ≤120px ต่อยตรง ×1.0) → ONE-TWO (0/150ms ×0.55/0.8) → HOOK (ง้าง 130ms arc ×0.95 ผลัก) → BODY RUSH (5+ หมัด 48ms ×0.32) → UPPERCUT (ย่อ 160ms ×1.6·fin แช่) → BEAR SLAM (กระโดด 300ms r×1.5 ×1.4·fin) · จังหวะ: `_ccCdMul` RHYTHM [0.9,0.7,1.05,0.8,1.2,1.6] คูณ skillCd ของ meteor ใน update · เดิน (joy.active) = ทิศเดิน · ยืน = หาศัตรูใกล้สุด (ไม่มีศัตรู = ไม่ต่อย, เช็คใหม่ cd×0.5) · สาเหตุบั๊กเดิม: moveDir เริ่ม (0,-1) และไม่ถูกรีเซ็ต → ยืนแล้วต่อยขึ้นฟ้า · ซ่อนตัวนับ HITS (`_ccTxt` hidden, โบนัสยังนับ) + ลบข้อความ DASH xN · Dash Punch หาเป้า 380/chain 340, tween 90+0.3·dist ms (≤200) ease in + afterimage trail 5 ภาพ, ตอนโดนใช้ fx_flickerstrike แทนวงคลื่น · verified headless ยืนนิ่งโดน 17 hits ท่าวนครบ 0 error
- **v5.59.0 (เจ้าของสั่ง 3 ข้อ):** (1) castCocoaRush ใช้ moveDir เสมอ (ยืน = ทิศล่าสุด) · (2) doDash ของ cocoa → `cocoaDashPunch()`: มอนใกล้ ≤280 → tween พุ่ง 110ms ต่อย r85 unit=(12+3.5lvl)·dm·1.9 ผลัก · ต่อไปตัวถัดไปที่ยังไม่โดน ≤260 · ครั้ง = 1+b.lv.dashp · การ์ดใหม่ `dashp` Bear Dash Chain max3 (COUNT_IDS) → สูงสุด 4 ครั้ง · ไม่มีมอน = dash ปกติ · (3) `cocoaGrandFinale` หลังหมัดรัว: hitStop+แฟลชขาว, วิญญาณหมียักษ์ (ภาพตัวละคร ADD ขยาย ×7), วงกระแทก 5 สี+ประกาย, ระเบิด r280 ×2.5, ข้อความ K.O. RUSH!!/BEAR FEVER!! + ดาเมจรวม (`_beatDmg`) · ท่าพิเศษเลื่อนไปหลัง finale 900ms · verified headless dash 4 ครั้ง, finale screenshot, 0 error
- **v5.58.0 (เจ้าของเลือก ปัด+ลากเส้น, สุ่มสี):** รื้อมินิเกมปุ่มหมัด/BEAT ทิ้ง · กดค้าง (full): เกมหยุด มอนในจอ (`B.col` Map) ได้สีหมัดสุ่ม · ลากนิ้วเส้นเดียวผ่านมอน ≤6 (`beatDown/beatMove/beatUp`, pointermove/up ใหม่, นิ้วที่กดค้างปุ่ม = `ignoreId`) · เวลา 4 วิ · `beatSpecials`: สีเดียวกันติดกัน ≥3 (Lv4 ≥2) = gun/cyclone/titan/juggle · ครบ 4 สี = rainbow · วงทองรอบบอส/มินิ · วาดวง/เส้นในพิกัดจอ (`beatScreen/beatWorld` จาก worldView+zoom) · ปล่อยนิ้ว → `beatToSwipe`: ลูกศร 3 (quick 2) ปัดที่ไหนก็ได้ >45px · ≤0.5s PERFECT / ≤1.2s GOOD / ผิดทิศหรือหมดเวลา MISS · แตะสั้น (quick) = ข้ามลากไปปัดเลย · `cocoaBeatBurst` ใหม่: ต่อยตามเส้นทีละตัว jab 6×0.7 (gun ×2) · hook 4×0.9 r120 ผลัก · heavy 3×1.8 · upper 4×1.0 แช่ · ไม่มีเป้า = 8-10 หมัดรอบตัว · unit×ค่าเฉลี่ยเกรด (2/1.3/1) · บอสในเส้น ×1.3 · ALL PERFECT (full) = FEVER · verified headless ลาก 6 ตัว → rainbow → ปัด 3 → burst โดน 20 ตัว, quick OK, 0 error
- **v5.57.0 (เจ้าของ: ยากไป concept ดี):** (จ) มินิเกมหยุดเกมทั้งหมด physics.pause+time.paused, update return หลัง tickBeat, togglePause ถูกบล็อกระหว่าง beat, restoreBeatSpeed resume · (ข) 2 เฟส `B.phase` input (ไม่จับเวลา) → beat (แถบ 4 บีต เป้า 85%, loop เริ่มตอนเข้าเฟส beat, cue บีต 3) · (ก) `drawBeatGlow` วงเรืองเต้นรอบปุ่มถัดไป / BEAT! · (ค) กดผิด = ปุ่มสั่น +B.wrong ไม่เลื่อน idx, wrong>0 ตัด PERFECT→GREAT, special ไม่ต้องแถวสะอาด (แค่ไม่ MISS) · (ง) window 100/180/300ms · MISS เมื่อเลย D+0.3s · (ฉ) quick [3] · full [4,5] Lv1 / [4,5,6] Lv2+ · jab gun ≥3 · (ช) 50% แถวสุ่มแบบใส่ท่าพิเศษการันตี · hits=6+total×1.6+jab×0.6 · overlay depth 200000 (บังแบนเนอร์) · verified headless ผิด 1 ครั้ง/รอบ → ครบ 3 รอบ GREAT + cyclone, resume ถูก, 0 error
- **v5.56.0 (เจ้าของ: ทำ sound effect):** gen_sfx_jsfxr +`wavLoop` (ไม่ตัดเงียบ/ไม่ fade) + 10 เสียง `sfx_beat_{loop,hold,rush,gun,cyclone,titan,juggle,rainbow,fever,cue}` · loop = กรูฟกลอง+เบส 120BPM 16 บีต 8.00s (wav 700KB ไม่แปลง mp3 เพราะ mp3 มีช่องว่างตอนวน) · `Sfx.beatLoop(rate)/stopBeatLoop/beatFx(k)` · beatNextRound ล็อกเป้า ✦ บนบีต: spb 0.5 (Lv3 0.6 + loop rate 0.833) · m=ceil(เวลาเดิม×0.85/spb) · D=m·spb/0.85 · tick ทุก spb, บีต m−1 = cue · loop เริ่มใหม่ทุกรอบ หยุดใน finishBeat/cancelBeat · hold ดังตอนเริ่มกดค้าง · rush/gun ตอน burst, special แต่ละท่ามีเสียงของตัวเอง · verified headless โหลดครบ 0 404, loop เล่น/หยุด, 0 error · **ยังไม่มีใครฟังจริง**
- **v5.55.0 (เจ้าของเลือก 'ตามที่แนะนำ'):** **ต่อยปกติ:** ลบ lunge ใน castCocoaRush (เดินอยู่ = ต่อยตามทิศจอย) · `cocoaGuard()` คูณใน touchEnemy/hurtPlayer (HITS≥10 ×0.8, ≥25 ×0.65, ระหว่างมินิเกม ×0.3) · `cocoaBossLeech` 0.5%/หมัดบอส-มินิ เพดาน 4%/วิ · **Unique flickerStrike → Bear Beat Rush** cd 30 · `cocoaBeatCharge` (ต่อยโดน −0.25s, โดนตี −0.6s ผ่าน charPassiveOnHurt, floor 15s หลังใช้ `_beatUsedAt`) · ปุ่ม unique ของ cocoa: แตะ (pointerup ก่อน 350ms) = quick 1 รอบ [4] · กดค้าง 350ms (`_ubHold` ใน tickBeat) = full [4,6] Lv1 / [4,6,8] Lv2+ · `_beat` state (state ยัง 'play', dt×0.25, physics/tweens/time slow, `tickBeat` ใช้เวลาจริง) · `BEAT_PUNCHES` heavy/jab/hook/upper สี+ปุ่มกากบาท + BEAT! กลาง · แถบจังหวะเป้า 85% ของ D=(1.6+n·0.35)×(Lv3 1.25) · `BEAT_GRADES` ±60/120/200ms ×2/1.5/1/0.3 · กดผิด = หมัดนั้นหาย · `beatSpecials` (jab4/hook3/heavy3/upper3, Lv4 −1, ครบ 4 แบบ=rainbow ×1.5) ต้องแถวสะอาด · hint โชว์ท่าที่จะได้ · `cocoaBeatBurst`: hits=6+total×1.2+jab×0.6 (≤60, gun ×2 ≤90) gap 45ms ไม่ย้ายตัวผู้เล่น iframe ตลอด burst · hook=รัศมี/ผลัก · heavy=ดาเมจ · upper=แช่ · cyclone 3s · juggle แช่ 2s r700 · titan ×4 เป้าบอส/HP สูง · ALL PERFECT = BEAR FEVER ×3 r800 · `cancelBeat` ใน exitStage/die · เสียง jsfxr `sfx_beat_{tick,start,perfect,good,miss}` · verified headless hold→3 รอบ→specials→burst 45 hits, tap→quick, 0 error · **ยังไม่มีใครเล่นจริง — จูน window/D/hits ได้** · ถัดไป (ทีหลัง): ช แตะเปลี่ยนหมัด 1 ตัว · ซ โหมด Auto
- **v5.54.0 (อาร์ตจาก AI อีกตัว commit ace9a80):** พื้น 10 ภาพ PNG 1024 (~2MB/ภาพ) → แปลง webp q82 (~90-240KB) ที่ `assets/art/floors/floor_cNN.webp` (ต้นฉบับยังอยู่ assets/incoming/floors) · `FLOOR_KEYS` stageIdx 5-14 → startStage ใช้ floor แทน bg, tileScale 0.8 (bg6-15 ยังใช้เป็นภาพ story panel/ปกด่าน) · decor C2-1 8 ชิ้นย้ายไป `assets/art/decor_c21/` + ASSET_IMAGES (placeholder ข้ามเอง) · README art_orders อัปเดตสถานะ · verified screenshot C2-1/C3-1 0 error 0 404
- **v5.53.0 (เจ้าของ: โกโก้เสียเปรียบ อยากเป็นคอมโบรัว เสียงสะใจ หลายท่า):** `castCocoaRush` แทน castCocoaCombo (early-return ใน castSkill + branch meteor · validator contract อัปเดต) · 4 ท่าวน `_cc.step`: Jab Rush (4+ หมัด 55ms ×0.42, rush +2, _pm.count) → Hook ซ้ายขวา ×0.78 ผลัก → Uppercut ×1.7·fin แช่ 0.45 → Bear Slam r×1.5 ×1.35·fin (breaker/evo คลื่นซ้ำ, evo ฮีล 2%) · unit=(12+3.5lvl)·dm·1.4 · พุ่งเข้าหาเป้า ≤150px · `_cc.n` HITS +1%/hit เพดาน 40%, ว่าง 1.6s รีเซ็ต · ทุก 25 hits `cocoaFrenzy` · `tickCocoaCombo` ตัวนับเหนือหัว · `showComboMove` · เสียง jsfxr `sfx_punch_jab/heavy/frenzy` + `Sfx.comboPunch(n,kind)` pitch ไล่ตามคอมโบ · `_cc` ล้างใน resetRelics · verified headless 4 ท่า+FRENZY 56 hits 0 error · **ยังไม่มีใครเล่นจริง** · **อาร์ตจาก AI อีกตัว (floors + decor C2-1) มาถึง assets/incoming แล้ว ยังไม่ได้ผูก**
- **v5.52.0 (บั๊กเจ้าของ: pause บางทีกดไม่ขึ้น · ปุ่ม Settings ไม่เท่ากัน):** ต้นเหตุ ปุ่ม mute/pause/speed ห่างกัน 36px แต่วงแตะ 28px ทับกัน + เช็ค mute ก่อน → แตะขวาของ pause ไปโดน mute · แก้: pointerdown เลือกปุ่มที่ใกล้นิ้วสุดใน r26 · ปุ่มห่างขึ้น (W-26/W-70/W-114) · หลอด HP drawBars bw=(W-138)-bx · buildPause ปุ่ม ⚙ Settings ขนาด bw×bh เท่า Resume/Quit วางเหนือ Resume · verified headless แตะ ±14px 5/5 เข้า pause ไม่ mute, screenshot ok, 0 error
- **v5.51.0 (เจ้าของเลือก: สนามปิดเดิม + ทำให้รู้สึกเปิด · เริ่ม C2-1):** global `DECOR_CHUNK=560` + `STAGE_DECOR[stageIdx]={seed,per,clearR,items[{key,emoji|draw,size,w,...}]}` (ตอนนี้มีแค่ 5 = C2-1, 8 ชิ้น key `dec_c21_*`) · `makeDecorTexture` วาด placeholder canvas (emoji/puddle/root) ถ้ายังไม่มีอาร์ต · `buildDecor` (ใน startStage) / `clearDecor` (ใน clearStageProps) / `tickDecor` (update ทุก 0.2s): สร้าง chunk รอบผู้เล่นด้วย seed ต่อ chunk (กลับมาที่เดิมเจอของเดิม) คืน chunk ไกลเข้า pool · depth −99500 ไม่มีการชน · ใบสั่งอาร์ต `docs/ART_ORDER_C2_1_MAP.md` (พื้น seamless 1024 + decor 8 ชิ้น) · verified headless 16 chunk ~135 ชิ้น, ย้ายตำแหน่งแล้ว pool ทำงาน, 0 error · **ถัดไป: ด่าน C2-2..C3-5 เพิ่มแถวใน STAGE_DECOR · จุดสนใจ/วงบีบสนามบอส (เจ้าของยังไม่สั่ง)**
- **v5.50.0 (เจ้าของสั่งทำ 4 ข้อ + ตั้งค่าในด่าน):** `settings.quality` 0 Auto/1 Low/2 High · `QUALITY_SETTING` อ่าน localStorage ก่อนบูต → `RENDER_DPR` Auto cap 2 (low-mem 1.5) · Low 1.25 · High เดิม 3 (มีผลตอนเปิดเกมใหม่) · global `PERF.lvl` 0-2 · `tickPerf` ใน update: FPS<42 ติด 3 วิ → lvl+1, >55 ติด 10 วิ → lvl−1 (Low=2, High=0 ตายตัว) · `fxOk` งบ 6−2·lvl · `applyPerfLive` maxLive = `_baseMaxLive`×(1−0.15·lvl) · enemy loop: มอนธรรมดาไกล >√1.9·view ย้ายไปวง 0.62·view รอบผู้เล่น (ยกเว้น boss/mini/elite/objective/flee/raider) · มอนไกล >√0.5·view คิดทิศทุก 4 เฟรม (`_aiSlot`) · buildPause ปุ่ม ⚙ Settings → `buildPauseSettings` 10 แถว + Back · Settings เมนูมีแถว ⚡ Performance · verified headless 0 error
- **v5.49.0 (เจ้าของ: กระตุกตอนมอนเยอะ/ชิ่ง · พื้นหลัง Ch2 แตก):** global `PERF_LIVE_MUL=0.8` คูณ maxLive ใน setupSpawnRates · `fxOk()` งบ `FX_PER_FRAME=6` ต่อเฟรม (นับตาม game.loop.frame) ใช้ใน chainBolt/zap/vfxHitRing/spawnFxAnim (`o.force` ข้ามงบได้) — ดาเมจไม่กระทบ · popDmg throttle 220ms เมื่อมอน >60 · bg6-10 cover scale เพดาน ×2 (เดิม ×5.2 จาก 768px → แตก; ขอบโลกไกล ๆ อาจเห็นภาพซ้ำ) · verified headless C2-2 maxLive 75, tileScale 2, 0 error · **ยังไม่มีใครเล่นจริง — ถ้ายังกระตุกลด PERF_LIVE_MUL/FX_PER_FRAME ได้**
- **v5.48.0 (เจ้าของ: หน้ารก):** `HUB_GROUPS.gLoadout.sections` (หมวด CHARACTER/POWER/GEAR + สี) → `buildHubGroup` ถ้ามี sections เรียก `_buildHubTiles` = หัวหมวด+เส้น · ไทล์ 2 คอลัมน์ (แนวนอน 4) ไอคอนใหญ่+ชื่อสั้น ไม่มีคำอธิบาย · หมวดที่มีไทล์เดียว = เต็มแถบ · ล็อก/ไกด์ 👉/routing เดิม · กลุ่มอื่นยังใช้แถวเดิม · verified screenshot 390×844 0 error
- **v5.47.0 (เจ้าของ: ขุดแบบ Harvest Moon · อยากให้ Kitchen หลากหลาย):** **Dig:** key `gem` = 🪜 Ladder Down (หาบันไดลงชั้น) · `digBoardN(depth)` 5×5→8×8 (+1 ทุก 3 ชั้น) · `digMakeBoard(depth,realDepth)` ขนาดจาก realDepth (ห้องลับใช้ depth+4 แค่ของ) · ช่องรอบบันได `c.draft` → 🌬️ บนช่องว่างที่ขุดแล้ว · ของใหม่ `ore` 🍬 Sugar (ชั้น 3+) · `gift` 🎁 (ชั้น 5+, ด้าย×3+ชิ้นสูตร+ลุ้นหินแก่น/คัมภีร์+currency ตามชั้น) · ชั้นที่หาร 5 ลงตัว = gift 2 กล่องการันตี · empty ลดตามชั้น · UI 'Floor N (N×N)' · **Kitchen:** WHEN +6 (bossHit👊 icd1.5 ใน damage, multikill 5 ใน 1s ใน killEnemy, surround 8+ ใน r170, moving/fullHp ทุก 3s, bossAppear ขอบขาขึ้นใน tickFR) · DO +6 (meteor ☄️×3, orbit 🍭 4s `_frOrbit`, haste +35% `_frHasteT` ใน spd, sour splash, cleanse ลบกระสุนศัตรู r220, hole ดูด `_frZones.pull`) · TWIST +5 (focus −40%area ×1.8 · slow 1.5s ×1.8 · sweet ฮีล 1%/hit เพดาน 5%/วิ · sour +12% 3s · twin ยิง 2 ครั้ง ×0.65) · `FR_SIGNATURES` 15 คู่ ⭐ ชื่อพิเศษ +25% (`frSignature`, `r.sig`) · ถุงชิ้นส่วนแบ่งหน้า `_kPage` · verified headless ทุกกลไก + screenshot, 0 error · **ยังไม่มีใครเล่นจริง** · พลั่วอาจไม่พอบนกระดานใหญ่ → จูน
- **v5.46.0 (เจ้าของ+ภาพ):** buildCraftBench: ไอเทม/บรรทัด affix/mod เป้าที่เลือก = พื้นทอง+กรอบทอง 3px+glow รอบ+ตัวหนา · ไม่ได้เลือก = พื้นเข้ม กรอบเทา ข้อความเทา ไอคอนไอเทม alpha .4+tint · roll pool: มีเป้าแล้ว mod อื่นเทา (`dim`) · ไม่มีเป้า = สีหมวดจาง .45-.55 · verified screenshot 0 error
- **v5.45.2 (เจ้าของ: ก้อง+แตก):** `renderOnce(...,clean)` ใน gen_stingers_synth = ไม่ผ่าน tanh (ต้นเหตุแตก) normalize 0.8 + wet 0 ข้าม reverb · sfx_slot_{spin,miss,near,jackpot} ทำใหม่แบบแห้ง (send 0, sine/tri) · hit เล่นแค่ slotJackpot (+chestWin หน่วง 450ms เฉพาะ hype≥2) ตัด clear/legend ซ้อน · slotSpin vol 0.35 · verified โหลดครบ 0 error · **ยังไม่มีใครฟังจริง**
- **v5.45.1 (บั๊กที่เจ้าของเจอ):** muteBtn ไม่อยู่ใน hudList → ในเมนูถูกบังแต่ hit-test มุมขวาบน (r28) ยังทำงาน = แตะตรงนั้นหน้าไหนก็ปิด/เปิดเสียง · แก้: muteBtn/muteTxt เข้า hudList + hit-test ต้อง visible และ state≠menu (ในเมนูใช้ Settings) · verified headless แตะในเมนูไม่ mute, 0 error
- **v5.45.0 (เจ้าของสั่ง):** autoRollToTarget โชว์ `Wallet: currency × N` ลดทุก roll (+ป้าย −N ลอย) · แต่ละ roll มี reel สลับชื่อ mod 6 ครั้ง + `Sfx.slotSpin` · near miss (หมวด affixCategory เดียวกับเป้า) = `Sfx.slotNear` + แฟลชส้ม + 'So close!' (หน่วง 900ms) · miss = `Sfx.slotMiss` wah-wah + 'Aww…' · hit = `Sfx.slotJackpot` + ประกาย 14 ดวง + JACKPOT (+hype เดิม) · เสียงใหม่ `sfx_slot_{spin,miss,near,jackpot}` ใน gen_stingers_synth (import `wood` เพิ่ม) · verified headless wallet 40→30, near/miss/jackpot แสดงถูก, 0 error
- **v5.44.0 (เจ้าของเลือกข้อ 1 จากไอเดีย Dokapon):** openPrizeWheel + _playAffixRoulette หมุนเร็วค้างจนกด 🛑 STOP (auto 6 วิ) → ไหลต่อช้าลงไปจบที่ผลที่สุ่มไว้แล้ว (สมดุลเดิม) · wheel: ปุ่มใน `_rollBtns`, ไหล n+n/2+ระยะถึง winIdx, upgrade โชว์กลางช่วงไหล · roulette: กด STOP ครั้งแรก = เริ่มช้าลง, ครั้งสอง = Skip · auto-roll ช้าลง 650→480ms/ครั้ง (เดิม 260→170) · validator contract delays อัปเดต · verified headless ทั้งสองวงล้อจบถูก, 0 error · **ไอเดีย Dokapon ที่เหลือ: การ์ดโชค, ดวลเป่ายิ้งฉุบมิมิค, ผลร้ายตลก, Luck Meter, วงล้อเดิมพัน**
- **v5.43.0 (เจ้าของ: ออก mod ให้ตื่นเต้นแบบกล่องบอส):** `affixHype(mod,rolled)` 0-3 (T≤1 jackpot · T≤3 epic · T≤5 rare · weight≤30 +1) · `_playAffixRoulette` หมุนนานขึ้น+ช้าลงตาม hype, 4 tick สุดท้ายกรอบเรือง+จอสั่น, epic+ มีช่วง '. . .' ก่อนเปิด · reveal: ลำแสง 12 แฉกหมุน, ประกายพุ่ง, flash+shake, sfx chestSpin/chestTick/chestWin (+legend epic, +ult jackpot) · auto-roll hit ก็มี shake+fanfare · verified headless T8 ~3s, T1 ~8.7s, 0 error
- **v5.42.0 (เจ้าของสั่ง):** buildCraftBench roll pool แบ่งหน้า ‹ Page N/M › (`_poolPage`, 6/หน้าแนวตั้ง, รีเซ็ตเมื่อเปลี่ยนไอเทม) · **Tier lock:** แตะช่องในตาราง TIERS = `craftTierLock={uid,id,t}` (แตะซ้ำ = ปลด) · `rollOneAffixLocked` ถ้าสุ่มได้ mod ที่ล็อค → tier สุ่มเฉพาะ best…t · ขณะล็อคทุก roll (รวม auto-roll) เสีย currency +`TIER_LOCK_COST`=2 · verified headless: ล็อค T5 (best T4) ออก 4-5 เท่านั้นใน 2000 ครั้ง, 0 error
- **v5.41.0 (เจ้าของสั่ง):** buildTalents มีปุ่ม ‹ › ข้างชื่อ วนเฉพาะตัวที่มีแล้ว (CHAR_ORDER ∩ Save.data.chars) · กด = ตั้ง Save.data.character (เปลี่ยนตัวที่ใช้เล่นด้วย) · verified headless momo→mint→cocoa, 0 error
- **v5.40.0 (เจ้าของเลือก: เพลงวิหาร/ขุด/ครัว):** `gen_stage_bgm.cjs` ตาราง `MENUS` 3 เพลง → `assets/audio/bgm/menu/bgm_menu_{temple,depths,kitchen}.mp3` (96k ~1.5MB) · temple = E lydian 76BPM ระฆัง+คอรัส · depths = A dorian 92BPM pluck+หยดน้ำ+ลม · kitchen = C mixolydian 118BPM walk bass+groove+ticking · Boot ไม่ preload (`bgm_menu_`) · `menuMusic(s)` ใน buildMenuScreen: upgrade/perks→temple, dig→depths, kitchen→kitchen (โหลดครั้งแรกแล้วเล่น) · หน้าอื่นกลับ bgm_main (`Sfx.playMenuBgm`) · verified headless สลับเพลงถูก 0 404 0 error · **ยังไม่มีใครฟังจริง** — แก้แถวใน MENUS แล้วรัน `node scripts/gen_stage_bgm.cjs OUT bgm_menu_xxx` + encode_mp3 96 ไป assets/audio/bgm/menu
- **v5.35–5.39 (เจ้าของ: perk ไม่เป็น build อยากผสมอิสระ):** ระบบ Flavor Recipe = WHEN(14)▸DO(12)▸TWIST(8) · ดู `docs/FLAVOR_RECIPE_DESIGN.md` · ชิ้นส่วน 🧩 ขุดใน Depths (คัมภีร์หายากลง) · `buildKitchen` (ปุ่ม 🍳 Kitchen ในวิหาร) · เพดาน 🍯10/สูตร · ช่อง 1→5 ปลดด้วย RP · รวม 3 ชิ้น = ★2/★3 · ถอด/สลับ 🍬20 · runtime `fireRecipes` (chain เฉพาะ 🔗 Linked ลึก 2, ≤8 ครั้ง/วิ) · SFX sfx_recipe_fire/merge · Rank Perks 9 ตัว + Ancient เดิมยังใช้ได้ · verified headless 0 error · **ยังไม่มีใครเล่นจริง — ค่า cost/พลังจูนได้ในตาราง FR_***
- **Temple Depths (มินิเกมขุดใต้วิหาร · เจ้าของเลือก):** ดีไซน์เต็มที่ `docs/TEMPLE_DIG_DESIGN.md` (กลไก/อนิเมชัน/เสียง/ใบสั่งอาร์ต key `dig_*`) · แผน commit: 1 doc ✅ · 2 เสียง ✅ · 3 หน้าขุดพื้นฐาน ✅ · 4 อนิเมชัน ✅ · 5 หินแก่น→Overcap ✅ · 6 คัมภีร์→Perk ลับ ✅ · 7 ชั้นลึก/ทางลับ/กับดัก/รอยใบ้ ✅ · 8 พลั่วจากด่าน ✅ · **เหลือ: อาร์ตจริงตาม §6 ของ doc (AI อีกตัว) + จูนตัวเลขจากการเล่นจริง**
- **v5.34.0 (เจ้าของแก้: ผสม Sugar+ด้าย):** `talCost`=Sugar ราคาเดิม (base×(lvl+1)×(1+rank·0.8)) · `talThreadCost`=0 ที่ขั้นแรก (Lv0→1 ผูก tutorial) ไม่งั้น base/5×(lvl+1)×… · `talCanBuy` เช็คทั้งคู่ · Overcap = หิน + ด้าย 90N + Sugar 150N · ข้อความ tutorial กลับเป็น Sugar · verified: Lv1 หัก Sugar อย่างเดียว, Lv2 ไม่มีด้ายซื้อไม่ได้, มีด้ายหักทั้งคู่
- **v5.33.0 (เจ้าของ: เลิกใช้ Sugar อัปวิหาร):** วัสดุใหม่ 🧶 Weave Thread (`Save.threads/addThreads/spendThreads`, `data.threads`) ได้จากขุดเท่านั้น · ช่อง `thread` (น้ำหนัก 45, empty 30) `digThreadAmt` 8–18×(1+depth·0.12) · หีบ threads×4 · ช่อง `sugar` ในเซฟเก่า = ด้าย · `talCost` = base/5 ×(lvl+1)×(1+rank·0.8) หน่วยด้าย · buyTal ใช้ด้าย · Overcap = หินแก่น + ด้าย 90×N · ของขวัญด้าย 40 ครั้งแรก (`threadsGift` ใน Save.dig; tutorial เรียก) · powerAdvice/ไกด์ Hub นับด้าย · พลั่วจบด่าน = diff+1 (2/3/4) · Sugar ยังใช้กับตัวละคร/Bazaar/gacha ตามเดิม · verified 0 error
- **v5.32.0:** onStageClear +พลั่วตาม stageDiff (1/2/3, ไม่ให้ใน tutorial) + banner · มินิบอส 25% +1 พลั่ว · verified Hell clear 5→8
- **v5.31.0:** DIG_ITEMS `trap` 🪤 (6+depth×0.4 → −1 พลั่ว + แฟลชแดง/เมนูสั่น) · `stair` 🕳️ (8%/กระดาน → `d.stairFound` → Descend ลง 2 ชั้น + `d.secret` Hidden Vault กระดานสุ่มด้วย depth+4) · `c.hint` 60% ของของหายาก → ✦ กะพริบบนช่อง · verified headless 0 error
- **v5.30.0:** DIG_ITEMS `scroll` 📜 (digTable 4+depth×0.5 · หีบ 12%) · `SCROLL_PER_PERK=4` · `ANCIENT_PERKS` 6 ตัว · `Save.ancientHas/scrolls/unlockAncient` (`data.scrolls`, `data.ancient`) · หน้า Rank Perks เพิ่มส่วน ANCIENT (กริด 3×2 แตะปลด, ไอคอน `perk_<id>` ถ้ามี) · ผล: echoDash `ancientEchoDash` ใน doDash (3 ครั้ง/2.5s → คลื่น r130 relicDmg×2.2) · treasureSense `ancientTreasure(e)` ใน killEnemy 0.5% ≤3/ด่าน · secondWeave +1 pendingLvl ครั้งแรก/ด่าน (`_swDone`) · ancientGuard ต้น die() (`_agUsed`, ข้ามตอน tutorial) · sugarVein ×1.2 kill sugar · deepRoots applyMeta maxhp×1.08 regen+0.6 · flag reset ใน resetRelics · verified headless ทุกตัว 0 error
- **v5.29.0:** DIG_ITEMS `stone_hp/dmg/def` (🔴🟠🔵, digTable 'stone' 8+depth×0.8 → สีสุ่ม) · `Save.coreStones/addCoreStone/overcap/buyOvercap` (`data.coreStones`, `data.overcap`) · `OVERCAP_MAX=6`, `overcapCost(lvl)`={stones:lvl+1,sugar:150(lvl+1)} · `talTotal` += overcap×2 (ถาวร ไม่รีเซ็ตตอน promote → power/applyMeta ได้เอง) · buildUpgrade การ์ดแก่นมีปุ่ม ⬆ Overcap ข้างราคา + ดาว '+N' · หน้า dig โชว์จำนวนหินแก่น · verified: overcap +2 → talTotal hp 0→4, 0 error
- **v5.28.0:** digCell เล่นอนิเมชันแทน rebuild ทันที: พลั่วเหวี่ยง (`dig_shovel` หรือ ⛏️) → สั่น+`digDust` → `digShatter` เศษ 6 ชิ้น+ควัน → ไอคอนเด้ง · ของหายาก `digRareBurst` (ลำแสง 8 แฉก+แฟลช+ประกาย) · หีบ `digChestOpen` (สั่น→ฝาเปิด→น้ำพุขนม+chestWin) · `digFinish` ของบินเข้าตัวนับแล้ว rebuild · เจอ 💎 กรอบกระดานเรืองม่วง · Descend: กระดานเลื่อนหาย→ใหม่ตกเด้ง (`_digDrop`) · `digBusy()` กันแตะซ้อน + ปลดเองหลัง 3 วิ (กันค้างถ้ากด Back กลางอนิเมชัน) · verified headless 0 error
- **v5.27.0:** global `DIG_ITEMS/digTable/digRollContent/digMakeBoard/digSugarAmt` · `Save.dig()` (`data.dig={shovels,depth,best,board,gemFound,freeDay}` เริ่ม 5 พลั่ว) · `digFreeReady/digClaimFree/addShovels` · menuScreen 'dig' → `buildDig` (กริด 5×5, ปุ่มฟรีรายวัน, Descend) · `drawDigCell` (ใช้ texture `dig_tile_soil/rock/crack/dig_<item>` ถ้ามี ไม่งั้นวาดโค้ด+อีโมจิ) · `digCell/digResolve/digDescend` · หินแข็ง hp2 · ปุ่ม ⛏️ Depths ข้าง Rank Perks ใน buildUpgrade (+จุดแดงเมื่อฟรีพร้อม) · verified headless 0 error
- **v5.26.0:** gen_stingers_synth +6 เสียง `sfx_dig_hit/break/find/rare/trap/descend` (assets/audio/sfx/gen) · `Sfx.digHit/digBreak/digFind/digRare/digTrap/digDescend` (ยังไม่ถูกเรียก) · verified headless โหลด+เล่นได้
- **v5.25.0 (เจ้าของ: เลเวลขึ้นเร็วไป):** xpNext เริ่ม 10→12 · โต ×1.26+4 → ×1.26+6 (EXP สะสมถึง Lv10 +32%, Lv20 +35%) · verified headless 0 error
- **v5.24.0 (เจ้าของ):** ยืนยันการ์ดเลเวลอัพเล่น Sfx.clear + Sfx.card ซ้อนกัน → ตัด Sfx.clear ใน pickCardAt เหลือ Sfx.card · Mint Lance Barrage base dmg 0.62→0.7 cd 0.65→0.75 · Splinter Volley max 2→1 · castIceNeedle เพดาน 4 หอก · verified headless 0 error
- **v5.23.0 (เจ้าของ: ข้อความลอยต่อเนื่องรก ไม่เอา combo):** ปิด showKillStreak ใน killEnemy (ยังนับ killStreak) · popDmg เลขธรรมดา throttle 120ms (`_dmgNumAt`) คริโชว์เสมอ · verified headless 0 error
- **v5.22.0 (เจ้าของสั่ง):** `captureDoneFX` เขียนใหม่: แผ่นทอง+วงเวท+วงแหวน 4 ชั้นขยายทั่วจอ (scale ตาม W/H/viewZoom) · screenFlash 0.85 + shake + hitStop · เสียง chestWin+ult+clear · ข้อความ ✨ PURIFIED! · verified headless 0 error
- **v5.21.0 (เจ้าของ: capture = purify):** target คงที่ 25 วิ (เติม 1/วิในวง, ออกนอก −0.35/วิ) · ลบโบนัส +0.7s ตอนฆ่าในวง (objOnKill) · วงโต r0 110 → 230 ตาม progress (`z.r0`, setRadius + ring setDisplaySize + _captureFill) · rush ถี่ขึ้น 3.6-5.2 วิ (เร็วขึ้นตาม progress) ตัวละ 6+stage+สูงสุด4 ตาม progress · verified headless จบ 25.0 วิ r 229, 0 error
- **v5.20.0 (feedback เจ้าของ 5 ข้อ):** (1) `sfx_hurt` → `sfx_hurt_soft.mp3` (stinger synth sine ร่วง ไม่มี noise · เพิ่ม option `glide` ใน note() ของ gen_bgm_synth) (2) `sfx_levelup` → `sfx_levelup_soft.mp3` + openLevelUp เล่นเสียงครั้งเดียวต่อรอบ (ไม่เล่นซ้ำตอน reroll/relic/เลเวลติดกัน, `_lvlSndAt` 1.5s) (3) Relic น้อยลง: มินิบอส relic เฉพาะ gold หรือ 35% (ไม่งั้น openRollBox) · กล่องลับ 30→10% · การันตีเลเวล 6→8 · Bonus Challenge relic 40% (ที่เหลือ currency) (4) Hunt: เป้าวิ่งหนี (`e._huntFlee` เมื่อใกล้ <380, ใช้ทางเดียวกับ _fleeing) + วาร์ปเดิม · `tickHuntCurse`: ห่างเป้า >460 นาน 2.5 วิ = 💀 Hunter’s Curse HP −1.2%/0.5s (ไม่ต่ำกว่า 1) + ตัวม่วง · `endHuntCurse` ใน clearWaveObjective (5) Capture: `tickCaptureFX` สีวง lerp → ทอง, `_captureFill` วงในโตตาม progress, วงเต้น, ทุก 10% ติ๊ง (chestTick)+วงกระเพื่อม+ข้อความ %, `captureRush` ทุก 5.5-8 วิ ลูกศร ➤➤ เตือน 1.1 วิ แล้ว fast/dasher 4-8 ตัว spd×1.35 พุ่งมาจากทิศนั้น · `captureDoneFX` วงทอง 3 ชั้น+chestWin · verified headless 0 error
- **v5.19.0 (เจ้าของสั่ง):** `gen_stingers_synth.cjs` +3 เสียง → `sfx_chest_spin` (เพลงอาร์เพจโจรัว+กลองรัว 4.2s เล่นตอนวงล้อเริ่ม · `Sfx.chestSpin/stopChestSpin`, duck BGM) · `sfx_chest_tick` (`Sfx.chestTick(k)` ทุกช่อง pitch ไล่ขึ้น, ไม่ throttle) · `sfx_chest_win` (`Sfx.chestWin` ตอน land) · เด้ง: 🎁 กลางกระโดดวน + squash ทุก tick · ไอคอนช่องเด้ง Bounce · รางวัลตก Bounce แล้วลอยขึ้นลง · ขนม 12/22 ชิ้นพุ่งน้ำพุตกเด้งพื้น · verified headless ครบ flow 0 error
- **v5.18.3 (บั๊กจริง):** Boot.preload ข้าม key ที่ขึ้นต้น `bgm_m` (ใส่ตอน v5.8 เพื่อข้ามเพลงมินิ) → `bgm_main` ไม่เคยโหลด → เมนูเล่น synth สำรอง · แก้เป็น regex `/^bgm_[sm]\d/` · verified headless: bgm_main cached+playing, synth off, 0 error
- **v5.18.2 (เจ้าของ: v5.18.1 ยังได้ยินเพลงเดิม):** bgm_main → `assets/audio/bgm/bgm_main_theme.wav` (เพลงเมนูแรกสุด ใช้ตั้งแต่ 0df15e9 ก่อนถูกเปลี่ยนเป็น Main menu.mp3 ใน d001608)
- **v5.18.1 (เจ้าของสั่ง):** ASSET_AUDIO.bgm_main กลับไปชี้ไฟล์ต้นฉบับ `assets/audio/bgm/Main menu.mp3` (เดิม v5.0.1 ใช้ตัวย่อ min/bgm_main.mp3 96k) · build-www คัดลอกได้ (เช็คแล้ว)
- **v5.1–v5.6 (เจ้าของสั่ง: ข้อ 2-4 + ออกแบบเพลงแต่ละด่านใหม่ แยก commit):** `scripts/gen_bgm_synth.cjs` เป็น module แล้ว (export ฟังก์ชัน synth · รัน CLI ได้ + เลือกชื่อเพลง) · **v5.1** `scripts/gen_stingers_synth.cjs` → `sfx_boss_warn.mp3` (กลองศึก+ไซเรน) ใน Sfx.bossWarn (fallback sfx_hazard) · **v5.2** `sfx_boss_clear.mp3` → `Sfx.bossClear()` ใน onBossDown (duck BGM, เพลงด่านกลับมาหลัง 3 วิ ถ้า `!this.boss`) + `sfx_victory.mp3` แฟนแฟร์ 5 วิ (ลบ wav เดิม) · **v5.3** `bgm_endgame`/`bgm_endgame_boss` + global `BGM_MODE` ('endgame' ตั้งใน startRun เมื่อ recipe/pinnacle) → bgmKeyFor · **v5.4-5.6** `scripts/gen_stage_bgm.cjs` ตาราง STAGES 15 ด่าน (key/mode/bpm/prog/drum/bass/arp/lead/pad/fx บรรยากาศ drip/sizzle/wind/chime/buzz/tick/heart) ทำนองจากโมทีฟ seed ต่อด่าน โครง 16 ห้อง ปรับ RMS 0.19 → `assets/audio/bgm/stage/bgm_s01..15.mp3` (96k, รวม ~6.5MB) · bgmKeyFor('stage') ใช้ bgm_sNN ก่อน (เพลงเดิม bgm_stageN/bgm_ch2/ch3 เหลือเป็น fallback) · **ASSET_AUDIO ต้องเขียน path เต็ม** (build-www คัดลอกเฉพาะ path literal) · เพลงบอสยังเดิม · verified headless ทุกด่านเล่นถูกเพลง 0 404 0 error · **ยังไม่มีใครฟังจริง** — แก้เพลงด่านไหน แก้แถวใน STAGES แล้วรัน `node scripts/gen_stage_bgm.cjs OUT bgm_sNN` + encode_mp3 96
- **v5.12–5.18 กล่องมินิบอส (เจ้าของเห็นด้วยทุกข้อ · ข้อเปิดค้างเปลี่ยนเป็นวงล้อจับรางวัล):** flow = ฆ่ามินิ → `miniChestTier()` → `spawnChest(...,'mini')` → `miniChestDrop` → เก็บ → (มิมิค?) → `openPrizeWheel` → (gold) `openMysteryCards` → `grantMiniChestBonus` → `offerRelic` (เต็ม = openRollBox เดิม) · **v5.12** หล่นจากฟ้า 320px + เงา + จอสั่น + ฝุ่น + เสาแสง `c._pillar/_pillarCore` (ล้างใน hidePickupCue) สีตาม `MINI_CHEST_TIERS` bronze ฟ้า/silver ม่วง/gold ทอง · **v5.13** `_miniFight={t0,hits}` (spawnMiniBoss; hits นับใน `_noteHit` เมื่อ mode mini) → gold ≤1 hit & ≤45s · silver ≤4 hits หรือ ≤35s · Hell +1 ขั้น · bonus silver Sugar+cur1, gold Sugar ก้อนใหญ่+cur3 · **v5.14** `openPrizeWheel(tier,done)` 8 ช่อง (`miniPrizePool`: sugar S/M/L, cur×1/×3, heal 40%, bonus level-up, jackpot) ไฟวิ่ง 3 รอบ+ delay 38→~400ms (cubic) จบที่ winIdx สุ่มไว้ก่อน → ของโตกลางจอ · state 'rolling' · **v5.15** อัปเกรดกลางวงล้อ (bronze→silver 25%, silver→gold 15% สุ่มตั้งแต่ต้น โชว์ที่ 55%) done(finalTier) · **v5.16** `openMysteryCards` gold เท่านั้น การ์ดคว่ำ 3 (มี JACKPOT 1) · tap ผ่าน `_rollBtns` (pointerdown เพิ่มเคส state rolling) · **v5.17** `addRunSugar` → `spawnSugarCoins` ลูกกวาดกระจาย เก็บเมื่อเดินใกล้ (หลัง 0.8s) บินเข้าตัวเองหลัง 3.5s · `clearSugarCoins` เครดิตที่เหลือใน onStageClear/die/exitStage · **v5.18** มิมิค 12% (`c._mimic`, ไม่เกิดซ้ำจาก `_noMimicNext`) → `awakenMimic` ใช้ spawnElite แต่งเป็น chest HP×2.6 spd×1.6 · ฆ่า → กล่องขั้น +1 · verified headless ทุกขั้น + screenshot, 0 error · **ยังไม่มีใครเล่นจริง — ค่า threshold tier/น้ำหนักรางวัลจูนได้**
- **v5.11.0 (เจ้าของ: ตัวเขียวยังไม่ครบทุกการ์ด):** `_cardHeadline(o)` คืน {t,c,s} ทุกการ์ด (เดิมรับ desc คืนแค่ตัวเลข → การ์ดไม่มีตัวเลขไม่มีบรรทัดเน้น) · สี: เขียว ตัวเลขบัฟ · แดง +damage taken · ม่วง 🧬 mutation · ทอง ✨ evolution · ฟ้า 🛤 Build Path · ส้ม Infusion (ใช้ท่อนหลัง ·) · ชมพู 🔮 relic / heal · เหลือง ท่อนแรกของ desc (fallback) · ตัด tag label/🔗 synergy ออกก่อน · ท่อนยาว >34 ตัด … · verified screenshot relic 3 ใบ, 0 error
- **v5.10.0 (เจ้าของ: โจมตีปกติ Mint ไม่ควรแช่ทันที):** `mintChill(e,freeze)` แทนการตั้ง frozen ตรง ๆ ใน hitEnemy iceNeedle + frostShatterBurst · โดน 1 ครั้ง = Chill +1 (velocity ×0.7) · ครบ 4 ชั้นภายใน 2.5 วิ (`e._chillAt` timestamp) → แช่ freeze+0.5 วิ + ป้าย ❄ FROZEN แล้วรีเซ็ต · Permafrost (freeze≥0.9) ต้องแค่ 3 ชั้น · บอส/มินิไม่แช่ · passive Frost Skin / minty infusion ยังแช่เหมือนเดิม · verified headless 1-3 ไม่แช่ ครั้งที่ 4 แช่ 1.1s
- **v5.9.0 (เจ้าของสั่ง):** Unique Mint (key `mintSanctuary` คงเดิม) → **Mint Gale** `castWindRush(ul)`: `windRushT`=2.6+0.5ul วิ · ความเร็ว ×(1.45+0.1ul) (คูณใน spd ของ update) · ล้าง moveSlowT ตลอดช่วง · ตอนกดผลักมอนธรรมดา r110+18ul + วงลม/เส้นลม · `tickWindRush` ทิ้งเส้นลม+🍃 ตามหลังทุก 45ms · cd 11→10 · castDiamondDust เหลือเป็น dead code · **การ์ดพิเศษห่างขึ้น:** Build Path Lv5→6 · Infusion Lv10→13 · Mutation mastery 8→10 · Evolution min(14→16) · validator contract อัปเดต · verified headless 0 error
- **v5.8.0 (เจ้าของสั่ง):** `gen_stage_bgm.cjs` เพิ่ม `MINIS` (แปลงจาก STAGES: bpm+22, กลอง four/march, เบส pulse, arp 16th, lead ดุขึ้น, fx+heart, seed idx+100) → `assets/audio/bgm/stage/bgm_m01..15.mp3` (96k ~5.4MB) · `bgmKeyFor('mini',n)` · `Sfx.playMiniBgm` ใน spawnMiniBoss (แทน bgmIntense) · onWaveCleared ถ้าเพลงปัจจุบันขึ้นต้น bgm_m → playStageBgm · ensureStageAudio โหลด mini ด้วย · verified headless ด่าน 1/8/14: s→m→s, 0 404, 0 error
- **v5.7.0 (เจ้าของเลือก ข.):** `playWaveCutscene` ไม่หยุดเกมแล้ว → `showSpeechBubble(text,ms)` บับเบิลขาวเหนือหัวผู้เล่น (container world, ตามตัวทุก 30ms, 2.6-4.2 วิ, `this._speech` ล้างใน exitStage) · ชื่อเวฟยังเป็นแบนเนอร์ใน beginWave · story panel ก่อนบอส/epilogue ยังหยุดเกมตามเดิม

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v5.0.2 — เสียงตีโดน/EXP สร้างด้วยโค้ด)
- **v5.0.2 (เจ้าของสั่งข้อ 1):** `scripts/gen_sfx_jsfxr.cjs` เพิ่ม `sfx_hit` (ป๊อปนุ่ม 0.06s) + `sfx_xp` (ติ๊ง 2 โน้ต 0.17s) → `assets/audio/sfx/gen/` · ASSET_AUDIO sfx_hit/sfx_xp ชี้ไฟล์ใหม่ (ไฟล์เดิม sfx_hit_monster/sfx_pickup_sugar ยังอยู่แต่ไม่ถูกอ้าง) · Sfx.xp ไล่ pitch ตามเดิม · verified headless 14 ไฟล์โหลด+เล่นได้, 0 error · ยังไม่มีใครฟังจริง

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v5.0.1 — ย่อไฟล์เพลง)
- **v5.0.1 (เจ้าของเลือกข้อ 2):** BGM 11 ไฟล์เดิม (~34MB, mp3 256k / wav) → `assets/audio/bgm/min/*.mp3` (~12MB · เพลงยาว 96k stereo · ลูปสั้น stage2-5 80k mono) ผ่าน `scripts/compress_bgm.sh` (ffmpeg จาก pip `imageio-ffmpeg`) · ASSET_AUDIO ชี้ไฟล์ใหม่ (ไฟล์ต้นฉบับยังอยู่ใน repo แต่ build-www ไม่คัดลอกเพราะไม่ถูกอ้าง) · **v5.0.0 (อีกเซสชัน, สาขา pixabay-music-sfx-lz791a) fast-forward เข้าสาขาหลักแล้ว** = เพลง Ch2/Ch3 สร้างด้วยโค้ด · verified headless 11 เพลงโหลดได้ 0 404, 0 error · ⚠️ ลูป mp3 อาจมีช่องว่างเสี้ยววิตอนวน

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v5.0.0 — เพลง Chapter 2/3 สร้างด้วยโค้ด)
- **v5.0.0 (เจ้าของ: ทำเพลงด้วยโค้ดก่อน · Pixabay ถูกบล็อกจาก sandbox):** `scripts/gen_bgm_synth.cjs` synth ล้วน (polyBLEP saw/sqr, bell, pluck, กลอง, Freeverb) เรนเดอร์ 2 รอบตัดรอบ 2 = ลูปเนียน → WAV → `scripts/encode_mp3.py` (pip lameenc, 112kbps) → `assets/audio/bgm/bgm_ch2.mp3`(96BPM D dorian 40s) `bgm_ch2_boss`(140BPM 27s) `bgm_ch3`(84BPM C minor 46s) `bgm_ch3_boss`(150BPM 38s) รวม ~2MB · global `bgmKeyFor(kind,stageNum)`: ด่าน 6-10 → ch2, 11-15 → ch3 (ไฟล์หาย fallback bgm_stage5/boss5) ใช้ใน playStageBgm/playBossBgm/ensureStageAudio · Boot ไม่ preload `bgm_ch*` · verified headless ทุกบทเล่นถูกเพลง, 0 error · **ยังไม่มีใครฟังจริง — ถ้าไม่ชอบ แก้เมโลดี/คอร์ดใน script แล้วรันใหม่ หรือแทนด้วยไฟล์ AI (Suno/ElevenLabs) key เดิม**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.99.0 — เสียงเอฟเฟกต์ใหม่ 12 ตัว (jsfxr))
- **v4.99.0 (เจ้าของ: ให้ออกเน็ตไปโหลดเสียง):** **เน็ตของ sandbox เข้าได้แค่ GitHub + npm/PyPI** (kenney/freesound/opengameart ถูกบล็อก) → ใช้ npm `jsfxr` (Unlicense) สร้างเสียงเอง `scripts/gen_sfx_jsfxr.cjs` (seeded, เขียน WAV 16-bit 44.1k, ต้อง `npm i jsfxr` ใน scratchpad ก่อนรัน) → `assets/audio/sfx/gen/sfx_{crit,kill_big,hurt,heal,magnet,thunder,punch,beam,burn,card,legend,victory,defeat}.wav` (~390KB) · ผูกใน ASSET_AUDIO + Sfx: hurt/heal/victory/dead ลองไฟล์ก่อน · ใหม่ `Sfx.thunder()` (castSkill thunder) `beam()` (castMirrorBeam) `punch()` (castBearDonut) `magnet()` (collectVac) `card()` (closeLevelUp) `legend()` (grantGear tier legend) · sfx_burn โหลดแต่ยังไม่ผูก · verified headless 12 ไฟล์โหลด+เล่นได้, 0 error · **ยังไม่มีใครฟังจริง — เจ้าของต้องฟังบนมือถือ**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.98.0 — เสียงฟีลดีขึ้น + รายการเสียง)
- **v4.98.0 (เจ้าของสั่ง ข้อ 6 เสียง):** **หมายเหตุ: เกมมีไฟล์เสียงจริงอยู่แล้ว** (`ASSET_AUDIO` 11 sfx + bgm main/stage1-5/boss1-5 ใน assets/audio, ~43MB ไฟล์ใหญ่ควรย่อ) · `Sfx.playFile(key,vol,rate)` สุ่ม rate 0.92–1.08 + เล่นผ่าน sound.add (destroy ตอนจบ) + cap เสียงพร้อมกัน 10 รวม/3 ต่อคีย์ (`_live`) · `Sfx.xp()` ไล่ rate +4.5%/ครั้ง ถ้าเก็บห่าง <0.7s (สูงสุด 12 ขั้น) · `Sfx.crit()` (ใน damage เมื่อคริ, ลอง `sfx_crit` ก่อน) · `Sfx.bigKill()` (killEnemy elite/มินิ, ลอง `sfx_kill_big`, duck BGM) · `Sfx.mv/sv` + `setVolumes` · Settings แถว Music Volume/Effects Volume วน 100/75/50/25/0% (`VOL_STEPS`, `applyVolSettings`, เรียกตอน Save.load) · rowH settings เว้นล่าง 52 · **`docs/AUDIO_LIST.md`** รายการเสียง 23 รายการ + เพลง + prompt Suno · verified headless 0 error, screenshot settings ok

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.97.0 — Tag Sets (ไอเดีย G) · A/B/G ครบ)
- **v4.97.0 (เจ้าของสั่ง G):** `TAG_SETS` 4 แท็ก (precision crit+5%/critMul+0.3 · swarm dmg×1.06/×1.10 · guard dmgTaken×0.93/regen+1 · tempo cd×0.95/spd×1.06) โบนัสที่ 2 และ 3 ชิ้น · `TAGS_OF` แมปแท็กของ path/infusion/relic · `tagCounts()` นับจาก b.path+b.infusion+relics · `refreshTagSets()` ใส่ผลแบบครั้งเดียวต่อ tier (`this._tagTier`, ล้างใน resetRelics) + banner + clampPlayerStats · เรียกจาก syncBasicAttack (มี path/infusion) และ gainRelic (delayedCall 0) · การ์ด path/infusion/relic ต่อท้าย desc ด้วย `tagLabel()` · HUD statTxt โชว์แท็กที่ ≥2 (🎯2) · verified headless: Sniper+Crown = crit 5→10%, +Sour = critMul 1.55→1.85, 0 error · **ถัดไป: เจ้าของเล่นจริงจูน B/A/G · ไอเดียที่เหลือ E/F**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.96.0 — Flavor Infusion (ไอเดีย A))
- **v4.96.0 (เจ้าของสั่ง A):** `FLAVOR_INFUSIONS` 4 ธาตุ (direct = ตัวคูณดาเมจตรงของ basic ใน castSkill basicDmg) · เลเวล ≥10 และเลือกสายแล้ว → การ์ด 3 ใบสุ่ม kind 'Flavor Infusion' (ซ่อน reroll/banish) → `b.infusion` (reset ทุกด่าน) · `infusionOnHit` เรียกใน `damage()` ทุกดาเมจของผู้เล่น (กัน recursion ด้วย `_infTick`): 🌶️ spicy เผา 30% ของฮิตใน 2s (`e._burnDps/_burnT`, cap 60%) · 🍋 sour รับดาเมจ +12% 3s (`e._sourT`) · 🍯 sweet ฮีล 0.5% maxHP cd 0.3s · 🌿 minty 30% แช่ 0.35s (ไม่ใช่บอส/มินิ) · `tickInfusion(dt)` ใน update ทุก 0.25s · การ์ด `INFUSION_UP` Deep Flavor (id `inf_deep` max3, +35%/rank ผ่าน `infusionPow`) ต่อท้าย pool · reset flag มอนใน spawnEnemy+killEnemy · verified headless 4 ธาตุ, 0 error · **ถัดไป: G (tag set synergy)**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.95.0 — Build Path ครบ 5 ตัว)
- **v4.95.0 (เจ้าของสั่ง):** `BASIC_PATHS` เพิ่ม mint/cocoa/taro/sesame แบบ data-driven: path มี `base` + upgrades มี `fx` (คีย์ dmg/cd คูณ · count/range/big/frozen/far/low/taken บวก) · `pathMods(b)` รวม → `b._pm` (คำนวณใน syncBasicAttack) · ใช้ที่: basicDmg ใน castSkill (dmg) · `cdOf` (cd) · count = taro strikes/mint lances/cocoa hits/sesame beams · range = mint range/cocoa r/sesame len · `damage()` โบนัสตามเงื่อนไข big(elite/มินิ/บอส)/frozen/far(>300)/low(HP<50%) · taken ปรับ dmgTakenMul แบบ delta (`b._takenApplied`) · id upgrade สาย prefix `p_` (count ids อยู่ใน COUNT_IDS) · Momo ยังใช้ระบบเฉพาะของ v4.94 (ไม่มี base) · สาย: Mint Glacier/Barrage/Pierce · Cocoa Brawler/Titan/Guardian · Taro Storm/Smite/Tempest · Sesame Prism/Lens/Sentinel · verified headless 12 สาย apply+upgrade+cast, 0 error · **ยังไม่จูน — Sesame Focus Lens ดูแรงสุดในเทส**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.94.0 — Build Path (Momo))
- **v4.94.0 (เจ้าของเลือกไอเดีย B · ไม่กลับไปใช้หลายอาวุธ · เห็นด้วย A/B/G ทำ B ก่อน):** `BASIC_PATHS[char]` (ตอนนี้มีแค่ momo) · `rollBasicAttackUpgrades` เลเวล ≥5 + `!b.path` → การ์ด 3 ใบ kind 'Build Path' (ก่อน mutation, ซ่อน reroll/banish) · เลือกแล้วตั้ง `b.path` (reset ทุกด่านผ่าน initBasicAttack) + ปลด 2 upgrade เฉพาะสาย (ต่อท้าย d.upgrades) · **Sniper** เมล็ด ceil(/2) ×1.9 เร็ว×1.35 pierce (headshot 7%/rank ×2.5, deadeye +15%/rank ใส่ elite/มินิ/บอส) · **Shotgun** +2 เม็ด fan 0.16 ยิงพร้อมกัน life 0.42 ×0.6 ใกล้ <170px +40% (pointblank +15%/rank, buckshot +1/rank) · **Ricochet** bounce +2 ×0.8 (carom +1/rank, gather +8% ดาเมจต่อการเด้ง/rank) · ดาเมจผ่าน `pathBulletDmg(b,e)` ใน hitEnemy · verified headless 3 สาย + screenshot, 0 error · **ถัดไป:** เจ้าของเล่นดูว่าสนุกไหม → ขยาย 4 ตัวที่เหลือ → A (Flavor Infusion) → G (tag set) · sniper pierce ไม่จำกัดอาจแรง ต้องจูน

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.93.0 — utility mod เพิ่ม 5 = pool 28)
- **v4.93.0 (เจ้าของสั่ง):** AFFIX_POOL +5 utility (validator ล็อก 28): sugarfind (`p.sugarFindMul` → kill sugar ปัดแบบสุ่ม + rollStageReward คูณกับ rankSugarMul) · boxfind (`p.boxFindMul` → chest drop rate ใน killEnemy) · orbfind (`p.currencyFindMul` → จำนวน currency ข้าง _currencyLuckMul) · uniquecd (prefix gloves/amulet, `p.uniqueCdMul` ใน uniqueCooldown floor 0.6) · wayfarer (spd+pickup×3) · reset 4 field ใน applyMeta · weight 50-95 · verified: 300 kill base 300 → find+50% 435, unique cd ×0.85, 0 error

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.92.0 — ตาราง tier ครบ + T10 ออกได้ทุก iLv)
- **v4.92.0 (เจ้าของสั่ง):** `tierWeights(best)`: สุ่มได้ best…T10 เสมอ · 5 ขั้นแรก (d+1)^1.3 · ต่ำกว่านั้น peak×0.7^(d−4) · `tierChances(best)` · rollTier ใช้ tierWeights · Affix Forge: ตาราง TIERS T0-T10 (3 คอลัมน์) ใต้ roll pool ของ mod เป้า/บรรทัดที่เลือก/ตัวแรก → ช่วงค่า + % ต่อ tier ของไอเทมนี้ · tier ดีกว่า best = 🔒 · tier ปัจจุบันไฮไลต์ทอง · verified: legend iLv100 T0 2.8%…T10 2.5%, rare iLv60 T4-T10, screenshot ไม่ทับ, 0 error

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.91.0 — mod pool 23 + tier T0-T10)
- **v4.91.0 (เจ้าของสั่ง):** AFFIX_POOL +8 (edge flatDmg · precision crit+cd · hppct · regenpct · bulwark hp+def · mend healEffect · sprint spd+dash · forager xp+pickup) = 23 (validator ล็อก 23) + weight ใน AFFIX_WEIGHT · **Tier T0(ดีสุด)-T10:** `expandAffixTiers` แปลง 5 band เดิม → 11 band (T5lo×0.5…T1hi×1.2 geometric, `mod.tiers5` เก็บของเดิม, index = tier ตรง) · `affixBestTierForItem` = round(10−iLv/9) + `BASE_TIER_OFFSET` (legend0/epic1/rare1/common2) · `rollTier` สุ่มในหน้าต่าง best…best+4 ถ่วง (d+1)^1.3 (tier ดีสุด ~5%) · affix ใหม่มี `t11:1` · `Save.migrateAffixTiers11()` ใน load แปลง t เดิมจากค่า v (`affixTierForValue`) · BASE_BEST_TIER/bestAffixTierForItemLevel เหลือเป็น dead code · verified: rare iLv60 T4-T8, legend iLv100 T0-T4, 0 error · หมายเหตุ: mod ค่าเล็ก (crit ฯลฯ) tier ต่ำ ๆ ค่าซ้ำกันได้

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.90.0 — Auto-Roll ทีละครั้ง + weight ของ mod)
- **v4.90.0 (เจ้าของสั่ง):** `autoRollToTarget` เขียนใหม่: overlay หมุนทีละ roll (delay 260→170ms) โชว์ผล/จำนวนรอบ/currency ที่ใช้ + ปุ่ม ⏹ Stop · จบเมื่อได้เป้า/currency หมด/หยุด · **Weight:** `AFFIX_WEIGHT` (default 100 · crit/cd 50, bossdmg 45, def 60, dmg 70, special berserk/focus 18, gambler 24, vampiric 30, nourish 40, utility 110-130) + `pickWeightedMod` ใช้ใน rollAffixes/randomCraftSelected/autoRoll · roll pool โชว์ % ต่อ roll (`affixChancePct`) + ★★/★★★ (`affixRarityTag`, weight ≤60/≤30) · verified headless: dist 5000 ครั้ง def 13% vs hp 24%, auto-roll ได้เป้าใน 13 รอบ, screenshot ok, 0 error

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.89.2 — Candy Shell ใช้ได้จริง+เห็นชัด)
- **v4.89.2 (เจ้าของ: Candy Shell เหมือนไม่ทำงาน):** บั๊ก: `_shield` ถูกเช็คแค่ใน hurtPlayer (กระสุน) · touchEnemy (ชนมอน = ดาเมจหลัก) ไม่เช็ค → แก้ด้วย `consumeShell()` ใช้ทั้ง 2 จุด (ชน = กระเด้งออก) + วงแตก · `drawShellBubble()` ฟองรอบตัวทุกเฟรม (2 ชั้น = วงคู่) เรียกต่อจาก tickCharSignature · verified headless: ชนมอน HP ไม่ลด โล่ 2→1, screenshot เห็นฟอง, 0 error

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.89.1 — โดนตีถี่ขึ้น)
- **v4.89.1 (เจ้าของ: อยากให้ player โดนตีถี่ขึ้น):** global `HURT_IFRAME_MUL=0.6` คูณ iframe หลังโดนตีใน touchEnemy (0.6→0.36s) และ hurtPlayer (default 0.5→0.3s, ค่า ix ที่ส่งมาก็คูณ) · iframe จาก dash/revive/shield ไม่แตะ · verified headless 0 error

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.89.0 — Taro Storm Charge)
- **v4.89.0 (เจ้าของ: Taro เก่งเกินหลัง v4.88.1 → เลือก ข. เก็บ stack):** ยกเลิกล็อกบอส/ฟาดซ้ำ/×1.45 ของ v4.88.1 · ฟ้าผ่าเล็งตัวใกล้สุดตามเดิม · ทุกฮิต (รวม chain) ใส่มอนที่ไม่ใช่บอส/มินิ = ⚡+1 (`this._taroCharge`, reset ใน resetRelics) · ครบ 10 + มีบอส/มินิ → `taroChargeGain` Judgment Bolt ดาเมจ ×6 ของ strike (ไม่มีบอส = เก็บเต็มค้างไว้) · verified headless 0 error · ถ้ายังแรง/อ่อน จูน MAX หรือ ×6

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.88.2 — ปุ่มรีเซ็ต Talent)
- **v4.88.2 (เจ้าของสั่ง):** `buildTalents` ปุ่ม ↺ Reset Talents ใต้รายการ · ราคา 🍬80+40×แต้มที่ใช้ · แตะ 2 ครั้งยืนยัน (`_talResetArm` 2.5s) · คืน TP ทั้งหมด ล้าง `cp.tal` · verified headless: ใช้ 3 แต้ม → +3 TP −🍬200, screenshot ok

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.88.1 — Taro สู้บอสได้)
- **v4.88.1 (เจ้าของ: Taro สู้บอสยากมาก):** ต้นเหตุ castSkill thunder เล็งตัวใกล้สุดแยกกันทีละตัว + chain กระจายออก → บอสโดนแค่ ≤1 strike, ลูกกระจ๊อกดูดไปหมด · แก้: บอส/มินิในระยะถูกย้ายขึ้นเป้าแรก, strike ที่เกินจำนวนมอนฟาดบอสซ้ำ, ดาเมจ strike ใส่บอส/มินิ ×1.45

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.88.0 — Talent + Passive ประจำตัวละคร)
- **v4.88.0 (เจ้าของ: ตัวละครต่างกันแค่สกิล อยากให้เก็บเลเวล+มี passive):** ระบบเลเวลตัวละคร (`Save.cp`, `gainCharExp`, TP) + `CHAR_TALENTS` มีอยู่แล้วแต่**ไม่มีหน้าใช้ TP** → เพิ่ม `buildTalents` (menuScreen 'talents', แถว 🌟 ใน gLoadout): Lv/EXP bar/TP + กล่อง passive + แถว talent กด +1 (1 TP/rank) · `CHAR_PASSIVES` + `charPassiveScale(lvl)`=1+min(0.9,(lvl-1)·0.03) · `this._cpas` ตั้งใน applyMeta · momo Lucky Seeds (คริฮีล 0.6%maxHP·s, cd .35s ใน damage) · mint Frost Skin (โดนตี → แช่ศัตรูรอบตัว r110+, cd 1.2s `charPassiveOnHurt` ใน hurtPlayer+touchEnemy) · cocoa Bear Grit (lowHpGuard+0.15s, lowHpDmg+0.20s) · taro Rift Step (`charPassiveOnDash` คลื่น r95) · sesame Oath Focus (ยืนนิ่ง dmg+18%s) · berry Jam Heart (kill 6% ฮีล 2%) · verified headless: ซื้อ talent หัก TP, passive ทุกตัวทริก, screenshot ok, 0 error

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.87.1 — กันปั๊มเลเวลในภารกิจ)
- **v4.87.1 (เจ้าของ: Hunt ปั๊มเลเวลได้ไม่จำกัด):** `tickWaveObjective` นับ `o._objT` สำหรับ hunt/purge/capture · เกิน limit (hunt 25·target+20s, purge 30·target+20s, capture target·1.6+25s) → `o._overtime` + banner ⏰ · killEnemy: overtime = มอนธรรมดา (ไม่ใช่ elite/mini/boss) ไม่ drop orb · Hunt overtime เป้าเลิก blink

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.87.0 — บอสดุขึ้น (7+1+2))
- **v4.87.0 (เจ้าของเลือก 7+1+2):** `bossThink` เป็น wrapper ของ `_bossThinkCore` · (7) `bossAggro(b)` คูณการลด atkCd บอส ×1.45 / มินิ ×1.3 · HP<30% ×1.2 + `_enraged` (spd×1.12, banner ENRAGED) · (1) ตรวจว่าเพิ่งใช้ท่า (atkCd ก่อน≤0.05 หลัง>0.4) → โอกาส 30%/เฟส2 45%/คลั่ง 60% ตามด้วย `bossFollowUp` 0.5-0.8s: ยิงชุดดักทาง / hazard ดักทาง / chargeTelegraph · (2) `leadAim(x,y,speed)` เล็งตาม velocity ผู้เล่น · reset `_enraged/_comboLock` ในจุด spawn บอส/มินิ · verified headless stage 4: 5 combo ใน ~25s, enrage ติด, 0 error · **ยังไม่จูนบนมือถือ — ถ้ายากไปลด bossAggro**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.86.2 — Juicy Burst แทน Plump Seeds)
- **v4.86.2 (เจ้าของ: ขนาดใหญ่ไม่ช่วยความรู้สึก):** Momo upgrade id `size` (คง id/ไอคอน) → **Juicy Burst** `b.seedPop`=rank · hitEnemy ทางปกติ: เมล็ดแตกกระเซ็น r=46+14·rank ดาเมจ ×(0.25+0.12·rank) ใส่ศัตรูรอบข้าง · เลิกขยาย scale เมล็ด · **รอเจ้าของเลือกแนวทางบอสเก่งขึ้น**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.86.1 — แก้การ์ดดาวล้น + Plump Seeds)
- **v4.86.1 (feedback เจ้าของ+ภาพ):** การ์ด endless (max สูงมาก) วาดดาวล้นการ์ด → ถ้า max>5 โชว์ '★ New'/'★ Stack N' แทน (drawReadableChoiceCard 2 จุด) · Momo `size` (Plump Seeds) เดิม +14%/rank บนเมล็ด scale ~0.13 มองไม่ออก → +35%/rank (hitbox โตตาม setScale) · **ถัดไป A3 Bestiary Ch3**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.86.0 — การ์ด Endgame ในหน้าเลือก Chapter)
- **v4.86.0 (เจ้าของสั่ง):** `buildChapterSelect` เพิ่มการ์ด 📜 Endgame · Recipe Maps ต่อท้าย Chapter 3 (rows นับ +1) · ปลดเมื่อ `Save.endgameUnlocked()` → แตะ = menuScreen 'recipes' · ล็อก = 'Finish Chapter 3' · verified screenshot 390×844, 0 error · **ถัดไป A3 Bestiary Ch3**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.85.0 — Chapter 3 story (A1+A2))
- **v4.85.0 (Phase A · A1+A2):** `STAGE_STORY_BEATS` เติม `null,null` (index 8-9 ใช้ cutscene เดิม) + 5 ชุด × 5 beat สำหรับด่าน 10-14 · story panel ก่อนบอส C3-1..C3-5 (`playStoryPanel('bg11..15',...)` ต่อจาก stage 9 ใน spawn flow) · `STAGE_EPILOGUE` +5 ตอน (index 10-14) ตอนสุดท้าย = ฉากจบเกม (Momo ปลูก crown seed ใหม่ใต้แสงแดด) + ชี้ไป endgame · แก้ epilogue C2-5 ให้ชี้ต่อไป Chapter 3 · verified headless C3-5: beat ก่อนเวฟ → panel บอส → epilogue, 0 error · **ถัดไป A3 Bestiary Ch3**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.84.0 — Recipe Maps R10: balance + validator · Phase R ครบ)
- **v4.84.0 (Phase R · R10):** **บั๊ก:** spawnFinalBoss `_bossScale` ที่ stageDiff=1 = 1.0 ไม่คูณ diffMul → บอส Recipe (และ Rift เดิม) ไม่สเกลตาม tier/mod เลย · แก้: คูณ `riftMul().hp*RECIPE_BOSS_HP(0.7)` เฉพาะ recipeMode (verified T1 4099 → T10 10739 = ×2.62) · `recipeHungerGoal` 150+tier×6 (T16=246) · validator เพิ่ม contract Recipe Maps + กฎเหล็ก (ทุก mod reward>1, riftTierMul reward เพิ่มตาม tier) + ATLAS_NODES 7 + UNIQUE_GEAR 5 · 0 error · **Phase R ปิดแล้ว — ต้องเล่นจริงบนมือถือเพื่อจูน goal/par/boss HP/ดรอป**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.83.0 — Recipe Maps R9: แทนที่ Rift)
- **v4.83.0 (Phase R · R9):** ลบแถว 🌀 Mochi Rift ออกจาก Activities · route 'rift' → `buildRecipes` (buildRift/rollRiftPreview ยังอยู่เป็น dead code; riftMode ยังใช้ภายในเป็นโครงตัวคูณของ recipe) · `migrateRiftToRecipes()` (ครั้งเดียว `Save.data.riftMigrated`) แจก recipe 2 ใบ Tier = riftBest-1 · ปุ่ม ✦ Pinnacle Boss ย้ายมาหน้า Recipe (`startPinnacle()` ใช้ `riftKeys` เดิม 3 ดอก · 4 🧩 = 1 🗝️) · หน้าผล Pinnacle กลับ 'recipes' · Boss Rush ไม่แตะ · verified headless: riftBest 7 → 2 ใบ T6 ไม่ซ้ำ, Pinnacle เข้ารันและหักกุญแจ, screenshot ok, 0 error · **ถัดไป R10 balance pass**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.82.0 — Recipe Maps R8: Unique gear)
- **v4.82.0 (Phase R · R8):** `UNIQUE_GEAR` 5 ชิ้น (push เข้า `GEAR[slot]` ก่อนสร้าง GEAR_ALL · tier 'legend' + `unique:true` + `themes:[3 ธีม]`) · ถูกตัดออกจาก `gearPool` และ pool legend ของ Pinnacle → ได้เฉพาะดรอปบอส Recipe · 🥖 Glass Rolling Pin (weapon dmg×1.8, `_uqGlass`=0.55 คูณ maxhp ตอน `clampPlayerStats` = หลังของทุกชิ้น) · 💍 Ring of Endless Hunger (lifesteal +3, `_uqNoRegen` → regen 0) · 👟 Sugar Rush Boots (spd×1.3 dmg×1.15 dmgTaken×1.2) · 📿 Echo Locket (crit +8%, `_uqCritBurst` 0.45 → คริระเบิด r80 ใน `damage()` กัน recursion `_uqBursting`) · 🛡️ Candy Shell Plate (dmgTaken×0.65 dmg×0.8) · flag reset ใน applyMeta · ดรอปใน `finishRecipeBoss`: `uniqueForTheme(theme)` โอกาส 5%+tier×1%+rare 5%+เร็ว 3% · iLv 70+tier×2 · `Save.data.uniqueFound` · Atlas board โชว์ emoji unique/`?` + toast ชื่อ · verified headless: ดรอปได้, pool ปกติไม่มี unique, glass maxhp 136→75, คริระเบิดโดน 3 ตัว, 0 error · **ถัดไป R9 ย้าย Rift → Recipe + Pinnacle ใช้เศษกุญแจ**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.81.0 — Recipe Maps R7: Atlas passive tree)
- **v4.81.0 (Phase R · R7):** `ATLAS_NODES` 7 โหนด (1 แต้ม/เลเวล) เก็บ `Save.data.atlasTree` · `atlasLv/atlasSpent/atlasFree` · ผล: cartographer +10%/lv tier-up ใน `rollRecipeDrops` · bounty +8%/lv ใบที่ 2 · rarity +4%/lv rare (+8% magic) · appetite hunger ×(1+0.06lv) ใน recipeOnKill · fortune reward ×(1+0.08lv) ใน `riftMul` เฉพาะ recipeMode · eventful lv1 event ที่ 30% / lv2 event ที่ 2 ที่ 70% (`_recipeEventN`, shrine เคลียร์ของเก่าก่อน) · speedster par +10s/lv (`recipePar()`) · UI: แท็บ 🗺 Board / 🌳 Passives ใน `buildAtlas` (`_atlasTab`, `buildAtlasTree`) + Respec ฟรี · verified headless: ซื้อ 3 เลเวล free 5→2, fortune reward 1.6→1.984, par 120, screenshot ไม่ล้น, 0 error · **ถัดไป R8 Unique ที่เปลี่ยน build**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.80.0 — Recipe Maps R6: Atlas board)
- **v4.80.0 (Phase R · R6):** `Save.data.atlas={theme:tier สูงสุดที่เคลียร์}` (`atlasData()`) อัปเดตใน `finishRecipeBoss` + banner 🗺 เมื่อได้แต้ม · `atlasThemePoints(t)`=เคลียร์ 1 + floor(t/4) (สูงสุด 5/ธีม) · `atlasPoints()`/`atlasMaxPoints()` (15 ธีม = 75) · หน้า `buildAtlas` (menuScreen 'atlas', ปุ่ม 🗺 Atlas ในหน้า Recipe แทนปุ่มรับฟรีครึ่งหนึ่ง) กริด 3 คอลัมน์ สี mint/ม่วง T8+/ทอง T16 + แถบ progress + ★ แต้ม · แตะ = toast best tier/fill · verified headless: แต้ม 11→13 หลังเคลียร์ T4, screenshot ครบ 15 ธีม, 0 error · **แต้มยังไม่มีที่ใช้ → R7 passive tree**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.79.0 — Recipe Maps R5: event กลางรัน)
- **v4.79.0 (Phase R · R5):** `triggerRecipeEvent()` 1 ครั้ง/รัน เมื่อ Hunger ≥40% (`_recipeEventDone`, reset ใน startRecipeRun) สุ่ม 4 แบบ: 💰 treasure (spawnCrate×6 + spawnVac) · ⛩️ shrine (`_shrine` วงทอง r90 ห่าง 260, ยืน 2 วิ → dmgMul×1.3 cdMul×0.85 25 วิ, หมดอายุ 22 วิ, `tickRecipeShrine`/`clearRecipeShrine`) · 🧺 merchant (`offerRelic()` ไม่ได้ → currency 2) · ✨ rare elite (spawnElite HP×4 tint ทอง scale×1.25 `e._rareElite` → ฆ่า = Hunger +20 + currency 2; reset flag ใน spawnElite) · verified headless ทั้ง 4 แบบ (crate เพิ่ม, rare +28 hunger, shrine dmg 0.945→1.23), 0 error · **ถัดไป R6 Atlas board**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.78.0 — Recipe Maps R4: คราฟต์ + mod กลไก)
- **v4.78.0 (Phase R · R4):** `RECIPE_MECH_MODS` 4 ตัว (`haste` มอน spd×1.3 ใน spawnEnemy · `volatile` ตาย 35% → spawnHazard r70 · `noheal` collectHeal=0 + regen×0 ใน update · `horde` spawn interval×0.5 batch+2 + hunger ×1.15) reward 1.25-1.45 (มากกว่า mod ตัวเลข) · `RECIPE_MODS`=RIFT_MODS+mech, `recipeModDef(id)` ใช้ใน makeRecipe/recipeMul/riftMul/UI · `recipeHas(id)` · **คราฟต์** `craftRecipe(r,cid)` ใช้ currency Forge 1 ชิ้น: transmute Normal→Magic(1 mod) · regal Magic→Rare(+1) · chaos สุ่ม mod ใหม่ · scour →Normal · แถบ 4 ปุ่มใต้กล่องรายละเอียด (`RECIPE_CRAFT`) · แก้ layout กล่องรายละเอียด (ข้อความบรรทัด best fill เคยโดนปุ่มทับ) · verified headless: คราฟต์ครบ 4 แบบ หัก currency ถูก, run haste+volatile spd เพิ่ม, screenshot ไม่ล้น, 0 error · **ถัดไป R5 event กลางรัน**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.77.0 — Recipe Maps R3: ดรอปจากบอส)
- **v4.77.0 (Phase R · R3):** `finishRecipeBoss` → `rollRecipeDrops(r)`: การันตี 1 ใบ (tier เดิม, โอกาส +1 = 35% + เร็ว 20% + mod×8%, +8% ขึ้นอีก) · ใบที่ 2 ลุ้น 25%+mod×10% · rarity ดีขึ้นตาม tier/mod · คลังเต็ม = หาย (นับ lost) · 🧩 `Save.data.pinnacleFrags` += 1+floor(tier/4)+(เร็ว 1) · ครบ `RECIPE_FRAGS_PER_KEY=4` → 🗝️ riftKeys +1 (ใช้เปิด Pinnacle เดิมไปก่อน R9) · `Save.data.recipeMaxTier` · banner 2 จังหวะ · **แก้บั๊ก:** `grantGear` ตอนหน้า summary (state≠play) ใช้ menu path iLv ต่ำ แม้ใน Rift/endgame → inPlay รวมกรณี state≠menu && endgameDropActive (ไม่ใช่ gacha) → ของจบรัน endgame iLv 61+ จริง (verified T5 ได้ iLv 76) · 0 error · **ถัดไป R4 craft recipe**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.76.0 — Recipe Maps R2: เล่นได้)
- **v4.76.0 (Phase R · R2):** ปุ่ม Run ใน `buildRecipes` = ลบ recipe ออกจากคลัง (ตาย=หาย) → `_recipeRequested` → startRun ตั้ง `recipeMode/_recipe` + ใช้โครง Rift (`riftMode=true`, `_riftTier/_riftMods` → `riftMul`→`diffMul`, stageDiff=1) · `startStage` → `startRecipeRun(st)`: ไม่มีเวฟ/มินิ/objective, +3 level-ups, `startSurvivalWave(1)` spawn เร่ง (interval×0.7, batch+1, maxLive+10) · `tickStage` wave → `tickRecipeHunger(dt)` HUD "🍽 Hunger x/goal · m:ss" · `recipeOnKill` (killEnemy, non-big: ธรรมดา 1 / elite 8) · `recipeHungerGoal()=150+tier×10` · เต็ม หรือ `RECIPE_HUNGER_CAP=180`s → bossWarning→spawnFinalBoss · `RECIPE_PAR=100`s → `_recipeFast` = โบนัส 🍬(60+tier×25)×reward · `finishRecipeBoss()` ใน onBossDown (ก่อน rift block; recipe ไม่ได้ Rift Key) บันทึก `Save.data.recipeBest[theme]`=เวลาเติมเต็มดีที่สุด · verified headless: เติม→บอส→reward, best บันทึก, 0 error · **ค่าจูน (goal/par/cap/spawn) รอ R10 · ถัดไป R3 boss drops**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.75.0 — Recipe Maps R1: คลัง)
- **v4.75.0 (Phase R · R1):** global `RECIPE_BAG_MAX=30` `RECIPE_TIER_MAX=16` `RECIPE_RARITY`(normal0/magic1/rare2 mods) · `makeRecipe(tier,theme,rarity)` → `{uid,theme(stage idx ready),tier,rarity,mods(id จาก RIFT_MODS)}` · `recipeMul(r)` = riftTierMul×mods · `Save.data.recipes[]` (สร้างเองผ่าน `recipeBag()`) · หน้า `buildRecipes` (Activities → 📜 Recipe Maps, gate `endgameUnlocked`) กริด 3 คอลัมน์แบ่งหน้า `_recipePage`, เลือก `_recipeSel` โชว์ ตัวคูณ/mods, ปุ่ม Run (soon) + Discard แตะ 2 ครั้ง · ปุ่มรับ T1 ฟรีไม่จำกัด (`claimFreeRecipe`) · **เจ้าของตัดสินใจ: รันเฉลี่ย ~2 นาทีแบบ Hunger Meter ฆ่าเติม (เคลียร์เร็ว=จบเร็ว)** · verified headless 0 error · **ถัดไป R2**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.74.0 — Endgame: Mochi Rift + Pinnacle Boss)
- **v4.74.0 (เจ้าของสั่ง "ทำ end game"):** **🌀 Mochi Rift** (Activities → `rift`, `buildRift`) ปลดเมื่อ `Save.endgameUnlocked()` · เลือก Tier 1..`Save.data.riftBest` (stepper) · `rollRiftPreview()` สุ่มด่าน ready ใดก็ได้ + mod 2 ตัว (3 ตัวที่ Tier≥5) จาก `RIFT_MODS` 6 แบบ (hp/dmg/reward mul) · Reroll ฟรี · เข้า = `_riftRequested={tier,mods}` → startRun ตั้ง `riftMode/_riftTier/_riftMods` · `riftMul()` = `riftTierMul(t)` (hp +18%/dmg +12%/reward +15% ต่อ tier) × mods → คูณเข้า `diffMul()` (ใช้ stageDiff=1) · ด่านเล่นปกติครบ (ไม่มี epilogue) · ล้มบอส = 🗝️ Rift Key 1 (+1 ที่ T5, +1 ที่ T10) + riftBest=t+1 (onBossDown hook ก่อน endless แล้วไหลเข้ารางวัลปกติ) · ของ endgame: `endgameDropActive` รวม riftMode, `endgameDepth` +tier×3 · **✦ Pinnacle Boss** (ปุ่มในหน้า Rift, ใช้ `PINNACLE_KEY_COST=3` กุญแจ, หักตอนกด) = `_pinnacleRequested` → startRun(14) Hell + ใช้โครง Boss Rush (`bossRush=true`, `_pinnacleRun`, `_rushList=[idx]`) · spawnFinalBoss: HP×2 dmg×1.4 tint ม่วง scale×1.25 ชื่อ "PINNACLE · The Hunger Beneath" · `finishBossRush`→`finishPinnacle(won)`: ชนะ = legend สุ่ม iLv 95-100 + 🍬900 + currency legend 8 + `Save.data.pinnacleKills` · หน้าผล → กลับหน้า Rift · verified headless: Rift T6 ชนะได้ 2 กุญแจ best 7, Pinnacle ชนะได้ Legend iLv100, 0 error · **ยังไม่มี:** อาร์ต Pinnacle เฉพาะ (ใช้ c3_boss5 ย้อมม่วง), ท่าโจมตีเฉพาะ

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.73.0 — Chapter 3 เล่นได้ (อาร์ต placeholder))
- **v4.73.0 (Chapter 3 · Throne of the First Seed — เจ้าของสั่ง: ใช้ SVG/ไอคอนธรรมดาไปก่อน เดี๋ยว AI อีกตัวทำภาพมาใส่):** `STAGES[10..14]` (chapter:2, C3-1..C3-5): Ashen Seedfields 🌾 / Hollow Orchard 🍎 / Glass Greenhouse Ruins 🔮 / The Seed Vault 🗝️ / Throne of the First Seed 👑 · recommendedPower 9800→24500 · bossHp 13500→30000 · bossDmg 105→150 · ใช้ objective ทั่วไป (survive/hunt/purge/capture) + AI บอส/มินิ generic (slam/radial/aimed/charge/spiral/trap/nova) · `CHAPTERS[2]` ready:true stages:[10,14] · chapter gate เปลี่ยนเป็นต้องจบด่านสุดท้ายของบทก่อน (`stageMastery[stages[0]-1]`) · **Placeholder art (วาดด้วย canvas ใน `Boot.buildChapter3Placeholders()`, ไม่ใช่ SVG เพราะ release gate ห้าม SVG):** ศัตรู `c3_e_{basic,fast,shooter,bomber,tank}` (ขนาดเท่า e_* เดิม → hitbox เดิมใช้ได้) · มินิ `c3_mini1-5` + บอส `c3_boss1-5` 140×140 (ใช้ scale/hitbox generic isArt 1.15/1.55) · พื้น `bg11-15` 256 ปูซ้ำ (tileScale 1.12; cover-scaling เฉพาะ i 5-9) · **เปลี่ยนเป็นภาพจริง = ใส่ไฟล์ใน ASSET_IMAGES ด้วย key เดิม → ฟังก์ชันข้ามการวาดเอง** (ถ้าบอสจริงไม่ใช่ 140px ต้องจูน scale/setCircle ใน spawnFinalBoss/spawnMiniBoss) · validator contract bkey ปรับเป็นไม่ผูก prefix · **ผลกระทบ:** `storyComplete()` ตอนนี้ = จบ C3-5 → endgame/ของ iLv61+ ล็อกกลับสำหรับคนที่ยังไม่ Ascend จนจบ Ch3 · **ยังไม่มี:** story beats/epilogue/cutscene บอสเฉพาะ, Bestiary entry ของ Ch3, กิมมิค/objective เฉพาะด่าน, เพลงใหม่ (ใช้เพลงด่าน 5 ซ้ำ) · verified headless ทั้ง 5 ด่าน: มินิ→บอส→rewardChoice ครบ, 0 error

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.72.0 — Endgame ปลดหลังจบเนื้อเรื่อง)
- **v4.72.0 (เจ้าของเลือก ก.):** `Save.canAscend()` = `storyComplete()` (เดิมเช็ก stageMastery 0-4 = จบ Ch1) · `zoneModsUnlocked()` = ascension>0 || storyComplete() · `endgameUnlocked()` เดิม (ascension>0 || canAscend) คนที่ Ascend แล้วไม่ถูกล็อก · ข้อความหน้า Endgame → "Finish the story to unlock the endgame" · Boss Rush ยังเปิดตั้งแต่ล้มบอส 2 ตัว (ของ iLv61+ gate ด้วย storyComplete อยู่แล้ว) · verified headless: จบแค่ Ch1 = ล็อก, จบ Ch2 = ปลด, 0 error

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.71.0 — Item drop rebalance: เนื้อเรื่อง iLv 1-60 / Endgame 61-100)
- **v4.71.0 (เจ้าของเลือก ก. — band 4-5 เป็นของ endgame + ปรับดรอปใหม่):** **บั๊กเดิม:** `itemChapterForStage` = stage+1 → ด่าน 5 (บอสจบ Ch1) ก็ดรอป iLv 81-100 แล้ว, Chapter 2 ทั้งบท clamp อยู่ band 5 · **ใหม่:** `storyItemLevelBase(s)=min(60,1+4s)` · `rollItemLevel(s,d)` = base + (d-1)×3 + rand 0-5 (cap `STORY_ILVL_MAX=60`) → Ch1 ≈1-28 · Ch2 ≈21-48 · Ch3 (ด่าน 10-14) ≈41-60 · `itemChapterForStage` คำนวณจาก iLv · **Endgame:** `rollEndgameItemLevel(d,depth)` = 61 + (d-1)×8 + depth(≤24) + rand 0-5 (cap 100) · `endgameDropActive()` = `storyComplete()` (mastery ด่าน ready สุดท้าย) **และ** อยู่ใน Boss Rush/Endless/Zone Mods · `endgameDepth()` = zoneMods×4 + endlessCycle×2 + rushPos×2 · ของ endgame สุ่ม pool chapter 4/5 (อาวุธ Frost/Void เดิม) · field loot tier +1 boost ใน endgame · แก้ in-play ใช้ `this.stageDiff` (เดิม `this.difficulty` ไม่มีจริง → diff ไม่มีผลกับ iLv) · verified headless ช่วง iLv ทุกด่าน/ความยาก + gate endgame ก่อน/หลังจบเรื่อง, 0 error

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.70.0 — แผนเนื้อเรื่องเหลือ 3 Chapter → Endgame)
- **v4.70.0 (เจ้าของตัดสินใจ: เนื้อเรื่อง 3 Chapter แล้วเข้า Endgame · ตัด Ch4/Ch5 เดิมทิ้ง):** `CHAPTERS` เหลือ 3 รายการ — Ch3 = "Throne of the First Seed" (บทสุดท้าย รวมเนื้อหา Ch5 เดิม: คนปลูกมงกุฎ/ต้นตอวงจรความหิว · ธีม Flavorless Factory/Sugar City ถูกตัด) `ready:false` · **ยังไม่แตะ:** item level band 5 ช่วง (`ITEM_LEVEL_BANDS` iLv1-100 ch1-5) + อาวุธ `chapter:4/5` (Frost/Void) — ถือเป็นของระดับ endgame drop ได้ต่อ รอเจ้าของสั่งถ้าจะ remap เป็น 3 band

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.69.0 — 👑 Boss Rush)
- **v4.69.0 (Boss Rush — เจ้าของเลือกจากรายการไอเดีย endgame · เป้าหมายเจ้าของ: ทำเกมให้เสร็จ ~95% ถึง endgame ก่อน ยังไม่ทำ Play Store/รายได้):** เมนู Activities → `bossrush` (`buildBossRush`) · รายชื่อบอส = ด่านที่ `stageMastery` true (`bossRushList()`) ต้อง ≥2 ถึงปลด · เลือก Normal/Hard/Hell (`_rushDiff`→`stageDiff`, รางวัลคูณ `diffMul().reward` = กฎเหล็ก) · flag `_bossRushRequested`→`this.bossRush` ใน startRun (`_rushList/_rushPos/_rushDown/_rushT0`) · `startStage` ถ้า rush = ข้ามเวฟ → bossWarning → `spawnFinalBoss` (ข้าม story panel ด้วย `_finalStoryShown=true`) · เริ่มรัน +6 level-ups, ล้มแต่ละบอส +2 level-ups +40% HP + 🍬(50+si·25)×dr (`bossRushBossDown`) → `bossRushNext()` (ไม่ reset loadout; ถ้ากำลังเลือกการ์ด ใช้ `_rushNextPending` ใน closeLevelUp) · onBossDown hook ก่อน endless · ครบ = `finishBossRush(true)` โบนัส Sugar+currency · ตาย = `die()` hook → `finishBossRush(false)` (ข้าม revive ad/หน้าตายปกติ) · สถิติ `Save.data.bossRushBest[diff]={n,t}` (บอสมากกว่า หรือเท่ากันแต่เวลาน้อยกว่า) · หน้าผล state `rushDone` (แตะผ่าน `_overBtns`) → กลับหน้า Boss Rush · verified headless 3 บอสติดกันจบ rushDone + บันทึก best, 0 error · **ไอเดีย endgame ที่เหลือ (เจ้าของยังไม่เลือก):** Mochi Rift (map+mod) → Pinnacle Boss · ห้องสุ่มกลางด่าน · Mochi Pet · Ascendancy สายอาชีพ · Weapon Fusion · Curse/Blessing · Home Base · สกิน · Season · Chapter 3

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.68.0 — การ์ดอ่านเร็ว + ปรับปุ่มควบคุม)
- **v4.68.0 (UI/UX รอบ 2 ข้อ 4+5 — ครบทั้ง 6 ข้อแล้ว):** `_cardHeadline(desc)` ดึงตัวเลขหลัก (+8% attack speed / -12% damage taken) จาก desc → แทนบรรทัด role ในการ์ดเลเวลอัพ ตัวเขียวใหญ่ 14-15px (ไม่มีตัวเลข = role เดิม) · Settings เพิ่ม `ctrlSize` (Normal/Large/XL = ×1/1.2/1.4) + `ctrlLeft` (ถนัดซ้าย) · `layoutControls()` วาง dash/unique ตามค่า (เรียกท้าย buildHUD, onResize, ตอนเปลี่ยน setting) · ring/hit-test ใช้ `btn.radius` แทน 40/44 คงที่ · verified screenshot, 0 error

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.67.0 — ไกด์ทำอะไรต่อ + หน้าตายบอกสาเหตุ)
- **v4.67.0 (UI/UX รอบ 2 ข้อ 3+6):** `hubNextStep()` (หลัง tutorial: Weave ซื้อได้→Gear&Power/upgrade · inbox มีของ→gearInbox · activity badge→Activities · ไม่งั้น Play) · `_drawNextGuide` กรอบเหลืองกระพริบ + ป้าย 👉 ในปุ่ม Hub และแถวในหน้า group · **หน้าตาย:** `_noteHit(src,dmg)` สะสม `_dmgBy` (touchEnemy: boss/mini/elite/swarm · hurtPlayer: boss/mini/shot; reset ใน startRun) → `deathReason()` แทนบรรทัด BUILD เดิม · แถบ powerStatus+powerAdvice กดได้ → `window.__pendingMenu` + scene.restart → showMenu เปิดหน้าที่แนะนำ (ไม่ใช่ Endless) · verified headless screenshot + ปุ่มพาไป upgrade, 0 error · **UI/UX ที่ยังค้าง:** (4) การ์ดเลเวลอัพเน้นตัวเลข (5) ปรับปุ่มควบคุม/ถนัดซ้าย

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.66.0 — ปุ่มกดง่าย + feedback)
- **v4.66.0 (UI/UX รอบ 2 ข้อ 1+2):** `handleTap` ตรงกรอบก่อน → ไม่โดนค่อยขยาย tap zone ให้ ≥44px +slop 6 เลือกตัวใกล้สุด (ทุก `_zone` ได้อัตโนมัติ) · `_tapFeedback` กรอบขาววาบ + ripple ที่นิ้ว (depth 140 นอก this.menu ไม่หายตอน rebuild) · `buildMenuScreen` เปลี่ยนหน้า = fade+slide 160ms · verified headless: ปุ่ม 20px กดโดนจากนอกกรอบ 8px, alpha 0→1, 0 error · **UI/UX ที่เสนอค้าง:** (3) ไกด์หลัง tutorial (4) การ์ดเลเวลอัพเน้นตัวเลข (5) ปรับปุ่มควบคุม/ถนัดซ้าย (6) หน้าตายบอกเหตุผล+ทางอัพ

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.65.0 — เติมพื้นที่ว่างแนวตั้ง)
- **v4.65.0 (UI/UX ข้อ 3+4):** Stats แนวตั้งโชว์อาร์ตตัวละคร (`_characterCardArt`) + แถวสูงตามจอ (`rh` clamp 40-58) · Daily เพิ่มกล่องอาร์ตด่าน (`_coverImage` bg) + powerStatus badge + lore · Pause แนวตั้งมีรายการ 🔮 Relic + synergy ที่ทำงาน · Craft ช่องว่างมีปุ่มลิงก์ไป Gear/Bazaar · **ข้อ 4 (ไอคอน slot ทับ step label ใน Affix Forge) ตรวจภาพเต็มแล้วไม่ทับจริง = ภาพย่อหลอก** · verified screenshot แนวตั้ง/แนวนอน, npm run check ผ่าน

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.64.0 — HUD แนวตั้งโล่งขึ้น)
- **v4.64.0 (UI/UX ข้อ 5 HUD):** `drawBars` (เรียกทุกเฟรม): `statTxt` เหลือแค่ 🔮 Relic + 🫧×โล่ (เดิม 8 ค่า ❤♻⚔🛡🎯 — HP อยู่เหนือหัวผู้เล่นแล้ว) · `stageTxt` จางหายหลัง 6 วิของด่าน (`_stageTxtAt` ตั้งใน startStage, alpha คำนวณใน drawBars) · แถบ XP หนาขึ้น (11/7px) · `renderBonusHUD` ย่อเป็น "⭐ ≤2 hits · 0/2 → 🔮" · `buildPause` เพิ่มบรรทัดชื่อด่าน+☠ และบรรทัดสแตตรบเต็ม (panelY 82→94) · **verified screenshot 390×844: HUD บนเหลือ 3 บรรทัด, stageTxt alpha 1→0, 0 error** · **UI/UX ที่ยังค้าง:** (3) ที่ว่างครึ่งล่างหน้า Craft/Stats/Daily/Pause (4) Affix Forge ไอคอน slot ชิดป้ายขั้นตอน

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.63.0 — UI แนวตั้ง: หัวข้อ/ข้อความไม่ซ้อนทับ)
- **v4.63.0 (UI/UX ข้อ 1+2 — สำรวจ screenshot 390×844 ทุกหน้า):** (1) `_screenBg` ย่อฟอนต์ชื่อหน้าอัตโนมัติให้อยู่ระหว่างปุ่ม Back (x≤94) กับตัวนับ Sugar (ต่ำสุด 12px) · helper `_hdrShift()` = portrait?30:0 (header แนวตั้งอยู่ y52 แต่หน้าเหล่านี้วางข้อความย่อยด้วยพิกัดแนวนอน y50-73) ใส่ใน Bestiary/Bazaar/News/RankPerks/Stats · Weave: ปุ่ม Rank Perks แนวตั้งย้ายไปกลางใต้ชื่อยศ (เดิมทับชื่อยศ) + เลื่อนแถบ/การ์ดลง 32px · (2) `drawHeldBar` rowFn: `chipX0=max(chipX0,labelX+label.width+8)` (เดิมไอคอนเริ่ม x คงที่ 58 ทับคำ "Skills"/"Relics") · pause: กรอบ Held สูงตาม `heldBot` จริง · **verified screenshot แนวตั้ง+แนวนอน ทุกหน้าที่แก้ 0 error** · **UI/UX ที่ยังค้าง:** (3) หน้าแนวตั้งมีที่ว่างครึ่งล่าง (Craft ตอนไม่มีของ/Stats/Daily/Pause) (4) Affix Forge ไอคอน slot ชิดป้ายขั้นตอน (5) HUD บนแน่น (เวฟ+ภารกิจ+bonus+stat+relic) · การ์ดเลเวลอัพแนวนอนยังชิดกัน (แอปล็อก portrait แล้ว ความสำคัญต่ำ)
- **Build Android ผ่านแล้ว:** GitHub Actions run #404 (Capacitor 8 / API 36) success · APK ใหม่อยู่ที่ release `latest`

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: Store readiness ข้อ 1-3 — Capacitor 8 / versionCode / release bundle)
- **Store readiness (ไม่ bump GAME_VERSION — แก้แค่ build ไม่แตะเกม):** ผลตรวจ: Google Play บังคับ **target API 36 ตั้งแต่ 31 ส.ค. 2026** แต่เดิมใช้ Capacitor 6 (API 34) → (1) อัป `@capacitor/*` เป็น **^8** (core/cli/android 8.5.2, app 8.1.1, browser 8.0.4 · variables.gradle = min 24 / compile+target 36) · workflow ทั้ง 2 ตัว Node **22**, JDK **21**, SDK `platforms;android-36 build-tools;36.0.0` · (2) `scripts/set-android-version.mjs` ตั้ง versionCode = MAJOR·10000+MINOR·100+PATCH จาก `GAME_VERSION` (4.62.0→46200 · minor/patch ต้อง <100) เรียกในทั้ง 2 workflow หลัง set-android-landscape · (3) `scripts/strip-live-server.mjs` ลบ `server.url` **เฉพาะ release-aab.yml** → AAB ขึ้นสโตร์ฝังเกมในแอป (เล่นออฟไลน์ได้) · **APK ตัวเทส (android.yml) ยังโหลดจาก GitHub Pages / live update เหมือนเดิม** · **แนวจอ = portrait (เจ้าของยืนยัน)** — `set-android-landscape.mjs` ชื่อเก่าแต่ล็อก portrait (Android 16 ไม่สนการล็อกบนแท็บเล็ต → UI ต้องรองรับทั้ง 2 แนวอยู่แล้ว) · **verified: จำลอง cap add/assets/scripts/sync ด้วย Capacitor 8 จริง (ไม่มี Gradle ในเครื่อง) → target 36, versionCode 46200, portrait, deep link คงอยู่, release ไม่มี server + game.js อยู่ใน assets/public, signing inject ได้** · **ยังค้างก่อนขึ้นสโตร์ (เจ้าของพักไว้ก่อน):** ปุ่มลบบัญชีในแอป, store listing อังกฤษ + feature graphic + screenshots, privacy "no ads" ต้องแก้ถ้าใส่ AdMob, closed test 12 คน×14 วัน, keystore secrets, Content rating/Data safety

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.62.0 — Codex อัปเดตตามระบบปัจจุบัน)
- **v4.62.0 (Codex ไม่อัปเดต — จาก feedback เจ้าของ):** **Skill Codex** (`buildSkillArchive`) เดิมโชว์ SKILLDEFS 15 สกิล + PASSIVES ที่เลิกใช้ตั้งแต่ v4.23 (character-first) → แท็บใหม่ `weapons` (default · `buildWeaponCodex` รายตัวละคร: 4 upgrades + 2 mutations + evolution, เปลี่ยนตัวด้วย ‹ › `_codexChar`) · `relics` (`buildRelicCodex` 11 relic + 4 synergy แบ่งหน้า `_codexRelicPage`) · `items` เดิม · tab เก่า attack/passive map → weapons (โค้ดเดิม/`buildSkillArchiveDetail` ยังอยู่แต่ไม่ถูกเรียก) · helper ใหม่ `_codexRows(top,rows,rh)` + `_codexNav(page,pages,prev,next,label)` · `BASIC_EVO_DESC` ย้ายเป็น global (การ์ด evolution ใช้ร่วม) · **Bestiary:** เพิ่ม mini6-9 + boss6-9 (C2-2..C2-5) = 28 ตัว · boss5 ชื่อ → "Rootmother’s Bud" · แบ่งหน้า (`_bestPage`, landscape 9/หน้า, portrait 10/หน้า) · **บั๊ก:** killEnemy `si=Math.min(5,…)` → kill บอส/มินิ C2-2..C2-5 ถูกนับเป็น boss5/mini5 → แก้เป็น `STAGES.length-1` (เซฟเก่าที่นับผิดไปแล้วแยกคืนไม่ได้) · **verified screenshot แนวนอน/แนวตั้ง ไม่ล้นจอ, boss8 นับแยกถูก, 0 error**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.61.0 — เตือนพลังไม่พอ + คำแนะนำ)
- **v4.61.0 (กำแพงความยาก Ch2 — ข้อ 1 ที่เจ้าของเลือก):** helper `powerStatus(idx)` (ratio = Save.power/`STAGES[].recommendedPower`: ≥1.15 💪Strong · ≥0.9 ✅Ready · ≥0.7 ⚠️Tough · else ⛔Underpowered) + `powerAdvice(idx)` (มี Sugar พออัพ Weave → ชี้ 'upgrade' · ไม่งั้นแนะนำ replay ด่านก่อนหน้าบน Hard → 'gear') · `uiStageCard` เปลี่ยนตัวเลขพลัง 8px เป็น badge pill 10px มีสี+สถานะ · `openDifficultyChoice` ถ้า ratio<0.9 → บรรทัดเตือนสี + แถบทิปกดได้ (`_zone` → menuScreen=adv.screen) · ปุ่ม Play Now เลื่อนลง `warnShift` · ไม่บล็อกการเล่น · **แก้เพิ่ม:** การ์ดด่านแนวนอน (h<96) ซับไตเติล `st.en` ซ้อน lore → ซ่อน · **verified headless + screenshot แนวนอน/แนวตั้ง, ทิปพาไปหน้า upgrade, 0 error**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.60.0 — Chapter 2 QA ด้วยบอท + เพดานมอนรวม)
- **v4.60.0 (ผลเทส Chapter 2 ด้วยบอท headless ทั้ง 5 ด่าน):** **บั๊กจริง 1 จุด:** C2-2 มอนล้นถึง 209 ตัว — `Colony Call` ของมินิบอส (spawnEnemy 3-4 ตัว/2.5-3.4s) + `moldSac` แตก 2 ตัว ไม่เช็ค maxLive → สู้นานสะสมไม่จำกัด · **แก้:** เพดานรวมใน `spawnEnemy` = `maxLive+24` (คืน null · ผู้เรียกทั้ง 31 จุด guard แล้ว) · verified: spawn 400 ครั้งหยุดที่ 118 (94+24) · **ที่ตรวจแล้วไม่ใช่บั๊ก:** waveclear ไม่ค้าง (มอนทุกตัวฆ่าได้), มินิบอส C2-2 เปลี่ยนเฟส invuln ~1s แล้วตายปกติ, ทั้ง 5 ด่าน 0 JS error, ไม่มีบอส gate-lock ค้าง · **ข้อจำกัดของบอท:** เครื่องเทส 4-20 FPS + เร่ง 3× → กระสุนทะลุ ฆ่าช้า เลยไม่ได้เล่นถึงบอสใหญ่ครบทุกด่านใน 9 นาที (บอส Ch2 ตรวจแยกแล้วตอน v4.51) · **Balance:** บัญชีใหม่เข้า C2-1 ต้องยิง ~9 เม็ด/ตัว (C2-5 ~20) = กำแพงความยากสำหรับคนไม่มีของ

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.59.0 — มอนที่เหลือหนีหายตอนเคลียร์เวฟ)
- **v4.59.0 (จาก feedback เจ้าของหลังเทส Ch2 เจอมอนค้าง ~90 ตัวตอน waveclear):** tickStage waveclear นับ `_clearT` → ครบ 4 วิ เรียก `fleeRemainingEnemies()` (ครั้งเดียว `_clearFled`, reset ใน onWaveCleared/startRun) · มอนธรรมดาตั้ง `e._fleeing` → enemy loop เปลี่ยนเป้าเป็นทิศตรงข้ามผู้เล่น + tween alpha→0 แล้ว deactivate (ไม่ดรอป/ไม่นับ kill) · **Elite (รวม ambush จาก Bonus Challenge) / บอส / เป้าภารกิจ ยังต้องฆ่าเอง** · spawnEnemy ไม่ reset alpha → คืน alpha=1 ทุกทาง (tween จบ, killEnemy, clearEnemies) · **verified headless C2-5: 94 ตัว → เหลือ elite 2 ใน 6 วิ, ฆ่า elite → breather, ไม่มี alpha ค้าง, 0 error**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.58.0 — ภารกิจมีเดิมพัน: Bonus Challenge + กลไกใหม่)
- **v4.58.0 (ภารกิจน่าเบื่อ → A+B ตามที่เจ้าของเลือก):** **A. Bonus Challenge ทุกภารกิจ** — `startBonusChallenge(o)` (เรียกท้าย setupWaveObjective) สุ่ม `speed` (เฉพาะ hunt/purge/capture/breakRoots, limit ตามชนิด) / `nohit` (≤2 hits, นับใน hurtPlayer → `onBonusHurt`) / `kills` (25+stage·4, นับใน `objOnKill`) · state `this._bonus` · HUD `waveBonusTxt` (pad+140, อยู่ใน hudList) · สำเร็จ (`resolveBonusChallenge` ใน completeWaveObjective) = `offerRelic()` หน่วง 0.9s (slot เต็ม → currency 2) · พลาด (`failBonus`) = spawnElite ×2 ซุ่มโจมตี · **B. กลไกภารกิจ Ch1:** Capture ยืนเติม ×0.55 + ฆ่ามอนในวง +0.7s (`objOnKill`) · Hunt เป้าวาร์ป 270px เมื่อผู้เล่นเข้าใกล้ <210 (cd 4.5s, `e._blinkCd`) + ทิ้ง spawnHazard ที่เดิม · Purge ทุก 7s spawn 'fast' ×2 `e._wispRaider` (tint แดง) ไล่ Wisp ผ่าน override tx/ty ข้าง decoy ใน enemy loop · flag raider ล้างใน killEnemy/clearWaveObjective · **verified headless ทุกกลไก 0 error** · ภารกิจ Ch2 (cleanAir/defendNectar/seasonCycle/breakRoots) ได้เฉพาะ A

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.57.0 — 🔮 ระบบ Relic)
- **v4.57.0 (Relic system — จากไอเดีย "แต่ละรันเล่นเหมือนกัน" ที่เจ้าของเลือก):** `RELICS` 11 ชิ้น (เปลี่ยนกลไก ไม่ใช่แค่ตัวเลข) + `RELIC_SYNERGIES` 4 คู่ + `RELIC_CAP=3` ต่อด่าน (รีเซ็ตพร้อม loadout ผ่าน `resetRelics()` ใน startRun/resetStageLoadout — resetStageLoadout เรียก applyMeta จึงล้างผลสแตตของ glass/magnet เอง) · state: `this.relics[]` + `this._rel{}` (lookup เร็วใน damage) · **แหล่ง:** เลเวล 6 การันตี (`_relicLvDone` ใน openLevelUp) · กล่องมินิบอส (`collectChest` kind mini → `offerRelic()`, slot เต็ม → openRollBox เดิม) · กล่องลับ 30% · **UI:** ใช้หน้าการ์ดเลเวลอัพเดิมผ่าน `this._forcedOpts`+`_relicPick` (ไม่มีแถบ reroll/banish, clear ใน closeLevelUp) · การ์ดโชว์ 🔗 synergy ถ้าถืออีกครึ่ง · น้ำหนักสุ่ม ×2.5 ให้ของที่เข้าคู่ · **hooks:** `damage()` (crown/momentum ก่อน crit, `relicOnCrit` splinter/leech หลัง crit, chill หลังหัก HP) · `killEnemy` → `relicOnKill` (shell นับ 15 kill, burst 18% หรือ Chain Reaction ใช้ `e._splinterHit` window 0.3s, budget 6 ระเบิด/0.1s กัน chain ระเบิดไม่จบ) · `hurtPlayer` เช็ค `_shield` ก่อน · `die()` Last Breath ก่อน Revive Candle · `doDash` → `relicJamTrail` · ดาเมจ relic = `relicDmg(mul)` สเกลเลเวล×dmgMul×(1+stage·0.35) · HUD: statTxt ต่อท้าย 🔮 emoji + 🫧×n · drawHeldBar แถว passive → แถว Relic สำหรับ character-first · **verified headless ในด่านจริง: ทุกแหล่ง/ทุก hook/synergy ทำงาน, 0 error** · **ถัดไป:** เจ้าของเล่นจริงดูว่า relic ไหนแรง/อ่อนเกิน (ค่าจูนอยู่ในเมธอด relicOn* + gainRelic)

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.56.0 — จูน def Cocoa/Sesame ตามบทบาท)
- **v4.56.0:** `CHARACTERS` def (ตัวคูณดาเมจที่รับ): Cocoa 0.88→**0.84** (แทงก์อึดสุดจริง) · Sesame 0.86→**0.94** (เดิมอึดกว่า Cocoa ทั้งที่เป็น sniper) · ข้อ "ยังค้าง" ของ v4.55 ปิดแล้ว

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.55.0 — Balance pass: Weave %, เพดานสแตตรวม)
- **v4.55.0 (Balance review ข้อ 1-3 — จาก feedback เจ้าของ):** (1) Weave `UPGRADES.dmg` เดิม +2 flatDmg บวกทุกฮิต (รวม tick/chain + โดนคริคูณ) → Momo เม็ดละ ~6.75 อัพ 3 เลเวลเกือบ ×2, ตัวยิงถี่ได้เปรียบ Cocoa หลายเท่า · เปลี่ยนเป็น **+3% dmgMul/เลเวล** (flatDmg ยังอยู่ในโค้ดแต่ไม่มีแหล่งแล้ว) · (2) **`STAT_CAPS` + `clampPlayerStats(p)` จุดเดียว** (dmg≤3.25, crit≤0.40, cd≥0.72, dmgTaken≥0.35, speed≤moveSpeed×1.35) ใช้ใน applyMeta/previewStats/cookDish/combos/endless · การ์ด endless: dmg +5% แบบบวก, filter การ์ดที่สแตตตันออก (`capped()`), เพิ่ม `eguard` (-4% dmg taken) · (3) previewStats เดิมใช้เพดาน 0.6/0.5 → หน้า Stats โชว์เกินจริง แก้แล้ว · critMul fallback รวมเป็น 1.55 ทุกที่ · floor คูลดาวน์ระหว่างทางของ set/affix/focus ใช้ STAT_CAPS.cdMulMin · **Art audit (headless): 330 textures โหลดครบ 0 404, ไม่มี texture key ที่โค้ดอ้างแต่ไม่มี, 42 sheets กริดหารลงตัว ไม่มีเฟรมว่าง, 115 sprite ไม่มีพื้นทึบ**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.54.0 — แก้ Evolution ไม่ขึ้น)
- **v4.54.0 (Evolution ไม่เคยขึ้น — จาก feedback เจ้าของ):** gate เดิม `b.mastery>=20` แต่ mastery สูงสุด = ผลรวม max ของ `d.upgrades` (ทุกตัว 5+5+3+3=16) + mutation 1 = **17** → evolution ไม่มีวันออก · แก้เป็น `evoAt=min(14, mastery สูงสุดที่ทำได้จริง (นับ banish))` · **verified headless ทั้ง 5 ตัว: mutation lv9, evolution lv15, 0 error** · ⚠️ ถ้าเพิ่ม/ลด upgrades ในอนาคต ระวัง gate mutation(8)/evo(14) ต้องไม่เกิน mastery สูงสุด

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.53.0 — การ์ดเลเวลอัพไม่รู้จบ แก้เลเวลตัน ~lv15)
- **v4.53.0 (Endless power-ups — จาก feedback เจ้าของ "เลเวลตัน ~lv15 ไม่มีอะไรให้อัพ"):** character-first build เดิม `rollBasicAttackUpgrades` มีแค่ weapon upgrades (`d.upgrades`) + mutation(mastery8) + evolution(mastery20) + heal ฉุกเฉิน — พอ weapon upgrades ตันหมด (~lv15) เหลือ fallback `sugarCache` ใบเดียว = เลเวลอัพเหมือนได้เปล่า · **แก้:** เพิ่ม `endlessStatDefs()` 7 การ์ดสแตตไม่รู้จบ (🔥+8%dmg · 🧁+12%maxHP+heal · 🎯+3%crit · 💥+12%critDmg · ⚡-4%cd · 👟+4%spd · 💗+0.6regen) · stack เก็บใน `b.endless[id]` (รีเซ็ตทุกด่านผ่าน initBasicAttack) โชว์ "Stack N" · **เติมเฉพาะช่องที่เหลือ** หลัง weapon upgrades → ต้นเกม weapon progression ไม่เปลี่ยน, ปลายเกม (มอนเยอะ เลเวลเยอะ) มีของให้เลือกเสมอ · soft cap: crit≤0.75, cd≥0.45, spd≤moveSpeed×1.5 · **verified headless: weapon ตันหมด → ได้ 3 endless cards, apply+stack ถูก (endless.ecdmg=1), node --check + npm run check ผ่าน, 0 pageerror**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.52.0 — หน้า Updates เลื่อนดูประวัติครบทุกเวอร์ชัน)
- **v4.52.0 (หน้า Updates ดูย้อนหลังครบ — จาก feedback เจ้าของ):** `buildNews` เดิมโชว์ `CHANGELOG.slice(0,3)` (แค่ 3 อันล่าสุด) ไม่มีทางดูเก่ากว่านั้น · แก้เป็น **pagination 3 การ์ด/หน้า** + ปุ่ม `‹ N / total ›` (ใช้ `this.newsPage` state + `_zone` แบบเดียวกับ inbox/skill archive) · CHANGELOG มี 72+ เวอร์ชัน = ~24 หน้า · cardH ลดที่ให้ nav bar ล่าง · **verified: node --check + validate ผ่าน, headless load 0 pageerror, CHANGELOG.length=72→24 หน้า** · (หน้า render ตรง ๆ ใน headless throw = artifact ของ menu container ไม่ใช่บั๊กจริง — nav pattern เดียวกับหน้าอื่นที่ใช้งานได้)
- **v4.51.0 (บอส Chapter 2 อมตะ — จาก feedback เจ้าของ):** **ต้นเหตุ float bug:** phase-gate ใน `damage()` clamp `e.hp=e.maxhp*gate` พอดีเมื่อ HP แตะ threshold เปลี่ยนเฟส (ตั้ง `_phaseGateLocked=true` = บอส immune จนกว่า bossThink จะทริกเปลี่ยนเฟส) · แต่ boss Chapter 2 (stage 6-9) เช็กเฟสด้วย `const f=b.hp/b.maxhp; f<=X` — การหาร `(maxhp*.72)/maxhp` อาจได้ `.7200000001 > .72` → เฟสไม่ทริก → บอส**ค้าง gate-lock ถาวร = อมตะตีไม่ตาย** (ด่าน 0-5 ไม่เจอเพราะเทียบ `b.hp<=b.maxhp*X` ตรง ๆ ไม่หาร) · **แก้:** เปลี่ยนบอส stage 6/7/8/9 ทั้ง 4 ตัวให้เทียบ `b.hp<=b.maxhp*X` ตรง (เลขคณิตเดียวกับ gate → เท่ากันเป๊ะ) · อัปเดต validator contract `f<=X` → `b.hp<=b.maxhp*X` · **verified: จำลอง 10,935 เคส HP — โค้ดเก่าอมตะค้าง 365 เคส (~3.3%), โค้ดใหม่ 0 เคส · node --check + validate ผ่าน** · C2-1 (stage 5) + miniboss ใช้ generic block ที่เทียบตรงอยู่แล้ว (ปลอดภัย)
- **v4.50.0 (แก้บั๊ก Chapter 2 จาก feedback+ภาพเจ้าของ · รับช่วงต่อจากเซสชันที่หยุดทำ):** (1) **มอนยักษ์ C2-4 (stage 8) + ตีไม่โดน:** `spawnElite()` — elite ของ stage 8 ใช้ `ch2_seasons_enemy_atlas` (256px) แต่ค่า `baseScale` fallback เป็น `1.55` (ค่าเก่าของ e_tank 62px) → ตัวยักษ์ ~400px + `setCircle(26,5,5)` hitbox จิ๋ว/offset ผิด = ยิงทะลุตีไม่โดน · แก้ให้ stage 8 = scale `0.42` + `setCircle(48,80,80)` เหมือน stage 5 (ch2 atlas) · เป็นตัวเดียวกับที่โผล่ใน objective "Hunt the Threat" (spawnObjectiveElite→spawnElite) · (2) **พื้นหลัง Chapter 2 ปูซ้ำ (bg6-10):** `bgTile` เป็น TileSprite ปูซ้ำ tileScale 1.12 — bg1-5 เป็น texture seamless ปูซ้ำได้ แต่ bg6-10 เป็นภาพฉากเต็มใบ (ลายนางฟ้าดอกไม้) ปูซ้ำแล้วเห็นเรียงเต็มจอ · แก้: startStage คำนวณ tileScale = `max(WORLD/texW, WORLD/texH)` (cover) เฉพาะ i>=5 → ภาพเดียวคลุมทั้งโลกไม่ซ้ำ · ด่าน 1-5 คง 1.12 เหมือนเดิม · **verified: node --check + validate-game-content ผ่าน, headless load 0 pageerror** · **หมายเหตุ: Chapter 2 (C2-1..C2-5) ยังควร full-run/mobile QA จริงเพิ่ม — บั๊กอื่นเช่น boss chronobloom/ท่าโจมตี ยังไม่ได้เทสจบในเครื่องจริง**
- **v4.49.0 (เลือกเป้า mod + auto-roll + skip animation + เอา Forge Legend ออก — จาก feedback เจ้าของ):** (1) **Legend เป็น drop-only:** ลบปุ่ม 🌟 Forge (🔩) ในหน้า Gear + ลบฟังก์ชัน `forgeLegend()` → ปุ่ม gacha ขยายเต็มความกว้าง · Legend ได้จากดรอปในด่าน/นรกเท่านั้น (`LEGEND_FORGE_COST` เหลือเป็น const ไม่ถูกใช้ · gacha ยังไม่ให้ legend ตามเดิม) · (2) **เลือกเป้าหมาย mod:** tile ใน ROLL POOL กดได้แล้ว → ตั้ง `this.craftTargetId` (toggle) โชว์ 🎯 · line-tap เคลียร์ target (target = pool-only concept) · (3) **Auto-Roll to target:** ปุ่มใหม่โผล่เมื่อเลือกเป้า → `autoRollToTarget()` วน (guard 300) สุ่มทับ line ที่เลือก spend currency (`craftCurrencyForLine` recompute ทุกรอบ, common→magic auto) จนได้ mod เป้าหมายหรือ currency หมด → banner สรุปจำนวนรอบ+ที่ใช้ไป · (4) **Skip:** `_playAffixRoulette` refactor แยก `finish()` + ปุ่ม ⏩ Skip (tap zone, บวก token กัน tick ค้าง) กระโดดดูผลทันที · **verified headless: forgeLegend=undefined, autoRollToTarget ยิงโดนเป้า 'dmg' สำเร็จ (TARGET HIT, spent currency จริง, affixCount ถูก), 0 pageerror** · **หมายเหตุ: currency ยัง context-locked (main button auto-pick transmute/alt/exalt/chaos ตาม rarity+ช่อง) — ถ้าเจ้าของอยากได้ manual currency picker เต็มรูปแบบต้องทำเพิ่มอีกก้อน**
- **v4.48.0 (5 endgame-only mod — จาก feedback เจ้าของ "ดูว่ามี mod อะไรเพิ่มได้อีก" หลัง v4.46 Affix Roulette):** `AFFIX_POOL` หลัก (15 ตัว, ล็อกจำนวนด้วย release-gate `validate-game-content.mjs`) ครบแล้ว แต่ `SPECIAL_AFFIX_POOL` (โครงมีตั้งแต่ v2.90 แต่ว่างเปล่าตลอด) ยังไม่มีอะไรเลย → เติม 5 mod ที่ gate ด้วย `minItemLevel` ผ่าน `craftAffixPoolForItem` เดิม (ของเลเวลต่ำไม่มีทางสุ่มเจอ): `vampiric`(🩸 weapon/gloves/ring iLv30+, ใช้ `p.lifesteal` เดิมที่ CHAR_TALENTS ใช้อยู่ — ฟื้น HP flat ต่อการฆ่า **ไม่มี cooldown** ต่างจาก `lifekill` ที่มี cd 0.45s) · `berserk`(💀 weapon/gloves iLv45+, glass cannon: `dmgMul`เพิ่มเยอะแลก`dmgTakenMul`เพิ่มด้วย) · `focus`(🧘 amulet/ring iLv45+, `cdMul`ไวมากแลก`critChance`ลด) · `gambler`(🎲 ring เท่านั้น iLv25+, `critMul`ก้อนใหญ่ไม่มีข้อเสีย) · `nourish`(💊 armor/amulet iLv20+, ใช้ `p.healEffect` เดิม — บูมค่าฟื้นจากไอเทม heal) · ทุกตัว hook เข้า field ที่ reset ใน applyMeta อยู่แล้วทั้งหมด ไม่มีกลไกใหม่ · อัปเดต `scripts/validate-game-content.mjs` GAME_VERSION gate เป็น 4.48.0 ด้วย · **verified: `npm run check` ผ่าน (15 affix หลักไม่เปลี่ยน), headless — ของ iLv ต่ำไม่มี special mod ปน, ของ iLv สูง (ring iLv50/weapon iLv60/armor iLv25) มี special ตรงตาม gate, rollAffixes 400 รอบไม่ error, ทุกค่า p.* finite, 0 pageerror**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.45.0 — Affix Forge visual clarity)
- **v4.45.0:** เปลี่ยนชื่อหน้าคราฟต์เป็น Affix Forge และจัด flow ใหม่เป็น Gear → Affix → Roll · เพิ่มฉากหลังห้องคราฟต์ 2.5D, ใช้อาร์ตอุปกรณ์จริงในแท็บ slot, แยก base quality ออกจากจำนวนช่อง affix, ย่อ random roll pool ให้เหมาะกับมือถือ, เพิ่มแถบผลก่อน→หลังและ double-tap ยืนยัน Remove/Reset · อัปเดตเอกสารให้ตรงกับระบบสุ่มจริง
- **v4.44.0:** เปลี่ยนไฟล์ PNG เสีย 6 ไฟล์เป็น production art โปร่งใสใหม่ ได้แก่ seasonal/root enemy atlas และบอส C2-2 ถึง C2-5 · ทุกช่องจัดลงกริด 256×256 ด้วย ground line เดียวกันและ silhouette อ่านง่ายบนมือถือ · validator หลักเปลี่ยนเป็น `validate-game-content.mjs` และตรวจ PNG signature/chunk CRC/IEND/zlib stream จริง · ลบ headless auto-playtest bot และอัปเดต README/QA/roadmap · **Chapter 2 implementation และ final art เสร็จแล้ว เหลือ full-run balance/mobile QA บนเครื่องจริง**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.43.0 — C2-5 Root Throne และเนื้อหา Chapter 2 เสร็จแล้ว)
- **v4.43.0 (C2-5 complete stage):** เพิ่มฉาก Root Throne, atlas ศัตรูราก 8 ช่อง และ objective Sever the Crown Roots 4 จุด · arena มี throne pulse/crown recall เปลี่ยนพื้นที่ปลอดภัยเป็นระยะ · AI เฉพาะ 7 บทบาท · Ancient Root Knight miniboss · The True Rootmother บอสใหญ่ 4 เฟสที่ 75%/42%/18% พร้อมอินโทร, เมตามอร์ฟ, Memory Eclipse และฉากจบ Chapter 2 · cap ฝูง 88 สำหรับมือถือ · validator ตรวจ readiness, objective, alpha/dimensions และ boss contracts

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.42.0 — C2-4 Four-Season Conservatory เสร็จและปลดล็อกแล้ว)
- **v4.42.0 (C2-4 complete stage):** เพิ่มพื้นเรือนกระจกสี่ฤดูและ atlas ศัตรู 8 ช่อง · arena หมุน Spring/Summer/Autumn/Winter พร้อม event ต่างกัน · objective Stabilize the Seasons ให้ไล่ sanctuary ที่ active · AI เฉพาะ 7 บทบาท · Season Keeper miniboss · Chronobloom Orchid บอส 3 เฟสที่ 72%/38% พร้อมอินโทร/เมตามอร์ฟ/Time Break · cap ฝูง 92 สำหรับมือถือ · validator ตรวจ asset alpha/dimensions, readiness, objective และ boss contracts · **เหลือ 3 คอมมิต: C2-5, chapter balance QA, art polish**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.41.0 — C2-3 Nectar Hive เสร็จและปลดล็อกแล้ว)
- **v4.41.0 (C2-3 complete stage):** เพิ่มพื้น Nectar Hive และ atlas ศัตรู 8 ช่อง · objective Defend Nectar 3 ดอก · AI เฉพาะ 6 บทบาท (ยิงนำ/พุ่งนำ/ระเบิด/เกราะหมู่/กระสุนสามทาง) · Royal Stinger miniboss · Ferment Hornet Queen บอส 3 เฟสที่ 70%/35% พร้อมอินโทร/เมตามอร์ฟ/ท่า Queen’s Decree · validator ตรวจ asset alpha/dimensions, readiness และ boss contracts · **เหลือ 4 คอมมิต: C2-4, C2-5, chapter balance QA, art polish**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.40.0 — C2-2 ผ่าน QA gate และปลดล็อกแล้ว)
- **v4.40.0 (C2-2 QA + unlock):** Mycelium Marsh เปลี่ยนเป็น `ready:true` · ล็อก balance เทียบ C2-1 ที่ HP ≈×1.35 / DMG ≈×1.30 / speed +8% · cap ศัตรูมีชีวิต 104 ตัวเพื่อมือถือ · validator ตรวจ future-stage locks, phase gates, telegraphs และ ratios · ปรับ roadmap เป็น 11 คอมมิต · **เหลือ 5 คอมมิต: C2-3, C2-4, C2-5, chapter balance QA, art polish**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.39.0 — Mycelium Behemoth บอสสามเฟส; C2-2 รอ full-run QA)
- **v4.39.0 (C2-2 boss):** เพิ่มอาร์ตโปร่งใส 8 เฟรม `boss7_mycelium_behemoth_sheet.png` · ฉากเปิดตัว Marsh Heart · สามเฟสพร้อมอมตะระหว่างเปลี่ยนเฟสที่ 68%/34% HP · ท่า Root Reaper / Mire Quake / Spore Crown / Mycelial Lattice / Colony Rise / Heartstorm · ฉากตายเฉพาะ · validator ครบ · C2-2 ยัง `ready:false` จนผ่าน full-run/mobile QA · **Commit ถัดไป: C2-2 balance QA + unlock**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.38.0 — Fungal Juggernaut miniboss; C2-2 ยังล็อกจนบอสเสร็จ)
- **v4.38.0 (C2-2 miniboss):** เพิ่มอาร์ตโปร่งใส 4 เฟรม `mb7_fungal_juggernaut_sheet.png` · ท่าเฉพาะ Mycelium Quake / Triple Stampede / Living Wall / Spore Mortar / Colony Call · เปลี่ยนเฟสอมตะชั่วคราวที่ 50% HP พร้อม Bulwark escort · แก้บั๊กค่า `b.dmg` ของมินิบอสถูก comment ทับ · เพิ่ม validator กัน regression · C2-2 ยัง `ready:false` · **Commit ถัดไป: Mycelium Behemoth three-phase boss**

### สถานะก่อนหน้า
## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: v4.37.0 — C2-2 Mycelium Marsh + monster family; ด่านยังล็อกจนบอสเสร็จ)
- **v4.37.0 (C2-2 vertical slice — monsters + field rule):** เพิ่มอาร์ต `ch2_mycelium_enemy_atlas.png` 4×2 (Drifter/Hopper/Sniper/Mold Sac/Bulwark/Oracle/Sporeling/Clean-Air Wisp) + พื้น `bg7.webp` · เพิ่ม wave profile 5 ช่วง · AI เฉพาะ: spore pool หลัง Drifter ตาย, Hopper เล็งนำ, Sniper/Oracle ยิงนำ, Mold Sac แตกเป็นลูก, Bulwark ลดดาเมจให้พวกใกล้ · objective Clean Air เคลื่อนที่และทำดาเมจนอกวง · C2-2 ยัง `ready:false` · **Commit ถัดไป: Fungal Juggernaut miniboss**

### สถานะก่อนหน้า
- **v4.36.0 — วางโครง Chapter 2 ครบ 5 ด่านและล็อกด่านที่ยังไม่ผ่าน QA**
- **v4.36.0 (Chapter 2 foundation):** ขยายช่วง Chapter 2 เป็น C2-1…C2-5 · เพิ่ม metadata ด่าน Mycelium Marsh/Nectar Hive/Four-Season Conservatory/Root Throne แบบ `ready:false` · stage select/startRun/portal ใช้ readiness guard เดียวกัน · Zone Level และ HP/DMG curve รองรับด่านเกิน index 5 แบบต่อเนื่อง · C2-1 ใช้ objective pool แบบ data-driven และเปลี่ยนบอสเป็น Rootmother's Bud เพื่อเก็บ True Rootmother ไว้ C2-5 · **Commit ถัดไป: C2-2 Mycelium Marsh + monster family**

### สถานะก่อนหน้า
- **v4.35.0 — ตีบวก +4 ขึ้นไปเสี่ยงของแตกหาย เพดาน +10**
- **v4.35.0 (ตีบวก +4↑ มีโอกาสของแตกหาย — จาก feedback เจ้าของ):** `enhanceOdds` เดิม +4-7 แค่ลดขั้น (destroy 0), +8-9 ถึงมี destroy · แก้ให้ **destroy เริ่มตั้งแต่ +4** (2%→26% ไต่ขึ้น: 4=.02/5=.05/6=.10/7=.15/8=.20/9=.26) + brk (ลดขั้น) ด้วย · +0-3 ปลอดภัย · เพดานยังเป็น `GEAR_ENH_MAX=10` (มีอยู่แล้ว) · ปุ่ม Enhance โชว์ ⚠ เมื่อ destroy>0 (auto จาก od.destroy) · **verified headless: +3 safe, +4 destroy .02 … +9 .26, MAX=10, 0 pageerror**
- **v4.34.0 (ตีบวก gear ใช้ 🔩 shards แทน Sugar)**
- **v4.34.0 (ตีบวกใช้วัสดุจาก dismantle แทน Sugar — จาก feedback เจ้าของ):** Enhance (⚒️) เดิมใช้ 🍬 Sugar (`gearEnhCost`) → เปลี่ยนเป็น 🔩 gear shards (`gearEnhShardCost(lv)=3+lv*2` → +1..+10 = 3/5/…/21) วัสดุตัวเดียวกับที่ได้จาก dismantle · แก้ 2 จุด: instance path (drawAction 2 → `Save.spendShards`) + legacy landscape row · ปุ่มโชว์ `🔩{cost}` · ไม่พอ = banner "dismantle gear to get more" · Sugar ว่างไปใช้ Weave/ตัวละคร/Bazaar · **verified headless: enhance +1 spend 3 shards (100→97), success, costs 3/5/11/21, 0 pageerror**
- **v4.33.0 (gacha จุดเดียว + เลือกช่วง iLv ชั้นละ 10 (เพดาน 60))**
- **v4.33.0 (รวม gacha จุดเดียว + เลือกช่วง item level ชั้นละ 10 — จาก feedback เจ้าของ):** `GACHA_LEVELS` เปลี่ยนเป็น 6 band `{lo,hi,cost}`: 1-10/150 · 11-20/320 · 21-30/560 · 31-40/900 · 41-50/1400 · 51-60/2100 · `openGachaReveal` สุ่ม iLv ในช่วง `[lo,hi]` · stepper (portrait+landscape) โชว์ `iLv{lo}-{hi}` · **เพดาน 60** (iLv 61-100 = drop เท่านั้น) · **รวม gacha เหลือจุดเดียวที่หน้า Gear** — Bazaar gamble tab เอา gear box ออก เหลือปุ่มลิงก์ไปหน้า Equipment + currency box (bazaarGambleGear = dead code) · **verified headless: 6 band สุ่ม iLv ในช่วงถูกต้อง, mod 0-1 ~50/50, 0 pageerror**
- **v4.32.0 (gacha เลือก base item level ได้ + สุ่ม 0-1 mod)**
- **v4.32.0 (gacha เลือก base item level + 0-1 mod — จาก feedback เจ้าของ):** `GACHA_LEVELS` 5 tier ({ilv,cost}: 1/150 · 20/400 · 45/850 · 70/1500 · 100/2500) · buildGear (portrait+landscape) ปุ่ม gacha เป็น **stepper** (◄ ► ปรับ level, กลาง=เปิด) โชว์ `iLv{n} 🍬{cost}` · `this._gachaLevel` state · `openGachaReveal` ใช้ cost/ilv ของ level ที่เลือก + ส่ง ilv เข้า `gachaRoll(ilv)` · `grantGear(tier,{gacha,itemLevel})` ใช้ itemLevel ที่เลือก + chapter=`itemChapterFromLevel` + **สุ่ม 0-1 mod (50/50)** (0=common พื้นขาว, 1=magic) · **verified headless: iLv ตาม tier (1/45/100), mod dist ~50/50 ทุก level, 0 pageerror**
- **v4.31.0 (gacha ลดเกรด+ลด mod เป็นแหล่งช่วงต้น)**
- **v4.31.0 (gacha เป็นแหล่งช่วงต้น ไม่ใช่ jackpot — จาก feedback เจ้าของ "ยังสุ่มได้ epic/rare mod เยอะ"):** `gachaRoll` weight เดิม common50/rare30/epic15/legend5 → **common68/rare29/epic3, ไม่มี legend** (legend ได้จาก forge/ดรอปนรกเท่านั้น) · `grantGear(tier,opts)` เพิ่ม `opts.gacha` → itemLevel floor ต่ำ `Math.min(11,rollItemLevel(sourceStage,1))` = affixCountCap 1 = **1 mod (magic)** เท่านั้น (เลิก floor 12 ของ v4.29 เฉพาะ gacha) · drops/forge/bazaar path ไม่แตะ (ยังใช้ floor 12) · **verified headless: 300 rolls = common 68%/rare 30%/epic 2%/legend 0%, gacha item = common base iLv 2-7 1 mod, 0 pageerror**
- **v4.30.0 (flame-sand reroll (Crystal Glaze) ผลาญ 3/ครั้ง)**
- **v4.30.0 (flame-sand reroll แบบเรียบง่าย + ผลาญเยอะ — จาก feedback เจ้าของ "เหมือน flame sand ใน Torchlight"):** `divine` (⚪ Crystal Glaze) = ตัว reroll ค่า mod ที่เลือก ใช้ได้ **ทุก rarity** (common/magic/rare) อยู่แล้ว → ทำให้เป็น flame-sand หลัก: ปุ่ม Craft Bench "Reroll ×3" · `FLAME_REROLL_COST=3` (const ใกล้ CURRENCY) · `divineFocusedLine` เช็ก/spend 3 แทน 1 + screenFlash ขาว + banner บอก −3 · desc CURRENCY อัปเป็น "burns 3 per use" · **verified headless: reroll common/magic/rare ผลาญ 3 ทุก rarity, 0 pageerror**
- **v4.29.0 (แก้บั๊กระบบไอเทม + จบด่านกลับเมนู — จาก feedback เจ้าของ):**
  · **จบด่านกลับ hub:** `continueFromSummary` `menuScreen='stage'`→`'hub'`
  · **บั๊ก currency (ต้นเหตุ "อัพไม่ได้/currency ไม่ได้ใช้"):** `craftCurrencyForLine` เดิม magic+ช่องว่าง→`exalt` (หายาก) · transmute ใช้ได้แค่ common แต่ของ drop ไม่เคย common (`baseDefaultRarity` common→magic) → transmute ไร้ประโยชน์ ตัน · **แก้:** `if(!hasLine)return rarity==='rare'?'exalt':'transmute'` → transmute เติม common/magic ได้, exalt เหลือไว้ rare (loop: common→transmute→magic→transmute→magic2→regal→rare→exalt→rare4) · **verified: magic1→transmute→magic2→regal→rare→exalt→rare3, 0 error**
  · **gacha "1 mod/magic เสมอ":** `grantGear` menu path floor iLv 12 (`Math.max(12,rollItemLevel(sourceStage,1))`) → affixCountCap≥2 = 2 mod · **verified: gacha ให้ magic+rare, affix dist 1:17/2:23**
- **v4.28.0 (เมนูเปิดหมดหลังจบ tutorial)**
- **v4.28.0 (ปลดล็อกเมนูหลังจบ tutorial — จาก feedback+ภาพเจ้าของ):** ต้นเหตุจริงของ "เข้า Weave ไม่ได้" = **hub gate** ที่ `buildHub` (`need=[0,0,1,2,1,0]` ล็อก Gear&Power/Activities/Codex ตาม unlockedStage) — Weave อยู่ใน Gear&Power ที่ล็อก · แก้: gate เปลี่ยนเป็น `if(us<need[i] && !tutDone)` (tutDone=`Save.data.tutorialDone`) → จบ tutorial = ปลดทุกเมนู · `buildHubGroup` GATED afterS1 `||!!Save.data.tutorialDone` (gear/craft/bazaar/inbox เปิดด้วย) · **verified: ก่อน tut ล็อก 3, หลัง tut ล็อก 0, gLoadout ล็อก 0, 0 error** · (char-buy gate ยังคง unlockedStage>=1 ตามเดิม)
- **v4.27.0 (Tutorial พาเข้า Flavor Weave)**
- **v4.27.0 (จบ tutorial สอนอัพ Weave — จาก feedback เจ้าของ):** Flavor Weave (หน้า `upgrade`/`buildUpgrade`) ไม่มี gate อยู่แล้ว (เปิดตั้งแต่เริ่ม แม้ gear/craft/bazaar/inbox ล็อกจนผ่านด่าน 1) แต่ผู้เล่นหาไม่เจอ → หน้าจบ tutorial (`showTutorialComplete`) เพิ่ม **2 ปุ่ม**: "✦ Boost your Cores" → `openTutorialWeave()` (exitStage → menuScreen='upgrade' + ตั้ง `_tutorialWeaveCoach` + menuToast) · "🗺 Skip to Stage Select" → continueFromSummary · `buildUpgrade` เมื่อ `_tutorialWeaveCoach` เปลี่ยน prog text เป็น "🍓 Tap a core to spend your Sugar!" (เต้น) · เคลียร์ flag ตอนซื้อแก่นสำเร็จ · **verified: จบ tutorial→2 ปุ่ม, กดแรก→screen upgrade+coach, buyTal ok, 0 error**
- **v4.26.0 (rarity มีผลในเกม — Potency)**
- **v4.26.0 (rarity มีผลในเกม — Potency · จาก feedback เจ้าของ):** เดิม epic/legend ต่างแค่สี · เจ้าของเคยให้กระโดดเลเวล 1→3 แต่ OP · แก้เป็น **Potency**: `RARITIES[].potency` (common1.0/rare1.15/epic1.30/legend1.55) · `b.ranks[id]` = magnitude ถ่วง potency (ค่า scalar power/rate/size/chill/linger/combo/radius แรงกว่าตามความหายาก · read sites เดิมอ่าน b.ranks ได้เลยไม่ต้องแก้) · `b.lv[id]` = เลเวลจำนวนเต็มใหม่ (display/mastery/gate + `COUNT_IDS`={volley,arc,surge,cluster,pane} ที่นับนัด → +1 เต็ม ไม่ใช้ potency) · apply ใน rollBasicAttackUpgrades อัพทั้ง lv(+1) และ ranks(+potency, cap max*1.55) · syncBasicAttack mastery นับจาก b.lv · card desc โชว์ ⚡+N% roll · **epic/legend ออกยากขึ้น** (weight 8→5.5, 2→1.5) · basicAttack รีเซ็ตทุกด่าน = ไม่ต้อง migrate · **verified: legend power mag 1.55 vs common 1.0 (lv เท่ากัน), volley integer, lv ทุกตัว integer, 0 error**
- **v4.25.0 (Card rarity/boss charge/reward polish/early progression)**
- **v4.25.0 (6 เรื่องจาก feedback เจ้าของ):**
  · **การ์ด rarity เด่นชัด:** `drawReadableChoiceCard` เพิ่ม `rarIdx` → epic/legend กรอบหนา + glow graphics (2 ชั้น) รอบการ์ด + พื้นอมสี (`_darken(color)`) + legend/epic pulse alpha
  · **บอสชาร์จแล้วพุ่ง:** helper `chargeTelegraph(b,windMs,dashSpeed,thick)` — ลำแสง vfx_line หนา สว่าง+หนาขึ้นตอนชาร์จ + glow ที่ตัวบอส + follow ตรึงทิศ → พุ่ง (มินิ 780ms/700, บอส 900ms/600+stage*20) แทนเส้นบาง 420ms เดิม
  · **กล่องสุ่มมินิบอสอลังการ:** `playRollAnimation`/`landRollBox` ใช้ไอคอนจริง (`card.iconKey` image แทน emoji), rays หมุน, halo, ประกายกระจาย 10 จุด, screen flash + hitStop ตอน land
  · **หน้าสรุปด่านกระชับ:** เหลือ Time/Kills/Sugar/Boxes/Power/Level — ตัด Boss Rage, Character EXP, Build ทิ้ง
  · **gate หมวด Gear&Power:** `buildHubGroup` — `GATED={gear,craft,bazaar,gearInbox}` ล็อกจน `unlockedStage>=1` · stats + upgrade (3 แก่น Flavor Weave) เปิดตั้งแต่เริ่ม
  · **รางวัล tutorial = Sugar 140:** `_coachFinish` เลิกแจก gear → `Save.addSugar(140)` (พออัพ 3 แก่นได้: 2× อันเดิม หรือ 3 อันละ 1) · showTutorialComplete hint ชี้ไป Flavor Weave
- **v4.24.0 (บัฟ Momo + gate ปลดล็อกตัวละคร)**
- **v4.24.0 (บัฟ Momo + gate ปลดล็อกตัวละคร — จาก feedback เจ้าของ):**
  · **Momo (สตรอเบอร์รี่) แรงขึ้น:** sprinkle basic dmg `(3.5+lvl*1.0)`→`(5.25+lvl*1.5)` (×1.5) → ต้นเกมตี ~4→6 ต่อเมล็ด (บรรทัด ~5600 ใน castSkill sprinkle branch)
  · **ปลดล็อกตัวละครหลังผ่านด่าน 1:** `buildChars` เพิ่ม `charsUnlocked=(unlockedStage>=1)` · ตัวที่ยังไม่มี+ยังไม่ปลด = `locked` (การ์ดหรี่, label '🔒 Clear Stage 1', แตะ=menuToast ไม่ซื้อ) · Momo owned ตลอด เลือกได้ · **verified: locked ก่อนผ่าน, unlocked หลังผ่าน, 0 error**
- **v4.23.0 (Character-only cards + streamlined reward)**
- **v4.23.0 (การ์ดเฉพาะตัวละคร + ตัดเลือกกล่องรางวัล — จาก feedback เจ้าของ):**
  · **การ์ดเลเวลอัพ:** `rollBasicAttackUpgrades` เอา pool `pas` (PASSIVES ใช้ร่วม 12 แบบ) ออกทั้งหมด → เหลือเฉพาะ `atk` (อัพเกรดอาวุธประจำตัว `d.upgrades`) + mutation(mastery8) + evolution(mastery20) + heal ฉุกเฉิน(กันตันจอ) · **verified: 360 การ์ด = 'basic' ล้วน ไม่มี 'pas'**
  · **รางวัลจบด่าน:** ตัดหน้า `showStageChestChoice`/`chooseStageChest` (เลือก 1 ใน 3 กล่องแบบไม่รู้ผล = ไร้ความหมาย) → `revealStageReward(note)` สุ่ม 'fortune' ให้เลยแล้วโชว์ผลชัด (gear โชว์ชื่อ+บอกให้ไป Equip ที่เมนู Gear, ไม่มีปุ่มเลือก, auto→onStageClear 1.65s) · **verified: ล้มบอส→rewardChoice, 0 ปุ่ม, โชว์ label**
- **v4.22.0 (Boss epilogues + early-game loot fix)**
- **v4.22.0 (Boss story epilogue + แก้ loot โกงต้นเกม — จาก feedback เจ้าของ):**
  · **สรุปเรื่องราวตอนล้มบอส:** `STAGE_EPILOGUE[]` (6 ด่าน) = เกิดอะไรขึ้น + ทำไมไปด่านต่อ · `showStageEpilogue(last)` (state `'epilogue'`, `_epilogueBtns`, handler ที่ pointerdown) โชว์ก่อนหน้าสรุปสถิติ → กด Continue → `showStageSummary` · `onStageClear` route ผ่าน epilogue (path quit stage ไม่ผ่าน) · ไม่มี ep = fallback ไป summary
  · **แก้ item โกงต้นเกม (3 จุด):** (1) `affixCountCap(itemLevel)` — iLv<12=1 mod, <25=2, <45=3 (rollAffixes `Math.min(AFFIX_COUNT,cap)`) กันของด่านแรกมี 3-6 mod · (2) reward gear ตามหลัง 1 ด่าน: `rewardSourceStage()`=unlockedStage-1, `rewardChapter()`, `currentRewardItemLevel` ใช้ diff1 → ผ่านด่าน1 ไม่กระโดด Chapter 2 · (3) `grantGear` menu path ใช้ rewardSourceStage + diff1 (in-play ยังใช้ stageIndex จริง) · **verified: หลังผ่านด่าน1 gacha iLv~5-8 (เดิม 30), max 1 mod (เดิม 3), 0 error**
- **v4.21.0 (Purge → Escort the Wisp):** รื้อภารกิจ purge จาก "ทุบแกนนิ่ง N อัน" เป็น **escort mission** · แกนคำสาป (`_coreLocked`) ยิงไม่เข้า (กระสุน/AoE สะท้อนเป็นประกาย — guard ใน `hitWaveNode`/`hitCratesInRadius`) · **Wisp** (วิญญาณโมจิเรืองแสง `this._wisp` = circle+glow) ลอยไปหาแกนใกล้สุด (`nearestCore`) เดิน/channel ได้เฉพาะตอนผู้เล่นอยู่ในวง escort (`_wispTuning().escortR=180`) · มอนใกล้ Wisp กัดกินหลอด light → หมด = ดับ (`killPurifyWisp(true)`) เกิดใหม่ใน ~3.2s ไม่เสีย progress · ถึงแกน → channel (`3.2+stageIndex*0.35`s) เต็ม = `purifyCore`→`destroyWaveObjectiveNode` (นับ progress เดิม) · HUD วาดใน `objNodeG` (วง escort เขียว/แดง, หลอด light, หลอด channel) · `renderWispHUD`/`tickPurifyWisp`/`floatText` เพิ่มใหม่ · objective arrow ชี้ Wisp · **verified headless: จบภารกิจ 3 แกน ~26s, 0 error** · tuning ปรับที่ `_wispTuning()`
- **v4.20.1 (fix):** กล่อง loot ไม่เป็นสี่เหลี่ยมดำแล้ว · จัดแบนเนอร์กลางจอให้กระชับ
- **v4.20.0 (Objectives/drops/HUD/character tuning):** เฉพาะเวฟ **Survive** ที่จับเวลานับถอยหลัง — เวฟ **Hunt/Purge/Capture ไม่มี timer** ต้องทำสำเร็จถึงผ่าน · การ์ดเลเวลอัพให้ **+1 ดาวเสมอ** (Epic/Legend ไม่กระโดดหลายขั้นแล้ว) · currency drop โชว์ไอคอน currency จริง (เลิกกล่องสี) · แก้ HUD บน (จุดเวฟทับบรรทัด HP/atk/def) · แก้ไอเทมค้างหลังออกด่านแล้วเริ่มใหม่ · Strawberry multi-shot หายากลง (ส่วนมาก 1–2 เมล็ด) · Mint ice shard น้อยลง/เร็วขึ้น/ไม่ homing · Sesame ตัดวงเวทตกค้าง (เหลือ beam + Focus)
- **v4.19.0–v4.19.1 (Strawberry nerf + ถอดระบบครัว):** **Momo/Strawberry จูนลงหนัก** (เมล็ดต่อชุดน้อยลง, ดาเมจต่อเมล็ดต่ำลง, ยิงช้าลง, sig weapon เลิก +ดาเมจก้อนใหญ่ — เดิมละลายมินิบอสไวเกิน) · **ถอด Cooking Codex ออก** (เมนู Cookbook, recipe panel, แบนเนอร์ Dish Cooked, cook quest) — โบนัสคอมโบอาวุธ+passive ยังทำงานเงียบๆ · หน้าสรุปด่าน (currency+box) โชว์+รอแตะทุกด่าน · **v4.19.1:** สรุปด่านปิดได้เฉพาะปุ่มมันเอง
- **v4.17.0–v4.18.1 (Training Ground tutorial):** ผู้เล่นใหม่เรียนใน **Training Ground** ด่านซ้อมว่างเปล่า (ไม่มี prop/เวฟ, Berry สอนทีละสเต็ป) แทน Stage 1 จริง → story intro Ch.1 ไม่ถูกใช้ทิ้งตอน tutorial · จบ tutorial กลับหน้าเลือกด่าน · **v4.18.0:** grid floor (เปลี่ยนเป็น raster ใน v4.47.0), tip ย้ายล่างบรรทัดเดียวเน้นคำสำคัญ, spotlight เต้นชี้จุด (โซนเดิน/ศัตรูใกล้สุด/ปุ่ม Dash+Unique/การ์ด), รางวัลไอเทมจบ tutorial · **v4.18.1:** จบ tutorial โชว์หน้ารางวัล tap-to-continue
- **v4.16.0 (level-up card cleanup):** ลบการ์ด common ซ้ำซ้อน (Balanced Core, Returning Taste — ทับ Sweet Power/Mochi Vitality/Regeneration/Quick Hands)
- **v4.14.0–v4.15.0 (Sesame rework + loot boxes):** รื้อ **Sesame เป็น Mirror Beam sniper** · loot boxes + มอนดรอป currency · quit-summary · จูน Sesame beam
- **v4.13.0 (fix):** acid pool บอสบังจอ, field item ยักษ์, Mint spear rework
- **v4.10.0–v4.12.0:** Bestiary ครบทุกด่าน (boss/miniboss ราย stage) · Ascendancy design + endgame lore (Midnight Kitchen) · Sesame Guard/Focus movement trade-off · Zone Modifier currency reroll + จูน Cocoa/Taro
- **v4.9.0 (Zone Modifiers):** `ZONE_MODIFIERS` 4 affix สแตกได้ (toughened/ferocious/swarmlord/nightmare) · ปลดล็อกหลังผ่านบอสจบ Ch.1 (`Save.zoneModsUnlocked`=stageMastery[4]) · เปิดจากหน้าเลือกความยาก (`buildZoneModifiers`) · `Save.data.zoneMods` + `zoneModMul()` × เข้ากับ `diffMul()` (hp/dmg/reward) · set `_activeZoneMods/_zoneMul` ใน startRun · **gate ไว้กันผู้เล่นใหม่ถาโถม**
- **v4.8.0 (Stats + Bestiary + tune):** หน้า **Character Stats** (`previewStats/buildStats`, gLoadout) โชว์เลขจริง (Attack Power index ฯลฯ) · **Bestiary คืนสแตตถาวร 8 tier** (`bestiaryTotals` เข้า applyMeta, `BEST_HI_SCALE` tier 6-8) · Momo weapon cd 0.88→0.94 (ช้าลง) · Mint frost = basic ยิงถี่ (special cd + weapon 0.72) + ฟาน 2 หอกโฮมมิ่ง + `frostShatterBurst` AoE การันตีโดน
- **v4.3.1–v4.7.0 (ชุดแก้ตาม feedback เจ้าของ):**
  · **v4.3.0 fix:** field item SVG เป็นกล่องดำบนมือถือ (ไม่มี width/height + feDropShadow) → ใส่ size + ตัด filter · gacha reveal โชว์อาร์ต gear จริง (เดิมเป็นอีโมจิ) · **craft สุ่ม** (เห็น "POSSIBLE STATS" แล้วกด currency = สุ่มติด 1 อัน ไฮไลท์ทอง — `randomCraftSelected`, `_craftRolledId`)
  · **v4.3.1:** craft bench อ่านง่ายขึ้น — พื้น item/tile tint ตาม rarity + จุดสีมุม, affix/stat มีแถบซ้าย prefix(ส้ม)/suffix(มิ้นต์) + legend, เน้นชื่อ stat
  · **v4.4.0:** `rollTier(best,ilvl)` — iLv มีผลกับ Tier (ช่วงละ 10 lv, ยิ่งสูง tier ดีบ่อยขึ้น) · **`stageZoneLevel(stageIndex,diff)` = Zone 1..18** สเกลความยากรวม (โชว์ HUD, ใช้ต่อกับ Bazaar) · Back = ย้อนหน้าก่อนหน้า (`_navStack`) · Reward Inbox ย้ายล่างสุด
  · **v4.5.0:** Enhance → **+10** · +4 ขึ้นไป "แตก" (ลดขั้น, floor +3) · +8..+9 "ทำลาย" (ไอเทมหาย) — `enhanceOdds`, `Save.enhance` คืน {result,lv} · Equipment เพิ่มปุ่ม **🧪 Craft this** (เด้งไปคราฟ) + **Sell 🍬** (`sellGearInstance`)
  · **v4.6.0:** Mochi Bazaar — Buy เป็น **one-time** restock ทุกครั้งผ่านด่าน (`Save.data.bazaarSeed/bazaarZone/bazaarBought`, restock ใน onStageClear, stock อ้างอิง Zone) · **Gamble = ตู้สล็อต** หมุนแล้วเผยรางวัล (`bazaarSlotReveal`)
  · **v4.7.0:** Rank Perks → **ผัง Passive 3 ชั้น** (`RANK_PERKS[].tier`, `PERK_TIER_REQ`, `perkTierUnlocked` — ชั้น2 ปลดที่ 3 แต้ม, ชั้น3 ที่ 8) + โหนดใหม่ Iron Will/Fortune · **TAL_MAX 5→3** (แก่นเต็มไวขึ้น = ได้ RP ไวขึ้น)
- **v4.2.0 (Focused Crafting):** เปลี่ยน Craft Bench จาก PoE orb grid เป็น flow มือถือ เลือกบรรทัด → เลือก stat เป้าหมาย → ใช้ currency ตามบริบท · แสดง pool/Tier สูงสุด/value range ต่อไอเทม · เตรียม registry สำหรับ base-exclusive mods
- **v4.2.0 (Focused Crafting):** เปลี่ยน Craft Bench จาก PoE orb grid เป็น flow มือถือ เลือกบรรทัด → เลือก stat เป้าหมาย → ใช้ currency ตามบริบท · แสดง pool/Tier สูงสุด/value range ต่อไอเทม · เตรียม registry สำหรับ base-exclusive mods
- **v4.1.0 (Equipment v2 Final — Inventory lifecycle):** Reward Inbox 5 ช่องเมื่อ Bag 24 ช่องเต็ม · Claim/Dismantle ราย UID · Auto-dismantle Off/Common/Common+Rare · Favorite/Locked/Equipped/Epic/Legend ป้องกันการลบอัตโนมัติ · schema v3 migration
- **v4.0.0 (Equipment v2 Phase 4 — Instance crafting + progression):** Craft Bench เลือกชิ้นด้วย UID และป้องกันชิ้น locked · drop/gacha/forge/Bazaar รองรับฐานซ้ำเต็มรูปแบบ · Item Level 1–100 แบ่ง 5 Chapter พร้อม affix tier gate และ power cap · อาวุธ 22 ชิ้นพร้อม vector icon ครบชุด
- **v3.9.0 (Equipment v2 Phase 3 — Compare):** เปรียบเทียบ Equipped/Selected แบบซ้าย–ขวา · `gearInstanceStats` normalize ผล base+enhance+affix เป็น 12 ค่าสถานะที่ higher-is-better · ค่าดีขึ้นเขียว/ลดลงแดงพร้อม ▲▼ · preview จำนวน Set ก่อน→หลัง · Quick Equip 1 แตะ · **ถัดไป Phase 4: Craft Bench เลือก instance จากคลัง + drop/gacha รองรับของซ้ำเต็มรูปแบบ**
- **v3.8.0 (Equipment v2 Phase 2 — Inventory grid):** หน้า Equipment แนวตั้งใช้ instance grid 4×2 + pagination · ของใหม่เรียงก่อนและมี badge/จุดแดงราย slot · เลือกชิ้นดูชื่อ/Affix/Grade/Craft State · Favorite/Lock · Equip/Enhance ยังใช้ได้ · Landscape คง legacy UI ที่ sync UID · **ถัดไป Phase 3: side-by-side comparison + stat delta + quick equip**
- **v3.7.0 (Equipment v2 Phase 1 — Item Instance + migration):** เพิ่ม `gearItems[]` UID เฉพาะต่อชิ้น, `equippedGear`, คลัง metadata 24 ช่อง, `gearInbox`, helpers สำหรับ add/equip/remove/query · migration เซฟเดิมรักษา equipped/enhance/affix/craft state · legacy UI dual-write UID+base ID จนกว่าจะย้ายหน้าจอครบ · acquisition เดิมสร้าง instance แล้ว · **ถัดไป Phase 2: inventory grid + New/Favorite/Lock + compare/equip UI**
- **v3.6.0 (Animated main menu):** layered parallax ชัดเจนขึ้น + sparkle/light motion · bump `GAME_VERSION` และ `CHANGELOG` แล้ว
- **v3.0.0–v3.5.0 (English UI — global launch):** แปลข้อความผู้เล่นทั้งเกมเป็นอังกฤษล้วน (เมนู/การ์ด/สกิล/story/แบนเนอร์บอส+เฟส/ชื่อศัตรูรายด่าน/wave beats/หน้าสรุป+ชนะ/กล่องสุ่ม/หน้าฟื้นคืนชีพ/CHANGELOG) · verified 0 error (headless probe hub+news) · CHANGELOG เก่า (ไทย v1.0.0–v2.99.1) ยุบเป็น summary อังกฤษ 1 entry · **ต่อไปเขียนข้อความ user-facing เป็นอังกฤษเสมอ (comment เป็นไทยได้)**
- **v2.98.0 (Quest + badge):** `QUESTS` เส้นทางเป้าหมาย 11 ด่าน (ผ่านด่าน/ปรุงสูตร/Rank/gear/legend/นรก) · buildHub โชว์ "🎯 ภารกิจถัดไป" + `claimReadyQuests` แจก 🍬 อัตโนมัติ (`Save.data.questClaimed`) · `drawBadgeDot` จุดแดงเต้น: `hasNewsBadge` (เทียบ `Save.data.seenVersion` เคลียร์ใน buildNews) บนป้ายเวอร์ชัน · `hasActivityBadge` (daily ยังไม่รับ/achievement เคลม) บนการ์ดกิจกรรม
- **v2.97.0 (tutorial freeze + newbie + difficulty lock):** `_inTutorial` = อมตะ(hurtPlayer/touchEnemy return) + tickStage freeze + เคลียร์สนามต่อบท (`tutorialSetupStep`: spawn 5 บทฆ่า, openLevelUp บทเลเวล) · playWaveCutscene/banner ข้ามตอน tutorial · `newbieEase()` ลด HP มอนด่าน1/ต้นด่าน/ก่อนจบ tutorial · openDifficultyChoice ล็อกระดับที่ยังไม่ผ่าน (`maxUnlocked=best+1`)
- **v2.96.0 (Google login ในแอป Android native)** + store prep (privacy.html, appicon_512, STORE_LISTING, Signed AAB workflow — build ผ่านแล้ว):
- **v2.96.0 (Native Google login สำหรับแอป Android):** เว็บ (Chrome) ล็อกอิน Google ได้แล้ว แต่ในแอป APK (WebView) Google บล็อก + redirect ไม่กลับแอป → ทำ native flow: `Cloud.native()` ตรวจ Capacitor, `signInWithOAuth({redirectTo:'com.mochimayhem.game://login-callback',skipBrowserRedirect:true})` → เปิด `Browser.open` (Custom Tab) · `Cloud.bindDeepLink()` ดัก `App.addListener('appUrlOpen')` แล้ว `exchangeCodeForSession(code)` (flowType `pkce`) · `Cloud._onLogin` hook ให้ scene ซิงค์+rebuild settings · เพิ่มปลั๊กอิน `@capacitor/app`+`@capacitor/browser` (package.json) · `scripts/set-android-landscape.mjs` inject `<intent-filter>` scheme `com.mochimayhem.game` (idempotent) · **แก้ build APK ที่ล้มเหลว**: `android-actions/setup-android@v3` เพิ่ม `packages: 'platform-tools platforms;android-34 build-tools;34.0.0'` (เลี่ยง default 'tools' ที่ถูกถอด) · **verified 0 error (web path)** · **⚠️ เจ้าของต้อง: (1) เพิ่ม redirect URL `com.mochimayhem.game://login-callback` ใน Supabase Auth allowlist (2) รอ build APK ตัวใหม่เสร็จ แล้วลง APK ใหม่ (ปลั๊กอิน native ต้องอยู่ในตัว APK — live update ไม่พอ)**
- **v2.95.1 (แก้ปุ่มล็อกอินกดแล้วเงียบ):** Google login ไม่ต้องพึ่ง Anonymous (anon ปิดอยู่ เลยเด้งออกเงียบ) · เพิ่ม `menuToast` แจ้งผลในเมนู (showBanner ผูกกล้องโลก ไม่โชว์ในเมนู) · `ensureClient()` แยกจาก init (สร้าง client โดยไม่ sign-in)
- **v2.95.0 (Cloud Save + เข้าสู่ระบบ Google):** ต่อยอด `Cloud` (Supabase anon เดิม) เพิ่มบัญชีถาวรด้วย Google — `Cloud.isGoogle()`/`accountLabel()`/`signInGoogle()` (ลอง `linkIdentity` ผูก Google เข้าบัญชี anon ปัจจุบันเพื่อคง progress, fallback `signInWithOAuth`)/`signOut()` · `buildSettings` เพิ่มแถว "บัญชี Cloud Save" (ปุ่มเข้าสู่ระบบ/ออกจากระบบ + โชว์อีเมล) เรียก `doGoogleAuth(isG)` (scene method) · หลัง OAuth redirect กลับมา → syncCloud รวมเซฟตาม rev อัตโนมัติ (create ~line 2297) · index.html โหลด supabase-js SDK แล้ว · **verified 0 error: buildSettings render ok** · **⚠️ เจ้าของต้องตั้งค่าใน Supabase dashboard เอง (ครั้งเดียว): เปิด Google provider (ใส่ OAuth client id/secret) + เพิ่ม redirect URL `https://hardza1230.github.io/Survival-like-Mobile-Game/` ใน Auth allowlist — ไม่งั้นกดล็อกอินจะ error**
- **v2.94.0 (Tutorial interactive — ครูเบอร์รี่):** ผู้เล่นใหม่เข้าเล่นด่านจริงเลย (launchStageLoadout → begin()+startCoach แทน startTutorial overlay) · `coachSteps()` 6 บท (เดิน/kill3/dash/levelup/unique(timeout16)/tap-จบ) · `startCoach/_coachNext/_coachFinish/drawCoachBubble/tickTutorialCoach` · บับเบิลครูเบอร์รี่ (`card_berry`) บนจอ + 🎯 goal อัปเดตสด · check เดินหน้าอัตโนมัติเมื่อทำสำเร็จ (delayedCall 700ms) · counters `_coachDash` (doDash)/`_coachUnique` (useCharacterSkill) · เรียกใน update + cleanup ใน exitStage · static `drawTutorial` (เมนู วิธีเล่น replay) เปลี่ยนเป็นเบอร์รี่ (card_berry, ชื่อ) · **verified 0 error: 6 บท, card_berry มีจริง, เดินหน้าครบจบ tutorialDone**
- **v2.93.0 (currency sources — reward active play):** `currencyTierFor()` (นรก→legend/ยาก→epic/ปกติ→rare, ปรับตาม stageIndex) + `grantCurrencyReward(n,tier,head)` (แจกแน่นอนข้าม 28% miss + แบนเนอร์) · **onBossDown** = การันตี `2+stageIndex+(diff-1)*2` orb · **killEnemy** มินิ=การันตี 1-2, elite=50% ลุ้น 1 · **verified 0 error: hell→legend gave3, normal→rare** · (เดิม currency มาจาก loot ดรอป ~28% + Bazaar เท่านั้น)
- **v2.92.0 (PoE Phase 4 — NPC Bazaar):** `buildBazaar` (menuScreen 'bazaar', gLoadout) 3 แท็บ (`_bazTab` buy/gamble/sell) · `bazaarStock()` หมุนเวียนรายวัน (`mulberry32(bazaarDaySeed())` — 3 ของฐาน + 3 currency) · **ซื้อ** `bazaarBuyGear`/`bazaarBuyCurrency` (`GEAR_BUY`/`CURRENCY_BUY` ราคา Sugar) · **เสี่ยงดวง** `bazaarGambleGear` (🍬180 tier weighted 50/30/15/5, ซ้ำ→เศษ+currency) + `bazaarGambleCurrency` (🍬120, 2-4 orb) · **ขาย** `bazaarSellShards` (เศษ→🍬×2) + `bazaarSellCurrency` (60% ราคาซื้อ) · **verified 0 error: 3 แท็บ ok, ซื้อของ/currency, gamble spent 180, ขายเศษ 10→+20** · **ถัดไป Phase 3 stash instance (รื้อ inventory หลายชิ้น/แบบ) → Phase 5 P2P (อนาคต)**
- **v2.91.0 (PoE Phase 2 — currency crafting):** `CURRENCY` 8 orb (transmute/alt/regal/chaos/exalt/divine/annul/scour) + `currencyDef` · `RARITY_SLOTS`{common0/magic1+1/rare3+3} + `RARITY_LABEL` + `baseDefaultRarity` · `Save.data.currency`+`data.gearRarity` + methods (`currency/addCurrency/spendCurrency/gearRarity/setGearRarity/setAffixes`) · `applyCurrency(key)` คราฟต์ไอเทมที่สวม (`gearSlot`) — transmute common→magic, regal magic→rare, exalt เพิ่ม affix, chaos reroll, divine สุ่มค่าคง tier, annul ลบ1, scour ล้าง · `_addAffixTo` เติมตามช่องว่าง prefix/suffix · `buildCraftBench` (menuScreen 'craft', gLoadout) โชว์ไอเทม+rarity+affix+ปุ่ม currency · `rollCurrencyDrop(tier)` ดรอปพร้อม loot (28% ว่าง; นรก=exalt/divine) ใน collectLoot · **verified 0 error: transmute→magic1, regal→rare2, exalt→3, chaos reroll, scour→common0, legend drops orb สูง, bench+applyMeta ok** · **ถัดไป Phase 4 Bazaar (ขาย/ซื้อ/gamble) → Phase 3 stash instance**
- **v2.90.0 (PoE Item Phase 1 — prefix/suffix + tier · ตาม `docs/POE_ECONOMY_PLAN.md`):** รื้อ `AFFIX_POOL` ใส่ `kind:'prefix'|'suffix'` + `pre/suf` (คำชื่อ) + `tiers:[T1..T5]` (แต่ละ [lo,hi]) · prefix(4)=dmg/crit/critdmg/cd · suffix(5)=hp/def/spd/pick/regen · `BASE_BEST_TIER`{legend1/epic2/rare3/common4} = ฐานดีกว่าโรล tier สูงกว่า · `rollTier(best)` ถ่วง t*t (T1 หายาก) · `rollAffixes` แบ่ง prefix/suffix สมดุล (n1 สุ่มฝั่ง, n2 1+1, n3 2+1) เก็บ `{id,t,v}` · `gearAffixName(base,affs)` = "prefix ฐาน แห่งsuffix" · buildGear โชว์ 🏷️ชื่อไอเทม + affix พร้อม T{t} · **verified 0 error: epic dist T2 37/T3 105/T4 179/T5 279, prefix+suffix สมดุล, ชื่อ+apply+buildGear ok** · **หมายเหตุ: เซฟเก่า affix {id,v} ไม่มี t → default T3 (harmless) · ถัดไป Phase 2 currency crafting → Phase 4 Bazaar → Phase 3 stash instance**
- **v2.89.0 (Tutorial ครูโมโม่ — เริ่มทำ Player Journey Phase 0):** รื้อ `drawTutorial`/`advanceTutorial` เป็นครูโมโม่พูดสอน — `tutorialPages()` 9 บท (ทักทาย/เดิน/อาวุธ auto/Dash/เลเวลการ์ด/ปรุงเมนู/Unique/Sugar/พร้อมลุย) · รูป `card_momo` มุมล่างซ้าย (เด้ง tween) + บับเบิลคำพูดชมพู · ปุ่ม "ข้าม" (`_tutSkip` hit-test ใน advanceTutorial) · เข้าอัตโนมัติครั้งแรก (`!tutorialDone` ใน startRun launch) + เมนู gMore→วิธีเล่น · **verified 0 error: 9 บท, card_momo มีจริง, เดินครบจบตั้ง tutorialDone** · **หมายเหตุ: player journey เหลือ #2 ระบบเป้าหมาย/quest, retention streak, cloud save**
- **v2.88.0 (E — Affix/loot chase):** `AFFIX_POOL` (8 stat: dmg/hp/crit/cd/spd/def/pick/regen, lo-hi range) + `rollAffixes(tier)` + `AFFIX_COUNT`{start0/common1/rare2/epic2/legend3} · `Save.data.gearAffix[id]` + `ensureAffix/rerollAffix/gearAffixes` · applyMeta ensure+apply affix ต่อชิ้นที่สวม (ยกเว้น start) · buildGear โชว์ affix ของชิ้นที่สวม + ปุ่ม 🎲 reroll (`AFFIX_REROLL_COST`=🔩15 · `rerollGearAffix`) · **verified 0 error: rare=2 affix, apply/reroll/buildGear ok**
- **v2.87.0 (ยกเครื่องอุปกรณ์ A-D):** **A Set Bonus** `GEAR_SETS`{chef,wind} + `gearSetCounts()` — item มี `set` tag (chef=w_cleaver/ar_royal/gl_dragon, wind=bo_wind/am_moon/ri_diamond) · โบนัส 2/3 ชิ้นใน applyMeta · **B Legend tier** (`TIER_LABEL.legend`) ของตำนานมี `fx`: lg_starcleaver(execute→lowHpDmg), lg_phoenix(revive→`Save.gearReviveCount()`+`_reviveLeft`), lg_comet(lifekill) — cost:0 (ได้จากดรอป/หลอม เท่านั้น) · **C กฎเหล็ก** `rollFieldGearTier` เพิ่ม legend ตาม difficulty (นรกเท่านั้น) · **D Shards** `Save.data.shards`+`addShards/spendShards` · ของซ้ำ (collectLoot else + gacha dup) → 🔩 · `forgeLegend()` (🔩45 สุ่ม legend ที่ยังไม่มี) ปุ่มในหน้า gear · gacha roll legend 5% · buildGear โชว์ shards+set status+ปุ่มหลอม · **verified 0 error: chef 3/3, phoenix revive=1, hell legend~4.5%, forge/buildGear ok**
- **v2.86.0 (ระบบครัวเป็นแกน A+B+C):** สูตรเด่น ⭐ `sig` ต่ออาวุธ · `Save.data.cookbook`+`discoverDish/cookbookHas/cookbookCount` · cookDish รางวัลค้นพบ (+12/+30 sig) · `buildCookbook` (gCodex) · drawRecipePanel ⭐/✓/📖
- **v2.86.0 (ระบบครัว/สูตรเป็นแกน — ทำครบ A+B+C):** `COMBOS` mark `sig:true` = **สูตรเด่น ⭐** ต่ออาวุธ (ผลแรงกว่า เช่น dmg+13%+crit / cd-10%+regen) · สูตรธรรมดาปรับเป็นสายเล่นชัด (build variety) · `Save.data.cookbook` (ถาวรข้ามรัน) + `Save.discoverDish(key,sig)`/`cookbookHas`/`cookbookCount` · `cookDish` ค้นพบครั้งแรก = รางวัล Sugar ถาวร (+12 ปกติ/+30 sig) + แบนเนอร์ 🆕 · `drawRecipePanel` โชว์ ⭐/✓/📖 · **หน้าเมนูใหม่ `buildCookbook` (menuScreen 'cookbook', เข้าจากกลุ่ม gCodex)** โชว์สูตรทุกตัวแยกตามอาวุธ ค้นพบ/ลับ · **verified: frost+haste=coldsnap(sig) ปรุง→cookbook+1 +🍬30, buildCookbook 0 error**
- **v2.85.0:** บอสด่าน 2/3/4 ตัวใหญ่ขึ้น (สเกล 0.88→1.18)
- **v2.63.0 (rework Mint + งาดำ + ซ่อนปุ่มรีเซ็ต — จาก feedback):** **Mint** basic เปลี่ยนจาก frost nova → **"ปาเข็มน้ำแข็ง"** (`castIceNeedle` route ใน castSkill frost เฉพาะ `character==='mint'&&basic`) เข็มเจาะทะลุ (`b.iceNeedle`+`b.pierceLeft` อ่านใน hitEnemy: แช่/แตกสะเก็ด/ลด pierce) · upgrade ids เดิม (power/rate/chill/linger, mut blizzard/permafrost) reinterpret เป็นสายเข็ม (chill=ทะลุ, linger=จำนวนดอก, blizzard=แตกสะเก็ด, permafrost=แช่นาน+bonus) · EVO_DESC.frost แก้เป็นเข็ม · **mint field aura เดิมคงไว้** (อ่าน skills.frost) · **Unique mint** (key `mintSanctuary`) → **"พายุหิมะเพชร (Diamond Dust)"** `castDiamondDust` พายุตามตัว tick 0.3s ฟาด+แช่+iframe · **งาดำ** เปลี่ยน `_sesShards` (จรวดโคจร+ยิง homing) → **`_sesField` วงเวทกระจกถาวร** (`vfx_magic_circle` เล็กช่วงแรก R=88+lvl*13) tick 0.4s ดาเมจในเขต + **ลบกระสุนศัตรูที่เข้าเขต (ward, ไม่สร้าง projectile)** · mirror basic cast route → `pulseOathField` (พัลส์กระแทกในเขต ไม่ยิง) เฉพาะ sesame · upgrade sesame reinterpret (pane=พลังพัลส์, radius=รัศมี) · EVO_DESC.mirror แก้เป็นพัลส์ · **Unique งาดำ** (key `oathMirror`) → **"โดมคำสัตย์ (Oath Dome)"** `castOathWard` เขียนใหม่: โดม ลดดาเมจ+iframe, ลบกระสุนในเขต, พัลส์กระแทก, กระจกแตกปิดท้าย (ไม่มี projectile สวนกลับ) · **ปุ่มรีเซ็ตเซฟ** ย้ายจากหน้า Hub → หน้า **ตั้งค่า** (buildSettings) ล่างสุด + ต้องยืนยัน **3 ครั้ง** (`_resetTaps`) · **หมายเหตุ: bot เล่นแค่ momo → mint/sesame ยังไม่ถูกเทสโดยบอท ต้องเล่นจริง**
- **v2.62.0 (อีก AI ทำ):** ฉากเปิดเคลื่อนกล้องผ่านอุโมงค์ขนมเข้าโลก (portrait light gate) `assets/opening_world_gate_v3.webp`
- **v2.59.0 (วงเวทกระจกใหม่ — จาก feedback "ดูเบี้ยว")** (เดิม):
- **v2.59.0 (วงเวทกระจกใหม่ — จาก feedback "ดูเบี้ยว"):** เดิมยืม `vfx_ring`(vfx_hit_ring) มาทำวงเวท → ย่อแบนวางพื้นแล้วบิด · เจ้าของส่งอาร์ตวงเวทสมมาตร 1254px (โปร่ง โทนขาว กลางโล่ง) → ย่อ 512×512 เก็บ alpha (สคริปต์ decode/area-average/encode ใน scratchpad) → `assets/generated/vfx_magic_circle.png` + คีย์ `vfx_magic_circle` ใน ASSET_IMAGES · เปลี่ยน 3 จุด: Oath Ward งาดำ (~2229), เขตยึดครอง capture `_captureRing`, สนามกระจก `castMirrorGlaze` (จาก setScale/256 → setDisplaySize เพราะอาร์ตใหม่ 512) · voidPull(หลุมดำ)/hit-ring อื่นคง vfx_ring · **ใบสั่งงาน `docs/ART_ORDER_MAGIC_CIRCLE.md` มี prompt (near-white/สมมาตร/tintable) เผื่อทำวงอื่น**
- **v2.58.0 (rework Mint/งาดำ + ลด HP บอส — จาก feedback):** เพิ่ม `tickCharSignature(dt)` (เรียกใน update ต่อจาก tickAura) = aura always-on ประจำตัว · **Mint:** `_mintField` สนามน้ำแข็งรอบตัว R=118+lvl*15 ทุก 0.4s ดาเมจ (4+lvl*1.7)×dmgMul (บอส/มินิ ×1.5) + แช่/ชะลอ non-boss · **งาดำ:** `_sesShards` 3 กระจกโคจร + ยิง homing bolt ใส่ nearestEnemy ทุก ~0.42-0.72s (shots=1+lvl/2, pierce lvl≥4) · cleanup `clearCharSignature()` ใน resetStageLoadout/exitStage/showMenu · ลด HP: บอสใหญ่ ×2.3→×1.75, มินิ ×1.3→×1.0 · **หมายเหตุ: bot เล่นแค่ momo → mint/sesame aura ยังไม่ถูกเทสโดยบอท ต้องเล่นจริง**
- **v2.57.0 (แก้จาก feedback เจ้าของ):** (1) "เสาเขียวยิงไกลโกง" = boss objects `crystal`(เล็งผู้เล่น)/`obelisk`(รัศมี) ใน `tickBossObjects` — ลด HP (crystal 105→68, obelisk 150→95, egg 80→70, mound 175→150) + ยิงช้าลง (crystal tick 2.0→2.7 speed 230→175, obelisk 2.8→3.4 นัด 8→6 speed 155→135) → หลบทัน+ทำลายได้ · (2) Mint สู้มินิ/บอสยาก เพราะแช่ไม่ได้ (`!isBoss&&!isMini`) = ได้แค่ดาเมจฐานต่ำ → frost `this.damage(e, (isBoss||isMini)?dmg*1.7:dmg)` ทั้ง 2 pulse (หลัก+evo) · **หมายเหตุ: nerf/บัฟ ปรับได้ง่ายที่ spawnBossObject HP + tickBossObjects fire**
- **v2.56.0 (แก้ Mint หด + telegraph dasher):** (1) Mint "ถูกบีบตอน idle" — ชีต action (`char_mint_frostleaf_sheet`) วาดตัวเล็กกว่าชีต run (`_run`) มาก → พอหยุดเดิน (ใช้ action sheet) ตัวหด ~1.5× · แก้: `CHAR_ACTION_SCALE={mint:1.5}` คูณสเกลใน `animatePlayer` เฉพาะตอน texture ≠ run key · (2) dasher เพิ่ม `e._dashTel` เส้นเตือนทิศพุ่ง (vfx_line เล็งผู้เล่น) ตอน state 'wind' (ยืด 0.42→0.5s) · cleanup ที่ dash-start/killEnemy/despawn กัน leak · **ถ้าตัวละครใหม่มีปัญหาชีต idle เล็กกว่า run ให้เพิ่มใน CHAR_ACTION_SCALE**
- **v2.55.0 (แก้บั๊กภารกิจ + จัดเมนู — จาก feedback):** (1) ภารกิจ purge "แกนคำสาป" เดิมโดนแค่ `bullets` overlap → ตัวที่ไม่ยิงกระสุน (thunder/frost/meteor/mirror) ทำลายไม่ได้ · แก้: `hitCratesInRadius` ทำดาเมจ `waveNodes` ด้วย (สกิล AoE ที่เรียก hitCratesInRadius เช่น thunder/frost/meteor โดนแกน) + proximity purify เร็วขึ้น (12%/0.4s ในระยะ 130) · (2) `HUB_GROUPS` + `buildHubGroup(key)` รวมปุ่ม Hub 11→6: ▶เริ่ม · 🍓นักสู้ · 🎒คลัง&พลัง(upgrade+gear) · 🎉กิจกรรม(daily+achievement+endgame) · 📖คัมภีร์(skills+bestiary) · ⚙อื่นๆ(settings+tutorial) · routing ใน buildMenuScreen (`HUB_GROUPS[s]`) · portrait cols 2 เมื่อ items>4
- **v2.54.0 (การ์ด Rarity + อ่านเร็ว):** `RARITIES` 4 ระดับ ranks 1/2/3/4 · rollBasicAttackUpgrades สุ่ม rarity · drawReadableChoiceCard สีเฟรม+badge ◆+Lv→jump · lock 550→300ms
- **v2.54.0 (การ์ด Rarity + อ่านเร็ว — จาก research Death Must Die + feedback "การ์ดจืด/อ่านนาน"):** `RARITIES` 4 ระดับ (common/rare/epic/legend, ranks 1/2/3/4, สี+weight) + `rollRarity()` · การ์ด atk/extra/passive/heal ใน `rollBasicAttackUpgrades` สุ่ม rarity → grant หลายเลเวลรวด (passive loop apply, heal ×) · `drawReadableChoiceCard` อ่าน `o.rarity`: สีเฟรม=rarity, badge '◆ ชื่อ +N', nameT โชว์ `→Lv` jump · ลด levelCardReadyAt 550→300ms · **mutation/evolution/awk ไม่มี rarity (binary)** · bot 0 error · **ถัดไปแนะนำ: ร้านในรัน (Brotato) / เทส balance rarity (legend +4 อาจ swingy)**
- **v2.53.0 (ลดความยากเหลือ 3 + auto-recommend):** `DIFFS` 5→3 (ปกติ/ยาก/นรก) · `recommendedDiff` + ปุ่ม "▶ เล่นเลย" · daily/endless/hell ปรับตาม 3 ระดับ
- **v2.53.0 (ลดความยากเหลือ 3 + auto-recommend):** `DIFFS` 5→3 ระดับ (ปกติ1.0/ยาก1.75/นรก2.8) · `diffMul` clamp เป็น DIFFS.length-1 · `recommendedDiff(idx)` จาก Save.power/recommendedPower (≥1.8→3, ≥1.15→2, else 1) · `openDifficultyChoice` มีปุ่ม "▶ เล่นเลย" (auto diff, กดเดียว) + 3 แถวเลือกเอง (แถวแนะนำมีป้าย ⭐) · แก้ dailySpec diff→2+(seed%2), endless min(3), achievement hell v>=3 · **กฎเหล็กยังอยู่: ยิ่งยากรางวัลยิ่งดี** · เซฟเก่าที่มี diffBest 4/5 ยังใช้ได้ (แสดง ✓/นับ hell ปกติ)
- **v2.52.1 (cleanup):** ลบ dead code `bearQuake`, `bestiaryAllBonus`
- **v2.52.0 (พัฒนา Rank → Rank Perks):** ทุก rank = 1 RP (`Save.rankPointsTotal/Free/Spent`, `perkLvl`, `buyPerk`, `respecPerks`, `data.rankPerks`) ลงใน `RANK_PERKS` 7 แบบ: reroll(+reroll/ด่าน) · banish · boxLuck(×drop) · greed(×Sugar reward) · vigor(+HP%) · might(+dmg%) · revive(ฟื้น 1 ครั้ง/ด่าน @45% HP) · เสียบผล: reroll/banish/revive ที่ init reset ด่าน (`_reviveLeft`), boxLuck ใน killEnemy drop, greed ใน rollStageReward sugar, vigor/might + `rankSugarMul`/`_boxLuckMul` ใน applyMeta, revive ต้น `die()` (iframe 2.2) · หน้า `buildRankPerks` (menuScreen 'perks', เข้าจากปุ่ม 🏅 ใน buildUpgrade) + ปุ่ม respec · **bot เทส 0 error** · **ถัดไป: เทสจริง balance perks + power fantasy**
- **v2.51.0 (Evolution เปลี่ยนกลไกจริง — แบบ Survivor.io):** `b.evolved` ของแต่ละตัวเปลี่ยนพฤติกรรมยิง ไม่ใช่แค่ +เลข · sprinkle(evo=pierce+homing) · thunder(evo=+strikes/chain/range ทั้งจอ) · frost(evo=delayedCall โนวาระลอก 2 + always shatter + r×1.25) · meteor→`castBearDonut(...,evo)` (hits+2, r×1.2, ทุกลูก final=ช็อคเวฟ) · mirror→`castMirrorGlaze` อ่าน `basic.evolved` ยิง auto-bolt ทุก 3 tick + max/r/dur เพิ่ม · การ์ด evolution มี `EVO_DESC` ต่อ skill บอกกลไก · **ถัดไปที่แนะนำ: จูน power fantasy ช่วงกลางรัน + เทสจริงว่า evolved แรงเวอร์ไป/พอดีไหม**
- **v2.50.0 (โชว์สูตร recipe/evolution — แบบ Survivor.io, จาก research):** เพิ่ม `drawRecipePanel(cont,y)` — พาเนล "🍳 สูตรที่ปรุงได้" list สูตรของตัวละคร (basic skill + passive ที่ต้องเก็บ = เมนู) พร้อมสถานะ locked(เทา)/ready(เขียว)/cooked✓(ทอง) · เรียกใน `openLevelUp` (เหนือการ์ด, เฉพาะ character-first) + `buildPause` · เปลี่ยน recipe จากของซ่อน → เป้าหมายที่เห็นและไล่ล่าได้ · **หมายเหตุ research: genre นี้หัวใจคือ evolution "อาวุธ Lv5 + support passive = ร่างพิเศษ" (Survivor.io) — เรามีโครงแล้ว ขั้นต่อไปที่แนะนำคือทำ evolution เปลี่ยน "กลไก" จริง ไม่ใช่แค่ +เลข + จูน power fantasy ช่วงกลางรัน**
- **v2.49.0 (แก้การ์ด + เรทกล่อง — จาก feedback เจ้าของ):** รื้อ `rollBasicAttackUpgrades` — การันตี 1 attack + 1 passive/รอบ, ถ่วงน้ำหนักใบที่ rank สูงให้เจอน้อยลง (แก้ +ยิงออกถี่), เพิ่ม Overdrive/Combat Tempo (wired: basicDmg/ranks.overdrive + cdOf/ranks.tempo) เป็นตัวเลือกทุกตัว pool ≥6 · passive boost คู่ปรุงเมนู (ป้าย 🍳) · **Mutation/Evolution เป็นช่วงพิเศษแยกจอ** (mutation ทั้งจอ gate mastery≥5 · evolution การ์ดเดียว gate mastery≥12) + แบนเนอร์ · **กล่องสูตรลับ = RNG drop จากฆ่ามอน** (elite 5% · ธรรมดา 0.6% · cap 3 กล่อง ใน killEnemy) แทน timer เดิม · ลบ `spawnMapBox` (`_boxAcc` เหลือค้างไม่มีผล)
- **v2.48.0 (กล่องสุ่มอัปเกรดในด่าน — จาก feedback เจ้าของ):** กล่องในแมพ (สี cyan, `spawnMapBox` ทุก ~26-38→40-58 วิใน tickStage) = เลือกเอง 1 ใบ (`rewardKind='pick'` → openLevelUp) · กล่องมินิบอส (ม่วง, `rewardKind='mini'`) = สุ่มให้ + **อนิเมชันสล็อตหมุน** (`openRollBox`/`playRollAnimation`/`landRollBox` — reel หมุนช้าลงจนหยุดที่ winner + วาบ/เสียง, `state='rolling'` หยุดเกมชั่วคราว) · รางวัลใช้ `rollUpgrades(1)` → ทำงานทุกตัวละคร · `openMiniSkillChest` เดิมกลายเป็น dead code · reset `_boxAcc` ตอนโหลดด่าน
- **v2.47.0 (recipe ทุกตัว + ชะลอ leveling — จาก feedback เจ้าของ):** recipe ทำงานกับ character-first ได้แล้ว (syncBasicAttack ตั้ง `skills[สกิลพื้นฐาน]` → checkCombos เห็น) · ขยาย `COMBOS` เป็น 15 เมนู แต่ละสกิลพื้นฐานจับคู่ passive หลายแบบ + `effect(p)` ต่างกัน (cd/crit/armor/regen/spd) · cookDish เรียก effect + re-clamp · ชะลอ leveling: xpNext เริ่ม 7→10, โต ×1.20+3 → ×1.26+4 · **หมายเหตุ feedback ที่ยังเหลือ: การ์ด character-first ลูกเล่นน้อย (pool มีแค่ 4 upgrade/ตัว → +shots ออกถี่) — อาจต้องเพิ่ม upgrade/ทำ passive มีบทบาทมากขึ้น**
- **v2.46.0 (ยกทุกตัวเป็น Character-first + พักเบอร์รี่):** เพิ่ม `BASIC_ATTACKS` ให้ `mint`(Frost Core Nova/frost) · `taro`(Rift Bolt Compass/thunder) · `sesame`(Oath Mirror Field/mirror) → ตอนนี้ตัวละครที่เล่นได้ **5 ตัวเป็น character-first ทั้งหมด** (เริ่มด่านด้วยอาวุธประจำตัว มี upgrades/mutation/evolution) · ต่อสายอัพเกรดเข้ากับ cast จริง: frost(chill=รัศมี, linger=เวลา, blizzard/permafrost), thunder(arc=ชิ่ง, surge=จุดฟาด, chainlord/stormcaller ผ่านตัวแปร `basic` ใน castSkill), mirror(pane=บานสะท้อน, radius, fortress/retaliate — ส่ง `basic` เข้า `castMirrorGlaze`) · **พักเบอร์รี่คอร์**: ลบออกจาก `CHAR_ORDER` (คงนิยามใน `CHARACTERS` กันเซฟพัง) + `Save.load` sanitize `data.character` ที่ไม่อยู่ใน CHAR_ORDER → คืนเป็น momo
- **v2.46.0 (ยกทุกตัวเป็น Character-first + พักเบอร์รี่):** เพิ่ม `BASIC_ATTACKS` ให้ `mint`(Frost Core Nova/frost) · `taro`(Rift Bolt Compass/thunder) · `sesame`(Oath Mirror Field/mirror) → ตอนนี้ตัวละครที่เล่นได้ **5 ตัวเป็น character-first ทั้งหมด** (เริ่มด่านด้วยอาวุธประจำตัว มี upgrades/mutation/evolution) · ต่อสายอัพเกรดเข้ากับ cast จริง: frost(chill=รัศมี, linger=เวลา, blizzard/permafrost), thunder(arc=ชิ่ง, surge=จุดฟาด, chainlord/stormcaller ผ่านตัวแปร `basic` ใน castSkill), mirror(pane=บานสะท้อน, radius, fortress/retaliate — ส่ง `basic` เข้า `castMirrorGlaze`) · **พักเบอร์รี่คอร์**: ลบออกจาก `CHAR_ORDER` (คงนิยามใน `CHARACTERS` กันเซฟพัง) + `Save.load` sanitize `data.character` ที่ไม่อยู่ใน CHAR_ORDER → คืนเป็น momo · **หมายเหตุ: ทุกตัวเป็น character-first แล้ว = recipe prototype (v2.44) แทบไม่ทำงานกับใครเลย เพราะไม่มีใครเก็บสกิลรอง — ต้องทำ recipe ให้ basic attack นับเป็นวัตถุดิบถ้าจะเดินสายทำอาหารต่อ**
- **v2.45.0 (ยุบแหล่งสแตตทับซ้อน — จากรีวิวทิศทางเกมกับเจ้าของ):** Bestiary + Ascension เลิกให้ค่าพลังดิบ (HP/ATK/DEF) · Bestiary → ปลดขั้นรับ 🍬 Sugar ทันที (`Save.addKill` คืนจำนวน Sugar, killEnemy โชว์แบนเนอร์) · Ascension → คงรับ Sugar ก้อนใหญ่ตอน Ascend · `applyMeta` ตัดบล็อก bestiaryAllBonus + ascension stat ออก (ฟังก์ชัน bestiaryAllBonus เหลือเป็น dead code) · UI คัมภีร์/Endgame แก้ข้อความเป็น Sugar · **เหลือ 3 เสาพลังที่ผู้เล่นเลือกเอง: Rank / Talent เฉพาะตัว / Gear** · ⚠️ พลังฐานลดลงเล็กน้อย รอ playtest จริงเพื่อจูนชดเชย
- **v2.45.0 (ยุบแหล่งสแตตทับซ้อน — จากรีวิวทิศทางเกมกับเจ้าของ):** Bestiary + Ascension เลิกให้ค่าพลังดิบ (HP/ATK/DEF) · Bestiary → ปลดขั้นรับ 🍬 Sugar ทันที (`Save.addKill` คืนจำนวน Sugar, killEnemy โชว์แบนเนอร์) · Ascension → คงรับ Sugar ก้อนใหญ่ตอน Ascend · `applyMeta` ตัดบล็อก bestiaryAllBonus + ascension stat ออก (ฟังก์ชัน bestiaryAllBonus เหลือเป็น dead code) · UI คัมภีร์/Endgame แก้ข้อความเป็น Sugar · **เหลือ 3 เสาพลังที่ผู้เล่นเลือกเอง: Rank / Talent เฉพาะตัว / Gear** · ⚠️ พลังฐานลดลงเล็กน้อย รอ playtest จริงเพื่อจูนชดเชย
- **v2.44.0 (Recipe prototype — จุดขายธีมทำอาหาร):** ปลุกระบบ COMBOS ที่เคยตาย (`checkCombos` เป็น no-op + ไม่มีที่อ่าน `comboFlags`) ให้กลับมา = "ระบบทำอาหาร" · สกิลโจมตี=วัตถุดิบ · สกิลติดตัว=เครื่องปรุง · ครบคู่=ปรุงเมนู (`cookDish` บัฟ dmg +5%/เมนู + แบนเนอร์ 🍳 + เสียง, ครั้งเดียวต่อเมนูผ่าน `combosOwned`) · การ์ดเลเวลอัพป้าย "🍳 ปรุงเมนูได้!" · **หมายเหตุ: Momo/Berry (character-first ไม่เก็บสกิลรอง) แทบไม่ได้ปรุง — ถ้าจะทำเต็มระบบต้องให้ basic attack นับเป็นวัตถุดิบ**
- **v2.38.0:** เพิ่ม `berry` เป็นตัวละครที่ 6 แยกจาก Momo · อาร์ต 2D vector-like clean outline/flat color: `card_berry.png`, action 8×1 และ run 4×3 · signature `jamCannon` (rocket) · Unique `jamOverdrive` เป็น targeted multi-salvo พร้อม talent `pressurizedJam` · Momo และเซฟเดิมไม่ถูกแทนที่
- **v2.37.0:** เวฟปกติ Chapter 1 สุ่มภารกิจครบ 4 แบบต่อรันโดยไม่ซ้ำ: survive, hunt target Elite, purge cursed cores, capture zone · เพิ่ม progress HUD, objective arrow, Sugar bonus และ cleanup lifecycle · ไม่แทรกเวฟมินิบอส/บอส
- **v2.36.2:** กล้องบอส/มินิบอสซูมออกด้วย lerp ต่อเฟรม (×0.58/×0.68) · บริวารบอสเล็กกว่ามินิบอสจริงและถูกปรับ HP/ดาเมจให้มีน้ำหนัก
- **v2.36.1:** เพิ่ม cutscene แพนกล้องเผยตัวมินิบอสและแก้ state เป็น `mini` ให้ HUD/ลูกน้องทำงานถูกต้อง
- **v2.35.2:** หน้าโหลดมีลูกกวาดลอย แสงเรือง และ safe-area padding สำหรับมือถือ
- **v2.35.1:** ยกเลิก white fill ตอนศัตรู/บอสรับดาเมจที่ทำให้ artwork กระพริบจนมองไม่เห็น · ใช้ impact ring, particle, damage number และ hit squash แทน · การเตรียมพุ่งใช้เส้นเล็ง/ท่า animation โดยไม่ฟอกสี sprite
- **v2.35.0:** เชื่อม lore หลัง The Great Hunger เข้าสู่ Chapter 2 · เปิด C2-1 Fermented Canopy · เพิ่มศัตรูสวนหมัก 6 บทบาท, Sporewarden Mantis, The Rootmother, prop/background/cover ใหม่ · ทดลอง 2.5D แบบ mobile-safe ด้วย parallax 3 ชั้น, หมอก, foreground leaves, perspective scale และ Y-depth เดิม · เซฟที่จบ Chapter 1 ปลดล็อกบทใหม่อัตโนมัติ
- **v2.34.0:** เปลี่ยนภาพด่าน 5 ครบชุด — `boss5_sovereign` + `mb5_banquet_executioner` + มอนสเตอร์ใหม่ 5 บทบาทเป็น action sheet 4×2 · boss/mini pose ผูกกับท่าโจมตีและ phase · มอนสเตอร์ยิง/พุ่งใช้ attack pose · ทุกตัวมี defeat ghost frame · คง phase gate/อมตะระหว่างเปลี่ยนเฟส
- **v2.33.0:** ด่าน 3–4 ได้พร็อพห้อง บอส action sheet 4×2 และแพตเทิร์นเฉพาะ Chili Engine/Frost Prison · เพิ่ม field gear Common/Rare/Epic และแท็บคัมภีร์ไอเทม · เพิ่ม Endgame ที่ปลดหลัง Mastery ครบ: Ascension, Midnight Kitchen Endless, checkpoint, local leaderboard และ The Echo of Hunger ทุก 3 รอบ · `scripts/validate-balance.mjs` ตรวจ power/difficulty/endless contract
- **v2.32.3 (แก้จาก feedback เจ้าของ):** (1) **บั๊ก pause แล้วเวฟไม่มา** — `onWaveCleared` ใช้ `this.time.delayedCall(3400,…)` แต่ `togglePause` เดิมหยุดแค่ physics นาฬิกา `this.time` ยังเดิน → timer นับถอยหลังเวฟถัดไปยิงตอน state='paused' แล้ว `_busy()` เป็น false → เวฟหาย · แก้: `togglePause`/`exitStage` ตั้ง `this.time.paused=true/false` ด้วย · (2) **จัด HUD บน** — ปุ่ม speed/pause/mute รวมกลุ่มมุมขวาบน (cbY=pad+14) · หลอด HP/XP สั้นลงเว้นที่ปุ่ม (drawBars bw=(W-112)-bx) · ข้อมูล 2 บรรทัด: Lv(pad+34)/☠kills(pad+56) ซ้าย · timeTxt(pad+34)/stageTxt(pad+56) กลาง · 🍬sugar ขวา · stageTxt ตัด ⚡rating ออก, killTxt ตัดคำ "ลูกน้อง" · pips ขยับขึ้น pad+80
- **v2.32.2 (แก้บั๊ก):** `TAU is not defined` ตอนสู้บอสด่าน 5 (The Great Hunger) — Game scene (VFX บอส เช่น เกลียว/สุญญะ/eclipse บรรทัด ~2613/3100/4365+) อ้าง `TAU` แต่เดิมประกาศเฉพาะใน `Boot.create` → **ย้าย `const TAU=Math.PI*2` เป็น global ระดับบนสุด** · index.html โหลด `game.js?v='+Date.now()` กันแคชค้าง
- **v2.32.2 (แก้บั๊ก):** `TAU is not defined` ตอนสู้บอสด่าน 5 (The Great Hunger) — Game scene (VFX บอส เช่น เกลียว/สุญญะ/eclipse บรรทัด ~2613/3100/4365+) อ้าง `TAU` แต่เดิมประกาศเฉพาะใน `Boot.create` → **ย้าย `const TAU=Math.PI*2` เป็น global ระดับบนสุด** · index.html โหลด `game.js?v='+Date.now()` กันแคชค้าง
- **v2.28.1 (Boss Phase Gates):**
- **v2.28.1:** เพิ่ม Phase Gate กลางให้บอส/มินิบอสทุกด่าน · ดาเมจหยุดตรง HP threshold ของเฟสถัดไปและล็อกทันที ป้องกันการโจมตีหลายครั้งในเฟรมเดียวข้ามเฟส · บอสเป็นอมตะพร้อมโล่ภาพระหว่าง transition แล้วปลดเมื่อเปลี่ยนเฟสจบ · The Great Hunger จึงเล่นครบ 4 เฟสเสมอ
- **v2.28.0:** สร้างด่าน 5 เตาอบมงกุฎแห่งความหิวเต็มรูปแบบ · ศัตรูเฉพาะธีม 5 บทบาท + เวฟเฉพาะด่าน + props เตามงกุฎ/ตราคำสาป · แทนบอสเชฟขมด้วย **The Great Hunger · ราชันผู้กลืนรส** อาร์ตโปร่งใสใหม่ ออร่า/บริวารโคจร ฉากเปิดตัวและฉากตายเฉพาะ · บอส 4 เฟส 7 ท่า โดยใช้ telegraph ชัดและคุมจำนวนวัตถุเพื่อมือถือ
- **v2.27.1:** ซ่อม `assets/generated/boss2_clogmaw_sheet.png` ซึ่งโครงสร้าง PNG เสียกลางไฟล์จนบอสด่าน 2 เป็นสี่เหลี่ยมดำ/ขาวตอนโดนตี · สร้างชีต RGBA 1024×512 ใหม่ครบ 8 เฟรมจากอาร์ตโปร่งใสต้นฉบับ · `drainBossPose` ใช้เฟรม 0–7 โดยตรงแล้ว
- **v2.27.0:** ด่าน 4 คุกเย็นน้ำตาลมีศัตรู PNG โปร่งใสเฉพาะธีมครบ 5 บทบาท: `e_ice_wisp`, `e_ice_shard`, `e_ice_caster`, `e_ice_bomber`, `e_ice_guardian` · map เข้า basic/fast-dasher/shooter/bomber/tank-siege พร้อม roleName, optical scale, hitbox และ Elite · การชน/กระสุนน้ำแข็งติด Frostbite ชะลอช่วงสั้น
- **v2.26.0:** ด่าน 3 ห้องเครื่องพริกเพลิงมีศัตรู PNG โปร่งใสเฉพาะธีมครบ 5 บทบาท: `e_fire_ember`, `e_fire_chili`, `e_fire_grinder`, `e_fire_bomber`, `e_fire_golem` · map เข้า basic/fast-dasher/shooter/bomber/tank-siege พร้อม roleName, optical scale, hitbox และ Elite ของด่าน 3 · ไม่ย้อมศัตรูพื้นฐานแล้ว
- **v2.25.3 (แก้จาก feedback เจ้าของ):** `sprinkle` — `homing=0` (วิ่งตรงไม่โค้ง) · scale เล็กลง (0.12+lvl*0.008) · life ยาวขึ้น (1.9/aw2.2) กันกระสุนหายกลางทางตอนยิงไกล
- **v2.25.2 (แก้จาก feedback เจ้าของ):** สกิลเฉพาะตัวโมโม่ (berryRebound) เอา `b.homing=0` (เลิกเป็น homing missile) กลับไปยิงรอบทิศ (radial `velocityFromRotation`) เหมือนเดิม + คง `b.bounce` (โดนแล้วเด้งไปตัวถัดที่ใกล้สุด)
- **v2.25.1 (แก้จาก feedback เจ้าของ):** `sprinkle` = **ปืนกล 1-hit** · `pierce=false`,`bounce=0` (โดนแล้วหายทันที) · เพิ่มจำนวนนัด/ชุด (4/6/8/11, aw16) + gap สั้น (52/aw38) รัวถี่ · SKILL_TIERS/role/awaken desc อัปเป็นสาย "รัวเร็ว เบา" (เลิก pierce/bounce ในคำอธิบาย)
- **v2.25.0 (แก้จาก feedback เจ้าของ):** สกิล `sprinkle` — projectile เป็นเมล็ด proj_sprinkle สีรุ้งสลับสี (`RAINBOW[]` cycle ต่อนัด) · เร็วมาก (speed 980/aw1180) แต่ "เบา": ตัวเล็กลง, life สั้น (0.85/1.1), homing เบาลง
- **v2.24.0 (แก้จาก feedback เจ้าของ):**
  · **ปุ่มเฉพาะตัว = ไอคอนล้วน:** `uniqueTxt` เหลือแค่ emoji (26px) เอาคำ "เฉพาะตัว Lv" ออก ทั้ง buildHUD + `refreshUniqueSkillUI`
  · **สกิลเฉพาะตัวโมโม่ (berryRebound):** เปลี่ยนจาก `b.chain` (สายฟ้า chainFrom แบบทาโร่) → `b.bounce`+`b.homing` = เมล็ดพุ่งเด้งหาศัตรูตัวใกล้ ๆ อย่างรวดเร็ว (bounce redirect ใน hitEnemy) · bounce=ul>=4?3:ul>=3?2:1
- **v2.23.0 (แก้จาก feedback เจ้าของ):**
  · **Reroll/Banish ตอนเลเวลอัพ:** `REROLL_MAX`=3 / `BANISH_MAX`=2 ต่อด่าน (รีเซ็ตใน startRun) · ปุ่ม 🎲 สุ่มใหม่ (`doReroll`) + 🚫 ลบสกิล (`toggleBanishMode`→`banishCard`) วาดด้วย `drawLevelActionBar(y)` ล่างการ์ด · `this.banishedKeys` เก็บ `'a:'+key`/`'p:'+key` ที่ลบ → `rollUpgrades` ข้าม (skip continue ในลูป SKILLDEFS/PASSIVES) · `pickCardAt` เช็ก `lvlActionBtns` ก่อน + โหมด banish แตะการ์ด=ลบ · reroll/banish เรียก `openLevelUp` ใหม่ (ไม่ลด pendingLvl)
  · **ลดตัวตีไกลเวฟแรก:** drain[0]/drain[2]/profiles[2] เอา shooter ออก (เหลือ basic/fast) — 3 เวฟแรกเน้นประชิด
  · **HUD:** ป้ายเลเวลสกิลบนแถบล่าง = จานพื้นเข้ม+ตัวใหญ่ 11px+ขอบ (`buildSkillBar`) · ย้ายปุ่มเฉพาะตัว (`uniqueBtn`) จากซ้ายปุ่มพุ่ง → **เหนือ**ปุ่มพุ่ง (w-58, H-78-80) แก้ทั้ง buildHUD + onResize
  · **Near-death tension (Fun #6):** `tickNearDeath(dt)` เรียกใน update · HP<30% → `lowHpVig` (vignette tint แดง depth41) เต้น alpha ตาม sin ถี่ขึ้นเมื่อวิกฤต + `Sfx.heartbeat(sev)` + shake เบา · hysteresis คืน >30% ซ่อน · ซ่อนใน die()/hudVisible(false)
- **v2.22.0 (ระบบเลือกความยาก + กฎเหล็ก):** `DIFFS` 1-5 (hp/dmg/reward) · `this.stageDiff` เลือกใน `openDifficultyChoice(idx)` (เปิดก่อน startRun แทนกดด่านตรง ๆ) · `diffMul()` คูณ HP/ดาเมจศัตรู+บอส และ **รางวัล** (rollStageReward gear chance/tier + sugar per-kill × reward) · **ดึงความยากฐานลง** (enemy ×1.6→base, boss ×4.5→×2.3, mini ×1.7→×1.3, killPowerMul 0.008→0.005, rage tiers hp max 2.4) เพราะบัญชีใหม่ diff1 ต้องผ่านได้ · `Save.data.diffBest[]` จำระดับสูงสุดที่ผ่าน (โชว์ ✓) · โชว์ diff ใน stageTxt · **กฎเหล็ก: ยิ่งยากรางวัลยิ่งดี**
- **v2.21.0 (แก้จาก feedback):** Awaken ลดความโกง — `cdOf` awaken 0.62→0.85 · ตัวคูณดาเมจ awaken ทุกสกิล 1.4-1.7→1.1-1.2 · ความกว้าง (frost 2.6→1.6 ฯลฯ) ลด · **คงจำนวนกระสุน/counts เดิม = ยังอลังการ** · เปลี่ยนชื่อ rage tier เป็นคำไทยธรรมชาติ (ปกติ/เริ่มโมโห/โกรธจัด/คลั่ง/บ้าคลั่งสุดขีด — เลิก "ทรราชแก่นรส") · **หมายเหตุ: คำไทย lore อื่น ๆ (แก่นรส/สายใย) ยังไม่แตะ รอเจ้าของชี้จุด**
- **v2.20.0 (แก้จาก feedback — ยากขึ้น):** `killPowerMul()`=1+min(2.6,stageKills*0.008) คูณ HP ศัตรูปกติ/elite (×1.6/×1.7 base ด้วย) → มอนถึกขึ้นเรื่อย ๆ ตามที่ตายในด่าน · บอสใหญ่ HP ×4.5 · มินิ ×1.7 · `bossHpMul` cap 3.0 · rage tiers HP สูงสุด 3.5 · sprinkle speed 660/820 gap 100/60 cd max(0.6,..) · voidPull อ่อนต้นโตตามเลเวล (r=150+ul*30 ฯลฯ) · **ค่าจูนแรง อาจต้องดึงกลับถ้าโหดเกินหลังเทสจริง**
- **v2.19.0 (รองรับแท็บเล็ต):** `computeViewZoom()` — camera zoom = `0.76*clamp(W/430,1,2.4)` เรียกใน create + onResize → จอกว้าง (แท็บเล็ต) zoom เข้ามากขึ้นให้เห็นสนามกว้างเท่ามือถือ ตัวละครไม่เล็กจิ๋ว · มือถือ (W<430) คง 0.76 เดิม · **หมายเหตุ:** ปุ่มควบคุม/HUD ยังเป็นขนาด px คงที่ (บนแท็บเล็ตใหญ่จะดูเล็กลงเชิงสัดส่วน — ถ้าจะขยายต้องเพิ่ม uiScale ทีหลัง)
- **v2.18.0 (แก้จาก feedback เจ้าของ):** `drawComboHints` ไอคอน "มีคู่แล้ว" เคยพองเป็น 128px (tween scale ทับ setDisplaySize) → เปลี่ยนเป็นกระพริบ alpha ไอคอนคง 18px · `castVoidPull` เอา fx_ult_vortex (รูปหมุน) ออกเหลือวงกลมม่วง+ring และดูดมอนจริงด้วย `e.setPosition` lerp (ทับ AI เดินตาม) · `castSkill` sprinkle ยิงทีละนัด staggered (`delayedCall`) + homing เสมอ (awaken 720/เร็ว)
- **v2.17.0 (Objective ระหว่างสู้บอส/มินิ):** `tickBossObjective`/`startWeakPoint`/`endWeakPoint`/`resetBossObjective` — บอสกางเกราะเป็นระยะ (`_bossShield` ลดดาเมจ ×0.12 ใน `damage()`) ต้องทำลาย crystal จุดอ่อน 3 จุด (`o._weak`, ใช้ `spawnBossObject('crystal')`) เพื่อทลายเกราะ→บอสมึน+โดนก้อนใหญ่ 8% · timeout 9วิเกราะหลุดเอง · เรียกใน update ตอน boss active · reset ที่ spawnMiniBoss/spawnFinalBoss/clearBossObjects
- **v2.16.0 (แก้จาก feedback เจ้าของ):** โกโก้ Unique = `voidPull` (`castVoidPull`) หลุมดำดูดฝูง (แทน bearQuake) · nerf ต้นเกม: งาดำ ward ดาเมจบอส/มินิ ×0.28-0.30 (เลิกละลายบอส 1 วิ), มิ้นต์รัศมี Lv1 120 (เดิม 195), ทาโร่ Arc `(9+ul*7)` · โมโม่ berryRebound มี `b.chain` Lv3/4 · `setupSpawnRates` maxLive 95/batch+1/interval เร็วขึ้น · spawnMiniBoss HP×1.05/dmg×1.15/atkCd 0.85 + ท่า nova/spiral/charge · **ยังเหลือ #8 objective ระหว่างสู้บอส/มินิ (กำลังทำต่อ)**
- **v2.15.0:** การ์ดเลเวลอัพมีไอคอนคู่คอมโบมุมขวาบน (`comboPartners`/`drawComboHints` ใน `drawReadableChoiceCard`) — จางเทาถ้ายังไม่มีอีกครึ่ง · สว่าง+เต้น+ป้าย "🔗 พร้อมคอมโบ" ถ้ามีคู่แล้ว (คำใบ้ให้อัพใบนั้น) · อ่าน `COMBOS` (a=attack,b=passive)
- **v2.14.0 (Fun Roadmap #1 Juice):** ระบบ kill-streak (`killStreak`/`_lastKillAt`/`STREAK_MARKS`/`showKillStreak`) — ฆ่าต่อเนื่องเร็ว→ป็อปคอมโบกลางจอ+เสียง pitch สูงขึ้นที่หมุด 10/25/50/100/200/350 (ขาดเมื่อหยุดฆ่า >1.6วิ) · `Sfx.streak(step)` · ฆ่าตัวใหญ่/elite = `hitStop(45)` กระแทกฟิน · ดู `docs/FUN_DESIGN_ROADMAP.md` (เหลือ #2-#12)
- **v2.13.0 (แก้จาก feedback เจ้าของ):**
  · **บอสด่าน 2 sprite ดำ:** ชีต `boss2_clogmaw_sheet.png` (1024×512, 4×2) มีอาร์ตจริงแค่ **เฟรม 0–3** · เฟรม 4–7 **ว่างเปล่า 100%** → `drainBossPose` เรียกท่า 4–7 (prison/suction/overflow/enrage) เลยเรนเดอร์ดำ · แก้ด้วย map เฟรม 4–7 → {4:3,5:2,6:3,7:2} · **ถ้าจะได้ท่าบอสครบต้องขออาร์ตเติมเฟรม 4–7**
  · Unique ตาโร่เปลี่ยนจาก Path Recall → **สายฟ้าชิ่ง (Arc)** ยิงจากตัวลามไปศัตรูตัวถัด ๆ ไป (`castPathRecall` เขียนใหม่ ใช้ `chainBolt`) · ยังคง key `pathRecall` เดิม + คืน Dash/haste
  · การ์ดเลเวลอัพ: แตะครั้งแรก = ไฮไลต์กรอบเรือง (`highlightCard`/`_cardHi`) ก่อนแตะซ้ำยืนยัน
  · ลดดรอปหัวใจ (elite 30%/ธรรมดา 1.5%/กล่อง 28%) · cutscene ตัด lore + ยืดเวลาอ่านตามความยาว
  · **หมายเหตุประวัติ:** validator เก่าเคยไม่ตรงกับระบบ character-first; v4.44.0 รวมเหลือ `scripts/validate-game-content.mjs` และทำให้ `npm run check` เป็น gate หลักแล้ว
  · **มินิบอสด่าน 2 (Valve Maw) เรนเดอร์เป็นเงาขาว** — ยังไม่ฟันธงว่าบั๊กหรือ telegraph ตั้งใจ (รอเจ้าของยืนยัน)
- **v2.12.0:** แก้กล่องดำ 352×366 ระหว่างสู้บอสด่าน 2 ด้วย additive blending เป็นค่าเริ่มต้นของ VFX flipbook และออร่า · Passive card บอกคู่ Awaken/สาย build · จำกัด Awaken ไม่เกิน 2 ต่อด่าน · EXP เริ่ม 7 และโต ×1.20+3 · Unique Lv1–4 เพิ่มวง/ประกาย/แรงสั่น/ฉากจบตามเลเวล · ลดฐานผู้เล่นเป็น HP 90, ดาเมจ 90%, ความเร็ว 166, critical ×1.55 เพื่อเพิ่มน้ำหนัก meta progression
- **v2.11.0:** คลอกมอว์ด่าน 2 ใช้ flipbook 4×2 จำนวน 8 เฟรม (idle/emerge/roar/prison/suction/overflow/enrage) และ pose ผูกกับท่าจริง · Power Rating รวมโบนัส Stage Mastery ครั้งแรก · ค่าพลังแนะนำใหม่ 100/280/560/940/1450 · Power Guide ช่วย HP/ดาเมจศัตรูเล็กน้อยเมื่อผู้เล่นต่ำกว่าคำแนะนำและเพิ่ม EXP/Sugar catch-up โดยผู้เล่นเหนือคำแนะนำไม่ถูกสเกลตาม · ยกเลิก boss rank scaling เต็มเพื่อให้การพัฒนารู้สึกมีผล
- **v2.10.0:** Cutscene ก่อนทุกเวฟให้ตัวละครที่เลือกพูดกับตัวเองและเล่า story beat · Unique อัปอัตโนมัติ Lv2/3/4 ที่เลเวลผู้เล่น 3/7/11 โดยไม่เข้า card pool · Power Rating จากเลเวลตัวละคร/ยศ/พร/อุปกรณ์ พร้อมค่าพลังแนะนำรายด่าน · การ์ดเลเวลอัปต้องแตะใบเดิมซ้ำหลัง input lock 550ms · Awaken card บอกคู่ Attack MAX + Passive · เพิ่มไอเทมกิมมิค 5 ด่าน · หัวใจ/แม่เหล็กยังมีฮาโลแต่ไม่ถูกดึงเองและ pickup ฐานกลับเป็น 80 · เปลี่ยนอาร์ต Valve Maw/Clogmaw ด่าน 2
- **v2.9.1:** เพิ่มฮาโล/วงชีพจร/การลอย/แรงดึงสำหรับไอเทมดรอปและขยายออร์บ EXP · เพิ่ม Unique Skill Lv1–Lv4 ระหว่างรัน การันตีการ์ดที่เลเวล 3/7/11 · จูนคูลดาวน์ตามพลังจริง · Taro มีคลื่นปิดเส้นทางที่โดนแน่นอนและคืน Dash · Sesame มีเขตติดตามตัว ทำดาเมจ ลดความเสียหาย 30% สะท้อนกระสุน และระเบิดปิดเขต
- **v2.9.0:** หน้าเลือกตัวละครและอุปกรณ์ใช้ Character Card เต็มตัว 768×1024 alpha จริงครบ Momo/Mint/Cocoa/Taro/Sesame แทนการตัด sprite sheet · รีเวิร์ก Unique ตาโร่เป็น Path Recall ระเบิดย้อนตามรอยเดินและรีเซ็ต Dash · รีเวิร์กงาดำเป็น Oath Ward เขตสะท้อนกระสุนแบบเลือกตำแหน่ง · เพิ่ม Adaptive Wave Director แบบมีเพดานตามอัตรากำจัด โดยไม่เพิ่มดาเมจหรือสัดส่วนศัตรูยิงไกล · ลดศัตรูยิงไกลในเวฟต้นและคงกติกาเวลาหมดแล้วหยุดเกิด รอเคลียร์ตัวที่เหลือก่อนขึ้นเวฟ
- **v2.8.4:** รีดีไซน์ Mint เป็นผู้พิทักษ์ลมเย็นที่มีโล่ใบมิ้นต์/เกราะน้ำแข็ง และ Chocolate เป็นจอมพลังถุงมือหนัก/ตราหมี · สร้าง action sheet 8 ท่า + run atlas 12 เฟรมใหม่ทั้งคู่ พร้อม alpha โปร่งใสและสัดส่วนอ่านง่ายบนมือถือ
- **v2.8.3:** ใช้ Momo Strawberry เป็นต้นแบบสัดส่วนและงานเส้นของ Mint/Chocolate · ตัวละครทั้งสามมี run atlas 4×3 รวม 12 เฟรม เฟรมละ 128px เล่นที่ 16 FPS · ขนาดแสดงผลเท่ากันและสลับกลับ action sheet สำหรับท่ายืน/Dash/เจ็บ/ใช้สกิล/KO
- **v2.8.2:** เปลี่ยน `char_momo_run_sheet.png` เป็น atlas 5×5 ขนาด 640×640 (25 เฟรมจริง เฟรมละ 128px) · เล่นเฉพาะตอนเคลื่อนที่ที่ 25 FPS · ท่า action เดิมยังสลับกลับไปใช้ `char_momo_fighter_sheet.png`
- **v2.8.1:** เลเวลอัพเลือก 1 จาก 4 โดยการ์ด responsive ยังอ่านข้อความครบ · ลดภาพ Momo ลง 15% (คง hitbox เดิม) · เพิ่ม `char_momo_run_sheet.png` เป็น run cycle 8 เฟรมที่ 12 fps และสลับกลับชีต action เดิมเมื่อยืน/Dash/เจ็บ/KO
- **v2.8.0:** รื้อการ์ดเลือกสกิลจากกรอบทองแนวตั้งเป็นการ์ดแบนคอนทราสต์สูง ไอคอนใหญ่ซ้าย/ข้อความขวาบนมือถือ · เริ่มด่านเลือก 1 จาก 3 · ใช้ข้อความ runtime ไม่ bake ลงภาพเพื่อกันล้นเมื่อเปลี่ยนเลเวล/ภาษา · ลด active skill จาก 22 เหลือ 15 โดยถอด aura/fork/wave/memory/thread/triseal/echoStep และ combo ที่เกี่ยวข้อง
- **v2.7.3:** ทำ alpha cleanup รอบสอง ลบ checkerboard ที่ฝังจริง/โปร่งบางและเศษ neutral speckles ออกจากไอคอน · Star Guard ในสนามเปลี่ยนจาก flipbook ที่ silhouette เล็กเป็น `ic_star` ห้าแฉกขนาดอ่านชัด พร้อม pulse/rotation/afterimage แบบจำกัดจำนวน · วงบอกระยะลดเป็นชมพูบาง
- **v2.7.2:** เติม motion ที่มองเห็นระหว่างใช้งานให้ Star Guard, Memory Jam, Flavor Thread, Core Decoy และ Triad Seal · Star Guard มีวงบอกระยะ/ดาวกระพริบ/impact สกัดกระสุน · Memory mark ติดตามเป้าหมาย · ลด Mirror Glaze เหลือวงบางและ spark ขนาดเล็ก ตัด chain lightning ที่บดบังสนามโดยคง mechanic สะท้อนเดิม
- **v2.7.1:** เปลี่ยน `assets/ic_*.png` ของสกิลโจมตีครบ 22 ภาพเป็นชุด 2.5D confectionery fantasy เดียวกัน ขนาด 128×128 alpha จริง · เพิ่ม `role` ใน `SKILLDEFS` และแสดงในคัมภีร์/รายละเอียด/การ์ดเลือกเริ่มต้น · แยกกลไกสกิลที่ทับกัน: Thunder ล่า HP สูง, Popcorn ระยะประชิดผลัก, Bubble จับตัวแกร่ง, Fork กรวยหน้า, Rocket ล็อกตัวแกร่ง, Wave เน้นผลัก, Star สกัดกระสุน, Mocha เล็งกลุ่มหนาแน่น
- **v2.7.0:** เพิ่ม `stageKills` นับลูกน้องที่กำจัดต่อด่าน · `bossRageInfo()` แบ่งความโกรธ 5 ระดับและสเกล HP/ดาเมจ/ความเร็ว/คูลดาวน์บอส · `rollStageReward()` เพิ่มคุณภาพรางวัลตามความโกรธ · แยก `CHARACTER_UNIQUES` ออกจาก attack pool พร้อมปุ่ม Unique ข้าง Dash · `openStartingSkillChoice()` ให้เลือกสกิลโจมตี Lv1 1 จาก 4 ก่อน `startStage()`
- **v2.6.1:** เพิ่ม Hub menu `คัมภีร์แก่นรส` (`menuScreen='skills'`) · `buildSkillArchive()` แบ่ง Attack/Passive และ paginate ตามแนวจอ · แตะการ์ดเปิด `buildSkillArchiveDetail()` เพื่อดู tier, Awaken และคู่ `COMBOS`
- **v2.6.0:** Bear-Sigil Donut กระแทกหลายครั้ง/ทิ้ง glaze/ปิด shockwave · เพิ่ม active 6 แบบใหม่ (`mirror/memory/thread/decoy/triseal/echoStep`) และ passive 4 แบบ · หน้าเมตาเปลี่ยนเป็นวิหารสายใยรสชาติ · แบนเนอร์แต่ละเวฟเป็น story beat เฉพาะด่าน · Taro/Sesame ใช้ Awakened sprite sheet 8 เฟรมและมี `CHAR_TALENTS` ของตัวเอง
- **v2.5.1:** ฆ่าบอสแล้วสุ่มรางวัลเป็น Sugar/อุปกรณ์และเปิดหน้าสรุปทันที (ไม่มีประตูพาไปด่านถัดไป) · ปุ่มสรุปกลับหน้าเลือกด่าน · บอส/มินิบอสด่าน 2 มี squash, sway และ attack kick · ล้างเกาะพิกเซลขาวจากไอคอน Card ด้วย `scripts/clean_skill_icon_artifacts.py`
- **v1.4.0 การเปลี่ยนใหญ่:**
  · **ศัตรูชนิดใหม่:** `dasher` (เข้าหา→หน่วงเล็ง(wind)→พุ่งเร็ว 4.6× (dash)→พัก · state machine ใน enemies loop, ย้อมส้ม `e.tintColor`) · `siege` (HP 260× สูง, ช้า spd24, ตัวใหญ่ 1.85, ย้อมชมพู) · เพิ่มใน `spawnWaveEnemy` (si≥1 dasher, si≥2 siege) · `e.tintColor` ต้องคงสีตอน damage/frozen restore
  · **Swarm Event:** `spawnSwarm()` — ฝูง 14+si·4 ตัวแห่จากทุกทิศ · `swarmAcc` timer ใน tickStage (14-22 วิ) reset ตอน startRun
  · **บอสถึกขึ้น:** `bossHpMul()` = min(6, (1+rank·0.5)(1+level·0.045)) คูณ HP มินิ+บอส (กันตายใน 1 วิ) · แพทเทิร์นใหม่ `spiral`(เกลียวหมุน) + `trap`(วงล้อมเว้นช่อง บังคับวิ่งหนี) ใน bossThink
  · **รางวัลจบด่าน (อัปเดต v2.5.1):** บอสตาย→`onBossDown` สุ่ม Sugar/อุปกรณ์ด้วย `rollStageReward` → `onStageClear`/หน้าสรุป → กลับหน้าเลือกด่าน ไม่มีประตูส่งต่อด่าน
  · **ไอเทมแม่เหล็ก (vacuum):** `spawnVac/collectVac` — ดูดออร์บทั้งจอ (`o._vac=true` → orb loop บินเข้าตัวไม่สน pickup range) · ดรอปจากมินิ/elite/กล่อง/ธรรมดา(น้อย) · กลุ่ม `vacs` texture 'vac'
  · **แก้บั๊ก crate hitbox:** สกิล AoE ไม่เคยตีกล่อง → เพิ่ม `crateHit(c,amt)`(+flatDmg) + `hitCratesInRadius(x,y,r,amt)` เรียกใน chili/thunder/frost/aura/meteor/cloud/mine/explodeAt/creamWave/bomb ult · crate HP ลด (14+si·6)
  · **กล้องกว้างขึ้น:** `viewZoom` 0.82→0.70
  · **ระบบอุปกรณ์ใหม่ (เลิกซื้อ):** GEAR item มี `tier`(start/common/rare) · ดรอปในด่าน=common (`grantGear('common')` จาก loot/gift) · gacha (`gachaRoll` 68% common/32% rare, `GACHA_COST`=220) ปุ่มในหน้า gear · ไม่เป็นเจ้าของ=ล็อก (ไม่มีปุ่มซื้อ) · `GEAR_ALL/gearPool/TIER_LABEL` · เก็บใน `Save.data.ownedGear` · กลุ่ม `loots` texture 'gift'

- **v1.3.0 การเปลี่ยนใหญ่:**
  · **ระบบ "สายใยรสชาติ":** กลไกเมตา 3 สแตตถาวรใช้ชื่อในโลกเกม **CORE/FLAVOR/BOND** · เติมครบ (Lv `TAL_MAX`=5) → **ประสานสายใย** (`Save.promote`) rank++ + โบนัส 🍬 · การ์ดรีเซ็ต Lv0 + ราคา ×(1+rank·0.8) · ผลรวมใช้จริง `Save.talTotal(k)`=rank·5+เลเวลรอบนี้
  · **ATK = flat damage:** `p.flatDmg` บวกใน `damage()` ทุกครั้งที่โดน (per=2/เลเวล กันเวอร์) · `dmgTakenMul` มีพื้น 0.35 กันเกราะโกง
  · **จบเวฟไม่เคลียร์มอน:** `onWaveCleared(keep)` — เวลาเวฟหมด→`keep=true` (มอนเดิมอยู่ต่อ เวฟถัดไปไหลต่อ, `startSurvivalWave(w,seamless)` ข้ามระลอกเปิดตัว) · มินิ/บอสยังเคลียร์
  · **ประวัติ:** v1.3.0 ล็อกแนวตั้ง → v2.3.2 เปลี่ยนเป็น landscape → **ปัจจุบัน (ก.ย. 2026) กลับเป็น portrait ตามที่เจ้าของยืนยัน** (`set-android-landscape.mjs` ชื่อเก่าแต่ใส่ `screenOrientation="portrait"`) · ไม่มี `#rotate` overlay
  · **การ์ดเลเวลอัพใหม่:** แถบบน `drawHeldBar()` โชว์สกิล/พรที่ถือ · การ์ดมี ★ ดาว(เลเวล/max)+ "อีก N ดาวจะตัน" · สีหมวด (โจมตี=ส้ม/ติดตัว=เขียว/ขั้นสุด=ทอง) · แถบคอมโบ "A+B=ผล ✓/✗" · **หน้าหยุดเกมโชว์ `drawHeldBar` ด้วย**
  · dead code เหลือ: `CHAR_TALENTS/charTalents/gainCharExp` (ไม่เรียกใช้แล้ว)
  · **สกิล max = 5 ดาว** (เดิม 6) awaken=Lv6 · **COMBOS = สกิลโจมตี(a)+สกิลติดตัว(b)** (เดิม โจมตี+โจมตี) `checkCombos` เช็ก `skills[a]&&passives[b]` · การ์ดคอมโบโชว์ทั้งฝั่งโจมตี+ติดตัว · **XP โค้งนุ่ม/ไวขึ้น (VS-like):** xpNext เริ่ม 3 ×1.14+2

เล่นได้จริงบนมือถือแล้ว ระบบที่มี:
- **ล็อกสกิล 2 หมวด/รอบ (แบบ Vampire Survivors):** สกิล**โจมตี** ≤ 4 (`SKILL_CAP`, จาก `SKILLDEFS` 15 แบบ) + สกิล**ติดตัว** ≤ 4 (`PASSIVE_CAP`, จาก `PASSIVES`)
  · `this.skills`/`this.passives` (reset ใน startRun + create) · `rollUpgrades` เสนอ "สกิลใหม่" เฉพาะเมื่อยังไม่เต็มโควตา (`atkOwned<SKILL_CAP`/`pasOwned<PASSIVE_CAP`) · เต็มแล้วเหลือแต่การ์ดอัพเลเวล → สกิลถึง MAX ไวขึ้น = เจอ Awaken ไวขึ้น
  · **`PASSIVES` (12 ตัว เลเวลได้ max5):** ชุดเดิม 8 + `flavorCore/memoryThread/bitterResolve/returningTaste` — `apply(p)` = ผล 1 rank (mutate player)
  · **Awaken การันตีโผล่:** `rollUpgrades` มี `awakenPool` แยก — ถ้ามีสกิล MAX ที่มี awaken → **ดันการ์ด ⚡ ตื่นรู้ ≥1 ใบทุกครั้ง** (เดิมต้องสุ่มเจอ = เจอยากมาก) + การันตีสกิลติดตัว ≥1 ใบด้วย
- **Skill Awaken (ตื่นรู้):** สกิลถึง MAX (5 ดาว/Lv5) แล้วเลเวลอัพอีก = การ์ด "⚡ ตื่นรู้" เปลี่ยนรูปแบบสกิลให้โกง (Lv6=`SKILL_AWAKEN_LV`) · ทุกสกิล `d.max`=5
  ทุกสกิลมี `d.awaken{name,emoji,desc}` · castSkill อ่าน `aw=lvl>=7` เพิ่มจำนวน/ดาเมจ/ธง (sprinkle 8เม็ด homing, thunder 8จุด, chili 5ชั้น, whirl 16ทิศ, boomer 6ชิ้นเด้ง2, frost แช่ทั้งจอ, popcorn 20, bubble 8, star=วงกาแล็กซี3ชั้นใน rebuildRing)
  · `cdOf` → Lv7 ร่ายถี่ขึ้น 0.62× (`_cdBase`) · แถบสกิลโชว์ ⚡ + ไอคอน awaken · `awakenSpark()` ประกาย
- **จอกว้างขึ้น (`this.viewZoom`=0.82):** กล้อง main zoom = DPR×viewZoom (มองกว้าง +22% แต่ backing ยังคมชัด)
  · รัศมี spawn ศัตรูหาร viewZoom (`/this.viewZoom`) กันเกิดในจอ
- **ออร์บ EXP สีตามค่า (`orbStyle(v)`):** ศัตรูอึด = ดรอปออร์บ**เม็ดเดียว**ค่าสูง (สี: ขาว1/เขียว2/ฟ้า5/ม่วง10/ทอง20) แทนหลายเม็ด (ลด object)
  · `dropOrb(x,y,value)` ตั้ง `o.value`+tint+scale · `collectOrb` gain `o.value` · killEnemy ดรอป 1 เม็ดค่า e.xp
- **แยกหน้าพัฒนา 2 แบบชัด:** 🌟 พรสวรรค์ (เฉพาะตัว) = `CHAR_TALENTS` ต่อตัวละคร (TP จากเลเวลตัวละคร) · ⚙️ อัพเกรดฐาน (ทุกตัว) = `UPGRADES` (Sugar, ใช้ทุกตัว)
  · **พรสวรรค์คนละสาย:** momo=สมดุล(hp/dmg/cdr/🧨twinBomb) · mint=แทงค์(hp/🛡️armor→dmgTakenMul/magnet/❄️deepFreeze) · cocoa=จอมพลัง(dmg/spd/ult/🕳️bigVoid)
  · โหนด signature = ธงยกระดับอัลติเฉพาะตัว (twinBomb=บอมบ์2ระลอก, deepFreeze=แช่กว้าง+นาน, bigVoid=หลุมใหญ่ดูดแรง) อ่านใน useActive
  · เกราะ mint: `p.dmgTakenMul` ลดดาเมจใน hurtPlayer + touchEnemy
- **โทนพาสเทล:** `COLORS` (bg 0x3b3357, ขอบชมพูนุ่ม), gridBg + STAGES.grid สว่างขึ้น, config backgroundColor #3a3355
- **โมจิเจลลี่ (squash&stretch) แบบสปริง:** `animatePlayer(dt)` — สปริง underdamped (stiff 210/damp 12) กับ `_sqX/_sqY`+`_sqVX/_sqVY`
  → ดีดกลับ 1 แบบ overshoot เด้งดึ๋ง (ไม่ใช่ ease เฉย ๆ) · หายใจ/ส่ายตัว (waddle) + เอนตามทิศเวลาเดิน (`p.rotation`)
  · `jelly(vx,vy)` = อิมพัลส์นุ่ม (เก็บออร์บ/เลเวลอัพเด้งดีใจ) · พุ่ง=ยืด(1.35/0.7) แล้วลงพื้นย่อ(0.8/1.22) · โดนตี=แบน(0.7/1.3)
  · setScale+setRotation ต่อเฟรมใน update (ไม่ใช้ tween กันชนกัน) · body เป็นวงกลม rotation ไม่กระทบฟิสิกส์
- **คุม:** จอยสติ๊กลอย (ซ้าย) + ปุ่มพุ่ง/dash (ขวาล่าง) + ปุ่มอัลติกดเอง (ชมพู)
- **ปุ่มหยุด (⏸ ข้าง mute):** `togglePause` (state 'paused' + physics.pause) → เมนู `buildPause` (เล่นต่อ/ออกจากด่าน `exitStage`) · hit-test `_pauseBtns`
- **ไอเทมในด่าน:** ❤️ `heal` (ฟื้น 18%+6, ดรอปจากบอส/มินิแน่นอน·elite 50%·ธรรมดา 3%·กล่อง) · 📦 `crate` (โหลแยมทุบได้ ดรอปออร์บ/heal/sugar) — กลุ่ม `heals`/`crates`, `dropHeal/collectHeal/spawnCrate/hitCrate/breakCrate`, เคลียร์ด้วย `clearPickups`
- **บาลานซ์ (จูนล่าสุด):** ศัตรู HP ×~1.5 + scaling แรงขึ้น `(1+idx*0.55)(1+wave*0.11)` · เวฟธรรมดาเกิดมอนต่อเนื่องตามเวลา (`tickStage`/`setupSpawnRates`) จนถึงเพดาน maxLive · บอส HP ×1.4 + เฟส 3
- **สกิลออโต้แคสต์ 9 อย่าง** (ใน `SKILLDEFS`): sprinkle, star(orbit), chili, thunder(ฟ้าผ่า),
  whirl(ครีมหมุน), boomer(บูมเมอแรงทะลุ), frost(แช่แข็ง), popcorn(กระจายมั่ว), bubble(ฟองไล่/homing)
  · ชุดเดิม 17 + **6 สกิล Flavorbound:** `mirror` สะท้อนกระสุน · `memory` สะสมดาเมจระเบิดซ้ำ · `thread` ผูก/แชร์ดาเมจ · `decoy` เปลี่ยนเป้าหมาย AI · `triseal` วางตราสามจุด · `echoStep` ระเบิดตามรอยเดิน — **รวม 23 สกิล**
- **ระบบคอมโบสกิล (`COMBOS`):** มีสกิลคู่ครบ = ปลดโบนัส (ธง `this.comboFlags` อ่านตอน cast + แบนเนอร์)
  storm(thunder+frost), firestorm(chili+whirl), ricochet(sprinkle+boomer), fizz(popcorn+bubble) · `checkCombos()`
- **Sugar + Save (`Save` → localStorage 'mochi_save'):** เก็บ sugar/unlockedStage/upgrades/gear
  เก็บ Sugar จากการฆ่า (บอส40/มินิ18/elite4/ธรรมดา1) ฝากตอนจบด่าน+ตาย
- **เมนูฮับ + ซับสกรีน (tap-zone hit-test, ไม่ใช้ setInteractive):** `buildHub/buildStageSelect/buildUpgrade/buildGear`
  · `this.menuScreen`=hub/stage/upgrade/gear, `handleTap()`+`_zone()`+`_rowBtn()`+`_screenBg()` (ปุ่มกลับ)
  · **เลือกด่าน:** ปลดตาม `Save.unlockedStage`
  · **อัพเกรดฐาน (`UPGRADES` = hp/dmg/def/spd/magnet) โฉม isekai-drifter (`buildUpgrade`):** แถบ **ระดับขั้น (rank)** จากผลรวมเลเวล (`Save.rankInfo/claimRanks`, `RANK_TIERS`/`RANK_STEP`) ถึงขั้นใหม่รับโบนัส Sugar · การ์ดสแตต (Lv/tag/ไอคอน/+ค่า/ราคา) กริดปรับตามจอ · ซื้อด้วย Sugar
  · **ของสวมใส่ (`GEAR` 6 ช่อง: weapon/gloves/armor/boots/amulet/ring) โฉม isekai-drifter (`buildGear`):** portrait ตัวละครกลาง + 6 ช่องซ้าย3/ขวา3 (`GEAR_SLOTS`, `this.gearSlot`=ช่องที่เลือก) · แตะช่อง→โชว์คลังไอเทมของช่องนั้นด้านล่าง (สวมใส่/ซื้อ/⚒️ผสม-ตีบวก) · ผลรวมใส่ตอน `applyMeta()`
- **เลเวลอัพเน้นสกิล** (พาสซีฟเป็นของเสริม) — เลือกด้วยการแตะ (hit-test เอง ไม่ใช้ setInteractive กับ shape)
- **ระบบเลือกด่าน:** `buildStageSelect` แสดง 5 ด่านและเปิดตาม `Save.unlockedStage` · ผู้เล่นต้องเริ่มแต่ละด่านจากหน้านี้ด้วย `startRun(i)`
- **รีเซ็ตเซฟ (`Save.reset`):** ปุ่ม 🗑️ ในฮับ (แตะ 2 ครั้งยืนยัน `_resetConfirm`) ล้าง localStorage + คืนค่าเริ่มต้น (สำหรับเทส/แก้ account เทพเกิน) · UPGRADES ลดพลัง (hp+14/dmg+4%/spd+3% ต่อเลเวล)
- **ระบบด่าน (STAGES) แบบ survival — เวฟธรรมดา = "เอาชีวิตรอดตามเวลา":** 5 โซนครัว แต่ละด่าน = หลายเวฟ (`waves`)
  → เวฟธรรมดา = **นับถอยหลัง** (`waveTimer`, `waveDur`=20+ด่าน×3+เวฟ×2 วิ) + มอนเกิด**ต่อเนื่องเป็นฝูง**จนจอเต็ม (รอดครบเวลา = ผ่านเวฟ, ไม่นับจำนวนแล้ว)
  → กลางด่านเจอ **มินิบอส** (`miniAt`, `mini`) — ฆ่ามินิ = ผ่านเวฟ (ระหว่างสู้มีลูกน้องไหลมาเรื่อย) → จบเวฟทั้งหมดเจอ **บอสใหญ่** (`boss/bossHp/bossDmg`)
  → ล้มบอส = ผ่านด่าน + สุ่ม Sugar/อุปกรณ์ + ปลดล็อกด่านถัดไป แล้วกลับหน้าเลือกด่าน · ล้มบอสด่าน 5 = **ชนะเกม**
  กลไก: `tickStage(dt)` (นับเวลา+เกิดมอนต่อเนื่อง เรียกทุกเฟรมใน update) · `setupSpawnRates(w)` (spawnInterval/spawnBatch/maxLive≤100/elite) · `startSurvivalWave/spawnMiniBoss/spawnFinalBoss/onWaveCleared(+clearEnemies)/onStageClear`
  · `this.mode`= wave/mini/boss/breather/clear/summary · killEnemy: บอส→onStageClear · มินิ→onWaveCleared · มอนธรรมดา = เวลาคุม (ไม่เคลียร์ตามจำนวน)
  เวฟหนักขึ้น: มอนไหลไม่หยุด (เพดาน maxLive) + **elite** (isElite, ตัวใหญ่ อึด xp/sugar เยอะ) โผล่เป็นระยะจากด่าน 2
  **ตัวบอกความคืบหน้า:** `drawWavePips()` (จุดเวฟ + จุดชมพู=มินิ + จุดแดง=บอส) + timeTxt โชว์ "⏳ N วิ"
  **หน้าสรุปด่าน:** `showStageSummary()` แสดงรางวัล → `continueFromSummary()` กลับหน้าเลือกด่าน (ด่านสุดท้ายไป victory)
- **กราฟิก (ลงแล้ว! วาดด้วย Canvas 2D ใน Boot):** ตัวละคร 3 แบบต่างหน้าตา (char_momo/mint/cocoa —
  บอดี้ไล่เฉด เงานุ่ม แก้มชมพู ตาวาว + ท็อปปิ้ง) · ศัตรูหน้าโกรธไล่เฉด · ลูกกวาด glossy · กระสุน/อนุภาคเรืองแสง · **vignette** ขอบจอ
  · player.setTexture('char_'+character) + aura สีตามตัวใน `applyMeta()` · **หมายเหตุ:** ขนาด texture โตขึ้น → ปรับ setCircle offset แล้ว
- **บอสมีแพทเทิร์นโจมตี (`bossThink`):** slam(AoE เตือนก่อน) · radial(ยิงรอบทิศ) · aimed(ยิงเล็ง) · charge(พุ่ง) · summon(เรียกลูกน้อง)
  · **เฟส 2** เลือดครึ่ง (เร็ว/ดุ + จอวาบแดง) · **เฟส 3** (บอสใหญ่) เลือด 25% คลั่ง (โจมตีถี่มาก 0.55×, slam 3 จุด, radial 2 วง)
  · **รูปจริง (AI):** boss1-5 (ASSET_IMAGES, ตัดพื้นใส 140px) ใช้ใน spawnFinalBoss (scale 1.55, ไม่ย้อมสี) · มินิยังใช้ e_brute ย้อมสี
  · **มีชีวิต:** บอสหายใจ (setScale เต้นตาม sin ใน bossThink, `_baseScale`) · **ฉากอลังการ:** `bossIntro`(จอวาบ+ซูมกระแทก+คลื่น+เขย่า) · `bossDefeat`(วาบ+ระเบิดชุด+คลื่น) · `screenFlash()`
  · ออร์บ EXP มีชีวิต: หมุน+เต้น (rotation+bob ใน orb loop, `o._sc`) · candy เป็นรูปจริง (ย้อมสีตามค่าได้)
- **ศัตรูมีลูกเล่น:** shooter(ยิงระยะไกล พังการ kite, สีเหลือง) · bomber(ระเบิดตอนตาย, สีส้ม) · elite · ผสมในเวฟตามด่าน
- **กระสุนศัตรู (`foeBullets` + `foeShot`/`hitByFoe`):** บอส/shooter ยิงใส่เรา · `hurtPlayer()` โดนแล้วเสีย HP (dash หลบได้)
  · **hazard (`spawnHazard`)**: วงอันตรายบนพื้น เตือนก่อนแล้วระเบิด · ล้างด้วย `clearFoes()` ตอนจบเวฟ/ด่าน
  · **หมายเหตุ:** foeBullets ต้อง `camWorld()` ตอน spawn (กัน 2-camera ghost) — ทำใน foeShot แล้ว
- **ศัตรู:** 5 ชนิด (basic/fast/tank/shooter/bomber) + บอส, มี object pooling
  · **รูปจริง (AI):** e_basic/e_fast/e_tank/e_shooter/e_bomber (ASSET_IMAGES, ตัดพื้นใส native size 38-62px) · แต่ละชนิดมี texture ของตัวเอง (ไม่ย้อมสีร่วมแล้ว)
  · **e_brute** = ตัวถึกโปรซีเจอรัล (ย้อมสีได้) ใช้กับมินิ/บอส (ยังเป็น phase 2 รอรูปบอสจริง) · elite = e_tank รูปจริง scale 1.55 (ตัวใหญ่=elite)
- **UI:** การ์ดเลเวลอัพมุมโค้ง, ปุ่มโค้ง, HP/XP bar, หลอดบอส, แบนเนอร์ด่าน+lore
- **ตัวละคร 3 ตัว (`CHARACTERS`+`CHAR_ORDER`):** momo🍡(bomb) · mint🌿(freeze,+HP30) · cocoa🍫(blackhole,+dmg10%)
  แต่ละตัว "อัลติต่างกัน" (`ACTIVES`: bomb/freeze/blackhole) + โบนัสพาสซีฟ (`bonus`) · **หน้าเลือกตัวละคร** `buildChars()`
  ปลดด้วย Sugar (Save.chars/character) · อัลติ+โบนัสใส่ตอน `applyMeta()` · เพิ่มตัวใหม่แค่เติมใน CHARACTERS+ACTIVES
- **ระบบพัฒนาตัวละคร (เลเวล+Talent Tree):** แต่ละตัวมีเลเวล/EXP/แต้ม แยกกัน (`Save.cp(id)`={lvl,exp,tp,tal})
  · ได้ EXP ตอนจบด่าน/ตาย/ชนะ (`gainCharExp`) · `charExpNeed(l)` · ทุกเลเวล +1 แต้ม
  · ผัง `TALENTS` 6 สาย (hp/dmg/spd/cdr/magnet/ult) ลงแต้มในหน้า `buildTalent()` (hub ปุ่ม 🌟 พรสวรรค์)
  · ผลใส่ตอน `applyMeta()` → ตัวคูณ `p.cdMul/ultPow/ultCdMul` (อ่านใน cooldown tick + useActive)
- **สกิลอัพ = ปลดเอฟเฟกต์ใหม่** (ไม่ใช่แค่ +ตัวเลข) กำหนดใน `SKILL_TIERS` + การ์ดโชว์ว่าเลเวลนี้ปลดอะไร
  เช่น sprinkle: L3 ทะลุ, L5 เด้ง, L6 5เม็ดทะลุหมด · thunder: L3 แตกลูก(chain) · chili: L3 2ชั้น L6 3ชั้น
  · boomer: L5 เด้งออกอีกรอบ · star: L6 วงคู่ · frost: L5 ระเบิดใส่ตัวที่แช่อยู่
  (กลไก bullet: flags pierce/bounce/boomer/rebound/spin/hitGapV ใน getBullet+hitEnemy+update loop)
- **แถบไอคอนสกิล (ล่างจอ):** `buildSkillBar()` โชว์สกิลที่มี+เลเวล, เด้งตอนสกิลทำงาน (`pulseSkill`)
- **UI polish:** หลอด HP/XP โค้งมน (`drawBars` graphics + ไอคอน ❤️/⭐), ริงคูลดาวน์อัลติ (`drawSkillRing`),
  ออร่าเรืองใต้ตัวละคร, การ์ดเลเวลอัพเด้งเข้าทีละใบ, แบนเนอร์ pop
- **พรสวรรค์เชิงลึก (CHAR_TALENTS 6 โหนด/ตัว):** สแตตใหม่ `p.critChance/critMul`(🎯 ตีแรง ×1.8 ใน `damage()` + popDmg สีทอง) · `p.regen`(💗 ฟื้น/วิใน update) · `p.lifesteal`(🍓 ฟื้นตอนฆ่าใน killEnemy) · reset ใน applyMeta
- **ตีบวกของสวมใส่ (`Save.gearLv`/`enhance`, `GEAR_ENH_MAX`=5):** GEAR.apply(p,lv) สเกลตามระดับ · buildGear: สวมอยู่แล้วกด ⚒️ ตีบวก (🍬 `gearEnhCost`) · ผลใส่ตอน applyMeta
- **BGM สังเคราะห์ (`Sfx.startBgm`/`stopBgm`/`bgmIntense`):** ลูปเบส+อาร์เพจโจ C-Am-F-G ผ่าน `_bgmGain` · เริ่มตอน `unlock()` · เร่งจังหวะตอนบอส (`bgmIntense(true)`), คืนปกติตอนเคลียร์/เมนู/ตาย · `Sfx.heal()`
- **บอส = จุดขาย:** ออร่าคลั่งถาวร (`b._aura` ตามตัว) เฟส 2+ · ท่า **nova** (คลื่นสังหารขยายต้องหลบ, เฟส 3 = 2 วง) · เลเวลอัพไวขึ้น (`xpNext` 4 ×1.22+3)
- **เสียงน่ารัก:** สังเคราะห์เองด้วย Web Audio API (object `Sfx` ใน game.js) — ไม่มีไฟล์เสียง
  ทำงานได้ทั้งใน artifact + มือถือ. โทน sine/triangle สเกลเมเจอร์ = สดใส. มีปุ่ม mute (🔊 มุมขวาบน).
  เสียง: ยิง/เก็บ xp/ตีตาย/โดนตี/พุ่ง/อัลติ/ฟ้าผ่า/ระเบิด/แช่แข็ง/เลเวลอัพ/เลือกการ์ด/บอส/เคลียร์/ชนะ/แพ้
  (ปลดล็อกเสียงตอนแตะครั้งแรก `Sfx.unlock()`, เสียงถี่ ๆ มี throttle กันรก)

- **คมชัดบนจอ high-DPI (Retina) ตั้งแต่ v2.3.2:** `Scale.RESIZE` ใช้ logical CSS px โดยตรง (`W/H = scale.width/height`, input ไม่หาร DPR)
  และใช้ `config.resolution=RENDER_DPR` ให้ Phaser ขยาย backing canvas เอง ห้ามคูณ game size หรือ camera zoom ด้วย DPR ซ้ำ
  · **2 กล้อง:** main(โลก, follow, zoom=`viewZoom`) + `uiCam`(UI, นิ่ง, zoom=1, `centerOn(W/2,H/2)`) ใน `setupCameras()`
  · UI ใช้ **scrollFactor(1)** และแยกเรนเดอร์ด้วย `camWorld()`/`camUI()` (ignore)
  · **หมายเหตุ:** เพิ่ม world FX ใหม่ต้องห่อ `this.camWorld(...)`, UI ใหม่ห่อ `camUI`

- **faux-2.5D (โหมดทดลอง `this.iso`=true):** เงาวงรีใต้ทุกตัว (`drawShadows` วาดใน `shadowG` ทุกเฟรม) + จัดลำดับความลึกตามแกน Y (`setDepth(e.y)` สำหรับ player/enemies/crates/heals) · กริดพื้น depth -100000, เงา -99000, กระสุน/ออร์บ depth 8-9หมื่น (ลอยบน) · **ยังเป็นพื้นแบน** — ถ้าจะ 2.5D เต็มต้องอาร์ตมุม ¾ + พื้นเพอร์สเปกทีฟ

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

## 5. ถัดไป (อัปเดต v6.55.16 — ถัดไปทันที: Monster animation commit 7 · Chapter 2 ด่าน 1–2 รวม Sporeling)
- **📋 แผนงานแบ่ง commit อยู่ที่ `docs/COMMIT_ROADMAP.md` — ทำทีละ commit ตามลำดับ และอัปเดตสถานะ ⬜/✅ ในไฟล์นั้นทุกครั้ง**
1. ~~Endgame gate~~ ✅ v4.72 ปลดหลังจบเนื้อเรื่อง
2. **Chapter 3** ✅ v4.73 เล่นได้ (placeholder) — เหลือ: อาร์ตจริงจาก AI อีกตัว, story/epilogue, Bestiary, กลไกบอสเฉพาะ
3. Endgame ✅ Phase R Recipe Maps ครบ R1–R10 (v4.75–v4.84) → ถัดไป: Phase A (Chapter 3 ให้สมบูรณ์) หรือ B ใน docs/COMMIT_ROADMAP.md · Recipe ยังต้องเล่นจริงเพื่อจูนตัวเลข
4. เล่นจริงบนมือถือ: Boss Rush balance, Relic, Bonus Challenge, UI v4.63-4.68, Chapter 2 full run
5. (พักไว้) Play Store: ลบบัญชีในแอป, store listing, keystore, closed test

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

# Delivery: Wisp purification and special-card SFX (assets only)

Six new files in assets/audio/sfx/wisp_special/MANIFEST.json; see docs/audio_orders/WISP_SPECIAL_CARD_SFX.md. Wisp charge controlled loop + completion/interrupt; special-card pickup/offer/confirm distinct from normal level-up. Runtime unchanged v7.1.0. Live code channel progresses only while near, pauses otherwise; stop charge before purifyCore and all cleanup. openLevelUp sound check happens before guaranteed Relic construction: classify origin after choices, not solely pendingLvl. Next AI integrates, listens, checks/version/deploy.

# Delivery: Playtest SFX revision (assets only, 41 files)

Owner feedback: Slot/card/levelup/draw/Temple/mine/Enhance too short or weak; add poison and Hunt the Threat. Generated 41 original cues with structured 2–4.5s reward payoffs, shorter frequent strikes. assets/audio/sfx/playtest_revision/MANIFEST.json + docs/audio_orders/SFX_PLAYTEST_REVISION_41.md. Existing v7.1.0 integration untouched; runtime v7.1.0. Next AI must repoint keys, wire actual Hunt/poison/mine branches, enforce one outcome and stopped loops/voice channels, listen/tune, bump/check/deploy. No subjective listening approval claimed.

# Delivery: v7.1.0 — Event SFX refresh wired (133 + 4 procedural)

All 85 replace_existing keys in ASSET_AUDIO repointed to assets/audio/sfx/event_refresh/* (punch_heavy/frenzy share a line, fixed by hand); 48 new keys sfx_event_* + 4 sfx_*_real (procedural_replacements) registered. Sfx.ev(id,vol,gap,rate) = throttled playFile('sfx_event_'+id). Wired: streak/heartbeat/crit accent/bigKill accent use *_real files (synth fallback); pickCardAt 1st tap card_focus, 2nd tap semantic cue (Build Path→build_path_select, Infusion→infusion_apply, Relic→relic_acquire, Modifier→modifier_acquire, Trade-off→tradeoff_acquire, else card_confirm; Evolution keeps its own) — replaces shared_unique_charge_full; closeLevelUp Sfx.card skipped within 250ms of that cue; openLevelUp plays card_offer_open when no level-up fanfare (chest/relic offers); checkUniqueAutoUpgrade unique_rank_up; spawnMiniBoss miniboss_arrival; mini kill miniboss_defeat; sugar coin pickup_sugar; field currency pickup_currency; gear gift pickup_gear. NOT yet wired (registered, unused): ui_panel/tab/toggle/compare/item_focus/purchase, hero_select/unlock, card_flip/reroll, skill_rank_up/awaken, codex_rank_up, growth_*, wave_start/clear, stage_clear, boss_attack_telegraph, story_*, portal_enter, revive, loot_*_reveal, buff_pickup, gear_favorite/bulk. chest_spin/slot_spin still one-shot helpers. ending-growth-art test normalizes the new unique cue. Listening QC pending. npm check passed.

# Delivery: Full event SFX refresh (assets only)

Owner requested complete sound-event audit including reused file-backed cues. 133 ElevenLabs files in assets/audio/sfx/event_refresh/: 85 core replacements + 48 distinct UI/cards/growth/loot/stage events. See docs/audio_orders/FULL_EVENT_SFX_133_HANDOFF.md; all 458 static Sfx callsites in SFX_ALL_CALLSITES.json. Existing Build/Unique/procedural banks retained. Core issue: Sfx.clear reuses levelup, card confirmation reuses Unique charge. New files NOT wired; runtime remains v7.0.1; listening/tail trimming pending. Next AI: semantic event routing, preserve uiAction dedup/voice caps, do not restore disabled systems, then version/check/deploy.

# Delivery: v7.0.1 — Desktop loader/intro fit

Owner screenshot (1920 desktop): intro kitchen art zoomed (kitchen_loader.css .k-stage width max(100vw,…)). index.html media (hover:hover)(pointer:fine)(min-aspect-ratio:62/100): #game-loader boxed to 56.25vh centered, .k-stage 56.28vh, petals 20px. Headless 1600×860 OK. npm check passed.

# Delivery: v7.0.0 — Keyboard + desktop browser fit

Owner: play in browser with keyboard/mouse + fit the screen. setupKeyboard() (called after pointer handlers): WASD/arrows drive joy with id -78 (tickKeyboard at top of update; never overrides an active touch joystick), Space/Shift doDash, E/J hold = fake pointerdown/up on uniqueBtn with id -77 (works for tap, Titan hold, sniper/blast/Mint charge), F flicker, Esc/P togglePause, 1–4 pick level-up card (double pickCardAt = confirm). Mouse already worked (click-drag joystick, buttons). DESKTOP_FIT (no touch, not Capacitor native): viewSize() = 9:16 portrait (h·9/16) centered via injected #desk-fit canvas CSS; RENDER_W/H and _applyResize use it. Headless 1280×720: keys move/dash/unique/card, mouse click Dash + drag move OK. npm check passed.
# Delivery: Remaining procedural SFX asset handoff

Owner clarified SFX (not visual VFX) and requested all sounds still generated directly in code. Audit v6.99.3: 162 registered audio keys, all files present; 2 pure-procedural events (combo streak, low-HP heartbeat) + 2 unconditional synth layers (crit ping, bigKill bass/debris). All 4 generated via ElevenLabs, decoded/non-silent, delivered in assets/audio/sfx/procedural_replacements/. See docs/audio_orders/REMAINING_PROCEDURAL_SFX.md for complete inventory/fallback audit and integration steps. Files only: runtime NOT wired; listening QC pending. Preserve existing main crit/kill sounds and oscillator fallback; do not regenerate existing file-backed SFX. Next AI integrates 4 hooks, then version/check/deploy.

# Delivery: v6.99.3 — Play Stats Back → Settings

Owner (device, v6.99.2): Back still went to hub (nav stack path differs on device). buildStats now passes backScreen 'settings' to _screenBg. npm check passed.

# Delivery: v6.99.2 — Play Stats route clash

Owner: Play Stats Back went to hub; Heroes then stuck. Cause: menu route 'stats' already existed (Heroes → Stats tab: sets _heroesTab='stats', menuScreen='char'), so the Settings row opened Heroes. Play Stats route renamed 'playstats' (buildStats); row resets _heroesTab='roster'. Headless: settings → playstats → Back = settings. npm check passed.

# Delivery: v6.99.1 — Play Stats fix + faster Phantom Rush

Owner: Play Stats showed nothing. Cause: 'win' hook was only in victory() (final stage only) + Stats.start ran via time.delayedCall(0) (can stall while time paused). Now Stats.start(this) runs directly after the run-flag line in startRun, showStageSummary records 'win' (skipped when state dead or _quitSummary; typeof guard for tests), end() fills depth from _amapNode. Headless: stage summary → 1 run saved. Phantom Rush (dashboxer castCocoaUnique): leaps 3/4→4/5 (ul≥3), interval .42→.30s, glide/strike delay .2→.14s; desc '4 times'; cocoa-builds test cap 5. npm check passed.

# Delivery: v6.99.0 — Delve grows like Story (option 3)

Clarified to owner: damage() is identical in every mode; difference was growth. Now recipeMode uses storyXpNext (12+6·(lv−1)) and no ENDGAME_XP_MUL (const removed), and rollBasicAttackUpgrades storyCards = usesStoryBudget || recipeMode (path-focused drafts). Rift/BossRush unchanged. Risk: Delve has unlimited enemies → levels may climb fast; watch Play Stats. Tests updated (story-budget xpNext 18, story-build-pressure/all-hero-drafts recipeMode now grouped). npm check passed.

# Delivery: v6.98.1 — Delve boss floor 30%

Owner: lower Delve boss floor to 30% of C3-5. DELVE_BOSS_FLOOR=0.3 (next to ENDGAME_XP_MUL) multiplies the v6.98 floor (d1 normal node ≈144k). npm check passed.

# Delivery: v6.98.0 — Delve boss HP floor, live progress bar, stats copy

Owner: Delve bosses too weak from first depths (no continuity from C3-5). Cause: v6.68 ×2 boss mul is story-only + RECIPE_BOSS_HP .7 + theme stage bossHp (theme 0 d1 ≈2.7k vs C3-5 Normal ≈446k). spawnFinalBoss: recipeMode && _amapNode && !pinnacle → b.hp=max(old, C3-5 Normal boss × node(1/elite 1.5/boss 2) × delveMul(d).hp × pact boss) (d1 ≈481k). Miniboss untouched. Progress bar: animateProgressBar(dt) in update — _pbTarget set by renderReplayProgress/renderRecipeProgress (no direct crop), smooth lerp crop, moving white shine, pulsing head glow + pop on gain (pbFx graphics depth 56, cleared in clearWaveObjective). Play Stats: Stats.toText()/copy() (navigator.clipboard → textarea execCommand fallback), 'Copy to clipboard' pill above Clear. npm check passed. Not playtested.

# Delivery: v6.97.0 — Card pick chime + loot magnet

Owner: card-pick burst felt plain → pickCardAt (non-evolution) also plays Sfx.bp('shared_unique_charge_full',.5,.35,1.15). Owner: currency had to be walked over → tickLootMagnet(dt) (called after updatePickupReadability in update): loots group (currency + gear gifts) within 120px kill bob tween, hide pickup cue, glide to player at 160–540px/s (slower than EXP vac); g._mag reset in spawnLoot/spawnCurrencyDrop. Headless: drop at 100px collected, 300px stays. Delve level question: measured v6.93 vs current in story C1-4 — same XP/kills/level; asked owner for Play Stats screenshot. npm check passed.

# Delivery: v6.96.1 — Loader file counter

Owner screenshot (reference game shows "(47 / 53)"). Patched GameLoader.set (game.js tip IIFE) writes load-percent as 'NN%  (seen / count)' from LoadMeter.seen.size / LoadMeter.count. npm check passed.

# Delivery: v6.96.0 — Hero status bar under feet + v6.94 crash fix

Owner screenshot (reference game): level badge + HP bar + thin EXP bar under hero; keep HP numbers (Titan needs them). drawOverheadStatus: bar now at player screen y+30 — level square (pOverLv number only, 11px) left, HP 60×10 with 'hp / max' (pOverHp 9px), EXP 4px orange under (xp/xpNext). CRASH FIX from v6.94 cleanup (tests stubbed these, npm check missed them): rollBasicAttackUpgrades makeCard still used TAG_SETS_ON (ReferenceError on level-up cards), applyMeta still called gearSetCollected, syncBasicAttack called this.refreshTagSets, menu dispatch 'egbuild'. All removed; headless run + level-up cards show no page errors. npm check passed.

# Delivery: v6.95.2 — Level-up FX on normal card picks

Owner: level-up effect only seemed to show on Evolution. pickCardAt now calls playGrowthWorld('levelup',0.6) for every non-evolution card (Evolution keeps growth_unlock). playGrowthWorld(kind,ts) sets anims.timeScale (0.6 → ~1.1s), 500ms throttle unchanged (multi-pick shows once). npm check passed.

# Delivery: v6.95.1 — Wider battle camera

Owner: widen camera a bit. computeViewZoom BASE .76→.70 (~9% more field). Spawn/decor/culling radii already divide by viewZoom so they follow. npm check passed.

# Delivery: v6.95.0 — Local Play Stats (option ก)

Owner chose local-only stats first (Supabase upload = later option ข, ask before creating a table). Stats module (before CLOUD_URL): localStorage mochi_stats, last 300 runs {t,mode story/delve/bossrush/rift/pinnacle,stage,diff,depth,hero,cards≤40,result win/dead/quit,sec,level,kills,wave,boss,path,cause=_lastHitSrc,topDmg}. Hooks: startRun delayedCall(0) Stats.start (tutorial skipped), pickCardAt Stats.card, victory 'win', die 'dead', quitStage 'quit' (bossRush 'dead'); end() only once per run. Settings row 📊 Play Stats → menuScreen 'stats' buildStats (per stage★diff wins/tries/avg clear/top death, heroes/builds/modes, recent runs + cards, double-tap clear). tests/play-stats.test.cjs added to npm check. Headless screenshot of screen OK. npm check passed.

# Delivery: v6.94.0 — Consolidation F (dead code removed)

Owner: remove Endgame Build, Sugar Rush auto level-ups, Endless, Ascension, and every switch-disabled system; Zone Modifiers kept (owner undecided). Removed: egBuild/egBuildPoints/egUpgradeDefs/egBuildCost/EG_*, buildEgBuild, applyEgBuild, _egBuilt; recipeLevelUp, openRecipeDraft, slotLevelUp, refreshUpBtn, openUpgradePanel (⬆ button), RECIPE_DRAFT_EVERY, _draftQ/_specQ/_draftPick (sugarRush() kept: Sweet biome comets use it); buildEndgame screen, Save.canAscend/ascend/recordEndless, endlessMode/endlessCycle/secretBoss branches (endgameUnlocked = ascension>0 || storyComplete); TAG_SETS_ON/tagLabel/refreshTagSets/pause tag grid (TAG_SETS/tagCounts kept); OVERCAP_ON/buyOvercap/overcapCost/OVERCAP_MAX (owned overcap still counts, stones→threads kept); SET_COLLECT_ON/gearSetCollected/setDeposit UI; BESTIARY_STATS_ON/bestiaryBonus*/bestiaryTotals. Save refund migrations kept. Tests/validators updated. npm check passed.

# Delivery: v6.93.0 — Lighter GPU memory (perf item 1)

stageOnlyArtKeys() (STAGE_SHEET_KEYS + STAGE_DECOR items + floor_cN, minus bootKeep): preloadAll only downloads them into SW/HTTP cache (dl fetch, LoadMeter) instead of decoding into WebGL; ensureStageArt decodes per stage. syncBgTile() on postupdate: bgTile sized ≈ view + 2 pattern periods (even multiples of frame×tileScale, cap WORLD), position snapped to period multiples at camera centre → no 4000×4000 canvas (−64MB), pattern stays fixed in world. v6.92: nearestEnemy per-frame cache, evictOtherBgm. npm check passed. No on-device FPS measured.

# Delivery: v6.92.0 — Perf: per-frame nearestEnemy memo + BGM eviction

Owner chose perf items 4+5. nearestEnemy(maxD) memoised per game.loop.frame + player x/y per maxD (recompute if cached target died); raw scan moved to _nearestEnemyRaw. evictOtherBgm(keep) called in ensureStageAudio: removes decoded bgm_[smb]N/stage/boss/chN from cache.audio (+sound.removeByKey) except current stage/mini/boss keys and the playing track; files stay in SW cache, reload lazily. npm check passed.

# Delivery: v6.91.0 — White screen on phone (GPU memory)

Owner: C1-4 white screen with combat audio. Headless renders fine → device GPU memory: preloadAll decodes all art (~940MB RGBA) into WebGL → context lost. Fixes: (1) freeOtherStageArt(idx) at startRun (after warm) removes textures in other stages' stageArtKeys (minus current/bootKeep) + anims whose first frame uses them, clears _stageArtReady/_warmed for those stages → ensureStageArt reloads from SW cache next time (headless verified C1-4 → C1-1 reload, enemies/hero OK). (2) canvas webglcontextlost → Save.save, overlay 'Graphics memory ran out — reloading…', reload 1.2s. Not changed: preloadAll still decodes everything at boot. npm check passed.

# Delivery: v6.90.0 — Temple Weave Sugar cost raised

Owner: Weave too strong, low levels too cheap. Save.talCost = base×WEAVE_COST_MUL(3)×WEAVE_LV_GROWTH(1.8)^lvl×(1+rank)×1.25^rank (was base×(lvl+1)×…). Rank0 HP core 30/60/90 → 90/162/292. Thread costs unchanged. npm check passed.

# Delivery: v6.89.1 — MIMIC slot on every miniboss wheel

Owner: mimic should be a visible wheel slot from the start, random. openPrizeWheel adds MIMIC prize when opts.onMimic (weight so P=MIMIC_WHEEL_CHANCE 0.12), always kept among the 8 shown slots; landing → awakenMimic (kill → better chest, that chest has c._noMimic so no slot). spawnChest no longer pre-rolls c._mimic. Tutorial: no mimic. miniboss-rewards test mock updated. npm check passed.

# Delivery: v6.89.0 — Mimic is a prize-wheel outcome

collectChest mini: no pre-wheel awakenMimic; openPrizeWheel(tier,done,{mimic,onMimic}) — when c._mimic (12% roll in spawnChest unchanged) a MIMIC slot (mimic_chest_animated art, w 0) is forced winner, no tier upgrade; on land onMimic → awakenMimic (kill → better chest as before) instead of give/done. Pre-pickup mimic cue + 'Suspicious Chest' banner removed. npm check passed.

# Delivery: v6.88.0 — Old APK update notice

MIN_APK_VERSION (next to GAME_VERSION) + APK_DOWNLOAD_URL (rolling 'latest' release asset). checkApkUpdate (2.5s after first menu, native only): App.getInfo().version (versionName = GAME_VERSION at APK build via set-android-version.mjs; no App plugin → '0.0.0') < MIN → showApkUpdate modal (Download via Browser plugin / Later = hide for the day, localStorage mochi_apk_skip). Do NOT compare with GitHub release: 'latest' rebuilds every push. Bump MIN_APK_VERSION only when a native change needs reinstall (capacitor config, plugins, icons, bundled shell). npm check passed.

# Delivery: v6.87.1 — SW caches loader art + Supabase SDK

sw.js: /assets/ requests without ?v (index.html loader bg kitchen_night.webp, kitchen_loader.css url() images city/foreground/sakura) and cdn.jsdelivr.net (supabase-js, opaque) now go through shellFetch (network-first 3.5s → cached). Everything else already cached: hashed assets (cache-first) + shell (v6.87.0). Cloud save API calls (supabase.co) intentionally not cached. npm check passed.

# Delivery: v6.87.0 — Offline-ready shell (option 2: small app + first-run download)

Owner chose 'small APK + download game data on first launch'. Already existed: preloadAll full first-run download with progress (mochi_full_cached) + sw.js cache-first for assets?v=hash. Added: sw.js SHELL cache for navigate/index.html/*.js/css/json (network-first, 3.5s timeout → cached copy; offline works), index.html requests navigator.storage.persist(). capacitor server.url (Pages) unchanged. Not yet: bundling shell inside APK (needs server.url removal + updater), Play Store AAB/keystore. npm check passed.

# Delivery: v6.86.0 — Ricochet link fixed + unused FX files deleted

ricochetLink(x,y,tx,ty): static frame 0 of bpx_momo_link (origin .1, scaleX d/205), alpha tween 250ms + 600ms safety destroy, max 6 alive (_rlN). Owner asked to delete effect art of unknown/unlogged origin that was not wired: assets/vfx/vfx_{chili_nova,frost_pulse,telegraph_hazard,ult_sugarbomb,ult_cocoavortex,proj_donut}*.png, generated/vfx_burn_zone.png, and registered-but-never-played fx_ult_bomb, fx_popcorn, fx_flickerstrike, fx_star_guard, fx_bosssummon (files + registry entries). Wired assets untouched. scripts/batch_generate_vfx.mjs still lists the deleted outputs (generator only). npm check passed.

# Delivery: v6.85.1 — Objective arrow orbits the hero

updateObjectiveArrow: arrow placed at player screen pos (same world→ui mapping as drawOverheadStatus) + radius 62 with bob, angle from player to target, scale .8, hidden when target <140px. npm check passed.

# Delivery: v6.85.0 — Ricochet link ribbons removed + optional Mint intro

Owner screenshot: pink ribbons stuck on map. Cause: hitEnemy ricochet bounce spawned bpx_momo_link (ASSET_FX loop:true → animationcomplete never fires → never destroyed). Link FX removed (bounce burst kept). Mint intro: startStoryStage(2) first time (no Save.data.mintIntro, stage 3 not cleared) shows showMintWarning (text now optional: Choose Mint → heroes coach / 'Keep my hero' → starts stage). story-budget test assertion updated. npm check passed.

# Delivery: v6.84.1 — Tablet ghost props

Owner screenshot (tablet): box + crystal pillar drawn bright over level-up overlay. Cause: buildStageProps solidProps.create sprites never camWorld'd (solidProps not in _worldObjs) → also rendered by uiCam at their world coords; tablet's larger W/H puts more of world origin area in uiCam view. Fix: camWorld(s) on each solid prop. npm check passed.

# Delivery: v6.84.0 — Unique screen FX (Momo, Mint, Cocoa)

screenFx(life,draw) helper: code-drawn Graphics depth 95000 re-positioned to camera worldView on scene 'postupdate' (life 0 = until kill()). scrEdge vignette helper. Hooks: sniper fxScopeStart in startSnipeCharge (stopped in cancelSnipe) + fxScopeStop(true) white flash in releaseSnipe; shotgun full-charge fxShotgunScreen; Rebound fxReboundScreen; brawler rocket first detonation fxHeatScreen (1.5s throttle); Phantom fxPhantomScreen(1.4); Glacier Bloom full fxFreezeScreen (ice corners 1.5s then shards); releaseFrostLance fxLanceScreen; castWindRush fxGaleScreen. Titan crack from v6.83. Taro/Sesame/Yuzu intentionally not done (owner: later). No settings toggle yet. npm check passed.

# Delivery: v6.83.1 — Boss warning fully silent

Owner: beeping 'ตื๊ด ๆ' alarm on every danger. It was sfx_hazard (sfx_vfx_telegraph_hazard.wav, 1s) that v6.82.3 put into Sfx.bossWarn (~32 telegraph call sites). bossWarn(){} is now a no-op; visuals unchanged. npm check passed.

# Delivery: v6.83.0 — Titan slam slower + screen crack

titanRageImpact: crack/shockwave/crush sprites anims.timeScale (lv1 .7, lv2 .5, lv3 .38); hitStop lv3 220ms. New titanScreenCrack(lv) code-drawn white crack lines over camera worldView (depth 95000, lv2+, fades after .55/.9s). No screen-crack art asset exists in repo. npm check passed.

# Delivery: v6.82.3 — Buzzing boss warning removed

Owner: fly-like boss sound that fades everything. Culprit: Sfx.bossWarn → sfx_boss_warn.mp3 (2.7s; gen_stingers_synth detuned saw siren ~73Hz with 3.2Hz vibrato = buzz) called from ~32 boss/elite telegraphs, plus duckBgm(900,.34). bossWarn now plays only short sfx_hazard (vol .42), no duck, no saw fallback. npm check passed.

# Delivery: v6.82.2 — Shotgun uses sniper fire SFX

Owner: shotgun blast still silent after v6.82.1, sniper fire audible → releaseBerryBlast fire() now plays uq_sniper_fire (rate .85) at the START of fire() (before VFX, try/catch), fallback Sfx.boom. uq_shotgun_blast unused. npm check passed.

# Delivery: v6.82.1 — Shotgun blast audible

Owner: pump heard, blast BOOM missing. Cause (likely): playFile global cap 10 live voices dropped it in busy fights (returns true = no fallback). sfx_uq_* now bypass the global cap (per-key cap 3 kept), louder ceiling .6/×.85. releaseBerryBlast falls back to Sfx.boom if uq file not yet loaded (Sfx.uqReady). npm check passed.

# Delivery: v6.82.0 — Unique SFX wired (26 sfx_uq_*)

ASSET_AUDIO sfx_uq_* (assets/audio/sfx/unique_skills/). Hooks via Sfx.bp/bpLoop: startSnipeCharge (blast pump / sniper charge loop, stopped in cancelSnipe), tickSnipe full (shotgun_full / sniper_full), releaseSnipe uq_sniper_fire (replaces boom+beam, bolt +260ms, railgun echo reduced), releaseBerryBlast uq_shotgun_blast; Titan rage loop uq_titan_charge (was cocoa_rage_charge), uq_titan_full at titanMaxLv, castCocoaUnique titan uq_titan_drop / uq_titan_slam_full at max / uq_titan_aftershock on .65s hit; brawler rockets b._uqRocket → uq_rocket_salvo (gap .8) + uq_rocket_detonation (getBullet now resets _uqRocket and _bpBoom); phantom enter/strike (flicker step removed there); castWindRush uq_mint_gale, releaseFrostLance lance_release, releaseGlacierBloom c>=1 bloom_full; Rebound uq_rebound_burst; castPathRecall chain_cast/chain_hit; castOathWard prism_charge/volley (gap .18); Citrus Parade uq_yuzu_parade. Not wired: uq_yuzu_crew_hit (optional), Stage 3-1 trial music (bgm_s11 already new campaign track). Listening QC pending. npm check passed.

# Delivery: v6.81.0 — 45 campaign music tracks wired

ASSET_AUDIO bgm_s01..15/bgm_m01..15 repointed to assets/audio/bgm/elevenlabs_campaign/c1..c3/; bgm_b01..15 added. bgmKeyFor: per-stage boss bgm_bNN after stage branch (endgame priority + chapter/legacy fallback kept). Boot/background skip regex /^bgm_[smb]\d/ so they stay lazy (ensureStageAudio stage, warmBossAudio mini+boss). Old stage/ files kept as unused fallback. Listening QC on phone pending. npm check passed.

# Delivery: 45 campaign music loops (assets only)

Owner requested theme-based normal music + fun exciting miniboss/boss fights for all C1-1..C3-5. 45 playback MP3 in assets/audio/bgm/elevenlabs_campaign/: 44 new ElevenLabs compositions + reused C3-1 trial. See docs/audio_orders/CAMPAIGN_MUSIC_45_HANDOFF.md / MANIFEST.json. All decode and contain audio, listening review pending. Not integrated: runtime remains v6.80.0. Next AI: register sNN/mNN/bNN paths; update bgmKeyFor boss routing before chapter fallback, preserve endgame priority and lazy loading.

# Delivery: Unique spectacle audio + Stage 3-1 trial (assets only)

26 new ElevenLabs Unique SFX in `assets/audio/sfx/unique_skills/`: pump-shotgun, sniper crack/whistle, max-charge Titan ground slam, all six active hero ability families. Stage 3-1 Ashen Seedfields music original + ~62s prepared loop in `assets/audio/bgm/incoming_stage31/`. See `docs/audio_orders/UNIQUE_SFX_STAGE31_HANDOFF.md` for precise hooks and loop/mixing rules. Existing 35 Build sounds already integrated in v6.73.0. New assets NOT wired, runtime remains v6.79.0; listening review pending. Owner wants another AI to integrate. Next: follow handoff, preserve combat timing, then version/check/deploy.

# Delivery: v6.79.0 — Consolidation D1/D2/D3 (D done)

D1: SET_COLLECT_ON=false — gearSetCollected false, codex deposit tap/bars/collect line hidden; load refunds setDeposit ×10 shards. D2: Bazaar tab 'Gacha' (was Boxes) holds Gear Gacha (openGachaReveal, band from Equipment) + Trade-in + supply box; Equipment gacha button kept (tutorial). D3: CUR_ALIAS exalt/regal→transmute, chaos→alt; curKey() in currencyDef/Save.currency/add/spend/order payout; load merges old stock; CURRENCY list 5 entries; prices transmute 120 alt 110. Tests: progression-polish context + 3 nav tabs. npm check passed. Next: E.

# Delivery: v6.78.0 — Consolidation C1/C2/C3/C5 (C done)

C3: BESTIARY_STATS_ON=false (bestiaryBonusTotal → {}), Sugar per tier unchanged. C5: Bazaar Orders tab removed; Save.load refunds active sugarOrder cost (miners already Depths-only). C1: OVERCAP_ON=false hides Overcap button; owned overcap still counts in talTotal (shown +N); dug Core Stones → +STONE_THREADS(25) thread; load converts stored coreStones to threads. C2: Special Cores button moved from Weave to Rank Perks (above Ancient, already there); back returns to perks via _specialFrom. dig test context got OVERCAP_ON/STONE_THREADS. npm check passed. Next: D.

# Delivery: v6.77.1 — Mint Barrage volley FX

bpx_mint_volley was a 220px fan (anchor left) on every Barrage cast with ≥2 lances (from first card) — looked like a 3-prong hit beyond real reach. Now 70px center muzzle flash 30px ahead. npm check passed.

# Delivery: v6.77.0 — Titan no lunge, C4 Kitchen gate

Titan castCocoaRush: joystick glide toward target removed (poses kept). C4 option ก: kitchenOpen() = stageMastery[9]; frActive() returns [] when locked (no recipes/upkeep), Hub Kitchen tile shows 🔒 + menuToast. Saved recipes untouched. npm check passed.

# Delivery: v6.76.0 — Consolidation B1 (A6/B2 no change)

B1: startWaveEvent clears this._bonus so Courier/Cache replaces that wave's Bonus Challenge. A6: card rarity already fixed to common (rollRarity) and frame code inert — left as is. B2: miniboss chest already uses prize wheel + Mimic only (no mystery-card layer) — no change. npm check passed. Next: C (meta, needs save refunds).

# Delivery: v6.75.0 — Consolidation A5

Fusion card disabled; autoFusion() applies the matching FUSIONS mod automatically when Evolution and its relic are both held (called 2.3s after Evolution pick and 0.6s after gainRelic). npm check passed.

# Delivery: v6.74.0 — Consolidation A4

Conditional endless cards (c_low/c_dash/c_still/c_full/c_boss/c_streak/c_close) removed from endlessStatDefs; condRelicCard() offers them in rollRelicChoices (45%) as one-pick relics giving 2 stacks of p._cond (b.condRelics, counted in relicSlotsLeft). npm check passed.

# Delivery: v6.73.0 — Build path SFX wired

35 MANIFEST keys in ASSET_AUDIO. Sfx.bp(name,vol,gap,rate) throttled one-shot; Sfx.bpLoopStart/Rate/Stop single charge loop (stopped on mute, togglePause, exitStage, die, release/cancel). Hooks in cocoaFireFist, bullet._bpBoom explode, castCocoaUnique (rocket/stick/colossus/phantom/shadow mark), tickTitanRage (rage loop + level), castCocoaRush titan leap/slam, Dash Leap step/landing, cocoaEvoDash, castFrostLance/releaseImpalerCharge, castImpalerLance loop, queueHailstorm, applyImpale stack/rupture, releaseGlacierBloom, glacierShatter, berry sniper loop/shot/impact, ricochet bounce, pinball final/cast, startSnipeCharge/tickSnipe charge cues, Evolution card, endWeakPoint shield break, beginBossPhaseTransition. Call sites use Sfx.bp?.(). Listening QC pending.

# Delivery: Build SFX asset handoff

Owner authorized ElevenLabs generation and requested asset delivery for another AI to integrate. 35 MP3 files in `assets/audio/sfx/build_paths/`; see `docs/audio_orders/BUILD_PATH_SFX_INTEGRATION.md` and MANIFEST.json for exact keys/events/loop handling. All decode and are non-silent; listening QC and runtime hooks pending. Three optional P2 sounds not generated. Owner explicitly requests files + handoff only; game.js/version/balance unchanged. Next AI: integrate via existing audio/Sfx backend, stop charge loops on cancellation, limit frequent voices, then bump version and run normal checks.

# Delivery: v6.72.0 — Consolidation A2/A3

Modifier + Trade-off cards removed from level-up pools (guarded false&&); rollRelicChoices adds modCard (60%) / tradeCard (35%, stage≥5 or recipe) into relic offers. RELIC_CAP 3→5 shared: relicSlotsLeft subtracts non-fusion mods + trades (MOD_MAX/TRADE_MAX still inner caps). Level relic offers at Lv6/12/18 (_relicLvN, reset in resetRelics). Not playtested — owner tests (owner: no headless sims, waste of time/tokens). Next: A4 conditional cards. npm check passed.

# Delivery: v6.71.0 — Consolidation A1

Owner approved system cut/merge plan: docs/SYSTEM_CONSOLIDATION_PLAN.md (track status there). A1: TAG_SETS_ON=false disables Tag Set tier bonuses (refreshTagSets no-op), tag labels/⬆ hints on cards, pause tag grid and HUD tag counts; TAG_SETS/tagCounts kept (trade-off/unique _tagIgnite/_tagChill unaffected). Dual Infusion offer disabled (infusion2 paths remain harmless). Next: A2 Modifiers into Relic pool. npm check passed.

# Delivery: v6.70.0 — Mint buff

Owner chose critique fixes A+B+C. CHARACTERS.mint dmg .92→1.00, crit .02→.05. cdOf mint frost base max(1.0,1.7−.07·lvl) (was max(1.25,1.95−.08·lvl)). mintVolleyProfile 2nd lance at lvl≥3 (was 4). damage(): Mint vs boss/mini ×(1+.04·min(4,_chill)) while chill fresh (≤2.5s); Glacier Brittle boss ×1.15. mint-glacier test updated 135→155.25. Mint Gale damage (option D) not done. npm check passed.

# Delivery: v6.69.1 — 8-Way Shots fix

Kitchen shots bullets set b.frShot (reset in getBullet); hitEnemy sets _frDmg while resolving them, so damage() skips powerMul and crit like other recipes. npm check passed.

# Delivery: v6.69.0 — Kitchen upkeep and rework

Owner approved: recipes had no downside. FR_SLOT_MAX 5→3; frUpkeep/applyFrUpkeep (applyMeta + computeHeroStats 'Kitchen upkeep'): per active recipe −6% maxHP, −4% dmgMul, +2% per DO ★ above 1 and +2% signature. Effects heal/recover/shield/immune/cdr marked cut (hidden in bag, skipped by frActive). Save.migrateKitchen3 (flag kitchen3) returns parts from slots ≥3 and cut parts, frSlots capped 3, frSlotRP=5. frHit sets _frDmg → damage() skips powerMul and crit. frEffect pw capped 2.5. Rage/Haste 4s with 8s cd. Minty refreeze ≥3s per foe (e._frIceAt). npm check passed.

# Delivery: v6.68.0 — Story C2–C3 buff, Temple cost nerf

Owner chose buff 1 + nerf Sugar upgrades. STORY_MOB_TAIL 1.18→1.28 (stage curve tail after index 5, story only; recipeMode keeps 1.18/1.17); realStageBossMul(i,endgame) ×2 for i≥5 when not recipeMode (boss + mini). Save.talCost rank factor 1.15^rank→1.25^rank. stageThreat/recommended power follow automatically. Kitchen review given to owner, not changed. npm check passed.

# Delivery: v6.67.0 — Item mods: no prefix/suffix, max 3, Play mods

Owner chose mod critique item 1 + remove prefix/suffix. All affix defs kind='mod' at runtime (MOD_LINE_MAX 3, CRAFT_AFFIX_CAP 3, AFFIX_COUNT legend 3); Save.migrateModLines3 trims old items to 3 best tiers (flag modLines3). Craft bench one MODS column; compare one MODS section. 6 Play mods (category 'play', weight ~30): m_dashnova (doDash → gearModBoom), m_critarc (damage crit → gearCritArc, 2 foes), m_killshell (killEnemy → gearKillShell, shield cap 2), m_stillfocus/m_opener (damage mul), m_thorns (charPassiveOnHurt, 1s cd). Fields reset in applyMeta. Validator affix count 41. npm check + headless craft screen passed.

# Delivery: v6.66.0 — Delve cards chosen like Story

Owner: normal cards in Delve should not auto-apply; pick like Story. openLevelUp recipe redirect to recipeLevelUp removed again; closeLevelUp reopens for pending levels (recipeLevelUp/Sugar Rush/every-5 draft unused). Endgame Build stays removed. npm check passed.

# Delivery: v6.65.0 — Endgame Build removed

Owner clarified "auto build" meant Endgame Build. startRecipeRun no longer calls applyEgBuild (_egBuilt=false); Delve panel Build chip/over-budget gate removed, Start full width (buildEgBuild/egBuild helpers now dead code). v6.62 auto upgrades restored (openLevelUp recipe redirect + closeLevelUp recipe branch). v6.64 slower meters kept. npm check passed.

# Delivery: v6.64.0 — Slower meters, manual Delve cards

Owner: replay progress and Delve Hunger fill slower; remove auto build. replayOnKill 1/8→0.75/6; HUNGER_PER_KILL .25→.19, elite 8→6, FEAST_SHARE .15→.12, MISSION_HUNGER .2→.16. openLevelUp no longer redirects recipeMode to recipeLevelUp (Sugar Rush auto stats + every-5 draft now unused); closeLevelUp reopens for pending levels in recipe too. npm check passed.

# Delivery: v7.2.0 — Playtest fixes + playtest_revision/wisp_special SFX wired

Owner playtest list. (1) Craft font jump: buildCraftBench now wraps _buildCraftBenchRaw in _clampFonts(11) on every rebuild (was only on first open via menu dispatch). (2) PC aim: tickKeyboard aims _snipe id -77 at mouse cursor; right mouse hold = Unique (context menu disabled). (3) Keys on rolling/rewardChoice: 1–9 = _rollBtns/_rewardBtns[i], Space/Enter when single button (STOP). (4) SFX: playtest_revision (41: 26 repointed keys incl. card/levelup/slot/loot/temple/dig/enhance, 15 new sfx_event_*) + wisp_special (6) registered; wired wisp charge loop (bpLoop 'event_wisp_purify_charge' only channel+near, _wispSnd flag; stops in purifyCore/killPurifyWisp/clearWaveObjective) + complete/interrupt, special_card_offer (openLevelUp sound decided after relic/forced choices) + special_card_confirm (chest/relic panels), hunt_threat_start/complete, hunt_curse_apply, dig thread/scroll/part/ladder/core-stone. Not wired: slot_stop, item_roll_*, poison_apply, enhance_start, dig_find_item/currency, special_card_pickup. (5) Mimic: awakenMimic uses spawnElite(true,true) — story budget was exhausted after miniboss → fell back to chest. (6) DEFAULT_SETTINGS vfx 2, quality 2, shake 2 + one-time migration settingsHigh72; QUALITY_SETTING/perfQuality default 2 (High DPR = more GPU memory; watch white-screen). (7) Supply Cache jars + Crown-Root anchors: tickProximityObjects — stand within 105/140px to charge 1.2s/2.6s (ring + arc, decays 0.5×), labels 'Stand close'. (8) LoaderMusic.stop in GameLoader.hide + startRun. Also fixed stale pbFx Graphics after scene restart (.scene check). npm check + headless (crate breaks by proximity, mimic spawns) passed.

# Delivery: v7.3.0 — Frost Burn, objective audio and painted screen FX

Continued latest v7.2.0 (other AI had wired 41+6 asset banks already). Added 5 ElevenLabs files runtime_polish: Capture controlled progress loop + success, Mint ice charge loop, stronger Slot loop + jackpot. eventLoopStart/Stop maintains separate Wisp/Capture/Mint/Slot channels (old bp single channel would restart loops against each other). Loops stop on leaving/cancel/mute/pause/levelup/death; progress restarts only valid channels. Wheel and Roll Box now call actual Slot lifecycle (old slotSpin was unused); final outcome stops spin and one rewardCue supersedes earlier reward tail. Capture removed chestWin+ult+clear stack; completeWaveObjective suppresses generic clear for Hunt/purge/Capture. Curse prominent shared warning + CURSED label; known toxic hazard damage gets poison cue only on accepted HP loss, 3s throttle, no new poison gameplay mechanic. Mine Sugar Ore uses currency find; special-card Roll Box uses pickup instead of normal clear. enhance_start, item-only mine cues remain reserved where no delayed forge/gear-mine event exists.

Glacier Bloom hit power +10%, initial hit and delayed shatter apply Frost Burn (5-stack cap, refreshed 8s duration, each stack base 8% Bloom hit power/sec, 0.5s tick). Frozen foes tick before freeze return. Existing damage pipeline honors boss gates; inf/recipe guards prevent on-hit recursion/crit. All spawn/pool resets clear burn fields. Unique rank-up uses prominent HUD notice above draft + button pulse + rank-up principal cue; suppresses immediate ordinary levelup fanfare. Seven ImageGen alpha overlays assets/art/screen_effects used on Unique/upgrade; center stays clear, VFX off respected, one painted overlay at a time, scene exit destroys it. Export sizes/memory in MANIFEST.

Validation: npm check includes frost-burn-audio test; production build and Pages verification tracked in docs/RUNTIME_POLISH_7_3.md. No headless gameplay simulation; owner phone playtest pending for balance/audio/art.

# Delivery: v7.3.1 — Equipment portrait and Dash Boxer audio

Owner screenshot showed only hair in wide portrait equipment panel. Fixed crop to constant upper 55% rather than shrinking source height with panel aspect; contain scale keeps face and image inside frame on phone/tablet. Dash Boxer Dash Leap stops layering cocoa_flicker_step onto normal Dash; landing returns original comboPunch heavy. Phantom Rush Unique activation/auto-strike sounds unchanged. Regression tests check real crop block across widths and texture ratios; full check and build required.

# Delivery: v7.3.2 — Floor TileSprite GPU fix (−64MB)

Owner: "ran out of graphics memory". Headless measure (412×915 @DPR3): 705MB textures at menu, all GL-uploaded; biggest = TileSprite's own 4000×4000 canvas (64MB). v6.93 syncBgTile never worked (used t.frame = the TileSprite canvas, so P≈4000). Now bgTile is a hidden 2×2 TileSprite kept only as state (texture/tileScale/alpha/tint API unchanged) and syncBgTile draws the floor with ≤64 pooled plain Images of displayTexture snapped to the view (0 extra GPU). Measured 641MB menu / 612MB in stage. Screenshot: floor seamless after moving. GPU memory plan proposed to owner (pending approval). npm check passed.

# Delivery: v7.4.0 — GPU memory plan P1+P2+P4+P5

Owner approved plan (P1+P2+P4+P5 now, P3 next, P6 later). artClass(k,u) (after bootKeepAudio): null=core | 'hero' (char_/bpx_/fx_/hero_screen_<id>, minion_→yuzu, vfx_glacier_→mint; base char_<id> stays core for roster) | 'stage' (stageOnly + deferredImage + bg2..15) | 'endgame' (ENDGAME_ART_RE) | 'menu' (incoming/, art/temple|delve|talents, ui/temple, character_cards, LAZY_MENU_KEYS craft_bench_bg/ui_talent_hall/dig_bg). P1: preloadAll lz() → dl() only (SW cache, no decode) for every lazy key except the saved hero's; buildMenuScreen menuLazyMissing(s) → ensureGroup before building (15s retry guard); _screenBg loads any ASSET_IMAGES bg lazily; lazyTex(k) helper (daily card). startRun: runArtKeys() (current hero + endgame when recipe/pinnacle/rift) loaded first (25s guard), then after menu.setVisible(false) menu.removeAll(true)+texFreeForRun(). P2: texMB/texInUse (display list, active only)/texTouch (filecomplete + shown on menu build)/texEvict(pred,budget) LRU, never in-use, removes anims on those textures, invalidates _stageArtReady/_stageCardsQueued/_warmed/_critOk; texBudget() at end of buildMenuScreen; TEX_BUDGET_MB 250 low-mem / 400. P4: DEFAULT quality 0 Auto + migration settingsAuto74 (QUALITY_SETTING treats unmigrated save as Auto); contextlost sets mochi_lowmem (+note) → LOW_MEMORY_DEVICE, DPR ≤1.5, budget 250, menu toast once; choosing Performance clears it (clearLowMem). P5: Play Stats + copy text line 'Graphics memory: X MB / budget · render ×DPR'; tests/gpu-memory-budget.test.cjs parses image headers: boot per hero 246–284MB (cap 300). Headless 412×915@3: menu 641→256MB, browsing all menus capped 400 (LRU evicted), Cocoa C2-3 stage 612→327MB, screens render. No on-device test yet.

# Delivery: v7.4.1 — GPU memory P3 (oversized art downscaled)

PIL Lanczos in place (same paths/formats, build-www hashes change URLs): menu_hub_v3 1440×3200→1080×2400, temple life/flavor/oath 1254²→256², special_cores_sheet 2172×724→870×290, rank_emblems 1536×1024→576×384, special_core_card 2172×724→1086×362, painted_nav_button 2172×724→869×290, replay_progress_sheet 1942×809→777×324, stage_summary_panel 1024×1536→768×1152. Hardcoded pixel frames now scale by source width (replay 'empty'/'fill' q=w/1942, nav 'button' q=w/2172) and animateProgressBar crop uses L.frame.width/height (was 1520×74). Boot estimate 225–262MB per hero; headless hub/Special Cores/progress bar 50% OK. P6 (ASTC/ETC2) not started.

# Delivery: v7.5.0 — Daily Quests (points + 3 reward boxes)

Owner: replace daily challenge with the usual quest board. DQ_POOL (before POWER_TUNING): kills 150, clear 2, elite/mini 3, boss 1, cards 15, sugar 600, gear 4 (req stageMastery[0]), shards 20 (req 0), dig 5 (req 1). dqPick(day) seeded: kills+clear + 3 shuffled unlocked. DailyQ.data() resets per localDayKey (Save.data.dailyQ {day,quests[{id,p}],boxes}); tick(id,n) caps, banner on complete, throttled save; _mute skips (box/login rewards). DQ_PTS 20 → DQ_BOXES 40 bronze / 70 silver / 100 gold (chest_badge_* art). Hooks (all typeof-guarded for vm tests): advanceDaily(kind) → tick (existing kills/dig callers), killEnemy elite/mini/boss, Stats.card cards, Stats.end win clear, Save.addSugar sugar, dismantleGearInstance/Inbox shards, grantGear gear. buildDaily rewritten: compact Login Reward + points bar with 3 tappable boxes + 5 quest rows (tap → chapter/gear/dig) + reset countdown; dqOpenBox(i): Sugar 80/160/320 ×(1+0.5·chapter), shards/currencies after S1, shovels after S2, Grand gives grantGear rare/epic(25%); popup, rewardCue loot/chest. Badge: login unclaimed or box ready. Old dailySpec/challenge data left (unused). tests/daily-quests.test.cjs. Headless screenshots OK.

# Delivery: v7.4.2 — Heroes screen stuck on Play Stats

Owner: can't reach character select after visiting Play Stats. Cause: v6.95 added Play Stats as a second Game.buildStats() method; the later definition silently replaced the Heroes Stats tab's buildStats, so once _heroesTab='stats' every Heroes open rendered Play Stats (Back → Settings). Play Stats is now buildPlayStats (route 'playstats' + Clear button); Heroes tab keeps buildStats. Back with a fixed backScreen pops that screen from the nav stack top (no double Back on Settings). New tests/no-duplicate-methods.test.cjs scans every class for duplicate method names (caught the old bug). Headless: Heroes → Stats tab shows 'Heroes · Stats'; playstats → Back → settings → Back → previous screen.

# Delivery: v7.5.1 — Casino prize-wheel audio

Owner: wheel spin should feel like a casino. scripts/gen_wheel_sfx.py (numpy → ffmpeg mp3) makes assets/audio/sfx/wheel/ wheel_clack (peg/flapper), wheel_roll (2.4s swelling drum roll), wheel_win (bell ding ×3 + coin sparkle); ASSET_AUDIO sfx_wheel_*. Sfx.wheelTick(slow) constant pitch ±4% (was chestTick rising pitch), louder after STOP; doStop stops slot spin loop and schedules wheelRoll to end at landing (sum of slowdown steps − 2.4s); landing plays wheelWin before reward. Capture objective still uses chestTick. Owner asked about NFT items — answered (not recommended now), no code. Listening on phone pending.

# Delivery: v7.6.0 — Unique levels only from Talent

Owner: Unique must not level up in a stage; only via Talent. UNIQUE_TALENT {id:'unique', max 3, costs [3,5,8] TP, free:true} appended by charTalents(c) (CHAR_TALENTS untouched; no packed icon → ✨ emoji). buildTalents core: okN allows n.free, costN uses n.costs, no prerequisite line; talSpent refunds unique costs. uniqueTalentLevel(c)=1+tal.unique (cap UNIQUE_MAX_LV). All three run resets set uniqueLevel from it; level-up no longer calls checkUniqueAutoUpgrade (function + uniqueAt kept for tests/validator). talent-art baseline hash + talent-icons test updated; tests/unique-talent.test.cjs. Headless: buy 1 rank (3 TP) → stage starts Unique Lv2, stays Lv2 at run level 40. Balance: players now start runs at Lv1 Unique unless they spend TP — watch difficulty.

# Delivery: v7.6.1 — Camera always centred + numeric card levels

Owner: at the bottom map edge the Sniper charge (tickBossZoom ×0.72 zoom-out) left the hero far below the screen-centred scope. Cause: cameras.main.setBounds(WORLD) clamps scroll (even normal play stops centring ~650px from the edge). Now cameras.main.removeBounds() — camera always follows the hero; physics world bounds unchanged; floor already drawn around the view by syncBgTile (seamless beyond the edge, headless screenshot). Level-up cards: stars → 'Lv N / max', max ≥99 (endless Power Up) → 'Lv N / ∞'. Owner also reported a crash entering Stage 3 the first time after choosing Mint (intro → Heroes coach → Mint): could NOT reproduce headless (first launch, cached launch, 4GB low-memory; 256MB textures, no errors) — asked owner for version/symptom.

# Delivery: v7.6.2 — 'reading sourceSize' crash on stage change

Owner screenshot: "Cannot read properties of null (reading 'sourceSize')" entering C2-1 right after C1-5 (also seen entering Stage 3 after switching to Mint). Cause: freeOtherStageArt / texEvict (v7.4) removed textures + anims while pooled (inactive) enemies/bosses, the player's stale currentAnim or container children still pointed at their destroyed Frames (Frame.data=null → realWidth crash). New texDetach(drop): walks display list (recursing containers) + every scene Group's children; any anim (current/next) touching a dropped texture is stopped and cleared, any object textured with one is set to '__DEFAULT' and hidden. Both free paths call it before removing anims/textures; freeOtherStageArt now drops anims if ANY frame uses a dropped texture (was first frame only). tests/texture-detach.test.cjs. Owner asked not to run headless sims for this; not re-tested on device yet.

# Delivery: v7.6.3 — Cocoa intro at C2-1 + audible punches

Owner: unlock/introduce Cocoa at C2-1 like Mint. HERO_INTROS table (after CORE_UNLOCK_STAGE): Mint idx 2 (flag mintIntro, text unchanged), Cocoa idx 5 (flag cocoaIntro, card_cocoa, 'Fermented Canopy armored roots / Root Beetles — bear gauntlets punch through'). Cocoa is already unlocked by clearing C1-5 (CORE_UNLOCK_STAGE cocoa:4). startStoryStage(idx): first entry, stage not mastered, hero owned and not already selected → showMintWarning(hi) (name kept for tests; now generic) → Choose → Heroes coach spotlight 'Pick Cocoa for C2-1!' (this._mintCoach holds the intro entry) → startStoryStage(hi.idx); 'Keep my hero' starts the stage. typeof guards for vm tests. Owner: Cocoa punches silent — files/calls existed (comboPunch jab/heavy, Sfx.bp cocoa_*); global 10-voice cap in playFile dropped them in crowded fights → sfx_punch* and sfx_cocoa_* bypass the global cap like sfx_uq_* (per-key cap 3 kept).

# Delivery: v7.6.4 — Equipped item mods, Sell/Dismantle back, heavier punches

Owner: (1) tapping the equipped item should show its mods — drawModCompare returned right after 'Open mod slots' when isEq; now lists implicit (+tier name) and every affix (emoji label value, Tn) in a MODS panel, 'No mods yet' fallback. (2) Remove the ⋯ More button; Sell/Dismantle always shown (moreOpen=true, row 2 = Craft 52% + ★ + 🔒). (3) Cocoa punches sounded like tiny jabs: punch_jab.mp3 measured −34dB mean / almost no <200Hz; Sfx.comboPunch now uses sfx_punch (event_refresh/punch.mp3, −11.6dB, strongest bass) with random pitch 0.98–1.18 for jabs, and heavy = punch at rate ~0.85 + punch_heavy layer. Quick UI screenshots of the gear screen OK; punch sound not listened to.

# Delivery: v7.6.5 — Titan vs high-HP bosses

Owner Play Stats: Titan died to the C2-2 boss after 9:18 (Brawler cleared C2-1 in 4:12). Titan basic punches are the slowest path (≥0.5s interval, 0.24/0.32 wind, fin cd ×1.3) with no boss bonus; its boss damage relies on Colossus Fist, which v7.6 weakened unless Unique Mastery is bought (uniquePower 1.0 vs up to 1.72 before). Buff: cocoaHit opts.bossMul (bosses/minis only); Titan basic punch bossMul 1.4; CHARACTER_UNIQUES titan Colossus Fist cd 12→9. Not playtested; owner to retry C2-2.

# Delivery: v7.6.6 — Detailed Play Stats copy

Owner: copy should include levels, equipped gear, talents etc. Stats.kit(hero,basic) snapshot at Stats.start → r.kit {clv,tp,ulv,pw,st (HP/DMG×/Crit/CD×/Armor/Taken×), tal 'id:r', weave 'rank · HP/DMG/DEF · perks', gear per GEAR_SLOTS 'slot: name +enh iLv grade [mod v Tn…]' (starter → 'starter')}. Stats.end adds dmg top-5 share %, end maxHP, pwEnd. toText: profile line (sugar, unlocked stage, heroes Lv) + per-run indented lines hero/talents/weave/gear/damage. All in try/catch (vm tests). Quick headless eval of toText OK.

# Delivery: v7.6.7 — Screen VFX off, starter Unique boosts

Owner: (1) new painted screen VFX look silly → heroScreenEffect() returns null (v7.3 hero_screen_* overlays off; files kept; v6.84 code-drawn screenFx unchanged). (2) Cocoa Unique before choosing a path (castCocoaUnique default branch) now also sets _cocoaRegenT=5+ul s at _cocoaRegenPct=2%+0.5%·ul max HP/s, ticked after normal regen (outside the 3% cap, honours noheal + pactHealMul), reset with uniqueLevel at run start. (3) Mint Gale (castWindRush) before a path: basicRate ×0.65 while windRushT>0 (character mint, no path). (4) Strawberry Rebound already heals % max HP (5.5%+1.8%·ul) — told owner, unchanged.

# Delivery: v7.6.8 — ⚔ ATK / 🛡 DEF power split on Equipment

Owner: split Power into attack and defense so items read as damage vs tank gear. heroAD(cid,basic) → {a: round(100·heroOffense), d: round(heroDefense)} (same parts heroPower combines); gearADDelta(item,base) swaps the item in like gearPowerDelta. Equipment power box shows '⚔ ATK a   🛡 DEF d'; selecting an unequipped item shows both lines 'ATK a→a+Δ ▲Δ' / 'DEF …' (box green both up, red both down, amber mixed); list cards show ⚔±/🛡± instead of ▲±. this._adBase cached per build. Overall heroPower (stage recommendations, auto-keep, clean list) unchanged. Quick UI screenshot OK.


# Previous delivery: v7.6.11 — Healing aura instead of green screen edge

Owner: change the heal sound, remove the green edge VFX, use an aura like high-level card upgrades. healScreen removed → healAura(): growth_unlock flipbook (same art as Evolution/Unique rank-up) tinted 0x8dffb0, timeScale 0.6, follows the player via postupdate until done; sound sfx_event_revive (vol .5). Called from startHeroRegen (Cocoa pre-path slam, Titan release) and Strawberry Rebound heal. VFX Off skips the aura (sound still plays). '+x% HP/s' float kept.

# Previous delivery: v7.6.10 — Titan Rage 4, post-slam regen, heal glow

Owner: Titan charges to 4 Rage; the last level clears almost the whole screen; after release regen scales with Max HP; starter Unique heal was invisible → green screen effect. titanMaxLv()=4 always (TITAN_RAGE_MUL[4]=5.5). titanSlamRadius: rage≤3 b0·(1+0.22r) (b0=(150+12·ul)·size), 3→4 lerps to max(b0·1.66, 600·min(1.3,size)). Release calls startHeroRegen(3+1.5·lv s, (0.8%+0.6%·lv) max HP/s, ×2 with capstone). Capstone capA 'Rage Four' → 'Rage Overflow' (ptv rage4: max-Rage release ×1.3 dmg + double regen); talent baseline hash updated. startHeroRegen(sec,pct) shares _cocoaRegenT/_cocoaRegenPct (keeps the stronger), float '+x% HP/s', healScreen(sec) green pulsing scrEdge (respects VFX off); used by Cocoa pre-path slam, Titan release, Strawberry Rebound heal (0.9s). Play Stats fixes: 'damage:' was damage TAKEN by source → 'damage taken from:'; profile lists every hero in CHAR_ORDER that is owned or levelled.

# Previous delivery: v7.6.9 — Colossus Fist slams around Cocoa

Owner: Titan Unique wider, show a growing ring while charging so you know what will be hit, punch all around instead of walking/leaping onto the enemy. titanSlamRadius(rage)=(150+12·ul)·size·(1+0.22·rage) (was (102+10·ul)·size·(1+0.15·lv) on cocoaPriorityTarget). Release centres on the player's position at release (x=p.x,y=p.y; aftershock same spot); center ×3.6 zone = r×0.48. tickTitanRage draws the live slam ring (fill + pulsing edge + inner bonus ring) and outlines up to 40 enemies inside (bosses/minis gold). cocoa-builds Titan test updated to the new geometry; titanSlamRadius added to the cocoa test method lists.


# Previous delivery: v7.6.12 — Colossus Fist % boss HP (owner chose option A)

Owner asked for Titan boss-damage formula (given in chat: boss HP C2-2 ≈60.5k / C2-4 ≈97k at ★1; Titan basics ≈150 DPS; Rage-4 slam ≈710 ≈1.2% of C2-2 HP; phase gates clip big hits). Chose A: titanPctSlam(x,y,r,lv) after the slam's cocoaHit — every boss/mini inside the slam ring takes maxhp × [0,1,2,3,5]% by Rage (minis ×0.5) through damage() with _frDmg (no crit/powerMul; bossDmg/flat still apply; phase gates still clip; skipped while gate-locked/invulnerable). tests/titan-pct-slam.test.cjs; titanPctSlam added to cocoa test method lists.


# Previous delivery: v7.6.14 — Titan Ground Pound (no 5-hit combo)

Owner: remove the 5-hit combo/finisher from Titan and replace it. castCocoaRush: `ti=path==='titan'`, `fin=!ti&&beat===4`, Titan cc.step stays 0. Every Titan punch = Ground Pound: wind .24, slam pose, r=reach×.95, power unit×1.15×(1+.08·ranks.combo)×(breaker 1.12), push 170, bossMul 1.4, shockwave+crack+small shake, cdMul 1.05. Tremor (cocoaHit opts.tremor=5+ranks.combo): per enemy +6% dmg per stack, 3s window (`e._trem/_tremT`, reset on spawn next to _frostBurnStacks). Earthbreaker/Cocoa Colossus echo on every pound (.25 / .35). Knockout Force desc for Titan via cocoaAttackInfo. Brawler/Dash Boxer keep the 5-beat cycle. Test appended to cocoa-builds.

# Previous delivery: v7.6.13 — Colossus Fist double aftershock

Owner: more damage, aftershock in two waves, slightly higher initial hit. Slam unit×0.85×rage → unit×1.0×rage (+18%). Aftershock (was 1 wave at .65s, unit×0.7, r×1.2) → two waves at 0.6s (r×1.25, unit×(0.9+0.3·lv)) and 1.0s (r×1.5, unit×(0.7+0.25·lv)), each with cocoaVisual wave, bpx_cocoa_shockwave, screen shake scaled by Rage and the aftershock sound (2nd lower pitch). Still centred on the release spot; % boss HP from v7.6.12 only on the main slam. cocoa-builds Titan counts updated (3 hits single foe; 2→4→6 in the geometry test).


# Previous delivery: v7.6.0 — Unique levels only from Talent

# Previous delivery: v7.6.15 — Soft Strawberry normal attack

New ElevenLabs soft_seed_shot.mp3 is low-passed at 3.8kHz and trimmed/faded to 240ms, warm rounded pop. Separate Sfx.strawberryShoot (0.22 volume, 120ms throttle, gentle sine fallback) routes normal Berry Blaster/ricochet seeds only; sniper charge/shot and shotgun/Unique unchanged. Generic shoot still used by other skills/heroes. MANIFEST records prompt/processing/technical QA; subjective phone listening pending. Merged current v7.6.14; Ground Pound/Tremor, regen aura and disabled screen overlay behavior retained. Art backlog audit lives in docs/art_orders/16_CURRENT_ART_BACKLOG.md.

# Previous delivery: v7.7.0 — P1 art feedback

New ImageGen skill_edges 4x4 atlas (13 runtime skill mappings, 3 spare), two brief mirrored edge accents <=18% viewport width, alpha <=.34 and <=.75s, no painted full-screen frame; removed old hero_screen registrations (files retained). Shared Unique Mastery icon under art/talents for menu loading; original 218 talent mappings untouched. Tremor/Frost Burn painted markers with actual counts (including >5 Tremor), cap 40 marked enemies, fade/pulse, expiry/death/pool/transition/off cleanup. Berry Core equipment crop fixed (.14..82 source height) after 28 source-crop review panels exposed missing mouth. Static image/geometry review only; browser UI automation unavailable; owner phone visual/FPS review pending, do not claim live screenshot QA. docs/art_orders/P1_DELIVERY_7_7.md and preview files. npm check plus P1 lifecycle test and build required.


# Delivery notes archived 12 October 2026

# Previous delivery: v7.7.5 — Every craft costs 1 currency

Owner: currency spent 1 at a time for everything. TIER_LOCK_COST 2 → 0 (lock is free, need stays 1+0), FLAME_REROLL_COST 3 → 1 (Crystal Glaze tier reroll). All other spendCurrency calls were already 1.

# Previous delivery: v7.7.4 — Faster Affix Forge Auto-Roll

Owner: Auto-Roll faster. autoRollToTarget: reel ticks 4×45ms for the first 3 rolls, then 2×30ms; delay after a miss 380ms (first 3) → 150ms, near-miss 600 → 380ms; first step 200 → 120ms. About 0.85s → about 0.21s per roll after warm-up.

# Previous delivery: v7.7.3 — Strawberry before-Build buff

Owner approved pre-path Strawberry seed power ×1.5 and fire frequency ×1.15. castBerryBlaster applies multiplier only with no basic.path; legacy seed fallback mirrors condition. cdOf multiplies only momo Basic sprinkle no-path interval by 1/1.15 (not .85, which would be +17.6% rate). Selected Sniper/Shotgun/Ricochet, Unique and other heroes unchanged. Focused starter projectile and actual cdOf regression plus full check/build required. Phone C2-5 pacing review pending.

# Previous delivery: v7.7.2 — Shared Flavor Weave / Temple Depths BGM

Owner clarified Temple Depths (dig), not just Temple/Perks. menuMusic dig now selects the same bgm_menu_temple key as upgrade/perks: shared track and no restart when switching temple pages. Old depths file retained; kitchen/stage routes unchanged.

# Previous delivery: v7.7.1 — Short Temple feedback and owner BGM

Core success trimmed 2.68s to .8s from audible onset; Weave promotion trimmed 3.2s to 1.4s. New sibling files in assets/audio/sfx/temple_short (8ms attack/140ms tail fade), existing keys repointed, voice replacement unchanged. bgm_menu_temple now points to tea_for_two_temple.mp3, byte-identical owner uploaded Tea For Two At The End Of The World (SHA in MANIFEST). Shared Temple/Perks music route preserved; other menus/stages untouched. Full check/build required; subjective phone listening pending.

# Previous delivery: v7.7.6 — Titan Rage IV moved to Endgame

Owner: Rage 4 too big/OP for a starter; back to Rage 3, Rage 4 from Endgame. titanMaxLv() = titanRage4Unlocked()?4:3 (typeof guard for vm tests). titanRage4Unlocked() = pactBestChar('cocoa')>=TITAN_RAGE4_HEAT (3 = Delve boss cleared at Depth 15+ with Chocolate; saves that already reached it unlock immediately). claimPactMilestones adds a '🗿 Titan Rage IV unlocked' line; Delve NEXT MILESTONE cell shows it for Chocolate. Rage Overflow capstone ×1.3 now applies at max Rage (3 or 4). Titan path desc updated. tests/titan-rage4-unlock.test.cjs.


# Archived delivery notes (13 Oct 2026)

# Previous delivery: v7.7.19 — Approved painted main menu

Owner approved ImageGen main-menu concept. Separate clean background, logo, pink Play and shared plum chrome from native labels. Full-width Play/More around 2×2 secondary menu; responsive portrait/landscape geometry. Preserve currency/quest data, exact routes, tutorial unlock override, notification dots and next-action tag. Assets boot-kept and reloaded via hub menu group after run eviction. Details/provenance in docs/HUB_REFERENCE_FINISH.md and assets/incoming/hub_reference. Owner follow-up image(9): v7.7.18 removes Next from Hub; padded sugar, narrower version, trimmed chrome, larger labels, centred More, proportional footer/logo, visible arrows and gold guide tag. v7.7.17 corrects observed frame/logo compression with nine-slice painted chrome and original logo aspect. v7.7.19 replaces WebGL-only Phaser NineSlice with nine ordinary cropped Images so Canvas shows the same painted frames; corner scales and complete coverage tested. Full checks/build and live UI review required; no headless combat simulation.

# Previous delivery: v7.7.15 — Unified responsive Heroes

Owner screenshots image(4)–image(7): Talents/Stats used old chrome; tall mobile roster left a large empty bottom. All three now share painted header/tabs and Nunito; talent branch, Upgrade and Reset buttons reuse the same painted assets. Content starts below the shared tabs. Tall portrait uses extra height for preview, row spacing and footer placement, preserving card art aspect and full image; hero preview is contained inside its frame. Lower label shading softened. Actual-method regression, full check/build and live menu visual QA required. No combat simulation.

# Previous delivery: v7.7.14 — Reference hero roster cards

Owner supplied image(2).png: large top preview, six landscape full-art cards in a two-column phone roster, colored frames/gold selected check and pink selection footer. Generated six matching ImageGen illustrations; menu-only alpha WebP at assets/art/hero_roster (768×460, ~0.8MB total, ~8.5MB decoded). Existing portrait art remains in the large preview/details. Heroes group and lazy classification load/free the new cards; no combat asset replacement. Card taps preview only; footer confirms Save.data.character and runtime character. Locked guards/playtest unlocks, tabs, Details and menu scroll remain. Native labels stay sharp and are not embedded in artwork. Full check/build and actual-method flow tests passed; Initial visual QA used reconstructed draw calls. Live cloud-browser review confirmed all six cards, top preview, native labels, frames and footer load at v7.7.12; v7.7.14 separates name/role labels on wide portrait screens. v7.7.14 adds self-hosted Nunito lettering, painted chrome and role icons; see docs/HERO_ROSTER_REFERENCE_FINISH.md. Owner live phone touch/visual review pending.

# Previous delivery: v7.7.11 — Verified F1 cleanup and status

F1 core work was already delivered in v6.94; old plan checkbox was stale. Remove four unreachable methods: castDiamondDust, buildCookbook, buildRift and rollRiftPreview (only called by that dead Rift menu). Current routes redirect old Rift/Recipe entries to Atlas. Preserve Sweet-biome comet sugarRush/tickSugarRush, Delve riftMode/tier/mod helpers, live PASSIVES/SKILLDEFS metadata and save refund/conversion migrations. Update SYSTEM_CONSOLIDATION_PLAN with those exact boundaries. Full check/build passed; no headless gameplay simulation; owner phone QA remains. Heroes layout was also visually reviewed from actual buildChars draw calls at 320/390/768/844px (reconstructed display list, not a live screenshot); Chromium download failed.

# Previous delivery: v7.7.10 — Speed x4

Speed tap cycles 1→2→3→4→1; setGameSpeed normalizes invalid values and clamps 1–4. Arcade uses inverse 1/s, timers/tweens use s and update dt uses gameSpeed as before. Hit-stop defers physics scaling while other clocks retain selected speed; original restore path uses current speed. Run reset remains x1. Regression/full checks/build required; phone x4 feel/FPS review pending. No automated headless gameplay simulation per owner instruction.

# Previous delivery: v7.7.9 — Visible arena bounds

The physics world already stopped the hero at ±2000 while camera-centred floor Images painted indefinitely outside it. Clip pooled floor Images to the actual world rectangle, including partial corner tiles; draw a thin world rim in the world camera only. Preserve physics dimensions, player collision, camera centring/zoom and the shared-source floor memory budget. Actual-method crop/bounds regression/check/build required; owner phone edge/touch review pending.

# Previous delivery: v7.7.8 — Heroes roster readability

Heroes keeps existing art, tabs, selection/save/unlock behavior. Selected hero summary above a responsive roster; larger names/art, labeled HP/ATK/SPD/DEF ratings and explicit Select hero actions. Cards have a minimum readable height and use menu scrolling instead of shrinking all six into one viewport; landscape uses 2–4 columns, wide portrait 3. Selected hero/card opens existing abilities details; closing rebuilds the screen and restores scrolling zones. Owner approved redesign of this screen. Visual QA/check/build required; phone touch review remains owner work.

# Previous delivery: v7.7.7 — Ricochet damage consistency

Ricochet splash remains for crowds, with one splash per ordinary enemy lifetime per seed and none on bosses/minibosses. Final Evolution splash excludes the direct victim. Isolated boss return applies only on the first hit, not after collecting bounce power from escorts or from split seeds. Split Talent creates at most one child per parent and inherits visited history/shared splash ledger. Existing growth, fire rate, direct-hit damage, Sniper/Shotgun and phase guards remain. Targeted regression and full checks/build required; owner phone balance review pending.


# Archived delivery notes — 13 Oct 2026

# Previous delivery: v7.7.20 — Compact Heroes on tall phones

Owner phone 691×1536 showed oversized gaps from distributing extra height into card rows and selection footer. Bound row gaps to26×width/941 and added footer spacing to24×width/941; retain full 768×460 roster art and original preview/confirm flows. Add exact reported phone geometry to regression. Equipment redesign requested as a visual concept; implementation remains separate from this spacing fix.

# Previous delivery: v7.7.24 — Focused Affix Forge

Owner approved minimal Forge concept and critique of rarely used Remove/Reset. Shared Heroes header/fonts/buttons; single selected-item summary; three mod rows; paged weighted results with explicit target tracking; tiers collapsed behind Odds & tiers. Reroll + reroll tier prominent; Remove/Reset in Advanced with consequences and original second-tap confirmation/locked guards. Legacy rarity upgrade omitted because all rarities already share three-mod cap; preserve old helper and currency balances. Existing weighted rolls, auto-roll Stop/thresholds, costs and roulette remain. Craft rebuilds refresh scroll bounds; direct primary callbacks preserve tutorial lookup. See docs/AFFIX_FORGE_REDESIGN.md. Actual-method tests/full check/build/live menu QA required; no headless combat simulation. v7.7.24 fixes a live-observed loader race: synchronous completion hid the overlay, then the queued show RAF restored opacity. Invalidate stale show callbacks on hide; retain .84 veil after late Equipment/Forge background loading.

# Previous delivery: v7.7.22 — Selected minimal Equipment elements

Owner approved curated Equipment changes: shared Heroes header/buttons, quieter background and thin slot borders, labeled six slots, four-column inventory with larger labels, separate management toolbar, grouped item title/rarity/base stats, Enhance as primary, Craft/Favorite/Lock as secondary and contextual protection message replacing duplicate disabled Protected buttons. Keep original save/gear/upgrade odds/cost/protected guards/crafted-item confirmation and mod comparison; landscape route preserved. Existing painted chrome loaded via gear menu group; no new art generation. v7.7.22 restricts gear menu loading to current portrait, owned/equipped icon keys and shared chrome actually used; balances loadout column widths and wraps narrow hero captions. Actual-method equipment action/filter tests plus full check/build and live menu QA required. No combat simulation.

# Previous delivery: v7.8.0 — Three-row Forge foundation

Owner approved the incremental 150-mod plan. Catalog: 150 entries, 78 active, 72 gated/planned; do not claim 150 working effects. Spark rolls Power, Cream offers two persisted choices, Jam uses a selected family. Glaze retains tier reroll. Replacements preserve relative tier; legacy mods/implicit/UID and currency purchase value survive migration. Remove/Reset retired. Runtime supports barriers on contact/ranged damage, conditions/recovery/growth, snapshotted farm bonuses and target currencies. Registry: data/forge-mods.json; sync with scripts/sync-forge-catalog.mjs. Exact pending scope: docs/FORGE_150_ROLLOUT.md. Full check/build required; phone balance/FPS owner review; no headless gameplay simulation.

# Previous delivery: v7.8.1 — Stable long-menu scrolling

Owner approved pushing the Forge work and reported strange long-page scrolling. Recovered Forge changes after scratch reset; new commit IDs supersede previous local-only SHAs. Shared scroll bounds now measure unscrolled content/tall panels/interactive extents and exclude viewport backdrops/fixed footers; filler removed. Painted backgrounds stay fixed including late loading. Incremental drag reverses immediately at bounds, locks direction and uses shorter inertia; roulette overlays cannot scroll. Missed taps cannot leak a coordinate-transform wrapper. Slim viewport scrollbar. See docs/MENU_SCROLL_7_8_1.md. Full check/build required; owner phone feel review pending. Forge remains 150 catalog / 78 active / 72 gated.

# Previous delivery: v7.8.2 — Forge sparse-row crash

Owner screenshot: Forge stops after the selected gear icon with `Cannot read properties of null (reading 'id')`. Reproduced using the actual Forge renderer: `forgeLines()` intentionally returns three nullable rows, but `gearAffixName()` dereferenced every row. Skip empty rows when deriving prefixes/suffixes. Preserve the three-row structure, saves, existing mods and costs. Regression covers 0/1/2 mods, all selected rows and five portrait/landscape sizes, plus name equivalence with compact affixes. Full check/build passed; owner phone confirmation pending.

# Older history

Older delivery notes and the old "สถานะ" log (v1.x–v6.55) are archived verbatim in `docs/CLAUDE_HISTORY.md`. Search there (grep a function or version) when you need why something was done. When you finish work: add a new "# Latest delivery" block here, rename the previous one to "# Previous delivery", and keep only ~6 recent blocks in this file (move older ones to the end of docs/CLAUDE_HISTORY.md).

# Previous delivery: v7.8.3 — Single-screen Forge

Owner approved the mockups and exact spacing. Forge keeps its controls in one screen with real ranges, equipped tags, paged pools/families and recoverable paid choices. Approved ImageGen atlas is reused directly via 12 frame regions and Canvas-safe fixed-corner chrome. See docs/FORGE_SINGLE_SCREEN.md. Complete CI now gates Pages deployment; real-method menu QA is in forge-review.html (synthetic save, no combat). Full checks/build and 21 real-browser UI cases passed, including native Roll/Tier costs and paid Choose. Baseline proof screenshots are in docs/forge_ui/. Cached veil and Equipped alignment corrected. Phone feel/FPS remains owner QA.

# Previous delivery: v7.8.4 — Readable Forge mods

Effect-first pool rows, semantic Canvas pictograms with individual catalog seals, cached per mod (150 catalog identities; only 78 runtime-backed mods remain rollable). Current rows and paid choices reuse the icons. Details expose full effect, value at preview tier, chance and replaced row. Existing costs, saves and effect implementations remain. Full check/build and seven-viewport Forge tests pass; see docs/FORGE_READABILITY.md for browser QA.

# Previous delivery: v7.8.9 — Painted Stats / Gear & Power

Owner accepted compact Hero control proportions and asked for hero colors plus actual ImageGen artwork. Tabs/Selected now follow the preview hero in roster and equipped hero in Stats/Talents (six palettes). Stats uses seven real painted frames, seven stat icons and an info jewel; ordinary cropped-image slices retain corners in Canvas/WebGL. Gear & Power uses new five painted card textures and a generated courtyard background, preserving routes, locks, notifications and real guide badge rules. Source text remains live. 21 bounded WebP assets, manifest and exact selected prompts in assets/art/mobile_ui_789. See docs/MOBILE_PAINTED_UI.md.

# Previous delivery: v7.8.10 — Taro T1 foundation

Taro-only targeting, pooled-enemy identities, pure path profiles/movement, active-play queues, source/proc adapters and lifecycle cleanup are implemented. New path state starts disabled; existing Taro attacks, Dash passive, Unique, Storm Charge and progression remain live. Terminal adapters keep rewards/healing/shields and stop combat recursion; delayed recipe recovery retains source context. See docs/TARO_T1_FOUNDATION.md and docs/TARO_T0_CONTRACT.md. Next T2 enables and implements Tempest only; initialize opt-in consistently after retry/revival/path sync.

# Previous delivery: v7.8.11 — Taro T2 Tempest

Tempest now earns charge from intentional post-physics walking, adds 15 per accepted Dash, sweeps actual Dash segments, leaves a capped timed origin bomb and releases a held full-charge nova near damageable targets. One weak basic bolt; Gale affects Dash recharge. Tempest Chain Bolt keeps its formula/escape rewards with active-play pooled-target ownership. Pause/revival/exit cleanup, rewards/proc isolation and purchased progression preserved. Full check/build and real menu QA passed; owner tests combat. See docs/TARO_T2_TEMPEST.md; next T3 Chain. Publication state is in SESSION_HANDOFF.

# Previous delivery: v7.8.12 — Taro T3 Chain

Chain now has bounded growing bounces and distinct victims shared across up to three roots. Direct Chain basic/Chain Bolt kills emit up to three terminal lightning shards, capped eight events per 0.25 active seconds. Direct entry tickets and pooled-victim revalidation prevent external procs stealing kill ownership or duplicate rewards. Shared Unique keeps its existing formula/escape effects. Tempest/Dash method bodies, saved progression and unrelated heroes preserved; Smite/pre-path remain legacy. Full check/build and real menu QA passed; owner tests combat. See docs/TARO_T3_CHAIN.md; next T4 Smite. Publication state is in SESSION_HANDOFF.

# Previous delivery: v7.8.13 — Taro T4 Smite

Smite marks stable priority targets, strikes once and repeats once on surviving big targets after 0.22 active seconds. Arc/count investments become bounded terminal add splash/primary damage. Shared Unique prefers Rod/priority first target with existing formulas and escape rewards. Direct generation tickets isolate external procs and keep once-only rewards; selected Smite replaces legacy mob-charge Judgment. Chain/Tempest and saved progression preserved. Full check/build and real menu QA passed; release status in SESSION_HANDOFF. See docs/TARO_T4_SMITE.md; next T5 progression wording and owner combat feedback.

# Previous delivery: v7.8.14 — Taro T5 progression

Selected-path upgrades/mutations/evolution and Weapon Codex share immutable descriptors. Talent labels identify basic range/cadence and survival scope; all saved IDs/effects/costs/capstone gates retained. Rare scalar run-upgrades now use authored rolled potency in path D/conditional fields and Gale Dash cooldown; count ranks remain integer. Codex has three path views and complete mobile descriptions. Full check/build passed; final menu/publication status in SESSION_HANDOFF. See docs/TARO_T5_PROGRESSION.md; next T6 art/sound and owner combat feedback.

# Previous delivery: v7.8.15 — Taro T6 feedback

Selected Taro paths have short violet links, gold priority brackets/strike, open cyan nova and violet diamond bomb burst. One new ImageGen painted bomb with actual alpha and attached fuse arc; five short deterministic jsfxr/MP3 cues. Charge HUD maintains screen size at camera zoom and signals READY once per transition. Transient FX capped at 20 plus three fixed pending bombs; active-time fade/fuse, pause visibility and epoch cleanup. Target/damage/progression resolvers retained except two sound dispatches; other heroes/pre-path untouched. Required check/build and Canvas presentation/hero checks recorded in SESSION_HANDOFF. See docs/TARO_T6_FEEDBACK.md. Next T7 owner phone combat review and final tuning; #25 deferred.

# Previous delivery: v7.8.16 — Taro Unique / lightning actually visible

Owner phone test: Taro Unique "does nothing", rest looks like before. Root causes found in a real Chromium run: (1) tickTaroCombat suspended the whole Taro job queue on any frame with wallDt>.1, so Unique Chain Bolt/shrapnel/bombs never ran below 10fps → threshold .25 (dt still clamped .05); (2) taroLightningVisual went through shared per-frame fxOk (2/frame in PERF.lvl 2), so only the first link of a chain drew → lightning uses only Taro's own 20-live cap (taroVisualBudget(true)); (3) links were 2px/0.14s at depth 7 → glow+outline+core+white jagged bolt with endpoint ring at depth 90400, .24s (Unique big .36s). castTaroPathUnique adds hit ring per hit + uq_taro_chain_hit sound (not hash-locked). Pre-path (before Lv6 Build Path) is still the legacy Taro by design. No damage/targeting changes. Full check/build passed.

# Previous delivery: v7.8.17 — Rift Needle starter and outgoing Chain Arc

Owner requested distinct pre-build normal attack and PoE-like outgoing Arc. Before selecting a path, Taro fires straight instant Rift Needles at distinct nearby targets; no chain/sky strike or legacy Storm Charge. Arc rank gives reach, surge gives needles (cap3/overflow); saved IDs/ranks carry into each chosen path. Chain now draws every root directly from Taro using the same Arc as its jumps; target/growth/damage/shard rules unchanged. Starter/Chain cards and fourth Needle Codex tab explain the current mechanics. Required check/build and static Canvas/menu review passed; live status in SESSION_HANDOFF. See docs/TARO_NEEDLE_ARC.md. Owner phone combat review remains pending.

# Previous delivery: v7.8.18 — Taro Arc / Spark / Sentry

Owner approved replacing Smite/Tempest with wandering Spark projectiles and temporary Ball Lightning sentries, plus all-build Storm Beacon Unique. Existing storm/smite/tempest IDs, original upgrade IDs/effects and Talent ranks/TP/costs stay compatible; labels and new run cards reflect the new mechanics. Arc/Rift Needle remain. Spark ricochets against solid props, can pierce and split once; cap10 per cast/36 live. Sentry cap2 + one independent Beacon, orbs cap12. Old charge/Dash-bomb/Rod hooks removed from live dispatch; legacy helpers retained dormant. New ImageGen transparent Sentry WebP, code-native sparks/orbs and reused T6 cues. Required check/build, static Canvas three sizes and Codex/Talent five sizes passed. See docs/TARO_ARC_SPARK_SENTRY.md; publication in SESSION_HANDOFF. Owner phone combat/balance/FPS review pending.

# Previous delivery: v7.8.19 — Taro Sentry rework

Owner approved every proposal in docs/art_orders/17_TARO_SENTRY_ART.md. Sentries place only when fewer than 2 or Taro is >350px from the farthest one (no more churn cutting lifetime); live nodes refresh card values; orb cap 16; orb visual = real hit radius; orbs and Sparks break crates. Storm Beacon strikes 200px around Taro on cast ((2.5+n)·dm·(1+.22(n−1)), source beacon) and overcharges regular pulses ×1.5 while standing. Quick Reposition (p_gale) replaced by Overload (p_sentry_overload) and Tesla Link (p_sentry_link). Details in docs/TARO_ARC_SPARK_SENTRY.md. taro-swarm test extended; full check/build passed. Art A/B/C generated: 19 PNGs and delivery metadata uploaded to assets/incoming/taro_sentry/. Owner explicitly requested storage only; runtime integration and phone review remain pending.

# Previous delivery: v7.8.20 — Taro Sentry art wired

Owner delivered 19 Sentry assets to assets/incoming/taro_sentry/. Packed by scripts/pack-taro-sentry-art.py into assets/art/taro_sentry/ (bpx_taro_* ASSET_FX, Taro-only lazy class) + icons in assets/art/build_paths/taro_*.webp. Turret deploy→idle/fire/expire, Beacon tall idle + strike/ring + overcharge aura, Ball Lightning sized to hit radius, orb zap/launch, Overload burst, persistent Tesla beam, new path/card/Unique-button icons; all with code-drawn fallback. Helper taroArt(). Details in docs/TARO_ARC_SPARK_SENTRY.md. Check/build passed; static Chromium gallery only. Pending: 4 new Sentry sounds, owner phone review.

# Previous delivery: v7.8.21 — Taro Splitting Sparks

Owner played Spark: wants longer, faster, piercing projectiles; nothing to bounce off, so sparks split by flight time instead. Life 2s (cap 3.5), speed 380 (cap 560), base pierce 2 (cap 5). Every 0.42s a Spark splits into 2 (gen 0→1→2, max 4 per original, 36 live cap), children ×0.55 power (Split Spark card ×0.75), smaller, inherit victims. On-hit split removed. Details in docs/TARO_ARC_SPARK_SENTRY.md. Check passed; owner phone review pending (Sentry review also pending).

# Previous delivery: v7.8.22 — Smaller faster-hitting Ball Lightning

Owner Sentry feedback: orbs too big, hit more often. Orb radius ×0.6 (36→57, Beacon 46), per-victim hit gap 0.2s (TARO_ORB_HIT_GAP). Damage/Unique/pre-path Unique ideas proposed in chat, awaiting owner pick.

# Previous delivery: v7.8.23 — Bouncing Sparks

Owner: Sparks burst out all around Taro (even 360° spread), bounce off the visible screen edge (taroBounceView on camera worldView), last 3.5s (Live Current cap 5s); travel-range cutoff only for orbs. Fission from v7.8.21 kept.

# Previous delivery: v7.8.24 — PoE Ball Lightning, Spark power, lightning swing

Owner: Taro too weak (stuck C1-4). Sentry/Beacon orbs are PoE-style Ball Lightning: slow (110), zap up to 6 foes within 85–120px every 0.15s (taroOrbZap), unitD×0.30 per zap. Spark ×0.60 (was 0.36). taroLightningRoll 0.2–1.8 on Spark/Sentry/Beacon hits (applied at call sites; taroDealDamage hash-locked). Art order 18_TARO_SPARK_BALL_LIGHTNING_ART.md (incoming folder taro_spark_ball). Pending owner pick: Sentry damage mechanic, Sentry Unique, pre-path Unique.

# Art delivery 18 extensions — Plasma, Shock and Static Arc

14 PNG32 assets (E1–E3, F1–F2, G1–G2, H1–H2, I1–I5) stored in assets/incoming/taro_unique_needle/ with manifest, final prompts, QA and delivery notes. A/B/C retained; cancelled needle D1–D3/H3 omitted. Exact grids/alpha/black backgrounds checked, Shock1–5 counts and Arc endpoints verified. Storage only: no runtime wiring, game version or build output changed. Owner phone review and separately requested integration remain pending.

# Previous delivery: v7.8.25 — Taro Uniques per build, Shock, spike needles, Spark/Ball art

Owner picked 1 + A: Sentry Shock stacks (+5%/stack, max 5, 3s) and Overcharge Detonation Unique; pre-path Unique = Plasma Field (Razor-style ring out/back); Rift Needle is a piercing spike projectile. Arc/Spark keep Storm Beacon. Owner's 16 Spark/Ball art files wired (assets/art/taro_spark_ball). Art order additions D–H (needle, plasma, detonation, shock marker, Unique icons) in 18_TARO_SPARK_BALL_LIGHTNING_ART.md → incoming/taro_unique_needle. Details docs/TARO_ARC_SPARK_SENTRY.md. Check passed; owner phone review pending.

# Previous delivery: v7.8.26 — Sparks hunt bosses

Owner: Spark weak on bosses. Sparks within 260px of a boss/mini curve toward it (turn 5 rad/s), pass through bosses without using pierce, and re-hit the same boss every 0.3s. Normal foes unchanged.

# Art delivery19 — C2-4 Four-Season Conservatory

22 PNG32 sources (126 frames) stored in assets/incoming/c24_seasons_vfx/ with manifest, final prompts, QA and delivery notes. Includes four seasonal screen edges, Bloom Sprout, HUD states, trial VFX and Chronobloom attack/metamorph VFX. Exact grids, real alpha, complete PNG streams/hashes, black central screen window and enemy groundline verified. Incoming storage only: no runtime/game version/build changes; packing/integration and owner phone review remain pending.

# Previous delivery: v7.8.27 — Static Arc starter, Overload Loop, Arc Plasma Field

Owner approved: pre-path attack = Static Arc (small chain, 3 jumps); Arc chains loop leftover jumps into the last target at 60% (Overload Loop, new card p_arc_overload +15%/rank) so lone bosses take every jump; Arc Build Unique = Plasma Field whose ring hits fire Arc jumps. Fixed Plasma/Beacon/Overcharge being far too weak (dm scaling ~3×). Spark +1 count, speed 460. Art order 18 updated: needle D/H3 cancelled, new set I (Arc bolt/hit/loop/overload hit/card icon). Hash fixtures for castTaroChainBasic updated. Details docs/TARO_ARC_SPARK_SENTRY.md.

# Previous delivery: v7.8.28 — Starter cards never go to waste

Owner: starter cards picked before a Build Path should not become useless. Audit (momo/mint/cocoa/taro) found only Cocoa Earthbreaker on Fire Fist (dead) and Rushdown on Titan (follow-ups dead) truly wasted; fixed (Fire Fist fireball ×1.25 dmg/blast; Titan pound + 35% tremor wave). Earthbreaker +25% finisher now real; Taro Chainlord/Evolution really add Static Arc jumps (cap 10). Text fixes: Fireball Barrage (+18% combo speed), Mochi Reach on Fire Fist, Mint Shard Bloom on Impaler (Rupture Shards +8%), Momo Rate all builds, Petal Spread on Shotgun. New rule: Build Path cards show a '↪ Keeps:' line (pathCarryText → card o.carry, drawn in the stars line) listing owned starter cards and their name in that build. tests/starter-carry.test.cjs.

# Previous delivery: v7.8.29 — C2-4 Season Storm softlock fix + art order 19

Owner: C2-4 sometimes stuck (screenshot: Season Storm 🌸 unpassed, ☀🍂❄ ✓, rest, Reserves 0). Cause: Spring trial needs 10 kills (stormRule) but story budget reserves were exhausted → no enemies → trial never passes → objective never completes. Fix in tickSeasonObjective idx 0: while in wave mode, every 1.2s top up to min(6, 10−kills) live non-boss foes via spawnEnemy('basic'). Art order docs/art_orders/19_C24_FOUR_SEASON_ART.md (season trials A1–A11 incl. Bloom Sprout enemy, Chronobloom boss attacks B1–B8) → incoming/c24_seasons_vfx. Boss-variety ideas given in chat, awaiting owner pick.

# Previous delivery: v7.8.30 — Taro Plasma, Arc and Shock art wired

Order 18 E–I (14 files in incoming/taro_unique_needle) packed by scripts/pack-taro-unique-art.py → assets/art/taro_unique/*.webp + Unique icons assets/art/build_paths/taro_{plasma_field,overcharge,arc_overload}.webp. Plasma ring sprite (bpx_taro_plasma_ring, sized r×2/0.92) replaces the drawn ring, plus cast/hit FX; Overcharge plays sentry_overload per node then sentry_detonate; Shock marker shows stacks 1–5 above foes (aura at 5, cap 40, taroTickShockMarks); Static Arc/Arc chains use arc_bolt/arc_hit, loop jumps arc_loop/arc_overload_hit (taroArcBolt, chainBolt fallback). Unique button icon follows build (syncUniqueIcon). New taroFx helper works pre-path (cap 28). castTaroChainBasic hash fixtures updated. Check passed; owner phone visual/FPS review pending.

# Previous delivery: v7.8.31 — Arc focus, hunt arrow, Plasma vs bosses

Owner: Arc single-target still weak; arrow should find normal monsters when none on screen (spent long searching for a mini); Plasma Field weak on bosses. Arc build (castTaroChainBasic): if a boss/mini is within rootRange (taroArcFocus), every root × every jump hits it at 100% ×(1+.15×Overload ranks), else old chain. Objective arrow: when no other target and no enemy inside camera worldView, _offscreenHuntTarget points to nearest mini (orange) else nearest monster (pink). Plasma Field ×1.75 vs boss/mini (TARO_PLASMA_BOSS). castTaroChainBasic hash fixtures updated. Check passed; owner phone review pending.

# Previous delivery: v7.8.32 — C2-4 Four-Season art wired (order 19)

22 files from incoming/c24_seasons_vfx packed by scripts/pack-c24-season-art.py → assets/art/c24_seasons/*.webp (screen edges 320 cells, Time Break/metamorph 384, projectiles upscaled to 128 cells = proj_foe body). All keys stage-lazy in STAGE_SHEETS[8]; stageArtKeys now includes ASSET_FX and stage loader passes fx:true. Helper c24Fx (keep/life/ui/must, cap 40, fallback to old code visuals), c24ClearCur, sweep of _c24Keep in tickSeasonArena. Wired: season-change screen edge (UI cam), spring heal petals, Bloom Sprout enemy (type 'sprout', Spring trial top-up, ×1.4 speed), summer burn ring/ignite, autumn lane/slash, winter patch/freeze, HUD season icons (syncSeasonIcons, text origin shifts), trial-pass bloom; Chronobloom vine fan/slash, solar rings, frost shard and leaf bullets (c24Bullet; foeShot stops anims on reuse), Time Break clock + 3 season seals, metamorph. Mechanics unchanged. Headless smoke render had no page errors. Owner phone visual/FPS review pending.

# Previous delivery: v7.8.33 — Taro Spark Storm Unique, Spark +25%

Owner: Spark damage up a bit; Spark Unique = rapid projectiles that are forced to explode after a while. Spark profile damage unitD×0.75 (was 0.60). Spark Build Unique (castStormBeacon smite → castTaroSparkStorm): t.storm emits 16 (+4/level, +4 Echo) Sparks every 0.05s in a 2.4-rad spiral (taroTickSparkStorm inside tickTaroDeployables), hit (3+1.5n)·dm, no fission, boss hit once, pierce = Spark pierce; fuse 1.1s or pierce spent → taroSparkBlast radius 72, (5+2.5n)·dm once. Storm cap 72 sparks. Old Storm Beacon kept as castTaroBeacon (unbound); tests point to it. Icon key ic_taro_spark_storm not drawn yet → emoji ⚡. Check passed; owner phone review pending.

# Previous delivery: v7.8.34 — Spark Static Charge (owner pick A2)

Spark boss fix without touching clear: taroStaticCharge counts Spark hits per boss/mini token (t.charge Map, per run); every 10th hit (TARO_STATIC_HITS) strikes for that Spark's damage ×8 (TARO_STATIC_MUL) × lightning roll, beacon_strike art. Spark Unique still Spark Storm; owner asked about a buff-style Unique instead — options proposed in chat, awaiting pick.

# Previous delivery: v7.8.35 — Spark Unique Storm Mark (owner pick A2 + B1)

Spark Build Unique (castStormBeacon smite → castTaroStormMark): picks toughest foe within 700 (boss > mini > highest HP), beacon_strike art strike (8+4n)·dm, marks 6s (+1.5 Echo) with gold shock_aura sprite following it. While marked (taroMarkToken) every Spark steers to it (turn 8 rad/s), passes through it without spending pierce and deals ×1.5 (TARO_MARK_BONUS). Expiry → second strike + blast r130: (14+7n)·dm on mark, 40% to others (taroEndMark/taroTickMark). No target → falls back to castTaroSparkStorm. Static Charge (v7.8.34) stacks. Icon key ic_taro_storm_mark not drawn → emoji 🎯.

# Previous delivery: v7.8.36 — Taro Unique text fixes

TARO_UNIQUES now carry per-Unique `tiers` text (banner on Unique level-up uses u.tiers) instead of the old pathRecall "Stronger Beacon" lines. Echo Map talent text = real effects (Plasma +40 reach, Overcharge and Storm Mark +1.5s); Overcharge now honours Echo (overUntil +1.5s). talent-icons test normalizes the new Echo text. Pending Taro: Sentry/Unique sounds, Storm Mark icon art (order 18 J), owner phone review.

# Previous delivery: v7.8.37 — C2-4 Season Storm softlock really fixed

Owner screenshot: Season Storm · rest, Reserves 0, stuck. v7.8.29 top-up never worked: spawnEnemy → storyCanSpawn returned false once story quota was spent. storyCanSpawn now allows spawns while the Spring trial (idx 0, not partial, not passed) has fewer live foes than 10−kills (seasonNeedsFoes). Test in tests/story-budget.test.cjs.

# Previous delivery: v7.8.38 — Combat Meter (owner: numbers for balance)

Settings → 📈 Combat Meter (st.mx, also in pause settings) shows a live overlay (left, 36% height): 5s DPS / avg / total, current boss-mini DPS · fight time · HP%, FPS · foes · foe shots · FX. Every run records g._mx (mxReset in Stats.start; hooks: damage()→mxDeal before e.hp-=amount [damage hash fixture updated], killEnemy→mxKill, _noteHit taken, dash button→mxDash, castSkill caller sets _mxSrc=key, Unique paths set _mxSrc='unique', Taro context → 'taro.<source>', _infTick/_frDmg/_gmTick → infusion/recipe/gear). Stats.end saves c.mx=mxSummary(); Play Stats → Copy adds meter lines via mxLines(): dealt (no overkill)/overkill/crit, boss/mini/elite/mob split, peak 5s DPS, every boss & mini fight (HP, seconds, DPS, % left), top 10 sources, taken, dash taps, uniques, level & wave timings, FPS avg/min/low seconds/frames>50ms, peak foes/shots/FX, texture MB. Test tests/combat-meter.test.cjs. Next: owner plays 3 Taro builds + other heroes and pastes Play Stats.

# Previous delivery: v8.0.91 — audio order A06 wired (28 ElevenLabs SFX)

assets/incoming/audio_new_features → assets/audio/new_features/ (ASSET_AUDIO, background-loaded with other SFX). Hooks via Sfx.orderCue/menuCue ('sfx_'+cue) with old sounds as fallback: _forgeDone forge_roll_good/bad, forge_lv_up, forge_remove_paid · merge_rarity_mythic/ancient/divine (existing mergeNow cue) · relic_synergy in gainRelic · status pop st_<k> (frozen→freeze, brittle→chill, 1 per frame) + st_cleanse/st_barrier_break · yz_evolve_f2/f3, yz_aftershock, yz_triple_arrow, yz_storm_final · taro_deploy, taro_extra_sentry (sentry cap rises) · login_day30 · dig_unlock (featRevealNext 'dig'), dig_ancient_open, dig_ancient_locked (once per session in Depths below floor 15). New calls guarded with typeof Sfx. Test: audio-a06. Owner phone listen pending.


# Previous delivery: v8.0.92 — Forge mod text readable (owner screenshot)

_buildCraftBenchRaw rows: when rowH≥66 (two=true) the pill height is rowH−42 (26–34) and the mod line gets the full row width (rw−50), scaled down to 75% then ellipsized; short rows keep the old side-by-side layout. Owner phone check pending.



# Previous delivery: v8.0.98 — Sesame Rune Invoker prototype (owner)

Normal Story Sesame after tutorial: three44px rune buttons P/M/B, persistent3orbs/FIFO, ten count recipes/fourready (PPP impact, MMM returningchakram, BBB Brand, MMB gatheringring), liveUniqueicon/name/NOTREADY, shared8sbaseCD. No pathdraft/mutation/evolution inprototype; fourbaseupgradefamilies andsharedUnique/Infusion/stats/heals. Oldsave/talentfields preserved; no pathtalents selected inStory; endgame/tutorial retainMirrorkit. Actorscap4, castsnapshot/poolgeneration/retarget0.2s/segmenthits/bosspullimmunity andrun/menu/death/shutdowncleanup. Code-drawnplaceholderart, existingElevenLabscues; nofinalart. Newrunecontracts and24staticCanvaslayouts, finalfullnpmcheck/build andForge21/Lobby360/Rubysixsize contracts passed; ownerphonecontrols/balance/readability/FPSpending. See docs/design/SESAME_RUNE_INVOKER.md. Still HEROES_WIP; fullten-spell progression/talents/migration/art remain.

# Previous delivery: v8.0.97 — Yuzu > Companion > Minions (owner)

Immortal Minions: base1/beforebuild,2/after; +2/seedlingrank(max3),+1/familyrank(max3),+1/form2,+2more/form3,+2BuildEvolution,cap16. No contactdamage/pop/regrow/decoytaunt; indexed formation follows Companion, priority/objective/boss targeting, staggered retarget/windup andpool-safe releases. Fighters punch, archers shoot, mages cyclefire/frost/lightning withshared2sfreezecooldown/no bossfreeze and0.5sone-bouncearccooldown.24mini shotsreservedwithin48total; ownership/build/epoch cleanup. New3ImageGenactors+8cellboltsatlas32frames,64/32pxlossless113954bytes/425984decoded;folderbattlelazy,bootYuzu299MB. SeparateCompanionEvolution cardsguaranteedonnormaldraftslevel7/11(noSpecial/tutorial/specialprecedence honored),protectedheal/skillunlock,once-onlystale-buildguard. Formsno longerauto fromkills/HarvestFestival. Pomelogrowth0/1/3 andshieldfinishers;Lime1/2/3piercingarrows;BloodOrangeSigil+0/1/3elementbolts. Attacktempo1/.8/.62(min0.18s),skilltempo1/.9/.78,SunKissed/Ripenrecharge. ExistingBuildEvolution retainedandstacks (Limeevolvedform+20%arrowpower/+pierce);skills/cards/talentcopy aligned. Testsnewyuzu-hierarchy-97 plusupdatedoldgrowth/Minionsemantics passed;Fullnpmcheck/build,Forge21/Lobby360/Rubysixsize browsercontracts andnewYuzu97ninecardlayouts/32framebrowserdecode passed. Ownerphonebalance/visual/FPS review pending.

# Previous delivery: v8.0.96 — clearer Blood Orange spells (owner)

New reference-guided ImageGen VFX for all5BloodOrange skills(sigil/comet/garden/bloom/honey) plus Uniqueopen/finish:2lossless128px-frame atlases/28frames in assets/art/bloodorange_skill96 (489768bytes;1.835MB decoded). Rich red-orange/ivory cores, burgundy contours and larger silhouettes replace faint multi-flavor detail. yuzuArsenalFx/yuzuEmpowerFx choose new sheets with old51/54fall back. OnlynewBloodOrange clips use0.9alpha(large0.82), preserved by tick; garden usesnewpeakframe10at0.38instead0.18. Sharedcaps/lifetimes/depth/geometry/damage/AI unchanged. HeroYuzulazy andalwaysdeferred atboot; selectedYuzuboot299MB. Newbloodorange-skill-96test checks28frames/hash/selection/opacity/fallback/VFXoff/pause/reduced/epoch/cap andothercompanions. Existing spectaclefixture explicitly testslegacyfallback. Fullnpmcheck/build andForge21/Lobby360/Rubysixsize browserchecks passed. Updatedoldgardenopacity assertion to0.38; old0.18fallback separatelyverified. Ownerphonevisual/FPS pending.

# Previous delivery: v8.0.95 — Yuzu evolved companion art (owner)

Art63 eight verified sheets packed50% lossless: six128px-frame character sheets,128px-frame8shot evolutionFX and32px-frame3leaf badge (876944bytes;3.68MB decoded). Hero class remains Yuzu, but forms63 always lazy at boot even when Yuzu selected; runArtKeys loads before battle. yuzuFormFrame maps16frame walk0–7→0–3, windup8–11→4–5, release12–15→6–7, plus special47 release/land; keeps existing art fallback and stable feet. EvolutionFX is one-shot0.6s (reducedstatic4/0.25s), NORMAL/tinted, shared8cap, owner/player/build/epoch validity, pause and clearCrew cleanup; badge allocated once and destroyed with owner. No damage/evolution thresholds changed. New tests/yuzu-forms-63.test.cjs covers mapping/fallback/loading/lifecycle; full npmcheck,build andForge21/Lobby360/Rubysixsize browser contracts passed. Phone visual/FPS review pending.

# Previous delivery: v8.0.94 — 25 mods per gear type (owner)

FORGE_SLOT_POOL (mod numbers) overrides forgePool for weapon/gloves (same 25: 11 power + heavy batter/point blank/focused/crowd/reliable/clean + hit-rhythm & mark play mods), armor (sustain 22 + claimed reward/heavy recipe/breaking point), boots (play 14 + loot/currency/medic/stored sweetness/elite lesson/hunter mark). Turns on already-coded mods outside FORGE_ROLLABLE; #133 Crystal Glaze skipped (no effect). Amulet/ring keep the v8.0.93 row rule. Tests: forge-simple (25 per slot), forge-150. Owner phone check pending.

# Previous delivery: v8.0.93 — Mod groups by gear slot (owner)

FORGE_SLOT_ROWS filters forgePool by item slot: weapon/gloves power · armor sustain · boots play · amulet sustain+play · ring power+play (active pools 11–25). Existing mods untouched. Tests: forge-simple (weapon rolls power only), forge-150 (pool rows ⊆ slot group). Owner phone check pending.


# Previous delivery: v8.1.15 — C3 and Pinnacle painted boss effects (owner)

36clips216authoredframes across9selected ImageGen atlases inboss_outline815; harvest/wiltedpetals/prism/vault/root/Pinnaclemaw. Pinnaclefang/jawidentity corrections useactualbossidentity plusisolatedinkstyle references, draftsretained. Perstage10–14lazy aliases andPinnacle branch, oldwarn/counter/safezonefallthrough; shared813bodymovesreused. Ownedwallclock expanded815; directringsegments/prism/nectardrip tracked, seedgrid retainsstaticwarning0/1 and beginsframe2 onlyat originalstrike. Original geometry/anchors/periods/damage/collisions/gaps retained; largebossFXopacitygate recognizesnewfamily. Combined96clips576frames realCanvascontracts andisolatedseedgrid/event/alias/hash tests. Existing814 Pages41864376182/APK41864376011SUCCESS; live14/all28hashesverified afterGitHubservicequeue cleared. User requests allremainingart insequence; bodyposes/B01/B05-B06/animatedbullets/C3minis next. Userwaived phone testing andwillplay himself.

# Previous delivery: v8.1.14 — C2 boss painted-outline effects (owner)

Seven original ImageGen atlases/28clips168authored frames in boss_outline814. Rootmother bud/cream sage growth, teal fungal spores, amber honey, brass orchid clock and thorn-root memory effects. C2-only stage-lazy aliases5–9, shared B06podshield also9, reuse four813bodyclips onC2; bodyimpact formatting handlesB10. Existing ownedclock/Low/reduced/pause/epoch cleanup expanded814, honeywall holds retain lifetime; directarenaHands/Pods nowresolveandtrack actual sprites. Original warn/fogtile/airbubble/attack timings/damage/colliders/safe gaps preserved. Large boss-effects alpha cap recognizes aliases, including original C1eclipse cap. New isolated adapter/hash/geometry/stage tests; GPU asserts bothgroups stage-lazy; static Canvas gallery expands60clips360frames with same6layout contracts. Source/QA/previews retained. No boss body pose redraw or C3art completion; owner phone appearance/FPS pending. Runtime214c24d pushed/exactreadback56files; localcheck/build/all8browsercontracts passed. Publication completed: Pages41864376182/APK41864376011SUCCESS; live8.1.14 andall28newasset bytes/hash verified afterGitHubincidentqueuecleared.

# Previous delivery: v8.1.13 — C1 boss painted-outline effects (owner)

Built-in ImageGen eight source atlases/32 clips/192 distinct authored frames in boss_outline813, genuine alpha and original legacy projected geometry; four shared body moves and C1 elemental/signature VFX. Stage-lazy aliases only stages0–4, old art fallback/Pinnacle excluded. Owned wall-clock sprite progression, hold-aware ice bars, wave720ms and skydrop760ms damage-aligned cosmetic impact with player/stage/epoch cleanup. Warning shapes, safe gaps, damage and attack cadence preserved. Source radial frost breath corrected from directional draft, then transparent matte correction; drafts retained for provenance. Exact prompts/manifests/alpha/hash/frame/border QA, static Canvas gallery and isolated production helper tests. GPU test now asserts all32keys remain stage-lazy; elite-stage extraction fixture includes the new registry dependency. Runtime8.65MB/41.25MiB decoded across whole kit, per-stage lazy subsets. Boss body poses, later chapters and phone appearance/FPS review remain future work.

# Previous delivery: v8.1.12 — restore painted Plasma and audit boss art (owner)

Owner clarified remove only pale-blue area guide, not Plasma artwork. Restored bpx_taro_plasma_ring→bpx_taro810_plasma sixframe loop following original radius/out-and-back; retained no pale floor/circles in Magnetic Field and interior-lightning fallback. Recast now removes both old loop and graphics; expiry/scene cleanup and original damage/timing/debuff geometry preserved. Clarity811 test extends loaded-art/fallback/recast/expiry contracts. Source audit decodes152registered files:15mainbosses/5C3minis/116VFX/16shots; all mainbosses8distinct nonempty cells. Source-contact PNGs/hash/dimension inventory and prioritized art direction docs/design/battle_art_audit812; reproducible script scripts/audit-battle-art812.py. Existing boss shots/body VFX are wired despite old source-only delivery notes. Findings: shared neutral body FX, mixed glow/outline styles, similar B05/B06 silhouette,160pxB01 and held-pose vs sequence gaps. Boss redraw is proposed next work, not claimed delivered here. No new runtime images/audio/gameplay changes; owner phone visuals/FPS pending.

# Previous delivery: v8.1.11 — smaller projectiles and clearer Taro fields (owner)

Owner phone feedback: Strawberry charged Sniper overlay×.7, charge aura removed in painted and old-art paths; Mint normal Impaler lance2.2→1.45visual multiplier/shards64→52 and48→40; Cocoa normal/finisher fists96/150→76/120, Rocket120→96 plus1rocket at every Unique level (4/5/5/6), Titan charge aura×.8. Taro Ball core38→26 (gold44→30), field capped80px/.3alpha; zap one visual bolt14px/.32alpha and hit18px/.35alpha with original damage/zap cadence preserved. Taro owned lifetime fade preserves initial alpha. Sentry base cap2/max3, launch interval .62→.84 coefficient (about26%fewer launches per sentry); Overdrive respects current card cap instead of always filling3. Plasma and Magnetic rings/floor removed, interior lightning retained with original gameplay radius/out-and-back damage. No new assets/audio/save changes. Existing swarm/Cocoa count fixtures updated for owner-requested counts; new isolated rendering/alpha adapters. Mobile visual/FPS review still needed.

# Previous delivery: v8.1.10 — remaining hero painted-outline VFX (owner)

Owner explicitly requested completing Chocolate→Taro→Yuzu Companion+Minion→Strawberry without waiting between batches. Original built-in ImageGen11selected source atlases/44clips264authored frames; exact prompts/alpha/hash/border QA/source previews and reproducible packing. Runtime44WebPs13,840,032bytes/69,206,016decoded total, selected-hero lazy/always bootdeferred; Yuzu3element routes borrow Cocoa/Mint/Taro clips. Owned gameplay-time animation preserves old clip periods, loops and one completion, pause/Low/reduced and pool/player/basic/epoch/shutdown cleanup. Companion shared4majorFX and compact Minion hit3/120ms preserved; Strawberry shared48overlaycap. Existing character bodies, aim guides, damage, collisions, targeting, AI, cards and audio retained. New exact-asset/event/factory tests and static real Canvas47route/282loadedframe gallery added to CI. Phone visual/timing/readability/FPS review pending. See docs/design/OUTLINE_REMAINING_810.md.

# Previous delivery: v8.1.9 — Mint painted-outline VFX (owner)

First Sesame-style battle batch:2original ImageGen sources/8clips/48painted frames with truealpha, exact prompts/manifests/hash/border QA/source previews in mint_outline819. Runtime8WebPs2,004,790bytes/9,043,968decoded hero-lazy/alwaysbootdeferred. Glacier Bloom owns6frame snowstorm clock and cosmetic final bloom; four-second/eight-pulse gameplay retained. Impaler/normal lances and shards use owned-frame overlays on original bullets; animated dash trail, rupture/blast/charge/compact hits. Pause/Low/reduced frame hold, oldart/geometry fallback/pool+scene cleanup and budgets retained. Mint55 player charge/move sprites and damage/hitboxes/targets/range/speed/cards/audio unchanged. New asset/ownership and real Canvas gallery contracts. Owner phone visual/footprint/timing/FPS pending; remaining hero batches authorized without a review gate. Design docs/design/MINT_OUTLINE819.md.

# Previous delivery: v8.1.8 — boss shelter, smaller Yuzu squad and nectar defense (owner)

C2-2 air pocket stationary/prop-aware, radius+boss body+80px clearance; Behemoth pinned movement+attack/follow-up gate,4s charge/countdown,1.6×arena blast only outside,0.6s recovery, owned pause/player/stage/epoch/cleanup. Existing fog/bubble art preserved. Yuzu cap16→10, Squad+1/rank/evolution+1/forms+1each, companion power×.9/minions additional×.95, spawn/acquisition/cycle stagger, curved homes, crowded normal targets distributed and every third minion may cover close mobs; mission priority preserved. Nectar3×100HP→1×300HP; exact one third max-HP life loss bypasses armor/shields/iframe then fullHP relocation if alive, normal death flow. Visible descriptions/cards updated, no save/talent changes. New event contracts and hierarchy tests; owner phone timing/readability/balance pending. Design docs/design/C2_FOG_YUZU_NECTAR_818.md.

# Previous delivery: v8.1.7 — animated elemental invocations (owner)

Owner approved PPB Steam Cannon (three forward cone pulses .18/.42/.66s, follows player/captured direction, 300px base range) and PBB Tidal Serpent (priority chase, three bites and water finisher, Boss role). Independent CDs/orb snapshots retained; other eight spell mechanics unchanged. Original ImageGen three atlases/72 painted frames for all ten spells/basic/shared casts; exact prompts/raws/QA/previews retained. Three hero-lazy WebPs 4,340,638bytes/18,874,368decoded, normal alpha, old-art/geometry fallback. Owned-time frame stepping, reduced-motion peak pose, existing actor/projectile/flash caps and cleanup. No audio/input/save/talent changes. Event/packing/real Canvas checks expanded. Owner phone art/timing/balance/FPS review pending.

# Previous delivery: v8.1.6 — fire and wind rune sounds (owner)

Owner changed red from knock to actual fire flare and green from metallic ting to wind gust. Two original ElevenLabs cues/four donors in sesame_orb816_audio and runtime sesame_orb816; source prompts/request provenance, gain/decode/peak/hash QA and audition retained. sesRuneSound routes red/green to816, blue remains815 byte-for-byte as approved, other cues unchanged. Tests verify routing/new audio and exact blue hash; browser decodes all11 cues. Phone approval of new fire/wind sounds pending.

# Previous delivery: v8.1.5 — Sesame buffs, orb identity and movement ownership (owner)

PMM Prismatic Armament6s +40%basic damage/+30%basic attack rate; BBB Tidal Armor6s 20%HP shield plus0.5%HP/s regen (normal healing rules), no stationary damage/bullet clearing. Red10%damage/orb and larger splash, green6%move/8%basicrate perorb, blue0.25%HP/s and12%echo/orb; Gale/Tide ranks extend new bonuses. Echo60%damage, once per primary volley,0.14s delay/run-owned queue4/projectiles18; no recursion. Buffs refresh without stacking, expire/clear with run. PPP tracks live target generation until120ms before each meteor; Boss-role multiplier1.35→1.65 for PPP/PPM only. New original ElevenLabs3distinct taps/6donors, peak/RMS/decode/hash metadata. All heroes: action half cannot start movement, active joystick cannot be stolen, action pointer stays reserved through drag until release; mirrored controls covered. Tests cover shield/buff/echo/rate/boss aim and real input routing. Existing art reused; owner phone balance/loudness/FPS approval pending.

# Previous delivery: v8.1.4 — Sesame spell identity and controls (owner)

First three approved recommendations: cast-time red-orb multiplier passed explicitly per spell hit, leaving basic attacks live and other hero damage unchanged; 44–61.6px rune buttons follow control scale, compact readiness/FIFO label, pause recipe reference with stats and ten cooldowns; PPB five eruptions leave4s ground with8power/.5s nonstacking overlapping burns, initial hit36 instead of52, PPM renamed Sunlance. Independent cooldowns retained. No mana, new cards or talent migration in this first pass. Tests include delayed orb snapshot, ground damage, mobile controls/pause guide; phone balance/readability still owner review.

# Previous delivery: v8.1.3 — on-demand persistent assets (owner)

Owner supersedes whole-game startup download policy. Opening no longer downloads every asset; preloadAll skips lazy art/music without fetching and no fillAssetCache sweep. Existing ensureGroup/ensureStageArt/ensureStageAudio load on demand. SW retains existing cache, awaits writes, deduplicates simultaneous requests and serves exact hash hits without network. Early SW registration controls first asset loads. Tests cover offline/repeat/hash/quota/cache concurrency. Phone startup timings remain unmeasured.

# Previous delivery: v8.1.2 — Sesame sound clarity (owner)

Sesame red/green/blue rune volumes balanced to existing ElevenLabs clips, recipe cue delayed to reduce overlap, and PMB uses a louder impact cue. Rune input/cast contract tests cover timing and PMB routing; phone listening and mix review remain pending.

# Previous delivery: v8.1.1 — ten elemental invocations and orb cards (owner)

Sesame normal/endgame aftertutorial now ten recipes with independent10–18sbaseCDs,0.16srune/0.38scastrecovery, persistentFIFOorbs, live selectedCD/ring and existingrechargeprojection/KillChargealltimers. Red+6%damage/orb,green+4%speed,blue+0.15%maxHP/s withinhealingrules/cap; eightorbcardfamilies. PMB360-degreeone-hit/generationconcussivewave, Brandremoved, BBBhealingward, MBBsurvival; sixclear/twoboss/twosurvivalspells. RainbowFlare basic/projectilepool18,actorcap8/flashcap12, nooldpath/mutation/evolutiondraft. OriginalImageGen16motifs/eighticons,762202runtimebytes/2.36MBatlasGPU; hero-lazy/alwaysbootdeferred. DirectElevenLabs6cues/12donors, admittedtap/canonicalrecipe/cast/impactfeedback, no synthfallback. SharedTaro damage-snapshot test stripsonlynewSesamepassivehook; Rune/draft/UI tests updated for superseding prototype semantics. Finalfullnpmcheck/build, Forge21/Lobby360/Rubysixsizes/Heroes7 andRune24layouts/tenpreviews/16frames/sixMP3browserdecode passed. Permanenttalents stillstored/WIP; ownerphonequality/balance/FPSpending. Design docs/design/SESAME_INVOKER_811.md.

# Previous delivery: v8.1.0 — Sesame unlock after C1-5 (owner)

CORE_UNLOCK_STAGE.sesame=4: normal firstclear and existing Save.load repair grant Sesame free after C1-5, playable from C2-1/replays. FIGHTER_PLAYTEST_ALL remains false; other heroes retain their gates. Rune prototype98 and WIP remain; no talent/save-point migration or extra lore scene. Canon gameplay availability updated. New real-unlock-helper coverage in hero-unlock-ch1 verifies pre-gate/firstclear/oldsave/idempotence/no currency or talent loss. Fullnpmcheck/build andForge21/Lobby360/Rubysixsizes/Heroessevensizes browser contracts passed. Roster now labels Sesame Invoker; browser selection test measures exactly one save relative to the existing menu-save count, then confirms repeat idempotence. Ownerphone controls/balance/FPS pending.

# ⚠️ DEPLOY BRANCH — read first

Use the project skill `.claude/skills/release/SKILL.md` (`/release`) for every version: it holds the full bump → checks → deploy → verify order below.

The live game (GitHub Pages / APK live update) deploys ONLY from `claude/vampire-survival-mobile-game-yo9e8w`. Pushes to any other branch (session branches like `ccr-*` or `claude/*`) run the Pages workflow but it fails, so the game stays on the old version. Owner has approved this permanently: after committing, always push to the vampire branch too (`git push origin HEAD:claude/vampire-survival-mobile-game-yo9e8w`, fast-forward only; if it is not an ancestor, merge it in first, never force). Push the vampire branch ALONE (not in the same moment as the session branch): both runs share the Pages concurrency group, so the session-branch run cancels the vampire deploy (v7.0.0/7.0.1 got cancelled this way). Then confirm the "Deploy Web (GitHub Pages)" run for that branch succeeded and the in-game version matches `GAME_VERSION`.

# 🧭 Model routing (owner 23 Oct) — pick the cheapest model that fits

Owner approved delegating simple work to cheaper subagents (`.claude/agents/`). The main session (Opus) plans, decides, reviews diffs, bumps GAME_VERSION/CHANGELOG, commits and deploys.
- **quick (Haiku):** look-ups in game.js, "did art arrive?", Actions run status, file lists, small exact doc edits (CLAUDE.md blocks, README rows).
- **builder (Sonnet):** clear code changes where what/where is already known — given numbers, text rewording, wiring delivered art by an existing pack script/pattern, copy-an-existing-UI-piece, art order docs from an outline.
- **Main (Opus) itself:** design and owner questions, unclear bugs, balance, new mechanics, multi-system features, final review.
- Skip delegation when the job is one or two tool calls (spawning costs more than doing it). Always read the subagent's diff (`git diff`) before committing.

# 🚧 HEROES IN DEVELOPMENT — Sesame — read first

Owner started Sesame work and approved a replacement concept on 2 Nov2026: **pathless Rune Invoker**, three rune buttons, max three orbiting orbs, FIFO replacement, recipe by counts (not order), Unique previews/casts current recipe and retains orbs. Current design: `docs/design/SESAME_INVOKER_811.md`; Mirror Network remaining phases are superseded. Ten spells, orb cards and generated feedback are implemented in8.1.1 for normalStory/endgame; permanent talent rework remains separate. Audit existing saves/talent investment before enabling the replacement. Earlier restriction below describes the pre-start state; Sesame-specific work for this new concept is now authorized. Keep WIP until implementation is complete.

Yuzu finished in v7.9.37–39 (Orchard Swarm, owner-approved) and removed from HEROES_WIP. Owner: Sesame is not finished. Do NOT change Sesame's cards, paths, talents, mods, fusions, balance or art wiring (and leave them out of card/relic audits and ECRS passes) until the owner starts work on that hero. game.js `HEROES_WIP=['sesame']` shows a '🚧 In development' badge on its roster card; remove an id from it when the owner says that hero is being finished. Shared systems (relics, trade-offs, infusions) may still change, but do not add Sesame-specific fixes. Note: v7.9.17 already changed Yuzu Chain Feast/Quick Paws and Sesame Prism Echo/Retreat Shot before this rule.

# CLAUDE.md — สมองของโปรเจกต์
อ่านก่อนเริ่มงาน · จบงานแต่ละก้อนให้ปรับข้อ 4–5 · ประวัติเก่าทั้งหมด `docs/CLAUDE_HISTORY.md`


# Previous delivery: v8.1.16 — painted boss body animation and clarity

21 original identities /22 visual forms /264 authored frames cover15 campaign bosses, Pinnacle and5 C3 minibosses. Actual Sprite replacements provide idle, wind-up, strike and recovery. B01 uses256px source frames at the same world size; B05 mouth/eyes and B06 upright bud/face/roots have distinct silhouettes. Ratio-normalized scale/circle offsets preserve real Arcade world geometry. Stage-lazy textures, fallback, freeze/pause/intro/Low/reduced, phase2 and pool cleanup are tested. Explicit charge cues follow existing release callbacks; other sequences interpolate within original pose intervals. AI, damage, cooldowns, positions and velocities remain unchanged. Pages41885436348 /APK41885436096 and live16/all21 body asset hashes verified. See DELIVERY816.md.


# Previous delivery: v8.1.17 — completed boss battle art pass

All ordered boss-art tasks1–5 are delivered. The owner explicitly waived agent phone testing and will playtest himself. Final game/art commit:e01180437ba078508b8458b0d3dd31123099a836; CI recovery commit:53ff71c49b2eee6c842e145394b111b05426fbbd. Pages41890956493 and APK41887138733 succeeded. Live version/code and **all133 new boss-art files /904 authored frames /44,333,442bytes** match their source manifests by SHA-256. Exact immutable readback also verified all47 release files and both CI recovery files. Full npmcheck, build and ten browser contracts passed locally and in CI.

Sixteen original painted projectile silhouettes now have four-frame128px loops,575,618runtime bytes, loaded per stage. The original pooled physics bullet is reused: damage, lifetime, speed, circle, scale, rotation and behaviour remain unchanged. Owned frame clocks respect pause/Low/reduced and pool/player/stage/epoch/shutdown cleanup without destroying actors. Original1254-square ImageGen sources, exact prompts, alpha/hash/border QA, previews and mechanical packer are retained. See docs/design/battle_art_audit812/DELIVERY817.md.

Publication recovery: one Pages attempt timed out while updating_pages; re-running the old workflow produced duplicate github-pages artifacts. The workflow now isolates upload/deployment artifact names by github.run_attempt and allows20minutes for publishing the large site. A fresh run succeeded. Game/art bytes were unchanged by this CI fix.


# Previous delivery: v8.1.18 — repair source cuts and complete early miniboss motion

Owner found clipped/unfinished boss sheets. Rigid256-source cuts before padding had hidden errors; new packer partitions at actual transparent source gutters BEFORE shared uniform packing. Source rects and independent PNG alpha-seam tests cover all384source cells;1111painted pixels reassigned correctly (717fromexisting21actors). Original21body source drawings preserved/repacked,9C1/C2minibosses receive108selected new ImageGen frames;4were static160/192/140/140px images. Full16-frame Ancient Root Knight and its five dedicated animations retained. New30body sheets/372frames28,292,916bytes inboss_body818 with stable logicalkeys, stage-lazy, actual Sprite replacement and physical geometry retained. Earlier-miniboss pose helpers now enter owned body clock; original AI/damage/velocity/cooldowns/colliders unchanged. All372runtime cells inspected in source compositions, not gameplay screenshots. See docs/design/BOSS_SHEETS_818.md. Full npmcheck, final build and all ten browser contracts passed locally and in CI, including actual Arcade frame1 attack translation checks. Runtime9a13495e95355cb6f19927f2d646b3a78f703ab3; Pages41936748491/APK41936748513 SUCCESS. Live18/code and ALL143active boss-art files/1028frame cells/53,563,971bytes verified by source-manifest byte counts and SHA-256 (includes original Root Knight). All62changed release files/58,146,613bytes immutable readback/decode verified; local/remote trees matched. Owner phone testing waived.


# Previous delivery: v8.1.19 — smoother boss anticipation and recovery

Six new authored transition drawings per main boss (96 total) interleave with exact previous endpoints: 16 main sheets/288 frames, active30 body sheets/468 frames; original16-frame Root Knight retained. Stage-lazy lossless WebP, 192 decoded endpoint cells pixel-identical. Owned clock follows game speed, pauses/freeze/hit-stop, continuous idle, protected attack facing/hurt interruption. Main strikes follow actual shot/object/summon/hazard/nova events with cast guards; charge/fog explicit wind/strike preserved. Physical geometry, damage, AI and timers unchanged. See docs/design/BOSS_MOTION_819.md. Full npmcheck, final web build and all ten browser contracts passed locally, including96 independently decoded source cells, actual660ms/760ms release events and real Arcade geometry. Runtime fa3a2e825e40f3a625711009b49324f8aad7db81; Pages41960702302 and APK41960702300 SUCCESS. All49 changed release files/58,797,529bytes immutable readback/decode verified; all11 remote trees matched the local committed tree. Live19/code and ALL143 active boss-art files/1124 frame cells/61,548,051bytes verified by byte count and SHA-256. Local/remote runtime trees aligned. Owner phone testing waived.


# Previous delivery: v8.1.20 — compact ink HUD and flowing boss health

Original ImageGen ink edges replace four HUD skins,145,280runtimebytes, stage-only. Compact phase/mission layout; boss strip replaces redundant encounter title,39px plate with14px animated liquid/phase/HP/percent and continuous green-yellow-orange-red health color. Actual HP is authoritative; FPS-independent drain/ghost trail, pause/Low/reduced, new-boss cleanup. Familiar controls/hit areas retained; thin ready outlines, no hidden Sesame Unique backing. Five relic previews plus overflow count, wrapping active statuses and shared trait row preserve space and information. No gameplay or balance changes. See docs/design/BATTLE_HUD_820.md. Independent original-source alpha and30/60/120FPS contracts; actual Nunito/Canvas56fixtures plus both hands/three control sizes passed during development. Full npmcheck, final web build+10reviewbuilders and all eleven browser contracts passed locally. Runtime 3c6577212ec2e98686fd626cb717838dc3291d84; Pages41965880914/APK41965880902 SUCCESS. All26 changed release files/6,720,823bytes immutable readback/decode verified, all12 remote trees matched and runtime tree aligned. Live20/code/all4 HUD skins/145,280bytes verified by SHA-256; sixteen boss-motion19 paths retained. owner phone testing waived.


# Previous delivery: v8.1.21 — lighter GPU drawing (owner, OPPO A95)

Headless draw audit (412×915 DPR2.6, Auto=1.5): battle ~7 draw calls/frame, one floor layer + vignette — already lean. Removed two hidden costs: gridBg (4000² world grid under the floor) now setVisible(false); playMotionComic hides this.menu (layered hub ~29× overdraw behind an opaque comic) and restores it on finish. No visual change. Owner asked to measure on A95 with Combat Meter (FPS) and try Performance Low (DPR 1.25).


# Previous delivery: v8.1.23 — Back to Hub crash after a boss loss (owner screenshot)

Back to Hub = scene.restart; shutdown clearArtVfx→stopBossInk restored the boss texture on a destroyed sprite (setTexture → reading 'sys'). Restore now skips destroyed actors (scene undefined). Second crash on the new create: stale _sesRuneButtons → sesRuneLayout setRadius on null; Game.create resets _sesRuneButtons/_sesRuneUI/_sesRuneLabel/_bossInkActors. Reproduced headless (C2-5 Root Throne, spawnFinalBoss, die, Back to Hub) → clean menu after fix.

# Previous delivery: v8.1.22 — Mint ice needles

Mint normal lances and Impaler throws use six smaller original painted needle frames, loaded only for Mint, with the previous art as fallback. Damage, collision, speed and timing remain unchanged. Source and prompt in assets/incoming/mint_needle821; mechanical packer scripts/pack-mint-needle821.py. Full npm check, eleven browser contracts, and final nine-clip Mint Canvas review passed locally; Runtime 5b2eaf55709d0d5279bf06fe437de768ab724398; Pages42063999844 and APK42063999104 SUCCESS. Live8.1.22 and the 108,850-byte needle atlas match the source SHA-256. All13 release files/4,816,026 bytes passed immutable readback and decode; runtime trees aligned.


# Previous delivery: v8.1.24 — Hero motion and Yuzu duo commands

Ten original eight-frame hero sheets are selected lazily for unique skill poses and build-specific movement, with legacy textures as fallback. Yuzu fires a marking seed during each companion command; the existing mark and In Sync rules handle the cooperative bonus. Source sheets and provenance: assets/incoming/hero_motion823; packing: scripts/pack-hero-motion823.py. Full npm check, web/review builds and eleven browser contracts passed. Runtime 42fded32a9ff1633c861a4a2b2ca433c6db392ab; Pages 42075871206 and APK 42075871175 succeeded; all 37 files and ten live sheets verified. Phone play review remains with the owner.


# Previous delivery: v8.1.25 — Yuzu Unique cut-in (owner)

uniqueCutin(hero,kind,name,color,done): every Yuzu Unique (yuzuParadeCast) first plays ~0.7s cut-in — physics timeScale 5 (20%), veil, diagonal band in the Unique colour, art cutin_yuzu_<kind> (art order 64, pending) else char_yuzu + yz_<kind>, skill name; then visuals end, speed restores, and the cast runs once state is play (epoch/shutdown guarded). Settings › Unique Cut-in (settings.cutin, default on). Other heroes later if owner approves. Headless: overlay shows, ends, buff applied, no errors.


# Previous delivery: v8.1.26 — smaller Yuzu cut-in (owner)

Owner: cut-in too dominant. uniqueCutin band now H*.12 (max W*.27) at y=H*.66 below the hero, clear of Ruby tips (was H*.3 at .42), veil alpha .25 (was .55), name 22px/stroke 4, shake halved. Timing/slow-mo unchanged. Art order 64 size note still fine (image scales to band).


# Previous delivery: v8.1.27 — Yuzu cut-in sweep (owner)

Owner spec: diagonal yellow strip sweeps left→right across the screen, no dark veil, slight slow only while it closes, skill fires near the end. uniqueCutin redraws the band each tween step (head b 0→1 in 220ms, hold 260ms, tail a 0→1 in 280ms Quad.in); physics timeScale 2 (half speed) only during the tail; cast at 80% of the tail (~700ms), visuals/slow end at 760ms. Same size/position as 8.1.26 (H*.12 at y=H*.66).


# Previous delivery: v8.1.28 — art 59 Bazaar/Heroes tab icons (owner)

Last 6 menu59 icons wired: paintedNavButton(…,icon) gets 'tab_'+id for Bazaar chests/shop/trade; drawRosterTabs adds tab_heroes/tab_talents/tab_stats (dimmed when Talents locked). Icon left of the label, text shifted; m59Img null (sheet not yet loaded) keeps old text-only tab. Note: menu59_icons loads on demand and can wait behind the background asset queue. Art order 59 now fully wired. Also ships the v8.1.27 cut-in (its Pages run hung on apt ffmpeg).


# Previous delivery: v8.1.29 — easier Forge: more Twist Cream, readable mods (owner)

Owner: Twist Cream not enough, mods hard to understand. Boss reward 4+stage (was 2+), miniboss 2–3 (was 1–2), elite drop 75% (was 50%); forgePrice 1+floor(crafts/4) (was /2). MOD_EFFECT gained short {v} lines for the 35 mods enabled in v8.0.94 that only showed catalog jargon (Object.assign after MOD_EFFECT). Boots pool drops dead currency-bias mods 130–132 → 25/26/27 (still 25). Tests: affix-sound, forge-simple, forge-150 price expectations.


# Previous delivery: v8.1.30 — no cut-in, Yuzu duo finisher (owner)

Owner dropped the Unique cut-in (yuzuParadeCast no longer calls uniqueCutin; Settings row removed; uniqueCutin kept unused; art order 64 cancelled). Kept/strengthened team attack: 450ms after the cast (when the companion's move lands) Yuzu fires a 3-seed fan (±0.16 rad, 60% power each, pierce 1, source duo_finish) at the command point + combo pose, light shake, yz_triple_arrow cue; epoch/state guarded. Existing duo_seed mark shot unchanged.


# Previous delivery: v8.1.32 — clearer hero motion823 poses (owner)

Owner: new skill poses visible but unclear. Art is fine (8×128 frames); they played in 0.4–0.5s. bpPose now forces ≥0.95s for *_motion823 keys and eases frames (fast wind-up 0–30%, hold mid key pose 30–75%, settle). Run sheets unaffected (separate movement path).

# Previous delivery: v8.1.31 — Yuzu duo finisher per companion (owner)

duo_finish (450ms after cast) now depends on companion kind: pomelo = 8 seeds radiating from the command point (40% each, pierce 2, bigger shake); lime = one golden seed along the aim line (160%, pierce 99, speed 1150); bloodorange = 5 homing seeds (45% each, seek) fanned from Yuzu; yuzling keeps the 3-seed fan (60%). Test added in yuzu-companions (counts/pierce/seek per kind).

# Previous delivery: v8.1.33 — story music and character voices

Six A04 music tracks and 372 current A07 voice clips use lazy audio playback and existing volume/voice settings. Owner confirmed Cocoa and Sesame feminine voices; 20 Cocoa clips and 63 explicitly gendered boss clips were recast, 19 Sesame lines and three Ruby tips generated. Voice/text mapping, one-channel ownership, subtitles, cache cleanup and mute guards; boss casting for characters without explicit gender remains provisional. Sesame’s visual development badge is hidden without changing gameplay gates. Full npm check, web/review builds and eleven browser contracts passed; runtime 12989768cac888f118afae5a2cd2401a876b0930, Pages 42320525518 and APK 42320525548 succeeded. All 617 changed files and 378 live audio files verified. Playback, words, mixing and music loops still require owner listening.

# Previous delivery: v8.1.34 — tap the Lobby hero to hear a line (owner)

lhTap → lobbyTapSay(): skips 'thinks' entries in LOBBY_LINES, stops a showing bubble, then tickLobbyVoice(0) shows the next 'says' line and voiceLine plays its A07 lobby clip (vo_<role>_lobby_n). Doesn't cut a line still speaking; works even before the animated lobby sprite loads. Headless: bubble + vo_strawberry_lobby_1.mp3 requested.

# Previous delivery: v8.1.37 — Unique voice variety (A08)

47 original ElevenLabs lines use the existing saved character voices: three lines for each of 15 Builds plus two Sesame lines. All are lazy-loaded and selected by the existing Unique voice rotation. Mono 44.1kHz/128kbps, measured at most 1.3s and −1dBTP; exact captions and donor provenance in assets/incoming/audio_unique_a08. Nine companion voice auditions were prepared; six companion responses and integration followed in v8.1.38. Human listening remains outstanding.

# Previous delivery: v8.1.36 — Unique voice every cast + A08 voice order (owner)

uniqueCastFx → VoiceActing.unique(scene): ignores the 12s bark throttle, cuts the hero’s own playing line (never Ruby/story), rotates vo_<role>_unique_<path>_1..4 + vo_<role>_unique_1..4 without back-to-back repeats, keeps _unique_ clips cached. Test in voice-acting-integration. docs/audio_orders/A08_UNIQUE_VOICE_LINES.md orders 45 per-Build lines, 2 Sesame, 6 Yuzu companion duo calls (needs Voice Design) — catalog rows only, no playback code needed except duo calls.

# Previous delivery: v8.1.35 — every Lobby tap switches the voiced line + title theme on loading (owner)

Owner: tapping fast didn't change the voice. lobbyTapSay no longer waits for VoiceActing.busy(); each tap stops the current clip and speaks the next 'says' line. 150ms debounce (_lobbyTapAt) so one touch can't skip two lines. Owner: loading music = track 2 only: index.html LoaderMusic now plays story_music/bgm_title.mp3 (was Forgotten Wind); StoryMusic.play skips bgm_a04_bgm_title while LoaderMusic.playing() so it continues seamlessly; menuMusic non-A04 screens call playMainBgm when the loader is still playing.

# Previous delivery: v8.1.38 — Yuzu companion duo replies (A08)

Six ElevenLabs companion replies join the 47 A08 hero lines. Owner delegated provisional casting; audition 1 selected for Pomelo, Lime and Blood Orange. DuoVoice lazy-loads and rotates each pair, waits for Yuzu speech, uses Sfx, respects voice settings and cancels stale scenes. Human listening remains outstanding.

# Previous delivery: v8.1.39 — Sesame story and voices

Sesame’s S10 motion comic plays before first entry to C2-1 and is available in the story gallery. Four hero unlock lines and the second boss memory beat have matching voiced comic shots. Owner cancelled art order 49 and accepted current A07/A08/A04 audio after listening.

# Previous delivery: v8.1.40 — Sesame rune buttons arc around Unique (owner)

Owner keeps the 10-recipe memory challenge (no recipe hints). sesRuneControlLayout places Power/Motion/Binding on an arc around Unique (up, diagonal, inward side; mirrored for ctrlLeft), distance u.radius+r+10, pushed clear of Dash. sesRuneHit: tap area ×1.45 radius, nearest rune wins, never steals taps inside Unique. 12ms vibrate on rune press (settings.haptics!==false). Glyphs ▲ ➤ ◆. Tests in sesame-runes.

# Previous delivery: v8.1.41 — perf hold, Unique voice preload, amulet/ring pools (owner)

tickPerf: after a downgrade PERF.hold=30 (seconds) blocks upgrades. VoiceActing.preloadUnique(scene) in startStage loads every vo_<role>_unique_* clip. FORGE_SLOT_POOL.amulet (recovery/barrier/loot) and .ring (crit/rhythm/conditions) 25 each, distinct from boots. Forge OP audit and Sesame talent design sent to owner for decision (not changed). Mint lance: owner says done, no work.

# v: v8.1.42 — Sesame Runes talents + forge caps + story decisions (owner)

Sesame: SES_RUNE_PT/PATH_TALENTS.sesRune (after '// v4.88: Passive' — CHAR_TALENTS..Passive block is hash-locked by talent-icons test). Branches Power(srP, srBoss)/Motion(srM, srCd)/Binding(HP, guard); caps Overload/Perpetual Motion/Threefold Mastery. sesRuneTalentMul hooks sesRuneDamage + rune cooldowns (floor 45%). Save.cp one-time sesTalV3 full refund of all Sesame talent points. Forge: FORGE_HP_CAP 150 (mod 13, bad mods still subtract), DR cap .4, damage bonus cap 1.5, Clean Recipe .2, Last Crumb once per item; Unique CDR was already capped at 40%. STORY_CANON: post-game = expedition beyond Mochitopia into an endless cave (Delve); animal bosses = guardian spirits. Sesame balance numbers still need mobile play.


# v: v8.1.43 — art 65 Daily Login 30 + A09 Ruby stage voice (owner)

Art 65: scripts/pack-login30.py → assets/art/login30/ (11 WebP, source 2× size kept, 199 KB); MENU_ORDER_ART l30_* (panel/button 9-slice); menu-lazy via LAZY_MENU_ART_RE + loginPopup ensureGroup /^(login_|day_reward|l30_)/. loginPopup uses l30 panel/header/Ruby (W≥340)/cells (today/done/chest day frame 3, day 30 l30_cell30)/rewards/stamp/today fx/button/claim burst; order-51 art and drawn graphics stay as fallback. A09: 28 clips in assets/audio/acting + A07_CATALOG rows; RUBY_TIPS.short rewritten to match spoken text; lookup strips ' · N/M'; short reminder voice ≤ once/30s per key; rubyVoiceReact(ev) (rubyReact is the avatar animation) rotates 2 lines, 8s throttle, hooks objdone/bossdown/revive/lowhp/wave/timer/clear. Tests login30-art, ruby-a09-voice.


# v: v8.1.44 — Daily Login preview (owner)

Rewards → Daily Login tab when already claimed opens loginPopup('preview'): bypasses LoginCal.ready(), tap plays the claim visuals but never calls LoginCal.claim() (owner wanted a way to test art 65).


# v: v8.1.45 — Thread shop, no billing yet (owner)

Owner: Thread is the paid currency; sell cosmetics/convenience only; Mochi Pass yes; no Play Billing yet. Bazaar 4th tab 'thread' → buildThreadShop: IAP_PACKS (6, first buy per pack doubles, Save.data.iapFirst), MOCHI_PASS (300 now + 60/day ×30, Save.data.mochiPass, tap card to claim). Iap.available() needs window.MochiBilling.ready; Iap.grant(id) applies rewards. Plan: docs/design/THREAD_SHOP.md. Test thread-shop; bazaar-tabs now 4 tabs.


# v: v8.1.46 — Wardrobe cosmetics + art order 66 (owner)

COSMETICS (9: wings/pet/trail ×3, 450/300/150 Thread) + Cos (Save.data.cos {own,eq}); buy auto-equips, tap owned to toggle. buildWardrobe (menuScreen 'wardrobe', button on Bazaar Thread tab; tap unowned twice to buy). In stage: cosSetup at startStage, tickCos in update (wings behind player, pet follows, trail while moving); destroyed on return to menu. Placeholder drawn visuals until art 66 (docs/art_orders/66_WARDROBE_COSMETICS.md, keys cos_<id>/cos_trail/cos_icons, lazy). Test wardrobe. Todo: Lobby display, free cosmetics from hard content, hide-cosmetics setting.


# v: v8.1.47 — cosmetics on the Lobby hero (owner)

buildLobby calls lobbyCos(x,footY,heroH) after the glow and before the hero sprite, so wings sit behind; pet floats right of the head with a bob tween; trail sparkles rise from the feet via hubEvery. Same placeholder fallback as in-stage until art 66.


# v: v8.1.48 — fixes: login30 frame sizes, wings depth (owner)

MENU_ORDER_ART l30_* frame sizes/9-slice insets were half the packed 2× WebP (frames showed a cropped quarter) → now match file pixels (panel 672×848 inset 56, button 480×92 ×2 rows inset 48/20). Wings depth re-set after player.setDepth(y) in update so they never draw in front when walking up.


# v: v8.1.49 — combat feel (owner picked items 1–4)

Already existed: player spring squash/waddle/lean/breathe (animatePlayer), enemy hit squash + ring + crit hit-stop (no white flash on hit, by design). Added: hitEnemy → hitNudge(e) pushes non-boss enemies 4px away once per 0.12s (damage() is hash-locked by a T5 test, so not there); killEnemy calls mochiPop(e) for non-boss: pooled white ghost squashes wide then thin and fades (≤18 live, off at PERF.lvl≥2); orbs in pickup range accelerate (160→760, vacuum 300→900) along a curve that straightens in 0.5s (o._mT reset when out of range).


# v: v8.1.50 — mission bonus goals (owner)

Owner chose positive framing: success gives more EXP (main success already pays story-budget EXP). objBonusInit(o,planned) per type: survive ≤5 hits, hunt before Overtime, purge Wisp never snuffed, capture never bleed, cleanAir ≤3s outside, defendNectar no flower lost, seasonCycle ≤8 hits, breakRoots ≤6 hits; none for fill/tutorial/planned CH1 lessons/recipe/rift. Hooks: hurtPlayer→objBonusHit, tickWaveObjective→objBonusTick, nectar loss→objBonusFail, HUD tag ' · ⭐ n' / ' · ☆'. completeWaveObjective→objBonusPay: Sugar +50% of mission Sugar, EXP +50% of story-budget wave reward. Test objective-bonus. Pending owner: trim Survive/Hunt in chapter 3; chapter-3 signature missions.


# v: v8.1.51 — mission loot burst (owner, POE-style ground loot)

completeWaveObjective → missionLootBurst(o, sugar incl. bonus): takes the mission Sugar back off sugarStage/Run and spawns 4–6 loots dropType 'sugar' (sugarVal, ic_sugar) at missionPoint (capture zone / clean air / wisp / player), 1 forgeCurrency material, and if ⭐ bonus ok a spawnLoot gear box forced ≥Rare (_lootMinRare; boost 2 in ch3/endgame else 1). Pieces scatter by tween, auto-magnet after 6s; clearPickups(true) credits uncollected sugar. collectLoot handles 'sugar'. loots maxSize 12→20; random field gear 10%→8%; spawnLoot now returns g. Test mission-loot.


# v: v8.1.52 — Daily Login layout fix (owner screenshot)

menuArtIcon/tuImg place by CENTER (origin .5), menuArtPanel by top-left. loginPopup passed top-left to l30_header/l30_ruby/l30_cell/l30_cell30 → shifted up-left. Now centers: header (W/2, py+16), Ruby (px+pw-24, py-2), cells (x+cw/2, y+cell/2); title y py+14; l30 cells show number only.


# v: v8.1.53 — weekly Daily Login + Taro Sentry nerf (owner)

loginPopup shows only the current week (wS..wE of LOGIN_CAL, 4 per row, cells ≤84px), progress bar 'Week n of 5 · cur/30' with Day-30 chest icon; cells stored as cells[j] for the claim FX; LOGIN_DAYS stays 30. Taro Sentry (taroSwarmProfile non-smite): pulse max(.65, unitC*1.15/fire) (was .4, .84) and TARO_ORB_CAP 60→36 — owner: standing still cleared stages.


# v: v8.1.54 — Wardrobe 7 slots + dyes, code ahead of art 67 (owner)

COS_SLOTS wings/pet/trail/halo/aura/dash/pop; COSMETICS 28 (art 66 + 67 items; icon:[sheet,frame], trails tk/tf numeric frames). COS_DYES 5 free tints (Cos.dye/tint/col/nextDye; owned card alt button '🎨'). buildWardrobe has slot tabs (_cosTab). Stage: cosSetup builds wings/pet/halo/aura (placeholder graphics/emoji, setTint on art), tickCos moves them + trail + dash FX (detected via _lastDashAt change because doDash is hash-locked); mochiPop adds pop FX/burst when a pop cosmetic is worn. Lobby: lobbyCos aura/wings/pet/trail + lobbyCosHalo drawn next frame on top of the hero. Order 67 doc updated with code notes.


# v: v8.1.55 — Rankings, code ready, server not set up (owner)

BOARD_CATS 8 (sugar, hero levels from charProg, weave rank, stage stars bitmask, kills/species from bestiary, chestsOpened, cosmetics owned) + Board (name default Mochi#NNNN from uid, validName 3–14 ASCII + profanity, submit throttled 2 min from buildLobby, top(cat) + my place). Rewards tabs now 4 ('ranking' → buildRanking, category tabs, ✏️ Name via window.prompt). Supabase project mochi-mayhem is INACTIVE (paused) — owner chose 'code first'; table SQL with owner-only write RLS in docs/sql/leaderboard.sql, run it after restoring the project. Scores come from the local save, so they can be faked; server-side checks are future work. Test leaderboard.


# v: v8.1.56 — art 66+67 Wardrobe wired (owner)

scripts/pack-cosmetics.py: 26 sheets → assets/art/cosmetics/ (740 KB WebP; dash/pop black bg → luminance alpha so dyes tint them). Registered in ASSET_FX (fw/fh/frames, rate 8 loop / 14 once), lazy via LAZY_MENU_ART_RE 'cosmetics'. cosEnsure loads equipped sheets before cosSetup (stage) and lobbyCos (then rebuilds hub), each key tried once (_cosTried); Wardrobe icons via loadCosArt {fx:true}; anims via bpAnim. Test wardrobe checks all 26 files/keys.


# v: v8.1.57 — GM test tools (owner, code 1234)

GM_ENABLED/GM_CODE + GM (localStorage mochi_gm). Settings: tap bottom-right 70×44 corner 7× within 1.5 s gaps → prompt code → 'GM Tools' row → buildGm (menuScreen 'gm'): Sugar/Thread/materials, unlock stages/heroes, heroes +10 Lv(+10 tp), Rank +5, reset Daily Login/Quests, Mochi Pass, all cosmetics, god mode (hurtPlayer) and ×10 damage (gmApply at startStage), save backup/restore, test profile (swaps mochi_save ↔ mochi_save_real; Cloud push/queuePush/syncCloud and Board.submit skip while testing). Any GM action sets Save.data.gmUsed → never submitted to Rankings. MUST set GM_ENABLED=false for the Play Store build. Test gm-tools.


# v: v8.1.58 — Lobby cosmetics no longer upscaled past 1.6× (owner screenshot)

Art 66/67 sheets are sized for the ~50px in-stage hero; the Lobby hero is ~380px so wings/halo/ring were blown up ~3× and looked broken. COS_LOBBY_MAX=1.6 caps lobbyCos/lobbyCosHalo sprite scale. Hi-res Lobby versions would need a new art order.


# v: v8.1.59 — cosmetics art in stages (owner screenshot)

Cause: texEvict dropped menu-class cos_* sheets on stage start, and cosEnsure had pre-marked them in _cosTried, so stages fell back to placeholders. Now texEvict skips cosWornKeys(), and _cosTried only records keys that still failed after a load.


# v: v8.1.60 — rubyGuide voiced + audio order A11 merged (owner)

rubyGuide (pointer tips + storybook fallback) now calls voiceLine('ruby', line) per page and only blips when no recording. Audio orders merged into docs/audio_orders/A11_NEW_SCREENS_SFX.md (52 files): A Sesame spells (from A10, approved), B silent-screen SFX 26, C missing voice 6 (Ruby objective-complete line, rank/star tips; vo_sesame_unlock new line awaiting owner OK — wire as voiceKey on the last MOTION_COMICS.s10 shot, do not add a shot: story-motion-art test locks 4 shots). Art order 68 (Sesame runes part 2) written.


# v: v8.1.61 — Cocoa Titan charge aura under the feet (owner)

bpx_cocoa_rage aura (titan rage tick) was 120–192px centred on the body; now (58+11·rage)px wide, half height, at the feet (p.y + 0.42·displayHeight). Rage level texture swap (colour) and growth kept; slam-range preview ring unchanged.


# v: v8.1.62 — Colossus Fist boss buff (owner: hard vs jumping bosses)

titanPctSlam pct 1.5/3/4.5/7.5% (was 1/2/3/5) and boss reach r×1.5. New titanSeek(x,y,r,lv,unit*rm): nearest boss/mini between 1.5r and 3r gets a ground crack after 0.25 s: 80% slam damage + half the % share (no crit). Test titan-pct-slam updated.


# v: v8.1.63 — tutorial ready for Ruby voice (owner)

The first-stage coach (coachSteps) had no voice at all. showCoachIntro now calls voiceLine('ruby', body with newlines→spaces; welcome prefixed with its title) and drawCoachBubble voices step.say once per step (_coachSaid). Silent until recordings exist: A11 section C2 adds 15 lines (vo_ruby_tut_<id> ×9, vo_ruby_tut_<id>_go ×6); A11 total now 67.


# v: v8.1.64 — C1-5 Great Hunger rings toned down (owner)

bossSig '05_void_maw' 360/380→240/250 px, alpha .6; '05_eclipse' 900→620 px, alpha .9→.6 so the rings stop covering the boss. Hitboxes/pull unchanged.


# v: v8.1.65 — wired art 68 (Sesame) + audio A11 (67) (owner)

Audio: 26 sfx → assets/audio/sfx/a11 (ASSET_AUDIO sfx_<key>, Sfx.menuCue/orderCue at buildMenuScreen screen-open map, stage arrows, threadBuy/claimPass, cosTap/dye/cosDashFx, ranking top3/name, mission bonus/loot burst, sugar/rare pickups, skill archive page, curse, pact); 10 ses_cast_<code> → sfx/sesame_a10 (sesRuneCast, old ses811 fallback); 31 voices → acting + A07_CATALOG (Sesame spell names 60% in VoiceActing.unique with 2.5 s gap when sesRuneRecipe exists; vo_sesame_unlock via MC_HERO_VOICE → s10 now 5 shots; Ruby tutorial/tips/objective found by text). Art 68: scripts/pack-sesame68.py → assets/art/sesame68 (16, ASSET_FX, artHero sesame lazy): rune buttons (frames P0-2/M3-5/B6-8; circle kept as hit area), animated orbs, Unique spell icon (recipe order ppp,mmm,bbb,ppm,ppb,pmm,mmb,pbb,mbb,pmb), cast seal heroFx per recipe, Runes talent icons by TAL_SLOTS index. Tests a11-ses68 + updated story-motion-art/voice count 484/talent-icons.

## Delivery: v8.1.66 — story voice skip + Cocoa feet fire (owner)

Motion-comic shots: VoiceActing.play refuses while busy, so tapping ahead silenced the next panel (1-1 last panel). Now voiceStop() before voicePlay when busy. Cocoa Titan: v8.1.61 shrank the wrong piece — bpx_cocoa_rage body aura restored (120+24·rage, centred); the feet fire ring bpx_cocoa_rage_preview is now a small ellipse at the feet (70+18·rage px wide, 0.55 height), tint/growth by rage unchanged (no longer shows full slam radius).

## Delivery: v8.1.67 — bug sweep after a real-browser smoke run (owner: hunt bugs/holes)

Playwright smoke (serve repo root, scene = __g.scene.scenes.find(x=>x.buildMenuScreen); all menu screens, GM buttons, wardrobe buy/dye, login popup, 4 heroes in stage, every objective type forced via setupWaveObjective(w,{forceType})) → 0 runtime errors. Fixed: capture/cleanAir bonus only counts after first entry (b._in); Sesame voice gap checked before stopping the current line; bonus gear box spawns at its landing spot (cue/beam stayed at centre); _popN reset per stage (leaked on scene.restart); cosEnsure queues callers while loading; Mochi Pass mochiPass.left caps 30 claims; login30 day number/amount legible, preview button text; GM tap zone 40×40 (no overlap with Reset progress); GM_ENABLED auto: only *.github.io or localhost:port (bundled app https://localhost = off). Known holes (not fixed, need a server): local save editable, device clock skips daily gates, window.MochiBilling spoofable, leaderboard scores client-sent (SQL now has sanity CHECKs), Supabase project paused.

## Delivery: v8.1.68 — Wardrobe redesign (owner: match other screens, no overlap, make people want to buy)

buildWardrobe rewritten: showcase panel (sh=31% H, 170–270) with hero (card_<c> via lobbyHeroWarp, wardHero) wearing equipped + previewed item via lobbyCos(x,foot,hh,ov,scr); tap card = try on (_cosPrev, replaces Tap-again _cosPend), cosEnsurePrev lazy-loads the previewed texture; thread pill + → Thread shop; Collection n/28; 7 slot tabs in one row (dot = equipped); cards with WEARING/OWNED tag, price pill; wardBar bottom: Buy & Wear / Need more + Get Thread / Wear-Take off + Dye. Checked 390×844 and 360×640, 0 errors.

## Delivery: v8.1.69 — cosmetic anchors per hero (owner: cosmetics look stuck-on; step 1 of 3)

cosAnchor(x,footY,hh) from LOBBY_FACE (head centre/top, back = 30% head→feet, feet = f[3]); wings at back, halo just above head top, pet beside shoulder, ring/trail at real feet (Cocoa no longer floats). cosAttach + cosFollow: lobbyHeroWarp upd moves attached cosmetics with breathe/sway/hop/spin (pet/halo bob via phase). Next steps discussed with owner: full-body skins art order, then paper-doll pilot on Momo.

## Delivery: v8.1.70 — Sweep + Mochi Patrol (worker players) + Skins code ahead of order 69

Sweep: sweepRecord(si,sugar) on stage clear keeps best real Sugar (d.sweepRef); 3-star stages show ⚡ Sweep on stage cards → 50% Sugar + 50% EXP, SWEEP_DAY=5/day. Mochi Patrol (gActivity row, FEATURE_OPEN patrol:3): buildPatrol, rate 40%/min of best clear over 8-min run, PATROL_DAY_MIN=240, ticks only while screen visible (dt cap 2s), loop fps 15 (patrolFps), Dim screen, auto-collect on leave. Skins: COS_RETIRED wings/halo/aura (refund once, refund69), COS_SLOTS skin/pet/trail/dash/pop, SKINS 6 (art keys <base>__<tag>, Cos.skinReady needs ASSET_IMAGES card_<hero>__<tag>, else "Coming soon"), skinKey/skinLoad for card/roster, skinSwap renames char_<hero>* textures in stage + skinFixAnims, runArtKeys loads only worn skin; HD pets cos_pet_*_hd used when registered. Tests: wardrobe, worker-play.

## Delivery: v8.1.71 — bottom tab bar on new screens (owner: same bug as before)

Screen builders called directly (button rebuilds) skip buildMenuScreen's nav bar unless listed in NAV_WRAP (v8.0.1 wrapper navWrapBuild). Added buildWardrobe, buildPatrol, buildRanking, buildGm, buildHeroes, buildStoryBook. **Every new top-level screen builder must be added to NAV_WRAP** (wardrobe test checks the new ones).

## Delivery: v8.1.72 — tutorial control reveal + Momo Unique bloom removed (owner)

coachControls(): during Ruby coach, Dash group hidden until step 'dash', Unique group (+Flicker) until step 'unique'; called in _coachNext, tickTutorialCoach, _coachFinish (restore). Momo berryRebound no longer calls healAura (growth_unlock flower bloom) — keeps revive sfx; Cocoa regen still uses healAura. Test: coach-controls.

## Delivery: v8.1.73 — order 69 partial wire (7 delivered files)

scripts/pack-skins69.py packs MANIFEST `delivered` only → assets/art/cosmetics: cos_pet_*_hd (256×6, ASSET_FX, used by lobbyCos sp() without upscaling), skin_icons69 (6×256 card portraits), skin_banner69 (ASSET_IMAGES, Wardrobe showcase on Skins tab with no preview). 61 hero candidates (cards/roster/49 sheets) are NOT accepted by the art side yet → skins stay "Coming soon"; when delivered, register card_<hero>__<tag>, roster_<hero>__<tag>, char_*__<tag> (same frame sizes) and skins go on sale automatically.

## Delivery: v8.1.74 — hands-on healing lesson + lighter deploys (owner)

Ruby coach: 'hp' stays the voiced card (introOnly, vo_ruby_tut_hp); new step 'heal' → coachHurt() HP 35% + one Heal Mochi 170px right (bypasses story heart budget), spot 'heal', _coachHeals counted in collectHeal, say = vo_ruby_tip_heal, timeout 30s (a test locks _coachNext intro cards to introOnly). Deploy fixes after 3 Pages timeouts: 42 menu PNGs moved from assets/incoming/menu_* to assets/art/menu_screens|menu_stage_cards WebP (41 MB → 4.7 MB, scripts/pack-menu-incoming.py; regexes UI_ART_RE/MENU_ONLY_RE/LAZY_MENU_ART_RE got `art\/menu_(?:screens|stage_cards)\/`); pages.yml push trigger = deploy branch only (session-branch pushes no longer cancel deploys), checkout sparse (skips candidates/donors/gif/jpg/preview/lobby_hero_motion in assets/incoming — none read by tests) with 15-min timeout. **Game code must not load from assets/incoming/.**

## Delivery: v8.1.75 — loot feel + replay bounties (owner)

lootHold(g,ms): mission burst items (sugar, currency, bonus gear) held 1.9s (collectLoot + tickLootMagnet skip), then `_vac` pulls from any range at ≥620px/s. rareLootPillar() from spawnDropBeam: gear rare/epic/legend pillars (legend + ground rings + chime), cleared by hidePickupCue. Replay (usesReplaySurvival) had no objectives → replayBountyTick: every ~50–70s (first at 22s) a 45s Bounty from the stage pool minus survive/fill via setupWaveObjective(forceType); completeWaveObjective branch: Sugar 10+3·si (+bonus goal), missionLootBurst, meter +8%; miss = no penalty; renderReplayProgress paused while active. bigFoeLoot: mini = Sugar fountain (10+3·si) + 1–2 held gear boxes min Rare (replaces 25% chance; not in Boss Rush); boss (story/replay, not rush/recipe/rift/delve) = +2 run boxes (3 at si%5===4, epic 12%+3%/stage) + Sugar 25+6·si. Test: loot-feel. Sesame `vo_sesame_unlock` line approved by owner.

## Delivery: v8.1.76 — mission pools + loot scaling by chapter (owner)

STAGES[5..14].objectives: no 'survive' (Ch1 keeps it via default pool/lessons); purge/capture fill the gap (6 cleanAir+capture, 7 defendNectar+purge, 8 seasonCycle+capture, 9 breakRoots+purge, 10–14 hunt/purge/capture). setupWaveObjective: Hunt once per stage (_huntUsed reset in startStage; planned lessons count; forceType/bounties exempt). bigFoeLoot by chapter ch=floor(si/5): mini Sugar [4+si, 8+2si, 10+3si], boxes Ch1 30% one / Ch2 one / Ch3 one-two min Rare; boss extra run boxes [end?1:0, end?2:1, end?3:2] (Ch1 rare only), Sugar [8+2si, 15+4si, 25+6si]. Owner: Ch3 signature missions on hold — research other games first.

## Delivery: v8.1.77 — missions round 1 (owner plan: round 1 of 4)

objectivePosition(i,n): n<=1 now uses a random base angle (was always angle 0 = right → Clean Air drifted right). cleanAirPreview: dashed path current→target→next + ghost rings (c.nx/c.ny chosen one step ahead; _cleanAirPath cleared with zone). Capture: r0 140 (was 110), grows +240 (was +120), captureKillBonus +0.5s per kill inside (+2 elite/mini), progress never drops (owner). Defend Nectar: no 1/3 max-HP loss — lost flower = bonus fail + timer −20%; heal near 18/s. Survive: surviveSupply drops a crate at 30%/65% of the timer → Sugar 3+1.2·si pieces (noHold, must walk) + 50% heart. Hunt: last target (progress = target−1) = Stalker Captain (hp ×3.2, scale .64, gold tint) → held gear box. Next: round 2 = five Ch3 signature missions (Seed Rift, Shake Trees, Mirror Path, Vault Altar, Last Light), round 3 = Escort speed-up, Clean Air bonus bubbles, Seasonal pickup/shrine choice, Roots guardians/pulse, opt-in start + Overcharge; round 4 = art orders.

## Delivery: v8.1.78 — missions round 2: Chapter 3 signature missions (placeholder visuals)

SIG_MISSIONS seedRift/shakeTrees/mirrorPath/vaultAltar/lastLight → STAGES 10–14 objectives ['hunt',sig,capture|purge]. Generic layer: this._sig {type,objs} created in sigSetup (from setupWaveObjective), sigTick (from tickWaveObjective), sigOnKill (killEnemy), sigClear (clearWaveObjective); visuals = graphics + emoji via sigText (art order in round 4). seedRift: kills inside a shrinking rift (16s life, +1.5s/kill, collapses → moves, bonus lost), target 18+. shakeTrees: 3 trees, stand 1.8s, 66% fruit burst (noHold) / 34% ambush. mirrorPath: charge 3 mirrors 2.4s each → crystal blast R520 (60+18·si, ×3 normal). vaultAltar: walk onto one of 3 pacts (Double Swarm ×1.5 / Elite Pack ×1.7 / No Hearts ×1.9, dropHeal blocked) → survive 30s, reward bonus × mult + held gear box. lastLight: 3 lanterns (220hp, drained by nearby foes, rekindle 16/s near), all out = timer −30% + relight. objNodeG not cleared for SIG types. Test: sig-missions.
