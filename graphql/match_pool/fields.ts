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
    getPupilsToContactNext,
    getInterestConfirmationRate,
    validatePoolToggles,
    screeningInvitationsToSend,
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
    @Field({ nullable: true })
    needsScreening?: boolean;
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
        return await getStudents(matchPool, validatePoolToggles(matchPool, toggles ?? []), take, skip, search);
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
        return await getPupils(matchPool, validatePoolToggles(matchPool, toggles ?? []), take, skip, search);
    }

    @FieldResolver((returns) => Int)
    @Authorized(Role.UNAUTHENTICATED)
    async studentsToMatchCount(@Root() matchPool: MatchPoolType, @Arg('toggles', (_type) => [String], { nullable: true }) toggles?: string[]) {
        return await getStudentCount(matchPool, validatePoolToggles(matchPool, toggles ?? []));
    }

    @FieldResolver((returns) => Int)
    @Authorized(Role.UNAUTHENTICATED)
    async pupilsToMatchCount(@Root() matchPool: MatchPoolType, @Arg('toggles', (_type) => [String], { nullable: true }) toggles?: string[]) {
        return await getPupilCount(matchPool, validatePoolToggles(matchPool, toggles ?? []));
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
        if (!matchPool.toggles.includes('confirmation-unknown')) {
            return 0;
        }

        return await confirmationRequestsToSend(matchPool);
    }

    @FieldResolver((returns) => Int)
    @Authorized(Role.ADMIN)
    async screeningInvitationsToSend(@Root() matchPool: MatchPoolType) {
        if (!matchPool.toggles.includes('pupil-screening-pending')) {
            return 0;
        }

        return await screeningInvitationsToSend(matchPool);
    }

    @FieldResolver((returns) => [Pupil])
    @Authorized(Role.ADMIN)
    async pupilsToRequestInterest(@Root() matchPool: MatchPoolType) {
        if (!matchPool.toggles.includes('confirmation-unknown') && !matchPool.toggles.includes('pupil-screening-unknown')) {
            return [];
        }

        return await getPupilsToContactNext(matchPool, ['confirmation-unknown', 'pupil-screening-unknown'], await confirmationRequestsToSend(matchPool));
    }

    @FieldResolver((returns) => [Pupil])
    @Authorized(Role.ADMIN)
    async pupilsToScreen(@Root() matchPool: MatchPoolType) {
        if (!matchPool.toggles.includes('pupil-screening-unknown')) {
            return [];
        }

        return await getPupilsToContactNext(matchPool, ['confirmation-unknown', 'pupil-screening-unknown'], 1000);
    }

    @Query((returns) => Float)
    @Authorized(Role.UNAUTHENTICATED)
    async interestConfirmationRate() {
        return await getInterestConfirmationRate();
    }
}
