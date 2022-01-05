#! /bin/bash

cd $WORKSPACE/common
npm install
npm run h2-build
npm run codegen
