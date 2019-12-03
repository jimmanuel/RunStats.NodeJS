import { IMySqlConfig } from "../config/MySqlConfig";
import * as mysql from 'promise-mysql';
import { ILog } from "../domain/Logger";

export class MySqlRepoBase {
    
    public static async init(mySqlConfig: IMySqlConfig) : Promise<void> {
        this.pool = await mysql.createPool(
            {
                password: await mySqlConfig.getPassword(),
                user: await mySqlConfig.getUsername(),
                host: await mySqlConfig.getHostname(),
                connectionLimit: 50,
                
            });
    }

    protected async query<T>(action: (conn: mysql.Connection) => Promise<T>) : Promise<T> {
        let conn : mysql.PoolConnection;
        try {
            conn = await MySqlRepoBase.pool.getConnection();
            return action(conn);
        } 
        catch(error) {
            this.logger.error(error);
            throw error;
        }
        finally {
            if (conn) {
                MySqlRepoBase.pool.releaseConnection(conn);
            }
        }
    }

    private static pool: mysql.Pool;
    protected readonly logger: ILog;

    constructor(log: ILog) {
        this.logger = log;
    }
}