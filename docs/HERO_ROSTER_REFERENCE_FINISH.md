# Heroes — reference finish v7.7.14

อ้างอิง image(2).png; image(3).png ใช้ตรวจช่องว่างจากหน้าที่เผยแพร่ก่อนหน้า

| ส่วน | งานที่วางและทำแล้ว |
|---|---|
| ตัวอักษร | Nunito แบบโค้งมน: เนื้อหา static weight 600, หัวข้อ static weight 900; โหลดจากเกมก่อนเริ่ม canvas พร้อม fallback |
| ด้านบน | Back และ candy เป็นกรอบวาดสีม่วง/ชมพู ขอบทอง; ชื่อ Heroes สีครีมพร้อมดอกไม้ |
| Tabs | Heroes ใช้กรอบชมพู active; Talents/Stats ใช้ม่วง |
| Preview | กรอบทองวาดใหม่, portrait เดิม, ชื่อ, badge บทบาทพร้อม icon, อาวุธ, คำอธิบาย, Details |
| Cards | ภาพหกใบ 2 คอลัมน์บนมือถือ; แยกชื่อและบทบาท, เพิ่มเงารองข้อความและ icon ตามบทบาท |
| Selected | ขอบทองและ check; แตะ card เปลี่ยน preview เท่านั้น |
| ด้านล่าง | ปุ่มชมพูขอบทองพร้อม blossom; กดยืนยันจึงบันทึกตัวละคร |

## สัดส่วนและ typography
ใช้ความกว้าง reference 941 เป็นฐาน p = viewportWidth / 941. Preview เริ่ม y=193p สูง 368p; ระยะขอบ 30p; gap 18p. Card สูง 0.60 ของความกว้าง. ชื่อ card 32p (ขั้นต่ำ 13px), บทบาท 25p (ขั้นต่ำ 10px), แยกจุดวางชื่อกับบทบาท 70p. หน้าจอแนวนอนใช้ grid และ preview ที่ย่อให้เหมาะสม.

Nunito เป็นฟอนต์ทดแทนที่ใกล้เคียงรูปอ้างอิง; ยังไม่มีไฟล์ต้นฉบับฟอนต์ใน reference จึงไม่ระบุว่าเป็นฟอนต์เดียวกัน. เก็บ SIL OFL ใน assets/fonts/OFL-Nunito.txt.

## Acceptance
- หกตัวละครต้องโหลดภาพและ icon ครบ; ข้อความไม่ทับบทบาท
- Preview, Details, tabs, Back และ scroll ใช้งานต่อได้
- แตะ preview ไม่เขียน save; confirm เขียนครั้งเดียว; locked guard ยังทำงาน
- ทดสอบ actual scene methods ที่ 320×568, 390×844, 430×764, 768×1024, 844×390
- npm run check และ npm run build:www ผ่าน; ตรวจ live UI หลัง deploy แยกจากการทดสอบเครื่องจริง

รายละเอียดการตัด atlas ดู assets/incoming/hero_roster_ui/MANIFEST.md.
