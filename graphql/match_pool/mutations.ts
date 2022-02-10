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
class MatchingSubjectStats {
    @Field()
    offered: number;
    @Field()
    requested: number;
    @Field()
    fulfilledRequests: number;
}

@ObjectType()
class MatchingSubjectNameStats {
    @Field()
    name: string;
    @Field(type => MatchingSubjectStats)
    stats: MatchingSubjectStats;
}
@ObjectType()
class MatchingStats {
    @Field()
    helperCount: number;
    @Field()
    helpeeCount: number;
    @Field()
    edgeCount: number;
    @Field()
    matchCount: number;
    @Field()
    matchingCost: number;
    @Field()
    averageWaitingDaysMatchedHelpee: number;
    @Field()
    mostWaitingDaysUnmatchedHelpee: number;
    @Field()
    numberOfCoveredSubjects: number;
    @Field()
    numberOfUncoveredSubjects: number;
    @Field()
    numberOfOfferedSubjects: number;
    @Field()
    numberOfMatchingEdgesWithMatchingState: number;
    @Field(type => [MatchingSubjectNameStats])
    subjectStats: MatchingSubjectNameStats[];
    
}

@ObjectType()
class MatchingTiming {
    @Field()
    preparation: number;
    @Field()
    matching: number;
    @Field()
    commit: number;
}
@ObjectType()
class MatchPoolRunResult {
    @Field(type => [TemporaryMatch])
    matches: TemporaryMatch[];
    @Field(type => MatchingStats)
    stats: MatchingStats;
    @Field(type => MatchingTiming)
    timing: MatchingTiming;
}

@Resolver(of => MatchPoolRunResult)
export class MutateMatchPoolResolver {
    @Mutation(returns => MatchPoolRunResult)
    @Authorized(Role.ADMIN)
    async matchPoolRun(@Arg("name") name: string, @Arg("apply") apply: boolean) {
        return await runMatching(name, apply);
    }
}