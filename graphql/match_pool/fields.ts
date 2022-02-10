import { Student, Pupil, Screener } from "../generated";
import { Authorized, Ctx, Field, FieldResolver, ObjectType, Query, Resolver, Root, Int } from "type-graphql";
import { getStudents, getPupils, getStudentCount, getPupilCount, MatchPool as MatchPoolType, pools } from "../../common/match/pool";
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

    @FieldResolver(returns => [Student])
    @Authorized(Role.ADMIN)
    async studentsToMatch(@Root() matchPool: MatchPoolType) {
        return await getStudents(matchPool);
    }

    @FieldResolver(returns => [Pupil])
    @Authorized(Role.ADMIN)
    async pupilsToMatch(@Root() matchPool: MatchPoolType) {
        return await getPupils(matchPool);
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
}