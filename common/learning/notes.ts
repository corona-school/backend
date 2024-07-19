import { getLogger } from '../logger/logger';
import { prisma } from '../prisma';
import { User } from '../user';
import { PrerequisiteError } from '../util/error';
import { Prompt, prompt } from './llm/openai';
import { LearningNote, LearningNoteType, LoKI, getAssignment } from './util';
import { finishAssignment } from './assignment';

const logger = getLogger(`LearningNotes`);

export const repliesTo = ({ assignmentId, topicId, id }: LearningNote) => ({ assignmentId, topicId, replyToId: id });

export type LearningNoteCreate = Pick<LearningNote, 'text' | 'type'> & Partial<Pick<LearningNote, 'assignmentId' | 'topicId' | 'replyToId'>>;

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

    const byPupil = user !== LoKI && !!user.pupilId;
    if (note.type === 'answer' && byPupil) {
        await validateAnswer(note);
    }

    return note;
}

export async function setNoteType(user: User | LoKI, note: LearningNote, type: LearningNoteType) {
    await prisma.learning_note.update({
        where: { id: note.id },
        data: { type },
    });

    logger.info(`User(${user === LoKI ? 'LoKI' : user.userID}) changed LearningNote(${note.id}) type to ${LearningNoteType[type]}`);

    if (type === LearningNoteType.correct_answer) {
        if (note.assignmentId) {
            const assignment = await getAssignment(note.assignmentId);
            await finishAssignment(user, assignment);
        }
    }
}

async function contextualizeNote(note: LearningNote) {
    const prompts: Prompt = [];
    if (note.topicId) {
        const topic = await prisma.learning_topic.findUniqueOrThrow({ where: { id: note.assignmentId } });
        prompts.push({
            role: 'system',
            content: `Das Thema ist ${topic.name} im Fach ${topic.subject}`,
        });
    }

    if (note.assignmentId) {
        const assignment = await prisma.learning_assignment.findUniqueOrThrow({ where: { id: note.assignmentId } });
        prompts.push({
            role: 'system',
            content: `Die Aufgabe lautet: ${assignment.task}`,
        });
    }

    // TODO: Consider previous interactions?

    return prompts;
}

async function validateAnswer(answer: LearningNote) {
    const prompts = await contextualizeNote(answer);

    prompts.push({
        role: 'system',
        content:
            "Ist die folgende Antwort korrekt? Antworte mit 'Richtig' oder 'Falsch' und gebe einen Hinweis zur Verbesserung der Antwort. Antworte nur wenn du dir sicher bist",
    });
    prompts.push({ role: 'user', content: answer.text });

    const promptResult = await prompt(prompts);

    const isRight = promptResult.includes('Richtig');
    const isWrong = promptResult.includes('Falsch');

    if (isRight && !isWrong) {
        logger.info(`LLM marked answer as correct`, { answer, promptResult });

        await setNoteType(LoKI, answer, 'correct_answer');
        await createNote(LoKI, {
            ...repliesTo(answer),
            type: 'comment',
            text: promptResult,
        });
    } else if (!isRight && isWrong) {
        logger.info(`LLM marked answer as wrong`, { answer, promptResult });

        await setNoteType(LoKI, answer, 'wrong_answer');
        await createNote(LoKI, {
            ...repliesTo(answer),
            type: 'comment',
            text: promptResult,
        });
    } else {
        logger.warn(`LLM could not decide whether the answer is correct `, { answer, promptResult });
    }
}

async function answerQuestion(question: LearningNote) {
    const prompts = await contextualizeNote(question);

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
