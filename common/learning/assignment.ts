import { getLogger } from '../logger/logger';
import { prisma } from '../prisma';
import { User } from '../user';
import { Prompt, prompt } from './llm/openai';
import { LearningAssignment, LearningTopic, LoKI, getTopic } from './util';

const logger = getLogger('LearningAssignment');

export async function finishAssignment(user: User | LoKI, assignment: LearningAssignment) {
    await prisma.learning_assignment.update({
        where: { id: assignment.id },
        data: { status: 'done' },
    });

    logger.info(`User(${user === LoKI ? 'LoKI' : user.userID}) finished LearningAssignment(${assignment.id})`);
}

export async function proposeAssignment(topic: LearningTopic): Promise<string> {
    const pupil = await prisma.pupil.findUniqueOrThrow({ where: { id: topic.pupilId } });

    const prompts: Prompt = [];

    prompts.push({
        role: 'system',
        content: `Generiere eine Aufgabe für das Fach ${topic.subject} für einen Schüler der ${pupil.grade} zu dem Thema ${topic.name}.`,
    });

    const promptResult = await prompt(prompts);
    logger.info(`LLM generated an assignment`, { topic, promptResult });

    return promptResult;
}
