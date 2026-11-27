// v8.3.18 owner: Store APK would not install over the old one ("package conflicts") — CI made a new debug key every build
const assert=require('node:assert/strict'),fs=require('node:fs');
const wf=fs.readFileSync('.github/workflows/android.yml','utf8'),sc=fs.readFileSync('scripts/set-android-version.mjs','utf8');
assert(fs.statSync('android-signing/ci-debug.keystore').size>1000,'fixed CI signing key is committed');
assert(!/mochi-mayhem-debug-signing-v1/.test(wf),'no cache-based key (it never restored)');
assert(/storeFile file\("\\\$\{rootDir\}\/\.\.\/android-signing\/ci-debug\.keystore"\)/.test(sc),'gradle debug signing uses the fixed key');
assert((wf.match(/node scripts\/set-android-version\.mjs/g)||[]).length>=2,'both APK jobs apply it');
console.log('APK signing 8.3.18: fixed key for debug and store APKs passed');
