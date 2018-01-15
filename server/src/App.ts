import * as express from 'express'

class App {  
  public express

  constructor () {
    this.express = express()
    this.mountRoutes()
  }

  private mountRoutes (): void {
    const router = express.Router()
    router.get('/', (req, res) => {
      res.json({
        message: 'Hello World from typescript!!! [' + process.env.RUNSTATS_DB_CONNECTION_STRING + ']'
      })
    })
    this.express.use('/', router)
  }
}

export default new App().express  