# 88 — ไอคอน Pact Relic ใหม่ 8 ชิ้น · ใบสั่งงานอาร์ต

สถานะ: ✅ ผูกแล้ว v8.2.31 · รอ QA มือถือ
ส่งไฟล์ที่ `assets/incoming/relics88/` พร้อม `MANIFEST.json`, `PROMPTS.json`, `QA_REPORT.json`
สไตล์ตาม `00_STYLE_GUIDE.md` · PNG32 alpha จริง · **ห้ามมีตัวหนังสือ ตัวเลข หรือสัญลักษณ์อ่านได้ในภาพ**

## ระบบในเกม (อ้างอิง)
Pact Relic (v8.2.29) = Relic ที่ให้พลังกับฮีโร่ แต่ทำให้ **ด่านยากขึ้น** แลกรางวัลดีขึ้น · ออกตั้งแต่ Chapter 2 ในห้องสมบัติ (เลเวล 6/12/18) และหน้า Relics ใน Recipe Book
ไอคอนแสดงจริง ~56–64px บนการ์ด และ ~40px ในหน้า Pause / Recipe Book

## ไฟล์ที่ต้องการ · 256×256 · โปร่งใส · ของชิ้นเดียวกลางภาพ เว้นขอบ ~20px
**จุดต่างจาก Relic เดิม (ใบ 06/81):** Relic เดิมมีออร่าม่วง `#c07bff` · **Pact Relic ใส่ออร่า 2 สี** = ม่วงด้านบน + แดงชมพู `#ff5c7a` จาง ๆ ด้านล่าง (สื่อ "ได้ + เสีย") และมีโซ่ทองเส้นเล็กพันรอบของ 1 รอบ (สัญญา/Pact) · ให้ทั้ง 8 ชิ้นดูเป็นชุดเดียวกัน

| ไฟล์ | ชื่อในเกม | ภาพ (ผลในเกมใช้คิดภาพ) |
|---|---|---|
| `relic_stormlantern.png` | Storm Lantern 🏮 | โคมกระดาษลูกกวาดมีสายฟ้าฟ้าเหลืองวนข้างใน · ผล: +30% ใส่มอนติดช็อต · ด่าน: เงามืดใน Mirror Path / Last Light มาถี่ขึ้น |
| `relic_goldenappetite.png` | Golden Appetite 🍯 | โหลน้ำผึ้งทองล้นออกมา มีช้อนไม้ปัก · ผล: Sugar +30% · ด่าน: มอนเร็วขึ้น · เวฟทองบ่อยขึ้น |
| `relic_elitebait.png` | Elite Bait 🪝 | ตะขอเกี่ยวลูกอมหัวกะโหลกโมจิเล็ก ๆ · ผล: +20% ใส่ Elite · ด่าน: Elite มา 2 เท่า |
| `relic_cursedcrown.png` | Cursed Crown 👑 | มงกุฎน้ำตาลทองร้าว มีควันม่วงลอยออกจากรอยร้าว · ผล: รางวัลภารกิจ +50% · ด่าน: ทุกเวฟติดคำสาปสุ่ม |
| `relic_frostdebt.png` | Frost Debt 🧊 | ลูกอมน้ำแข็งก้อนใหญ่มีโซ่น้ำแข็งพัน + เกล็ดหิมะ · ผล: +20% ใส่มอนแช่แข็ง · ด่าน: กองทัพ Frozen Pantry +30% |
| `relic_rootpact.png` | Root Pact 🌱 | ต้นอ่อนในกระถางคุกกี้ รากม่วงเลื้อยออกจากก้นกระถาง · ผล: +20% ระหว่างภารกิจราก · ด่าน: รากเลื้อยเร็วขึ้น |
| `relic_hastyclock.png` | Hasty Clock ⏳ | นาฬิกาทรายลูกกวาด ทรายไหลเร็ว มีปีกเล็ก 2 ข้าง · ผล: คูลดาวน์ −10% · ด่าน: เวลาภารกิจสั้นลง |
| `relic_glassgarden.png` | Glass Garden 🪟 | โดมแก้วเรือนกระจกจิ๋วมีดอกไม้คริสตัลข้างใน · ผล: ดาเมจ +25% · ด่าน: กระสุนมอนเร็วขึ้น · จบด่าน +1 Star Sugar |

**รวม 8 ไฟล์**

## ข้อห้าม
- ห้ามตัวหนังสือ/ตัวเลข · ห้ามพื้นหลัง · ห้ามกรอบการ์ด (โค้ดวาดเอง)
- ต้องอ่านออกที่ 40px: ของหลัก 1 ชิ้นใหญ่ คอนทราสต์สูง

## โน้ตฝั่งโค้ด
- แพ็ก 256 → 128 WebP q80 → `assets/art/relics88/relic_<key>.webp` (แบบ `scripts/pack-card-icons-2.py`) · ลงทะเบียน `ASSET_IMAGES.relic_<key>` · โหลดแบบเดียวกับ `relics81` (card/menu lazy)
- การ์ดใช้ `iconKey:'relic_'+k` อยู่แล้ว (rollRelicChoices) · ไม่มีภาพ = อีโมจิเดิม
- งบ: 8 × ~12 KB

## ส่งมอบ
- Date: 2026-11-19. Delivered all 8 files (8 Pact Relic icons / 8 frames) to `assets/incoming/relics88/`. Missing: none.
- Included `MANIFEST.json`, exact `PROMPTS.json`, and compact per-file `QA_REPORT.json`. All files passed mechanical QA and independent readback.
- Source branch: `asset-delivery/orders88-90-a18`. Source assets only; no game.js, runtime, tests or release changes. Code-side wiring and owner phone review pending.
