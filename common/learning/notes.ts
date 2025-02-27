import { getLogger } from '../logger/logger';
import { prisma } from '../prisma';
import { User, getUser } from '../user';
import { PrerequisiteError } from '../util/error';
import { Prompts, prompt } from './llm/openai';
import { LearningAssignment, LearningNote, LearningNoteType, LoKI, getAssignment } from './util';
import { finishAssignment } from './assignment';

const logger = getLogger(`LearningNotes`);

// Constructs a note that is a reply to another note
export const repliesTo = ({ assignmentId, topicId, id }: LearningNote) => ({ assignmentId, topicId, replyToId: id });

export type LearningNoteCreate = Pick<LearningNote, 'text' | 'type'> & Partial<Pick<LearningNote, 'assignmentId' | 'topicId' | 'replyToId'>>;

// Creates a new note on a topic or assignment, and then trigers an asynchronous reaction by the LLM
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

    // Fire and forget - async reaction by LLM
    reactOnNote(note).catch((error) => logger.error(`Failed to react on Note`, error));

    return note;
}

// Changes the type of the note and retriggers a reaction on the note based on the switched type
export async function setNoteType(user: User | LoKI, note: LearningNote, type: LearningNoteType) {
    if (type === note.type) {
        return;
    }

    const updated = await prisma.learning_note.update({
        where: { id: note.id },
        data: { type },
    });

    logger.info(`User(${user === LoKI ? 'LoKI' : user.userID}) changed LearningNote(${note.id}) type to ${LearningNoteType[type]}`);

    await reactOnNote(updated);
}

// Triggers an automatic reaction by the LLM on a note,
// which either means reclassifying the note to another type,
// or replying to the note.
//
// ATTENTION: This is recursively called on the note created / reclassified note,
//  so be careful to not create infinite feedback cycles
async function reactOnNote(note: LearningNote) {
    const user = note.authorID ? await getUser(note.authorID) : LoKI;
    const byPupil = user !== LoKI && !!user.pupilId;

    if (note.type === 'question') {
        await answerQuestion(note);
    } else if (note.type === 'comment' && byPupil) {
        await classifyNote(note);
    } else if (note.type === 'answer' && byPupil) {
        await validateAnswer(note);
    } else if (note.type === 'correct_answer') {
        if (note.assignmentId) {
            const assignment = await getAssignment(note.assignmentId);
            await finishAssignment(user, assignment);
        }
    }
}

// Adds texts from previous notes and the assignment to the prompt,
//  so that the LLM can answer in context
async function contextualizeNote(note: LearningNote) {
    const prompts: Prompts = [];
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

    // Add previous conversation as context
    const previousNotes = await prisma.learning_note.findMany({
        where: {
            assignmentId: note.assignmentId,
            topicId: note.topicId,
        },
        orderBy: {
            createdAt: 'desc',
        },
        take: 30, // limit context to some reasonable amount
    });

    for (const note of previousNotes.reverse()) {
        prompts.push({
            role: note.authorID ? 'user' : 'assistant',
            content: note.text,
        });
    }

    return prompts;
}

// Use the LLM to detect and reclassify a note if possible
async function classifyNote(note: LearningNote) {
    const prompts: Prompts = [];

    prompts.push({
        role: 'system',
        content: `Ist der Text '${note.text}' eine Frage oder eine Antwort. Antworte nur mit dem Wort 'Frage' oder 'Antwort' wenn du dir sicher bist. Ansonsten antworte nichts.`,
    });

    const promptResult = await prompt(prompts);

    if (promptResult.includes('Frage')) {
        await setNoteType(LoKI, note, 'question');
    } else if (promptResult.includes('Antwort')) {
        await setNoteType(LoKI, note, 'answer');
    } else {
        logger.warn(`LLM failed to classify note`, { note, promptResult });
    }
}

// Initialize a conversation from the LLM if an assignment is created
export async function startConversation(assignment: LearningAssignment) {
    const prompts: Prompts = [];

    prompts.push({
        role: 'system',
        content: `
        Erstelle eine freundliche Einführungsnachricht auf Deutsch, um eine neue Konversation zu der Aufgabe '${assignment.task}' mit einem Schüler zu beginnen.
        Die Nachricht soll den Nutzer deutlich machen, dass er keine Angst hat Fehler zu machen. Sie sollte nicht zu überschwenglich, sondern relativ sachlich bleiben.
        `,
    });

    const promptResult = await prompt(prompts);

    await createNote(LoKI, {
        type: 'comment',
        assignmentId: assignment.id,
        text: promptResult,
    });
}

// Validate an answer given by the pupil, and hint towards the right solution
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

// Try to answer a question by the pupil by the LLM
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
