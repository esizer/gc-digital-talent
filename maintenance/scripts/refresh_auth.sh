#! /bin/bash

cd $WORKSPACE/auth
composer install
php artisan migrate
php artisan config:clear
npm install
npm run dev
