# Miniboss reward UI — 6.0.30

- Prize wheel: dedicated dark plum/gold reward-room backdrop, no emoji confetti, restrained circular highlights. The stop sequence now ends on the slot whose prize is awarded, including a tap before the first tick.
- Gold Bonus: three illustrated mystery-card backs replace question-mark placeholders. Revealed cards retain a faint illustrated background beneath their prize art and description.
- After minibosses: two fixed on-screen buttons replace world doors. Combat pauses until selection; there is no timeout. Existing chest rewards remain available.

| Choice | Effect |
| --- | --- |
| Blood Pact | Lose 30% of current HP, never below 1; +25% damage for 90 seconds. No attack-speed bonus. |
| Recover HP | Restore 40% of maximum HP, capped at maximum. No cost. |

## New assets

- `assets/art/rewards/prize_wheel_bg.webp`: 768×1152.
- `assets/art/rewards/mystery_card_back.png`: 256×384.

Both were generated with the built-in image tool and scaled for runtime.

Backdrop prompt: Refined midnight confectionery reward room, deep plum/navy, restrained gold framing and warm edge illumination, calm empty center for a prize wheel; no wheel, icons, text or bright pink haze.

Card prompt: Single vertical mystery-card back, polished 2.5D candy fantasy, indigo/plum with metallic gold frame and candy-kingdom seal around a rose crystal; straight-on, no text or question mark.

## Validation

`npm run check` includes reward regressions: both choices, HP bounds, single selection, 90-second damage expiry, modal deferral, non-expiring choices, illustrated card backs, and 24 wheel result/stop-timing combinations. `npm run build:www` validates packaging and version 6.0.30.

These are headless behavior checks; a device playtest remains useful for final touch/layout review.
