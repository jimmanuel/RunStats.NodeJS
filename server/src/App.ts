import * as express from 'express'
import * as xmlparser from 'express-xml-bodyparser';
import { ActivityRouter, IActivityRouter } from './routes/ActivityRouter';
import { Logger } from './domain/Logger';
import { GpxParser } from './domain/GpxParser';
import { IPersistenceFactory, AwsPersistenceFactory, InMemoryPersistenceFactory } from './persistence/PersistenceFactory';


class App {  
  public express;
  private readonly activityRouter : IActivityRouter;

  constructor () {

    const logger = Logger.create('App');

    let persistenceFactory : IPersistenceFactory;
    if (process.env.RS_PERSISTENCE == 'TRANSIENT') {
      persistenceFactory = new InMemoryPersistenceFactory();
    } else {
      persistenceFactory = new AwsPersistenceFactory();
    }

    this.activityRouter = new ActivityRouter(Logger.create, persistenceFactory.getActivityRepo(), new GpxParser(), persistenceFactory.getDataPointRepo());

    logger.info('All Routers and necessary dependencies have been instantiated')

    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router();

    const xmlHandler = xmlparser({trim: true, explicitArray: true, normalize: false, normalizeTags: false});

    router.put('/api/activity', xmlHandler, (req, res) => this.activityRouter.uploadActivity(req, res));
    router.get('/api/activities', (req, res) => this.activityRouter.getAllActivities(req, res));
    router.get('/api/activity/:id/datapoints', (req, res) => this.activityRouter.getActivity(req, res));

    router.get('/', (req, res) => {
      res.json({
        message: 'TODO: build a frontend application using . . . something'
      })
    })

    this.express.use('/', router);
  }
}

export default new App().express  