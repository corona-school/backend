import { tracer } from 'dd-trace';

tracer.init({
    service: 'backend',
    profiling: true,
    env: process.env.ENV,
    version: process.env.HEROKU_RELEASE_VERSION || 'latest',
});

export default tracer;