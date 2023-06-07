import { tracer } from 'dd-trace';

tracer.init({
    profiling: true,
    plugins: true,
    service: process.env.SERVICE_NAME,
    env: process.env.ENV,
    version: process.env.HEROKU_RELEASE_VERSION || 'latest',
});

tracer.use('graphql', {});
tracer.use('pg', {});

export default tracer;
