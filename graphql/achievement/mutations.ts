import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { User_achievement as Achievement } from '../generated';
import { Role } from '../roles';
import * as Notification from '../../common/notification';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { prisma } from '../../common/prisma';

@Resolver(() => Achievement)
export class MutateAchievementResolver {
    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.OWNER)
    async matchMeetingJoin(@Ctx() context: GraphQLContext, @Arg('matchId') matchId: number) {
        const { user } = context;
        const match = await prisma.match.findUnique({ where: { id: matchId }, include: { pupil: true, student: true } });
        await hasAccess(context, 'Match', match);

        if (user.studentId) {
            await Notification.actionTaken(user, 'student_joined_match_meeting', {
                matchId: matchId.toString(),
                pupil: match.pupil,
                relation: `match/${matchId}`,
            });
        } else if (user.pupilId) {
            await Notification.actionTaken(user, 'pupil_joined_match_meeting', {
                matchId: matchId.toString(),
                relation: `match/${matchId}`,
            });
        }

        return true;
    }
}
