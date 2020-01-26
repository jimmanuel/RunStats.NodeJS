import { EnvironmentVarConfig } from "./IAppConfig";
import { Pool } from "pg";
import { LocalEnvLoader } from "./IEnvironmentLoader";
const path = require('path')
const fs = require('fs')

const appConfig = new EnvironmentVarConfig();

const pool = new Pool({ 
    password: appConfig.dbPassword,
    user: appConfig.dbUsername,
    host: appConfig.dbHost,
    connectionTimeoutMillis: 5 * 1000,
    query_timeout: 15 * 1000                
});

const func = async () => {

    await new LocalEnvLoader().load();

    const sqlPath = path.join(__dirname, 'schema');
    console.log(`SqlPath is ${sqlPath}`);
    const files = fs.readdirSync(sqlPath)
    for(const file of files) {

        console.log(`Running script ${JSON.stringify(file)}`);
        const fileBuffer = fs.readFileSync(path.join(sqlPath, file))
        const client = await pool.connect();

    }
};

func().then(() => console.log("complete"));