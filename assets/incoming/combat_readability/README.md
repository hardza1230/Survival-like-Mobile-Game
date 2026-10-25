# Combat readability — ImageGen sources

Two original generation jobs plus one compact-projectile revision. PROMPTS.json records exact prompts/tool paths; PROVENANCE.json hashes every donor. Six-cell atlas provides player marker, danger rim, Elite crest, critical spark, windup flare and rare-loot glint. Compact bolt is a separate image. Generated alpha is preserved, including transparent ring centers.

Reproduce mechanical crops/resizes/lossless WebPs with python scripts/pack-combat-readability.py. MANIFEST records grid/crops/dimensions/source and runtime hashes. readability_review.png shows native assets and18/28/40px views. No programmatic art painting. Seven runtime images are in assets/art/combat_readability,68,324bytes total. The projectile canvas remains128x128, matching both legacy physics texture frames; warning hard-fill ratio0.8515625 calibrates decorative art around the exact native radius.

Source/contact/alpha checks passed. Runtime contracts are in tests/combat-readability.test.cjs. Owner phone readability/FPS review remains pending.
