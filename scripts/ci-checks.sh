#!/usr/bin/env bash
# The exact checks the Pages deploy runs (single source of truth for CI and local release).
#   bash scripts/ci-checks.sh          → contract tests + build www/ + all browser UI checks
#   bash scripts/ci-checks.sh fast     → contract tests + build only (what gates the deploy job)
#   bash scripts/ci-checks.sh visual   → build + browser UI checks only
# Needs Playwright on NODE_PATH for the visual part (CI installs it; the cloud dev box has it pre-installed).
set -euo pipefail
cd "$(dirname "$0")/.."
mode="${1:-all}"
build(){
  node scripts/build-www.mjs
  for r in forge lobby ruby-story sesame-rune mint-vfx battle-vfx boss-vfx boss-body boss-shot battle-hud; do node "scripts/build-$r-review.mjs"; done
}
visual(){
  local fail=0
  for c in forge-live-ui lobby-live-ui ruby-story-ui asset-cache sesame-rune-ui mint-vfx-ui battle-vfx-ui boss-vfx-ui boss-body-ui boss-shot-ui battle-hud-ui; do
    if node "scripts/check-$c.cjs" > "/tmp/mochi-check-$c.log" 2>&1; then echo "ok   $c"; else echo "FAIL $c (log /tmp/mochi-check-$c.log)"; tail -15 "/tmp/mochi-check-$c.log"; fail=1; fi
  done
  return $fail
}
case "$mode" in
  fast)   npm run check; build ;;
  visual) build; visual ;;
  *)      npm run check; build; visual ;;
esac
echo "ci-checks $mode: PASS"
