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

export const metrics = {
    GraphqlRequests: new promClient.Counter({
        name: 'graphql_requests',
        help: 'Amount of graphql requests',
        registers: [regirstry],
        labelNames: ['operation', 'hasErrors'],
    }),
    JobCountExecuted: new promClient.Counter({
        name: 'jobs_executed',
        help: 'Amount of jobs executed',
        registers: [regirstry],
        labelNames: ['hasError', 'name'],
    }),
    FileStorageSize: new promClient.Gauge({
        name: 'file_storage_size',
        help: 'Amount of files in storage cache',
        registers: [regirstry],
        labelNames: ['type'],
    }),
    FileStorageMaxSize: new promClient.Gauge({
        name: 'file_storage_max_size',
        help: 'Max amount of files in storage cache',
        registers: [regirstry],
    }),
};
