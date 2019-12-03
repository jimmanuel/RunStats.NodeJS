import * as express from 'express'
import * as xmlparser from 'express-xml-bodyparser';
import { ActivityRouter, IActivityRouter } from './routes/ActivityRouter';
import { Logger } from './domain/Logger';
import { MySqlConfig } from './config/MySqlConfig';
import { S3Config } from './config/S3Config';
import { ActivityMetadataRepository } from './persistence/ActivityMetadataRepository';
import { MySqlRepoBase } from './persistence/MySqlRepoBase';
import { GpxParser } from './domain/GpxParser';
import { S3Bucket } from './persistence/S3Bucket';

const s3Config = new S3Config(Logger.create);
const dbConfig = new MySqlConfig(Logger.create);
MySqlRepoBase.init(dbConfig);

class App {  
  public express;
  private readonly activityRouter : IActivityRouter;

  constructor () {

    const logger = Logger.create('App');

    const s3Factory = async () => new S3Bucket(await s3Config.getBucketName());
    const actMetaRepo = new ActivityMetadataRepository(Logger.create);

    this.activityRouter = new ActivityRouter(Logger.create, actMetaRepo, new GpxParser(), s3Factory);

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