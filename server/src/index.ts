import app from './App'
import dotenv = require ('dotenv')

let configResult = dotenv.config();
if (configResult.error) {
  throw configResult.error;
}

const port = 3000//process.env.PORT || 3000

app.listen(port, (err) => {  
  if (err) {
    return console.log(err)
  }

  return console.log(`server is listening on ${port}`)
})