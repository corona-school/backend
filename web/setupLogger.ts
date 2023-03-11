import { isCommandArg } from '../common/util/basic';
import { configure } from 'log4js';

try {
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
} catch (e) {
    // TODO: should this be a breaking condition? Loosing all the logs, might be a big problem.
    console.warn("Couldn't setup logger", e);
}
