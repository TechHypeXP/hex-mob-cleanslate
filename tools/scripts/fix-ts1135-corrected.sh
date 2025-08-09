#!/bin/bash
# tools/scripts/fix-ts1135-corrected.sh
set -euo pipefail

echo "🔍 Diagnosing TS1135 error in App.tsx"

# Show error context
echo "--- Error context around line 8 ---"
sed -n '5,12p' App.tsx

# Backup
cp App.tsx App.tsx.bak
echo "✅ Backup created: App.tsx.bak"

# Properly wrapped Node.js fix (single command, single quotes)
node -e 'const fs = require("fs");
let content = fs.readFileSync("App.tsx","utf8");
const lines = content.split("\\n");
console.log("Line 8 before fix:", lines[7]);
if (!/const\\s+logError\\s*=\\s*\\(/.test(content)) {
  lines[7] = "const logError = (error: any, context: string) => { console.error(`[${context}] Error:`, error); };";
  content = lines.join("\\n");
  console.log("✅ Fixed logError definition on line 8");
  fs.writeFileSync("App.tsx", content);
} else {
  // Also fix malformed console.error if present
  const before = lines[7];
  lines[7] = lines[7].replace(/console\\.error\\([^)]*\\)/, "console.error(`[${context}] Error:`, error)");
  if (lines[7] !== before) {
    fs.writeFileSync("App.tsx", lines.join("\\n"));
    console.log("✅ Normalized console.error call on line 8");
  } else {
    console.log("logError function already correct, no changes made.");
  }
}\

# Quality gate
echo "--- Running type-check validation ---"
if bun run type-check; then
    echo "✅ Fix successful - removing backup"
    rm App.tsx.bak
else
    echo "❌ Fix failed - restoring backup"
    mv App.tsx.bak App.tsx
    exit 1
fi
