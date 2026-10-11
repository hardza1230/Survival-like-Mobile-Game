# P1 delivery — v7.7.0 / 11 October 2026

- ImageGen produced one status/mastery sheet and one 16-frame skill accent atlas. Packed alpha WebP: Unique Mastery in `assets/art/talents/unique_mastery.webp`; Tremor, Frost Burn and skill_edges in `assets/art/p1_feedback/`. Frame map and dimensions are in MANIFEST.json.
- Screen art now uses two small edge accents, with 13 skill-specific frames across seven heroes. Max width 18% of viewport per side, opacity .34 and lifetime .75s. Repeated cast replaces previous accents; missing texture and VFX off gracefully skip. Classic procedural screen effects remain. Old full-screen illustrations are no longer registered or loaded; originals remain available for reference.
- Unique Mastery uses the same painted icon on every hero, including detail/locked states. The original 218 talent atlas entries and talent costs/behavior are unchanged.
- Tremor and Frost Burn use small 18px markers plus actual stack count; extra Tremor stacks from Talent remain visible. Markers follow targets, expire with the actual state, disappear on death/reuse and clear on transition/VFX off. Budget: 40 marked enemies, at most two markers per enemy. Damage/stack rules unchanged.
- Reviewed source crops for all seven heroes at portrait widths 320, 390, 644 and 900; Berry Core's mouth was clipped. Its crop now covers height .14–.82 rather than .03–.58. Other hero crops unchanged. Existing landscape equipment uses full-image contain sizing.

## Preview and evidence

- `p1_preview/direction_mockup.png`: ImageGen concept mockup, **not a live game capture**. The runtime accents are smaller and shorter than this concept.
- `p1_preview/equipment_portrait_review.jpg`: static source-crop contact sheet from actual registered character textures; reconstructed geometry, **not a live game screenshot**.
- `p1_preview/equipment_landscape_review.jpg`: full-image contain review for all seven original portraits.
- Tests: p1-feedback (13 mappings, edge bounds/expiry/replacement/off, status follow/expiry/death/budget), equipment-portrait (all seven IDs including Berry-specific crop), talent-icons (shared Unique Mastery plus original mappings), full npm check and build:www.

Browser UI automation failed to initialize on this host. Actual phone/landscape visual review and FPS/listening review remain pending. No headless gameplay simulation was run. P1 assets and runtime integration are delivered; manual device QA is explicitly not marked complete.
