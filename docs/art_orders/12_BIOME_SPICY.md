# 12 · Biomes ในถ้ำ Delve (พื้นต่อรส + ของในฉาก)

> สร้างตาม `NEXT_BATCH_REQUEST.md` R1 (พื้น 5 ครั้ง + แผ่นรวมของในฉาก 1 ครั้ง) · ใบนี้คือสเปก/การใช้งานในเกม

ทุก key มีของชั่วคราวในโค้ดอยู่แล้ว (เล่นได้ก่อนอาร์ตมา) · ใส่ไฟล์ตาม key ใน `ASSET_IMAGES` แล้วเกมใช้ภาพจริงเอง

| รส | ในเกมตอนนี้ | พื้น | ของในฉาก |
|---|---|---|---|
| 🌶️ Spicy | ✅ เล่นได้ v6.33 | `biome_spicy_floor` | `biome_spicy_vent` ปล่องลาวาระเบิดเป็นจังหวะ (โชว์ ~110px) · `biome_spicy_ember` รอยไฟจากมอน Ember (~56px) |
| ❄️ Frosty | ⬜ ออกแบบแล้ว | `biome_frosty_floor` | `biome_frosty_pillar` แท่งน้ำแข็งบังกระสุน ทุบแตก · `biome_frosty_slick` พื้นลื่น |
| 🍬 Sweet | ⬜ | `biome_sweet_floor` | `biome_sweet_bomb` ลูกอมระเบิดได้ · `biome_sweet_trail` คราบเชื่อม |
| 🍋 Sour | ⬜ | `biome_sour_floor` | `biome_sour_pool` บ่อกรดบีบพื้นที่ · `biome_sour_drip` |
| 🍄 Fermented | ⬜ | `biome_fermented_floor` | `biome_fermented_pod` ฝักสปอร์ · `biome_fermented_patch` คราบรา |

- **พื้น:** 1024×1024 ทึบ ต่อขอบได้ทุกด้าน คอนทราสต์ต่ำ และต้องหม่นกว่าตัวละคร · ใช้ซ้ำเป็นพื้นหลังแผนที่ Delve ของรสนั้นด้วย
- **ของในฉาก:** มองจากบนลงล่าง โปร่งใส อ่านออกที่ขนาด 56–110px บนจอ

## ฝั่งโค้ด
- **ทำแล้ว:**
  - `setupBiome` ใช้ `biome_spicy_floor` ถ้ามี (ถ้ายังไม่มีจะวาดแทนใน `makeSpicyFloor`)
  - ปล่องลาวาและรอยไฟใช้ไฟล์ vent/ember ถ้ามี
- **ต้องทำเพิ่ม:**
  - แผนที่ Delve ใช้ `biome_<flavor>_floor` เป็นพื้นหลังแถบรส แทนคีย์ `delve_bg_<flavor>` (ยกเลิกคีย์นี้แล้ว)
