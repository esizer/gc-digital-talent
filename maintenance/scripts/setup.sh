#! /bin/bash
# sudo chmod -R a+w,a+r auth/storage auth/vendor auth/node_modules api/storage api/vendor frontend/talentsearch/storage frontend/talentsearch/vendor frontend/talentsearch/node_modules frontend/admin/storage frontend/admin/vendor frontend/admin/node_modules

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

cd ~/gc-digital-talent/api
cp .env.example .env
${parent_path}/update_env_appkey.sh .env

# setup auth project
cd ~/gc-digital-talent/auth
cp .env.example .env
composer install
php artisan migrate:fresh --seed
php artisan passport:keys --force
php artisan key:generate
php artisan passport:client --personal --name="Laravel Personal Access Client" > personal_access_client.txt
${parent_path}/update_auth_env.sh
rm personal_access_client.txt
php artisan config:clear
npm install
npm run dev

# setup api project
cd ~/gc-digital-talent/api
cp .env.example .env
${parent_path}/update_env_appkey.sh .env
composer install
php artisan migrate:fresh --seed
php artisan lighthouse:print-schema --write
${parent_path}/update_api_env.sh

# setup frontend workspace
cd ~/gc-digital-talent/frontend
npm install
npm rebuild node-sass

# setup common project
cd ~/gc-digital-talent/frontend/common
npm run h2-build
npm run codegen
npm run intl-compile

# setup talentsearch project
cd ~/gc-digital-talent/frontend/talentsearch
cp .env.example .env
${parent_path}/update_env_appkey.sh .env
composer install
npm run h2-build
npm run codegen
npm run intl-compile
npm run dev

# setup admin project
cd ~/gc-digital-talent/frontend/admin
cp .env.example .env
${parent_path}/update_env_appkey.sh .env
composer install
cd ~/gc-digital-talent/auth
php artisan passport:client -n --name="admin" --redirect_uri="http://localhost:8000/admin/auth-callback" > admin_secret.txt
${parent_path}/update_admin_env.sh
rm admin_secret.txt
cd ~/gc-digital-talent/frontend/admin
php artisan config:clear
npm run h2-build
npm run codegen
npm run intl-compile
npm run dev
