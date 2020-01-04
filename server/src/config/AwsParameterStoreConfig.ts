import * as AWS from 'aws-sdk';

export class AwsParameterStoreConfig {
    
    public async getValue(name:string, withDecryption: boolean) : Promise<string> {
        const value = this.valueCache.get(name);
        if (value) {
            return value;
        }

        try {
            const ssm = new AWS.SSM({ region: this.region });
            const result = await ssm.getParameter({ Name: name, WithDecryption: withDecryption}).promise();

            this.valueCache.set(name, result.Parameter.Value);

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