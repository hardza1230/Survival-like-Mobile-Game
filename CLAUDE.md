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
- **สาขา git:** `claude/vampire-survival-mobile-game-yo9e8w` (ชื่อเก่าติดมาจากธีมแวมไพร์)

## 3. โครงไฟล์
- `index.html` — หน้าเกม (โหลด phaser.min.js + game.js)
- `game.js` — โค้ดเกมทั้งหมด (คลาส Boot วาดกราฟิกด้วย **Canvas 2D** `createCanvas`, คลาส Game = ฉากเล่น)
- `phaser.min.js` — เอนจิน Phaser 3.80.1 (vendored, มาจาก npm)
- `assets/` — รูปจริง (AI/วาดมือ) โหลดแทนกราฟิกโค้ด · `ASSET_IMAGES`=รูปนิ่ง · `ASSET_SHEETS`=สไปรต์สตริปหลายเฟรม (game.js)
  · **มีแล้ว:** char_momo_sheet.png (สไปรต์ 8 เฟรม 128px `CF`: [0 idle,1 blink,2 squash,3 stretch,4 cheer,5 hurt,6 ko,7 cast])
  · Boot.preload โหลด image/spritesheet → mk() ข้ามการวาดโค้ดถ้ามีรูป (`isArtKey`) · `setCharScale()` ปรับ `_pBase`=60/frame + body radius 24 คงที่ (โชว์เท่ากราฟิกเดิม 60px) + ตั้ง `_hasFrames`
  · **อนิเมชันเฟรม (`updatePose`+`poseFlash`)**: ปกติ=ยืน+กะพริบ · พุ่ง=stretch · ลงพื้น=squash · โดนตี=hurt · เคลียร์เวฟ=cheer · ตาย=ko · กดอัลติ=cast — ทำงานทับเจลลี่สปริง (frame=ท่า, scale=ความเด้ง ไม่ตีกัน)
  · ตัด/เลือกเฟรมจากตาราง AI: `scripts/cutout_sheet.mjs SRC OUT CELL COLS ROWS "idx,idx,..."` (เลือก/เรียงช่องที่ต้องการ)
  · เพิ่มรูปใหม่: ตัดพื้นใส/ตัดสตริป (scripts/cutout.mjs, cutout_sheet.mjs) → assets/ → เติม key · build-www คัดลอก assets/ · pages.yml trigger รวม assets/**
- `LORE.md` — เนื้อเรื่องโลก Mochitopia
- `CLAUDE.md` — ไฟล์นี้
- **Build APK (Capacitor):** `package.json` + `capacitor.config.json` (appId com.mochimayhem.game, webDir www)
  + `scripts/build-www.mjs` (ประกอบ www/) + `.github/workflows/android.yml` (build บน GitHub Actions → APK artifact,
  push tag `v*` = ออก Release). โฟลเดอร์ `android/`,`www/`,`node_modules/` สร้างตอน build ไม่ commit.
  **ยังเป็น debug APK** — ขึ้นสโตร์จริงต้องเพิ่ม keystore + signed release AAB (`bundleRelease`)
- **Live update (แก้แล้วไม่ต้องลง APK ใหม่):** `.github/workflows/pages.yml` deploy www → **GitHub Pages**
  + `capacitor.config.json` `server.url` = https://hardza1230.github.io/Survival-like-Mobile-Game/
  ⇒ APK เป็นตัวหุ้มโหลดจาก Pages ทุกครั้งที่เปิด · push โค้ด = แอปอัปเดตเอง (ต้องต่อเน็ต, ออฟไลน์ยังไม่ได้)
  · ต้องเปิด Pages ครั้งแรก: Settings→Pages→Source: GitHub Actions
  · **หมายเหตุ:** เพราะ server.url ชี้ Pages → APK ตัวใหม่ต้อง build หลังตั้ง Pages (ตัว build แรกสุดยังเป็นออฟไลน์)

## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: + Skill Awaken + จอกว้างขึ้น + ออร์บสีตามค่า + พรสวรรค์เฉพาะตัว + โทนพาสเทล + โมจิเจลลี่)
เล่นได้จริงบนมือถือแล้ว ระบบที่มี:
- **Skill Awaken (ตื่นรู้):** สกิลถึง MAX (Lv6) แล้วเลเวลอัพอีก = การ์ด "⚡ ตื่นรู้" เปลี่ยนรูปแบบสกิลให้โกง (Lv7=`SKILL_AWAKEN_LV`)
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
- **บาลานซ์ (จูนล่าสุด):** ศัตรู HP ×~1.5 + scaling แรงขึ้น `(1+idx*0.55)(1+wave*0.11)` · ฝูงถล่ม (`swarm` ด่าน≥3/เวฟท้าย) ปล่อย 3 ระลอก + elite ×2 · บอส HP ×1.4 + เฟส 3
- **สกิลออโต้แคสต์ 9 อย่าง** (ใน `SKILLDEFS`): sprinkle, star(orbit), chili, thunder(ฟ้าผ่า),
  whirl(ครีมหมุน), boomer(บูมเมอแรงทะลุ), frost(แช่แข็ง), popcorn(กระจายมั่ว), bubble(ฟองไล่/homing)
  · +8 สกิลใหม่: **aura**(🌸 ออร่ารอบตัว) · **fork**(🍴 ส้อมทะลุ) · **mine**(🧁 คัพเค้กระเบิด) · **beam**(🔆 ลำแสงแนวตรง `fireBeam`) · **meteor**(🍩 โดนัทหล่น AoE `meteorStrike`) · **cloud**(☕ หมอกพิษ DoT ติ๊ก) · **rocket**(🚀 จรวดไล่เป้าระเบิด `b.explode`+`explodeAt`) · **wave**(🌊 คลื่นขยายผลัก `creamWave`) — **รวม 17 สกิล** build หลากหลาย
- **ระบบคอมโบสกิล (`COMBOS`):** มีสกิลคู่ครบ = ปลดโบนัส (ธง `this.comboFlags` อ่านตอน cast + แบนเนอร์)
  storm(thunder+frost), firestorm(chili+whirl), ricochet(sprinkle+boomer), fizz(popcorn+bubble) · `checkCombos()`
- **Sugar + Save (`Save` → localStorage 'mochi_save'):** เก็บ sugar/unlockedStage/upgrades/gear
  เก็บ Sugar จากการฆ่า (บอส40/มินิ18/elite4/ธรรมดา1) ฝากตอนจบด่าน+ตาย
- **เมนูฮับ + ซับสกรีน (tap-zone hit-test, ไม่ใช้ setInteractive):** `buildHub/buildStageSelect/buildUpgrade/buildGear`
  · `this.menuScreen`=hub/stage/upgrade/gear, `handleTap()`+`_zone()`+`_rowBtn()`+`_screenBg()` (ปุ่มกลับ)
  · **เลือกด่าน:** ปลดตาม `Save.unlockedStage` · **อัพเกรดถาวร (`UPGRADES`):** hp/dmg/spd/magnet ซื้อด้วย Sugar
  · **ของสวมใส่ (`GEAR`):** ช่อง weapon/charm ซื้อ+สวมใส่ · ผลรวมใส่ตอน `applyMeta()` ใน startRun(idx)
- **เลเวลอัพเน้นสกิล** (พาสซีฟเป็นของเสริม) — เลือกด้วยการแตะ (hit-test เอง ไม่ใช้ setInteractive กับ shape)
- **ระบบบท (CHAPTERS):** กรุ๊ปด่านเป็น "บท" · บท 1 = 5 ด่านครัว (STAGES, เล่นได้) · บท 2-5 = ล็อค "เร็ว ๆ นี้" · `buildStageSelect`=เลือกบท → `startRun(0)` เริ่มด่าน 1 เสมอ (เอา per-stage picker ออก)
- **รีเซ็ตเซฟ (`Save.reset`):** ปุ่ม 🗑️ ในฮับ (แตะ 2 ครั้งยืนยัน `_resetConfirm`) ล้าง localStorage + คืนค่าเริ่มต้น (สำหรับเทส/แก้ account เทพเกิน) · UPGRADES ลดพลัง (hp+14/dmg+4%/spd+3% ต่อเลเวล)
- **ระบบด่าน (STAGES) แบบ Archero:** 5 โซนครัว แต่ละด่าน = เคลียร์ศัตรูเป็น "เวฟ" (`waves` ต่อด่าน)
  → กลางด่านเจอ **มินิบอส** (`miniAt`, `mini`) → จบเวฟทั้งหมดเจอ **บอสใหญ่** (`boss/bossHp/bossDmg`)
  → ล้มบอส = ผ่านด่าน (ฟื้น HP 35%) → ด่านต่อไป · ล้มบอสด่าน 5 = **ชนะเกม**
  กลไก: `startWave/spawnNormalWave/spawnMiniBoss/spawnFinalBoss/onWaveCleared/onStageClear`
  ตัวนับ `this.waveAlive` (ลดใน killEnemy) = 0 เมื่อไหร่ → เวฟถัดไป · `this.mode`= wave/mini/boss/breather/clear/summary
  เดินด่านด้วย "การเคลียร์" ไม่ใช่ตัวจับเวลาแล้ว (เอา stageTime/spawnWave ออก)
  เวฟหนักขึ้น: ปล่อยศัตรู 2 ระลอก + **elite** (isElite, สีส้ม อึด xp/sugar เยอะ) จากด่าน 2
  **ตัวบอกความคืบหน้า:** `drawWavePips()` (จุดเวฟ + จุดชมพู=มินิ + จุดแดง=บอส) + timeTxt โชว์ "เหลือ N"
  **หน้าสรุปด่าน:** `showStageSummary()` → แตะ `continueFromSummary()` ไปด่านต่อไป/victory
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

- **คมชัดบนจอ high-DPI (Retina):** เรนเดอร์ที่ความละเอียดจริง — `RENDER_DPR`=min(devicePixelRatio,2),
  config `Scale.FIT` ขนาด = จอ×DPR (backing คมชัด) · `this.W/H = scale.width/DPR` (พิกัดยังเป็น CSS px เหมือนเดิม)
  · **2 กล้อง:** main(โลก, follow, zoom=DPR) + `uiCam`(UI, นิ่ง, zoom=DPR, `centerOn(W/2,H/2)`) ใน `setupCameras()`
  · UI ต้องเป็น **scrollFactor(1)** (ไม่ใช่ 0 — เพราะ sf0 ไม่รับ zoom) · แยกเรนเดอร์ด้วย `camWorld()`/`camUI()` (ignore)
  · input แปลงพิกัด `p.x/DPR` เป็น CSS · **หมายเหตุ:** เพิ่ม world FX ใหม่ต้องห่อ `this.camWorld(...)`, UI ใหม่ห่อ `camUI`

### บั๊กที่เคยเจอ & วิธีแก้ (กันพลาดซ้ำ)
- **ภาพเบลอบนมือถือ (high-DPI):** RESIZE ล็อก canvas backing = ขนาด CSS → เบลอ. แก้ด้วย FIT+physical size+2กล้อง (ข้างบน)
- **scrollFactor(0) ไม่รับ camera zoom** → UI ที่ตั้ง sf0 จะเรนเดอร์ 1:1 (มุมซ้ายบน) เมื่อกล้อง zoom; ต้องใช้ sf1
- **`camera.ignore(group)` เป็น snapshot** → กลุ่ม (enemies/bullets/orbs) ว่างตอน setup เลยไม่กันสมาชิกที่เกิดทีหลัง
  → ศัตรูเกิดใหม่เรนเดอร์บน uiCam ด้วย = "ภาพซ้อนค้าง". แก้ด้วยเรียก `this.camWorld(obj)` ทุกครั้งที่ spawn (spawnEnemy/getBullet/dropOrb/มินิ/บอส/elite/nova)
- **Phaser `setInteractive()` กับ shape (rectangle) กดไม่ค่อยติดบนมือถือ** → ใช้ "แตะที่ไหนก็ได้" +
  ตรวจตำแหน่งแตะเอง (ดู `pickCardAt`, pointerdown handler) แทน
- **scale config ห้ามใส่ `width:'100%'`** → ทำให้พิกัดแตะเพี้ยน ใช้ `Scale.RESIZE` เฉย ๆ
- **dash แรงไป = หลุดจอ** → คุมความเร็ว (~560) + `dashTime` สั้น + กล้อง lerp 0.16

## 5. ถัดไป (roadmap ตามลำดับ "ระบบก่อนกราฟิก")
1. จูนบาลานซ์ (ความยากด่าน/เลือดบอส/คูลดาวน์สกิล) ให้สนุกลงตัว
2. **ระบบตัวละครหลายตัว:** หน้าเลือกตัวละคร + ปลดตัวใหม่ (แต่ละตัวอัลติต่างกัน — โครง `CHARACTERS` พร้อมแล้ว)
3. **ระบบวิวัฒน์ (Evolve):** สกิล max + พาสซีฟที่ใช่ = ร่างอัปเกรด (เช่น thunder+แม่เหล็ก = Storm Cloud)
4. **Meta progression:** สกุลเงิน Sugar, ปลดสกิล/ตัวละคร(รสชาติ)/Cookbook สะสม
4. **Endgame:** Ascension(ความยากชั้น), Endless(Midnight Kitchen)+leaderboard, Daily, บอสลับ The Great Hunger
5. *(ขั้นสุดท้าย)* กราฟิก AI แทนรูปทรง → เพลง/เสียง → Capacitor → AdMob/IAP → Play Store

## 6. เอกสารออกแบบ (Artifacts — ความจำภาพ)
เอกสารเหล่านี้เผยแพร่เป็น artifact แล้ว (ถ้าต้องแก้ให้ publish ทับ URL เดิม):
- แผนรวม (stack + กราฟิก + รายได้ + Play Store)
- GDD/ระบบเกม + endgame + lore  ← ล่าสุด/สำคัญสุด
- Prototype เล่นได้ (mochi_play.html — ประกอบจาก phaser+game.js ในโฟลเดอร์ scratchpad ของเซสชัน)

## 7. วิธีเทส / build
- เทสเร็ว: publish `game.js` รวมกับ phaser เป็น artifact HTML แล้วเปิดในเบราว์เซอร์มือถือ
  (ประกอบด้วย: head + `<script>`phaser.min.js`</script>` + `<script>`game.js`</script>`)
- เทสในเครื่อง: `npx serve .` แล้วเปิด index.html
- ตรวจโค้ดก่อน publish เสมอ: `node --check game.js`

## 8. คอนเวนชัน
- ทำงานบนสาขา `claude/vampire-survival-mobile-game-yo9e8w`, commit บ่อย, push ด้วย `-u origin <branch>`
- commit message ภาษาอังกฤษ อธิบายชัด; อย่าใส่ชื่อรุ่นโมเดลในไฟล์/commit
- ภาษาที่คุยกับเจ้าของ: **ไทย**
