import { LogFactory, ILog } from "../domain/Logger";
import { IMySqlConfig } from "./MySqlConfig";

export interface IActivityMetadataRepository {
    printInfo() : Promise<void>;
}

export class ActivityMetadataRepository implements IActivityMetadataRepository {
    async printInfo(): Promise<void> {
        const host = await this.mySqlConfig.getHostname();
        const user = await this.mySqlConfig.getUsername();
        this.logger.info({ username: user, hostname: host });
    }

    private readonly logger: ILog;
    constructor(logFactory: LogFactory,
        private mySqlConfig: IMySqlConfig) {
        this.logger = logFactory('ActivityMetadataRepository');
    }

}