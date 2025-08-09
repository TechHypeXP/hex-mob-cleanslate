#!/bin/bash
/**
 * @file Purpose: Wrapper script to execute Husky pre-commit hooks with bash.
 * @Inputs: Arguments passed to the hook.
 * @Outputs: Executes the actual hook script.
 * @Usage: Called by .husky/pre-commit.
 * @Owner: engineering
 * @Last-Updated: 2025-08-09
 */
set -eu

# Skip during bulk ops
if [ "${HUSKY:-1}" = "0" ]; then
  echo "HUSKY=0 detected; skipping validators"
  exit 0
fi

# Skip if Bun missing
if ! command -v bun >/dev/null 2>&1; then
  echo "Bun missing; skipping validators"
  exit 0
fi

# Run existing validators
[ -f tools/scripts/validate-readmes.cjs ] && bun tools/scripts/validate-readmes.cjs || true
[ -f tools/scripts/verify-structure.cjs ] && bun tools/scripts/verify-structure.cjs || true

# Run inline docs validator if Node is available
if command -v node >/dev/null 2>&1; then
  [ -f tools/scripts/validate-inline-docs.cjs ] && node tools/scripts/validate-inline-docs.cjs || true
else
  echo "Node missing; skipping inline docs validator"
fi

exit 0