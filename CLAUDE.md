# Version line

Current release: **8.1.141**. Next release:8.1.142. Fetch the deploy branch before new work.

# Latest delivery: v8.1.141 — owner 🐞 feedback after the tutorial (first real reports via Supabase)

Owner sent 5 reports from the 🐞 button (read with Supabase `execute_sql` on `qa_reports`). **Tutorial coach** (`buildCoachSpotlight` / `tickTutorialCoach` / `coachSpotTarget`): attack + heal steps show the pointing finger only (moving yellow `vfx_tut_ring` hidden); sweets step `spot:'orb'` → pulsing glow + finger on the nearest EXP drop; Dash/Unique steps dim the screen around the button (`_coachShade`, 4 rects with a 100 px hole). **Lobby hero placeholder:** after the tutorial Strawberry stayed a placeholder → `buildLobby` retries `lobbyPreload` every 3 s (max 10, `_lobbyHeroRetryAt`) and rebuilds when `card_<hero>` is real (could not reproduce headless; loads fine there). `Tele.ev('tutorial_done')` now also fires from `_coachFinish` (the real coach path). `QA.shot` timeout 1.5 → 4 s (menu reports had no screenshot).

# Previous delivery: v8.1.140 — owner: AdMob test ads + hide IAP, bot round 2, play events

**Ads (LAUNCH_RULES rule 4):** `@capacitor-community/admob` 8.2.1 · `AdManager` (before `Store`): `init()` = UMP consent (`requestConsentInfo` → `showConsentForm` when REQUIRED) then `initialize({initializeForTesting:ADS_TEST})`, called at Game create · `show()` → 'rewarded' / 'skipped' / 'failed' (reward event + Dismissed; 20 s load timeout) · `ADS_TEST=true` uses Google sample unit `ca-app-pub-3940256099942544/5224354917`; real unit `ADMOB_REWARD_ID` for launch · `showRewardedAd` pays only on 'rewarded', suspends `Sfx.ctx` during the ad, banners for skipped/failed; web/old APK keeps the 3 s demo · Settings row "Ad Privacy" when UMP says privacy options are required · manifest `APPLICATION_ID` meta-data added by `scripts/set-android-landscape.mjs` (android.yml + release-aab.yml) — keep `ADMOB_APP_ID` in sync. **IAP hidden:** `IAP_ENABLED=false` → Bazaar has no Thread tab, Wardrobe "Get Thread" / thread pill → `threadHowTo()` banner (Depths + Daily Login).
**Play events (rule 7, Supabase instead of Firebase):** `Tele.ev(name,data,stage)` → `run_stats` rows with `mode:'event'` (`session`, `tutorial_done`, `stage_start`, `screen`, `ad`), max 150/session, queue MAX 120 · queries `docs/telemetry/funnel.sql`. Bot (`scripts/qa-autoplay.cjs`) now also logs game seconds, active EXP orbs and xp. Test admob-rewarded.

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
- **ขนาดแอป (Google Play ไฟล์หลัก ≤ 200 MB):** ทั้งเกมที่ส่งไปต้อง < 190 MB · มาตรฐานแพ็ก (skill wire-art §2b): WebP q80 (q75 ถ้า >150 KB) · ความละเอียด ≤ 2× ขนาดบนจอ · เพลง 80k · เสียงพูด 56k โมโน · SFX 96k · ตรวจด้วย `python3 scripts/compress-assets.py --dry` · หน้า `*-review.*` ไม่ใส่ในแอป (android.yml / release-aab.yml ลบก่อน sync)
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
**รออาร์ต/เสียง (เจ้าของ 12 พ.ย.: AI ฝั่งอาร์ต/เสียงทำแค่ไฟล์ส่งที่ `assets/incoming/<batch>/` · Claude ฝั่งโค้ดผูกเองด้วย skill wire-art · ใบ 75–78 ก่อนหน้านี้ฝั่งอาร์ตผูกเอง)**
- ใบ 80 หน้าเลือกพิเศษ (ห้องสมบัติ Relic · ทั่ง Evolution · สมุดสูตร Mutation · การ์ด Build Path 15+1) ผูกแล้ว v8.1.137 · v8.1.138 สลับภาพ Glacier/Barrage (`PATHCARD_ART`) · รอ QA มือถือ
- ใบ 81 ไอคอน Relic ที่ขาด 8 · Modifier 36 · Trade-off 5 · การ์ด Build Path Yuzu 3 · (ไม่บังคับ) การ์ด Cocoa Titan/Dash Boxer ใหม่ 🟡 รออาร์ต · ส่งที่ `assets/incoming/relics81/`
- รวมงานค้างให้ AI อีกตัว: `docs/PENDING_ART_AUDIO_ORDERS.md` · A13 / A12 / 79 / 69 ผูกแล้ว v8.1.108 · รอ QA มือถือ
- ใบ 69 สกินเต็มตัว Festival ครบ 68/68 · 6 ฮีโร่ผ่าน qa-skin69 · ผูกแล้ว (Mint 11 พ.ย. · ยืนยัน v8.1.108) · เจ้าของ 10 พ.ย.: ปีก/ฮาโล/วง เลิกขายแยก → สกินเต็มตัว; ขายแยกเหลือ pet/trail/dash/pop
- เสียงชุด A04 เพลง · รอสิทธิ์ Music Generation

**รอ QA บนมือถือของเจ้าของ**
- ล่าสุด: v8.1.101 loot มินิบอส/บอส · v8.1.100 ป้ายคำพูด/การ์ดเลเวลอัป/หัวหน้าจบด่าน · v8.1.99 Mint bloom/หนังสือเปิด
- League missions ครบ 7 phase v8.1.81–87 (`docs/design/OWNER_NOTES_POE_LEAGUES.md`) · Breach จำกัดเปิดรวม 20 วิ (เจ้าของสั่งเอง)
- อาร์ตผูกแล้ว: 70 Patrol + 71–74 v8.1.93 · 75 v8.1.94 · 78 v8.1.95 · 76 v8.1.96 · 77 v8.1.97 · 65 Daily Login 30 วัน + A09 v8.1.43 · 63 v8.0.95 + A06 v8.0.91 · 62 v8.0.85 · 61 v8.0.84 · 50–54 เมนู v8.0.34 · 36 Ruby v7.9.87
- Simple Forge v8.0.83 (ราคา/ความรู้สึก 3 การ์ด) · บาลานซ์ Yuzu/Seedlings, Citrus Command, Rewards hub · FPS ทุกชุดอาร์ต
- Sesame Rune Invoker (เจ้าของอนุมัติ 2 พ.ย., `docs/design/SESAME_RUNE_INVOKER.md`) v8.1.1 รอมือถือ

**รอเจ้าของตัดสินใจ / ทำต่อ**
- ความถี่แท่นเริ่มภารกิจหลังเล่นจริง · Overcharge ปิดไว้ v8.1.103 (`OVERCHARGE_ON`)
- Sesame: บาลานซ์/ความถนัดและ Talent ถาวร (ไม่ทำ Mirror Network ขั้น 2)
- ยกเลิกแล้ว: ใบ 35 Yuzu Orchard (→ Citrus Companions 55/56) · ใบ 49 กรอบโปรไฟล์

**ก่อนขึ้น Google Play**
- ภาพ/เสียงสำรอง (fallback) เก็บไว้กันพังตอน dev ที่โหลดผ่านเว็บ · เจ้าของ 12 พ.ย.: ไม่ต้องแก้ให้รอโหลด เพราะแอป Play Store แพ็กไฟล์ในเครื่อง (เช่น เรื่องเล่า Ruby ที่สลับเป็นหน้าหนังสือเมื่อการ์ตูนโหลดไม่ทัน)
- รายได้ช่วงทดสอบ = โฆษณา rewarded อย่างเดียว (เจ้าของ 13 พ.ย. · `docs/LAUNCH_RULES.md` กฎ 4) · v8.1.140 ต่อ AdMob + UMP แล้ว (โฆษณาทดสอบ) · ตอนปล่อย: `ADS_TEST=false`, `BETA_BUILD=false`, ตั้งข้อความ GDPR ใน AdMob
- GM (รหัส 1234) ปิดเองในแอปที่แพ็กไฟล์ (v8.1.67: เปิดเฉพาะ *.github.io / localhost:port) · **ตรวจว่า release ไม่ใช้ `server.url` ชี้ github.io** · ต้องมีเซิร์ฟเวอร์ตรวจใบเสร็จ/คะแนน

**กฎเจ้าของ**
- ไม่ต้องจำลองเล่น headless เพื่อจูนบาลานซ์ และไม่ต้องถ่ายภาพหน้าจอตรวจ UI — เจ้าของตรวจบนมือถือเอง (headless หาบั๊กได้)

## 6. เอกสาร
**อ่านก่อนเริ่มงาน: `docs/GAME_PILLARS.md` (เกมสนุกตรงไหน · เสาหลัก 3 ข้อ · cut list · ด่านตรวจของใหม่) + `docs/LAUNCH_RULES.md` กฎ 7 ข้อทางไปปล่อยเกม (เป้า Closed test ≤ 13 ธ.ค. · ระบบใหม่เฉพาะที่จำเป็น ไม่งั้นลง `docs/IDEAS.md` · ทุกเวอร์ชันเพิ่มรายการ "รอ QA" ในไฟล์นั้น) + `docs/LESSONS.md` บทเรียนของพวกเรา + กติกาทำงาน** (รวมงานเป็นรอบ · ของปลอมก่อนสั่งอาร์ต · ใบสั่งอาร์ตต้องบอกจุดต่าง · ตรวจทั้งกองก่อนเพิ่มการ์ด · งบหน่วยความจำเป็นกฎเหล็ก · ไม่แน่ใจให้ถามก่อน) · `docs/PLAYTEST_CASES.md` (feedback/บั๊กจากเครื่องจริง) · `docs/LANDSCAPE_FULLSCREEN_UI_KNOWLEDGE.md` · GDD/แผนรวมเป็น artifact เดิม (แก้ให้ publish ทับ)

## 7. เทส / build
`bash scripts/ci-checks.sh` (= ทุกอย่างที่ CI ตรวจ · ~3 นาที) ก่อน publish เสมอ · CI: job `deploy` (เทส+build ~1.5 นาที) ขึ้นเว็บเลย + job `visual` (ตรวจหน้าจอ 11 ชุด) รันคู่กันไม่บล็อก · push สาขา deploy กับ session พร้อมกันได้ · ลำดับปล่อยเวอร์ชันอยู่ใน skill release · เทสในเครื่อง `npx serve .` · เจ้าของทดสอบ flow/บาลานซ์/FPS บนมือถือเอง

## 8. คอนเวนชัน
- ทุกเวอร์ชัน: bump `GAME_VERSION` + CHANGELOG + บล็อก Latest delivery (ย้ายบล็อกเก่าสุดไป CLAUDE_HISTORY ให้เหลือ 2 บล็อก)
- commit ภาษาอังกฤษ ไม่ใส่ชื่อรุ่นโมเดล · คุยกับเจ้าของภาษาไทย
- ข้อความในเกมเป็นภาษาอังกฤษล้วน (comment ไทยได้) · ใช้ `’` ใน single-quoted literal · ห้ามอักษรไทยใน string
