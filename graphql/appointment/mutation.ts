import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { Lecture as Appointment } from '../generated/models';
import { Role } from '../../common/user/roles';
import {
    AppointmentCreateGroupInput,
    AppointmentCreateInputFull,
    AppointmentCreateMatchInput,
    AppointmentInputText,
    createAppointments,
    createWeeklyAppointments,
} from '../../common/appointment/create';
import { getSessionUser } from '../authentication';
import { GraphQLContext } from '../context';
import { AppointmentType } from '../../common/entity/Lecture';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { prisma } from '../../common/prisma';
const getOrganizersUserId = (context: GraphQLContext) => getSessionUser(context).studentId || null;

const mergeOrganizersWithSessionUserId = (organizers: number[] = [], context: GraphQLContext) => {
    const userId = getOrganizersUserId(context);
    if (!userId) {
        return organizers; // only Students can be organizers
    }
    if (organizers.includes(userId)) {
        return organizers; // already in organizers
    }
    return [...organizers, userId];
};

@Resolver(() => Appointment)
export class MutateAppointmentResolver {
    @Mutation(() => Boolean)
    @Authorized(Role.ADMIN, Role.STUDENT)
    async appointmentCreate(@Ctx() context: GraphQLContext, @Arg('appointment') appointment: AppointmentCreateInputFull) {
        appointment.organizers = mergeOrganizersWithSessionUserId(appointment.organizers, context);
        return createAppointments([appointment]);
    }

    @Mutation(() => Boolean)
    @Authorized(Role.ADMIN, Role.STUDENT) //@TODO: check ownership of match or subcourse
    async appointmentsCreate(
        @Ctx() context: GraphQLContext,
        @Arg('appointments', () => [AppointmentCreateInputFull]) appointments: AppointmentCreateInputFull[]
    ) {
        appointments.forEach((appointment) => (appointment.organizers = mergeOrganizersWithSessionUserId(appointment.organizers, context)));
        return createAppointments(appointments);
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    // hasAccess is called in hasAccessMatch
    // eslint-disable-next-line lernfair-lint/graphql-deferred-auth
    async appointmentMatchCreate(@Ctx() context: GraphQLContext, @Arg('appointment') appointment: AppointmentCreateMatchInput) {
        await hasAccessMatch(context, appointment.matchId);

        return createAppointments([getFullAppointment(appointment, AppointmentType.MATCH, context)]);
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    // hasAccess is called in hasAccessSubcourse
    // eslint-disable-next-line lernfair-lint/graphql-deferred-auth
    async appointmentGroupCreate(@Ctx() context: GraphQLContext, @Arg('appointment') appointment: AppointmentCreateGroupInput) {
        await hasAccessSubcourse(context, appointment.subcourseId);
        return createAppointments([getFullAppointment(appointment, AppointmentType.GROUP, context)]);
    }

    @Mutation(() => Boolean)
    @AuthorizedDeferred(Role.OWNER)
    // hasAccess is called in hasAccessSubcourse
    // eslint-disable-next-line lernfair-lint/graphql-deferred-auth
    async appointmentGroupWeeklyCreate(
        @Ctx() context: GraphQLContext,
        @Arg('baseAppointment') baseAppointment: AppointmentCreateGroupInput,
        @Arg('weeklyTexts', () => [AppointmentInputText]) weeklyTexts: AppointmentInputText[]
    ) {
        await hasAccessSubcourse(context, baseAppointment.subcourseId);
        return createWeeklyAppointments(getFullAppointment(baseAppointment, AppointmentType.GROUP, context), weeklyTexts);
    }
}

const getFullAppointment = (
    appointment: AppointmentCreateGroupInput | AppointmentCreateMatchInput,
    type: AppointmentType,
    context: GraphQLContext
): AppointmentCreateInputFull => ({
    ...appointment,
    appointmentType: type,
    organizers: [getOrganizersUserId(context)],
});

const hasAccessSubcourse = async (context: GraphQLContext, subcourseId: number): Promise<void> => {
    const subcourse = await prisma.subcourse.findUnique({ where: { id: subcourseId } });
    await hasAccess(context, 'Subcourse', subcourse);
};

const hasAccessMatch = async (context: GraphQLContext, matchId: number): Promise<void> => {
    const match = await prisma.match.findUnique({ where: { id: matchId } });
    await hasAccess(context, 'Match', match);
};
