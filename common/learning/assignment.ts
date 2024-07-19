import { getLogger } from '../logger/logger';
import { prisma } from '../prisma';
import { User } from '../user';
import { LearningAssignment, LoKI } from './util';

const logger = getLogger('LearningAssignment');

export async function finishAssignment(user: User | LoKI, assignment: LearningAssignment) {
    await prisma.learning_assignment.update({
        where: { id: assignment.id },
        data: { status: 'done' },
    });

    logger.info(`User(${user === LoKI ? 'LoKI' : user.userID}) finished LearningAssignment(${assignment.id})`);
}
