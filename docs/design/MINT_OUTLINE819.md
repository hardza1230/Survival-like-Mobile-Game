# Mint painted-outline integration — 8.1.9

First batch of the owner-approved Sesame-style battle VFX family: eight clips/48 original ImageGen frames. Sources/prompts/QA/previews in assets/incoming/mint_outline819; runtime in assets/art/mint_outline819.

Glacier Bloom uses six owned-time snowstorm frames with ground-contact origin, a2.5×radius drawing footprint and a cosmetic frost-bloom finish. Existing four-second field/eight damage pulses/freeze and all targets remain. Low retains bounded procedural snow; reduced motion holds the peak pose. Old snowstorm remains fallback.

Frost Lance dash uses a six-frame trail following the original line. Impaler/normal lances and distance-emitted shards receive separate painted animated overlays while retaining their actual projectile bodies/geometry/speed/range/piercing/targeting/damage. Trail/projectile frames advance from existing gameplay dt, hold while paused/reduced and disappear with original owned effects/pool cleanup. The Lance Burst card still controls the end blast and its damage; new art does not grant it without the card. Rupture, charge muzzle and compact cold hits share the new ice vocabulary. The existing Mint55 character charge/walk/release sprites remain.

New keys are hero-lazy and always boot-deferred, eight clips2,004,790runtime bytes /9,043,968decoded bytes. Existing timers/effect and projectile caps/budget/fallbacks retained, no new damage timers, UI/audio/save/talent changes. Phone timing, contrast, correct footprint and FPS remain owner review before extending the style to Chocolate/Taro/Yuzu.
