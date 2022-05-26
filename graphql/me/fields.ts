import { Student, Pupil, Screener, Secret } from "../generated";
import { Authorized, Ctx, Field, FieldResolver, ObjectType, Query, Resolver } from "type-graphql";
import { getSessionPupil, getSessionScreener, getSessionStudent, getSessionUser, GraphQLUser } from "../authentication";
import { GraphQLContext } from "../context";
import { Role } from "../authorizations";
import { prisma } from "../../common/prisma";
import { getSecrets } from "../../common/secret";
@ObjectType()
export class Me {
    @Field({ nullable: true })
    firstname?: string;
    @Field({ nullable: true })
    lastname?: string;
    @Field({ nullable: true })
    email?: string;

    @Field({ nullable: true })
    pupil?: Pupil;
    @Field({ nullable: true })
    student?: Student;
    @Field({ nullable: true })
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
    async firstname(@Ctx() context: GraphQLContext): Promise<string> {
        return getSessionUser(context).firstname;
    }

    @FieldResolver(returns => String)
    @Authorized(Role.USER)
    async lastname(@Ctx() context: GraphQLContext): Promise<string> {
        return getSessionUser(context).lastname;
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

    @FieldResolver(returns => [Secret])
    @Authorized(Role.USER)
    async secrets(@Ctx() context: GraphQLContext) {
        return await getSecrets(getSessionUser(context));
    }
}