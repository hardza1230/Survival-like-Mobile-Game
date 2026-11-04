# Boss projectile motion and ordered-art closure — 8.1.17

The final ordered batch adds64authored frames to the16existing boss projectile identities. Four original ImageGen atlases retain the compact silhouettes, right-facing heads and established palettes. All native1254-square sources, exact prompts, references, manifests, alpha/border/hash QA and mechanical packing are retained in assets/incoming/boss_shots817. Runtime strips total575,618bytes /4,194,304decoded bytes across the whole family and remain stage-lazy.

The original pooled bullet receives a new128px frame texture after its existing scale and rotation are chosen. A separate owned wall clock advances four frames at8fps; there are no extra physics objects, timers or events per bullet. Pause holds elapsed time; Low/reduced retains a steady pose. Serial/player/stage/epoch/texture guards and shutdown/reuse cleanup remove ownership and restore the static fallback without destroying the pooled actor. Damage, lifetime, movement, hit circles, behaviour and no-projectile boss rules remain unchanged.

Validation: production-method parity tests for16styles, explicit damage/lifetime/velocity/geometry assertions, asset integrity and64distinct cells; static real Phaser Arcade/Canvas before/after/restore world bounds and pooled cleanup across six layouts. Full game checks and ten browser contracts cover the final release. These checks do not simulate combat or measure mobile FPS.

## Ordered work delivered

1. 8.1.14 publication recovered: Pages41864376182 /APK41864376011 succeeded; live version/code/all28new asset hashes verified.
2. Chapter3 and Pinnacle VFX:8.1.15,36clips216frames. Pages41877052587 /APK41877052203 succeeded; live code/all36asset hashes verified. See DELIVERY815.md.
3. Animated physical boss bodies:8.1.16,21identities /22visual forms /264frames, including all five C3minibosses. See DELIVERY816.md.
4. B01 actual source/frame sharpness increased160→256 without enlarging its world footprint; B05 mouth/eyes and B06 upright bud/face/roots separated in the same8.1.16 body delivery.
5. Sixteen compact animated projectiles:8.1.17,64frames; C3miniboss outline/motion polish included in8.1.16.
6. Owner explicitly waived agent phone testing and will playtest himself.

Combined boss-art work813–817:96VFX clips /576frames +264body frames +64projectile frames =904authored frames. Original identities, AI, attack intervals, damage and physical bounds are retained. Explicit charge wind/strike cues follow existing release callbacks; other body pose sequences interpolate within their original pose intervals.

Owner review suggestions: B01 edge clarity; B05 versus B06 silhouettes; C2-2 fog shelter visibility; C3/Pinnacle warning gaps; projectile readability during dense attacks; pause/resume and Low effects. No device-specific performance claim is made.

## Final publication verified — 5November2026

- Game/art commit:e01180437ba078508b8458b0d3dd31123099a836. All47changed files /9,317,351bytes were fetched from the immutable commit, compared byte-for-byte and fully decoded where applicable. Local and remote Git trees matched.
- CI-only recovery:53ff71c49b2eee6c842e145394b111b05426fbbd, both changed files /8,232bytes verified. Original game/art bytes remain identical.
- [Pages41890956493](https://github.com/hardza1230/Survival-like-Mobile-Game/actions/runs/41890956493) and [Android41887138733](https://github.com/hardza1230/Survival-like-Mobile-Game/actions/runs/41887138733) succeeded.
- [Live game](https://hardza1230.github.io/Survival-like-Mobile-Game/) reports8.1.17. Version/code registries and ALL133boss-art files /904frames /44,333,442bytes match source-manifest byte counts and SHA-256. This includes all813/814/815VFX,816bodies and817projectiles.
- Full npmcheck, web build and all ten browser contracts passed locally; the published run repeated these checks successfully.
- First deployment attempt stalled in updating_pages and timed out after600seconds. Re-running that workflow exposed duplicate artifacts from different attempts. Upload/deployment artifact names now include github.run_attempt and publishing permits1200000ms; the fresh run succeeded. No game or art changes were required for the recovery.
- Ordered tasks1–5 are complete. Agent phone tests were explicitly waived; owner device appearance, feel and FPS review remains with the owner.
