export const isDev = process.env.ENV === 'dev';
export const isTest = process.env.ENV === 'test';

// Domain of the User App, where we link users to in emails etc.
export const USER_APP_DOMAIN = process.env.USER_APP_DOMAIN ?? 'lernfair-user-app-dev.herokuapp.com';
