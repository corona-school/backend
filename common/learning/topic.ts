import { match as Match, course_subject_enum as CourseSubject } from '@prisma/client';
import { PrerequisiteError } from '../util/error';
import { prisma } from '../prisma';
import { User } from '../user';
import { getLogger } from '../logger/logger';

const logger = getLogger('LearningTopic');

// Creates a new topic as a collection of notes and assignments
export async function createTopic(user: User, match: Match, name: string, subject: CourseSubject) {
    if (match.dissolved) {
        throw new PrerequisiteError(`Match was already dissolved`);
    }

    const result = await prisma.learning_topic.create({
        data: {
            name,
            subject,
            matchId: match.id,
            pupilId: match.pupilId,
        },
    });

    logger.info(`User(${user.userID}) created LearningTopic(${result.id}) for Pupil(${match.pupilId})`);

    return result;
}
