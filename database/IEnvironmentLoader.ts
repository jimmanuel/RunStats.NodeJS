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
        console.log('instantiated ssm')
        process.env.DB_HOST = await ssm.getValue('db-server', false);
        console.log('loaded db-server')
        process.env.DB_USERNAME = await ssm.getValue('db-username', false);
        console.log('loaded db-username')
        process.env.DB_PASSWORD = await ssm.getValue('db-pwd', true);
        console.log('loaded db-pwd')
        process.env.DB_NAME = await ssm.getValue('db-name', false);
        console.log('loaded db-name')
    }

}

export class AwsParameterStoreConfig {
    
    get EnvPrefix() : string {
        return process.env.AWS_ENV ? process.env.AWS_ENV : "ENV_IS_UNSET";
    }
    
    public async getValue(name:string, withDecryption: boolean) : Promise<string> {
        
        const envSpecificName = `/${this.EnvPrefix}/${name}`
        console.log(`looking up value of ${envSpecificName}`)
        const value = this.valueCache.get(envSpecificName);
        if (value) {
            return value;
        }

        try {
            console.log(`creating SSM onj`)
            const ssm = new AWS.SSM({ region: this.region });
            console.log(`fetching ${envSpecificName} from SSM`)
            const result = await ssm.getParameter({ Name: envSpecificName, WithDecryption: withDecryption}).promise();
            console.log(`fetched ${envSpecificName} from SSM`)

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