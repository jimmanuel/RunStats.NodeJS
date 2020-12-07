#! /bin/bash

npm run compile
npm prune prod

printf -v tag '%(%Y%m%dT%H%M%S)T' -1 
echo $tag
docker build . \
    -t runstats-js \
    -t 747875535466.dkr.ecr.us-east-1.amazonaws.com/runstats-js:$tag \
    -t 747875535466.dkr.ecr.us-east-1.amazonaws.com/runstats-js:latest

aws ecr get-login-password \
    --region us-east-1 \
| docker login \
    --username AWS \
    --password-stdin 747875535466.dkr.ecr.us-east-1.amazonaws.com
docker push 747875535466.dkr.ecr.us-east-1.amazonaws.com/runstats-js:latest

aws ecs update-service --cluster dev-ecs-cluster-rs --service dev-ecs-service-rs --force-new-deployment

npm ci