import { IRdsConfig } from './RdsConfig';
import { IS3Config } from './S3Config';
import { IPersistenceFactory, AwsPersistenceFactory, InMemoryPersistenceFactory } from "../persistence/PersistenceFactory";
import { LogFactory } from "../domain/Logger";
import { PostgresSqlRepoBase } from '../persistence/PostgresSqlRepoBase';

export interface IJwtConfig {
    JwtSecret : string;
}

export interface ICookieConfig {
    CookieDomain : string;
}

export interface IAppConfig extends IJwtConfig, ICookieConfig {
    GoogleClientId : string;
    GoogleClientSecret : string;
    EnableCors: boolean;
    Port: number;
    GoogleApiKey: string;
    getPersistenceFactory() : Promise<IPersistenceFactory>;
}

export interface IAwsConfig extends IRdsConfig, IS3Config {
}

export class AppConfigImpl implements IAppConfig, IAwsConfig {
    get CookieDomain(): string {
        return process.env.COOKIE_DOMAIN;
    }
    get JwtSecret () : string {
        return process.env.JWT_SECRET;
    }
    get GoogleClientSecret(): string {
        return process.env.GOOGLE_AUTH_CLIENT_SECRET;
    }
    get GoogleClientId(): string {
        return process.env.GOOGLE_AUTH_CLIENT_ID;
    }    
    get GoogleApiKey(): string {
        return process.env.GOOGLE_API_KEY;
    }
    get BucketName(): string {
        return process.env.S3_BUCKET_NAME;
    } 
    get Hostname(): string {
        return process.env.DB_HOST_NAME;
    }    
    get Username(): string {
        return process.env.DB_USERNAME;
    }
    get Password(): string {
        return process.env.DB_PASSWORD;
    }
    get DbName(): string {
        return process.env.DB_DATABASE_NAME;
    }

    get EnableCors() : boolean { return process.env.ENABLE_CORS ? process.env.ENABLE_CORS.toLowerCase() == 'true' : false; }
    get Port(): number { return process.env.PORT ? +process.env.PORT : 3000; };
    
    async getPersistenceFactory() : Promise<IPersistenceFactory> {
        if (process.env.PERSISTENCE && process.env.PERSISTENCE.toLocaleLowerCase() == 'in_memory') {

            this.logFactory('AppConfig').info('Using In Memory Persistence');
            return new InMemoryPersistenceFactory();
        }

        await PostgresSqlRepoBase.init(this);
        return new AwsPersistenceFactory(this.logFactory, this);

    }

    public constructor(private logFactory : LogFactory) {
    }
}
