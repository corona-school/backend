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
import { getLecture } from '../../graphql/util';
import { getLogger } from 'log4js';
import { Field, InputType, Int } from 'type-graphql';
import { lecture_appointmenttype_enum } from '@prisma/client';
import { getUserType } from '../../common/user';

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
    @Field(() => String, { nullable: true })
    title?: string;
    @Field(() => String, { nullable: true })
    description?: string;
    @Field(() => Date)
    start: Date;
    @Field(() => Int)
    duration: number;
}

@Resolver(() => Appointment)
export class MutateAppointmentResolver {
    @Mutation(() => Boolean)
    @Authorized(Role.ADMIN, Role.STUDENT)
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
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
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
                } else {
                    await hasAccessMatch(context, appointment.matchId);
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
