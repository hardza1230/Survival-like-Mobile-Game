# Latest checkpoint — art orders 27/28 source delivery

Updated 2026-10-20 Asia/Bangkok. Repo hardza1230/Survival-like-Mobile-Game; branch claude/vampire-survival-mobile-game-yo9e8w. Audited ff116c9b: both orders existed, no incoming journal/book assets or matching open PR. User requested audit and start/resume; produced all named art rows.

Order27: assets/incoming/journal_gear_ui/ — 30 PNG32 /69 frames, original summary33 corrected to actual table. Order28: assets/incoming/book_transition/ —7 PNG32 /26 frames incl. stills, original summary30 corrected. Sources have no baked letters/numbers; two opaque exceptions are jr_page_bg and bk_cover_closed. Manifest/prompts/corrections/QA/delivery guide/previews included. Original owner refs unchanged. Source decoded27=24.957MiB,28=34.473MiB; recommended runtime packing27=50% (~6.239MiB),28=80% per frame (~22.061MiB), not full PNG boot preload.

Checks: complete PNG decode, exact dimensions/grids/RGBA/hash, actual alpha, reserved blank icon cell, five tints, 9-slice panel60/180/420 and row300/392 samples, 11px ink/13px cream samples, four offline art page assemblies360x800/412x915 bounded without scrolling. Offline page-turn forward/back340ms and cover400ms; cover/page reveal width decreases monotonically. UPLOAD_VERIFICATION.json contains source-commit remote byte checks after publication. These are art-only checks, not runtime interaction/FPS tests.

**Runtime v7.9.9 unchanged. No journal/book assets registered or wired.** Next: integrate journal in buildGear/_buildCraftBenchRaw via lazy gear/craft group with existing fallback/hit zones; integrate menuTransition/showMenu lazy book group with curtain fallback, cover once-on-entry/tap skip, low-VFX/reduced-motion fade and cleanup. See both DELIVERY_README.md files and original orders. Then npm run check, relevant real-menu regressions and owner phone visual/FPS review. Owner's prior instruction: do not launch runtime screenshot QA; owner reviews on phone.

Local projectless workspace: work/repo (sparse clone), work/order27 and work/order28 hold generation ledgers/raw candidates; work/PROGRESS.md and technical packing/QA scripts preserve details. Final ZIPs and previews in outputs/. No active generation remains. Source publication/byte proof state is recorded in UPLOAD_VERIFICATION.json; no game version bump or runtime deployment claim.

Concurrent upstream updates preserved: v7.9.8 EXP fixes / art order29 and v7.9.9 box opening / boss talk at086f2ab arrived during production. Source-only delivery rebased onto that state; game.js and new order29 are untouched.
