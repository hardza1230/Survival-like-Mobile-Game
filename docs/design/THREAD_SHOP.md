# ร้านด้าย (Thread) · IAP

เจ้าของ 8 พ.ย. 2026: ด้าย = สกุลหลักที่ซื้อด้วยเงินจริง · ขายแค่ **ของสวย + ความสะดวก** (ไม่ขายพลัง) · มี Mochi Pass รายเดือน · ระยะแรก **ยังไม่ผูก Google Play Billing**

## ทำแล้ว (v8.1.45)
- Bazaar แท็บที่ 4 `Thread` (`buildThreadShop`)
- `IAP_PACKS` 6 แพ็ก (35–1,450 บาท) · ซื้อครั้งแรกต่อแพ็ก = ด้าย 2 เท่า (`Save.data.iapFirst`)
- `MOCHI_PASS` 129 บาท: ได้ 300 ทันที + 60/วัน 30 วัน (`Save.data.mochiPass {until, day}`) · กดการ์ดเพื่อรับรายวัน
- `Iap.available()` = มี `window.MochiBilling.ready` เท่านั้น → ตอนนี้กดซื้อแล้วขึ้น "Coming soon"
- `Iap.grant(id)` ให้ของหลังยืนยันการซื้อ (เทส `tests/thread-shop.test.cjs`)

## ถัดไป
- ใบสั่งอาร์ตหน้าร้าน (ไอคอนแพ็กด้าย 6 ขนาด, การ์ด Mochi Pass)
- ของสวยขายด้วยด้าย: สกินฮีโร่ / คู่หู Yuzu / กรอบโปรไฟล์ / เอฟเฟกต์ Unique (ต้องสั่งอาร์ต)
- ความสะดวกด้วยด้าย: Forge ลบ/สุ่ม Mod
- ตอนขึ้น Store: ปลั๊กอิน Billing (RevenueCat หรือ cordova-plugin-purchase) → ตั้ง `window.MochiBilling={ready,buy(id,cb)}` · ราคาจริงดึงจาก Play · ตรวจใบเสร็จฝั่งเซิร์ฟเวอร์ · แสดงอัตราดรอปหีบ
