import { Request, Response } from 'express'
import { ActivityNotFoundException } from '../domain/ActivityNotFoundException';
import { ActivityExistsError } from '../domain/ActivityExistsError';
import { ILog } from '../domain/Logger';
import { IUserToken } from '../services/JwtService';
import { UserRequest } from '../services/AuthService';
import { PermissionDeniedException } from '../domain/PermissionDeniedException';

export class BaseRouter {

    protected handleError(res: Response, error: Error) : void{

        if (error instanceof ActivityExistsError) {
            this.logger.warn(error);
            res.status(409).json({message: 'an activity starting at that exact second has already been uploaded'}).end();
        } 
        else if (error instanceof ActivityNotFoundException) {
            res.status(404).json(error.message).end();
        } 
        else if (error instanceof PermissionDeniedException) {
            res.status(403).end();
        }
        else {
            this.logger.error(error);
            res.status(500).json(error.message).end();
        }
    }
    
    protected getUser(req: Request) : IUserToken {
        const userRequest = <UserRequest>req;
        return userRequest.UserToken;
    }

    protected constructor (protected logger: ILog) { }
}