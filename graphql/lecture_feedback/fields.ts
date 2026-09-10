import { Resolver, Query, Authorized, Ctx, FieldResolver, Root, Arg, Field, ObjectType, Int } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Lecture_feedback as LectureFeedback, Lecture } from '../generated';
import { Role } from '../../common/user/roles';
import { GraphQLContext } from '../context';
import { Prisma } from '@prisma/client';
import { AppointmentStartRange, buildLectureFeedbackQueryConditions, getLectureFeedbackStats } from '../../common/lecture-feedback';

@ObjectType()
class LectureFeedbackStats {
    @Field((type) => Int)
    totalFeedback: number;

    @Field((type) => Number, { nullable: true })
    averageRating: number | null;

    @Field((type) => Int)
    criticalCount: number;

    @Field((type) => Int)
    freeTextCount: number;

    @Field((type) => Int)
    studentFeedbackCount: number;

    @Field((type) => Int)
    pupilFeedbackCount: number;
}

@ObjectType()
export class LectureFeedbacksResponse {
    @Field((type) => [LectureFeedback])
    items: LectureFeedback[];

    @Field((type) => Int)
    totalCount: number;

    @Field((type) => LectureFeedbackStats, { nullable: true })
    stats: LectureFeedbackStats;
}

@Resolver((of) => LectureFeedback)
export class LectureFeedbackFieldsResolver {
    @FieldResolver((returns) => Lecture, { nullable: true })
    @Authorized(Role.OWNER, Role.APPOINTMENT_PARTICIPANT, Role.ADMIN)
    async lecture(@Root() appointment: LectureFeedback) {
        if (!appointment.lectureId) {
            return null;
        }

        return await prisma.lecture.findUnique({
            where: { id: appointment.lectureId },
        });
    }

    @Query((returns) => LectureFeedbacksResponse)
    @Authorized(Role.ADMIN)
    async lectureFeedbacks(
        @Ctx() context: GraphQLContext,
        @Arg('userEmail', { nullable: true }) userEmail?: string,
        @Arg('appointmentStart', (type) => AppointmentStartRange, { nullable: true })
        appointmentStart?: AppointmentStartRange,
        @Arg('ratingContains', (type) => [Number], { nullable: true })
        ratingContains?: number[],
        @Arg('onlyWithComments', { nullable: true }) onlyWithComments?: boolean,
        @Arg('take', { nullable: true, defaultValue: 100 }) take?: number,
        @Arg('skip', { nullable: true, defaultValue: 0 }) skip?: number
    ) {
        const where = buildLectureFeedbackQueryConditions(userEmail, appointmentStart, ratingContains, onlyWithComments);

        const rows = await prisma.$queryRaw<LectureFeedback[]>(Prisma.sql`
            SELECT lf.*
            FROM "lecture_feedback" lf

            LEFT JOIN "lecture" l
                ON l."id" = lf."lectureId"

            LEFT JOIN "student" s
                ON lf."userId" = 'student/' || s."id"::text

            LEFT JOIN "pupil" p
                ON lf."userId" = 'pupil/' || p."id"::text

            ${where}

            ORDER BY lf."createdAt" DESC
            LIMIT ${take}
            OFFSET ${skip}
        `);

        const [{ count }] = await prisma.$queryRaw<{ count: number }[]>(Prisma.sql`
            SELECT COUNT(*) AS count
            FROM "lecture_feedback" lf

            LEFT JOIN "lecture" l
                ON l."id" = lf."lectureId"

            LEFT JOIN "student" s
                ON lf."userId" = 'student/' || s."id"::text

            LEFT JOIN "pupil" p
                ON lf."userId" = 'pupil/' || p."id"::text

            ${where}
        `);

        const stats = await getLectureFeedbackStats(userEmail, appointmentStart, ratingContains, onlyWithComments);
        return {
            feedbacks: rows,
            totalCount: Number(count),
            stats,
        };
    }

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
