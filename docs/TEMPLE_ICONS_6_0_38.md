# Flavor Weave Temple — v6.0.38

Three generated transparent icons are installed on the temple core cards at 48×48. Gameplay, prices, save data and permanent core bonuses are unchanged.

- `assets/art/temple/life_core.png`: strawberry-pink heart crystal in a cream mochi cradle with gold binding and mint leaves. Represents maximum HP.
- `assets/art/temple/flavor_spark.png`: amber sugar flame and central gold diamond in a cream mochi cradle. Represents attack power.
- `assets/art/temple/oath_shell.png`: sapphire protective shield with a fluted seashell face, pearl cream edges, gold binding and aqua gem. Represents defense.

## Generation

Built-in imagegen, one separate generation per icon. Shared prompt: premium hand-painted candy fantasy mobile RPG upgrade icon, one centered object on transparent alpha, bold silhouette readable at 48px, matching cream mochi/brushed-gold/jewel-enamel family, soft upper-left lighting, no text, typography, watermark, scene or broad external halo. Subject specifications are listed above. Original generated images were copied unchanged into the repository.

## Suggested interactions — not implemented

1. Living altar: three cores sit around a small loom; each purchased level lights a thread linking its core to the center. At all nine levels, a short skippable ritual signals that promotion is ready.
2. Weave blessing: on rank promotion, choose one small effect for the next run, such as one emergency heal, a short opening attack burst, or protection against the first hit. This adds a choice to the existing promotion cycle.
3. Visual evolution: higher ranks and Overcap milestones change the glow, gem details and filigree, while keeping each icon's recognizable silhouette.
4. Clear feedback: show the real before/after stat when purchasing a level, and briefly illuminate the corresponding core and thread.

Suggested first implementation: living altar and promotion ritual, then one next-run blessing choice. Combat effects require balance playtesting before setting numbers.

## Checks

`npm run check` and `npm run build:www`; all three source PNGs have transparent RGBA alpha. In-game physical-device visual testing has not been performed.
