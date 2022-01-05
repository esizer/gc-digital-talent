#! /bin/bash

exp='\:\ ([a-zA-Z0-9\-]+)$'

text=`grep 'Client ID:' $WORKSPACE/auth/personal_access_client.txt`
if [[ $text =~ $exp ]] ; then
    clientid=${BASH_REMATCH[1]}
fi

text=`grep 'Client secret:' $WORKSPACE/auth/personal_access_client.txt`
if [[ $text =~ $exp ]] ; then
    clientsecret=${BASH_REMATCH[1]}
fi

sed -i "s/PASSPORT_PERSONAL_ACCESS_CLIENT_ID=.*/PASSPORT_PERSONAL_ACCESS_CLIENT_ID=$clientid/" $WORKSPACE/auth/.env
sed -i "s/PASSPORT_PERSONAL_ACCESS_CLIENT_SECRET=.*/PASSPORT_PERSONAL_ACCESS_CLIENT_SECRET=$clientsecret/" $WORKSPACE/auth/.env
