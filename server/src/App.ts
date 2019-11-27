import * as express from 'express'
import { ActivityRouter, IActivityRouter } from './routes/ActivityRouter';
import { Logger } from './domain/Logger';
import { MySqlConfig } from './persistence/MySqlConfig';
import { ActivityMetadataRepository } from './persistence/ActivityMetadataRepository';
import { MySqlRepoBase } from './persistence/MySqlRepoBase';

class App {  
  public express;
  private readonly activityRouter : IActivityRouter;

  constructor () {

    const logger = Logger.create('App');

    const actMetaRepo = new ActivityMetadataRepository(Logger.create);

    this.activityRouter = new ActivityRouter(Logger.create, actMetaRepo);

    logger.info('All Routers and necessary dependencies have been instantiated')

    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router();
    router.put('/api/activity', (req, res) => this.activityRouter.uploadActivity(req, res));
    router.get('/api/activities', (req, res) => this.activityRouter.getAllActivities(req, res));

    router.get('/', (req, res) => {
      res.json({
        message: 'TODO: build a frontend application using . . . something'
      })
    })

    this.express.use('/', router);
  }
}

const dbConfig = new MySqlConfig(Logger.create);
MySqlRepoBase.init(dbConfig);

export default new App().express  