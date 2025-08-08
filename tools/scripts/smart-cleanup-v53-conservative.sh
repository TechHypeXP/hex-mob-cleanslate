#!/usr/bin/env bash
set -euo pipefail

echo "🧽 smart-cleanup-v53-conservative: Preserve system, remove only known conflicts"

# Expo SDK v53 required globals (conservative)
REQUIRED_GLOBALS=(
  "@expo/cli@0.17.13"
  "@expo/ngrok@4.1.0"
)

# Patterns to PRESERVE (system essentials; do not remove)
PRESERVE_SYSTEM_PATTERNS=(
  "node-*"
  "lib*"
  "npm"
  "git*"
  "curl"
  "wget"
  "python*"
  "build-essential"
  "cmake"
)

# Known conflict patterns with SDK v53 (remove if matched)
KNOWN_CONFLICTS=(
  "expo-dev-client"                  # forces dev build path
  "^metro@[0-6][0-9].*"              # very old metro
  "^@react-navigation/native@[0-6].*"
  "^react-native-reanimated@[12].*"
  "^react-native-gesture-handler@[12].*"
)

should_preserve() {
  local name="$1"
  for pat in "${PRESERVE_SYSTEM_PATTERNS[@]}"; do
    if [[ "$name" == $pat ]]; then
      echo "🔒 Preserving: $name"
      return 0
    fi
  done
  return 1
}

is_conflict() {
  local namever="$1" # like pkg@version
  for pat in "${KNOWN_CONFLICTS[@]}"; do
    if [[ "$namever" =~ $pat ]]; then
      return 0
    fi
  done
  return 1
}

# Clean only conflicting bun globals (keep system essentials)
if command -v bun >/dev/null 2>&1; then
  echo "-- Checking bun global packages for conflicts --"
  bun pm ls -g 2>/dev/null | grep -E "@" | while read -r line; do
    # expecting lines like: package@version
    namever="$line"
    name="${namever%@*}"
    ver="${namever#*@}"

    if should_preserve "$name"; then
      continue
    fi

    if is_conflict "$namever"; then
      echo "⚠️ Removing conflict: $namever"
      bun remove -g "$name" 2>/dev/null || true
    else
      echo "✅ Keeping: $namever"
    fi
  done
fi

# Install only missing required globals
echo "-- Ensuring required SDK v53 globals --"
for pkgver in "${REQUIRED_GLOBALS[@]}"; do
  pkg="${pkgver%@*}"
  ver="${pkgver#*@}"
  if bun pm ls -g 2>/dev/null | grep -q "^$pkg@$ver$"; then
    echo "✅ Already installed: $pkg@$ver"
  else
    echo "➕ Installing: $pkg@$ver"
    bun add -g "$pkg@$ver"
  fi
done

# Create/Update lock file to record policy
cat > .expo-sdk-lock.json <<JSON
{
  "lockedSDK": "53.0.0",
  "globals": {
    "@expo/cli": "0.17.13",
    "@expo/ngrok": "4.1.0"
  },
  "policy": "conservative-preserve-system"
}
JSON

echo "✅ smart-cleanup-v53-conservative complete"
