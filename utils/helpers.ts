import { compile } from 'handlebars';
import { Context } from '../common/notification/types';

export const renderTemplate = (template: string, context: Partial<Context>, strict: boolean = false) => compile(template, { strict })(context);

export const randomString = () => (Math.random() + 1).toString(36).substring(7);
