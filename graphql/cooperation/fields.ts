import { Resolver, Query, Authorized } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Cooperation } from '../generated';
import { Role } from '../../common/user/roles';

@Resolver((of) => Cooperation)
export class ExtendedFieldsCooperationResolver {
    @Query((returns) => [Cooperation])
    @Authorized(Role.UNAUTHENTICATED)
    async cooperations() {
        return await prisma.cooperation.findMany({});
    }
}
