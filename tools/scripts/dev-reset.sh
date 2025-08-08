#!/usr/bin/env bash
set -euo pipefail
echo "🧹 dev-reset (conservative) for SDK v53"

MATRIX=".expo-sdk-v53-matrix.json"
[ -f "$MATRIX" ] || { echo "Matrix missing: $MATRIX"; exit 1; }

# Run conservative smart cleanup (preserves system, removes only conflicts)
if [ -x ./smart-cleanup-v53-conservative.sh ]; then
  ./smart-cleanup-v53-conservative.sh
fi

# Kill servers and free ports
PIDS="$(lsof -ti:8081,8082 || true)"
[ -n "$PIDS" ] && kill -9 $PIDS || true
pkill -9 -f "bunx expo" || true
pkill -9 -f "expo start" || true
pkill -9 -f "react-native" || true
pkill -9 -f "metro" || true
pkill -9 -f "node .*metro" || true

# Clear caches (keep node, we will reinstall with Bun)
rm -rf .expo .expo-shared .metro-cache
export METRO_CACHE_DIR="$PWD/.metro-cache"
mkdir -p "$METRO_CACHE_DIR"

# Ensure expo-dev-client is not present (matrix says REMOVE)
if grep -q "\"expo-dev-client\"" package.json 2>/dev/null; then
  echo "-- Removing expo-dev-client from package.json"
  sed -i /expo-dev-client/d package.json || true
fi

# Install base deps
bun install

# Minimal parse helper
val() { grep -Po "\"$1\"\\s*:\\s*\"[^\"]+\"" "$MATRIX" | sed -E "s/\"$1\"\\s*:\\s*\"([^\"]+)\"/\\1/"; }

EXPO=$(val "expo")
REACT=$(val "react")
RN=$(val "react-native")
NAV_NATIVE=$(val "@react-navigation/native")
NAV_TABS=$(val "@react-navigation/bottom-tabs")
GH=$(val "react-native-gesture-handler")
REA=$(val "react-native-reanimated")
SCN=$(val "react-native-screens")
SAFE=$(val "react-native-safe-area-context")
SVG=$(val "react-native-svg")
VEC=$(val "react-native-vector-icons")
EXPO_FS=$(val "expo-file-system")
EXPO_MEDIA=$(val "expo-media-library")
EXPO_LG=$(val "expo-linear-gradient")
EXPO_HAPTICS=$(val "expo-haptics")
EXPO_BLUR=$(val "expo-blur")
EXPO_UPDATES=$(val "expo-updates")
TYPES_REACT=$(val "@types/react")
TSC=$(val "typescript")

echo "-- Enforcing matrix pins"
bun add "expo@${EXPO}" "react@${REACT}" "react-native@${RN}"
bun add "@react-navigation/native@${NAV_NATIVE}" "@react-navigation/bottom-tabs@${NAV_TABS}"
bun add "react-native-gesture-handler@${GH}" "react-native-reanimated@${REA}" "react-native-screens@${SCN}" "react-native-safe-area-context@${SAFE}" "react-native-svg@${SVG}" "react-native-vector-icons@${VEC}"
bun add "expo-file-system@${EXPO_FS}" "expo-media-library@${EXPO_MEDIA}" "expo-linear-gradient@${EXPO_LG}" "expo-haptics@${EXPO_HAPTICS}" "expo-blur@${EXPO_BLUR}" "expo-updates@${EXPO_UPDATES}"
bun add -d "@types/react@${TYPES_REACT}" "typescript@${TSC}"

# Ensure metro config in CJS
if [ -f metro.config.js ]; then mv -f metro.config.js metro.config.cjs; fi
if [ ! -f metro.config.cjs ]; then
cat > metro.config.cjs <<CJS
const { getDefaultConfig } = require(expo/metro-config);
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push(cjs);
module.exports = config;
CJS
fi

# Final ADB reset
if [ -x /mnt/d/Android/sdk/platform-tools/adb.exe ]; then
  /mnt/d/Android/sdk/platform-tools/adb.exe kill-server || true
  /mnt/d/Android/sdk/platform-tools/adb.exe start-server || true
elif command -v adb >/dev/null 2>&1; then
  adb kill-server || true
  adb start-server || true
fi

echo "✅ Conservative reset complete"
# Clean stale bun temp directories
sudo rm -rf /tmp/bun-* 2>/dev/null || true
sudo rm -rf /tmp/1.* 2>/dev/null || true
