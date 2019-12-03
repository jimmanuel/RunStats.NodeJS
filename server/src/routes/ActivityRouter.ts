import { Request, Response } from 'express'
import { ILog, LogFactory } from '../domain/Logger';
import { IActivityMetadataRepository } from '../persistence/ActivityMetadataRepository';
import { IGpxParser } from '../domain/GpxParser';
import { ActivityToken } from '../domain/ActivityToken';
import { S3BucketFactory } from '../persistence/S3Bucket';
import { ActivityExistsError } from '../domain/ActivityExistsError';

export interface IActivityRouter { 
    uploadActivity(req: Request, res: Response) : Promise<void>;
    getAllActivities(req: Request, res: Response) : Promise<void>;
}

export class ActivityRouter implements IActivityRouter {

    private handleError(res: Response, error: Error) : void{

        if (error instanceof ActivityExistsError) {
            this.logger.warn(error);
            res.status(409).json({message: 'an activity starting at that exact second has already been uploaded'}).end();
        } else {
            this.logger.error(error);
            res.status(500).json(error.message).end();
        }
    }

    public async getAllActivities(req: Request, res: Response): Promise<void> {
        try {
            const results = await this.activityRepo.getAllMetadata();
            res.json(results).end();
        } 
        catch (error) {
            this.handleError(res, error);
        }
    }

    public async uploadActivity(req: Request, res: Response) : Promise<void> {
        try {
            const activity = await this.gpxParser.parseGpx(req.body);
            this.logger.info(`Start Time: ${activity.epochStartTime}, Distance (m): ${activity.distanceMeters}`);

            const token : ActivityToken = await this.activityRepo.saveMetadata(activity);
            this.logger.info(token);
            
            await (await this.s3Factory()).putItem(`${token.uuid}.json`, JSON.stringify(activity.dataPoints));

            res.json({ id: token.id }).end();
        } 
        catch (error) {
            this.handleError(res, error);
        }
    }

    private readonly logger : ILog;
    constructor(logFactory: LogFactory,
        private activityRepo: IActivityMetadataRepository,
        private gpxParser: IGpxParser,
        private s3Factory: S3BucketFactory) {
        this.logger = logFactory('ActivityRouter');
    }
}