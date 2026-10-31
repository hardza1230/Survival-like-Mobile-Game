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

