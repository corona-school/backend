import { prisma } from '../common/prisma';
import { getLogger } from '../common/logger/logger';
import { lecture_appointmenttype_enum } from '../graphql/generated';
import { createZoomUser, getZoomUser } from '../common/zoom/zoom-user';
import { createZoomMeeting } from '../common/zoom/zoom-scheduled-meeting';

const logger = getLogger();

export default async function execute() {
    const lectures = await prisma.lecture.findMany({
        where: { appointmentType: 'legacy' },
        select: { id: true, subcourseId: true, matchId: true, subcourse: true },
    });

    const updatedLectures = await Promise.all(
        lectures.map(async (lecture) => {
            if (Boolean(lecture.subcourseId)) {
                const participants = (
                    await prisma.subcourse_participants_pupil.findMany({ where: { subcourseId: lecture.subcourseId }, select: { pupilId: true } })
                ).map((participant) => `pupil/${participant.pupilId}`);
                const instructors = await prisma.subcourse_instructors_student.findMany({
                    where: { subcourseId: lecture.subcourseId },
                    select: { studentId: true, student: true },
                });
                const organizers = instructors.map((instructor) => `student/${instructor.studentId}`);
                return {
                    id: lecture.id,
                    appointmentType: lecture_appointmenttype_enum.group,
                    organizerIds: organizers,
                    participantIds: participants,
                };
            }
        })
    );

    // transaction to update all lectures
    await prisma.$transaction(
        updatedLectures.map((lecture) => {
            // eslint-disable-next-line lernfair-lint/prisma-laziness
            return prisma.lecture.update({
                where: {
                    id: lecture.id,
                },
                data: {
                    appointmentType: lecture.appointmentType,
                    organizerIds: lecture.organizerIds,
                    participantIds: lecture.participantIds,
                },
            });
        })
    );

    logger.info(`Migrated lectures fields to meet appointment requirements.`);

    const lecturesInTheFutureWithNoMeetingId = await prisma.lecture.findMany({
        where: {
            start: {
                gte: new Date(),
            },
            zoomMeetingId: null,
        },
        select: {
            id: true,
            subcourseId: true,
            matchId: true,
            subcourse: true,
            organizerIds: true,
            start: true,
            duration: true,
        },
    });

    await Promise.all(
        lecturesInTheFutureWithNoMeetingId.map(async (lecture) => {
            // check if all organizers of that lecture have a zoom account
            const studentIds = lecture.organizerIds.map((organizer) => parseInt(organizer.split('/')[1], 10));
            const organizers = await prisma.student.findMany({ where: { id: { in: studentIds } } });
            const zoomUsers = [];
            for (let organizer of organizers) {
                if (!organizer.zoomUserId) {
                    const zoomUser = await createZoomUser(organizer);
                    zoomUsers.push(zoomUser);
                } else {
                    const zoomUser = await getZoomUser(organizer.email);
                    zoomUsers.push(zoomUser);
                }
            }
            const videoMeeting = await createZoomMeeting(zoomUsers, lecture.start, lecture.duration, Boolean(lecture.subcourseId));
            await prisma.lecture.update({ where: { id: lecture.id }, data: { zoomMeetingId: videoMeeting.id.toString() } });
        })
    );

    logger.info(`Created Zoom meetings for lectures in the future and added Zoom licenses for the Students needing one.`);
}
