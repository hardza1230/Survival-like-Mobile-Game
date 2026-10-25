# v8.0.42 — Player outline layering fix delivered

Runtime commit 7f85e7a66253f0acf8d8af3e4510f63f7aee7697 on claude/vampire-survival-mobile-game-yo9e8w. Tested local96349a2a961a12f933471a116a0d4e871bd045d0 tree94f0ad849a460356e9d442a5c42e7068dd4bb43d matched remote exactly. Immutable raw readback verified all4 changed files /3,104,705 bytes. Full npm run check and npm run build:www PASSED (2269 assets, v8.0.42); diff whitespace clean.

Owner reports pale outline covers hero while walking. Root cause: outline copied previous player depth before current isometric Y sorting, making upward motion put it in front. Presentation sync now follows depth/shadow update. Regression runs production presentation sequence for up/down/stationary/negative Y/non-iso and checks pose/frame/transform/depth parity and sprite reuse. No art/physics/balance changes. No local gameplay simulation/screenshots; owner phone visual review pending. Files game.js,tests/combat-readability.test.cjs,CLAUDE.md,this checkpoint.

Deployment checked ONCE: Web Pages and Android APK workflows in_progress; live8.0.41 at check. Do not assume live8.0.42 or repeatedly poll.

Next request arrived during publish: owner wants Sniper charge a little stronger; message ends 'currently firing…'. Asked whether automatic Basic charge, held Unique, or both. Investigation only so far: Basic fireMomoChargeSeed damage multiplier3.2 at game.js~17329; legacy sniper fire branch~16639 also3.2; Unique releaseSnipe~8616. No Sniper changes made. Continue after clarification or reasonable assumption. Preserve unrelated untracked incoming art. Prior139 audio delivered;6A04 music pending Music Generation access.
