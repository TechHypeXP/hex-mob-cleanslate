#!/usr/bin/env bash
set -euo pipefail
echo "🚀 smart-start-v53: Force local @expo/ngrok@4.1.0 detection"

# Ensure local @expo/ngrok exists
if [ ! -d "node_modules/@expo/ngrok" ]; then
  echo "-- Installing @expo/ngrok@4.1.0 locally --"
  bun add -d @expo/ngrok@4.1.0
fi

LOCAL_NGROK_BIN=""
if [ -x "$PWD/node_modules/@expo/ngrok/bin/ngrok" ]; then
  LOCAL_NGROK_BIN="$PWD/node_modules/@expo/ngrok/bin/ngrok"
elif [ -x "$PWD/node_modules/@expo/ngrok/build/bin/ngrok" ]; then
  LOCAL_NGROK_BIN="$PWD/node_modules/@expo/ngrok/build/bin/ngrok"
fi

if [ -n "$LOCAL_NGROK_BIN" ]; then
  export EXPO_TUNNEL_NGROK_PATH="$LOCAL_NGROK_BIN"
  export PATH="$(dirname "$LOCAL_NGROK_BIN"):$PATH"
  echo "-- Using local @expo/ngrok: $LOCAL_NGROK_BIN"
else
  export EXPO_TUNNEL_NGROK_PATH="$HOME/.bun/bin/ngrok"
  export PATH="$HOME/.bun/bin:$PATH"
  echo "-- Fallback to ~/.bun/bin/ngrok: $EXPO_TUNNEL_NGROK_PATH"
fi

# Free ports and start
PIDS="$(lsof -ti:8081,8082 || true)"; [ -n "$PIDS" ] && kill -9 $PIDS || true
export METRO_CACHE_DIR="$PWD/.metro-cache"; mkdir -p "$METRO_CACHE_DIR"

# Delegate to your dev-start.sh with env preserved
exec ./dev-start.sh
