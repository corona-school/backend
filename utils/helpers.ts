import { compile } from 'handlebars';
import { Context } from '../common/notification/types';

export const renderTemplate = (template: string, context: Context) => compile(template)(context);
