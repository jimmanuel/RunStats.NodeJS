import * as dotenv from 'dotenv';
import * as AWS from 'aws-sdk';

export interface IEnvironmentLoader {
    load() : Promise<void>;
}

export class LocalEnvLoader implements IEnvironmentLoader {
    async load(): Promise<void> {
        console.log('loading with dotenv')
        dotenv.config();
    }
}

export class AwsEnvLoader implements IEnvironmentLoader {
    async load(): Promise<void> {
        console.log('loading from SSM')
        const ssm = new AwsParameterStoreConfig();
        process.env.DB_HOST = await ssm.getValue('db-server', true);
        process.env.DB_USERNAME = await ssm.getValue('db-username', true);
        process.env.DB_PASSWORD = await ssm.getValue('db-pwd', true);
        process.env.DB_NAME = await ssm.getValue('db-name', true);
    }

}

export class AwsParameterStoreConfig {
    
    get EnvPrefix() : string {
        return process.env.AWS_ENV ? process.env.AWS_ENV : "ENV_IS_UNSET";
    }
    
    public async getValue(name:string, withDecryption: boolean) : Promise<string> {
        
        const envSpecificName = `/${this.EnvPrefix}/${name}`
        const value = this.valueCache.get(envSpecificName);
        if (value) {
            return value;
        }

        try {
            const ssm = new AWS.SSM({ region: this.region });
            const result = await ssm.getParameter({ Name: envSpecificName, WithDecryption: withDecryption}).promise();

            this.valueCache.set(envSpecificName, result.Parameter.Value);

            return result.Parameter.Value;
        }
        catch(error) {
            throw error;
        }
    }

    private readonly valueCache: Map<string, string> = new Map<string, string>();
    private readonly region: string = 'us-east-1';
    constructor() {
    }
}