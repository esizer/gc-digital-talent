#!/usr/bin/env bash

# Script exits when command fails.
set -o errexit

# Don't mask errors in piped commands (raise first non-zero exit code).
set -o pipefail

# Print commands (and bash scripts/source files) while executing.
set -o verbose

# Fail if using undefined variables.
set -o nounset

# setup api project
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan lighthouse:print-schema > shared/lighthouse-schema.graphql

#-> copy credential values to .env file

#remove existing multiline value with quotes
perl -0777 -i -pe 's/\n\s*AUTH_SERVER_PUBLIC_KEY=".*?"//igs' .env
#remove existing singleline value
perl -0777 -i -pe 's/\n\s*AUTH_SERVER_PUBLIC_KEY=.*$//igs' .env

publickey=`cat shared/oauth-public.key`
echo "AUTH_SERVER_PUBLIC_KEY=\"$publickey\"" >> .env

exp='\:\ ([a-zA-Z0-9\-]+)$'

text=`grep 'Client ID:' shared/api_secret.txt`
if [[ $text =~ $exp ]] ; then
    clientid=${BASH_REMATCH[1]}
fi

text=`grep 'Client secret:' shared/api_secret.txt`
if [[ $text =~ $exp ]] ; then
    clientsecret=${BASH_REMATCH[1]}
fi

sed -i "s/OAUTH_API_CLIENT_ID=.*/OAUTH_API_CLIENT_ID=$clientid/" .env
sed -i "s/OAUTH_API_CLIENT_SECRET=.*/OAUTH_API_CLIENT_SECRET=$clientsecret/" .env

#<- copy credential values to .env file

php artisan config:clear
