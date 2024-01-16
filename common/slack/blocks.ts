import { bold } from './format';

export interface SlackBlock {
    type: 'section';
    text?: { type: 'mrkdwn'; text: string };
    fields?: { type: 'mrkdwn'; text: string }[];
}

// Unfortunately Slack only supports tables with two columns, and with a maximum of 10 rows
export function table(name: string, colA: string, colB: string, entries: [string, string][]): SlackBlock[] {
    const result: SlackBlock[] = [];

    for (let i = 0; i < entries.length; i += 4) {
        const chunk = entries.slice(i, i + 4);
        result.push({
            type: 'section',
            text: { type: 'mrkdwn', text: i === 0 ? name : ' ' },
            fields: [
                ...(i === 0
                    ? ([
                          {
                              type: 'mrkdwn',
                              text: bold(colA),
                          },
                          {
                              type: 'mrkdwn',
                              text: bold(colB),
                          },
                      ] as const)
                    : []),
                ...chunk.flatMap(
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
        });
    }

    return result;
}
