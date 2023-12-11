import { compile } from 'handlebars';
import { Context } from '../common/notification/types';
import { getLogger } from '../common/logger/logger';
import { AchievementContextType } from '../common/achievement/types';

export const renderTemplate = (template: string, context: Partial<Context> | AchievementContextType, strict = false) => {
    const log = getLogger('Template Rendering');
    if (!template) {
        log.error('Template string undefined', new Error('Template string undefined'));
        return undefined;
    }
    return compile(template, { strict, noEscape: true, knownHelpersOnly: true })(context);
};

export function compileTemplate(template: string) {
    return compile(template, { strict: true, noEscape: true, knownHelpersOnly: true });
}
