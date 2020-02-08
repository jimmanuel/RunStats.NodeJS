import { IRdsConfig } from "../config/RdsConfig";
import * as pg from 'pg';
import { ILog } from "../domain/Logger";

export class PostgresSqlRepoBase {
    
    public static async init(rdsConfig: IRdsConfig) : Promise<void> {
        this.pool = new pg.Pool({ 
                password: rdsConfig.Password,
                user: rdsConfig.Username,
                host: rdsConfig.Hostname,
                database: rdsConfig.DbName,
                connectionTimeoutMillis: 5 * 1000,
                query_timeout: 5 * 1000                
            });
    }

    protected async query<T>(action: (conn: pg.PoolClient) => Promise<T>) : Promise<T> {
        let conn : pg.PoolClient;
        try {
            conn = await PostgresSqlRepoBase.pool.connect()
            return action(conn);
        } 
        catch(error) {
            this.logger.error(error);
            throw error;
        }
        finally {
            if (conn) {
                conn.release();
            }
        }
    }

    private static pool: pg.Pool;
    protected readonly logger: ILog;

    constructor(log: ILog) {
        this.logger = log;
    }
}