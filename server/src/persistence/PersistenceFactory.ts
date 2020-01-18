import { IDataPointRepository, DataPointRepository, InMemoryDataPointRepo } from "./DataPointRepository";
import { IActivityMetadataRepository, ActivityMetadataRepository, InMemoryActivityMetadataRepo } from "./ActivityMetadataRepository";
import { MySqlRepoBase } from "./MySqlRepoBase";
import { MySqlConfig } from "../config/MySqlConfig";
import { Logger } from "../domain/Logger";
import { S3Config } from "../config/S3Config";
import { S3Bucket } from "./S3Bucket";

export interface IPersistenceFactory {
    getDataPointRepo() : IDataPointRepository;
    getActivityRepo() : IActivityMetadataRepository;
    init() : Promise<void>;
}

export class AwsPersistenceFactory implements IPersistenceFactory {
    
    init(): Promise<void> {
        return this.actMetaRepo.ping();
    }

    getDataPointRepo(): IDataPointRepository {
        return this.dataPointRepo;
    }    
    
    getActivityRepo(): IActivityMetadataRepository {
        return this.actMetaRepo;
    }

    private readonly dataPointRepo : IDataPointRepository;
    private readonly actMetaRepo : IActivityMetadataRepository;

    public constructor() {
        const dbConfig = new MySqlConfig();
        MySqlRepoBase.init(dbConfig);
        const s3Config = new S3Config();
        const s3Factory = async () => new S3Bucket(await s3Config.getBucketName());
        this.actMetaRepo = new ActivityMetadataRepository(Logger.create);
        this.dataPointRepo = new DataPointRepository(Logger.create, s3Factory);
    }
}

export class InMemoryPersistenceFactory implements IPersistenceFactory {
    async init(): Promise<void> {
        // nothing to do here
    }

    getDataPointRepo(): IDataPointRepository {
        return this.dataPointRepo;
    }    
    
    getActivityRepo(): IActivityMetadataRepository {
        return this.actMetaRepo;
    }


    private readonly dataPointRepo : IDataPointRepository;
    private readonly actMetaRepo : IActivityMetadataRepository;

    public constructor() {
        this.actMetaRepo = new InMemoryActivityMetadataRepo();
        this.dataPointRepo = new InMemoryDataPointRepo();
    }
}