import tracer from './tracing';
import formats from 'dd-trace/ext/formats';
import { configure, addLayout, getLogger as getlog4jsLogger, Logger as Log4jsLogger } from 'log4js';
import { getCurrentTransaction } from '../session';
import { getServiceName, getHostname, getLogLevel, getLogFormat } from '../../utils/environment';

addLayout('json', function () {
    return function (logEvent) {
        const message = logEvent.data.shift();
        const data = logEvent.data.shift();

        // Move the error element from context to the root of the log line
        const error = logEvent.context['error'] || {};
        delete logEvent.context['error'];

        const logLine = { ...logEvent, message, data, error, service: getServiceName(), host: getHostname() };

        const span = tracer.scope().active();
        if (span) {
            tracer.inject(span.context(), formats.LOG, logLine);
        }

        return JSON.stringify(logLine);
    };
});

const logFormat = getLogFormat();
let appenders = ['out'];
if (logFormat === 'json') {
    appenders = ['outJson'];
} else if (logFormat === 'brief') {
    appenders = ['outBrief'];
} else if (logFormat === 'verbose') {
    appenders = ['outBrief', 'fileVerbose'];
}

configure({
    appenders: {
        // By default Log Session IDs and all content
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
        // Brief Logging for Integration Tests, only log the message
        outBriefWriter: {
            type: 'stdout',
            layout: {
                type: 'pattern',
                pattern: '%[%m{0, 1}%]',
            },
        },
        outBrief: {
            type: 'logLevelFilter',
            appender: 'outBriefWriter',
            level: 'mark',
            maxLevel: 'mark',
        },
        // Verbose Logging to debug Integration Tests, also log further details
        fileVerbose: {
            type: 'file',
            filename: 'integration-tests.log',
            flags: 'w', // drop previous log
            layout: {
                type: 'pattern',
                pattern: '%c - %m',
            },
        },
        // Log JSON for Datadog
        outJson: { type: 'stdout', layout: { type: 'json' } },
    },
    categories: {
        default: {
            appenders,
            level: getLogLevel('info'),
        },
    },

    levels: {
        FAILURE: {
            value: 9007199254740992, // same as MARK
            colour: 'red',
        },

        SUCCESS: {
            value: 9007199254740992, // same as MARK
            colour: 'green',
        },

        HEADLINE: {
            value: 9007199254740992, // same as MARK
            colour: 'blue',
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

    // ----- Debugging, will not be logged in Production -----

    trace(message: string, args: LogData = {}): void {
        this.enrich();
        this.logger.trace(message, args);
    }

    debug(message: string, args: LogData = {}): void {
        this.enrich();
        this.logger.debug(message, args);
    }

    // ----- Regular Logging, will be logged in Production ---

    info(message: string, args: LogData = {}): void {
        this.enrich();
        this.logger.info(message, args);
    }

    warn(message: string, args: LogData = {}): void {
        this.enrich();
        this.logger.warn(message, args);
    }

    // Error Logs should be used for unexpected errors, as they trigger alerts
    error(message: string, err?: Error | null, args: LogData = {}): void {
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

    // ----- "Higher Level Logging" i.e. in Tests ---
    mark(message: string, args: LogData = {}): void {
        this.enrich();
        this.logger.mark(message, args);
    }

    success(message: string, args: LogData = {}) {
        this.enrich();
        this.logger.log('SUCCESS', message, args);
    }

    failure(message: string, args: LogData = {}) {
        this.enrich();
        this.logger.log('FAILURE', message, args);
    }

    headline(message: string) {
        this.enrich();
        this.logger.log('HEADLINE', `-------------------- ${message} ------------------------`);
    }

    addContext(key: string, value: any) {
        this.logger.addContext(key, value);
    }
}

export function getLogger(category?: string): Logger {
    return new Logger(getlog4jsLogger(category));
}
