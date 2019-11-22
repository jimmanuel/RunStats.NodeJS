import { Request, Response } from 'express'

export interface IActivityRouter { 
    uploadActivity(req: Request, res: Response) : Promise<void>;
    getAllActivities(req: Request, res: Response) : Promise<void>;
}

export class ActivityRouter implements IActivityRouter {

    private handleError(res: Response, error: Error) : void{
        console.log(error);
        res.status(500).json(error.message);
    }

    public async getAllActivities(req: Request, res: Response): Promise<void> {
        try {
            res.json({ success: true });
        } 
        catch (error) {
            this.handleError(res, error);
        }
    }
    public async uploadActivity(req: Request, res: Response) : Promise<void> {
        try {
            res.json({ success: true });
        } 
        catch (error) {
            this.handleError(res, error);
        }
    }

    constructor() {
    }
}