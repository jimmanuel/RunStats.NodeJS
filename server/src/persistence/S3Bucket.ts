import AWS = require("aws-sdk");

export interface S3BucketFactory {
    () : Promise<IS3Bucket>;
}

export interface IS3Bucket {
    getItem(key: string) : Promise<string>;
    putItem(key: string, value: string) : Promise<void>;
    deleteItem(key: string) : Promise<void>;
}

export class S3Bucket implements IS3Bucket {
    async deleteItem(key: string): Promise<void> {
        const result = await this.s3Connection.deleteObject({ Bucket: this.bucketName, Key: key }).promise();
        if (result.$response.error) {
            throw result.$response.error;
        }  
    }
    
    async getItem(key: string): Promise<string> {
        const result = (await this.s3Connection.getObject({ Key: key, Bucket: this.bucketName }).promise());
        if (result.$response.error) {
            throw result.$response.error;
        }  
        return result.Body.toString();
    }
    
    async putItem(key: string, value: string): Promise<void> {
        const result = await this.s3Connection.putObject( { Body: value, Key: key, Bucket: this.bucketName }).promise();
        if (result.$response.error) {
            throw result.$response.error;
        }  
    }
 
    private readonly s3Connection: AWS.S3;

    constructor(private bucketName: string) {
        this.s3Connection = new AWS.S3();
    }
}