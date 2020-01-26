import { AwsParameterStoreConfig } from "./AwsParameterStoreConfig";
import * as dotenv from 'dotenv';
import { IRdsConfig } from './RdsConfig';
import { IS3Config } from './S3Config';
import { IPersistenceFactory, AwsPersistenceFactory, InMemoryPersistenceFactory } from "../persistence/PersistenceFactory";
import { LogFactory } from "../domain/Logger";

export interface IAppConfig {
    EnableCors: boolean;
    Port: number;
    getGoogleApiKey(): Promise<string>;
    getPersistenceFactory() : IPersistenceFactory;
}

export interface IAwsConfig extends IRdsConfig, IS3Config {
}

export class AwsConfigProvider implements IAppConfig, IAwsConfig {
    
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

    get EnableCors() : boolean { return false; }
    get Port(): number { return process.env.PORT ? +process.env.PORT : 3000; };
    
    getPersistenceFactory() : IPersistenceFactory {
        return new AwsPersistenceFactory(this.logFactory, this);
    }

    private readonly paramStore = new AwsParameterStoreConfig();

    public constructor(private logFactory : LogFactory) {
    }
}

export class LocalConfigProvider implements IAppConfig {
    
    async getGoogleApiKey(): Promise<string> {
        return process.env.GOOGLE_API_KEY;
    }
    get EnableCors() : boolean { return process.env.ENABLE_CORS && process.env.ENABLE_CORS.toLocaleLowerCase() == 'true'; }
    get Port(): number { return +process.env.PORT; };
    
    getPersistenceFactory() : IPersistenceFactory {
        return new InMemoryPersistenceFactory();
    }
    
    constructor() {
        dotenv.config();
    }
}