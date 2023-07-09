import { getLogger } from 'log4js';
import { SlackBlock } from './blocks';

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
        logger.warn('Cannot send message to ' + channel.name + ' as webhook is missing');
        return;
    }

    const request = await fetch(channel.webhookURL, { method: 'POST', body: JSON.stringify(message), headers: { 'content-type': 'application/json' } });
    if (request.ok) {
        logger.info('Sent Slack Message to ' + channel.name, { message });
    } else {
        // Unlike other places we do not fail here with an error, as the Slack integration is usually optional
        logger.error('Failed to send Slack message', { status: request.status, text: await request.text() }, JSON.stringify(message, null, 2));
    }
}
