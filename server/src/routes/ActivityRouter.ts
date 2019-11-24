import { Request, Response } from 'express'
import { ILog, LogFactory } from '../domain/Logger';
import { IActivityMetadataRepository } from '../persistence/ActivityMetadataRepository';

export interface IActivityRouter { 
    uploadActivity(req: Request, res: Response) : Promise<void>;
    getAllActivities(req: Request, res: Response) : Promise<void>;
}

export class ActivityRouter implements IActivityRouter {

    private handleError(res: Response, error: Error) : void{
        this.logger.error(error);
        res.status(500).json(error.message).end();
    }

    public async getAllActivities(req: Request, res: Response): Promise<void> {
        try {
            await this.activityRepo.printInfo();
            res.json({ success: true }).end();
        } 
        catch (error) {
            this.handleError(res, error);
        }
    }
    public async uploadActivity(req: Request, res: Response) : Promise<void> {
        try {
            res.json({ success: true }).end();
        } 
        catch (error) {
            this.handleError(res, error);
        }
    }

    private readonly logger : ILog;
    constructor(logFactory: LogFactory,
        private activityRepo: IActivityMetadataRepository) {
        this.logger = logFactory('ActivityRouter');
    }
}