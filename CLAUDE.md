# 🔢 Version line

Now on the 8.0.x line (owner skipped 7.9.99/100). Next release = 8.0.72, … Fetch the vampire branch first; if it already has a higher 8.0.x, take the next patch.

# Latest delivery: v8.0.71 — Rewards hub (owner: merge Daily + Login + Awards)

Lobby right side News · 🎁 Rewards (tag side_rewards, route 'rewards' → daily or achievements by _rwLast/badges), left Codex · Mail. rewardsTabs(active) draws 📅 Login (loginPopup('daily') or 'Day n claimed' toast) · 📋 Daily · 🏆 Awards (tags rw_<k>, red dots) under the header and returns its height; buildDaily/buildAchievements shift content by it. FEATURE_OPEN rewards 1, reveal targets side_rewards, daily/achievements skipped in featureReveal (new 'rewards' card instead). hasTargetBadge('rewards'). gActivity rows unchanged. tests/rewards-hub. Owner phone review pending.

# Previous delivery: v8.0.70 — Twin Seed, ad button, equip lesson, chest Thread, Weave header (owner batch)

Strawberry card id size (saves kept) Juicy Burst → Twin Seed: pre-path/path volleys +1 seed at 15%/rank (pre-path also above the 12 cap), seedPop off; Sniper charge ×(1+.1·rank). summaryAdButton: green container, scale yoyo + wiggle + shine (off with reduced motion), tag ad. questFocus spotlight no longer tap-skippable (taps during movement skipped it); its own timer ends it. Gear tutorial step 1 on Equipment: selects newest unequipped item, spotlights gear_equip only (old regex could hit a bag cell and pass the step), then d._gearTutQE → spotlight ⚡ (tag gear_best) → gearTut 2. openChest reveal shows '🧶 Thread N' pill (updates on refund). _screenBg temple header art off (shared header, veil .54); buildUpgrade/buildRankPerks fonts NunitoUI; layout/art unchanged. tests: stage-summary-layout, taro-foundation castSkill strip, momo fixture. Owner phone review pending.

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
- ระบบหลักครบ: Story 3 Chapter 15 ด่าน → Mochi Delve/Pinnacle, Temple Weave/Depths/Rank Rewards, Gear+Merge+Forge Points, Talent ราย Build, ฮีโร่ 6 ตัว ×3 Build (Sesame WIP), Rewards hub (Login/Daily/Awards)

### บั๊กที่เคยเจอ (กันพลาดซ้ำ)
- Scale.RESIZE คืน logical CSS px แล้ว — อย่าคูณ/หาร DPR เอง ใช้ `config.resolution=RENDER_DPR`
- scrollFactor(0) ไม่รับ camera zoom → UI ใช้ sf1 · `camera.ignore(group)` เป็น snapshot → ต้อง `this.camWorld(obj)` ทุกครั้งที่ spawn
- shape `setInteractive()` กดไม่ติดบนมือถือ → ใช้ tap zone ตรวจพิกัดเอง (`_zone` / `tapZones`)
- pool เต็ม → `getFirstDead` คืน null → ต้อง guard ทุกครั้ง
- `physics.world.timeScale` กลับด้าน (มาก = ช้า): gameSpeed ใช้ `1/s`, hitStop ใช้ค่ามาก
- Graphics ใน vm test stub อาจไม่มี `fillRect`/`setVisible`/`once` → ใช้ optional call หรือ property

## 5. ถัดไป
- v8.0.72 กระสุนบอสเฉพาะตัว (สี/รูปร่าง/ขนาด + พฤติกรรม เด้ง/แตก/ไล่/บูมเมอแรง/ตกจากฟ้า/ระเบิดหน่วง; BOSS_KITS ctx ring/fan/lane + drainBossAttack) — เจ้าของเลือกทั้งสองแบบ
- v8.0.73 motion comic หลังชนะบอส: สั้นลง เล่าเรื่องต่อเนื่องชัด ไม่ซ้ำทุกด่าน (`docs/BOSS_MOTION_COMICS.md`)
- อาร์ตที่รอส่ง: 35 Yuzu Orchard, 36 Ruby (โค้ดใช้ภาพชั่วคราว), 49 กรอบโปรไฟล์, 50–54 เมนู (ผูกแล้ว v8.0.34 บางส่วน — ดู README) · เสียงชุด A04 เพลงรอสิทธิ์ Music Generation
- รอ QA บนมือถือของเจ้าของ: อาร์ตที่ผูกแล้วทุกชุด (ภาพ/FPS), บาลานซ์ Yuzu/Seedlings, Citrus Command, Rewards hub
- Sesame Mirror Network: ขั้น 1 เสร็จ v7.9.40 · ขั้น 2 (สาย + Glass World) รอเจ้าของเริ่ม
- เจ้าของ: ไม่ต้องจำลองเล่น headless เพื่อจูนบาลานซ์ และไม่ต้องถ่ายภาพหน้าจอตรวจ UI — เจ้าของตรวจบนมือถือเอง (headless หาบั๊กได้)

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
