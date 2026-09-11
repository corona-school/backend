import { lecture as Appointment, lecture_feedback as LectureFeedback, Prisma } from '@prisma/client';
import { Field, InputType } from 'type-graphql';
import { getLogger } from '../logger/logger';
import { prisma } from '../prisma';

const logger = getLogger('Lecture Feedback');

interface CreateLectureFeedbackDefaults {
    status?: LectureFeedback['status'];
    tags?: LectureFeedback['tags'];
    rating?: LectureFeedback['rating'];
}

@InputType()
export class AppointmentStartRange {
    @Field((type) => Date, { nullable: true })
    from?: Date;

    @Field((type) => Date, { nullable: true })
    to?: Date;
}

export const createLectureFeedback = async (appointment: Appointment, defaults?: CreateLectureFeedbackDefaults) => {
    const participants = appointment.participantIds;
    const organizers = appointment.organizerIds;
    const feedbackCount = await prisma.lecture_feedback.count({
        where: { lectureId: appointment.id },
    });
    if (feedbackCount === 0) {
        await prisma.lecture_feedback.createMany({
            data: participants.concat(organizers).map((userId) => ({
                lectureId: appointment.id,
                userId,
                status: defaults?.status ?? 'pending',
                tags: defaults?.tags,
                rating: defaults?.rating,
            })),
        });
    } else {
        logger.warn(`Lecture Feedback already exists for Appointment(${appointment.id}), skipping creation.`);
    }
};

export const deleteNonSubmittedLectureFeedback = async (appointment: Appointment) => {
    const deletedCount = await prisma.lecture_feedback.deleteMany({
        where: { lectureId: appointment.id, status: { in: ['pending', 'dismissed'] } },
    });
    logger.info(`Deleted ${deletedCount.count} non-submitted Lecture Feedback for Appointment(${appointment.id}).`);
};

export const buildLectureFeedbackQueryConditions = (
    userEmail?: string,
    appointmentStart?: AppointmentStartRange,
    ratingContains?: number[],
    onlyWithComments?: boolean
) => {
    const conditions: Prisma.Sql[] = [];

    // Filter by student/pupil email
    if (userEmail) {
        conditions.push(Prisma.sql`
            (
                (
                    lf."userId" LIKE 'student/%'
                    AND s."email" LIKE ${`%${userEmail}%`}
                )
                OR
                (
                    lf."userId" LIKE 'pupil/%'
                    AND p."email" LIKE ${`%${userEmail}%`}
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

    // Comments are basically tags starting with "Sonstiges:"
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
    return where;
};

export const getLectureFeedbackStats = async (
    userEmail?: string,
    appointmentStart?: AppointmentStartRange,
    ratingContains?: number[],
    onlyWithComments?: boolean
) => {
    const [stats] = await prisma.$queryRaw<{ [key: string]: number | null }[]>(Prisma.sql`
        SELECT
            COUNT(*)::int AS "totalFeedback",

            AVG(lf."rating")::float AS "averageRating",

            COUNT(*) FILTER (
                WHERE lf."rating" IN (1, 2)
            )::int AS "criticalCount",

            COUNT(*) FILTER (
                WHERE EXISTS (
                    SELECT 1
                    FROM unnest(lf."tags") AS tag
                    WHERE tag LIKE 'Sonstiges:%'
                )
            )::int AS "freeTextCount",

            COUNT(*) FILTER (
                WHERE lf."userId" LIKE 'student/%'
            )::int AS "studentFeedbackCount",

            COUNT(*) FILTER (
                WHERE lf."userId" LIKE 'pupil/%'
            )::int AS "pupilFeedbackCount"

        FROM "lecture_feedback" lf

        LEFT JOIN "lecture" l
            ON l."id" = lf."lectureId"

        LEFT JOIN "student" s
            ON lf."userId" = 'student/' || s."id"::text

        LEFT JOIN "pupil" p
            ON lf."userId" = 'pupil/' || p."id"::text

        ${buildLectureFeedbackQueryConditions(userEmail, appointmentStart, ratingContains, onlyWithComments)}
    `);
    return stats;
};
