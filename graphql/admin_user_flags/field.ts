import { Resolver, Query, Authorized, Ctx, FieldResolver, Root, Arg, ObjectType, InputType, Field, Int } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Admin_user_flag as AdminUserFlag } from '../generated';
import { Role } from '../../common/user/roles';
import { GraphQLContext } from '../context';
import { UserType } from '../types/user';
import { getUser, getUsers, UserID } from '../../common/user';
import { GraphQLJSONObject } from 'graphql-scalars';
import { Prisma } from '@prisma/client';

@InputType()
export class AdminUserFlagFilters {
    @Field((type) => [String], { nullable: true })
    flags?: string[];

    @Field((type) => GraphQLJSONObject, { nullable: true })
    metadataFilters?: Record<string, any>;

    @Field((type) => String, { nullable: true })
    email?: string;
}

@ObjectType()
export class AdminUserFlagsResponse {
    @Field((type) => [AdminUserFlag])
    items: AdminUserFlag[];

    @Field((type) => Int)
    totalCount: number;
}

@ObjectType()
export class AdminUserFlagGroup {
    @Field((type) => String)
    userId: string;

    @Field((type) => UserType, { nullable: true })
    user?: UserType;

    @Field((type) => [AdminUserFlag])
    flags: AdminUserFlag[];
}

@ObjectType()
export class AdminUserFlagGroupsResponse {
    @Field((type) => [AdminUserFlagGroup])
    items: AdminUserFlagGroup[];

    @Field((type) => Int)
    totalCount: number;
}

async function buildFlagsWhere(filters?: AdminUserFlagFilters): Promise<Prisma.admin_user_flagWhereInput> {
    const { metadataFilters, flags, email } = filters ?? {};
    const metadataConditions: Prisma.admin_user_flagWhereInput[] = Object.entries(metadataFilters ?? {}).map(([key, value]) => ({
        metadata: {
            path: [key],
            equals: value as Prisma.InputJsonValue,
        },
    }));

    let userIds: string[] | undefined;
    if (email?.trim()) {
        const emailFilter = { email: { contains: email.trim(), mode: 'insensitive' as const } };
        const [pupils, students] = await Promise.all([
            prisma.pupil.findMany({ where: emailFilter, select: { id: true } }),
            prisma.student.findMany({ where: emailFilter, select: { id: true } }),
        ]);
        userIds = [...pupils.map((p) => `pupil/${p.id}`), ...students.map((s) => `student/${s.id}`)];
    }

    return {
        AND: metadataConditions.length ? metadataConditions : undefined,
        flag: flags?.length ? { in: flags } : undefined,
        userId: userIds ? { in: userIds } : undefined,
    };
}

@Resolver((of) => AdminUserFlag)
export class AdminUserFlagFieldsResolver {
    @FieldResolver((returns) => UserType, { nullable: true })
    @Authorized(Role.ADMIN)
    user(@Root() adminUserFlag: AdminUserFlag) {
        return getUser(adminUserFlag.userId);
    }

    @Query((returns) => AdminUserFlagsResponse)
    @Authorized(Role.ADMIN)
    async adminUserFlags(
        @Ctx() context: GraphQLContext,
        @Arg('take', { nullable: true, defaultValue: 100 }) take?: number,
        @Arg('skip', { nullable: true, defaultValue: 0 }) skip?: number,
        @Arg('filters', () => AdminUserFlagFilters, { nullable: true }) filters?: AdminUserFlagFilters
    ) {
        const where = await buildFlagsWhere(filters);

        const [items, totalCount] = await Promise.all([prisma.admin_user_flag.findMany({ take, skip, where }), prisma.admin_user_flag.count({ where })]);

        return {
            items,
            totalCount,
        };
    }

    @Query((returns) => AdminUserFlagGroupsResponse)
    @Authorized(Role.ADMIN)
    async adminUserFlagGroups(
        @Arg('take', { nullable: true, defaultValue: 100 }) take?: number,
        @Arg('skip', { nullable: true, defaultValue: 0 }) skip?: number,
        @Arg('filters', () => AdminUserFlagFilters, { nullable: true }) filters?: AdminUserFlagFilters
    ) {
        const where = await buildFlagsWhere(filters);

        const [userGroups, allUserGroups] = await Promise.all([
            prisma.admin_user_flag.groupBy({
                by: ['userId'],
                where,
                orderBy: [{ _max: { createdAt: 'desc' } }, { userId: 'asc' }],
                take,
                skip,
            }),
            prisma.admin_user_flag.groupBy({ by: ['userId'], where }),
        ]);
        const userIds = userGroups.map((g) => g.userId);

        const [rows, users] = await Promise.all([
            prisma.admin_user_flag.findMany({
                where: { AND: [where, { userId: { in: userIds } }] },
                orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
            }),
            getUsers(userIds as UserID[]),
        ]);
        const usersById = new Map(users.map((u) => [u.userID, u]));

        const flagsByUser = new Map<string, typeof rows>();
        for (const row of rows) {
            flagsByUser.set(row.userId, [...(flagsByUser.get(row.userId) ?? []), row]);
        }

        return {
            items: userIds.map((userId) => ({
                userId,
                user: usersById.get(userId as UserID),
                flags: flagsByUser.get(userId) ?? [],
            })),
            totalCount: allUserGroups.length,
        };
    }
}
