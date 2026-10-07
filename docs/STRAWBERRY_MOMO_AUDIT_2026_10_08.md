# สถานะล่าสุด — S1–S5 ลงโค้ดครบใน v6.55.83

เนื้อหาวิเคราะห์เดิมด้านล่างเป็นฐานก่อนแก้ ไม่ใช่พฤติกรรมปัจจุบัน

| งาน | ผลที่ลงแล้ว |
| --- | --- |
| S1 | แยกข้อความ Basic/Unique, pool 65/20/15, ซ่อนการ์ดข้ามสาย; จำนวนเกิน cap แปลงเป็นพลัง; เก็บ ID/rank เซฟเดิมและแสดงการลงทุนเดิมใน Recipe |
| S2 | Ricochet หลัง Evolution ยังเด้ง; visited ตาม lifetime กันชนซ้ำ; max 8 เด้ง, growth บวกต่อเด้ง cap 2.2×; บอสเดี่ยวมี impact ชดเชย cap 80% base power และเคารพ phase gate |
| S3 | Sniper Basic ชาร์จ 340ms ยิงหนึ่ง heavy seed; จำนวนเพิ่มแปลงเป็น +12% power/เม็ด; Heavy Draw +60ms และ +15 จุดเปอร์เซ็นต์ full power/rank; dash/hurt ปล่อย partial; Unique เป็นลำแสงเล็งด้วยมือ |
| S4 | Shotgun +5 เม็ด, cap 12; overflow +8% power/เม็ด; Petal Breacher +35% power, close +20%, heavy center; ไม่บังคับทะลุหลัง Evolution |
| S5 | Heart Railgun / Petal Breacher / Heart Pinball แยก Evolution พร้อมข้อความ card/Codex/Recipe; run epoch/basic identity guards; pooled reset; active seeds 32, splash 16 targets, painted VFX 3/200ms |

Heart Railgun: full Basic +30% power, ทะลุ 10 เป้าก่อน mutation/gear; manual Unique ที่ชาร์จเต็ม +40% damage. Heart Pinball: +2 เด้งภายใน cap 8 และ final splash 25% seed power. Talent split/return/recoil/double volley และการลงทุนจำนวนเดิมยังรองรับภายใต้เพดานใหม่; Gathering Juice เปลี่ยนจากทบต้นเป็นบวกต่อเด้งโดยตั้งใจ

ตรวจแล้ว: `tests/strawberry-builds.test.cjs` เรียก actual methods ทดสอบ focused rolls/previews, saved ranks, charge/partial/count conversion, evolved bounces/visited lifetimes, boss fallback/phase immunity, shotgun, manual Unique, pooling/cancellation และ 500-enemy/100-cast budgets. `npm run check` และ `npm run build:www` ผ่าน ผลนี้ไม่ใช่การรับรอง FPS หรือสมดุลจากการเล่นจริง เจ้าของทดสอบในเกม/มือถือเอง

---

# Strawberry / Momo — วิเคราะห์จากโค้ด 8 ต.ค. 2026

ฐานตรวจ: branch `claude/vampire-survival-mobile-game-yo9e8w`, M3 commit `7cb9a58355e83d5eb82d8f1265601db6b37cef5d`; Mint M4 v6.55.82 ไม่เปลี่ยนการต่อสู้ของ Strawberry ในเอกสารนี้

## ตัวละครเดียวกัน

`CHARACTERS.momo.name = 'Strawberry'`; `CHAR_ORDER` มี `momo` เพียงรายการเดียว ไม่มี hero ID `strawberry` แยกต่างหาก ส่วน `berry` คือ Berry Core รุ่นเก่าที่พักจาก roster แต่ยังรองรับเซฟเดิม จึงไม่ควรวางระบบหรือเซฟให้ Strawberry/Momo เป็นสองฮีโร่โดยอาศัยชื่อชีตภาพ

อาวุธจริง: Heart Seed Blaster (`sprinkle`), Unique ID `berryRebound`. Momo เป็นชื่อใน lore/ID/ไฟล์ภาพ ส่วน Strawberry เป็นชื่อที่ผู้เล่นเห็น

## แต่ละสายทำอะไรจริง

| สาย | Basic Attack | Unique ที่ใช้ผ่านปุ่มกดค้าง | จุดแข็ง | จุดแลกเปลี่ยน |
| --- | --- | --- | --- | --- |
| Sniper | รอ 340ms, seed ×3.2, จำนวนครึ่งชุดปัดขึ้น, ความเร็ว ×1.35, ทะลุและหนึ่งฮิตต่อเป้าต่อเม็ด; interval ×1.18 | ชาร์จเริ่มต้น 1.1s แล้วปล่อยลำแสงยาว 1500px; เล็งด้วยการลาก; การ์ด Heavy Round/Quick Scope/Wide Bore/Split Shot ปรับ Unique | โดนเป้าใหญ่หนักและทะลุแนว; manual Unique ให้จังหวะตัดสินใจ | Basic หลายเม็ดในชุดยังคงออกตามกัน จึงไม่ใช่หนึ่ง heavy shot เสมอ; การ์ดส่วนใหญ่เพิ่มพลัง Unique มากกว่า loop ของ Basic |
| Shotgun | เพิ่ม **5** เม็ดจากชุดพื้นฐาน, cap 18, power ต่อเม็ด ×0.45, อายุ 0.3s; spread แคบเป็น 0.045 rad เมื่อเล็งเป้าใหญ่ใน 430px | Berry Blast ชาร์จ 450ms, กรวย 120° พื้นฐาน, ระยะ 300px; ความเสียหายคำนวณตรงในกรวยและถอยหลัง/iframe | เสี่ยงเข้าใกล้เพื่อ burst; Basic ยิงศัตรูใหญ่สม่ำเสมอขึ้น; Unique ไม่พึ่ง pellet collider ทุกเม็ด | ใกล้ <120px แรงมาก แต่ >260px power ×0.6 และบินเพียงประมาณ 294px ก่อนหมดอายุ (ไม่ Awaken); ต้องวัดเม็ดโดนจริง |
| Ricochet | interval ×0.8 = ยิงบ่อยขึ้น 25%, power ×0.8, +2 bounces; Carom เพิ่มครั้ง; Gathering Juice เพิ่ม damage ×(1+0.08×rank) ต่อเด้ง | ยิง seed รอบตัว 12–18 เม็ดตาม Unique level, เด้งและฟื้น HP | มีฝูงให้เด้งจึงสนุกและโตตามจำนวน hit | บอสเดี่ยวไม่มีเป้าอื่นให้เด้ง จึงสูญเสียตัวคูณระหว่าง chain; Evolution ปัจจุบันข้าม bounce logic |

ทุกสายใช้ power/rate/size/volley กลาง และ mutation `ricochet / fan`; เลือก Build Path เมื่อ level ≥6, Infusion ≥13, Mutation เมื่อ mastery ≥10, Evolution ที่ mastery threshold สูงสุด 16 ไม่ใช่เลเวลตัวละคร 16 เสมอไป

## สิ่งที่ควรแก้ก่อนจูนตัวเลข

1. **Evolution ทำให้ Ricochet เสียกลไกหลัก — ยืนยันจาก actual hit method.** `castSkill('sprinkle')` ตั้ง `pierce=true` เมื่อ evolved; `_hitEnemyCore` เข้าแขนง pierce แล้ว return ก่อนแขนง bounce. ทดลอง projectile `pierce=true`, `seedPierce=true`, `bounce=5`, `bounceGain=.24`: หลังชนหนึ่งเป้า damage เกิดหนึ่งครั้ง แต่ bounce ยัง 5, `_bounced=false`, damage ไม่เพิ่ม. กระทบ Carom/Gathering Juice และ Talent ที่รอ bounce. Mutation Ricochet ของสายอื่นก็เจอปัญหาเดียวกันหลัง Evolution
2. **Evolution เดียว Heartstorm Blaster ทำทั้งสามสายคล้ายกัน.** ทุกสาย +2 seed, power ×1.35 และ piercing. Shotgun ได้ทะลุแต่ยังรักษา close-range multiplier; Ricochet ถูกกลบ; Sniper เดิมทะลุอยู่แล้วจึงได้ส่วนใหญ่เป็นจำนวน/ตัวเลข ไม่มี payoff เฉพาะสาย
3. **ข้อความไม่ตรงกับ runtime.** Shotgun card บอก +2 seeds แต่โค้ดเพิ่ม +5. Unique descriptor/เอกสารเก่าของ Sniper ยังบอก charged explosions ทั้งที่ pointer release ใช้ beam; `useCharacterSkill` ยังมี legacy sniper pulse branch. ควรทำคำอธิบายจากแหล่งข้อมูลเดียวและระบุชัดว่า Basic หรือ Unique
4. **บางใบไม่มีประโยชน์ทันที/เมื่อชน cap.** Sniper ใช้ `ceil(shots/2)`: จาก 1 เป็น 2 seeds ก่อนหารยังยิง 1 จึงได้ Sweet Branching ใบแรกแล้วอาจไม่เห็นผล. ทั้งชุดเริ่ม cap 12 ก่อนใช้ shotgun +5 และ cap 18 อีกครั้ง; จำนวนเกิน cap ไม่มี conversion. ไม่ควรเสนอ +จำนวนโดยปล่อยให้เงียบเมื่อถึง cap
5. **Mutation ผสมข้ามเอกลักษณ์สาย.** Fan ยังเพิ่ม +2 ให้ Sniper และกางชุดออก; Ricochet mutation ซ้ำกับสาย Ricochetที่เพิ่ม bounce อยู่แล้ว. ยังไม่มี Mint-style 65/20/15 split สำหรับ ordinary Strawberry cards จึงอาจได้ generic cardsจน identity ไม่เด่น
6. **ความแรงของ Ricochet โตตาม chain แบบทบต้น.** Gathering Juice rank 3 = ×1.24 ต่อเด้ง; 5 เด้งสะสมประมาณ ×2.93 ก่อน Talent/gear. การหาเป้าถัดไปกันเฉพาะเป้าที่เพิ่งชน ไม่มี visited set ทั้ง chain จึงสามารถกลับไปเป้าก่อนหน้าได้หากยังอยู่และเป็นตัวใกล้สุด ไม่ตรงกับคำว่า “new targets” ทุกครั้ง
7. **Timer ของ Basic Sniper/ชุดยิงยังตรวจเพียง state.** ใช้ `time.delayedCall` และ `state==='play'`, ไม่มี run epoch/basic identity แบบ Mint M4. มีความเสี่ยงยิงจากชุดเก่าเมื่อกลับเข้า play ในรันใหม่ ต้องเพิ่ม regression/cancellation ก่อนรับรองว่าแก้แล้ว

## ตัวเลขประกอบ (ไม่ใช่ข้อสรุปสมดุลจากการเล่น)

ใช้ level อาวุธ 1, `dm=1`, ไม่ Awaken, ไม่มีการ์ด/Talent/gear และตัด global crit/ATK/infusion ออก: seed พื้นฐาน = 6.75 ก่อน `damage()`; Sniper = 21.6; Ricochet hit แรก = 5.4. Shotgun = 6 เม็ด ×3.0375; เมื่อทุกเม็ดโดนใน <120px คูณ 2×1.4 ได้รวม 51.03 ต่อชุดก่อนตัวคูณกลาง ข้อนี้เป็นเพดานทางคณิตศาสตร์ ไม่รับรองว่าแต่ละ collider โดนครบ และ cooldown/เวลายืนใกล้มีผลมาก

จึงยังสรุปว่า “สายไหนเก่งสุด” ไม่ได้จากตัวเลข hit เดียว ควรเทียบเวลาฆ่า, จำนวนการ์ดเท่ากัน, ความเสี่ยงยืนใกล้ และ HP ที่เสีย บนด่านเดียวกัน

## ทิศทางที่แนะนำสำหรับงานถัดไป (ยังไม่ลงโค้ด)

| ลำดับ | งาน | ผลที่ผู้เล่นควรเห็น |
| --- | --- | --- |
| S1 | แก้ชื่อ/ข้อความ, แยก Basic/Unique, focused pool และ cap conversion | อ่านใบเดียวรู้ว่าเสริมอะไร เลือกสายแล้วการ์ดตามสายชัด |
| S2 | รักษา Ricochet หลัง Evolution, visited/capped bounce scaling, boss fallback | เด้งแรงขึ้นจริงหลังวิวัฒนาการ และยังมีประโยชน์ต่อบอสเดี่ยว |
| S3 | Sniper หนึ่ง full heavy shot; extra seed → charge/impact value; Unique beam wordingตรง | แยกจาก Crystal Impaler: เน้น manual aim/Perfect Shot ไม่ใช้ Impale ซ้ำ |
| S4 | Shotgun cone/near-range Evolution และ count overflow | ยืนใกล้ได้ burst ชัด แต่ไม่กลายเป็น Sniper piercing ที่มีหลายเม็ด |
| S5 | Path Evolutions, lifecycle/performance regression และแก้ตามผู้เล่น | ทั้งสามสายรักษาการ์ดเดิมและสไตล์เมื่อถึงท้ายรัน |

ผู้ใช้ทดสอบในเกมและมือถือเอง; การตรวจนี้ยืนยันพฤติกรรมที่อ่าน/เรียกจากโค้ด ไม่รับรอง combat feel/FPS. งาน S1–S5 เป็นข้อเสนอแยกจาก Mint M4 และยังไม่ได้ implement
