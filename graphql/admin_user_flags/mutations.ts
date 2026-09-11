import { Arg, Authorized, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql';
import { Admin_user_flag as AdminUserFlag } from '../generated';
import { Role } from '../authorizations';
import { GraphQLJSON } from 'graphql-scalars';
import { prisma } from '../../common/prisma';

@InputType()
class AdminUserFlagCreateInput implements Partial<AdminUserFlag> {
    @Field()
    userId: string;

    @Field()
    flag: string;

    @Field(() => GraphQLJSON, { nullable: true })
    metadata?: any;
}

@Resolver((of) => AdminUserFlag)
export class AdminUserFlagMutationsResolver {
    @Mutation((returns) => AdminUserFlag)
    @Authorized(Role.ADMIN, Role.TRUSTED_SCREENER)
    async adminUserFlagCreate(@Arg('data') data: AdminUserFlagCreateInput) {
        return await prisma.admin_user_flag.create({
            data: {
                userId: data.userId,
                flag: data.flag,
                metadata: data.metadata,
            },
        });
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.TRUSTED_SCREENER)
    async adminUserFlagDelete(@Arg('id') id: number) {
        await prisma.admin_user_flag.delete({ where: { id } });
        return true;
    }

    @Mutation((returns) => AdminUserFlag)
    @Authorized(Role.ADMIN, Role.TRUSTED_SCREENER)
    async adminUserFlagUpdate(@Arg('id') id: number, @Arg('metadata', () => GraphQLJSON, { nullable: true }) metadata: any) {
        return await prisma.admin_user_flag.update({ where: { id }, data: { metadata } });
    }
}
