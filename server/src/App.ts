import * as express from 'express'
import { ActivityRouter, IActivityRouter } from './routes/ActivityRouter';
import { Logger, ILog } from './domain/Logger';
import { GpxParser } from './domain/GpxParser';
import { IAppConfig, LocalConfigProvider, AwsConfigProvider } from './config/AppConfig';
import { IConfigRouter, ConfigRouter } from './routes/ConfigRouter';

let appConfig: IAppConfig = process.env.MODE == 'LOCAL' ? new LocalConfigProvider() : new AwsConfigProvider(Logger.create);
let persistenceFactory = appConfig.getPersistenceFactory();

class App {  
  public express;
  private readonly activityRouter : IActivityRouter;
  private readonly configRouter : IConfigRouter;
  private readonly logger : ILog = Logger.create('App');

  constructor () {

    this.configRouter = new ConfigRouter(Logger.create, appConfig);
    this.activityRouter = new ActivityRouter(Logger.create, persistenceFactory.getActivityRepo(), new GpxParser(), persistenceFactory.getDataPointRepo());

    this.logger.info('All Routers and necessary dependencies have been instantiated')

    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
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
    
    const textHandler = express.text({ limit: '10MB', type: 'application/xml'});

    router.options('*');
    router.put('/api/activity', textHandler, (req, res) => this.activityRouter.uploadActivity(req, res));
    router.get('/api/activities', (req, res) => this.activityRouter.getAllActivities(req, res));
    router.delete('/api/activities', (req, res) => this.activityRouter.deleteAllActivities(req, res));
    router.get('/api/activity/:id/datapoints', (req, res) => this.activityRouter.getActivity(req, res));
    router.delete('/api/activity/:id', (req, res) => this.activityRouter.deleteActivity(req, res));

    router.get('/api/config', (req, res) => this.configRouter.getConfig(req, res))

    router.get('/*', express.static(__dirname + '/../client'));

    this.express.use('/', router);
  }

  public async start() : Promise<void> {
    
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