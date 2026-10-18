# 26 — ม่านสลับหน้าเมนู + ไอคอนการ์ดที่ยังไม่มีของตัวเอง · ใบสั่งงานอาร์ต

สถานะ: 🟨 รอผลิต (เขียน 18 ต.ค. 2026)
ส่งไฟล์ที่ `assets/incoming/transition_card_icons/` พร้อม `MANIFEST.json`, `PROMPTS.json`, `QA_REPORT.json` (รูปแบบเดียวกับใบ 21–25)

---

## A — ม่านสลับหน้าเมนู (Page Transition) · 5 ไฟล์

### ตอนนี้หน้าตาเป็นยังไง
v7.8.60 มีแอนิเมชันสลับหน้าแล้ว (`menuTransition`): **สี่เหลี่ยมม่วงเข้มเรียบ ๆ เต็มจอ + เส้นชมพูบาง ๆ ที่ขอบ** ปาดออกใน 0.3 วิ
- ไปหน้าใหม่ = ม่านปาดออกไปทาง **ซ้าย** (ขอบนำอยู่ด้านขวาของม่าน)
- กดย้อนกลับ = ม่านปาดออกไปทาง **ขวา** (โค้ดกลับด้านภาพเอง ไม่ต้องวาด 2 ทิศ)
- ข้อห้ามจากโค้ด: เมนูห้ามโปร่ง (เคยเห็นพื้นโลกสีเขียววาบ) → ม่านต้อง **ทึบสนิทตรงกลาง**

### เป้าหมาย
ม่านที่ดูเป็น "ผ้าม่านร้านขนม / ครีมปาด" เข้ากับธีม ขอบนำมีครีม/ริบบิ้นหยัก + ประกาย และมีตราโลโก้เล็ก ๆ ลอยกลางม่านตอนเปลี่ยนหน้า

### กฎ
- ไม่มีตัวหนังสือ · ชิ้น UI = PNG32 โปร่งใสจริง · VFX = พื้นดำสนิท #000
- โทนเดียวกับใบ 21–25: ม่วงเข้ม `#24142f` / `#2a1830` + ชมพูแคนดี้ `#ff7aa8` + ครีม `#ffe9c4` + ทองอุ่น `#e8c27a`

| # | ไฟล์ | ⭐ | ขนาดไฟล์ | รายละเอียด | โค้ดทำอะไร |
|---|---|---|---|---|---|
| A1 | `tr_curtain.png` | ⭐⭐⭐ | 1080×1920 **ทึบ 100%** | ผืนม่าน: ม่วงเข้มลายผ้าซาตินจาง ๆ + ลายจุดลูกกวาดเล็ก ๆ / ลายเกลียวครีมจาง · **ซ้าย-ขวาต่อกันได้ (tile แนวนอน)** เพราะโค้ดเลื่อนยาวกว่าจอ | แทนสี่เหลี่ยมม่วง |
| A2 | `tr_edge.png` | ⭐⭐⭐ | 160×1920 โปร่ง · **ต่อบน-ล่างได้** | ขอบนำของม่าน: ครีมปาด/ฟรอสติ้งหยักเป็นคลื่นแนวตั้ง ขอบชมพู-ทอง มีเม็ดน้ำตาลโรยติด · ด้านซ้ายของไฟล์ = ชิดผืนม่าน (ทึบ) · ด้านขวา = ขอบหยักโปร่ง | วางชิดขอบม่านทุกเฟรม (แทนเส้นชมพู) |
| A3 | `vfx_tr_edge_sparkle.png` | ⭐⭐ | 1×4 = 4 · loop · เฟรม 256×512 (แนวนอน 1024×512) พื้นดำ | ประกายดาว/เกล็ดน้ำตาลกระเด็นออกจากขอบนำ (แนวตั้ง ฝั่งขวาของเฟรม) | ติดตามขอบนำ 2–3 ตัวซ้อนแนวตั้ง |
| A4 | `tr_emblem.png` | ⭐⭐ | 512×512 โปร่ง | ตราวงกลมเล็ก: โมจิชมพูหน้ายิ้มในวงทองมีโบว์ (ไม่มีตัวหนังสือ) | ลอยกลางม่าน หมุน+ย่อหายตอนม่านปาดออก |
| A5 | `vfx_tr_puff.png` | ⭐ | 3×2 = 6 · ครั้งเดียว · เฟรม 256 พื้นดำ | ควันน้ำตาลไอซิ่ง/ฝุ่นแป้งฟุ้งเป็นวง | เล่นตอนตราหายกลางจอ |

---

## B — ไอคอนการ์ดที่ยังไม่มีของตัวเอง · 77 ไฟล์

### ตอนนี้หน้าตาเป็นยังไง
การ์ดเลเวลอัพ (ใบ 23) มีวงรองไอคอนใหม่แล้ว แต่การ์ดกลุ่มนี้ **ยังไม่มีไอคอนเฉพาะ**:
- **Modifier / Trade-off** → แสดงเป็น **อีโมจิ** ในวงไอคอน
- **Mutation / Evolution / Fusion / Infusion** → ใช้ **ไอคอนอาวุธประจำตัวซ้ำ** (ทุกใบหน้าตาเหมือนกัน แยกไม่ออก)
- **Relic 4 ชิ้น** → อีโมจิ (ทั้งบนการ์ด แถบ Relic และหน้าหยุดเกม)
- **การ์ดอัป Cocoa 2 ใบ** → ใช้ไอคอนอาวุธซ้ำ

> **ไม่รวม Yuzu** (สกิล Citrus Crew, การ์ดอัป 5 ใบ, Mutation 3, Evolution, Modifier 6, Fusion 2) เพราะ Yuzu กำลังจะถูกออกแบบใหม่ทั้งตัว — สั่งพร้อมชุด Yuzu ใหม่ทีหลัง

### กฎของไอคอน
1. **PNG32 256×256 โปร่งใสจริง** · สัญลักษณ์เดี่ยวกลางภาพ ขอบห่างขอบไฟล์ ≥ 16px · **อ่านออกที่ 24px** (แถบ Skills/Relics) และสวยที่ 90px (วงไอคอนการ์ด)
2. **ไม่มีตัวหนังสือ ตัวเลข** · ไม่มีพื้นหลัง/กรอบวงกลม (การ์ดมีวงรองให้แล้ว)
3. สไตล์เดียวกับไอคอนที่มีแล้วใน `assets/art/build_paths/` (เช่น `p_blitz.webp`) และ `assets/art/icons/relic_*.webp`: เพนต์นุ่ม ขอบเข้ม ไฮไลต์สว่าง เงาใต้ภาพบาง ๆ
4. **สีตามตัวละคร** (ตามคอลัมน์ "ตัวละคร") เพื่อให้ผู้เล่นรู้ทันทีว่าเป็นการ์ดของใคร · ใช้อีโมจิเดิมเป็น *ไอเดียตั้งต้น* ได้ แต่ต้องเล่าเรื่องจาก "ผลในเกม"
5. ระดับความหรูต่างกันตามประเภท: Modifier = สัญลักษณ์เรียบ · **Fusion = ใหญ่ หรู มีออร่า** · Mutation = มีเกลียว DNA/เถาเล็ก ๆ ประกอบ · **Evolution = ทองเรือง มีประกายรัศมี** (เป็นร่างทองของอาวุธประจำตัว) · Trade-off = **ครึ่งสว่างครึ่งร้าว** (สื่อได้-เสีย)
6. ไอคอนอาวุธเดิมของแต่ละตัว (ใช้อ้างอิงหน้าตาอาวุธสำหรับ Evolution): Momo ปืนเมล็ดหัวใจ · Mint หอกน้ำแข็ง/แกนลมเย็น · Cocoa ถุงมือตราหมี · Taro เข็มทิศสายฟ้า · Sesame กระจกคำสัตย์ · Berry Core ปืนแกนแยม (ดู `docs/CHARACTER_BIBLE.md`)

### C1 · Relic (ไอคอนวงกลมรอบตัว ใช้ทั้งการ์ดและหน้าหยุด/แถบ Relic) — 4 ไฟล์

| ไฟล์ | ชื่อในเกม | อีโมจิเดิม | ตัวละคร | ผลในเกม (ให้ภาพสื่อความหมายนี้) |
|---|---|---|---|---|
| `relic_firstbite.png` | First Bite | 🎯 | ทุกตัวละคร | Your first hit against each enemy deals 35% more damage. |
| `relic_dashcharge.png` | Spark Step | ⚡ | ทุกตัวละคร | After dashing, your next 3 hits within 3s deal 25% more damage. |
| `relic_trophy.png` | Hunter Trophy | 🏆 | ทุกตัวละคร | Defeating an elite, miniboss or boss grants 1 shield (max 1). |
| `relic_harvest.png` | Mochi Harvest | 🍵 | ทุกตัวละคร | Every 20 enemy kills restore 5% max HP. |

### C2 · Modifier (การ์ด ✦ MODIFIER) — 30 ไฟล์

| ไฟล์ | ชื่อในเกม | อีโมจิเดิม | ตัวละคร | ผลในเกม (ให้ภาพสื่อความหมายนี้) |
|---|---|---|---|---|
| `ic_mod_bloom.png` | Seed Bloom | 🌸 | Momo (สตรอว์เบอร์รี ชมพู #ff8fb5) | 12% of hits burst into a small blast |
| `ic_mod_love.png` | Love Chain | 💘 | Momo (สตรอว์เบอร์รี ชมพู #ff8fb5) | 15% of hits arc to 2 nearby enemies |
| `ic_mod_heart.png` | Big Heart | 💗 | Momo (สตรอว์เบอร์รี ชมพู #ff8fb5) | Every 7th hit deals ×3 damage |
| `ic_mod_aim.png` | Steady Aim | 🎯 | Momo (สตรอว์เบอร์รี ชมพู #ff8fb5) | +25% damage while standing still |
| `ic_mod_jam.png` | Jam Mine | 🍓 | Momo (สตรอว์เบอร์รี ชมพู #ff8fb5) | Slain enemies leave a jam mine that pops |
| `ic_mod_spray.png` | Dash Spray | 💨 | Momo (สตรอว์เบอร์รี ชมพู #ff8fb5) | Dashing drops 3 exploding seeds |
| `ic_mod_icemine.png` | Ice Mine | ❄️ | Mint (น้ำแข็ง ฟ้า #8fd0ff) | Slain enemies leave an ice mine that freezes |
| `ic_mod_shatter.png` | Shatter | 💎 | Mint (น้ำแข็ง ฟ้า #8fd0ff) | +50% damage to frozen enemies |
| `ic_mod_flurry.png` | Flurry Pulse | 🌨️ | Mint (น้ำแข็ง ฟ้า #8fd0ff) | Every 4s a frost pulse hits and freezes around you |
| `ic_mod_throw.png` | Long Throw | 🏹 | Mint (น้ำแข็ง ฟ้า #8fd0ff) | +30% damage to enemies far away |
| `ic_mod_glide.png` | Glide Nova | 🌬️ | Mint (น้ำแข็ง ฟ้า #8fd0ff) | Dashing releases a cold blast |
| `ic_mod_coldarc.png` | Cold Arc | 🧊 | Mint (น้ำแข็ง ฟ้า #8fd0ff) | 12% of hits arc and chill 2 enemies |
| `ic_mod_quake.png` | Quake Fist | 🌋 | Cocoa (ช็อกโกแลต น้ำตาล-ส้ม #f5bd7c) | Every 6th hit ×2.5 and shakes the ground |
| `ic_mod_stomp.png` | Bear Stomp | 🐾 | Cocoa (ช็อกโกแลต น้ำตาล-ส้ม #f5bd7c) | Dashing ends in a heavy stomp |
| `ic_mod_rage.png` | Rolling Rage | 🔥 | Cocoa (ช็อกโกแลต น้ำตาล-ส้ม #f5bd7c) | +20% damage while moving |
| `ic_mod_crush.png` | Close Crush | 👊 | Cocoa (ช็อกโกแลต น้ำตาล-ส้ม #f5bd7c) | +30% damage to enemies right next to you |
| `ic_mod_ko.png` | Knockout | 💀 | Cocoa (ช็อกโกแลต น้ำตาล-ส้ม #f5bd7c) | +60% damage to enemies under 25% HP |
| `ic_mod_after.png` | Aftershock | 💥 | Cocoa (ช็อกโกแลต น้ำตาล-ส้ม #f5bd7c) | 25% of kills explode |
| `ic_mod_over.png` | Overcharge | ⚡ | Taro (สายฟ้า ม่วง #d3a1ff) | 20% of hits arc to 3 enemies |
| `ic_mod_field.png` | Static Field | 🌀 | Taro (สายฟ้า ม่วง #d3a1ff) | Every 3s a static pulse hits around you |
| `ic_mod_step.png` | Thunder Step | 👣 | Taro (สายฟ้า ม่วง #d3a1ff) | Dashing leaves a thunderclap |
| `ic_mod_judge.png` | Judgment | ⚖️ | Taro (สายฟ้า ม่วง #d3a1ff) | +25% damage to elites, minibosses and bosses |
| `ic_mod_ion.png` | Ion Burst | 💥 | Taro (สายฟ้า ม่วง #d3a1ff) | 20% of kills burst with lightning |
| `ic_mod_focus.png` | Focus Bolt | 🎯 | Taro (สายฟ้า ม่วง #d3a1ff) | Every 8th hit deals ×3 damage |
| `ic_mod_prism.png` | Prism Burst | 🔮 | Sesame (กระจก ขาวเงิน #e9e3f6) | 10% of hits burst into light |
| `ic_mod_lens.png` | Steady Lens | 🧘 | Sesame (กระจก ขาวเงิน #e9e3f6) | +30% damage while standing still |
| `ic_mod_scope.png` | Far Sight | 🔭 | Sesame (กระจก ขาวเงิน #e9e3f6) | +30% damage to enemies far away |
| `ic_mod_refract.png` | Refract | ✨ | Sesame (กระจก ขาวเงิน #e9e3f6) | 15% of hits split to 2 enemies |
| `ic_mod_mirror.png` | Mirror Mine | 🪞 | Sesame (กระจก ขาวเงิน #e9e3f6) | Slain enemies leave a mirror shard that explodes |
| `ic_mod_exec.png` | Execution Beam | 💀 | Sesame (กระจก ขาวเงิน #e9e3f6) | +50% damage to enemies under 30% HP |

### C3 · Fusion (การ์ด ✦ FUSION — หรูกว่า Modifier) — 10 ไฟล์

| ไฟล์ | ชื่อในเกม | อีโมจิเดิม | ตัวละคร | ผลในเกม (ให้ภาพสื่อความหมายนี้) |
|---|---|---|---|---|
| `ic_fus_heartburst.png` | Heartburst Blaster | 💥 | Momo (สตรอว์เบอร์รี ชมพู #ff8fb5) | 25% of hits explode in a big heart blast |
| `ic_fus_crownseed.png` | Crown Seed | 👑 | Momo (สตรอว์เบอร์รี ชมพู #ff8fb5) | Every 4th hit ×3.5 and bursts |
| `ic_fus_glacier.png` | Living Glacier | 🏔️ | Mint (น้ำแข็ง ฟ้า #8fd0ff) | Every 2.5s a huge freezing wave |
| `ic_fus_shardstorm.png` | Shardstorm | 💠 | Mint (น้ำแข็ง ฟ้า #8fd0ff) | 30% of hits arc and freeze 3 enemies |
| `ic_fus_quakeking.png` | Quake King | 🌋 | Cocoa (ช็อกโกแลต น้ำตาล-ส้ม #f5bd7c) | Every dash ends in a massive quake |
| `ic_fus_lastbear.png` | Last Bear Standing | 🐻 | Cocoa (ช็อกโกแลต น้ำตาล-ส้ม #f5bd7c) | ×2 damage to enemies under 40% HP |
| `ic_fus_tempest.png` | Living Tempest | 🌩️ | Taro (สายฟ้า ม่วง #d3a1ff) | 35% of hits arc to 4 enemies |
| `ic_fus_skyjudge.png` | Sky Judge | ⚖️ | Taro (สายฟ้า ม่วง #d3a1ff) | +60% damage to elites and bosses |
| `ic_fus_prismnova.png` | Prism Nova | 🔮 | Sesame (กระจก ขาวเงิน #e9e3f6) | 20% of hits burst into a prism nova |
| `ic_fus_horizon.png` | Event Horizon | 🌅 | Sesame (กระจก ขาวเงิน #e9e3f6) | +70% damage to distant enemies |

### C4 · Mutation (การ์ด 🧬 MUTATION) — 13 ไฟล์

| ไฟล์ | ชื่อในเกม | อีโมจิเดิม | ตัวละคร | ผลในเกม (ให้ภาพสื่อความหมายนี้) |
|---|---|---|---|---|
| `ic_mut_momo_ricochet.png` | Heart Ricochet | 💞 | Momo (สตรอว์เบอร์รี ชมพู #ff8fb5) | Seeds bounce to 2 new targets |
| `ic_mut_momo_fan.png` | Petal Spread | 🌸 | Momo (สตรอว์เบอร์รี ชมพู #ff8fb5) | Wider fan and +2 shots |
| `ic_mut_cocoa_rush.png` | Rushdown | 💨 | Cocoa (ช็อกโกแลต น้ำตาล-ส้ม #f5bd7c) | Finishers add 2 light follow-up punches; combo cooldown is 18% shorter (Titan: every pound adds a 35% tremor wave) |
| `ic_mut_cocoa_breaker.png` | Earthbreaker | 💢 | Cocoa (ช็อกโกแลต น้ำตาล-ส้ม #f5bd7c) | Finishers deal +25% damage and make one aftershock (Fire Fist: +25% fireball damage and blast; Titan: +12% pounds with a 25% aftershock) |
| `ic_mut_cocoa_counter.png` | Counter Bear | 🔁 | Cocoa (ช็อกโกแลต น้ำตาล-ส้ม #f5bd7c) | Dash recharges 40% faster and you take 30% less damage while the Dash buff is active |
| `ic_mut_berry_seeker.png` | Core Seeker | 🎯 | Berry Core (แยม แดง #ff6a5a) | Faster lock-on and +20% blast |
| `ic_mut_berry_sticky.png` | Sticky Jam | 🫙 | Berry Core (แยม แดง #ff6a5a) | +35% blast radius and briefly pins enemies |
| `ic_mut_mint_blizzard.png` | Shatter Lance | 🌨️ | Mint (น้ำแข็ง ฟ้า #8fd0ff) | Impact splash: Crystal Impaler hits nearby foes at 25% power; other paths at 50%. Barrage/Glacier also gain 25% Frozen-hit bonus. |
| `ic_mut_mint_permafrost.png` | Eternal Frost | 🥶 | Mint (น้ำแข็ง ฟ้า #8fd0ff) | Normal enemies freeze at 3 stacks instead of 4; freezes last longer and lances deal 15% more. Glacier bosses gain Brittle instead of Freeze. |
| `ic_mut_taro_chainlord.png` | Chainlord | ⛓️ | Taro (สายฟ้า ม่วง #d3a1ff) | +2 chains and +40% chain range |
| `ic_mut_taro_stormcaller.png` | Stormcaller | 🌩️ | Taro (สายฟ้า ม่วง #d3a1ff) | +2 simultaneous strikes and +20% damage |
| `ic_mut_sesame_fortress.png` | Mirror Fortress | 🏰 | Sesame (กระจก ขาวเงิน #e9e3f6) | +25% circle radius |
| `ic_mut_sesame_retaliate.png` | Retaliation | 💢 | Sesame (กระจก ขาวเงิน #e9e3f6) | +30% pulse power and slows hit enemies |

### C5 · Evolution (การ์ด ✨ EVOLUTION — ทองเรืองที่สุด) — 6 ไฟล์

| ไฟล์ | ชื่อในเกม | อีโมจิเดิม | ตัวละคร | ผลในเกม (ให้ภาพสื่อความหมายนี้) |
|---|---|---|---|---|
| `ic_evo_momo.png` | Heartstorm Blaster | ✨ | Momo (สตรอว์เบอร์รี ชมพู #ff8fb5) | Evolution: ปืนเมล็ดหัวใจร่างทองยักษ์ พายุหัวใจรอบตัว |
| `ic_evo_cocoa.png` | Chocolate Path Evolution | ✨ | Cocoa (ช็อกโกแลต น้ำตาล-ส้ม #f5bd7c) | Evolution: ถุงมือตราหมีร่างทอง ไฟ/แผ่นดินแตก |
| `ic_evo_berry.png` | Jam Supernova | ✨ | Berry Core (แยม แดง #ff6a5a) | Evolution: แกนแยมระเบิดเป็นซูเปอร์โนวาแดง |
| `ic_evo_mint.png` | Glacier Sovereign | ✨ | Mint (น้ำแข็ง ฟ้า #8fd0ff) | Evolution: หอกน้ำแข็ง 3 แฉก มงกุฎธารน้ำแข็ง |
| `ic_evo_taro.png` | Stormstep Sovereign | ✨ | Taro (สายฟ้า ม่วง #d3a1ff) | Evolution: เข็มทิศสายฟ้าร่างทอง พายุฟ้าผ่ารอบตัว |
| `ic_evo_sesame.png` | Absolute Oath Mirror | ✨ | Sesame (กระจก ขาวเงิน #e9e3f6) | Evolution: กระจกคำสัตย์ร่างสมบูรณ์ แสงสาบานส่องทะลุ |

### C6 · Trade-off (ได้ + เสีย — ไอคอนครึ่งดีครึ่งร้าย) — 8 ไฟล์

| ไฟล์ | ชื่อในเกม | อีโมจิเดิม | ตัวละคร | ผลในเกม (ให้ภาพสื่อความหมายนี้) |
|---|---|---|---|---|
| `ic_trade_glass.png` | Glass Heart | 💔 | ทุกตัวละคร | ✅ ×1.5 damage ❌ Max HP halved |
| `ic_trade_burn.png` | Slow Burn | 🕯️ | ทุกตัวละคร | ✅ Every hit ignites ❌ Attacks 30% slower |
| `ic_trade_armor.png` | Heavy Armor | 🛡️ | ทุกตัวละคร | ✅ Take 35% less damage ❌ Move 15% slower |
| `ic_trade_rush.png` | Sugar Rush | 🍬 | ทุกตัวละคร | ✅ +25% speed, -15% cooldowns ❌ Take 25% more damage |
| `ic_trade_berserk.png` | Berserker | 😤 | ทุกตัวละคร | ✅ Up to ×2 damage as HP drops ❌ No HP regeneration |
| `ic_trade_core.png` | Frozen Core | 🧊 | ทุกตัวละคร | ✅ 30% of hits chill ❌ -15% damage |
| `ic_trade_feast.png` | Hungry Pact | 🌀 | ทุกตัวละคร | ✅ +20% damage, +30% EXP ❌ Healing items do nothing |
| `ic_trade_oath.png` | Sniper’s Oath | 🎯 | ทุกตัวละคร | ✅ +20% crit chance ❌ Attacks 20% slower |

### C7 · Flavor Infusion (รสชาติ 4 แบบ) — 4 ไฟล์

| ไฟล์ | ชื่อในเกม | อีโมจิเดิม | ตัวละคร | ผลในเกม (ให้ภาพสื่อความหมายนี้) |
|---|---|---|---|---|
| `ic_inf_spicy.png` | Spicy Infusion | 🌶️ | ทุกตัวละคร | ×0.85 hit damage · hits Burn for 30% of the hit over 2s |
| `ic_inf_sour.png` | Sour Infusion | 🍋 | ทุกตัวละคร | ×0.9 hit damage · hits make enemies take +12% damage for 3s |
| `ic_inf_sweet.png` | Sweet Infusion | 🍯 | ทุกตัวละคร | ×0.9 hit damage · hits heal 0.5% max HP (every 0.3s) |
| `ic_inf_minty.png` | Minty Infusion | 🌿 | ทุกตัวละคร | ×0.9 hit damage · 30% chance to chill non-boss enemies briefly |

### C8 · การ์ดอัปโจมตีปกติที่ยังขาด — 2 ไฟล์

| ไฟล์ | ชื่อในเกม | อีโมจิเดิม | ตัวละคร | ผลในเกม (ให้ภาพสื่อความหมายนี้) |
|---|---|---|---|---|
| `ic_cocoa_dashp.png` | Dash Stack | 🐾 | Cocoa (ช็อกโกแลต น้ำตาล-ส้ม #f5bd7c) | +1 stored Dash charge per rank, and each Dash boosts combo damage +15% for 2.5s |
| `ic_cocoa_drum.png` | Drum Heart | 🥁 | Cocoa (ช็อกโกแลต น้ำตาล-ส้ม #f5bd7c) | Landed punches and taking hits refund 15% more Unique cooldown per rank; minimum reuse time still applies |
รวม **82 ไฟล์** (A 5 · B 77)

## ลำดับความสำคัญ (ถ้าทำทีละรอบ)
1. **รอบ 1:** C5 Evolution 6 · C3 Fusion 10 · C1 Relic 4 (การ์ดหายากที่สุด = อยากให้เด่นที่สุด) + A1 A2
2. **รอบ 2:** C2 Modifier 30 · C4 Mutation 13
3. **รอบ 3:** C6 Trade-off 8 · C7 Infusion 4 · C8 Basic 2 · A3–A5

## MANIFEST.json (ต่อไฟล์)
```json
{ "key": "ic_mod_love", "file": "ic_mod_love.png", "width": 256, "height": 256,
  "columns": 1, "rows": 1, "frameWidth": 256, "frameHeight": 256, "frameCount": 1,
  "background": "transparent", "hero": "momo", "category": "modifier", "sha256": "...", "bytes": 0 }
```
VFX (A3, A5) ใส่ `"background": "#000000"`, `columns/rows/frameCount`, `loop`

## QA ก่อนส่ง
- [ ] ไม่มีตัวหนังสือ/ตัวเลข · โปร่งใสจริง (ไม่มีพื้นขาว/เทา) · VFX พื้นดำสนิท
- [ ] ไอคอน: แผ่นรวมทุกไอคอนย่อที่ **24px** และ **90px** บนพื้นม่วงเข้ม `#21172b` (แนบใน QA_REPORT) — อ่านออกและไม่ซ้ำกันเอง
- [ ] ไอคอนของตัวละครเดียวกันโทนสีเข้าชุดกัน · Fusion/Evolution ดูหรูกว่า Modifier ชัดเจน
- [ ] A1 ต่อซ้าย-ขวาไม่เห็นรอย · A2 ต่อบน-ล่างไม่เห็นรอย (แนบภาพทดสอบต่อ 2 ชิ้น)
- [ ] ขนาดไฟล์ + hash ใน QA ตรงกับที่อัปบน GitHub ทุกไฟล์

## ฝั่งโค้ดจะผูกยังไง (โน้ตสำหรับ AI ที่ทำต่อ)
- แพ็กไอคอนเป็น WebP 128×128 (การ์ดโชว์ ≤ 90px) ไป `assets/art/card_icons/` · lazy โหลดพร้อมฮีโร่ (ใส่ชื่อฮีโร่ในคีย์ หรือเพิ่มเข้า `PLAY_UI_KEYS`/STAGE_SHEETS ตามขนาดรวม) · Relic ไป `assets/art/icons/relic_<id>.webp` ตามของเดิม (`drawHeldBar`/`buildPauseArt` หา `relic_`+id อยู่แล้ว)
- ใส่ `iconKey` ให้แต่ละรายการใน `MODIFIERS` / `FUSIONS` / `TRADEOFFS` / `FLAVOR_INFUSIONS` / `BASIC_ATTACKS[h].mutations` / `BASIC_ATTACKS.cocoa.upgrades (dashp, drum)` · Evolution: ใน `rollBasicAttackUpgrades` ตัวแปร `evo` เพิ่ม `iconKey:'ic_evo_'+b.character` · การ์ด Modifier/Trade-off (สร้างใน object `{type:'basic',…kind:'Modifier'}` และ `kind:'Trade-off'`) เพิ่ม `iconKey`
- `drawReadableChoiceCard` ใช้ `o.iconKey` ถ้า texture มี → ไม่มี = อีโมจิ/ไอคอนอาวุธเดิม (fallback อัตโนมัติ)
- ม่าน: `menuTransition` → A1 เป็น TileSprite เลื่อน (ทิศกลับด้านด้วย `setFlipX`) · A2 ตามขอบ · A3 loop ที่ขอบ · A4+A5 กลางจอ · ระยะเวลา 0.3 วิเท่าเดิม · ไม่มีไฟล์ = ม่านสีเรียบแบบตอนนี้ · โหลดตอนบูต (เมนูใช้ทันที) — ตรวจ `tests/gpu-memory-budget.test.cjs` (ตอนนี้ cocoa 295/300 MB) → A1 ย่อเหลือ 540×960 พอ
