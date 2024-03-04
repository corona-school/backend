import { Pupil, Student } from '../generated';
import { Arg, Authorized, Field, Mutation, ObjectType, Resolver } from 'type-graphql';
import { addPupilScreenings as commonAddPupilScreenings, pools, runMatching } from '../../common/match/pool';
import { Role } from '../authorizations';

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
    requestedPriority: number;
    @Field()
    fulfilledRequests: number;
}

@ObjectType()
class MatchingSubjectNameStats {
    @Field()
    name: string;
    @Field((type) => MatchingSubjectStats)
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
    @Field((type) => [MatchingSubjectNameStats])
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
    @Field((type) => [TemporaryMatch])
    matches: TemporaryMatch[];
    @Field((type) => MatchingStats)
    stats: MatchingStats;
    @Field((type) => MatchingTiming)
    timing: MatchingTiming;
}

@Resolver((of) => MatchPoolRunResult)
export class MutateMatchPoolResolver {
    @Mutation((returns) => MatchPoolRunResult)
    @Authorized(Role.ADMIN)
    async matchPoolRun(@Arg('name') name: string, @Arg('apply') apply: boolean, @Arg('toggles', (_type) => [String], { nullable: true }) toggles?: string[]) {
        return await runMatching(name, apply, toggles ?? []);
    }

    @Mutation(() => Boolean)
    @Authorized(Role.ADMIN)
    async addPupilScreenings(@Arg('matchPool') poolName: string, @Arg('toSendCount') toSendCount: number) {
        const pool = pools.find((it) => it.name === poolName);
        if (!pool) {
            throw new Error(`Unknown Pool '${poolName}'`);
        }
        await commonAddPupilScreenings(pool, toSendCount);
        return true;
    }
}
