#! /bin/bash
aws s3 cp . s3://jlabar-runstats-cicd/dotenv/ --recursive --exclude '*.sh' 
