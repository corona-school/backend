import { prisma } from '../../common/prisma';
import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { Screener, Screening } from '../generated';
import { Role } from '../authorizations';

@Resolver((of) => Screening)
export class ExtendedFieldsTutorScreeningResolver {
    @FieldResolver((returns) => Screener)
    @Authorized(Role.ADMIN, Role.SCREENER)
    async screener(@Root() screening: Screening) {
        return await prisma.screener.findUnique({ where: { id: screening.screenerId } });
    }
}
