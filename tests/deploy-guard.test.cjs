// v8.1.74: เกมห้ามโหลดไฟล์จาก assets/incoming (ต้นฉบับ 2 GB · CI checkout ข้ามบางส่วน) และ workflow ขึ้นเกมรันเฉพาะสาขาขึ้นเกม
const fs=require('fs'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8'),wf=fs.readFileSync(__dirname+'/../.github/workflows/pages.yml','utf8');
const bad=src.match(/'assets\/incoming\/[^']+'/g)||[];assert.deepStrictEqual(bad,[],'runtime URLs in assets/incoming');
assert.ok(/branches: \[ "claude\/vampire-survival-mobile-game-yo9e8w" \]/.test(wf),'deploy only from the deploy branch');
assert.ok(/sparse-checkout:/.test(wf)&&/timeout-minutes: 15/.test(wf),'sparse checkout with timeout');
for(const f of ['menu_screens/screen_bazaar.webp','menu_stage_cards/stage_card_s01.webp'])assert.ok(fs.existsSync(__dirname+'/../assets/art/'+f),f);
console.log('Deploy guard: no runtime asset under assets/incoming, deploy-branch-only trigger, sparse checkout passed');
