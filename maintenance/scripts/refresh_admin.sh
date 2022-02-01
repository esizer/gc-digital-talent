#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

cd ~/gc-digital-talent/frontend
npm install
npm rebuild node-sass

cd ~/gc-digital-talent/frontend/admin
composer install
php artisan config:clear
npm run h2-build
npm run codegen
npm run intl-compile
npm run dev
