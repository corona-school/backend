import { configure, getLogger as getLog4jsLogger, addLayout } from 'log4js';

addLayout('json', function () {
    return function (logEvent) {
        const message = logEvent.data.shift();
        return JSON.stringify({ ...logEvent, message });
    };
});

let appenders = ['out'];
if (process.env.LOG_FORMAT === 'json') {
    appenders = ['outJson'];
}

export function setup() {
    configure({
        appenders: {
            out: { type: 'stdout', layout: { type: 'coloured' } },
            outJson: { type: 'stdout', layout: { type: 'json' } },
        },
        categories: {
            default: {
                appenders,
                level: 'all',
            },
        },
    });
}

export function getLogger(category?: string) {
    return getLog4jsLogger(category);
}
