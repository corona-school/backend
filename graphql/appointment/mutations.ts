import { Arg, Ctx, Field, InputType, Mutation, Resolver, Int, Authorized } from 'type-graphql';
import { Lecture as Appointment } from '../generated';
import { Role } from '../../common/user/roles';
import {
    AppointmentCreateGroupInput,
    AppointmentCreateMatchInput,
    createGroupAppointments,
    createMatchAppointments,
    createZoomMeetingForAppointments,
    isAppointmentOneWeekLater,
} from '../../common/appointment/create';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { prisma } from '../../common/prisma';
import { getLecture, getStudent } from '../util';
import * as Notification from '../../common/notification';
import { getLogger } from '../../common/logger/logger';
import { deleteZoomMeeting, getZoomMeetingReport } from '../../common/zoom/zoom-scheduled-meeting';
import { Prisma } from '@prisma/client';
import { declineAppointment } from '../../common/appointment/decline';
import { updateAppointment } from '../../common/appointment/update';
import { cancelAppointment } from '../../common/appointment/cancel';
import { getStudentsFromList } from '../../common/user';
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
        const match = await prisma.match.findUnique({ where: { id: appointment.matchId }, include: { pupil: true } });
        await hasAccess(context, 'Match', match);
        await createMatchAppointments(match.id, [appointment]);

        // send notification
        const student = await getStudent(context.user.studentId);

        await Notification.actionTaken(match.pupil, 'student_add_appointment_match', {
            student,
            user: match.pupil,
            matchId: appointment.matchId,
        });
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async appointmentsMatchCreate(
        @Ctx() context: GraphQLContext,
        @Arg('matchId') matchId: number,
        @Arg('appointments', () => [AppointmentCreateMatchInput]) appointments: AppointmentCreateMatchInput[]
    ) {
        const match = await prisma.match.findUnique({ where: { id: matchId }, include: { pupil: true } });
        await hasAccess(context, 'Match', match);
        await createMatchAppointments(matchId, appointments);
        const student = await getStudent(context.user.studentId);

        await Notification.actionTaken(match.pupil, 'student_add_appointments_match', {
            student,
            user: match.pupil,
            matchId: matchId,
        });
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async appointmentGroupCreate(@Ctx() context: GraphQLContext, @Arg('appointment') appointment: AppointmentCreateGroupInput) {
        const subcourse = await prisma.subcourse.findUnique({ where: { id: appointment.subcourseId }, include: { course: true } });
        await hasAccess(context, 'Subcourse', subcourse);
        await createGroupAppointments(subcourse.id, [appointment]);

        // send notification
        const student = await getStudent(context.user.studentId);

        const participants = await prisma.subcourse_participants_pupil.findMany({ where: { subcourseId: subcourse.id }, include: { pupil: true } });

        for await (const participant of participants) {
            await Notification.actionTaken(participant.pupil, 'student_add_appointment_group', {
                student: student,
                user: participant,
                course: subcourse.course,
            });
        }
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
        await hasAccess(context, 'Subcourse', subcourse);
        if (isAppointmentOneWeekLater(appointments[0].start)) {
            await createGroupAppointments(subcourseId, appointments);
        } else {
            throw new Error('Appointment can not be created, because start is not one week later.');
        }

        // send notification
        const student = await getStudent(context.user.studentId);

        const participants = await prisma.subcourse_participants_pupil.findMany({ where: { subcourseId: subcourse.id }, include: { pupil: true } });

        for await (const participant of participants) {
            await Notification.actionTaken(participant.pupil, 'student_add_appointments_group', {
                student: student,
                user: participant,
                course: subcourse.course,
            });
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
        const appointment = await prisma.lecture.findUnique({ where: { id: appointmentId } });
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
        const meetingReports: Prisma.JsonValue[] = appointment.zoomMeetingReport || [];
        const result = await getZoomMeetingReport(appointment.zoomMeetingId);
        meetingReports.push(result);

        await prisma.lecture.update({
            where: { id: appointmentId },
            data: { zoomMeetingReport: meetingReports },
        });

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
