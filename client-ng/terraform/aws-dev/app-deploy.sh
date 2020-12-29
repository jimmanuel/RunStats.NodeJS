#! /bin/bash

cd ../..
npm run build
aws s3 sync dist/client-ng/ s3://dev-rs-static-web-content/ --delete
cd -
