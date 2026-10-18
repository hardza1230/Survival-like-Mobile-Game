# ⚠️ DEPLOY BRANCH — read first

The live game (GitHub Pages / APK live update) deploys ONLY from `claude/vampire-survival-mobile-game-yo9e8w`. Pushes to any other branch (session branches like `ccr-*` or `claude/*`) run the Pages workflow but it fails, so the game stays on the old version. Owner has approved this permanently: after committing, always push to the vampire branch too (`git push origin HEAD:claude/vampire-survival-mobile-game-yo9e8w`, fast-forward only; if it is not an ancestor, merge it in first, never force). Push the vampire branch ALONE (not in the same moment as the session branch): both runs share the Pages concurrency group, so the session-branch run cancels the vampire deploy (v7.0.0/7.0.1 got cancelled this way). Then confirm the "Deploy Web (GitHub Pages)" run for that branch succeeded and the in-game version matches `GAME_VERSION`.

# Art delivery 18 — Taro Spark + Ball Lightning

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

# Latest delivery: v7.8.70 — 360×780 UI audit fixes

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
  **APK สำหรับทดสอบเป็น debug** — workflow `release-aab.yml` มี signed AAB (`bundleRelease`) แล้ว ใช้ keystore/secrets ตาม `docs/RELEASE_SIGNING.md`; การตั้งค่าจริงและ signed release ยังไม่ยืนยัน
- **Live update (แก้แล้วไม่ต้องลง APK ใหม่):** `.github/workflows/pages.yml` deploy www → **GitHub Pages**
  + `capacitor.config.json` `server.url` = https://hardza1230.github.io/Survival-like-Mobile-Game/
  ⇒ Debug APK โหลดจาก Pages หลัง deploy สำเร็จ; การเปลี่ยน native shell อาจต้องลง APK ใหม่ · Release AAB ลบ server.url และ bundle เกมในแอป ไม่ใช้ Pages live update · เว็บมี service worker cache จึงต้องตรวจเวอร์ชันจริง
  · ต้องเปิด Pages ครั้งแรก: Settings→Pages→Source: GitHub Actions
  · **หมายเหตุ:** เพราะ server.url ชี้ Pages → APK ตัวใหม่ต้อง build หลังตั้ง Pages (ตัว build แรกสุดยังเป็นออฟไลน์)


## 4. สถานะปัจจุบัน (v7.8.65 · 18 ต.ค. 2026)
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
- **ท่าบอส (18 ต.ค. ตรวจโค้ดแล้ว):** บอสหลัก C1–C2 ทั้ง 10 ตัวมีชุดท่าเฉพาะตัวแล้ว · **บอส C3 ทั้ง 5 ตัว + Pinnacle ยังใช้ชุดท่ากลาง** (slam/radial/aimed/charge/spiral/trap) แค่เปลี่ยนท่าโพส · มินิบอสเฉพาะตัวมี 5 ตัว (C1-1, C2-2…C2-5) ที่เหลือ 9 ตัว (C1-2…C1-5, C2-1, C3 ทั้ง 5) ใช้ชุดกลาง · Delve Warden/Candlewick มีท่าเฉพาะ · ระบบกลางกลไกสนาม T1–T8 + Counter Object (`docs/BOSS_ARENA_MECHANICS.md`) **ยังไม่ได้เริ่ม** · Candlewick ในแผน (เดินจุดเทียน) ขัดกับของจริง (เดินดับเทียน) ต้องให้เจ้าของเลือก
- **ใบสั่งอาร์ต 22 (18 ต.ค.):** เอฟเฟกต์ท่าบอส C1–C2 59 ไฟล์ — บอส C1–C2 มีท่าเฉพาะแล้วแต่ใช้ภาพกลาง (vfx_telegraph/fx_bossnova/vfx_cream_ring/vfx_line ย้อมสี) · ส่งอาร์ตครบ 59 PNG32 / 278 เฟรมที่ `assets/incoming/boss_vfx_c1_c2/` พร้อม manifest/prompts/QA · **ผูกแล้ว v7.8.57** (59/59: `assets/art/boss_vfx/`, `scripts/pack-boss-vfx-c1-c2.py`, helper `bossKit/kitSize/kitLane/bossSig/bossSigHold`) · รอ QA ภาพ/FPS บนมือถือ
- **ใบสั่งอาร์ต 23 (18 ต.ค.) — ผูกแล้ว v7.8.59, รอ QA มือถือ:** หน้าเลือกการ์ด/Level Up 19 ไฟล์ (`docs/art_orders/23_LEVELUP_CARD_UI.md`) — ตอนนี้วาดด้วยโค้ดล้วน · รออาร์ตส่ง `assets/incoming/levelup_cards_ui/` · โน้ตผูกโค้ดอยู่ท้ายใบสั่ง (`drawReadableChoiceCard`/`highlightCard`/`drawHeldBar`/`openLevelUp`)
- **ใบสั่งอาร์ต 24 (18 ต.ค.) — ผูกแล้ว v7.8.59, รอ QA มือถือ:** หน้าหยุดเกม 19 ไฟล์ ตามภาพอ้างอิงเจ้าของ (`docs/art_orders/24_PAUSE_SCREEN_UI.md`, ref `docs/art_orders/ref/24_pause_ref.webp`) · รออาร์ตส่ง `assets/incoming/pause_ui/` · ผูกที่ `buildPause`
- **ใบสั่งอาร์ต 25 (18 ต.ค.) — ผูกแล้ว v7.8.59, รอ QA มือถือ:** หน้าเมนูหลักเคลื่อนไหว 20 ไฟล์ + 5 ทางเลือก (`docs/art_orders/25_HUB_MENU_MOTION.md`) — แยก `hub_ui_background` เป็นชั้น + โมโม่หุ่นเชิด (pivot ใน MANIFEST) + VFX · ระวังงบบูต GPU (cocoa 285/300 MB) · รออาร์ตส่ง `assets/incoming/hub_motion/` · ผูกที่ `buildHub`/`startHubAmbience`
- **ใบสั่งอาร์ต 26 (18 ต.ค.):** ม่านสลับหน้าเมนู 5 + ไอคอนการ์ด 77 (Relic/Modifier/Fusion/Mutation/Evolution/Trade-off/Infusion/Cocoa basic · ไม่รวม Yuzu) · `docs/art_orders/26_TRANSITION_AND_CARD_ICONS.md` · รออาร์ตส่ง `assets/incoming/transition_card_icons/`
- Yuzu ทำใหม่: รอเจ้าของเลือกชุด build แล้วเขียนเอกสารออกแบบ + ใบสั่งอาร์ต
- รับ feedback หน้า Forge ใหม่ · Kitchen upkeep · Story C2–C3 · item mods · Delve
- งานค้างระยะยาว: มือถือ visual/FPS QA ของอาร์ตที่ส่งแล้ว (`docs/art_orders/16_CURRENT_ART_BACKLOG.md`), Play Store (พักไว้)
- **เจ้าของ: ไม่ต้องจำลองเล่น headless เพื่อจูนบาลานซ์ เจ้าของเทสเอง** (จำลองเพื่อหาบั๊กค้างได้)

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
