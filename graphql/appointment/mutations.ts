import { Arg, Ctx, Field, InputType, Mutation, Resolver, Int } from 'type-graphql';
import { Lecture as Appointment, lecture_appointmenttype_enum } from '../generated';
import { Role } from '../../common/user/roles';
import { AppointmentCreateGroupInput, AppointmentCreateMatchInput, createGroupAppointments, createMatchAppointments } from '../../common/appointment/create';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { prisma } from '../../common/prisma';
import { getLecture, getStudent } from '../util';
import * as Notification from '../../common/notification';
import moment from 'moment';
import { getLogger } from '../../common/logger/logger';

const language = 'de-DE';
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
        await createMatchAppointments(matchId, appointments);
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
        await createGroupAppointments(subcourseId, appointments);
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

        // check if date is the same
        if (appointment.start.toISOString() === appointmentToBeUpdated.start.toISOString()) {
            return true;
        }
        // send notification if date has changed
        const student = await getStudent(context.user.studentId);
        const updatedAppointment = await getLecture(appointmentToBeUpdated.id);
        if (updatedAppointment.appointmentType === lecture_appointmenttype_enum.group) {
            const subcourse = await prisma.subcourse.findUnique({ where: { id: updatedAppointment.subcourseId }, include: { course: true } });
            const participants = await prisma.subcourse_participants_pupil.findMany({ where: { subcourseId: subcourse.id }, include: { pupil: true } });
            for (const participant of participants) {
                await Notification.actionTaken(participant.pupil, 'pupil_change_appointment_group', {
                    student: student,
                    pupil: participant.pupil,
                    appointment: {
                        ...updatedAppointment,
                        day: updatedAppointment.start.toLocaleString(language, { weekday: 'long' }),
                        date: `${updatedAppointment.start.toLocaleString(language, { day: 'numeric', month: 'long', year: 'numeric' })}`,
                        time: `${updatedAppointment.start.toLocaleString(language, { hour: '2-digit', minute: '2-digit' })}`,
                        original: {
                            day: appointment.start.toLocaleString(language, { weekday: 'long' }),
                            date: `${appointment.start.toLocaleString(language, { day: 'numeric', month: 'long', year: 'numeric' })}`,
                            time: `${appointment.start.toLocaleString(language, { hour: '2-digit', minute: '2-digit' })}`,
                        },
                    },
                    course: subcourse.course,
                });
            }
        } else if (updatedAppointment.appointmentType === lecture_appointmenttype_enum.match) {
            const match = await prisma.match.findUnique({ where: { id: updatedAppointment.matchId }, include: { pupil: true } });
            await Notification.actionTaken(match.pupil, 'pupil_change_appointment_match', {
                student: student,
                pupil: match.pupil,
                appointment: {
                    ...updatedAppointment,
                    day: updatedAppointment.start.toLocaleString(language, { weekday: 'long' }),
                    date: `${updatedAppointment.start.toLocaleString(language, { day: 'numeric', month: 'long', year: 'numeric' })}`,
                    time: `${updatedAppointment.start.toLocaleString(language, { hour: '2-digit', minute: '2-digit' })}`,
                    original: {
                        day: appointment.start.toLocaleString(language, { weekday: 'long' }),
                        date: `${appointment.start.toLocaleString(language, { day: 'numeric', month: 'long', year: 'numeric' })}`,
                        time: `${appointment.start.toLocaleString(language, { hour: '2-digit', minute: '2-digit' })}`,
                    },
                },
            });
        } else {
            logger.error(`Could not send notification for 'appointment updated'. The appointment type is neither 'group' nor 'match'`, { appointment });
        }
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
