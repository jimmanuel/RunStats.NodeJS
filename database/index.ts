import { EnvironmentVarConfig } from "./IAppConfig";
import { Pool } from "pg";
import { LocalEnvLoader, AwsEnvLoader, IEnvironmentLoader } from "./IEnvironmentLoader";
import * as _ from 'lodash'
const path = require('path')
const fs = require('fs')

const func = async () => {

    const loader : IEnvironmentLoader = process.env.AWS_ENV ? new AwsEnvLoader() : new LocalEnvLoader()
    await loader.load();

    const appConfig = new EnvironmentVarConfig();

    console.log(`connecting to ${appConfig.dbHost}:${appConfig.dbName}`)
    console.log(`connecting as ${appConfig.dbUsername}`)

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
    
    const client = await pool.connect();
    try {
        for(const file of files) {

            console.log(`Running script ${JSON.stringify(file)}`);
            const fileBuffer = fs.readFileSync(path.join(sqlPath, file))
            await client.query(fileBuffer.toString());
            console.log(`Successfully Completed script ${JSON.stringify(file)}`);


        }
    } finally {
        client.release();
    }

    await pool.end();
};

export const handler = async (event: any = {}): Promise<any> => {
    await func();
    return true;
}

func().then(() => console.log("complete"));
