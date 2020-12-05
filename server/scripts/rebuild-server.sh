#! /bin/bash
cd ../client
npm run build
cd -
npm run compile
mkdir app/src/client
cp -r ../client/build/* app/src/client/