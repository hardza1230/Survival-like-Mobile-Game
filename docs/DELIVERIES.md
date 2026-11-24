<!-- scripts/bump-version.mjs keeps the newest two release notes in this file (Latest + Previous); older ones move to docs/CLAUDE_HISTORY.md -->

# Latest delivery: v8.2.80 — 🫧 Clear the Fog: wider light, creeping darkness

- **Owner (screenshot Wave 2/5):** light around the hero too small, white circles floating in the fog, wants a scary moving dark edge.
  - Lantern radius 130→85 is now **200→150** (`CA_LANTERN`), refills to 200 on each freed wisp.
  - **White drifting puffs removed** — RenderTexture draws ignored the tint, so the 7 "poison puffs" showed as white blobs.
  - Hero light now has a **wobbling edge** (9 erased lobes that breathe, `CA_LOBES`) and **7 dark claws** (`CA_CLAWS`, new canvas brush `fog_brush_dark`) that reach in toward the hero and pull back.
- Test: `tests/cleanair-v2.test.cjs` (lantern 200→150, puffs gone, wobble + claws wired). Headless: fog draws with no errors.

# Previous delivery: v8.2.79 — 🕳️ Hunger Crack no longer hangs at the end

- **Owner bug "Hunger Crack ชอบค้างตอนจบ":** the final hole waited until *every* tagged monster died (or 60 s), so 1–2 stragglers far away kept the wave open with nothing on screen.
  - Now: when ≤2 crack monsters are left for 6 s, the crack seals and the wave goes on; the stragglers become normal monsters (`HC_FINAL_TAIL=2`, `HC_FINAL_TAIL_SEC=6`).
  - Hard cap for the final phase 60 → 50 s (`HC_FINAL_MAX`).
  - Holes are clamped onto the path (`Math.min(L,…)`) so a very short crack can't leave its last hole unreachable.
- Test: `tests/hunger-crack.test.cjs` (5 left keeps going · ≤2 for 6 s completes · stragglers untagged · holes on path).
