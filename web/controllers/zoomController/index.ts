import { Request, Router } from 'express';
import { getLogger } from '../../../common/logger/logger';
import crypto from 'crypto';
import { WithRawBody } from '../chatNotificationController/types';
import { onEvent } from '../../../common/zoom/webhook';

const logger = getLogger('ZoomWebhook');

const webhookSigningKey = process.env.ZOOM_WEBHOOK_SECRET_TOKEN;

export const zoomRouter = Router();

zoomRouter.post('/event', async (req: WithRawBody<Request>, res) => {
    if (!webhookSigningKey) {
        return;
    }
    logger.info('Request at /zoom/event');
    try {
        const message = `v0:${req.headers['x-zm-request-timestamp']}:${JSON.stringify(req.body)}`;

        const hashForVerify = crypto.createHmac('sha256', webhookSigningKey).update(message).digest('hex');

        const signature = `v0=${hashForVerify}`;

        // Webhook request did not come from Zoom
        if (req.headers['x-zm-signature'] !== signature) {
            logger.warn('Invalid signature for Zoom webhook event');
            return res.status(401).send({ error: 'Unauthorized' });
        }

        // Webhook request event type is a challenge-response check
        if (req.body.event === 'endpoint.url_validation') {
            const hashForValidate = crypto.createHmac('sha256', webhookSigningKey).update(req.body.payload.plainToken).digest('hex');

            res.status(200);
            res.json({
                plainToken: req.body.payload.plainToken,
                encryptedToken: hashForValidate,
            });
            return;
        }
        await onEvent(req.body);
        res.status(200).send({ status: 'ok' });
    } catch (error) {
        logger.error(`Failed to handle zoom event: ${error.message}`, error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
