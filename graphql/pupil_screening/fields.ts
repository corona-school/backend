import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { Pupil, Pupil_screening as PupilScreening, Screener, Lecture } from '../generated';
import { Role } from '../../common/user/roles';
import { prisma } from '../../common/prisma';
import moment from 'moment';
import { getAppointmentEnd } from '../../common/appointment/util';

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

    @FieldResolver((returns) => Lecture, { nullable: true })
    @Authorized(Role.ADMIN, Role.PUPIL_SCREENER, Role.OWNER)
    async appointment(@Root() screening: PupilScreening) {
        const currentScreening = await prisma.pupil_screening.findFirst({
            where: {
                invalidated: false,
                id: screening.id,
                status: { in: ['pending', 'dispute'] },
            },
        });

        if (!currentScreening) {
            return;
        }

        const appointments = await prisma.lecture.findMany({
            where: {
                pupilScreeningId: currentScreening.id,
                isCanceled: false,
            },
        });

        const currentAppointment = appointments.find((appointment) => moment().isSameOrBefore(getAppointmentEnd(appointment)));

        return currentAppointment;
    }
}
