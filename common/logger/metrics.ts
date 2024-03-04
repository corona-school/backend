import * as promClient from 'prom-client';
import { Request, Response, Router } from 'express';
import { getServiceName } from '../../utils/environment';

const registry = new promClient.Registry();
registry.setDefaultLabels({ service: getServiceName() });

export const metricsRouter = Router();
metricsRouter.get('/', handleMetrics);

export async function handleMetrics(_req: Request, res: Response) {
    res.status(200)
        .header('Content-Type:text')
        .send(await registry.metrics());
}

export const metrics = {
    GraphqlRequests: new promClient.Counter({
        name: 'graphql_requests',
        help: 'Amount of graphql requests',
        registers: [registry],
        labelNames: ['operation', 'hasErrors'],
    }),
    JobCountExecuted: new promClient.Counter({
        name: 'jobs_executed',
        help: 'Amount of jobs executed',
        registers: [registry],
        labelNames: ['hasError', 'name'],
    }),
    FileStorageSize: new promClient.Gauge({
        name: 'file_storage_size',
        help: 'Amount of files in storage cache',
        registers: [registry],
        labelNames: ['type'],
    }),
    FileStorageMaxSize: new promClient.Gauge({
        name: 'file_storage_max_size',
        help: 'Max amount of files in storage cache',
        registers: [registry],
    }),

    AchievementsTrackedEvents: new promClient.Counter({
        name: 'achievements_tracked_events',
        help: 'Amount of tracked events within achievement system',
        registers: [registry],
        labelNames: ['metric', 'action'],
    }),
    AchievementsCreated: new promClient.Counter({
        name: 'achievements_created',
        help: 'Amount of created achievements',
        registers: [registry],
        labelNames: ['id', 'uid', 'type'],
    }),
    AchievementsAchieved: new promClient.Counter({
        name: 'achievements_achieved',
        help: 'Amount of achieved achievements',
        registers: [registry],
        labelNames: ['id', 'uid', 'type'],
    }),
};
