import serverless from 'serverless-http';
import express from 'express';
import s3Proxy from 's3-proxy';

const app = express();
app.get('/*', s3Proxy({
    bucket: process.env.BUCKET_NAME,
    defaultKey: 'index.html'
}));

module.exports.handler = serverless(app);