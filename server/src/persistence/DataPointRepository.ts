import { DataPoint } from "../domain/DataPoint";
import { ILog, LogFactory } from "../domain/Logger";
import { S3BucketFactory } from "./S3Bucket";

export interface IDataPointRepository {
    deleteDataPoints(uuid: string) : Promise<void>;
    saveDataPoints(uuid: string, points: DataPoint[]) : Promise<void>;
    getDataPoints(uuid: string) : Promise<DataPoint[]>;
}

export class DataPointRepository implements IDataPointRepository {
    async deleteDataPoints(uuid: string): Promise<void> {
        const key = `${uuid}.json`;
        (await this.s3Factory()).deleteItem(key);
    }
    
    public async saveDataPoints(uuid: string, points: DataPoint[]): Promise<void> {
        return (await this.s3Factory()).putItem(`${uuid}.json`, JSON.stringify(points));
    }    
    
    public async getDataPoints(uuid: string): Promise<DataPoint[]> {
        const key = `${uuid}.json`;

        // TODO: add handling for a key that somehow doesn't exist
        const strValue = await (await this.s3Factory()).getItem(key);
        return JSON.parse(strValue);
    }

    private readonly logger : ILog;
    constructor(logFactory: LogFactory,
        private s3Factory: S3BucketFactory) {
        this.logger = logFactory('DataPointRepository');
    }
}

export class InMemoryDataPointRepo implements IDataPointRepository {
    async deleteDataPoints(uuid: string) : Promise<void> {
        this.cache.delete(uuid);
    }
    public async saveDataPoints(uuid: string, points: DataPoint[]): Promise<void> {
        this.cache.set(uuid, points);
    }    
    
    public async getDataPoints(uuid: string): Promise<DataPoint[]> {
        return this.cache.get(uuid);
    }

    private cache = new Map<string, DataPoint[]>();
}