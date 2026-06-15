#!/usr/bin/env bash
#
# Vendors the Figma design assets listed in assets/manifest.json into assets/.
#
# The page currently references the Figma CDN URLs directly (they expire ~7 days
# after they were exported). To make the assets permanent:
#
#   1. Run this script from the repo root:   ./scripts/fetch-assets.sh
#   2. Swap the remote URLs for local paths in index.html / styles.css, e.g.
#        https://www.figma.com/api/mcp/asset/<id>   ->   assets/<filename>.png
#
# Requires: bash, curl, python3. Network access to www.figma.com is needed
# (the exported asset URLs are only valid for ~7 days).

set -euo pipefail
cd "$(dirname "$0")/.."

manifest="assets/manifest.json"

python3 - "$manifest" <<'PY' | while IFS=$'\t' read -r name url; do
import json, sys
m = json.load(open(sys.argv[1]))
for name, url in m["assets"].items():
    print(f"{name}\t{url}")
PY
  echo "Fetching $name ..."
  curl -fsSL "$url" -o "assets/$name" || echo "  ! failed: $name"
done

echo "Done. Vendored assets are in assets/"
