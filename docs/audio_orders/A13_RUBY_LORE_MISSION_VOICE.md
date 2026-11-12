# A13 — Ruby เสียงพากย์: เรื่อง Flavor Cores + อธิบายภารกิจประจำด่าน/League · ใบสั่งเสียง + ผูกเอง

สถานะ: 🟡 รอเสียง · เขียน 12 พ.ย. 2026 (v8.1.104) · **AI ฝั่งเสียงทำเสียงและผูกเข้าเกมเอง** ตามหัวข้อ "ผูกเข้าเกม"
เครื่องมือ: **ElevenLabs TTS** ใช้ **เสียง Ruby เดิมของ A07** (voice ID ใน `assets/incoming/audio_voice_acting/VOICES.json` key `ruby`) · ห้ามสร้างเสียงใหม่ · ห้ามใช้เสียงสร้างด้วยโค้ด

## ทำไมต้องสั่ง
- v8.1.103: Ruby อธิบาย **Flavor Cores** หลังบทสอน (3 หน้า, `CORE_LORE_LINES`) → ยังไม่มีเสียง
- v8.1.104: ภารกิจประจำด่าน/League 14 แบบได้บท Ruby ตอนเริ่มภารกิจ (`RUBY_TIPS`) → ยังไม่มีเสียง · ภารกิจเดิม 17 แบบมีเสียงครบแล้ว (A07 `vo_ruby_tip_*` + A09 `vo_ruby_short_*`)

## รูปแบบไฟล์ (เหมือน A09)
- MP3 mono 44.1 kHz 128 kbps · peak ≤ −1 dBTP · ตัดเงียบต้นไฟล์ ≤ 60 ms
- ยาว: หมวด 1 ≤ 5.5 วิ · หมวด 2 ≤ 4.3 วิ · หมวด 3 ≤ 2.2 วิ
- นิสัย Ruby: ภูตแยมทับทิมผู้นำทาง ร่าเริง ห่วงใย (ไม่ตะโกนแหลม) · หมวด 1 พูดแบบเล่าเรื่องอบอุ่น ภูมิใจในคุณยาย
- ข้อความใน MANIFEST ต้อง **ตรงตัวอักษร** กับคอลัมน์ "บท" (โค้ดใช้ข้อความหาเสียง) · ใช้ `’` ไม่ใช่ `'`

## หมวด 1 — เรื่อง Flavor Cores (3 ไฟล์ · พูดตอนทัวร์อัปแก่นหลังบทสอน)
| key | บท |
|---|---|
| `vo_ruby_core_1` | That Sugar is flavor the Hunger stole. We just took some back! |
| `vo_ruby_core_2` | Grandma wove three Flavor Cores into the Heart Seed: Life Core, Flavor Spark and Oath Shell. |
| `vo_ruby_core_3` | Feed them Sugar and the Seed holds your true form tighter. Every friend we free shares that strength too! |

## หมวด 2 — อธิบายภารกิจ (14 ไฟล์ · Ruby พูด 3 ครั้งแรกที่เจอภารกิจนั้น)
| key | ที่ | บท |
|---|---|---|
| `vo_ruby_tip_seedRift` | C3 | Beat monsters inside the rift to keep it open! |
| `vo_ruby_tip_shakeTrees` | C3 | Stand under each tree to shake it. Fruit, or a surprise! |
| `vo_ruby_tip_mirrorPath` | C3 | Stand by each mirror to charge it. Then the crystal blasts! |
| `vo_ruby_tip_vaultAltar` | C3 / Delve | Pick a curse, then take the loot or risk it for more! |
| `vo_ruby_tip_ultimatum` | Delve | Each round adds a curse. Take the pot, or risk it for more! |
| `vo_ruby_tip_lastLight` | C3 | Keep one lantern burning! Stand close to rekindle them. |
| `vo_ruby_tip_frozenPantry` | C1-4 | Open the sugar jar, then walk near the frozen mochi to wake them! |
| `vo_ruby_tip_hungersMouth` | C1-2 | Touch the Hunger’s hand! Kills inside keep the breach open. |
| `vo_ruby_tip_creepingRoots` | C2-3 | Roots crawl to the flower! Stand on each root mother to cut it. |
| `vo_ruby_tip_hungerHerald` | C1-1 | That Herald opens gates! Hunt it down to shut them. |
| `vo_ruby_tip_grandmasPot` | C1-3 | Carry the ingredients on Grandma’s recipe to the pot! |
| `vo_ruby_tip_grandmasGolem` | C1-5 | Collect golem parts, bake them in the oven, then beat the golem! |
| `vo_ruby_tip_hungerSiege` | Delve | Hold the circle! Every kill inside fills the pot. |
| `vo_ruby_tip_hungerDomain` | Delve | The whole cave is a breach! Survive, then beat the Breachlord! |

## หมวด 3 — เตือนสั้น (14 ไฟล์ · ครั้งที่ 4 เป็นต้นไป + กล่องเตือนซ้ำ)
| key | บท |
|---|---|
| `vo_ruby_short_seedRift` | Fight inside the rift! |
| `vo_ruby_short_shakeTrees` | Shake every tree! |
| `vo_ruby_short_mirrorPath` | Charge every mirror! |
| `vo_ruby_short_vaultAltar` | Pick a curse, then take or risk! |
| `vo_ruby_short_ultimatum` | Take the pot or risk it! |
| `vo_ruby_short_lastLight` | Keep a lantern lit! |
| `vo_ruby_short_frozenPantry` | Walk near the frozen mochi! |
| `vo_ruby_short_hungersMouth` | Keep fighting inside the breach! |
| `vo_ruby_short_creepingRoots` | Cut the root mothers! |
| `vo_ruby_short_hungerHerald` | Hunt the Herald! |
| `vo_ruby_short_grandmasPot` | Bring ingredients to the pot! |
| `vo_ruby_short_grandmasGolem` | Bake the golem parts! |
| `vo_ruby_short_hungerSiege` | Hold the circle! |
| `vo_ruby_short_hungerDomain` | Survive, then the Breachlord! |

**รวม 31 ไฟล์**

## ส่งมอบ
`assets/incoming/audio_ruby_a13/` + `MANIFEST.json` (key, file, bytes, sha256, duration_ms, speaker `ruby`, voice_id, text ตรงตัวอักษร) + `PROMPTS.json` + `QA_REPORT.json` (peak, onset, duration) + `AUDITION.html`

## ผูกเข้าเกม (AI ฝั่งเสียงทำเอง)
อ่าน `.claude/skills/release/SKILL.md` ก่อน
1. ตรวจ MANIFEST 31 แถว · sha256 · ความยาว/peak ด้วยสคริปต์ (ไม่ต้องฟังทีละไฟล์)
2. คัดลอกไป `assets/audio/acting/<key>.mp3` · เพิ่มแถวใน `A07_CATALOG` ด้วย `Object.assign(A07_CATALOG,{...})` บรรทัดใหม่ (url เป็น literal `'assets/audio/acting/…'`, text, role `ruby`, duration)
3. หมวด 2–3: `rubyTip` → `rubySay` หาเสียงจากข้อความอยู่แล้ว (ตัด `[ ]` และ " · N/M") → ไม่ต้องแก้โค้ด · ลบชุด `A13_PENDING` ใน `tests/ruby-a09-voice.test.cjs` ให้เทสบังคับเสียงครบทุกภารกิจ
4. หมวด 1: `rubyGuide` เล่นเสียงจากข้อความแต่ละหน้าอยู่แล้ว (ตรวจว่า lookup เจอทั้ง 3 หน้า) · ถ้าไม่เจอ ให้เทียบแบบเดียวกับ `rankTeach`
5. อัปเดตจำนวนใน `tests/voice-acting-integration.test.cjs` · `npm run check` ผ่าน
6. ปล่อยตาม skill release · อัปเดตสถานะใบนี้และ `A00_README.md` เป็น "🟢 ผูกแล้ว vX · รอฟังบนมือถือ"
