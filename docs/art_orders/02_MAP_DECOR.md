# 02 — ของตกแต่งพื้น (Map Decor) · batch `decor_<stage>`

## ระบบในเกม (มีแล้ว v5.51)
เกมแบ่งแผนที่เป็นช่อง 560px สุ่มวางของตกแต่ง 4–7 ชิ้น/ช่อง ด้วย seed คงที่ (กลับมาที่เดิมเจอของเดิม) · เป็นภาพล้วน **ไม่มีการชน ไม่บังการเดิน** · วาดใต้ตัวละครทุกตัว
ตอนนี้ใช้อีโมจิชั่วคราว → **ใส่ไฟล์ด้วย key เดิม = เกมใช้ภาพจริงทันที ไม่ต้องแก้โค้ด**

## สเปกทุกชิ้น
- **PNG 128×128 โปร่งใส** · มุม ¾ top-down · วัตถุกลางภาพ เว้นขอบ ~8px
- **แบน/เตี้ย** (ของติดพื้น) — ห้ามสูงเกิน ~60% ของเฟรม เพราะวาดใต้ตัวละคร ของสูงจะดูทะลุ
- เงานุ่มใต้วัตถุฝังในภาพได้ · ความสว่างต่ำกว่าตัวละคร · 1 ภาพ = 1 วัตถุ/1 กลุ่มเล็ก
- ไม่ต้องทำหลายมุม — เกมพลิกซ้ายขวา/หมุนเล็กน้อย/ย่อขยาย 0.8–1.3 เอง

## ชุด C2-1 The Fermented Canopy (ทำก่อน) — batch `decor_c21`
| key | วัตถุ | รายละเอียด |
|---|---|---|
| `dec_c21_mushroom` | กลุ่มเห็ดหมัก 2–3 ดอก | หมวกเขียวอมฟ้า จุดเรืองมิ้นต์ ก้านครีม |
| `dec_c21_moss` | กอตะไคร่/เฟิร์นเล็ก | แบนติดพื้น เขียวเข้ม ขอบเรืองจาง |
| `dec_c21_leaf` | ใบไม้ร่วง 1 ใบ | ส้มอิฐ-น้ำตาล มีเส้นใบ (เกมหมุนสุ่มเอง) |
| `dec_c21_puddle` | แอ่งน้ำหมักเรืองแสง | แบนมาก วงรี ขอบจางโปร่ง สีมิ้นต์ |
| `dec_c21_jar` | โหลแยมเก่าแตกครึ่ง | ของเล่าเรื่อง (ออกน้อย) แยมเขียวไหลซึม |
| `dec_c21_spore` | กลุ่มสปอร์เรืองลอยต่ำ | จุดแสงเล็ก 4–6 จุด สว่างสุดในชุด |
| `dec_c21_root` | รากไม้โผล่พื้น | ยาวแนวนอน 2–3 เส้น น้ำตาลเข้ม |
| `dec_c21_flower` | ดอกไม้เล็กเรืองแสง | กลีบเหลืองครีม ใจกลางเรือง |

## ชุดถัดไป (ฝั่งโค้ดจะเพิ่มแถวใน `STAGE_DECOR` ให้ — ส่งตาม key นี้ได้เลย)
แต่ละด่าน 8 ชิ้น สเปกเดียวกับข้างบน · key = `dec_<stage>_<name>`
| batch | ด่าน | ชิ้นที่แนะนำ (8) |
|---|---|---|
| `decor_c22` | Mycelium Marsh | mushroom_cluster, mycel_web, bog_puddle, spore_puff, reed, lilypad, bone_twig, glow_cap |
| `decor_c23` | Nectar Hive | comb_chunk, honey_drip, wax_puddle, pollen, petal, dead_bee_shell, flower_bud, jelly_blob |
| `decor_c24` | Four-Season Conservatory | spring_petals, summer_grass, autumn_leaves, winter_frost, broken_pot, glass_shard, vine, lamp |
| `decor_c25` | Root Throne | root_knot, crown_thorn, purple_crystal, root_puddle, skull_nut, rune_stone, vine_curl, glow_bulb |
| `decor_c31` | Ashen Seedfields | ash_pile, burnt_stalk, ember_seed, cracked_soil, scorch_mark, scarecrow_scrap, stone, smoke_wisp |
| `decor_c32` | Hollow Orchard | hollow_apple, fallen_leaves, dead_branch, core_seed, worm_hole, basket, fruit_rot, twig_bundle |
| `decor_c33` | Glass Greenhouse Ruins | glass_shard, frame_piece, sprout, pot_shard, crystal_moss, puddle_reflect, pipe, gear |
| `decor_c34` | The Seed Vault | vault_tile, seed_pod, gold_rune, chain, lock, dust_pile, pillar_stub, sealed_jar |
| `decor_c35` | Throne of the First Seed | gold_root, crown_shard, violet_crystal, seed_glow, throne_step, banner_scrap, candle, halo_ring |
