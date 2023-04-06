import { isCommandArg } from '../common/util/basic';
import { configure, addLayout } from 'log4js';

addLayout('json', function () {
    return function (logEvent) {
        return JSON.stringify(logEvent);
    };
});

let appenders = ['outJson'];
if (process.env.ENV === 'dev') {
    appenders = ['out'];
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
