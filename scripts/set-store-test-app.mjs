// Store-like test APK (android.yml job "store"): bundle the game in the app like the Play Store build
// (no server.url → no live update, every file is local) and give it its own app id so it installs
// next to the live-update test APK. Saves are separate (different app + origin).
import fs from 'node:fs';

const p = 'capacitor.config.json';
const cfg = JSON.parse(fs.readFileSync(p, 'utf8'));
delete cfg.server;
cfg.appId = cfg.appId + '.store';
cfg.appName = 'Mochi Store Test';
fs.writeFileSync(p, JSON.stringify(cfg, null, 2) + '\n');
console.log('store test build: bundled files, appId ' + cfg.appId);
