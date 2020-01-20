import { AwsParameterStoreConfig } from "./AwsParameterStoreConfig";

export interface IMySqlConfig {
    getHostname() : Promise<string>;
    getUsername() : Promise<string>;
    getPassword() : Promise<string>;
}


export class MySqlConfig extends AwsParameterStoreConfig implements IMySqlConfig {
    async getHostname(): Promise<string> {
        return this.getValue('tfdev-db-server', true);
    }    
    async getUsername(): Promise<string> {
        return this.getValue('tfdev-db-username', true);
    }
    async getPassword(): Promise<string> {
        return this.getValue('tfdev-db-pwd', true);
    }

    constructor() {
        super();
    }
}