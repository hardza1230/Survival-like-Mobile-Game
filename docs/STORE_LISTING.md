# 🏪 Google Play Store Listing — Mochi Mayhem

> รวมข้อความ + เช็คลิสต์ asset สำหรับกรอกใน Play Console
> (ปรับแก้คำได้ตามใจเจ้าของ — นี่คือฉบับร่างให้พร้อมใช้)

## ข้อมูลแอป
- **App name:** Mochi Mayhem
- **Package / App ID:** `com.mochimayhem.game`
- **Category:** Games → Action (หรือ Arcade)
- **Privacy Policy URL:** https://hardza1230.github.io/Survival-like-Mobile-Game/privacy.html
- **Contact email:** heartloveu1825@gmail.com
- **Content rating:** ทำแบบสอบถามใน Play Console (คาดว่า Everyone / PEGI 3 — การ์ตูนน่ารัก ไม่รุนแรงสมจริง)

---

## Short description (สูงสุด 80 ตัวอักษร)
```
ยิงฝ่าฝูงศัตรูขนมสุดน่ารัก อัพสกิล ปรุงเมนู ล้มบอส เอาชีวิตรอดในครัวเวทมนตร์!
```
(ทางเลือก EN) `Cute mochi survivor: dodge candy swarms, auto-fire skills, cook combos, beat bosses!`

---

## Full description (สูงสุด 4000 ตัวอักษร)
```
🍡 Mochi Mayhem — เกมเอาชีวิตรอดแนว survival-like สุดน่ารัก!

รับบทโมจิจิ๋วผู้กล้า ฝ่าดงศัตรูขนมหวานที่รุมเข้ามาเป็นฝูง! อาวุธยิงเองอัตโนมัติ
คุณแค่คุมการเคลื่อนที่ หลบให้เป็น เก็บเลเวล แล้วเลือกสกิลอัพให้แข็งแกร่งขึ้นเรื่อย ๆ

✨ จุดเด่น
• เล่นง่ายมือเดียว — จอยสติ๊กลอย + ปุ่มพุ่งหลบ อาวุธยิงเอง
• สกิลอัพหลากหลาย + ระบบ "ปรุงเมนู" จับคู่สกิลปลดคอมโบพิเศษ
• ตัวละครหลายตัว อาวุธประจำตัวต่างกัน คนละสไตล์การเล่น
• บอสอลังการทุกด่าน มีหลายเฟส หลายท่าให้หลบ
• เลือกความยากได้ — ยิ่งยาก รางวัลยิ่งดี
• ระบบไอเทม/คราฟต์แบบ ARPG (prefix/suffix, currency, ตลาด NPC)
• Cloud Save เชื่อมบัญชี Google กันเซฟหาย เล่นข้ามเครื่องได้
• กราฟิกพาสเทลน่ารัก เสียงสดใส เล่นเพลินทุกวัย

🎮 เหมาะกับใคร
ถ้าคุณชอบเกมแนวรุมกินโต๊ะ (survivors-like) ที่หยิบเล่นสั้น ๆ ได้ แต่มีของให้ปลดล็อก
และไล่บิลด์ยาว ๆ — เกมนี้ใช่เลย!

เล่นฟรี · ไม่มีโฆษณา
```

---

## เช็คลิสต์ Graphic Assets (Play Console บังคับ)
| Asset | สเปก | สถานะ |
|-------|------|-------|
| App icon | 512×512 PNG (32-bit) | ✅ `store/appicon_512.png` (พร้อม) |
| Feature graphic | 1024×500 PNG/JPG | ⏳ ต้องทำ (ใช้ lOGO.PNG + พื้นหลังได้) |
| Phone screenshots | อย่างน้อย 2 รูป (16:9 หรือ 9:16, ด้านสั้น ≥320px) | ⏳ แคปจากเกมจริง |
| (ทางเลือก) Tablet screenshots | 7"/10" | ไม่บังคับ |
| (ทางเลือก) Promo video | ลิงก์ YouTube | ไม่บังคับ |

### วิธีได้ screenshots
- แคปจากมือถือจริงตอนเล่น (เมนู, สู้ฝูงมอน, สู้บอส, หน้าเลเวลอัพ, หน้าคราฟต์) — สวยสุด
- หรือใช้บอท headless แคปให้: `npm run bot` (ผลอยู่ `scripts/bot-out/`)

---

## ก่อนกด Publish (Production)
- [ ] อัป **Signed AAB** (ไม่ใช่ debug APK) — ดู `docs/RELEASE_SIGNING.md`
- [ ] กรอก Privacy Policy URL (ข้างบน)
- [ ] ทำ Content rating questionnaire
- [ ] กรอก Data safety form (เก็บ: อีเมล + ความคืบหน้าเกม · เพื่อ app functionality · เข้ารหัสระหว่างส่ง · ผู้ใช้ขอลบได้)
- [ ] Target audience & content
- [ ] ตั้งราคา = ฟรี
