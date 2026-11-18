// v8.2.9 owner (animation review, heroes): every pose the size of the run pose, a short squash hides sheet switches, squash/stretch visible (±15%), Cocoa punch uses all 8 frames, result-screen victory hop
const fs=require('fs'),assert=require('assert');
const src=fs.readFileSync(__dirname+'/../game.js','utf8');
const bp=src.match(/const BP_POSE_SCALE=\{([^}]*)\}/)[1];
for(const k of ['char_momo_attack','char_momo_dash','char_momo_sniper_charge_motion823','char_sesame','char_cocoa_attack','char_cocoa_rocket_motion823','char_cocoa_titan_motion823'])assert(bp.includes(k+':'),k);
assert(/const sqX=Phaser\.Math\.Clamp\(this\._sqX,0\.85,1\.15\);/.test(src),'player squash ±15%');
assert(/if\(texture!==this\._lastPoseTex\)\{[^}]*this\._sqX=1\.08; this\._sqY=\.92;/.test(src),'pose switch squash');
assert(src.includes("const calm=k=>k===idleK||k===runKey||k===idleK+'_idle'; if(a&&!(calm(a)&&calm(texture))){"),'no pop between idle and run');
assert(/Math\.min\(7,3\+Math\.floor\(\(pose\.t-pose\.wind\)\/\.05\)\)/.test(src),'Cocoa punch plays frames 3–7');
assert(/const limit=hasWalk\?0\.07:0\.12;/.test(src),'enemy hit squash visible');
assert(/targets:im,y:y0-18,duration:240,yoyo:true,repeat:2/.test(src),'victory hop');
// hit circle compensation still divides by the pose multiplier
assert(/r=24\/actMul; p\.body\.setCircle/.test(src));
console.log('Hero animation 8.2.9 passed');
