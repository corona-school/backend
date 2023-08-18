import { tracer } from 'dd-trace';
import { getDDEnvironment, getServiceName, getVersion } from '../../utils/environment';

tracer.init({
    profiling: true,
    plugins: true,
    runtimeMetrics: true,
    appsec: true,
    service: getServiceName(),
    dbmPropagationMode: 'full',
    env: getDDEnvironment(),
    version: getVersion(),
});

tracer.use('graphql', {});
tracer.use('pg', { measured: true, service: 'postgres', enabled: true });

export default tracer;

export function addTagsToActiveSpan(tags: { [key: string]: any }): void {
    const span = tracer.scope().active();
    if (span) {
        span.addTags(tags);
    }
}
