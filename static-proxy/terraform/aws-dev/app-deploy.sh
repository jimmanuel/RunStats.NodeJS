#! /bin/bash

cd ../../src
npm ci
cd -

aws s3 cp s3://jlabar-runstats-cicd/tfvars/aws-dev-static-proxy.tfvars dev.tfvars
terraform init
#terraform plan -var-file=dev.tfvars
terraform apply -var-file=dev.tfvars -auto-approve