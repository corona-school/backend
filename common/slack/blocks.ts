import { bold } from './format';

export interface SlackBlock {
    type: 'section';
    text?: { type: 'mrkdwn'; text: string };
    fields?: { type: 'mrkdwn'; text: string }[];
}

// Unfortunately Slack only supports tables with two columns:
export function table(name: string, colA: string, colB: string, entries: [string, string][]): SlackBlock {
    return {
        type: 'section',
        text: { type: 'mrkdwn', text: name },
        fields: [
            {
                type: 'mrkdwn',
                text: bold(colA),
            },
            {
                type: 'mrkdwn',
                text: bold(colB),
            },
            ...entries.flatMap(
                (entry) =>
                    [
                        {
                            type: 'mrkdwn',
                            text: entry[0],
                        },
                        {
                            type: 'mrkdwn',
                            text: entry[1],
                        },
                    ] as const
            ),
        ],
    };
}
