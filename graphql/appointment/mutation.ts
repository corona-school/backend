import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { Lecture as Appointment } from '../generated/models';
import { Role } from '../../common/user/roles';
import { AppointmentCreateInput, createAppointment } from '../../common/appointment/create';
import { getSessionUser } from '../authentication';
import { GraphQLContext } from '../context';

const mergeOrganizersWithSessionUserId = (organizers: number[] = [], context: GraphQLContext) => {
    const userId = getSessionUser(context).studentId;
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
    @Authorized(Role.STUDENT)
    async appointmentCreate(@Ctx() context: GraphQLContext, @Arg('appointment') appointment: AppointmentCreateInput) {
        appointment.organizers = mergeOrganizersWithSessionUserId(appointment.organizers, context);
        return createAppointment(appointment);
    }
}
