export interface IAppConfig {
    dbHost : string;
    dbName: string;
    dbUsername : string;
    dbPassword : string;
}

export class EnvironmentVarConfig implements IAppConfig {
    get dbUsername(): string {
        return process.env.DB_USERNAME;
    }    
    get dbName(): string {
        return process.env.DB_NAME;
    }
    get dbPassword(): string {
        return process.env.DB_PASSWORD;
    }
    get dbHost() : string { 
        return process.env.DB_HOST;
    }
}