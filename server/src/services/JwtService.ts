import { IJwtConfig } from '../config/AppConfig';
import { LogFactory, ILog } from '../domain/Logger';
var njwt = require('njwt');

export interface IUserToken {
    id: number;
    email: string;
}

export interface IGoogleAuthToken
{
    // These six fields are included in all Google ID Tokens.
    iss?: string;
    sub: number; // google's id for the user
    azp?: string;
    aud?: string;
    iat?: string;
    exp?: string;
   
    // These seven fields are only included when the user has granted the profile and
    // email OAuth scopes to the application.
    email: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
    given_name?: string;
    family_name?: string;
    locale?: string;
}

export interface IJwtService {
    createJwt(token: IGoogleAuthToken) : Promise<string>;
    verify(jwtToken: string) : Promise<IUserToken>; 
}

export class JwtService implements IJwtService {

    public async verify(jwtToken: string): Promise<IUserToken> {
        
        const key =  await this.jwtConfig.getJwtSecret();

        function myKeyResolver(kid, cb) {
            return cb(null, key);
        }

        try {
            const token = njwt.createVerifier().withKeyResolver(myKeyResolver).verify(jwtToken);
            this.logger.info(JSON.stringify(token));
            return { id : token.body.sub, email: token.body.email };
        } catch(error) {
            this.logger.warn(`Failed to verify JWT: ${error}`)
            throw error;
        }
    }
    
    public async createJwt(token: IGoogleAuthToken): Promise<string> {
        
        const claims = { 
            iss: 'jlabar.us', 
            sub: token.sub,
            email: token.email
        }
        
        const jwtToken = njwt.create(claims, await this.jwtConfig.getJwtSecret());
        jwtToken.setExpiration(new Date().getTime() + (24*60*60*1000));
        jwtToken.set
        return (jwtToken.compact())
    }

    private readonly algorithm = 'HS512';
    private readonly logger : ILog;
    constructor (
        logFactory : LogFactory, 
        private jwtConfig : IJwtConfig) {

        this.logger = logFactory('JWT Factory');
    }
}