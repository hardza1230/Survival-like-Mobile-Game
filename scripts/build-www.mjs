// ประกอบโฟลเดอร์ www/ ที่ Capacitor ใช้ (webDir) จากไฟล์เกมที่ root
// คัดลอก index.html + game.js + phaser.min.js เข้า www/ (ไม่ commit www/ — สร้างตอน build)
import { mkdirSync, copyFileSync, existsSync, readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const www = join(root, 'www');
mkdirSync(www, { recursive: true });

const ver = Date.now();

// phaser: คัดลอกตรง ๆ
copyFileSync(join(root, 'phaser.min.js'), join(www, 'phaser.min.js'));
console.log('copied phaser.min.js');

// game.js: ฝังเลข build ลง ASSET_VER → รูปใน assets/ ถูก cache-bust ด้วย (แก้รูปแล้วโหลดใหม่เสมอ)
let gjs = readFileSync(join(root, 'game.js'), 'utf8');
gjs = gjs.replace(/ASSET_VER\s*=\s*''/, "ASSET_VER='" + ver + "'");
writeFileSync(join(www, 'game.js'), gjs);
console.log('game.js built with ASSET_VER=' + ver);

// คัดลอกโฟลเดอร์รูป assets/ (ถ้ามี) — รูปจริงของตัวละคร/ศัตรู ฯลฯ
const assetsDir = join(root, 'assets');
if (existsSync(assetsDir)) {
  const dst = join(www, 'assets');
  mkdirSync(dst, { recursive: true });
  for (const f of readdirSync(assetsDir)) { copyFileSync(join(assetsDir, f), join(dst, f)); console.log('copied assets/' + f); }
}

// index.html: ใส่ ?v=<build time> ให้ game.js เพื่อ bust cache (แก้แล้วโหลดใหม่เสมอ)
let html = readFileSync(join(root, 'index.html'), 'utf8');
html = html.replace(/game\.js(\?v=\d+)?/g, 'game.js?v=' + ver);
writeFileSync(join(www, 'index.html'), html);
console.log('index.html built with cache-bust v=' + ver);
console.log('www/ ready');
