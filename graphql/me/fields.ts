import { Student, Pupil, Screener } from "../generated";
import { Authorized, Ctx, FieldResolver, ObjectType, Query, Resolver } from "type-graphql";
import { getSessionPupil, getSessionScreener, getSessionStudent, getSessionUser } from "../authentication";
import { GraphQLContext } from "../context";
import { Role } from "../authorizations";

@ObjectType()
class Me {
    firstName?: string;
    lastName?: string;
    email?: string;

    pupil?: Pupil;
    student?: Student;
    screener?: Screener;
}

@Resolver(of => Me)
export class FieldMeResolver {
    @Query()
    @Authorized(Role.STUDENT, Role.PUPIL, Role.SCREENER)
    async me(@Ctx() context: GraphQLContext): Promise<Me> {
        return getSessionUser(context);
    }

    @FieldResolver()
    @Authorized(Role.PUPIL)
    async pupil(@Ctx() context: GraphQLContext): Promise<Pupil> {
        return await getSessionPupil(context);
    }

    @FieldResolver()
    @Authorized(Role.STUDENT)
    async student(@Ctx() context: GraphQLContext): Promise<Student> {
        return await getSessionStudent(context);
    }

    @FieldResolver()
    @Authorized(Role.SCREENER)
    async screener(@Ctx() context: GraphQLContext): Promise<Screener> {
        return await getSessionScreener(context);
    }
}