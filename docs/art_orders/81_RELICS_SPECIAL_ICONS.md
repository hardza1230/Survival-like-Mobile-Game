# 81 — ไอคอน Relic ที่ขาด · ไอคอนการ์ดพิเศษในห้องสมบัติ (Modifier / Trade-off) · การ์ด Build Path ที่ขาด · ใบสั่งงานอาร์ต

สถานะ: 🟡 รออาร์ต · เขียน 13 พ.ย. 2026 · โค้ดจุดที่จะใช้มีอยู่แล้ว (ห้องสมบัติ v8.1.122 · การ์ด Build Path v8.1.137) · ตอนนี้ใช้อีโมจิ/ไอคอนอาวุธแทน
ส่งไฟล์ที่ `assets/incoming/relics81/` พร้อม `MANIFEST.json`, `PROMPTS.json`, `QA_REPORT.json`
สไตล์ตาม `00_STYLE_GUIDE.md` · PNG32 alpha จริง · **ห้ามมีตัวหนังสือ ตัวเลข หรือสัญลักษณ์อ่านได้ในภาพ**

## ระบบในเกม (อ้างอิง)
- เลเวล 6/12/18 เปิด **ห้องสมบัติ** (Treasure Vault): ของ 3 ชิ้นลอยบนแท่นแก้ว แตะ = ซูม + อ่านผล แตะซ้ำ = เก็บ · ของในห้องมี 3 แบบ: **Relic** (ของวิเศษถาวรทั้งด่าน) · **Modifier** 🧩 (เปลี่ยนการโจมตีของฮีโร่ เช่น "12% of hits burst") · **Trade-off** ⚖️ (ได้อย่าง เสียอย่าง)
- Relic 14 จาก 22 ชิ้นมีไอคอนแล้ว (ใบ 06 `assets/art/icons/relic_*.webp`) · อีก 8 ชิ้นเป็นอีโมจิ · Modifier 36 ใบ และ Trade-off 5 ใบ ใช้ไอคอนอาวุธของฮีโร่ซ้ำกันทุกใบ (แยกไม่ออก)
- การ์ด Build Path ภาพวาด (ใบ 80) ยังไม่มีของ Yuzu → Yuzu ยังเห็นการ์ดแบบเก่า

## ไฟล์ที่ต้องการ

### A. ไอคอน Relic ที่ขาด (8) · 256×256 · โปร่งใส
โทนเดียวกับ relic เดิม: ของวิเศษขนม มีออร่าม่วงเรือง `#c07bff` จาง ๆ รอบตัว · ของชิ้นเดียวกลางภาพ เว้นขอบ ~10% · แสดงจริง 70px ในห้องสมบัติ และ 28px ในหน้าพัก → รูปทรงต้องอ่านออกที่ 28px
| ไฟล์ | ชื่อในเกม | ผลในเกม (ใช้คิดภาพ) |
|---|---|---|
| `relic_heavydough.png` | Heavy Dough 🥖 | +30% damage, but you attack 20% slower. Great for big single hits. |
| `relic_sugarrush.png` | Sugar Rush 🍭 | Attack 25% faster, but each hit deals 15% less. Great for many small hits. |
| `relic_frostcandy.png` | Frost Candy 🧊 | +30% damage to frozen, chilled or Brittle enemies. |
| `relic_copperwhisk.png` | Copper Whisk 🔌 | +30% damage to shocked enemies (Taro shock or Static Shock). |
| `relic_longspoon.png` | Long Spoon 🥄 | +25% damage to enemies more than 350px away. |
| `relic_crowdcrush.png` | Crowd Crusher 🍩 | +25% damage to enemies within 160px. |
| `relic_twinbake.png` | Twin Bake 🧁 | Your Unique skill deals 40% more damage and recharges 15% faster. |
| `relic_giantslayer.png` | Giant Slayer 🗡️ | +25% damage to elites, minibosses and bosses, but 10% less to normal enemies. |

### B. ไอคอน Modifier (36) · 256×256 · โปร่งใส
ทรง **เหรียญ/ตราเฟืองจิ๊กซอว์** (สื่อ 🧩) ขอบส้ม `#ff9f43` · กลางเหรียญเป็นภาพผลของ Modifier · สีพื้นในเหรียญตามโทนฮีโร่: Momo ชมพูสตรอว์เบอร์รี · Mint ฟ้าน้ำแข็ง · Cocoa ส้มไฟช็อกโกแลต · Taro ม่วงสายฟ้า · Yuzu เหลืองส้มซิตรัส · Sesame ขาวทอง · ไม่ต้องวาดตัวฮีโร่ (วาดผล เช่น ระเบิดเล็ก/สายฟ้าโซ่/ทุ่นระเบิด) · แสดงจริง 70px
| ไฟล์ | ฮีโร่ · ชื่อ | ผลในเกม |
|---|---|---|
| `mod_bloom.png` | momo · Seed Bloom 🌸 | 12% of hits burst into a small blast |
| `mod_love.png` | momo · Love Chain 💘 | 15% of hits arc to 2 nearby enemies |
| `mod_heart.png` | momo · Big Heart 💗 | Every 7th hit deals ×3 damage |
| `mod_aim.png` | momo · Steady Aim 🎯 | +25% damage while standing still |
| `mod_jam.png` | momo · Jam Mine 🍓 | Slain enemies leave a jam mine that pops |
| `mod_spray.png` | momo · Petal Kick 💨 | Dashing fires 6 seeds in a ring that bounce once |
| `mod_icemine.png` | mint · Ice Mine ❄️ | Slain enemies leave an ice mine that freezes |
| `mod_shatter.png` | mint · Ice Breaker 💎 | Frozen enemies you kill shatter, hitting and freezing enemies nearby |
| `mod_flurry.png` | mint · Flurry Pulse 🌨️ | Every 4s a frost pulse hits and freezes around you |
| `mod_throw.png` | mint · Long Throw 🏹 | +30% damage to enemies far away |
| `mod_glide.png` | mint · Glide Nova 🌬️ | Dashing releases a cold blast |
| `mod_coldarc.png` | mint · Cold Arc 🧊 | 12% of hits arc and freeze 2 enemies |
| `mod_quake.png` | cocoa · Sixth Slam 🌋 | Every 6th hit ×2.5 and shakes the ground |
| `mod_stomp.png` | cocoa · Bear Stomp 🐾 | Dashing ends in a heavy stomp |
| `mod_rage.png` | cocoa · Rolling Rage 🔥 | Each Dash adds a Rage stack: +6% damage each (max 5). Getting hit clears them |
| `mod_crush.png` | cocoa · Close Crush 👊 | +30% damage to enemies right next to you |
| `mod_ko.png` | cocoa · Finishing Blow 💀 | +60% damage to enemies under 25% HP |
| `mod_after.png` | cocoa · Aftershock 💥 | 25% of kills explode |
| `mod_over.png` | taro · Overcharge ⚡ | 20% of hits arc to 3 enemies |
| `mod_field.png` | taro · Static Field 🌀 | Every 3s a static pulse hits around you |
| `mod_step.png` | taro · Thunder Step 👣 | Dashing leaves a thunderclap |
| `mod_judge.png` | taro · Static Buildup ⚖️ | Every 6th hit on the same enemy shocks it: bonus damage, normal enemies are stunned |
| `mod_ion.png` | taro · Ion Burst 💥 | 20% of kills burst with lightning |
| `mod_focus.png` | taro · Storm Battery 🔋 | Every 15 kills, your next hit deals ×5 damage |
| `mod_zest.png` | yuzu · Peel Pop 🍋 | 25% of kills burst in citrus |
| `mod_crew.png` | yuzu · Crew Chain ⚡ | 10% of hits arc to 2 enemies |
| `mod_rally.png` | yuzu · Rally Pulse 📣 | Every 4s a rally pulse hits around you |
| `mod_sour.png` | yuzu · Last Squeeze 💀 | +50% damage to enemies under 25% HP |
| `mod_splash.png` | yuzu · Dash Splash 💦 | Dashing drops 3 juice bombs |
| `mod_bite.png` | yuzu · Big Bite 🦷 | Every 10th hit deals ×3 damage |
| `mod_prism.png` | sesame · Prism Burst 🔮 | 10% of hits burst into light |
| `mod_lens.png` | sesame · Calm Mirror 🧘 | +30% damage while standing still |
| `mod_scope.png` | sesame · Far Sight 🔭 | +30% damage to enemies far away |
| `mod_refract.png` | sesame · Split Light ✨ | 15% of hits split to 2 enemies |
| `mod_mirror.png` | sesame · Mirror Mine 🪞 | Slain enemies leave a mirror shard that explodes |
| `mod_exec.png` | sesame · Execution Beam 💀 | +50% damage to enemies under 30% HP |

### C. ไอคอน Trade-off (5) · 256×256 · โปร่งใส
ทรง **ตาชั่งขนม** ⚖️ ขอบแดงอมชมพู `#e0566e` · จานซ้ายเป็นสิ่งที่ได้ (สว่าง) จานขวาเป็นสิ่งที่เสีย (มืด/แตก) · แสดงจริง 70px
| ไฟล์ | ชื่อ | ได้ · เสีย |
|---|---|---|
| `trade_armor.png` | Heavy Armor 🛡️ | ✅ Take 35% less damage · ❌ Move 15% slower |
| `trade_rush.png` | Sugar Rush 🍬 | ✅ +25% speed, -15% cooldowns · ❌ Take 25% more damage |
| `trade_berserk.png` | Berserker 😤 | ✅ Up to ×2 damage as HP drops · ❌ No HP regeneration |
| `trade_feast.png` | Hungry Pact 🌀 | ✅ +20% damage, +30% EXP · ❌ Healing items do nothing |
| `trade_oath.png` | Marksman’s Oath 🎯 | ✅ +20% crit chance · ❌ Attacks 20% slower |

### D. การ์ด Build Path ของ Yuzu (3) · 512×768 · สเปกเหมือนใบ 80 กลุ่ม D ทุกอย่าง
กรอบประดับในภาพ · **25% ล่างเป็นแถบป้ายว่างสีเรียบ** (โค้ดเขียนชื่อ) · มุมโค้ง 24px · พื้นนอกการ์ดโปร่งใส · Yuzu + คู่หูต้องตรงกับอาร์ตเดิม (`assets/art/build_cards/yuzu59/`, `assets/art/yuzu_forms63/`) · โทนเหลืองส้มซิตรัส
| ไฟล์ | สาย | ภาพ |
|---|---|---|
| `pathcard80_zestSwarm.png` | Lime | Yuzu กับ Lime นักธนูมะนาว ยิงห่าธนูเปรี้ยวพุ่งข้ามแนวศัตรู มีลูกน้องนักธนูตัวเล็กตาม |
| `pathcard80_citrusGuardian.png` | Pomelo | Pomelo ส้มโอตัวใหญ่ยืนบังหน้า Yuzu ทุบพื้นแตกเป็นคลื่น (โล่/ผู้พิทักษ์) |
| `pathcard80_juiceWorkshop.png` | Blood Orange | Blood Orange นักเวทย์ส้มเลือด ร่ายวงเวทย์บนพื้น ไฟ/น้ำแข็ง/สายฟ้า 3 สี Yuzu ยืนข้าง |

### E. (ไม่บังคับ · แก้ของใบ 80) การ์ด Cocoa 2 ใบที่ดูเหมือน Fire Fist · 512×768 สเปกเดียวกับ D
ตอนนี้ 3 ใบของ Cocoa ภาพแทบเหมือนกัน (หมัดไฟ) → ผู้เล่นแยกไม่ออก
| ไฟล์ | สาย | ภาพ |
|---|---|---|
| `pathcard80_titan.png` | Titan | Cocoa ตัว **ใหญ่ยักษ์** (เห็นชัดว่าใหญ่กว่าปกติ) กระโดดทุบพื้นจนแผ่นดินแตกเป็นวง ลาวาช็อกโกแลตพุ่ง · ไม่มีหมัดไฟ |
| `pathcard80_dashboxer.png` | Dash Boxer | Cocoa พุ่งไปข้างหน้าเร็วมาก มี **เงาซ้อน 3–4 ร่าง** ตามหลัง ชกต่อเนื่อง · เส้นความเร็วแนวนอน · ไม่มีไฟ |

**รวม 54 ไฟล์** (A 8 · B 36 · C 5 · D 3 · E 2)

## ข้อห้าม
- ห้ามตัวหนังสือ/ตัวเลข/รูนที่อ่านได้ ทุกไฟล์ (ไอคอน % หรือ ×3 ห้ามเขียนเป็นตัวเลข → ใช้ภาพสื่อ)
- ไอคอน A/B/C ห้ามมีกรอบสี่เหลี่ยม/พื้นทึบ · ต้องอ่านออกที่ 28px (A) และ 70px (B/C)
- ไอคอนในกลุ่ม B ของฮีโร่เดียวกันต้องต่างกันชัด (ห้ามใช้ภาพหลักเดียวกันแล้วเปลี่ยนสี)
- การ์ด D/E: ฮีโร่ on-model · ภาพหลักอ่านออกที่ 110px

## โน้ตฝั่งโค้ด
- pack: ไอคอน 256 → 128 WebP q90 ที่ `assets/art/relics81/` · การ์ด 512×768 → 384×576 ที่ `assets/art/special_picks80/` (คีย์เดิมของใบ 80)
- A: คีย์ `relic_<id>` ใช้ได้ทันที (โค้ดหา `relic_'+k` อยู่แล้วทั้งห้องสมบัติ/หน้าพัก/Codex) · ลงทะเบียนเหมือน relic เดิม
- B: `modCard()` เปลี่ยน `iconKey` เป็น `'mod_'+m.id.slice(2)` ถ้ามีภาพ ไม่มี = ไอคอนอาวุธเดิม · โหลดแบบ stage เฉพาะ 6 ใบของฮีโร่ที่เล่น
- C: `tradeCard()` → `'trade_'+t.id.slice(2)` · ไม่มี = เดิม
- Instinct (Kill Streak / Last Stand) ใช้ไอคอน `relic_streak` / `relic_laststand` ที่มีอยู่แล้ว ไม่ต้องวาดเพิ่ม
- D: `pathcard80_<pathId>` เข้า `drawPathCards` อัตโนมัติ (มีครบ 3 ใบ + หลังการ์ด = ใช้การ์ดภาพวาด)
- E: เขียนทับคีย์เดิม · หมายเหตุ v8.1.138 สลับภาพ Glacier/Barrage ด้วย `PATHCARD_ART` (เจ้าของ) — ไม่ต้องวาดใหม่
- MANIFEST ต่อแถว: `key`, `file`, `bytes`, `sha256`, `width`, `height`, `frameWidth`, `frameHeight`, `frameCount`(1), `columns`(1), `loop`(false), `anchor`(center), `background`(transparent) + การ์ด `textRect`

## ส่งมอบ
(ฝั่งอาร์ตกรอกเมื่อส่ง)
