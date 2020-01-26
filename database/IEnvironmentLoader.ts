import * as dotenv from 'dotenv';

export interface IEnvironmentLoader {
    load() : Promise<void>;
}

export class LocalEnvLoader implements IEnvironmentLoader {
    async load(): Promise<void> {
        dotenv.config();
    }

}