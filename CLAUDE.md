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

## 4. สถานะปัจจุบัน (อัปเดตล่าสุด: prototype เล่นได้ + ระบบสกิล + 5 ด่าน)
เล่นได้จริงบนมือถือแล้ว ระบบที่มี:
- **คุม:** จอยสติ๊กลอย (ซ้าย) + ปุ่มพุ่ง/dash (ขวาล่าง) + ปุ่มอัลติกดเอง (ชมพู)
- **สกิลออโต้แคสต์ 9 อย่าง** (ใน `SKILLDEFS`): sprinkle, star(orbit), chili, thunder(ฟ้าผ่า),
  whirl(ครีมหมุน), boomer(บูมเมอแรงทะลุ), frost(แช่แข็ง), popcorn(กระจายมั่ว), bubble(ฟองไล่/homing)
- **ระบบคอมโบสกิล (`COMBOS`):** มีสกิลคู่ครบ = ปลดโบนัส (ธง `this.comboFlags` อ่านตอน cast + แบนเนอร์)
  storm(thunder+frost), firestorm(chili+whirl), ricochet(sprinkle+boomer), fizz(popcorn+bubble) · `checkCombos()`
- **Sugar + Save (`Save` → localStorage 'mochi_save'):** เก็บ sugar/unlockedStage/upgrades/gear
  เก็บ Sugar จากการฆ่า (บอส40/มินิ18/elite4/ธรรมดา1) ฝากตอนจบด่าน+ตาย
- **เมนูฮับ + ซับสกรีน (tap-zone hit-test, ไม่ใช้ setInteractive):** `buildHub/buildStageSelect/buildUpgrade/buildGear`
  · `this.menuScreen`=hub/stage/upgrade/gear, `handleTap()`+`_zone()`+`_rowBtn()`+`_screenBg()` (ปุ่มกลับ)
  · **เลือกด่าน:** ปลดตาม `Save.unlockedStage` · **อัพเกรดถาวร (`UPGRADES`):** hp/dmg/spd/magnet ซื้อด้วย Sugar
  · **ของสวมใส่ (`GEAR`):** ช่อง weapon/charm ซื้อ+สวมใส่ · ผลรวมใส่ตอน `applyMeta()` ใน startRun(idx)
- **เลเวลอัพเน้นสกิล** (พาสซีฟเป็นของเสริม) — เลือกด้วยการแตะ (hit-test เอง ไม่ใช้ setInteractive กับ shape)
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
  · เฟส 2 ตอนเลือดครึ่ง (เร็ว/ดุขึ้น) · `b.atks` ต่างกันตามด่าน · มินิบอสได้ subset
- **ศัตรูมีลูกเล่น:** shooter(ยิงระยะไกล พังการ kite, สีเหลือง) · bomber(ระเบิดตอนตาย, สีส้ม) · elite · ผสมในเวฟตามด่าน
- **กระสุนศัตรู (`foeBullets` + `foeShot`/`hitByFoe`):** บอส/shooter ยิงใส่เรา · `hurtPlayer()` โดนแล้วเสีย HP (dash หลบได้)
  · **hazard (`spawnHazard`)**: วงอันตรายบนพื้น เตือนก่อนแล้วระเบิด · ล้างด้วย `clearFoes()` ตอนจบเวฟ/ด่าน
  · **หมายเหตุ:** foeBullets ต้อง `camWorld()` ตอน spawn (กัน 2-camera ghost) — ทำใน foeShot แล้ว
- **ศัตรู:** 5 ชนิด (basic/fast/tank/shooter/bomber) + บอส, มี object pooling
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
