import { lecture as Appointment, lecture_feedback as LectureFeedback } from '@prisma/client';
import { getLogger } from '../logger/logger';
import { prisma } from '../prisma';

const logger = getLogger('Lecture Feedback');

export const createLectureFeedback = async (appointment: Appointment) => {
    const participants = appointment.participantIds;
    const organizers = appointment.organizerIds;
    const hasFeedback = await prisma.lecture_feedback.count({
        where: { lectureId: appointment.id },
    });
    if (hasFeedback === 0) {
        await prisma.lecture_feedback.createMany({
            data: participants.concat(organizers).map((userId) => ({
                lectureId: appointment.id,
                userId,
                status: 'pending',
            })),
        });
    } else {
        logger.warn(`Lecture Feedback already exists for Appointment(${appointment.id}), skipping creation.`);
    }
};

export const deleteNonSubmittedLectureFeedback = async (appointment: Appointment) => {
    const deletedCount = await prisma.lecture_feedback.deleteMany({
        where: { lectureId: appointment.id, status: { in: ['pending', 'dismissed'] } },
    });
    logger.info(`Deleted ${deletedCount.count} non-submitted Lecture Feedback for Appointment(${appointment.id}).`);
};
