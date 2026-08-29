// ประกอบโฟลเดอร์ www/ ที่ Capacitor ใช้ (webDir) จากไฟล์เกมที่ root
// คัดลอก index.html + game.js + phaser.min.js เข้า www/ (ไม่ commit www/ — สร้างตอน build)
import { mkdirSync, copyFileSync, existsSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
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

// version.json: ดึง GAME_VERSION + CHANGELOG จาก game.js (แหล่งเดียว กันข้อมูลไม่ตรงกับหน้า download)
try {
  const verM = gjs.match(/GAME_VERSION\s*=\s*'([^']+)'/);
  const clM  = gjs.match(/const\s+CHANGELOG\s*=\s*(\[[\s\S]*?\]);/);
  const version = verM ? verM[1] : '0.0.0';
  const changelog = clM ? (new Function('return ' + clM[1]))() : [];
  writeFileSync(join(www, 'version.json'), JSON.stringify({ version, changelog }, null, 1));
  console.log('version.json built: v' + version + ' (' + changelog.length + ' entries)');
} catch (e) { console.warn('version.json skipped:', e.message); }

// download.html: หน้าแลนดิ้งดาวน์โหลด (โหลด version.json ไปแสดง)
if (existsSync(join(root, 'download.html'))) {
  copyFileSync(join(root, 'download.html'), join(www, 'download.html'));
  console.log('copied download.html');
}

// คัดลอกโฟลเดอร์ assets/ (รูปจริง + เสียง audio + bg)
function copyDirRecursive(srcDir, dstDir) {
  mkdirSync(dstDir, { recursive: true });
  for (const f of readdirSync(srcDir)) {
    if (f === 'assets' || f === '__pycache__' || f === '.DS_Store') continue; // ข้าม assets/assets/ ต้นฉบับดิบ
    const src = join(srcDir, f);
    const dst = join(dstDir, f);
    if (statSync(src).isDirectory()) {
      copyDirRecursive(src, dst);
    } else {
      copyFileSync(src, dst);
      console.log('copied ' + join(dstDir, f).replace(root, ''));
    }
  }
}
const assetsDir = join(root, 'assets');
if (existsSync(assetsDir)) {
  copyDirRecursive(assetsDir, join(www, 'assets'));
}

// index.html: ใส่ ?v=<build time> ให้ game.js เพื่อ bust cache (แก้แล้วโหลดใหม่เสมอ)
let html = readFileSync(join(root, 'index.html'), 'utf8');
html = html.replace(/game\.js(\?v=\d+)?/g, 'game.js?v=' + ver);
writeFileSync(join(www, 'index.html'), html);
console.log('index.html built with cache-bust v=' + ver);
console.log('www/ ready');
