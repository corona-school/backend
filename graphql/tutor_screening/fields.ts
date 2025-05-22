import { prisma } from '../../common/prisma';
import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { Screener, Screening, Screening_appointment as ScreeningAppointment } from '../generated';
import { Role } from '../authorizations';

@Resolver((of) => Screening)
export class ExtendedFieldsTutorScreeningResolver {
    @FieldResolver((returns) => Screener)
    @Authorized(Role.ADMIN, Role.SCREENER)
    async screener(@Root() screening: Screening) {
        return await prisma.screener.findUnique({ where: { id: screening.screenerId } });
    }

    @FieldResolver((returns) => ScreeningAppointment, { nullable: true })
    @Authorized(Role.ADMIN, Role.STUDENT_SCREENER, Role.OWNER)
    async appointment(@Root() screening: Screening) {
        const currentScreening = await prisma.screening.findFirst({
            where: { id: screening.id },
        });
        const appointment = await prisma.screening_appointment.findFirst({
            where: {
                tutorScreeningId: currentScreening.id,
                cancelledAt: { equals: null },
            },
        });

        return appointment;
    }
}
