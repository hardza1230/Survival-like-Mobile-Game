// v8.2.74: phase 3/5A/5B frame upgrades replaced 100 registry rows. Older art tests still verify the
// original deliveries (files stay on disk), so they read game.js with those rows restored.
const P=require('./motion-phase3-5-legacy.json');
module.exports=src=>P.reduce((s,[now,old])=>s.split(now).join(old),src);
