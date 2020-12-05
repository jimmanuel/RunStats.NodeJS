#! /bin/bash

npm run compile
npm prune prod

printf -v tag '%(%Y%m%dT%H%M%S)T' -1 
echo $tag
docker build -t runstats-js .
docker tag runstats-js:latest 747875535466.dkr.ecr.us-east-1.amazonaws.com/runstats-js:$tag
docker tag runstats-js:latest 747875535466.dkr.ecr.us-east-1.amazonaws.com/runstats-js:latest

aws ecr get-login-password \
    --region us-east-1 \
| docker login \
    --username AWS \
    --password-stdin 747875535466.dkr.ecr.us-east-1.amazonaws.com
docker push 747875535466.dkr.ecr.us-east-1.amazonaws.com/runstats-js:latest

npm ci