# Main menu reference finish

| Element | Implementation |
|---|---|
| Main illustration | Clean candy-castle Strawberry plate from approved concept |
| Logo | Cream raspberry painted MOCHI MAYHEM / FLAVORBOUND |
| Play | Wide pink primary frame, existing painted icon, native text |
| Secondary | Shared plum/gold frame for Heroes, Gear, Activities, Codex, More |
| Header | Shared painted capsules, actual currency/version and quest |
| Progress | Original unlock guard, notification dots and gold next-action tag |
| Mobile | Four menu rows fill lower viewport; title fitting and full touch zones |
| Landscape | Menu on right; art and logo on left |

Asset provenance and crop coordinates: assets/incoming/hub_reference. Keep routes, save fields and combat behavior intact. QA: actual menu methods at phone/tablet/landscape sizes, full checks/build, then live UI review. Owner tests real gameplay.

Live review correction v7.7.17: nine-slice chrome scales corners uniformly to button height and extends only its centre. Logo keeps original 1200:310 crop aspect, with vertical placement computed above the hero capsule; no overlap.

Owner image(9) feedback v7.7.18: remove Next target widget entirely from Hub (quest reward system stays live); pad candy/number, narrow version; alpha-trim frames; larger full-width Play and tighter row gaps; larger bright Nunito labels without muddy outlines; centred More group; preserve native image aspect for logo, arrow, footer; gold gradient guide badge. Live screenshot image(9) was v7.7.16; v7.7.17 proportions are included in this correction.

Canvas compatibility v7.7.19: Phaser NineSlice rendered no frames in live cloud Canvas. Replace it with nine ordinary cropped Images in one container; uniform corner scale and full rectangular coverage verified.
