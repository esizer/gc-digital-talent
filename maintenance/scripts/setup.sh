#! /bin/bash

# setup auth project
cd $WORKSPACE/auth
cp .env.example .env
composer install
php artisan migrate:fresh --seed
php artisan passport:keys --force
php artisan key:generate
php artisan passport:client --personal --name="Laravel Personal Access Client" > personal_access_client.txt
$WORKSPACE/maintenance/scripts/update_auth_env.sh
rm personal_access_client.txt
php artisan config:clear
npm install
npm run dev
chgrp -R www-data ./storage ./vendor
chmod -R u+rw,g+rw ./storage/ ./vendor

# setup api project
cd $WORKSPACE/api
cp .env.example .env
$WORKSPACE/maintenance/scripts/update_env_appkey.sh .env
composer install
php artisan migrate:fresh --seed
php artisan lighthouse:print-schema --write
$WORKSPACE/maintenance/scripts/update_api_env.sh
chgrp -R www-data ./storage ./vendor
chmod -R u+rw,g+rw ./storage/ ./vendor

# setup common project
cd $WORKSPACE/common
npm install
npm run h2-build
npm run codegen

# setup talentsearch project
cd $WORKSPACE/talentsearch
cp .env.example .env
$WORKSPACE/maintenance/scripts/update_env_appkey.sh .env
composer install
npm install
npm rebuild node-sass
npm run h2-build
npm run codegen
npm run dev
chgrp -R www-data ./storage ./vendor
chmod -R u+rw,g+rw ./storage/ ./vendor

# setup admin project
cd $WORKSPACE/admin
cp .env.example .env
$WORKSPACE/maintenance/scripts/update_env_appkey.sh .env
composer install
cd $WORKSPACE/auth
php artisan passport:client -n --name="admin" --redirect_uri="http://localhost:8000/admin/auth-callback" > admin_secret.txt
$WORKSPACE/maintenance/scripts/update_admin_env.sh
rm admin_secret.txt
cd $WORKSPACE/admin
php artisan config:clear
npm install
npm rebuild node-sass
npm run h2-build
npm run codegen
npm run dev
chgrp -R www-data ./storage ./vendor
chmod -R u+rw,g+rw ./storage/ ./vendor
