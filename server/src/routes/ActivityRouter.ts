import { Request, Response } from 'express'
import { ILog, LogFactory } from '../domain/Logger';
import { IActivityMetadataRepository } from '../persistence/ActivityMetadataRepository';
import { IGpxParser } from '../domain/GpxParser';
import { ActivityToken } from '../domain/ActivityToken';
import { S3BucketFactory } from '../persistence/S3Bucket';
import { ActivityExistsError } from '../domain/ActivityExistsError';
import { ActivityNotFoundException } from '../domain/ActivityNotFoundException';
import { IDataPointRepository } from '../persistence/DataPointRepository';

export interface IActivityRouter { 
    uploadActivity(req: Request, res: Response) : Promise<void>;
    deleteActivity(req: Request, res: Response) : Promise<void>;
    getActivity(req: Request, res: Response) : Promise<void>;
    getAllActivities(req: Request, res: Response) : Promise<void>;
}

export class ActivityRouter implements IActivityRouter {


    public async getActivity(req: Request, res: Response): Promise<void> {
        try {
            const id : number = +req.params.id;
            const uuid = await this.activityRepo.getActivityUUID(id);
            res.json(await this.dataPointRepo.getDataPoints(uuid)).end();
        } 
        catch (error) {
            this.handleError(res, error);
        }
    }

    public async deleteActivity(req: Request, res: Response): Promise<void> {
        try {
            const id : number = +req.params.id;
            const uuid = await this.activityRepo.getActivityUUID(id);

            await this.dataPointRepo.deleteDataPoints(uuid);
            await this.activityRepo.deleteActivity(id);

            res.status(200).end();
        } 
        catch (error) {
            this.handleError(res, error);
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
            // TODO: add transactionality to this method - if the S3 insert fails we need to rollback or flag 
            // the record in the DB
            const activity = await this.gpxParser.parseGpx(req.body);
            this.logger.info(`Start Time: ${activity.epochStartTime}, Distance (m): ${activity.distanceMeters}`);

            const token : ActivityToken = await this.activityRepo.saveMetadata(activity);
            this.logger.info(token);
            
            await (this.dataPointRepo.saveDataPoints(token.uuid, activity.dataPoints));

            res.json({ id: token.id }).end();
        } 
        catch (error) {
            this.handleError(res, error);
        }
    }

    private handleError(res: Response, error: Error) : void{

        if (error instanceof ActivityExistsError) {
            this.logger.warn(error);
            res.status(409).json({message: 'an activity starting at that exact second has already been uploaded'}).end();
        } 
        else if (error instanceof ActivityNotFoundException) {
            res.status(404).json(error.message).end();
        } 
        else {
            this.logger.error(error);
            res.status(500).json(error.message).end();
        }
    }
    
    private readonly logger : ILog;
    constructor(logFactory: LogFactory,
        private activityRepo: IActivityMetadataRepository,
        private gpxParser: IGpxParser,
        private dataPointRepo: IDataPointRepository) {
        this.logger = logFactory('ActivityRouter');
    }
}