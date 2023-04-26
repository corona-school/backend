import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { Lecture as Appointment } from '../generated/models';
import { Role } from '../../common/user/roles';
import {
    AppointmentCreateGroupInput,
    AppointmentCreateInputFull,
    AppointmentCreateMatchInput,
    createAppointments,
    createGroupAppointment,
    createGroupAppointments,
    createMatchAppointment,
    createMatchAppointments,
} from '../../common/appointment/create';
import { getSessionUser } from '../authentication';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { prisma } from '../../common/prisma';
import { getLecture, getStudent } from '../../graphql/util';
import { getLogger } from 'log4js';
import { Field, InputType, Int } from 'type-graphql';
import { lecture_appointmenttype_enum } from '@prisma/client';
import { getUserType } from '../../common/user';
import moment from 'moment';
import * as Notification from '../../common/notification';

const logger = getLogger('MutateAppointmentsResolver');

const getOrganizersStudentId = (context: GraphQLContext) => {
    const { studentId } = getSessionUser(context);
    if (!studentId) {
        throw new Error('Only students can be organizers');
    }
    return studentId;
};

const mergeOrganizersWithSessionUserId = (organizers: number[] = [], context: GraphQLContext) => {
    const studentId = getOrganizersStudentId(context);
    if (!studentId) {
        return organizers; // only Students can be organizers
    }
    if (organizers.includes(studentId)) {
        return organizers; // already in organizers
    }
    return [...organizers, studentId];
};

@InputType()
class AppointmentUpdateInput {
    @Field(() => Int)
    id: number;
    @Field(() => String)
    title: string;
    @Field(() => String)
    description: string;
    @Field(() => Date)
    start: Date;
    @Field(() => Int)
    duration: number;
}

@Resolver(() => Appointment)
export class MutateAppointmentResolver {
    @Mutation(() => Boolean)
    @Authorized(Role.ADMIN)
    async appointmentCreate(@Ctx() context: GraphQLContext, @Arg('appointment') appointment: AppointmentCreateInputFull) {
        appointment.organizers = mergeOrganizersWithSessionUserId(appointment.organizers, context);
        await createAppointments([appointment]);
        return true;
    }

    @Mutation(() => Boolean)
    @Authorized(Role.ADMIN, Role.STUDENT)
    async appointmentsCreate(
        @Ctx() context: GraphQLContext,
        @Arg('appointments', () => [AppointmentCreateInputFull]) appointments: AppointmentCreateInputFull[]
    ) {
        appointments.forEach((appointment) => (appointment.organizers = mergeOrganizersWithSessionUserId(appointment.organizers, context)));
        await createAppointments(appointments);
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    // hasAccess is called in hasAccessMatch
    // eslint-disable-next-line lernfair-lint/graphql-deferred-auth
    async appointmentMatchCreate(@Ctx() context: GraphQLContext, @Arg('appointment') appointment: AppointmentCreateMatchInput) {
        await hasAccessMatch(context, appointment.matchId);

        await createMatchAppointment(appointment);
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    // hasAccess is called in hasAccessMatch
    // eslint-disable-next-line lernfair-lint/graphql-deferred-auth
    async appointmentsMatchCreate(
        @Ctx() context: GraphQLContext,
        @Arg('matchId') matchId: number,
        @Arg('appointments', () => [AppointmentCreateMatchInput]) appointments: AppointmentCreateMatchInput[]
    ) {
        await hasAccessMatch(context, matchId);
        createMatchAppointments(matchId, appointments);
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    // hasAccess is called in hasAccessSubcourse
    // eslint-disable-next-line lernfair-lint/graphql-deferred-auth
    async appointmentGroupCreate(@Ctx() context: GraphQLContext, @Arg('appointment') appointment: AppointmentCreateGroupInput) {
        await hasAccessSubcourse(context, appointment.subcourseId);
        await createGroupAppointment(appointment);
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    // hasAccess is called in hasAccessSubcourse
    // eslint-disable-next-line lernfair-lint/graphql-deferred-auth
    async appointmentsGroupCreate(
        @Ctx() context: GraphQLContext,
        @Arg('subcourseId') subcourseId: number,
        @Arg('appointments', () => [AppointmentCreateGroupInput]) appointments: AppointmentCreateGroupInput[]
    ) {
        await hasAccessSubcourse(context, subcourseId);

        await createGroupAppointments(subcourseId, appointments);
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.ADMIN)
    // hasAccess is called in hasAccessSubcourse
    // eslint-disable-next-line lernfair-lint/graphql-deferred-auth
    async appointmentsUpdate(
        @Ctx() context: GraphQLContext,
        @Arg('appointmentsToBeUpdated', () => [AppointmentUpdateInput]) appointmentsToBeUpdated: AppointmentUpdateInput[]
    ) {
        await Promise.all(
            appointmentsToBeUpdated.map(async (a) => {
                const appointment = await getLecture(a.id);
                if (appointment.subcourseId) {
                    await hasAccessSubcourse(context, appointment.subcourseId);
                    await hasAccess(context, 'Lecture', appointment);
                } else {
                    await hasAccessMatch(context, appointment.matchId);
                    await hasAccess(context, 'Lecture', appointment);
                }
            })
        );
        await Promise.all(
            appointmentsToBeUpdated.map(async (a) => {
                await prisma.lecture.update({
                    where: { id: a.id },
                    data: { ...a },
                });
            })
        );
        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async appointmentUpdate(@Ctx() context: GraphQLContext, @Arg('appointmentToBeUpdated') appointmentToBeUpdated: AppointmentUpdateInput) {
        const appointment = await getLecture(appointmentToBeUpdated.id);
        const currentDate = moment();
        const isPastAppointment = moment(appointment.start).isBefore(currentDate);

        if (isPastAppointment) {
            throw new Error(`Cannot update past appointment.`);
        }

        await hasAccess(context, 'Lecture', appointment);
        await prisma.lecture.update({
            where: { id: appointmentToBeUpdated.id },
            data: { ...appointmentToBeUpdated },
        });

        // send notification
        const student = await getStudent(context.user.studentId);
        if (appointment.appointmentType === lecture_appointmenttype_enum.group) {
            const subcourse = await prisma.subcourse.findUnique({ where: { id: appointment.subcourseId }, include: { course: true } });
            const participants = await prisma.subcourse_participants_pupil.findMany({ where: { subcourseId: subcourse.id }, include: { pupil: true } });
            for (const participant of participants) {
                await Notification.actionTaken(participant.pupil, 'student_update_appointment_group', {
                    student,
                    appointment,
                    course: subcourse.course,
                });
            }
        } else if (appointment.appointmentType === lecture_appointmenttype_enum.match) {
            const match = await prisma.match.findUnique({ where: { id: appointment.matchId }, include: { pupil: true } });
            await Notification.actionTaken(match.pupil, 'student_update_appointment_match', {
                student,
                appointment,
            });
        } else {
            logger.error(`Could not send notification for 'appointment updated'. The appointment type is neither 'group' nor 'match'`, { appointment });
        }

        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER, Role.APPOINTMENT_PARTICIPANT)
    async appointmentDecline(@Ctx() context: GraphQLContext, @Arg('appointmentId') appointmentId: number) {
        const appointment = await getLecture(appointmentId);
        await hasAccess(context, 'Lecture', appointment);
        const userType = getUserType(context.user);

        switch (userType) {
            case 'pupil': {
                await prisma.appointment_participant_pupil.update({
                    data: { status: 'declined' },
                    where: { appointmentId_pupilId: { appointmentId, pupilId: context.user.pupilId } },
                });
                break;
            }
            case 'student': {
                await prisma.appointment_participant_student.update({
                    data: { status: 'declined' },
                    where: { appointmentId_studentId: { appointmentId, studentId: context.user.studentId } },
                });
                break;
            }
            case 'screener': {
                await prisma.appointment_participant_screener.update({
                    data: { status: 'declined' },
                    where: { appointmentId_screenerId: { appointmentId, screenerId: context.user.screenerId } },
                });
                break;
            }
            default:
                throw new Error(`Cannot decline appointment with user type: ${userType}`);
        }
        // * Send notification here
        logger.info(`Appointment (id: ${appointment.id}) was declined by user (${context.user?.userID})`);

        return true;
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async appointmentCancel(@Ctx() context: GraphQLContext, @Arg('appointmentId') appointmentId: number) {
        const appointment = await getLecture(appointmentId);
        await hasAccess(context, 'Lecture', appointment);
        await prisma.lecture.update({ data: { isCanceled: true }, where: { id: appointment.id } });
        // * Send notification here
        logger.info(`Appointment (id: ${appointment.id}) was cancelled`);
        return true;
    }
}

const getFullAppointment = (
    appointment: AppointmentCreateGroupInput | AppointmentCreateMatchInput,
    type: lecture_appointmenttype_enum,
    context: GraphQLContext
): AppointmentCreateInputFull => ({
    ...appointment,
    appointmentType: type,
    organizers: [getOrganizersStudentId(context)],
});

const hasAccessSubcourse = async (context: GraphQLContext, subcourseId: number): Promise<void> => {
    const subcourse = await prisma.subcourse.findUnique({ where: { id: subcourseId } });
    await hasAccess(context, 'Subcourse', subcourse);
};

const hasAccessMatch = async (context: GraphQLContext, matchId: number): Promise<void> => {
    const match = await prisma.match.findUnique({ where: { id: matchId } });
    await hasAccess(context, 'Match', match);
};
