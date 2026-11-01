# 🔢 Version line

Now on the 8.0.x line (owner skipped 7.9.99/100). Next release = 8.0.90, … Fetch the vampire branch first; if it already has a higher 8.0.x, take the next patch.

# Latest delivery: v8.0.89 — 8 new build-targeted Relics (owner: more variety, some builds want them)

RELICS +8 (22 total) with for (card hint '👍 …') and paths (rollRelicChoices weight ×1.8 when basicAttack.path matches): heavydough (+30% dmg, cdMul×1.2), sugarrush (−15% dmg, cdMul×.8), frostcandy (+30% vs frozen/chill/Brittle), copperwhisk (+30% vs Tempest shock/Static Shock), longspoon (+25% >350px), crowdcrush (+25% <160px), twinbake (Unique +40% via _mxSrc 'unique', uniqueCdMul×.85), giantslayer (+25% elite/mini/boss, −10% others). Synergies Deadeye (heavydough+longspoon → +50%), Frenzy (sugarrush+crowdcrush → +50%), Deep Freeze (frostcandy+chill → +60%). Hook: damage() RL block → relicDmg89(e,RL); gain effects in gainRelic. No art yet (emoji fallback; relic_<key> icons can be ordered). Tests: new relics-89; damage hash in tests/fixtures/taro-t5-resolvers.json updated. Sesame not targeted. Owner phone check pending.

# Previous delivery: v8.0.88 — Taro Sentry: 1 sentry + Extra Sentry card, Reserve Cell = fire rate (owner)

taroSwarmProfile tempest: sentries=min(TARO_SENTRY_MAX 3, 1+rank surge+stormcaller 1+evolved 1); fire=1+.10·min(6,base.arc) → pulse=max(.3,unitC·.62/fire); nodeLife fixed 5 (was 5+arc·.35). castTaroSentry keeps f.sentries (Overdrive Unique still fills to 3 temporarily). TARO_PROGRESSION.tempest: arc 'Reserve Cell — Sentries fire 10% faster', surge 'Extra Sentry +1 sentry (max 3)', chainlord/stormcaller/evolution texts updated; path desc. Test: taro-swarm (1 sentry start, surge 2 → 3, fire/pulse). Owner phone check pending (balance feel at Lv1).

# ⚠️ DEPLOY BRANCH — read first

Use the project skill `.claude/skills/release/SKILL.md` (`/release`) for every version: it holds the full bump → checks → deploy → verify order below.

The live game (GitHub Pages / APK live update) deploys ONLY from `claude/vampire-survival-mobile-game-yo9e8w`. Pushes to any other branch (session branches like `ccr-*` or `claude/*`) run the Pages workflow but it fails, so the game stays on the old version. Owner has approved this permanently: after committing, always push to the vampire branch too (`git push origin HEAD:claude/vampire-survival-mobile-game-yo9e8w`, fast-forward only; if it is not an ancestor, merge it in first, never force). Push the vampire branch ALONE (not in the same moment as the session branch): both runs share the Pages concurrency group, so the session-branch run cancels the vampire deploy (v7.0.0/7.0.1 got cancelled this way). Then confirm the "Deploy Web (GitHub Pages)" run for that branch succeeded and the in-game version matches `GAME_VERSION`.

# 🧭 Model routing (owner 23 Oct) — pick the cheapest model that fits

Owner approved delegating simple work to cheaper subagents (`.claude/agents/`). The main session (Opus) plans, decides, reviews diffs, bumps GAME_VERSION/CHANGELOG, commits and deploys.
- **quick (Haiku):** look-ups in game.js, "did art arrive?", Actions run status, file lists, small exact doc edits (CLAUDE.md blocks, README rows).
- **builder (Sonnet):** clear code changes where what/where is already known — given numbers, text rewording, wiring delivered art by an existing pack script/pattern, copy-an-existing-UI-piece, art order docs from an outline.
- **Main (Opus) itself:** design and owner questions, unclear bugs, balance, new mechanics, multi-system features, final review.
- Skip delegation when the job is one or two tool calls (spawning costs more than doing it). Always read the subagent's diff (`git diff`) before committing.

# 🚧 HEROES IN DEVELOPMENT — Sesame (owner 21 Oct) — read first

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
- อาร์ตที่รอส่ง: 35 Yuzu Orchard, 36 Ruby (โค้ดใช้ภาพชั่วคราว), 49 กรอบโปรไฟล์, 50–54 เมนู (ผูกแล้ว v8.0.34 บางส่วน — ดู README) · เสียงชุด A04 เพลงรอสิทธิ์ Music Generation
- รอ QA บนมือถือของเจ้าของ: อาร์ตที่ผูกแล้วทุกชุด (ภาพ/FPS), บาลานซ์ Yuzu/Seedlings, Citrus Command, Rewards hub
- Sesame Mirror Network: ขั้น 1 เสร็จ v7.9.40 · ขั้น 2 (สาย + Glass World) รอเจ้าของเริ่ม
- เจ้าของ: ไม่ต้องจำลองเล่น headless เพื่อจูนบาลานซ์ และไม่ต้องถ่ายภาพหน้าจอตรวจ UI — เจ้าของตรวจบนมือถือเอง (headless หาบั๊กได้)

## 6. เอกสาร
`docs/PLAYTEST_CASES.md` (feedback/บั๊กจากเครื่องจริง) · `docs/LANDSCAPE_FULLSCREEN_UI_KNOWLEDGE.md` · GDD/แผนรวมเป็น artifact เดิม (แก้ให้ publish ทับ)

## 7. เทส / build
`npm run check` ก่อน publish เสมอ · ลำดับปล่อยเวอร์ชันอยู่ใน skill release · เทสในเครื่อง `npx serve .` · เจ้าของทดสอบ flow/บาลานซ์/FPS บนมือถือเอง

## 8. คอนเวนชัน
- ทุกเวอร์ชัน: bump `GAME_VERSION` + CHANGELOG + บล็อก Latest delivery (ย้ายบล็อกเก่าสุดไป CLAUDE_HISTORY ให้เหลือ 2 บล็อก)
- commit ภาษาอังกฤษ ไม่ใส่ชื่อรุ่นโมเดล · คุยกับเจ้าของภาษาไทย
- ข้อความในเกมเป็นภาษาอังกฤษล้วน (comment ไทยได้) · ใช้ `’` ใน single-quoted literal · ห้ามอักษรไทยใน string
