import { Resolver, Query, Authorized, Ctx, FieldResolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Lecture_feedback as LectureFeedback } from '../generated';
import { Role } from '../../common/user/roles';
import { GraphQLContext } from '../context';

@Resolver((of) => LectureFeedback)
export class LectureFeedbackFieldsResolver {
    @Query((returns) => [LectureFeedback])
    @Authorized(Role.STUDENT, Role.PUPIL)
    async pendingLectureFeedbacks(@Ctx() context: GraphQLContext) {
        const pendingLectureFeedback = await prisma.lecture_feedback.findMany({
            where: {
                userId: context.user.userID,
                status: 'pending',
                lecture: { isCanceled: false },
            },
            include: { lecture: true },
        });
        const readyForFeedback = pendingLectureFeedback.filter((feedback) => {
            const lecture = feedback.lecture;
            const isLectureInThePast = lecture.start < new Date();
            const hasMultipleParticipants = lecture.joinedBy.length > 1;
            return isLectureInThePast && hasMultipleParticipants;
        });
        return readyForFeedback;
    }

    @FieldResolver((returns) => Boolean)
    @Authorized(Role.OWNER)
    async isReadyForFeedback(@Root() feedback: LectureFeedback) {
        const lecture = await prisma.lecture.findUniqueOrThrow({ where: { id: feedback.lectureId } });
        // For now it's ok if the meeting is currently taking place
        const isLectureInThePast = lecture.start < new Date();
        const hasMultipleParticipants = lecture.joinedBy.length > 1;
        const isNotCanceled = !lecture.isCanceled;
        const isPendingOrDismissed = feedback.status === 'pending' || feedback.status === 'dismissed';
        return isLectureInThePast && hasMultipleParticipants && isNotCanceled && isPendingOrDismissed;
    }
}
