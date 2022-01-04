#! /bin/bash

cd ../../admin
composer install
php artisan config:clear
npm install
npm rebuild node-sass
npm run h2-build
npm run codegen
npm run dev
