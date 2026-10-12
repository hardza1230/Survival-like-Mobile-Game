# ⚠️ DEPLOY BRANCH — read first

The live game (GitHub Pages / APK live update) deploys ONLY from `claude/vampire-survival-mobile-game-yo9e8w`. Pushes to any other branch (session branches like `ccr-*` or `claude/*`) run the Pages workflow but it fails, so the game stays on the old version. Owner has approved this permanently: after committing, always push to the vampire branch too (`git push origin HEAD:claude/vampire-survival-mobile-game-yo9e8w`, fast-forward only; if it is not an ancestor, merge it in first, never force). Push the vampire branch ALONE (not in the same moment as the session branch): both runs share the Pages concurrency group, so the session-branch run cancels the vampire deploy (v7.0.0/7.0.1 got cancelled this way). Then confirm the "Deploy Web (GitHub Pages)" run for that branch succeeded and the in-game version matches `GAME_VERSION`.

# Latest delivery: v7.7.19 — Approved painted main menu

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

# Older history

Older delivery notes and the old "สถานะ" log (v1.x–v6.55) are archived verbatim in `docs/CLAUDE_HISTORY.md`. Search there (grep a function or version) when you need why something was done. When you finish work: add a new "# Latest delivery" block here, rename the previous one to "# Previous delivery", and keep only ~6 recent blocks in this file (move older ones to the end of docs/CLAUDE_HISTORY.md).

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
  **ยังเป็น debug APK** — ขึ้นสโตร์จริงต้องเพิ่ม keystore + signed release AAB (`bundleRelease`)
- **Live update (แก้แล้วไม่ต้องลง APK ใหม่):** `.github/workflows/pages.yml` deploy www → **GitHub Pages**
  + `capacitor.config.json` `server.url` = https://hardza1230.github.io/Survival-like-Mobile-Game/
  ⇒ APK เป็นตัวหุ้มโหลดจาก Pages ทุกครั้งที่เปิด · push โค้ด = แอปอัปเดตเอง (ต้องต่อเน็ต, ออฟไลน์ยังไม่ได้)
  · ต้องเปิด Pages ครั้งแรก: Settings→Pages→Source: GitHub Actions
  · **หมายเหตุ:** เพราะ server.url ชี้ Pages → APK ตัวใหม่ต้อง build หลังตั้ง Pages (ตัว build แรกสุดยังเป็นออฟไลน์)


## 4. สถานะปัจจุบัน (v7.7.19 · 12 ต.ค. 2026)
- เวอร์ชันล่าสุดดูที่ `GAME_VERSION` ใน game.js และบล็อก Latest delivery ด้านบน
- ระบบหลักครบ: Story 3 Chapter (15 ด่าน) → Endgame Mochi Delve (แผนที่ seed ต่อความลึก, บอส Delve, Pinnacle), Boss Rush, Kitchen Recipe (WHEN▸DO▸TWIST มีราคา HP/AP), Temple Weave/Depths/Rank Perks, Gear (implicit + mod สูงสุด 3 บรรทัด + Play mods, Affix Forge, Bazaar), Talent ราย Build Path, ตัวละคร 6 ตัว (momo/mint/cocoa/taro/sesame/yuzu) แต่ละตัว 3 Build Path
- ส่วนใหญ่ของ v6.5x–v6.6x ยังรอเจ้าของเล่นทดสอบบนมือถือจริง (balance/feel/FPS)
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
- **เสร็จแล้ว:** แผนตัด/รวมระบบ `docs/SYSTEM_CONSOLIDATION_PLAN.md` (A–F ตรวจสถานะแล้ว; คงส่วนที่ runtime ยังใช้) · **เจ้าของ: ไม่ต้องจำลองเล่น headless เจ้าของเทสเอง**
- รอ feedback เจ้าของจากการเล่นจริง: Kitchen upkeep (v6.69), Story C2–C3 buff/Temple cost (v6.68), item mods (v6.67), Delve
- งานค้างระยะยาว: มือถือ visual/FPS QA ของอาร์ตที่ส่งแล้ว (`docs/art_orders/16_CURRENT_ART_BACKLOG.md`), Play Store (พักไว้: ลบบัญชีในแอป, store listing, keystore, closed test)
- แผน commit เก่า: `docs/COMMIT_ROADMAP.md`

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