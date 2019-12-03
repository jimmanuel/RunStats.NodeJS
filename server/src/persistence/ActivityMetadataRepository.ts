import { LogFactory, ILog } from "../domain/Logger";
import { MySqlRepoBase } from "./MySqlRepoBase";
import {format } from 'mysql'
import { RunActivity, IActivityMetadata } from "../domain/RunActivity";
import { ActivityToken } from "../domain/ActivityToken";
import * as uuid from 'uuid';
import { ActivityExistsError } from "../domain/ActivityExistsError";

export interface IActivityMetadataRepository {
    saveMetadata(activity: RunActivity): Promise<ActivityToken>;
    getAllMetadata() : Promise<IActivityMetadata[]>;
}

export class ActivityMetadataRepository extends MySqlRepoBase implements IActivityMetadataRepository {
    public async getAllMetadata(): Promise<IActivityMetadata[]> {
        return this.query(async conn => {
            const sql = 'select * from RunStats.ActivityMetadata'
            const result : Array<any> = await conn.query(sql);
            return result.map(x => { return { 
                id: x.ID, 
                distanceMeters: x.DistanceMeters,
                duration: x.DurationSeconds,
                epochStartTime: x.StartTime
            };});
        });
    }
    
    private async activityExists(startTime: number) : Promise<boolean> {
        return this.query(async conn => {
            const sql = format('select StartTime from RunStats.ActivityMetadata where StartTime = ?', [startTime])
            const result = await conn.query(sql);
            return result.length > 0;
        });
    }

    public async saveMetadata(activity: RunActivity): Promise<ActivityToken> {

        if (await this.activityExists(activity.epochStartTime)) {
            throw new ActivityExistsError();
        }

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