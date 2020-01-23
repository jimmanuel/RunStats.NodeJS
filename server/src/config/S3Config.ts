import { AwsParameterStoreConfig } from "./AwsParameterStoreConfig";

export interface IS3Config {
    getBucketName() : Promise<string>;
}
