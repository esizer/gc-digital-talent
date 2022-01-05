#! /bin/bash

exp='\:\ ([a-zA-Z0-9\-]+)$'

text=`grep 'Client ID:' $WORKSPACE/auth/admin_secret.txt`
if [[ $text =~ $exp ]] ; then
    clientid=${BASH_REMATCH[1]}
fi

text=`grep 'Client secret:' $WORKSPACE/auth/admin_secret.txt`
if [[ $text =~ $exp ]] ; then
    clientsecret=${BASH_REMATCH[1]}
fi

sed -i "s/OAUTH_ADMIN_CLIENT_ID=.*/OAUTH_ADMIN_CLIENT_ID=$clientid/" $WORKSPACE/admin/.env
sed -i "s/OAUTH_ADMIN_CLIENT_SECRET=.*/OAUTH_ADMIN_CLIENT_SECRET=$clientsecret/" $WORKSPACE/admin/.env
