import * as express from 'express'
import * as xmlparser from 'express-xml-bodyparser';
import { ActivityRouter, IActivityRouter } from './routes/ActivityRouter';
import { Logger, ILog } from './domain/Logger';
import { GpxParser } from './domain/GpxParser';
import { IPersistenceFactory, AwsPersistenceFactory, InMemoryPersistenceFactory } from './persistence/PersistenceFactory';


class App {  
  public express;
  private readonly activityRouter : IActivityRouter;
  private readonly logger : ILog = Logger.create('App');

  constructor () {

    let persistenceFactory : IPersistenceFactory;
    if (process.env.RS_PERSISTENCE == 'TRANSIENT') {
      persistenceFactory = new InMemoryPersistenceFactory();
    } else {
      persistenceFactory = new AwsPersistenceFactory();
    }

    this.activityRouter = new ActivityRouter(Logger.create, persistenceFactory.getActivityRepo(), new GpxParser(), persistenceFactory.getDataPointRepo());

    this.logger.info('All Routers and necessary dependencies have been instantiated')

    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router();

    if (process.env.CORS) {
      this.logger.info('enabling CORS')
      router.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.header("Access-Control-Allow-Methods", "*");
        next();
      });
    }
    
    const xmlHandler = xmlparser({trim: true, explicitArray: true, normalize: false, normalizeTags: false});

    router.options('*');
    router.put('/api/activity', xmlHandler, (req, res) => this.activityRouter.uploadActivity(req, res));
    router.get('/api/activities', (req, res) => this.activityRouter.getAllActivities(req, res));
    router.get('/api/activity/:id/datapoints', (req, res) => this.activityRouter.getActivity(req, res));
    router.delete('/api/activity/:id', (req, res) => this.activityRouter.deleteActivity(req, res));

    router.get('/*', express.static(__dirname + '/../client'));

    this.express.use('/', router);
  }
}

export default new App().express  