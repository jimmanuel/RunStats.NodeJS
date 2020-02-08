import { IDataPointRepository, DataPointRepository, InMemoryDataPointRepo } from "./DataPointRepository";
import { IActivityMetadataRepository, ActivityMetadataRepository, InMemoryActivityMetadataRepo } from "./ActivityMetadataRepository";
import { MySqlRepoBase } from "./MySqlRepoBase";
import { Logger, LogFactory, ILog } from "../domain/Logger";
import { S3Bucket } from "./S3Bucket";
import { IAwsConfig } from "../config/AppConfig";
import { PostgresSqlRepoBase } from "./PostgresSqlRepoBase";

export interface IPersistenceFactory {
    getDataPointRepo() : IDataPointRepository;
    getActivityRepo() : IActivityMetadataRepository;
    init() : Promise<void>;
}

export class AwsPersistenceFactory implements IPersistenceFactory {
    
    async init(): Promise<void> {
        try {
            await PostgresSqlRepoBase.init(this.appConfig);
            await this.actMetaRepo.ping();
        } catch (error) {
            // we expect this to fail
            this.logger.debug(JSON.stringify(error))
        }
    }

    getDataPointRepo(): IDataPointRepository {
        return this.dataPointRepo;
    }    
    
    getActivityRepo(): IActivityMetadataRepository {
        return this.actMetaRepo;
    }

    private readonly dataPointRepo : IDataPointRepository;
    private readonly actMetaRepo : IActivityMetadataRepository;
    private readonly logger : ILog;

    public constructor(logFactory: LogFactory, private appConfig : IAwsConfig) {
        //MySqlRepoBase.init(appConfig);
        this.logger = logFactory('AWS Persistence Factory');
        const s3Factory = async () => new S3Bucket(appConfig.BucketName);
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