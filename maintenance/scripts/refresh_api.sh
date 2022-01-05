#! /bin/bash

cd $WORKSPACE/api
composer install
php artisan migrate
php artisan lighthouse:print-schema --write
