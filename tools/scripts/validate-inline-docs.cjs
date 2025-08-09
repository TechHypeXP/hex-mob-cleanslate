const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function listChangedFiles() {
  const files = new Set();
  try {
    const staged = execSync('git diff --cached --name-only', { stdio: ['ignore','pipe','ignore'] }).toString().trim();
    if (staged) staged.split('\n').forEach(f => files.add(f));
  } catch {}
  try {
    const last = execSync('git diff --name-only HEAD~1..HEAD', { stdio: ['ignore','pipe','ignore'] }).toString().trim();
    if (last) last.split('\n').forEach(f => files.add(f));
  } catch {}
  return Array.from(files)
    .filter(Boolean)
    .filter(f => !f.startsWith('archive/tools-archived/vrite/'))
    .filter(f => !f.startsWith('legacy-v1/'))
    .filter(f => !f.startsWith('_deprecated_src/'))
    .filter(f => !f.startsWith('node_modules/'))
    .filter(f => !f.startsWith('.git/'));
}

const exts = new Set(['.ts', '.tsx', '.js', '.cjs', '.mjs', '.sh']);
const candidates = listChangedFiles().filter(f => exts.has(path.extname(f)));
const missing = [];

for (const file of candidates) {
  try {
    const content = fs.readFileSync(file, 'utf8');

    // Accept either:
    // - JS/TS block header starting with /** at top
    // - Shell scripts starting with #! then a comment header (# ...) on next lines
    const startsShebang = content.startsWith('#!');
    const startsBlock = content.startsWith('/**');

    let ok = false;
    if (startsBlock) ok = true;
    if (startsShebang) {
      const lines = content.split('\n');
      // After shebang, we expect a comment line (starts with #) as inline docs header
      if (lines.length >= 2 && lines[1].trim().startsWith('#')) ok = true;
    }

    if (!ok) missing.push(file);
  } catch {
    missing.push(file);
  }
}

if (missing.length) {
  console.error('Inline docs missing at top of file for:', missing.join(', '));
  process.exit(1);
}
console.log('Inline docs validator: OK');
process.exit(0);
