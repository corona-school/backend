import { configure, getLogger as getLog4jsLogger, addLayout, Layout } from 'log4js';

addLayout('json', function () {
    return function (logEvent) {
        const message = logEvent.data.shift();
        return JSON.stringify({ ...logEvent, message });
    };
});

let stdoutLayout: Layout = { type: 'coloured' };
if (process.env.LOG_FORMAT === 'json') {
    stdoutLayout = { type: 'json' };
}

export function setup() {
    try {
        configure({
            appenders: {
                file: {
                    type: 'dateFile',
                    filename: 'logs/jobs.log',
                    keepFileExt: true,
                },
                'file-filtered': {
                    type: 'logLevelFilter',
                    appender: 'file',
                    level: 'info',
                },
                stdout: {
                    type: 'stdout',
                    layout: stdoutLayout,
                },
                'stdout-filtered': {
                    type: 'logLevelFilter',
                    appender: 'stdout',
                    level: 'info',
                },
                'stderr-filtered': {
                    type: 'logLevelFilter',
                    appender: 'stdout',
                    level: 'all',
                    maxLevel: 'debug',
                },
            },
            categories: {
                default: {
                    appenders: ['stderr-filtered', 'stdout-filtered', 'file-filtered'],
                    level: 'all',
                },
            },
        });
    } catch (e) {
        console.warn("Couldn't setup logger", e);
    }
}

export function getLogger(category?: string) {
    return getLog4jsLogger(category);
}
