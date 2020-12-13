var serverless = require('serverless-http');
var express = require('express');
var s3Proxy = require('s3-proxy');

const app = express();
app.get('/*', s3Proxy({
    bucket: process.env.BUCKET_NAME,
    defaultKey: 'index.html'
}));

module.exports.handler = serverless(app);