#!/usr/bin/env bash
set -eo pipefail
BRANCH="main"
cd "$(git rev-parse --show-toplevel)"

# staged-or-modified files, excluding Qdrant backups
FILES=$(git ls-files -m -o --exclude-standard | grep -v '^qdrant_storage/backup/')
[ -z "$FILES" ] && { echo "✅ Nothing to commit."; exit 0; }

declare -A groups
while read -r f; do
  [ -e "$f" ] || continue            # skip vanished paths
  key=$(date -r "$f" +"%Y-%m-%d-%H") # group by mod-hour
  groups["$key"]+=" \"$f\""
done <<< "$FILES"

for key in "${!groups[@]}"; do
  eval FILES_IN_GROUP=(${groups[$key]})
  # derive short summary from filenames (letters≥3, first 7 words max)
  SUMMARY=$(printf "%s\n" "${FILES_IN_GROUP[@]}" |
            sed -E 's|.*/([^/]+)$|\\1|' |
            tr '_./' '   ' |
            awk '{for(i=1;i<=NF;i++) if(length($i)>2) print $i}' |
            tr '\n' ' ' | cut -d' ' -f1-7 )
  git add "${FILES_IN_GROUP[@]}"
  git commit -m "chore: ${SUMMARY:-misc updates} – $key"
done

git push origin "$BRANCH"
echo "🚀 Pushed grouped commits."
