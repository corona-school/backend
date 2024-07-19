import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { getLogger } from '../../logger/logger';
import { random } from 'lodash';

const logger = getLogger('OpenAI');

export type Prompt = ChatCompletionMessageParam[];

export async function prompt(messages: Prompt, randomize = false) {
    logger.info(`Prompting GPT`, { messages });

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content:
                    'Du bist die Eule LoKI, die einem Schüler beim lernen hilft. Gebe niemals die Lösung als Antwort, gebe eher kurze Antworten. Antworte ab und zu in einem Dialekt wie berlinerisch oder bayrisch und mache ab und an einen Witz.',
            },
            ...messages,
        ],
        model: 'gpt-3.5-turbo',
        n: 1,
        temperature: 0.1, // less creative
        seed: randomize ? Math.random() * 1000000 : undefined,
    });

    logger.info(`Received Response`, { completion });

    return completion.choices[0].message.content;
}
