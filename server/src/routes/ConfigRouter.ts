import { Request, Response } from 'express'
import { IAppConfig } from '../config/AppConfig';
import { BaseRouter } from './BaseRouter';
import { LogFactory } from '../domain/Logger';

export interface IConfigRouter {
    getConfig(req: Request, res: Response) : Promise<void>;
}

export class ConfigRouter extends BaseRouter implements IConfigRouter {
    public async getConfig(req: Request, res: Response): Promise<void> {
        try {
            res.json(
                {
                    googleApiKey: this.appConfig.GoogleApiKey,
                    googleClientId: this.appConfig.GoogleClientId
                }).end();
        } 
        catch (error) {
            this.handleError(res, error);
        }
    }

    constructor (logFactory: LogFactory, private appConfig : IAppConfig) {
        super(logFactory('Config Router'));
    }
}