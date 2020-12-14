#! /bin/bash

cd infrastructure/aws-dev-base
./app-deploy.sh
cd -

cd server/terraform/aws-dev
./app-deploy.sh
cd -

cd static-proxy/terraform/aws-dev
./app-deploy.sh
cd -

cd client/terraform/aws-dev
./app-deploy.sh
cd -
