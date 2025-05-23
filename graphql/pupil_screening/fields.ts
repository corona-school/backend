import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { Pupil, Pupil_screening as PupilScreening, Screener, Screening_appointment as ScreeningAppointment } from '../generated';
import { Role } from '../../common/user/roles';
import { prisma } from '../../common/prisma';

@Resolver((of) => PupilScreening)
export class ExtendedFieldsPupil_screeningResolver {
    @FieldResolver((returns) => Pupil)
    @Authorized(Role.ADMIN, Role.SCREENER)
    async pupil(@Root() screening: PupilScreening) {
        return await prisma.pupil.findUnique({ where: { id: screening.pupilId } });
    }

    @FieldResolver((returns) => [Screener])
    @Authorized(Role.ADMIN, Role.SCREENER)
    async screeners(@Root() screening: PupilScreening) {
        return await prisma.screener.findMany({ where: { id: { in: screening.screenerIds } } });
    }

    @FieldResolver((returns) => ScreeningAppointment, { nullable: true })
    @Authorized(Role.ADMIN, Role.PUPIL_SCREENER, Role.OWNER)
    async appointment(@Root() screening: PupilScreening) {
        const currentScreening = await prisma.pupil_screening.findFirst({
            where: {
                invalidated: false,
                id: screening.id,
                status: { in: ['pending'] },
            },
        });
        const appointment = await prisma.screening_appointment.findFirst({
            where: {
                pupilScreeningId: currentScreening.id,
                cancelledAt: { equals: null },
            },
        });

        return appointment;
    }
}
