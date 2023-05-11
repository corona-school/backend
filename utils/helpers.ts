import { compile } from 'handlebars';
import { Context } from '../common/notification/types';
import { getLogger } from '../common/logger/logger';

export const renderTemplate = (template: string, context: Partial<Context>, strict: boolean = false) => {
    const log = getLogger('Template Rendering');
    if (!template) {
        log.error('Template string undefined');
        return undefined;
    }
    return compile(template, { strict })(context);
};
