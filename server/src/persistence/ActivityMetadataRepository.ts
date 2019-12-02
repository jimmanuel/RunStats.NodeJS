import { LogFactory, ILog } from "../domain/Logger";
import { MySqlRepoBase } from "./MySqlRepoBase";
import {format } from 'mysql'
import { RunActivity } from "../domain/RunActivity";
import { ActivityToken } from "../domain/ActivityToken";
import * as uuid from 'uuid';

export interface IActivityMetadataRepository {
    saveMetadata(activity: RunActivity): Promise<ActivityToken>;
    printInfo() : Promise<void>;
}

export class ActivityMetadataRepository extends MySqlRepoBase implements IActivityMetadataRepository {
    
    public async saveMetadata(activity: RunActivity): Promise<ActivityToken> {
        return this.query(async conn => {

            const key = uuid.v4();

            const insertSql = format('insert into RunStats.ActivityMetadata (DistanceMeters, DurationSeconds, StartTime, UUID) values (?, ?, ?, ?)', 
            [
                activity.distanceMeters,
                activity.duration,
                activity.epochStartTime,
                key
            ]);

            const result = await conn.query(insertSql);
            
            return new ActivityToken(result.insertId, key);
        });
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