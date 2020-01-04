import { AwsParameterStoreConfig } from "./AwsParameterStoreConfig";

export interface IS3Config {
    getBucketName() : Promise<string>;
}

export class S3Config extends AwsParameterStoreConfig implements IS3Config {
    async getBucketName(): Promise<string> {
        return this.getValue('dev-rs-s3-name', false);
    }    

    constructor() {
        super();
    }

}