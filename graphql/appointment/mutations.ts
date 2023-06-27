import { Arg, Ctx, Field, InputType, Mutation, Resolver, Int, Authorized } from 'type-graphql';
import { Lecture as Appointment, Lecture } from '../generated';
import { Role } from '../../common/user/roles';
import {
    AppointmentCreateGroupInput,
    AppointmentCreateMatchInput,
    createGroupAppointments,
    createMatchAppointments,
    isAppointmentOneWeekLater,
    saveZoomMeetingReport,
} from '../../common/appointment/create';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { prisma } from '../../common/prisma';
import { getLecture, getMatch, getStudent, getSubcourse } from '../util';
import { getLogger } from '../../common/logger/logger';
import { deleteZoomMeeting } from '../../common/zoom/scheduled-meeting';
import { declineAppointment } from '../../common/appointment/decline';
import { updateAppointment } from '../../common/appointment/update';
import { cancelAppointment } from '../../common/appointment/cancel';
import { RedundantError } from '../../common/util/error';

const logger = getLogger('MutateAppointmentsResolver');

@InputType()
class AppointmentUpdateInput {
    @Field(() => Int)
    id: number;
    @Field(() => String, { nullable: true })
    title?: string;
    @Field(() => String, { nullable: true })
    description?: string;
    @Field(() => Date, { nullable: true })
    start?: Date;
    @Field(() => Int, { nullable: true })
    duration?: number;
}
@Resolver(() => Appointment)
export class MutateAppointmentResolver {
    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async appointmentMatchCreate(@Ctx() context: GraphQLContext, @Arg('appointment') appointment: AppointmentCreateMatchInput) {
        const match = await getMatch(appointment.matchId);
        await hasAccess(context, 'Match', match);
        await createMatchAppointments(match.id, [appointment]);

        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async appointmentsMatchCreate(
        @Ctx() context: GraphQLContext,
        @Arg('matchId') matchId: number,
        @Arg('appointments', () => [AppointmentCreateMatchInput]) appointments: AppointmentCreateMatchInput[]
    ) {
        const match = await getMatch(matchId);
        await hasAccess(context, 'Match', match);
        await createMatchAppointments(matchId, appointments);
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async appointmentGroupCreate(@Ctx() context: GraphQLContext, @Arg('appointment') appointment: AppointmentCreateGroupInput) {
        const subcourse = await getSubcourse(appointment.subcourseId);
        const organizer = await getStudent(context.user.studentId);
        await hasAccess(context, 'Subcourse', subcourse);
        await createGroupAppointments(subcourse.id, [appointment], organizer);
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async appointmentsGroupCreate(
        @Ctx() context: GraphQLContext,
        @Arg('subcourseId') subcourseId: number,
        @Arg('appointments', () => [AppointmentCreateGroupInput]) appointments: AppointmentCreateGroupInput[]
    ) {
        const subcourse = await prisma.subcourse.findUnique({ where: { id: subcourseId }, include: { course: true } });
        const organizer = await getStudent(context.user.studentId);

        await hasAccess(context, 'Subcourse', subcourse);
        if (isAppointmentOneWeekLater(appointments[0].start)) {
            await createGroupAppointments(subcourseId, appointments, organizer);
        } else {
            throw new Error('Appointment can not be created, because start is not one week later.');
        }
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async appointmentUpdate(@Ctx() context: GraphQLContext, @Arg('appointmentToBeUpdated') appointmentToBeUpdated: AppointmentUpdateInput) {
        const appointment = await getLecture(appointmentToBeUpdated.id);
        await hasAccess(context, 'Lecture', appointment);
        await updateAppointment(context.user, appointment, appointmentToBeUpdated);

        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER, Role.APPOINTMENT_PARTICIPANT)
    async appointmentDecline(@Ctx() context: GraphQLContext, @Arg('appointmentId') appointmentId: number) {
        const appointment = await getLecture(appointmentId);
        await hasAccess(context, 'Lecture', appointment);
        await declineAppointment(context.user, appointment);

        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async appointmentCancel(@Ctx() context: GraphQLContext, @Arg('appointmentId') appointmentId: number) {
        const appointment = await getLecture(appointmentId);
        await hasAccess(context, 'Lecture', appointment);

        await cancelAppointment(context.user, appointment);

        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async appointmentSaveMeetingReport(@Ctx() context: GraphQLContext, @Arg('appointmentId') appointmentId: number) {
        const appointment = await getLecture(appointmentId);
        await hasAccess(context, 'Lecture', appointment);
        await saveZoomMeetingReport(appointment as Lecture);

        return true;
    }

    @Mutation(() => Boolean)
    @Authorized(Role.ADMIN)
    async appointmentDeleteZoomMeeting(@Ctx() context: GraphQLContext, @Arg('appointmentId') appointmentId: number) {
        const appointment = await getLecture(appointmentId);
        if (!appointment.zoomMeetingId) {
            throw new RedundantError('Appointment has no Zoom Meeting');
        }

        await deleteZoomMeeting(appointment);
        logger.info(`Admin deleted Zoom Meeting of Appointment(${appointment.id})`);
    }
}
