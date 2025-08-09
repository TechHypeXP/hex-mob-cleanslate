const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getChangedFiles() {
  try {
    // Get files changed in the current commit and staged files
    const staged = execSync('git diff --cached --name-only', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    const committed = execSync('git diff --name-only HEAD~1..HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    const allChanged = new Set([...staged.split('\n'), ...committed.split('\n')]);
    // Filter out ignored files and directories
    return Array.from(allChanged)
      .filter(f => f) // Ensure no empty strings from split
      .filter(f => !f.startsWith('archive/tools-archived/vrite/'))
      .filter(f => !f.startsWith('node_modules/'))
      .filter(f => !f.startsWith('.git/'));
  } catch (e) {
    console.error("Error getting changed files:", e);
    return [];
  }
}

const exts = new Set(['.ts', '.tsx', '.js', '.cjs', '.mjs', '.sh']);
const candidates = getChangedFiles().filter(f => exts.has(path.extname(f)));
const missing = [];

for (const file of candidates) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const hasHeader = content.startsWith('/**') || content.startsWith('#!/bin') || content.startsWith('# ');
    if (!hasHeader) missing.push(file);
  } catch (e) {
    // If file can’t be read, treat as missing to be safe
    missing.push(file);
  }
}

if (missing.length) {
  console.error('Inline docs missing in:', missing.join(', '));
  process.exit(1);
}
console.log('Inline docs validator: OK');
process.exit(0);