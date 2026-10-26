# Companion buff spectacle · v8.0.51

Owner approved: finishers first, opening/active buff identity, normal hit accents and aligned ElevenLabs sound. Presentation only; v50 Unique damage, durations, cooldowns, hit geometry, AI, immortality, cards/talents, rewards and EXP are unchanged.

## In-game sequence

| Companion | Activation / active buff | Last .6s | Actual finisher |
|---|---|---|---|
| Pomelo | Golden peel armor assembles around an empty center. A small brief armor accent returns every1.2s. | Concentrated peel plates and a quiet growth cue. | Gold ground rupture expands into a broken ring with peel/stone fragments and dissipates. |
| Lime | Spectral leaf bow draws in light; small intermittent focus aura. A60px short leaf mark highlights its priority enemy. | Bow draw gathers light, followed by the existing release cue. | Painted horizontal light arrow releases, with a matching static painted projectile replacing its old appearance. Actual piercing collision/speed/lifetime unchanged. |
| Blood Orange | Honey, leaf and ember combine into a hollow citrus wreath, followed by brief small alchemy accents. | Ingredients condense with a quiet growth cue. | Three-flavor petal burst blooms outward into a thin flower wave, then fades. |

Opening165px/.65s; active accent105px/.4s; final charge135px/.5s. Finishers380px/.72s,210px/.42s and342–420px/.8s respectively. They do not delay actual game-time hits. No full-screen flashes, camera shake or timing slowdown added.

Normal successful hits receive a small52–74px painted impact, throttled140ms per companion. Focus arrows/infused orbs leave a34–42px short trail, globally throttled180ms; infused bounces gain a small Sour glint. The existing139 original ElevenLabs assets supply opening, gathering, release and impact cues. Added impact uses low-volume `pow_thud`/`pow_pop` with180ms Sfx throttle and existing mute/volume handling; no new synthesis or audio files.

## Art and provenance

Built-in ImageGen generated3original transparent donors,8frames each (4opening +4finisher), under `assets/incoming/yuzu51/`. Exact prompts are adjacent `*_PROMPT.json`. Source-only `alpha_review.png` composites all24packed frames onto a dark matte to verify clean cutouts; it is not gameplay.

Mechanical `scripts/pack-yuzu-51.py` uses observed empty row gutters and measured alpha-energy valleys between subjects instead of assuming perfectly equal generated cells. Per-cell crops share a common row scale, preserve alpha and add padding; no generated shapes are drawn or backgrounds synthesized by code. Runtime `assets/art/yuzu51/MANIFEST.json` records exact source rectangles, crops, hashes, alpha and bytes. Three lossless1536×192 sheets contain eight192px cells each:876,448bytes total,3,538,944decoded bytes (~3.375MiB), loaded only for Yuzu. Current GPU-budget contract reports Yuzu297MB under300MB, with other heroes unchanged.

## Lifecycle and readability

Reuse the existing shared `_yzShow` budget: at most4decorative sprites, each≤420px; large opacity≤.5, small≤.68, NORMAL blend. A finisher replaces incidental decoration first and then the oldest important effect if needed. No extra sprite pool. Opening/active accents belong to the current buff and disappear on recast/cancel; finishers live independently until their short fade completes. Existing player/basic/path-through-clear/art-epoch/death/menu/shutdown guards remain. Pooled enemy marks also require the original spawn ID. Follow effects update depth alongside their anchor.

Pause freezes FX clocks. Reduced motion keeps one brief still frame,≤.35s; held active accents do not animate or spin. Low VFX skips new decoration and uses the old heavy-arrow projectile, preserving gameplay cues. Missing new textures retain older finisher/opening effects. No new sustained opaque area effect is introduced.

## Verification

`tests/yuzu-spectacle.test.cjs` covers all three atlases, both four-frame offsets at30/60/120FPS, source/runtime hashes, shared cap/finisher priority, Low/reduced/pause/held frames, buff cancellation, pooled follow identity, once-only anticipation, impact throttling and ElevenLabs cue selection. Existing companion numerical/timing/AI and animation adapters continue to pass. Full checks/build and exact publication are recorded in the session handoff. Source alpha composite was visually inspected; no combat simulation or automatic game screenshots. Owner phone playtests remain necessary for subjective readability, sound balance and FPS.
