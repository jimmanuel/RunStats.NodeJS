import { EnvironmentVarConfig } from "./IAppConfig";
import { Pool } from "pg";
import { LocalEnvLoader, AwsEnvLoader, IEnvironmentLoader } from "./IEnvironmentLoader";
import * as _ from 'lodash'
const path = require('path')
const fs = require('fs')

const func = async () => {

    const loader : IEnvironmentLoader = process.env.PLATFORM == 'AWS' ? new AwsEnvLoader() : new LocalEnvLoader()
    await loader.load();

    const appConfig = new EnvironmentVarConfig();

    const pool = new Pool({ 
        password: appConfig.dbPassword,
        user: appConfig.dbUsername,
        host: appConfig.dbHost,
        database: appConfig.dbName, 
        connectionTimeoutMillis: 5 * 1000,
        query_timeout: 15 * 1000                
    });
    
    const sqlPath = path.join(__dirname, 'schema');
    console.log(`SqlPath is ${sqlPath}`);
    let files = fs.readdirSync(sqlPath);
    files = _.sortBy(files);
    for(const file of files) {

        console.log(`Running script ${JSON.stringify(file)}`);
        const fileBuffer = fs.readFileSync(path.join(sqlPath, file))
        const client = await pool.connect();
        console.log('client is connected');
        try {
            await client.query(fileBuffer.toString());
        } finally {
            console.log('closing client')
            client.release();
            console.log('client is closed')
        }


    }

    console.log('closing pool')
    await pool.end();
    console.log('pool is closed')
};

func().then(() => console.log("complete"));
