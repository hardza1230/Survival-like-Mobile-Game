# 🔢 Version line

Now on the 8.1.x line: skipped patch99/100 after8.0.98 following the existing owner preference. Next release =8.1.12; fetch the deploy branch first.

# Latest delivery: v8.1.11 — smaller projectiles and clearer Taro fields (owner)

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

## 1. โปรเจกต์
Mochi Mayhem — เกมมือถือ survival-like ธีมโมจิน่ารัก เป้าหมาย Google Play · เจ้าของทำงานบนมือถือ เป็นผู้กำกับ ให้ AI เขียนโค้ดทั้งหมด

## 2. การตัดสินใจที่ล็อกแล้ว (อย่าเปลี่ยนโดยไม่ถาม)
- **คุมธีมโดยรักษาเกมเดิม (27 ต.ค.):** เก็บโครงหน้า ตำแหน่งปุ่ม เส้นทาง ระบบ อาร์ตเดิม · ปรับแค่ฟอนต์/สีแผง/ขอบ/สถานะปุ่มให้เข้าชุด · ImageGen เฉพาะชิ้นที่ขาด · ภาพ42มุมใน docs/design/unified_theme เป็นแค่ภาพสำรวจ · เปลี่ยนโครงหน้า/ระบบต้องมีคำขอจากเจ้าของ
- Phaser 3 เว็บ → Capacitor → APK/AAB → Play Store
- **กฎเหล็ก: ยิ่งยาก รางวัลยิ่งดี** (Story ระดับเดียว · endgame ยากตามความลึก Delve `delveLoot` · Boss Rush ซ่อน)
- ผู้เล่นเป้าหมายแบบผสม: ต้นเกมง่ายน่ารัก · ระบบลึกค่อยเปิดหลัง Chapter 2–3 · ห้ามเพิ่มภาระช่วงต้น
- เสียง: ใช้ ElevenLabs ตามใบสั่งเสียง (v8.0.38–39 เจ้าของสั่ง ห้ามใช้เสียงสร้างด้วยโค้ด/Runway แทน)

## 3. โครงไฟล์
- `index.html` (โหลด phaser + game.js) · `game.js` = โค้ดเกมทั้งหมด (~21k บรรทัด) · `phaser.min.js` 3.80.1
- `assets/` รูป/เสียงจริง · คีย์อยู่ใน `ASSET_IMAGES` / `ASSET_SHEETS` / `ASSET_FX` / `ASSET_AUDIO` / `TEMPLE_UI` (URL ต้องเป็น literal `'assets/…'` เพราะ build-www คัดลอกเฉพาะที่เจอ) · อาร์ตเข้า `assets/incoming/<batch>/` → pack script `scripts/pack-*.py` → `assets/art/<batch>/` (ใช้ skill wire-art)
- โหลดอาร์ตใหม่แบบ lazy เสมอ (stage/menu/hero) ห้าม boot — งบ GPU บูตเต็ม ~300 MB
- `docs/art_orders/` ใบสั่งอาร์ต (README = ตารางสถานะ) · `docs/audio_orders/` ใบสั่งเสียง · `docs/LORE.md`/`STORY_CANON.md` เนื้อเรื่อง · `docs/HANDOFF_NEXT_AI.md`
- `tests/*.cjs` (method-extract vm tests; เมธอดใหม่ต้องเพิ่มในรายการ extract ของเทสที่เกี่ยว) · `npm run check` รวมทุกเทส
- Build: `scripts/build-www.mjs` → www/ (esbuild minify) · `.github/workflows/pages.yml` deploy GitHub Pages (live update ของ debug APK ผ่าน `server.url`) · `android.yml` debug APK · `release-aab.yml` signed AAB (`docs/RELEASE_SIGNING.md`)
- โน้ตเทคนิคยุคแรก (VFX flipbook, การตัด sprite, raw assets) อยู่ใน `docs/CLAUDE_HISTORY.md`

## 4. สถานะปัจจุบัน
- ดูเวอร์ชันที่ `GAME_VERSION` + บล็อก Latest delivery ด้านบน · ประวัติทุกเวอร์ชัน `docs/CLAUDE_HISTORY.md`
- ระบบหลักครบ: Story 3 Chapter 15 ด่าน → Mochi Delve/Pinnacle, Temple Weave/Depths/Rank Rewards, Gear+Merge (Common→Divine)+Forge (random mods, Twist Cream), Talent ราย Build, ฮีโร่ 6 ตัว ×3 Build (Sesame WIP), Rewards hub (Login/Daily/Awards)

### บั๊กที่เคยเจอ (กันพลาดซ้ำ)
- Scale.RESIZE คืน logical CSS px แล้ว — อย่าคูณ/หาร DPR เอง ใช้ `config.resolution=RENDER_DPR`
- scrollFactor(0) ไม่รับ camera zoom → UI ใช้ sf1 · `camera.ignore(group)` เป็น snapshot → ต้อง `this.camWorld(obj)` ทุกครั้งที่ spawn
- shape `setInteractive()` กดไม่ติดบนมือถือ → ใช้ tap zone ตรวจพิกัดเอง (`_zone` / `tapZones`)
- pool เต็ม → `getFirstDead` คืน null → ต้อง guard ทุกครั้ง
- `physics.world.timeScale` กลับด้าน (มาก = ช้า): gameSpeed ใช้ `1/s`, hitStop ใช้ค่ามาก
- Graphics ใน vm test stub อาจไม่มี `fillRect`/`setVisible`/`once` → ใช้ optional call หรือ property

## 5. ถัดไป
- Simple Forge เสร็จ v8.0.83 รอเจ้าของตรวจบนมือถือ (ราคา/ความรู้สึก 3 การ์ด)
- ใบสั่ง 62 สถานะติดตัว ผูกแล้ว v8.0.85 · รอ QA มือถือ
- อาร์ต 61 ฉากหลังล้มบอส ผูกแล้ว v8.0.84 · รอ QA มือถือ
- ใบสั่ง 63 ผูกครบ 8 แล้ว v8.0.95 · รอ QA มือถือ · A06 เสียง 28 ผูกแล้ว v8.0.91
- อาร์ตที่รอส่ง: 35 Yuzu Orchard, 36 Ruby (โค้ดใช้ภาพชั่วคราว), 49 กรอบโปรไฟล์, 50–54 เมนู (ผูกแล้ว v8.0.34 บางส่วน — ดู README) · เสียงชุด A04 เพลงรอสิทธิ์ Music Generation
- รอ QA บนมือถือของเจ้าของ: อาร์ตที่ผูกแล้วทุกชุด (ภาพ/FPS), บาลานซ์ Yuzu/Seedlings, Citrus Command, Rewards hub
- Sesame: เจ้าของอนุมัติ Rune Invoker ไม่มีสาย (2 Nov2026) · ดู `docs/design/SESAME_RUNE_INVOKER.md` · 10 เวท/การ์ดลูกแก้ว/อาร์ตและเสียงใหม่ v8.1.1 รอมือถือ · ถัดไปบาลานซ์/ความถนัดและ Talent ถาวร; ไม่ทำ Mirror Network ขั้น 2 ตามแผนเก่า
- เจ้าของ: ไม่ต้องจำลองเล่น headless เพื่อจูนบาลานซ์ และไม่ต้องถ่ายภาพหน้าจอตรวจ UI — เจ้าของตรวจบนมือถือเอง (headless หาบั๊กได้)

## 6. เอกสาร
`docs/PLAYTEST_CASES.md` (feedback/บั๊กจากเครื่องจริง) · `docs/LANDSCAPE_FULLSCREEN_UI_KNOWLEDGE.md` · GDD/แผนรวมเป็น artifact เดิม (แก้ให้ publish ทับ)

## 7. เทส / build
`npm run check` ก่อน publish เสมอ · ลำดับปล่อยเวอร์ชันอยู่ใน skill release · เทสในเครื่อง `npx serve .` · เจ้าของทดสอบ flow/บาลานซ์/FPS บนมือถือเอง

## 8. คอนเวนชัน
- ทุกเวอร์ชัน: bump `GAME_VERSION` + CHANGELOG + บล็อก Latest delivery (ย้ายบล็อกเก่าสุดไป CLAUDE_HISTORY ให้เหลือ 2 บล็อก)
- commit ภาษาอังกฤษ ไม่ใส่ชื่อรุ่นโมเดล · คุยกับเจ้าของภาษาไทย
- ข้อความในเกมเป็นภาษาอังกฤษล้วน (comment ไทยได้) · ใช้ `’` ใน single-quoted literal · ห้ามอักษรไทยใน string
