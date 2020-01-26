import { LogFactory } from "../domain/Logger";
import { PostgresSqlRepoBase } from "./PostgresSqlRepoBase";
import { RunActivity, IActivityMetadata } from "../domain/RunActivity";
import { ActivityToken } from "../domain/ActivityToken";
import * as uuid from 'uuid';
import { ActivityExistsError } from "../domain/ActivityExistsError";
import { ActivityNotFoundException } from "../domain/ActivityNotFoundException";
import { QueryResult } from "pg";

export interface IActivityMetadataRepository {
    ping() : Promise<void>;
    deleteActivity(id: number) : Promise<void>;
    getActivityUUID(id: number) : Promise<string>;
    saveMetadata(activity: RunActivity): Promise<ActivityToken>;
    getAllMetadata() : Promise<IActivityMetadata[]>;
}

export class ActivityMetadataRepository extends PostgresSqlRepoBase implements IActivityMetadataRepository {
    
    public async ping(): Promise<void> {
        return this.query(async conn => {
            await conn.query('select top 1 * from RunStats.ActivityMetadata');
            return;
        });
    }
    
    async deleteActivity(id: number): Promise<void> {
        return this.query(async conn => {
            await conn.query('delete from RunStats.ActivityMetadata where ID = ?', [id]);
            return;
        });
    }
    
    public async getActivityUUID(id: number) : Promise<string> {
        return this.query(async conn => {
            const result : QueryResult<any> = await conn.query('select UUID from RunStats.ActivityMetadata where ID = ?', [id]);
            
            if (result.rowCount == 0) {
                throw new ActivityNotFoundException();
            } 
            
            if (result.rowCount > 1) {
                throw new ActivityNotFoundException();
            }

            return result[0].UUID;
        });
    }
    
    public async getAllMetadata(): Promise<IActivityMetadata[]> {
        return this.query(async conn => {
            const result : QueryResult<any> = await conn.query('select * from RunStats.ActivityMetadata');
            return result.rows.map(x => { return { 
                id: x.ID, 
                distanceMeters: x.DistanceMeters,
                duration: x.DurationSeconds,
                epochStartTime: x.StartTime
            };});
        });
    }
    
    private async activityExists(startTime: number) : Promise<boolean> {
        return this.query(async conn => {
            const result = await conn.query('select StartTime from RunStats.ActivityMetadata where StartTime = ?', [startTime]);
            return result.rowCount > 0;
        });
    }

    public async saveMetadata(activity: RunActivity): Promise<ActivityToken> {

        if (await this.activityExists(activity.epochStartTime)) {
            throw new ActivityExistsError();
        }

        return this.query(async conn => {

            const key = uuid.v4();

            const result = await conn.query('insert into RunStats.ActivityMetadata (DistanceMeters, DurationSeconds, StartTime, UUID) values (?, ?, ?, ?)', 
            [
                activity.distanceMeters,
                activity.duration,
                activity.epochStartTime,
                key
            ]);
            
            return new ActivityToken(result.oid, key);
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
    async ping(): Promise<void> {
        return; // nothing to do
    }
    async deleteActivity(id: number) : Promise<void> {
        this.cache = this.cache.filter(x => x.Id != id);
    }

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

    private cache : ActivityRecord[] = [];
    constructor() {

    }
}