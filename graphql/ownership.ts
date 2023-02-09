import { GraphQLUser } from './authentication';
import type * as models from './generated/models';
import { prisma } from '../common/prisma';
import { getUserType, User } from '../common/user';
import { AttendanceStatus } from '../common/entity/AppointmentAttendee';
import { isParticipant } from '../common/courses/participants';

/* ResolverModelNames is a union type of all Model classes, ResolverModel can then be used to refer to a class named as such */
export type ResolverModelNames = keyof typeof models;
export type ResolverModel<Name extends ResolverModelNames> = typeof models[Name]['prototype'];

/* If a user owns an entity, he has the Role.OWNER on that entity */
export const isOwnedBy: { [Name in ResolverModelNames]?: (user: GraphQLUser, entity: ResolverModel<Name>) => boolean | Promise<boolean> } & {
    [name: string]: (user: GraphQLUser, entity: any) => boolean | Promise<boolean>;
} = {
    Pupil: (user, pupil) => user.pupilId === pupil.id,
    Student: (user, student) => user.studentId === student.id,
    UserType: (sessionUser, user: User) =>
        sessionUser.studentId === user.studentId && sessionUser.pupilId === user.pupilId && sessionUser.screenerId === user.screenerId,
    Course: async (user, course) => {
        if (!user.studentId) {
            return false;
        }
        const instructor = await prisma.course_instructors_student.findFirst({ where: { courseId: course.id, studentId: user.studentId } });
        return !!instructor;
    },
    Subcourse: async (user, subcourse) => {
        if (!user.studentId) {
            return false;
        }
        const instructor = await prisma.subcourse_instructors_student.findFirst({ where: { subcourseId: subcourse.id, studentId: user.studentId } });
        return !!instructor;
    },
    Lecture: async (user, lecture) => {
        const where = { appointmentId: lecture.id, status: AttendanceStatus.ACCEPTED };

        /* following implementation checks participation and not ownership as a workaround */
        // @TODO fix authorisation introducing a new role for participants
        switch (getUserType(user)) {
            case 'student':
                return (
                    !!(await prisma.appointment_organizer.findFirst({ where: { ...where, studentId: user.studentId } })) ||
                    !!(await prisma.appointment_participant_student.findFirst({ where: { ...where, studentId: user.studentId } }))
                );
            case 'pupil':
                return (
                    (await isParticipant({ id: lecture.subcourseId }, { id: user.pupilId })) ||
                    !!(await prisma.appointment_participant_pupil.findFirst({ where: { ...where, pupilId: user.pupilId } }))
                );
            case 'screener':
                return !!(await prisma.appointment_participant_screener.findFirst({ where: { ...where, screenerId: user.screenerId } }));
        }

        /* following is the correct ownership logic implementation

        if (getUserType(user) === 'student') {
            return !!(await prisma.appointment_organizer.findFirst({ where: { ...where, studentId: user.studentId } }));
        }
        */

        return false;
    },
    Match: (user, match) => user.pupilId === match.pupilId || user.studentId === match.studentId,
    Concrete_notification: (user, concreteNotification) => concreteNotification.userId === user.userID,
    Participation_certificate: (user, certificate) => user.pupilId === certificate.pupilId || user.studentId === certificate.studentId,
};
