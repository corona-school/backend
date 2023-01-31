import { Arg, Authorized, Mutation, Resolver } from 'type-graphql';
import { Lecture as Appointment } from '../generated/models';
import { Role } from '../../common/user/roles';
import { AppointmentCreateInput, createAppointment } from '../../common/appointment/create';

@Resolver(() => Appointment)
export class MutateAppointmentResolver {
    @Mutation(() => Boolean)
    @Authorized(Role.STUDENT)
    async appointmentCreate(@Arg('input') input: AppointmentCreateInput) {
        return createAppointment(input);
    }
}
