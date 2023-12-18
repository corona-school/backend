import { Arg, Authorized, Ctx, Mutation, Resolver } from 'type-graphql';
import { User_achievement as Achievement } from '../generated';
import { Role } from '../roles';
import * as Notification from '../../common/notification';
import { GraphQLContext } from '../context';
import { AuthorizedDeferred, hasAccess } from '../authorizations';
import { prisma } from '../../common/prisma';
import execute from '../../jobs/periodic/notification-courses-ended-yesterday';

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
    async subcourseMeetingJoin(@Ctx() context: GraphQLContext, @Arg('matchId') subcourseId: number) {
        const { user } = context;
        const subcourse = await prisma.subcourse.findUnique({ where: { id: subcourseId } });
        await hasAccess(context, 'Subcourse', subcourse);

        if (user.studentId) {
            await Notification.actionTaken(user, 'student_joined_subcourse_meeting', {
                subcourseId: subcourseId.toString(),
                relation: `subcourse/${subcourseId}`,
            });
        } else if (user.pupilId) {
            await Notification.actionTaken(user, 'pupil_joined_subcourse_meeting', {
                subcourseId: subcourseId.toString(),
                relation: `subcourse/${subcourseId}`,
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

    @Mutation((returns) => Boolean)
    @Authorized(Role.ADMIN, Role.USER)
    async courseEnded(@Ctx() context: GraphQLContext) {
        await execute();
        return true;
    }
}
