import { compile } from 'handlebars';

interface Context {
    [key: string]: string | number;
}

export const renderTemplate = (template: string, context: Context) => compile(template)(context);
