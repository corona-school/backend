import { Arg, Ctx, Field, InputType, Mutation, Resolver, Int } from 'type-graphql';
import { Lecture as Appointment } from '../generated/models';
import { Role } from '../../common/user/roles';
import {
    AppointmentCreateGroupInput,
    AppointmentCreateMatchInput,
    createGroupAppointment,
    createGroupAppointments,
    createMatchAppointment,
    createMatchAppointments,
} from '../../common/appointment/create';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { prisma } from '../../common/prisma';
import { getLecture } from '../util';
import moment from 'moment';

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
    @AuthorizedDeferred(Role.OWNER)
    async appointmentMatchCreate(@Ctx() context: GraphQLContext, @Arg('appointment') appointment: AppointmentCreateMatchInput) {
        const match = await prisma.match.findUnique({ where: { id: appointment.matchId } });
        await hasAccess(context, 'Match', match);
        await createMatchAppointment(appointment);
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
        await createGroupAppointment(appointment);
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
        return true;
    }
}
