#!/usr/bin/env bash

# Script exits when command fails.
set -o errexit

# Don't mask errors in piped commands (raise first non-zero exit code).
set -o pipefail

# Print commands (and bash scripts/source files) while executing.
set -o verbose

# Fail if using undefined variables.
set -o nounset

# setup frontend workspace
npm install
npm rebuild node-sass
npm run h2-build --workspace common
npm run codegen --workspaces --if-present
npm run intl-compile --workspaces --if-present
npm run dev --workspaces --if-present
