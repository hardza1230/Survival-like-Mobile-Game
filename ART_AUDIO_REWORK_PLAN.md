# Mochi Mayhem: Character, Enemy, VFX, and Sound Rework Plan

## Goal

Replace prototype-looking combat presentation with readable, tactile dessert-action feedback while preserving current Phaser gameplay, pooled enemies, asset keys, and mobile performance.

## Current baseline

- Three playable hero sheets use the standard eight 128×128 character frames.
- Dasher and Siege already load as four-frame sheets; other regular enemies are mostly static sprites.
- Nineteen VFX flipbooks and core SFX/BGM assets are already registered in `game.js`.
- Missing quality bar: consistent sprite silhouettes, complete enemy action states, hit/death readability, sound mixing, and device-budget validation.

## Non-goals for this pass

- No combat-balance redesign, new progression systems, or new enemy behaviors.
- No replacement of Phaser, asset loader, pooling, or the existing save format.
- No AI-generated asset committed without frame, alpha, pivot, and in-game readability review.

## Delivery order

### 1. Asset contract and visual tests

Lock one delivery contract before commissioning or generating art.

- PNG-24, sRGB, transparent background; assets remain under `assets/`.
- Characters: horizontal eight-frame strips, 128×128 per frame, using existing `CF` indexes: idle, blink, squash, stretch, cheer, hurt, KO, cast.
- Enemies: 2× native render size, bottom-center pivot, one clearly readable silhouette at 44–62 gameplay pixels.
- VFX: eight-frame strips, additive-compatible where intended; every effect has a documented frame size, frame rate, anchor, and lifetime.
- Sound: WAV, 44.1 kHz, mono for positional combat SFX; stereo only for music/UI where useful. Keep transient peaks below -1 dBFS.

Acceptance: a local asset validator reports frame dimensions, alpha presence, and every manifest key resolves.

### 2. Hero sprite and animation polish

Rework Momo, Mint, and Cocoa first. Keep their established toppings, palette, and eight-frame indexing from `ART_BIBLE.md`.

- Redraw each pose to improve facial readability and motion extremes without changing frame meaning.
- Preserve engine-driven jelly physics; artwork supplies pose clarity, not a second full squash-and-stretch system.
- Add a short cast sparkle and hurt flash only through the existing VFX/tint hooks.
- Verify sprites against Pantry, Sink, Stove, Freezer, and Oven backgrounds.

Acceptance: each hero completes idle, dash, cast, hurt, and KO transitions without clipping, wrong pivot, or texture fallback.

### 3. Enemy families and action states

Prioritize combat readability over detail.

| Family | Required states | Primary read |
| --- | --- | --- |
| Basic / Fast / Tank | idle-walk, hurt, defeat | speed and threat tier |
| Shooter / Bomber | idle-walk, wind-up, release, defeat | attack timing |
| Dasher | idle, tell, dash, recover, defeat | directional lunge |
| Siege | idle, aim, fire, reload, defeat | long-range hazard |
| Mini-boss / boss | idle, telegraph, attack, phase, defeat | safe reaction window |

- Ship Basic/Fast/Tank first as an aligned family, then Shooter/Bomber, then Dasher/Siege.
- Use animation names and metadata in one manifest object; avoid scattered frame indices in gameplay methods.
- Add event markers for impact frames so animation, VFX, and SFX trigger from the same source event.

Acceptance: every attack telegraph is readable at mobile scale before damage is applied; enemy pooling never retains a prior animation/tint/state.

### 4. VFX rework

Audit existing flipbooks before adding new ones. Keep effect layers separate: telegraph, cast, projectile/trail, hit, death, reward, and UI feedback.

1. Rework highest-frequency feedback: basic hit, enemy defeat, Sugar pickup, dash trail.
2. Rework core skills: Sprinkle, Chili Nova, Frost Pulse, Beam/Thunder.
3. Rework ultimates: Sugar Bomb and Cocoa Vortex.
4. Add boss telegraphs and phase aura only after core effects pass readability tests.

Rules:

- Telegraph colors never match player-benefit colors.
- Reduce particle count before reducing telegraph contrast.
- Enforce a per-effect particle cap and pooled lifetime. Disable optional embellishment first on low-performance devices.

Acceptance: effects remain legible with 80+ enemies on screen and do not hide hazards, player position, or HP/Toast HUD.

### 5. Sound pass

Keep current asset keys where possible. Extend `ASSET_AUDIO` only when a new event needs a distinct gameplay signal.

- Player: movement squish, dash launch/land, cast, hurt, KO.
- Enemies: spawn, wind-up, attack release, hit, defeat; one shared family sound plus boss-specific signals.
- VFX: pair one short transient with important impact frames; avoid stacking duplicate hit sounds.
- UI: button, level-up, reward, pause, Toast danger/critical state.
- Music: retain five stage tracks; set loop points and duck music slightly during boss telegraphs/ultimates.

Mix rules:

- Use per-category volume groups: music, UI, player, enemy, VFX.
- Add cooldown/concurrency limits to frequent SFX such as hits and pickups.
- Test mute, resume-after-background, missing-file fallback, and rapid repeated events.

Acceptance: no audible clipping or sound spam during a dense 60-second wave; every high-risk enemy action has a distinct cue.

### 6. Integration, QA, and release gate

- Add a development-only asset verification scene or command that plays all sheets, VFX, and SFX in sequence.
- Test 390×844 portrait and a low-end Android profile; record FPS, draw calls, active particles, and concurrent sounds.
- Run a ten-minute survival soak: no missing texture/audio, stale pooled state, memory growth, or stuck animation.
- Update `ART_BIBLE.md` inventory only after accepted assets replace prototype versions.

Release gate: all reworked assets load through the existing fallback-safe path, gameplay remains unchanged, and mobile performance stays within the agreed budget.

## Suggested milestones

1. **M1 — Contract + hero polish:** asset validator, Momo/Mint/Cocoa approved.
2. **M2 — Combat readability:** core enemy families, hit/death, dash, and pickup feedback.
3. **M3 — Skill spectacle:** core skills, ultimates, boss telegraphs, sound categories.
4. **M4 — Device QA:** performance pass, soak test, APK/browser verification.

## Stop condition

Stop after M1 unless hero sheets pass in-game review. Do not mass-produce enemy, VFX, or sound assets before one complete hero-to-gameplay integration loop proves the contract.
