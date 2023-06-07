import tracer from './tracing';
import formats from 'dd-trace/ext/formats';
import { isCommandArg } from '../util/basic';
import { configure, addLayout, getLogger as getlog4jsLogger, Logger as Log4jsLogger } from 'log4js';
import { getCurrentTransaction } from '../session';

addLayout('json', function () {
    return function (logEvent) {
        const message = logEvent.data.shift();
        const data = logEvent.data.shift();

        // Move the error element from context to the root of the log line
        const error = logEvent.context['error'] || {};
        delete logEvent.context['error'];

        // These tags will be used to identify the logs in datadog later on
        const tags = { env: process.env.ENV, version: process.env.HEROKU_RELEASE_VERSION || 'latest' };
        const logLine = { ...logEvent, message, data, error, tags, service: process.env.SERVICE_NAME };

        // trigger new deployment
        const span = tracer.scope().active();
        if (span) {
            tracer.inject(span.context(), formats.LOG, logLine);
        }

        return JSON.stringify(logLine);
    };
});

let appenders = ['out'];
if (process.env.LOG_FORMAT === 'json') {
    appenders = ['outJson'];
}

configure({
    appenders: {
        out: {
            type: 'stdout',
            layout: {
                type: 'pattern',
                pattern: '%[%x{transaction}%c%] %m%n',
                tokens: {
                    transaction: (it) => {
                        const { sessionID, transactionID } = it.context;
                        if (transactionID) {
                            return `[${sessionID ?? '?'}/${transactionID}] `;
                        }
                        return '';
                    },
                },
            },
        },
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

    // enriches a log entry with it's context, such as the currently running transaction and session
    enrich() {
        const transaction = getCurrentTransaction();
        if (transaction) {
            if (transaction.session) {
                this.logger.addContext('sessionID', transaction.session.sessionID);
            }
            this.logger.addContext('transactionID', transaction.transactionID);
        }
    }

    trace(message: string, args: LogData = {}): void {
        this.enrich();
        this.logger.trace(message, args);
    }

    debug(message: string, args: LogData = {}): void {
        this.enrich();
        this.logger.debug(message, args);
    }

    info(message: string, args: LogData = {}): void {
        this.enrich();
        this.logger.info(message, args);
    }

    warn(message: string, args: LogData = {}): void {
        this.enrich();
        this.logger.warn(message, args);
    }

    error(message: string): void;
    error(message: string, err: Error): void;
    error(message: string, args: LogData): void;
    error(message: string, err: Error, args: LogData): void;
    error(message: string, err: Error = null, args: LogData = {}): void {
        this.enrich();
        // In order to use the datadog error tracking feature, we have to attach the error details to the root of the log message.
        // Unfortunately, in log4js this is only possible by adding it as context, otherwise, it would end up in .data.
        // https://docs.datadoghq.com/logs/error_tracking/backend/?tab=serilog#nodejs
        if (err) {
            this.logger.addContext('error', { message: err.message, stack: err.stack });
        }
        this.logger.error(message, { ...args });
        this.logger.removeContext('error');
    }

    fatal(message: string, args: LogData = {}): void {
        this.enrich();
        this.logger.fatal(message, args);
    }

    mark(message: string, args: LogData = {}): void {
        this.enrich();
        this.logger.mark(message, args);
    }

    addContext(key: string, value: any) {
        this.logger.addContext(key, value);
    }
}

export function getLogger(category?: string): Logger {
    return new Logger(getlog4jsLogger(category));
}
