import { Arg, Ctx, Field, InputType, Mutation, Resolver, Int } from 'type-graphql';
import { Lecture as Appointment, lecture_appointmenttype_enum } from '../generated';
import { Role } from '../../common/user/roles';
import { AppointmentCreateGroupInput, AppointmentCreateMatchInput, createGroupAppointments, createMatchAppointments } from '../../common/appointment/create';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { prisma } from '../../common/prisma';
import { getLecture, getStudent } from '../util';
import moment from 'moment';
import * as Notification from '../../common/notification';
import { getLogger } from '../../common/logger/logger';
import { getUser } from '../../common/user';
import { getZoomMeetingReport } from '../../common/zoom/zoom-scheduled-meeting';

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
        const appointment = await prisma.lecture.findUnique({ where: { id: appointmentId } });
        await hasAccess(context, 'Lecture', appointment);

        await prisma.lecture.update({
            data: { declinedBy: { push: user.userID } },
            where: { id: appointmentId },
        });

        // * Send notification here
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

        // * Send notification here

        const student = await getStudent(context.user.studentId);
        const language = 'de-DE';

        if (appointment.appointmentType === lecture_appointmenttype_enum.group) {
            const subcourse = await prisma.subcourse.findFirst({ where: { id: appointment.subcourseId }, include: { course: true } });
            const participants = await prisma.subcourse_participants_pupil.findMany({ where: { subcourseId: subcourse.id }, include: { pupil: true } });

            for (const participant of participants) {
                await Notification.actionTaken(participant.pupil, 'student_cancel_appointment_group', {
                    appointment: {
                        ...appointment,
                        day: appointment.start.toLocaleString(language, { weekday: 'long' }),
                        date: `${appointment.start.toLocaleString(language, { day: 'numeric', month: 'long', year: 'numeric' })}`,
                        time: `${appointment.start.toLocaleString(language, { hour: '2-digit', minute: '2-digit' })}`,
                    },
                    student,
                    user: context.user,
                    course: subcourse.course,
                });
            }
        } else if (appointment.appointmentType === lecture_appointmenttype_enum.match) {
            const match = await prisma.match.findUnique({ where: { id: appointment.matchId }, include: { pupil: true } });
            await Notification.actionTaken(match.pupil, 'student_cancel_appointment_match', {
                appointment: {
                    ...appointment,
                    day: appointment.start.toLocaleString(language, { weekday: 'long' }),
                    date: `${appointment.start.toLocaleString(language, { day: 'numeric', month: 'long', year: 'numeric' })}`,
                    time: `${appointment.start.toLocaleString(language, { hour: '2-digit', minute: '2-digit' })}`,
                },
                student,
                user: context.user,
            });
        } else {
            logger.error(`Could not send notification to pupils of appointment. The appointment-type is neither 'match' nor 'group'.`, { appointment });
        }

        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    async saveMeetingReport(@Ctx() context: GraphQLContext, @Arg('appointmentId') appointmentId: number) {
        const appointment = await getLecture(appointmentId);
        const result = await getZoomMeetingReport(appointment.zoomMeetingId);
        await prisma.lecture.update({
            where: { id: appointmentId },
            data: { ...appointment, zoomMeetingReport: result },
        });
    }
}
