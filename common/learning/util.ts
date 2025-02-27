import {
    learning_assignment as LearningAssignment,
    learning_note as LearningNote,
    learning_note_type as LearningNoteType,
    learning_topic as LearningTopic,
    learning_assignment_status as LearningAssignmentStatus,
} from '@prisma/client';
import { prisma } from '../prisma';

export { LearningAssignment, LearningAssignmentStatus, LearningNote, LearningNoteType, LearningTopic };

// Special User to represent LLM output
export const LoKI = Symbol();
export type LoKI = typeof LoKI;

export async function getAssignment(id: number) {
    return await prisma.learning_assignment.findUniqueOrThrow({ where: { id } });
}

export async function getNote(id: number) {
    return await prisma.learning_note.findUniqueOrThrow({ where: { id } });
}

export async function getTopic(id: number) {
    return await prisma.learning_topic.findUniqueOrThrow({ where: { id } });
}
