import { Request, Response } from 'express'
import { ILog, LogFactory } from '../domain/Logger';
import { IActivityMetadataRepository } from '../persistence/ActivityMetadataRepository';
import { IGpxParser } from '../domain/GpxParser';
import { ActivityToken } from '../domain/ActivityToken';
import { IDataPointRepository } from '../persistence/DataPointRepository';
import { BaseRouter } from './BaseRouter';

export interface IActivityRouter { 
    uploadActivity(req: Request, res: Response) : Promise<void>;
    deleteActivity(req: Request, res: Response) : Promise<void>;
    getActivity(req: Request, res: Response) : Promise<void>;
    getAllActivities(req: Request, res: Response) : Promise<void>;
    deleteAllActivities(req: Request, res: Response) : Promise<void>;
}

export class ActivityRouter extends BaseRouter implements IActivityRouter {
    
    private async internalPurgeActivity(activityId: number) : Promise<void> {
        const uuid = await this.activityRepo.getActivityUUID(activityId);
        await this.dataPointRepo.deleteDataPoints(uuid);
        await this.activityRepo.deleteActivity(activityId);

    }

    public async deleteAllActivities(req: Request, res: Response): Promise<void> {
        try {
            
            let deleteCounter = 0;
            const results = await this.activityRepo.getAllMetadata();
            for(const act of results) {
                try {
                    await this.internalPurgeActivity(act.id);
                    deleteCounter++;
                } catch(error) {
                    this.logger.error(JSON.stringify(error));
                }
            }

            this.logger.info(`TOTAL: ${results.length}; DELETED SUCCESSFULLY: ${deleteCounter}`);
            res.status(200).end();
        } 
        catch (error) {
            this.handleError(res, error);
        }
    }


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
            await this.internalPurgeActivity(id);
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

    constructor(logFactory: LogFactory,
        private activityRepo: IActivityMetadataRepository,
        private gpxParser: IGpxParser,
        private dataPointRepo: IDataPointRepository) {
        super(logFactory('ActivityRouter'));
    }
}