import { LogFactory, ILog } from "../domain/Logger";
import * as AWS from 'aws-sdk';

export interface IMySqlConfig {
    getHostname() : Promise<string>;
    getUsername() : Promise<string>;
    getPassword() : Promise<string>;
}

export class MySqlConfig implements IMySqlConfig {
    async getHostname(): Promise<string> {
        if (!this.hostname) {
            await this.loadValues();
        }

        return this.hostname;
    }    
    async getUsername(): Promise<string> {
        if (!this.username) {
            await this.loadValues();
        }

        return this.username;
    }
    async getPassword(): Promise<string> {
        if (!this.password) {
            await this.loadValues();
        }

        return this.password;
    }

    private async loadValues() : Promise<void> {

        try {
            const ssm = new AWS.SSM({ region: 'us-east-1' });
            const usernameResult = await ssm.getParameter({ Name: 'dev-rs-mysql-username', WithDecryption: true}).promise();
            this.username = usernameResult.Parameter.Value;

            const passwordResult = await ssm.getParameter({ Name: 'dev-rs-mysql-password', WithDecryption: true}).promise();
            this.password = passwordResult.Parameter.Value;
            
            const hostnameResult = await ssm.getParameter({ Name: 'dev-rs-mysql-hostname', WithDecryption: true}).promise();
            this.hostname = hostnameResult.Parameter.Value;

            this.logger.info('mysql parameters have been successfully loaded');
        }
        catch(error) {
            this.username = undefined;
            this.password = undefined;
            this.hostname = undefined;

            throw error;
        }
    }

    private username: string;
    private hostname: string;
    private password: string;

    private readonly logger: ILog;
    constructor(logFactory: LogFactory) {
        this.logger = logFactory('MySqlConfig');
    }

}