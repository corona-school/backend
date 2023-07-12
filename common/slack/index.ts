import { SlackBlock } from './blocks';
import { getLogger } from '../logger/logger';

export interface SlackChannel {
    name: string;
    webhookURL: string;
}

export type SlackMessage = { text: string } | { blocks: SlackBlock[] };

export const SLACK_CHANNEL = {
    TechAlerts: <SlackChannel>{
        name: 'tech-alerts',
        webhookURL: process.env.SLACK_TECH_ALERTS,
    },
    PublicStatistics: <SlackChannel>{
        name: 'publ-statistics',
        webhookURL: process.env.SLACK_PUBL_STATISTICS,
    },
};

const logger = getLogger('Slack');

export async function sendToSlack(channel: SlackChannel, message: SlackMessage) {
    if (!channel.webhookURL) {
        logger.warn('Cannot send message to Slack as webhook is missing', { channel: channel.name });
        return;
    }

    const request = await fetch(channel.webhookURL, { method: 'POST', body: JSON.stringify(message), headers: { 'content-type': 'application/json' } });
    if (request.ok) {
        logger.info('Sent Slack Message', { message, channel: channel.name });
    } else {
        // Unlike other places we do not fail here with an error, as the Slack integration is usually optional
        logger.error('Failed to send Slack message', { status: request.status, text: await request.text(), message: JSON.stringify(message, null, 2) });
    }
}
