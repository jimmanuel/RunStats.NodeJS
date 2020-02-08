import { Request, Response } from 'express'
import { OAuth2Client } from 'google-auth-library';
import { LogFactory } from '../domain/Logger';
import { IAppConfig } from '../config/AppConfig';
import { BaseRouter } from './BaseRouter';
import { IJwtService } from '../services/JwtService';
import { IAuthService } from '../services/AuthService';

export interface IAuthRouter {
    loginGoogle(req: Request, res: Response) : Promise<void>;
}

export class AuthRouter extends BaseRouter implements IAuthRouter {
    async loginGoogle(req: Request, res: Response): Promise<void> {
        try {
            const googleClient = new OAuth2Client(
            { 
                clientId: this.appConfig.GoogleClientId, 
                clientSecret: this.appConfig.GoogleClientSecret 
            });
            const ticket = await googleClient.verifyIdToken({
                idToken: req.body,
                audience: undefined
            });
            const payload = ticket.getPayload();
            
            this.logger.debug(JSON.stringify(payload))

            const jwt = await this.jwtService.createJwt({
                sub: payload.sub, 
                email: payload.email
            });
            await this.authService.addAuthCookie(res, jwt);

            res.status(200).end();
        } catch (error) {
            this.handleError(res, error);
        }
    }

    constructor(
        logFactory : LogFactory,
        private appConfig : IAppConfig,
        private jwtService : IJwtService,
        private authService : IAuthService) {
            super(logFactory('Auth Router'));
    }
}
