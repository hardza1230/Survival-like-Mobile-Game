# Reward wheel and combat HUD — v6.0.43

The Bonus Level-up reward now has a painted growth-chevron icon. Additional painted icons identify Weave Thread, digging shovels, ancient scrolls, Unique recharge, and the large Sugar prize.

The full reward pool contains 12 outcomes. Weights choose a winner from the entire pool; the wheel displays eight slots, always including that winner. This keeps the original weighted selection semantics while avoiding crowded slots.

| New reward | Bronze / Silver | Gold |
|---|---|---|
| Weave Thread | 3 | 5 |
| Shovels | 1 | 2 |
| Ancient Scroll | 1 | 1 |
| Unique recharge | Ready immediately + heal 15% max HP | Same |

The painted backdrop covers both viewport edges while preserving aspect ratio and aligning the painted ring center. Stage progress occupies a row above the boss name and HP. Resize updates the progress frame and fill together.

Regression checks exercise each possible winner with eight and twelve outcomes, persistent material rewards, health caps, five phone/tablet viewports, and vertical separation of the progress label, progress meter, boss name and boss HP.

## Imagegen

Generated with the built-in imagegen tool. A regular 3×2 transparent atlas is cropped into six 256px WebP icons, retaining alpha.
