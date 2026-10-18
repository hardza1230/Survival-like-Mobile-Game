> 18 ต.ค. 2026: งานใหม่ Pause Screen UI (19 ไฟล์) ดู [24_PAUSE_SCREEN_UI.md](24_PAUSE_SCREEN_UI.md) · ส่งที่ `assets/incoming/pause_ui/`
> 18 ต.ค. 2026: งานใหม่ Level Up / Card Choice UI (19 ไฟล์) ดู [23_LEVELUP_CARD_UI.md](23_LEVELUP_CARD_UI.md) · ส่งที่ `assets/incoming/levelup_cards_ui/`
> 18 ต.ค. 2026: งานใหม่ Boss Attack VFX C1–C2 (59 ไฟล์) ดู [22_BOSS_ATTACK_VFX_C1_C2.md](22_BOSS_ATTACK_VFX_C1_C2.md) · ส่งที่ `assets/incoming/boss_vfx_c1_c2/`
> **สถานะตรวจ 18 ต.ค. 2026 / v7.8.55:** P1 edge accents, Unique Mastery, Tremor/Frost Burn และ Berry crop ส่ง/ต่อแล้ว v7.7.0; ใบ 17 ต่อ v7.8.20, ใบ 18 A/B/C v7.8.25 และ E–I v7.8.30, ใบ 19 ต่อ v7.8.32, ใบ 20 ครบ 21/21 v7.8.45–46, ใบ 21 ครบ 34/34 v7.8.49 และ polish v7.8.50 **งานหลักที่ค้างคือ owner phone visual/FPS QA**; อย่าสร้าง P1 เดิมซ้ำ ส่วนข้อเสนอด้านล่างเป็นฐานสำรวจ 11 ต.ค. ต้องเทียบ runtime ใหม่ก่อนสั่งผลิต
> C2-4 เปลี่ยนจาก Season Storm trials เป็น Seasonal Harvest แล้ว v7.8.55; ดู [QA ปัจจุบัน](../C2_4_QA.md) ก่อนตีความสเปกเอฟเฟกต์เดิม

> 17 ต.ค. 2026: Temple Weave UI (34 ไฟล์) ส่งครบและผูกเข้าเกมแล้ว v7.8.49 ดู [21_TEMPLE_WEAVE_UI.md](21_TEMPLE_WEAVE_UI.md) · รอดู visual บนมือถือ
> 17 ต.ค. 2026: งานใหม่ Hero VFX gaps (Chocolate / Strawberry / Mint / Taro · 21 ไฟล์) ดู [20_HERO_VFX_GAPS.md](20_HERO_VFX_GAPS.md) · ส่งแล้ว ผูกครบ 21/21 แล้ว (v7.8.45–v7.8.46) รอดู visual/FPS บนมือถือ
> 16 ต.ค. 2026: งานใหม่ C2-4 Four-Season Conservatory (บททดสอบฤดู + ท่าบอส Chronobloom) ดู [19_C24_FOUR_SEASON_ART.md](19_C24_FOUR_SEASON_ART.md) · ส่งที่ `assets/incoming/c24_seasons_vfx/`
> 15 ต.ค. 2026: งานใหม่ Taro Spark + Ball Lightning (แบบ PoE) ดู [18_TARO_SPARK_BALL_LIGHTNING_ART.md](18_TARO_SPARK_BALL_LIGHTNING_ART.md) · ส่งที่ `assets/incoming/taro_spark_ball/`
> 15 ต.ค. 2026: งานใหม่ Taro Sentry Build (ป้อม/ลูกบอลสายฟ้า/Beacon/ไอคอน) ดู [17_TARO_SENTRY_ART.md](17_TARO_SENTRY_ART.md) · ส่งที่ `assets/incoming/taro_sentry/`

> P1 ส่งใน v7.7.0: ชีต edge accents แยก 13 สกิล, Unique Mastery, Tremor/Frost Burn และแก้ Berry Core crop แล้ว ดู P1_DELIVERY_7_7.md สำหรับหลักฐานและข้อจำกัด QA; รีวิวเล่นจริงบนมือถือยังค้าง

# ฐานสำรวจงานอาร์ต — 11 ต.ค. 2026 (อ่านสถานะล่าสุดด้านบนก่อน)

ฐานตรวจ: runtime v7.6.14 (`0b010e8`) รวมเสียง Strawberry ใน v7.6.15
ไฟล์นี้เป็นรายการปัจจุบัน ใบสั่ง 01–15 ใช้อ้างอิงสเปกเดิม ไม่ใช้ข้อความ “ยังขาด” ในไฟล์เก่าเป็นสถานะปัจจุบัน

## งานค้างจริง / ต้องทำใหม่

| ลำดับ | งาน | หลักฐานและสถานะ | ใบสั่งสำหรับรอบถัดไป |
|---|---|---|---|
| เสร็จ/รอ QA | Screen effect ของฮีโร่ | v7.7.0 เปลี่ยนเป็น edge accents 13 สกิลแล้ว; full-screen ชุดเก่ายังพักไว้ | ตรวจบนมือถือ ไม่สร้างซ้ำ; ดู P1_DELIVERY_7_7.md |
| เสร็จ/รอ QA | ไอคอน Unique Mastery | ส่งและต่อแล้ว v7.7.0 ที่ assets/art/talents/unique_mastery.webp | ตรวจอ่านง่ายบนมือถือ; ไม่ใช่งานขาด mapping แล้ว |
| P1 | Visual QA หน้าอุปกรณ์จอใหญ่ | แก้ crop ใบหน้าใน v7.3.1 แล้ว; ยังต้องดูภาพจริงทั้ง 7 ฮีโร่ในจอแคบ/แท็บเล็ต/แนวนอน | ไม่สร้าง portrait ใหม่ก่อนพบภาพผิด ตรวจหน้าครบ รายงานภาพถูกตัดและตำแหน่ง label พร้อมขนาดจอ |
| P2 | QA งานส่งแล้ว | ชุดมอนสเตอร์, Elite, Chef, Build icons/VFX, Talent, ending/story/growth มีไฟล์และโค้ดแล้ว | ตรวจความอ่านง่าย/FPS/alpha/animation บนมือถือจริง รวม VFX off และ fallback; เป็นงานตรวจ ไม่ใช่งานสร้างซ้ำ |

## งานใหม่ที่เสนอเพิ่มตามกลไกปัจจุบัน

ยังไม่ได้อนุมัติให้สร้างภาพในรอบนี้ รายการด้านล่างคือสเปกสำหรับงานถัดไป ไม่ใช่ข้อสรุปว่าเกมไม่มีเอฟเฟกต์เลย

| ลำดับ | งาน | สิ่งที่มีแล้ว | สิ่งที่ควรเพิ่ม |
|---|---|---|---|
| P1 | Titan Ground Pound / Tremor | v7.6.14 ใช้ท่าทุบ, shockwave/crack ที่มีแล้ว; ยกเลิกคอมโบ 5 หมัด | ชั้น Tremor บนตัวศัตรู: รอยแตก/หิน 1–5 ระดับและรองรับ stack เพิ่มจาก Talent; สื่อว่าความแรงสะสมขึ้น ไม่เพิ่มขนาดจนบังบอส |
| P1 | Mint Frost Burn | ใช้ข้อความ `FROST BURN ×N`, freeze และ VFX Glacier เดิม | สัญลักษณ์ไฟเย็นเล็กเหนือศัตรู + pulse แบบเบา; ระดับ 1–5 อ่านได้ในฝูง; หายเมื่อหมด 8s/ตาย/ถูกคืน pool |
| P2 | Titan Blood Rage / Colossus หลัง rework | มีชาร์จ/เดินชาร์จ, วงแสดงพื้นที่จริง, ท่าทุบ และ aftershock | ปรับโทนแรงตาม Rage 1–4 และแยกสอง aftershock ให้เห็นจังหวะ; อย่าทำท่ากระโดดล็อกเป้าแบบใบ 15 เก่าซึ่งไม่ตรง runtime แล้ว |
| P2 | Unique heal aura | มี aura สีเขียวที่ลอยขึ้นรอบตัวและเสียง; v7.6.11 เลิกใช้ขอบจอเขียว | ถ้าจะเปลี่ยนเป็นไฟล์จริง: ชีต aura 6–8 เฟรม loop, ไม่ปิดใบหน้า/วงเตือน; ใช้ร่วมทุกฮีโร่และหยุดเมื่อ regen จบ |
| P2 | Daily Quests / กล่องแต้ม | ระบบ 5 quest และรางวัล 40/70/100 แต้มมีแล้ว | ตรวจไอคอนที่ใช้อยู่ก่อน; เสนอ badge กล่องเล็ก/ใหญ่/Grand ที่ต่างกันชัดและภาพ claim สำเร็จ หากของเดิมอ่านยาก |

## แนวทาง screen effect รอบแก้ใหม่

ต้องแยกตามสกิลที่ใช้จริง ไม่ใช้ภาพเดียวแทนทุก Build; ตารางนี้เป็นทิศทางภาพสำหรับ mockup ไม่ใช่จำนวนไฟล์ที่ล็อกไว้แล้ว

| ฮีโร่ | ทิศทางภาพ |
|---|---|
| Strawberry / Momo | Rebound เมล็ดและแรงกระเด้งที่ขอบ; Shotgun ควันสั้นตามจังหวะยิง; Sniper scope สะอาดและ flash สั้น |
| Mint | Glacier ขอบน้ำแข็งและแตกตอนปล่อย; Frost Lance เส้นพุ่งตามทิศ; Gale ลม/ใบไม้เบาบาง |
| Chocolate / Cocoa | Fire Fist เปลวไฟ/สะเก็ดตอนระเบิด; Titan pulse สั้นตาม Rage/กระแทก/aftershock; Phantom เงาพุ่งตามจังหวะ leap |
| Taro | เงาและเสี้ยวคมของภาพสะท้อน เน้นความอ่านง่ายของกระสุน/ลำแสง |
| Sesame | สายฟ้าสั้นตรงจังหวะสกิล ไม่กระพริบเต็มจอตลอดเวลา |
| Yuzu | citrus/ลมและร่องรอย crew อยู่ขอบ ไม่บดบังตำแหน่งผู้ช่วย |
| Berry Core | เส้นล็อกเป้า/พลัง rocket สั้นสอดคล้องทิศ barrage |

## งานที่เสร็จแล้ว ไม่ต้องสร้างซ้ำ

- ใบ 01–13: พื้น/ของตกแต่ง, มอนสเตอร์และบอส, วิหาร/เหมือง, Perk/Relic/Kitchen, เมนู/Delve ตามสถานะส่งของเดิม
- ใบ 14: Batch 7A/7B/8/9, Elite/ตัวพิเศษ, Chef, Build icons และ Unique VFX ส่งแล้ว
- Talent เดิมมี atlas + mappings; Unique Mastery ส่ง/ต่อแล้ว v7.7.0
- ใบ 15: ตัวละคร/Build VFX อยู่ใน `assets/art/bp_fx/` และผูกผ่าน `BP_POSE_SCALE`/`BP_FX`; สเปกกลไกบางส่วนล้าสมัย โดยเฉพาะ Titan
- ฉากชนะ/แพ้, epilogue และ growth มีงานอาร์ต/การผูกแล้ว; ตรวจต่อด้วย ending-growth-art regression และมือถือจริง
- Screen effect 7 ภาพมีไฟล์แล้ว แต่สถานะคือ **พักใช้งาน/ต้องปรับใหม่** ไม่ใช่ “ใช้งานแล้ว”

## เกณฑ์ส่งงานใหม่

อ่าน `00_STYLE_GUIDE.md`; ทดสอบภาพบน screenshot เกมในจังหวะใช้งานก่อนผลิตทั้งชุด ใช้ alpha จริง, ไม่มีตัวอักษร, มีขอบว่างและศูนย์กลางจออ่านการต่อสู้ได้
ไอคอนและ animation รวม sheet เมื่อเหมาะสม; พร้อม manifest ระบุกริด/frame/anchor/loop และ preview บนพื้นสว่าง/มืด
AI ผูกต้องตรวจไฟล์/registry/call site/lifecycle โดยเฉพาะตาย, pause, เปลี่ยนด่านและ pool reuse; ไม่เปิด screen overlay เดิมกลับอัตโนมัติ
