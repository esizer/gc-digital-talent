#! /bin/bash

# Fail out of script immediately if any single command fails.
# See: https://gist.github.com/mohanpedala/1e2ff5661761d3abd0385e8223e16425
set -euxo pipefail

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

# setup api project
cd $WORKSPACE/api
cp .env.example .env
$WORKSPACE/maintenance/scripts/update_env_appkey.sh .env
composer install
php artisan migrate:fresh --seed
php artisan lighthouse:print-schema --write
$WORKSPACE/maintenance/scripts/update_api_env.sh

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

# Give all read/write access to work directories so www-data in the php container can modify them
chmod -R a+r,a+w \
      $WORKSPACE/api/storage \
      $WORKSPACE/api/vendor \
      $WORKSPACE/admin/storage \
      $WORKSPACE/admin/vendor \
      $WORKSPACE/auth/storage \
      $WORKSPACE/auth/vendor \
      $WORKSPACE/talentsearch/storage \
      $WORKSPACE/talentsearch/vendor
