import { Arg, Authorized, Ctx, Int, Mutation, Resolver } from 'type-graphql';
import * as GraphQLModel from '../generated/models';
import { AuthorizedDeferred, hasAccess, Role } from '../authorizations';
import { getMatch, getPupil, getStudent } from '../util';
import { dissolveMatch, reactivateMatch } from '../../common/match/dissolve';
import { createMatch } from '../../common/match/create';
import { GraphQLContext } from '../context';
import { ConcreteMatchPool, pools } from '../../common/match/pool';
import { getMatcheeConversation, markConversationAsWriteable } from '../../common/chat';
import { JSONResolver } from 'graphql-scalars';
import { createAdHocMeeting } from '../../common/appointment/create';
import { AuthenticationError } from '../error';

@Resolver((of) => GraphQLModel.Match)
export class MutateMatchResolver {
    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async matchAdd(@Arg('pupilId') pupilId: number, @Arg('studentId') studentId: number, @Arg('poolName') poolName: string): Promise<boolean> {
        const pupil = await getPupil(pupilId);
        const student = await getStudent(studentId);
        const pool = pools.find((it) => it.name === poolName);
        if (!pool) {
            throw new Error(`Unknown MatchPool(${poolName})`);
        }

        await createMatch(pupil, student, pool as ConcreteMatchPool);

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

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN)
    async matchReactivate(@Ctx() context: GraphQLContext, @Arg('matchId', (type) => Int) matchId: number): Promise<boolean> {
        const match = await getMatch(matchId);
        await hasAccess(context, 'Match', match);
        await reactivateMatch(match);
        const { conversation, conversationId } = await getMatcheeConversation({ studentId: match.studentId, pupilId: match.pupilId });

        if (conversation) {
            await markConversationAsWriteable(conversationId);
        }
        return true;
    }

    @Mutation((returns) => JSONResolver, { nullable: true })
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async matchCreateAdHocMeeting(@Ctx() context: GraphQLContext, @Arg('matchId', (type) => Int) matchId: number) {
        const { user } = context;
        const match = await getMatch(matchId);
        await hasAccess(context, 'Match', match);

        if (user.studentId) {
            const { id, appointmentType } = await createAdHocMeeting(matchId, user);
            return { id, appointmentType };
        }
        throw new AuthenticationError(`User is not allowed to create ad-hoc meeting for match ${matchId}`);
    }
}
