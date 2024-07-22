import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { getLogger } from '../../logger/logger';

const logger = getLogger('OpenAI');

export type Prompts = ChatCompletionMessageParam[];

// Prompts GPT for an answer - for consecutive calls,
// include the previous conversation in the prompts to give the LLM context of the conversation
//
// If randomize is set, each response will be random - otherwise the response is deterministic for the prompt
export async function prompt(prompts: Prompts, randomize = false) {
    logger.info(`Prompting GPT`, { prompts });

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
            ...prompts,
        ],
        model: 'gpt-3.5-turbo', // cheapest model, might be worth experimenting with newer models one day
        n: 1, // expect one answer
        temperature: 0.1, // less creative
        seed: randomize ? Math.floor(Math.random() * 1000000) : undefined,
    });

    logger.info(`Received Response`, { completion });

    return completion.choices[0].message.content;
}
