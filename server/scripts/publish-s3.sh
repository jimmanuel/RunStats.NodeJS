#! /bin/bash
./rebuild-server.sh

npm run package
aws s3 cp rs.app.zip s3://labar.jimbo.code/build/rs.app.zip
npm install