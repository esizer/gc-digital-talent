#!/usr/bin/env bash

# Script exits when command fails.
set -o errexit

# Don't mask errors in piped commands (raise first non-zero exit code).
set -o pipefail

# Print commands (and bash scripts/source files) while executing.
set -o verbose

# Fail if using undefined variables.
set -o nounset

# setup auth project
cp .env.example .env
composer install
php artisan migrate:fresh --seed
php artisan passport:keys --force
php artisan key:generate
php artisan passport:client --personal --name="Laravel Personal Access Client" > personal_access_client.txt

#-> copy personal access values to .env file
exp='\:\ ([a-zA-Z0-9\-]+)$'

text=`grep 'Client ID:' personal_access_client.txt`
if [[ $text =~ $exp ]] ; then
    clientid=${BASH_REMATCH[1]}
fi

text=`grep 'Client secret:' personal_access_client.txt`
if [[ $text =~ $exp ]] ; then
    clientsecret=${BASH_REMATCH[1]}
fi

sed -i "s/PASSPORT_PERSONAL_ACCESS_CLIENT_ID=.*/PASSPORT_PERSONAL_ACCESS_CLIENT_ID=$clientid/" .env
sed -i "s/PASSPORT_PERSONAL_ACCESS_CLIENT_SECRET=.*/PASSPORT_PERSONAL_ACCESS_CLIENT_SECRET=$clientsecret/" .env
#<- copy personal access values to .env file

rm personal_access_client.txt

# also make credentials for api
php artisan passport:client -n --name="api" --redirect_uri="http://localhost:8000/auth-callback" > shared/api_secret.txt

# also share public key
cp storage/oauth-public.key shared/

php artisan config:clear
npm install
npm run dev
