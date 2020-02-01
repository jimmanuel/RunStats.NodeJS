import { ConsoleLogger } from './ConsoleLogger';

describe ('ConsoleLogger', () => {
    describe('log', () => {
        it ('should have full test coverage', () => {
            const logger = ConsoleLogger.create('test');
            logger.debug('');
            logger.error('');
            logger.fatal('');
            logger.info('');
            logger.trace('');
            logger.warn('');
        })
    })    
})