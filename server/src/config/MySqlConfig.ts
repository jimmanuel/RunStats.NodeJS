import { LogFactory, ILog } from "../domain/Logger";
import { AwsParameterStoreConfig } from "./AwsParameterStoreConfig";

export interface IMySqlConfig {
    getHostname() : Promise<string>;
    getUsername() : Promise<string>;
    getPassword() : Promise<string>;
}


export class MySqlConfig extends AwsParameterStoreConfig implements IMySqlConfig {
    async getHostname(): Promise<string> {
        return this.getValue('dev-rs-mysql-hostname', true);
    }    
    async getUsername(): Promise<string> {
        return this.getValue('dev-rs-mysql-username', true);
    }
    async getPassword(): Promise<string> {
        return this.getValue('dev-rs-mysql-password', true);
    }

    constructor() {
        super();
    }
}