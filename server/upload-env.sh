#! /bin/bash
aws s3 cp . s3://labar.jimbo.code/misc/ --recursive --exclude '*' --include '*.env' --dryrun 
