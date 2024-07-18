import { Learning_note as LearningNote } from '../../graphql/generated';
import { getLogger } from '../logger/logger';
import { prisma } from '../prisma';
import { User } from '../user';
import { PrerequisiteError } from '../util/error';
import { Prompt, prompt } from './llm/openai';

const logger = getLogger(`LearningNotes`);

// Special User to represent LLM output
export const LoKI = Symbol();
type LoKI = typeof LoKI;

export const repliesTo = ({ assignmentId, topicId, id }: LearningNote) => ({ assignmentId, topicId, replyToId: id });

export type LearningNoteCreate = Pick<LearningNote, 'assignmentId' | 'topicId' | 'replyToId' | 'text' | 'type'>;

export async function createNote(user: User | LoKI, data: LearningNoteCreate) {
    if (!data.topicId && !data.assignmentId) {
        throw new PrerequisiteError(`Note must be related to topic or assignment`);
    }

    const note = await prisma.learning_note.create({
        data: {
            ...data,
            authorName: user === LoKI ? 'LoKI' : user.firstname,
            authorID: user === LoKI ? null : user.userID,
        },
    });

    logger.info(`User(${user === LoKI ? 'LoKI' : user.userID}) created LearningNote(${note.id})`);

    if (note.type === 'question') {
        // fire and forget - trigger async response by LLM
        answerQuestion(note);
    }

    return note;
}

async function answerQuestion(question: LearningNote) {
    const prompts: Prompt = [];

    if (question.topicId) {
        const topic = await prisma.learning_topic.findUniqueOrThrow({ where: { id: question.assignmentId } });
        prompts.push({
            role: 'system',
            content: `Das Thema ist ${topic.name} im Fach ${topic.subject}`,
        });
    }

    if (question.assignmentId) {
        const assignment = await prisma.learning_assignment.findUniqueOrThrow({ where: { id: question.assignmentId } });
        prompts.push({
            role: 'system',
            content: `Die Aufgabe lautet: ${assignment}`,
        });
    }

    prompts.push({
        role: 'user',
        content: question.text,
    });

    logger.info(`Trying to answer question LearningNote(${question.id}) `, { prompts });

    const promptResult = await prompt(prompts);

    await createNote(LoKI, {
        ...repliesTo(question),
        type: 'comment',
        text: promptResult,
    });
}
