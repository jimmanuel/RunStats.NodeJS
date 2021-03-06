import { LogFactory } from "../domain/Logger";
import { PostgresSqlRepoBase } from "./PostgresSqlRepoBase";
import { RunActivity, IActivityMetadata } from "../domain/RunActivity";
import { ActivityToken } from "../domain/ActivityToken";
import * as uuid from 'uuid';
import { ActivityExistsError } from "../domain/ActivityExistsError";
import { ActivityNotFoundException } from "../domain/ActivityNotFoundException";
import { QueryResult } from "pg";
import { PermissionDeniedException } from "../domain/PermissionDeniedException";

export interface IActivityMetadataRepository {
    ping() : Promise<void>;
    deleteActivity(userId: string, id: number) : Promise<void>;
    getActivityUUID(userId: string, id: number) : Promise<string>;
    saveMetadata(userId: string, activity: RunActivity): Promise<ActivityToken>;
    getAllMetadata(userId: string) : Promise<IActivityMetadata[]>;
}

export class ActivityMetadataRepository extends PostgresSqlRepoBase implements IActivityMetadataRepository {
    
    public async ping(): Promise<void> {
        return this.query(async conn => {
            await conn.query('select id from RunStats.ActivityMetadata limit 1');
            return;
        });
    }
    
    async ownsActivity(userId: string, activityId: number) : Promise<boolean> {
        return this.query(async conn => {
            const result : QueryResult<any> = await conn.query('select uuid from RunStats.ActivityMetadata where id = $1 and userid = $2', [activityId, userId]);
            return result.rowCount > 0;
        });
    }

    async deleteActivity(userId: string, id: number): Promise<void> {
        return this.query(async conn => {
            if (!this.ownsActivity(userId, id)){
                throw new PermissionDeniedException();
            }

            await conn.query('delete from RunStats.ActivityMetadata where id = $1', [id]);
            return;
        });
    }
    
    public async getActivityUUID(userId: string, id: number) : Promise<string> {
        return this.query(async conn => {
            if (!this.ownsActivity(userId, id)){
                throw new PermissionDeniedException();
            }

            const result : QueryResult<any> = await conn.query('select uuid from RunStats.ActivityMetadata where id = $1', [id]);
            //result.rows.map(x => this.logger.debug(JSON.stringify(x)));     
            if (result.rowCount == 0) {
                throw new ActivityNotFoundException();
            } 
            
            if (result.rowCount > 1) {
                throw new ActivityNotFoundException();
            }

            return result.rows[0].uuid;
        });
    }
    
    public async getAllMetadata(userId: string): Promise<IActivityMetadata[]> {
        return this.query(async conn => {
            const result : QueryResult<any> = await conn.query('select id, distancemeters, durationseconds, starttime from RunStats.ActivityMetadata where userid = $1', [ userId ]);
            //result.rows.map(x => this.logger.debug(JSON.stringify(x)));
            return result.rows.map(x => { return { 
                id: +x.id, 
                distanceMeters: +x.distancemeters,
                duration: +x.durationseconds,
                epochStartTime: +x.starttime
            };});
        });
    }
    
    private async activityExists(userId: string, startTime: number) : Promise<boolean> {
        return this.query(async conn => {
            const result = await conn.query('select starttime from RunStats.ActivityMetadata where starttime = $1 and userid = $2', [startTime, userId]);
            return result.rowCount > 0;
        });
    }

    public async saveMetadata(userId: string, activity: RunActivity): Promise<ActivityToken> {

        if (await this.activityExists(userId, activity.epochStartTime)) {
            throw new ActivityExistsError();
        }

        return this.query(async conn => {

            const key = uuid.v4();

            const result = await conn.query('insert into RunStats.ActivityMetadata (distancemeters, durationseconds, starttime, uuid, userid) values ($1, $2, $3, $4, $5)', 
            [
                activity.distanceMeters,
                activity.duration,
                activity.epochStartTime,
                key,
                userId
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
    async deleteActivity(userId: string, id: number) : Promise<void> {
        this.cache = this.cache.filter(x => x.Id != id);
    }

    public async getActivityUUID(userId: string, id: number): Promise<string> {
        const item = this.cache.find(x => x.Id == id);
        if (!item) {
            throw new ActivityNotFoundException();
        }
        return item.UUID;
    }    
    
    public async saveMetadata(userId: string, activity: RunActivity): Promise<ActivityToken> {
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

    public async getAllMetadata(userId: string): Promise<IActivityMetadata[]> {
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