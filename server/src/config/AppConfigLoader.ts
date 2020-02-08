import * as dotenv from 'dotenv';
import { AwsParameterStoreConfig } from "./AwsParameterStoreConfig";

export interface IAppConfigLoader {
    load() : Promise<void>;
}

export class LocalAppConfigLoader implements IAppConfigLoader {
    async load(): Promise<void> {
        dotenv.config();
    }
}

export class AwsConfigLoader implements IAppConfigLoader {
/*
    getCookieDomain(): Promise<string> {
        return this.paramStore.getValue('cookie-domain', false);
    }
    getJwtSecret(): Promise<string> {
        return this.paramStore.getValue('jwt-secret', true);
    }
    getGoogleClientSecret(): Promise<string> {
        return this.paramStore.getValue('google-auth-client-secret', true);
    }
    getGoogleClientId(): Promise<string> {
        return this.paramStore.getValue(`google-auth-client-id`, true);
    }    
    getGoogleApiKey(): Promise<string> {
        return this.paramStore.getValue(`google-maps-key`, false);
    }
    getBucketName(): Promise<string> {
        return this.paramStore.getValue(`s3-name`, false);
    } 
    getHostname(): Promise<string> {
        return this.paramStore.getValue(`db-server`, true);
    }    
    getUsername(): Promise<string> {
        return this.paramStore.getValue(`db-username`, true);
    }
    getPassword(): Promise<string> {
        return this.paramStore.getValue(`db-pwd`, true);
    }
    getDbName(): Promise<string> {
        return this.paramStore.getValue(`db-name`, true);
    }
*/

    load(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    private readonly paramStore = new AwsParameterStoreConfig();

}