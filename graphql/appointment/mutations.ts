import { Arg, Ctx, Field, InputType, Mutation, Resolver, Int } from 'type-graphql';
import { Lecture as Appointment } from '../generated/models';
import { Role } from '../../common/user/roles';
import { AppointmentCreateGroupInput, AppointmentCreateMatchInput, createGroupAppointments, createMatchAppointments } from '../../common/appointment/create';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { prisma } from '../../common/prisma';
import { getLecture } from '../util';
import moment from 'moment';

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
        return true;
    }
}
