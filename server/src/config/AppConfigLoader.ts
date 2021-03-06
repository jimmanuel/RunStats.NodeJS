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

    async load(): Promise<void> {
        process.env.COOKIE_DOMAIN = await this.paramStore.getValue('cookie-domain', false);
        process.env.JWT_SECRET = await this.paramStore.getValue('jwt-secret', true);
        process.env.GOOGLE_AUTH_CLIENT_SECRET = await this.paramStore.getValue('google-auth-client-secret', true);
        process.env.GOOGLE_AUTH_CLIENT_ID = await this.paramStore.getValue(`google-auth-client-id`, true);
        process.env.GOOGLE_API_KEY = await this.paramStore.getValue(`google-maps-key`, false);
        this.tryThis(async () => process.env.S3_BUCKET_NAME = await this.paramStore.getValue(`s3-name`, false));
        this.tryThis(async () => process.env.DB_HOST_NAME = await this.paramStore.getValue(`db-server`, false));
        this.tryThis(async () => process.env.DB_USERNAME = await this.paramStore.getValue(`db-username`, false));
        this.tryThis(async () => process.env.DB_PASSWORD = await this.paramStore.getValue(`db-pwd`, true));
        this.tryThis(async () => process.env.DB_DATABASE_NAME = await this.paramStore.getValue(`db-name`, false));
    }

    async tryThis<T>(action : () => Promise<T>) : Promise<T> {
        try {
            return await action();
        } catch (error) {
            console.warn(`potentil problem or maybe not loading config: ${error}`);
        }
    }

    private readonly paramStore = new AwsParameterStoreConfig();

}