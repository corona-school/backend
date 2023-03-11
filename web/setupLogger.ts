import { isCommandArg } from '../common/util/basic';
import { configure } from 'log4js';

configure({
    appenders: {
        out: { type: 'stdout', layout: { type: 'coloured' } },
    },
    categories: {
        default: {
            appenders: ['out'],
            level: isCommandArg('--debug') ? 'debug' : 'info',
        },
    },
});
