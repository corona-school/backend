import { Student, Pupil, Screener, Match_pool_run as MatchPoolRun } from "../generated";
import { Arg, Authorized, Ctx, Field, FieldResolver, ObjectType, Query, Resolver, Root, Int } from "type-graphql";
import { getStudents, getPupils, getStudentCount, getPupilCount, MatchPool as MatchPoolType, pools, getPoolRuns } from "../../common/match/pool";
import { Role } from "../authorizations";

@ObjectType()
class MatchPool {
    @Field()
    name: string;
}

@Resolver(of => MatchPool)
export class FieldsMatchPoolResolver {
    @Query(returns => [MatchPool])
    @Authorized(Role.ADMIN)
    match_pools() {
        return pools;
    }

    @Query(returns => MatchPool)
    @Authorized(Role.ADMIN)
    match_pool(@Arg("name") name: string) {
        return pools.find(it => it.name === name);
    }

    @FieldResolver(returns => [Student])
    @Authorized(Role.ADMIN)
    async studentsToMatch(@Root() matchPool: MatchPoolType, @Arg("skip", { nullable: true }) skip?: number, @Arg("take", { nullable: true }) take?: number) {
        return await getStudents(matchPool, take, skip);
    }

    @FieldResolver(returns => [Pupil])
    @Authorized(Role.ADMIN)
    async pupilsToMatch(@Root() matchPool: MatchPoolType, @Arg("skip", { nullable: true }) skip?: number, @Arg("take", { nullable: true }) take?: number) {
        return await getPupils(matchPool, take, skip);
    }

    @FieldResolver(returns => Int)
    @Authorized(Role.ADMIN)
    async studentsToMatchCount(@Root() matchPool: MatchPoolType) {
        return await getStudentCount(matchPool);
    }

    @FieldResolver(returns => Int)
    @Authorized(Role.ADMIN)
    async pupilsToMatchCount(@Root() matchPool: MatchPoolType) {
        return await getPupilCount(matchPool);
    }

    @FieldResolver(returns => MatchPoolRun)
    @Authorized(Role.ADMIN)
    async runs(@Root() matchPool: MatchPoolType) {
        return await getPoolRuns(matchPool);
    }
}