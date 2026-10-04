# Recipe summons — VFX batch 5

Release v6.55.10. Three transparent 512×512 PNG sources, matching lossless WebP runtime images in assets/vfx. Generated together, separated and packed with consistent transparent margins. Upper-left light, dark outlines, candy 2.5D style; NORMAL blend.

| File | Use |
|---|---|
| recipe_meteor.png | Downward strawberry-sugar meteor; 64px display |
| recipe_orbit.png | Three lollipops orbiting player; 32px display |
| recipe_buddy.png | Friendly Dango helper; 42px display |

Meteor retains 420ms fall, 120ms stagger, 70px base blast and 2.2× relic damage; painted warning/impact reuse batch 4 shock. Orbit retains 3 candies, 70px base radius, 4s base duration, 250ms ticks and 0.5× damage. Helper retains 5s duration, 56px orbit, 450ms shot interval, 420px targeting, speed 560 and 0.7× damage. Recasts refresh existing summons. All art is tracked and destroyed on transitions; epoch guard prevents cancelled meteor damage crossing runs. Tests execute actual runtime methods. Full checks/web build required; phone visual review pending.
