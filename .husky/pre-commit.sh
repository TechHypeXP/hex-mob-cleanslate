#!/bin/bash
# File: .husky/pre-commit.sh
# Purpose: Bash logic for pre-commit (validators + gating)
# Inputs: env(HUSKY)
# Outputs: exit code
# Usage: invoked by .husky/pre-commit wrapper
# Owner: engineering
# Last-Updated: 2025-08-09

set -euo pipefail

# Check if Bun is available and run validators
if command -v bun >/dev/null 2>&1; then
  [ -f tools/scripts/validate-readmes.cjs ] && bun tools/scripts/validate-readmes.cjs || true
  [ -f tools/scripts/verify-structure.cjs ] && bun tools/scripts/verify-structure.cjs || true
else
  echo "Bun missing; skipping Bun-based validators"
fi

# REQUIRED inline docs validator (blocking)
if command -v node >/dev/null 2>&1; then
  if [ -f tools/scripts/validate-inline-docs.cjs ]; then
    node tools/scripts/validate-inline-docs.cjs
  else
    echo "Missing tools/scripts/validate-inline-docs.cjs — blocking commit."
    exit 1
  fi
else
  echo "Node missing; cannot enforce inline docs — blocking commit."
  exit 1
fi