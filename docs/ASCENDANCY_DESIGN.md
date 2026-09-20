# 🌟 Ascendancy — Awakened Paths (ออกแบบระบบให้ตัวละครมีความหมาย)

> ปัญหาที่แก้: ตอนนี้ตัวละคร 5 ตัวต่างกัน "น้อยเกินไป" (แค่สแตต + อาวุธประจำตัว) การเลือกตัวเลยไม่มีน้ำหนัก
> เป้าหมาย: ให้แต่ละตัวมี **Awakened Path** (Ascendancy) 1 สายต่อรัน ที่เปลี่ยน *วิธีเล่น* จริง ผูกกับ lore ของ Mochi Core ตัวนั้น
> **In-game text = อังกฤษ** (ชื่อ path/node) · เอกสารนี้เป็นดีไซน์ dev (ไทยได้)

## หลักการ (สอดคล้องปรัชญาเกม)
- **ปลดล็อกหลังผ่านบอสจบ Chapter 1** (`stageMastery[4]`) — เกตเดียวกับ Zone Modifiers, ผู้เล่นใหม่เรียนรู้เกมก่อน
- **1 Path ต่อรัน** (mutually exclusive) เลือกก่อนเริ่มด่าน (ในหน้าเลือกตัวละคร/loadout) · เปลี่ยน (respec) ได้ฟรีในเมือง
- **แต้ม Ascendancy** มาจากเลเวลตัวละคร (`Save.cp(id).lvl`) ที่มีอยู่แล้ว — ไม่เพิ่มสกุลเงินใหม่
- แต่ละ Path = **1 Keystone (เปลี่ยนกลไก)** + 3-4 node เสริม (ปลดตามแต้ม) — ไม่ใช่แค่ +เลข
- ทุก Path ต้องมี **trade-off** (ได้อย่าง–เสียอย่าง) เหมือนที่ทำกับ Sesame/Cocoa แล้ว
- ผูกกับ lore: Awakened Form ขยาย "ความกลัว/ความปรารถนา" ของ Core → Path = ด้านที่ตัวละครยอมรับ

## โครงสร้างข้อมูล (implementation)
```
const ASCENDANCY = {
  momo: [ {id, name, emoji, lore, keystone:{desc, apply(p)/flags}, nodes:[{id,name,desc,apply}]} , ... ],
  ...
}
Save.data.ascendancy = { <charId>: {path:'<pathId>', nodes:['id',...]} }
Save.ascPath(id) / ascNodes(id) / setAscPath / buyAscNode / respecAsc
applyMeta(): อ่าน path keystone + nodes ของตัวละครปัจจุบัน → เสียบ flags/สแตต (เหมือน rankPerks)
buildAscendancy() : menuScreen 'ascend' เข้าจากหน้าเลือกตัวละคร (ปุ่ม 🌟 Awakened Path)
```
Keystone อาจตั้ง flag บน player (เช่น `p.ascGlassChef=true`) แล้วอ่านในจุด cast/damage ที่เกี่ยวข้อง (คล้าย `donutImpact`, `mirrorWard` เดิม)

---

## 🍓 Momo (Strawberry) — "Sweet but Strong"
Core ไส้สตรอว์เบอร์รี · ผู้พิทักษ์คนแรก · ธีม: เมล็ดหัวใจ, ความกล้าเปิดเผย

- **Path A — Seedstorm Gunner** (สายรัวเร็ว)
  - Keystone: Heart Seeds ยิงถี่ขึ้นมาก (+50% fire rate) แต่ดาเมจต่อเม็ด -25% · ทุกเม็ดมีโอกาส 12% แตกเป็น 2
  - Trade-off: เดี๋ยวดี damage per hit ต่ำ = อ่อนกับตัวถึก, พึ่งจำนวน
  - nodes: +pierce ทุก 3rd เม็ด · เก็บ kill = +fire rate ชั่วคราว (stack) · crit เม็ดที่เด้ง
- **Path B — Guardian Heart** (สายอึด/สนับสนุน)
  - Keystone: ทุกครั้งที่เก็บ heal/orb สร้าง "Heart Shield" ดูดซับ 1 hit (สะสมได้ 3) · แต่ fire rate -15%
  - Trade-off: ทนขึ้นมากแต่ DPS ลด — สายเล่นยาว/บอส
  - nodes: shield แตก = ระเบิดเมล็ดรอบตัว · regen ต่อ shield ที่ถือ · +pickup radius

## 🌿 Mint (Frostleaf) — "Cool and Agile"
Core มินต์ · ธีม: ลมเย็น, ควบคุมฝูง, เข็มน้ำแข็ง (rework แล้ว)

- **Path A — Diamond Sovereign** (สายแช่/ควบคุม)
  - Keystone: ศัตรูที่ถูกแช่ (frozen) รับดาเมจ +40% จากทุกแหล่ง · Frost Lance ปล่อยเข็มพิเศษใส่ตัวที่แช่อยู่
  - Trade-off: พึ่งการแช่ — บอส/มินิที่แช่ไม่ติดจะทำดาเมจได้น้อย
  - nodes: shatter แช่ลาม 1 ตัว · +radius สนามน้ำแข็ง · แช่นานขึ้น
- **Path B — Blizzard Rush** (สายเคลื่อนที่)
  - Keystone: ขณะเคลื่อนที่ทิ้ง "Frost Trail" ที่ชะลอ+ดาเมจ · ยิ่งเดินเร็วยิ่งแรง · แต่ถ้ายืนนิ่ง field หด
  - Trade-off: ต้องวิ่งตลอด (kite) — ตรงข้ามกับ Sesame ที่ยึดพื้นที่
  - nodes: dash = frost nova · +move speed · trail แตกเป็นเข็ม

## 🍫 Cocoa (Bear Core) — "Warm and Tough" (rework แล้ว = bruiser)
Core โกโก้ · ธีม: ถุงมือตราหมี, ประชิด, ทนถึก

- **Path A — Titan Breaker** (สายประชิดหนัก)
  - Keystone: Bear Slam ได้ shockwave เสมอ (ไม่ต้อง mutation) + ต่อยกระแทกไกลขึ้น · แต่ move speed -12%
  - Trade-off: แรง+AoE แต่ช้า, ต้องเข้าประชิด
  - nodes: slam ครั้งที่ 3 เด้ง 2 เท่า · knockback + stun สั้น · HP ต่ำ = ดาเมจสูง (execute)
- **Path B — Warmhearted Guard** (สายแทงค์/ยืนหน้า)
  - Keystone: ยืนนิ่ง 1.5s = สร้าง "Cocoa Aegis" ลดดาเมจ 40% + regen เร่ง · ขยับแล้วหาย
  - Trade-off: อึดมากเมื่อยึดพื้น แต่เสียโมเมนตัม
  - nodes: aegis สะท้อนดาเมจ · +max HP % · heal ตอนโดนตี

## 🍠 Taro (Rift Compass) — "Reads paths"
Core เผือก · ธีม: สายฟ้าชิ่ง (fix targeting แล้ว), เคลื่อนที่ไว, มิติ/รอยแยก

- **Path A — Chain Sovereign** (สายชิ่ง)
  - Keystone: สายฟ้าชิ่งไม่จำกัดจำนวน (ลามจนไม่มีเป้า) แต่ดาเมจลดลง 15% ต่อการชิ่ง
  - Trade-off: เก่งฝูง แต่ต่อ target เดียวอ่อน
  - nodes: ชิ่งกลับตัวเดิมได้ · +chain range · ตัวที่โดนชิ่ง 3+ ครั้ง = stun
- **Path B — Riftstep Duelist** (สายมิติ/หลบ)
  - Keystone: Dash เว้น cooldown สั้นลงมาก + ทิ้ง "Rift Bolt" ระเบิดจุดที่ dash ออก · แต่ HP -10%
  - Trade-off: คล่องตัวสุด แต่บอบบาง (glass)
  - nodes: dash ผ่านศัตรู = ฟาดสายฟ้า · dash คืน guard · +2 dash charge

## ⚫ Sesame (Oath Mirror) — "Position duelist" (rework แล้ว)
Core งาดำ · ธีม: วงเวทกระจก, Guard/Focus, คำสัตย์/การป้องกัน

- **Path A — Oathkeeper** (สายยึดพื้นที่)
  - Keystone: Focus เต็ม = field ปล่อย "Mirror Pulse" อัตโนมัติ (ดาเมจ+ผลัก) · Guard สูงสุด +50%
  - Trade-off: แข็งแกร่งเมื่อได้ยืน แต่ Focus reset ตอนขยับ = เสียของถ้าต้อง kite
  - nodes: pulse ลบกระสุน · guard ฟื้นเร็วขึ้น · field ใหญ่ขึ้นตาม Focus
- **Path B — Broken Vow** (สายเสี่ยง/สวนกลับ)
  - Keystone: เมื่อ Guard แตก (หมด) = ระเบิดกระจกสวนกลับ (ดาเมจหนักรอบตัว) + iframe สั้น · แต่ Guard สูงสุด -30% (แตกบ่อยขึ้น)
  - Trade-off: เปลี่ยน "การโดน" เป็นอาวุธ — ต้องเล่นบนขอบเหว
  - nodes: หลัง Guard แตก = ดาเมจ +30% ชั่วคราว · เศษกระจกไล่ตาม · lifesteal ตอนสวนกลับ

---

## UX / การนำเสนอ
- หน้า **Awakened Path** เข้าจากหน้าเลือกตัวละคร (ปุ่ม 🌟) — โชว์ Core lore สั้น + 2 การ์ด Path ให้เลือก + node tree ย่อย
- ล็อกก่อนผ่าน Ch.1: การ์ดเป็นเงา + "Clear The Great Hunger to awaken your path"
- ในรัน: ไอคอน Path มุมจอ (เหมือน unique button) เพื่อย้ำว่าเลือกสายอะไร

## ทำเป็นเฟส (แนะนำ)
1. **Phase 1** — data `ASCENDANCY` + Save fields + `applyMeta` เสียบ keystone (เริ่มจาก momo/sesame ที่ rework แล้ว) + หน้าเลือก Path (ยังไม่มี node tree)
2. **Phase 2** — node tree + แต้มจากเลเวลตัวละคร + respec
3. **Phase 3** — ครบ 5 ตัว + polish VFX/ไอคอนต่อ Path
