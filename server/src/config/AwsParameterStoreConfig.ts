import * as AWS from 'aws-sdk';

export class AwsParameterStoreConfig {
    
    get EnvPrefix() : string {
        return process.env.ENV_PREFIX ? process.env.ENV_PREFIX : "ENV_IS_UNSET";
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