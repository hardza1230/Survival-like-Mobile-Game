# Lobby layout and missing art — v7.9.89

Owner request: audit the Lobby, repair disorganized layout, and use ImageGen for missing art.

Confirmed in the real production Phaser Canvas with synthetic menu data: cramped currency numerals, a full-screen dim layer painted above controls, dialogue across the hero, long stage titles touching power, and gaps when shortcuts were locked. Settings was the remaining procedural main-control icon. Existing Lobby frames, hero art, dialogue panels and painted shadow were reused.

## Delivered

- `ic_lb_settings`: warm ivory/gold painted cog, 128×128 WebP.
- `lb_currency_plain`: empty plum/gold panel without a baked-in plus, 192×40 WebP with symmetric 22px end caps.
- Runtime total: 11,020 bytes; decoded RGBA 96,256 bytes. Both use existing Lobby-only lazy loading.
- Original built-in ImageGen images and exact prompts: `assets/incoming/lobby_polish/raw/`, `PROMPTS.json`. Packing only crops, resizes, registers and encodes donor pixels; reproduce with `python scripts/pack-lobby-polish.py`. Alpha, complete image decode, dimensions, source/runtime SHA256 are checked and retained in `MANIFEST.json`.

Header gives currency a separate lane and compact K/M/B values; the entire unlocked pill opens Bazaar or Chests. Profile retains name, level, EXP and rank; power stays with the stage recommendation. Long names retain level and truncate cleanly. Settings is painted. Locked shortcuts occupy no empty rows. The dim layer stays behind controls, hero glow is softer, and existing painted foot shadow is used. Dialogue has a bounded center band above the hero, clear of both shortcut rails. Stage title truncates within its own column; chapter selection shows full names. Version sits above the bottom navigation.

## Review and limits

`scripts/build-lobby-review.mjs` invokes the actual Lobby/nav builders in a real Phaser Canvas; it does not enter combat. Synthetic balances, unlocked progression and static-card hero fallback make the menu deterministic. `scripts/check-lobby-live-ui.cjs` checks 320×568,360×640,360×780,390×844,412×915, early and unlocked progression, all 36 personality lines per viewport/state (360 dialogue states), crop-aware rendered panel bounds, shortcut/hero clearance, text overlap and menu routes. Screenshots are in `assets/incoming/lobby_polish/review/`; before and after 360×640 share the same original background/assets. Review is now a Pages CI gate using the existing browser dependency.

Required automated check and web build passed. Owner requested this visual audit, so menu screenshots were taken; no combat or balance simulation. Actual phone animation/FPS and touch feel remain owner validation.
