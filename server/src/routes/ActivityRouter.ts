import { Request, Response } from 'express'

export interface IActivityRouter { 
    uploadActivity(req: Request, res: Response) : Promise<void>;
    getAllActivities(req: Request, res: Response) : Promise<void>;
}

export class ActivityRouter implements IActivityRouter {
    public async getAllActivities(req: Request, res: Response): Promise<void> {
        res.json({ success: true });
    }
    public async uploadActivity(req: Request, res: Response) : Promise<void> {
        res.json({ success: true });
    }
}