import { LogFactory, ILog } from "../domain/Logger";
import { MySqlRepoBase } from "./MySqlRepoBase";
import {format } from 'mysql'
import { RunActivity, IActivityMetadata } from "../domain/RunActivity";
import { ActivityToken } from "../domain/ActivityToken";
import * as uuid from 'uuid';
import { ActivityExistsError } from "../domain/ActivityExistsError";
import { ActivityNotFoundException } from "../domain/ActivityNotFoundException";

export interface IActivityMetadataRepository {
    getActivityUUID(id: number) : Promise<string>;
    saveMetadata(activity: RunActivity): Promise<ActivityToken>;
    getAllMetadata() : Promise<IActivityMetadata[]>;
}

export class ActivityMetadataRepository extends MySqlRepoBase implements IActivityMetadataRepository {
    
    public async getActivityUUID(id: number) : Promise<string> {
        return this.query(async conn => {
            const sql = format('select UUID from RunStats.ActivityMetadata where ID = ?', [id]);
            const result : Array<any> = await conn.query(sql);
            
            if (result.length == 0) {
                throw new ActivityNotFoundException();
            } 
            
            if (result.length > 1) {
                throw new ActivityNotFoundException();
            }

            return result[0].UUID;
        });
    }
    
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


class ActivityRecord {
    Id: number;
    Distance: number;
    StartTimeEpoch: number;
    Duration: number;
    UUID: string;
}

export class InMemoryActivityMetadataRepo implements IActivityMetadataRepository {

    public async getActivityUUID(id: number): Promise<string> {
        const item = this.cache.find(x => x.Id == id);
        if (!item) {
            throw new ActivityNotFoundException();
        }
        return item.UUID;
    }    
    
    public async saveMetadata(activity: RunActivity): Promise<ActivityToken> {
        const item = this.cache.find(x => x.StartTimeEpoch == activity.epochStartTime);
        if (item) {
            throw new ActivityExistsError();
        }

        const act = new ActivityRecord();
        act.Id = this.getNextId();
        act.Distance = activity.distanceMeters;
        act.Duration = activity.duration;
        act.StartTimeEpoch = activity.epochStartTime;
        act.UUID = uuid.v4();

        this.cache.push(act);

        return new ActivityToken(act.Id, act.UUID);
    }
    
    private getNextId() : number {
        let id = 1;

        for(let item of this.cache) {
            if (id <= item.Id) {
                id = item.Id+1;
            }
        }

        return id;
    }

    public async getAllMetadata(): Promise<IActivityMetadata[]> {
        return this.cache.map(x => { return { 
            id: x.Id, 
            distanceMeters: x.Distance,
            duration: x.Duration,
            epochStartTime: x.StartTimeEpoch
        };});
    }

    private readonly cache : ActivityRecord[] = [];
    constructor() {

    }
}