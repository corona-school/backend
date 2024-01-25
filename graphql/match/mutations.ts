import * as TypeGraphQL from 'type-graphql';
import { Arg, Authorized, Ctx, InputType, Int, Mutation, Resolver } from 'type-graphql';
import * as GraphQLModel from '../generated/models';
import * as Notification from '../../common/notification';
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
import { dissolved_by_enum } from '@prisma/client';
import { dissolve_reason } from '../generated';
import { prisma } from '../../common/prisma';

@InputType()
class MatchDissolveInput {
    @TypeGraphQL.Field((_type) => Int)
    matchId!: number;
    @TypeGraphQL.Field((_type) => [dissolve_reason])
    dissolveReasons!: dissolve_reason[];
}

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
    async matchDissolve(@Ctx() context: GraphQLContext, @Arg('info') info: MatchDissolveInput): Promise<boolean> {
        const match = await getMatch(info.matchId);
        await hasAccess(context, 'Match', match);

        let dissolvedBy: dissolved_by_enum;
        let dissolver = null;
        if (context.user.pupilId != null) {
            dissolvedBy = dissolved_by_enum.pupil;
            dissolver = await prisma.pupil.findUnique({ where: { id: context.user.pupilId } });
        } else if (context.user.studentId != null) {
            dissolvedBy = dissolved_by_enum.student;
            dissolver = await prisma.student.findUnique({ where: { id: context.user.studentId } });
        } else {
            dissolvedBy = dissolved_by_enum.admin;
        }

        await dissolveMatch(match, info.dissolveReasons, dissolver, dissolvedBy);
        return true;
    }

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN)
    async matchReactivate(@Arg('matchId', (type) => Int) matchId: number): Promise<boolean> {
        const match = await getMatch(matchId);
        await reactivateMatch(match);
        const { conversation, conversationId } = await getMatcheeConversation({
            studentId: match.studentId,
            pupilId: match.pupilId,
        });

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

    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async matchMeetingJoin(@Ctx() context: GraphQLContext, @Arg('matchId') matchId: number) {
        const { user } = context;
        const match = await prisma.match.findUnique({ where: { id: matchId }, include: { pupil: true, student: true } });
        await hasAccess(context, 'Match', match);

        if (user.studentId) {
            await Notification.actionTaken(user, 'student_joined_match_meeting', {
                relation: `match/${matchId}`,
            });
        } else if (user.pupilId) {
            await Notification.actionTaken(user, 'pupil_joined_match_meeting', {
                relation: `match/${matchId}`,
            });
        }

        return true;
    }
}
