// v8.2.74–75: animation phases 3/4/5 replaced registry rows (and a few clip lists). Older art tests still verify the
// original deliveries (files stay on disk), so they read game.js with those rows restored.
const P=[...require('./motion-phase5c-6-legacy.json'),...require('./motion-phase3-5-legacy.json'),...require('./motion-phase4-legacy.json')];   // v8.2.84 newest first
module.exports=src=>P.reduce((s,[now,old])=>s.split(now).join(old),src);
