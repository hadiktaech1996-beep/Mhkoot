#!/usr/bin/env bash
set -euo pipefail

project_root=$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)
dist_root="$project_root/dist"

rm -rf "$dist_root"
mkdir -p "$dist_root/server" "$dist_root/.openai"
cp "$project_root/worker/index.js" "$dist_root/server/index.js"
if [ -f "$project_root/.openai/hosting.json" ]; then
  cp "$project_root/.openai/hosting.json" "$dist_root/.openai/hosting.json"
else
  # The real hosting manifest lives in the Sites project and is not part of this export.
  echo "Warning: .openai/hosting.json not found; writing empty placeholder manifest" >&2
  echo '{}' > "$dist_root/.openai/hosting.json"
fi

echo "Built $dist_root"
