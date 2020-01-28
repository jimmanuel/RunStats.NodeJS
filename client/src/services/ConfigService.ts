import * as axios from 'axios';

export interface IConfigService {
    getGoogleApiKey() : string;
    getGoogleClientId() : string;
    loadValues() : Promise<void>;
}

interface IAppConfig {
    googleApiKey : string;
    googleClientId: string;
}

export class ConfigService implements IConfigService {
    getGoogleClientId(): string {
        if (!this.appConfig) {
            return '';
        }
        return this.appConfig.googleClientId;
    }
    getGoogleApiKey(): string {
        if (!this.appConfig) {
            return '';
        }
        return this.appConfig.googleApiKey;
    }

    public async loadValues() : Promise<void>{

        if (this.appConfig) {
            return;
        }

        try {
            const results = await axios.default.get(`/api/config`, { headers : { 'Accept-Type' : 'application/json'}});
            this.appConfig = results.data;

            console.log(JSON.stringify(this.appConfig));

        } catch(error) {
            console.log(JSON.stringify(error))
            throw error;
        }
    }

    private appConfig : IAppConfig | null = null;
}