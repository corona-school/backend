import { Student, Pupil, Screener } from "../generated";
import { Authorized, Ctx, FieldResolver, ObjectType, Query, Resolver } from "type-graphql";
import { getSessionPupil, getSessionScreener, getSessionStudent, getSessionUser, GraphQLUser } from "../authentication";
import { GraphQLContext } from "../context";
import { Role } from "../authorizations";
import { prisma } from "../../common/prisma";
@ObjectType()
export class Me {
    firstname?: string;
    lastname?: string;
    email?: string;

    pupil?: Pupil;
    student?: Student;
    screener?: Screener;
}

@Resolver(of => Me)
export class FieldMeResolver {
    @Query(returns => Me)
    @Authorized(Role.USER)
    async me(@Ctx() context: GraphQLContext): Promise<GraphQLUser> {
        return getSessionUser(context);
    }

    @FieldResolver(returns => String)
    @Authorized(Role.USER)
    async firstName(@Ctx() context: GraphQLContext): Promise<string> {
        return getSessionUser(context).firstName;
    }

    @FieldResolver(returns => String)
    @Authorized(Role.USER)
    async lastName(@Ctx() context: GraphQLContext): Promise<string> {
        return getSessionUser(context).lastName;
    }

    @FieldResolver(returns => String)
    @Authorized(Role.USER)
    async email(@Ctx() context: GraphQLContext): Promise<string> {
        return getSessionUser(context).email;
    }

    @FieldResolver(returns => Pupil)
    @Authorized(Role.USER)
    async pupil(@Ctx() context: GraphQLContext): Promise<Pupil> {
        const user = getSessionUser(context);
        if (!user.pupilId) {
            return null;
        }

        return await prisma.pupil.findUnique({ where: { id: user.pupilId }});
    }

    @FieldResolver(returns => Student)
    @Authorized(Role.USER)
    async student(@Ctx() context: GraphQLContext): Promise<Student> {
        const user = getSessionUser(context);
        if (!user.studentId) {
            return null;
        }

        return await prisma.student.findUnique({ where: { id: user.studentId }});
    }

    @FieldResolver(returns => Screener)
    @Authorized(Role.USER)
    async screener(@Ctx() context: GraphQLContext): Promise<Screener> {
        const user = getSessionUser(context);
        if (!user.screenerId) {
            return null;
        }

        return await prisma.screener.findUnique({ where: { id: user.screenerId }});
    }
}