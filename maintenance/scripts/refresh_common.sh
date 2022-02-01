#! /bin/bash

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
source ${parent_path}/lib/common.sh

cd ~/gc-digital-talent/frontend
npm install

cd ~/gc-digital-talent/frontend/common
npm run h2-build
npm run codegen
npm run intl-compile
