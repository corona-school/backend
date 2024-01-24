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
    async subcourseMeetingJoin(@Ctx() context: GraphQLContext, @Arg('subcourseId') subcourseId: number) {
        const { user } = context;
        const subcourse = await prisma.subcourse.findUnique({ where: { id: subcourseId }, include: { course: true, lecture: true } });
        await hasAccess(context, 'Subcourse', subcourse);

        if (user.studentId) {
            const lecturesCount = subcourse.lecture.reduce((acc, lecture) => acc + (lecture.isCanceled ? 0 : 1), 0);
            await Notification.actionTaken(user, 'student_joined_subcourse_meeting', {
                relation: `subcourse/${subcourseId}`,
                subcourseLecturesCount: lecturesCount.toString(),
            });
            await Notification.actionTaken(user, 'student_presence_in_meeting', {
                relation: `subcourse/${subcourseId}`,
            });
        } else if (user.pupilId) {
            const lecturesCount = subcourse.lecture.reduce((acc, lecture) => acc + (lecture.declinedBy.includes(user.userID) ? 0 : 1), 0);
            await Notification.actionTaken(user, 'pupil_joined_subcourse_meeting', {
                relation: `subcourse/${subcourseId}`,
                subcourseLecturesCount: lecturesCount.toString(),
            });
            await Notification.actionTaken(user, 'pupil_presence_in_meeting', {
                relation: `subcourse/${subcourseId}`,
            });
        }

        return true;
    }
}
