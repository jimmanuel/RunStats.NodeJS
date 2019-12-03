import { LogFactory, ILog } from "../domain/Logger";
import * as AWS from 'aws-sdk';

export interface IS3Config {
    getBucketName() : Promise<string>;
}

export class S3Config implements IS3Config {
    async getBucketName(): Promise<string> {
        if (!this.bucketName) {
            await this.loadValues();
        }

        return this.bucketName;
    }    
    private async loadValues() : Promise<void> {

        try {
            const ssm = new AWS.SSM({ region: 'us-east-1' });
            const bucketNameResult = await ssm.getParameter({ Name: 'dev-rs-s3-name' }).promise();
            this.bucketName = bucketNameResult.Parameter.Value;

            this.logger.info('s3 parameters have been successfully loaded');
            this.logger.info(`S3 Storage in ${this.bucketName}`);
        }
        catch(error) {
            this.bucketName = undefined;

            throw error;
        }
    }

    private bucketName: string;

    private readonly logger: ILog;
    constructor(logFactory: LogFactory) {
        this.logger = logFactory('S3Config');
    }

}