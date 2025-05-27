import { prisma } from '../../common/prisma';
import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { Screener, Instructor_screening as InstructorScreening, Lecture } from '../generated';
import { Role } from '../authorizations';

@Resolver((of) => InstructorScreening)
export class ExtendedFieldsInstructorScreeningResolver {
    @FieldResolver((returns) => Screener)
    @Authorized(Role.ADMIN, Role.SCREENER)
    async screener(@Root() screening: InstructorScreening) {
        return await prisma.screener.findUnique({ where: { id: screening.screenerId } });
    }

    @FieldResolver((returns) => Lecture, { nullable: true })
    @Authorized(Role.ADMIN, Role.STUDENT_SCREENER, Role.OWNER)
    async appointment(@Root() screening: InstructorScreening) {
        const currentScreening = await prisma.instructor_screening.findFirst({
            where: { id: screening.id },
        });
        const appointment = await prisma.lecture.findFirst({
            where: {
                instructorScreeningId: currentScreening.id,
                isCanceled: false,
            },
        });

        return appointment;
    }
}
