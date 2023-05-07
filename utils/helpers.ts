import { compile } from 'handlebars';
import { Context } from '../common/notification/types';
import { getLogger } from '../common/logger/logger';

export const renderTemplate = (template: string, context: Partial<Context>, strict: boolean = false) => {
    console.log('TEMPLATE', template);
    if (!template) {
        return undefined;
    }
    return compile(template, { strict })(context);
};
