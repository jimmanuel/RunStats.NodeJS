import { AwsParameterStoreConfig } from "./AwsParameterStoreConfig";

export interface IMySqlConfig {
    getHostname() : Promise<string>;
    getUsername() : Promise<string>;
    getPassword() : Promise<string>;
}
