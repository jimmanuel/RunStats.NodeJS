#! /bin/bash

aws s3 cp s3://jlabar-runstats-cicd/tfvars/aws-dev-base.tfvars dev.tfvars
terraform init
terraform apply -var-file=dev.tfvars -auto-approve