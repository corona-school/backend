import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { Lecture as Appointment } from '../generated/models';
import { Role } from '../../common/user/roles';
import { AppointmentCreateGroupInput, AppointmentCreateInputFull, AppointmentCreateMatchInput, createAppointment } from '../../common/appointment/create';
import { getSessionUser } from '../authentication';
import { GraphQLContext } from '../context';
import { AppointmentType } from '../../common/entity/Lecture';
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
    @Authorized(Role.ADMIN)
    async appointmentCreate(@Ctx() context: GraphQLContext, @Arg('appointment') appointment: AppointmentCreateInputFull) {
        appointment.organizers = mergeOrganizersWithSessionUserId(appointment.organizers, context);
        return createAppointment(appointment);
    }

    @Mutation(() => Boolean)
    @Authorized(Role.STUDENT)
    async appointmentMatchCreate(@Ctx() context: GraphQLContext, @Arg('appointment') appointment: AppointmentCreateMatchInput) {
        const appointmentMatch: AppointmentCreateInputFull = {
            ...appointment,
            appointmentType: AppointmentType.ONE_ON_ONE,
            organizers: [getOrganizersUserId(context)],
        };
        return createAppointment(appointmentMatch);
    }

    @Mutation(() => Boolean)
    @Authorized(Role.STUDENT)
    async appointmentGroupCreate(@Ctx() context: GraphQLContext, @Arg('appointment') appointment: AppointmentCreateGroupInput) {
        const appointmentMatch: AppointmentCreateInputFull = {
            ...appointment,
            appointmentType: AppointmentType.GROUP,
            organizers: [getOrganizersUserId(context)],
        };
        return createAppointment(appointmentMatch);
    }
}
