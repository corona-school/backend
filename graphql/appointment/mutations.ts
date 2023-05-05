import { Arg, Ctx, Field, InputType, Mutation, Resolver, Int } from 'type-graphql';
import { Lecture as Appointment, lecture_appointmenttype_enum } from '../generated';
import { Role } from '../../common/user/roles';
import {
    AppointmentCreateGroupInput,
    AppointmentCreateMatchInput,
    createGroupAppointments,
    createMatchAppointments,
    isAppointmentFiveMinutesLater,
    isAppointmentOneWeekLater,
} from '../../common/appointment/create';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { prisma } from '../../common/prisma';
import { getLecture, getStudent } from '../util';
import * as Notification from '../../common/notification';
import moment from 'moment';
import { getLogger } from '../../common/logger/logger';
import { getUser } from '../../common/user';

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
        const match = await prisma.match.findUnique({ where: { id: appointment.matchId } });
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
        const match = await prisma.match.findUnique({ where: { id: matchId } });
        await hasAccess(context, 'Match', match);
        if (isAppointmentFiveMinutesLater(appointments[0].start)) {
            await createMatchAppointments(matchId, appointments);
        } else {
            throw new Error('Appointment can not be created if start time is less than five minutes.');
        }

        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async appointmentGroupCreate(@Ctx() context: GraphQLContext, @Arg('appointment') appointment: AppointmentCreateGroupInput) {
        const subcourse = await prisma.subcourse.findUnique({ where: { id: appointment.subcourseId } });
        await hasAccess(context, 'Subcourse', subcourse);
        await createGroupAppointments(subcourse.id, [appointment]);
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async appointmentsGroupCreate(
        @Ctx() context: GraphQLContext,
        @Arg('subcourseId') subcourseId: number,
        @Arg('appointments', () => [AppointmentCreateGroupInput]) appointments: AppointmentCreateGroupInput[]
    ) {
        const subcourse = await prisma.subcourse.findUnique({ where: { id: subcourseId } });
        await hasAccess(context, 'Subcourse', subcourse);
        if (isAppointmentOneWeekLater(appointments[0].start)) {
            await createGroupAppointments(subcourseId, appointments);
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
        const appointment = await prisma.lecture.findUnique({ where: { id: appointmentId } });
        await hasAccess(context, 'Lecture', appointment);

        await prisma.lecture.update({
            data: { declinedBy: { push: user.userID } },
            where: { id: appointmentId },
        });

        // * Send notification here
        const language = 'de-DE';
        const appointmentType = appointment.appointmentType;
        // const organizers = await prisma.appointment_organizer.findMany({ where: { appointmentId: appointmentId }, include: { student: true } });
        const pupil = await prisma.pupil.findUnique({ where: { id: user.pupilId } });

        if (appointmentType === lecture_appointmenttype_enum.group) {
            const subCourse = await prisma.subcourse.findFirst({ where: { id: appointment.subcourseId }, include: { course: true } });
            for (const organizerId of appointment.organizerIds) {
                const user = await getUser(organizerId);
                const organizer = await getStudent(user.studentId);
                await Notification.actionTaken(organizer, 'pupil_decline_appointment_group', {
                    appointment: {
                        ...appointment,
                        day: appointment.start.toLocaleString(language, { weekday: 'long' }),
                        date: `${appointment.start.toLocaleString(language, { day: 'numeric', month: 'long', year: 'numeric' })}`,
                        time: `${appointment.start.toLocaleString(language, { hour: '2-digit', minute: '2-digit' })}`,
                    },
                    pupil,
                    course: subCourse.course,
                });
            }
        } else if (appointmentType === lecture_appointmenttype_enum.match) {
            for (const organizerId of appointment.organizerIds) {
                const user = await getUser(organizerId);
                const organizer = await getStudent(user.studentId);
                await Notification.actionTaken(organizer, 'pupil_decline_appointment_match', {
                    appointment: {
                        ...appointment,
                        day: appointment.start.toLocaleString(language, { weekday: 'long' }),
                        date: `${appointment.start.toLocaleString(language, { day: 'numeric', month: 'long', year: 'numeric' })}`,
                        time: `${appointment.start.toLocaleString(language, { hour: '2-digit', minute: '2-digit' })}`,
                    },
                    pupil,
                });
            }
        } else {
            logger.error(`Couldn't send notification to organizer of appointment. The appointment-type is neither 'match' nor 'group'`, { appointment });
        }

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
