import { prisma } from '../../common/prisma';
import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { Screener, Instructor_screening as InstructorScreening } from '../generated';
import { Role } from '../authorizations';

@Resolver((of) => InstructorScreening)
export class ExtendedFieldsInstructorScreeningResolver {
    @FieldResolver((returns) => Screener)
    @Authorized(Role.ADMIN, Role.SCREENER)
    async screener(@Root() screening: InstructorScreening) {
        return await prisma.screener.findUnique({ where: { id: screening.screenerId } });
    }
}
