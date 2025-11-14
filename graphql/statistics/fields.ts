import { Role } from '../authorizations';
import { Arg, Authorized, Field, FieldResolver, Float, Int, ObjectType, Query, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { course_category_enum, dissolve_reason, pupil_screening_status_enum, student_screening_status_enum as ScreeningStatus } from '@prisma/client';
import { GraphQLInt, GraphQLString } from 'graphql';
import moment from 'moment-timezone';

@ObjectType()
class ByMonth {
    @Field({ nullable: true }) // null on invalid dates
    year?: number;
    @Field({ nullable: true })
    month?: number;
    @Field({ nullable: true })
    value?: number;

    @Field({ nullable: true })
    group?: string;
}

@ObjectType()
class Bucket {
    @Field()
    from: number;
    @Field()
    to: number;
    @Field()
    value: number;
    @Field()
    label: string;
}

@ObjectType()
class DataWithTrends {
    @Field()
    label: string;
    @Field()
    value: number;
    @Field((type) => Float)
    trend: number;
}

@ObjectType()
class Statistics {
    @Field({ nullable: true })
    from: string; // ISO Date String
    @Field({ nullable: true })
    to: string; // ISO Date String
}

@ObjectType()
class MedianTimeToMatch {
    @Field((type) => Float)
    median_days_pupil: number;

    @Field((type) => Float)
    median_days_student: number;
}

const ONE_DAY_MILLIS = 24 * 3600 * 1000;

const getStudentScreeningStatusNumber = (status: ScreeningStatus) => {
    switch (status) {
        case ScreeningStatus.pending:
            return '0';
        case ScreeningStatus.success:
            return '1';
        case ScreeningStatus.rejection:
            return '2';
        case ScreeningStatus.missed:
            return '3';
        default:
            throw new Error('Invalid screening status');
    }
};

@Resolver((of) => Statistics)
export class StatisticsResolver {
    @Query((returns) => Statistics)
    @Authorized(Role.ADMIN)
    statistics(
        @Arg('from', () => GraphQLString, { nullable: true }) from = '1970-01-01',
        @Arg('to', () => GraphQLString, { nullable: true }) to = '3000-01-01'
    ): Statistics {
        return { from, to };
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async helperRegistrations(@Root() statistics: Statistics) {
        const result = await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                                     date_part('year', "createdAt"::date)  AS year,
                                                     date_part('month', "createdAt"::date) AS month
                                              FROM "student"
                                              WHERE "verifiedAt" is NOT NULL
                                                AND "createdAt" > ${statistics.from}::timestamp
                                                AND "createdAt" < ${statistics.to}::timestamp
                                              GROUP BY "year", "month"
                                              ORDER BY "year" ASC, "month" ASC;`;
        console.log(result);
        return result;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async helperRegistrationsByState(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             "state"                               AS group
                                      FROM "student"
                                      WHERE "verifiedAt" is NOT  NULL
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "state"
                                      ORDER BY "year" ASC, "month" ASC, "state" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async helperRegistrationsByJob(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                   date_part('year', "createdAt"::date)  AS year,
                   date_part('month', "createdAt"::date) AS month,
                   "jobStatus" AS group
            FROM (
                SELECT student."createdAt", screening."jobStatus" as "jobStatus" FROM student
                LEFT JOIN screening on screening."studentId" = student.id
                WHERE "verifiedAt" is NOT NULL
                  AND student."createdAt" > ${statistics.from}::timestamp
                  AND student."createdAt" < ${statistics.to}::timestamp
                  AND screening."jobStatus" IS NOT NULL
                UNION
                SELECT student."createdAt", instructor_screening."jobStatus" as "jobStatus" FROM student
                LEFT JOIN instructor_screening on instructor_screening."studentId" = student.id
                WHERE "verifiedAt" is NOT NULL
                  AND student."createdAt" > ${statistics.from}::timestamp
                  AND student."createdAt" < ${statistics.to}::timestamp
                  AND instructor_screening."jobStatus" IS NOT NULL
            ) as "student"
            GROUP BY "year", "month", "jobStatus"
            ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async helperRegistrationsByUniversity(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             "university"                          AS group
                                      FROM "student"
                                      WHERE "verifiedAt" is NOT NULL
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "university"
                                      ORDER BY "year" ASC, "month" ASC, "university" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async pupilRegistrations(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month
                                      FROM "pupil"
                                      WHERE "verifiedAt" is NOT NULL
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async pupilRegistrationsByState(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             "state"                               as group
                                      FROM "pupil"
                                      WHERE "verifiedAt" is NOT NULL
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "state"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async pupilRegistrationsBySchooltype(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             "schooltype"                          as group
                                      FROM "pupil"
                                      WHERE "verifiedAt" is NOT NULL
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "schooltype"
                                      ORDER BY "year" ASC, "month" ASC, "schooltype" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async pupilRegistrationsByGrade(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             "grade"                               as group
                                      FROM "pupil"
                                      WHERE "verifiedAt" is NOT NULL
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "grade"
                                      ORDER BY "year" ASC, "month" ASC, "grade" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async registeredHelpersHavingScreening(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                           date_part('year', student."createdAt"::date)  AS year,
                                           date_part('month', student."createdAt"::date) AS month
                                    FROM student
                                             LEFT JOIN screening on screening."studentId" = student.id
                                             LEFT JOIN instructor_screening on instructor_screening."studentId" = student.id
                                    WHERE student."createdAt" > ${statistics.from}::timestamp
                                      AND student."createdAt" < ${statistics.to}::timestamp
                                      AND (screening."createdAt" IS NOT NULL OR instructor_screening."createdAt" IS NOT NULL)
                                    GROUP BY "year", "month"
                                    ORDER BY "year" ASC, "month" ASC`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async tutorScreenings(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                           date_part('year', "createdAt"::date)  AS year,
                                           date_part('month', "createdAt"::date) AS month
                                     FROM "screening"
                                     WHERE "createdAt" > ${statistics.from}::timestamp
                                       AND "createdAt" < ${statistics.to}::timestamp
                                    GROUP BY "year", "month"
                                    ORDER BY "year" ASC, "month" ASC`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async instructorScreenings(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                           date_part('year', "createdAt"::date)  AS year,
                                           date_part('month', "createdAt"::date) AS month
                                     FROM "instructor_screening"
                                     WHERE "createdAt" > ${statistics.from}::timestamp
                                       AND "createdAt" < ${statistics.to}::timestamp
                                    GROUP BY "year", "month"
                                    ORDER BY "year" ASC, "month" ASC`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async nowMatches(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month
                                      FROM "match"
                                      WHERE "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    /*
    Number of pupils that had their first match in a certain month
     */
    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async nowFirstMatches(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`
            SELECT count(*)::INT as value,
                   date_part('year', first_match."createdAt"::date)  AS year,
                   date_part('month', first_match."createdAt"::date) AS month
            FROM (
                     SELECT "createdAt", "pupilId",
                            ROW_NUMBER() OVER (PARTITION BY "pupilId" ORDER BY "createdAt") AS row_num
                     FROM match
                 ) AS first_match
            WHERE row_num = 1
                AND "createdAt" >= ${statistics.from}::timestamp
                AND "createdAt" < ${statistics.to}::timestamp
            GROUP BY "year", "month"
            ORDER BY "year" ASC, "month" ASC;`;
    }

    /*
    Number of students that had their first match in a certain month
    */
    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async nowFirstMatchesStudent(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`
            SELECT count(*)::INT as value,
                   date_part('year', first_match."createdAt"::date)  AS year,
                   date_part('month', first_match."createdAt"::date) AS month
            FROM (
                     SELECT "createdAt", "studentId",
                            ROW_NUMBER() OVER (PARTITION BY "studentId" ORDER BY "createdAt") AS row_num
                     FROM match
                 ) AS first_match
            WHERE row_num = 1
                AND "createdAt" >= ${statistics.from}::timestamp
                AND "createdAt" < ${statistics.to}::timestamp
            GROUP BY "year", "month"
            ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async nowDissolvedMatchesBeforeThreeMonths(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', coalesce("dissolvedAt", "updatedAt")::date)  AS year,
                                             date_part('month', coalesce("dissolvedAt", "updatedAt")::date) AS month
                                      FROM "match"
                                      WHERE dissolved = TRUE
                                        AND date_part('day', coalesce("dissolvedAt", "updatedAt")::timestamp - "createdAt"::timestamp) <= 90
                                        AND coalesce("dissolvedAt", "updatedAt") > ${statistics.from}::timestamp
                                        AND coalesce("dissolvedAt", "updatedAt") < ${statistics.to}::timestamp
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async nowDissolvedMatchesAfterThreeMonths(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', coalesce("dissolvedAt", "updatedAt")::date)  AS year,
                                             date_part('month', coalesce("dissolvedAt", "updatedAt")::date) AS month
                                      FROM "match"
                                      WHERE dissolved = TRUE
                                        AND date_part('day', coalesce("dissolvedAt", "updatedAt")::timestamp - "createdAt"::timestamp) > 90
                                        AND coalesce("dissolvedAt", "updatedAt") > ${statistics.from}::timestamp
                                        AND coalesce("dissolvedAt", "updatedAt") < ${statistics.to}::timestamp
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async offeredLectures(@Root() statistics: Statistics, @Arg('category', (type) => course_category_enum) category: course_category_enum) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                     AS value,
                                             date_part('year', "start"::date)  AS year,
                                             date_part('month', "start"::date) AS month
                                      FROM "lecture"
                                      LEFT JOIN "subcourse" on lecture."subcourseId" = subcourse.id
                                      LEFT JOIN "course" on subcourse."courseId" = course.id
                                      WHERE "start" > ${statistics.from}::timestamp
                                        AND "start" < ${statistics.to}::timestamp
                                        AND "appointmentType" = 'group'
                                        AND course.category = ${category}::course_category_enum
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async offeredCoursePlaces(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT "year", "month", SUM("subcourse"."maxParticipants")::INT AS value
                                      FROM (SELECT DISTINCT ON ("subcourseId") "subcourseId",
                                                                               "start",
                                                                               date_part('year', "start"::date)  AS "year",
                                                                               date_part('month', "start"::date) AS "month"
                                            FROM "lecture"
                                            WHERE "start" > ${statistics.from}::timestamp
                                              AND "start" < ${statistics.to}::timestamp
                                            ORDER BY "subcourseId", "start") "first_lecture"
                                               INNER JOIN "subcourse" ON "subcourse"."id" = "subcourseId"
                                      GROUP BY "year", "month"
                                      ORDER BY "year", "month";`;
    }

    @FieldResolver(() => [ByMonth])
    @Authorized(Role.ADMIN)
    async numSubcourses(@Root() statistics: Statistics, @Arg('category', (type) => course_category_enum) category: course_category_enum) {
        return await prisma.$queryRaw`SELECT count(*)::INT as value,
                date_part('year', first_lecture."start"::date)  AS year,
                date_part('month', first_lecture."start"::date) AS month
            FROM (SELECT "start", "subcourseId",
                   ROW_NUMBER() OVER (PARTITION BY "subcourseId" ORDER BY "start") AS row_num
                  FROM lecture) as first_lecture
            LEFT JOIN subcourse ON first_lecture."subcourseId" = subcourse.id
            LEFT JOIN course ON subcourse."courseId" = course.id
            WHERE row_num = 1
                AND course."courseState" = 'allowed'
                AND course.category = ${category}::course_category_enum
                AND first_lecture."start" >= ${statistics.from}::timestamp
                AND first_lecture."start" < ${statistics.to}::timestamp
            GROUP BY "year", "month"
            ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver(() => Int)
    @Authorized(Role.ADMIN)
    async numPupilsAtLeastOneMatch(@Root() statistics: Statistics) {
        return await prisma.pupil.count({
            where: {
                match: { some: {} },
                AND: [{ createdAt: { gte: new Date(statistics.from) } }, { createdAt: { lt: new Date(statistics.to) } }],
            },
        });
    }

    @FieldResolver(() => Int)
    @Authorized(Role.ADMIN)
    async numStudentsAtLeastOneMatch(@Root() statistics: Statistics) {
        return await prisma.student.count({
            where: {
                match: { some: {} },
                AND: [{ createdAt: { gte: new Date(statistics.from) } }, { createdAt: { lt: new Date(statistics.to) } }],
            },
        });
    }

    @FieldResolver(() => Int)
    @Authorized(Role.ADMIN)
    async numPupilsOnWaitingList(@Root() statistics: Statistics) {
        const enrollments: { value: number }[] = await prisma.$queryRaw`SELECT COUNT(DISTINCT "pupilId")::int AS value
            FROM "waiting_list_enrollment"
            WHERE "createdAt" >= ${statistics.from}::timestamp AND "createdAt" < ${statistics.to}::timestamp;`;
        return enrollments[0].value;
    }

    @FieldResolver(() => Int)
    @Authorized(Role.ADMIN)
    async numCourseAppointments(@Root() statistics: Statistics, @Arg('category', { nullable: true }) category?: course_category_enum) {
        return await prisma.lecture.count({
            where: {
                appointmentType: 'group',
                subcourse: category != null ? { course: { category: { equals: category } } } : undefined,
                AND: [{ createdAt: { gte: new Date(statistics.from) } }, { createdAt: { lt: new Date(statistics.to) } }],
            },
        });
    }

    @FieldResolver(() => [Bucket])
    @Authorized(Role.ADMIN)
    async tutorLifetime(@Root() statistics: Statistics, @Arg('onlyInactive') onlyInactive: boolean) {
        const lifetimes: { student_id: number; lifetime: number }[] = await prisma.$queryRaw`
            WITH first_action AS (
                SELECT
                    student.id as student_id,
                    MIN(screening."createdAt") as first_screening
                FROM
                    student
                LEFT JOIN screening on screening."studentId" = student.id
                WHERE screening.status = ${getStudentScreeningStatusNumber(ScreeningStatus.success)}::student_screening_status_enum
                GROUP BY student.id
            ),
            last_action AS (
                SELECT
                    student.id as student_id,
                    GREATEST(
                        student."firstMatchRequest",
                        MAX(match."createdAt"),
                        MAX(lecture.start)
                    ) as last_action
                FROM student
                LEFT JOIN match on match."studentId" = student.id
                LEFT JOIN lecture on lecture."matchId" = match.id
                WHERE student.active = TRUE AND student."isStudent" = TRUE
                AND (${onlyInactive} = false OR (
                    NOT EXISTS (
                        SELECT 1 FROM match WHERE match."studentId" = student.id AND match.dissolved = FALSE
                    ) AND
                    NOT EXISTS (
                        SELECT 1 FROM subcourse
                        LEFT JOIN subcourse_instructors_student instructor ON instructor."subcourseId" = subcourse.id
                        LEFT JOIN lecture ON lecture."subcourseId" = subcourse.id
                        WHERE instructor."studentId" = student.id AND lecture.start > ${statistics.to}::timestamp
                    )
                ))
                GROUP BY
                    student.id
            )
            SELECT
                last_action.student_id,
                EXTRACT(EPOCH FROM (last_action.last_action - first_action.first_screening)) as lifetime
            FROM first_action
            JOIN last_action ON first_action.student_id = last_action.student_id
            WHERE first_action.first_screening >= ${statistics.from}::timestamp
            AND last_action.last_action < ${statistics.to}::timestamp
            `;

        const buckets: Bucket[] = [
            {
                from: 0,
                to: 14 * ONE_DAY_MILLIS,
                value: 0,
                label: '0-14 Tage',
            },
            {
                from: 14 * ONE_DAY_MILLIS,
                to: 28 * ONE_DAY_MILLIS,
                value: 0,
                label: '14-28 Tage',
            },
            {
                from: 28 * ONE_DAY_MILLIS,
                to: 60 * ONE_DAY_MILLIS,
                value: 0,
                label: '28-60 Tage',
            },
            {
                from: 60 * ONE_DAY_MILLIS,
                to: 120 * ONE_DAY_MILLIS,
                value: 0,
                label: '60-120 Tage',
            },
            {
                from: 120 * ONE_DAY_MILLIS,
                to: 300 * ONE_DAY_MILLIS,
                value: 0,
                label: '120-300 Tage',
            },
            {
                from: 300 * ONE_DAY_MILLIS,
                to: -1,
                value: 0,
                label: '300+ Tage',
            },
        ];
        lifetimes.forEach(({ student_id, lifetime }) => {
            if (lifetime > 0) {
                // sometimes, the initial screening took place after the last action for historical purposes, we don't want to count those accounts...
                buckets.find((b) => b.from <= lifetime * 1000 && (b.to > lifetime * 1000 || b.to === -1)).value += 1;
            }
        });
        return buckets;
    }

    @FieldResolver(() => [Bucket])
    @Authorized(Role.ADMIN)
    async timeCommitment(@Root() statistics: Statistics) {
        const matches = await prisma.match.findMany({
            where: { AND: [{ createdAt: { gte: new Date(statistics.from) } }, { createdAt: { lt: new Date(statistics.to) } }] },
            orderBy: { createdAt: 'asc' },
        });
        const intervals = new Map<number, number>();
        for (const match of matches) {
            if (match.dissolved && match.dissolvedAt == null) {
                continue;
            }
            let dateUntil;
            if (!match.dissolved || match.dissolvedAt < match.createdAt) {
                dateUntil = new Date();
            } else {
                dateUntil = match.dissolvedAt;
            }
            const matchDuration = dateUntil.getTime() - match.createdAt.getTime();

            intervals.set(match.studentId, matchDuration + (intervals.get(match.studentId) ?? 0));
        }
        const buckets: Bucket[] = [
            {
                from: 0,
                to: 14 * ONE_DAY_MILLIS,
                value: 0,
                label: '0-14 Tage',
            },
            {
                from: 14 * ONE_DAY_MILLIS,
                to: 28 * ONE_DAY_MILLIS,
                value: 0,
                label: '14-28 Tage',
            },
            {
                from: 28 * ONE_DAY_MILLIS,
                to: 60 * ONE_DAY_MILLIS,
                value: 0,
                label: '28-60 Tage',
            },
            {
                from: 60 * ONE_DAY_MILLIS,
                to: 120 * ONE_DAY_MILLIS,
                value: 0,
                label: '60-120 Tage',
            },
            {
                from: 120 * ONE_DAY_MILLIS,
                to: 300 * ONE_DAY_MILLIS,
                value: 0,
                label: '120-300 Tage',
            },
            {
                from: 300 * ONE_DAY_MILLIS,
                to: -1,
                value: 0,
                label: '300+ Tage',
            },
        ];
        intervals.forEach((duration, key) => {
            buckets.find((b) => b.from <= duration && (b.to > duration || b.to === -1)).value += 1;
        });
        return buckets;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async attendedCoursePlaces(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT "year", "month", SUM("participants")::INT AS "value"
                                      FROM (SELECT "year",
                                                   "month",
                                                   "subcourse"."id" AS "subcourseId",
                                                   COUNT(*)::INT    AS "participants"
                                            FROM (SELECT DISTINCT ON ("subcourseId") "subcourseId",
                                                                                     "start",
                                                                                     date_part('year', "start"::date)  AS "year",
                                                                                     date_part('month', "start"::date) AS "month"
                                                  FROM "lecture"
                                                  WHERE "start" > ${statistics.from}::timestamp
                                                    AND "start" < ${statistics.to}::timestamp
                                                  ORDER BY "subcourseId", "start") "first_lecture"
                                                     INNER JOIN "subcourse" ON "subcourse"."id" = "subcourseId"
                                                     INNER JOIN "subcourse_participants_pupil"
                                                                ON "subcourse_participants_pupil"."subcourseId" = "subcourse"."id"
                                            GROUP BY "year", "month", "subcourse"."id") "subcourse_participants"
                                      GROUP BY "year", "month"
                                      ORDER BY "year", "month";`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async pupilsParticipatingInCourses(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT "year", "month", COUNT(DISTINCT "pupilId")::INT AS "value"
                                      FROM (SELECT "year", "month", "subcourse_participants_pupil"."pupilId"
                                            FROM (SELECT DISTINCT ON ("subcourseId") "subcourseId",
                                                                                     "start",
                                                                                     date_part('year', "start"::date)  AS "year",
                                                                                     date_part('month', "start"::date) AS "month"
                                                  FROM "lecture"
                                                  WHERE "start" > ${statistics.from}::timestamp
                                                    AND "start" < ${statistics.to}::timestamp
                                                  ORDER BY "subcourseId", "start") "first_lecture"
                                                     INNER JOIN "subcourse" ON "subcourse"."id" = "subcourseId"
                                                     INNER JOIN "subcourse_participants_pupil"
                                                                ON "subcourse_participants_pupil"."subcourseId" = "subcourse"."id"
                                            GROUP BY "year", "month", "subcourse_participants_pupil"."pupilId") "subcourse_participants"
                                      GROUP BY "year", "month"
                                      ORDER BY "year", "month";`;
    }

    @FieldResolver((returns) => Float)
    @Authorized(Role.ADMIN)
    async averageMatchesOfTutee(@Root() statistics: Statistics) {
        const tuteesWithMatch = await prisma.pupil.count({
            where: {
                isPupil: true,
                match: { some: { AND: [{ createdAt: { gte: new Date(statistics.from) } }, { createdAt: { lt: new Date(statistics.to) } }] } },
            },
        });
        if (tuteesWithMatch === 0) {
            return -1;
        }
        const matchesTotal = await prisma.match.count({
            where: { AND: [{ createdAt: { gte: new Date(statistics.from) } }, { createdAt: { lt: new Date(statistics.to) } }] },
        });

        return matchesTotal / tuteesWithMatch;
    }

    @FieldResolver((returns) => Float)
    @Authorized(Role.ADMIN)
    async averageMatchesOfTutors(@Root() statistics: Statistics) {
        const tutorsWithMatch = await prisma.student.count({
            where: {
                isStudent: true,
                match: { some: { AND: [{ createdAt: { gte: new Date(statistics.from) } }, { createdAt: { lt: new Date(statistics.to) } }] } },
            },
        });
        if (tutorsWithMatch === 0) {
            return -1;
        }
        const matchesTotal = await prisma.match.count({
            where: { AND: [{ createdAt: { gte: new Date(statistics.from) } }, { createdAt: { lt: new Date(statistics.to) } }] },
        });

        return matchesTotal / tutorsWithMatch;
    }

    @FieldResolver((returns) => Int)
    @Authorized(Role.ADMIN)
    async activeMatches() {
        return await prisma.match.count({ where: { dissolved: false } });
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async knowsCoronaSchoolFrom(@Root() statistics: Statistics, @Arg('type') type: 'pupil' | 'student') {
        if (type === 'pupil') {
            return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                                   date_part('year', "createdAt"::date)  AS year,
                                                   date_part('month', "createdAt"::date) AS month,
                                                   "knowsCoronaSchoolFrom"               AS group
                                            FROM (
                                                     SELECT pupil_screening."createdAt", "pupilId", "knowsCoronaSchoolFrom",
                                                            ROW_NUMBER() OVER (PARTITION BY "pupilId" ORDER BY pupil_screening."createdAt") AS row_num
                                                     FROM "pupil_screening"
                                                     JOIN pupil p ON pupil_screening."pupilId" = p.id
                                                     WHERE "knowsCoronaSchoolFrom" IS NOT NULL
                                                       AND p."createdAt" > ${statistics.from}::timestamp
                                                       AND p."createdAt" < ${statistics.to}::timestamp
                                                 ) as query
                                            WHERE row_num = 1
                                            GROUP BY "year", "month", "knowsCoronaSchoolFrom"
                                            ORDER BY "year" ASC, "month" ASC, "knowsCoronaSchoolFrom" ASC;`;
        }
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             "knowsCoronaSchoolFrom"               AS group
                                      FROM "screening"
                                      WHERE "status" = ${getStudentScreeningStatusNumber(ScreeningStatus.success)}::student_screening_status_enum
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "knowsCoronaSchoolFrom"
                                      ORDER BY "year" ASC, "month" ASC, "knowsCoronaSchoolFrom" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async interestConfirmationsByState(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             "status"                              AS group
                                      FROM "pupil_tutoring_interest_confirmation_request"
                                      WHERE "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "status"
                                      ORDER BY "year" ASC, "month" ASC, "status" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async pupilScreenings(@Root() statistics: Statistics, @Arg('status') status: pupil_screening_status_enum) {
        let statusNum;
        switch (status) {
            case 'pending': {
                statusNum = '0';
                break;
            }
            case 'success': {
                statusNum = '1';
                break;
            }
            case 'rejection': {
                statusNum = '2';
                break;
            }
            case 'dispute': {
                statusNum = '3';
                break;
            }
            default: {
                throw new Error('Invalid status');
            }
        }

        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month
                                      FROM "pupil_screening"
                                      WHERE "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                        AND "status" = ${statusNum}::pupil_screening_status_enum
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    /*
    out of all tutors that should have turned in their CoC (max 8 weeks after screening) within the selected timeframe, how many actually did it?
     */
    @FieldResolver((returns) => Float)
    @Authorized(Role.ADMIN)
    async rateSuccessfulCoCsTutors(@Root() statistics: Statistics) {
        const mustHaveTurnedInCoC = await prisma.$queryRaw`
            SELECT count(*)::int FROM screening
            WHERE ("createdAt" + INTERVAL '8 weeks') BETWEEN ${statistics.from}::timestamp AND ${statistics.to}::timestamp;
        `;
        if (mustHaveTurnedInCoC[0].count === 0) {
            return -1;
        }

        const actuallyTurnedIn = await prisma.$queryRaw`
            SELECT count(*)::int FROM screening
                 LEFT JOIN certificate_of_conduct ON certificate_of_conduct."studentId" = screening."studentId"
            WHERE (screening."createdAt" + INTERVAL '8 weeks') BETWEEN ${statistics.from}::timestamp AND ${statistics.to}::timestamp
                AND certificate_of_conduct."studentId" IS NOT NULL
                AND certificate_of_conduct."createdAt" BETWEEN (screening."createdAt") AND (screening."createdAt" + INTERVAL '8 weeks');
        `;

        return actuallyTurnedIn[0].count / mustHaveTurnedInCoC[0].count;
    }

    /*
    out of all instructors that should have turned in their CoC (max 8 weeks after screening) within the selected timeframe, how many actually did it?
     */
    @FieldResolver((returns) => Float)
    @Authorized(Role.ADMIN)
    async rateSuccessfulCoCsInstructors(@Root() statistics: Statistics) {
        const mustHaveTurnedInCoC = await prisma.$queryRaw`
            SELECT count(*)::int FROM instructor_screening
            WHERE ("createdAt" + INTERVAL '8 weeks') BETWEEN ${statistics.from}::timestamp AND ${statistics.to}::timestamp;
        `;
        if (mustHaveTurnedInCoC[0].count === 0) {
            return -1;
        }
        const actuallyTurnedIn = await prisma.$queryRaw`
            SELECT count(*)::int FROM instructor_screening
                 LEFT JOIN certificate_of_conduct ON certificate_of_conduct."studentId" = instructor_screening."studentId"
            WHERE (instructor_screening."createdAt" + INTERVAL '8 weeks') BETWEEN ${statistics.from}::timestamp AND ${statistics.to}::timestamp
                AND certificate_of_conduct."studentId" IS NOT NULL
                AND certificate_of_conduct."createdAt" BETWEEN (instructor_screening."createdAt") AND (instructor_screening."createdAt" + INTERVAL '8 weeks');
        `;

        return actuallyTurnedIn[0].count / mustHaveTurnedInCoC[0].count;
    }

    @FieldResolver(() => Float)
    @Authorized(Role.ADMIN)
    async rateDissolvedMatchesLasted30Days(@Root() statistics: Statistics) {
        const numTotalDissolvedMatches = (
            await prisma.$queryRaw`
            SELECT count(*)::int FROM match
            WHERE
                "dissolvedAt" BETWEEN ${statistics.from}::timestamp AND ${statistics.to}::timestamp
                AND dissolved = TRUE`
        )[0].count;
        if (numTotalDissolvedMatches === 0) {
            return -1;
        }
        const numLastedLongerThan30Days = (
            await prisma.$queryRaw`
            SELECT count(*)::int FROM match
            WHERE
                "dissolvedAt" BETWEEN ${statistics.from}::timestamp AND ${statistics.to}::timestamp
                AND dissolved = TRUE
                AND "dissolvedAt" - "createdAt" >= INTERVAL '30 days';
        `
        )[0].count;
        return numLastedLongerThan30Days / numTotalDissolvedMatches;
    }

    @FieldResolver((returns) => Float)
    @Authorized(Role.ADMIN)
    async ratePupilsInTargetAudience(@Root() statistics: Statistics) {
        const numPupils = await prisma.pupil.count({
            where: {
                AND: [{ createdAt: { gte: new Date(statistics.from) } }, { createdAt: { lt: new Date(statistics.to) } }],
            },
        });

        if (numPupils === 0) {
            return -1;
        }

        const successfulScreeningsCount: { value: number }[] = await prisma.$queryRaw`SELECT COUNT(DISTINCT "pupilId")::int AS value
            FROM "pupil_screening"
            WHERE "status" = '1' AND "createdAt" >= ${statistics.from}::timestamp AND "createdAt" < ${statistics.to}::timestamp;
        `;

        return successfulScreeningsCount[0].value / numPupils;
    }

    @FieldResolver((returns) => Int)
    @Authorized(Role.ADMIN)
    async numDissolvedMatchesByReason(@Root() statistics, @Arg('reason') reason: dissolve_reason) {
        return await prisma.match.count({
            where: {
                dissolveReasons: { has: reason },
                AND: [{ dissolvedAt: { gte: new Date(statistics.from) } }, { dissolvedAt: { lt: new Date(statistics.to) } }],
            },
        });
    }

    @FieldResolver((returns) => [DataWithTrends])
    @Authorized(Role.ADMIN)
    async dissolvedMatches(@Root() statistics: Statistics) {
        const selectedDuration = moment(statistics.to).diff(moment(statistics.from), 'days') + 1; // include start
        const averages: { average_matches: number; dissolve_reason: string }[] = await prisma.$queryRaw`
                    SELECT AVG(value) AS average_matches,
                   "indDissolveReason" as dissolve_reason
            FROM (
                     SELECT COUNT(*)::INT AS value,
                            "indDissolveReason",
                            date_part('year', "dissolvedAt"::date)  AS year,
                            date_part('month', "dissolvedAt"::date) AS month
                     FROM "match", UNNEST("dissolveReasons") as "indDissolveReason" /* dissolveReasons is an array, we want to count every single reason each month. UNNEST splits a row with the array into several rows with the specific array entries */
                     WHERE dissolved = TRUE
                       AND "dissolvedAt" >= '2022-01-01'::timestamp
                       AND "dissolvedAt" < ${statistics.from}::timestamp
                     GROUP BY "year", "month", "indDissolveReason"
                 ) AS dissolved_reasons
            GROUP BY "indDissolveReason"
            ORDER BY average_matches;
        `;

        const data: { value: number; reason: string }[] = await prisma.$queryRaw`
            SELECT count(*)::int as value,
                "singleDissolveReason" as reason
            FROM "match", UNNEST("dissolveReasons") as "singleDissolveReason"
            WHERE dissolved = TRUE
                AND "dissolvedAt" >= ${statistics.from}::timestamp
                AND "dissolvedAt" < ${statistics.to}::timestamp
            GROUP BY "singleDissolveReason"
            ORDER BY "singleDissolveReason" DESC;
        `;

        return data.map(({ reason, value }) => {
            const avg = averages.find((a) => a.dissolve_reason === reason)?.average_matches;
            let trend: number;
            if (avg) {
                trend = value / ((avg / 30) * selectedDuration) - 1.0;
            } else {
                trend = -1;
            }
            // the average is an average over a month; we need an average for the selected number of days.
            return {
                label: reason,
                value,
                trend,
            };
        });
    }

    /*
    Bucketed durations of matches that were created after the specified start date and were dissolved before the specified end date.
     */
    @FieldResolver(() => [Bucket])
    @Authorized(Role.ADMIN)
    async matchesByDuration(@Root() statistics: Statistics) {
        const buckets: Bucket[] = [
            {
                from: 0,
                to: 14 * ONE_DAY_MILLIS,
                value: 0,
                label: '0-14 Tage',
            },
            {
                from: 14 * ONE_DAY_MILLIS,
                to: 28 * ONE_DAY_MILLIS,
                value: 0,
                label: '14-28 Tage',
            },
            {
                from: 28 * ONE_DAY_MILLIS,
                to: 60 * ONE_DAY_MILLIS,
                value: 0,
                label: '28-60 Tage',
            },
            {
                from: 60 * ONE_DAY_MILLIS,
                to: 120 * ONE_DAY_MILLIS,
                value: 0,
                label: '60-120 Tage',
            },
            {
                from: 120 * ONE_DAY_MILLIS,
                to: 300 * ONE_DAY_MILLIS,
                value: 0,
                label: '120-300 Tage',
            },
            {
                from: 300 * ONE_DAY_MILLIS,
                to: -1,
                value: 0,
                label: '300+ Tage',
            },
        ];

        const matches = await prisma.match.findMany({
            where: {
                dissolved: true,
                AND: [{ createdAt: { gte: new Date(statistics.from) } }, { dissolvedAt: { lt: new Date(statistics.to) } }],
            },
        });

        matches.forEach((match) => {
            if (match.dissolvedAt == null) {
                return;
            }
            const duration = match.dissolvedAt.getTime() - match.createdAt.getTime();
            buckets.find((b) => b.from <= duration && (b.to > duration || b.to === -1)).value += 1;
        });
        return buckets;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async notificationsSent(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                      AS value,
                                             date_part('year', "sentAt"::date)  AS year,
                                             date_part('month', "sentAt"::date) AS month,
                                             "state"                            AS group
                                      FROM "concrete_notification"
                                      WHERE "sentAt" > ${statistics.from}::timestamp
                                        AND "sentAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "state"
                                      ORDER BY "year" ASC, "month" ASC, "state" ASC;`;
    }

    @FieldResolver((returns) => Int)
    @Authorized(Role.ADMIN)
    async loginsToday() {
        const beginingOfTheDay = new Date();
        beginingOfTheDay.setHours(0);
        beginingOfTheDay.setMinutes(0);

        return await prisma.secret.count({ where: { lastUsed: { gte: beginingOfTheDay } } });
    }

    @FieldResolver(() => MedianTimeToMatch)
    @Authorized(Role.ADMIN, Role.USER)
    async medianTimeToMatch() {
        return (
            await prisma.$queryRaw`
            SELECT
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY duration_student) AS median_days_student,
                PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY duration_pupil) AS median_days_pupil
            FROM (
                SELECT
                    (EXTRACT(EPOCH FROM ("createdAt" - "studentFirstMatchRequest"))/86400)::int AS duration_student,
                    (EXTRACT(EPOCH FROM ("createdAt" - "pupilFirstMatchRequest"))/86400)::int AS duration_pupil
                FROM
                    match
                WHERE
                    "createdAt" >= now() - INTERVAL '1 month'
            ) AS durations;`
        )[0];
    }

    @FieldResolver(() => [ByMonth])
    @Authorized(Role.ADMIN)
    async deactivationReasons(@Root() statistics: Statistics, @Arg('type') type: 'pupil' | 'student') {
        if (type !== 'pupil' && type !== 'student') {
            throw new Error('Invalid account type');
        }
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                      AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             (data::json)->>'deactivationReason' AS group
                                      FROM "log"
                                      WHERE logtype = 'deActivate'
                                        AND starts_with("userID", ${type})
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", (data::json)->>'deactivationReason'
                                      ORDER BY "year" ASC, "month" ASC, (data::json)->>'deactivationReason' ASC;`;
    }

    @FieldResolver(() => [ByMonth])
    @Authorized(Role.ADMIN)
    async pupilsHoursSupported(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`
            WITH lecture_hours AS (
                SELECT
                    EXTRACT(YEAR FROM l."start")::int AS year,
                    EXTRACT(MONTH FROM l."start")::int AS month,
                    SUM(
                        l."duration" * CASE 
                            WHEN l."appointmentType" = 'match' THEN 1
                            ELSE COALESCE(array_length(l."participantIds", 1), 0)
                        END
                    )::float AS total_minutes
                FROM lecture l
                LEFT JOIN subcourse sc ON l."subcourseId" = sc."id"
                LEFT JOIN course c ON sc."courseId" = c."id"
                WHERE
                    (l."isCanceled" IS NULL OR l."isCanceled" = FALSE)
                    AND l."start" >= ${statistics.from}::timestamp
                    AND l."start" < ${statistics.to}::timestamp
                    AND l."appointmentType" IN ('group', 'match')
                    AND (
                        c."id" IS NULL
                        OR (
                            c."courseState" = 'allowed'
                            AND sc."cancelled" = FALSE
                            AND c."name" NOT LIKE '%Hausaufgabenhilfe%'
                            AND c."name" <> 'Mathematiksprechstunde'
                        )
                    )
                GROUP BY year, month
            )
            SELECT
                year,
                month,
                total_minutes / 60 AS value
            FROM lecture_hours
            ORDER BY year, month;
    `;
    }

    @FieldResolver(() => [ByMonth])
    @Authorized(Role.ADMIN)
    async matchSuccessRate(@Root() statistics: Statistics, @Arg('minCompletedLectures', () => GraphQLInt) minCompletedLectures: number) {
        return await prisma.$queryRaw`
            WITH monthly_stats AS (
                SELECT
                    DATE_TRUNC('month', m."createdAt") AS cohort_month,
                    COUNT(m.id) AS total_matches,
                    COUNT(CASE WHEN l_count >= ${minCompletedLectures} THEN m.id END) AS successful_matches
                FROM match m
                LEFT JOIN (
                    SELECT 
                        l."matchId",
                        COUNT(*) AS l_count
                    FROM lecture l
                    WHERE l."appointmentType" = 'match'
                    AND l."isCanceled" = FALSE
                    GROUP BY l."matchId"
                ) l ON l."matchId" = m.id
                WHERE m."createdAt" BETWEEN ${statistics.from}::timestamp AND ${statistics.to}::timestamp
                GROUP BY cohort_month
            ),
            rates AS (
                SELECT
                    cohort_month,
                    EXTRACT(YEAR FROM cohort_month) AS year,
                    EXTRACT(MONTH FROM cohort_month)::int AS month,
                    ROUND((successful_matches::numeric / NULLIF(total_matches, 0)) * 100, 2) AS success_rate
                FROM monthly_stats
            )
            SELECT
                year,
                month,
                success_rate AS value
            FROM rates
            ORDER BY year, month;
    `;
    }

    @FieldResolver(() => [ByMonth])
    @Authorized(Role.ADMIN)
    async activeMatchesByMonth(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`
        SELECT
            EXTRACT(YEAR FROM l."start")::int AS year,
            EXTRACT(MONTH FROM l."start")::int AS month,
            COUNT(DISTINCT m."id")::int AS value
        FROM match m
        JOIN lecture l 
        ON l."matchId" = m."id"
        WHERE l."start" BETWEEN ${statistics.from}::timestamp AND ${statistics.to}::timestamp
        AND l."isCanceled" = FALSE
        AND l."appointmentType" = 'match'
        GROUP BY year, month
        ORDER BY year, month;
    `;
    }

    @FieldResolver(() => [ByMonth])
    @Authorized(Role.ADMIN)
    async uniquePupilsByMonth(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`
        SELECT
            EXTRACT(YEAR FROM l."start")::int AS year,
            EXTRACT(MONTH FROM l."start")::int AS month,
            COUNT(DISTINCT split_part(p_id, '/', 2)::int) AS value
        FROM lecture l
        LEFT JOIN subcourse sc 
            ON sc."id" = l."subcourseId"
        LEFT JOIN course c 
            ON c."id" = sc."courseId"
        CROSS JOIN UNNEST(l."participantIds") AS t(p_id)
        WHERE l."isCanceled" = FALSE
            AND l."start" >= ${statistics.from}::timestamp
            AND l."start" < ${statistics.to}::timestamp
            AND l."appointmentType" IN ('group', 'match')
            AND (
                c."id" IS NULL
                OR (
                    c."courseState" = 'allowed'
                    AND sc."cancelled" = FALSE
                )
            )
        GROUP BY year, month
        ORDER BY year, month;
        `;
    }

    @FieldResolver(() => [ByMonth])
    @Authorized(Role.ADMIN)
    async uniqueStudentsByMonth(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`
        SELECT
            EXTRACT(YEAR FROM l."start")::int AS year,
            EXTRACT(MONTH FROM l."start")::int AS month,
            COUNT(DISTINCT split_part(s_id, '/', 2)::int) AS value
        FROM lecture l
        LEFT JOIN subcourse sc ON sc."id" = l."subcourseId"
        LEFT JOIN course c  ON c."id" = sc."courseId"
        CROSS JOIN UNNEST(l."organizerIds") AS t(s_id)
        WHERE l."isCanceled" = FALSE
        AND l."start" >= ${statistics.from}::timestamp
        AND l."start" < ${statistics.to}::timestamp
        AND l."appointmentType" IN ('group', 'match')
        AND (
            c."id" IS NULL
            OR (
                c."courseState" = 'allowed'
                AND sc."cancelled" = FALSE
            )
        )
        GROUP BY year, month
        ORDER BY year, month;
        `;
    }
}
