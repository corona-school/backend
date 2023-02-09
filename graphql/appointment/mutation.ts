import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { Lecture as Appointment } from '../generated/models';
import { Role } from '../../common/user/roles';
import { AppointmentCreateGroupInput, AppointmentCreateInputFull, AppointmentCreateMatchInput, createAppointments } from '../../common/appointment/create';
import { getSessionUser } from '../authentication';
import { GraphQLContext } from '../context';
import { AppointmentType } from '../../common/entity/Lecture';
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
    @Authorized(Role.ADMIN, Role.STUDENT)
    async appointmentsCreate(
        @Ctx() context: GraphQLContext,
        @Arg('appointments', () => [AppointmentCreateInputFull]) appointments: AppointmentCreateInputFull[]
    ) {
        appointments.forEach((appointment) => (appointment.organizers = mergeOrganizersWithSessionUserId(appointment.organizers, context)));
        return createAppointments(appointments);
    }

    @Mutation(() => Boolean)
    @Authorized(Role.STUDENT)
    async appointmentMatchCreate(@Ctx() context: GraphQLContext, @Arg('appointment') appointment: AppointmentCreateMatchInput) {
        const appointmentMatch: AppointmentCreateInputFull = {
            ...appointment,
            appointmentType: AppointmentType.ONE_ON_ONE,
            organizers: [getOrganizersUserId(context)],
        };
        return createAppointments([appointmentMatch]);
    }

    @Mutation(() => Boolean)
    @Authorized(Role.STUDENT)
    async appointmentGroupCreate(@Ctx() context: GraphQLContext, @Arg('appointment') appointment: AppointmentCreateGroupInput) {
        prisma.subcourse_participants_pupil;
        const appointmentMatch: AppointmentCreateInputFull = {
            ...appointment,
            appointmentType: AppointmentType.GROUP,
            organizers: [getOrganizersUserId(context)],
        };
        return createAppointments([appointmentMatch]);
    }
}
