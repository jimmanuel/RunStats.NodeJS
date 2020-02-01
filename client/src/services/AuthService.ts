import * as axios from 'axios';

export interface IAuthService {
    login(accessToken: string) : Promise<void>;
}

export class AuthService implements IAuthService {
    async login(accessToken: string): Promise<void> {
        try {
            await axios.default.post(`/api/user/googletoken`, accessToken, { headers: { 'Content-Type' : 'application/text'}});
            
        } catch(error) {
            console.log(JSON.stringify(error))
            throw error;
        }
    }

}