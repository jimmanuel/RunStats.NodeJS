import * as express from 'express'
import { ActivityRouter, IActivityRouter } from './routes/ActivityRouter';

class App {  
  public express;
  private readonly activityRouter : IActivityRouter;

  constructor () {

    this.activityRouter = new ActivityRouter();

    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()
    router.put('/api/activity', (req, res) => this.activityRouter.uploadActivity(req, res));
    router.get('/api/activities', (req, res) => this.activityRouter.getAllActivities(req, res));

    router.get('/', (req, res) => {
      res.json({
        message: 'Hello World from typescript!!! [' + process.env.RUNSTATS_DB_CONNECTION_STRING + ']'
      })
    })

    this.express.use('/', router);
  }
}

export default new App().express  