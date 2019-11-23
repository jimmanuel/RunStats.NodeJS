import * as bunyan from 'bunyan';

export interface LogFactory {
    (name: string) : ILog;
}

export interface ILog {
    info(msg: any) : void;
    debug(msg: any) : void;
    trace(msg: any) : void;
    warn(msg: any) : void;
    error(msg: any) : void;
    fatal(msg: any) : void;
}

export class Logger implements ILog {
    
    public static create(name: string) : ILog {
        return new Logger(name);
    }

    private readonly logger: bunyan;

    private constructor(name: string) {
        this.logger = bunyan.createLogger({ name: name, level: 'trace'});
    }
    
    info(msg: any): void {
        this.logger.info(msg);
    }    
    debug(msg: any): void {
        this.logger.debug(msg);
    }
    trace(msg: any): void {
        this.logger.trace(msg);
    }
    warn(msg: any): void {
        this.logger.warn(msg);
    }
    error(msg: any): void {
        this.logger.error(msg);
    }
    fatal(msg: any): void {
        this.logger.fatal(msg);
    }
}