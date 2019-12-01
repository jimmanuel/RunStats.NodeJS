import { LogFactory, ILog } from "../domain/Logger";
import { MySqlRepoBase } from "./MySqlRepoBase";
import {format } from 'mysql'
import { RunActivity } from "../domain/RunActivity";
import { ActivityToken } from "../domain/ActivityToken";

export interface IActivityMetadataRepository {
    saveMetadata(activity: RunActivity): Promise<ActivityToken>;
    printInfo() : Promise<void>;
}

export class ActivityMetadataRepository extends MySqlRepoBase implements IActivityMetadataRepository {
    
    public async saveMetadata(activity: RunActivity): Promise<ActivityToken> {
        throw new Error("Method not implemented.");
    }
    
    public async printInfo(): Promise<void> {

        return this.query(async conn => {
            const result = await conn.query(format('SELECT table_name FROM information_schema.tables where TABLE_SCHEMA = ?', ['RunStats']));
            this.logger.info(result);
            return;
        });
    }

    constructor(logFactory: LogFactory) {
        
        super(logFactory('ActivityMetadataRepository'));

    }
}