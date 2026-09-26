# 04 — มินิบอส + บอส Chapter 3 · batch `ch3_bosses`

## สเปก
- **Action sheet 4×2 = 8 เฟรม · เฟรมละ 256×256 · แผ่น 1024×512 · PNG โปร่งใส** (มาตรฐานเดียวกับบอส Chapter 2)
- ลำดับเฟรม: `0 idle · 1 idle-breath · 2 wind-up · 3 attack · 4 cast/summon · 5 hurt · 6 phase-2 (คลั่ง) · 7 defeat`
- หันหน้าเข้าหาผู้ชม ¾ · ground line เดียวกันทุกเฟรม · ตัวใหญ่ ~80% ของเฟรม · ไม่มีเงา
- ถ้าทำชีตไม่ทัน ส่งภาพนิ่ง 256×256 ชื่อ `<key>.png` ก่อนได้

| key | ด่าน | ชื่อในเกม (แนะนำ) | ดีไซน์ |
|---|---|---|---|
| `c3_mini1` | C3-1 Ashen Seedfields | Cinder Scarecrow | หุ่นไล่กาฟางไหม้ หัวเป็นฟักทองขี้เถ้า ถือเคียวราก |
| `c3_boss1` | C3-1 | The Ash Harvester | รถเกี่ยวข้าวกลายเป็นสัตว์ ใบมีดเป็นฟันเมล็ด ควันส้ม |
| `c3_mini2` | C3-2 Hollow Orchard | Rotcore Twins | แอปเปิ้ลกลวงแฝดติดก้าน สลับกันยิง |
| `c3_boss2` | C3-2 | The Orchard Mother | ต้นผลไม้เดินได้ ผลไม้กลวงห้อยเป็นตะเกียงม่วง |
| `c3_mini3` | C3-3 Glass Greenhouse Ruins | Prism Mantis | ตั๊กแตนตำข้าวแก้วใส หักเหแสงเป็นสายรุ้ง |
| `c3_boss3` | C3-3 | The Shattered Curator | ผู้ดูแลเรือนกระจกร่างแก้ว มีกระถางต้นไม้ลอยรอบตัว |
| `c3_mini4` | C3-4 The Seed Vault | Vault Warden | ยามห้องนิรภัย ตัวเป็นตู้เซฟ มีกุญแจทองเป็นหาง |
| `c3_boss4` | C3-4 | The Keeper of Seeds | นกฮูกเมล็ดพันธุ์โบราณ ปีกเป็นลิ้นชักเก็บเมล็ด |
| `c3_mini5` | C3-5 Throne of the First Seed | Crown Thorn Knight | อัศวินหนามทอง สวมมงกุฎรากเล็ก |
| `c3_boss5` | C3-5 | The First Seed | เมล็ดยักษ์ลอยบนบัลลังก์ราก เปลือกแตกเห็นแสงทอง-ม่วงข้างใน · **บอสสุดท้ายของเนื้อเรื่อง** ให้อลังการที่สุด |

## ฝั่งโค้ด
- key ตรงกับของชั่วคราว → ใส่ `ASSET_SHEETS` (frame 256) · ตั้ง pose ตามลำดับเฟรมใน AI บอส generic
- **ต้องจูน scale/setCircle** ใน `spawnFinalBoss`/`spawnMiniBoss` (ของชั่วคราวเป็น 140px) ให้บอสบนจอ ~150–190px, มินิ ~110–140px
- ชื่อบอสในตารางเป็นข้อเสนอ — ฝั่งโค้ดจะใส่ในข้อความเกม/Bestiary
