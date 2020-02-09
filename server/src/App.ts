import * as express from 'express'
import { ActivityRouter, IActivityRouter } from './routes/ActivityRouter';
import { Logger, ILog } from './domain/Logger';
import { GpxParser } from './domain/GpxParser';
import { IAppConfig, AppConfigImpl as AppConfig } from './config/AppConfig';
import { IConfigRouter, ConfigRouter } from './routes/ConfigRouter';
import { IAuthRouter, AuthRouter } from './routes/AuthRouter';
import { JwtService } from './services/JwtService';
import { AuthService, IAuthService } from './services/AuthService';
import { IAppConfigLoader, AwsConfigLoader, LocalAppConfigLoader } from './config/AppConfigLoader';
var cookieParser = require('cookie-parser');

class App {  
    public express;
    private appConfig : IAppConfig;
    private activityRouter : IActivityRouter;
    private configRouter : IConfigRouter;
    private authRouter : IAuthRouter;
    private authService : IAuthService;
    private logger : ILog = Logger.create('App');

    constructor () {
    }

    public async init() : Promise<void> {

        let configLoader : IAppConfigLoader = null;
        if (process.env.AWS_ENV) {
            configLoader = new AwsConfigLoader();
            this.logger.info(`Loading config using AWS`);
        } else {
            configLoader = new LocalAppConfigLoader();
            this.logger.info(`Loading config using config file`);
        }

        await configLoader.load();

        this.appConfig = new AppConfig(Logger.create);
        let persistenceFactory = this.appConfig.getPersistenceFactory();
        await persistenceFactory.init();
        
        const jwtService = new JwtService(Logger.create, this.appConfig);
        this.authService = new AuthService(Logger.create, this.appConfig, jwtService);

        this.configRouter = new ConfigRouter(Logger.create, this.appConfig);
        this.activityRouter = new ActivityRouter(Logger.create, persistenceFactory.getActivityRepo(), new GpxParser(), persistenceFactory.getDataPointRepo());
        this.authRouter = new AuthRouter(Logger.create, this.appConfig, jwtService, this.authService);

        this.logger.info('All Routers and necessary dependencies have been instantiated')

        this.express = express()
    }

    private async mountRoutes (): Promise<void> {
        const router = express.Router();

        if (this.appConfig.EnableCors) {
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
        await this.init();

        await this.mountRoutes();

        this.express.listen(this.appConfig.Port, (err) => {  
            if (err) {
            return this.logger.error(err)
            }

            return this.logger.info(`server is listening on ${this.appConfig.Port}`)
        })
    }
}

export default new App();  