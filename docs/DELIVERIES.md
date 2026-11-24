<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.81 — 🐛 Lure the Crown Root gets meaner (and more fun)

Owner: "Lure the Crown Root จืดเกินไป" → SCAMPER, owner picked items 1–4.
- **(1) Escalation:** each smashed stone = root +18% faster and warning 0.9 → 0.78 → 0.66 s; after the 2nd stone the root **splits into 2 heads**. It locks on as soon as it is within 190 px or after 2.2 s (was 150 px / 4 s waiting).
- **(2) Pull + combo:** the warning circle pulls normal monsters in (170 px); the strike kills normal monsters in 120 px (elites take 30%). 2+ kills = "Root combo ×N" +N 🍬.
- **(3) Perfect Dodge:** be inside the circle in the last 0.35 s and get out before it lands → slow-mo, +3 🍬, root stays stuck 1.6 s. The "Missed" text is gone.
- **(4) Finale:** the 3rd stone no longer ends the mission at once. The Crown Root head gets stuck (a 6× HP tank under `_timeStop`) for 8 s. Every 10% of its HP lost = 🍬 pop; killing it or timing out = burst + mission complete.
- Constants `CR_*`. Tests: new `tests/crown-root-8281.test.cjs`, `mission-reworks-828` updated. Headless browser: finale, pops, timeout burst OK with no errors.

# Previous delivery: v8.2.80 — 🫧 Clear the Fog: wider light, creeping darkness

- **Owner (screenshot Wave 2/5):** light around the hero too small, white circles floating in the fog, wants a scary moving dark edge.
  - Lantern radius 130→85 is now **200→150** (`CA_LANTERN`), refills to 200 on each freed wisp.
  - **White drifting puffs removed** — RenderTexture draws ignored the tint, so the 7 "poison puffs" showed as white blobs.
  - Hero light now has a **wobbling edge** (9 erased lobes that breathe, `CA_LOBES`) and **7 dark claws** (`CA_CLAWS`, new canvas brush `fog_brush_dark`) that reach in toward the hero and pull back.
- Test: `tests/cleanair-v2.test.cjs` (lantern 200→150, puffs gone, wobble + claws wired). Headless: fog draws with no errors.
