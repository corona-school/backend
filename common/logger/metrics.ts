import { StatsD } from 'hot-shots';
import { getDDEnvironment, getServiceName, getVersion } from '../../utils/environment';
import * as promClient from 'prom-client';
import { Request, Response, Router } from 'express';

const regirstry = new promClient.Registry();

export const metricsRouter = Router();
metricsRouter.get('/', handleMetrics);

export async function handleMetrics(_req: Request, res: Response) {
    res.status(200)
        .header('Content-Type:text')
        .send(await regirstry.metrics());
}

export const stats = new StatsD({
    prefix: 'lern_fair.',
    globalTags: {
        env: getDDEnvironment(),
        service: getServiceName(),
        version: getVersion(),
    },
});

export const metrics = {
    GRAPHQL_REQUESTS: new promClient.Counter({ name: 'graphql_requests', help: 'isso', registers: [regirstry], labelNames: ['operation', 'hasErrors'] }),
    JOB_COUNT_EXECUTED: new promClient.Counter({ name: 'jobs_executed', help: 'isso', registers: [regirstry], labelNames: ['hasError', 'name'] }),
    FILE_STORAGE_SIZE: new promClient.Gauge({ name: 'file_storage_size', help: 'isso', registers: [regirstry] }),
    FILE_STORAGE_MAX_SIZE: new promClient.Gauge({ name: 'file_storage_max_size', help: 'isso', registers: [regirstry] }),
};
