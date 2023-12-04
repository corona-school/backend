import { JobName } from './list';
import tracer from '../common/logger/tracing';
import { getLogger } from '../common/logger/logger';
import { metrics, metricsRouter } from '../common/logger/metrics';
import express from 'express';
import http from 'http';

const logger = getLogger('Job Execution');

async function startMetricsServer() {
    const app = express();
    app.use('/metrics', metricsRouter);

    const port = process.env.PORT || 5100;

    const server = http.createServer(app);

    // Start listening
    await new Promise<void>((res) => server.listen(port, res));
    logger.info(`Server listening on port ${port}`);
}

if (process.env.METRICS_SERVER_ENABLED === 'true') {
    startMetricsServer().catch((e) => logger.error('Failed to setup metrics server', e));
}

export async function runJob(name: JobName) {
    const span = tracer.startSpan(name);
    return await tracer.scope().activate(span, async () => {
        let hasError = false;
        try {
            await runJob(name);
        } catch (e) {
            logger.error(`Can't execute job: ${name} due to error with message:`, e);
            logger.debug(e);
            hasError = true;
        }

        metrics.JobCountExecuted.inc({ hasError: `${hasError}`, name: name });

        this.start();
        span.finish();
    });
}
