import { Resolver, Query, Authorized, Ctx, FieldResolver, Root, Arg, InputType, Field, ObjectType } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { Lecture_feedback as LectureFeedback, Lecture } from '../generated';
import { Role } from '../../common/user/roles';
import { GraphQLContext } from '../context';
import { Prisma } from '@prisma/client';

@InputType()
export class AppointmentStartRange {
    @Field((type) => Date, { nullable: true })
    from?: Date;

    @Field((type) => Date, { nullable: true })
    to?: Date;
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

    @Query((returns) => [LectureFeedback])
    @Authorized(Role.ADMIN)
    async lectureFeedbacks(
        @Ctx() context: GraphQLContext,
        @Arg('userEmail', { nullable: true }) userEmail?: string,
        @Arg('appointmentStart', (type) => AppointmentStartRange, { nullable: true })
        appointmentStart?: AppointmentStartRange,
        @Arg('ratingContains', (type) => [Number], { nullable: true })
        ratingContains?: number[],
        @Arg('onlyWithComments', { nullable: true }) onlyWithComments?: boolean
    ) {
        const conditions: Prisma.Sql[] = [];

        // Filter by student/pupil email
        if (userEmail) {
            conditions.push(Prisma.sql`
            (
                (
                    lf."userId" LIKE 'student/%'
                    AND s."email" LIKE ${userEmail}
                )
                OR
                (
                    lf."userId" LIKE 'pupil/%'
                    AND p."email" LIKE ${userEmail}
                )
            )
        `);
        }

        // Filter by lecture start date
        if (appointmentStart?.from) {
            conditions.push(Prisma.sql`l."start" >= ${appointmentStart.from}`);
        }

        if (appointmentStart?.to) {
            conditions.push(Prisma.sql`l."start" <= ${appointmentStart.to}`);
        }

        // Filter by ratings
        if (ratingContains?.length) {
            conditions.push(Prisma.sql`lf."rating" IN (${Prisma.join(ratingContains)})`);
        }

        // "Comments" are basically tags startng with "Sonstiges:"
        if (onlyWithComments) {
            conditions.push(Prisma.sql`
            EXISTS (
                SELECT 1
                FROM unnest(lf."tags") AS tag
                WHERE tag LIKE 'Sonstiges:%'
            )
        `);
        }

        const where = conditions.length > 0 ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}` : Prisma.empty;

        const rows = await prisma.$queryRaw<{ id: number }[]>(Prisma.sql`
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
        `);

        return rows;
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
