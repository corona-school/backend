import { Student, Pupil, Screener, Match_pool_run as MatchPoolRun } from '../generated';
import { Arg, Authorized, Ctx, Field, FieldResolver, ObjectType, Query, Resolver, Root, Int, Float } from 'type-graphql';
import {
    getStudents,
    getPupils,
    getStudentCount,
    getPupilCount,
    MatchPool as MatchPoolType,
    pools,
    getPoolRuns,
    getPoolStatistics,
    MatchPoolStatistics,
    confirmationRequestsToSend,
    getPupilsToRequestInterest,
    getInterestConfirmationRate,
} from '../../common/match/pool';
import { Role } from '../authorizations';
import { JSONResolver } from 'graphql-scalars';
import { SUBJECTS } from '../../common/util/subjectsutils';

@ObjectType()
class MatchPoolAutomatic {
    @Field()
    minStudents: number;
    @Field()
    minPupils: number;
}

@ObjectType()
class MatchPool {
    @Field()
    name: string;
    @Field({ nullable: true })
    automatic?: MatchPoolAutomatic;
    @Field({ nullable: true })
    confirmInterest?: boolean;
    @Field((type) => [String])
    toggles: string[];
}

@ObjectType()
class SubjectDemand {
    @Field()
    subject: string;
    @Field()
    demand: number;
}

@ObjectType()
class StatisticType implements MatchPoolStatistics {
    @Field((type) => JSONResolver)
    matchesByMonth: any;
    @Field()
    averageMatchesPerMonth: number;
    @Field()
    predictedPupilMatchTime: number;
    @Field((type) => [SubjectDemand])
    subjectDemand: SubjectDemand[];
}
@Resolver((of) => MatchPool)
export class FieldsMatchPoolResolver {
    @Query((returns) => [String])
    @Authorized(Role.UNAUTHENTICATED)
    subjects() {
        return SUBJECTS;
    }

    @Query((returns) => [MatchPool])
    @Authorized(Role.UNAUTHENTICATED)
    match_pools() {
        return pools;
    }

    @Query((returns) => MatchPool)
    @Authorized(Role.UNAUTHENTICATED)
    match_pool(@Arg('name') name: string) {
        return pools.find((it) => it.name === name);
    }

    @FieldResolver((returns) => [Student])
    @Authorized(Role.ADMIN)
    async studentsToMatch(
        @Root() matchPool: MatchPoolType,
        @Arg('toggles', (_type) => [String], { nullable: true }) toggles?: string[],
        @Arg('skip', { nullable: true }) skip?: number,
        @Arg('take', { nullable: true }) take?: number,
        @Arg('search', { nullable: true }) search?: string
    ) {
        return await getStudents(matchPool, toggles ?? [], take, skip, search);
    }

    @FieldResolver((returns) => [Pupil])
    @Authorized(Role.ADMIN)
    async pupilsToMatch(
        @Root() matchPool: MatchPoolType,
        @Arg('toggles', (_type) => [String], { nullable: true }) toggles?: string[],
        @Arg('skip', { nullable: true }) skip?: number,
        @Arg('take', { nullable: true }) take?: number,
        @Arg('search', { nullable: true }) search?: string
    ) {
        return await getPupils(matchPool, toggles ?? [], take, skip, search);
    }

    @FieldResolver((returns) => Int)
    @Authorized(Role.UNAUTHENTICATED)
    async studentsToMatchCount(@Root() matchPool: MatchPoolType, @Arg('toggles', (_type) => [String], { nullable: true }) toggles?: string[]) {
        return await getStudentCount(matchPool, toggles ?? []);
    }

    @FieldResolver((returns) => Int)
    @Authorized(Role.UNAUTHENTICATED)
    async pupilsToMatchCount(@Root() matchPool: MatchPoolType, @Arg('toggles', (_type) => [String], { nullable: true }) toggles?: string[]) {
        return await getPupilCount(matchPool, toggles ?? []);
    }

    @FieldResolver((returns) => [MatchPoolRun])
    @Authorized(Role.ADMIN)
    async runs(@Root() matchPool: MatchPoolType) {
        return await getPoolRuns(matchPool);
    }

    @FieldResolver((returns) => StatisticType)
    @Authorized(Role.UNAUTHENTICATED)
    async statistics(@Root() matchPool: MatchPoolType) {
        return await getPoolStatistics(matchPool);
    }

    @FieldResolver((returns) => Int)
    @Authorized(Role.ADMIN)
    async confirmationRequestsToSend(@Root() matchPool: MatchPoolType) {
        if (!matchPool.confirmInterest) {
            return 0;
        }

        return await confirmationRequestsToSend(matchPool);
    }

    @FieldResolver((returns) => [Pupil])
    @Authorized(Role.ADMIN)
    async pupilsToRequestInterest(@Root() matchPool: MatchPoolType) {
        if (!matchPool.confirmInterest) {
            return [];
        }

        return await getPupilsToRequestInterest(matchPool);
    }

    @Query((returns) => Float)
    @Authorized(Role.UNAUTHENTICATED)
    async interestConfirmationRate() {
        return await getInterestConfirmationRate();
    }
}
