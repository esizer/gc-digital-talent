#! /bin/bash

serveriss="\"http://localhost:8000\""
sed -i "s#AUTH_SERVER_ISS=.*#AUTH_SERVER_ISS=$serveriss#" $WORKSPACE/api/.env

#remove existing multiline value with quotes
perl -0777 -i -pe 's/\n\s*AUTH_SERVER_PUBLIC_KEY=".*?"//igs' $WORKSPACE/api/.env
#remove existing singleline value
perl -0777 -i -pe 's/\n\s*AUTH_SERVER_PUBLIC_KEY=.*$//igs' $WORKSPACE/api/.env

publickey=`cat $WORKSPACE/auth/storage/oauth-public.key`
echo "AUTH_SERVER_PUBLIC_KEY=\"$publickey\"" >> $WORKSPACE/api/.env
