import * as express from 'express'
import { ActivityRouter, IActivityRouter } from './routes/ActivityRouter';
import { Logger, ILog } from './domain/Logger';
import { GpxParser } from './domain/GpxParser';
import { IAppConfig, LocalConfigProvider, AwsConfigProvider } from './config/AppConfig';
import { IConfigRouter, ConfigRouter } from './routes/ConfigRouter';
import { IAuthRouter, AuthRouter } from './routes/AuthRouter';
import { IJwtService, JwtService } from './services/JwtService';
import { AuthService, IAuthService } from './services/AuthService';
var cookieParser = require('cookie-parser');

let appConfig: IAppConfig = process.env.MODE == 'LOCAL' ? new LocalConfigProvider() : new AwsConfigProvider(Logger.create);
let persistenceFactory = appConfig.getPersistenceFactory();

class App {  
    public express;
    private readonly activityRouter : IActivityRouter;
    private readonly configRouter : IConfigRouter;
    private readonly authRouter : IAuthRouter;
    private readonly authService : IAuthService;
    private readonly logger : ILog = Logger.create('App');

    constructor () {

        const jwtService = new JwtService(Logger.create, appConfig);
        this.authService = new AuthService(Logger.create, appConfig, jwtService);

        this.configRouter = new ConfigRouter(Logger.create, appConfig);
        this.activityRouter = new ActivityRouter(Logger.create, persistenceFactory.getActivityRepo(), new GpxParser(), persistenceFactory.getDataPointRepo());
        this.authRouter = new AuthRouter(Logger.create, appConfig, jwtService, this.authService);

        this.logger.info('All Routers and necessary dependencies have been instantiated')

        this.express = express()
    }

    private async mountRoutes (): Promise<void> {
        const router = express.Router();

        if (appConfig.EnableCors) {
            this.logger.info('enabling CORS')
            router.use(function(req, res, next) {
                res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.header("Access-Control-Allow-Methods", "*");
                next();
            });
        }

        const genericTextHanlder = express.text({ limit: '1MB', type: '*/*'});
        const xmlAsTextHandler = express.text({ limit: '10MB', type: 'application/xml'});
        const authHandler = this.authService.authorizeRequest;

        router.use(cookieParser());

        // authentication needed
        router.put('/api/activity', authHandler, xmlAsTextHandler, (req, res) => this.activityRouter.uploadActivity(req, res));
        router.get('/api/activities', authHandler, (req, res) => this.activityRouter.getAllActivities(req, res));
        router.delete('/api/activities', authHandler, (req, res) => this.activityRouter.deleteAllActivities(req, res));
        router.get('/api/activity/:id/datapoints', authHandler, (req, res) => this.activityRouter.getActivity(req, res));
        router.delete('/api/activity/:id', authHandler, (req, res) => this.activityRouter.deleteActivity(req, res));

        // authentication not needed
        router.options('*');
        router.post('/api/user/googletoken', genericTextHanlder, (req, res) => this.authRouter.loginGoogle(req, res));
        router.get('/api/config', (req, res) => this.configRouter.getConfig(req, res));
        router.get('/api/health', (req, res) => res.send(200).end());
        router.get('/*', express.static(__dirname + '/client'));

        this.express.use('/', router);
    }

    public async start() : Promise<void> {
        
        await this.mountRoutes();

        await persistenceFactory.init();
        this.express.listen(appConfig.Port, (err) => {  
            if (err) {
            return this.logger.error(err)
            }

            return this.logger.info(`server is listening on ${appConfig.Port}`)
        })
    }
}




export default new App();  