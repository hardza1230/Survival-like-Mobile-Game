# 🏪 แผนระบบไอเทม/เศรษฐกิจแบบ PoE (Single-Player) — Mochi Mayhem

> เป้าหมาย: สร้าง **ความลึกของ itemization + crafting + grinding endgame** แบบ Path of Exile
> เพื่อความต่างจากเกม survivor ในตลาด — โดย **ไม่ต้องมีเซิร์ฟเวอร์/เทรดจริง**
> ขอบเขตที่เลือก: **NPC Bazaar (ผู้เล่นคนเดียว)** · P2P trade เก็บเป็นเฟสอนาคต (ดู §7)
> สถานะ: **เอกสารแผน** (ยังไม่ลงโค้ด) · ฐานที่มีแล้ว: affix ต่อชิ้น (v2.88) + เศษ 🔩 (v2.87)

---

## 0. ทำไมไม่ทำเทรดจริง (P2P) ตอนนี้
- เซฟเป็น **client-authoritative** (localStorage/Supabase) → แก้เซฟ = เสกไอเทมได้
- เทรดจริงต้องมี server ตรวจ item validity + บัญชี + anti-cheat + ค่ารัน = โปรเจกต์แยกก้อนใหญ่
- **ฟีล PoE 90% มาจาก crafting + prefix/suffix + grinding** ซึ่งทำ single-player ได้ครบ
- → ทำ Bazaar คนเดียวก่อน, P2P ไว้ §7 (เมื่อมีฐานผู้เล่นจริง)

---

## 1. โครงสร้างไอเทม (Prefix / Suffix / Tier)

### 1.1 ระดับความหายาก (rarity → จำนวน affix)
| Rarity | สี | Prefix สูงสุด | Suffix สูงสุด |
|--------|----|-----|-----|
| Common (ขาว) | เทา | 0 | 0 |
| Magic (ฟ้า) | ฟ้า | 1 | 1 |
| Rare (เหลือง) | เหลือง | 3 | 3 |
| Legend/Unique (ส้ม) | ส้ม | affix ตายตัว (fx พิเศษ) | — |

> หมายเหตุ: tier ของเดิม (common/rare/epic/legend) = "ฐานไอเทม (base)" · rarity ใหม่นี้ = ชั้น affix ที่คราฟต์ได้ · แยกแนวคิดกัน (base ดี + roll ดี = ของเทพ)

### 1.2 Prefix vs Suffix (แยก AFFIX_POOL เดิม)
- **Prefix = สายรุก:** ดาเมจ% · คริ% · คริแรง(critMul) · เจาะ(pierce) · attack speed
- **Suffix = สายรับ/utility:** HP · ลดดาเมจ% · ฟื้น/วิ · ความเร็ว · ดูดของ · ดูดเลือด(lifesteal)
- ต่อไอเทมมีได้ทั้ง prefix+suffix (magic 1+1, rare 3+3) · ห้ามซ้ำ mod เดียวกัน

### 1.3 Affix Tier (T1-T5) — หัวใจ grinding
แต่ละ affix มี 5 tier, ค่ายิ่ง tier สูง (T1) ยิ่งแรง:
```
dmg%  T5:3-4  T4:5-6  T3:7-9  T2:10-12  T1:13-16
hp    T5:15-24  T4:25-39  T3:40-59  T2:60-84  T1:85-120
```
- โอกาสได้ T สูงขึ้นตาม **item level** (ดรอปจากด่านสูง/นรก = ilvl สูง = T1 ออกได้)
- โชว์ tier บนไอเทม: `💥 ดาเมจ +15% (T1)`
- **เป้า endgame:** ไล่หา rare ที่มี prefix/suffix T1 ครบ = "mirror-tier"

### 1.4 ชื่อไอเทมแบบ PoE
`[Prefix] + ชื่อฐาน + [Suffix]`
เช่น "มีดเชฟ**คมกริบ** **แห่งราชสีห์**" (คมกริบ=prefix dmg, ราชสีห์=suffix hp)
- ตาราง `AFFIX_NAMES[mod][tier]` = คำไทยน่ารักตามธีมขนม

---

## 2. Crafting Currency (ตัวสร้าง loop)

Currency = ไอเทมใช้แล้วหมด · ได้จากดรอป/ขายของซ้ำ/นรก · แต่ละแบบ = 1 การกระทำ

| Currency | ชื่อในเกม | ผล |
|---|---|---|
| 🔵 Transmute | น้ำตาลวิเศษ | Common → Magic (เติม 1 affix สุ่ม) |
| 🟢 Alteration | ครีมแปรผัน | สุ่ม affix ของ Magic ใหม่ทั้งหมด |
| 🟡 Regal | คำสั่งราชวัง | Magic → Rare (+1 affix) |
| 🟠 Chaos | ความโกลาหล | สุ่ม affix ทั้งหมดของ Rare ใหม่ |
| 🔴 Exalt | แก่นรสสูงสุด | เพิ่ม affix ใหม่ให้ Rare (ถ้ายังไม่เต็ม) — หายาก |
| ⚪ Divine | พรวิเศษ | สุ่มเฉพาะ "ค่า" คงชนิด+tier (จูนโรลให้เพอร์เฟกต์) |
| ⚫ Scour | ล้างรส | ลบ affix ทั้งหมด (กลับ Common) |
| 🟣 Annul | ลบเลือน | ลบ affix สุ่ม 1 อัน |

### 2.1 Crafting loop (endgame)
```
ล่าของฐานดี (นรก, ilvl สูง)
  → Transmute/Alteration หา magic ที่ affix ดี
  → Regal ขึ้น rare
  → Exalt เติม affix / Chaos สุ่มใหม่
  → Divine จูนค่าให้ T1 perfect
= การ grind ที่มีเป้าหมายชัด + ลุ้นทุกครั้ง (RNG dopamine)
```

### 2.2 ที่มา currency (เคารพกฎเหล็ก)
- ดรอปในด่าน (rarity ต่ำ = Transmute บ่อย, สูง = Exalt/Divine หายาก)
- **ยิ่งยาก currency ยิ่งดี/เยอะ** (นรกเท่านั้นดรอป Exalt/Divine)
- ขายของซ้ำ/ไม่ใช้ที่ Bazaar → ได้ currency ต่ำ
- ตัน tier: Scour/Annul ราคาถูก (ของพื้นฐาน)

---

## 3. NPC Bazaar (ตลาดในเกม)

หน้าเมนูใหม่ `bazaar` (เข้าจากกลุ่ม 🎒 คลัง&พลัง) — พ่อค้าโมจิ NPC

### 3.1 แท็บ ขาย (Sell)
- ขายไอเทมในคลังที่ไม่ใช้ → ได้ 🍬 Sugar + currency ต่ำตาม rarity
- "ขายทั้งหมดที่ต่ำกว่า Rare" (quick sell กันคลังล้น)

### 3.2 แท็บ ซื้อ (Shop) — หมุนเวียนรายวัน
- ขาย **ของฐาน** (base item) ราคา Sugar
- ขาย **currency** ราคา Sugar (คนไม่ดรอปพอ ซื้อเติมได้)
- สต็อกสุ่มรีเฟรชทุกวัน (ผูก daily seed)

### 3.3 แท็บ เสี่ยงดวง (Gamble) — PoE "vendor gamble"
- จ่าย 🍬/currency → ได้ไอเทมสุ่ม rarity+affix (ilvl ตามด่านที่ปลด)
- ลุ้นได้ของ rare affix ดี = ฟีน endgame ก่อน grind หนัก

### 3.4 แท็บ คราฟต์ (Craft Bench)
- เลือกไอเทม + ใช้ currency ที่มี → เห็นผลก่อน/หลัง (โชว์ affix เปลี่ยน)
- อนิเมชันคราฟต์ + เสียง (juice)

---

## 4. โครงสร้างข้อมูล (map เข้าโค้ดปัจจุบัน)

### 4.1 ต่อยอดของที่มี
- **มีแล้ว:** `Save.data.gearAffix[id]` (v2.88) → ขยายเป็น `{mod, tier, v, kind:'prefix'|'suffix'}`
- **มีแล้ว:** `Save.data.shards` (v2.87) → คงไว้เป็น currency พื้นฐาน (หรือแปลงเป็น Transmute)
- **ต้องเพิ่ม:** `Save.data.currency = {transmute:0, alt:0, regal:0, chaos:0, exalt:0, divine:0, scour:0, annul:0}`
- **ต้องเพิ่ม:** `Save.data.stash = []` — คลังไอเทมที่ roll เอง (ปัจจุบัน gear เป็น id ตายตัว 1 ชิ้น/แบบ → ต้องเปลี่ยนเป็น "instance มี affix ต่อชิ้น")

### 4.2 ⚠️ จุดเปลี่ยนใหญ่สุด: item = instance ไม่ใช่ id
- ปัจจุบัน: `ownedGear=[id]`, สวมได้ 1 ชิ้น/แบบ, affix ผูกกับ id
- PoE ต้องการ: **หลายชิ้นฐานเดียวกัน โรลต่างกัน** → ต้องมี `stash` เก็บ item instance `{base:'w_knife', rarity, affixes:[...], ilvl}`
- = งานรื้อโครง gear/inventory พอสมควร (ค่อยทำเป็น Phase 2)
- **ทางประนีประนอม Phase 1:** คง 1 ชิ้น/แบบ + คราฟต์ affix ในตัว (ทำได้เลย) → เต็มระบบ stash ค่อยตามมา

---

## 5. แผนทำเป็นเฟส (single-player)

| Phase | งาน | รื้อโครงมากไหม |
|---|---|---|
| **1** | Prefix/Suffix + Affix Tier T1-T5 + ชื่อไอเทม + reroll เดิมอ่าน tier | น้อย (ต่อ affix เดิม) |
| **2** | Currency system (8 orb) + Craft Bench (คราฟต์ affix ของชิ้นที่สวม) | กลาง |
| **3** | Item instance + Stash (หลายชิ้น/แบบ) — ปลดล็อก loot chase เต็ม | **มาก** (รื้อ inventory) |
| **4** | NPC Bazaar (ขาย/ซื้อ/gamble/craft UI รวม) | กลาง |
| **5 (อนาคต)** | P2P trade board (Supabase async + anti-cheat) | **มหาศาล** |

### ลำดับแนะนำ
1. Phase 1 (itemization ลึกก่อน — เห็นผลชัด เสี่ยงต่ำ)
2. Phase 2 (currency crafting — สร้าง loop)
3. Phase 4 (Bazaar UI) ก่อน Phase 3 ก็ได้ (ขาย/ซื้อ/gamble ใช้ระบบ 1 ชิ้น/แบบไปก่อน)
4. Phase 3 (stash instance) เมื่อพร้อมรื้อ inventory — ปลดล็อก "เก็บของหลายชิ้นเทียบโรล"
5. Phase 5 เมื่อเกมมีผู้เล่นจริง

---

## 6. กันเกมพัง (บาลานซ์ + scope)
- **Stat creep:** affix tier ต้องมีเพดาน + ไม่ทับกับ Rank/Talent/Set มากไป (คุมด้วย diminishing/clamp เดิมใน cookDish/applyMeta)
- **คลังล้น:** quick-sell + cap stash
- **RNG ท้อ:** ให้ deterministic craft บางส่วน (Craft Bench เลือก mod ได้ 1 อันด้วย currency แพง) กัน grind ตันจนเลิก
- **เซฟเก่า:** default fields + migration ใน `Save.load` (แบบที่ทำกับ cookbook/shards)

---

## 7. Phase 5 (อนาคต) — P2P Trade ถ้าจะทำจริง
- **ต้องมีก่อน:** ย้าย validation ไป server (Supabase Edge Function) — client ส่ง item, server ตรวจ affix ถูกกติกา (mod/tier/ilvl valid) ก่อนรับเข้าตลาด
- รูปแบบปลอดภัยสุด: **async trade board** (ฝากขายด้วย in-game currency) ไม่ใช่ real-time
- ความเสี่ยง: ดูแลเศรษฐกิจ, บอท, ค่ารัน → ทำเมื่อคุ้มเท่านั้น

---

## 8. สรุป Next Step
เริ่ม **Phase 1** (Prefix/Suffix + Affix Tier) เป็นก้อนแรก — ต่อ affix เดิม, เห็นฟีล PoE ทันที, เสี่ยงต่ำสุด
แล้วค่อยไล่ 2 → 4 → 3 ตามลำดับข้างบน
