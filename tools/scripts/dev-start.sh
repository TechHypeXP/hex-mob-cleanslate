#!/usr/bin/env bash
set -euo pipefail
echo "🚀 dev-start: stable Expo tunnel on clean port"

# Load WSL profile if present
[ -f "$HOME/.wsl-dev-profile.sh" ] && source "$HOME/.wsl-dev-profile.sh"

# Ensure /tmp perms and local cache
if sudo -n true 2>/dev/null; then sudo chmod 777 /tmp || true; fi
export METRO_CACHE_DIR="$PWD/.metro-cache"
mkdir -p "$METRO_CACHE_DIR"

# Free ports and start on 8082
PIDS="$(lsof -ti:8081,8082 || true)"
[ -n "$PIDS" ] && kill -9 $PIDS || true

bunx expo start --go --tunnel --clear --port 8082
