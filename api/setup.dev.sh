#!/usr/bin/env bash

# Script exits when command fails.
set -o errexit

# Don't mask errors in piped commands (raise first non-zero exit code).
set -o pipefail

# Print commands (and bash scripts/source files) while executing.
set -o verbose

# Fail if using undefined variables.
set -o nounset

# setup api project
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan lighthouse:print-schema --write
php artisan config:clear
