import { getLogger } from '../logger/logger';
import { prisma } from '../prisma';
import { User } from '../user';
import { Prompts, prompt } from './llm/openai';
import { LearningAssignment, LearningTopic, LoKI, getTopic } from './util';

const logger = getLogger('LearningAssignment');

// Creates a new assignment in a certain topic, which a pupil can work on with the help of LoKI
export async function createAssignment(user: User, topic: LearningTopic, task: string) {
    const result = await prisma.learning_assignment.create({
        data: {
            status: 'pending',
            task,
            topicId: topic.id,
        },
    });

    logger.info(`LearningAssignment(${result.id}) created by User(${user.userID})`);
    return result;
}

// Marks an assignment as finished. This is either done manually by a helper, or automatically
// if we detect a correct answer written in the notes
export async function finishAssignment(user: User | LoKI, assignment: LearningAssignment) {
    await prisma.learning_assignment.update({
        where: { id: assignment.id },
        data: { status: 'done' },
    });

    logger.info(`User(${user === LoKI ? 'LoKI' : user.userID}) finished LearningAssignment(${assignment.id})`);
}

// Propose a new assignment task through LLM for a certain topic
export async function proposeAssignment(topic: LearningTopic): Promise<string> {
    const pupil = await prisma.pupil.findUniqueOrThrow({ where: { id: topic.pupilId } });

    const prompts: Prompts = [];

    prompts.push({
        role: 'system',
        content: `Generiere eine Aufgabe für das Fach ${topic.subject} für einen Schüler der ${pupil.grade} zu dem Thema ${topic.name}. Antworte nur mit der Aufgabe an sich. Die Bearbeitung einer Aufgabe sollte für den Schüler ungefähr 10 Minuten dauern.`,
    });

    const promptResult = await prompt(prompts, /* randomize */ true);
    logger.info(`LLM generated an assignment`, { topic, promptResult });

    return promptResult;
}
