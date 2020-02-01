import { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library';
import { LogFactory } from '../domain/Logger';
import { IAppConfig } from '../config/AppConfig';
import { BaseRouter } from './BaseRouter';

export interface IAuthRouter {
    loginGoogle(req: Request, res: Response) : Promise<void>;
}

export class AuthRouter extends BaseRouter implements IAuthRouter {
    async loginGoogle(req: Request, res: Response): Promise<void> {
        console.log(req.body) //=> { accessToken: '...', tokenType: 'bearer', ... }

        const otherCient = new OAuth2Client(
        { 
            clientId: await this.appConfig.getGoogleClientId(), 
            clientSecret: await this.appConfig.getGoogleClientSecret() 
        });
        const ticket = await otherCient.verifyIdToken({
            idToken: req.body,
            audience: undefined
        });
        const payload = ticket.getPayload();
        this.logger.info(JSON.stringify(payload))
    }

    constructor(
        logFactory : LogFactory,
        private appConfig : IAppConfig) {
            super(logFactory('Auth Router'));
    }
}
