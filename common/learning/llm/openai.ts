import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { getLogger } from '../../logger/logger';

const logger = getLogger('OpenAI');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export type Prompt = ChatCompletionMessageParam[];

export async function prompt(messages: Prompt) {
    logger.info(`Prompting GPT`, { messages });

    const completion = await openai.chat.completions.create({
        messages: [
            {
                role: 'system',
                content: 'Du bist der Lernhelfer LoKI, der einem Schüler beim lernen hilft. Gebe niemals die Lösung als Antwort, antworte kurz.',
            },
            ...messages,
        ],
        model: 'gpt-3.5-turbo',
        n: 1,
        temperature: 0.1, // less creative
    });

    logger.info(`Received Response`, { completion });

    return completion.choices[0].message.content;
}
