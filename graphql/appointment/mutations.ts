import { Arg, Ctx, Field, InputType, Mutation, Resolver, Int } from 'type-graphql';
import { Lecture as Appointment } from '../generated/models';
import { Role } from '../../common/user/roles';
import { AppointmentCreateGroupInput, AppointmentCreateMatchInput, createGroupAppointments, createMatchAppointments } from '../../common/appointment/create';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { prisma } from '../../common/prisma';
import { getLecture, getStudent } from '../util';
import moment from 'moment';
import * as Notification from '../../common/notification';

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
        // send notification
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
        await createGroupAppointments(subcourseId, appointments);

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
        const currentDate = moment();
        const isPastAppointment = moment(appointment.start).add(appointment.duration).isBefore(currentDate);

        if (isPastAppointment) {
            throw new Error(`Cannot update past appointment.`);
        }

        await prisma.lecture.update({
            where: { id: appointmentToBeUpdated.id },
            data: { ...appointmentToBeUpdated },
        });
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER, Role.APPOINTMENT_PARTICIPANT)
    async appointmentDecline(@Ctx() context: GraphQLContext, @Arg('appointmentId') appointmentId: number) {
        const { user } = context;
        const appointment = await getLecture(appointmentId);
        await hasAccess(context, 'Lecture', appointment);

        await prisma.lecture.update({
            data: { declinedBy: { push: user.userID } },
            where: { id: appointmentId },
        });

        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async appointmentCancel(@Ctx() context: GraphQLContext, @Arg('appointmentId') appointmentId: number) {
        const appointment = await getLecture(appointmentId);
        await hasAccess(context, 'Lecture', appointment);

        await prisma.lecture.update({
            data: { isCanceled: true },
            where: { id: appointmentId },
        });

        return true;
    }
}
