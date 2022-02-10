import { Student, Pupil, Screener } from "../generated";
import { Authorized, Ctx, Field, FieldResolver, ObjectType, Query, Resolver, Root, Int, Mutation, Arg } from "type-graphql";
import { getStudents, getPupils, getStudentCount, getPupilCount, MatchPool as MatchPoolType, pools, runMatching } from "../../common/match/pool";
import { Role } from "../authorizations";

@ObjectType()
class TemporaryMatch {
    @Field()
    pupil: Pupil;
    @Field()
    student: Student;
}

@ObjectType()
class MatchPoolRunResult {
    @Field()
    matches: TemporaryMatch[];

}

@Resolver(of => MatchPoolRunResult)
export class MutateMatchPoolResolver {
    @Mutation(returns => MatchPoolRunResult)
    @Authorized(Role.ADMIN)
    async matchPoolRun(@Arg() name: string, @Arg() apply: boolean) {
        return await runMatching(name, apply);
    }
}