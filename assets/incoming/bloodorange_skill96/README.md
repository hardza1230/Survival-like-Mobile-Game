# Blood Orange skill redraw — v8.0.96

Owner requested clearer, more distinctive Blood Orange magic. Built-in ImageGen reference-guided redraw of all5spells and2Unique clips. Original pre-redraw sources remain unmodified in yuzu51/yuzu54. Actual3generation prompts/ref paths retained; arsenal revision1 archived after correcting tight source framing.

Newpaint: garnet/bloodorange/tangerine, opaque ivory hotcores and bold burgundy contours. Thick rind/petal/drop shapes read on mobile, with transparent gaps/opencenters. Newruntime128pxlossless sheets: yz_bo96_arsenal(20frames,four each sigil/comet/garden/bloom/honey) and yz_bo96_unique(8frames,open/finish). Runtimekeyprefix keepsheroYuzu loading; folder isdeferred evenwhenYuzu selected atboot, loaded beforebattle.

Run python scripts/pack-bloodorange-skill-96.py from repo root to reproduce runtimeatlas/metadata/review/GIFs. Mechanical cell extraction/common-per-clip scaling only; no synthetic or code-painted VFX. Source original PNGs and exact prompts retained. MANIFEST records hashes/rectangles/clip offsets, QA_REPORT technical checks. review.png compares old/new at64px on same realfloor including old/new drawopacity (not a gameplay screenshot). PerclipGIFs show progression.

Integration: onlynewBloodOrange art raises shortclip opacity to0.9 andlargeclip to0.82, with animated fade retained. Persistentgarden usesnewpeak frame10at0.38alpha, belowactors. Oldloadedart andgenericfallback remain. Othercompanionalpha/caps/size/radii/damage/skilltimings/AI unchanged. Ownerphone readability/FPS review pending.
