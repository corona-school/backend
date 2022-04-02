import { Student, Pupil, Screener, Concrete_notification as ConcreteNotification } from "../generated";
import { Authorized, Ctx, Field, FieldResolver, ObjectType, Query, Resolver, Root } from "type-graphql";
import { getSessionPupil, getSessionScreener, getSessionStudent, getSessionUser, GraphQLUser, getUserId } from "../authentication";
import { GraphQLContext } from "../context";
import { Role } from "../authorizations";
import { prisma } from "../../common/prisma";

@ObjectType()
export class User {
    roles: Role[];

    @Field({ nullable: true })
    firstname?: string;
    @Field({ nullable: true })
    lastname?: string;
    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    pupilId?: number;
    @Field({ nullable: true })
    studentId?: number;
    @Field({ nullable: true })
    screenerId?: number;
}

@Resolver(of => User)
export class FieldUserResolver {
    @Query(returns => User)
    @Authorized(Role.USER)
    async me(@Ctx() context: GraphQLContext): Promise<GraphQLUser> {
        return getSessionUser(context);
    }

    @FieldResolver(returns => Pupil)
    @Authorized(Role.USER, Role.ADMIN)
    async pupil(@Root() user: User): Promise<Pupil> {
        if (!user.pupilId) {
            return null;
        }

        return await prisma.pupil.findUnique({ where: { id: user.pupilId }});
    }

    @FieldResolver(returns => Student)
    @Authorized(Role.USER, Role.ADMIN)
    async student(@Root() user: User): Promise<Student> {
        if (!user.studentId) {
            return null;
        }

        return await prisma.student.findUnique({ where: { id: user.studentId }});
    }

    @FieldResolver(returns => Screener)
    @Authorized(Role.USER, Role.ADMIN)
    async screener(@Root() user: User): Promise<Screener> {
        if (!user.screenerId) {
            return null;
        }

        return await prisma.screener.findUnique({ where: { id: user.screenerId }});
    }

    @FieldResolver(returns => [ConcreteNotification])
    @Authorized(Role.USER, Role.ADMIN)
    async concreteNotifications(@Root() user: User) {
        return await prisma.concrete_notification.findMany({
            where: {
                userId: getUserId(user)
            }
        });
    }
}