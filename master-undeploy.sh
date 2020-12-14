#! /bin/bash

cd static-proxy/terraform/aws-dev
./app-undeploy.sh
cd -

cd server/terraform/aws-dev
./app-undeploy.sh
cd -

cd infrastructure/aws-dev-base
./app-undeploy.sh
cd -
