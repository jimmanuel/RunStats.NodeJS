import { JwtService, IGoogleAuthToken, IUserToken } from '../../src/services/JwtService';
import { IJwtConfig } from '../../src/config/AppConfig';
import { ConsoleLogger } from '../ConsoleLogger';

class FakeConfig implements IJwtConfig {
    async getJwtSecret(): Promise<string> {
        return 'this-is-a-secret';
    }
}

describe ('JwtService', () => {
    describe('create jwt', () => {
        it ('should round trip JWTs', async () => {
            const googleToken : IGoogleAuthToken = {
                sub: 5,
                email: 'bob@gmail.com'
            };

            const service = new JwtService(ConsoleLogger.create, new FakeConfig());

            const jwt = await service.createJwt(googleToken);
            const userToken = await service.verify(jwt);

            expect(userToken.id).toBe(googleToken.sub);
            expect(userToken.email).toBe(googleToken.email);
        })

        it('should throw with invalid tokens', async () => {
            const googleToken : IGoogleAuthToken = {
                sub: 5,
                email: 'bob@gmail.com'
            };

            const service = new JwtService(ConsoleLogger.create, new FakeConfig());

            const jwt = await service.createJwt(googleToken);
            
            try {
                await service.verify(jwt.substr(0, 5));
                fail();
            } catch (error) {
                // success
            }
        })
    })
})