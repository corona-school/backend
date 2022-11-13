export const isDev = process.env.ENV === 'dev';

// Domain of the User App, where we link users to in emails etc.
export const USER_APP_DOMAIN = process.env.USER_APP_DOMAIN ?? 'user-app-dev.herokuapp.com';
