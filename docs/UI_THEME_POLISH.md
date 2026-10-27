# Theme polish, pass 1 — existing menu headers (8.0.57)

Owner priority: preserve the original game and make its visuals more orderly. The42exploratory mockups are color/material references, not replacement screen layouts.

This deliberately small first pass aligns typography and text roles in the existing generic, Heroes, journal Equipment/Forge and fallback Forge headers. It does not recreate those screens.

| Element | Visual adjustment |
|---|---|
| Generic page heading / Back / Sugar | NunitoUI rounded font, cream text, warm-gold currency |
| Heroes header | Same text roles; quieter dark title stroke |
| Journal Equipment / Forge heading | Same rounded font, keeping dark ink on existing light paper |
| Journal Back / Sugar | Matching cream and warm gold; existing green/gold painted control remains |
| Forge fallback heading / Sugar | Same text role colors |
| Unpainted generic Back control | Slightly warmer plum fill and thinner muted border, within its original rectangle |

headerTheme() supplies the shared roles. Existing text-fit rules remain. Existing header coordinates, button rectangles, Back callbacks, route stack handling, tutorial tags, currency values/abbreviation, page builders, content layout, fonts outside these headers, backgrounds, icons, illustrations, painted frame assets and controls remain as before. Different underlying paper/dark materials keep appropriate text contrast. Portrait/landscape and existing missing-art paths are retained.

No ImageGen, new assets, texture registrations, physics, gameplay, economy, save or reward changes. No new navigation, confirmation, transition or animation. The old game remains recognizable, with a modest consistency adjustment.

Verification uses existing roster, Power, Equipment/Forge/menu/tutorial regressions, full project checks and production build. Source diff is limited to header styling plus release documentation. No game captures or headless combat. Owner phone visual review remains pending; this pass does not claim the entire game's theme is finished.

## Pass 2 — familiar tabs/buttons (8.0.58)

Owner asked to continue while pass1was being delivered. controlTheme() reuses the header roles for labels, muted text and outlines. Existing native pill buttons use NunitoUI, cream labels, a softer gloss/shadow and thinner border; the caller-supplied base color/gradient/icon socket remain. Existing painted navigation/tab textures and positions remain, with a softer selected halo and matching text. Heroes tabs retain character tones and their current tabs/routes. Journal buttons retain their painted primary/secondary/accent/pill/pager materials and disabled/ink states, with matching light labels and quieter text outline. Forge fallback labels use the same cream. Menu toasts use the same font/surface/border while preserving their supplied semantic color, position and2600ms lifecycle.

Only font/color/line/shadow parameters change. Existing dimensions, corners, geometry, text-size rules, control hit rectangles, enabled/disabled callbacks, costs, tags, click sounds, drag suppression and navigation remain. Caller colors for danger/success/character identity are not replaced by one universal button color. Paper/painted assets stay in place. No new confirmation or interaction step, art, texture, animation or gameplay change. Existing progression/store/Forge/roster/menu-motion contracts plus required full check/build are used for validation; no new tests needed for this cosmetic pass.
