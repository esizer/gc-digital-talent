#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

cd ~/gc-digital-talent/api
composer install
php artisan migrate
php artisan lighthouse:print-schema --write
