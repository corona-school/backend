import { Role } from '../authorizations';
import { Arg, Authorized, Ctx, FieldResolver, Resolver, Root } from 'type-graphql';
import { Lecture as Appointment } from '../generated';
import { GraphQLContext } from '../context';
import { getSessionStudent, getUserForSession, isElevated, isSessionStudent } from '../authentication';
import assert from 'assert';

@Resolver((of) => Appointment)
export class ExtendedFieldsLectureResolver {
    @FieldResolver((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.STUDENT)
    async isInstructor(@Ctx() context: GraphQLContext, @Root() appointment: Appointment, @Arg('studentId', { nullable: true }) studentId: number) {
        const student = await getSessionStudent(context, studentId);
        return appointment.instructorId === student.id;
    }
    @FieldResolver((returns) => Boolean)
    @Authorized(Role.UNAUTHENTICATED)
    async isOrganizer(@Ctx() context: GraphQLContext, @Root() appointment: Appointment, @Arg('studentId', { nullable: true }) studentId: number) {
        if (!isElevated(context) && !isSessionStudent(context)) {
            return false;
        }

        const student = await getSessionStudent(context, studentId);
        const organizerIds = appointment.appointment_organizer.map((organizer) => organizer.studentId);
        return organizerIds.includes(student.id);
    }
    @FieldResolver((returns) => Boolean)
    @Authorized(Role.UNAUTHENTICATED)
    async isParticipant(@Ctx() context: GraphQLContext, @Root() appointment: Appointment) {
        const user = await getUserForSession(context.sessionToken);
        assert(user.pupilId || user.studentId || user.screenerId, 'Cannot determine participation without id.');
        if (user.pupilId) {
            const pupilIds = appointment.appointment_participant_pupil.map((pupil) => pupil.pupilId);
            return pupilIds.includes(user.pupilId);
        }
        if (user.studentId) {
            const studentIds = appointment.appointment_participant_student.map((student) => student.studentId);
            return studentIds.includes(user.studentId);
        }
        if (user.screenerId) {
            const screenerIds = appointment.appointment_participant_screener.map((screener) => screener.screenerId);
            return screenerIds.includes(user.screenerId);
        }
    }
}
