#! /bin/bash

aws s3 cp s3://jlabar-runstats-cicd/tfvars/aws-dev-static-proxy.tfvars dev.tfvars
terraform init
terraform destroy -var-file=dev.tfvars -auto-approve