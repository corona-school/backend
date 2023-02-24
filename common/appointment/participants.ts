import { getUserType, User } from '../user';
import { Lecture } from '../../graphql/generated';
import { prisma } from '../prisma';

export function isAppointmentParticipant(lecture: Lecture, user: User): boolean {
    const userType = getUserType(user);
    switch (userType) {
        case 'pupil': {
            return !!prisma.appointment_participant_pupil.findFirst({
                where: {
                    appointmentId: lecture.id,
                    pupilId: user.pupilId,
                },
            });
        }
        case 'student': {
            return !!prisma.appointment_participant_student.findFirst({
                where: {
                    appointmentId: lecture.id,
                    studentId: user.studentId,
                },
            });
        }
        case 'screener': {
            return !!prisma.appointment_participant_screener.findFirst({
                where: {
                    appointmentId: lecture.id,
                    screenerId: user.screenerId,
                },
            });
        }
        default:
            throw new Error(`Cannot determine participation for user type: ${userType}`);
    }
}
