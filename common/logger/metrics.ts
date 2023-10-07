import { StatsD } from 'hot-shots';
import { getDDEnvironment, getServiceName, getVersion } from '../../utils/environment';

export const stats = new StatsD({
    prefix: 'lern_fair.',
    globalTags: {
        env: getDDEnvironment(),
        service: getServiceName(),
        version: getVersion(),
    },
});

export const metrics = {
    GRAPHQL_REQUESTS: 'graphql.requests',
    JOB_COUNT_EXECUTED: 'jobs.executed',
    FILE_STORAGE_SIZE: 'file.storage.size',
    FILE_STORAGE_MAX_SIZE: 'file.storage.max_size',
};
