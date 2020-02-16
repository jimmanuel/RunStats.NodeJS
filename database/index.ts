import { EnvironmentVarConfig } from "./IAppConfig";
import { Pool } from "pg";
import { LocalEnvLoader, AwsEnvLoader, IEnvironmentLoader } from "./IEnvironmentLoader";
import * as _ from 'lodash'
const path = require('path')
const fs = require('fs')

const func = async (scriptFolder: string) => {

    const loader : IEnvironmentLoader = process.env.AWS_ENV ? new AwsEnvLoader() : new LocalEnvLoader()
    await loader.load();

    const appConfig = new EnvironmentVarConfig();

    console.log(`connecting host ${appConfig.dbHost}:${appConfig.dbHost}`)
    console.log(`connecting database ${appConfig.dbName}`)
    console.log(`connecting as ${appConfig.dbUsername}`)

    const pool = new Pool({ 
        password: appConfig.dbPassword,
        user: appConfig.dbUsername,
        host: appConfig.dbHost,
        database: appConfig.dbName, 
        connectionTimeoutMillis: 5 * 1000,
        query_timeout: 15 * 1000                
    });
    
    const sqlPath = path.join(__dirname, scriptFolder);
    console.log(`SqlPath is ${sqlPath}`);
    let files = fs.readdirSync(sqlPath);
    files = _.sortedUniq(files);
    
        for(const file of files) {
            const client = await pool.connect();
            try {
                console.log(`Running script ${JSON.stringify(file)}`);
                const fileBuffer = fs.readFileSync(path.join(sqlPath, file))
                await client.query(fileBuffer.toString());
                console.log(`Successfully Completed script ${JSON.stringify(file)}`);

            } finally {
                client.release();
            }
        }

    await pool.end();
};

export const createHandler = async (event: any = {}): Promise<any> => {
    await func('schema');
    return true;
}

export const deletehandler = async (event: any = {}): Promise<any> => {
    await func('schemadestroy');
    return true;
}

export const resethandler = async (event: any = {}): Promise<any> => {
    await deletehandler();
    await createHandler();
    return true;
}

//func().then(() => console.log("complete"));
