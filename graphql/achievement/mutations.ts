import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { User_achievement as Achievement } from '../generated';
import { Role } from '../roles';
import * as Notification from '../../common/notification';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { prisma } from '../../common/prisma';
import { RelationTypeEnum } from '../../common/achievement/types';

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
                relation: `${RelationTypeEnum.MATCH}/${matchId}`,
            });
            await Notification.actionTaken(user, 'student_joined_match_meeting_global', {
                matchId: matchId.toString(),
                relation: RelationTypeEnum.GLOBAL_MATCH,
                pupil: match.pupil,
            });
        } else if (user.pupilId) {
            await Notification.actionTaken(user, 'pupil_joined_match_meeting', {
                matchId: matchId.toString(),
                student: match.student,
                relation: `${RelationTypeEnum.MATCH}/${matchId}`,
            });
            await Notification.actionTaken(user, 'pupil_joined_match_meeting_global', {
                matchId: matchId.toString(),
                relation: RelationTypeEnum.GLOBAL_MATCH,
                student: match.student,
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
