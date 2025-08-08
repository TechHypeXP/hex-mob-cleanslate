#!/usr/bin/env bash
# repo-readme-rollout.sh — Apply enhanced 10× READMEs across target folders, with backups
# Environment: WSL2 Ubuntu ONLY; Bun required on PATH; no deletions
# Policy: Back up existing READMEs as .bak; write new ones from templates/readmes/
set -euo pipefail

echo "🚀 Starting 10× README rollout…"

# Preflight: resolve root and guard environment
ROOT="${ROOT:-$HOME/projects/hex-mob-cleanslate}"
if [[ ! -d "$ROOT" ]]; then
  echo "❌ Repo root not found: $ROOT"
  exit 1
fi
cd "$ROOT"

# Preflight: no /mnt paths
if pwd | grep -q "^/mnt/"; then
  echo "❌ Refusing to run under /mnt. Use Linux FS (e.g., $HOME/projects/…)"
  exit 1
fi

# Preflight: Bun available
if ! command -v bun >/dev/null 2>&1; then
  echo "❌ Bun is required on PATH. Install Bun and retry."
  exit 1
fi

# Target folders to receive filled READMEs
folders=(
  "." "apps" "apps/mobile" "apps/mobile/src"
  "packages" "packages/shared" "packages/shared/src"
  "tools" "docs"
)

# Helper: compute template path for a folder
template_for() {
  local f="$1"
  if [[ "$f" == "." ]]; then
    echo "templates/readmes/README.md"
  else
    echo "templates/readmes/${f}/README.md"
  fi
}

# Preflight: ensure templates exist
missing_any=0
for f in "${folders[@]}"; do
  src="$(template_for "$f")"
  if [[ ! -f "$src" ]]; then
    echo "❌ Missing template for $f: $src"
    missing_any=1
  fi
done
if [[ $missing_any -ne 0 ]]; then
  echo "❌ Aborting: one or more templates are missing."
  exit 1
fi

# Apply READMEs with backups
for f in "${folders[@]}"; do
  dst="$f/README.md"
  src="$(template_for "$f")"

  if [[ ! -d "$f" ]]; then
    echo "⚠️ Skipping missing folder: $f"
    continue
  fi

  mkdir -p "$(dirname "$dst")"

  if [[ -f "$dst" ]]; then
    cp "$dst" "$dst.bak"
    echo "📦 Backup created: $dst.bak"
  fi

  cp "$src" "$dst"
  echo "✅ Applied: $dst"
done

echo "🏁 README rollout complete."