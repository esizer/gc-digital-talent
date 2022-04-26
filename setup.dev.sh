#!/usr/bin/env bash

# Script exits when command fails.
set -o errexit

# Don't mask errors in piped commands (raise first non-zero exit code).
set -o pipefail

# Print commands (and bash scripts/source files) while executing.
set -o verbose

# Fail if using undefined variables.
set -o nounset

docker-compose run --rm auth "./setup.dev.sh"
docker-compose run --rm api "./setup.dev.sh"
docker-compose run --rm frontend "./setup.dev.sh"
