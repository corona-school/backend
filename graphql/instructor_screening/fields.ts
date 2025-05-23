import { prisma } from '../../common/prisma';
import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { Screener, Instructor_screening as InstructorScreening, Screening_appointment as ScreeningAppointment } from '../generated';
import { Role } from '../authorizations';

@Resolver((of) => InstructorScreening)
export class ExtendedFieldsInstructorScreeningResolver {
    @FieldResolver((returns) => Screener)
    @Authorized(Role.ADMIN, Role.SCREENER)
    async screener(@Root() screening: InstructorScreening) {
        return await prisma.screener.findUnique({ where: { id: screening.screenerId } });
    }

    @FieldResolver((returns) => ScreeningAppointment, { nullable: true })
    @Authorized(Role.ADMIN, Role.STUDENT_SCREENER, Role.OWNER)
    async appointment(@Root() screening: ScreeningAppointment) {
        const currentScreening = await prisma.instructor_screening.findFirst({
            where: { id: screening.id },
        });
        const appointment = await prisma.screening_appointment.findFirst({
            where: {
                instructorScreeningId: currentScreening.id,
                cancelledAt: { equals: null },
            },
        });

        return appointment;
    }
}
