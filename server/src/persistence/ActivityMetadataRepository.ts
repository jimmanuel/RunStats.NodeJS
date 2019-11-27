import { LogFactory, ILog } from "../domain/Logger";
import { MySqlRepoBase } from "./MySqlRepoBase";
import {format } from 'mysql'

export interface IActivityMetadataRepository {
    printInfo() : Promise<void>;
}

export class ActivityMetadataRepository extends MySqlRepoBase implements IActivityMetadataRepository {
    async printInfo(): Promise<void> {

        return this.query(async conn => {
            const result = await conn.query(format('SELECT table_name FROM information_schema.tables where TABLE_SCHEMA = ?', ['RunStats']));
            this.logger.info(result);
            return;
        });
    }

    constructor(logFactory: LogFactory) {
        
        super(logFactory('ActivityMetadataRepository'));

    }
}