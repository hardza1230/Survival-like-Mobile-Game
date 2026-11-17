# Play Console — คำตอบ "Finish setting up your game" (17 พ.ย. 2026)

แอป `com.oheart.mochimayhem` · ตอบตามสิ่งที่เกมทำจริง (อิง privacy.html + โค้ด v8.1.167) · ถ้าเกมเปลี่ยน (เช่น เปิดซื้อด้วยเงินจริง) ต้องกลับมาแก้

| หัวข้อ | คำตอบ |
|---|---|
| Privacy policy | `https://hardza1230.github.io/Survival-like-Mobile-Game/privacy.html` |
| App access | **All functionality is available without special access** (เล่นแบบ Guest ได้ ไม่ต้องล็อกอิน) |
| Ads | **Yes, my app contains ads** (AdMob rewarded) |
| Content rating | หมวด Game · Violence: **มี ความรุนแรงแบบแฟนตาซี/การ์ตูน** ต่อตัวละครไม่สมจริง · ไม่มีเลือด · ไม่มีเนื้อหาทางเพศ คำหยาบ ยาเสพติด การพนัน · ไม่มีแชท/ผู้ใช้คุยกัน · ไม่แชร์ตำแหน่ง · ไม่มีการซื้อด้วยเงินจริง · กล่องสุ่มใช้แค่เงินในเกม (ไม่ใช่เงินจริง) |
| Target audience | **13–15, 16–17, 18+** (ไม่เลือกต่ำกว่า 13 เพื่อไม่เข้าโปรแกรม Families) · "Could appeal to children" → ตอบตามจริงว่าตัวละครน่ารัก แต่เป้าหมายคือวัยรุ่น/ผู้ใหญ่ |
| Data safety | ดูด้านล่าง |
| Government apps / Financial features / Health / News | ไม่ใช่ทั้งหมด |
| App category | Games → **Action** (หรือ Arcade) · Tags: Roguelike, Action, Casual |
| Contact | อีเมล `heartloveu1825@gmail.com` |

## Data safety

- เก็บหรือแชร์ข้อมูลไหม → **Yes** · เข้ารหัสระหว่างส่ง → **Yes** · ผู้ใช้ขอลบข้อมูลได้ → **Yes**
- Delete account URL → privacy.html (ข้อ 6: อีเมลขอลบ ภายใน 30 วัน) · ในแอปมี Sign out + Reset ใน Settings

| ประเภทข้อมูล | เก็บ | แชร์ | บังคับ/เลือกได้ | จุดประสงค์ |
|---|---|---|---|---|
| Personal info → Email address, Name | ✅ (เฉพาะคนที่ล็อกอิน Google) | ❌ | Optional | Account management, App functionality |
| App activity → In-app actions / App interactions | ✅ | ✅ (AdMob) | Required | Analytics, App functionality, Advertising |
| App info & performance → Crash logs, Diagnostics, Other (ภาพหน้าจอเกมในรายงาน 🐞) | ✅ | ✅ Diagnostics (AdMob) | Required (🐞 = Optional) | Analytics, App functionality |
| Device or other IDs (รหัสสุ่มของเครื่อง + Advertising ID) | ✅ | ✅ (AdMob) | Required | Analytics, Advertising, Fraud prevention |
| Location → Approximate (IP ผ่าน AdMob) | ✅ | ✅ (AdMob) | Required | Advertising, Fraud prevention |

ไม่เก็บ: ตำแหน่งละเอียด รายชื่อ รูป/ไฟล์ในเครื่อง ข้อมูลการเงิน สุขภาพ ข้อความ เสียง

## Closed test (เงื่อนไขบัญชีส่วนตัว)
Publish a closed testing release → ผู้ทดสอบ opt-in ≥ 12 คน → รันต่อเนื่อง ≥ 14 วัน → Apply for production
