import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { User_achievement as Achievement } from '../generated';
import { Role } from '../roles';
import * as Notification from '../../common/notification';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { getMatch } from '../util';
import { verifyEmail } from '../../common/secret';

@Resolver(() => Achievement)
export class MutateAchievementResolver {
    @Mutation((returns) => Boolean)
    @AuthorizedDeferred(Role.ADMIN, Role.USER)
    async matchMeetingJoin(@Ctx() context: GraphQLContext, @Arg('matchId') matchId: number) {
        const { user } = context;
        const match = await getMatch(matchId);
        await hasAccess(context, 'Match', match);

        if (user.studentId) {
            await Notification.actionTaken(user, 'student_joined_match_meeting', {
                matchId: matchId.toString(),
            });
        } else if (user.pupilId) {
            await Notification.actionTaken(user, 'pupil_joined_match_meeting', {
                matchId: matchId.toString(),
            });
        }

        return true;
    }

    // ! - Just for testing
    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.USER)
    async verifiedEmail(@Ctx() context: GraphQLContext) {
        if (context.user.studentId) {
            await Notification.actionTaken(context.user, 'student_registration_verified_email', {});
        } else if (context.user.pupilId) {
            await Notification.actionTaken(context.user, 'pupil_registration_verified_email', {});
        }
        return true;
    }
}
