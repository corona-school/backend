import { isCommandArg } from '../util/basic';
import { configure, addLayout, getLogger as getlog4jsLogger, Logger as Log4jsLogger } from 'log4js';

addLayout('json', function () {
    return function (logEvent) {
        const message = logEvent.data.shift();
        const data = logEvent.data.shift();
        return JSON.stringify({ ...logEvent, message, data });
    };
});

let appenders = ['out'];
if (process.env.LOG_FORMAT === 'json') {
    appenders = ['outJson'];
}

configure({
    appenders: {
        out: { type: 'stdout', layout: { type: 'coloured' } },
        outJson: { type: 'stdout', layout: { type: 'json' } },
    },
    categories: {
        default: {
            appenders,
            level: isCommandArg('--debug') ? 'debug' : 'info',
        },
    },
});

export type LogData = { [key: string]: any };

export class Logger {
    constructor(private logger: Log4jsLogger) {}

    getLoggerImpl(): any {
        return this.logger;
    }

    trace(message: string, args: LogData = {}): void {
        this.logger.trace(message, args);
    }

    // TODO switch to string
    debug(message: any, args: LogData = {}): void {
        if (typeof message !== 'string') {
            message = JSON.stringify(message);
        }
        this.logger.debug(message, args);
    }

    info(message: string, args: LogData = {}): void {
        this.logger.info(message, args);
    }

    warn(message: string, args: LogData = {}): void {
        this.logger.warn(message, args);
    }

    error(message: string, args: LogData = {}): void {
        this.logger.error(message, args);
    }

    fatal(message: string, args: LogData = {}): void {
        this.logger.fatal(message, args);
    }

    mark(message: string, args: LogData = {}): void {
        this.logger.mark(message, args);
    }

    addContext(key: string, value: any) {
        this.logger.addContext(key, value);
    }
}

export function getLogger(category?: string): Logger {
    return new Logger(getlog4jsLogger(category));
}
