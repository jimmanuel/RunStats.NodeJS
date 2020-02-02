import { Request, Response, NextFunction} from 'express';
import { ILog, LogFactory } from '../domain/Logger';
import { IUserToken, IJwtService } from './JwtService';
import { ICookieConfig } from '../config/AppConfig';

export interface IAuthService {
    addAuthCookie(res: Response, jwt: string) : Promise<void>;
    authorizeRequest : (req: Request, res: Response, next: NextFunction) => Promise<void>;
}

export interface UserRequest extends Request {
    UserToken : IUserToken;
}

export class AuthService implements IAuthService {

    private getUser(req: Request) : Promise<IUserToken> {
        if (!req.cookies.access_token) {
            throw new Error('no access token attached to the request');
        }
        const jwt = req.cookies.access_token;
        return this.jwtService.verify(jwt);
    }

    public authorizeRequest = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const user = await this.getUser(req);
            (<UserRequest>req).UserToken = user;

        } catch(error) {
            this.logger.warn(JSON.stringify(error));
            res.status(403).end();
            return;
        }

        next();
    };

    public async addAuthCookie(res: Response, jwt: string): Promise<void> {
        
        const domain = await this.cookieConfig.getCookieDomain();
        res.cookie(this.cookieName, jwt, { secure: true, domain: `.${domain}`, maxAge: (12 * 60 * 60 * 1000) });
    }

    private readonly cookieName : string = 'access_token';
    private readonly logger : ILog;
    constructor (
        logFactory : LogFactory,
        private cookieConfig : ICookieConfig,
        private jwtService : IJwtService) {

        this.logger = logFactory('Auth Service');
    }
}