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
    @Field({ nullable: true })
    helperCount?: number;
    @Field({ nullable: true })
    helpeeCount?: number;
    @Field({ nullable: true })
    edgeCount?: number;
    @Field({ nullable: true })
    matchCount?: number;
    @Field({ nullable: true })
    matchingCost?: number;
    @Field({ nullable: true })
    averageWaitingDaysMatchedHelpee?: number;
    @Field({ nullable: true })
    mostWaitingDaysUnmatchedHelpee?: number;
    @Field({ nullable: true })
    numberOfCoveredSubjects?: number;
    @Field({ nullable: true })
    numberOfUncoveredSubjects?: number;
    @Field({ nullable: true })
    numberOfOfferedSubjects?: number;
    @Field({ nullable: true })
    numberOfMatchingEdgesWithMatchingState?: number;
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
    async matchPoolRun(@Arg("name") name: string, @Arg("apply") apply: boolean, @Arg("toggles", _type => [String], { nullable: true }) toggles?: string[]) {
        return await runMatching(name, apply, toggles ?? []);
    }
}