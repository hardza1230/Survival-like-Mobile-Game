import fs from 'node:fs';

const manifest = 'android/app/src/main/AndroidManifest.xml';
let xml = fs.readFileSync(manifest, 'utf8');
const activity = xml.match(/<activity\b[\s\S]*?>/);
if (!activity) throw new Error('Main activity tag not found');

let tag = activity[0];
if (/android:screenOrientation=/.test(tag)) {
  tag = tag.replace(/android:screenOrientation="[^"]*"/, 'android:screenOrientation="sensorLandscape"');
} else {
  tag = tag.replace('<activity', '<activity\n            android:screenOrientation="sensorLandscape"');
}
xml = xml.replace(activity[0], tag);
fs.writeFileSync(manifest, xml);
console.log('Android orientation: sensorLandscape');
