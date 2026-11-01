# Art order 61 — source-only cutscenes

Delivery is incremental by chapter. `MANIFEST.json` lists only completed final assets, their hashes and sizes. `PROMPTS.json` keeps actual generation prompts/identity inputs and names completed keys; future chapter jobs may be present as plans. No runtime assets, scripts, registration, story text, gameplay flow or version changes are included.

- `b01`–`b15`: opaque fall scene, genuine-alpha freed form, one layered `preview_360x780.png`, and optional three-shot contact proof. Preview labels/dialogue-safe panels are not baked into final art.
- `shared`: chapter onward scenes and two opaque-black eight-frame FX strips. Extract FX with the existing max-RGB ×1.35 alpha and straight-color recovery convention.
- `sources`: unchanged ImageGen outputs. `references`: first-frame crops from the exact sprite files in the order, plus Ruby's original mascot. References establish identity, not poses to paste into scenes.
- `CROWN_POINTS.json`: visually checked crystal/crown center in **final 1080×1920 pixel coordinates**, also copied to each Fall record in the manifest. Crown overlays should use that coordinate transformed by the consumer's actual image crop/scale.

Run `python assets/incoming/boss_cutscene61/prepare_sources.py --chapter 1` (or 2/3 as delivered) with Pillow and numpy to reproduce source packing and proofs. Mechanical resizing/cropping/repacking only; the helper writes only inside this incoming directory. Portraits use uniform centered cover to exact size; cutouts preserve generated alpha and fit safely inside 768×1024. Boss05 remains a small seed rather than a person. FX use a shared cell transform across phases and remove only generated gutter lines.

Identity takes precedence where descriptive shorthand differs from actual sprites: Colossus retains its mechanical harvester body in Fall; Hollow Bloom retains its woody orchard form; Seedwarden remains an owl; First Planter's thorned seed-pod form is retained until the elder is revealed in Freed. Ruby stays a round pomegranate-jam spirit with gem, gingham apron and recipe book, never human. The bosses are weary, not dead.

Proofs are **source-art compositions, not runtime captures**. Each panel is a 360×780 viewport; full 9:16 art fits within the top 360×640 and a proof-only blurred footer fills the remaining space. Freed is layered on the existing boss45 memory background with the original Ruby mascot. Onward combines the new painted scene with a sample flavor ribbon. Actual timing, transitions and runtime framing remain integration work.
