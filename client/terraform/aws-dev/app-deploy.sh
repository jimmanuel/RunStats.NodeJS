#! /bin/bash

cd ../..
npm run build
aws s3 sync build/ s3://dev-rs-static-web-content/
cd -
