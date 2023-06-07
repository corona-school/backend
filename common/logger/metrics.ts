import { StatsD } from 'hot-shots';
export const stats = new StatsD({
    prefix: 'lern_fair.',
    globalTags: {
        env: process.env.ENV,
        service: process.env.SERVICE_NAME,
        version: process.env.HEROKU_RELEASE_VERSION || 'latest',
    },
});

export const metrics = {
    GRAPHQL_REQUESTS: 'graphql.requests',
};
