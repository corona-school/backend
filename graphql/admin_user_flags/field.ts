import { Resolver, Query, Authorized, Ctx, FieldResolver, Root, Arg } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Admin_user_flag as AdminUserFlag } from '../generated';
import { Role } from '../../common/user/roles';
import { GraphQLContext } from '../context';
import { UserType } from '../types/user';
import { getUser } from '../../common/user';
import { GraphQLJSONObject } from 'graphql-scalars';
import { Prisma } from '@prisma/client';

@Resolver((of) => AdminUserFlag)
export class AdminUserFlagFieldsResolver {
    @FieldResolver((returns) => UserType, { nullable: true })
    @Authorized(Role.ADMIN)
    user(@Root() adminUserFlag: AdminUserFlag) {
        return getUser(adminUserFlag.userId);
    }

    @Query((returns) => [AdminUserFlag])
    @Authorized(Role.ADMIN)
    async adminUserFlags(
        @Ctx() context: GraphQLContext,
        @Arg('take', { nullable: true, defaultValue: 100 }) take?: number,
        @Arg('skip', { nullable: true, defaultValue: 0 }) skip?: number,
        @Arg('metadataFilters', () => GraphQLJSONObject, { nullable: true }) metadataFilters?: Record<string, any>
    ) {
        const metadataConditions: Prisma.admin_user_flagWhereInput[] = Object.entries(metadataFilters ?? {}).map(([key, value]) => ({
            metadata: {
                path: [key],
                equals: value as Prisma.InputJsonValue,
            },
        }));
        return await prisma.admin_user_flag.findMany({
            take,
            skip,
            where: {
                AND: metadataConditions,
            },
        });
    }
}
