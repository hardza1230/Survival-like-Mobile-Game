# สรุปโปรเจกต์ Mochi Mayhem: FLAVORBOUND

ตรวจล่าสุด: **18 ตุลาคม 2026 (Asia/Bangkok)**  
ฐานโค้ด: **v7.8.55 · e32cc3703a541c680cf712690399d1959dfd85c5**  
สาขาหลัก/เผยแพร่: `claude/vampire-survival-mobile-game-yo9e8w`

## ขอบเขตปัจจุบัน

เกม survival-like มือถือแนวตั้ง ใช้ Phaser 3 + Capacitor + GitHub Actions + GitHub Pages มี Story **3 Chapter / 15 ด่าน** ไม่ใช่ 10 ด่านตามเอกสาร v4 เดิม

| ส่วน | สถานะในโค้ด |
|---|---|
| Story | Rise from Below (0–4), The Ferment Garden (5–9), Throne of the First Seed (10–14); ทั้ง 3 Chapter ready |
| ฮีโร่ | 6 ตัวใน CHAR_ORDER: momo, mint, cocoa, taro, yuzu, sesame; 3 Build Path ต่อคน |
| Berry Core | ยังมีนิยามรองรับข้อมูลเก่า แต่ไม่อยู่ใน roster ปัจจุบัน |
| Endgame | Mochi Delve, บอส Delve, Pinnacle, Boss Rush, Midnight Kitchen Endless |
| ความก้าวหน้า | Gear/enhancement, Talent, Temple Weave/Depths/Rank Perks, Kitchen Recipe, Bazaar/Sugar Orders, Daily/Achievement |
| Forge | หน้าเดียว 3 แถว Power / Sustain / Playstyle & Utility; 150 catalog, **78 active / 72 planned** ไม่สุ่ม planned |
| วัดผลเล่นจริง | Play Stats / Combat Meter พร้อม Copy last 3 runs และข้อมูลราย wave/skill/boss/device |
| Cloud / telemetry | มี Cloud Save integration; Share Play Stats default off และ latest handoff v7.8.44 ระบุ run_stats backend ยังไม่สร้าง ต้องตรวจสถานะจริงก่อนเปิดใช้งาน/อ้างว่าพร้อม |

สถานะในโค้ดไม่ได้ยืนยันว่าผ่าน full-run, balance, touch หรือ FPS บนมือถือทุกระบบ และไม่ได้ยืนยันความพร้อมบริการ cloud ปัจจุบัน

## อัปเดตสำคัญล่าสุด

- **v7.8.55:** C2-4 ใช้ Seasonal Harvest แทน Season Storm trials ฤดูหมุนทุก 10s; kill ปกติได้ 1 กลีบ Elite ได้ 3; เต็ม 12 กลีบต่อฤดูครบทั้ง 4 จึงจบ objective ฤดูเต็มหยุด hazard ของตัวเอง และส่วนเกิน 50% สะสมเพื่อช่วยฤดูที่ยังขาด ไม่มีสอบตก/เริ่มใหม่ทุกวงรอบ
- **v7.8.51–54:** Spark ชนตามขนาดตัวจริงและเลี้ยวหาศัตรูที่ยังไม่โดน; Sentry เพิ่ม Shock cap บอส/มินิเป็น 15, Discharge ทุก 25 zaps, orb มี fade burst; Static Charge ปรับเป็น 40 hits ต่อ strike
- **v7.8.49–50:** Temple Weave + Flavor Passives ต่อภาพ 34 ชิ้นและแก้สี/แสง/layout จอเตี้ยแล้ว รอเจ้าของตรวจมือถือ
- **v7.8.45–46:** Hero VFX gaps ต่อครบ 21/21 รวม Cocoa landing dust ที่กู้ไฟล์เต็มแล้ว
- **v7.8.47–48:** Replay เรียกมินิบอสเมื่อ progress ครึ่งหนึ่ง บอสเมื่อเต็ม ใช้ kill เท่านั้น ไม่มี timer ข้าม
- Forge v7.8.0–3: registry 150 รายการ พร้อม migration และหน้าเดียว; 72 planned ยังต้องมี consumer/test ก่อน activate

## อาร์ตและ QA

ใช้ [ดัชนีอาร์ต](art_orders/README.md) และ [backlog ปัจจุบัน](art_orders/16_CURRENT_ART_BACKLOG.md) เป็นทางเข้า ใบสั่งเก่าเป็นสเปก/ประวัติ ไม่ใช่รายการงานค้างทั้งหมด

| ชุดล่าสุด | สถานะ |
|---|---|
| 18 Taro Spark/Ball Lightning | A/B/C ต่อแล้ว v7.8.25; ดูใบสั่งสำหรับส่วนขยาย |
| 20 Hero VFX | ส่งและต่อครบ 21/21 ใน v7.8.45–46 |
| 21 Temple Weave UI | ส่ง 34/34 ต่อ v7.8.49 และ polish v7.8.50 |
| Mobile visual/FPS | ยังต้องเจ้าของตรวจ readability, timing, alpha, touch, จอเตี้ย และ VFX off/fallback |

## Build / deployment

- Build Android APK ของ v7.8.55 บนสาขาหลัก [สำเร็จ](https://github.com/hardza1230/Survival-like-Mobile-Game/actions/runs/39042341016)
- Pages ของ commit เดียวกันบนสาขาหลัก [ถูกยกเลิก](https://github.com/hardza1230/Survival-like-Mobile-Game/actions/runs/39042341134); รันสาขาอื่น [ล้มเหลว](https://github.com/hardza1230/Survival-like-Mobile-Game/actions/runs/39042552545) จึงยังไม่ยืนยัน live version
- Debug APK โหลด Pages; release AAB ลบ server.url และฝัง bundle ในแอปผ่าน workflow ที่มีอยู่แล้ว
- มี store/appicon_512.png, store/feature_graphic_1024x500.png และ screenshot 4 รูปใน repo แต่ต้องทบทวนความตรงกับเกมปัจจุบันก่อนส่งสโตร์
- การตั้ง signing secrets, signed AAB จริง, Play Console และ cloud/telemetry readiness ไม่ได้ยืนยันในการตรวจเอกสารครั้งนี้

## ลำดับงานถัดไป

1. ตรวจ/เผยแพร่ Pages บนสาขาหลักให้สำเร็จและเทียบ version.json กับ GAME_VERSION
2. เล่น C2-4 ใหม่ตั้งแต่ objective → hunt → boss → reward; ทดสอบ replay แยกจาก first clear
3. เทียบ Taro ทั้ง 3 สายบนด่าน/gear เดียวกันด้วย Combat Meter ก่อนจูนเพิ่ม
4. ตรวจ Temple และ VFX บนมือถือจริง รวมเครื่องระดับกลาง/ล่าง และเล่น Story C2–C3 / Endgame เพื่อจูน progression
5. ทำ Forge effect batch ที่เหลือเป็นงานแยก พร้อม consumer/test; ไม่ถือว่า catalog = implemented
6. Play Store พักไว้ตามแผนเดิม; ก่อนกลับมาทำต้องตรวจ signing, account deletion, privacy/data safety, listing และข้อกำหนดปัจจุบัน

## ประวัติย่อ

เริ่ม repo 23 ส.ค. 2026 เวลา 07:45 น. ไทย; root commit dc61053 เวลา 08:32 น. เป็น Phaser prototype พร้อม joystick/dash, ศัตรู 3 แบบและ level-up 24 ส.ค. เริ่ม art pipeline; กันยายนเพิ่ม VFX, progression/equipment และ Android release infrastructure; 11 ต.ค. เข้า v7 พร้อม desktop controls/เสียง; 17 ต.ค. ถึง v7.8.55

ถึง 18 ต.ค. ผ่านมา **56 วันปฏิทิน** GitHub ไม่ได้บันทึกชั่วโมงทำงานจริง ไม่มีเปอร์เซ็นต์ completion ที่รับรองจาก tests; ควรประเมินจาก acceptance ของรุ่นที่ต้องการปล่อย

## แหล่งอ้างอิงและวิธีอัปเดต

- Runtime: GAME_VERSION / CHANGELOG / CHAPTERS / STAGES / CHAR_ORDER ใน game.js
- Forge: [registry](../data/forge-mods.json), [rollout](FORGE_150_ROLLOUT.md), [single-screen](FORGE_SINGLE_SCREEN.md)
- ผู้พัฒนา: [CLAUDE](../CLAUDE.md), [workflow](AGENT_WORKFLOW.md), [checkpoint](SESSION_HANDOFF.md)
- Release: [signing](RELEASE_SIGNING.md), [store draft](STORE_LISTING.md)
- ประวัติ: [CLAUDE_HISTORY](CLAUDE_HISTORY.md), Git commit log

เมื่อ runtime เปลี่ยน ให้ปรับเลขเวอร์ชัน/วันอ้างอิงและส่วนที่เกี่ยวข้องใน README กับสรุปนี้ แยก implemented, QA pending และ deployed เสมอ เอกสารอย่างเดียวไม่ต้อง bump GAME_VERSION
