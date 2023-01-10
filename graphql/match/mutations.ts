import { prisma } from '../../common/prisma';
import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import * as GraphQLModel from '../generated/models';
import { AuthorizedDeferred, hasAccess, Role } from '../authorizations';
import { getMatch, getStudent } from '../util';
import { dissolveMatch } from '../../common/match/dissolve';
import { createMatch } from '../../common/match/create';
import { GraphQLContext } from '../context';
import { ConcreteMatchPool, pools } from '../../common/match/pool';
import { removeInterest } from '../../common/match/interest';

@Resolver((of) => GraphQLModel.Match)
export class MutateMatchResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async matchAdd(@Arg('pupilId') pupilId: number, @Arg('studentId') studentId: number, @Arg('poolName') poolName: string): Promise<boolean> {
        const pupil = await prisma.pupil.findUnique({
            where: { id: pupilId },
            include: { pupil_tutoring_interest_confirmation_request: true },
            rejectOnNotFound: true,
        });
        const student = await getStudent(studentId);
        const pool = pools.find((it) => it.name === poolName);
        if (!pool) {
            throw new Error(`Unknown MatchPool(${poolName})`);
        }

        await createMatch(pupil, student, pool as ConcreteMatchPool);

        await removeInterest(pupil);
        return true;
    }

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async matchDissolve(@Ctx() context: GraphQLContext, @Arg('matchId') matchId: number, @Arg('dissolveReason') dissolveReason: number): Promise<boolean> {
        const match = await getMatch(matchId);
        await hasAccess(context, 'Match', match);

        await dissolveMatch(match, dissolveReason, /* dissolver:*/ null);

        return true;
    }
}
