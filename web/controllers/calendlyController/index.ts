import { Router } from 'express';
import { getLogger } from '../../../common/logger/logger';
import { CalendlyEvent, onEvent } from '../../../common/calendly';
import crypto from 'crypto';

const logger = getLogger('CalendlyWebhook');

const webhookSigningKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;

export const calendlyRouter = Router();

calendlyRouter.post('/event', async (req, res) => {
    logger.info('Request at /calendly/event');
    try {
        const calendlySignature = req.get('Calendly-Webhook-Signature');
        if (!calendlySignature) {
            logger.error('Invalid Signature');
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }
        // Calendly Signatures documentation https://developer.calendly.com/api-docs/4c305798a61d3-webhook-signatures
        const { t, v1: signature } = Object.fromEntries(calendlySignature.split(',').map((kv) => kv.split('=')));

        if (!t || !signature) {
            logger.error('Invalid Signature');
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }
        const data = t + '.' + JSON.stringify(req.body);
        const expectedSignature = crypto.createHmac('sha256', webhookSigningKey).update(data, 'utf8').digest('hex');
        if (expectedSignature !== signature) {
            logger.error('Invalid Signature');
            res.status(401).send({ error: 'Unauthorized' });
            return;
        }

        const event = req.body as CalendlyEvent;
        await onEvent(event);
        res.status(200).send({ status: 'ok' });
    } catch (error) {
        logger.error(`Failed to handle calendly event: ${error.message}`, error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});
