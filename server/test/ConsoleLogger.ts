import { ILog } from "../src/domain/Logger";

export class ConsoleLogger implements ILog {

    public static create(name: string) : ILog {
        return new ConsoleLogger(name);
    }

    info(msg: any): void {
        console.log(`[INFO] [${this.name}] ${msg}`);
    }    
    debug(msg: any): void {
        console.log(`[DEBUG] [${this.name}] ${msg}`);
    }
    trace(msg: any): void {
        console.log(`[TRACE] [${this.name}] ${msg}`);
    }
    warn(msg: any): void {
        console.log(`[WARN] [${this.name}] ${msg}`);
    }
    error(msg: any): void {
        console.log(`[ERROR] [${this.name}] ${msg}`);
    }
    fatal(msg: any): void {
        console.log(`[FATAL] [${this.name}] ${msg}`);
    }

    constructor (private name: string) { }
}