import { AwsParameterStoreConfig } from "./AwsParameterStoreConfig";
import * as dotenv from 'dotenv';

export interface IAppConfig {
    EnableCors: boolean;
    Port: number;
    PersistenceMode: string;
    GetGoogleApiKey(): Promise<string>;
}

export class AwsConfigProvider implements IAppConfig {
    GetGoogleApiKey(): Promise<string> {
        return this.paramStore.getValue('dev-rs-maps-api-key', false);
    }
    get EnableCors() : boolean { return false; }
    get Port(): number { return 8080; };
    get PersistenceMode(): string { return "AWS" };

    private readonly paramStore = new AwsParameterStoreConfig();
}

export class LocalConfigProvider implements IAppConfig {
    
    async GetGoogleApiKey(): Promise<string> {
        return process.env.GOOGLE_API_KEY;
    }
    get EnableCors() : boolean { return process.env.ENABLE_CORS && process.env.ENABLE_CORS.toLocaleLowerCase() == 'true'; }
    get Port(): number { return +process.env.PORT; };
    get PersistenceMode(): string { return "TRANSIENT" };
    
    constructor() {
        dotenv.config();
    }
}