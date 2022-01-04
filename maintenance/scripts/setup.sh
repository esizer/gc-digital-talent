#! /bin/bash

# setup auth project
cd ../../auth
cp .env.example .env
composer install
php artisan migrate:fresh --seed
php artisan passport:keys --force
php artisan key:generate
php artisan passport:client --personal --name="Laravel Personal Access Client" > personal_access_client.txt
../maintenance/scripts/update_auth_env.sh
rm personal_access_client.txt
php artisan config:clear
nvm install --latest-npm
npm install
npm run dev
chmod -R 777 ./storage ./vendor

# setup api project
cd ../api
cp .env.example .env
../maintenance/scripts/update_env_appkey.sh .env
composer install
php artisan migrate:fresh --seed
php artisan lighthouse:print-schema --write
../maintenance/scripts/update_api_env.sh
chmod -R 777 ./storage ./vendor

# setup common project
cd ../common
nvm install --latest-npm
npm install
npm run h2-build
npm run codegen

# setup talentsearch project
cd ../talentsearch
cp .env.example .env
../maintenance/scripts/update_env_appkey.sh .env
composer install
nvm install --latest-npm
npm install
npm rebuild node-sass
npm run h2-build
npm run codegen
npm run dev
chmod -R 777 ./storage ./vendor

# setup admin project
cd ../admin
cp .env.example .env
../maintenance/update_env_appkey.sh .env
composer install
cd ../auth
php artisan passport:client -n --name="admin" --redirect_uri="http://localhost:8000/admin/auth-callback" > admin_secret.txt
../maintenance/update_admin_env.sh
rm admin_secret.txt
cd ../admin
php artisan config:clear
nvm install --latest-npm
npm install
npm rebuild node-sass
npm run h2-build
npm run codegen
npm run dev
chmod -R 777 ./storage ./vendor
