import { Role } from '../authorizations';
import { Arg, Authorized, Field, FieldResolver, Float, Int, ObjectType, Query, Resolver, Root } from 'type-graphql';
import { prisma } from '../../common/prisma';
import { PrerequisiteError } from '../../common/util/error';
import { course_category_enum, dissolve_reason, pupil_screening_status_enum } from '@prisma/client';
import { GraphQLString } from 'graphql';

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
class Statistics {
    @Field({ nullable: true })
    from: string; // ISO Date String
    @Field({ nullable: true })
    to: string; // ISO Date String
}

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
    async tutorRegistrations(@Root() statistics: Statistics) {
        const result = await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                                     date_part('year', "createdAt"::date)  AS year,
                                                     date_part('month', "createdAt"::date) AS month
                                              FROM "student"
                                              WHERE "isStudent" = TRUE
                                                AND "createdAt" > ${statistics.from}::timestamp
                                                AND "createdAt" < ${statistics.to}::timestamp
                                              GROUP BY "year", "month"
                                              ORDER BY "year" ASC, "month" ASC;`;
        console.log(result);
        return result;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async tutorRegistrationsByState(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             "state"                               AS group
                                      FROM "student"
                                      WHERE "isStudent" = TRUE
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "state"
                                      ORDER BY "year" ASC, "month" ASC, "state" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async tutorRegistrationsByUniversity(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             "university"                          AS group
                                      FROM "student"
                                      WHERE "isStudent" = TRUE
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "university"
                                      ORDER BY "year" ASC, "month" ASC, "university" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async tuteeRegistrations(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month
                                      FROM "pupil"
                                      WHERE "isPupil" = TRUE
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async tuteeRegistrationsByState(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             "state"                               as group
                                      FROM "pupil"
                                      WHERE "isPupil" = TRUE
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "state"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async tuteeRegistrationsBySchooltype(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             "schooltype"                          as group
                                      FROM "pupil"
                                      WHERE "isPupil" = TRUE
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "schooltype"
                                      ORDER BY "year" ASC, "month" ASC, "schooltype" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async tuteeRegistrationsByGrade(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             "grade"                               as group
                                      FROM "pupil"
                                      WHERE "isPupil" = TRUE
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month", "grade"
                                      ORDER BY "year" ASC, "month" ASC, "grade" ASC;`;
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
                                      ORDER BY "year" ASC, "month" ASC;`;
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

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async nowFirstMatches(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month
                                      FROM "match"
                                      WHERE "pupilId" IN
                                            (SELECT "pupilId" FROM "match" GROUP BY "pupilId" HAVING COUNT(*)::INT = 1)
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async nowFirstMatchesStudent(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month
                                      FROM "match"
                                      WHERE "studentId" IN (SELECT "studentId"
                                                            FROM "match"
                                                            GROUP BY "studentId"
                                                            HAVING COUNT(*)::INT = 1)
                                        AND "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async nowDissolvedMatchesBeforeThreeMonths(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "updatedAt"::date)  AS year,
                                             date_part('month', "updatedAt"::date) AS month
                                      FROM "match"
                                      WHERE dissolved = TRUE
                                        AND date_part('day', "updatedAt"::timestamp - "createdAt"::timestamp) <= 90
                                        AND "updatedAt" > ${statistics.from}::timestamp
                                        AND "updatedAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async nowDissolvedMatchesAfterThreeMonths(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "updatedAt"::date)  AS year,
                                             date_part('month', "updatedAt"::date) AS month
                                      FROM "match"
                                      WHERE dissolved = TRUE
                                        AND date_part('day', "updatedAt"::timestamp - "createdAt"::timestamp) > 90
                                        AND "updatedAt" > ${statistics.from}::timestamp
                                        AND "updatedAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    // Doesn't work for now as the dissolved reason is completely messed up

    // @FieldResolver((returns) => [ByMonth])
    // @Authorized(Role.ADMIN)
    // async nowDissolvedMatchesByReason(@Root() statistics: Statistics) {
    //    return await prisma.$queryRaw`SELECT
    //            COUNT(*)::INT AS value,
    //            date_part('year', "updatedAt"::date) AS year,
    //            date_part('month', "updatedAt"::date) AS month,
    //            "dissolveReason" as group
    //        FROM "match"
    //            WHERE dissolved = TRUE AND "updatedAt" > ${statistics.from}::timestamp AND "updatedAt" < ${statistics.to}::timestamp
    //            GROUP BY "year", "month", "dissolveReason"
    //            ORDER BY "year" ASC, "month" ASC, "dissolveReason" ASC;`;
    // }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async offeredLectures(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                     AS value,
                                             date_part('year', "start"::date)  AS year,
                                             date_part('month', "start"::date) AS month
                                      FROM "lecture"
                                      WHERE "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
                                      GROUP BY "year", "month"
                                      ORDER BY "year" ASC, "month" ASC;`;
    }

    @FieldResolver((returns) => [ByMonth])
    @Authorized(Role.ADMIN)
    async offeredCoursePlaces(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT "year", "month", SUM("subcourse"."maxParticipants")::INT
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
    async numSubcourses(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month
                                      FROM "subcourse"
                                      WHERE "createdAt" > ${statistics.from}::timestamp
                                        AND "createdAt" < ${statistics.to}::timestamp
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
                to: 14 * 24 * 3600 * 1000,
                value: 0,
                label: '0-14 Tage',
            },
            {
                from: 14 * 24 * 3600 * 1000,
                to: 28 * 24 * 3600 * 1000,
                value: 0,
                label: '14-28 Tage',
            },
            {
                from: 28 * 24 * 3600 * 1000,
                to: 60 * 24 * 3600 * 1000,
                value: 0,
                label: '28-60 Tage',
            },
            {
                from: 60 * 24 * 3600 * 1000,
                to: 120 * 24 * 3600 * 1000,
                value: 0,
                label: '60-120 Tage',
            },
            {
                from: 120 * 24 * 3600 * 1000,
                to: 300 * 24 * 3600 * 1000,
                value: 0,
                label: '120-300 Tage',
            },
            {
                from: 300 * 24 * 3600 * 1000,
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
            where: { match: { some: { AND: [{ createdAt: { gte: new Date(statistics.from) } }, { createdAt: { lt: new Date(statistics.to) } }] } } },
        });
        const matchesTotal = await prisma.match.count({
            where: { AND: [{ createdAt: { gte: new Date(statistics.from) } }, { createdAt: { lt: new Date(statistics.to) } }] },
        });

        return matchesTotal / tuteesWithMatch;
    }

    @FieldResolver((returns) => Float)
    @Authorized(Role.ADMIN)
    async averageMatchesOfTutors(@Root() statistics: Statistics) {
        const tutorsWithMatch = await prisma.student.count({
            where: { match: { some: { AND: [{ createdAt: { gte: new Date(statistics.from) } }, { createdAt: { lt: new Date(statistics.to) } }] } } },
        });
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
    async knowsCoronaSchoolFrom(@Root() statistics: Statistics) {
        return await prisma.$queryRaw`SELECT COUNT(*)::INT                         AS value,
                                             date_part('year', "createdAt"::date)  AS year,
                                             date_part('month', "createdAt"::date) AS month,
                                             "knowsCoronaSchoolFrom"               AS group
                                      FROM "screening"
                                      WHERE "success" = TRUE
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

    @FieldResolver((returns) => Float)
    @Authorized(Role.ADMIN)
    async rateSuccessfulCoCs() {
        const currentDate = new Date(); // Get the current date
        const previousDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 8, currentDate.getDate());

        const successfulScreeningsCount: { value: number }[] = await prisma.$queryRaw`SELECT COUNT(DISTINCT "studentId")::int AS value
            FROM "screening"
            WHERE "success" = true AND "createdAt" >= ${previousDate.toISOString()}::timestamp;
        `;
        const submittedCoCs: { value: number }[] = await prisma.$queryRaw`SELECT COUNT(DISTINCT "studentId")::int AS value
            FROM "certificate_of_conduct"
            WHERE "createdAt" >= ${previousDate.toISOString()}::timestamp;
        `;
        return submittedCoCs[0].value / successfulScreeningsCount[0].value;
    }

    @FieldResolver((returns) => Float)
    @Authorized(Role.ADMIN)
    async rateTutorFirstMatchStillActiveAfterOneMonth(@Root() statistics: Statistics) {
        const now = new Date();
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const students = await prisma.student.findMany({
            where: {
                createdAt: { lte: oneMonthAgo },
                match: { some: {} },
            },
            select: {
                match: true,
            },
        });

        let counterweight = 0; // due to historical reasons we have lost the dissolvedAt date of some (3772) dissolved matches. If we encounter such a match, we should remove the student from the denominator to avoid bias.

        const relevantStudents = students.filter((s) => {
            const firstMatch = s.match.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())[0];
            if (firstMatch.dissolved && firstMatch.dissolvedAt == null) {
                counterweight++;
                return false;
            }
            return (
                (firstMatch.dissolved ? firstMatch.dissolvedAt.getTime() : new Date().getTime()) - firstMatch.createdAt.getTime() >= 30 * 24 * 60 * 60 * 1000
            );
        });

        return relevantStudents.length / (students.length - counterweight);
    }

    @FieldResolver((returns) => Float)
    @Authorized(Role.ADMIN)
    async ratePupilsInTargetAudience(@Root() statistics: Statistics) {
        const numPupils = await prisma.pupil.count({
            where: {
                AND: [{ createdAt: { gte: new Date(statistics.from) } }, { createdAt: { lt: new Date(statistics.to) } }],
            },
        });

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
                dissolveReasonEnum: reason,
                AND: [{ dissolvedAt: { gte: new Date(statistics.from) } }, { dissolvedAt: { lt: new Date(statistics.to) } }],
            },
        });
    }

    @FieldResolver(() => [Bucket])
    @Authorized(Role.ADMIN)
    async matchesByDuration(@Root() statistics: Statistics) {
        const buckets: Bucket[] = [
            {
                from: 0,
                to: 14 * 24 * 3600 * 1000,
                value: 0,
                label: '0-14 Tage',
            },
            {
                from: 14 * 24 * 3600 * 1000,
                to: 28 * 24 * 3600 * 1000,
                value: 0,
                label: '14-28 Tage',
            },
            {
                from: 28 * 24 * 3600 * 1000,
                to: 60 * 24 * 3600 * 1000,
                value: 0,
                label: '28-60 Tage',
            },
            {
                from: 60 * 24 * 3600 * 1000,
                to: 120 * 24 * 3600 * 1000,
                value: 0,
                label: '60-120 Tage',
            },
            {
                from: 120 * 24 * 3600 * 1000,
                to: 300 * 24 * 3600 * 1000,
                value: 0,
                label: '120-300 Tage',
            },
            {
                from: 300 * 24 * 3600 * 1000,
                to: -1,
                value: 0,
                label: '300+ Tage',
            },
        ];

        const matches = await prisma.match.findMany({
            where: {
                dissolved: true,
                AND: [{ dissolvedAt: { gte: new Date(statistics.from) } }, { dissolvedAt: { lt: new Date(statistics.to) } }],
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

    // @FieldResolver(() => [Bucket])
    // @Authorized(Role.ADMIN)
    // async fokusUsedPlaces(@Root() statistics: Statistics) {
    //     let usedPlaces = 0;
    //     const courses = await prisma.lecture.findMany({
    //         where: {
    //             AND: [{ createdAt: { gte: new Date(statistics.from) } }, { createdAt: { lt: new Date(statistics.to) } }],
    //             zoomMeetingReport: {},
    //         },
    //         select: {
    //             id: true,
    //             subcourse: {
    //                 select: {
    //                     subcourse_participants_pupil: { select: { pupilId: true } },
    //                 },
    //             },
    //         },
    //     });
    //     await prisma.bbb_meeting.count({ where: {} });
    // }

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
}
